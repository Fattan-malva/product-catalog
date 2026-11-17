// Regenerates the product catalog block in README.md from the Gumroad API.
// Usage:
//   GUMROAD_ACCESS_TOKEN=... node scripts/sync-gumroad.mjs
//   node scripts/sync-gumroad.mjs --from-json fixture.json   (offline test)
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const README = "README.md";
const START = "<!-- catalog:start -->";
const END = "<!-- catalog:end -->";

// Optional long-form pages in this repo, keyed by the Gumroad URL slug.
// Products not listed here still appear, linking straight to Gumroad.
const DETAIL_PAGES = {
  "shadcn-admin-flutter": "products/flutter-admin-dashboard.md",
  "sql-server-mcp-server": "products/sql-server-mcp-server.md",
  "flutter-express-starter-kit": "products/flutter-express-starter-kit.md",
};

const escape = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ").trim();

async function fetchProducts() {
  const idx = process.argv.indexOf("--from-json");
  if (idx > -1) {
    const data = JSON.parse(await readFile(process.argv[idx + 1], "utf8"));
    return data.products ?? data;
  }
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) throw new Error("GUMROAD_ACCESS_TOKEN is not set");
  const res = await fetch("https://api.gumroad.com/v2/products", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Gumroad API returned ${res.status}`);
  const body = await res.json();
  if (!body.success) throw new Error("Gumroad API reported failure");
  return body.products;
}

function slugOf(p) {
  const url = p.short_url || p.url || "";
  return url.split("/l/")[1]?.split(/[?#]/)[0] ?? "";
}

function render(products) {
  const live = products.filter((p) => p.published !== false);
  const rows = live.map((p, i) => {
    const slug = slugOf(p);
    const page = DETAIL_PAGES[slug];
    const price = p.currency && p.currency !== "usd"
      ? `${(p.price / 100).toFixed(2)} ${p.currency.toUpperCase()}`
      : `$${((p.price_cents ?? p.price) / 100).toFixed(0)}`;
    const buy = `[Get it on Gumroad →](${p.short_url || p.url})`;
    const detail = page ? ` · [Product page](${page})` : "";
    return `<details>\n<summary><strong>${String(i + 1).padStart(2, "0")} · ${escape(p.name)}</strong> — ${price}</summary>\n\n${p.summary ? escape(p.summary) + "\n\n" : ""}${buy}${detail}\n\n</details>`;
  });
  const table = [
    "| | Product | Price |",
    "|---|---|---|",
    ...live.map((p, i) => `| ${String(i + 1).padStart(2, "0")} | [${escape(p.name)}](${p.short_url || p.url}) | ${(p.price_cents ?? p.price) ? "$" + ((p.price_cents ?? p.price) / 100).toFixed(0) : "—"} |`),
  ].join("\n");
  return `${table}\n\n${rows.join("\n\n")}\n\n_Synced from Gumroad on ${new Date().toISOString().slice(0, 10)}. Edit the listing on Gumroad, not this block._`;
}

const products = await fetchProducts();
const block = render(products);
const readme = await readFile(README, "utf8");
const a = readme.indexOf(START);
const b = readme.indexOf(END);
if (a < 0 || b < 0 || b < a) throw new Error(`Markers ${START} / ${END} missing in README.md`);
const next = readme.slice(0, a + START.length) + "\n" + block + "\n" + readme.slice(b);
if (next === readme) {
  console.log("No changes.");
} else {
  await writeFile(README, next);
  console.log(`Updated README.md with ${products.filter((p) => p.published !== false).length} products.`);
}

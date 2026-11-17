<h1 align="center">SQL Server MCP Server for AI Agents</h1>

<p align="center"><strong>Controlled, read-only SQL Server access for MCP-compatible AI agents.</strong></p>

<p align="center">
  <a href="https://fattandevops.gumroad.com/l/sql-server-mcp-server"><strong>Get it on Gumroad — $19 USD →</strong></a>
</p>

---

## At a glance

| | |
|---|---|
| **Price** | $19 USD |
| **Category** | Software & Plugins |
| **Technology** | Node.js 18+, TypeScript, Docker, Microsoft SQL Server, MCP |
| **Deployment** | Self-hosted (Docker Compose or Node.js) |
| **License** | MIT |

<details open>
<summary><strong>Built for safer database access</strong></summary>

- **Read-only:** the agent cannot write, update, or delete records through the provided tools.
- **Default-deny tables:** tables are available only after you allow them for a project.
- **Structured calls:** parameterized tools, not raw SQL from the agent.
- **Audit log:** review every tool call in the admin panel.
- **Rate limiting:** 60 requests per minute per API key by default.
- **Encrypted credentials:** database passwords stored with AES-256-GCM.

</details>

<details>
<summary><strong>Tools and admin features</strong></summary>

- List tables and inspect schemas
- Read records, count records, and filter data
- Manage connections and project-level table permissions
- Create and manage API keys
- Configure OAuth clients (OAuth 2.1 with PKCE and Dynamic Client Registration)
- Test an agent connection in the Agent Test chat

</details>

<details>
<summary><strong>Requirements and limits</strong></summary>

- Node.js 18+ or Docker
- A reachable Microsoft SQL Server database
- A dedicated read-only SQL login is recommended, with SELECT only on the tables you expose
- Hosting, SSL, and a domain are not included
- No write operations, by design
- Review database permissions and network exposure before connecting production data

</details>

<details>
<summary><strong>Who it's for</strong></summary>

Developers and teams building AI assistants that need controlled access to business data such as sales, inventory, and orders.

</details>

---

<p align="center">
  <a href="https://fattandevops.gumroad.com/l/sql-server-mcp-server"><strong>Get it on Gumroad — $19 USD →</strong></a>
</p>

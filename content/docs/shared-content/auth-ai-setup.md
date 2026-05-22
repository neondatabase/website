---
updatedOn: '2026-05-17T10:06:14.681Z'
---

The fastest way to connect your editor to Neon Auth is to run `npx neonctl@latest init` from your project root:

```bash
npx neonctl@latest init
```

This command configures the [Neon MCP server](/docs/ai/neon-mcp-server) and installs **[Agent Skills](/docs/ai/agent-skills)** (`neon-postgres`) in your project. Together they help you set up Neon Auth in two ways:

1. **Configure Neon Auth on your branch (MCP).** After `init`, ask your assistant to enable and configure auth in natural language. The MCP server exposes:
   - `provision_neon_auth`: Enable Neon Auth on a branch
   - `configure_neon_auth`: Set OAuth providers, email, sign-in methods, trusted domains, and more
   - `get_neon_auth_config`: Read the current configuration

   See [Neon MCP Server: Neon Auth tools](/docs/ai/neon-mcp-server#supported-actions-tools) for details.

2. **Add Neon Auth to your application (Agent Skills).** Skills teach your assistant how to install the SDK, environment variables, and routes for your framework. Use the quick start guides on this page, or ask your assistant directly.

**Example prompt:**

```text
Set up Neon Auth for my project. Enable Google OAuth and email/password sign-in,
and set the application name to "My App".
```

You can also enable Neon Auth in the [Neon Console](https://console.neon.tech) (Project → Branch → Auth) and configure settings manually.

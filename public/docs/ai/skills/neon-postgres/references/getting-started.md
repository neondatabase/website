# Getting Started with Neon

Interactive guide for setting up a Neon project and connecting it to code.

## Check Status Quo

Inspect the user's codebase and environment to see if they have already integrated Neon and to better understand their needs and constraints.

Specifically check for:

- Existing database connection code
- Existing Neon MCP server or Neon CLI configuration
- Existence of a `.env` file and `DATABASE_URL` environment variable
- Existing ORM (Prisma, Drizzle, TypeORM) configuration

## Self-Driving Setup With Neon's CLI or MCP Server

You can offer the user to inspect the existing connected Neon projects or create new ones using the Neon CLI or MCP server.

If the MCP server and CLI aren't set up yet, ask the user for permission to run:

```bash
npx neonctl@latest init
```

This will install the Neon VSCode extension (if applicable) and the Neon MCP server and `neon-postgres` agent skill. Alternatively, you can offer to install the Neon CLI. Install instructions here: https://neon.com/docs/reference/cli-install.md

Either CLI or MCP server can be used to manage Neon projects and databases on the user's behalf. If the user prefers to manually get started with Neon, then you can guide them through the setup process instead of using the CLI or MCP server directly. See `devtools.md` for details.

Since the Neon CLI and MCP server do interact with database resources, it's important to verify the user is comfortable with the security implications of running these tools.

## Setup Flow

### 1. Select Organization and Project

- Check existing organizations and projects (via MCP server or CLI or manually by the user)
- **1 organization**: default to it
- **Multiple organizations**: list all and ask which to use
- **No projects**: ask if they want to create a new project
- **1 project**: ask "Would you like to use '{project_name}' or create a new one?"
- **Multiple projects (<6)**: list all and let them choose
- **Many projects (6+)**: list recent projects, offer to create new or specify by name/ID

### 2. Get Connection String

- Use MCP server or CLI to get the connection string
- Store it in `.env` as `DATABASE_URL`:

```
DATABASE_URL=postgresql://user:password@host/database
```

**Before modifying `.env`:**

1. Try to read the `.env` file first
2. If readable: use search/replace to update or append `DATABASE_URL`
3. If unreadable (permissions): use append command or show the line to add manually
4. Never overwrite an existing `.env` — always append or update in place

### 3. Pick Connection Method & Pick Driver

Refer to `connection-methods.md` to pick the correct connection method and driver based on your deployment platform.

#### 3.1. User Authentication with Neon Auth (if needed)

Skip for CLI tools, scripts, or apps without user accounts.

If the app needs auth: use MCP server `provision_neon_auth` tool, then see `neon-auth.md` for setup. For auth + database queries, see `neon-js.md`.

#### 3.2. ORM Setup (optional)

Check for existing ORM (Prisma, Drizzle, TypeORM). If none, ask if they want one. For Drizzle integration, see `neon-drizzle.md`.

### 6. Schema Setup

- Check for existing migration files or ORM schemas
- If none: offer to create an example schema or design one together

## What's Next

After setup is complete, offer to help with:

- Neon-specific features (branching, autoscaling, scale-to-zero)
- Connection pooling for production
- Writing queries or building API endpoints
- Database migrations and schema changes
- Performance optimization

## Resume Support

If the user says "Continue with Neon setup", check what's already configured:

- MCP server connection
- `.env` file with `DATABASE_URL`
- Dependencies installed
- Schema created

Then resume from where they left off.

## Security Reminders

- Never commit connection strings to version control
- Use environment variables for all credentials
- Prefer SSL connections (default in Neon)
- Use least-privilege database roles
- Rotate API keys and passwords regularly

## Documentation

| Topic              | URL                                                   |
| ------------------ | ----------------------------------------------------- |
| Getting Started    | https://neon.com/docs/get-started/signing-up.md       |
| Connecting to Neon | https://neon.com/docs/connect/connect-intro.md        |
| Connection String  | https://neon.com/docs/connect/connect-from-any-app.md |
| Frameworks Guide   | https://neon.com/docs/get-started/frameworks.md       |
| ORMs Guide         | https://neon.com/docs/get-started/orms.md             |
| VSCode Extension   | https://neon.com/docs/local/vscode-extension.md       |
| MCP Server         | https://neon.com/docs/ai/neon-mcp-server.md           |

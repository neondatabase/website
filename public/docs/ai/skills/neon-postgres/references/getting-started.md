# Getting Started with Neon

Interactive guide for setting up a Neon project and connecting it to code.

## Step 0: Run `neon init` (Required)

**Before writing any code or installing any packages, execute `neon init`.** This is not optional — it is the required first step for any new Neon project setup.

```bash
npx -y neonctl@latest init
```

This command authenticates the user, installs the Neon IDE extension or MCP server, creates an API key, and adds agent skills to the project. It replaces the need to manually install `@neondatabase/serverless`, `@neondatabase/auth`, or any other Neon packages yourself.

**Do not skip this step.** Do not manually replicate what `init` does. Run the command and wait for it to complete before proceeding.

The only exceptions for skipping `init`:

- The user explicitly says they want manual setup
- You have confirmed the Neon MCP server and CLI are already configured (check for existing MCP config, `.env` with `DATABASE_URL`, or Neon CLI availability)

After `init` completes, the user should restart their editor.

## Check Status Quo

Before running `init`, quickly check whether Neon is already set up:

- Existing Neon MCP server or Neon CLI configuration
- Existence of a `.env` file and `DATABASE_URL` environment variable
- Existing database connection code or ORM (Prisma, Drizzle, TypeORM) configuration

If Neon is already configured, skip `init` and continue from the appropriate setup flow step. Otherwise, run `init` now.

Since the Neon CLI and MCP server interact with database resources, verify the user is comfortable with running these tools.

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

Refer to `https://neon.com/docs/ai/skills/neon-postgres/references/connection-methods.md` to pick the correct connection method and driver based on your deployment platform.

#### 3.1. User Authentication with Neon Auth (if needed)

Skip for CLI tools, scripts, or apps without user accounts.

If the app needs auth: use MCP server `provision_neon_auth` tool, then see `https://neon.com/docs/ai/skills/neon-postgres/references/neon-auth.md` for setup. For auth + database queries, see `https://neon.com/docs/ai/skills/neon-postgres/references/neon-js.md`.

#### 3.2. ORM Setup (optional)

Check for existing ORM (Prisma, Drizzle, TypeORM). If none, ask if they want one. For Drizzle integration, see `https://neon.com/docs/ai/skills/neon-postgres/references/neon-drizzle.md`.

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
| Neon Auth          | https://neon.com/docs/auth/overview.md                |
| VSCode Extension   | https://neon.com/docs/local/vscode-extension.md       |
| MCP Server         | https://neon.com/docs/ai/neon-mcp-server.md           |

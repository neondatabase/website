# Neon CLI

The Neon CLI is a command-line interface for managing Neon Serverless Postgres directly from your terminal. It provides the same capabilities as the Neon Platform API and is ideal for scripting, CI/CD pipelines, and developers who prefer terminal workflows.

## Installation

**macOS (Homebrew):**

```bash
brew install neonctl
```

**npm (cross-platform):**

```bash
npm install -g neon
```

## Authentication

Authenticate with your Neon account:

```bash
neon auth
```

This opens a browser for OAuth authentication and stores credentials locally.

For CI/CD or non-interactive environments, use an API key:

```bash
export NEON_API_KEY=your-api-key
```

Get your API key from: https://console.neon.tech/app/settings/api-keys

## Common Commands

### Project Management

```bash
# List all projects (org-scoped)
neon projects list --org-id <org-id>

# Create a new project
neon projects create --name my-project --org-id <org-id>

# Get project details
neon projects get <project-id>

# Delete a project
neon projects delete <project-id>
```

### Branch Operations

```bash
# List branches
neon branches list --project-id <project-id>

# Create a branch
neon branches create --project-id <project-id> --name dev

# Delete a branch
neon branches delete <branch-id> --project-id <project-id>
```

### Connection Strings

```bash
# Get connection string
neon connection-string --project-id <project-id>

# Get connection string for specific branch
neon connection-string <branch-id-or-name> --project-id <project-id>

# Get pooled connection string
neon connection-string --project-id <project-id> --pooled
```

### SQL Execution

```bash
# Run SQL query
neon psql <branch> -- -c "SELECT * FROM users LIMIT 10"

# Run SQL from file
neon psql <branch> -- -f schema.sql
```

### Database Management

```bash
# List databases
neon databases list --project-id <project-id> --branch <branch-id-or-name>

# Create database
neon databases create --project-id <project-id> --name mydb

# List roles
neon roles list --project-id <project-id> --branch <branch-id-or-name>
```

## Output Formats

The CLI supports multiple output formats:

```bash
# JSON output (default for scripting)
neon projects list --output json

# Table output (human-readable)
neon projects list --output table

# YAML output
neon projects list --output yaml
```

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
- name: Create preview branch
  env:
    NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
  run: |
    neon branches create \
      --project-id ${{ vars.NEON_PROJECT_ID }} \
      --name preview-${{ github.event.pull_request.number }}
```

## CLI vs MCP Server vs SDKs

| Tool           | Best For                                          |
| -------------- | ------------------------------------------------- |
| Neon CLI       | Terminal workflows, scripts, CI/CD pipelines      |
| MCP Server     | AI-assisted development with Claude, Cursor, etc. |
| TypeScript SDK | Programmatic access in Node.js/TypeScript apps    |
| Python SDK     | Programmatic access in Python applications        |
| REST API       | Direct HTTP integration in any language           |

## Documentation Resources

| Topic          | URL                                             |
| -------------- | ----------------------------------------------- |
| CLI Reference  | https://neon.com/docs/cli.md                     |
| CLI Install    | https://neon.com/docs/cli/install.md             |
| CLI Auth       | https://neon.com/docs/cli/auth.md                |
| CLI Projects   | https://neon.com/docs/cli/projects.md            |
| CLI Branches   | https://neon.com/docs/cli/branches.md            |
| CLI Connection | https://neon.com/docs/cli/connection-string.md   |

See the [full CLI docs](https://neon.com/docs/cli.md) for the complete command reference.

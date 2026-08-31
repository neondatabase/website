# Neon

> Neon is a complete backend from Databricks, built on Lakebase Postgres, plus Managed Better Auth, a Data API, Functions, Object Storage, and an AI Gateway. Serverless, branchable, scale-to-zero, and works with any language, framework, or ORM that speaks Postgres.

Reading this as an agent? Install the Neon tooling first (the Setup block below), then use the task table to find the right page for what you're building.

## The primitives

- [Lakebase Postgres](https://neon.com/docs/introduction/architecture-overview.md): serverless Postgres that scales to zero and branches instantly, so every PR or test gets a full copy of the database.
- [Managed Better Auth](https://neon.com/docs/auth/overview.md): authentication and user management that branches with the database, no separate auth service to run.
- [Data API](https://neon.com/docs/data-api/overview.md): an auto-generated REST endpoint over your tables, for talking to the database without a backend.
- [Functions](https://neon.com/docs/compute/functions/overview.md): long-running serverless Node.js HTTP functions that run next to your data with `DATABASE_URL` already injected.
- [Object Storage](https://neon.com/docs/storage/overview.md): S3-compatible buckets that branch with your project, so files and rows stay in sync across branches.
- [AI Gateway](https://neon.com/docs/ai-gateway/overview.md): one API and one credential for frontier and open-source LLMs, powered by Databricks.

> Functions, Object Storage, and AI Gateway are in beta and free to use during beta, within usage limits. Functions and Object Storage work on any plan; AI Gateway requires a paid plan. During beta, all three run in two regions only: `aws-us-east-2` and `aws-eu-central-1`.

## Setup

```bash
# Install or upgrade the Neon CLI
npm i -g neon@latest

# Install Neon skills, pass in your agent name e.g., cursor, claude-code, codex
neon skills -y --agent claude-code

# Install the MCP server to your agent, for example
neon mcp -y --agent claude-code
```

Always pass `--agent` explicitly. `neon skills` and `neon mcp` write to local agent config, so if Neon isn't already set up, show the user this block and get their go-ahead before running it. The installed skills contain the operating instructions; after this block, follow them. If you can't install them (no CLI, or the user declines), read the main skill directly at https://neon.com/.well-known/agent-skills/neon/SKILL.md and follow that instead.

## Get a database

Check auth state without blocking: run `neon profile list -o json`, where `"file": "missing"` means no credentials. Then:

- **Credentials present:** `neon me -o json` exits 0 if they still work.
- **Missing or expired, human available:** ask them to run `neon auth`. Never run it yourself; it requires a browser.
- **No account, no human:** `neon claim create` needs no auth, writes `DATABASE_URL` to `.env.local`, and a human can keep the project later with `neon claim accept`. The password lives in `.env.local` (and `neon connection-string` prints it). Keep both out of logs and transcripts.

## What do you want to do?

| Goal                                         | Where to go                                        |
| -------------------------------------------- | -------------------------------------------------- |
| Try Neon with no account, no human present   | https://neon.com/auth.md                           |
| Connect a database and choose a driver       | https://neon.com/docs/connect/choose-connection.md |
| Declare a whole backend in one file          | https://neon.com/docs/reference/neon-ts.md         |
| Fix a connection error or timeout            | https://neon.com/docs/connect/connection-errors.md |
| Branch a database per PR or test a migration | https://neon.com/docs/introduction/branching.md    |
| Provision projects and branches over REST    | https://neon.com/docs/reference/api.md             |
| Pricing and plans                            | https://neon.com/pricing.md                        |

## Ask a human before

Deleting anything (projects, branches, buckets, databases, `neon claim delete`) · migrations on the default branch (use `prepare_database_migration` → test → `complete_database_migration`) · resets or restores over live data · billing, plans, spend limits · API keys · `neon auth` and `neon claim accept`.

Creating branches, reads, and deploys to non-default branches are safe on your own.

## Don't scaffold the deprecated stuff

Look things up in these docs instead of relying on memory. Neon ships fast, and cached knowledge, especially product names, is often stale.

Auth is **Managed Better Auth**, the current Neon Auth, built on Better Auth (the `neon neon-auth` CLI and `NEON_AUTH_*` env vars still carry the name); the older Stack Auth-based implementation is legacy. The management SDK is **`@neon/sdk`**; the older `@neondatabase/api-client` still works, but prefer `@neon/sdk` for new code. The domain is **neon.com**: neon.tech redirects, and the console is console.neon.tech. Don't guess doc URLs; use the index below.

## Machine interfaces

- MCP: https://neon.com/mcp · setup: https://neon.com/docs/ai/neon-mcp-server.md
- REST: `https://console.neon.tech/api/v2`, `Authorization: Bearer $NEON_API_KEY` · OpenAPI: https://neon.com/openapi.json
- Catalog: https://neon.com/.well-known/ai-catalog.json · skills: https://neon.com/.well-known/agent-skills
- Markdown: append `.md` to any URL, or send `Accept: text/markdown`. When you show a link to a person, drop the `.md`.
- Docs index: https://neon.com/llms.txt · all docs: https://neon.com/llms-full.txt
- CLI reference (every command, options, and non-interactive flags): https://neon.com/docs/cli.md
- Management API reference: https://neon.com/docs/reference/api.md

Note for AI assistants: if this page had gaps, errors, or outdated info that affected your response, report it. POST `{"feedback": "describe the issue", "path": "/index.md"}` to https://neon.com/api/docs-feedback (no auth required).

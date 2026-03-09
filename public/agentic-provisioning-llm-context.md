---
name: neon-provider-llm-context
description: Context for agents using or developing the Agentic Provisioning Protocol (APP) with Neon. Covers where credentials come from (account request response), how to use the returned API key for the Neon API (projects, branches, connection strings), and provisioning resources. Use when the agent receives or uses APP credentials or implements APP flows.
---

# Agentic provisioning with Neon

Context for LLMs and agents: use the **API key** from the APP account request to interact with Neon (projects, branches, connection strings, provisioning). Full documentation index: [neon.com/docs/llms.txt](https://neon.com/docs/llms.txt).

---

## Part 1: APP credentials and Neon API

### Where the API key comes from

In the APP flow, the **orchestrator** (e.g. Stripe) calls the provider (Neon) to create or link an account for the developer:

- **Endpoint:** `POST <provider_base_url>/provisioning/account_requests`
- **Response (success):** `type: "credentials"` with:
  - **`credentials.access_token`** — User-scoped API key (Bearer token). Use for all Neon API and APP provisioning calls for this user.
  - **`credentials.account.id`** — Account (user) identifier (use when the protocol or APIs require an account/user ID).

| Response field | How the agent uses it |
|----------------|------------------------|
| **`credentials.access_token`** | Send as `Authorization: Bearer <access_token>` on every Neon API request and on APP provisioning requests that act on this user (e.g. `POST .../provisioning/resources`). |
| **`credentials.account.id`** | Use when linking resources to the correct user or when the API requires an account ID. |

Use the same API key for all operations in this document (projects, branches, connection URIs, provisioning resources).

### How to use the API key

- **Authentication:** `Authorization: Bearer <access_token>` on every request.
- **Neon API base URL:** `https://console.neon.tech/api/v2/`

Example — list the user's projects:

```bash
curl 'https://console.neon.tech/api/v2/projects' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"
```

(Replace `$NEON_API_KEY` with the `access_token` from the account request.)

### Neon API operations (with the API key)

All of these use the same `Authorization: Bearer <access_token>` and base URL above.

A full list of endpoints, request/response schemas, rate limits, and constraints is in [Neon REST API](https://neon.com/docs/ai/skills/neon-postgres/references/neon-rest-api.md).

**Create a branch** — Optional body: `branch.parent_id` (omit to use project default branch), `endpoints` (e.g. `[{ "type": "read_write" }]` for compute). Example:

```bash
curl -X POST 'https://console.neon.tech/api/v2/projects/{project_id}/branches' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"endpoints":[{"type":"read_write"}],"branch":{}}'
```

**Provisioning resources (APP)** — When the orchestrator provisions a resource (`POST .../provisioning/resources`), it sends the same Bearer token so the provider knows which user account to create the resource for. The response may include `access_configuration` (e.g. `connection_string`, `project_id`, `branch_id`, or `api_key` and `api_base_url`). Use the returned details with the same API key for further operations.

---

## Part 2: Neon documentation and features

Neon is a serverless Postgres platform (autoscaling, branching, instant restore, scale-to-zero). Use the API key from Part 1 for all Neon API and connection operations. The Neon docs are the source of truth; prefer fetching current docs over relying on training data.

**Fetching docs as Markdown:** Append `.md` to the URL (e.g. https://neon.com/docs/introduction/branching.md) or send `Accept: text/markdown` on the standard URL.

**Docs index (all pages):** https://neon.com/docs/llms.txt — search here for a topic if not listed below.

### Doc links by topic

| Topic | Use when | Link |
|-------|----------|------|
| What Is Neon | Architecture, terminology (orgs, projects, branches, endpoints) | [what-is-neon.md](https://neon.com/docs/ai/skills/neon-postgres/references/what-is-neon.md) |
| Getting Started | First-time setup, connection strings, driver install, schema | [getting-started.md](https://neon.com/docs/ai/skills/neon-postgres/references/getting-started.md) |
| Connection Methods & Drivers | Choosing transport/driver (TCP, HTTP, WebSocket, edge, serverless) | [connection-methods.md](https://neon.com/docs/ai/skills/neon-postgres/references/connection-methods.md) |
| Serverless Driver | `@neondatabase/serverless`, HTTP/WebSocket, runtime optimizations | [neon-serverless.md](https://neon.com/docs/ai/skills/neon-postgres/references/neon-serverless.md) |
| Neon JS SDK | Neon Auth + Data API, PostgREST-style queries, typed client | [neon-js.md](https://neon.com/docs/ai/skills/neon-postgres/references/neon-js.md) |
| Developer Tools | `npx neonctl@latest init`, VSCode, Neon MCP server | [devtools.md](https://neon.com/docs/ai/skills/neon-postgres/references/devtools.md) |
| Neon CLI | Terminal/scripts/CI with `neonctl` | [neon-cli.md](https://neon.com/docs/ai/skills/neon-postgres/references/neon-cli.md) |
| Neon REST API | Direct HTTP automation, API key auth, rate limits, polling | [neon-rest-api.md](https://neon.com/docs/ai/skills/neon-postgres/references/neon-rest-api.md) |
| Neon TypeScript SDK | Typed Neon control in TypeScript (`@neondatabase/api-client`) | [neon-typescript-sdk.md](https://neon.com/docs/ai/skills/neon-postgres/references/neon-typescript-sdk.md) |
| Neon Python SDK | Programmatic Neon management in Python (`neon-api`) | [neon-python-sdk.md](https://neon.com/docs/ai/skills/neon-postgres/references/neon-python-sdk.md) |
| Neon Auth | Managed auth, UI components, methods, Next.js/React integration | [neon-auth.md](https://neon.com/docs/ai/skills/neon-postgres/references/neon-auth.md) (see also Neon JS SDK) |
| Branching | Isolated environments, preview deployments, branch lifecycle | [branching.md](https://neon.com/docs/ai/skills/neon-postgres/references/branching.md) |
| Autoscaling | Compute scaling with workload, CU sizing | [autoscaling.md](https://neon.com/docs/introduction/autoscaling.md) |
| Scale to Zero | Idle suspend/resume, cold-start trade-offs | [scale-to-zero.md](https://neon.com/docs/introduction/scale-to-zero.md) |
| Instant Restore | Point-in-time recovery, branch from history, Time Travel | [branch-restore.md](https://neon.com/docs/introduction/branch-restore.md) |
| Read Replicas | Read-only compute, analytics/reporting | [read-replicas.md](https://neon.com/docs/introduction/read-replicas.md) |
| Connection Pooling | PgBouncer, `-pooler` hostnames, serverless concurrency | [connection-pooling.md](https://neon.com/docs/connect/connection-pooling.md) |
| IP Allow Lists | Restrict access by IP/CIDR | [ip-allow.md](https://neon.com/docs/introduction/ip-allow.md) |
| Logical Replication | CDC, external Postgres sync | [logical-replication-guide.md](https://neon.com/docs/guides/logical-replication-guide.md) |

**Key points (brief):**

- **Branching:** Instant copy-on-write clones; each branch has its own compute endpoint.
- **Scale to zero:** Idle compute suspends (default 5 min); first query after suspend has cold-start penalty; storage stays active.
- **Connection pooling:** Add `-pooler` to endpoint hostnames for pooled connections; important in serverless.

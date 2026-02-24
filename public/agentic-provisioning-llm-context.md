# Agentic provisioning LLM context

> Context for AI agents and LLMs that provision or manage Neon Postgres resources. Full documentation index: [https://neon.com/docs/llms.txt](https://neon.com/docs/llms.txt) (also [https://neon.com/llms.txt](https://neon.com/llms.txt)).

## What this is

Neon is serverless Postgres. This page gives agents and LLMs minimal context for **agentic provisioning**: creating and managing Neon projects, branches, and databases programmatically (e.g., for AI agent platforms, codegen tools, or per-user backends).

## Why Neon for agentic provisioning

- **Instant provisioning**: Create a Postgres project/database in about one second via API.
- **API-first**: Projects, branches, databases, roles, and compute are managed via the [Neon API](https://api-docs.neon.tech).
- **Autoscaling and scale-to-zero**: Compute scales with load; idle databases can suspend and resume without re-provisioning.
- **Branching and snapshots**: Copy-on-write storage supports branches and point-in-time restore for versioning and experimentation.

## Key resources

| Purpose | URL |
|--------|-----|
| Full doc index (all Markdown URLs) | [https://neon.com/docs/llms.txt](https://neon.com/docs/llms.txt) |
| Agent plan (for platforms provisioning many DBs) | [https://neon.com/docs/introduction/agent-plan.md](https://neon.com/docs/introduction/agent-plan.md) |
| AI agent integration (provisioning, quotas, versioning) | [https://neon.com/docs/guides/ai-agent-integration.md](https://neon.com/docs/guides/ai-agent-integration.md) |
| Platform integration overview | [https://neon.com/docs/guides/platform-integration-overview.md](https://neon.com/docs/guides/platform-integration-overview.md) |
| Neon API reference | [https://api-docs.neon.tech](https://api-docs.neon.tech) |
| Claimable Postgres (no-auth provisioning) | [https://neon.com/docs/reference/claimable-postgres.md](https://neon.com/docs/reference/claimable-postgres.md) |

## Getting more detail

- For a single doc page as Markdown: use the same path as the HTML URL with `.md` (e.g. `https://neon.com/docs/guides/ai-agent-integration.md`) or send `Accept: text/markdown`.
- For the full list of docs: fetch [https://neon.com/docs/llms.txt](https://neon.com/docs/llms.txt).

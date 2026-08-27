---
updatedOn: '2026-08-24T20:23:46.738Z'
---

## Available tools

Tools are grouped into categories. Use the `?category=` URL parameter to restrict which categories are active. You can pass it more than once to enable multiple categories.

| Category                          | What it enables                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| Project management (`projects`)   | List, create, describe, and delete projects and organizations                       |
| Branch management (`branches`)    | Create, reset, and delete branches; manage Postgres roles and databases             |
| Compute endpoints (`endpoints`)   | List, create, start, suspend, and restart branch computes                           |
| Snapshots (`snapshots`)           | Create, restore, and schedule snapshots                                             |
| Schema (`schema`)                 | Inspect tables and columns; compare schemas; run migrations on a temporary branch   |
| SQL (`querying`)                  | Execute queries and transactions; run the same diagnostics as `neon inspect db`     |
| Managed Better Auth (`neon_auth`) | Provision Auth; manage OAuth providers, trusted domains, and users                  |
| Neon Data API (`data_api`)        | Enable, update, and disable the Data API for a branch                               |
| Observability (`observability`)   | Query logs from your serverless functions and storage                               |
| Documentation (`docs`)            | Look up Neon documentation from within your assistant (no OAuth required)           |
| Functions (`functions`)           | List, deploy, update, and delete Neon Functions                                     |
| Object storage (`storage`)        | Manage buckets and objects; create presigned URLs                                   |

Search and navigation tools (search across projects, fetch resource details by ID) are available by default but disabled in [project-scoped mode](/docs/ai/neon-mcp-server#project-scoped-mode).

Schema tools accept schema-qualified table names, such as `crm.contacts`. An unqualified name resolves against the database `search_path`, which defaults to the `public` schema.

The `querying` category includes `inspect_database`, which runs the same 15 read-only checks as [`neon inspect db`](/docs/cli/inspect): relation and index sizes, unused indexes, sequential scans, active queries and locks, stalled queries running longer than 30 seconds, heavy and frequent statements, cache hit rate and working set, autovacuum and bloat, and replication state. Some checks need [`pg_stat_statements`](/docs/extensions/pg_stat_statements) or the [`neon`](/docs/extensions/neon) extension; the tool asks before suggesting `CREATE EXTENSION`.

<Admonition type="note">
The `observability` tools query [Neon Functions logs](/docs/compute/functions/logs) and [object storage logs](/docs/storage/logs), which are part of the Neon backend beta, currently available in AWS `us-east-2` only. Log querying returns results only for projects in a supported region. Database diagnostics via `inspect_database` are under `querying`, not `observability`.
</Admonition>

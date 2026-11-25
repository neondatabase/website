---
updatedOn: '2026-11-25T05:19:14.187Z'
---

## Available tools

Tools are grouped into categories. Use the `?category=` URL parameter to restrict which categories are active. You can pass it more than once to enable multiple categories.

| Category                          | What it enables                                                                                                                                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project management (`projects`)   | List, create, describe, and delete projects; count projects; get project and branch consumption; list organizations                                                                                                   |
| Branch management (`branches`)    | Create, reset, and delete branches; manage Postgres roles and databases                                                                                                                                               |
| Compute endpoints (`endpoints`)   | List, create, start, suspend, and restart branch computes                                                                                                                                                             |
| Snapshots (`snapshots`)           | Create, restore, and schedule snapshots                                                                                                                                                                               |
| Schema (`schema`)                 | Inspect tables and columns; compare schemas                                                                                                                                                                           |
| SQL (`querying`)                  | Execute queries and transactions; apply schema changes on a temporary branch; run the same diagnostics as `neon inspect db`                                                                                           |
| Managed Better Auth (`neon_auth`) | Provision Auth; configure branch settings (localhost access, email and password, email provider, plugins, webhooks); manage OAuth providers, the OAuth provider plugin and its clients, trusted domains, and users    |
| Neon Data API (`data_api`)        | Enable, update, and disable the Data API for a branch                                                                                                                                                                 |
| Observability (`observability`)   | Query function and storage logs, with structured filters or LogQL; check AI Gateway availability                                                                                                                      |
| Documentation (`docs`)            | Search and read Neon docs, the API reference, guides, the PostgreSQL tutorial, the blog, and the changelog from within your assistant; find Neon API endpoints and their fields with `search_api` (no OAuth required) |
| Functions (`functions`)           | List, deploy, update, and delete Neon Functions                                                                                                                                                                       |
| Object storage (`storage`)        | Manage buckets and objects; create presigned URLs                                                                                                                                                                     |
| Realtime (`realtime`)             | Enable and disable Realtime for a branch; get and rotate its secret                                                                                                                                                   |

Search and navigation tools (search across projects, fetch resource details by ID) are available by default but disabled in [project-scoped mode](/docs/ai/neon-mcp-server#project-scoped-mode).

`list_incidents` is available on every connection, including read-only, project-scoped, and the docs-only endpoint. It returns open incidents and maintenance from [neonstatus.com](https://neonstatus.com), so your assistant can tell a Neon outage from a problem in your own setup. It needs no credentials.

`call_api` sends one request to any [Neon API](/docs/reference/api) route, for operations no other tool covers. Your assistant finds the endpoint and its path, query, and body fields with `search_api` first. `call_api` is listed only on a connection with every category, every project, and no pinned Postgres role, in write mode, with `secrets` set to `setup` or `all`. With the default `secrets=setup`, it refuses paths under `/auth/`, because Neon Auth routes return stored secrets; the Managed Better Auth tools cover those.

Schema tools accept schema-qualified table names, such as `crm.contacts`. An unqualified name resolves against the database `search_path`, which defaults to the `public` schema.

<Admonition type="note">
The `observability` tools query [Neon Functions logs](/docs/compute/functions/logs) and [object storage logs](/docs/storage/logs), which are part of the Neon backend, currently available in AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). Support is expanding toward [all regions](/docs/introduction/regions). Log querying returns results only for projects in a supported region. Database diagnostics via `inspect_database` are under `querying`, not `observability`.
</Admonition>

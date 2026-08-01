---
updatedOn: '2026-07-30T20:15:35.210Z'
---

## Available tools

Tools are grouped into categories. Use the `?category=` URL parameter to restrict which categories are active. You can pass it more than once to enable multiple categories.

| Category                          | What it enables                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| Project management (`projects`)   | List, create, describe, and delete projects and organizations                       |
| Branch management (`branches`)    | Create branches, compare schemas, reset branches to parent state                    |
| Schema (`schema`)                 | Inspect tables and columns; run schema changes via a safe temporary branch workflow |
| SQL (`querying`)                  | Execute queries and transactions; inspect database structure                        |
| Managed Better Auth (`neon_auth`) | Set up and configure app authentication for a branch                                |
| Neon Data API (`data_api`)        | Enable HTTP-based Data API access for a branch                                      |
| Observability (`observability`)   | Query logs from your serverless functions and storage                               |
| Documentation (`docs`)            | Look up Neon documentation from within your assistant (no OAuth required)           |

Search and navigation tools (search across projects, fetch resource details by ID) are available by default but disabled in [project-scoped mode](/docs/ai/neon-mcp-server#project-scoped-mode).

Schema tools accept schema-qualified table names, such as `crm.contacts`. An unqualified name resolves against the database `search_path`, which defaults to the `public` schema.

<Admonition type="note">
The `observability` tools query [Neon Functions logs](/docs/compute/functions/logs) and [object storage logs](/docs/storage/logs), which are part of the Neon backend beta, currently available in AWS `us-east-2` only. Log querying returns results only for projects in a supported region.
</Admonition>

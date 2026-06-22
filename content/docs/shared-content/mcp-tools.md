---
updatedOn: '2026-06-19T23:17:10.824Z'
---

## Available tools

Tools are grouped into categories. Use the `?category=` URL parameter to restrict which categories are active. You can pass it more than once to enable multiple categories.

| Category                        | What it enables                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| Project management (`projects`) | List, create, describe, and delete projects and organizations                       |
| Branch management (`branches`)  | Create branches, compare schemas, reset branches to parent state                    |
| Schema (`schema`)               | Inspect tables and columns; run schema changes via a safe temporary branch workflow |
| SQL (`querying`)                | Execute queries and transactions; inspect database structure                        |
| Neon Auth (`neon_auth`)         | Set up and configure app authentication for a branch                                |
| Neon Data API (`data_api`)      | Enable HTTP-based Data API access for a branch                                      |
| Documentation (`docs`)          | Look up Neon documentation from within your assistant (no OAuth required)           |

Search and navigation tools (search across projects, fetch resource details by ID) are available by default but disabled in [project-scoped mode](/docs/ai/neon-mcp-server#project-scoped-mode).

Neon API keys authenticate all REST API requests. Each key has a scope that limits what it can access — use the narrowest scope that fits your use case.

| Scope          | Access                                               |
| -------------- | ---------------------------------------------------- |
| Personal       | All projects you're a member of across organizations |
| Organization   | All projects in an org (admin-level)                 |
| Project-scoped | A single project                                     |

Keys are shown once at creation. Store them immediately; Neon cannot retrieve them later. Revoking a key takes effect immediately.

The [Neon CLI](/docs/reference/cli-auth) also supports OAuth-based authentication via `neon auth`, which opens a browser to authorize access without requiring a manually created key.

See [Manage API keys](/docs/manage/api-keys) for rotation strategy and org key management.

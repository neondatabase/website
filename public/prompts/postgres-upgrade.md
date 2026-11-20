Help me upgrade a Neon project to a newer major Postgres version:

1. Set up Neon for this agent: fetch https://neon.com/prompts/agent-setup.md and follow it.
2. Ask me which project to upgrade and which version to move to, unless I've already said. Suggest Postgres 19, the newest version Neon supports.
3. Check whether the project has branches besides its default branch, or uses Neon services besides Postgres. Run `neon branches list` and `neon status`, and check each service: `neon functions list` for Neon Functions, `neon buckets list` for Object Storage, `neon neon-auth status` for Managed Better Auth, and `neon data-api get` for the Data API. Ask me about Realtime and AI Gateway if you can't tell. `pg_dump` copies only the Postgres data on one branch, so none of these move with it. If the project uses any of them, list what I'll need to set up again in the new project and wait for my go-ahead.
4. Check that every extension installed in the current project is available on the target version, using https://neon.com/docs/extensions/pg-extensions.md. Tell me about any that aren't before you continue.
5. Check the size of each database. If the total is more than 10 GB, or the database takes writes that can't pause during the copy, don't copy anything yet. Explain how long the copy could take, the disk space it needs, and that the data you pull out counts toward network transfer. Then propose a plan, such as a parallel `pg_dump` and `pg_restore` (`-Fd -j`) run from a machine in the same region as the project, or logical replication (https://neon.com/docs/guides/logical-replication-neon-to-neon.md) for little downtime. Wait for my approval before you start.
6. Check that `pg_dump` and `pg_restore` are the target version or newer. An older `pg_restore` refuses to restore into a newer server. If they're older and Docker is running, use the official `postgres:<target version>` image to run them. Otherwise, tell me how to get them (for example, Postgres.app on macOS or the PostgreSQL apt or yum repositories on Linux) and stop.
7. Create a new Neon project on the target version in the same region as the current one, and create the same roles in it.
8. Copy each database to the new project with `pg_dump` and `pg_restore` over unpooled connection strings. Don't change the current project. `permission denied to change default privileges` errors for the `cloud_admin` role are expected and safe to ignore. Treat any other error as a failure.
9. Prove it worked: compare the row count of every table in both projects and show me the results.
10. Tell me how to get the new project's connection string so I can switch my app over. Don't print passwords or other secrets.

For details on each step, see https://neon.com/docs/postgresql/postgres-upgrade.md.

Help me upgrade a Neon project to a newer major Postgres version:

1. Set up Neon for this agent: fetch https://neon.com/prompts/agent-setup.md and follow it.
2. Ask me which project to upgrade and which version to move to, unless I've already said. Suggest Postgres 19, the newest version Neon supports.
3. Check that the `pg_dump` and `pg_restore` programs for the target version are installed. If they aren't, tell me how to install them and stop.
4. Check that every extension installed in the current project is available on the target version, using https://neon.com/docs/extensions/pg-extensions.md. Tell me about any that aren't before you continue.
5. Create a new Neon project on the target version in the same region as the current one, and create the same roles in it.
6. Copy each database to the new project with `pg_dump` and `pg_restore` over unpooled connection strings. Don't change the current project.
7. Prove it worked: compare the row count of every table in both projects and show me the results.
8. Tell me how to get the new project's connection string so I can switch my app over. Don't print passwords or other secrets.

For details on each step, see https://neon.com/docs/postgresql/postgres-upgrade.md.

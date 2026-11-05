Reset my development branch from its parent so I can re-run migrations against a clean, parent-aligned state.

1. Reset the child branch to the latest schema and data from its parent, keeping the pre-reset state as a backup branch:
   ```bash
   neon branches reset <dev-branch> --parent --preserve-under-name <dev-branch>-backup
   ```
2. Re-run my Drizzle migration against the freshly reset branch with `npx drizzle-kit migrate`, using its direct (unpooled) connection string.
3. Tell me what to know before I rely on this:
   - Only child branches can be reset. Root branches and schema-only branches cannot.
   - The reset is a full overwrite, not a merge, so any local changes on the dev branch are lost. The backup branch from `--preserve-under-name` is your rollback.
   - Connection details do not change, but active connections are briefly interrupted during the reset.

Reference: https://neon.com/docs/guides/reset-from-parent.md and the branching guidance in the neon-postgres skill. Do not print the connection string.

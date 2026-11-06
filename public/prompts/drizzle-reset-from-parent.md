Reset my development branch from its parent so I can re-run migrations against a clean, parent-aligned state.

1. Reset the child branch to the latest schema and data from its parent:
   ```bash
   neon branches reset <dev-branch> --parent
   ```
2. Re-run my Drizzle migration against the freshly reset branch with `npx drizzle-kit migrate`, using its direct (unpooled) connection string.
3. Tell me what to know before I rely on this:
   - Reset from parent resyncs the branch to its parent and discards the branch's own drift. It completely overwrites the branch's schema and data with the parent's latest, so any local changes on the dev branch are lost.
   - It is a sync tool, not a recovery tool: a reset leaves no backup branch. Move anything on the dev branch you want to keep onto its own branch first. For point-in-time recovery with a preserved backup, use [Instant restore](https://neon.com/docs/postgres/backup-restore/branch-restore.md) instead, which is a separate feature.
   - Only child branches can be reset. Root branches and schema-only branches cannot.
   - Connection details do not change, but active connections are briefly interrupted during the reset.

Reference: https://neon.com/docs/guides/reset-from-parent.md and the branching guidance in the neon-postgres skill. Do not print the connection string.

A migration went wrong and I need to get the database back to its state from just before it ran. Use Neon's instant restore (point-in-time restore).

1. Identify the restore target: a timestamp or Log Sequence Number (LSN) from just before the bad migration applied. Use Time Travel Assist to run read-only queries against historical points and confirm the exact moment before you restore.
2. Restore the root branch to that point in time. Instant restore overwrites all data and schema on that branch, and Neon automatically creates a backup branch so you can roll forward again if you picked the wrong point.
3. After the restore, re-check the schema and data, then tell me the state you landed on.

Things to know:
- Instant restore works on root branches only. Child branches do not support point-in-time restore.
- The restore window depends on your plan's history window.

Follow https://neon.com/docs/postgres/backup-restore/branch-restore.md and the instant restore guidance in the neon-postgres skill. Do not print the connection string.

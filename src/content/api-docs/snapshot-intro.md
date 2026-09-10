Snapshots are point-in-time copies of a branch that you can keep as backup or use as the starting point for a new branch. You can create them on demand, and on paid plans Neon can also create them on a schedule.

## Key constraints

- Manual snapshots can be created from root branches only.
- Snapshots are distinct from [branches](#tag/branch). A branch gives you a full live Postgres instance at a past moment; a snapshot is a lighter-weight stored copy.

## When to use this API

Use these endpoints to create snapshots manually, list them, restore from them, or delete them. Scheduled snapshots are managed for you; you interact with them mainly when restoring.

See [Backup and restore](https://neon.com/docs/guides/backup-restore) for plan limits, pricing, and usage details.

---
label: 'Storage'
---

### What's new

- Compute: Updated PostgreSQL versions to 14.8 and 15.3, respectively.
- Control Plane: Disabled the Write-Ahead Log (WAL) [recovery_prefetch](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-RECOVERY-PREFETCH) setting, which controls whether to prefetch blocks referenced in the WAL that are not yet in the buffer pool, during recovery. Prefetching is not required by Neon's hot standby implementation.
- Compute: Implemented a `cargo neon` utility to facilitate setting up the Neon project locally. [Setup instructions](https://github.com/neondatabase/neon#running-neon-database) have been updated to reflect this change.

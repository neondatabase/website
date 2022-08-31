---
title: "What's new"
label: 'Storage'
---

- Postgres Compute: install `uuid-ossp` extension binaries. `CREATE EXTENSION "uuid-ossp"` now works.
- Postgres Compute: add logging for when initializing compute node fails in the `basebackup` stage.
- Pageserver: avoid busy looping, when deletion from cloud storage is skipped due to failed upload tasks.
- Pageserver: changes to internal management API: merge `wal_receiver` endpoint with `timeline_detail`.
- Pageserver: changes to internal management API: report physical size with tenant status.

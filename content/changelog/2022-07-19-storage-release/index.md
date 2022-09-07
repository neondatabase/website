---
label: 'Storage'
---

### What's new

- Safekeeper: back up WAL to S3 for disaster recovery.
- Safekeeper: download WAL from S3 on demand.
- Safekeeper: switch to etcd subscriptions to keep pageservers updated about safekeeper status
- Safekeeper: implement JWT authentication in Safekeeper HTTP API.
- Proxy: propagate SASL/SCRAM postgres authentication errors to the clients.
- Postgres Compute: update vendor/postgres to 14.4.
- Postgres Compute: rename custom configuration parameters:
  `zenith.page_server_connstring` -> `neon.pageserver_connstringz`
  `zenith.zenith_tenant` -> `neon.tenant_idz`
  `zenith.zenith_timeline` -> `neon.timeline_idz`
  `zenith.max_cluster_size` -> `neon.max_cluster_sizez`
  `wal_acceptors` -> `safekeepersz`
- Control Plane: rename `zenith_admin` role to `cloud_admin`.
- Pageserver: implement page service `fullbackup` endpoint that works like basebackup, but also sends relational files.
- Pageserver: allow importing basebackup taken from vanilla postgres or another pageserver via psql copy in protocol.
- Pageserver: fix database size calculation - count not only main fork of the relation, but also VM and FSM.
- Pageserver: update timeline size when DROP DATABASE is executed.
- Pageserver: decrease the number of threads by running gc and compaction in a blocking tokio thread pool.
- Pageserver: switch to per-tenant attach/detach. Download operations of all timelines for one tenant are now grouped together so branches can be used safely with attach/detach.

### Bug fixes

- Postgres Compute: fix CREATE EXTENSION for non-db-owner users.
- Safekeeper: fix walreceiver connection selection mechanism:
  - Avoid reconnecting to safekeeper immediately after its failure by limiting candidates to those with fewest connection attempts.
  - Make default `max_lsn_wal_lag` larger, otherwise constant reconnections happen during normal work.
  - Fix `wal_connection_attempts` maintanance, preventing busy loop of reconnections.

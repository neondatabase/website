### What's new

- Safekeeper: Added support for backing up Write-Ahead Logs (WAL) to S3 storage for disaster recovery.
- Safekeeper: Added support for downloading WAL from S3 storage on demand.
- Safekeeper: Switched to [etcd](https://etcd.io/) subscriptions to keep Pageservers up to date with the Safekeeper status.
- Safekeeper: Implemented JSON Web Token (JWT) authentication in the Safekeeper HTTP API.
- Proxy: Added support for propagating SASL/SCRAM Postgres authentication errors to clients.
- Compute: Updated the Postgres version to 14.4.
- Compute: Renamed the following custom configuration parameters:
  - `zenith.page_server_connstring` to `neon.pageserver_connstring`
  - `zenith.zenith_tenant` to `neon.tenant_id`
  - `zenith.zenith_timeline` to `neon.timeline_id`
  - `zenith.max_cluster_size` to `neon.max_cluster_size`
  - `wal_acceptors` to `safekeepers`
- Control Plane: Renamed `zenith_admin` role to `cloud_admin`.
- Pageserver: Implemented a page service `fullbackup` endpoint that works like basebackup but also sends relational files.
- Pageserver: Added support for importing a base backup taken from a standalone Postgres instance or another Pageserver using `psql` copy.
- Pageserver: Fixed the database size calculation to count Visibility Maps (VMs) and Free Space Maps (FSMs) in addition to the main fork of the relation.
- Pageserver: Updated the timeline size reported when `DROP DATABASE` is executed.
- Pageserver: Decreased the number of threads by running gc and compaction in a blocking tokio thread pool.
- Pageserver: Switched to per-tenant attach/detach. Download operations of all timelines for one tenant are now grouped together so that branches can be used safely with attach/detach.

### Bug fixes

- Compute: Enabled the use of the `CREATE EXTENSION` statement for users that are not database owners.
- Safekeeper: Fixed the walreceiver connection selection mechanism:
  - Reconnecting to a Safekeeper immediately after it fails is now avoided by limiting candidates to those with the fewest connection attempts.
  - Increased the `max_lsn_wal_lag` default setting to avoid constant reconnections during normal work.
  - Fixed `wal_connection_attempts` maintenance, preventing busy reconnection loops.

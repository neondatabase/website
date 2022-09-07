---
title: Release Notes
---
## 2022-09-02 Console release

### What's new

- UI: Added support for passing the OAuth app name to the client.

### Bug fixes

- UI: Fixed the title on the 'Sign in' page.

- UI: Changed the PostgreSQL version displayed on the project dashboard to 14.5.

- Control plane: Fixed authentication of concurrent proxy connections to the idle compute node.

## 2022-09-01 Storage release

### What's new

- Postgres Compute: Updated the PostgreSQL version to 14.5.

- Postgres Compute: Added support for the `PostGIS` extension, version 3.3.0.

- Pageserver: Changed basebackup import panics to plain errors.

- Proxy: Added support for forwarding the `options`, `application_name`, and `replication` connection parameters to compute nodes.

## 2022-08-31 Console release

### What's new

- Control plane: Implemented OAuth backend and OAuth consent screens. OAuth applications are granted permissions to create projects on behalf of the user. To integrate your product with Neon, please contact us.

### Bug fixes

- UI: Fixed syntax highlighting for Golang snippets.

- UI: Fixed styles for smaller screens.

## 2022-08-30 Console release

### Bug fixes

- UI: Fixed a CORS error for API requests in the Swagger UI. The error occurred when using 'Try it out'.

### What's new

- UI: Added a feedback form.

## 2022-08-25 Console release

### Bug fixes

- UI: Fixed `.pgpass` instructions [#1825](https://github.com/neondatabase/neon/issues/1825).

- UI: Added validation messages for creating a project form.

- UI: Fixed broken links in the onboarding section of the UI.

- UI: Updated emails used to request branching and support.

### What's new

- UI: Added a Tables page for exporting the Project schema and data.

- UI: Added a help center menu.

- Control Plane: Added the ability to select Safekeepers from different Availability Zones for new Projects.

## 2022-08-15 Console release

### Bug fixes

- UI: Fixed incorrect encoding when switching between code samples in the connection widget, and added descriptions to connection string examples.

- UI: Fixed various typos and errors.

### What's new

- UI: Introduced saved queries and a query history to the project query interface.

- UI: Added token-based authorization to the Swagger UI for [Neon's public API](https://neon.tech/api-reference).

- UI: Changed the display status of operations waiting in the queue from 'In progress' to 'Scheduling'.

- UI: Disabled some controls that remained enabled while the project was in a transitive state.

- Control Plane: Set `max_replication_write_lag` to `15 MB` to tune the backpressure mechanism and improve PostgresSQL responsiveness under load.

- Control Plane: Improved the ability to investigate performance issues by collecting and saving more detailed compute node startup time metrics.

## 2022-08-08 Console release

### Bug fixes

- UI: Fixed project status live updates that were failing with a websocket connection.

## 2022-08-04 Console release

### What's new

- UI: Added validation to ensure that an API key name is not empty in the creation form.

- UI: Added 'Create branch' to the project dashboard for selected users.

- UI: Added a detailed error message to the SQL Editor for failed queries.

- Control Plane: Added a new version of operations executor that includes various stability and observability improvements.

- Control Plane: Compute node logs are dumped if the startup process fails.

- Control Plane: Added support for deleting timeline data from all storage nodes (safekeepers and pageserver) after project deletion.

## 2022-08-02 Storage release

### What's new

- Postgres Compute: Installed the 'uuid-ossp' extension binaries. `CREATE EXTENSION "uuid-ossp"` now works.

- Postgres Compute: Added logging for compute node initialization failure during the 'basebackup' stage.

- Pageserver: Avoided busy looping when deletion from cloud storage is skipped due to failed upload tasks.

- Pageserver: Merged the 'wal_receiver' endpoint with 'timeline_detail', in the internal management API.

- Pageserver: Added reporting of the physical size with the tenant status, in the internal management API.

## 2022-07-20 Console release

### What's new

- UI: Added an 'Enable pooling' toggle to the project's General settings page.

- Control plane: Added usage of several instances for serving the public API and web UI to enables zero-downtime deployments.

- API: Changed the error reported when a concurrent operation on a project prevents acquiring the project lock. Error `423 Locked` is now reported instead of `409 Conflict`.

## 2022-07-19 Storage release

### What's new

- Safekeeper: Added support for backing up WAL to S3 for disaster recovery.

- Safekeeper: Added support for downloading WAL from S3 on demand.

- Safekeeper: Switched to etcd subscriptions to keep pageservers up to date regarding safekeeper status.

- Safekeeper: Implemented JWT authentication in the Safekeeper HTTP API.

- Proxy: Added support for propagating SASL/SCRAM PostgreSQL authentication errors to clients.

- Postgres Compute: Updated the PostgreSQL version to 14.4.

- Postgres Compute: Renamed the following custom configuration parameters:

  - `zenith.page_server_connstring` to `neon.pageserver_connstring`
  - `zenith.zenith_tenant` to `neon.tenant_id`
  - `zenith.zenith_timeline` to `neon.timeline_id`
  - `zenith.max_cluster_size` to `neon.max_cluster_size`
  - `wal_acceptors` to `safekeepers`

- Control Plane: Renamed `zenith_admin` role to `cloud_admin`.

- Pageserver: Implemented a page service `fullbackup` endpoint that works like basebackup but also sends relational files.

- Pageserver: Added support for importing a basebackup taken from vanilla PostgreSQL or another pageserver via psql copy in protocol.

- Pageserver: Fixed the database size calculation to count VMs and FSMs in addition to the main fork of the relation.

- Pageserver: Updated the timeline size reported when DROP DATABASE is executed.

- Pageserver: Decreased the number of threads by running gc and compaction in a blocking tokio thread pool.

- Pageserver: Switched to per-tenant attach/detach. Download operations of all timelines for one tenant are now grouped together so that branches can be used safely with attach/detach.

### Bug fixes

- Postgres Compute: Fixed `CREATE EXTENSION` for users that are not database owners.

- Safekeeper: Fixed the walreceiver connection selection mechanism:
  - Reconnecting to safekeeper immediately after it fails is now avoided by limiting candidates to those with fewest connection attempts.
  - Increased the `max_lsn_wal_lag` default setting to avoid constant reconnections during normal work.
  - Fixed `wal_connection_attempts` maintenance, preventing busy reconnection loops.

## 2022-07-11 Console release

### What's new

- Control Plane: Implemented optional connection pooling for projects.

- API: Added a `pooler_enabled` flag to the [project update API call](https://neon.tech/api-reference/#/Project/branchCreate).

- UI: Implemented various improvements.

### Bug fixes

- API: Fixed several bugs that could cause intermittent 409 responses.

## 2022-06-08 Console release

### What's new

- UI: The technical preview invite code is now requested only at the first login.

- UI: Added a cover to all password fields to protect passwords from view.

- API: Changed the `user_id` type from `int64` to `uuid`.

- API: Implemented a unified JSON error response where possible, in the format of `{ "message": "error text" }`.

- API: Made `platform`, `region`, and `instance_type` ids optional during new project creation.

### Bug fixes

- Control Plane: Fixed an issue that allowed the `web_access` system role to be modified or deleted, which could break the UI query interface.

- UI: Implemented various fixes and improvements.

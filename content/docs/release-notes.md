---
title: Release Notes
---

## 2022-08-25 Console release

### Bug fixes

- UI: fix .pgpass instructions [#1825](https://github.com/neondatabase/neon/issues/1825).

- UI: add validation messages for creating a project form.

- UI: fix the dead links in the onboarding

- UI: limited preview and branching email updates 

### What's new

- UI: Table viewer

- UI: add help center menu 

- Control Plane: Select safekeepers from different Availability Zones for a new compute project.

## 2022-08-15 Console release

### Bug fixes

- UI: fix incorrect encoding when switching between code samples in the connection widget, add description for connection string examples.

- UI: fix various typos and errors.

### What's new

- UI: introduce saved queries and history in the project query interface.

- UI: add token-based authorization into Swagger UI for [Neon's public API](https://console.neon.tech/api-docs/v1).

- UI: display status of operations that are waiting in the queue as 'Scheduling' instead of 'In progress'.

- UI: disable some controls, when project is in the transitive state already.

- Control Plane: set `max_replication_write_lag` to `15 MB`, which should tune backpressure mechanism and make Postgres more responsive under load.

- Control Plane: collect and save more detailed compute node startup time metrics for an easier investigation of performance issues.

## 2022-08-08 Console release

### Bug fixes

- UI: fix project status live updates using websocket connection.

## 2022-08-04 Console release

### What's new

- UI: validate that API key name is not empty in the creation form.

- UI: add 'Create branch' to the project dashboard for selected users.

- UI: show detailed error in the SQL Editor if query failed.

- Control Plane: use new version of operations executor including various stability and observability improvements.

- Control Plane: dump compute node logs if startup process failed.

- Control Plane: delete corresponding timeline data from all storage nodes (safekeepers and pageserver) after project deletion.

## 2022-08-02 Storage release

### What's new

- Postgres Compute: install 'uuid-ossp' extension binaries. `CREATE EXTENSION "uuid-ossp"` now works.

- Postgres Compute: add logging for when initializing compute node fails in the 'basebackup' stage.

- Pageserver: avoid busy looping, when deletion from cloud storage is skipped due to failed upload tasks.

- Pageserver: changes to internal management API, merge 'wal_receiver' endpoint with 'timeline_detail'.

- Pageserver: changes to internal management API, report physical size with tenant status.

## 2022-07-20 Console release

### What's new

- UI: add 'Enable pooling' toggle to the Project's Settings page.

- Control plane: use several instances to serve public API and web UI, which allow doing a zero-downtime deployments.

- API: return `423 Locked` instead of `409 Conflict`, when there is a concurrent operation on project preventing acquiring the project lock.

## 2022-07-19 Storage release

### What's new

- Safekeeper: back up WAL to S3 for disaster recovery.

- Safekeeper: download WAL from S3 on demand.

- Safekeeper: switch to etcd subscriptions to keep pageservers updated about safekeeper status.

- Safekeeper: implement JWT authentication in Safekeeper HTTP API.

- Proxy: propagate SASL/SCRAM postgres authentication errors to the clients.

- Postgres Compute: update vendor/postgres to 14.4.

- Postgres Compute: rename custom configuration parameters:

  - `zenith.page_server_connstring` -> `neon.pageserver_connstring`
  - `zenith.zenith_tenant` -> `neon.tenant_id`
  - `zenith.zenith_timeline` -> `neon.timeline_id`
  - `zenith.max_cluster_size` -> `neon.max_cluster_size`
  - `wal_acceptors` -> `safekeepers`

- Control Plane: rename `zenith_admin` role to `cloud_admin`

- Pageserver: implement page service `fullbackup` endpoint that works like basebackup, but also sends relational files.

- Pageserver: allow importing basebackup taken from vanilla postgres or another pageserver via psql copy in protocol.

- Pageserver: fix database size calculation - count not only main fork of the relation, but also VM and FSM.

- Pageserver: update timeline size when DROP DATABASE is executed.

- Pageserver: decrease the number of threads by running gc and compaction in a blocking tokio thread pool.

- Pageserver: switch to per-tenant attach/detach. Download operations of all timelines for one tenant are now grouped together so branches can be used safely with attach/detach.

### Bug fixes

- Postgres Compute: fix `CREATE EXTENSION` for non-db-owner users.

- Safekeeper: fix walreceiver connection selection mechanism:
  - Avoid reconnecting to safekeeper immediately after its failure by limiting candidates to those with fewest connection attempts.
  - Make default `max_lsn_wal_lag` larger, otherwise constant reconnections happen during normal work.
  - Fix `wal_connection_attempts` maintanance, preventing busy loop of reconnections.

## 2022-07-11 Console release

### What's new

- Control Plane: implement optional connection pooling for projects.

- API: add `pooler_enabled` flag to [projects update API call](https://console.neon.tech/api-docs#operations-Project-updateProject).

- UI: various improvements.

### Bug fixes

- API: fix several bugs that could cause intermittent 409 responses.

## 2022-06-08 Console release

### What's new

- UI: invite code is now asked only at the first login.

- UI: new password cover everywhere, protecting it from stranger eyes.

- API: `user_id` type changed from `int64` to `uuid`.

- API: unified JSON error response in a format of `{ "message": "error text" }` is now used whenever it's possible.

- API: `platform`, `region` and `instance_type` ids are now optional during new project creation.

### Bug fixes

- Control Plane: fix an issue when system role `web_access` could be modified or deleted, which broke the UI query interface.

- UI: various fixes and improvements.

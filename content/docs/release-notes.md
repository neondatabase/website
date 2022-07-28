---
title: Release Notes
---

## 2022-07-19 Storage release

### What's new

* Safekeeper: Back up WAL to S3 for disaster recovery.

* Safekeeper: Download WAL from S3 on demand.

* Safekeeper: Switch to etcd subscriptions to keep pageservers updated about safekeeper status

* Safekeeper: Implement JWT authentication in Safekeeper HTTP API.

* Proxy: Propagate postgres authentication errors to the clients.

* Postgres Compute: Update vendor/postgres to 14.4.

* Postgres Compute: Rename custom configuration parameters:
    * `zenith.page_server_connstring` -> `neon.pageserver_connstring`
    * `zenith.zenith_tenant` -> `neon.tenant_id`
    * `zenith.zenith_timeline` -> `neon.timeline_id`
    * `zenith.max_cluster_size` -> `neon.max_cluster_size`
    * `wal_acceptors` -> `safekeepers`

* Control Plane: Rename `zenith_admin` role to `cloud_admin`

* Pageserver: Implement page service `fullbackup` endpoint that works like basebackup, but also sends relational files.

* Pageserver: Allow importing basebackup taken from vanilla postgres or another pageserver via psql copy in protocol.

* Pageserver: Fix database size calculation - count not only main fork of the relation, but also VM and FSM.

* Pageserver: Update timeline size when DROP DATABASE is executed.

* Pageserver: Decrease the number of threads by running gc and compaction in a blocking tokio thread pool.

* Pageserver: Switch to per-tenant attach/detach. Download operations of all timelines for one tenant are now grouped together so branches can be used safely with attach/detach.

### Bug fixes

* Postgres Compute: Fix CREATE EXTENSION for non-db-owner users

* Safekeeper: Fix walreceiver connection selection mechanism:
    * Avoid reconnecting to safekeeper immediately after its failure by limiting candidates to those with fewest connection attempts.
    * Make default `max_lsn_wal_lag` larger, otherwise constant reconnections happen during normal work.
    * Fix `wal_connection_attempts` maintanance, preventing busy loop of reconnections.


## 2022-07-11 Console release

### What's new

* Connection pooling can be enabled for any of your projects using the public HTTP API. To do this, specify `{ "project": { "pooler_enabled": true } }` using [project update API](https://console.neon.tech/api-docs)
* UI design improvements

### Bug fixes

* Fixed several bugs that could cause intermittent 409 responses from the API

## 2022-06-08 Console release

### What's new

* UI: invite code is now asked only at the first login
* UI: new password cover everywhere, protecting it from stranger eyes
* API: `user_id` type changed from `int64` to `uuid`
* API: unified JSON error response in a format of `{ "message": "error text" }` is now used whenever it's possible
* API: `platform`, `region` and `instance_type` ids are now optional during new project creation

### Bug fixes

* Fixed an issue when system role `web_access` could be modified or deleted, which broke the UI query interface
* Various UI fixes and improvements

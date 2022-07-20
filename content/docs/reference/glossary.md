---
title: Glossary
redirectFrom:
  - /docs/conceptual-guides/glossary
  - /docs/cloud/concepts/
---

<a id="branches-coming-soon/"></a>

## Branches

_Neon Branching capabilities are not publicly available yet. If you would like to try out this feature, reach out to iwantbranching@neon.tech describing your use case and request to enable branching capabilities for your account._

A branch is a copy of the project data created from the current state or any past state that is still available (see [PITR](../technical-preview-free-tier/#point-in-time-reset)). A branch can be independently modified from its originating project data.

You can use a branch to:

- Run potentially destructive queries without impacting your main branch
- Run time travel queries against historical state
- Run a set of queries with separate resources to avoid impacting your application
- Tag and name the current moment, for PITR convenience or ML model training repeatability
- Run your tests against a branch from production data

_Note: The branch creation process does not increase load on the originating project. You can create a branch at any time without worrying about downtime or performance degradation._

## Neon User

A Neon user is identified by their email address.

A user registers and authenticates in Neon Web UI with their GitHub or Google account. More authentication methods are coming soon.

Once authenticated, a user can create and access [Projects](#project) and [query Project data](../../get-started-with-neon/tutorials#query-via-ui). You can also manage [Postgres Users](#postgres-users) and [Databases](#postgres-databases) in each Project.

## Postgres

- WAL: PostgreSQL uses a [Write Ahead Log (WAL)](https://www.postgresql.org/docs/current/wal-intro.html) for durability and replication. In Neon, we additionally rely on this WAL to separate storage from compute.
- LSN: [Log Sequence Number](https://www.postgresql.org/docs/current/datatype-pg-lsn.html), a byte offset into a location inside the entire WAL stream.
- Page: An 8KB chunk of data, which is the smallest unit of storage that Postgres uses for storing relations and indexes on disk. In Neon, a page is also the smallest unit of data the Pageserver can be queried for. See [Postgres Database Page Layout](https://www.postgresql.org/docs/current/storage-page-layout.html).

## Postgres Users

Postgres users are created as a part of your Neon Project and can be managed via the Neon web UI. A system user `web-access` is used for the SQL Editor in Neon UI and for link authentication for psql. This user cannot be removed or used for authenticating in other scenarios.

The second user is created for client access. The credentials for that user can be managed, this user's credentials can be used for password-based psql authentication too.

More Postgres users can be created in Neon UI.

## Postgres Databases

When a Project is created, a default database for storing data is created along with it, the name of the database is "main". A Neon user can create more databases inside a Project in the Neon UI. Neon users cannot manipulate system databases, such as `postgres`, `template0`, or `template1`.

## Project

A Project is a collection of Postgres databases, Postgres users and other settings on Neon cloud service.

A Project contains a virtual instance with a Postgres server, also called Compute, as well as the storage used to store the Project data. The amount of virtual resources available for the Project is subject to limits defined by the [Technical Preview Free Tier](../technical-preview-free-tier).

Compute is stateless and can be automatically activated and suspended due to user activity.

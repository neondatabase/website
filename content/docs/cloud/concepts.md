---
title: Concepts
---

## User

Neon User is identified by their email address.

User registers and authenticates in Neon Web UI with their GitHub account. More authentication methods are coming soon.

Once authenticated, Neon User can create and access [Projects](#project), query Project data. They can also manage [Postgres Users and Databases](#postgres-users) in each Project.

### API keys

API keys allow users to access Neon application programming interface.

An API key provides access to any action available to the user. Currently API keys cannot be scoped to the specific Projects. Neon Users can provision multiple API keys. An API key that is no longer needed can be revoked, this action cannot be reverted. Any issued API key is valid forever until it is revoked.

Check out the [API Spec](https://console.neon.tech/api-docs) reference for more information about using the API keys and available API methods.

## Project

Project is a collection of Postgres databases, postgres users and other settings on Neon cloud service.

Project contains a virtual instance with a Postgres server, also called Compute, as well as the storage used to store the project data. Amount of virtual resources available for the Project is subject to limits defined by the [Free Tier](#free-tier).

Compute is stateless and can be automatically activated and suspended due to user activity.

### Compute Lifecycle

A Compute node in the Neon is a stateless Postgres process due to the separation of storage and compute. It has two main states: Active and Idle.

Active means that Postgres is running right now. If there are no active queries for 5 minutes, the activity monitor will gracefully put the corresponding compute node into the idle state to save energy and resources. The activity monitor is conservative, and it treats 'idle in transaction' connections as some activity to do not break an application logic that relies on long-lasting transactions. Yet, it closes all 'idle' connections after 5 minutes of complete inactivity.

In the Idle state, you can still connect to your compute at any time. Neon will automatically activate it. Activation usually happens within a few seconds, so the first connection in the idle state will have higher latency. Also, the Postgres page cache (shared buffers) could not be warmed up after waking up from the idle state, and your usual queries may take longer to accomplish.

After some period in the idle state, Neon will start occasionally activating your Compute to check data availability. The checks period will gradually increase up to several days if the Compute does not receive any client connections.

You can check all Compute state transitions in the operations list tab on the dashboard.

### Postgres Users

Postgres users are created as part of Neon Project.

### Postgres Databases

When a Project is created, a default database for storing data is created along with it, the name of the database is main. Neon users cannot manipulate the system databases.

### Limits

Neon give you no cost access to the PostgreSQL databases is you stay within Free Tier limits.

| Limit                                                 | Value  |
| ----------------------------------------------------- | ------ |
| Max Projects per Neon User                            | 3      |
| Max size of a Project                                 | 10 GB  |
| Max Number of processor cores for Compute per Project | 1vCPU  |
| Max RAM per Compute in Project                        | 256 MB |

See detailed explanation in chapters below.
If you need to upgrade resource limits, contact technical support.

To monitor current resource usage, check the Project Dashboard.

#### Data size

Neon separates storage and compute and stores data in its own internal format.
Data Size limit applies to the logical size of the Project. The logical size is the sum of all relation sizes in the Project.
If you are familiar with PostgreSQL, the logical size is roughly equal to

```postgresql
select pg_size_pretty(sum(pg_database_size(datname)))
from pg_database;
```

To check the logical size run the following query:

`select pg_size_pretty(neon.pg_cluster_size());`

When the limit is reached, you will see the PostgreSQL error message:

`could not extend file because cluster size limit (10240 MB) has been exceeded`

#### Point in Time Recovery

Neon storage consumes extra space in order to support Point in Time Recovery (PITR) and the ability to reset a branch to a historical state. The historical data is stored in log based format.

Neon limits on the modification history for [Free Tier](#free-tier) customers.

#### Compute config

During technical preview, Neon only supports modification to session level configuration parameters. Parameters are reset when session is terminated (e.g. when compute is suspended)

[Default Parameters](../../compatibility/compatibiilty#default-parameters)

See [https://www.postgresql.org/docs/14/runtime-config.html](https://www.postgresql.org/docs/14/runtime-config.html) for details

## Free Tier

Neon cloud service is available for free during the [Limited and the Technical Preview](#roadmap).

Free tier users can only create three Projects in Neon. Projects created under Free tier are subject to additional limits:

- Data size in the Project is limited to 10GB;
- PITR time window is limited to 7 days of _reasonable usage_;
- Compute node can use up to 1vCPU/256 MB.

_Note: Free Tier limits are subject to change over the course of [Technical Preview](../roadmap)._

## Branches (coming soon)

_Neon Branching capabilities are not publicly available yet. If you’d like to try out this feature, reach out to beta@neon.tech with a request to enable branching capabilities for your account._

A branch is a copy of the [project data](#project) created from the current state or any past state that is still available (see [PITR](#point-in-time-recovery)). A branch can be independently modified from its originating project data.

You can use a branch to:

- Run potentially destructive queries without impacting your main branch
- Run time travel queries against historical state
- Run a set of queries with separate resources to avoid impacting your application
- Tag and name the current moment, for PITR convenience or ML model training repeatability
- Run your tests against a branch from production data

Note: The branch creation process does not increase load on the originating project. You can create a branch at any time without worrying about downtime or performance degradation.

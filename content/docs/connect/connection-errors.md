---
title: Connection errors
subtitle: Learn how to resolve connection errors
enableTableOfContents: true
redirectFrom:
  - /docs/how-to-guides/connectivity-issues
  - /docs/connect/connectivity-issues
updatedOn: '2024-12-13T20:52:57.577Z'
---

This topic describes how to resolve connection errors you may encounter when using Neon. The errors covered include:

- [The endpoint ID is not specified](#the-endpoint-id-is-not-specified)
- [Password authentication failed for user](#password-authentication-failed-for-user)
- [Couldn't connect to compute node](#couldnt-connect-to-compute-node)
- [Can't reach database server](#cant-reach-database-server)
- [Error undefined: Database error](#error-undefined-database-error)
- [Terminating connection due to administrator command](#terminating-connection-due-to-administrator-command)
- [Unsupported startup parameter](#unsupported-startup-parameter)
- [You have exceeded the limit of concurrently active endpoints](#you-have-exceeded-the-limit-of-concurrently-active-endpoints)
- [Remaining connection slots are reserved for roles with the SUPERUSER attribute](#remaining-connection-slots-are-reserved-for-roles-with-the-superuser-attribute)
- [Relation not found](#relation-not-found)
- [query_wait_timeout SSL connection has been closed unexpectedly](#querywaittimeout-ssl-connection-has-been-closed-unexpectedly)
- [The request could not be authorized due to an internal error](#the-request-could-not-be-authorized-due-to-an-internal-error)
- [Terminating connection due to idle-in-transaction timeout](#terminating-connection-due-to-idle-in-transaction-timeout)

<Admonition type="info">
Connection problems are sometimes related to a system issue. To check for system issues, please refer to the [Neon status page](https://neonstatus.com/).  
</Admonition>

## The endpoint ID is not specified

With older clients and some native Postgres clients, you may receive the following error when attempting to connect to Neon:

```txt shouldWrap
ERROR: The endpoint ID is not specified. Either upgrade the Postgres client library (libpq) for SNI support or pass the endpoint ID (the first part of the domain name) as a parameter: '&options=endpoint%3D'. See [https://neon.tech/sni](https://neon.tech/sni) for more information.
```

This error occurs if your client library or application does not support the **Server Name Indication (SNI)** mechanism in TLS.

Neon uses computet IDs (the first part of a Neon domain name) to route incoming connections. However, the Postgres wire protocol does not transfer domain name information, so Neon relies on the Server Name Indication (SNI) extension of the TLS protocol to do this.

SNI support was added to `libpq` (the official Postgres client library) in Postgres 14, which was released in September 2021. Clients that use your system's `libpq` library should work if your Postgres version is >= 14. On Linux and macOS, you can check Postgres version by running `pg_config --version`. On Windows, check the `libpq.dll` version in your Postgres installation's `bin` directory. Right-click on the file, select **Properties** > **Details**.

If a library or application upgrade does not help, there are several workarounds, described below, for providing the required domain name information when connecting to Neon.

### A. Pass the endpoint ID as an option

Neon supports a connection option named `endpoint`, which you can use to identify the compute you are connecting to. Specifically, you can add `options=endpoint%3D[endpoint_id]` as a parameter to your connection string, as shown in the example below. The `%3D` is a URL-encoded `=` sign. Replace `[endpoint_id]` with your compute's ID, which you can find in your Neon connection string. It looks similar to this: `ep-cool-darkness-123456`.

```txt shouldWrap
postgresql://[user]:[password]@[neon_hostname]/[dbname]?options=endpoint%3D[endpoint-id]
```

<Admonition type="note">
The `endpoint` connection option was previously named `project`. The `project` option is deprecated but remains supported for backward compatibility.
</Admonition>

The `endpoint` option works if your application or library permits it to be set. Not all of them do, especially in the case of GUI applications.

### B. Use libpq key=value syntax in the database field

If your application or client is based on `libpq` but you cannot upgrade the library, such as when the library is compiled inside of a an application, you can take advantage of the fact that `libpq` permits adding options to the database name. So, in addition to the database name, you can specify the `endpoint` option, as shown below. Replace `[endpoint_id]` with your compute's endpoint ID, which you can find in your Neon connection string. It looks similar to this: `ep-cool-darkness-123456`.

```txt
dbname=neondb options=endpoint=[endpoint_id]
```

### C. Set verify-full for golang-based clients

If your application or service uses golang Postgres clients like `pgx` and `lib/pg`, you can set `sslmode=verify-full`, which causes SNI information to be sent when you connect. Most likely, this behavior is not intended but happens inadvertently due to the golang's TLS library API design.

### D. Specify the endpoint ID in the password field

Another supported workaround involves specifying the endpoint ID in the password field. So, instead of specifying only your password, you provide a string consisting of the `endpoint` option and your password, separated by a semicolon (`;`) or dollar sign character (`$`), as shown in the examples below. Replace `[endpoint_id]` with your compute's endpoint ID, which you can find in your Neon connection string. It looks similar to this: `ep-cool-darkness-123456`.

```txt
endpoint=<endpoint_id>;<password>
```

or

```txt
endpoint=<endpoint_id>$<password>
```

Example:

```txt
postgresql://alex:endpoint=ep-cool-darkness-123456;AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

<Admonition type="note">
Using a dollar sign (`$`) character as a separator may be required if a semicolon (`;`) is not a permitted character in a password field. For example, the [AWS Database Migration Service (DMS)](https://aws.amazon.com/dms/) does not permit a semicolon character in the **Password** field when defining connection details for database endpoints.
</Admonition>

This approach causes the authentication method to be downgraded from `scram-sha-256` (never transfers a plain text password) to `password` (transfers a plain text password). However, the connection is still TLS-encrypted, so the level of security is equivalent to the security provided by `https` websites. We intend deprecate this option when most libraries and applications provide SNI support.

### Libraries

Clients on the [list of drivers](https://wiki.postgresql.org/wiki/List_of_drivers) on the PostgreSQL community wiki that use your system's `libpq` library should work if your `libpq` version is >= 14.

Neon has tested the following drivers for SNI support:

| Driver            | Language   | SNI Support | Notes                                                                                                                                             |
| ----------------- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| npgsql            | C#         | &check;     |                                                                                                                                                   |
| Postgrex          | Elixir     | &check;     | [Requires ssl_opts with server_name_indication](/docs/guides/elixir-ecto#configure-ecto)                                                          |
| github.com/lib/pq | Go         | &check;     | Supported with macOS Build 436, Windows Build 202, and Ubuntu 20, 21 and 22                                                                       |
| pgx               | Go         | &check;     | SNI support merged with v5.0.0-beta.3 yet                                                                                                         |
| go-pg             | Go         | &check;     | requires `verify-full` mode                                                                                                                       |
| JDBC              | Java       | &check;     |                                                                                                                                                   |
| node-postgres     | JavaScript | &check;     | Requires the `ssl: {'sslmode': 'require'}` option                                                                                                 |
| postgres.js       | JavaScript | &check;     | Requires the `ssl: 'require'` option                                                                                                              |
| asyncpg           | Python     | &check;     |                                                                                                                                                   |
| pg8000            | Python     | &check;     | Requires [scramp >= v1.4.3](https://pypi.org/project/scramp/), which is included in [pg8000 v1.29.3](https://pypi.org/project/pg8000/) and higher |
| PostgresClientKit | Swift      | &#x2717;    |                                                                                                                                                   |
| PostgresNIO       | Swift      | &check;     |                                                                                                                                                   |
| postgresql-client | TypeScript | &check;     |                                                                                                                                                   |

## Password authentication failed for user

The following error is often the result of an incorrectly defined connection information, or the driver you are using does not support Server Name Indication (SNI).

```text shouldWrap
ERROR:  password authentication failed for user '<user_name>' connection to server at "ep-billowing-fun-123456.us-west-2.aws.neon.tech" (12.345.67.89), port 5432 failed: ERROR:  connection is insecure (try using `sslmode=require`)
```

Check your connection to see if it is defined correctly. Your Neon connection string can be obtained from the **Connection Details** widget on the Neon **Dashboard**. It appears similar to this:

```text shouldWrap
postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

For clients or applications that require specifying connection parameters such as user, password, and hostname separately, the values in a Neon connection string correspond to the following:

- **User**: `daniel`
- **Password**: `f74wh99w398H`
- **Hostname**: `ep-white-morning-123456.us-east-2.aws.neon.tech`
- **Port number**: `5432` (Neon uses default Postgres port, `5432`, and is therefore not included in the connection string)
- **Database name**: `neondb` (`neondb` is the ready-to-use database created with each Neon project. Your database name may differ.)

If you find that your connection string is defined correctly, see the instructions regarding SNI support outlined in the preceding section: [The endpoint ID is not specified](#the-endpoint-id-is-not-specified).

## Couldn't connect to compute node

This error arises when the Neon proxy, which accepts and handles connections from clients that use the Postgres protocol, fails to establish a connection with your compute. This issue sometimes occurs due to repeated connection attempts during the compute's restart phase after it has been idle due to [scale to zero](/docs/reference/glossary#scale-to-zero). The transition from an idle to an active state only takes a few hundred milliseconds.

Consider these recommended steps:

- Visit the [Neon status page](https://neonstatus.com/) to ensure there are no ongoing issues.
- Pause for a short period to allow your compute to restart, then try reconnecting.
- Try [connecting with psql](/docs/connect/query-with-psql-editor) to see if a connection can be established.
- Review the strategies in [Connection latency and timeouts](/docs/connect/connection-latency) for avoiding connection issues due to compute startup time.

If the connection issue persists, please reach out to [Support](/docs/introduction/support).

## Can't reach database server

This error is sometimes encountered when using Prisma Client with Neon.

```text shouldWrap
Error: P1001: Can't reach database server at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`
Please make sure your database server is running at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`.
```

A compute in Neon has two main states: **Active** and **Idle**. Active means that Postgres is currently running. If there are no active queries for 5 minutes, the activity monitor gracefully places the compute into an idle state to reduce compute usage.

When you connect to an idle compute, Neon automatically activates it. Activation typically happens within a few seconds. If the error above is reported, it most likely means that the Prisma query engine timed out before your Neon compute was activated. For dealing with this connection timeout scenario, refer to the [connection timeout](/docs/guides/prisma#connection-timeouts) instructions in our Prisma documentation. Our [connection latency and timeout](/docs/connect/connection-latency) documentation may also be useful in addressing this issue.

## Error undefined: Database error

This error is sometimes encountered when using Prisma Migrate with Neon.

```text
Error undefined: Database error
Error querying the database: db error: ERROR: prepared statement
"s0" already exists
```

Prisma Migrate requires a direct connection to the database. It does not support a pooled connection with PgBouncer, which is the connection pooler used by Neon. Attempting to run Prisma Migrate commands, such as `prisma migrate dev`, with a pooled connection causes this error. To resolve this issue, please refer to our [Connection pooling with Prisma Migrate](/docs/guides/prisma#connect-pooling-with-prisma-migrate) instructions.

## Terminating connection due to administrator command

The `terminating connection due to administrator command` error is typically encountered when running a query from a connection that has sat idle long enough for the compute to suspend due to inactivity. Neon automatically suspends a compute after 5 minutes of inactivity, by default. You can reproduce this error by connecting to your database from an application or client such as `psql`, letting the connection remain idle until the compute suspends, and then running a query from the same connection.

If you encounter this error, you can try adjusting the timing of your query or reestablishing the connection before running the query. Alternatively, if you are a paying user, you can disable scale to zero. For instructions, see [Configuring Scale to zero for Neon computes](/docs/guides/scale-to-zero-guide). [Neon Free Plan](/docs/introduction/plans#free-plan) users cannot disable scale to zero.

## Unsupported startup parameter

This error is reported in two variations:

```text
unsupported startup parameter: <...>
```

```text
unsupported startup parameter in options: <...>
```

The error occurs when using a pooled Neon connection string with startup options that are not supported by PgBouncer. PgBouncer allows only startup parameters it can keep track of in startup packets. These include: `client_encoding`, `datestyle`, `timezone`, `standard_conforming_strings`, and `application_name`. See **track_extra_parameters**, in the [PgBouncer documentation](https://www.pgbouncer.org/config.html#track_extra_parameters). To resolve this error, you can either remove the unsupported parameter from your connection string or use an unpooled Neon connection string. For information about pooled and unpooled connections in Neon, see [Connection pooling](/docs/connect/connection-pooling).

## You have exceeded the limit of concurrently active endpoints

This error can also appear as: `active endpoints limit exceeded`.

Neon has a default limit of 20 concurrently active computes to protect your account from unintended usage. The compute associated with the default branch is exempt from this limit, ensuring that it is always available. When you exceed the limit, any compute associated with a non-default branch will remain suspended and you will see this error when attempting to connect to it. You can suspend computes and try again. Alternatively, if you encounter this error often, you can reach out to [Support](/docs/introduction/support) to request a limit increase.

## Remaining connection slots are reserved for roles with the SUPERUSER attribute

This error occurs when the maximum number of simultaneous database connections, defined by the Postgres `max_connections` setting, is reached.

To resolve this issue, you have several options:

- Find and remove long-running or idle connections. See [Find long-running or idle connections](/docs/postgresql/query-reference#find-long-running-or-idle-connections).
- Use a larger compute, with a higher `max_connections` configuration. See [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).
- Enable [connection pooling](/docs/connect/connection-pooling).

If you are already using connection pooling, you may need to reach out to Neon Support to request a higher `default_pool_size` setting for PgBouncer. See [Neon PgBouncer configuration settings for more information](/docs/connect/connection-pooling#neon-pgbouncer-configuration-settings).

## Relation not found

This error is often encountered when attempting to set the Postgres `search_path` session variable using a `SET search_path` statement over a pooled connection. For more information and workarounds, please see [Connection pooling in transaction mode](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode).

## query_wait_timeout SSL connection has been closed unexpectedly

The `query_wait_timeout` setting is a PgBouncer configuration option that determines the maximum time a query can wait in the queue before being executed. Neon’s default value for this setting is **120 seconds**. If a query exceeds this timeout while in the queue, it will not be executed. For more details about this setting, refer to [Neon PgBouncer configuration settings](/docs/connect/connection-pooling#neon-pgbouncer-configuration-settings).

To avoid this error, we recommend reviewing your workload. If it includes batch processing with `UPDATE` or `INSERT` statements, review their performance. Slow queries may be the root cause. Try optimizing these queries to reduce execution time, which can help prevent them from exceeding the timeout.

Alternatively, Neon can increase the `query_wait_timeout` value for you, but this is not typically recommended, as increasing the timeout can lead to higher latency or blocked queries under heavy workloads.

## The request could not be authorized due to an internal error

This error page in the Neon Console is most often the result of attempting to access a Neon project in one browser window after you've have logged in under a different Neon user account from another browser window. The error occurs because the currently logged in Neon user account does not have access to the Neon project. To avoid this issue, ensure that you're logged in with a Neon user account that has access to the Neon project you're trying to access.

## Terminating connection due to idle-in-transaction timeout

This error occurs when a session remains idle within an open transaction for longer than the specified timeout period. By default, the `idle_in_transaction_session_timeout` setting is set to `5min` (300,000 milliseconds). This timeout helps prevent idle sessions from holding locks or contributing to table bloat.

If you encounter this error, you can adjust the `idle_in_transaction_session_timeout` setting to a higher value or disable it entirely by setting it to `0`. Below are ways to change this setting:

1. Change at the session level: `SET idle_in_transaction_session_timeout = 0;`

2. Change at the database level: `ALTER DATABASE <dbname> SET idle_in_transaction_session_timeout = 0;` (replace `<dbname>` with the name of your database)

3. Change at the role level: `ALTER ROLE <role> SET idle_in_transaction_session_timeout = 0;` (replace `<role>` with the name of the user role)

Be aware that leaving transactions idle for extended periods can prevent vacuuming and increase the number of open connections. Please use caution and consider only changing the value temporarily, as needed.

<NeedHelp/>

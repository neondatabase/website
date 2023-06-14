---
title: Connection errors
subtitle: Learn how to resolve connection errors
enableTableOfContents: true
redirectFrom:
  - /docs/how-to-guides/connectivity-issues
  - /docs/connect/connectivity-issues
---

This topic describes how to resolve connection errors you may encounter when using Neon. The errors covered include:

- [The endpoint ID is not specified](#the-endpoint-id-is-not-specified)
- [Password authentication failed for user](#password-authentication-failed-for-user)
- [Couldn't connect to compute node](#couldnt-connect-to-compute-node)
- [Can't reach database server](#cant-reach-database-server)
- [Error undefined: Database error](#error-undefined-database-error)

## The endpoint ID is not specified

With older clients and some native PostgreSQL clients, you may receive the following error when attempting to connect to Neon:

<CodeBlock shouldWrap>

```txt
ERROR: The endpoint ID is not specified. Either upgrade the PostgreSQL client library (libpq) for SNI support or pass the endpoint ID (the first part of the domain name) as a parameter: '&options=endpoint%3D'. See [https://neon.tech/sni](https://neon.tech/sni) for more information.
```

</CodeBlock>

This error occurs if your client library or application does not support the **Server Name Indication (SNI)** mechanism in TLS.

Neon uses compute endpoint IDs (the first part of a Neon domain name) to route incoming connections. However, the PostgreSQL wire protocol does not transfer domain name information, so Neon relies on the Server Name Indication (SNI) extension of the TLS protocol to do this.

SNI support was added to the `libpq` (the official PostgreSQL client library) in version 14, which was released in September 2021. Clients that use your system's `libpq` library should work if you `libpq` version is >= 14. On Linux and macOS, you can check your `libpq` version by running `pg_config --version`. On Windows, check the `libpq.dll` version in your PostgreSQL installation's `bin` directory. Right click on the file, select **Properties** > **Details**.  

If a library or application upgrade does not help, there are several workarounds, described below, for providing the required domain name information when connecting to Neon.

### A. Pass the endpoint ID as an option

Neon supports a connection option named `endpoint`, which you can use to identify the compute endpoint you are connecting to. Specifically, you can add `options=endpoint%3Dep-mute-recipe-123456` as a parameter to your connection string, as shown in the example below. The `%3D` is a URL-encoded `=` sign.

<CodeBlock shouldWrap>

```txt
postgres://<user>:<password>@ep-mute-recipe-123456.us-east-2.aws.neon.tech/neondb?options=endpoint%3Dep-mute-recipe-123456
```

</CodeBlock>

<Admonition type="note">
The `endpoint` connection option was previously named `project`. The `project` option is deprecated but remains supported for backward compatibility.
</Admonition>

The `endpoint` option works if your application or library permits it to be set. Not all of them do, especially in the case of GUI applications.

### B. Use libpq key=value syntax in the database field

If your application or client is based on `libpq` but you cannot upgrade the library, such as when the library is compiled inside of a an application, you can take advantage of the fact that `libpq` permits adding options to the database name. So, in addition to the database name, you can specify the `endpoint` option, as shown below. Replace `<endpoint_id>` with your compute's endpoint ID, which you can find in your Neon connection string. It looks similar to this: `ep-mute-recipe-123456`.

```txt
dbname=neondb options=endpoint=<endpoint_id>
```

### C. Set verify-full for golang-based clients

If your application or service uses golang PostgreSQL clients like `pgx` and `lib/pg`, you can set `sslmode=verify-full`, which causes SNI information to be sent when you connect. Most likely, this behavior is not intended but happens inadvertently due to the golang's TLS library API design.

### D. Specify the endpoint ID in the password field

As a last resort, you can try specifying the endpoint ID in the password field. So, instead of specifying only your password, you provide a string consisting of the `endpoint` option and the password, as shown. Replace `<endpoint_id>` with your compute's endpoint ID, which you can find in your Neon connection string. It looks similar to this: `ep-mute-recipe-123456`.

```txt
endpoint=<endpoint_id>;<password>
```

This approach is the least secure of the recommended workarounds. It causes the authentication method to be downgraded from `scram-sha-256` (never transfers a plain text password) to `password` (transfers a plain text password). However, the connection is still TLS-encrypted, so the level of security is equivalent to the security provided by `https` websites. We intend deprecate this option when most libraries and applications provide SNI support.

### Libraries

Clients on the [list of drivers](https://wiki.postgresql.org/wiki/List_of_drivers) on the PostgreSQL community wiki that use your system's `libpq` library should work if your `libpq` version is >= 14.

Neon has tested the following drivers for SNI support:

| Driver            | Language    | SNI Support | Notes                                                                                                                                             |
| ----------------- | ----------- | -------------|-------------------------------------------------------------------------------------------------------------------------------------------------- |
| npgsql            | C#          | &check;      |                                                                                                                                                   |
| Postgrex          | Elixir      | &check;      | [Requires ssl_opts with server_name_indication](https://neon.tech/docs/guides/elixir-ecto#configure-ecto)                                         |
| github.com/lib/pq | Go          | &check;      | Supported with macOS Build 436, Windows Build 202, and Ubuntu 20, 21 and 22                                                                       |
| pgx               | Go          | &check;     | SNI support merged with v5.0.0-beta.3 yet                                                                                                            |
| go-pg             | Go          | &check;      | requires `verify-full` mode                                                                                                                       |
| JDBC              | Java        | &check;      |                                                                                                                                                   |
| node-postgres     | JavaScript  | &check;      | Requires the `ssl: {'sslmode': 'require'}` option                                                                                                 |
| postgres.js       | JavaScript  | &check;      | Requires the `ssl: 'require'` option                                                                                                              |
| asyncpg           | Python      | &check;      |                                                                                                                                                   |
| pg8000            | Python      | &check;      | Requires [scramp >= v1.4.3](https://pypi.org/project/scramp/), which is included in [pg8000 v1.29.3](https://pypi.org/project/pg8000/) and higher |
| PostgresClientKit | Swift       | &#x2717;     |                                                                                                                                                   |
| PostgresNIO       | Swift       | &check;      |                                                                                                                                                   |
| postgresql-client | TypeScript  | &check;      |                                                                                                                                                   |

## Password authentication failed for user

The following error is often the result of an incorrectly defined connection information, or the driver you are using does not support Server Name Indication (SNI).

<CodeBlock shouldWrap>

```text
ERROR:  password authentication failed for user '<user_name>' connection to server at "ep-billowing-fun-123456.us-west-2.aws.neon.tech" (12.345.67.89), port 5432 failed: ERROR:  connection is insecure (try using `sslmode=require`)
```

</CodeBlock>

Check your connection to see if it is defined correctly. Your Neon connection string can be obtained from the **Connection Details** widget on the Neon **Dashboard**. It appears similar to this:

<CodeBlock shouldWrap>

```text
postgres://daniel:f98wh99w398h@ep-white-morning-123456.us-east-2.aws.neon.tech/neondb
```

</CodeBlock>

For clients or applications that require specifying connection parameters such as user, password, and hostname separately, the values in a Neon connection string correspond to the following:

- **User**: `daniel`
- **Password**: `f74wh99w398H`
- **Hostname**: `ep-white-morning-123456.us-east-2.aws.neon.tech`
- **Port number**: `5432` (Neon uses default PostgreSQL port, `5432`, and is therefore not included in the connection string)
- **Database name**: `neondb` (`neondb` is the default database created with each Neon project. Your database name may differ.)

If you find that your connection string is defined correctly, see the instructions regarding SNI support outlined in the preceding section: [The endpoint ID is not specified](#the-endpoint-id-is-not-specified).

## Couldn't connect to compute node

This error arises when the Neon proxy, which accepts and handles connections from clients that use the PostgreSQL protocol, fails to establish a connection with your compute. This issue sometimes occurs due to repeated connection attempts during the compute's restart phase after it has been idle due to [Auto-suspension](../reference/glossary#auto-suspend-compute) (scale to zero). Currently, the transition from an idle state to an active takes a few seconds, excluding any external factors that might increase connection latency.

Consider these recommended steps:

- Visit the [Neon status page](https://neonstatus.com/) to ensure there are no ongoing issues.
- Pause for a short period to allow your compute to restart, then try reconnecting.
- Try [connecting with psql](https://neon.tech/docs/connect/query-with-psql-editor) to see if a connection can be established.
- Review the strategies in [Connection latency and timeouts](https://neon.tech/docs/connect/connection-latency) for avoiding connection issues due to compute startup time.

If the connection issue persists, please reach out to [Support](https://neon.tech/docs/introduction/support).

## Can't reach database server

This error is sometimes encountered when using Prisma Client with Neon.

<CodeBlock shouldWrap>

```text
Error: P1001: Can't reach database server at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`
Please make sure your database server is running at `ep-white-thunder-826300.us-east-2.aws.neon.tech`:`5432`.
```

</CodeBlock>

A compute node in Neon has two main states: **Active** and **Idle**. Active means that PostgreSQL is currently running. If there are no active queries for 5 minutes, the activity monitor gracefully places the compute node into an idle state to save energy and resources.

When you connect to an idle compute, Neon automatically activates it. Activation typically happens within a few seconds. If the error above is reported, it most likely means that the Prisma query engine timed out before your Neon compute was activated. For dealing with this connection timeout scenario, refer to the [connection timeout](../guides/prisma#connection-timeouts) instructions in our Prisma documentation. Our [connection latency and timeout](../connect/connection-latency) documentation may also be useful in addressing this issue.

## Error undefined: Database error

This error is sometimes encountered when using Prisma Migrate with Neon.

```text
Error undefined: Database error
Error querying the database: db error: ERROR: prepared statement
"s0" already exists
```

Prisma Migrate requires a direct connection to the database. It does not support a pooled connection with PgBouncer, which is the connection pooler used by Neon. Attempting to run Prisma Migrate commands, such as `prisma migrate dev`, with a pooled connection causes this error. To resolve this issue, please refer to our [Prisma Migrate with PgBouncer](../guides/prisma-migrate#prisma-migrate-with-pgbouncer) instructions.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).

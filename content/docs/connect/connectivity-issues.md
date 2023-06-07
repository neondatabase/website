---
title: Connection errors
subtitle: Learn how to resolve commonly encountered connection errors
enableTableOfContents: true
redirectFrom:
  - /docs/how-to-guides/connectivity-issues
---

This topic describes commonly encountered connection errors and how to resolve them. The connection errors addressed in this topic include:

- [Error: The endpoint ID is not specified](#error-the-endpoint-id-is-not-specified)
- [Error: password authentication failed for user](#error-password-authentication-failed-for-user)

## Error: The endpoint ID is not specified

With older clients and some native PostgreSQL clients, you may receive the following error:

<CodeBlock shouldWrap>

```txt
ERROR: The endpoint ID is not specified. Either upgrade the PostgreSQL client library (libpq) for SNI support or pass the endpoint ID (the first part of the domain name) as a parameter: '&options=endpoint%3D'. See [https://neon.tech/sni](https://neon.tech/sni) for more information.
```

</CodeBlock>

This error occurs if your client library or application does not support the **Server Name Indication (SNI)** mechanism in TLS.

Neon uses compute endpoint IDs (the first part of the domain name) to route incoming connections. However, the PostgreSQL wire protocol does not transfer domain name information, so Neon relies on the Server Name Indication (SNI) extension of the TLS protocol to do this.

SNI support was added to the `libpq` (the official PostgreSQL client library) in version 14, released in September 2021. Clients that use your system's `libpq` library should work if the version is >= 14. On Linux and macOS, you can check your `libpq` version by running `pg_config --version`. On Windows, check the `libpq.dll` version in your PostgreSQL installation's `bin` directory. Right click, select **Properties** > **Details**.  

If a library or application upgrade does not help, there are several workarounds for providing the required domain name information when connecting to Neon. The workarounds are described below.

### A. Pass the endpoint ID as an option

We support a special connection option named `endpoint`, which you can set to identify the compute endpoint you are connecting to. Specifically, you can pass `options=endpoint%3Dep-mute-recipe-239816` as a parameter in the connection string. The `%3D` is a URL-encoded `=`.

<Admonition type="note">
The special connection option was previously named `project`. The `project` option is deprecated but remains supported for backward compatibility.
</Admonition>

For example, instead of the following connection string:

<CodeBlock shouldWrap>

```txt
postgres://<user>:<password>@ep-mute-recipe-239816.us-east-2.aws.neon.tech/main
```

</CodeBlock>

You would use this one:

<CodeBlock shouldWrap>

```txt
postgres://<user>:<password>@ep-mute-recipe-239816.us-east-2.aws.neon.tech/main?options=endpoint%3Dep-mute-recipe-239816
```

</CodeBlock>

The `endpoint` option works if your application or library permits it to be set. But not all of them do, especially in the case of GUI applications.

### B. Use libpq key=value syntax in the database field

If your application or client is based on `libpq` but you cannot upgrade the library, such as when the library is compiled inside of a an application, you can take advantage of the fact that `libpq` permits adding options to the database name. So, in addition to the database name, you can specify the `endpoint` option, as shown. Replace `<endpoint_id>` with your compute's endpoint ID, which you can find in your Neon connection string. It looks similar to this: `ep-mute-recipe-239816`.

```txt
dbname=neondb options=endpoint=<endpoint_id>
```

### C. Set verify-full for golang-based clients

If your application or service uses golang PostgreSQL clients like `pgx` and `lib/pg`, you can set `sslmode=verify-full`, which causes SNI information to be sent when you connect. Most likely, this behavior is not intended but happens inadvertently due to the golang's TLS library API design.

### D. Specify the endpoint ID in the password field

As a last resort, you can try specifying the endpoint ID in the password field. So, instead of specifying only your password, you provide string consisting of the `endpoint` option and the password, as shown. Replace `<endpoint_id>` with your compute's endpoint ID, which you can find in your Neon connection string. It looks similar to this: `ep-mute-recipe-239816`.

```txt
endpoint=<endpoint_id>;<password>
```

This approach is the least secure of the recommended workarounds. It causes the authentication method to be downgraded from `scram-sha-256` (never transfers a plain text password) to `password` (transfers a plain text password). However, the connection is still TLS-encrypted, so the level of security is equivalent to the security provided by `https` websites. We intend deprecate this option when most libraries and applications provide SNI support.

### Libraries

Clients from the [list of drivers](https://wiki.postgresql.org/wiki/List_of_drivers) on the PostgreSQL community wiki that use your system's `libpq` library should work if the version is >= 14.

Native client libraries:

| Driver            | Language    | Supports SNI                                                                                                                                                |
| ----------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| npgsql            | C#          | &check;                                                                                                                                                     |
| Postmodern        | Common Lisp |                                                                                                                                                             |
| crystal-pg        | Crystal     |                                                                                                                                                             |
| Postgrex          | Elixir      | &check; ([configure ssl_opts with server_name_indication](https://hexdocs.pm/postgrex/Postgrex.html#start_link/1-ssl-client-authentication))                |
| epgsql            | Erlang      |                                                                                                                                                             |
| pgo               | Erlang      |                                                                                                                                                             |
| github.com/lib/pq | Go          | &#x2717; (SNI support is in review)                                                                                                                         |
| pgx               | Go          | &#x2717; (SNI support is merged, not released yet)                                                                                                          |
| go-pg             | Go          |  &check; (requires `verify-full` mode)                                                                                                                          |
| JDBC              | Java        | &check;                                                                                                                                                     |
| R2DBC             | Java        |                                                                                                                                                             |
| node-postgres     | JavaScript  | &check; when `ssl: {'sslmode': 'require'}` option passed                                                                                                    |
| postgres.js       | JavaScript  | &check; when `ssl: 'require'` option passed                                                                                                                 |
| pgmoon            | Lua         |                                                                                                                                                             |
| asyncpg           | Python      | &check;                                                                                                                                                     |
| pg8000            | Python      | &check; (requires [scramp >= v1.4.3](https://pypi.org/project/scramp/), which is included in [pg8000 v1.29.3](https://pypi.org/project/pg8000/) and higher) |
| rust-postgres     | Rust        |                                                                                                                                                             |
| PostgresClientKit | Swift       | &#x2717;                                                                                                                                                    |
| PostgresNIO       | Swift       | &check;                                                                                                                                                     |
| postgresql-client | TypeScript  | &check;                                                                                                                                                     |

## Error: password authentication failed for user

The following error is often the result of an incorrectly defined connection string or connection details.

<CodeBlock shouldWrap>

```text
ERROR:  password authentication failed for user '<user_name>' connection to server at "ep-billowing-fun-123456.us-west-2.aws.neon.tech" (12.345.67.89), port 5432 failed: ERROR:  connection is insecure (try using `sslmode=require`)
```

</CodeBlock>

Your Neon connection string can be obtained from the **Connection Details** widget on the Neon Dashboard. It appears similar to this:

<CodeBlock shouldWrap>

```text
postgres://daniel:f98wh99w398h@ep-white-morning-123456.us-east-2.aws.neon.tech/neondb
```

</CodeBlock>

For clients or applications that require specifying connection details individually, the values in the connection string correspond to the following:

- User: `daniel`
- Password: `f74wh99w398H`
- Hostname: `ep-white-morning-123456.us-east-2.aws.neon.tech`
- Port number: `5432` (Neon uses default PostgreSQL port, `5432`, and is therefore not included in the connection string)
- Database name: `neondb` (The `neondb` is the default database created with each Neon project. You database name may differ.)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).

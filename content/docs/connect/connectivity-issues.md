---
title: Connect from old clients
enableTableOfContents: true
redirectFrom:
  - /docs/how-to-guides/connectivity-issues
---

In most cases, copying a connection string from the Neon **Dashboard** and using it in your project should work as is. However, with older clients and some native PostgreSQL clients, you may receive the following error:

```txt
ERROR: The endpoint ID is not specified. Either upgrade the PostgreSQL client library (libpq) for SNI support or pass the endpoint ID (the first part of the domain name) as a parameter: '&options=project%3D'. See [https://neon.tech/sni](https://neon.tech/sni) for more information.
```

In most cases, this happens if your client library or application does not support the **SNI (Server Name Indication)** mechanism in TLS. See [How Neon routes connections](#how-neon-routes-connections) for more context and [Workarounds](#workarounds) for a list of ways to work around the SNI requirement.

## How Neon routes connections

Neon uses different compute endpoint domain names to route incoming connections. For example, to connect to the compute endpoint `ep-mute-recipe-239816`, we ask you to connect to `ep-mute-recipe-239816.us-east-2.aws.neon.tech`. However, the PostgreSQL wire protocol does not transfer the server domain name, so we rely on the SNI (Server Name Indication) extension of the `TLS` protocol, which allows a client to indicate what domain name it is attempting to connect to. This is the same mechanism that allows hosting several `https`-enabled websites on a single IP address. `SNI` support was added to the `libpq` (an official PostgreSQL client library) in version 14, released in September 2021. All `libpq`-based clients like Python's `psycopg2` and Ruby's `ruby-pg` should work if the system `libpq`  version is >= 14.

## Workarounds

If you encounter a `Project ID is not specified` error and a library or application upgrade does not help, we provide several fallback options. When SNI domain name information is missing, we need to obtain this information through other means.

### A. Pass the endpoint ID as an option

We support a special connection option named `project`, which you can set to identify the compute endpoint you are connecting to. Specifically, you can set pass `options=project%3Dmy-endpoint-123456` as a `GET` parameter in the connection string. The `%3D` is a URL-encoded `=`.

For example, instead of the following connection string:

```txt
postgres://<user>:<password>@my-endpoint-123456.us-east-2.aws.neon.tech/main
```

You would use this one:

```txt
postgres://<user>:<password>@my-endpoint-123456.us-east-2.aws.neon.tech/main?options=project%3Dmy-endpoint-123456
```

The `project` option is expected to work if your application or library permits it to be set. But not all of them do, especially in the case of GUI applications.

### B. Use libpq key=value syntax in the database field

If your application or client is `libpq`-based and you can't easily upgrade the library, such as when the library is compiled inside of a pre-built application, you can take advantage of the fact that `libpq` permits adding options to the database name. So, instead of only the database name, you can specify:

```txt
dbname=main options=project=<endpoint_id>
```

This workaround is expected to work with all `libpq`-based applications.

### C. Set verify-full for golang-based clients

If your application or service uses golang PostgreSQL clients like `pgx` and `lib/pg`, you can set `sslmode=verify-full,` which causes `SNI` information to be sent. Most likely, this behavior is not intentional but happens inadvertently due to the golang's TLS library API design.

### D. Specify the endpoint ID in the password field

You can specify the endpoint ID in the password field as a last resort. So, instead of your actual password, you can define a string consisting of the endpoint and the password. For example:

```txt
project=ep-mute-recipe-239816;<password>
```

This approach is the least secure of all the recommended workarounds. It causes the authentication method to be downgraded from `scram-sha-256` (never transfers a plain text password) to `password` (transfers a plain text password) on the fly. The connection is still TLS-encrypted, so the amount of security is the same as with `https` websites. However, we intend deprecate this option when most libraries and applications provide `SNI` support.

## Applications

| Application                                                                        | SNI support | Comment                                                                                                                          |
| ---------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [TablePlus](https://tableplus.com)                                                 | &check;          | SNI support on macOS since build 436, and on Windows since build 202. No SNI support on Linux currently. For older versions, Workaround B is applicable. |
| [Postico](https://eggerapps.at/postico/)                                           | &check;          | SNI support since v1.5.21. For older versions, Workaround B is applicable.                                                       |
| [PopSQL](https://popsql.com/)                                                      | &#x2717;          | No SNI support. Workaround D helps.                                                                                              |
| [Grafana pg source](https://grafana.com/docs/grafana/latest/datasources/postgres/) | &check; / &#x2717;     | Workaround C. SNI works if `sslmode=verify-full` as with other golang libraries                                                    |
| [PgAdmin 4](https://www.pgadmin.org/)                                              | &check;          |                                                                                                                                  |
| [DataGrip](https://www.jetbrains.com/datagrip/)                                    | &check;          |                                                                                                                                  |

## Libraries

`libpq`-based clients from this list are expected to work with the system `libpq`, version >= 14: [https://wiki.postgresql.org/wiki/List_of_drivers](https://wiki.postgresql.org/wiki/List_of_drivers)

Native client libraries:

| Driver            | Language    | Supports SNI                                             |
| ----------------- | ----------- | -------------------------------------------------------- |
| npgsql            | C#          | &check;                                                      |
| Postmodern        | Common Lisp |                                                          |
| crystal-pg        | Crystal     |                                                          |
| Postgrex          | Elixir      | &check; ([configure ssl_opts with server_name_indication](https://hexdocs.pm/postgrex/Postgrex.html#start_link/1-ssl-client-authentication)) |
| epgsql            | Erlang      |                                                          |
| pgo               | Erlang      |                                                          |
| github.com/lib/pq | Go          | &#x2717; (SNI support is in review)                            |
| pgx               | Go          | &#x2717; (SNI support is merged, not released yet)             |
| go-pg             | Go          | &#x2717; (except verify-full mode)                             |
| JDBC              | Java        | &check;                                                      |
| R2DBC             | Java        |                                                          |
| node-postgres     | JavaScript  | &check; when `ssl: {'sslmode': 'require'}` option passed     |
| postgres.js       | JavaScript  | &#x2717;                                                       |
| pgmoon            | Lua         |                                                          |
| asyncpg           | Python      | &check;                                                      |
| pg8000            | Python      | &check; (requires [scramp >= v1.4.3](https://pypi.org/project/scramp/), which is included in [pg8000 v1.29.3](https://pypi.org/project/pg8000/) and higher)  |
| rust-postgres     | Rust        |                                                          |
| PostgresClientKit | Swift       | &#x2717;                                                       |
| PostgresNIO       | Swift       | &check;                                                      |
| postgresql-client | TypeScript  | &check;                                                      |

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).

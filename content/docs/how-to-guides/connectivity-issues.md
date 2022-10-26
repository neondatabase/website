---
title: Connecting with older clients
enableTableOfContents: true
---

## Overview

In most cases, copy-pasting `Connection string` from the project's dashboard and using it in your project should work as is. However, with older clients and some native PostgreSQL clients, you may receive the following error:

```txt
ERROR: The project ID is not specified. Either upgrade the PostgreSQL client library (libpq) for SNI support or pass the project ID (the first part of the domain name) as a parameter: '&options=project%3D'. See [https://neon.tech/sni](https://neon.tech/sni) for more information.
```

In most cases, this happens if your client library or app does not support the so-called **SNI (Server Name Indication)** mechanism in TLS. See [#Details](Details) for more context and [#Workarounds](Workarounds) for a list of ways to get around this issue.

## Details

To route incoming connections, we use different domain names for different projects, e.g., to connect to the project `mute-recipe-239816`, we ask you to connect to _**mute-recipe-239816.cloud.neon.tech**_. However, the PostgreSQL wire protocol does not transfer the server domain name, so we rely on the so-called **SNI (Server Name Indication)** extension of the `TLS` protocol, which allows a client to indicate what domain name it is attempting to connect to. That is the same mechanism that allows hosting several `https`-enabled websites on a single IP address. `SNI` support was added to the `libpq` (an official PostgreSQL client library) in version 14, released in September 2021. All `libpq`-based clients like Python's `psycopg2` and Ruby's `ruby-pg` should work if `libpq` in the system has a version >= 14.

## Workarounds

If you encounter a Project ID is not specified error and a library or application upgrade does not help, we provide several fallback options. When SNI domain name information is missing, we need to obtain this information through other means.

### A. Pass project ID in options

We support a special connection option named `project,` which you can set to identify the cluster you are connecting to. More specifically, you can set pass `options=project%3Dmy-project-123` as a GET parameter in the connection string. `%3D` here is an url-encoded `=`.

For example, instead of the following connection string:

```txt
postgres://login:pass@my-project-123.cloud.neon.tech/main
```

you can use that one:

```txt
postgres://login:pass@my-project-123.cloud.neon.tech/main?options=project%3Dmy-project-123
```

This option is expected to always work if your app/library allow to set. But not all of them do, especially in the case of GUI apps.

### B. Use libpq key=value syntax in the database field

If your app or client is `libpq` based and you can't easily upgrade the library (e.g., when the library is compiled inside of some pre-build application), you can use the fact that libpq can expand the database name to different options. So instead of the database name, you can specify:

```txt
dbname=main options=project=<project ID>
```

in the database field.

This option is expected to work with all libpq-based apps.

### C. Set verify-full for golang-based clients

If your application or service uses golang PostgreSQL clients like `pgx` and `lib/pg` you can set `sslmode=verify-full,` which will cause `SNI` info to be sent. Most likely, this was not intentional but happened inadvertently due to the golang's TLS library API design.

### D. Specify the project ID in the password field

You can specify the project ID in the password field as a last resort. So, instead of your actual password (for example, 'my-pass'), you can set the following string, consisting of the project ID and the password:

```txt
project=mute-recipe-239816;my-pass
```

That approach is the most invasive option out of all workarounds. It causes the auth method to be downgraded from `scram-sha-256` (never transfers plain text password) to `password` (transfers plain text password) on the fly. Connection will still only happen over TLS-encrypted connection, so the amount of security will be the same as with `https` websites. However, we want to deprecate this option when most libraries and apps adopt `SNI.`

## Applications

| Application                                                                        | SNI support | Comment                                                                                                                          |
| ---------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [TablePlus](https://tableplus.com)                                                 | ✅          | SNI support on macOS since build 436, on Windows since build 202, TBD for Linux. For older versions, Workaround B is applicable. |
| [Postico](https://eggerapps.at/postico/)                                           | ✅          | SNI support since v1.5.21. For older versions, Workaround B is applicable.                                                       |
| [PopSQL](https://popsql.com/)                                                      | ❌          | No SNI support. Workaround D helps.                                                                                              |
| [Grafana pg source](https://grafana.com/docs/grafana/latest/datasources/postgres/) | ✅ / ❌     | Workaround C. SNI works if sslmode=verify-full as with other golang libraries                                                    |
| [PgAdmin 4](https://www.pgadmin.org/)                                              | ✅          |                                                                                                                                  |
| [DataGrip](https://www.jetbrains.com/datagrip/)                                    | ✅          |                                                                                                                                  |

## Libraries

libpq-based clients from this list [https://wiki.postgresql.org/wiki/List_of_drivers](https://wiki.postgresql.org/wiki/List_of_drivers) are expected to work with system `libpq` version >= 14.

List of native client libraries:

| Driver            | Language    | Supports SNI                                             |
| ----------------- | ----------- | -------------------------------------------------------- |
| npgsql            | C#          | yes                                                      |
| Postmodern        | Common Lisp |                                                          |
| crystal-pg        | Crystal     |                                                          |
| Postgrex          | Elixir      |                                                          |
| epgsql            | Erlang      |                                                          |
| pgo               | Erlang      |                                                          |
| github.com/lib/pq | Go          | no (SNI support is in review)                            |
| pgx               | Go          | no (SNI support is merged, not relesed yet)              |
| go-pg             | Go          | no (except verify-full mode)                             |
| JDBC              | Java        | yes                                                      |
| R2DBC             | Java        |                                                          |
| node-postgres     | JavaScript  |                                                          |
| postgres.js       | JavaScript  | no                                                       |
| pgmoon            | Lua         |                                                          |
| asyncpg           | Python      | yes                                                      |
| pg8000            | Python      | [tricky](https://github.com/neondatabase/neon/pull/2008) |
| rust-postgres     | Rust        |                                                          |
| PostgresClientKit | Swift       | yes                                                      |
| PostgresNIO       | Swift       |                                                          |
| postgresql-client | TypeScript  | yes                                                      |

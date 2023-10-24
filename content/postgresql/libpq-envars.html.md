<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|           34.15. Environment Variables           |                                                  |                               |                                                       |                                                       |
| :----------------------------------------------: | :----------------------------------------------- | :---------------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](libpq-events.html "34.14. Event System")  | [Up](libpq.html "Chapter 34. libpq — C Library") | Chapter 34. libpq — C Library | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](libpq-pgpass.html "34.16. The Password File") |

***

## 34.15. Environment Variables [#](#LIBPQ-ENVARS)

[]()

The following environment variables can be used to select default connection parameter values, which will be used by [`PQconnectdb`](libpq-connect.html#LIBPQ-PQCONNECTDB), [`PQsetdbLogin`](libpq-connect.html#LIBPQ-PQSETDBLOGIN) and [`PQsetdb`](libpq-connect.html#LIBPQ-PQSETDB) if no value is directly specified by the calling code. These are useful to avoid hard-coding database connection information into simple client applications, for example.

*   []()`PGHOST` behaves the same as the [host](libpq-connect.html#LIBPQ-CONNECT-HOST) connection parameter.
*   []()`PGHOSTADDR` behaves the same as the [hostaddr](libpq-connect.html#LIBPQ-CONNECT-HOSTADDR) connection parameter. This can be set instead of or in addition to `PGHOST` to avoid DNS lookup overhead.
*   []()`PGPORT` behaves the same as the [port](libpq-connect.html#LIBPQ-CONNECT-PORT) connection parameter.
*   []()`PGDATABASE` behaves the same as the [dbname](libpq-connect.html#LIBPQ-CONNECT-DBNAME) connection parameter.
*   []()`PGUSER` behaves the same as the [user](libpq-connect.html#LIBPQ-CONNECT-USER) connection parameter.
*   []()`PGPASSWORD` behaves the same as the [password](libpq-connect.html#LIBPQ-CONNECT-PASSWORD) connection parameter. Use of this environment variable is not recommended for security reasons, as some operating systems allow non-root users to see process environment variables via ps; instead consider using a password file (see [Section 34.16](libpq-pgpass.html "34.16. The Password File")).
*   []()`PGPASSFILE` behaves the same as the [passfile](libpq-connect.html#LIBPQ-CONNECT-PASSFILE) connection parameter.
*   []()`PGREQUIREAUTH` behaves the same as the [require\_auth](libpq-connect.html#LIBPQ-CONNECT-REQUIRE-AUTH) connection parameter.
*   []()`PGCHANNELBINDING` behaves the same as the [channel\_binding](libpq-connect.html#LIBPQ-CONNECT-CHANNEL-BINDING) connection parameter.
*   []()`PGSERVICE` behaves the same as the [service](libpq-connect.html#LIBPQ-CONNECT-SERVICE) connection parameter.
*   []()`PGSERVICEFILE` specifies the name of the per-user connection service file (see [Section 34.17](libpq-pgservice.html "34.17. The Connection Service File")). Defaults to `~/.pg_service.conf`, or `%APPDATA%\postgresql\.pg_service.conf` on Microsoft Windows.
*   []()`PGOPTIONS` behaves the same as the [options](libpq-connect.html#LIBPQ-CONNECT-OPTIONS) connection parameter.
*   []()`PGAPPNAME` behaves the same as the [application\_name](libpq-connect.html#LIBPQ-CONNECT-APPLICATION-NAME) connection parameter.
*   []()`PGSSLMODE` behaves the same as the [sslmode](libpq-connect.html#LIBPQ-CONNECT-SSLMODE) connection parameter.
*   []()`PGREQUIRESSL` behaves the same as the [requiressl](libpq-connect.html#LIBPQ-CONNECT-REQUIRESSL) connection parameter. This environment variable is deprecated in favor of the `PGSSLMODE` variable; setting both variables suppresses the effect of this one.
*   []()`PGSSLCOMPRESSION` behaves the same as the [sslcompression](libpq-connect.html#LIBPQ-CONNECT-SSLCOMPRESSION) connection parameter.
*   []()`PGSSLCERT` behaves the same as the [sslcert](libpq-connect.html#LIBPQ-CONNECT-SSLCERT) connection parameter.
*   []()`PGSSLKEY` behaves the same as the [sslkey](libpq-connect.html#LIBPQ-CONNECT-SSLKEY) connection parameter.
*   []()`PGSSLCERTMODE` behaves the same as the [sslcertmode](libpq-connect.html#LIBPQ-CONNECT-SSLCERTMODE) connection parameter.
*   []()`PGSSLROOTCERT` behaves the same as the [sslrootcert](libpq-connect.html#LIBPQ-CONNECT-SSLROOTCERT) connection parameter.
*   []()`PGSSLCRL` behaves the same as the [sslcrl](libpq-connect.html#LIBPQ-CONNECT-SSLCRL) connection parameter.
*   []()`PGSSLCRLDIR` behaves the same as the [sslcrldir](libpq-connect.html#LIBPQ-CONNECT-SSLCRLDIR) connection parameter.
*   []()`PGSSLSNI` behaves the same as the [sslsni](libpq-connect.html#LIBPQ-CONNECT-SSLSNI) connection parameter.
*   []()`PGREQUIREPEER` behaves the same as the [requirepeer](libpq-connect.html#LIBPQ-CONNECT-REQUIREPEER) connection parameter.
*   []()`PGSSLMINPROTOCOLVERSION` behaves the same as the [ssl\_min\_protocol\_version](libpq-connect.html#LIBPQ-CONNECT-SSL-MIN-PROTOCOL-VERSION) connection parameter.
*   []()`PGSSLMAXPROTOCOLVERSION` behaves the same as the [ssl\_max\_protocol\_version](libpq-connect.html#LIBPQ-CONNECT-SSL-MAX-PROTOCOL-VERSION) connection parameter.
*   []()`PGGSSENCMODE` behaves the same as the [gssencmode](libpq-connect.html#LIBPQ-CONNECT-GSSENCMODE) connection parameter.
*   []()`PGKRBSRVNAME` behaves the same as the [krbsrvname](libpq-connect.html#LIBPQ-CONNECT-KRBSRVNAME) connection parameter.
*   []()`PGGSSLIB` behaves the same as the [gsslib](libpq-connect.html#LIBPQ-CONNECT-GSSLIB) connection parameter.
*   []()`PGGSSDELEGATION` behaves the same as the [gssdelegation](libpq-connect.html#LIBPQ-CONNECT-GSSDELEGATION) connection parameter.
*   []()`PGCONNECT_TIMEOUT` behaves the same as the [connect\_timeout](libpq-connect.html#LIBPQ-CONNECT-CONNECT-TIMEOUT) connection parameter.
*   []()`PGCLIENTENCODING` behaves the same as the [client\_encoding](libpq-connect.html#LIBPQ-CONNECT-CLIENT-ENCODING) connection parameter.
*   []()`PGTARGETSESSIONATTRS` behaves the same as the [target\_session\_attrs](libpq-connect.html#LIBPQ-CONNECT-TARGET-SESSION-ATTRS) connection parameter.
*   []()`PGLOADBALANCEHOSTS` behaves the same as the [load\_balance\_hosts](libpq-connect.html#LIBPQ-CONNECT-LOAD-BALANCE-HOSTS) connection parameter.

The following environment variables can be used to specify default behavior for each PostgreSQL session. (See also the [ALTER ROLE](sql-alterrole.html "ALTER ROLE") and [ALTER DATABASE](sql-alterdatabase.html "ALTER DATABASE") commands for ways to set default behavior on a per-user or per-database basis.)

*   []()`PGDATESTYLE` sets the default style of date/time representation. (Equivalent to `SET datestyle TO ...`.)
*   []()`PGTZ` sets the default time zone. (Equivalent to `SET timezone TO ...`.)
*   []()`PGGEQO` sets the default mode for the genetic query optimizer. (Equivalent to `SET geqo TO ...`.)

Refer to the SQL command [SET](sql-set.html "SET") for information on correct values for these environment variables.

The following environment variables determine internal behavior of libpq; they override compiled-in defaults.

*   []()`PGSYSCONFDIR` sets the directory containing the `pg_service.conf` file and in a future version possibly other system-wide configuration files.
*   []()`PGLOCALEDIR` sets the directory containing the `locale` files for message localization.

***

|                                                  |                                                       |                                                       |
| :----------------------------------------------- | :---------------------------------------------------: | ----------------------------------------------------: |
| [Prev](libpq-events.html "34.14. Event System")  |    [Up](libpq.html "Chapter 34. libpq — C Library")   |  [Next](libpq-pgpass.html "34.16. The Password File") |
| 34.14. Event System                              | [Home](index.html "PostgreSQL 17devel Documentation") |                              34.16. The Password File |

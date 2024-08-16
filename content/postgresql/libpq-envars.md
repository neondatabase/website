[#id](#LIBPQ-ENVARS)

## 34.15. Environment Variables [#](#LIBPQ-ENVARS)

The following environment variables can be used to select default connection parameter values, which will be used by [`PQconnectdb`](libpq-connect#LIBPQ-PQCONNECTDB), [`PQsetdbLogin`](libpq-connect#LIBPQ-PQSETDBLOGIN) and [`PQsetdb`](libpq-connect#LIBPQ-PQSETDB) if no value is directly specified by the calling code. These are useful to avoid hard-coding database connection information into simple client applications, for example.

- `PGHOST` behaves the same as the [host](libpq-connect#LIBPQ-CONNECT-HOST) connection parameter.

- `PGHOSTADDR` behaves the same as the [hostaddr](libpq-connect#LIBPQ-CONNECT-HOSTADDR) connection parameter. This can be set instead of or in addition to `PGHOST` to avoid DNS lookup overhead.

- `PGPORT` behaves the same as the [port](libpq-connect#LIBPQ-CONNECT-PORT) connection parameter.

- `PGDATABASE` behaves the same as the [dbname](libpq-connect#LIBPQ-CONNECT-DBNAME) connection parameter.

- `PGUSER` behaves the same as the [user](libpq-connect#LIBPQ-CONNECT-USER) connection parameter.

- `PGPASSWORD` behaves the same as the [password](libpq-connect#LIBPQ-CONNECT-PASSWORD) connection parameter. Use of this environment variable is not recommended for security reasons, as some operating systems allow non-root users to see process environment variables via ps; instead consider using a password file (see [Section 34.16](libpq-pgpass)).

- `PGPASSFILE` behaves the same as the [passfile](libpq-connect#LIBPQ-CONNECT-PASSFILE) connection parameter.

- `PGREQUIREAUTH` behaves the same as the [require_auth](libpq-connect#LIBPQ-CONNECT-REQUIRE-AUTH) connection parameter.

- `PGCHANNELBINDING` behaves the same as the [channel_binding](libpq-connect#LIBPQ-CONNECT-CHANNEL-BINDING) connection parameter.

- `PGSERVICE` behaves the same as the [service](libpq-connect#LIBPQ-CONNECT-SERVICE) connection parameter.

- `PGSERVICEFILE` specifies the name of the per-user connection service file (see [Section 34.17](libpq-pgservice)). Defaults to `~/.pg_service.conf`, or `%APPDATA%\postgresql\.pg_service.conf` on Microsoft Windows.

- `PGOPTIONS` behaves the same as the [options](libpq-connect#LIBPQ-CONNECT-OPTIONS) connection parameter.

- `PGAPPNAME` behaves the same as the [application_name](libpq-connect#LIBPQ-CONNECT-APPLICATION-NAME) connection parameter.

- `PGSSLMODE` behaves the same as the [sslmode](libpq-connect#LIBPQ-CONNECT-SSLMODE) connection parameter.

- `PGREQUIRESSL` behaves the same as the [requiressl](libpq-connect#LIBPQ-CONNECT-REQUIRESSL) connection parameter. This environment variable is deprecated in favor of the `PGSSLMODE` variable; setting both variables suppresses the effect of this one.

- `PGSSLCOMPRESSION` behaves the same as the [sslcompression](libpq-connect#LIBPQ-CONNECT-SSLCOMPRESSION) connection parameter.

- `PGSSLCERT` behaves the same as the [sslcert](libpq-connect#LIBPQ-CONNECT-SSLCERT) connection parameter.

- `PGSSLKEY` behaves the same as the [sslkey](libpq-connect#LIBPQ-CONNECT-SSLKEY) connection parameter.

- `PGSSLCERTMODE` behaves the same as the [sslcertmode](libpq-connect#LIBPQ-CONNECT-SSLCERTMODE) connection parameter.

- `PGSSLROOTCERT` behaves the same as the [sslrootcert](libpq-connect#LIBPQ-CONNECT-SSLROOTCERT) connection parameter.

- `PGSSLCRL` behaves the same as the [sslcrl](libpq-connect#LIBPQ-CONNECT-SSLCRL) connection parameter.

- `PGSSLCRLDIR` behaves the same as the [sslcrldir](libpq-connect#LIBPQ-CONNECT-SSLCRLDIR) connection parameter.

- `PGSSLSNI` behaves the same as the [sslsni](libpq-connect#LIBPQ-CONNECT-SSLSNI) connection parameter.

- `PGREQUIREPEER` behaves the same as the [requirepeer](libpq-connect#LIBPQ-CONNECT-REQUIREPEER) connection parameter.

- `PGSSLMINPROTOCOLVERSION` behaves the same as the [ssl_min_protocol_version](libpq-connect#LIBPQ-CONNECT-SSL-MIN-PROTOCOL-VERSION) connection parameter.

- `PGSSLMAXPROTOCOLVERSION` behaves the same as the [ssl_max_protocol_version](libpq-connect#LIBPQ-CONNECT-SSL-MAX-PROTOCOL-VERSION) connection parameter.

- `PGGSSENCMODE` behaves the same as the [gssencmode](libpq-connect#LIBPQ-CONNECT-GSSENCMODE) connection parameter.

- `PGKRBSRVNAME` behaves the same as the [krbsrvname](libpq-connect#LIBPQ-CONNECT-KRBSRVNAME) connection parameter.

- `PGGSSLIB` behaves the same as the [gsslib](libpq-connect#LIBPQ-CONNECT-GSSLIB) connection parameter.

- `PGGSSDELEGATION` behaves the same as the [gssdelegation](libpq-connect#LIBPQ-CONNECT-GSSDELEGATION) connection parameter.

- `PGCONNECT_TIMEOUT` behaves the same as the [connect_timeout](libpq-connect#LIBPQ-CONNECT-CONNECT-TIMEOUT) connection parameter.

- `PGCLIENTENCODING` behaves the same as the [client_encoding](libpq-connect#LIBPQ-CONNECT-CLIENT-ENCODING) connection parameter.

- `PGTARGETSESSIONATTRS` behaves the same as the [target_session_attrs](libpq-connect#LIBPQ-CONNECT-TARGET-SESSION-ATTRS) connection parameter.

- `PGLOADBALANCEHOSTS` behaves the same as the [load_balance_hosts](libpq-connect#LIBPQ-CONNECT-LOAD-BALANCE-HOSTS) connection parameter.

The following environment variables can be used to specify default behavior for each PostgreSQL session. (See also the [ALTER ROLE](sql-alterrole) and [ALTER DATABASE](sql-alterdatabase) commands for ways to set default behavior on a per-user or per-database basis.)

- `PGDATESTYLE` sets the default style of date/time representation. (Equivalent to `SET datestyle TO ...`.)

- `PGTZ` sets the default time zone. (Equivalent to `SET timezone TO ...`.)

- `PGGEQO` sets the default mode for the genetic query optimizer. (Equivalent to `SET geqo TO ...`.)

Refer to the SQL command [SET](sql-set) for information on correct values for these environment variables.

The following environment variables determine internal behavior of libpq; they override compiled-in defaults.

- `PGSYSCONFDIR` sets the directory containing the `pg_service.conf` file and in a future version possibly other system-wide configuration files.

- `PGLOCALEDIR` sets the directory containing the `locale` files for message localization.

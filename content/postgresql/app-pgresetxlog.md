[#id](#APP-PGRESETXLOG)

## O.4. `pg_resetxlog` renamed to `pg_resetwal` [#](#APP-PGRESETXLOG)

PostgreSQL 9.6 and below provided a command named `pg_resetxlog` to reset the write-ahead-log (WAL) files. This command was renamed to `pg_resetwal`, see [pg_resetwal](app-pgresetwal) for documentation of `pg_resetwal` and see [the release notes for PostgreSQL 10](release-prior) for details on this change.

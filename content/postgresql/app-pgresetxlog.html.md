<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            P.4. `pg_resetxlog` renamed to `pg_resetwal`           |                                                                         |                                          |                                                       |                                                                                |
| :---------------------------------------------------------------: | :---------------------------------------------------------------------- | :--------------------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------------: |
| [Prev](pgxlogdump.html "P.3. pg_xlogdump renamed to pg_waldump")  | [Up](appendix-obsolete.html "Appendix P. Obsolete or Renamed Features") | Appendix P. Obsolete or Renamed Features | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](app-pgreceivexlog.html "P.5. pg_receivexlog renamed to pg_receivewal") |

***

## P.4. `pg_resetxlog` renamed to `pg_resetwal` [#](#APP-PGRESETXLOG)

[]()

PostgreSQL 9.6 and below provided a command named `pg_resetxlog` []()to reset the write-ahead-log (WAL) files. This command was renamed to `pg_resetwal`, see [pg\_resetwal](app-pgresetwal.html "pg_resetwal") for documentation of `pg_resetwal` and see [the release notes for PostgreSQL 10](release-prior.html "E.2. Prior Releases") for details on this change.

***

|                                                                   |                                                                         |                                                                                |
| :---------------------------------------------------------------- | :---------------------------------------------------------------------: | -----------------------------------------------------------------------------: |
| [Prev](pgxlogdump.html "P.3. pg_xlogdump renamed to pg_waldump")  | [Up](appendix-obsolete.html "Appendix P. Obsolete or Renamed Features") |  [Next](app-pgreceivexlog.html "P.5. pg_receivexlog renamed to pg_receivewal") |
| P.3. `pg_xlogdump` renamed to `pg_waldump`                        |          [Home](index.html "PostgreSQL 17devel Documentation")          |                               P.5. `pg_receivexlog` renamed to `pg_receivewal` |

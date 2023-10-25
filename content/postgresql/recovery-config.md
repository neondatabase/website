

|           P.1. `recovery.conf` file merged into `postgresql.conf`          |                                                                         |                                          |                                                       |                                                                              |
| :------------------------------------------------------------------------: | :---------------------------------------------------------------------- | :--------------------------------------: | ----------------------------------------------------: | ---------------------------------------------------------------------------: |
| [Prev](appendix-obsolete.html "Appendix P. Obsolete or Renamed Features")  | [Up](appendix-obsolete.html "Appendix P. Obsolete or Renamed Features") | Appendix P. Obsolete or Renamed Features | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](default-roles.html "P.2. Default Roles Renamed to Predefined Roles") |

***

## P.1. `recovery.conf` file merged into `postgresql.conf` [#](#RECOVERY-CONFIG)

PostgreSQL 11 and below used a configuration file named `recovery.conf` to manage replicas and standbys. Support for this file was removed in PostgreSQL 12. See [the release notes for PostgreSQL 12](release-prior.html "E.2. Prior Releases") for details on this change.

On PostgreSQL 12 and above, [archive recovery, streaming replication, and PITR](continuous-archiving.html "26.3. Continuous Archiving and Point-in-Time Recovery (PITR)") are configured using [normal server configuration parameters](runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-STANDBY "20.6.3. Standby Servers"). These are set in `postgresql.conf` or via [ALTER SYSTEM](sql-altersystem.html "ALTER SYSTEM") like any other parameter.

The server will not start if a `recovery.conf` exists.

PostgreSQL 15 and below had a setting `promote_trigger_file`, or `trigger_file` before 12. Use `pg_ctl promote` or call `pg_promote()` to promote a standby instead.

The `standby_mode` setting has been removed. A `standby.signal` file in the data directory is used instead. See [Standby Server Operation](warm-standby.html#STANDBY-SERVER-OPERATION "27.2.2. Standby Server Operation") for details.

***

|                                                                            |                                                                         |                                                                              |
| :------------------------------------------------------------------------- | :---------------------------------------------------------------------: | ---------------------------------------------------------------------------: |
| [Prev](appendix-obsolete.html "Appendix P. Obsolete or Renamed Features")  | [Up](appendix-obsolete.html "Appendix P. Obsolete or Renamed Features") |  [Next](default-roles.html "P.2. Default Roles Renamed to Predefined Roles") |
| Appendix P. Obsolete or Renamed Features                                   |          [Home](index.html "PostgreSQL 17devel Documentation")          |                               P.2. Default Roles Renamed to Predefined Roles |

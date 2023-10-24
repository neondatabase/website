<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|              vacuumlo             |                                                           |                          |                                                       |                                                              |
| :-------------------------------: | :-------------------------------------------------------- | :----------------------: | ----------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](oid2name.html "oid2name")  | [Up](contrib-prog-client.html "G.1. Client Applications") | G.1. Client Applications | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](contrib-prog-server.html "G.2. Server Applications") |

***

[]()

## vacuumlo

vacuumlo — remove orphaned large objects from a PostgreSQL database

## Synopsis

`vacuumlo` \[*`option`*...] *`dbname`*...

## Description

vacuumlo is a simple utility program that will remove any “orphaned” large objects from a PostgreSQL database. An orphaned large object (LO) is considered to be any LO whose OID does not appear in any `oid` or `lo` data column of the database.

If you use this, you may also be interested in the `lo_manage` trigger in the [lo](lo.html "F.22. lo — manage large objects") module. `lo_manage` is useful to try to avoid creating orphaned LOs in the first place.

All databases named on the command line are processed.

## Options

vacuumlo accepts the following command-line arguments:

*   `-l limit``--limit=limit`

    Remove no more than *`limit`* large objects per transaction (default 1000). Since the server acquires a lock per LO removed, removing too many LOs in one transaction risks exceeding [max\_locks\_per\_transaction](runtime-config-locks.html#GUC-MAX-LOCKS-PER-TRANSACTION). Set the limit to zero if you want all removals done in a single transaction.

*   `-n``--dry-run`

    Don't remove anything, just show what would be done.

*   `-v``--verbose`

    Write a lot of progress messages.

*   `-V``--version`

    Print the vacuumlo version and exit.

*   `-?``--help`

    Show help about vacuumlo command line arguments, and exit.

vacuumlo also accepts the following command-line arguments for connection parameters:

*   `-h host``--host=host`

    Database server's host.

*   `-p port``--port=port`

    Database server's port.

*   `-U username``--username=username`

    User name to connect as.

*   `-w``--no-password`

    Never issue a password prompt. If the server requires password authentication and a password is not available by other means such as a `.pgpass` file, the connection attempt will fail. This option can be useful in batch jobs and scripts where no user is present to enter a password.

*   `-W``--password`

    Force vacuumlo to prompt for a password before connecting to a database.

    This option is never essential, since vacuumlo will automatically prompt for a password if the server demands password authentication. However, vacuumlo will waste a connection attempt finding out that the server wants a password. In some cases it is worth typing `-W` to avoid the extra connection attempt.

## Environment

*   `PGHOST``PGPORT``PGUSER`

    Default connection parameters.

This utility, like most other PostgreSQL utilities, also uses the environment variables supported by libpq (see [Section 34.15](libpq-envars.html "34.15. Environment Variables")).

The environment variable `PG_COLOR` specifies whether to use color in diagnostic messages. Possible values are `always`, `auto` and `never`.

## Notes

vacuumlo works by the following method: First, vacuumlo builds a temporary table which contains all of the OIDs of the large objects in the selected database. It then scans through all columns in the database that are of type `oid` or `lo`, and removes matching entries from the temporary table. (Note: Only types with these names are considered; in particular, domains over them are not considered.) The remaining entries in the temporary table identify orphaned LOs. These are removed.

## Author

Peter Mount `<peter@retep.org.uk>`

***

|                                   |                                                           |                                                              |
| :-------------------------------- | :-------------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](oid2name.html "oid2name")  | [Up](contrib-prog-client.html "G.1. Client Applications") |  [Next](contrib-prog-server.html "G.2. Server Applications") |
| oid2name                          |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                     G.2. Server Applications |

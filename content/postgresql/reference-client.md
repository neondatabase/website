# PostgreSQL Client Applications

This part contains reference information for PostgreSQL client applications and utilities. Not all of these commands are of general utility; some might require special privileges. The common feature of these applications is that they can be run on any host, independent of where the database server resides.

When specified on the command line, user and database names have their case preserved — the presence of spaces or special characters might require quoting. Table names and other identifiers do not have their case preserved, except where documented, and might require quoting.

**Table of Contents**

- [clusterdb](app-clusterdb) — cluster a PostgreSQL database
- [createdb](app-createdb) — create a new PostgreSQL database
- [createuser](app-createuser) — define a new PostgreSQL user account
- [dropdb](app-dropdb) — remove a PostgreSQL database
- [dropuser](app-dropuser) — remove a PostgreSQL user account
- [ecpg](app-ecpg) — embedded SQL C preprocessor
- [pg_amcheck](app-pgamcheck) — checks for corruption in one or more PostgreSQL databases
- [pg_basebackup](app-pgbasebackup) — take a base backup of a PostgreSQL cluster
- [pgbench](pgbench) — run a benchmark test on PostgreSQL
- [pg_config](app-pgconfig) — retrieve information about the installed version of PostgreSQL
- [pg_dump](app-pgdump) — extract a PostgreSQL database into a script file or other archive file
- [pg_dumpall](app-pg-dumpall) — extract a PostgreSQL database cluster into a script file
- [pg_isready](app-pg-isready) — check the connection status of a PostgreSQL server
- [pg_receivewal](app-pgreceivewal) — stream write-ahead logs from a PostgreSQL server
- [pg_recvlogical](app-pgrecvlogical) — control PostgreSQL logical decoding streams
- [pg_restore](app-pgrestore) — restore a PostgreSQL database from an archive file created by pg_dump
- [pg_verifybackup](app-pgverifybackup) — verify the integrity of a base backup of a PostgreSQL cluster
- [psql](app-psql) — PostgreSQL interactive terminal
- [reindexdb](app-reindexdb) — reindex a PostgreSQL database
- [vacuumdb](app-vacuumdb) — garbage-collect and analyze a PostgreSQL database

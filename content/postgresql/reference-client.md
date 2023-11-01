# PostgreSQL Client Applications

This part contains reference information for PostgreSQL client applications and utilities. Not all of these commands are of general utility; some might require special privileges. The common feature of these applications is that they can be run on any host, independent of where the database server resides.

When specified on the command line, user and database names have their case preserved — the presence of spaces or special characters might require quoting. Table names and other identifiers do not have their case preserved, except where documented, and might require quoting.

**Table of Contents**

- [clusterdb](app-clusterdb.html) — cluster a PostgreSQL database
- [createdb](app-createdb.html) — create a new PostgreSQL database
- [createuser](app-createuser.html) — define a new PostgreSQL user account
- [dropdb](app-dropdb.html) — remove a PostgreSQL database
- [dropuser](app-dropuser.html) — remove a PostgreSQL user account
- [ecpg](app-ecpg.html) — embedded SQL C preprocessor
- [pg_amcheck](app-pgamcheck.html) — checks for corruption in one or more PostgreSQL databases
- [pg_basebackup](app-pgbasebackup.html) — take a base backup of a PostgreSQL cluster
- [pgbench](pgbench.html) — run a benchmark test on PostgreSQL
- [pg_config](app-pgconfig.html) — retrieve information about the installed version of PostgreSQL
- [pg_dump](app-pgdump.html) — extract a PostgreSQL database into a script file or other archive file
- [pg_dumpall](app-pg-dumpall.html) — extract a PostgreSQL database cluster into a script file
- [pg_isready](app-pg-isready.html) — check the connection status of a PostgreSQL server
- [pg_receivewal](app-pgreceivewal.html) — stream write-ahead logs from a PostgreSQL server
- [pg_recvlogical](app-pgrecvlogical.html) — control PostgreSQL logical decoding streams
- [pg_restore](app-pgrestore.html) — restore a PostgreSQL database from an archive file created by pg_dump
- [pg_verifybackup](app-pgverifybackup.html) — verify the integrity of a base backup of a PostgreSQL cluster
- [psql](app-psql.html) — PostgreSQL interactive terminal
- [reindexdb](app-reindexdb.html) — reindex a PostgreSQL database
- [vacuumdb](app-vacuumdb.html) — garbage-collect and analyze a PostgreSQL database

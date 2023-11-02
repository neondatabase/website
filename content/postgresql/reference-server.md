# PostgreSQL Server Applications

This part contains reference information for PostgreSQL server applications and support utilities. These commands can only be run usefully on the host where the database server resides. Other utility programs are listed in [PostgreSQL Client Applications](reference-client 'PostgreSQL Client Applications').

**Table of Contents**

- [initdb](app-initdb) — create a new PostgreSQL database cluster
- [pg_archivecleanup](pgarchivecleanup) — clean up PostgreSQL WAL archive files
- [pg_checksums](app-pgchecksums) — enable, disable or check data checksums in a PostgreSQL database cluster
- [pg_controldata](app-pgcontroldata) — display control information of a PostgreSQL database cluster
- [pg_ctl](app-pg-ctl) — initialize, start, stop, or control a PostgreSQL server
- [pg_resetwal](app-pgresetwal) — reset the write-ahead log and other control information of a PostgreSQL database cluster
- [pg_rewind](app-pgrewind) — synchronize a PostgreSQL data directory with another data directory that was forked from it
- [pg_test_fsync](pgtestfsync) — determine fastest `wal_sync_method` for PostgreSQL
- [pg_test_timing](pgtesttiming) — measure timing overhead
- [pg_upgrade](pgupgrade) — upgrade a PostgreSQL server instance
- [pg_waldump](pgwaldump) — display a human-readable rendering of the write-ahead log of a PostgreSQL database cluster
- [postgres](app-postgres) — PostgreSQL database server

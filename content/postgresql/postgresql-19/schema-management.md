---
title: 'PostgreSQL 19 Schema Management and Backup'
page_title: 'pg_get_*_ddl() and pg_dumpall Formats: Removed From PostgreSQL 19'
page_description: "PostgreSQL 19 won't ship pg_get_database_ddl(), pg_get_role_ddl(), pg_get_tablespace_ddl(), or the pg_dumpall custom, directory, and tar formats. Both were removed during the beta. See the beta behavior and the workflow to use instead."
ogImage: ''
updatedOn: '2026-11-07T21:32:00.000Z'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 Query Improvements'
  slug: 'postgresql-19/query-improvements'
nextLink:
  title: 'PostgreSQL 19 Monitoring and Operations'
  slug: 'postgresql-19/monitoring-operations'
---

<Admonition type="important" title="These features won't ship in PostgreSQL 19">
Both features on this page were removed from PostgreSQL 19 during the beta, and neither is in the [PostgreSQL 19 release notes](https://www.postgresql.org/docs/19/release-19.html):

- The custom, directory, and tar output formats for `pg_dumpall` were [reverted on June 18, 2026](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=7ca548f23a60887541493b2da47f2b2720c35ee3).
- `pg_get_database_ddl()`, `pg_get_role_ddl()`, and `pg_get_tablespace_ddl()` were [removed in PostgreSQL 19 Beta 4](https://www.postgresql.org/about/news/postgresql-19-beta-4-released-3386/).

To capture cluster-wide DDL in PostgreSQL 19, keep using `pg_dumpall --globals-only` (or `--roles-only`) for roles and tablespaces, and `pg_dump` for each database. The examples below reflect the implementation that was in the PostgreSQL 19 beta and may change if the features land in a future release.
</Admonition>

**Summary**: The PostgreSQL 19 beta included `pg_get_database_ddl()`, `pg_get_role_ddl()`, and `pg_get_tablespace_ddl()` for programmatic DDL extraction, and custom, directory, and tar output formats for `pg_dumpall`. Both were removed before the final release and won't ship in PostgreSQL 19.

## `pg_get_*_ddl()` functions (removed)

PostgreSQL has long provided functions such as `pg_get_viewdef()`, `pg_get_indexdef()`, and `pg_get_functiondef()` for extracting the DDL of individual objects. But getting the DDL for databases, roles, and tablespaces required parsing `pg_dump` or `pg_dumpall` output, which is fragile and inconvenient.

The PostgreSQL 19 beta added three functions that returned executable DDL directly from SQL. They were removed in Beta 4.

### pg_get_database_ddl()

Returns the CREATE DATABASE and ALTER DATABASE statements for a given database:

```sql
SELECT * FROM pg_get_database_ddl('myapp');
```

```
                                        pg_get_database_ddl
--------------------------------------------------------------------------------------------
 CREATE DATABASE myapp WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc
   LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';
 ALTER DATABASE myapp OWNER TO app_admin;
 ALTER DATABASE myapp SET timezone TO 'UTC';
(3 rows)
```

Each row is a complete, executable SQL statement. The first row is the CREATE statement, and subsequent rows are ALTER statements for properties like owner, connection limit, and configuration settings.

**Options:**

Options are passed as alternating `name, value` text pairs after the database argument. Supported options: `pretty` (boolean), `owner` (boolean), `tablespace` (boolean).

```sql
-- Disable owner output
SELECT * FROM pg_get_database_ddl('myapp', 'owner', 'false');

-- Pretty-printed output
SELECT * FROM pg_get_database_ddl('myapp', 'pretty', 'true');

-- Combine multiple options
SELECT * FROM pg_get_database_ddl('myapp', 'pretty', 'true', 'tablespace', 'false');
```

### pg_get_role_ddl()

Returns the CREATE ROLE and related statements for a given role:

```sql
SELECT * FROM pg_get_role_ddl('app_user');
```

```
                              pg_get_role_ddl
---------------------------------------------------------------------------
 CREATE ROLE app_user LOGIN CONNECTION LIMIT 100;
 GRANT developer TO app_user;
 GRANT readonly TO app_user;
(3 rows)
```

The first row is the CREATE ROLE statement with all role attributes (LOGIN, SUPERUSER, CREATEDB, etc.). Subsequent rows include GRANT statements for role memberships.

**Options:**

Options are passed as alternating `name, value` text pairs after the role argument. Supported options: `pretty` (boolean) and `memberships` (boolean, defaults to true).

```sql
-- Omit GRANT statements for role memberships
SELECT * FROM pg_get_role_ddl('app_user', 'memberships', 'false');

-- Pretty-printed output
SELECT * FROM pg_get_role_ddl('app_user', 'pretty', 'true');
```

<Admonition type="note">
Passwords are never included in the output for security reasons. To migrate roles with passwords, use `pg_dumpall --roles-only`.
</Admonition>

### pg_get_tablespace_ddl()

Returns the CREATE TABLESPACE and ALTER TABLESPACE statements:

```sql
SELECT * FROM pg_get_tablespace_ddl('fast_storage');
```

```
                           pg_get_tablespace_ddl
---------------------------------------------------------------------------
 CREATE TABLESPACE fast_storage LOCATION '/mnt/nvme/pg_data';
 ALTER TABLESPACE fast_storage OWNER TO postgres;
 ALTER TABLESPACE fast_storage SET (seq_page_cost = 0.5, random_page_cost = 1.0);
(3 rows)
```

### Practical Use Cases

The DDL extraction functions plug naturally into auditing, migration tooling, and drift detection. The patterns below show one example of each.

#### Schema auditing

Compare the current state of roles across environments:

```sql
-- Export all role DDL for comparison
SELECT r.rolname, d.ddl
FROM pg_roles r
CROSS JOIN LATERAL pg_get_role_ddl(r.rolname::regrole) AS d(ddl)
WHERE r.rolname NOT LIKE 'pg_%'
ORDER BY r.rolname;
```

#### Migration scripts

Generate DDL for specific databases without running `pg_dump`:

```sql
-- Generate a migration script for a database
\t on
\o /tmp/recreate_myapp.sql
SELECT * FROM pg_get_database_ddl('myapp', 'pretty', 'true');
\o
\t off
```

#### Configuration drift detection

Store DDL snapshots and compare them over time:

```sql
-- Store current state
CREATE TABLE ddl_snapshots (
    captured_at TIMESTAMP DEFAULT now(),
    object_type TEXT,
    object_name TEXT,
    ddl_line TEXT
);

INSERT INTO ddl_snapshots (object_type, object_name, ddl_line)
SELECT 'database', 'myapp', ddl
FROM pg_get_database_ddl('myapp') AS t(ddl);
```

## pg_dumpall non-text output formats (reverted)

`pg_dumpall` has historically only supported plain text output. If you wanted custom format (for selective restore with `pg_restore`) or directory format (for parallel dump/restore), you had to use `pg_dump` per-database and handle globals separately.

The PostgreSQL 19 beta added custom, directory, and tar output formats to `pg_dumpall`. They were reverted on June 18, 2026, so `pg_dumpall` in PostgreSQL 19 still produces plain text only.

### Available Formats

The new formats mirror the ones `pg_dump` already supports. Pick custom for a single compressed archive, directory for parallel dump and restore, and tar for portability with archive tooling.

```bash
# Custom format (single compressed file, supports pg_restore)
pg_dumpall -Fc -f cluster_backup

# Directory format (parallel dump/restore capable)
pg_dumpall -Fd -f cluster_backup_dir

# Tar format
pg_dumpall -Ft -f cluster_backup.tar
```

### Output Structure

The non-text formats produce a structured output containing:

- `toc.glo` - Global objects (roles, tablespaces) in custom format
- `map.dat` - Mapping between database OIDs and database names
- `databases/` - A subdirectory with per-database archives, organized by OID

### Selective Restore

The main advantage of non-text formats is selective restore with `pg_restore`:

```bash
# Restore only global objects (roles, tablespaces)
pg_restore --globals-only cluster_backup

# Restore a specific database from the cluster backup
pg_restore --dbname=myapp cluster_backup

# List contents without restoring
pg_restore --list cluster_backup
```

### Parallel Operations

Directory format supports parallel dump and restore:

```bash
# Parallel dump
pg_dumpall -Fd -j 4 -f cluster_backup_dir

# Parallel restore
pg_restore -j 4 -d postgres cluster_backup_dir
```

### Comparison to Previous Workflow

In every released version of PostgreSQL, including PostgreSQL 19, a full cluster backup with selective restore requires a multi-step process:

```bash
# Supported approach: dump globals separately, then each database
pg_dumpall --globals-only > globals.sql
pg_dump -Fc myapp > myapp.dump
pg_dump -Fc analytics > analytics.dump

# Restore selectively
psql -f globals.sql
pg_restore -d myapp myapp.dump
```

With the reverted beta implementation, it was a single command:

```bash
# Beta only: not available in PostgreSQL 19
pg_dumpall -Fc -f cluster_backup
pg_restore --globals-only cluster_backup
pg_restore --dbname=myapp cluster_backup
```

## Summary

The `pg_get_*_ddl()` functions and the `pg_dumpall` formats would have filled a gap in PostgreSQL's schema management tooling, but neither ships in PostgreSQL 19. For now, extract role and tablespace DDL with `pg_dumpall --globals-only`, and use `pg_dump` in custom or directory format for each database when you need selective or parallel restore.

## References

- [Commit `4881981f`: Add infrastructure for `pg_get_*_ddl` functions](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=4881981f)
- [Commit `a4f774cf`: Add pg_get_database_ddl() function](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=a4f774cf)
- [Commit `763aaa06`: Add non-text output formats to pg_dumpall](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=763aaa06)
- [Commit `7ca548f2`: Revert non-text output formats for pg_dumpall](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=7ca548f23a60887541493b2da47f2b2720c35ee3)
- [PostgreSQL 19 Beta 4 release announcement](https://www.postgresql.org/about/news/postgresql-19-beta-4-released-3386/)
- [PostgreSQL 19 docs: pg_dumpall](https://www.postgresql.org/docs/19/app-pg-dumpall.html)

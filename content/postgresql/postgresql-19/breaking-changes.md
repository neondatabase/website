---
title: 'PostgreSQL 19 Breaking Changes and Upgrade Notes'
page_title: 'PostgreSQL 19 Breaking Changes - What to Check Before Upgrading'
page_description: 'Review PostgreSQL 19 breaking changes including JIT disabled by default, LZ4 TOAST compression, RADIUS removal, and string handling changes before upgrading your database.'
ogImage: ''
updatedOn: '2026-04-15T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL 19 Monitoring and Operations'
  slug: 'postgresql-19/monitoring-operations'
nextLink:
  title: 'PostgreSQL 19 New Features'
  slug: 'postgresql-19-new-features'
---

**Summary**: PostgreSQL 19 includes several breaking changes that may affect your applications and configuration. JIT compilation is now off by default, TOAST compression defaults to LZ4, MD5-hashed passwords are being deprecated and string handling is stricter. Review these changes before upgrading.

## JIT Compilation Disabled by Default

The `jit` parameter now defaults to `off`. Since PostgreSQL 12, JIT was enabled by default, but experience showed it added latency to short OLTP queries without meaningful benefit for most workloads.

```sql
-- Check your current setting
SHOW jit;

-- Re-enable if your workload benefits from it
ALTER SYSTEM SET jit = on;
SELECT pg_reload_conf();
```

### Who Is Affected

If you run analytical or OLAP workloads with complex queries, large sequential scans, or heavy aggregations, you may see regressions after upgrading. These workloads genuinely benefit from JIT compilation.

If you run typical OLTP workloads (short queries, many transactions per second), you will likely see no change or a slight improvement from avoiding JIT overhead.

### What to Do

Test your most important queries with `jit = on` and `jit = off` before upgrading. If JIT helps, add `jit = on` to your `postgresql.conf` explicitly. If you are unsure, leave it off - that is the safer default.

## Default TOAST Compression Changed to LZ4

The `default_toast_compression` parameter changed from `pglz` to `lz4`.

```sql
-- Check your current setting
SHOW default_toast_compression;

-- Revert to old behavior if needed
ALTER SYSTEM SET default_toast_compression = pglz;
```

### What This Means

LZ4 is faster than pglz for both compression and decompression, with slightly lower compression ratios. For most workloads, this is a net improvement - less CPU time spent on compression with only marginally more disk usage.

Existing data is not affected. Rows already stored with pglz remain readable regardless of this setting. Only newly written or updated TOAST values use the new default. You can also override this per-column:

```sql
ALTER TABLE my_table ALTER COLUMN big_text SET COMPRESSION pglz;
```

Changing the per-column setting only takes effect for rows written or updated after the change. Existing rows keep their original compression. To rewrite the storage for an existing table, use `VACUUM FULL` or `CLUSTER`. Both rewrite the table with a brief lock that blocks reads. The new `REPACK CONCURRENTLY` command in PostgreSQL 19 does the same rewrite without taking that lock and is the better choice for production tables that you cannot afford to block. See the [REPACK CONCURRENTLY guide](/postgresql/postgresql-19/repack-command) for the full flow.

<Admonition type="note">
LZ4 support requires PostgreSQL to be built with `--with-lz4`. Most packaged builds include this, but verify if you build from source.
</Admonition>

## MD5 Password Deprecation Warnings

PostgreSQL 19 emits a warning whenever a role authenticates using MD5 password hashing. This includes both the `md5` method in `pg_hba.conf` and passwords stored as MD5 hashes in `pg_authid`. MD5 is still accepted in 19, but the warning is the loud first step toward removing it in a later release. Most clusters that have been running for years still have MD5-hashed passwords lingering, so this is the breaking change that affects the largest number of installs even though nothing actually breaks yet.

### Migration to SCRAM-SHA-256

The migration is a three-step sequence: switch the default password hash, get every user to set a new password so it gets re-hashed under SCRAM, then flip the `pg_hba.conf` entries from `md5` to `scram-sha-256`. The order matters: if you flip `pg_hba.conf` to `scram-sha-256` before the passwords are re-hashed, every login that still has an MD5-stored password fails.

```sql
-- 1. Change the default password encryption
ALTER SYSTEM SET password_encryption = 'scram-sha-256';
SELECT pg_reload_conf();
```

For step 2, prefer `\password` in `psql` over `ALTER USER ... PASSWORD '...'`. The `ALTER USER` form takes the password as plain text in the SQL statement, which means it can show up in `log_statement = 'all'` logs, in `pg_stat_statements`, and in shell history. The `\password` meta-command prompts for the password locally and sends only the SCRAM-hashed result to the server:

```text
mydb=# \password myuser
Enter new password for user "myuser":
Enter it again:
```

If users cannot run `\password` themselves, use the application's password reset flow so the new password gets hashed by the server with SCRAM. Then update `pg_hba.conf`:

```
# Before
host all all 0.0.0.0/0 md5

# After
host all all 0.0.0.0/0 scram-sha-256
```

You can leave the `md5` entry in `pg_hba.conf` while the rehash is in progress. PostgreSQL automatically uses SCRAM authentication for any user whose stored password is already a SCRAM hash, regardless of what the HBA entry says. Only flip the entry to `scram-sha-256` once you are sure every active user has been re-hashed, otherwise the stragglers will be locked out.

<Admonition type="important">
After changing password encryption to SCRAM-SHA-256, all users must reset their passwords. Existing MD5-hashed passwords cannot be converted; they have to be re-entered so they get hashed with the new algorithm.
</Admonition>

## RADIUS Authentication Removed

The `radius` authentication method in `pg_hba.conf` has been removed entirely. PostgreSQL will refuse to start if your `pg_hba.conf` contains any `radius` lines. RADIUS in PostgreSQL had a small user base, so this removal affects far fewer clusters than the MD5 deprecation above.

### Why It Was Removed

RADIUS authentication in PostgreSQL used UDP only, with no support for RADIUS over TLS (RadSec). The implementation was considered unfixably insecure for database authentication.

### Migration Path

Check your `pg_hba.conf` before upgrading:

```bash
grep -i radius pg_hba.conf
```

If you find RADIUS entries, switch to one of these alternatives:

- **LDAP**: Most RADIUS deployments have an LDAP backend. Connect to it directly.
- **GSSAPI/Kerberos**: For enterprise environments with Active Directory.
- **Certificate authentication**: For service-to-service connections.
- **SCRAM-SHA-256**: For password-based authentication without external systems.

## String handling changes

Two changes to how the server handles string literals. Most applications on modern drivers are already unaffected, but legacy code that depends on backslash escapes or the old warning behavior may need small updates.

### standard_conforming_strings forced on

The `standard_conforming_strings` parameter is now hardcoded to `on` and read-only. Previously it defaulted to `on` (since PostgreSQL 9.1) but could be set to `off`.

This means backslash escapes in regular string literals are no longer interpreted:

```sql
-- This no longer works as expected:
SELECT 'line1\nline2';
-- Returns the literal string: line1\nline2

-- Use E-prefix strings instead:
SELECT E'line1\nline2';
-- Returns: line1
--          line2
```

### Who Is Affected

Applications that rely on `\'` for escaping single quotes in SQL strings will break. The standard SQL approach is to double the quote: `''`.

```sql
-- Old way (no longer works):
SELECT 'it\'s broken';

-- Standard SQL way:
SELECT 'it''s fine';

-- Also works:
SELECT E'it\'s fine';
```

Most modern ORMs and database drivers already use `standard_conforming_strings = on`. If you are using a recent version of your driver, you are likely unaffected.

### escape_string_warning Removed

The `escape_string_warning` GUC has been removed entirely. Since `standard_conforming_strings` is always on, the warning is no longer needed. Remove this parameter from your `postgresql.conf` to avoid unknown-parameter errors on startup.

## max_locks_per_transaction Default Doubled

The `max_locks_per_transaction` default changed from 64 to 128.

```sql
SHOW max_locks_per_transaction;
-- Now defaults to 128
```

Modern schemas with partitioned tables frequently exceeded the old limit of 64 locks during DDL operations like `ALTER TABLE` on tables with many partitions. The old default caused "out of shared memory" errors that were confusing to diagnose.

The increase means slightly more shared memory usage. If you were already running with a custom value higher than 128, no change is needed.

## MULE_INTERNAL encoding removed

PostgreSQL 19 removes support for the `MULE_INTERNAL` server and client encoding (commit `77645d44`). Databases or connections using this encoding will fail to start or connect on the new version.

If you are using `MULE_INTERNAL`, dump the affected databases on the old server, reload them on the new server under a different encoding (typically `UTF8`), and update any client configuration that expects `MULE_INTERNAL`.

```bash
# Check which databases still use MULE_INTERNAL
psql -c "SELECT datname, pg_encoding_to_char(encoding) FROM pg_database;"
```

`pg_upgrade` detects and refuses to migrate clusters containing `MULE_INTERNAL` databases, so you will not silently lose data. The upgrade fails up front.

## btree_gist inet/cidr indexes must be dropped before upgrading

PostgreSQL 19 marks the `gist_inet_ops` and `gist_cidr_ops` opclasses from the `btree_gist` extension as non-default and starts deprecating them. They are known to incorrectly exclude matching rows and can silently return wrong results. `pg_upgrade` refuses to migrate any cluster that still has indexes built on them (commit `b3b0b457`).

Find and drop affected indexes before upgrading:

```sql
SELECT n.nspname, c.relname
FROM pg_index i
JOIN pg_class c ON c.oid = i.indexrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_opclass o ON o.oid = ANY(i.indclass)
WHERE o.opcname IN ('gist_inet_ops', 'gist_cidr_ops');

-- Drop each and re-create using a regular B-tree or a GiST index
-- built on the native inet GiST support instead.
```

## CR and LF disallowed in database, role, and tablespace names

Database, role, and tablespace names can no longer contain carriage returns or line feeds (commit `b380a56a`). This closes a small set of security issues where such characters could alter downstream tooling output.

`pg_upgrade` refuses to migrate clusters that contain any such names. The check is up front, so you will not get halfway through an upgrade before hitting it.

## BUFFERPIN wait event class renamed to BUFFER

The wait event class previously named `BUFFERPIN` has been renamed to `BUFFER` (commit `6c5c393b`). If you have monitoring dashboards, alerts, or scripts that filter `pg_stat_activity.wait_event_type` by the literal string `BUFFERPIN`, update them to look for `BUFFER` instead.

## postgres_fdw now propagates READ ONLY

A `READ ONLY` transaction in PostgreSQL 19 propagates its mode to `postgres_fdw` sessions (commit `de28140d`). Previously, a local `READ ONLY` transaction could still modify foreign data through functions on the remote side.

This is strictly safer behavior, but applications that relied on a local `READ ONLY` wrapper while still writing to foreign tables will break. The fix is to remove the `READ ONLY` from transactions that legitimately need to write to foreign tables.

## Removed and changed parameters

The server variable `escape_string_warning` has been removed because `standard_conforming_strings` can no longer be turned off, so the warning has nothing to warn about. The older `lo_compat_privileges` and `array_nulls` GUCs are still present in PostgreSQL 19. They were not removed.

If `escape_string_warning` appears in your `postgresql.conf`, remove the line before starting the new cluster.

## Pre-upgrade checklist

Before upgrading to PostgreSQL 19:

```bash
# 1. Check for the removed GUC in your config
grep -E 'escape_string_warning' postgresql.conf

# 2. Check for RADIUS auth (removed in 19)
grep -i radius pg_hba.conf

# 3. Check for MD5 auth (still works but will warn)
grep -i md5 pg_hba.conf

# 4. Check for btree_gist indexes on inet / cidr. pg_upgrade refuses
#    to migrate clusters that still have these.
psql -c "
SELECT n.nspname, c.relname
FROM pg_index i
JOIN pg_class c ON c.oid = i.indexrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_opclass o ON o.oid = ANY(i.indclass)
WHERE o.opcname IN ('gist_inet_ops', 'gist_cidr_ops');
"

# 5. Check if you rely on JIT (disabled by default in 19)
psql -c "SHOW jit;"
```

Test your application with these settings on your current PostgreSQL version first:

```sql
SET jit = off;
SET standard_conforming_strings = on;
-- Run your test suite
```

This catches most compatibility issues before the actual upgrade.

## Summary

PostgreSQL 19's breaking changes are mostly about removing long-deprecated behaviors and updating defaults to better match modern usage patterns. JIT off by default is the change most likely to affect query performance. LZ4 TOAST compression is a transparent improvement for most workloads. The string handling changes and RADIUS removal require config file cleanup but should not affect applications using modern drivers and standard SQL syntax.

## References

- [Commit `7f8c88c2`: jit: Change the default to off](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=7f8c88c2)
- [Commit `34dfca29`: Change default value of default_toast_compression to "lz4", take two](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=34dfca29)
- [Commit `a1643d40`: Remove RADIUS support](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=a1643d40)
- [Commit `45762084`: Force standard_conforming_strings to always be ON](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=45762084)
- [Commit `79534f90`: Change default of max_locks_per_transactions to 128](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=79534f90)
- [Commit `b3b0b457`: Create btree_gist v1.9, in which inet/cidr opclasses aren't default](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=b3b0b457)
- [Commit `ce11e63f`: pg_upgrade: Check for unsupported encodings (MULE_INTERNAL)](https://git.postgresql.org/gitweb/?p=postgresql.git;a=commit;h=ce11e63f)

[#id](#POPULATE)

## 14.4. Populating a Database [#](#POPULATE)

- [14.4.1. Disable Autocommit](populate#DISABLE-AUTOCOMMIT)
- [14.4.2. Use `COPY`](populate#POPULATE-COPY-FROM)
- [14.4.3. Remove Indexes](populate#POPULATE-RM-INDEXES)
- [14.4.4. Remove Foreign Key Constraints](populate#POPULATE-RM-FKEYS)
- [14.4.5. Increase `maintenance_work_mem`](populate#POPULATE-WORK-MEM)
- [14.4.6. Increase `max_wal_size`](populate#POPULATE-MAX-WAL-SIZE)
- [14.4.7. Disable WAL Archival and Streaming Replication](populate#POPULATE-PITR)
- [14.4.8. Run `ANALYZE` Afterwards](populate#POPULATE-ANALYZE)
- [14.4.9. Some Notes about pg_dump](populate#POPULATE-PG-DUMP)

One might need to insert a large amount of data when first populating a database. This section contains some suggestions on how to make this process as efficient as possible.

[#id](#DISABLE-AUTOCOMMIT)

### 14.4.1. Disable Autocommit [#](#DISABLE-AUTOCOMMIT)

When using multiple `INSERT`s, turn off autocommit and just do one commit at the end. (In plain SQL, this means issuing `BEGIN` at the start and `COMMIT` at the end. Some client libraries might do this behind your back, in which case you need to make sure the library does it when you want it done.) If you allow each insertion to be committed separately, PostgreSQL is doing a lot of work for each row that is added. An additional benefit of doing all insertions in one transaction is that if the insertion of one row were to fail then the insertion of all rows inserted up to that point would be rolled back, so you won't be stuck with partially loaded data.

[#id](#POPULATE-COPY-FROM)

### 14.4.2. Use `COPY` [#](#POPULATE-COPY-FROM)

Use [`COPY`](sql-copy) to load all the rows in one command, instead of using a series of `INSERT` commands. The `COPY` command is optimized for loading large numbers of rows; it is less flexible than `INSERT`, but incurs significantly less overhead for large data loads. Since `COPY` is a single command, there is no need to disable autocommit if you use this method to populate a table.

If you cannot use `COPY`, it might help to use [`PREPARE`](sql-prepare) to create a prepared `INSERT` statement, and then use `EXECUTE` as many times as required. This avoids some of the overhead of repeatedly parsing and planning `INSERT`. Different interfaces provide this facility in different ways; look for “prepared statements” in the interface documentation.

Note that loading a large number of rows using `COPY` is almost always faster than using `INSERT`, even if `PREPARE` is used and multiple insertions are batched into a single transaction.

`COPY` is fastest when used within the same transaction as an earlier `CREATE TABLE` or `TRUNCATE` command. In such cases no WAL needs to be written, because in case of an error, the files containing the newly loaded data will be removed anyway. However, this consideration only applies when [wal_level](runtime-config-wal#GUC-WAL-LEVEL) is `minimal` as all commands must write WAL otherwise.

[#id](#POPULATE-RM-INDEXES)

### 14.4.3. Remove Indexes [#](#POPULATE-RM-INDEXES)

If you are loading a freshly created table, the fastest method is to create the table, bulk load the table's data using `COPY`, then create any indexes needed for the table. Creating an index on pre-existing data is quicker than updating it incrementally as each row is loaded.

If you are adding large amounts of data to an existing table, it might be a win to drop the indexes, load the table, and then recreate the indexes. Of course, the database performance for other users might suffer during the time the indexes are missing. One should also think twice before dropping a unique index, since the error checking afforded by the unique constraint will be lost while the index is missing.

[#id](#POPULATE-RM-FKEYS)

### 14.4.4. Remove Foreign Key Constraints [#](#POPULATE-RM-FKEYS)

Just as with indexes, a foreign key constraint can be checked “in bulk” more efficiently than row-by-row. So it might be useful to drop foreign key constraints, load data, and re-create the constraints. Again, there is a trade-off between data load speed and loss of error checking while the constraint is missing.

What's more, when you load data into a table with existing foreign key constraints, each new row requires an entry in the server's list of pending trigger events (since it is the firing of a trigger that checks the row's foreign key constraint). Loading many millions of rows can cause the trigger event queue to overflow available memory, leading to intolerable swapping or even outright failure of the command. Therefore it may be _necessary_, not just desirable, to drop and re-apply foreign keys when loading large amounts of data. If temporarily removing the constraint isn't acceptable, the only other recourse may be to split up the load operation into smaller transactions.

[#id](#POPULATE-WORK-MEM)

### 14.4.5. Increase `maintenance_work_mem` [#](#POPULATE-WORK-MEM)

Temporarily increasing the [maintenance_work_mem](runtime-config-resource#GUC-MAINTENANCE-WORK-MEM) configuration variable when loading large amounts of data can lead to improved performance. This will help to speed up `CREATE INDEX` commands and `ALTER TABLE ADD FOREIGN KEY` commands. It won't do much for `COPY` itself, so this advice is only useful when you are using one or both of the above techniques.

[#id](#POPULATE-MAX-WAL-SIZE)

### 14.4.6. Increase `max_wal_size` [#](#POPULATE-MAX-WAL-SIZE)

Temporarily increasing the [max_wal_size](runtime-config-wal#GUC-MAX-WAL-SIZE) configuration variable can also make large data loads faster. This is because loading a large amount of data into PostgreSQL will cause checkpoints to occur more often than the normal checkpoint frequency (specified by the `checkpoint_timeout` configuration variable). Whenever a checkpoint occurs, all dirty pages must be flushed to disk. By increasing `max_wal_size` temporarily during bulk data loads, the number of checkpoints that are required can be reduced.

[#id](#POPULATE-PITR)

### 14.4.7. Disable WAL Archival and Streaming Replication [#](#POPULATE-PITR)

When loading large amounts of data into an installation that uses WAL archiving or streaming replication, it might be faster to take a new base backup after the load has completed than to process a large amount of incremental WAL data. To prevent incremental WAL logging while loading, disable archiving and streaming replication, by setting [wal_level](runtime-config-wal#GUC-WAL-LEVEL) to `minimal`, [archive_mode](runtime-config-wal#GUC-ARCHIVE-MODE) to `off`, and [max_wal_senders](runtime-config-replication#GUC-MAX-WAL-SENDERS) to zero. But note that changing these settings requires a server restart, and makes any base backups taken before unavailable for archive recovery and standby server, which may lead to data loss.

Aside from avoiding the time for the archiver or WAL sender to process the WAL data, doing this will actually make certain commands faster, because they do not to write WAL at all if `wal_level` is `minimal` and the current subtransaction (or top-level transaction) created or truncated the table or index they change. (They can guarantee crash safety more cheaply by doing an `fsync` at the end than by writing WAL.)

[#id](#POPULATE-ANALYZE)

### 14.4.8. Run `ANALYZE` Afterwards [#](#POPULATE-ANALYZE)

Whenever you have significantly altered the distribution of data within a table, running [`ANALYZE`](sql-analyze) is strongly recommended. This includes bulk loading large amounts of data into the table. Running `ANALYZE` (or `VACUUM ANALYZE`) ensures that the planner has up-to-date statistics about the table. With no statistics or obsolete statistics, the planner might make poor decisions during query planning, leading to poor performance on any tables with inaccurate or nonexistent statistics. Note that if the autovacuum daemon is enabled, it might run `ANALYZE` automatically; see [Section 25.1.3](routine-vacuuming#VACUUM-FOR-STATISTICS) and [Section 25.1.6](routine-vacuuming#AUTOVACUUM) for more information.

[#id](#POPULATE-PG-DUMP)

### 14.4.9. Some Notes about pg_dump [#](#POPULATE-PG-DUMP)

Dump scripts generated by `pg_dump` automatically apply several, but not all, of the above guidelines. To restore a `pg_dump` dump as quickly as possible, you need to do a few extra things manually. (Note that these points apply while _restoring_ a dump, not while _creating_ it. The same points apply whether loading a text dump with psql or using pg_restore to load from a pg_dump archive file.)

By default, pg_dump uses `COPY`, and when it is generating a complete schema-and-data dump, it is careful to load data before creating indexes and foreign keys. So in this case several guidelines are handled automatically. What is left for you to do is to:

- Set appropriate (i.e., larger than normal) values for `maintenance_work_mem` and `max_wal_size`.

- If using WAL archiving or streaming replication, consider disabling them during the restore. To do that, set `archive_mode` to `off`, `wal_level` to `minimal`, and `max_wal_senders` to zero before loading the dump. Afterwards, set them back to the right values and take a fresh base backup.

- Experiment with the parallel dump and restore modes of both pg_dump and pg_restore and find the optimal number of concurrent jobs to use. Dumping and restoring in parallel by means of the `-j` option should give you a significantly higher performance over the serial mode.

- Consider whether the whole dump should be restored as a single transaction. To do that, pass the `-1` or `--single-transaction` command-line option to psql or pg_restore. When using this mode, even the smallest of errors will rollback the entire restore, possibly discarding many hours of processing. Depending on how interrelated the data is, that might seem preferable to manual cleanup, or not. `COPY` commands will run fastest if you use a single transaction and have WAL archiving turned off.

- If multiple CPUs are available in the database server, consider using pg_restore's `--jobs` option. This allows concurrent data loading and index creation.

- Run `ANALYZE` afterwards.

A data-only dump will still use `COPY`, but it does not drop or recreate indexes, and it does not normally touch foreign keys. [\[14\]](#ftn.id-1.5.13.7.11.4.2) So when loading a data-only dump, it is up to you to drop and recreate indexes and foreign keys if you wish to use those techniques. It's still useful to increase `max_wal_size` while loading the data, but don't bother increasing `maintenance_work_mem`; rather, you'd do that while manually recreating indexes and foreign keys afterwards. And don't forget to `ANALYZE` when you're done; see [Section 25.1.3](routine-vacuuming#VACUUM-FOR-STATISTICS) and [Section 25.1.6](routine-vacuuming#AUTOVACUUM) for more information.

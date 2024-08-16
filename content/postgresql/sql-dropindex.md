[#id](#SQL-DROPINDEX)

## DROP INDEX

DROP INDEX — remove an index

## Synopsis

```
DROP INDEX [ CONCURRENTLY ] [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.116.5)

## Description

`DROP INDEX` drops an existing index from the database system. To execute this command you must be the owner of the index.

[#id](#id-1.9.3.116.6)

## Parameters

- `CONCURRENTLY`

  Drop the index without locking out concurrent selects, inserts, updates, and deletes on the index's table. A normal `DROP INDEX` acquires an `ACCESS EXCLUSIVE` lock on the table, blocking other accesses until the index drop can be completed. With this option, the command instead waits until conflicting transactions have completed.

  There are several caveats to be aware of when using this option. Only one index name can be specified, and the `CASCADE` option is not supported. (Thus, an index that supports a `UNIQUE` or `PRIMARY KEY` constraint cannot be dropped this way.) Also, regular `DROP INDEX` commands can be performed within a transaction block, but `DROP INDEX CONCURRENTLY` cannot. Lastly, indexes on partitioned tables cannot be dropped using this option.

  For temporary tables, `DROP INDEX` is always non-concurrent, as no other session can access them, and non-concurrent index drop is cheaper.

- `IF EXISTS`

  Do not throw an error if the index does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of an index to remove.

- `CASCADE`

  Automatically drop objects that depend on the index, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the index if any objects depend on it. This is the default.

[#id](#id-1.9.3.116.7)

## Examples

This command will remove the index `title_idx`:

```
DROP INDEX title_idx;
```

[#id](#id-1.9.3.116.8)

## Compatibility

`DROP INDEX` is a PostgreSQL language extension. There are no provisions for indexes in the SQL standard.

[#id](#id-1.9.3.116.9)

## See Also

[CREATE INDEX](sql-createindex)

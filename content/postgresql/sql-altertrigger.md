[#id](#SQL-ALTERTRIGGER)

## ALTER TRIGGER

ALTER TRIGGER — change the definition of a trigger

## Synopsis

```
ALTER TRIGGER name ON table_name RENAME TO new_name
ALTER TRIGGER name ON table_name [ NO ] DEPENDS ON EXTENSION extension_name
```

[#id](#id-1.9.3.41.5)

## Description

`ALTER TRIGGER` changes properties of an existing trigger.

The `RENAME` clause changes the name of the given trigger without otherwise changing the trigger definition. If the table that the trigger is on is a partitioned table, then corresponding clone triggers in the partitions are renamed too.

The `DEPENDS ON EXTENSION` clause marks the trigger as dependent on an extension, such that if the extension is dropped, the trigger will automatically be dropped as well.

You must own the table on which the trigger acts to be allowed to change its properties.

[#id](#id-1.9.3.41.6)

## Parameters

- _`name`_

  The name of an existing trigger to alter.

- _`table_name`_

  The name of the table on which this trigger acts.

- _`new_name`_

  The new name for the trigger.

- _`extension_name`_

  The name of the extension that the trigger is to depend on (or no longer dependent on, if `NO` is specified). A trigger that's marked as dependent on an extension is automatically dropped when the extension is dropped.

[#id](#id-1.9.3.41.7)

## Notes

The ability to temporarily enable or disable a trigger is provided by [`ALTER TABLE`](sql-altertable), not by `ALTER TRIGGER`, because `ALTER TRIGGER` has no convenient way to express the option of enabling or disabling all of a table's triggers at once.

[#id](#id-1.9.3.41.8)

## Examples

To rename an existing trigger:

```
ALTER TRIGGER emp_stamp ON emp RENAME TO emp_track_chgs;
```

To mark a trigger as being dependent on an extension:

```
ALTER TRIGGER emp_stamp ON emp DEPENDS ON EXTENSION emplib;
```

[#id](#id-1.9.3.41.9)

## Compatibility

`ALTER TRIGGER` is a PostgreSQL extension of the SQL standard.

[#id](#id-1.9.3.41.10)

## See Also

[ALTER TABLE](sql-altertable)

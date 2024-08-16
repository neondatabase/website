[#id](#SQL-DROPPOLICY)

## DROP POLICY

DROP POLICY — remove a row-level security policy from a table

## Synopsis

```
DROP POLICY [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.123.5)

## Description

`DROP POLICY` removes the specified policy from the table. Note that if the last policy is removed for a table and the table still has row-level security enabled via `ALTER TABLE`, then the default-deny policy will be used. `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` can be used to disable row-level security for a table, whether policies for the table exist or not.

[#id](#id-1.9.3.123.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the policy does not exist. A notice is issued in this case.

- _`name`_

  The name of the policy to drop.

- _`table_name`_

  The name (optionally schema-qualified) of the table that the policy is on.

- `CASCADE``RESTRICT`

  These key words do not have any effect, since there are no dependencies on policies.

[#id](#id-1.9.3.123.7)

## Examples

To drop the policy called `p1` on the table named `my_table`:

```
DROP POLICY p1 ON my_table;
```

[#id](#id-1.9.3.123.8)

## Compatibility

`DROP POLICY` is a PostgreSQL extension.

[#id](#id-1.9.3.123.9)

## See Also

[CREATE POLICY](sql-createpolicy), [ALTER POLICY](sql-alterpolicy)

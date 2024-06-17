[#id](#CATALOG-PG-ENUM)

## 53.20. `pg_enum` [#](#CATALOG-PG-ENUM)

The `pg_enum` catalog contains entries showing the values and labels for each enum type. The internal representation of a given enum value is actually the OID of its associated row in `pg_enum`.

[#id](#id-1.10.4.22.4)

**Table 53.20. `pg_enum` Columns**

| Column TypeDescription                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                 |
| `enumtypid` `oid` (references [`pg_type`](catalog-pg-type).`oid`)The OID of the [`pg_type`](catalog-pg-type) entry owning this enum value |
| `enumsortorder` `float4`The sort position of this enum value within its enum type                                                         |
| `enumlabel` `name`The textual label for this enum value                                                                                   |

The OIDs for `pg_enum` rows follow a special rule: even-numbered OIDs are guaranteed to be ordered in the same way as the sort ordering of their enum type. That is, if two even OIDs belong to the same enum type, the smaller OID must have the smaller `enumsortorder` value. Odd-numbered OID values need bear no relationship to the sort order. This rule allows the enum comparison routines to avoid catalog lookups in many common cases. The routines that create and alter enum types attempt to assign even OIDs to enum values whenever possible.

When an enum type is created, its members are assigned sort-order positions 1.._`n`_. But members added later might be given negative or fractional values of `enumsortorder`. The only requirement on these values is that they be correctly ordered and unique within each enum type.

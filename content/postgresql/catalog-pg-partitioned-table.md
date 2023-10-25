<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   53.37. `pg_partitioned_table`                  |                                                   |                             |                                                       |                                                    |
| :--------------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -------------------------------------------------: |
| [Prev](catalog-pg-parameter-acl.html "53.36. pg_parameter_acl")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-policy.html "53.38. pg_policy") |

***

## 53.37. `pg_partitioned_table` [#](#CATALOG-PG-PARTITIONED-TABLE)



The catalog `pg_partitioned_table` stores information about how tables are partitioned.

**Table 53.37. `pg_partitioned_table` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `partrelid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The OID of the [`pg_class`](catalog-pg-class.html "53.11. pg_class") entry for this partitioned table                                                                                                                                                                                                                                                                           |
| `partstrat` `char`Partitioning strategy; `h` = hash partitioned table, `l` = list partitioned table, `r` = range partitioned table                                                                                                                                                                                                                                                                                                                                        |
| `partnatts` `int2`The number of columns in the partition key                                                                                                                                                                                                                                                                                                                                                                                                              |
| `partdefid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The OID of the [`pg_class`](catalog-pg-class.html "53.11. pg_class") entry for the default partition of this partitioned table, or zero if this partitioned table does not have a default partition                                                                                                                                                                             |
| `partattrs` `int2vector` (references [`pg_attribute`](catalog-pg-attribute.html "53.7. pg_attribute").`attnum`)This is an array of `partnatts` values that indicate which table columns are part of the partition key. For example, a value of `1 3` would mean that the first and the third table columns make up the partition key. A zero in this array indicates that the corresponding partition key column is an expression, rather than a simple column reference. |
| `partclass` `oidvector` (references [`pg_opclass`](catalog-pg-opclass.html "53.33. pg_opclass").`oid`)For each column in the partition key, this contains the OID of the operator class to use. See [`pg_opclass`](catalog-pg-opclass.html "53.33. pg_opclass") for details.                                                                                                                                                                                              |
| `partcollation` `oidvector` (references [`pg_collation`](catalog-pg-collation.html "53.12. pg_collation").`oid`)For each column in the partition key, this contains the OID of the collation to use for partitioning, or zero if the column is not of a collatable data type.                                                                                                                                                                                             |
| `partexprs` `pg_node_tree`Expression trees (in `nodeToString()` representation) for partition key columns that are not simple column references. This is a list with one element for each zero entry in `partattrs`. Null if all partition key columns are simple references.                                                                                                                                                                                             |

***

|                                                                  |                                                       |                                                    |
| :--------------------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------: |
| [Prev](catalog-pg-parameter-acl.html "53.36. pg_parameter_acl")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-policy.html "53.38. pg_policy") |
| 53.36. `pg_parameter_acl`                                        | [Home](index.html "PostgreSQL 17devel Documentation") |                                 53.38. `pg_policy` |

<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 53.34. `pg_operator`                 |                                                   |                             |                                                       |                                                        |
| :--------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -----------------------------------------------------: |
| [Prev](catalog-pg-opclass.html "53.33. pg_opclass")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-opfamily.html "53.35. pg_opfamily") |

***

## 53.34. `pg_operator` [#](#CATALOG-PG-OPERATOR)

The catalog `pg_operator` stores information about operators. See [CREATE OPERATOR](sql-createoperator.html "CREATE OPERATOR") and [Section 38.14](xoper.html "38.14. User-Defined Operators") for more information.

**Table 53.34. `pg_operator` Columns**

| Column TypeDescription                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                     |
| `oprname` `name`Name of the operator                                                                                                                                          |
| `oprnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)The OID of the namespace that contains this operator                 |
| `oprowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the operator                                                              |
| `oprkind` `char``b` = infix operator (“both”), or `l` = prefix operator (“left”)                                                                                              |
| `oprcanmerge` `bool`This operator supports merge joins                                                                                                                        |
| `oprcanhash` `bool`This operator supports hash joins                                                                                                                          |
| `oprleft` `oid` (references [`pg_type`](catalog-pg-type.html "53.64. pg_type").`oid`)Type of the left operand (zero for a prefix operator)                                    |
| `oprright` `oid` (references [`pg_type`](catalog-pg-type.html "53.64. pg_type").`oid`)Type of the right operand                                                               |
| `oprresult` `oid` (references [`pg_type`](catalog-pg-type.html "53.64. pg_type").`oid`)Type of the result (zero for a not-yet-defined “shell” operator)                       |
| `oprcom` `oid` (references [`pg_operator`](catalog-pg-operator.html "53.34. pg_operator").`oid`)Commutator of this operator (zero if none)                                    |
| `oprnegate` `oid` (references [`pg_operator`](catalog-pg-operator.html "53.34. pg_operator").`oid`)Negator of this operator (zero if none)                                    |
| `oprcode` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)Function that implements this operator (zero for a not-yet-defined “shell” operator) |
| `oprrest` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)Restriction selectivity estimation function for this operator (zero if none)         |
| `oprjoin` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)Join selectivity estimation function for this operator (zero if none)                |

***

|                                                      |                                                       |                                                        |
| :--------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------: |
| [Prev](catalog-pg-opclass.html "53.33. pg_opclass")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-opfamily.html "53.35. pg_opfamily") |
| 53.33. `pg_opclass`                                  | [Home](index.html "PostgreSQL 17devel Documentation") |                                   53.35. `pg_opfamily` |

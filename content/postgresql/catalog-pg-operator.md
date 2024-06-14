[#id](#CATALOG-PG-OPERATOR)

## 53.34. `pg_operator` [#](#CATALOG-PG-OPERATOR)

The catalog `pg_operator` stores information about operators. See [CREATE OPERATOR](sql-createoperator) and [Section 38.14](xoper) for more information.

[#id](#id-1.10.4.36.4)

**Table 53.34. `pg_operator` Columns**

| Column TypeDescription                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                               |
| `oprname` `name`Name of the operator                                                                                                                    |
| `oprnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace).`oid`)The OID of the namespace that contains this operator                      |
| `oprowner` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)Owner of the operator                                                               |
| `oprkind` `char``b` = infix operator (“both”), or `l` = prefix operator (“left”)                                                                        |
| `oprcanmerge` `bool`This operator supports merge joins                                                                                                  |
| `oprcanhash` `bool`This operator supports hash joins                                                                                                    |
| `oprleft` `oid` (references [`pg_type`](catalog-pg-type).`oid`)Type of the left operand (zero for a prefix operator)                                    |
| `oprright` `oid` (references [`pg_type`](catalog-pg-type).`oid`)Type of the right operand                                                               |
| `oprresult` `oid` (references [`pg_type`](catalog-pg-type).`oid`)Type of the result (zero for a not-yet-defined “shell” operator)                       |
| `oprcom` `oid` (references [`pg_operator`](catalog-pg-operator).`oid`)Commutator of this operator (zero if none)                                        |
| `oprnegate` `oid` (references [`pg_operator`](catalog-pg-operator).`oid`)Negator of this operator (zero if none)                                        |
| `oprcode` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)Function that implements this operator (zero for a not-yet-defined “shell” operator) |
| `oprrest` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)Restriction selectivity estimation function for this operator (zero if none)         |
| `oprjoin` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)Join selectivity estimation function for this operator (zero if none)                |

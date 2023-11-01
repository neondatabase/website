## 53.33. `pg_opclass` [#](#CATALOG-PG-OPCLASS)

The catalog `pg_opclass` defines index access method operator classes. Each operator class defines semantics for index columns of a particular data type and a particular index access method. An operator class essentially specifies that a particular operator family is applicable to a particular indexable column data type. The set of operators from the family that are actually usable with the indexed column are whichever ones accept the column's data type as their left-hand input.

Operator classes are described at length in [Section 38.16](xindex.html "38.16. Interfacing Extensions to Indexes").

**Table 53.33. `pg_opclass` Columns**

| Column TypeDescription                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                            |
| `opcmethod` `oid` (references [`pg_am`](catalog-pg-am.html "53.3. pg_am").`oid`)Index access method operator class is for                            |
| `opcname` `name`Name of this operator class                                                                                                          |
| `opcnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)Namespace of this operator class            |
| `opcowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the operator class                               |
| `opcfamily` `oid` (references [`pg_opfamily`](catalog-pg-opfamily.html "53.35. pg_opfamily").`oid`)Operator family containing the operator class     |
| `opcintype` `oid` (references [`pg_type`](catalog-pg-type.html "53.64. pg_type").`oid`)Data type that the operator class indexes                     |
| `opcdefault` `bool`True if this operator class is the default for `opcintype`                                                                        |
| `opckeytype` `oid` (references [`pg_type`](catalog-pg-type.html "53.64. pg_type").`oid`)Type of data stored in index, or zero if same as `opcintype` |

\

An operator class's `opcmethod` must match the `opfmethod` of its containing operator family. Also, there must be no more than one `pg_opclass` row having `opcdefault` true for any given combination of `opcmethod` and `opcintype`.
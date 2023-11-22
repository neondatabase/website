## 53.35. `pg_opfamily` [#](#CATALOG-PG-OPFAMILY)

The catalog `pg_opfamily` defines operator families. Each operator family is a collection of operators and associated support routines that implement the semantics specified for a particular index access method. Furthermore, the operators in a family are all “compatible”, in a way that is specified by the access method. The operator family concept allows cross-data-type operators to be used with indexes and to be reasoned about using knowledge of access method semantics.

Operator families are described at length in [Section 38.16](xindex.html "38.16. Interfacing Extensions to Indexes").

**Table 53.35. `pg_opfamily` Columns**

| Column TypeDescription                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------ |
| `oid` `oid`Row identifier                                                                                                                  |
| `opfmethod` `oid` (references [`pg_am`](catalog-pg-am.html "53.3. pg_am").`oid`)Index access method operator family is for                 |
| `opfname` `name`Name of this operator family                                                                                               |
| `opfnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)Namespace of this operator family |
| `opfowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the operator family                    |

\

The majority of the information defining an operator family is not in its `pg_opfamily` row, but in the associated rows in [`pg_amop`](catalog-pg-amop.html "53.4. pg_amop"), [`pg_amproc`](catalog-pg-amproc.html "53.5. pg_amproc"), and [`pg_opclass`](catalog-pg-opclass.html "53.33. pg_opclass").
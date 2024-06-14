[#id](#CATALOG-PG-DEPEND)

## 53.18. `pg_depend` [#](#CATALOG-PG-DEPEND)

The catalog `pg_depend` records the dependency relationships between database objects. This information allows `DROP` commands to find which other objects must be dropped by `DROP CASCADE` or prevent dropping in the `DROP RESTRICT` case.

See also [`pg_shdepend`](catalog-pg-shdepend), which performs a similar function for dependencies involving objects that are shared across a database cluster.

[#id](#id-1.10.4.20.5)

**Table 53.18. `pg_depend` Columns**

| Column TypeDescription                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `classid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The OID of the system catalog the dependent object is in                                                       |
| `objid` `oid` (references any OID column)The OID of the specific dependent object                                                                                               |
| `objsubid` `int4`For a table column, this is the column number (the `objid` and `classid` refer to the table itself). For all other object types, this column is zero.          |
| `refclassid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The OID of the system catalog the referenced object is in                                                   |
| `refobjid` `oid` (references any OID column)The OID of the specific referenced object                                                                                           |
| `refobjsubid` `int4`For a table column, this is the column number (the `refobjid` and `refclassid` refer to the table itself). For all other object types, this column is zero. |
| `deptype` `char`A code defining the specific semantics of this dependency relationship; see text                                                                                |

In all cases, a `pg_depend` entry indicates that the referenced object cannot be dropped without also dropping the dependent object. However, there are several subflavors identified by `deptype`:

- `DEPENDENCY_NORMAL` (`n`)

  A normal relationship between separately-created objects. The dependent object can be dropped without affecting the referenced object. The referenced object can only be dropped by specifying `CASCADE`, in which case the dependent object is dropped, too. Example: a table column has a normal dependency on its data type.

- `DEPENDENCY_AUTO` (`a`)

  The dependent object can be dropped separately from the referenced object, and should be automatically dropped (regardless of `RESTRICT` or `CASCADE` mode) if the referenced object is dropped. Example: a named constraint on a table is made auto-dependent on the table, so that it will go away if the table is dropped.

- `DEPENDENCY_INTERNAL` (`i`)

  The dependent object was created as part of creation of the referenced object, and is really just a part of its internal implementation. A direct `DROP` of the dependent object will be disallowed outright (we'll tell the user to issue a `DROP` against the referenced object, instead). A `DROP` of the referenced object will result in automatically dropping the dependent object whether `CASCADE` is specified or not. If the dependent object has to be dropped due to a dependency on some other object being removed, its drop is converted to a drop of the referenced object, so that `NORMAL` and `AUTO` dependencies of the dependent object behave much like they were dependencies of the referenced object. Example: a view's `ON SELECT` rule is made internally dependent on the view, preventing it from being dropped while the view remains. Dependencies of the rule (such as tables it refers to) act as if they were dependencies of the view.

- `DEPENDENCY_PARTITION_PRI` (`P`)`DEPENDENCY_PARTITION_SEC` (`S`)

  The dependent object was created as part of creation of the referenced object, and is really just a part of its internal implementation; however, unlike `INTERNAL`, there is more than one such referenced object. The dependent object must not be dropped unless at least one of these referenced objects is dropped; if any one is, the dependent object should be dropped whether or not `CASCADE` is specified. Also unlike `INTERNAL`, a drop of some other object that the dependent object depends on does not result in automatic deletion of any partition-referenced object. Hence, if the drop does not cascade to at least one of these objects via some other path, it will be refused. (In most cases, the dependent object shares all its non-partition dependencies with at least one partition-referenced object, so that this restriction does not result in blocking any cascaded delete.) Primary and secondary partition dependencies behave identically except that the primary dependency is preferred for use in error messages; hence, a partition-dependent object should have one primary partition dependency and one or more secondary partition dependencies. Note that partition dependencies are made in addition to, not instead of, any dependencies the object would normally have. This simplifies `ATTACH/DETACH PARTITION` operations: the partition dependencies need only be added or removed. Example: a child partitioned index is made partition-dependent on both the partition table it is on and the parent partitioned index, so that it goes away if either of those is dropped, but not otherwise. The dependency on the parent index is primary, so that if the user tries to drop the child partitioned index, the error message will suggest dropping the parent index instead (not the table).

- `DEPENDENCY_EXTENSION` (`e`)

  The dependent object is a member of the _extension_ that is the referenced object (see [`pg_extension`](catalog-pg-extension)). The dependent object can be dropped only via [`DROP EXTENSION`](sql-dropextension) on the referenced object. Functionally this dependency type acts the same as an `INTERNAL` dependency, but it's kept separate for clarity and to simplify pg_dump.

- `DEPENDENCY_AUTO_EXTENSION` (`x`)

  The dependent object is not a member of the extension that is the referenced object (and so it should not be ignored by pg_dump), but it cannot function without the extension and should be auto-dropped if the extension is. The dependent object may be dropped on its own as well. Functionally this dependency type acts the same as an `AUTO` dependency, but it's kept separate for clarity and to simplify pg_dump.

Other dependency flavors might be needed in future.

Note that it's quite possible for two objects to be linked by more than one `pg_depend` entry. For example, a child partitioned index would have both a partition-type dependency on its associated partition table, and an auto dependency on each column of that table that it indexes. This sort of situation expresses the union of multiple dependency semantics. A dependent object can be dropped without `CASCADE` if any of its dependencies satisfies its condition for automatic dropping. Conversely, all the dependencies' restrictions about which objects must be dropped together must be satisfied.

Most objects created during initdb are considered “pinned”, which means that the system itself depends on them. Therefore, they are never allowed to be dropped. Also, knowing that pinned objects will not be dropped, the dependency mechanism doesn't bother to make `pg_depend` entries showing dependencies on them. Thus, for example, a table column of type `numeric` notionally has a `NORMAL` dependency on the `numeric` data type, but no such entry actually appears in `pg_depend`.

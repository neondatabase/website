

|                  53.48. `pg_shdepend`                  |                                                   |                             |                                                       |                                                                  |
| :----------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------------------------: |
| [Prev](catalog-pg-sequence.html "53.47. pg_sequence")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-shdescription.html "53.49. pg_shdescription") |

***

## 53.48. `pg_shdepend` [#](#CATALOG-PG-SHDEPEND)

The catalog `pg_shdepend` records the dependency relationships between database objects and shared objects, such as roles. This information allows PostgreSQL to ensure that those objects are unreferenced before attempting to delete them.

See also [`pg_depend`](catalog-pg-depend.html "53.18. pg_depend"), which performs a similar function for dependencies involving objects within a single database.

Unlike most system catalogs, `pg_shdepend` is shared across all databases of a cluster: there is only one copy of `pg_shdepend` per cluster, not one per database.

**Table 53.48. `pg_shdepend` Columns**

| Column TypeDescription                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dbid` `oid` (references [`pg_database`](catalog-pg-database.html "53.15. pg_database").`oid`)The OID of the database the dependent object is in, or zero for a shared object   |
| `classid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The OID of the system catalog the dependent object is in                                |
| `objid` `oid` (references any OID column)The OID of the specific dependent object                                                                                               |
| `objsubid` `int4`For a table column, this is the column number (the `objid` and `classid` refer to the table itself). For all other object types, this column is zero.          |
| `refclassid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The OID of the system catalog the referenced object is in (must be a shared catalog) |
| `refobjid` `oid` (references any OID column)The OID of the specific referenced object                                                                                           |
| `deptype` `char`A code defining the specific semantics of this dependency relationship; see text                                                                                |

\

In all cases, a `pg_shdepend` entry indicates that the referenced object cannot be dropped without also dropping the dependent object. However, there are several subflavors identified by `deptype`:

* `SHARED_DEPENDENCY_OWNER` (`o`)

    The referenced object (which must be a role) is the owner of the dependent object.

* `SHARED_DEPENDENCY_ACL` (`a`)

    The referenced object (which must be a role) is mentioned in the ACL (access control list, i.e., privileges list) of the dependent object. (A `SHARED_DEPENDENCY_ACL` entry is not made for the owner of the object, since the owner will have a `SHARED_DEPENDENCY_OWNER` entry anyway.)

* `SHARED_DEPENDENCY_POLICY` (`r`)

    The referenced object (which must be a role) is mentioned as the target of a dependent policy object.

* `SHARED_DEPENDENCY_TABLESPACE` (`t`)

    The referenced object (which must be a tablespace) is mentioned as the tablespace for a relation that doesn't have storage.

Other dependency flavors might be needed in future. Note in particular that the current definition only supports roles and tablespaces as referenced objects.

As in the `pg_depend` catalog, most objects created during initdb are considered “pinned”. No entries are made in `pg_shdepend` that would have a pinned object as either referenced or dependent object.

***

|                                                        |                                                       |                                                                  |
| :----------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------------------: |
| [Prev](catalog-pg-sequence.html "53.47. pg_sequence")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-shdescription.html "53.49. pg_shdescription") |
| 53.47. `pg_sequence`                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                                        53.49. `pg_shdescription` |

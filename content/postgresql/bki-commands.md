## 75.4. BKI Commands [#](#BKI-COMMANDS)

* `create` *`tablename`* *`tableoid`* \[`bootstrap`] \[`shared_relation`] \[`rowtype_oid` *`oid`*] (*`name1`* = *`type1`* \[`FORCE NOT NULL` | `FORCE NULL` ] \[, *`name2`* = *`type2`* \[`FORCE NOT NULL` | `FORCE NULL` ], ...])

    Create a table named *`tablename`*, and having the OID *`tableoid`*, with the columns given in parentheses.

    The following column types are supported directly by `bootstrap.c`: `bool`, `bytea`, `char` (1 byte), `name`, `int2`, `int4`, `regproc`, `regclass`, `regtype`, `text`, `oid`, `tid`, `xid`, `cid`, `int2vector`, `oidvector`, `_int4` (array), `_text` (array), `_oid` (array), `_char` (array), `_aclitem` (array). Although it is possible to create tables containing columns of other types, this cannot be done until after `pg_type` has been created and filled with appropriate entries. (That effectively means that only these column types can be used in bootstrap catalogs, but non-bootstrap catalogs can contain any built-in type.)

    When `bootstrap` is specified, the table will only be created on disk; nothing is entered into `pg_class`, `pg_attribute`, etc., for it. Thus the table will not be accessible by ordinary SQL operations until such entries are made the hard way (with `insert` commands). This option is used for creating `pg_class` etc. themselves.

    The table is created as shared if `shared_relation` is specified. The table's row type OID (`pg_type` OID) can optionally be specified via the `rowtype_oid` clause; if not specified, an OID is automatically generated for it. (The `rowtype_oid` clause is useless if `bootstrap` is specified, but it can be provided anyway for documentation.)

* `open` *`tablename`*

    Open the table named *`tablename`* for insertion of data. Any currently open table is closed.

* `close` *`tablename`*

    Close the open table. The name of the table must be given as a cross-check.

* `insert` `(` \[*`oid_value`*] *`value1`* *`value2`* ... `)`

    Insert a new row into the open table using *`value1`*, *`value2`*, etc., for its column values.

    NULL values can be specified using the special key word `_null_`. Values that do not look like identifiers or digit strings must be single-quoted. (To include a single quote in a value, write it twice. Escape-string-style backslash escapes are allowed in the string, too.)

* `declare` \[`unique`] `index` *`indexname`* *`indexoid`* `on` *`tablename`* `using` *`amname`* `(` *`opclass1`* *`name1`* \[, ...] `)`

    Create an index named *`indexname`*, having OID *`indexoid`*, on the table named *`tablename`*, using the *`amname`* access method. The fields to index are called *`name1`*, *`name2`* etc., and the operator classes to use are *`opclass1`*, *`opclass2`* etc., respectively. The index file is created and appropriate catalog entries are made for it, but the index contents are not initialized by this command.

* `declare toast` *`toasttableoid`* *`toastindexoid`* `on` *`tablename`*

    Create a TOAST table for the table named *`tablename`*. The TOAST table is assigned OID *`toasttableoid`* and its index is assigned OID *`toastindexoid`*. As with `declare index`, filling of the index is postponed.

* `build indices`

    Fill in the indices that have previously been declared.
[#id](#BKI-COMMANDS)

## 75.4. BKI Commands [#](#BKI-COMMANDS)

- `create` _`tablename`_ _`tableoid`_ \[`bootstrap`] \[`shared_relation`] \[`rowtype_oid` _`oid`_] (_`name1`_ = _`type1`_ \[`FORCE NOT NULL` | `FORCE NULL` ] \[, _`name2`_ = _`type2`_ \[`FORCE NOT NULL` | `FORCE NULL` ], ...])

  Create a table named _`tablename`_, and having the OID _`tableoid`_, with the columns given in parentheses.

  The following column types are supported directly by `bootstrap.c`: `bool`, `bytea`, `char` (1 byte), `name`, `int2`, `int4`, `regproc`, `regclass`, `regtype`, `text`, `oid`, `tid`, `xid`, `cid`, `int2vector`, `oidvector`, `_int4` (array), `_text` (array), `_oid` (array), `_char` (array), `_aclitem` (array). Although it is possible to create tables containing columns of other types, this cannot be done until after `pg_type` has been created and filled with appropriate entries. (That effectively means that only these column types can be used in bootstrap catalogs, but non-bootstrap catalogs can contain any built-in type.)

  When `bootstrap` is specified, the table will only be created on disk; nothing is entered into `pg_class`, `pg_attribute`, etc., for it. Thus the table will not be accessible by ordinary SQL operations until such entries are made the hard way (with `insert` commands). This option is used for creating `pg_class` etc. themselves.

  The table is created as shared if `shared_relation` is specified. The table's row type OID (`pg_type` OID) can optionally be specified via the `rowtype_oid` clause; if not specified, an OID is automatically generated for it. (The `rowtype_oid` clause is useless if `bootstrap` is specified, but it can be provided anyway for documentation.)

- `open` _`tablename`_

  Open the table named _`tablename`_ for insertion of data. Any currently open table is closed.

- `close` _`tablename`_

  Close the open table. The name of the table must be given as a cross-check.

- `insert` `(` \[_`oid_value`_] _`value1`_ _`value2`_ ... `)`

  Insert a new row into the open table using _`value1`_, _`value2`_, etc., for its column values.

  NULL values can be specified using the special key word `_null_`. Values that do not look like identifiers or digit strings must be single-quoted. (To include a single quote in a value, write it twice. Escape-string-style backslash escapes are allowed in the string, too.)

- `declare` \[`unique`] `index` _`indexname`_ _`indexoid`_ `on` _`tablename`_ `using` _`amname`_ `(` _`opclass1`_ _`name1`_ \[, ...] `)`

  Create an index named _`indexname`_, having OID _`indexoid`_, on the table named _`tablename`_, using the _`amname`_ access method. The fields to index are called _`name1`_, _`name2`_ etc., and the operator classes to use are _`opclass1`_, _`opclass2`_ etc., respectively. The index file is created and appropriate catalog entries are made for it, but the index contents are not initialized by this command.

- `declare toast` _`toasttableoid`_ _`toastindexoid`_ `on` _`tablename`_

  Create a TOAST table for the table named _`tablename`_. The TOAST table is assigned OID _`toasttableoid`_ and its index is assigned OID _`toastindexoid`_. As with `declare index`, filling of the index is postponed.

- `build indices`

  Fill in the indices that have previously been declared.

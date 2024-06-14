[#id](#CATALOG-PG-TS-TEMPLATE)

## 53.63. `pg_ts_template` [#](#CATALOG-PG-TS-TEMPLATE)

The `pg_ts_template` catalog contains entries defining text search templates. A template is the implementation skeleton for a class of text search dictionaries. Since a template must be implemented by C-language-level functions, creation of new templates is restricted to database superusers.

PostgreSQL's text search features are described at length in [Chapter 12](textsearch).

[#id](#id-1.10.4.65.5)

**Table 53.63. `pg_ts_template` Columns**

| Column TypeDescription                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                           |
| `tmplname` `name`Text search template name                                                                                          |
| `tmplnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace).`oid`)The OID of the namespace that contains this template |
| `tmplinit` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)OID of the template's initialization function (zero if none)    |
| `tmpllexize` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)OID of the template's lexize function                         |

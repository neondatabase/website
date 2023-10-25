

|                       53.22. `pg_extension`                      |                                                   |                             |                                                       |                                                                                |
| :--------------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------------: |
| [Prev](catalog-pg-event-trigger.html "53.21. pg_event_trigger")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-foreign-data-wrapper.html "53.23. pg_foreign_data_wrapper") |

***

## 53.22. `pg_extension` [#](#CATALOG-PG-EXTENSION)

The catalog `pg_extension` stores information about the installed extensions. See [Section 38.17](extend-extensions.html "38.17. Packaging Related Objects into an Extension") for details about extensions.

**Table 53.22. `pg_extension` Columns**

| Column TypeDescription                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                          |
| `extname` `name`Name of the extension                                                                                                                                              |
| `extowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the extension                                                                  |
| `extnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)Schema containing the extension's exported objects                        |
| `extrelocatable` `bool`True if extension can be relocated to another schema                                                                                                        |
| `extversion` `text`Version name for the extension                                                                                                                                  |
| `extconfig` `oid[]` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)Array of `regclass` OIDs for the extension's configuration table(s), or `NULL` if none |
| `extcondition` `text[]`Array of `WHERE`-clause filter conditions for the extension's configuration table(s), or `NULL` if none                                                     |

\

Note that unlike most catalogs with a “namespace” column, `extnamespace` is not meant to imply that the extension belongs to that schema. Extension names are never schema-qualified. Rather, `extnamespace` indicates the schema that contains most or all of the extension's objects. If `extrelocatable` is true, then this schema must in fact contain all schema-qualifiable objects belonging to the extension.

***

|                                                                  |                                                       |                                                                                |
| :--------------------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------------------------------: |
| [Prev](catalog-pg-event-trigger.html "53.21. pg_event_trigger")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-foreign-data-wrapper.html "53.23. pg_foreign_data_wrapper") |
| 53.21. `pg_event_trigger`                                        | [Home](index.html "PostgreSQL 17devel Documentation") |                                               53.23. `pg_foreign_data_wrapper` |

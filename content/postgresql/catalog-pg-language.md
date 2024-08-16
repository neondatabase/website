[#id](#CATALOG-PG-LANGUAGE)

## 53.29. `pg_language` [#](#CATALOG-PG-LANGUAGE)

The catalog `pg_language` registers languages in which you can write functions or stored procedures. See [CREATE LANGUAGE](sql-createlanguage) and [Chapter 42](xplang) for more information about language handlers.

[#id](#id-1.10.4.31.4)

**Table 53.29. `pg_language` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                                                  |
| `lanname` `name`Name of the language                                                                                                                                                                                                                                                       |
| `lanowner` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)Owner of the language                                                                                                                                                                                                  |
| `lanispl` `bool`This is false for internal languages (such as SQL) and true for user-defined languages. Currently, pg_dump still uses this to determine which languages need to be dumped, but this might be replaced by a different mechanism in the future.                              |
| `lanpltrusted` `bool`True if this is a trusted language, which means that it is believed not to grant access to anything outside the normal SQL execution environment. Only superusers can create functions in untrusted languages.                                                        |
| `lanplcallfoid` `oid` (references [`pg_proc`](catalog-pg-proc).`oid`)For noninternal languages this references the language handler, which is a special function that is responsible for executing all functions that are written in the particular language. Zero for internal languages. |
| `laninline` `oid` (references [`pg_proc`](catalog-pg-proc).`oid`)This references a function that is responsible for executing “inline” anonymous code blocks ([DO](sql-do) blocks). Zero if inline blocks are not supported.                                                               |
| `lanvalidator` `oid` (references [`pg_proc`](catalog-pg-proc).`oid`)This references a language validator function that is responsible for checking the syntax and validity of new functions when they are created. Zero if no validator is provided.                                       |
| `lanacl` `aclitem[]`Access privileges; see [Section 5.7](ddl-priv) for details                                                                                                                                                                                                             |

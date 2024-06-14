[#id](#INFOSCHEMA-CHARACTER-SETS)

## 37.7. `character_sets` [#](#INFOSCHEMA-CHARACTER-SETS)

The view `character_sets` identifies the character sets available in the current database. Since PostgreSQL does not support multiple character sets within one database, this view only shows one, which is the database encoding.

Take note of how the following terms are used in the SQL standard:

- character repertoire

  An abstract collection of characters, for example `UNICODE`, `UCS`, or `LATIN1`. Not exposed as an SQL object, but visible in this view.

- character encoding form

  An encoding of some character repertoire. Most older character repertoires only use one encoding form, and so there are no separate names for them (e.g., `LATIN1` is an encoding form applicable to the `LATIN1` repertoire). But for example Unicode has the encoding forms `UTF8`, `UTF16`, etc. (not all supported by PostgreSQL). Encoding forms are not exposed as an SQL object, but are visible in this view.

- character set

  A named SQL object that identifies a character repertoire, a character encoding, and a default collation. A predefined character set would typically have the same name as an encoding form, but users could define other names. For example, the character set `UTF8` would typically identify the character repertoire `UCS`, encoding form `UTF8`, and some default collation.

You can think of an “encoding” in PostgreSQL either as a character set or a character encoding form. They will have the same name, and there can only be one in one database.

[#id](#id-1.7.6.11.4)

**Table 37.5. `character_sets` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `character_set_catalog` `sql_identifier`Character sets are currently not implemented as schema objects, so this column is null.                                                                                                                                                                             |
| `character_set_schema` `sql_identifier`Character sets are currently not implemented as schema objects, so this column is null.                                                                                                                                                                              |
| `character_set_name` `sql_identifier`Name of the character set, currently implemented as showing the name of the database encoding                                                                                                                                                                          |
| `character_repertoire` `sql_identifier`Character repertoire, showing `UCS` if the encoding is `UTF8`, else just the encoding name                                                                                                                                                                           |
| `form_of_use` `sql_identifier`Character encoding form, same as the database encoding                                                                                                                                                                                                                        |
| `default_collate_catalog` `sql_identifier`Name of the database containing the default collation (always the current database, if any collation is identified)                                                                                                                                               |
| `default_collate_schema` `sql_identifier`Name of the schema containing the default collation                                                                                                                                                                                                                |
| `default_collate_name` `sql_identifier`Name of the default collation. The default collation is identified as the collation that matches the `COLLATE` and `CTYPE` settings of the current database. If there is no such collation, then this column and the associated schema and catalog columns are null. |

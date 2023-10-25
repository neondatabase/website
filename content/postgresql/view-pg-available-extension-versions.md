<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   54.3. `pg_available_extension_versions`                  |                                             |                          |                                                       |                                                                                  |
| :------------------------------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | -------------------------------------------------------------------------------: |
| [Prev](view-pg-available-extensions.html "54.2. pg_available_extensions")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-backend-memory-contexts.html "54.4. pg_backend_memory_contexts") |

***

## 54.3. `pg_available_extension_versions` [#](#VIEW-PG-AVAILABLE-EXTENSION-VERSIONS)



The `pg_available_extension_versions` view lists the specific extension versions that are available for installation. See also the [`pg_extension`](catalog-pg-extension.html "53.22. pg_extension") catalog, which shows the extensions currently installed.

**Table 54.3. `pg_available_extension_versions` Columns**

| Column TypeDescription                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------ |
| `name` `name`Extension name                                                                                              |
| `version` `text`Version name                                                                                             |
| `installed` `bool`True if this version of this extension is currently installed                                          |
| `superuser` `bool`True if only superusers are allowed to install this extension (but see `trusted`)                      |
| `trusted` `bool`True if the extension can be installed by non-superusers with appropriate privileges                     |
| `relocatable` `bool`True if extension can be relocated to another schema                                                 |
| `schema` `name`Name of the schema that the extension must be installed into, or `NULL` if partially or fully relocatable |
| `requires` `name[]`Names of prerequisite extensions, or `NULL` if none                                                   |
| `comment` `text`Comment string from the extension's control file                                                         |

\


The `pg_available_extension_versions` view is read-only.

***

|                                                                            |                                                       |                                                                                  |
| :------------------------------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------------------------------: |
| [Prev](view-pg-available-extensions.html "54.2. pg_available_extensions")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-backend-memory-contexts.html "54.4. pg_backend_memory_contexts") |
| 54.2. `pg_available_extensions`                                            | [Home](index.html "PostgreSQL 17devel Documentation") |                                               54.4. `pg_backend_memory_contexts` |

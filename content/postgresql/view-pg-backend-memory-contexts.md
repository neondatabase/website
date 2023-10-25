<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                             54.4. `pg_backend_memory_contexts`                             |                                             |                          |                                                       |                                                |
| :----------------------------------------------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](view-pg-available-extension-versions.html "54.3. pg_available_extension_versions")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-config.html "54.5. pg_config") |

***

## 54.4. `pg_backend_memory_contexts` [#](#VIEW-PG-BACKEND-MEMORY-CONTEXTS)



The view `pg_backend_memory_contexts` displays all the memory contexts of the server process attached to the current session.

`pg_backend_memory_contexts` contains one row for each memory context.

**Table 54.4. `pg_backend_memory_contexts` Columns**

| Column TypeDescription                                                                                |
| ----------------------------------------------------------------------------------------------------- |
| `name` `text`Name of the memory context                                                               |
| `ident` `text`Identification information of the memory context. This field is truncated at 1024 bytes |
| `parent` `text`Name of the parent of this memory context                                              |
| `level` `int4`Distance from TopMemoryContext in context tree                                          |
| `total_bytes` `int8`Total bytes allocated for this memory context                                     |
| `total_nblocks` `int8`Total number of blocks allocated for this memory context                        |
| `free_bytes` `int8`Free space in bytes                                                                |
| `free_chunks` `int8`Total number of free chunks                                                       |
| `used_bytes` `int8`Used space in bytes                                                                |

\


By default, the `pg_backend_memory_contexts` view can be read only by superusers or roles with the privileges of the `pg_read_all_stats` role.

***

|                                                                                            |                                                       |                                                |
| :----------------------------------------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------: |
| [Prev](view-pg-available-extension-versions.html "54.3. pg_available_extension_versions")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-config.html "54.5. pg_config") |
| 54.3. `pg_available_extension_versions`                                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                              54.5. `pg_config` |

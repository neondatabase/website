<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|        54.2. `pg_available_extensions`        |                                             |                          |                                                       |                                                                                            |
| :-------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------------------------: |
| [Prev](views-overview.html "54.1. Overview")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-available-extension-versions.html "54.3. pg_available_extension_versions") |

***

## 54.2. `pg_available_extensions` [#](#VIEW-PG-AVAILABLE-EXTENSIONS)

The `pg_available_extensions` view lists the extensions that are available for installation. See also the [`pg_extension`](catalog-pg-extension.html "53.22. pg_extension") catalog, which shows the extensions currently installed.

**Table 54.2. `pg_available_extensions` Columns**

| Column TypeDescription                                                                             |
| -------------------------------------------------------------------------------------------------- |
| `name` `name`Extension name                                                                        |
| `default_version` `text`Name of default version, or `NULL` if none is specified                    |
| `installed_version` `text`Currently installed version of the extension, or `NULL` if not installed |
| `comment` `text`Comment string from the extension's control file                                   |

\

The `pg_available_extensions` view is read-only.

***

|                                               |                                                       |                                                                                            |
| :-------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------------------------------------------: |
| [Prev](views-overview.html "54.1. Overview")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-available-extension-versions.html "54.3. pg_available_extension_versions") |
| 54.1. Overview                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                                    54.3. `pg_available_extension_versions` |

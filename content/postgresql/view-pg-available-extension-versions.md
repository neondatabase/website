[#id](#VIEW-PG-AVAILABLE-EXTENSION-VERSIONS)

## 54.3. `pg_available_extension_versions` [#](#VIEW-PG-AVAILABLE-EXTENSION-VERSIONS)

The `pg_available_extension_versions` view lists the specific extension versions that are available for installation. See also the [`pg_extension`](catalog-pg-extension) catalog, which shows the extensions currently installed.

[#id](#id-1.10.5.7.4)

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

The `pg_available_extension_versions` view is read-only.

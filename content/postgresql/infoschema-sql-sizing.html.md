<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  37.51. `sql_sizing`                  |                                                                    |                                    |                                                       |                                                                       |
| :---------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](infoschema-sql-parts.html "37.50. sql_parts")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-table-constraints.html "37.52. table_constraints") |

***

## 37.51. `sql_sizing` [#](#INFOSCHEMA-SQL-SIZING)

The table `sql_sizing` contains information about various size limits and maximum values in PostgreSQL. This information is primarily intended for use in the context of the ODBC interface; users of other interfaces will probably find this information to be of little use. For this reason, the individual sizing items are not described here; you will find them in the description of the ODBC interface.

**Table 37.49. `sql_sizing` Columns**

| Column TypeDescription                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sizing_id` `cardinal_number`Identifier of the sizing item                                                                                                                                            |
| `sizing_name` `character_data`Descriptive name of the sizing item                                                                                                                                     |
| `supported_value` `cardinal_number`Value of the sizing item, or 0 if the size is unlimited or cannot be determined, or null if the features for which the sizing item is applicable are not supported |
| `comments` `character_data`Possibly a comment pertaining to the sizing item                                                                                                                           |

***

|                                                       |                                                                    |                                                                       |
| :---------------------------------------------------- | :----------------------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](infoschema-sql-parts.html "37.50. sql_parts")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-table-constraints.html "37.52. table_constraints") |
| 37.50. `sql_parts`                                    |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                            37.52. `table_constraints` |

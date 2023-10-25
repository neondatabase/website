

|           54.31. `pg_timezone_abbrevs`          |                                             |                          |                                                       |                                                                 |
| :---------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](view-pg-tables.html "54.30. pg_tables")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-timezone-names.html "54.32. pg_timezone_names") |

***

## 54.31. `pg_timezone_abbrevs` [#](#VIEW-PG-TIMEZONE-ABBREVS)

The view `pg_timezone_abbrevs` provides a list of time zone abbreviations that are currently recognized by the datetime input routines. The contents of this view change when the [timezone\_abbreviations](runtime-config-client.html#GUC-TIMEZONE-ABBREVIATIONS) run-time parameter is modified.

**Table 54.31. `pg_timezone_abbrevs` Columns**

| Column TypeDescription                                                    |
| ------------------------------------------------------------------------- |
| `abbrev` `text`Time zone abbreviation                                     |
| `utc_offset` `interval`Offset from UTC (positive means east of Greenwich) |
| `is_dst` `bool`True if this is a daylight-savings abbreviation            |

\

While most timezone abbreviations represent fixed offsets from UTC, there are some that have historically varied in value (see [Section B.4](datetime-config-files.html "B.4. Date/Time Configuration Files") for more information). In such cases this view presents their current meaning.

***

|                                                 |                                                       |                                                                 |
| :---------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](view-pg-tables.html "54.30. pg_tables")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-timezone-names.html "54.32. pg_timezone_names") |
| 54.30. `pg_tables`                              | [Home](index.html "PostgreSQL 17devel Documentation") |                                      54.32. `pg_timezone_names` |

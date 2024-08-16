[#id](#VIEW-PG-TIMEZONE-NAMES)

## 54.32. `pg_timezone_names` [#](#VIEW-PG-TIMEZONE-NAMES)

The view `pg_timezone_names` provides a list of time zone names that are recognized by `SET TIMEZONE`, along with their associated abbreviations, UTC offsets, and daylight-savings status. (Technically, PostgreSQL does not use UTC because leap seconds are not handled.) Unlike the abbreviations shown in [`pg_timezone_abbrevs`](view-pg-timezone-abbrevs), many of these names imply a set of daylight-savings transition date rules. Therefore, the associated information changes across local DST boundaries. The displayed information is computed based on the current value of `CURRENT_TIMESTAMP`.

[#id](#id-1.10.5.36.4)

**Table 54.32. `pg_timezone_names` Columns**

| Column TypeDescription                                                    |
| ------------------------------------------------------------------------- |
| `name` `text`Time zone name                                               |
| `abbrev` `text`Time zone abbreviation                                     |
| `utc_offset` `interval`Offset from UTC (positive means east of Greenwich) |
| `is_dst` `bool`True if currently observing daylight savings               |

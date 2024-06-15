[#id](#VIEW-PG-TIMEZONE-ABBREVS)

## 54.31. `pg_timezone_abbrevs` [#](#VIEW-PG-TIMEZONE-ABBREVS)

The view `pg_timezone_abbrevs` provides a list of time zone abbreviations that are currently recognized by the datetime input routines. The contents of this view change when the [timezone_abbreviations](runtime-config-client#GUC-TIMEZONE-ABBREVIATIONS) run-time parameter is modified.

[#id](#id-1.10.5.35.4)

**Table 54.31. `pg_timezone_abbrevs` Columns**

| Column TypeDescription                                                    |
| ------------------------------------------------------------------------- |
| `abbrev` `text`Time zone abbreviation                                     |
| `utc_offset` `interval`Offset from UTC (positive means east of Greenwich) |
| `is_dst` `bool`True if this is a daylight-savings abbreviation            |

While most timezone abbreviations represent fixed offsets from UTC, there are some that have historically varied in value (see [Section B.4](datetime-config-files) for more information). In such cases this view presents their current meaning.



|            F.44. test\_decoding — SQL-based test/example module for WAL logical decoding           |                                                                             |                                                        |                                                       |                                                                                                                |
| :------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------- | :----------------------------------------------------: | ----------------------------------------------------: | -------------------------------------------------------------------------------------------------------------: |
| [Prev](tcn.html "F.43. tcn — a trigger function to notify listeners of changes to table content")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") | Appendix F. Additional Supplied Modules and Extensions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](tsm-system-rows.html "F.45. tsm_system_rows —&#xA;   the SYSTEM_ROWS sampling method for TABLESAMPLE") |

***

## F.44. test\_decoding — SQL-based test/example module for WAL logical decoding [#](#TEST-DECODING)

`test_decoding` is an example of a logical decoding output plugin. It doesn't do anything especially useful, but can serve as a starting point for developing your own output plugin.

`test_decoding` receives WAL through the logical decoding mechanism and decodes it into text representations of the operations performed.

Typical output from this plugin, used over the SQL logical decoding interface, might be:

```

postgres=# SELECT * FROM pg_logical_slot_get_changes('test_slot', NULL, NULL, 'include-xids', '0');
   lsn     | xid |                       data
-----------+-----+--------------------------------------------------
 0/16D30F8 | 691 | BEGIN
 0/16D32A0 | 691 | table public.data: INSERT: id[int4]:2 data[text]:'arg'
 0/16D32A0 | 691 | table public.data: INSERT: id[int4]:3 data[text]:'demo'
 0/16D32A0 | 691 | COMMIT
 0/16D32D8 | 692 | BEGIN
 0/16D3398 | 692 | table public.data: DELETE: id[int4]:2
 0/16D3398 | 692 | table public.data: DELETE: id[int4]:3
 0/16D3398 | 692 | COMMIT
(8 rows)
```

We can also get the changes of the in-progress transaction, and the typical output might be:

```

postgres[33712]=#* SELECT * FROM pg_logical_slot_get_changes('test_slot', NULL, NULL, 'stream-changes', '1');
    lsn    | xid |                       data
-----------+-----+--------------------------------------------------
 0/16B21F8 | 503 | opening a streamed block for transaction TXN 503
 0/16B21F8 | 503 | streaming change for TXN 503
 0/16B2300 | 503 | streaming change for TXN 503
 0/16B2408 | 503 | streaming change for TXN 503
 0/16BEBA0 | 503 | closing a streamed block for transaction TXN 503
 0/16B21F8 | 503 | opening a streamed block for transaction TXN 503
 0/16BECA8 | 503 | streaming change for TXN 503
 0/16BEDB0 | 503 | streaming change for TXN 503
 0/16BEEB8 | 503 | streaming change for TXN 503
 0/16BEBA0 | 503 | closing a streamed block for transaction TXN 503
(10 rows)
```

***

|                                                                                                    |                                                                             |                                                                                                                |
| :------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------------------------: |
| [Prev](tcn.html "F.43. tcn — a trigger function to notify listeners of changes to table content")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") |  [Next](tsm-system-rows.html "F.45. tsm_system_rows —&#xA;   the SYSTEM_ROWS sampling method for TABLESAMPLE") |
| F.43. tcn — a trigger function to notify listeners of changes to table content                     |            [Home](index.html "PostgreSQL 17devel Documentation")            |                                  F.45. tsm\_system\_rows — the `SYSTEM_ROWS` sampling method for `TABLESAMPLE` |

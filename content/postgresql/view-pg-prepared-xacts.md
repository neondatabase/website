## 54.16. `pg_prepared_xacts` [#](#VIEW-PG-PREPARED-XACTS)

The view `pg_prepared_xacts` displays information about transactions that are currently prepared for two-phase commit (see [PREPARE TRANSACTION](sql-prepare-transaction "PREPARE TRANSACTION") for details).

`pg_prepared_xacts` contains one row per prepared transaction. An entry is removed when the transaction is committed or rolled back.

**Table 54.16. `pg_prepared_xacts` Columns**

| Column TypeDescription                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transaction` `xid`Numeric transaction identifier of the prepared transaction                                                                                     |
| `gid` `text`Global transaction identifier that was assigned to the transaction                                                                                    |
| `prepared` `timestamptz`Time at which the transaction was prepared for commit                                                                                     |
| `owner` `name` (references [`pg_authid`](catalog-pg-authid "53.8. pg_authid").`rolname`)Name of the user that executed the transaction                       |
| `database` `name` (references [`pg_database`](catalog-pg-database "53.15. pg_database").`datname`)Name of the database in which the transaction was executed |

\

When the `pg_prepared_xacts` view is accessed, the internal transaction manager data structures are momentarily locked, and a copy is made for the view to display. This ensures that the view produces a consistent set of results, while not blocking normal operations longer than necessary. Nonetheless there could be some impact on database performance if this view is frequently accessed.
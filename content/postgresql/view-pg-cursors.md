[#id](#VIEW-PG-CURSORS)

## 54.6. `pg_cursors` [#](#VIEW-PG-CURSORS)

The `pg_cursors` view lists the cursors that are currently available. Cursors can be defined in several ways:

- via the [`DECLARE`](sql-declare) statement in SQL

- via the Bind message in the frontend/backend protocol, as described in [Section 55.2.3](protocol-flow#PROTOCOL-FLOW-EXT-QUERY)

- via the Server Programming Interface (SPI), as described in [Section 47.1](spi-interface)

The `pg_cursors` view displays cursors created by any of these means. Cursors only exist for the duration of the transaction that defines them, unless they have been declared `WITH HOLD`. Therefore non-holdable cursors are only present in the view until the end of their creating transaction.

### Note

Cursors are used internally to implement some of the components of PostgreSQL, such as procedural languages. Therefore, the `pg_cursors` view might include cursors that have not been explicitly created by the user.

[#id](#id-1.10.5.10.4)

**Table 54.6. `pg_cursors` Columns**

| Column TypeDescription                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name` `text`The name of the cursor                                                                                                                                |
| `statement` `text`The verbatim query string submitted to declare this cursor                                                                                       |
| `is_holdable` `bool``true` if the cursor is holdable (that is, it can be accessed after the transaction that declared the cursor has committed); `false` otherwise |
| `is_binary` `bool``true` if the cursor was declared `BINARY`; `false` otherwise                                                                                    |
| `is_scrollable` `bool``true` if the cursor is scrollable (that is, it allows rows to be retrieved in a nonsequential manner); `false` otherwise                    |
| `creation_time` `timestamptz`The time at which the cursor was declared                                                                                             |

The `pg_cursors` view is read-only.



|                          44.10. Transaction Management                         |                                                                 |                                              |                                                       |                                                          |
| :----------------------------------------------------------------------------: | :-------------------------------------------------------------- | :------------------------------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](pltcl-subtransactions.html "44.9. Explicit Subtransactions in PL/Tcl")  | [Up](pltcl.html "Chapter 44. PL/Tcl — Tcl Procedural Language") | Chapter 44. PL/Tcl — Tcl Procedural Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](pltcl-config.html "44.11. PL/Tcl Configuration") |

***

## 44.10. Transaction Management [#](#PLTCL-TRANSACTIONS)

In a procedure called from the top level or an anonymous code block (`DO` command) called from the top level it is possible to control transactions. To commit the current transaction, call the `commit` command. To roll back the current transaction, call the `rollback` command. (Note that it is not possible to run the SQL commands `COMMIT` or `ROLLBACK` via `spi_exec` or similar. It has to be done using these functions.) After a transaction is ended, a new transaction is automatically started, so there is no separate command for that.

Here is an example:

```

CREATE PROCEDURE transaction_test1()
LANGUAGE pltcl
AS $$
for {set i 0} {$i < 10} {incr i} {
    spi_exec "INSERT INTO test1 (a) VALUES ($i)"
    if {$i % 2 == 0} {
        commit
    } else {
        rollback
    }
}
$$;

CALL transaction_test1();
```

Transactions cannot be ended when an explicit subtransaction is active.

***

|                                                                                |                                                                 |                                                          |
| :----------------------------------------------------------------------------- | :-------------------------------------------------------------: | -------------------------------------------------------: |
| [Prev](pltcl-subtransactions.html "44.9. Explicit Subtransactions in PL/Tcl")  | [Up](pltcl.html "Chapter 44. PL/Tcl — Tcl Procedural Language") |  [Next](pltcl-config.html "44.11. PL/Tcl Configuration") |
| 44.9. Explicit Subtransactions in PL/Tcl                                       |      [Home](index.html "PostgreSQL 17devel Documentation")      |                              44.11. PL/Tcl Configuration |

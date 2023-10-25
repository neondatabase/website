

|                      46.8. Transaction Management                      |                                                                          |                                                    |                                                       |                                                       |
| :--------------------------------------------------------------------: | :----------------------------------------------------------------------- | :------------------------------------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](plpython-subtransaction.html "46.7. Explicit Subtransactions")  | [Up](plpython.html "Chapter 46. PL/Python — Python Procedural Language") | Chapter 46. PL/Python — Python Procedural Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](plpython-util.html "46.9. Utility Functions") |

***

## 46.8. Transaction Management [#](#PLPYTHON-TRANSACTIONS)

In a procedure called from the top level or an anonymous code block (`DO` command) called from the top level it is possible to control transactions. To commit the current transaction, call `plpy.commit()`. To roll back the current transaction, call `plpy.rollback()`. (Note that it is not possible to run the SQL commands `COMMIT` or `ROLLBACK` via `plpy.execute` or similar. It has to be done using these functions.) After a transaction is ended, a new transaction is automatically started, so there is no separate function for that.

Here is an example:

```

CREATE PROCEDURE transaction_test1()
LANGUAGE plpython3u
AS $$
for i in range(0, 10):
    plpy.execute("INSERT INTO test1 (a) VALUES (%d)" % i)
    if i % 2 == 0:
        plpy.commit()
    else:
        plpy.rollback()
$$;

CALL transaction_test1();
```

Transactions cannot be ended when an explicit subtransaction is active.

***

|                                                                        |                                                                          |                                                       |
| :--------------------------------------------------------------------- | :----------------------------------------------------------------------: | ----------------------------------------------------: |
| [Prev](plpython-subtransaction.html "46.7. Explicit Subtransactions")  | [Up](plpython.html "Chapter 46. PL/Python — Python Procedural Language") |  [Next](plpython-util.html "46.9. Utility Functions") |
| 46.7. Explicit Subtransactions                                         |           [Home](index.html "PostgreSQL 17devel Documentation")          |                               46.9. Utility Functions |

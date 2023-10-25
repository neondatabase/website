<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                2.9. Deletions                |                                                       |                             |                                                       |                                                                |
| :------------------------------------------: | :---------------------------------------------------- | :-------------------------: | ----------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](tutorial-update.html "2.8. Updates")  | [Up](tutorial-sql.html "Chapter 2. The SQL Language") | Chapter 2. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](tutorial-advanced.html "Chapter 3. Advanced Features") |

***

## 2.9. Deletions [#](#TUTORIAL-DELETE)

[]()

Rows can be removed from a table using the `DELETE` command. Suppose you are no longer interested in the weather of Hayward. Then you can do the following to delete those rows from the table:

```

DELETE FROM weather WHERE city = 'Hayward';
```

All weather records belonging to Hayward are removed.

```

SELECT * FROM weather;
```

```

     city      | temp_lo | temp_hi | prcp |    date
---------------+---------+---------+------+------------
 San Francisco |      46 |      50 | 0.25 | 1994-11-27
 San Francisco |      41 |      55 |    0 | 1994-11-29
(2 rows)
```

One should be wary of statements of the form

```

DELETE FROM tablename;
```

Without a qualification, `DELETE` will remove *all* rows from the given table, leaving it empty. The system will not request confirmation before doing this!

***

|                                              |                                                       |                                                                |
| :------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](tutorial-update.html "2.8. Updates")  | [Up](tutorial-sql.html "Chapter 2. The SQL Language") |  [Next](tutorial-advanced.html "Chapter 3. Advanced Features") |
| 2.8. Updates                                 | [Home](index.html "PostgreSQL 17devel Documentation") |                                   Chapter 3. Advanced Features |

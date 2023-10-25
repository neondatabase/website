<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      2.8. Updates                     |                                                       |                             |                                                       |                                                |
| :---------------------------------------------------: | :---------------------------------------------------- | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](tutorial-agg.html "2.7. Aggregate Functions")  | [Up](tutorial-sql.html "Chapter 2. The SQL Language") | Chapter 2. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](tutorial-delete.html "2.9. Deletions") |

***

## 2.8. Updates [#](#TUTORIAL-UPDATE)



You can update existing rows using the `UPDATE` command. Suppose you discover the temperature readings are all off by 2 degrees after November 28. You can correct the data as follows:

```

UPDATE weather
    SET temp_hi = temp_hi - 2,  temp_lo = temp_lo - 2
    WHERE date > '1994-11-28';
```

Look at the new state of the data:

```

SELECT * FROM weather;

     city      | temp_lo | temp_hi | prcp |    date
---------------+---------+---------+------+------------
 San Francisco |      46 |      50 | 0.25 | 1994-11-27
 San Francisco |      41 |      55 |    0 | 1994-11-29
 Hayward       |      35 |      52 |      | 1994-11-29
(3 rows)
```

***

|                                                       |                                                       |                                                |
| :---------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------: |
| [Prev](tutorial-agg.html "2.7. Aggregate Functions")  | [Up](tutorial-sql.html "Chapter 2. The SQL Language") |  [Next](tutorial-delete.html "2.9. Deletions") |
| 2.7. Aggregate Functions                              | [Home](index.html "PostgreSQL 17devel Documentation") |                                 2.9. Deletions |

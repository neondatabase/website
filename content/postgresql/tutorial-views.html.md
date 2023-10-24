<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                         3.2. Views                        |                                                             |                              |                                                       |                                               |
| :-------------------------------------------------------: | :---------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](tutorial-advanced-intro.html "3.1. Introduction")  | [Up](tutorial-advanced.html "Chapter 3. Advanced Features") | Chapter 3. Advanced Features | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](tutorial-fk.html "3.3. Foreign Keys") |

***

## 3.2. Views [#](#TUTORIAL-VIEWS)

Refer back to the queries in [Section 2.6](tutorial-join.html "2.6. Joins Between Tables"). Suppose the combined listing of weather records and city location is of particular interest to your application, but you do not want to type the query each time you need it. You can create a *view* over the query, which gives a name to the query that you can refer to like an ordinary table:

    CREATE VIEW myview AS
        SELECT name, temp_lo, temp_hi, prcp, date, location
            FROM weather, cities
            WHERE city = name;

    SELECT * FROM myview;

Making liberal use of views is a key aspect of good SQL database design. Views allow you to encapsulate the details of the structure of your tables, which might change as your application evolves, behind consistent interfaces.

Views can be used in almost any place a real table can be used. Building views upon other views is not uncommon.

***

|                                                           |                                                             |                                               |
| :-------------------------------------------------------- | :---------------------------------------------------------: | --------------------------------------------: |
| [Prev](tutorial-advanced-intro.html "3.1. Introduction")  | [Up](tutorial-advanced.html "Chapter 3. Advanced Features") |  [Next](tutorial-fk.html "3.3. Foreign Keys") |
| 3.1. Introduction                                         |    [Home](index.html "PostgreSQL 17devel Documentation")    |                             3.3. Foreign Keys |

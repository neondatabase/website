

|  62.1. Query Handling as a Complex Optimization Problem  |                                                       |                                     |                                                       |                                                      |
| :------------------------------------------------------: | :---------------------------------------------------- | :---------------------------------: | ----------------------------------------------------: | ---------------------------------------------------: |
| [Prev](geqo.html "Chapter 62. Genetic Query Optimizer")  | [Up](geqo.html "Chapter 62. Genetic Query Optimizer") | Chapter 62. Genetic Query Optimizer | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](geqo-intro2.html "62.2. Genetic Algorithms") |

***

## 62.1. Query Handling as a Complex Optimization Problem [#](#GEQO-INTRO)

Among all relational operators the most difficult one to process and optimize is the *join*. The number of possible query plans grows exponentially with the number of joins in the query. Further optimization effort is caused by the support of a variety of *join methods* (e.g., nested loop, hash join, merge join in PostgreSQL) to process individual joins and a diversity of *indexes* (e.g., B-tree, hash, GiST and GIN in PostgreSQL) as access paths for relations.

The normal PostgreSQL query optimizer performs a *near-exhaustive search* over the space of alternative strategies. This algorithm, first introduced in IBM's System R database, produces a near-optimal join order, but can take an enormous amount of time and memory space when the number of joins in the query grows large. This makes the ordinary PostgreSQL query optimizer inappropriate for queries that join a large number of tables.

The Institute of Automatic Control at the University of Mining and Technology, in Freiberg, Germany, encountered some problems when it wanted to use PostgreSQL as the backend for a decision support knowledge based system for the maintenance of an electrical power grid. The DBMS needed to handle large join queries for the inference machine of the knowledge based system. The number of joins in these queries made using the normal query optimizer infeasible.

In the following we describe the implementation of a *genetic algorithm* to solve the join ordering problem in a manner that is efficient for queries involving large numbers of joins.

***

|                                                          |                                                       |                                                      |
| :------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------: |
| [Prev](geqo.html "Chapter 62. Genetic Query Optimizer")  | [Up](geqo.html "Chapter 62. Genetic Query Optimizer") |  [Next](geqo-intro2.html "62.2. Genetic Algorithms") |
| Chapter 62. Genetic Query Optimizer                      | [Home](index.html "PostgreSQL 17devel Documentation") |                             62.2. Genetic Algorithms |

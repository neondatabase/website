[#id](#GEQO-INTRO)

## 62.1. Query Handling as a Complex Optimization Problem [#](#GEQO-INTRO)

Among all relational operators the most difficult one to process and optimize is the _join_. The number of possible query plans grows exponentially with the number of joins in the query. Further optimization effort is caused by the support of a variety of _join methods_ (e.g., nested loop, hash join, merge join in PostgreSQL) to process individual joins and a diversity of _indexes_ (e.g., B-tree, hash, GiST and GIN in PostgreSQL) as access paths for relations.

The normal PostgreSQL query optimizer performs a _near-exhaustive search_ over the space of alternative strategies. This algorithm, first introduced in IBM's System R database, produces a near-optimal join order, but can take an enormous amount of time and memory space when the number of joins in the query grows large. This makes the ordinary PostgreSQL query optimizer inappropriate for queries that join a large number of tables.

The Institute of Automatic Control at the University of Mining and Technology, in Freiberg, Germany, encountered some problems when it wanted to use PostgreSQL as the backend for a decision support knowledge based system for the maintenance of an electrical power grid. The DBMS needed to handle large join queries for the inference machine of the knowledge based system. The number of joins in these queries made using the normal query optimizer infeasible.

In the following we describe the implementation of a _genetic algorithm_ to solve the join ordering problem in a manner that is efficient for queries involving large numbers of joins.

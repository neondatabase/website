

|                     2.2. Concepts                    |                                                       |                             |                                                       |                                                          |
| :--------------------------------------------------: | :---------------------------------------------------- | :-------------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](tutorial-sql-intro.html "2.1. Introduction")  | [Up](tutorial-sql.html "Chapter 2. The SQL Language") | Chapter 2. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](tutorial-table.html "2.3. Creating a New Table") |

***

## 2.2. Concepts [#](#TUTORIAL-CONCEPTS)

PostgreSQL is a *relational database management system* (RDBMS). That means it is a system for managing data stored in *relations*. Relation is essentially a mathematical term for *table*. The notion of storing data in tables is so commonplace today that it might seem inherently obvious, but there are a number of other ways of organizing databases. Files and directories on Unix-like operating systems form an example of a hierarchical database. A more modern development is the object-oriented database.

Each table is a named collection of *rows*. Each row of a given table has the same set of named *columns*, and each column is of a specific data type. Whereas columns have a fixed order in each row, it is important to remember that SQL does not guarantee the order of the rows within the table in any way (although they can be explicitly sorted for display).

Tables are grouped into databases, and a collection of databases managed by a single PostgreSQL server instance constitutes a database *cluster*.

***

|                                                      |                                                       |                                                          |
| :--------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------: |
| [Prev](tutorial-sql-intro.html "2.1. Introduction")  | [Up](tutorial-sql.html "Chapter 2. The SQL Language") |  [Next](tutorial-table.html "2.3. Creating a New Table") |
| 2.1. Introduction                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                2.3. Creating a New Table |

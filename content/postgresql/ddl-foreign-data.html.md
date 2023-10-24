<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                     5.12. Foreign Data                    |                                             |                            |                                                       |                                                         |
| :-------------------------------------------------------: | :------------------------------------------ | :------------------------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](ddl-partitioning.html "5.11. Table Partitioning")  | [Up](ddl.html "Chapter 5. Data Definition") | Chapter 5. Data Definition | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ddl-others.html "5.13. Other Database Objects") |

***

## 5.12. Foreign Data [#](#DDL-FOREIGN-DATA)

PostgreSQL implements portions of the SQL/MED specification, allowing you to access data that resides outside PostgreSQL using regular SQL queries. Such data is referred to as *foreign data*. (Note that this usage is not to be confused with foreign keys, which are a type of constraint within the database.)

Foreign data is accessed with help from a *foreign data wrapper*. A foreign data wrapper is a library that can communicate with an external data source, hiding the details of connecting to the data source and obtaining data from it. There are some foreign data wrappers available as `contrib` modules; see [Appendix F](contrib.html "Appendix F. Additional Supplied Modules and Extensions"). Other kinds of foreign data wrappers might be found as third party products. If none of the existing foreign data wrappers suit your needs, you can write your own; see [Chapter 59](fdwhandler.html "Chapter 59. Writing a Foreign Data Wrapper").

To access foreign data, you need to create a *foreign server* object, which defines how to connect to a particular external data source according to the set of options used by its supporting foreign data wrapper. Then you need to create one or more *foreign tables*, which define the structure of the remote data. A foreign table can be used in queries just like a normal table, but a foreign table has no storage in the PostgreSQL server. Whenever it is used, PostgreSQL asks the foreign data wrapper to fetch data from the external source, or transmit data to the external source in the case of update commands.

Accessing remote data may require authenticating to the external data source. This information can be provided by a *user mapping*, which can provide additional data such as user names and passwords based on the current PostgreSQL role.

For additional information, see [CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper.html "CREATE FOREIGN DATA WRAPPER"), [CREATE SERVER](sql-createserver.html "CREATE SERVER"), [CREATE USER MAPPING](sql-createusermapping.html "CREATE USER MAPPING"), [CREATE FOREIGN TABLE](sql-createforeigntable.html "CREATE FOREIGN TABLE"), and [IMPORT FOREIGN SCHEMA](sql-importforeignschema.html "IMPORT FOREIGN SCHEMA").

***

|                                                           |                                                       |                                                         |
| :-------------------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------: |
| [Prev](ddl-partitioning.html "5.11. Table Partitioning")  |      [Up](ddl.html "Chapter 5. Data Definition")      |  [Next](ddl-others.html "5.13. Other Database Objects") |
| 5.11. Table Partitioning                                  | [Home](index.html "PostgreSQL 17devel Documentation") |                            5.13. Other Database Objects |

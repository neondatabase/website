[#id](#DDL-FOREIGN-DATA)

## 5.12. Foreign Data [#](#DDL-FOREIGN-DATA)

PostgreSQL implements portions of the SQL/MED specification, allowing you to access data that resides outside PostgreSQL using regular SQL queries. Such data is referred to as _foreign data_. (Note that this usage is not to be confused with foreign keys, which are a type of constraint within the database.)

Foreign data is accessed with help from a _foreign data wrapper_. A foreign data wrapper is a library that can communicate with an external data source, hiding the details of connecting to the data source and obtaining data from it. There are some foreign data wrappers available as `contrib` modules; see [Appendix F](contrib). Other kinds of foreign data wrappers might be found as third party products. If none of the existing foreign data wrappers suit your needs, you can write your own; see [Chapter 59](fdwhandler).

To access foreign data, you need to create a _foreign server_ object, which defines how to connect to a particular external data source according to the set of options used by its supporting foreign data wrapper. Then you need to create one or more _foreign tables_, which define the structure of the remote data. A foreign table can be used in queries just like a normal table, but a foreign table has no storage in the PostgreSQL server. Whenever it is used, PostgreSQL asks the foreign data wrapper to fetch data from the external source, or transmit data to the external source in the case of update commands.

Accessing remote data may require authenticating to the external data source. This information can be provided by a _user mapping_, which can provide additional data such as user names and passwords based on the current PostgreSQL role.

For additional information, see [CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper), [CREATE SERVER](sql-createserver), [CREATE USER MAPPING](sql-createusermapping), [CREATE FOREIGN TABLE](sql-createforeigntable), and [IMPORT FOREIGN SCHEMA](sql-importforeignschema).

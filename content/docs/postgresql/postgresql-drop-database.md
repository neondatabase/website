---
title: 'PostgreSQL DROP DATABASE'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-drop-database/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DROP DATABASE` statement to drop a database.





## Introduction to PostgreSQL DROP DATABASE statement





The `DROP DATABASE` statement deletes a database from a PostgreSQL server.





Here's the basic syntax of the `DROP DATABASE` statement:





```
DROP DATABASE [IF EXISTS] database_name
[WITH (FORCE)]
```





In this syntax:





- 
- First, specify the database name that you want to remove after the `DROP DATABASE` keywords.
- 
-
- 
- Second, if you delete a non-existing database, PostgreSQL will issue an error. To prevent the error, you can use the `IF EXISTS` option. In this case, PostgreSQL will issue a notice instead.
- 
-
- 
- Third, the `DROP DATABASE` statement will fail if there are active connections to the target database unless you use the `FORCE` option. The `FORCE` option will attempt to terminate all existing connections to the target database.
- 





The `DROP DATABASE` statement deletes the database from both catalog entry and data directory. Since PostgreSQL does not allow you to roll back this operation, you should use it with caution.





To execute the `DROP DATABASE` statement, you need to be the database owner.





Additionally, you cannot execute the `DROP DATABASE` statement while connecting to the target database. In this case, you can connect to the default `postgres` database or use the `dropdb` utility before executing the `DROP DATABASE` statement.





The `dropdb` is a command-line utility that allows you to drop a database. The `dropdb` program executes the `DROP DATABASE` statement behind the scenes.





## PostgreSQL DROP DATABASE statement examples





Let's take some examples of using the `DROP DATABASE` statement.





### Setting up sample databases





We'll create some databases for the demonstration purposes:





```
CREATE DATABASE hr;
CREATE DATABASE test;
```





### 1) Basic DROP DATABASE statement example





First, open Command Prompt on Windows or Terminal on Unix-like systems and connect to the PostgreSQL server using psql:





```
psql -U postgres
```





Second, drop the database `hr` using the following `DROP DATABASE` statement:





```
DROP DATABASE hr;
```





### 2) Removing a non-existing database example





The following example attempts to drop a database that does not exist:





```
DROP DATABASE non_existing_database;
```





PostgreSQL will issue the following error:





```
ERROR:  database "non_existing_database" does not exist
```





If you use the `IF EXISTS` option, PostgreSQL will issue a notice instead:





```
DROP DATABASE IF EXISTS non_existing_database;
```





Output:





```
NOTICE:  database "non_existing_database" does not exist, skipping
DROP DATABASE
```





### 3) Drop a database that has active connections example





First, establish a connection to the PostgreSQL server using the `psql` tool:





```
psql -U postgres
```





Next, open the second connection to the PostgreSQL server. You can use psql, pgAdmin, or any PostgreSQL client tool.





Then, attempt to delete the `test` database from the first session:





```
DROP DATABASE test;
```





PostgreSQL issues an error:





```
ERROR:  database "test" is being accessed by other users
DETAIL:  There is 1 other session using the database.
```





The output indicates that the `test` database is being accessed by other users.





To drop the database that has active connections, you can use the `FORCE` option.





After that, find the connections to the `test` database by retrieving data from the `pg_stat_activity` view:





```
SELECT
  datname,
  pid,
  usename,
  application_name,
  client_addr,
  client_port
FROM
  pg_stat_activity
WHERE
  datname = 'test';
```





Output:





```
 datname | pid  | usename  | application_name | client_addr | client_port
---------+------+----------+------------------+-------------+-------------
 test    | 9724 | postgres | psql             | 127.0.0.1   |       61287
(1 row)
```





The `test` database has one connection from `localhost`. Therefore, it's safe to terminate this connection and remove the database.





Finally, terminate the connections to the `test` database and drop it using the `WITH (FORCE)` option:





```
DROP DATABASE test WITH (FORCE)
```





Output:





```
DROP DATABASE
```





## Summary





- 
- Use the PostgreSQL `DROP DATABASE` statement to drop a database.
- 



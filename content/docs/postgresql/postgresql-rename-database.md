---
title: 'PostgreSQL Rename Database'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-rename-database/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn step-by-step how to rename a PostgreSQL database using the `ALTER DATABASE...RENAME TO` statement.





## PostgreSQL rename database steps





To rename a PostgreSQL database, you use the following steps:





- 
- First, change the current database from the one that you want to rename to a different one.
- 
-
- 
- Second, terminate all active connections to the database that you want to rename.
- 
-
- 
- Third, use the `ALTER DATABASE` statement to rename the database to the new one.
- 





Let's take a look at an example of renaming a database.





First, open the Command Prompt on Windows or Terminal on a Unix-like system and connect to the PostgreSQL server:





```
psql -U postgres
```





Second, create a new database called db:





```
CREATE DATABASE db;
```





We'll rename the `db` database to `newdb`:





Third, if you are already connected to the PostgreSQL server, you can change the current database to a different one, for example, postgres:





```
\c postgres
```





Fourth, retrieve all active connections to the `db` database:





```
SELECT  *
FROM pg_stat_activity
WHERE datname = 'db';
```





The query returned the following output:





```
-[ RECORD 1 ]----+------------------------------
datid            | 35918
datname          | db
pid              | 6904
usesysid         | 10
usename          | postgres
application_name | psql
client_addr      | ::1
client_hostname  |
client_port      | 56412
backend_start    | 2017-02-21 08:25:05.083705+07
xact_start       |
query_start      |
state_change     | 2017-02-21 08:25:05.092168+07
waiting          | f
state            | idle
backend_xid      |
backend_xmin     |
query            |
```





The output shows one connection to the `db` database.





In practice, a database may have many active connections. In this case, you need to inform the respective users as well as the application owners before terminating connections to avoid data loss.





Fifth, terminate all the connections to the `db` database:





```
SELECT
    pg_terminate_backend (pid)
FROM
    pg_stat_activity
WHERE
    datname = 'db';
```





Sixth, rename the `db` database to `newdb` using the `ALTER DATABASE RENAME TO` statement:





```
ALTER DATABASE db RENAME TO newdb;
```





## Summary





- 
- Use the `ALTER DATABASE RENAME TO` statement to rename a database from the PostgreSQL server.
- 



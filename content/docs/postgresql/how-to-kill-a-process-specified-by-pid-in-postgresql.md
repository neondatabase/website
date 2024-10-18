---
title: 'How to Kill a Process Specified by PID in PostgreSQL'
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to effectively kill a process identified by a pid in PostgreSQL.



_In PostgreSQL, the ability to terminate a specific process identified by its Process ID (PID) is crucial for managing database performance and resolving issues efficiently._



First, open the command prompt on Windows or terminal on Unix-like systems and connect to the PostgreSQL server using psql:



```
psql -U postgres
```



Second, get all the running processes by querying data from the pg_stat_activity:



```
SELECT *
FROM pg_stat_activity
WHERE state = 'active';
```



Sample output:



```
 datid |  datname  |  pid  | leader_pid | usesysid | usename  |     application_name     | client_addr | client_hostname | client_port |         backend_start         |          xact_start           |          query_start          |         state_change          | wait_event_type | wait_event | state  | backend_xid | backend_xmin | query_id |          query          |  backend_type
-------+-----------+-------+------------+----------+----------+--------------------------+-------------+-----------------+-------------+-------------------------------+-------------------------------+-------------------------------+-------------------------------+-----------------+------------+--------+-------------+--------------+----------+-------------------------+----------------
 27890 | dvdrental | 26344 |       null |       10 | postgres | psql                     | 127.0.0.1   | null            |       54964 | 2024-02-22 20:30:26.065541+07 | 2024-02-22 20:34:04.501846+07 | 2024-02-22 20:34:04.501846+07 | 2024-02-22 20:34:04.501851+07 | null            | null       | active |        null |        49037 |     null | SELECT *               +| client backend
       |           |       |            |          |          |                          |             |                 |             |                               |                               |                               |                               |                 |            |        |             |              |          | FROM pg_stat_activity  +|
       |           |       |            |          |          |                          |             |                 |             |                               |                               |                               |                               |                 |            |        |             |              |          | WHERE state = 'active'; |
 27890 | dvdrental | 15028 |       null |       10 | postgres | pgAdmin 4 - CONN:8179787 | 127.0.0.1   | null            |       51937 | 2024-02-22 19:30:19.998093+07 | 2024-02-22 20:33:58.024898+07 | 2024-02-22 20:33:58.024898+07 | 2024-02-22 20:33:58.024904+07 | Timeout         | PgSleep    | active |        null |        49037 |     null | select pg_sleep(10);    | client backend
(2 rows)
```



The query returns a lot of information but the most important one is pid.



Third, terminate the process specified by the pid by running the following query, for example:



```
SELECT pg_cancel_backend(pid);
```



This query will take a while to kill the process.



If you want to kill the process right away, you can use the pg_terminate_backend() function:



```
SELECT pg_terminate_backend(pid);
```



## Summary



- Use the pg_terminate_backend() function to terminate a process specified by pid.
- 

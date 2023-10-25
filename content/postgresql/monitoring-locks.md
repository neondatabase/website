<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                           28.3. Viewing Locks                           |                                                                  |                                          |                                                       |                                                             |
| :---------------------------------------------------------------------: | :--------------------------------------------------------------- | :--------------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](monitoring-stats.html "28.2. The Cumulative Statistics System")  | [Up](monitoring.html "Chapter 28. Monitoring Database Activity") | Chapter 28. Monitoring Database Activity | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](progress-reporting.html "28.4. Progress Reporting") |

***

## 28.3. Viewing Locks [#](#MONITORING-LOCKS)

[]()

Another useful tool for monitoring database activity is the `pg_locks` system table. It allows the database administrator to view information about the outstanding locks in the lock manager. For example, this capability can be used to:

*   View all the locks currently outstanding, all the locks on relations in a particular database, all the locks on a particular relation, or all the locks held by a particular PostgreSQL session.
*   Determine the relation in the current database with the most ungranted locks (which might be a source of contention among database clients).
*   Determine the effect of lock contention on overall database performance, as well as the extent to which contention varies with overall database traffic.

Details of the `pg_locks` view appear in [Section 54.12](view-pg-locks.html "54.12. pg_locks"). For more information on locking and managing concurrency with PostgreSQL, refer to [Chapter 13](mvcc.html "Chapter 13. Concurrency Control").

***

|                                                                         |                                                                  |                                                             |
| :---------------------------------------------------------------------- | :--------------------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](monitoring-stats.html "28.2. The Cumulative Statistics System")  | [Up](monitoring.html "Chapter 28. Monitoring Database Activity") |  [Next](progress-reporting.html "28.4. Progress Reporting") |
| 28.2. The Cumulative Statistics System                                  |       [Home](index.html "PostgreSQL 17devel Documentation")      |                                    28.4. Progress Reporting |



|                            31.11. Quick Setup                            |                                                                  |                                 |                                                       |                                                                |
| :----------------------------------------------------------------------: | :--------------------------------------------------------------- | :-----------------------------: | ----------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](logical-replication-config.html "31.10. Configuration Settings")  | [Up](logical-replication.html "Chapter 31. Logical Replication") | Chapter 31. Logical Replication | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](jit.html "Chapter 32. Just-in-Time Compilation (JIT)") |

***

## 31.11. Quick Setup [#](#LOGICAL-REPLICATION-QUICK-SETUP)

First set the configuration options in `postgresql.conf`:

```

wal_level = logical
```

The other required settings have default values that are sufficient for a basic setup.

`pg_hba.conf` needs to be adjusted to allow replication (the values here depend on your actual network configuration and user you want to use for connecting):

```

host     all     repuser     0.0.0.0/0     md5
```

Then on the publisher database:

```

CREATE PUBLICATION mypub FOR TABLE users, departments;
```

And on the subscriber database:

```

CREATE SUBSCRIPTION mysub CONNECTION 'dbname=foo host=bar user=repuser' PUBLICATION mypub;
```

The above will start the replication process, which synchronizes the initial table contents of the tables `users` and `departments` and then starts replicating incremental changes to those tables.

***

|                                                                          |                                                                  |                                                                |
| :----------------------------------------------------------------------- | :--------------------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](logical-replication-config.html "31.10. Configuration Settings")  | [Up](logical-replication.html "Chapter 31. Logical Replication") |  [Next](jit.html "Chapter 32. Just-in-Time Compilation (JIT)") |
| 31.10. Configuration Settings                                            |       [Home](index.html "PostgreSQL 17devel Documentation")      |                     Chapter 32. Just-in-Time Compilation (JIT) |

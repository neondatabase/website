---
prevPost: /postgresql/postgresql-jsonb_pretty-function
nextPost: /postgresql/postgresql-grouping-sets
createdAt: 2013-06-06T03:14:50.000Z
title: 'PostgreSQL Restore Database'
redirectFrom: 
            - /postgresql/postgresql-administration/postgresql-restore-database
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to restore a database by using a **PostgreSQL restore** tool called `pg_restore`.

## Introduction to the PostgreSQL pg_restore tool

[To perform a logical backup of a PostgreSQL database](/postgresql/postgresql-administration/postgresql-backup-database), you use the `pg_dump` tool. To back up all the databases on a PostgreSQL cluster, you use the `pg_dumpall` tool.

Both `pg_dump` and `pg_dumpall` tools create a snapshot of one or all databases at the time the command starts running.

To restore a database created by the `pg_dump` or `pg_dumpall` tools, you can use the `pg_restore` tool.

The `pg_restore` tool allows you to restore the PostgreSQL database from an archive file.

Here's the syntax of the `pg_restore` command:

```
pg_restore [connection-option] [option] [filename]
```

The following table presents the most commonly used command-line options for the `pg_restore` utility:

| Option                      | Description                                                                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -U, --username=USERNAME     | Specifies the username that you use to connect to the PostgreSQL server.                                                                                                      |
| -h, --host=HOSTNAME         | Specifies the hostname of the server on which the PostgreSQL server is running.                                                                                               |
| -p, --port=PORT             | Specifies the port number on which the PostgreSQL server is listening.                                                                                                        |
| -d, --dbname=DBNAME         | Specifies the name of the database that you want to restore into.                                                                                                             |
| -t, --table=TABLE           | Specifies one or more tables that you want to restore. If you restore multiple tables, you need to separate them by commas.                                                   |
| -v, --verbose               | Shows verbose output that including information about the objects being restored.                                                                                             |
| -c, --clean                 | Drops existing database objects from the database before restoring the dump.                                                                                                  |
| -C, --create                | Creates the database before restoring it.                                                                                                                                     |
| -e, --exit-on-error         | Stops the restore process in case of an error.                                                                                                                                |
| -F, --format=FORMAT         | Specifies the format of the input file (e.g., custom, directory, tar).                                                                                                        |
| -j, --jobs=NUM              | Specifies the number of parallel jobs to use when restoring data.                                                                                                             |
| -n, --schema=SCHEMA         | Specifies one or more schema of the database objects that you want to restore the objects. If you restore objects from multiple schemas, you need to separate them by commas. |
| -L, --use-list=FILENAME     | Specifies a file containing a list of files that you want to restore.                                                                                                         |
| -t, --tablespace=TABLESPACE | Specifies the tablespace for the tables that you want to restore.                                                                                                             |
| -v, --version               | Shows the version of pg_restore and exits.                                                                                                                                    |
| -?, --help                  | Shows help and usage information.                                                                                                                                             |

## PostgreSQL Restore Database example

First, open the Command Prompt on Windows or Terminal on Unix-like systems.

Second, back up the dvdrental database to a directory such as D:\\backup\\

```
pg_dump -U postgres -d dvdrental -F tar -f d:\backup\dvdrental.tar
```

It'll prompt you to enter the password for the user `postgres`. After entering a valid password, the `pg_dump` will create an archive file dvdrental.tar in the `D:\backup` file.

Third, connect to the PostgreSQL server:

```
psql -U postgres
```

Fourth, drop the `dvdrental` database:

```
drop database dvdrental;
```

Fifth, create a new empty `dvdrental` database:

```
create database dvdrental;
```

Sixth, exit the psql:

```
exit
```

Seven, restore the dvdrental database from the backup file using the pg_restore tool:

```
pg_restore -U postgres -d dvdrental D:/backup/dvdrental.tar
```

Eight, connect to the dvdrental database:

```
psql -U postgres -d dvdrental
```

Ninth, show the tables:

```
\dt
```

It returns all the tables in the dvdrental database.

Finally, exit the psql:

```
exit
```

## Summary

- Use the `pg_restore` tool to restore a PostgreSQL database from an archive file.

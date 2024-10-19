---
title: 'PostgreSQL CREATE TABLESPACE'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-create-tablespace
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to create tablespaces by using the **PostgreSQL CREATE TABLESPACE** statement.

## Introduction to PostgreSQL tablespace

A tablespace is a disk location where PostgreSQL stores data files containing database objects such as [indexes](/docs/postgresql/postgresql-indexes) and tables.

PostgreSQL uses a tablespace to associate a logical name to a physical location on the disk.

PostgreSQL comes with two default tablespaces:

- `pg_default` tablespace stores user data.
- `pg_global` tablespace stores global data.

Tablespaces enable you to control the disk layout of PostgreSQL. There are two primary advantages to using tablespaces:

- First, if a partition on which the cluster was initialized runs out of space, you can create a new tablespace on a different partition and utilize it until you reconfigure the system.
- Second, you can use statistics to optimize database performance. For example, you can place the frequent access indexes or tables on fast-performing devices like solid-state drives, and store the less frequently accessed archive data on slower devices.

## PostgreSQL CREATE TABLESPACE statement

To create a new tablespace, you use the `CREATE TABLESPACE` statement.

Here is the basic syntax of the `CREATE TABLESPACE` statement:

```
CREATE TABLESPACE tablespace_name
OWNER user_name
LOCATION directory_path;
```

The name of the tablespace should not start with `pg_` since these names are reserved for the system tablespaces.

By default, the user who executes the `CREATE TABLESPACE` become the owner of the tablespace. To assign ownership to another user, you specify it after the `OWNER` keyword.

The `directory_path` is the absolute path to an empty directory used for the tablespace. PostgreSQL system users must have onwership of this directory to read from and write data into it.

After creating a new table space, you can specify it in the `CREATE DATABASE`, `CREATE TABLE` and `CREATE INDEX` statements to store data files of the objects in the tablespace.

## PostgreSQL CREATE TABLE examples

The following statement uses the `CREATE TABLESPACE` to create a new tablespace called `ts_primary` with the physical location `c:\pgdata\primary`.

```
CREATE TABLESPACE ts_primary
LOCATION 'c:\pgdata\primary';
```

Notice that this statement used Unix-style slashes for the directory path. Additionally, the directory `c:\pgdata\primary` must exist before executing the command.

To list all tablespaces in the current PostgreSQL database server, you use the `\db` command:

```
\db
```

Output:

```
            List of tablespaces
    Name    |  Owner   |     Location
------------+----------+-------------------
 pg_default | postgres |
 pg_global  | postgres |
 ts_primary | postgres | c:\pgdata\primary
(3 rows)
```

The `\db+` command shows more information such as size and access privileges:

```
\db+
```

Output:

```
                                       List of tablespaces
    Name    |  Owner   |     Location      | Access privileges | Options |  Size   | Description
------------+----------+-------------------+-------------------+---------+---------+-------------
 pg_default | postgres |                   |                   |         | 62 MB   |
 pg_global  | postgres |                   |                   |         | 591 kB  |
 ts_primary | postgres | c:\pgdata\primary |                   |         | 0 bytes |
(3 rows)
```

The following statement creates the logistics database that uses the ts_primary tablespace:

```
CREATE DATABASE logistics
TABLESPACE ts_primary;
```

In this statement, we specify the tablespace `ts_primary` for the `logistics` database.

The following statement [creates a new table](/docs/postgresql/postgresql-create-table) called `deliveries` and [inserts](/docs/postgresql/postgresql-tutorial/postgresql-insert)a row into the table:

```
CREATE TABLE deliveries (
    delivery_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_date DATE,
    customer_id INT
);

INSERT INTO deliveries(order_date, customer_id)
VALUES('2020-08-01',1);
```

Since the `ts_primary` tablespace has some data, you can view its information using the following command in psql:

```
\db+ ts_primary
```

Output:

```
    Name    |  Owner   |     Location      | Access privileges | Options |  Size   | Description
------------+----------+-------------------+-------------------+---------+---------+-------------
 ts_primary | postgres | c:\pgdata\primary |                   |         | 8004 kB |
(1 row)
```

## Summary

- A tablespace is a location on the storage device where PostgreSQL stores data files.
- Use the `CREATE TABLESAPCE` statement to create a new tablespace.

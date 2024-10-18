---
title: 'PostgreSQL CREATE DATABASE'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/
ogImage: ./img/wp-content-uploads-2020-07-PostgreSQL-Create-Database-pgAdmin-Step-1.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the **PostgreSQL CREATE DATABASE** statement to create new databases in the PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL CREATE DATABASE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a database is a collection of related data, which serves as a container for tables, [indexes](https://www.postgresqltutorial.com/postgresql-indexes/postgresql-index-types/), [views](https://www.postgresqltutorial.com/postgresql-views/), and other database objects.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To create a new database, you use the `CREATE DATABASE` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `CREATE DATABASE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE DATABASE database_name
WITH
   [OWNER =  role_name]
   [TEMPLATE = template]
   [ENCODING = encoding]
   [LC_COLLATE = collate]
   [LC_CTYPE = ctype]
   [TABLESPACE = tablespace_name]
   [ALLOW_CONNECTIONS = true | false]
   [CONNECTION LIMIT = max_concurrent_connection]
   [IS_TEMPLATE = true | false ];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the new database that you want to create after the `CREATE DATABASE` keywords. The database name must be unique in the PostgreSQL server. If you attempt to create a database whose name already exists, PostgreSQL will issue an error.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Then, use one or more parameters for the new database.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading {"level":3} -->

### Parameters

<!-- /wp:heading -->

<!-- wp:paragraph -->

**OWNER**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Assign a [role](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/) that will be the owner of the database. If you omit the `OWNER` option, the database owner is the role you use to execute the `CREATE DATABASE` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**TEMPLATE**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Specify the template database for the new database. PostgreSQL uses the `template1` database as the default template database if you don't explicitly specify the template database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**ENCODING**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Determine the character set for the new database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**LC_COLLATE**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Specify the collation order (`LC_COLLATE`) that the new database will use. This parameter affects the sort order of strings in queries that contain the `ORDER BY` clause. It defaults to the `LC_COLLATE` of the template database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**LC_CTYPE**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Specify the character classification that the new database will use. It affects the classification of characters such as lower, upper, and digit. It defaults to the `LC_CTYPE` of the template database

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**TABLESPACE**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Specify the [tablespace ](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-tablespace/)name for the new database. The default is the tablespace of the template database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**CONNECTION LIMIT**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Specify the maximum concurrent connections to the new database. The default is -1 which means unlimited. This parameter can be useful in shared hosting environments where you can configure the maximum concurrent connections for a particular database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**ALLOW_CONNECTIONS**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `allow_connections` parameter is a boolean value. If it is `false`, you cannot connect to the database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**TABLESPACE**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Specify the [tablespace](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-tablespace/) that the new database will use. It defaults to the tablespace of the template database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**IS_TEMPLATE**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `IS_TEMPLATE` is true, any user with the `CREATEDB` privilege can clone it. If false, only superusers or the database owner can clone it.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To execute the `CREATE DATABASE` statement, you need to have a superuser role or a special `CREATEDB` privilege.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL CREATE DATABASE examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `CREATE DATABASE` statement.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Create a database with default parameters

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open the Command Prompt on Windows or Terminal on Unix-like systems and connect to the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, execute the `CREATE DATABASE` statement to a new database with default parameters:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE DATABASE sales;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE DATABASE
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL will create a new database called `sales` that has default parameters from the default template database (`template1`).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, show all the databases using the `\l` command:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\l
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
                                                                      List of databases
   Name    |  Owner   | Encoding | Locale Provider |          Collate           |           Ctype            | ICU Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+----------------------------+----------------------------+------------+-----------+-----------------------
 dvdrental | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           |
 postgres  | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           |
 tempdb    | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           |
 template0 | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           | =c/postgres          +
           |          |          |                 |                            |                            |            |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           | =c/postgres          +
           |          |          |                 |                            |                            |            |           | postgres=CTc/postgres
(5 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Alternatively, you can retrieve the database names from the `pg_database` view:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT datname FROM pg_database;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
  datname
-----------
 postgres
 dvdrental
 template1
 template0
 tempdb
 sales
(6 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Create a database with options

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `CREATE DATABASE` statement to create a database named `hr` with some parameters:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE DATABASE hr
WITH
   ENCODING = 'UTF8'
   CONNECTION LIMIT = 100;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This statement creates a database called `hr` with the encoding UTF8 and the number of concurrent connections to the database is 100.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Creating a new database using pgAdmin

<!-- /wp:heading -->

<!-- wp:paragraph -->

The pgAdmin tool provides an intuitive interface for creating a new database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, connect to the PostgreSQL database server using pgAdmin.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, right-click the **Databases** node and select **Create > Database...** menu item

<!-- /wp:paragraph -->

<!-- wp:image {"id":5632,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Create-Database-pgAdmin-Step-1.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

It will show a dialog to enter detailed information on the new database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, enter the name of the database and select an owner in the general tab.

<!-- /wp:paragraph -->

<!-- wp:image {"id":5633,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Create-Database-pgAdmin-Step-2.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In this example, we create a new database called `sampledb` and owner `postgres`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fourth, select the **Definition** tab to set the properties for the database:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5634,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Create-Database-pgAdmin-Step-3.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In the **Definition** tab, you can select the encoding, a template, tablespace, collation, character type, and connection limit.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The **Security** tab allows you to define security labels and assign privileges. The **Privileges **tab allows you to assign privileges to a role.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fifth, click the SQL tab to view the generated SQL statement that will execute.

<!-- /wp:paragraph -->

<!-- wp:image {"id":5635,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Create-Database-pgAdmin-Step-4.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Finally, click the **Save **button to create the `sampledb` database. You will see the `sampledb` listed on the database list:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5636,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Create-Database-pgAdmin-Step-5.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `CREATE DATABASE` statement to create a new database.
- <!-- /wp:list-item -->

<!-- /wp:list -->

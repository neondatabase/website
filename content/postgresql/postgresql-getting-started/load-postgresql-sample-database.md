---
title: "Load PostgreSQL Sample Database"
page_title: "Load PostgreSQL Sample Database"
page_description: "In this tutorial, we will show you how to load a PostgreSQL sample database into the PostgreSQL database server."
prev_url: "https://www.postgresqltutorial.com/postgresql-getting-started/load-postgresql-sample-database/"
ogImage: "/postgresqltutorial/PostgreSQL-create-database-pgadmin4.png"
updatedOn: "2024-01-20T09:40:21+00:00"
enableTableOfContents: true
prev_page: 
  title: "Connect to a PostgreSQL Database Server"
  slug: "postgresql-getting-started/connect-to-postgresql-database"
next_page: 
  title: "Install PostgreSQL macOS"
  slug: "postgresql-getting-started/install-postgresql-macos"
---




**Summary**: in this tutorial, you will learn how to load the **PostgreSQL sample database** into the PostgreSQL database server**.**

Before going forward with this tutorial, you need to have:

* A PostgreSQL database server.
* A [PostgreSQL sample database](postgresql-sample-database) called `dvdrental`.


## Load the sample database using the psql \& pg\_restore tool

`psql` is a terminal\-based client tool to PostgreSQL. It allows you to enter queries, send them to PostgreSQL for execution, and display the results.

`pg_restore` is a utility for restoring a database from an archive.

To create a database and load data from an archive file, you follow these steps:

* First, connect to the [PostgreSQL database server](connect-to-postgresql-database) using `psql` or `pgAdmin`.
* Second, create a blank database called `dvdrental`.
* Third, load data from the sample database file into the `dvdrental` database using `pg_restore`.


### 1\) Create the dvdrental database

First, open the Command Prompt on Windows or Terminal on Unix\-like systems and connect to the PostgreSQL server using **psql** tool:


```phpsql
psql -U postgres
```
It’ll prompt you to enter a password for the `postgres` user:


```
Password for user postgres:
```
The password for the `postgres` user is the one you entered during the [PostgreSQL installation](install-postgresql).

After entering the password correctly, you will be connected to the PostgreSQL server.

The command prompt will look like this:


```
postgres=#
```
Second, create a new database called `dvdrental` using [`CREATE DATABASE`](../postgresql-administration/postgresql-create-database) statement:


```php
CREATE DATABASE dvdrental;
```
Output:


```
CREATE DATABASE
```
PostgreSQL will create a new database called `dvdrental`.

Third, verify the database creation using the `\l` command. The `\l` command will show all databases in the PostgreSQL server:


```
\l
```
Output:


```
                                                                      List of databases
   Name    |  Owner   | Encoding | Locale Provider |          Collate           |           Ctype            | ICU Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+----------------------------+----------------------------+------------+-----------+-----------------------
 dvdrental | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           |
 postgres  | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           |
 template0 | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           | =c/postgres          +
           |          |          |                 |                            |                            |            |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | English_United States.1252 | English_United States.1252 |            |           | =c/postgres          +
           |          |          |                 |                            |                            |            |           | postgres=CTc/postgres
(4 rows)
```
The output shows that `dvdrental` on the list, meaning that you have created the `dvdrental` database successfully.

Note that other databases such as `postgres`, `template0`, and `template1` are the system databases.

Fourth, disconnect from the PostgreSQL server and exit the `psql` using the `exit` command:


```php
exit
```

### 2\) Restore the sample database from a tar file

Fifth, download the sample database (`dvdrental.zip`) and extract the `tar` file to the directory such as `D:\sampledb\postgres\dvdrental.tar` on Windows.

Sixth, load the `dvdrental` database using the `pg_restore` command:


```css
pg_restore -U postgres -d dvdrental D:\sampledb\postgres\dvdrental.tar
```
In this command:

* The `-U postgres` instructs `pg_restore` to connect the PostgreSQL server using the `postgres` user.
* The `-d dvdrental` specifies the target database to load.

It’ll prompt you to enter the password for the `postgres` user. Enter the password for the `postgres` user and press the Enter (or Return key):


```php
Password:
```
It’ll take about seconds to load data stored in the `dvdrental.tar` file into the `dvdrental` database.


### 3\) Verify the sample database

First, connect to the PostgreSQL server using the `psql` command:


```
psql -U postgres
```
Second, switch the current database to `dvdrental`:


```
\c dvdrental
```
The command prompt will change to the following:


```
dvdrental=#
```
Third, display all tables in the `dvdrental` database:


```php
\dt
```
Output:


```
             List of relations
 Schema |     Name      | Type  |  Owner
--------+---------------+-------+----------
 public | actor         | table | postgres
 public | address       | table | postgres
 public | category      | table | postgres
 public | city          | table | postgres
 public | country       | table | postgres
 public | customer      | table | postgres
 public | film          | table | postgres
 public | film_actor    | table | postgres
 public | film_category | table | postgres
 public | inventory     | table | postgres
 public | language      | table | postgres
 public | payment       | table | postgres
 public | rental        | table | postgres
 public | staff         | table | postgres
 public | store         | table | postgres
(15 rows)
```

## Load the DVD Rental database using the pgAdmin

pgAdmin is a web\-based graphic user interface (GUI) for interacting with the PostgreSQL server.

The following shows you step\-by\-step how to use the pgAdmin to restore the [sample database](postgresql-sample-database) from the database file:

First, launch the **pgAdmin** tool and [connect to the PostgreSQL server](../postgresql-python/connect).

Second, right\-click the **Databases** and select the **Create \> Database…** menu option:

![](/postgresqltutorial/PostgreSQL-create-database-pgadmin4.png)Third, enter the database name `dvdrental` and click the **Save** button:


![](/postgresqltutorial/PostgreSQL-create-database-database-name.png)
You’ll see the new empty database created under the **Databases** node:


![](/postgresqltutorial/PostgreSQL-create-database-sample-database.png)
Fourth, right\-click on the **dvdrental** database and choose the **Restore…** menu item to restore the database from the downloaded database file:


![](/postgresqltutorial/PostgreSQL-create-database-restore-db.png)
Fifth, enter the path to the sample database file such as **c:\\sampledb\\dvdrental.tar** and click the **Restore** button:


![](/postgresqltutorial/PostgreSQL-create-database-restore-from-a-tar-file.png)
Sixth, the restoration process will complete in a few seconds and show the following dialog once it completes:


![](/postgresqltutorial/PostgreSQL-create-database-completed.png)
Finally, open the `dvdrental` database from the object browser panel, you will find tables in the `public` schema and other database objects as shown in the following picture:


![PostgreSQL Load Sample Database - pgAdmin step 3](/postgresqltutorial/PostgreSQL-Load-Sample-Database-pgAdmin-step-3.png)
In this tutorial, you have learned how to load the `dvdrental` sample database into the PostgreSQL database server for practicing PostgreSQL.

Let’s start learning PostgreSQL and have fun!


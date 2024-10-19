---
title: 'PostgreSQL ALTER DATABASE'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-alter-database
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to modify existing databases by using **PostgreSQL ALTER DATABASE** statement.

## Introduction to PostgreSQL ALTER DATABASE statement

The `ALTER DATABASE` statement allows you to carry the following action on the database:

- Change the attributes of the database
- Rename the database
- Change the owner of the database
- Change the default tablespace of a database
- Change the session default for a run-time configuration variable for a database

### 1) Changing attributes of a database

To change the attributes of a database, you use the following form of the `ALTER TABLE` statement:

```
ALTER DATABASE name WITH option;
```

The option can be:

- `IS_TEMPLATE`
- `CONNECTION LIMIT`
- `ALLOW_CONNECTIONS`

Note that only superusers or database owners can change these settings.

### 2) Rename the database

The following `ALTER DATABASE RENAME TO` statement renames a database:

```
ALTER DATABASE database_name
RENAME TO new_name;
```

It is not possible to rename the current database. So, you need to connect to another database and rename it from that database.

Only superusers and database owners with CREATEDB privilege can rename the database.

### 3) Change the owner of the database

The following `ALTER DATABASE` statement changes the owner of a database to the new one:

```
ALTER DATABASE database_name
OWNER TO new_owner | current_user | session_user;
```

The following users can change the owner of the database:

- The database owner with `CREATEDB` privilege and is a direct or indirect member of the new owning role.
- The superusers

### 4) Change the default tablespace of a database

The following statement changes the default [tablespace](/docs/postgresql/postgresql-administration/postgresql-create-tablespace)of the database:

```
ALTER DATABASE database_name
SET TABLESPACE new_tablespace;
```

The statement physically moves tables and indexes from the legacy tablespace to the new one.

To set the new tablespace, the tablespace needs to be empty and there is a connection to the database.

Superusers and database owners can change the default tablespace of the database

### 5) Change session defaults for run-time configuration variables

Whenever you connect to a database, PostgreSQL loads the configuration variables from the `postgresql.conf` file and uses these variables by default.

To override these settings for a particular database, you use `ALTER DATABASE SET` statement as follows:

```
ALTER DATABASE database_name
SET configuration_parameter = value;
```

In the subsequent sessions, PostgreSQL will override the settings in the `postgresql.conf` file.

Only superusers or database owners can change the session default for a run-time configuration for the database.

## PostgreSQL ALTER DATABASE examples

First, log in to PostgreSQL using the `postgres` user and [create a new database](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/ "PostgreSQL CREATE DATABASE") named `testdb2` for the demonstration.

```
CREATE DATABASE testdb2;
```

Second, rename the `testdb2` to `testhrdb` using the following statement:

```
ALTER DATABASE testdb2
RENAME TO testhrdb;
```

Third, execute the following statement to change the owner of the `testhrdb`database from `postgres`to `hr`, with the assumption that the `hr` role already exists.

```
ALTER DATABASE testhrdb
OWNER TO hr;
```

If the `hr` role does not exist, you can create it by using the `CREATE ROLE` statement:

```
CREATE ROLE hr
LOGIN
CREATEDB
PASSWORD 'securePa$$1';
```

Fourth, change the default tablespace of the `testhrdb`from `pg_default` to `hr_default`, with the assumption that the `hr_default` tablespace already exists.

```
ALTER DATABASE testhrdb
SET TABLESPACE hr_default;
```

If the `hr_default` tablespace does not exist, you can create it by using the following statement:

```
CREATE TABLESPACE hr_default
OWNER hr
LOCATION 'C:\\sampledb\\hr';
```

Fifth, set `escape_string_warning`configuration variable to `off` by using the following statement:

```
ALTER DATABASE testhrdb
SET escape_string_warning = off;
```

In this tutorial, you have learned how to use the PostgreSQL `ALTER DATABASE` statement.

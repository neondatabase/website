---
title: "PostgreSQL REVOKE Statement"
page_title: "PostgreSQL REVOKE Statement"
page_description: "In this tutorial, you will learn about the PostgreSQL REVOKE statement to remove privileges from a role."
prev_url: "https://www.postgresqltutorial.com/postgresql-administration/postgresql-revoke/"
ogImage: ""
updatedOn: "2024-02-22T00:49:28+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL GRANT"
  slug: "postgresql-administration/postgresql-grant"
next_page: 
  title: "PostgreSQL Role Membership"
  slug: "postgresql-administration/postgresql-role-membership"
---




**Summary**: in this tutorial, you will learn about the PostgreSQL `REVOKE` statement to remove privileges from a role.


## Introduction to the PostgreSQL REVOKE statement

The `REVOKE` statement revokes previously [granted privileges](postgresql-grant) on database objects from a [role](postgresql-roles).

The following shows the syntax of the `REVOKE` statement that revokes privileges on one or more tables from a role:


```pgsql
REVOKE privilege | ALL
ON TABLE table_name |  ALL TABLES IN SCHEMA schema_name
FROM role_name;
```
In this syntax:

* First, specify one or more privileges that you want to revoke or use the `ALL` option to revoke all privileges.
* Second, provide the name of the table after the `ON` keyword or use the `ALL TABLES` to revoke specified privileges from all tables in a schema.
* Third, specify the name of the role from which you want to revoke privileges.


## PostgreSQL REVOKE statement example

Let’s take an example of using the `REVOKE` statement.


### Step 1\. Create a role and grant privileges

First, use the `postgres` user to log in to the `dvdrental` [sample database](../postgresql-getting-started/postgresql-sample-database):


```pgsql
psql -U postgres -d dvdrental
```
Second, [create a new role](postgresql-roles) called `jim` with the `LOGIN` and `PASSWORD` attributes:


```pgsql
CREATE ROLE jim LOGIN PASSWORD 'YourPassword';
```
Replace the `YourPassword` with the one you want.

Third, grant all privileges to the role `jim` on the `film` table:


```pgsql
GRANT ALL ON film TO jim;
```
Finally, grant the `SELECT` privilege on the `actor` table to the role `jim`:


```pgsql
GRANT SELECT ON actor TO jim;
```

### Step 2\. Revoke privileges from a role

To revoke the `SELECT` privilege on the `actor` table from the role `jim`, you use the following statement:


```pgsql
REVOKE SELECT ON actor FROM jim;
```
To revoke all privileges on the `film` table from the role `jim`, you use `REVOKE` statement with the `ALL` option like this:


```pgsql
REVOKE ALL ON film FROM jim;
```

## Revoking privileges on other database objects

To revoke privileges from other database objects such as [sequences](../postgresql-tutorial/postgresql-sequences), [functions](../postgresql-functions), [stored procedures](../postgresql-plpgsql/postgresql-create-procedure), [schemas](postgresql-schema), and [databases](postgresql-create-database), check out the [REVOKE statement](https://www.postgresql.org/docs/current/sql-revoke.html).


## Summary

* Use the PostgreSQL `REVOKE` statement to revoke previously granted privileges on database objects from a role.


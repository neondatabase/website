---
prevPost: plpgsql-while-loop
nextPost: enable-triggers
createdAt: 2020-07-28T03:58:18.000Z
title: 'PostgreSQL REVOKE Statement'
redirectFrom: 
            - /postgresql/postgresql-administration/postgresql-revoke
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL `REVOKE` statement to remove privileges from a role.

## Introduction to the PostgreSQL REVOKE statement

The `REVOKE` statement revokes previously [granted privileges](/postgresql/postgresql-administration/postgresql-grant) on database objects from a [role](/postgresql/postgresql-administration/postgresql-roles).

The following shows the syntax of the `REVOKE` statement that revokes privileges on one or more tables from a role:

```sql
REVOKE privilege | ALL
ON TABLE table_name |  ALL TABLES IN SCHEMA schema_name
FROM role_name;
```

In this syntax:

- First, specify one or more privileges that you want to revoke or use the `ALL` option to revoke all privileges.
- Second, provide the name of the table after the `ON` keyword or use the `ALL TABLES` to revoke specified privileges from all tables in a schema.
- Third, specify the name of the role from which you want to revoke privileges.

## PostgreSQL REVOKE statement example

Let's take an example of using the `REVOKE` statement.

### Step 1. Create a role and grant privileges

First, use the `postgres` user to log in to the `dvdrental` [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database):

```
psql -U postgres -d dvdrental
```

Second, [create a new role](/postgresql/postgresql-administration/postgresql-roles) called `jim` with the `LOGIN` and `PASSWORD` attributes:

```sql
CREATE ROLE jim LOGIN PASSWORD 'YourPassword';
```

Replace the `YourPassword` with the one you want.

Third, grant all privileges to the role `jim` on the `film` table:

```sql
GRANT ALL ON film TO jim;
```

Finally, grant the `SELECT` privilege on the `actor` table to the role `jim`:

```sql
GRANT SELECT ON actor TO jim;
```

### Step 2. Revoke privileges from a role

To revoke the `SELECT` privilege on the `actor` table from the role `jim`, you use the following statement:

```sql
REVOKE SELECT ON actor FROM jim;
```

To revoke all privileges on the `film` table from the role `jim`, you use `REVOKE` statement with the `ALL` option like this:

```sql
REVOKE ALL ON film FROM jim;
```

## Revoking privileges on other database objects

To revoke privileges from other database objects such as [sequences](/postgresql/postgresql-sequences), [functions](/postgresql/postgresql-functions), [stored procedures](/postgresql/postgresql-plpgsql/postgresql-create-procedure), [schemas](/postgresql/postgresql-administration/postgresql-schema), and [databases](/postgresql/postgresql-administration/postgresql-create-database), check out the [REVOKE statement](https://www.postgresql.org/docs/currentsql-revoke.html).

## Summary

- Use the PostgreSQL `REVOKE` statement to revoke previously granted privileges on database objects from a role.

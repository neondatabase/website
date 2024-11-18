---
title: 'PostgreSQL Row-Level Security'
page_title: 'PostgreSQL Row-Level Security'
page_description: 'in this tutorial, you will learn how to use PostgreSQL row-level security to control access to individual rows in a table.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-administration/postgresql-row-level-security/'
ogImage: ''
updatedOn: '2024-02-22T04:16:15+00:00'
enableTableOfContents: true
previousLink:
  title: 'How to Create Superuser in PostgreSQL'
  slug: 'postgresql-administration/create-superuser-postgresql'
nextLink:
  title: 'Reset Forgotten Password For postgres User'
  slug: 'postgresql-administration/postgresql-reset-password'
---

**Summary**: in this tutorial, you will learn how to use PostgreSQL row\-level security to control access to individual rows in a table.

<CTA title="Looking to integrate Postgres RLS?" description="<a href='https://neon.tech/docs/guides/neon-authorize'>Neon Authorize</a> uses the open-source <a href='https://github.com/neondatabase/pg_session_jwt'>pg_session_jwt</a> extension to help you write RLS policies that map to your app's or service's auth." buttonText="Learn More" buttonUrl="https://neon.tech/docs/guides/neon-authorize" />

## Introduction to the PostgreSQL Row\-Level Security

Row\-level security (RLS) is a feature that allows you to restrict rows returned by a query based on the user executing the query.

The RLS allows you to control access to individual rows in tables based on the current user and specific conditions defined by policies.

The basic steps for implementing row\-level security are as follows:

First, enable row\-level security on a table using the `ALTER TABLE` statement:

```sql
ALTER TABLE table_name
ENABLE ROW LEVEL SECURITY;
```

Second, create a new row\-level security policy for a table using the `CREATE POLICY` statement:

```sql
CREATE POLICY name ON table_name
USING (condition);
```

In the policy, you define a condition that determines which rows are visible.

Note that superusers and roles with the `BYPASSRLS` attribute can bypass the row security system when accessing a table.

Additionally, table owners also bypass row\-level security. To enforce the row\-level security to the table owners, you can modify the table using the `FORCE ROW LEVEL SECURITY` option:

```sql
ALTER TABLE table_name
FORCE ROW LEVEL SECURITY;
```

## PostgreSQL Row\-Level Security example

We’ll take an example of creating a table and roles where the roles can retrieve data from the table whose `manager` column matches the current role.

1\) [Create a new database](postgresql-create-database) called `hr`:

```sql
create database hr;
```

2\) Change the current database to the `hr` database:

```text
\c hr
```

3\) [Create a new table](../postgresql-tutorial/postgresql-create-table) called `departments` to store department data:

```sql
create table departments(
   id serial primary key,
   name VARCHAR(255) NOT NULL UNIQUE,
   manager VARCHAR(255) NOT NULL
);
```

4\) [Insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `departments` table:

```sql
INSERT INTO departments(name, manager)
VALUES('Sales', 'alice'),
      ('Marketing', 'bob'),
      ('IT', 'jack');
```

5\) [Create a group role](postgresql-role-membership) called `managers`:

```sql
CREATE ROLE managers;
```

6\) [Grant](postgresql-grant) the `SELECT` privileges of all tables in the `public` schema to the group role `managers`:

```sql
GRANT SELECT ON ALL TABLES
IN SCHEMA public
TO managers;
```

7\) Create three new roles `alice`, `bob`, `peter` and assign them as members of the `managers` group role:

```sql
CREATE ROLE alice WITH LOGIN PASSWORD 'SecurePass1'
IN ROLE managers;
CREATE ROLE bob WITH LOGIN PASSWORD 'SecurePass2'
IN ROLE managers;
CREATE ROLE jack WITH LOGIN PASSWORD 'SecurePass3'
IN ROLE managers;
```

The roles `alice`, `bob`, and `jack` will implicitly inherit privileges from the group role managers. In other words, they can retrieve data from all tables in the `public` schema.

8\) Enable row\-level security on the `departments` table:

```sql
ALTER TABLE departments
ENABLE ROW LEVEL SECURITY;
```

9\) Create a policy that the current user can access the rows whose value in the `manager` column of the `departments` table matches the current role name:

```sql
CREATE POLICY department_managers
ON departments
TO managers
USING (manager = current_user);
```

10\) Connect to the `hr` database using the `alice` role in a separate session:

```bash
psql -U alice -d hr
```

11\) Retrieve data from the `departments` table:

```sql
SELECT * FROM departments;
```

Output:

```text
 id | name  | manager
----+-------+---------
  1 | Sales | alice
(1 row)
```

The query returns the rows whose manager column is `alice`.

12\) Connect to the `hr` database using the `bob` role in a separate session:

```bash
psql -U bob -d hr
```

13\) Select data from the `departments` table:

```sql
SELECT * FROM departments;
```

Output:

```text
 id |   name    | manager
----+-----------+---------
  2 | Marketing | bob
(1 row)
```

Like `alice`, `bob` can only retrieve data whose manager is `bob`.

## Summary

- Use the `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY` statement to enable row\-level security of a table.
- Use the `CREATE POLICY` statement to define a new row\-level security policy for a table.

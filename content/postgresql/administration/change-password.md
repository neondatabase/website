---
title: How to Change the Password of a PostgreSQL User
page_title: How to Change the Password of a PostgreSQL User
page_description: >-
  This tutorial shows you how to change the password of a PostgreSQL user by
  using the ALTER ROLE statement.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-administration/postgresql-change-password/
ogImage: ''
updatedOn: '2024-02-18T08:18:38+00:00'
enableTableOfContents: true
previousLink:
  title: PostgreSQL List Users
  slug: postgresql-administration/postgresql-list-users
nextLink:
  title: How to Create Superuser in PostgreSQL
  slug: postgresql-administration/create-superuser-postgresql
---
<Admonition type="info" id="CTA">
Changing a user's password with ALTER ROLE works the same on any PostgreSQL deployment, so everything here applies whether you're running Postgres yourself or on a managed service. If you're an enterprise looking for managed Postgres built for the AI era, [Lakebase](https://www.databricks.com/product/lakebase) delivers performance, strong security, and native integration with the Lakehouse. If you're a developer or startup that needs to ship and scale quickly, [Neon](https://neon.com) gives you the fastest path to production Postgres.
</Admonition>

**Summary**: in this tutorial, you will learn how to change the password for a user in PostgreSQL.

To change the password of a [PostgreSQL user](postgresql-roles), you use the `ALTER ROLE` statement as follows:

```sql
ALTER ROLE username
WITH PASSWORD 'password';
```

In this statement, to change the password of a user:

- First, specify the `username` that you want to change the password.
- Second, provide a new `password` wrapped within single quotes (‘).

For example, the following statement changes the password of the `super` user to `secret123`.

```sql
ALTER ROLE super WITH PASSWORD 'secret123';
```

Sometimes, you want to set the password to be valid until a date and time. In this case, you use the `VALID UNTIL` clause:

```sql
ALTER ROLE username
WITH PASSWORD 'new_password'
VALID UNTIL timestamp;
```

The `VALID UNTIL` clause is optional. If you omit it, the password will have no expiration date.

The following statement uses the `ALTER ROLE` statement to set the expiration date for the password of  `super` user to `December 31 2050`:

```sql
ALTER ROLE bob
VALID UNTIL 'December 31, 2050';
```

To verify the result, you can use the `\du` command in psql to [view the detailed information of the user](postgresql-list-users):

```text
\du super
```

Output:

```
 Role name |                 Attributes
-----------+---------------------------------------------
 super     | Password valid until 2050-12-31 00:00:00+07
```

Note that using the `ALTER ROLE` statement will transfer the password to the server in cleartext.

Additionally, the cleartext password may be logged in the psql’s command history or the server log.

## Summary

- Use the `ALTER ROLE` statement to change the password of a PostgreSQL user.

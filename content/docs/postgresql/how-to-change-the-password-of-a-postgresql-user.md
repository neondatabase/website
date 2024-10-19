---
title: 'How to Change the Password of a PostgreSQL User'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-change-password
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to change the password for a user in PostgreSQL.

To change the password of a [PostgreSQL user](/docs/postgresql/postgresql-administration/postgresql-roles), you use the `ALTER ROLE` statement as follows:

```sql
ALTER ROLE username
WITH PASSWORD 'password';
```

In this statement, to change the password of a user:

- First, specify the `username` that you want to change the password.
-
- Second, provide a new `password` wrapped within single quotes (').

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

The following statement uses the `ALTER ROLE` statement to set the expiration date for the password of `super` user to `December 31 2050`:

```sql
ALTER ROLE bob
VALID UNTIL 'December 31, 2050';
```

To verify the result, you can use the `\du` command in psql to [view the detailed information of the user](/docs/postgresql/postgresql-administration/postgresql-list-users):

```
\du super
```

Output:

```
 Role name |                 Attributes
-----------+---------------------------------------------
 super     | Password valid until 2050-12-31 00:00:00+07
```

Note that using the `ALTER ROLE` statement will transfer the password to the server in cleartext.

Additionally, the cleartext password may be logged in the psql's command history or the server log.

## Summary

- Use the `ALTER ROLE` statement to change the password of a PostgreSQL user.

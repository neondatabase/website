---
title: 'How to Change the Password of a PostgreSQL User'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-change-password/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to change the password for a user in PostgreSQL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To change the password of a [PostgreSQL user](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/), you use the `ALTER ROLE` statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ALTER ROLE username
WITH PASSWORD 'password';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this statement, to change the password of a user:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the `username` that you want to change the password.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, provide a new `password` wrapped within single quotes (').
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

For example, the following statement changes the password of the `super` user to `secret123`.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER ROLE super WITH PASSWORD 'secret123';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sometimes, you want to set the password to be valid until a date and time. In this case, you use the `VALID UNTIL` clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER ROLE username
WITH PASSWORD 'new_password'
VALID UNTIL timestamp;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `VALID UNTIL` clause is optional. If you omit it, the password will have no expiration date.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following statement uses the `ALTER ROLE` statement to set the expiration date for the password of `super` user to `December 31 2050`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER ROLE bob
VALID UNTIL 'December 31, 2050';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To verify the result, you can use the `\du` command in psql to [view the detailed information of the user](https://www.postgresqltutorial.com/postgresql-administration/postgresql-list-users/):

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\du super
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 Role name |                 Attributes
-----------+---------------------------------------------
 super     | Password valid until 2050-12-31 00:00:00+07
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that using the `ALTER ROLE` statement will transfer the password to the server in cleartext.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Additionally, the cleartext password may be logged in the psql's command history or the server log.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `ALTER ROLE` statement to change the password of a PostgreSQL user.
- <!-- /wp:list-item -->

<!-- /wp:list -->

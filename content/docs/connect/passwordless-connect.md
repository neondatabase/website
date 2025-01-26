---
title: Passwordless auth
subtitle: Learn how to connect to Neon without a password
enableTableOfContents: true
updatedOn: '2024-07-25T12:53:42.418Z'
---

Neon's `psql` passwordless auth feature helps you quickly authenticate a connection to Neon without providing a password.

The following instructions require a working installation of [psql](https://www.postgresql.org/download/), an interactive terminal for working with Postgres. For information about `psql`, refer to the [psql reference](https://www.postgresql.org/docs/15/app-psql.html), in the _PostgreSQL Documentation_.

To connect using Neon's `psql` passwordless auth feature:

1. In your terminal, run the following command:

   ```bash
   psql -h pg.neon.tech
   ```

   A response similar to the following is displayed:

   ```bash
   NOTICE:  Welcome to Neon!
   Authenticate by visiting (will expire in 2m):
    https://console.neon.tech/psql_session/cd6aebdc9fda9928
   ```

2. In your browser, navigate to the provided link. Log in to Neon if you are not already logged in. You are asked to select a Neon account and project (if you have multiple). If your project has more than one compute, you are also asked to select one.

   After confirming your selections, you are advised that you can return to your terminal or command window where information similar to the following is displayed:

   ```bash
   NOTICE:  Connecting to database.
   psql (17.2)
   SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off, ALPN: postgresql)
   Type "help" for help.

   casey=>
   ```

   The passwordless auth feature connects to the first database created in the branch. To check the database you are connected to, issue this query:

   ```sql
   SELECT current_database();
    current_database
   ------------------
    neondb
   ```

   Switching databases from the `psql` prompt (using `\c <database_name>`, for example) after you have authenticated restarts the passwordless auth authentication process to authenticate a connection to the new database.

## Running queries

After establishing a connection, try running the following queries to validate your database connection:

```sql
CREATE TABLE my_table AS SELECT now();
SELECT * FROM my_table;
```

The following result set is returned:

```sql
SELECT 1
              now
-------------------------------
 2022-09-11 23:12:15.083565+00
(1 row)
```

<NeedHelp/>

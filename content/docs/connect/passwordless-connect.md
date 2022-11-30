---
title: Passwordless connect
enableTableOfContents: true
---

Neon's `psql` passwordless connect feature helps you quickly authenticate a connection to Neon without having to provide a password.

The following instructions require a working installation of [psql](https://www.postgresql.org/download/), an interactive terminal for working with PostgreSQL. For information about `psql`, refer to the [psql reference](https://www.postgresql.org/docs/15/app-psql.html), in the _PostgreSQL Documentation_.

To connect using Neon's `psql` passwordless connect feature:

1. In your terminal, run the following command:

   ```bash
   psql -h pg.neon.tech
   ```

   A response similar to the following is displayed:

   ```bash
   NOTICE:  Welcome to Neon!
   Authenticate by visiting:
       https://console.neon.tech/psql_session/6d32af5ef8215b62
   ```

2. In your browser, navigate to the provided link where you are asked to select a Neon project and an endpoint to connect with. An endpoint is the compute instance associated with a  branch. A project can have multiple endpoints. Select the endpoint that is associated with the branch you want to connect to.

<Admonition type="note">
You can determine which endpoint is associated with a branch by selecting the branch on the **Branches** page in the Neon console. The branch details include the name of the associated endpoint, which has an `ep-` prefix. For example: `ep-summer-sun-985942`
</Admonition>

   After making your selection, you are directed to check the terminal where information similar to the following is displayed:

   ```bash
   NOTICE:  Connecting to database.
   psql (15.0 (Ubuntu 15.0-1.pgdg22.04+1))
   Type "help" for help.

   casey=>
   ```

   **_Note_**: When using _`psql` passwordless connect_, the `psql` prompt shows your local terminal user name. However, you are logged in as the Neon `web_access` user, which you can verify by running this query:

   ```sql
   SELECT current_user;
    current_user
   --------------
    web_access
   ```

   To check the database you are connected to, issue this query:

   ```sql
   SELECT current_database();
    current_database
   ------------------
    main
    ``` 

## Running queries

After establishing a connection, try running the following queries:

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

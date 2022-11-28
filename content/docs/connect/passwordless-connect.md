---
title: Passwordless connect
enableTableOfContents: true
---

Neon's `psql` passwordless connect feature helps you quickly authenticate a connection to Neon without having to provide a password.

The following instructions require a working installation of [psql](https://www.postgresql.org/download/), an interactive terminal for working with PostgreSQL. For information about `psql`, refer to the [psql reference](https://www.postgresql.org/docs/15/app-psql.html), in the _PostgreSQL Documentation_.

<Admonition type="note">
A Neon Compute runs PostgreSQL, which means that any PostgreSQL application or standard utility such as `psql` is compatible with Neon. You can also use PostgreSQL client libraries and drivers to connect.
</Admonition>

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

2. In your browser, navigate to the provided link where you are asked to select an existing branch or create a new branch.

   - Selecting an existing branch authenticates your connection to the selected branch.
   - Selecting **Create new branch** directs you to a **Create branch** page where you create a new branch to connect to.

   After making your selection, you are directed to check the terminal where information similar to the following is displayed:

   ```bash
   NOTICE:  Connecting to database.
   psql (15.0 (Ubuntu 15.0-1.pgdg22.04+1))
   Type "help" for help.

   casey=>
   ```

   **_Note_**: When using _`psql` passwordless connect_, the `psql` prompt shows your local terminal user name. However, you are logged in to the default database as the Neon `web_access` user, which you can verify by running this query:

   ```sql
   SELECT current_user;
    current_user
   --------------
    web_access

   SELECT current_database();
    current_database
   ------------------
    main
   ```
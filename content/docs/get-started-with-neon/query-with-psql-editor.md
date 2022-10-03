---
title: Query with psql
enableTableOfContents: true
---

The following steps require a working installation of [psql](https://www.postgresql.org/download/), an interactive terminal for working with PostgreSQL. For information about `psql`, refer to the [psql reference](https://www.postgresql.org/docs/14/app-psql.html), in the _PostgreSQL Documentation_.

## Connecting with Neon's psql quick auth

Neon's `psql` quick auth feature helps you quickly and conveniently authenticate a connection to a Neon project.

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

2. In your browser, navigate to the provided link where you are asked to select an existing project or create a new project.

   - Selecting an existing project authenticates your connection to the selected project.
   - Selecting **Create new project** directs you to a **Project creation** page where you create a new project to connect to.

   After making your selection, you are directed to check the terminal. In the terminal, you are connected to the project, and connection information similar to the following is displayed:

   ```bash
   NOTICE:  Connecting to database.
   psql (14.5 (Ubuntu 14.5-0ubuntu0.22.04.1))
   Type "help" for help.

   user1=>
   ```

   **_Note_**: When using _`psql` quick auth_ to connect, the `psql` prompt shows your local terminal user name instead of the database name that is shown for the other `psql` connection methods described in this topic. However, you are logged in to the default `main` database as the Neon `web_access` user, which you can verify by running this query:

   ```bash
   SELECT current_user;
    current_user
   --------------
    web_access

   SELECT current_database();
    current_database
   ------------------
    main
   ```

## Connecting with an exported password

**_Warning_**: Some operating systems allow non-root users to view process environment variables when using the `ps` command. For security reasons, consider using a password file in such cases.

To connect with an exported password:

1. In your terminal, export the database user's password to the `PGPASSWORD` environment variable:

   ```bash
   export PGPASSWORD=<password>
   ```

   For example:

   ```bash
   export PGPASSWORD=En5v0dJoVpRL
   ```

   The database user's password was provided to you when you created the project.

2. Connect with the following command:

   ```bash
   psql postgres://<user>:$PGPASSWORD@<project_id>.cloud.neon.tech:5432/main
   ```

   where:

   - `<user>` is the database user, which can be found on the Neon Console **Dashboard** tab, under **Connection Details**.
   - `<project_id>` is the Neon Project ID, which can be found on the Neon Console **Settings** tab, under **General Settings**.

## Connecting with a password saved to a file

To connect with a password saved to a `.pgpass` password file:

1. In your terminal, run the following commands to create and configure the `.pgpass` file:

   ```bash
   touch ~/.pgpass && \
   chmod 0600 ~/.pgpass && \
   echo -e "<project_id>.cloud.neon.tech:5432:main:<user>:<password>\n$(cat ~/.pgpass)" >> ~/.pgpass
   ```

2. Connect with the following command:

   ```bash
   psql -h <project_id>.cloud.neon.tech -U <user> main
   ```

   where:

   - `<project_id>` is the ID of the Neon project, which can be found on the Neon Console **Settings** tab, under **General Settings**.
   - `<password>` is the database user's password, which was provided to you when you created the project.
   - `<user>` is the database user, which can be found on the Neon Console **Dashboard** tab, under **Connection Details**.

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

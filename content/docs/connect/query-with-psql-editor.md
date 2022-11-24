---
title: Connect with psql
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/postgres
  - /docs/integrations/postgres
  - /docs/get-started-with-neon/query-with-psql-editor
---

The following instructions require a working installation of [psql](https://www.postgresql.org/download/), an interactive terminal for working with PostgreSQL. For information about `psql`, refer to the [psql reference](https://www.postgresql.org/docs/15/app-psql.html), in the _PostgreSQL Documentation_.

<Admonition type="note">
A Neon Compute runs PostgreSQL, which means that any PostgreSQL application or standard utility such as `psql` is compatible with Neon. You can also use PostgreSQL client libraries and drivers to connect.
</Admonition>

The following `psql` connection methods are described:

- [Connect with Neon's psql passwordless auth](#connect-with-neons-psql-passwordless-auth)
- [Connect with an exported password](#connect-with-an-exported-password)
- [Connect with a password saved to a file](#connect-with-a-password-saved-to-a-file)

After establishing a connection, you can try running some queries. For instructions, see [Running queries](#running-queries).

## Connect with Neon's psql passwordless auth

Neon's `psql` passwordless auth feature helps you quickly authenticate a connection to a Neon project.

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

   After making your selection, you are directed to check the terminal. In the terminal, you are connected to the project and connection information similar to the following is displayed:

   ```bash
   NOTICE:  Connecting to database.
   psql (15.0 (Ubuntu 15.0-1.pgdg22.04+1))
   Type "help" for help.

   casey=>
   ```

   **_Note_**: When using _`psql` quick auth_ to connect, the `psql` prompt shows your local terminal user name instead of the database name that is shown for the other `psql` connection methods described in this topic. However, you are logged in to the default `main` database as the Neon `web_access` user, which you can verify by running this query:

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

## Connect with an exported password

<Admonition type="warning">
Some operating systems allow non-root users to view process environment variables when using the `ps` command. For security reasons, consider using a password file in such cases.
</Admonition>

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

   - `<user>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
   - `<project_id>` is the Neon Project ID, which is found on the Neon Console **Settings** tab, under **General Settings**.

## Connect with a password saved to a file

To connect with a password saved to a `.pgpass` password file:

1. In your terminal, run the following commands to create and configure the `.pgpass` file:

   ```bash
   touch ~/.pgpass && \
   chmod 0600 ~/.pgpass && \
   echo -e "<project_id>.cloud.neon.tech:5432:main:<user>:<password>\n$(cat ~/.pgpass)" > ~/.pgpass
   ```

  <Admonition type="tip">
  If you already have a `.pgpass` file, you only need to run the `echo` command.
  </Admonition>

2. Connect with the following command:

   ```bash
   psql -h <project_id>.cloud.neon.tech -U <user> main
   ```

   where:

   - `<project_id>` is the ID of the Neon project, which is found on the Neon Console **Settings** tab, under **General Settings**.
   - `<password>` is the database user's password, which is provided to you when you create a Neon project.
   - `<user>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.

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

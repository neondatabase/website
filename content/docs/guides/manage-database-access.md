---
title: Manage roles and database access with SQL
subtitle: Learn how to create roles and manage database access in Neon with SQL
enableTableOfContents: true
---

This guide shows how to manage database access in Neon using SQL. This guide will lead you through connecting to Neon with an administrative role, creating a database, creating a new role for privilege management, and granting privileges to that role. It will then show how to create roles for database users and grant those users role membership that will allow them to use the new database.

## Understanding roles in Neon

Before you begin, it's important to understand how roles work in Neon. Each Neon project is created with a default role that takes its name from your Neon account (the Google, GitHub, or partner account that you registered with). This role owns the default database (`neondb`) that is created in your project's primary branch. For example, if you sign up for Neon with a John Smith Google account, the the project is created with a default role named `john`.

Your default Neon role is automatically granted membership in a `neon_superuser` role, which provides the user with the privileges and predefined PostgreSQL role memberships shown in this `CREATE ROLE` statement:

<CodeBlock shouldWrap>

```sql
CREATE ROLE neon_superuser CREATEDB CREATEROLE NOLOGIN IN ROLE pg_read_all_data, pg_write_all_data;
```

</CodeBlock>

You can think of this role as a Neon administrator role. A user with membership in the `neon_superuser` role can create databases, create roles, add extensions, grant `neon_superuser` privileges, and has all the privileges of `pg_read_all_data` and `pg_write_all_data`. You can find more information about this role [here](/docs/reference/manage/roles#the-neon-super-user).

Any user created in the Neon console or using the Neon API is automatically granted membership in the `neon_superuser` role. But what do you do if you need to create roles with different or limited privileges? After all, not every database user should be an administrator in Neon.

Neon supports creating and managing PostgreSQL roles with SQL. Roles created with SQL from a client such as [psql](/docs/connect/query-with-psql-editor) or from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) start with the same basic privileges granted to newly created roles in stand-alone PostgreSQL. They are not granted membership in the `neon_superuser` role.

Using SQL, you can define database roles with only the privileges you choose to grant. The following instructions show you how.

## Create roles and grant database privileges

To begin, assume you're creating a new database that will be used by several developers, all requiring read-write access.

1. Start by connecting to the default `neondb` database with your default Neon role using `psql` (or some other client that supports SQL). As described above, this role has administration privileges in Neon, which enable it to create databases and roles.

    <CodeBlock shouldWrap>

    ```bash
    psql postgres://john:<password>@ep-restless-waterfall-733645.us-west-2.aws.neon.tech/neondb
    ```

    </CodeBlock>

2. Create a new database. Call it `app_db`. Neon supports creating databases with the Neon console, the Neon API, and SQL. Here, we use SQL.

    ```sql
    CREATE DATABASE app_db;
    ```

    <Admonition type="note">
    The role that creates a database is automatically the owner of the database.
    </Admonition>

3. Create a shared role for database users. This role will be used to manage database user privileges. Neon requires a password when creating any role with SQL.

    ```sql
    CREATE ROLE dev_users PASSWORD `password`;
    ```

    <Admonition type="important">  
    Your password must have 60 bits of entropy. To achieve this, you can follow these password composition guidelines:
      - **Length**: The password should consist of at least 12 characters.
      - **Character diversity**: To enhance complexity, passwords should include a variety of character types, specifically:
        - Lowercase letters (a-z)
        - Uppercase letters (A-Z)
        - Numbers (0-9)
        - Special symbols (e.g., !@#$%^&*)
      - **Avoid predictability**: To maintain a high level of unpredictability, do not use:
        - Sequential patterns (such as '1234', 'abcd', 'qwerty')
        - Common words or phrases
        - Any words found in a dictionary
      - **Avoid character repetition**: To maximize randomness, do not use the same character more than twice consecutively.
      Example password: `T3sting!23Ab` (DO NOT USE THIS EXAMPLE PASSWORD)

      Hashed passwords are not supported.
    </Admonition>

4. Grant all users with the `dev_users` role all privileges on the database:

    ```sql
    GRANT ALL PRIVILEGES ON DATABASE app_db TO dev_users;
    ```

5. Create some database users. The password requirements described above apply here as well.

    ```sql
    CREATE ROLE dev_user1 WITH LOGIN PASSWORD 'password';
    CREATE ROLE dev_user2 WITH LOGIN PASSWORD 'password';
    ```

6. Grant the users the privileges associated with the `dev_users` role:

    ```sql
    GRANT dev_users TO dev_user1;
    GRANT dev_users TO dev_user2;
    ```

    The `dev_user1` and `dev_user2` can now connect to the `app_db` database and start using it with full privileges.

    ```bash
    psql postgres://dev_user1:T3sting!23Ab@ep-restless-waterfall-733645.us-west-2.aws.neon.tech/app_db
    psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
    Type "help" for help.

    app_db=> 
    ```

You may want to employ a more granular privilege scheme in your database access configuration, which you can do using a similar approach of creating 'group' roles and granting membership to those roles. For further details about granting privileges in PostgreSQL, please see the [GRANT](https://www.postgresql.org/docs/current/sql-grant.html) command in the _PostgreSQL documentation_.

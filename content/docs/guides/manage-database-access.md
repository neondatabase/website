---
title: Manage roles and database access
subtitle: Learn how to manage roles and database access in Neon
enableTableOfContents: true
updatedOn: '2023-09-15T13:00:43Z'
---

This guide describes how to manage roles and database access in Neon. Learn how to create read-only and read-write roles, and how to manage access to development branches.

## Understanding roles in Neon

Each Neon project is created with a default role that takes its name from your Neon account (the Google, GitHub, or partner account that you registered with). This role owns the ready-to-use database (`neondb`) created in your project's primary branch. For example, if a user named "Alex" signs up for Neon with a Google account, the project is created with a default role named `alex`, and `alex` is the owner of the `neondb` database.

Your default Neon role is automatically granted membership in a `neon_superuser` role, which has the following privileges and predefined role memberships:

- `CREATEDB`: Provides the ability to create databases.
- `CREATEROLE`: Provides the ability to create new roles (which also means it can alter and drop roles).
- `BYPASSRLS`: Provides the ability to bypass row-level security (RLS) policies. This attribute is only included in `neon_superuser` roles in projects created after the [August 15, 2023 release](/docs/release-notes/2023-08-15-storage-and-compute).
- `NOLOGIN`: The role cannot be used to log in to the Postgres server. Neon is a managed Postgres service, so you cannot access the host operating system directly.
- `pg_read_all_data`: A predefined role in Postgres that provides the ability to read all data (tables, views, sequences), as if having `SELECT` rights on those objects, and `USAGE` rights on all schemas.
- `pg_write_all_data`: A predefined role in Postgres that provides the ability to write all data (tables, views, sequences), as if having `INSERT`, `UPDATE`, and `DELETE` rights on those objects, and `USAGE` rights on all schemas.

Any user created with the Neon console, Neon API, or Neon CLI is also granted membership in the `neon_superuser` role. But what do you do if you need to create roles with more granular access permissions? For example, how do you grant read-only access to a particular database schema to users that run analytics queries, or read-write access to application users?

## Creating roles with granular access permissions

You can create roles with granular access permissions in Neon via SQL. Roles created with SQL from a client such as [psql](/docs/connect/query-with-psql-editor), [pgAdmin](https://www.pgadmin.org/), or from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), are created with the same basic privileges granted to newly created roles in a standalone Postgres installation. These users are not granted membership in the `neon_superuser` role. They must be selectively granted permissions for each database object. This provides a lot of flexibility but also makes the process of creating roles with the desired permissions a little more complicated.

The recommended approach to creating roles with granular access permissions in Neon is as follows:

1. Use your  default Neon role or another role with `neon_superuser` privileges to create roles for each application or use case via SQL. For example, you might create `read_only` and `read_write` roles.
2. Grant privileges to these role to grant access to database objects. For example, grant the ability to run `SELECT` queries to the `read_only role`, and grant `INSERT`, `UPDATE`, and `DELETE` privileges to the `read_write` role.
3. Create users. For example, create a user named `read_only_user1` or `read_write_user1`.
4. Assign the predefined `read_only` ord `read_write` roles to those users to grant them the same privileges as the role. For example, grant the `read_only` role to `read_only_user1`, and the `read_write` role to `read_write_user1`.

You can remove a role from a user at any time to revoke privileges.

## Create database roles

This section describes how to create roles in Neon via SQL and grant the roles access to database objects. Access must be granted at the database, schema, and schema object level. For example, to grant access to a table, you must also grant access to the database and schema in which the table resides. If these access permissions are not defined, the role will not be able access the table.

In the following sections, we'll cover how to create read-only and read-write roles with access to a specific database and schema. For a summary of the required SQL statements, see [Statement summary for read-only and read-write roles](#statement-summary-for-read-only-and-read-write-roles).

### Create a read-only role

To create a read-only role:

1. Connect to your database from an client such as [psql](/docs/connect/query-with-psql-editor) or [pgAdmin](https://www.pgadmin.org/), or from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). If you need help connecting, see [Connect from any client](/docs/connect/connect-from-any-app).

2. Create a `read_only` role using the following statement. Neon requires specifying a password when creating a role with SQL. Since this is a shared role used for privilege management, the `LOGIN` privilege is optional and not included.

    ```sql
    CREATE ROLE read_only PASSWORD '<password>';
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

    Passwords must be supplied in plain text but are encrypted when stored. Hashed passwords are not supported.
    </Admonition>

3. Grant the `read_only` role read-only privileges on the schema. Replace `<database>` and `<schema>` with actual database and schema names, respectively.

    ```sql
    -- Grant the "read_only" role the privilege to connect to the specified database
    GRANT CONNECT ON DATABASE <database> TO read_only;

    -- Grant the 'read_only' role usage privileges on the specified schema. 
    -- This allows the role to access objects in the schema but doesn't grant any specific permissions on those objects.
    GRANT USAGE ON SCHEMA <schema> TO read_only;

    -- Grant the 'read_only' role SELECT privileges on all existing tables in the specified schema.
    -- This allows the role to read the data from any table within the schema.
    GRANT SELECT ON ALL TABLES IN SCHEMA <schema> TO read_only; 

    -- Alter the default privileges for any new tables created in the specified schema.
    -- This ensures that any new tables created in this schema in the future automatically 
    -- grant SELECT privileges to the 'read_only' role.
    ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT ON TABLES TO read_only;
    ```

4. Create a database user. The password requirements mentioned above apply here as well.

    ```sql
    CREATE ROLE read_only_user1 WITH LOGIN PASSWORD '<password>';
    ```

5. Grant the user membership in the `read_only` role:

    ```sql
    GRANT read_only TO read_only_user1;
    ```

    The `read_only_user1` user now has read-only access to tables in the specified schema and database. When connecting, replace placeholders in the connection string (like `dbname`).

    ```bash
    psql postgres://read_only_user1:AbC123dEf@ep-cool-darkness-123456.us-west-2.aws.neon.tech/dbname
    psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
    Type "help" for help.

    your_db=> 
    ```

    If the user attempts to perform an `INSERT`, `UPDATE`, or `DELETE` operation, a `permission denied` error is returned.

### Create a read-write role

To create a read-write role:

1. Connect to your database from an client such as [psql](/docs/connect/query-with-psql-editor) or [pgAdmin](https://www.pgadmin.org/), or from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). If you need help connecting, see [Connect from any client](/docs/connect/connect-from-any-app).

2. Create a `read_write` role using the following statement. Neon requires specifying a password when creating a role with SQL. Since this is a shared role used for privilege management, the `LOGIN` privilege is optional and not included.

    ```sql
    CREATE ROLE read_write PASSWORD '<password>';
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

    Passwords must be supplied in plain text but are encrypted when stored. Hashed passwords are not supported.
    </Admonition>

3. Grant the `read_write` role read-only privileges on the schema. Replace `<database>` and `<schema>` with actual database and schema names, respectively.

    ```sql
    -- Grant the "read_only" role the privilege to connect to the specified database
    GRANT CONNECT ON DATABASE <database> TO read_write;

    -- Grant the 'read_only' role usage privileges on the specified schema. 
    -- This allows the role to access objects in the schema but doesn't grant any specific permissions on those objects.
    GRANT USAGE ON SCHEMA <schema> TO read_write;

    -- Grant the 'read_only' role SELECT privileges on all existing tables in the specified schema.
    -- This allows the role to read the data from any table within the schema.
    GRANT SELECT ON ALL TABLES IN SCHEMA <schema> TO read_write; 

    -- Alter the default privileges for any new tables created in the specified schema.
    -- This ensures that any new tables created in this schema in the future automatically 
    -- grant SELECT privileges to the 'read_only' role.
    ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT ON TABLES TO read_write;

    -- Grant USAGE privileges to the 'read_write' role on all existing sequences in the '<schema>' schema.
    -- USAGE allows the role to use the sequence to generate values, typically for serial columns.
    GRANT USAGE ON ALL SEQUENCES IN SCHEMA <schema> TO read_write;

    -- Alter the default privileges so that any new sequences created in the '<schema>' schema in the future
    -- automatically grant USAGE privileges to the 'read_write' role, allowing it to use the sequences.
    ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT USAGE ON SEQUENCES TO read_write;

4. Create a database user. The password requirements mentioned above apply here as well.

    ```sql
    CREATE ROLE read_write_user1 WITH LOGIN PASSWORD '<password>';
    ```

5. Grant the user membership in the `read_write` role:

    ```sql
    GRANT read_only TO read_write_user1;
    ```

    The `read_write_user1` user now has read-write access to tables in the specified schema and database. When connecting, replace placeholders in the connection string (like `dbname`).

    ```bash
    psql postgres://read_write_user1:AbC123dEf@ep-cool-darkness-123456.us-west-2.aws.neon.tech/dbname
    psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
    Type "help" for help.

    your_db=> 
    ```

    You read_write user will be permitted to perform `INSERT`, `UPDATE`, or `DELETE` operations on tables in the schema.

## Statement summary for read-only and read-write roles

To create read-only and read-write roles described in the previous sections, you must connect to the database `<database>` using your default Neon role or another `neon_superuser` role, and then run the following SQL statements using an SQL client such as [psql](/docs/connect/query-with-psql-editor), [pgAdmin](https://www.pgadmin.org/), or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).

```sql
-- read_only role
CREATE ROLE read_only;
GRANT CONNECT ON DATABASE <database> TO read_only;
GRANT USAGE ON SCHEMA <schema> TO read_only;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema> TO read_only;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT ON TABLES TO read_only;

-- read_write role
CREATE ROLE read_write;
GRANT CONNECT ON DATABASE <database> TO read_write;
GRANT USAGE, CREATE ON SCHEMA <schema> TO read_write;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA <schema> TO read_write;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO read_write;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA <schema> TO read_write;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT USAGE ON SEQUENCES TO read_write;

-- Users creation
CREATE USER read_only_user1 WITH PASSWORD '<password>';
CREATE USER read_only_user1 WITH PASSWORD '<password>';
CREATE USER read_write_user1 WITH PASSWORD '<password>';
CREATE USER read_write_user2 WITH PASSWORD '<password>';

-- Grant privileges to users
GRANT read_only TO read_only_user1;
GRANT read_only TO read_only_user2;
GRANT read_write TO read_write_user1;
GRANT read_write TO read_write_user2;
```

## Role management with Neon branching

When you create a branch in Neon, you are creating a clone of the parent branch, which includes the roles and databases as they exist on the parent branch. If you want to create a "development" branch of your "production" database, and then provide developers with access to the database on the development branch, you can follow this general procedure:

1. Connect to your database from an client such as [psql](/docs/connect/query-with-psql-editor) or [pgAdmin](https://www.pgadmin.org/), or from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). If you need help connecting, see [Connect from any client](/docs/connect/connect-from-any-app).

2. Use your default Neon role or another role with `neon_superuser` privileges to create a developer role **on the parent branch**. For example, create a role named `dev_user`.

    ```sql
    CREATE ROLE dev_user PASSWORD `password`;
    ```

   <Admonition type="important">  
    Passwords must have 60 bits of entropy. To achieve this, you can follow these password composition guidelines:
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

    Passwords must be supplied in plain text but are encrypted when stored. Hashed passwords are not supported.
    </Admonition>

2. Grant the `dev_user` role privileges on the database:

    ```sql
    GRANT ALL PRIVILEGES ON DATABASE <database> TO dev_users;
    ```

    At this point, you have a `dev_user` role on your parent branch, and the role is not assigned to any users. This unused role will now be created in all future branches created from this branch.

3. Create a development branch. See [Create a branch](/docs/manage/branches#create-a-branch) for instructions. This branch includes the `dev_user` role you just defined.

4. Connect to the same database on the new branch, again with a client such as [psql](/docs/connect/query-with-psql-editor) or [pgAdmin](https://www.pgadmin.org/), or from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). If you are connecting from an SQL client, be mindful that your connection string will differ. If you need help connecting to your new branch, see [Connect from any client](/docs/connect/connect-from-any-app).

4. Connected the the database on your new branch, create developer users. The password requirements described above apply here as well.

    ```sql
    CREATE ROLE dev_user1 WITH LOGIN PASSWORD '<password>';
    CREATE ROLE dev_user2 WITH LOGIN PASSWORD '<password>';
    ```

5. Grant the users membership in the `dev_users` role:

    ```sql
    GRANT dev_users TO dev_user1;
    GRANT dev_users TO dev_user2;
    ```

    The `dev_user1` and `dev_user2` can now connect to the specified database and start using it with full privileges.

    ```bash
    psql postgres://dev_user1:AbC123dEf@ep-cool-darkness-123456.us-west-2.aws.neon.tech/dbname
    psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
    Type "help" for help.

    dbname=> 
    ```

## More information

For more information about granting privileges in Postgres, please see the [GRANT](https://www.postgresql.org/docs/current/sql-grant.html) command in the _PostgreSQL documentation_.

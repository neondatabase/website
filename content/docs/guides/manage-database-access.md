---
title: Manage roles and database access
subtitle: Learn how to manage roles and database access in Neon
enableTableOfContents: true
updatedOn: '2023-09-15T13:00:43Z'
---

This guide describes how to manage roles and database access in Neon.

## Understanding roles in Neon

Each Neon project is created with a default role that takes its name from your Neon account (the Google, GitHub, or partner account you registered with). This role owns the ready-to-use database (`neondb`) created in your project's primary branch. For example, if a user named "Alex" signs up for Neon with a Google account, the project is created with a default role named `alex`.

Your default Neon role is automatically assigned the `neon_superuser` role, which allows it to create databases, roles, and read and write data in all tables, views, sequences. Any user created with the Neon console, Neon API, or Neon CLI is also assigned the `neon_superuser` role. For more information, see [The neon_superuser role](/docs/manage/roles#the-neonsuperuser-role).

It is good practice to reserve `neon_superuser` roles for database administration tasks like creating roles and databases. For other users, we recommend creating roles with specific sets of permissions based on application and access requirements. Then, assign the appropriate role to each user. The roles you create should adhere to a _least privilege_ model for accessing database objects, granting only the permissions required to accomplish their tasks.

But how do you create roles with limited access? The following sections will show you how to create read-only and read-write roles and assign those roles to users. We'll also look at how to create a "developer" role and grant that role full access to a database on a "development" branch in a Neon project.

## A word about users, groups, and roles in Postgres

Before you proceed, it is helpful to have an understanding of how Postgres manages "users, groups, and roles".

In Postgres, users, groups, and roles are the same thing, while other relational database management systems often define these as separate entities. From Postgres [Database Roles and Privileges](https://www.postgresql.org/docs/current/user-manag.html) documentation:

"_PostgreSQL manages database access permissions using the concept of roles. A role can be thought of as either a database user, or a group of database users, depending on how the role is set up. Roles can own database objects (for example, tables and functions) and can assign privileges on those objects to other roles to control who has access to which objects. Furthermore, it is possible to grant membership in a role to another role, thus allowing the member role to use privileges assigned to another role.

The concept of roles subsumes the concepts of “users” and “groups”. In PostgreSQL versions before 8.1, users and groups were distinct kinds of entities, but now there are only roles. Any role can act as a user, a group, or both._"

With that out of the way, let's get started.

## Creating roles with limited access

You can create roles with limited access permissions in Neon via SQL. Roles created with SQL from a client such as [psql](/docs/connect/query-with-psql-editor), [pgAdmin](https://www.pgadmin.org/), or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), are created with the same basic privileges granted to newly created roles in a standalone Postgres installation. These users are not assigned the `neon_superuser` role. They must be selectively granted permissions for each database object. This provides a lot of flexibility but also makes the process of creating roles with the desired permissions slightly more complicated.

The recommended approach to creating roles with limited access permissions in Neon is as follows:

1. Use your  default Neon role or another role with `neon_superuser` privileges to create roles for each application or use case via SQL. For example, create `readonly` and `readwrite` roles.
2. Grant privileges to those roles to allow access to database objects. For example, grant the `SELECT` privilege to a `readonly` role, or grant `SELECT`, `INSERT`, `UPDATE`, and `DELETE` privileges to a `readwrite` role.
3. Create your database users. For example, create users named `readonly_user1` and `readwrite_user1`.
4. Assign the `readonly` or `readwrite` role to those users to grant them the privileges associated with those roles. For example, assign the `readonly` role to `readonly_user1`, and `readwrite` to `readwrite_user1`.

You can remove a role from a user at any time to revoke privileges.

## Create roles

This section describes how to create roles in Neon via SQL and grant the roles access to database objects. Access must be granted at the database, schema, and schema object level. For example, to grant access to a table, you must also grant access to the database and schema in which the table resides. If these access permissions are not defined, the role will not be able access the table.

In the following sections, we'll cover how to create read-only and read-write roles with access to a specific database and schema. For a summary of the required SQL statements, refer to the SQL statement summaries at the end of each section.

### Create a read-only role

To create a read-only role:

1. Connect to your database from an SQL client such as [psql](/docs/connect/query-with-psql-editor), [pgAdmin](https://www.pgadmin.org/), or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). If you need help connecting, see [Connect from any client](/docs/connect/connect-from-any-app).

2. Create a `readonly` role using the following statement. Neon requires specifying a password when creating a role with SQL. Since this is a shared role used for privilege management, the `LOGIN` privilege is optional and not included.

    ```sql
    CREATE ROLE readonly PASSWORD '<password>';
    ```
  
    The password must have 60 bits of entropy (at least 12 characters with a mix of lowercase, uppercase, number, and symbol characters). For specific guidelines, see [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql).

3. Grant the `readonly` role read-only privileges on the schema. Replace `<database>` and `<schema>` with actual database and schema names, respectively.

    <CodeBlock shouldWrap>

    ```sql
    -- Grant the "readonly" role the privilege to connect to the specified database
    GRANT CONNECT ON DATABASE <database> TO readonly;

    -- Grant the 'readonly' role usage privileges on the specified schema. 
    -- This allows the role to access objects in the schema but doesn't grant any specific permissions on those objects.
    GRANT USAGE ON SCHEMA <schema> TO readonly;

    -- Grant the 'readonly' role SELECT privileges on all existing tables in the specified schema.
    -- This allows the role to read the data from any table within the schema.
    GRANT SELECT ON ALL TABLES IN SCHEMA <schema> TO readonly; 

    -- Alter the default privileges for any new tables created in the specified schema.
    -- This ensures that any new tables created in this schema in the future automatically 
    -- grant SELECT privileges to the 'readonly' role.
    ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT ON TABLES TO readonly;
    ```

    </CodeBlock>

4. Create a database user. The password requirements mentioned above apply here as well.

    ```sql
    CREATE ROLE readonly_user1 WITH LOGIN PASSWORD '<password>';
    ```

5. Grant the user membership in the `readonly` role:

    ```sql
    GRANT readonly TO readonly_user1;
    ```

    The `readonly_user1` user now has read-only access to tables in the specified schema and database. When connecting, replace the example connection string with your own.

    ```bash
    psql postgres://readonly_user1:AbC123dEf@ep-cool-darkness-123456.us-west-2.aws.neon.tech/dbname
    psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
    Type "help" for help.

    dbname=> 
    ```

    If the user attempts to perform an `INSERT`, `UPDATE`, or `DELETE` operation, a `permission denied` error is returned.

### SQL statement summary for a read-only role

To create the read-only role and user described above, run the following statements from an SQL client:

```sql
-- readonly role
CREATE ROLE readonly;
GRANT CONNECT ON DATABASE <database> TO readonly;
GRANT USAGE ON SCHEMA <schema> TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema> TO readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT ON TABLES TO readonly;

-- User creation
CREATE USER readonly_user1 WITH PASSWORD '<password>';

-- Grant privileges to user
GRANT readonly TO readonly_user1;
```

### Create a read-write role

To create a read-write role:

1. Connect to your database from an SQL client such as [psql](/docs/connect/query-with-psql-editor), [pgAdmin](https://www.pgadmin.org/), or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). If you need help connecting, see [Connect from any client](/docs/connect/connect-from-any-app).

2. Create a `readwrite` role using the following statement. Neon requires specifying a password when creating a role with SQL. Since this is a shared role used for privilege management, the `LOGIN` privilege is optional and not included.

    ```sql
    CREATE ROLE readwrite PASSWORD '<password>';
    ```

    The password must have 60 bits of entropy (at least 12 characters with a mix of lowercase, uppercase, number, and symbol characters). For specific guidelines, see [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql).

3. Grant the `readwrite` role read-only privileges on the schema. Replace `<database>` and `<schema>` with actual database and schema names, respectively.

    <CodeBlock shouldWrap>

    ```sql
    -- Grant the "readwrite" role the privilege to connect to the specified database
    GRANT CONNECT ON DATABASE <database> TO readwrite;

    -- Grant the 'readwrite' role usage and create privileges on the specified schema. 
    -- This allows the role to access and create objects in the schema.
    GRANT USAGE, CREATE ON SCHEMA <schema> TO readwrite;

    -- Grant the 'readwrite' role SELECT, INSERT, UPDATE, DELETE privileges on all existing tables in the specified schema.
    -- This allows the role to read the data from any table within the schema.
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA <schema> TO readwrite; 

    -- Alter the default privileges for any new tables created in the specified schema.
    -- This ensures that any new tables created in this schema in the future automatically 
    -- grant SELECT privileges to the 'readonly' role.
    ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO readwrite;

    -- Grant USAGE privileges to the 'readwrite' role on all existing sequences in the specified schema.
    -- USAGE allows the role to use the sequence to generate values, typically for serial columns.
    GRANT USAGE ON ALL SEQUENCES IN SCHEMA <schema> TO readwrite;

    -- Alter the default privileges so that any new sequences created in the specified schema in the future
    -- automatically grant USAGE privileges to the 'readwrite' role, allowing it to use the sequences.
    ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT USAGE ON SEQUENCES TO readwrite;
    ```

    </CodeBlock>

4. Create a database user. The password requirements mentioned above apply here as well.

    ```sql
    CREATE ROLE readwrite_user1 WITH LOGIN PASSWORD '<password>';
    ```

5. Grant the user membership in the `readwrite` role:

    ```sql
    GRANT readwrite TO readwrite_user1;
    ```

    The `readwrite_user1` user now has read-write access to tables in the specified schema and database. When connecting, replace the example connection string with your own.

    ```bash
    psql postgres://readwrite_user1:AbC123dEf@ep-cool-darkness-123456.us-west-2.aws.neon.tech/dbname
    psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
    Type "help" for help.

    your_db=> 
    ```

    You readwrite user will be permitted to perform `INSERT`, `UPDATE`, or `DELETE` operations on tables in the schema.

### SQL statement summary for a read-write role

To create the read-only role and user described above, run the following statements from an SQL client:

<CodeBlock shouldWrap>

```sql
-- readwrite role
CREATE ROLE readwrite;
GRANT CONNECT ON DATABASE <database> TO readwrite;
GRANT USAGE, CREATE ON SCHEMA <schema> TO readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA <schema> TO readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO readwrite;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA <schema> TO readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT USAGE ON SEQUENCES TO readwrite;

-- User creation
CREATE USER readwrite_user2 WITH PASSWORD '<password>';

-- Grant privileges to user
GRANT readwrite TO readwrite_user1;
```

</CodeBlock>

## Role management with Neon branching

When you create a branch in Neon, you are creating a clone of the parent branch, which includes roles and databases on the parent branch. If you want to create a "development" branch of your "production" database and provide developers with access to the database on the development branch, you can follow these steps:

1. Connect to your database from an SQL client such as [psql](/docs/connect/query-with-psql-editor), [pgAdmin](https://www.pgadmin.org/), or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). If you need help connecting, see [Connect from any client](/docs/connect/connect-from-any-app).

2. Use your default Neon role or another role with `neon_superuser` privileges to create a developer role **on the parent branch**. For example, create a role named `dev_user`.

    ```sql
    CREATE ROLE dev_user PASSWORD `password`;
    ```

    The password must have 60 bits of entropy (at least 12 characters with a mix of lowercase, uppercase, number, and symbol characters). For specific guidelines, see [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql).

2. Grant the `dev_user` role privileges on the database:

    ```sql
    GRANT ALL PRIVILEGES ON DATABASE <database> TO dev_user;
    ```

    At this point, you have a `dev_user` role on your parent branch, and the role is not assigned to any users. This role will now be present in all future branches created from this branch.

3. Create a development branch. See [Create a branch](/docs/manage/branches#create-a-branch) for instructions. This branch includes the `dev_user` role you just defined.

4. Connect to the database **on the new branch** with an SQL client. Be mindful that a child branch connection string differs from a parent branch connection string. They reside on different hosts. If you need help connecting to your branch, see [Connect from any client](/docs/connect/connect-from-any-app).

4. After connected the the database on your new branch, create a developer user. The password requirements described above apply here as well.

    ```sql
    CREATE ROLE dev_user1 WITH LOGIN PASSWORD '<password>';
    ```

5. Grant the users membership in the `dev_users` role:

    ```sql
    GRANT dev_users TO dev_user1;
    ```

    The `dev_user1` and `dev_user2` users can now connect to the specified database and start using the database with full privileges.

    ```bash
    psql postgres://dev_user1:AbC123dEf@ep-cool-darkness-123456.us-west-2.aws.neon.tech/dbname
    psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
    Type "help" for help.

    dbname=> 
    ```

### SQL statement summary for a developer role

```sql
-- readwrite role
CREATE ROLE dev_user PASSWORD `password`;
GRANT ALL PRIVILEGES ON DATABASE <database> TO dev_user;

-- User creation
CREATE ROLE dev_user1 WITH LOGIN PASSWORD '<password>';

-- Grant privileges to user
GRANT dev_users TO dev_user1;
```

## Revoke privileges

You can revoke privileges by removing assigned roles. For example, to remove the `readwrite` role from `readwrite_user1`, run the following SQL statement:

```sql
REVOKE readwrite FROM readwrite_user1;
```

## Public schema privileges

Postgres 15 introduced changes regarding privileges on the `public` schema. When creating a new database, Postgres creates a schema named `public` in the database and permits access to the schema to a predefined Postgres role named `public`. Newly created roles in Postgres are automatically assigned the `public` role. In Postgres 14, the public role had CREATE and USAGE privileges n the public schema. In Postgres 15 and subsequent versions, the `public` role no longer has `CREATE` privileges.

Postgres uses a concept known as a `search path`, which is essentially a list of schema names that Postgres checks in the absence of a qualified name for a database object. For example, if you select a table named “mytable” without prefixing the schema name, Postgres searches for this table in the schemas listed in the search path, settling on the first match identified. The default search path includes the following schemas:

```sql
postgres=# show search_path;
   search_path   
-----------------
 "$user", public
(1 row)
```

The initial name `$user` is resolved to the name of the current user. If a schema with an identical name to the user name does not exist, this positions the `public` schema as the default schema. Given this particular search path, creating a table without specifying a schema will not be successful unless the user is explicitly granted the `CREATE` privileges on the `public` schema or to some other schema.

Prior to Postgres 15, the default ability to create objects within the `public` schema can present issues, especially in scenarios involving the creation of read-only users. Despite restricting all privileges, the permissions inherited through the `public` role could, prior to Postgres 15, inadvertently permit a user to create objects in the `public` schema. This issue is mitigated from Postgres 15 onwards, but it is important understand and manage if you are using Postgres 14 in Neon or if you are using Postgres 15 and are puzzled by the change in behavior.

Addressing this issue for Postgres 14, the SQL statement to revoke the default `CREATE` permission on the `public` schema from the `public` role is as follows:

```sql
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
```

Ensure that you are the owner of the `public` schema or a member of a role that authorizes you to execute this SQL statement.

Furthermore, to restrict the `public` role’s capability to connect to the database, employ the following statement:

```sql
REVOKE ALL ON DATABASE mydatabase FROM PUBLIC;
```

This ensures users are unable to connect to the database by default unless this permission is explicitly granted.

In practical application, revoking permissions from the `public` role may impact existing roles. Prior to revoking permissions from the `public` role, be sure to explicitly grant permissions to any roles that require the ability to connect to the database or create objects in the `public` schema, ensuring continued access as necessary.

## More information

For more information about granting privileges in Postgres, please see the [GRANT](https://www.postgresql.org/docs/current/sql-grant.html) command in the _PostgreSQL documentation_.

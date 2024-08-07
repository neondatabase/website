---
title: Manage database access
subtitle: Learn how to manage user access to databases in your Neon project
enableTableOfContents: true
redirectFrom:
  - /docs/guides/manage-database-access
updatedOn: '2024-08-07T21:36:52.671Z'
---

Each Neon project is created with a Postgres role that is named for your database. For example, if your database is named `neondb`, the project is created with a role named `neondb_owner`.

This Postgres role is automatically assigned the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role, which allows creating databases, roles, and reading and writing data in all tables, views, and sequences. Any user created with the Neon Console, Neon API, or Neon CLI is also assigned the `neon_superuser` role.

It is good practice to reserve `neon_superuser` roles for database administration tasks like creating roles and databases. For other users, we recommend creating roles with specific sets of permissions based on application and access requirements. Then, assign the appropriate roles to your users. The roles you create should adhere to a _least privilege_ model, granting only the permissions required to accomplish their tasks.

But how do you create roles with limited access? The following sections describe how to create read-only and read-write roles and assign those roles to users. We'll also look at how to create a "developer" role and grant that role full access to a database on a development branch in a Neon project.

## A word about users, groups, and roles in Postgres

In Postgres, users, groups, and roles are the same thing. From the PostgreSQL [Database Roles](https://www.postgresql.org/docs/current/user-manag.html) documentation:

_PostgreSQL manages database access permissions using the concept of roles. A role can be thought of as either a database user, or a group of database users, depending on how the role is set up._

Neon recommends granting privileges to roles, and then assigning those roles to your database users.

## Creating roles with limited access

You can create roles with limited access via SQL. Roles created with SQL are created with the same basic [public schema privileges](#public-schema-privileges) granted to newly created roles in a standalone Postgres installation. These users are not assigned the [neon_superuser](/docs/manage/roles#the-neonsuperuser-role) role. They must be selectively granted permissions for each database object.

The recommended approach to creating roles with limited access is as follows:

1. Use your Neon role to create roles for each application or use case via SQL. For example, create `readonly` and `readwrite` roles.
2. Grant privileges to those roles to allow access to database objects. For example, grant the `SELECT` privilege to a `readonly` role, or grant `SELECT`, `INSERT`, `UPDATE`, and `DELETE` privileges to a `readwrite` role.
3. Create your database users. For example, create users named `readonly_user1` and `readwrite_user1`.
4. Assign the `readonly` or `readwrite` role to those users to grant them the privileges associated with those roles. For example, assign the `readonly` role to `readonly_user1`, and the `readwrite` role to `readwrite_user1`.

<Admonition type="note">
You can remove a role from a user at any time to revoke privileges. See [Revoke privileges](#revoke-privileges).
</Admonition>

## Create a read-only role

This section describes how to create a read-only role with access to a specific database and schema. An SQL statement summary is provided at the end.

<Admonition type="info">
In Postgres, access must be granted at the database, schema, and object level. For example, to grant access to a table, you must also grant access to the database and schema in which the table resides. If these access permissions are not defined, the role will not be able access the table.
</Admonition>

To create a read-only role:

1. Connect to your database from an SQL client such as [psql](/docs/connect/query-with-psql-editor), [pgAdmin](https://www.pgadmin.org/), or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). If you need help connecting, see [Connect from any client](/docs/connect/connect-from-any-app).

2. Create a `readonly` role using the following statement. A password is required.

   ```sql
   CREATE ROLE readonly PASSWORD '<password>';
   ```

   The password should have at least 12 characters with a mix of lowercase, uppercase, number, and symbol characters. For detailed password guidelines, see [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql).

3. Grant the `readonly` role read-only privileges on the schema. Replace `<database>` and `<schema>` with actual database and schema names, respectively.

   ```sql
   -- Grant permission to connect to the database
   GRANT CONNECT ON DATABASE <database> TO readonly;

   -- Grant USAGE on the schema
   GRANT USAGE ON SCHEMA <schema> TO readonly;

   -- Grant SELECT on all existing tables in the schema
   GRANT SELECT ON ALL TABLES IN SCHEMA <schema> TO readonly;

   -- Grant SELECT on all tables added in the future
   ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT ON TABLES TO readonly;
   ```

4. Create a database user. The password requirements mentioned above apply here as well.

   ```sql
   CREATE ROLE readonly_user1 WITH LOGIN PASSWORD '<password>';
   ```

5. Assign the `readonly` role to `readonly_user1`:

   ```sql
   GRANT readonly TO readonly_user1;
   ```

   The `readonly_user1` user now has read-only access to tables in the specified schema and database and should be able to connect and run `SELECT` queries.

   ```bash
   psql postgresql://readonly_user1:AbC123dEf@ep-cool-darkness-123456.us-west-2.aws.neon.tech/dbname
   psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
   SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
   Type "help" for help.

   dbname=> SELECT * FROM <schema>.<table_name>;
   ```

   If the user attempts to perform an `INSERT`, `UPDATE`, or `DELETE` operation, a `permission denied` error is returned.

### SQL statement summary

To create the read-only role and user described above, run the following statements from an SQL client:

```sql
-- readonly role
CREATE ROLE readonly PASSWORD '<password>';
GRANT CONNECT ON DATABASE <database> TO readonly;
GRANT USAGE ON SCHEMA <schema> TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema> TO readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT ON TABLES TO readonly;

-- User creation
CREATE USER readonly_user1 WITH PASSWORD '<password>';

-- Grant privileges to user
GRANT readonly TO readonly_user1;
```

## Create a read-write role

This section describes how to create a read-write role with access to a specific database and schema. An SQL statement summary is provided at the end.

To create a read-write role:

1. Connect to your database from an SQL client such as [psql](/docs/connect/query-with-psql-editor), [pgAdmin](https://www.pgadmin.org/), or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). If you need help connecting, see [Connect from any client](/docs/connect/connect-from-any-app).

2. Create a `readwrite` role using the following statement. A password is required.

   ```sql
   CREATE ROLE readwrite PASSWORD '<password>';
   ```

   The password should have at least 12 characters with a mix of lowercase, uppercase, number, and symbol characters. For detailed password guidelines, see [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql).

3. Grant the `readwrite` role read-write privileges on the schema. Replace `<database>` and `<schema>` with actual database and schema names, respectively.

   ```sql
   -- Grant permission to connect to the database
   GRANT CONNECT ON DATABASE <database> TO readwrite;

   -- Grant USAGE and CREATE on the schema
   GRANT USAGE, CREATE ON SCHEMA <schema> TO readwrite;

   -- Grant SELECT, INSERT, UPDATE, DELETE on all existing tables in the schema
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA <schema> TO readwrite;

   -- grant SELECT on all tables added in the future
   ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO readwrite;

   -- Grant USAGE on all sequences in the schema
   GRANT USAGE ON ALL SEQUENCES IN SCHEMA <schema> TO readwrite;

   -- Grant USAGE on all sequences added in the future
   ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT USAGE ON SEQUENCES TO readwrite;
   ```

4. Create a database user. The password requirements mentioned above apply here as well.

   ```sql
   CREATE ROLE readwrite_user1 WITH LOGIN PASSWORD '<password>';
   ```

5. Assign the `readwrite` role to `readwrite_user1`:

   ```sql
   GRANT readwrite TO readwrite_user1;
   ```

   The `readwrite_user1` user now has read-write access to tables in the specified schema and database and should able to connect and run `SELECT`, `INSERT`, `UPDATE`, `DELETE` queries.

   ```bash
   psql postgresql://readwrite_user1:AbC123dEf@ep-cool-darkness-123456.us-west-2.aws.neon.tech/dbname
   psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
   SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
   Type "help" for help.

   dbname=> INSERT INTO <table_name> (col1, col2) VALUES (1, 2);
   ```

### SQL statement summary

To create the read-write role and user described above, run the following statements from an SQL client:

```sql
-- readwrite role
CREATE ROLE readwrite PASSWORD '<password>';
GRANT CONNECT ON DATABASE <database> TO readwrite;
GRANT USAGE, CREATE ON SCHEMA <schema> TO readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA <schema> TO readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO readwrite;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA <schema> TO readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema> GRANT USAGE ON SEQUENCES TO readwrite;

-- User creation
CREATE USER readwrite_user1 WITH PASSWORD '<password>';

-- Grant privileges to user
GRANT readwrite TO readwrite_user1;
```

## Create a developer role

This section describes how to create a "development branch" and grant developers full access to a database on the development branch. To accomplish this, we create a developer role on the "parent" branch, create a development branch, and then assign users to the developer role on the development branch.

As you work through the steps in this scenario, remember that when you create a branch in Neon, you are creating a clone of the parent branch, which includes the roles and databases on the parent branch.

To get started:

1. Connect to the database **on the parent branch** from an SQL client such as [psql](/docs/connect/query-with-psql-editor), [pgAdmin](https://www.pgadmin.org/), or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). If you need help connecting, see [Connect from any client](/docs/connect/connect-from-any-app).

2. Use your default Neon role or another role with `neon_superuser` privileges to create a developer role **on the parent branch**. For example, create a role named `dev_users`.

   ```sql
   CREATE ROLE dev_users PASSWORD '<password>';
   ```

   The password should have at least 12 characters with a mix of lowercase, uppercase, number, and symbol characters. For detailed password guidelines, see [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql).

3. Grant the `dev_users` role privileges on the database:

   ```sql
   GRANT ALL PRIVILEGES ON DATABASE <database> TO dev_users;
   ```

   You now have a `dev_users` role on your parent branch, and the role is not assigned to any users. This role will now be included in all future branches created from this branch.

   <Admonition type="note">
   The `GRANT` statement above does not grant privileges on existing schemas, tables, sequences, etc., within the database. If you want the `dev_users` role to access specific schemas, tables, etc., you need to grant those permissions explicitly.

   For example, to grant all privileges on all tables in a schema:

   ```sql
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA <schema_name> TO dev_users;
   ```

   Similarly, you'd grant privileges for sequences and other objects as needed.

   That said, the `GRANT` command above allows users with the `dev_users` role to create new schemas within the database. But for pre-existing schemas and their objects, you need to grant permissions explicitly.
   </Admonition>

4. Create a development branch. Name it something like `dev1`. See [Create a branch](/docs/manage/branches#create-a-branch) for instructions.

5. Connect to the database **on the development branch** with an SQL client. Be mindful that a child branch connection string differs from a parent branch connection string. The branches reside on different hosts. If you need help connecting to your branch, see [Connect from any client](/docs/connect/connect-from-any-app).

6. After connecting the database on your new branch, create a developer user (e.g., `dev_user1`). The password requirements described above apply here as well.

   ```sql
   CREATE ROLE dev_user1 WITH LOGIN PASSWORD '<password>';
   ```

7. Assign the `dev_users` role to the `dev_user1` user:

   ```sql
   GRANT dev_users TO dev_user1;
   ```

   The `dev_user1` user can now connect to the database on your development branch and start using the database with full privileges.

   ```bash
   psql postgresql://dev_user1:AbC123dEf@ep-cool-darkness-123456.us-west-2.aws.neon.tech/dbname
   psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
   SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
   Type "help" for help.

   dbname=>
   ```

### SQL statement summary

```sql
-- dev_users role
CREATE ROLE dev_users PASSWORD `password`;
GRANT ALL PRIVILEGES ON DATABASE <database> TO dev_users;

-- optionally, grant access to an existing schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA <schema_name> TO dev_users;

-- User creation
CREATE ROLE dev_user1 WITH LOGIN PASSWORD '<password>';

-- Grant privileges to user
GRANT dev_users TO dev_user1;
```

## Revoke privileges

If you set up privilege-holding roles as describe above, you can revoke privileges by removing assigned roles. For example, to remove the `readwrite` role from `readwrite_user1`, run the following SQL statement:

```sql
REVOKE readwrite FROM readwrite_user1;
```

## Public schema privileges

When creating a new database, Postgres creates a schema named `public` in the database and permits access to the schema to a predefined Postgres role named `public`. Newly created roles in Postgres are automatically assigned the `public` role. In Postgres 14, the public role has `CREATE` and `USAGE` privileges on the `public` schema. In Postgres 15 and higher, the `public` role has only `USAGE` privileges on the `public` schema.

Why does this matter? If you create a new role and want to limit access for that role, you should be aware of the default `public` schema access automatically assigned to newly created roles.

If you want to limit access to the `public` schema for your users, you have to revoke privileges on the `public` schema explicitly.

For users of Postgres 14, the SQL statement to revoke the default `CREATE` permission on the `public` schema from the `public` role is as follows:

```sql
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
```

You must be the owner of the `public` schema or a member of a role that authorizes you to execute this SQL statement.

To restrict the `public` role’s capability to connect to a database, use this statement:

```sql
REVOKE ALL ON DATABASE <database> FROM PUBLIC;
```

This ensures users are unable to connect to a database by default unless this permission is explicitly granted.

## More information

For more information about granting privileges in Postgres, please see the [GRANT](https://www.postgresql.org/docs/current/sql-grant.html) command in the _PostgreSQL documentation_.

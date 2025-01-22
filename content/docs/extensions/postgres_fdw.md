---
title: The postgres_fdw extension
subtitle: Access data in remote Postgres databases from Neon using postgres_fdw
tag: new
enableTableOfContents: true
updatedOn: '2024-11-08T10:00:00.000Z'
---

The `postgres_fdw` (Foreign Data Wrapper) extension provides a powerful and standards-compliant way to access data stored in external Postgres databases from your Neon project. For compliance or regulatory reasons, you might need to keep sensitive data on-premises or within a specific jurisdiction; `postgres_fdw` lets you query this data directly from your Neon database without migrating it, maintaining data residency. This enables you to leverage Neon's features while adhering to data storage policies. This simplifies data integration, enables cross-database querying, and allows you to build applications that seamlessly interact with data across different Postgres deployments.

<CTA />

This guide will walk you through the essentials of using the `postgres_fdw` extension in Neon. You'll learn how to enable the extension, establish connections to remote PostgreSQL servers, define foreign tables that map to tables on those servers, and execute queries that span across your Neon database and remote instances. We will also cover important considerations for performance and security when working with `postgres_fdw`.

<Admonition type="note">
`postgres_fdw` is a core PostgreSQL extension that can be installed on any Neon project using the instructions below. It provides a standardized way to access external Postgres databases and is widely used for data integration and cross-database querying.
</Admonition>

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Enable the `postgres_fdw` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS postgres_fdw;
```

## Key concepts

Before diving into the practical steps, let's understand the key components involved in using `postgres_fdw`:

- **Foreign server:** Represents the connection details to the external PostgreSQL server. This includes information like the host, port, and database name of the remote server.
- **User mapping:** Defines the authentication credentials used to connect to the foreign server. This maps a local Neon user to a user on the remote server.
- **Foreign table:** A locally defined object in your Neon database that represents a table located on the foreign server. Queries against the foreign table are transparently executed on the remote server.

## Connecting to a remote Postgres database

The process of connecting to a remote Postgres database involves two main steps: creating a foreign server and setting up a user mapping.

### Create a foreign server

The `CREATE SERVER` command is used to define the connection parameters for the remote PostgreSQL server.

```sql
CREATE SERVER my_remote_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host '<remote_host>', port '<remote_port>', dbname '<remote_database>');
```

Replace the placeholders with the actual details of your remote PostgreSQL server:

- `<remote_host>`: The hostname or IP address of the remote server.
- `<remote_port>`: The port number the remote PostgreSQL server is listening on (usually 5432).
- `<remote_database>`: The name of the database on the remote server you want to access.

For example:

```sql
CREATE SERVER production_db
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'db.example.com', port '5432', dbname 'analytics');
```

### Create a user mapping

The `CREATE USER MAPPING` command specifies the credentials to use when connecting to the foreign server. This maps a user in your Neon database to a user on the remote server.

```sql
CREATE USER MAPPING FOR <neon_user>
SERVER my_remote_server
OPTIONS (user '<remote_user>', password '<remote_password>');
```

Replace the placeholders with the appropriate values:

- `<neon_user>`: The username of the user in your Neon database that will be accessing the foreign server. Use `PUBLIC` if you want to allow all users to access the foreign server with the same credentials.
- `my_remote_server`: The name of the foreign server you created in the previous step.
- `<remote_user>`: The username on the remote PostgreSQL server.
- `<remote_password>`: The password for the remote user.

For example, to map the current Neon user to the `read_only_user` user on the `production_db` server:

```sql
CREATE USER MAPPING FOR CURRENT_USER
SERVER production_db
OPTIONS (user 'read_only_user', password 'secure_password');
```

## Defining foreign tables

Once the connection to the remote server is established, you need to define foreign tables in your Neon database that correspond to the tables you want to access on the remote server. There are two primary ways to do this: creating foreign tables manually or importing the schema.

### Create foreign tables manually

The `CREATE FOREIGN TABLE` command allows you to explicitly define the structure of a remote table in your Neon database. You need to specify the column names and data types, which must match the remote table's schema.

```sql
CREATE FOREIGN TABLE <local_table_name> (
    <column1_name> <data_type>,
    <column2_name> <data_type>,
    ...
)
SERVER my_remote_server
OPTIONS (schema_name '<remote_schema>', table_name '<remote_table>');
```

Replace the placeholders with the appropriate details:

- `<local_table_name>`: The name you want to give the foreign table in your Neon database.
- `<column_name>` and `<data_type>`: The names and data types of the columns, matching the remote table.
- `my_remote_server`: The name of the foreign server you created.
- `<remote_schema>`: The schema name where the table resides on the remote server (often `public`).
- `<remote_table>`: The name of the table on the remote server.

For example, to create a foreign table named `remote_users` that maps to the `users` table in the `public` schema of the `production_db` server:

```sql
CREATE FOREIGN TABLE remote_users (
    id integer,
    username text,
    email text,
    created_at timestamp with time zone
)
SERVER production_db
OPTIONS (schema_name 'public', table_name 'users');
```

### Import foreign schema

The `IMPORT FOREIGN SCHEMA` command provides a convenient way to automatically create foreign tables for all or a subset of tables within a schema on the remote server.

```sql
IMPORT FOREIGN SCHEMA <remote_schema>
FROM SERVER my_remote_server
INTO <local_schema>;
```

- `<remote_schema>`: The name of the schema on the remote server you want to import.
- `my_remote_server`: The name of the foreign server.
- `<local_schema>`: The schema in your Neon database where the foreign tables will be created. If the schema doesn't exist, you'll need to create it first.

For example, to import all tables from the `analytics` schema of the `production_db` server into a local schema named `imported_data`:

```sql
CREATE SCHEMA IF NOT EXISTS imported_data;
IMPORT FOREIGN SCHEMA analytics
FROM SERVER production_db
INTO imported_data;
```

You can also selectively import tables using the `LIMIT TO` or `EXCEPT` clauses:

**Import specific tables:**

```sql
IMPORT FOREIGN SCHEMA analytics
LIMIT TO (users, products)
FROM SERVER production_db
INTO imported_data;
```

**Import all tables except specific ones:**

```sql
IMPORT FOREIGN SCHEMA analytics
EXCEPT (staging_table, temporary_data)
FROM SERVER production_db
INTO imported_data;
```

## Querying foreign tables

Once foreign tables are defined, you can query them using standard SQL `SELECT` statements, just like regular local tables. The `postgres_fdw` extension handles the communication with the remote server and retrieves the data transparently.

To select all the users from the `remote_users` table:

```sql
SELECT * FROM remote_users WHERE created_at > NOW() - INTERVAL '1 week';
```

You can perform joins between local tables and foreign tables, aggregate data from remote sources, and use any other SQL features supported by PostgreSQL.

```sql
SELECT r.username, o.order_id, o.order_date
FROM remote_users r
JOIN imported_data.orders o ON r.id = o.user_id
WHERE o.order_date > '2025-01-01';
```

## Modifying data in foreign tables

`postgres_fdw` also supports data modification operations on foreign tables, including `INSERT`, `UPDATE`, and `DELETE`. However, it's important to understand the limitations and potential performance implications.

**Inserting Data:**

```sql
INSERT INTO remote_users (id, username, email) VALUES (101, 'newuser', 'new@example.com');
```

**Updating Data:**

```sql
UPDATE remote_users SET email = 'updated@example.com' WHERE id = 101;
```

**Deleting Data:**

```sql
DELETE FROM remote_users WHERE id = 101;
```

<Admonition type="note">
`postgres_fdw` currently lacks full support for `INSERT` statements with an `ON CONFLICT DO UPDATE` clause. However, the `ON CONFLICT DO NOTHING` clause is supported.
</Admonition>

## Optimizing queries with `postgres_fdw`

Querying foreign tables can sometimes be slower than querying local tables due to network latency and the overhead of communicating with the remote server. Here are some strategies to optimize performance:

- **`use_remote_estimate`:** You can instruct `postgres_fdw` to request cost estimates from the remote server. This can help the query planner make better decisions, especially for complex queries. Set this option at the server or table level:

  ```sql
  ALTER SERVER production_db OPTIONS (ADD use_remote_estimate 'true');
  ALTER FOREIGN TABLE remote_users OPTIONS (ADD use_remote_estimate 'true');
  ```

- **`ANALYZE` Foreign Tables:** Running `ANALYZE` on foreign tables collects statistics about the remote data and stores them locally. This helps the query planner generate more efficient execution plans. However, remember that these statistics can become stale if the remote data changes frequently.

  ```sql
  ANALYZE remote_users;
  ```

- **Materialized Views:** For frequently accessed data from foreign tables, consider creating materialized views in your Neon database. Materialized views store a snapshot of the remote data locally, which can significantly improve query performance. You can refresh materialized views periodically to keep the data relatively up-to-date.

  ```sql
  CREATE MATERIALIZED VIEW local_users_snapshot AS
  SELECT * FROM remote_users WHERE created_at > NOW() - INTERVAL '1 month';

  REFRESH MATERIALIZED VIEW local_users_snapshot;
  ```

- **Filtering and Projections:** When querying foreign tables, try to apply filters (`WHERE` clause) and select only the necessary columns to reduce the amount of data transferred over the network.

## Advanced `postgres_fdw` functions

The `postgres_fdw` extension provides several utility functions to manage connections established with remote PostgreSQL servers. These functions allow you to monitor active connections and explicitly disconnect from foreign servers.

- **`postgres_fdw_get_connections()`:** This function provides insights into the active connections established by `postgres_fdw` from your current Neon session to remote servers. It returns a set of records, with each record containing the foreign server name and a boolean indicating the validity of the connection. A connection is considered invalid if the foreign server or user mapping associated with it has been changed or dropped while the connection is being used in the current transaction. Invalid connections will be closed at the end of the transaction.

  ```sql
  SELECT * FROM postgres_fdw_get_connections() ORDER BY server_name;
  ```

  The output will resemble:

  ```text
   server_name | valid
  -------------+-------
   production_db   | t
   staging_db      | f
  (2 rows)
  ```

  In this example, there are two open connections. The connection to `production_db` is valid (`t`), while the connection to `staging_db` is invalid (`f`), likely due to a change on the remote server or user mapping.

- **`postgres_fdw_disconnect(server_name text)`:** This function allows you to explicitly close open connections established by `postgres_fdw` to a specific foreign server. It takes the name of the foreign server as an argument. Note that if there are multiple connections to the same server using different user mappings, this function will attempt to disconnect all of them. If any of the connections to the specified server are currently in use within the ongoing transaction, they will not be disconnected, and warning messages will be issued. The function returns `true` if at least one connection was successfully disconnected and `false` otherwise. An error is raised if no foreign server with the given name is found.

  ```sql
  SELECT postgres_fdw_disconnect('staging_db');
  ```

  The output will be:

  ```text
   postgres_fdw_disconnect
  -------------------------
   t
  (1 row)
  ```

- **`postgres_fdw_disconnect_all()`:** This function provides a way to close all open connections established by `postgres_fdw` from your current Neon session to any foreign server. Similar to `postgres_fdw_disconnect`, connections in use within the current transaction will not be closed, and warnings will be generated. The function returns `true` if at least one connection was disconnected and `false` otherwise.

These functions offer greater control over `postgres_fdw` connections, allowing you to manage resources and ensure connections are closed when no longer needed. Using `postgres_fdw_get_connections` can be helpful for monitoring and troubleshooting connection issues, while the disconnect functions can be used for cleanup or in scenarios where you need to force a reconnection with updated credentials or server configurations.

## Security considerations

When working with `postgres_fdw`, security is paramount. Keep the following points in mind:

- **Network security:** Ensure that network access is properly configured to allow connections between your Neon project and the remote PostgreSQL server. Firewalls and security groups might need adjustments.
- **Principle of Least Privilege:** Grant only the necessary permissions to the user mapped to the remote database. Avoid using superuser accounts for `postgres_fdw` connections.
- **SSL encryption:** Ensure that the connection to the remote PostgreSQL server is encrypted using SSL. This is often the default behavior for PostgreSQL connections, but it's worth verifying the configuration.

## `postgres_fdw` vs. `dblink`

While both `postgres_fdw` and `dblink` allow you to connect to remote Postgres databases, `postgres_fdw` is generally the preferred choice for the following reasons:

- **SQL standards compliance:** `postgres_fdw` adheres more closely to SQL standards for accessing external data.
- **Performance:** `postgres_fdw` often provides better performance due to its more efficient implementation.
- **Feature set:** `postgres_fdw` offers a richer feature set, including support for data modification operations and more sophisticated query planning.
- **Maintainability:** Using a standardized approach like `postgres_fdw` can lead to more maintainable and portable code.

`dblink` might be suitable for simple, one-off tasks, but for robust and scalable integration with remote Postgres databases, `postgres_fdw` is the recommended solution.

## Conclusion

The `postgres_fdw` extension is a valuable tool for Neon users who need to access and integrate data from remote Postgres databases. By establishing connections to foreign servers, defining foreign tables, and executing queries that span across local and remote databases, you can build powerful applications that leverage data from multiple sources seamlessly.

## Reference

- [PostgreSQL Foreign Data Wrappers](https://www.postgresql.org/docs/current/postgres-fdw.html)
- [PostgreSQL `dblink` Documentation](https://www.postgresql.org/docs/current/dblink.html)

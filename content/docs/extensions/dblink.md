---
title: The dblink extension
subtitle: Connect to and query other PostgreSQL databases from Neon using dblink
enableTableOfContents: true
updatedOn: '2024-11-01T10:00:00.000Z'
---

The `dblink` extension provides the ability to connect to other PostgreSQL databases from within your current database. This is invaluable for tasks such as data integration, cross-database querying, and building applications that span multiple database instances. `dblink` allows you to execute queries on these remote databases and retrieve the results directly into your Neon project.

<CTA />

This guide will walk you through the fundamentals of using the `dblink` extension in your Neon project. You'll learn how to enable the extension, establish connections to remote PostgreSQL databases, execute queries against them, and retrieve the results. We'll explore different connection methods and discuss important considerations for using `dblink` effectively.

<Admonition type="note">
`dblink` is a core PostgreSQL extension and can be enabled on any Neon project. It allows direct connections to other PostgreSQL databases. For a more structured and potentially more secure way to access data in external data sources (including non-PostgreSQL databases), consider using [Foreign Data Wrappers](/docs/extensions/postgres-fdw).
</Admonition>

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Enable the `dblink` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS dblink;
```

## Connecting to a remote database

The `dblink` extension provides the `dblink_connect` function to establish connections to remote PostgreSQL databases. You can connect by providing the connection details directly in the function call or by using a named connection that you can reference in subsequent queries.

The most direct way to connect is by providing a connection string. This string includes all the necessary information to connect to the remote database.

### Named connections

To establish a named connection using `dblink_connect`, use the following syntax:

```sql
SELECT dblink_connect('my_remote_db', 'host=my_remote_host port=5432 dbname=my_remote_database user=my_remote_user password=my_remote_password sslmode=require');
```

In this example:

- `'my_remote_db'` is a name you assign to this connection for later use.
- The connection string specifies the host, port, database name, user, password, and SSL mode of the remote PostgreSQL instance. **Replace these placeholders with your actual remote database credentials.**
- `sslmode=require` is recommended for security to ensure an encrypted connection.

You should receive a response like:

```text
 dblink_connect
----------------
 OK
(1 row)
```

### Unnamed connections

You can also connect without naming the connection. This is useful for one-off queries or when you don't need to reference the connection in subsequent queries.

```sql
SELECT dblink_connect('host=my_remote_host port=5432 dbname=my_remote_database user=my_remote_user password=my_remote_password sslmode=require');
```

<Admonition type="tip" title="Did you know?">
Multiple named connections can be open at once, but only one unnamed connection is permitted at a time. The connection will persist until closed or until the database session is ended.
</Admonition>

## Executing queries on the remote database

Once a connection is established, you can use the `dblink` function to execute queries on the remote database.

### With Named connections

```sql
SELECT *
FROM dblink('my_remote_db', 'SELECT table_name FROM information_schema.tables WHERE table_schema = ''public''')
AS remote_tables(table_name TEXT);
```

In this example:

- `'my_remote_db'` refers to the connection name established earlier.
- `'SELECT table_name FROM information_schema.tables WHERE table_schema = 'public''` is the SQL query you want to execute on the remote database.
- `AS remote_tables(table_name TEXT)` defines the structure of the returned data, specifying the column name (`table_name`) and its data type (`TEXT`). **This is crucial as `dblink` needs to know the expected structure of the results.**

You should receive a list of tables from the `public` schema of the remote database.

### With Unnamed connections

When using an unnamed connection, you can execute queries directly without referencing a named connection.

```sql
SELECT *
FROM dblink('host=my_remote_host port=5432 dbname=my_remote_database user=my_remote_user password=my_remote_password sslmode=require',
            'SELECT table_name FROM information_schema.tables WHERE table_schema = ''public''')
AS remote_tables(table_name TEXT);
```

## Retrieving data from the remote database

The results of the remote query are returned as a set of rows. You can use standard SQL to further process or integrate this data within your Neon database.

```sql
SELECT rt.table_name
FROM dblink('my_remote_db', 'SELECT table_name FROM information_schema.tables WHERE table_schema = ''public''')
AS rt(table_name TEXT)
WHERE rt.table_name LIKE 'user%';
```

This query retrieves the names of tables in the remote database that start with "user".

```sql
SELECT *
FROM dblink('my_remote_db', 'SELECT id, user_id, task, is_complete, inserted_at FROM todos')
AS rows(id int, user_id TEXT, task TEXT, is_complete BOOLEAN, inserted_at text);
```

This query retrieves the rows from a `todos` table in the remote database.

## Closing connections

It's good practice to close connections when you're finished with them to free up resources. Use the `dblink_disconnect` function.

```sql
SELECT dblink_disconnect('my_remote_db');
```

To disconnect from an unnamed connection, you can use the following:

```sql
SELECT dblink_disconnect();
```

## Using Named Connections for convenience

Naming your connections with `dblink_connect` can simplify your queries, especially if you frequently access the same remote database.

```sql
-- Connect with a name
SELECT dblink_connect('production_db', 'host=prod_host port=5432 dbname=prod_data user=reporter password=securepass sslmode=require');

-- Execute queries using the named connection
SELECT * FROM dblink('production_db', 'SELECT count(*) FROM orders') AS order_count(count int);

-- Disconnect
SELECT dblink_disconnect('production_db');
```

## Practical Examples

### Data Synchronization:

You can use `dblink` to periodically pull data from a remote database into your Neon project for reporting or analysis.

```sql
-- Using dblink to insert data from a remote table
INSERT INTO local_staging_table (col1, col2)
SELECT remote_col1, remote_col2
FROM dblink('remote_db', 'SELECT col1, col2 FROM remote_table')
AS rt(remote_col1 INTEGER, remote_col2 TEXT);
```

### Cross-Database reporting:

Generate reports that combine data from your Neon database and one or more remote PostgreSQL databases.

```sql
SELECT l.customer_name, r.order_total
FROM customers l
JOIN dblink('orders_db', 'SELECT customer_id, sum(amount) AS order_total FROM orders GROUP BY customer_id')
AS r(customer_id INTEGER, order_total NUMERIC) ON l.customer_id = r.customer_id;
```

## Advanced `dblink` functions

The `dblink` extension provides additional functions to help manage and interact with remote databases:

- **`dblink_get_connections()`:** This function is helpful for monitoring and managing your `dblink` connections. It returns a list of the names of all currently open, named `dblink` connections in the current session. This can be useful for troubleshooting or ensuring connections are being managed correctly.
  <CodeTabs labels={["SQL", "bash"]}>

  ```sql
  SELECT * FROM dblink_get_connections();
  ```

  ```bash
  dblink_get_connections
  ------------------
  {my_remote_db}
  ```

  </CodeTabs>

- **`dblink_error_message(TEXT connname)`:** When working with remote databases, errors can occur. This function allows you to retrieve the last error message associated with a specific named `dblink` connection. This is invaluable for debugging issues that arise during remote queries.

- **`dblink_send_query(TEXT connname, text sql)`:** This function sends a query to a named `dblink` connection without waiting for the result. This is useful for executing long-running queries on the remote database without blocking the current session. The return value is 1 if the query was successfully dispatched, or 0 otherwise.

- **`dblink_get_result(TEXT connname)`:** This function retrieves the result of a query that was previously sent using `dblink_send_query`. It returns the result set as a set of rows, allowing you to process the data as needed.

- **`dblink_cancel_query(TEXT connname)`:** This function tries to cancel the currently executing query on a named `dblink` connection. This can be useful if you need to stop a long-running query that is consuming resources on the remote database. The return value is 'OK' if the query was successfully canceled, or the error message as a text otherwise.

## Security considerations

- **Credentials:** Using `dblink` is inherently less secure than other methods of accessing remote data, as it requires storing credentials in the connection strings. For this reason, it may be preferable to use Foreign Data Wrappers or other secure methods.
- **Network Security:** Ensure that network access is properly configured to allow connections between your Neon project and the remote database server. Firewalls and security groups might need adjustments.
- **`sslmode`:** Always use `sslmode=require` in your connection strings to encrypt communication.
- **Principle of Least Privilege:** Grant only the necessary permissions to the `dblink` connecting user on the remote database.

## Better alternatives: Foreign Data Wrappers

While `dblink` provides direct connectivity, PostgreSQL's Foreign Data Wrappers (FDW) offer a more integrated and often more manageable approach for accessing external data. The `postgres_fdw` allows you to define a _foreign server_ and _foreign tables_ that represent tables in the remote database. You can learn more about FDWs in our [postgres_fdw](/docs/extensions/postgres_fdw) guide.

## Conclusion

The `dblink` extension provides a powerful mechanism for connecting to and querying remote PostgreSQL databases from your Neon project. Whether you need to perform one-off data pulls or build complex cross-database applications, `dblink` offers the flexibility to execute arbitrary queries on remote instances. Remember to prioritize security when managing connections and credentials. For more structured and potentially more secure access, consider exploring the capabilities of Foreign Data Wrappers.

## Reference

- [PostgreSQL `dblink` Documentation](https://www.postgresql.org/docs/current/dblink.html)
- [PostgreSQL Foreign Data Wrappers](https://www.postgresql.org/docs/current/postgres-fdw.html)

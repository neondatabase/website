---
title: 'Connect to a PostgreSQL Database Server'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/
ogImage: ./img/wp-content-uploads-2019-05-pgAdmin-4.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to **connect to the PostgreSQL Database Server** via an interactive terminal program called **psql** and via the **pgAdmin** application.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When you [install the PostgreSQL database server](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/ "Install PostgreSQL"), the PostgreSQL installer will also install some useful tools for working with the PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this tutorial, you will learn how to connect to the PostgreSQL server via the following tools:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `psql`- a terminal-based utility to connect to the PostgreSQL server.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `pgAdmin` - a web-based tool to connect to the PostgreSQL server.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## 1) Connect to PostgreSQL database server using psql

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `psql` is an interactive terminal program provided by PostgreSQL. It allows you to interact with the PostgreSQL server such as executing SQL statements and managing database objects.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following steps show you how to connect to the PostgreSQL database server via the `psql` program:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, open the Command Prompt on Windows or Terminal on Unix-like systems.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, use the `psql` command to connect to the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this command:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `psql`: Invoke the psql program.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `-U postgres`: Specify the user that connects to the PostgreSQL server. The `-U` option means user. Note that you need to use `-U` in uppercase, not lowercase.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The command will prompt you to enter the password for the `postgres` user:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
Password for user postgres:
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You need to provide the password for the `postgres` user and press Enter (or Return key). Note that the password is the one that you provided when installing the PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

After entering the password correctly, you'll connected to the PostgreSQL server. The command prompt will change to something like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
postgres=#
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this command, `postgres` is the default database of a PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Connecting to the PostgreSQL server will grant you a session. A session is log-lived, allowing you to perform many requests such as executing commands, before eventually disconnecting.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, execute the following command to retrieve the PostgreSQL version:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT version();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Please ensure to conclude the statement with a semicolon (`;`). Upon pressing **Enter**, `psql` will return the current PostgreSQL version on your system.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The output will look like:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
                          version
------------------------------------------------------------
 PostgreSQL 16.1, compiled by Visual C++ build 1937, 64-bit
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To show the current database, you can use the following command:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT current_database();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 current_database
------------------
 postgres
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To show the IP address and port of the current connection, you can execute the following command:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  inet_server_addr(),
  inet_server_port();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 inet_server_addr | inet_server_port
------------------+------------------
 127.0.0.1        |             5432
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## 2) Connect to PostgreSQL database server using pgAdmin

<!-- /wp:heading -->

<!-- wp:paragraph -->

The second way to connect to a database is by using a pgAdmin application.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The pgAdmin application allows you to interact with the PostgreSQL database server via an intuitive user interface.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates how to connect to a database using the pgAdmin application:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, launch the pgAdmin application from the Start menu

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The pgAdmin application will launch on the web browser as shown in the following picture:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4068} -->

![](./img/wp-content-uploads-2019-05-pgAdmin-4.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Second, right-click the Servers node and select **Register > Server...** menu to create a server

<!-- /wp:paragraph -->

<!-- wp:image {"id":6344,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Third, enter the server name such as `Local`, and click the **Connection** tab:

<!-- /wp:paragraph -->

<!-- wp:image {"id":6345,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4-server-name.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Fourth, enter the host and password for the `postgres` user and click the **Save** button:

<!-- /wp:paragraph -->

<!-- wp:image {"id":6346,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4-connection.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Fifth, click on the `Servers` node to expand the server. By default, PostgreSQL has a database named `postgres`:

<!-- /wp:paragraph -->

<!-- wp:image {"id":6347,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4-databases.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Sixth, open the query tool by selecting the menu item **Tool > Query Tool**:

<!-- /wp:paragraph -->

<!-- wp:image {"id":6348,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4-query-tool.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Seventh, enter the query in the **Query Editor** and click the **Execute** button, you will see the result of the query displayed in the **Data Output** tab:

<!-- /wp:paragraph -->

<!-- wp:image {"id":6349,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4-execute-query.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Connect to PostgreSQL Server from other applications

<!-- /wp:heading -->

<!-- wp:paragraph -->

Any application that supports ODBC or [JDBC](https://www.postgresqltutorial.com/postgresql-jdbc/) can connect to the PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Furthermore, if you develop an application that uses a specific driver, it can connect to the PostgreSQL database server:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Connect to PostgreSQL from PHP](https://www.postgresqltutorial.com/postgresql-php/connect/)
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Connect to PostgreSQL from Python](https://www.postgresqltutorial.com/postgresql-python/connect/)
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Connect to PostgreSQL from Java](https://www.postgresqltutorial.com/postgresql-jdbc/connecting-to-postgresql-database/)
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

In this tutorial, you've learned how to connect to the PostgreSQL database server by using various client tools, including psql and pgAdmin.

<!-- /wp:paragraph -->

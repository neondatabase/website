---
title: 'Connect to a PostgreSQL Database Server'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/
ogImage: ./img/wp-content-uploads-2019-05-pgAdmin-4.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to **connect to the PostgreSQL Database Server** via an interactive terminal program called **psql** and via the **pgAdmin** application.





When you [install the PostgreSQL database server](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/ "Install PostgreSQL"), the PostgreSQL installer will also install some useful tools for working with the PostgreSQL server.





In this tutorial, you will learn how to connect to the PostgreSQL server via the following tools:





- 
- `psql`- a terminal-based utility to connect to the PostgreSQL server.
- 
-
- 
- `pgAdmin` - a web-based tool to connect to the PostgreSQL server.
- 





## 1) Connect to PostgreSQL database server using psql





The `psql` is an interactive terminal program provided by PostgreSQL. It allows you to interact with the PostgreSQL server such as executing SQL statements and managing database objects.





The following steps show you how to connect to the PostgreSQL database server via the `psql` program:





First, open the Command Prompt on Windows or Terminal on Unix-like systems.





Second, use the `psql` command to connect to the PostgreSQL server:





```
psql -U postgres
```





In this command:





- 
- `psql`: Invoke the psql program.
- 
-
- 
- `-U postgres`: Specify the user that connects to the PostgreSQL server. The `-U` option means user. Note that you need to use `-U` in uppercase, not lowercase.
- 





The command will prompt you to enter the password for the `postgres` user:





```
Password for user postgres:
```





You need to provide the password for the `postgres` user and press Enter (or Return key). Note that the password is the one that you provided when installing the PostgreSQL server.





After entering the password correctly, you'll connected to the PostgreSQL server. The command prompt will change to something like this:





```
postgres=#
```





In this command, `postgres` is the default database of a PostgreSQL server.





Connecting to the PostgreSQL server will grant you a session. A session is log-lived, allowing you to perform many requests such as executing commands, before eventually disconnecting.





Third, execute the following command to retrieve the PostgreSQL version:





```
SELECT version();
```





Please ensure to conclude the statement with a semicolon (`;`). Upon pressing **Enter**, `psql` will return the current PostgreSQL version on your system.





The output will look like:





```
                          version
------------------------------------------------------------
 PostgreSQL 16.1, compiled by Visual C++ build 1937, 64-bit
(1 row)
```





To show the current database, you can use the following command:





```
SELECT current_database();
```





Output:





```
 current_database
------------------
 postgres
(1 row)
```





To show the IP address and port of the current connection, you can execute the following command:





```
SELECT
  inet_server_addr(),
  inet_server_port();
```





Output:





```
 inet_server_addr | inet_server_port
------------------+------------------
 127.0.0.1        |             5432
(1 row)
```





## 2) Connect to PostgreSQL database server using pgAdmin





The second way to connect to a database is by using a pgAdmin application.





The pgAdmin application allows you to interact with the PostgreSQL database server via an intuitive user interface.





The following illustrates how to connect to a database using the pgAdmin application:





First, launch the pgAdmin application from the Start menu





The pgAdmin application will launch on the web browser as shown in the following picture:





![](./img/wp-content-uploads-2019-05-pgAdmin-4.png)





Second, right-click the Servers node and select **Register > Server...** menu to create a server





![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4.png)





Third, enter the server name such as `Local`, and click the **Connection** tab:





![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4-server-name.png)





Fourth, enter the host and password for the `postgres` user and click the **Save** button:





![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4-connection.png)





Fifth, click on the `Servers` node to expand the server. By default, PostgreSQL has a database named `postgres`:





![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4-databases.png)





Sixth, open the query tool by selecting the menu item **Tool > Query Tool**:





![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4-query-tool.png)





Seventh, enter the query in the **Query Editor** and click the **Execute** button, you will see the result of the query displayed in the **Data Output** tab:





![](./img/wp-content-uploads-2024-01-Connect-to-PostgreSQL-pgadmin4-execute-query.png)





## Connect to PostgreSQL Server from other applications





Any application that supports ODBC or [JDBC](https://www.postgresqltutorial.com/postgresql-jdbc/) can connect to the PostgreSQL server.





Furthermore, if you develop an application that uses a specific driver, it can connect to the PostgreSQL database server:





- 
- [Connect to PostgreSQL from PHP](https://www.postgresqltutorial.com/postgresql-php/connect/)
- 
-
- 
- [Connect to PostgreSQL from Python](https://www.postgresqltutorial.com/postgresql-python/connect/)
- 
-
- 
- [Connect to PostgreSQL from Java](https://www.postgresqltutorial.com/postgresql-jdbc/connecting-to-postgresql-database/)
- 





In this tutorial, you've learned how to connect to the PostgreSQL database server by using various client tools, including psql and pgAdmin.



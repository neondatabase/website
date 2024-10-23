---
title: "PostgreSQL JDBC: Creating Tables"
page_title: "PostgreSQL JDBC: Creating Tables"
page_description: "In this tutorial, you will learn how to create tables in a PostgreSQL database from a Java program using JDBC."
prev_url: "https://www.postgresqltutorial.com/postgresql-jdbc/create-tables/"
ogImage: ""
updatedOn: "2024-02-02T04:56:46+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL JDBC: Connecting to PostgreSQL Databases"
  slug: "postgresql-jdbc/connecting-to-postgresql-database"
nextLink: 
  title: "PostgreSQL JDBC: Insert Data into a Table"
  slug: "postgresql-jdbc/insert"
---




**Summary**: in this tutorial, you will learn how to create tables in a PostgreSQL database from a Java program using JDBC.


## Creating table program

The following example shows how to create tables in the PostgreSQL database from a Java program:


```java
import java.sql.SQLException;

public class Main {
    public static void main(String[] args) {

        var sql = "CREATE TABLE products (" +
                "    id SERIAL PRIMARY KEY," +
                "    name VARCHAR(255) NOT NULL," +
                "    price DECIMAL(10, 2) NOT NULL" +
                ");";
        try (var conn =  DB.connect();
             var stmt = conn.createStatement()) {
            stmt.executeUpdate(sql);
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
    }
}
```
How it works.

First, construct a `CREATE TABLE` statement that creates the `products` table:


```java
var sql = "CREATE TABLE products (" +
            "    id SERIAL PRIMARY KEY," +
            "    name VARCHAR(255) NOT NULL," +
            "    price DECIMAL(10, 2) NOT NULL" +
            ");";
```
Second, [establish a connection](connecting-to-postgresql-database) to `sales` database on the local PostgreSQL server using the `DB` class:


```java
var conn =  DB.connect();
```
Third, create a `Statement` by calling the `createStatement()` method of the `Connection` object:


```java
var stmt = conn.createStatement()
```
Fourth, execute the `CREATE` `TABLE` statement by calling the `executeUpdate()` method.


```java
stmt.executeUpdate(sql);
```
The try\-catch statement will display an error message if any `SQLException` occurs.

Since the `connect()` and `createStatement()` method calls are wrapped in a try\-with\-resources statement, the `Statement` and `Connection` will be closed properly.

If you run the program, it’ll create the `products` in the `sales` database.


## Verify the table creation

First, open the Command Prompt on Windows or Terminal on Unix\-like systems.

Second, connect to the `sales` database on the local PostgreSQL server using the `psql` client tool:


```java
psql -U postgres -d sales
```
It’ll prompt you for a password.

Third, use the `\dt` command to [show tables](../postgresql-administration/postgresql-show-tables) in the `sales` database:


```java
\dt
```
Output:


```java
          List of relations
 Schema |   Name   | Type  |  Owner
--------+----------+-------+----------
 public | products | table | postgres
(1 row)
```
The output indicates that the `products` table has been created successfully.


## Summary

* Call the `executeUpdate()` method of a Statement object to execute a `CREATE TABLE` statement to create a new table in the PostgreSQL database.


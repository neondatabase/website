---
title: "PostgreSQL JDBC: Delete Data from Table"
page_title: "PostgreSQL JDBC: Delete Data from Table"
page_description: "In this tutorial, you will learn how to delete data from a table in the PostgreSQL database using JDBC."
prev_url: "https://www.postgresqltutorial.com/postgresql-jdbc/delete/"
ogImage: ""
updatedOn: "2024-02-02T04:58:33+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL JDBC: Updating Data"
  slug: "postgresql-jdbc/update"
nextLink: 
  title: "PostgreSQL JDBC: Call Stored Functions"
  slug: "postgresql-jdbc/call-postgresql-stored-function"
---




**Summary**: in this tutorial, you will learn how to delete data from a table in the PostgreSQL database using JDBC.


## Steps for deleting data from a table in JDBC

To delete data from a Java program, you follow these steps:

* [Establish a database connection to PostgreSQL.](connecting-to-postgresql-database)
* Create a `PreparedStatement` object.
* Execute a [DELETE statement](../postgresql-tutorial/postgresql-delete).
* Close the database connection.


## Deleting data example

The following example adds a delete() function to the `ProductDB` class to delete a product by id:


```javasql
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ProductDB {
    public static int delete(int id) {
        var sql  = "DELETE FROM products WHERE id=?";

        try (var conn  = DB.connect();
             var pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            return pstmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return 0;
    }

    // ...
}
```
How it works.

First, construct a DELETE statement to delete a product from the products table specified by id:


```java
var sql  = "DELETE FROM products WHERE id=?";
```
Second, open a database connection and create a PreparedStatement object:


```java
try (var conn  = DB.connect();
     var pstmt = conn.prepareStatement(sql)) {
// ...
```
The try\-with\-resources statement will automatically close the statement and connection.

Third, bind the id to the statement:


```java
pstmt.setInt(1, id);
```
Fourth, execute the prepared statement and return the number of deleted rows:


```java
return pstmt.executeUpdate();
```
The following shows how to use the delete() method of the `ProductDB` class to delete a product with the id 1 from the database table:


```java
public class Main {
    public static void main(String[] args) {
        int deletedRows = ProductDB.delete(1);
        System.out.println("Deleted Rows: " + deletedRows);
    }
}
```
Output:


```plaintext
Deleted Rows: 1
```

## Verify the deletion

First, open the Command Prompt on Windows or Terminal on Linux and connect to the PostgreSQL server:


```
psql -U postgres -d sales
```
Second, retrieve the product with id 1 to verify the deletion:


```plaintext
SELECT * FROM products
WHERE id = 1;
```
Output:


```
 id | name | price
----+------+-------
(0 rows)
```
The result set is empty, meaning that the program deleted the product with id 1 successfully.


## Summary

* Use the `PreparedStatement` to delete data from a table using JDBC.


---
title: "PostgreSQL JDBC: Managing Transactions"
page_title: "PostgreSQL JDBC: Transactions"
page_description: "In this tutorial, you will learn how to manage transactions in PostgreSQL using JDBC API utilizing the commit() and rollback() methods."
prev_url: "https://www.postgresqltutorial.com/postgresql-jdbc/transaction/"
ogImage: ""
updatedOn: "2024-02-02T05:00:10+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL JDBC: Call Stored Functions"
  slug: "postgresql-jdbc/call-postgresql-stored-function"
next_page: 
  title: "PostgreSQL C#"
  slug: "postgresql-jdbc/../postgresql-csharp"
---




**Summary**: in this tutorial, you will learn how to manage PostgreSQL transactions in Java programs using JDBC.


## Steps for performing a PostgreSQL transaction in JDBC

The following are the steps for carrying out a transaction in JDBC:


### Step 1\. Establish a Connection

Use `DriverManager.getConnection(url, user, password)` to establish a connection to your PostgreSQL database.


```csssql
var connection = DriverManager.getConnection("jdbc:postgresql://your-database-host:your-database-port/your-database-name", "your-username", "your-password");
```
In this code, you need to replace `url`, `user`, and `password` with your actual database connection details.


### Step 2\. Disable Auto\-Commit

JDBC operates in auto\-commit mode by default, to manually control the transaction, you need to disable the auto\-commit mode using the `setAutoComit()` method as follows:


```sql
connection.setAutoCommit(false);
```

### Step 3\. Perform database operations

Perform a database transaction using `Statement` or `PreparedStatement` within the transaction:


```sql
var statement = connection.createStatement();
// execute the statement
// ...
```

### Step 4\. Commit the transaction

Commit the changes to the database permanently if all database operations within the transaction are successful using the `commit()` method of the `Connection` object:


```sql
connection.commit();
```

### Step 5\. Rollback on failure

Undo the changes to the database if an exception occurs during the transaction using the `rollback()` method:


```css
connection.rollback();
```

### Step 6\. Close resources

Close the `Connection`, `Statement`, and `ResultSet` (if applicable) to release resources.


```css
connection.close();
statement.close();
```
Note that if you use the try\-with\-resources, you don’t need to call the `close()` method explicitly to release resources.


### Step 7\. Exception handling

Handle exceptions appropriately using the `try...catch...finally` statement and perform a rollback in case of an exception to ensure data consistency:


```
try {
    // perform a database operation...
    connection.commit();
} catch (SQLException e) {
    connection.rollback();
    e.printStackTrace();
} finally {
    connection.close();
}
```

## Summary

* Use the `commit()` method to apply permanent changes to the database.
* Use the `rollback()` method to undo the changes.


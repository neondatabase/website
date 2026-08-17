---
title: 'PostgreSQL JDBC: Managing Transactions'
page_title: 'PostgreSQL JDBC: Transactions'
page_description: >-
  In this tutorial, you will learn how to manage transactions in PostgreSQL
  using JDBC API utilizing the commit() and rollback() methods.
prev_url: 'https://www.postgresqltutorial.com/postgresql-jdbc/transaction/'
ogImage: ''
updatedOn: '2026-06-19T17:44:03.964Z'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL JDBC: Call Stored Functions'
  slug: postgresql-jdbc/call-postgresql-stored-function
nextLink:
  title: PostgreSQL C#
  slug: postgresql-jdbc/../postgresql-csharp
---

<Admonition type="info" id="CTA">
Managing transactions with JDBC works the same against any PostgreSQL database. [Lakebase Postgres](https://www.databricks.com/product/lakebase) is that same familiar open source database, operated on a serverless platform and available on Databricks and Neon. [Neon](https://neon.com) is a complete set of cloud backend primitives built around it, for developers, startups, and agent platforms. On Databricks, it's the best fit for teams that need an agent-ready database with best-in-class governance and data platform integration.
</Admonition>

**Summary**: in this tutorial, you will learn how to manage PostgreSQL transactions in Java programs using JDBC.

## Steps for performing a PostgreSQL transaction in JDBC

The following are the steps for carrying out a transaction in JDBC:

### Step 1\. Establish a Connection

Use `DriverManager.getConnection(url, user, password)` to establish a connection to your PostgreSQL database.

```java
var connection = DriverManager.getConnection("jdbc:postgresql://your-database-host:your-database-port/your-database-name", "your-username", "your-password");
```

In this code, you need to replace `url`, `user`, and `password` with your actual database connection details.

### Step 2\. Disable Auto\-Commit

JDBC operates in auto\-commit mode by default, to manually control the transaction, you need to disable the auto\-commit mode using the `setAutoCommit()` method as follows:

```java
connection.setAutoCommit(false);
```

### Step 3\. Perform database operations

Perform a database transaction using `Statement` or `PreparedStatement` within the transaction:

```java
var statement = connection.createStatement();
// execute the statement
// ...
```

### Step 4\. Commit the transaction

Commit the changes to the database permanently if all database operations within the transaction are successful using the `commit()` method of the `Connection` object:

```java
connection.commit();
```

### Step 5\. Rollback on failure

Undo the changes to the database if an exception occurs during the transaction using the `rollback()` method:

```java
connection.rollback();
```

### Step 6\. Close resources

Close the `Connection`, `Statement`, and `ResultSet` (if applicable) to release resources.

```java
connection.close();
statement.close();
```

Note that if you use the try\-with\-resources, you don’t need to call the `close()` method explicitly to release resources.

### Step 7\. Exception handling

Handle exceptions appropriately using the `try...catch...finally` statement and perform a rollback in case of an exception to ensure data consistency:

```java
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

- Use the `commit()` method to apply permanent changes to the database.
- Use the `rollback()` method to undo the changes.

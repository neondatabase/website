---
title: 'PostgreSQL JDBC: Managing Transactions'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-jdbc/transaction/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to manage PostgreSQL transactions in Java programs using JDBC.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Steps for performing a PostgreSQL transaction in JDBC

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following are the steps for carrying out a transaction in JDBC:

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Step 1. Establish a Connection

<!-- /wp:heading -->

<!-- wp:paragraph -->

Use `DriverManager.getConnection(url, user, password)` to establish a connection to your PostgreSQL database.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
var connection = DriverManager.getConnection("jdbc:postgresql://your-database-host:your-database-port/your-database-name", "your-username", "your-password");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this code, you need to replace `url`, `user`, and `password` with your actual database connection details.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Step 2. Disable Auto-Commit

<!-- /wp:heading -->

<!-- wp:paragraph -->

JDBC operates in auto-commit mode by default, to manually control the transaction, you need to disable the auto-commit mode using the `setAutoComit()` method as follows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
connection.setAutoCommit(false);
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Step 3. Perform database operations

<!-- /wp:heading -->

<!-- wp:paragraph -->

Perform a database transaction using `Statement` or `PreparedStatement` within the transaction:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
var statement = connection.createStatement();
// execute the statement
// ...
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Step 4. Commit the transaction

<!-- /wp:heading -->

<!-- wp:paragraph -->

Commit the changes to the database permanently if all database operations within the transaction are successful using the `commit()` method of the `Connection` object:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
connection.commit();
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Step 5. Rollback on failure

<!-- /wp:heading -->

<!-- wp:paragraph -->

Undo the changes to the database if an exception occurs during the transaction using the `rollback()` method:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
connection.rollback();
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Step 6. Close resources

<!-- /wp:heading -->

<!-- wp:paragraph -->

Close the `Connection`, `Statement`, and `ResultSet` (if applicable) to release resources.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
connection.close();
statement.close();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that if you use the try-with-resources, you don't need to call the `close()` method explicitly to release resources.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Step 7. Exception handling

<!-- /wp:heading -->

<!-- wp:paragraph -->

Handle exceptions appropriately using the `try...catch...finally` statement and perform a rollback in case of an exception to ensure data consistency:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `commit()` method to apply permanent changes to the database.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `rollback()` method to undo the changes.
- <!-- /wp:list-item -->

<!-- /wp:list -->

---
title: 'PostgreSQL JDBC: Delete Data from Table'
redirectFrom: 
            - /docs/postgresql/postgresql-jdbc/delete
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to delete data from a table in the PostgreSQL database using JDBC.

## Steps for deleting data from a table in JDBC

To delete data from a Java program, you follow these steps:

- [Establish a database connection to PostgreSQL.](/docs/postgresql/postgresql-jdbc/connecting-to-postgresql-database)
- Create a `PreparedStatement` object.
- Execute a [DELETE statement](/docs/postgresql/postgresql-delete).
- Close the database connection.

## Deleting data example

The following example adds a delete() function to the `ProductDB` class to delete a product by id:

```
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

```
var sql  = "DELETE FROM products WHERE id=?";
```

Second, open a database connection and create a PreparedStatement object:

```
try (var conn  = DB.connect();
     var pstmt = conn.prepareStatement(sql)) {
// ...
```

The try-with-resources statement will automatically close the statement and connection.

Third, bind the id to the statement:

```
pstmt.setInt(1, id);
```

Fourth, execute the prepared statement and return the number of deleted rows:

```
return pstmt.executeUpdate();
```

The following shows how to use the delete() method of the `ProductDB` class to delete a product with the id 1 from the database table:

```
public class Main {
    public static void main(String[] args) {
        int deletedRows = ProductDB.delete(1);
        System.out.println("Deleted Rows: " + deletedRows);
    }
}
```

Output:

```
Deleted Rows: 1
```

## Verify the deletion

First, open the Command Prompt on Windows or Terminal on Linux and connect to the PostgreSQL server:

```
psql -U postgres -d sales
```

Second, retrieve the product with id 1 to verify the deletion:

```
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

- Use the `PreparedStatement` to delete data from a table using JDBC.

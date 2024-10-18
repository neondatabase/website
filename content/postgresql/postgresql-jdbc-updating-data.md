---
title: 'PostgreSQL JDBC: Updating Data'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-jdbc/update/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to update data in a PostgreSQL database using JDBC API.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Steps for updating data

<!-- /wp:heading -->

<!-- wp:paragraph -->

To update data in a table of a PostgreSQL database, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Create a database connection by instantiating a `Connection` object.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Create a `PreparedStatement` object.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Execute an [UPDATE statement](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/) by calling the `executeUpdate()` method of the `PreparedStatement` object.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Close the `PreparedStatement` and `Connection` objects by calling the `close()` method.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Updating data example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following defines the `update()` method that changes the `name` and `price` of a product specified by product id:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ProductDB {

    public static int update(int id, String name, double price) {
        var sql  = "UPDATE products "
                + "SET name = ?, price= ? "
                + "WHERE id = ?";

        int affectedRows = 0;

        try (var conn  = DB.connect();
             var pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, name);
            pstmt.setDouble(2, price);
            pstmt.setInt(3, id);

            affectedRows = pstmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return affectedRows;
    }

 // ...

}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, construct an `UPDATE` statement that updates the `name` and `price` of a product by id:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
 var sql  = "UPDATE products "
                + "SET name = ?, price= ? "
                + "WHERE id = ?";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, initialize a variable that stores the number of affected rows:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
int affectedRows = 0;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, establish a connection and create a `PreparedStatement` object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
try (var conn  = DB.connect();
     var pstmt = conn.prepareStatement(sql)) {
// ...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, bind values to the statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
pstmt.setString(1, name);
pstmt.setDouble(2, price);
pstmt.setInt(3, id);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, execute the statement and assign the return value of the `executeUpdate()` method to the `affectedRows` variable:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
affectedRows = pstmt.executeUpdate();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, return the number of affected rows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
return affectedRows;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following shows how to use the `ProductDB` class to update the name and price of the product:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
public class Main {
    public static void main(String[] args) {
        int updatedRows = ProductDB.update(1, "Phone Cover", 22.49);
        System.out.println("Updated Rows: " + updatedRows);
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
Updated Rows: 1
```

<!-- /wp:code -->

<!-- wp:heading -->

## Verify the update

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open the Command Prompt on Windows or Terminal on Linux and connect to the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
psql -U postgres -d sales
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, retrieve the product with id 1 to verify the update:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM products
WHERE id = 1;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use a `PreparedStatement` object to update data in a table from a Java program.
- <!-- /wp:list-item -->

<!-- /wp:list -->

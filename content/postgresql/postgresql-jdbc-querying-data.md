---
title: 'PostgreSQL JDBC: Querying Data'
redirectFrom: 
            - /postgresql/postgresql-jdbc/query
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to query data from a table in the PostgreSQL database using JDBC API.

## Steps for querying data

To query data from a table using JDBC, you follow these steps:

- [Establish a database connection](/postgresql/postgresql-jdbc/connecting-to-postgresql-database) to the PostgreSQL server.
- Create an instance of the `Statement` or `PreparedStatement` object.
- Execute a statement to get a `ResultSet` object.
- Process the `ResultSet` object.
- Close the `Statement` & `Connection` object by calling their `close()` method.

If you use the try-with-resources statement, you don't need to explicitly call the `close()` method of the `Statement` or `Connection` object. It will automatically close these objects.

### 1) Establishing a database connection

Use the `getConnection()` method of the `DriverManager` class to establish a connection to the PostgreSQL server.

```
return DriverManager.getConnection(url, user, password);
```

We'll use the `DB` class created in the [connecting to the PostgreSQL server](/postgresql/postgresql-jdbc/connecting-to-postgresql-database) to connect to the PostgreSQL server.

### 2) Creating a Statement object

In JDBC, a `Statement` object represents an SQL statement.

- First, create a `Statement` object from the `Connection` object.
- Then, execute the `Statement` object to get a `ResultSet` object that represents a database result set.

JDBC offers three types of `Statement` objects:

- `Statement`: use the Statement to implement a simple SQL statement that has no parameters.
- `PreparedStatement`: is the subclass of the `Statement` class, which allows you to bind parameters to the SQL statement.
- `CallableStatement`: extends the `PreparedStatement` class that can execute a stored procedure.

### 3) Executing a query

To execute a query, you use one of the following methods of the `Statement` object:

- `execute()`: Return true if the first object of the query is a `ResultSet` object. You can get the `ResultSet` by calling the method `getResultSet()`.
- `executeQuery()`: Return only one `ResultSet` object.
- `executeUpdate()`: Return the number of rows affected by the statement. Typically, you use this method for executing the [INSERT](/postgresql/postgresql-insert), [DELETE](/postgresql/postgresql-tutorial/postgresql-delete), or [UPDATE](/postgresql/postgresql-tutorial/postgresql-update) statement.

### 4) Processing the ResultSet

Once having a `ResultSet` object, you use a while loop to iterate over the result in the result set:

```
while (rs.next()) {
   // ...
}
```

### 5) Closing a database connection

To close a `Statement` or `Connection` object, you call the `close()` method explicitly in the `finally` clause of the `try...catch...finally` statement. This ensures that the resources are closed properly even if any exception occurs.

Starting from JDBC 4.1, you can use a try-with-resources statement to close `ResultSet`, `Statement`, and `Connection` objects automatically.

## Querying data examples

Let's explore some examples of querying data from a table using JDBC.

### 1) Querying all rows from the products table

Define a new function findAll() in the ProductDB class to retrieve all rows from the products table:

```
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ProductDB {

    public static List<Product> findAll() {
        var products = new ArrayList<Product>();

        var sql = "SELECT id, name, price FROM products ORDER BY name";

        try (var conn =  DB.connect();
             var stmt = conn.createStatement()) {

            var rs = stmt.executeQuery(sql);

            while (rs.next()) {
                var product = new Product(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getDouble("price"));
                products.add(product);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return products;
    }

    // ...
}
```

How it works.

First, initialize an `ArrayList` to store the returned products.

```
 var products = new ArrayList<Product>();
```

Second, construct a query that retrieves all rows from the `products` table:

```
var sql = "SELECT id, name, price FROM products ORDER BY name";
```

Third, open a database connection and create a `Statement` object:

```
try (var conn =  DB.connect();
     var stmt = conn.createStatement()) {
// ..
```

The try-with-resources will automatically close the `Statement` and `Connection` objects.

Fourth, execute the `SELECT` statement by calling the `executeQuery()` method:

```
var rs = stmt.executeQuery(sql);
```

Fifth, iterate over the result set, initialize the `Product` object, and add it to the `products` list:

```
while (rs.next()) {
    var product = new Product(
        rs.getInt("id"),
        rs.getString("name"),
        rs.getDouble("price")
    );
    products.add(product);
}
```

Finally, return the products list:

```
return products;
```

The following shows how to use the findAll() method of the ProductDB class to retrieve all data from the products table and display each in the standard output:

```
public class Main {
    public static void main(String[] args) {

        var products = ProductDB.findAll();
        for (var product:  products) {
            System.out.println(product);
        }

    }
}
```

Output:

```sql
Product{id=5, name='Bluetooth Headphones', price=199.0}
Product{id=8, name='Car Mount', price=29.98}
Product{id=1, name='Phone Case', price=19.99}
Product{id=6, name='Phone Stand', price=24.99}
Product{id=2, name='Power Bank', price=19.99}
Product{id=7, name='Ring Holder', price=39.99}
Product{id=3, name='Screen Protector', price=29.99}
Product{id=9, name='Selfie Stick', price=29.99}
Product{id=10, name='Smartwatch', price=399.97}
Product{id=4, name='Wireless Charger', price=35.99}
```

### 2) Querying data with parameters

The following defines a method called findById() to find the product by id:

```
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ProductDB {
     public static Product findById(int id){
        var sql = "SELECT id, name, price FROM products WHERE id=?";

        try (var conn =  DB.connect();
             var pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            var rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Product(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getDouble("price")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    // ...
}
```

How it works.

First, construct a SELECT that selects a product by id and use the question mark (?) as the placeholder:

```
var sql = "SELECT id, name, price FROM products WHERE id=?";
```

Second, open a connection to the database and create a `PreparedStatement` object:

```
try (var conn =  DB.connect();
     var pstmt = conn.prepareStatement(sql)) {
//...
```

Third, bind the id to the statement:

```
pstmt.setInt(1, id);
```

Fourth, execute the statement using the `executeQuery()` method of the PreparedStatement object:

```
var rs = pstmt.executeQuery();
```

Fifth, process the result set if the row with specified id exists and return the Product object:

```
if (rs.next()) {
    return new Product(
        rs.getInt("id"),
        rs.getString("name"),
        rs.getDouble("price")
    );
}
```

The following shows how to use the `findById()` in the `main()` method of the Main() class to retrieve the product with id 1 from the `products` table:

```
public class Main {
    public static void main(String[] args) {

        var p = ProductDB.findById(1);
        if(p != null){
            System.out.println(p);
        }
    }
}
```

Output:

```sql
Product{id=1, name='Phone Case', price=19.99}
```

## Summary

- Use the `executeQuery()` method of the `Statement` or `PreparedStatement` object to retrieve data from a table.

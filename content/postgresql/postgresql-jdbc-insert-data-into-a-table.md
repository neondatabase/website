---
title: 'PostgreSQL JDBC: Insert Data into a Table'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-jdbc/insert/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to insert data into a table in the PostgreSQL database using JDBC.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Inserting one row into a table

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `products` table from the `sales` database for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Defining a Product class

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following creates `Product.java` file and defines the `Product` class with three properties `id`, `name`, and `price`. These properties correspond to the columns in the `products` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
public class Product {
    private int id;
    private String name;
    private double price;

    public Product(int id, String name, double price){
        this(name,price);
        this.id = id;
    }

    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getId() { return id;  }

    public void setId(int id) { this.id = id; }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                '}';
    }
}
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Defining a ProductDB class

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following creates a new file called `ProductDB.java` and defines the `ProductDB` class:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

public class ProductDB {


    public static int add(Product product) {
        var sql = "INSERT INTO products(name, price) "
                + "VALUES(?,?)";

        try (var conn =  DB.connect();
             var pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            // bind the values
            pstmt.setString(1, product.getName());
            pstmt.setDouble(2, product.getPrice());

            // execute the INSERT statement and get the inserted id
            int insertedRow = pstmt.executeUpdate();
            if (insertedRow > 0) {
                var rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `add()` method inserts a new row into the `products` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, initialize an `INSERT` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
var sql = "INSERT INTO products(name,price) "
          + "VALUES(?,?)";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The question mark (`?`) is a placeholder that will be replaced by the actual values later.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, open a connection to the sales database on the local PostgreSQL server using the `DB` class:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
var conn =  DB.connect();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create a `PreparedStatement` object by calling the `preparedStatement()` method:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
var pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `Statement.RETURN_GENERATED_KEYS` argument instructs the `PreparedStatement` object to return the generated id key of the product.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fourth, bind the values to the statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
pstmt.setString(1, product.getName());
pstmt.setDouble(2, product.getPrice());
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Behind the scenes, the `PreparedStatement` will validate the values and bind them to the placeholders (?) accordingly.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fifth, execute the `INSERT` statement and return the number of inserted rows by calling the `executeUpdate()` method of the `PreparedStatement` object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
int insertedRow = pstmt.executeUpdate();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sixth, retrieve the inserted id and return it:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
if (insertedRow > 0) {
    var rs = pstmt.getGeneratedKeys();
    if (rs.next()) {
        return rs.getInt(1);
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If any `SQLException` occurs, display the detail of the exception in the catch block.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Since the Connection and `PreparedStatement` objects are created in the try-with-resources statement, they will be automatically closed.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Adding a product

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following `main()` method uses the `add()` method of the ProductDB class to insert a new row into the `products` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
public class Main {
    public static void main(String[] args) {
        int id = ProductDB.add(new Product("Phone Case", 19.99));
        System.out.println("Inserted id:" + id);
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you run the program, it'll show the following output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
Inserted id:1
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Verify the insert

<!-- /wp:heading -->

<!-- wp:paragraph -->

Connect to the `sales` database and retrieve the data from the `products` table to verify the insert:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM products;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
 id |    name    | price
----+------------+-------
  1 | Phone Case | 19.99
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Inserting multiple rows into a table

<!-- /wp:heading -->

<!-- wp:paragraph -->

Define a new method add() that accepts a list of `Product`objects and inserts them into the `products` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

public class ProductDB {

    public static void add(List<Product> products){
        var sql = "INSERT INTO products(name, price) "
                + "VALUES(?,?)";

        try (var conn =  DB.connect();
             var pstmt = conn.prepareStatement(sql)) {
             for (var product : products) {
                 pstmt.setString(1, product.getName());
                 pstmt.setDouble(2, product.getPrice());
                 pstmt.addBatch();
             }
             pstmt.executeBatch();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    // ...
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, initialize an `INSERT` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
var sql = "INSERT INTO products(name,price) "
          + "VALUES(?,?)";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, open a connection and create a `PreparedStatement` object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
try (var conn =  DB.connect();
     var pstmt = conn.prepareStatement(sql)) {
// ...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The try-with-resources statement ensures that the `PreparedStatement` and `Connection` objects will be closed automatically.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, iterate over the `Product` in the `Products` list, bind the values to the statement, and add the statement to a batch for insertion:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
for (var product : products) {
    pstmt.setString(1, product.getName());
    pstmt.setDouble(2, product.getPrice());
    pstmt.addBatch();
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, execute insert statements in batch by calling the `executeBatch()` method of the `PreparedStatement` object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
pstmt.executeBatch();
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Adding multiple products

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following shows how to use the `ProductDB` class to add multiple products to the `products` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {

        var products = new ArrayList<Product>();

        products.add(new Product("Power Bank",19.99));
        products.add(new Product("Screen Protector", 29.99));
        products.add(new Product("Wireless Charger", 35.99));
        products.add(new Product("Bluetooth Headphones", 199));
        products.add(new Product("Phone Stand", 24.99));
        products.add(new Product("Ring Holder", 39.99));
        products.add(new Product("Car Mount", 29.98));
        products.add(new Product("Selfie Stick", 29.99));
        products.add(new Product("Smartwatch", 399.97));

        ProductDB.add(products);
    }
}
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Verify the inserts

<!-- /wp:heading -->

<!-- wp:paragraph -->

Connect to the `sales` database and query data from the `products` table to verify the inserts:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
SELECT * FROM products;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |         name         | price
----+----------------------+--------
  1 | Phone Case           |  19.99
  2 | Power Bank           |  19.99
  3 | Screen Protector     |  29.99
  4 | Wireless Charger     |  35.99
  5 | Bluetooth Headphones | 199.00
  6 | Phone Stand          |  24.99
  7 | Ring Holder          |  39.99
  8 | Car Mount            |  29.98
  9 | Selfie Stick         |  29.99
 10 | Smartwatch           | 399.97
(10 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates the new `add()` method added nine rows to the `products` table successfully.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Call the `executeUpdate()` method of the `PreparedStatement` object to execute the `INSERT` statement to insert a new row into a table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `addBatch()` and the `executeBatch()` methods of the `PreparedStatement` object to execute batch inserts.
- <!-- /wp:list-item -->

<!-- /wp:list -->

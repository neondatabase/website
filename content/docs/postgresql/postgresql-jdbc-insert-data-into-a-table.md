---
title: 'PostgreSQL JDBC: Insert Data into a Table'
redirectFrom: 
            - /docs/postgresql/postgresql-jdbc/insert/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to insert data into a table in the PostgreSQL database using JDBC.





## Inserting one row into a table





We'll use the `products` table from the `sales` database for the demonstration.





### Defining a Product class





The following creates `Product.java` file and defines the `Product` class with three properties `id`, `name`, and `price`. These properties correspond to the columns in the `products` table:





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





### Defining a ProductDB class





The following creates a new file called `ProductDB.java` and defines the `ProductDB` class:





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





The `add()` method inserts a new row into the `products` table.





How it works.





First, initialize an `INSERT` statement:





```
var sql = "INSERT INTO products(name,price) "
          + "VALUES(?,?)";
```





The question mark (`?`) is a placeholder that will be replaced by the actual values later.





Second, open a connection to the sales database on the local PostgreSQL server using the `DB` class:





```
var conn =  DB.connect();
```





Third, create a `PreparedStatement` object by calling the `preparedStatement()` method:





```
var pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)
```





The `Statement.RETURN_GENERATED_KEYS` argument instructs the `PreparedStatement` object to return the generated id key of the product.





Fourth, bind the values to the statement:





```
pstmt.setString(1, product.getName());
pstmt.setDouble(2, product.getPrice());
```





Behind the scenes, the `PreparedStatement` will validate the values and bind them to the placeholders (?) accordingly.





Fifth, execute the `INSERT` statement and return the number of inserted rows by calling the `executeUpdate()` method of the `PreparedStatement` object:





```
int insertedRow = pstmt.executeUpdate();
```





Sixth, retrieve the inserted id and return it:





```
if (insertedRow > 0) {
    var rs = pstmt.getGeneratedKeys();
    if (rs.next()) {
        return rs.getInt(1);
    }
}
```





If any `SQLException` occurs, display the detail of the exception in the catch block.





Since the Connection and `PreparedStatement` objects are created in the try-with-resources statement, they will be automatically closed.





### Adding a product





The following `main()` method uses the `add()` method of the ProductDB class to insert a new row into the `products` table:





```
public class Main {
    public static void main(String[] args) {
        int id = ProductDB.add(new Product("Phone Case", 19.99));
        System.out.println("Inserted id:" + id);
    }
}
```





If you run the program, it'll show the following output:





```
Inserted id:1
```





### Verify the insert





Connect to the `sales` database and retrieve the data from the `products` table to verify the insert:





```
SELECT * FROM products;
```





Output:





```
 id |    name    | price
----+------------+-------
  1 | Phone Case | 19.99
(1 row)
```





## Inserting multiple rows into a table





Define a new method add() that accepts a list of `Product`objects and inserts them into the `products` table:





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





How it works.





First, initialize an `INSERT` statement:





```
var sql = "INSERT INTO products(name,price) "
          + "VALUES(?,?)";
```





Second, open a connection and create a `PreparedStatement` object:





```
try (var conn =  DB.connect();
     var pstmt = conn.prepareStatement(sql)) {
// ...
```





The try-with-resources statement ensures that the `PreparedStatement` and `Connection` objects will be closed automatically.





Third, iterate over the `Product` in the `Products` list, bind the values to the statement, and add the statement to a batch for insertion:





```
for (var product : products) {
    pstmt.setString(1, product.getName());
    pstmt.setDouble(2, product.getPrice());
    pstmt.addBatch();
}
```





Finally, execute insert statements in batch by calling the `executeBatch()` method of the `PreparedStatement` object:





```
pstmt.executeBatch();
```





### Adding multiple products





The following shows how to use the `ProductDB` class to add multiple products to the `products` table:





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





### Verify the inserts





Connect to the `sales` database and query data from the `products` table to verify the inserts:





```
SELECT * FROM products;
```





Output:





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





The output indicates the new `add()` method added nine rows to the `products` table successfully.





## Summary





- Call the `executeUpdate()` method of the `PreparedStatement` object to execute the `INSERT` statement to insert a new row into a table.
-
- Use the `addBatch()` and the `executeBatch()` methods of the `PreparedStatement` object to execute batch inserts.



---
title: 'PostgreSQL JDBC: Updating Data'
redirectFrom: 
            - /docs/postgresql/postgresql-jdbc/update/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to update data in a PostgreSQL database using JDBC API.





## Steps for updating data





To update data in a table of a PostgreSQL database, you follow these steps:





- 
- Create a database connection by instantiating a `Connection` object.
- 
-
- 
- Create a `PreparedStatement` object.
- 
-
- 
- Execute an [UPDATE statement](/docs/postgresql/postgresql-update) by calling the `executeUpdate()` method of the `PreparedStatement` object.
- 
-
- 
- Close the `PreparedStatement` and `Connection` objects by calling the `close()` method.
- 





## Updating data example





The following defines the `update()` method that changes the `name` and `price` of a product specified by product id:





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





How it works.





First, construct an `UPDATE` statement that updates the `name` and `price` of a product by id:





```
 var sql  = "UPDATE products "
                + "SET name = ?, price= ? "
                + "WHERE id = ?";
```





Second, initialize a variable that stores the number of affected rows:





```
int affectedRows = 0;
```





Third, establish a connection and create a `PreparedStatement` object:





```
try (var conn  = DB.connect();
     var pstmt = conn.prepareStatement(sql)) {
// ...
```





Fourth, bind values to the statement:





```
pstmt.setString(1, name);
pstmt.setDouble(2, price);
pstmt.setInt(3, id);
```





Fifth, execute the statement and assign the return value of the `executeUpdate()` method to the `affectedRows` variable:





```
affectedRows = pstmt.executeUpdate();
```





Finally, return the number of affected rows:





```
return affectedRows;
```





The following shows how to use the `ProductDB` class to update the name and price of the product:





```
public class Main {
    public static void main(String[] args) {
        int updatedRows = ProductDB.update(1, "Phone Cover", 22.49);
        System.out.println("Updated Rows: " + updatedRows);
    }
}
```





Output:





```
Updated Rows: 1
```





## Verify the update





First, open the Command Prompt on Windows or Terminal on Linux and connect to the PostgreSQL server:





```
psql -U postgres -d sales
```





Second, retrieve the product with id 1 to verify the update:





```
SELECT * FROM products
WHERE id = 1;
```





## Summary





- 
- Use a `PreparedStatement` object to update data in a table from a Java program.
- 



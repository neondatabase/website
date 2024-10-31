---
title: 'PostgreSQL JDBC: Call Stored Functions'
page_title: 'PostgreSQL JDBC: Call Stored Functions'
page_description: 'In this tutorial, you will learn how to call PostgreSQL stored functions using JDBC.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-jdbc/call-postgresql-stored-function/'
ogImage: ''
updatedOn: '2024-01-31T08:32:29+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL JDBC: Delete Data from Table'
  slug: 'postgresql-jdbc/delete'
nextLink:
  title: 'PostgreSQL JDBC: Managing Transactions'
  slug: 'postgresql-jdbc/transaction'
---

**Summary**: in this tutorial, you will learn how to call PostgreSQL stored functions using JDBC.

## Calling a built\-in stored function example

We will call a built\-in string function [`initcap()`](../postgresql-string-functions/postgresql-letter-case-functions) that capitalizes the first letter of each word in a string.

To call the `initcap()` function, you follow these steps:

- First, [establish a database connection](connecting-to-postgresql-database).
- Second, create a `CallableStatement` object by calling the `prepareCall()` method of the `Connection` object.
- Register `OUT` parameters if applicable.
- Bind values to the statement if applicable.
- Third, execute the function call and obtain the result.

The following example creates a new class named `Util` and defines a static method `properCase()` that calls the `initcap()` function in PostgreSQL:

```javasql
import java.sql.SQLException;
import java.sql.Types;

public class Util {
    public static String properCase(String s) {
        try (var conn = DB.connect();
             var stmt = conn.prepareCall("{ ? = call initcap( ? ) }")) {
            stmt.registerOutParameter(1, Types.VARCHAR);
            stmt.setString(2, s);
            stmt.execute();
            return stmt.getString(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

The following illustrates how to use the `properCase()` method of the `Util` class:

```pgsql
public class Main {
    public static void main(String[] args) {
        var greeting = Util.properCase("hello joe");
        System.out.println(greeting);
    }
}
```

Output:

```sql
Hello Joe
```

## Calling a stored function example

Let’s take an example of calling a stored function in PostgreSQL from a Java program using JDBC.

### Creating a stored function

First, open Command Prompt on Windows or Terminal on Unix\-like systems and connect to the sales database on your PostgreSQL server:

```
psql -U postgres -d sales
```

Second, create a function that finds the products by name based on a specified pattern:

```
create or replace function find_products (
	p_pattern varchar
)
returns table (
	p_id int,
	p_name varchar,
	p_price decimal
)
language plpgsql
as $$
declare
    var_r record;
begin
	for var_r in(
		select id, name, price
		from products
		where name ilike p_pattern
    )
	loop
		p_id := var_r.id;
		p_name := var_r.name;
		p_price := var_r.price;
        return next;
	end loop;
end; $$
```

Third, exit the psql:

```php
exit
```

### Calling a stored function

The following defines the `findByName()` method in the `ProductDB` class that calls the `find_products` stored function to find the products by names based on a pattern:

```java
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ProductDB {
    public static List<Product> findByName(String pattern) {
        String SQL = "SELECT * FROM find_products (?)";

        var products = new ArrayList<Product>();

        try (var conn = DB.connect();
             var pstmt = conn.prepareStatement(SQL)) {

            pstmt.setString(1, pattern);
            var rs = pstmt.executeQuery();

            while (rs.next()) {
                var product = new Product(
                        rs.getInt("p_id"),
                        rs.getString("p_name"),
                        rs.getDouble("p_price")
                );
                products.add(product);
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
        return products;
    }

// ...
}
```

The following uses the `findByName()` method of the `ProductDB` class to search for products with the name containing the string `"phone"`:

```java
public class Main {
    public static void main(String[] args) {

        var products = ProductDB.findByName("%phone%");

        for (var product: products) {
            System.out.println(product);
        }
    }
}
```

Output:

```
Product{id=5, name='Bluetooth Headphones', price=199.0}
Product{id=6, name='Phone Stand', price=24.99}
```

## Summary

- Use the `CallableStatement` to call a built\-in function from PostgreSQL.

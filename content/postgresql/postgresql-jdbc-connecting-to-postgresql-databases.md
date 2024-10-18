---
title: 'PostgreSQL JDBC: Connecting to PostgreSQL Databases'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-jdbc/connecting-to-postgresql-database/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to connect to the PostgreSQL database server from a Java program.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Creating a new database

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open the Command Prompt on Windows or the Terminal on Unix-like systems and connect to the local PostgreSQL database server using `psql` client tool:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, create a new database called `sales`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE DATABASE sales;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, exit the `psql`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
exit
```

<!-- /wp:code -->

<!-- wp:heading -->

## Setting up JDK

<!-- /wp:heading -->

<!-- wp:paragraph -->

Follow [this tutorial to install JDK](https://www.javazerotomastery.com/java-tutorial/install-jdk/) on your computer.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Installing IntelliJ IDE

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the IntelliJ IDE.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Downloading PostgreSQL JDBC Driver

<!-- /wp:heading -->

<!-- wp:paragraph -->

To connect to the PostgreSQL server from a Java program, you need a PostgreSQL JDBC driver.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

You can download the latest version of the driver on the [jdbc.postgresql.org download page](https://jdbc.postgresql.org/download/). The downloaded file is a jar file e.g., `postgresql-42.7.1.jar`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Creating a new project

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, launch the IntellJ IDE.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Next, create a new project called `sales`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Then, right-click the project name and choose the **Open Module Settings**.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

After that, choose the **Libraries** under **Project Settings **and click **New Project Library**.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Finally, select the PostgreSQL database driver file such as `postgresql-42.7.1.jar`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Creating a database configuration file

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a new file called `db.properties` file in the `src` directory of the project.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, add the connection parameters to the `db.properties` file:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"properties"} -->

```
db.url=jdbc:postgresql://localhost:5432/sales
db.username=Yourusername
db.password=YourPassword
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `config.properties` include three connection parameters:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `db.url`: The URL of the PostgreSQL database server. In this example, we connect to the `sales` database on the local PostgreSQL server with port 5432 (default port).
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `db.user`: The user account that connects to the database.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `db.password`: The password for the user.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Note that you need to replace the `YourUsername` and `YourPassword` with the actual ones.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Defining a DatabaseConfig class

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a new file in the `src` directory called `DatabaseConfig.java`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, define the `DatabaseConfig` class in the `DatabaseConfig.java` file:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class DatabaseConfig {
    private static final Properties properties = new Properties();

    static {
        try (InputStream input = DatabaseConfig.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (input == null) {
                System.out.println("Sorry, unable to find db.properties");
                System.exit(1);
            }

            // Load the properties file
            properties.load(input);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getDbUrl() {

        return properties.getProperty("db.url");
    }

    public static String getDbUsername() {
        return properties.getProperty("db.username");
    }

    public static String getDbPassword() {
        return properties.getProperty("db.password");
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `DatabaseConfig` class is responsible for loading database configuration from the `db.properties` file.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `DatabaseConfig` has three static methods that expose the database configuration:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `getDbUrl()` - Return the database URL.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `getDbUsername()` - Return the username.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `getDbPassword()` - Return the password.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Creating a DB class

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a new file named `DB.java` file in the `src` directory

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, define the `DB` class with the following code:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class DB {
    public static Connection connect() throws SQLException {

        try {
            // Get database credentials from DatabaseConfig class
            var jdbcUrl = DatabaseConfig.getDbUrl();
            var user = DatabaseConfig.getDbUsername();
            var password = DatabaseConfig.getDbPassword();

            // Open a connection
            return DriverManager.getConnection(jdbcUrl, user, password);

        } catch (SQLException  e) {
            System.err.println(e.getMessage());
            return null;
        }
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `DB` class has the static method, `connect()`, which connects to the sales database on the local PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The connect() method utilizes the `DatabaseConfig` class to load the connection parameters and establish a connection to the database using the `getConnection()` method of the `DriverManager` class.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `connect()` method returns a `Connection` object if it successfully established a connection to PostgreSQL, or null otherwise.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If any `SQLException` occurs during the connection process, the `connect()` method displays the details of the exception.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Creating a Java Program

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create the `Main.java` file in the src directory.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, define the `Main` class in the `Main.java`file with the following code:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"java"} -->

```
import java.sql.SQLException;

public class Main {
    public static void main(String[] args){
        try (var connection =  DB.connect()){
            System.out.println("Connected to the PostgreSQL database.");
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `main()` of the `Main` class uses the `DB` class to connect to the `sales` database on the local PostgreSQL server by calling the `connect()` method.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

It displays a message if the connection is established successfully or an error if an `SQLException` occurs.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The try-with-resources statement ensures that the `Connection` is automatically closed even if an exception occurs.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you run the program and see the following output, meaning that the program is successfully connected to the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
Connected to the PostgreSQL database.
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `DriverManager.getConnection()` method to establish a connection to a database on a PostgreSQL server.
- <!-- /wp:list-item -->

<!-- /wp:list -->

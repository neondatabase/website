---
title: 'PostgreSQL JDBC: Connecting to PostgreSQL Databases'
redirectFrom: 
            - /postgresql/postgresql-jdbc/connecting-to-postgresql-database
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to connect to the PostgreSQL database server from a Java program.

## Creating a new database

First, open the Command Prompt on Windows or the Terminal on Unix-like systems and connect to the local PostgreSQL database server using `psql` client tool:

```
psql -U postgres
```

Second, create a new database called `sales`:

```sql
CREATE DATABASE sales;
```

Third, exit the `psql`:

```
exit
```

## Setting up JDK

Follow [this tutorial to install JDK](https://www.javazerotomastery.com/java-tutorial/install-jdk/) on your computer.

## Installing IntelliJ IDE

We'll use the IntelliJ IDE.

## Downloading PostgreSQL JDBC Driver

To connect to the PostgreSQL server from a Java program, you need a PostgreSQL JDBC driver.

You can download the latest version of the driver on the [jdbc.postgresql.org download page](https://jdbc.postgresql.org/download/). The downloaded file is a jar file e.g., `postgresql-42.7.1.jar`.

## Creating a new project

First, launch the IntellJ IDE.

Next, create a new project called `sales`.

Then, right-click the project name and choose the **Open Module Settings**.

After that, choose the **Libraries** under **Project Settings** and click **New Project Library**.

Finally, select the PostgreSQL database driver file such as `postgresql-42.7.1.jar`.

## Creating a database configuration file

First, create a new file called `db.properties` file in the `src` directory of the project.

Second, add the connection parameters to the `db.properties` file:

```
db.url=jdbc:postgresql://localhost:5432/sales
db.username=Yourusername
db.password=YourPassword
```

The `config.properties` include three connection parameters:

- `db.url`: The URL of the PostgreSQL database server. In this example, we connect to the `sales` database on the local PostgreSQL server with port 5432 (default port).
-
- `db.user`: The user account that connects to the database.
-
- `db.password`: The password for the user.

Note that you need to replace the `YourUsername` and `YourPassword` with the actual ones.

## Defining a DatabaseConfig class

First, create a new file in the `src` directory called `DatabaseConfig.java`.

Second, define the `DatabaseConfig` class in the `DatabaseConfig.java` file:

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

The `DatabaseConfig` class is responsible for loading database configuration from the `db.properties` file.

The `DatabaseConfig` has three static methods that expose the database configuration:

- `getDbUrl()` - Return the database URL.
-
- `getDbUsername()` - Return the username.
-
- `getDbPassword()` - Return the password.

## Creating a DB class

First, create a new file named `DB.java` file in the `src` directory

Second, define the `DB` class with the following code:

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

The `DB` class has the static method, `connect()`, which connects to the sales database on the local PostgreSQL server.

The connect() method utilizes the `DatabaseConfig` class to load the connection parameters and establish a connection to the database using the `getConnection()` method of the `DriverManager` class.

The `connect()` method returns a `Connection` object if it successfully established a connection to PostgreSQL, or null otherwise.

If any `SQLException` occurs during the connection process, the `connect()` method displays the details of the exception.

## Creating a Java Program

First, create the `Main.java` file in the src directory.

Second, define the `Main` class in the `Main.java`file with the following code:

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

The `main()` of the `Main` class uses the `DB` class to connect to the `sales` database on the local PostgreSQL server by calling the `connect()` method.

It displays a message if the connection is established successfully or an error if an `SQLException` occurs.

The try-with-resources statement ensures that the `Connection` is automatically closed even if an exception occurs.

If you run the program and see the following output, meaning that the program is successfully connected to the PostgreSQL server:

```sql
Connected to the PostgreSQL database.
```

## Summary

- Use the `DriverManager.getConnection()` method to establish a connection to a database on a PostgreSQL server.

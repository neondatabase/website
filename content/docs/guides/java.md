---
title: Connect a Java application to Neon
subtitle: Set up a Neon project in seconds and connect with JDBC or Spring Data
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/java
  - /docs/integrations/java
updatedOn: '2025-03-14T09:00:00.000Z'
---

This guide describes how to create a Neon project and connect to it with Java Database Connectivity (JDBC) or from a Spring Data project that uses JDBC. It also demonstrates how to perform CRUD (Create, Read, Update, Delete) operations using JDBC.

The JDBC API is a Java API for relational databases. Postgres has a well-supported open-source JDBC driver which can be used to access Neon. All popular Java frameworks use JDBC internally. To connect to Neon, you are only required to provide a connection URL.

For additional information about JDBC, refer to the JDBC API documentation, and the [PostgreSQL JDBC Driver documentation](https://jdbc.postgresql.org/documentation).

To connect to Neon with JDBC or from a Spring Data project:

1. [Create a Neon project](#create-a-neon-project)
2. [Connect with JDBC](#connect-with-jdbc) or [Connect from Spring Data](#connect-from-spring-data)
3. [Perform CRUD operations](#perform-crud-operations-with-jdbc)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Connect with JDBC

For a JDBC connection URL, replace the variables in the following URL string with your Neon project ID, database name, user, and password:

```java
jdbc:postgresql://[neon_hostname]/[dbname]?user=[user]&password=[password]&sslmode=require
```

You can find your database connection string by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Connect from Spring Data

Spring Data relies on JDBC and Postgres drivers to connect to Postgres databases, such as Neon. If you are starting your project with Spring Initializr or connecting from an existing Spring Data project, ensure that the `PostgreSQL database driver` dependency is installed.

Connecting from a Spring Data project requires specifying the datasource URL in your `application.properties` file, as shown in the following example:

```java
spring.datasource.url=jdbc:postgresql://[neon_hostname]/[dbname]?user=[user]&password=[password]&sslmode=require
```

Refer to the [Connect with JDBC](#connect-with-jdbc) section above for information about obtaining connection details for your Neon database.

## Perform CRUD operations with JDBC

This section demonstrates how to perform basic CRUD (Create, Read, Update, Delete) operations with JDBC and Neon. We'll create a simple Java application that connects to a Neon database and performs these operations.

### Prerequisites

Before you begin, make sure you have:

1. A Neon project with connection details
2. Java Development Kit (JDK) 11 or later installed
3. Maven or Gradle for dependency management

Add the PostgreSQL JDBC driver to your project:

**Maven:**

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.1</version>
</dependency>
```

**Gradle:**

```groovy
implementation 'org.postgresql:postgresql:42.7.1'
```

### Setting up the database connection

Create a utility class to manage your database connection:

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static final String URL = "jdbc:postgresql://[neon_hostname]/[dbname]?sslmode=require";
    private static final String USER = "[user]";
    private static final String PASSWORD = "[password]";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
```

Replace `[neon_hostname]`, `[dbname]`, `[user]`, and `[password]` with your Neon connection details.

### Create a table

The following example demonstrates how to create a table in your Neon database:

```java
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class CreateTableExample {
    public static void main(String[] args) {
        String createTableSQL = "CREATE TABLE IF NOT EXISTS users (" +
                "id SERIAL PRIMARY KEY, " +
                "name VARCHAR(100) NOT NULL, " +
                "email VARCHAR(100) NOT NULL UNIQUE, " +
                "country VARCHAR(50), " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";

        try (Connection connection = DatabaseConnection.getConnection();
             Statement statement = connection.createStatement()) {
            statement.execute(createTableSQL);
            System.out.println("Table 'users' created successfully.");
        } catch (SQLException e) {
            System.err.println("Error creating table: " + e.getMessage());
        }
    }
}
```

### Insert records

#### Insert a single record

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class InsertRecordExample {
    public static void main(String[] args) {
        String insertSQL = "INSERT INTO users (name, email, country) VALUES (?, ?, ?)";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(insertSQL)) {

            preparedStatement.setString(1, "John Doe");
            preparedStatement.setString(2, "john.doe@example.com");
            preparedStatement.setString(3, "USA");

            int rowsAffected = preparedStatement.executeUpdate();
            System.out.println(rowsAffected + " row(s) inserted.");
        } catch (SQLException e) {
            System.err.println("Error inserting record: " + e.getMessage());
        }
    }
}
```

#### Insert multiple records

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

public class InsertMultipleRecordsExample {
    static class User {
        String name;
        String email;
        String country;

        User(String name, String email, String country) {
            this.name = name;
            this.email = email;
            this.country = country;
        }
    }

    public static void main(String[] args) {
        String insertSQL = "INSERT INTO users (name, email, country) VALUES (?, ?, ?)";

        List<User> users = Arrays.asList(
            new User("Jane Smith", "jane.smith@example.com", "Canada"),
            new User("Bob Johnson", "bob.johnson@example.com", "UK"),
            new User("Alice Brown", "alice.brown@example.com", "Australia")
        );

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(insertSQL)) {

            connection.setAutoCommit(false);

            for (User user : users) {
                preparedStatement.setString(1, user.name);
                preparedStatement.setString(2, user.email);
                preparedStatement.setString(3, user.country);
                preparedStatement.addBatch();
            }

            int[] rowsAffected = preparedStatement.executeBatch();
            connection.commit();

            System.out.println("Inserted " + rowsAffected.length + " records.");
        } catch (SQLException e) {
            System.err.println("Error inserting records: " + e.getMessage());
        }
    }
}
```

### Query records

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class QueryRecordsExample {
    public static void main(String[] args) {
        String selectSQL = "SELECT * FROM users";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(selectSQL);
             ResultSet resultSet = preparedStatement.executeQuery()) {

            System.out.println("Users:");
            System.out.println("-------------------------------");

            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String name = resultSet.getString("name");
                String email = resultSet.getString("email");
                String country = resultSet.getString("country");

                System.out.printf("ID: %d, Name: %s, Email: %s, Country: %s%n",
                        id, name, email, country);
            }
        } catch (SQLException e) {
            System.err.println("Error querying records: " + e.getMessage());
        }
    }
}
```

### Update records

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UpdateRecordExample {
    public static void main(String[] args) {
        String updateSQL = "UPDATE users SET country = ? WHERE email = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(updateSQL)) {

            preparedStatement.setString(1, "Germany");
            preparedStatement.setString(2, "john.doe@example.com");

            int rowsAffected = preparedStatement.executeUpdate();
            System.out.println(rowsAffected + " row(s) updated.");
        } catch (SQLException e) {
            System.err.println("Error updating record: " + e.getMessage());
        }
    }
}
```

### Delete records

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DeleteRecordExample {
    public static void main(String[] args) {
        String deleteSQL = "DELETE FROM users WHERE email = ?";

        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(deleteSQL)) {

            preparedStatement.setString(1, "alice.brown@example.com");

            int rowsAffected = preparedStatement.executeUpdate();
            System.out.println(rowsAffected + " row(s) deleted.");
        } catch (SQLException e) {
            System.err.println("Error deleting record: " + e.getMessage());
        }
    }
}
```

### Complete example application

Here's a complete example that demonstrates all CRUD operations in a single application:

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Arrays;
import java.util.List;

public class NeonJdbcCrudExample {
    // Replace these with your Neon connection details
    private static final String URL = "jdbc:postgresql://[neon_hostname]/[dbname]?sslmode=require";
    private static final String USER = "[user]";
    private static final String PASSWORD = "[password]";

    static class User {
        String name;
        String email;
        String country;

        User(String name, String email, String country) {
            this.name = name;
            this.email = email;
            this.country = country;
        }
    }

    public static void main(String[] args) {
        try {
            // Create table
            createTable();

            // Insert records
            insertUser("John Doe", "john.doe@example.com", "USA");

            List<User> users = Arrays.asList(
                new User("Jane Smith", "jane.smith@example.com", "Canada"),
                new User("Bob Johnson", "bob.johnson@example.com", "UK"),
                new User("Alice Brown", "alice.brown@example.com", "Australia")
            );
            insertMultipleUsers(users);

            // Query records
            System.out.println("\nAll users after insertion:");
            queryUsers();

            // Update a record
            updateUser("john.doe@example.com", "Germany");

            // Query records after update
            System.out.println("\nAll users after update:");
            queryUsers();

            // Delete a record
            deleteUser("alice.brown@example.com");

            // Query records after deletion
            System.out.println("\nAll users after deletion:");
            queryUsers();

        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        }
    }

    private static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    private static void createTable() throws SQLException {
        String createTableSQL = "CREATE TABLE IF NOT EXISTS users (" +
                "id SERIAL PRIMARY KEY, " +
                "name VARCHAR(100) NOT NULL, " +
                "email VARCHAR(100) NOT NULL UNIQUE, " +
                "country VARCHAR(50), " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";

        try (Connection connection = getConnection();
             Statement statement = connection.createStatement()) {
            statement.execute(createTableSQL);
            System.out.println("Table 'users' created successfully.");
        }
    }

    private static void insertUser(String name, String email, String country) throws SQLException {
        String insertSQL = "INSERT INTO users (name, email, country) VALUES (?, ?, ?)";

        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(insertSQL)) {

            preparedStatement.setString(1, name);
            preparedStatement.setString(2, email);
            preparedStatement.setString(3, country);

            int rowsAffected = preparedStatement.executeUpdate();
            System.out.println(rowsAffected + " user inserted: " + name);
        }
    }

    private static void insertMultipleUsers(List<User> users) throws SQLException {
        String insertSQL = "INSERT INTO users (name, email, country) VALUES (?, ?, ?)";

        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(insertSQL)) {

            connection.setAutoCommit(false);

            for (User user : users) {
                preparedStatement.setString(1, user.name);
                preparedStatement.setString(2, user.email);
                preparedStatement.setString(3, user.country);
                preparedStatement.addBatch();
            }

            int[] rowsAffected = preparedStatement.executeBatch();
            connection.commit();

            System.out.println("Inserted " + rowsAffected.length + " additional users.");
        }
    }

    private static void queryUsers() throws SQLException {
        String selectSQL = "SELECT * FROM users";

        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(selectSQL);
             ResultSet resultSet = preparedStatement.executeQuery()) {

            System.out.println("-------------------------------");

            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String name = resultSet.getString("name");
                String email = resultSet.getString("email");
                String country = resultSet.getString("country");

                System.out.printf("ID: %d, Name: %s, Email: %s, Country: %s%n",
                        id, name, email, country);
            }

            System.out.println("-------------------------------");
        }
    }

    private static void updateUser(String email, String newCountry) throws SQLException {
        String updateSQL = "UPDATE users SET country = ? WHERE email = ?";

        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(updateSQL)) {

            preparedStatement.setString(1, newCountry);
            preparedStatement.setString(2, email);

            int rowsAffected = preparedStatement.executeUpdate();
            System.out.println(rowsAffected + " user updated: " + email + " now in " + newCountry);
        }
    }

    private static void deleteUser(String email) throws SQLException {
        String deleteSQL = "DELETE FROM users WHERE email = ?";

        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(deleteSQL)) {

            preparedStatement.setString(1, email);

            int rowsAffected = preparedStatement.executeUpdate();
            System.out.println(rowsAffected + " user deleted: " + email);
        }
    }
}
```

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-java-jdbc" description="Get started with Java JDBC and Neon" icon="github">Get started with Java JDBC and Neon</a>
</DetailIconCards>

<NeedHelp/>

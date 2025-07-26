---
title: Connect a Java application to Neon
subtitle: Connect to a Neon database using the standard PostgreSQL JDBC driver to run INSERT, SELECT, UPDATE, and DELETE statements.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/java
  - /docs/integrations/java
updatedOn: '2025-07-25T00:00:00.000Z'
---

This guide describes how to create a Neon project and connect to it from a Java application using **Java Database Connectivity (JDBC)**, the standard API for interacting with relational databases in Java.

You will learn how to set up a project, connect to your database, and perform basic create, read, update, and delete (CRUD) operations.

## Prerequisites

- A Neon account. If you do not have one, see [Sign up](https://console.neon.tech/signup).
- [Java Development Kit (JDK) 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or later.
- [Apache Maven](https://maven.apache.org/install.html) to manage project dependencies.

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1.  Navigate to the [Projects](https://console.neon.tech/app/projects) page in the [Neon Console](https://console.neon.tech).
2.  Click **New Project**.
3.  Specify your project settings and click **Create Project**.

Your project is created with a ready-to-use database named `neondb`. In the following steps, you will connect to this database from your Java application.

## Create a Java project

Create a project using the Maven `archetype:generate` command. This sets up a standard Java project structure.

1.  Run the following command in your terminal to generate a new Maven project. This command creates a simple Java project with the `maven-archetype-quickstart` archetype.

    ```bash
    mvn archetype:generate \
        -DarchetypeGroupId=org.apache.maven.archetypes \
        -DarchetypeArtifactId=maven-archetype-quickstart \
        -DarchetypeVersion=1.5 \
        -DgroupId=com.neon.quickstart \
        -DartifactId=neon-java-jdbc \
        -DinteractiveMode=false
    ```

2.  Change into the newly created project directory.

    ```bash
    cd neon-java-jdbc
    ```

    > Open this directory in your preferred code editor (e.g., VS Code, IntelliJ IDEA).

3.  Add the `postgresql` driver and `dotenv-java` libraries as dependencies in your `pom.xml` file. There may be other dependencies already present (e.g, `junit`), so ensure you add these within the `<dependencies>` section.

    ```xml title="pom.xml"
    <dependencies>
      <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.7.3</version>
      </dependency>
      <dependency>
        <groupId>io.github.cdimascio</groupId>
        <artifactId>dotenv-java</artifactId>
        <version>3.2.0</version>
      </dependency>
    </dependencies>
    ```

    <Admonition type="note" title="Note">
    Make sure to add this to the `<dependencies>` section. A common mistake is adding it to `<dependencyManagement>`, which only declares a version but doesn't actually include the library in your build.
    </Admonition>

    Save the file.

4.  Compile the project to download the dependencies.

    ```bash
    mvn clean compile
    ```

    This command compiles your Java code and downloads the required dependencies specified in `pom.xml`.

## Store your Neon connection string

Create a file named `.env` in your project's root directory. This file will securely store your database connection string.

1.  In the [Neon Console](https://console.neon.tech), select your project on the **Dashboard**.
2.  Click **Connect** on your **Project Dashboard** to open the **Connect to your database** modal.
3.  Select **Java** as your programming language.
    ![Connection modal](/docs/connect/java_connection_details.png)
4.  Copy the connection string, which includes your password.
5.  Create a file named `.env` in your project's root directory and add the connection string to it as shown below:

    ```text title=".env"
    DATABASE_URL="jdbc:postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channelBinding=require"
    ```

    > Replace `[user]`, `[password]`, `[neon_hostname]`, and `[dbname]` with your actual database credentials.

## Examples

This section provides code examples for performing CRUD operations. The examples should be placed inside `src/main/java/com/neon/quickstart/`.

### Create a table and insert data

Create a file named `CreateTable.java`. This class connects to your database, creates a table, and inserts data.

```java title="src/main/java/com/neon/quickstart/CreateTable.java"
package com.neon.quickstart;

import io.github.cdimascio.dotenv.Dotenv;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;

public class CreateTable {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        String connString = dotenv.get("DATABASE_URL");

        try (Connection conn = DriverManager.getConnection(connString)) {
            System.out.println("Connection established");

            try (Statement stmt = conn.createStatement()) {
                // Drop the table if it already exists
                stmt.execute("DROP TABLE IF EXISTS books;");
                System.out.println("Finished dropping table (if it existed).");

                // Create a new table
                stmt.execute("""
                    CREATE TABLE books (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        author VARCHAR(255),
                        publication_year INT,
                        in_stock BOOLEAN DEFAULT TRUE
                    );
                """);
                System.out.println("Finished creating table.");

                // Insert a single book record
                String insertOneSql = "INSERT INTO books (title, author, publication_year, in_stock) VALUES (?, ?, ?, ?);";
                try (PreparedStatement pstmt = conn.prepareStatement(insertOneSql)) {
                    pstmt.setString(1, "The Catcher in the Rye");
                    pstmt.setString(2, "J.D. Salinger");
                    pstmt.setInt(3, 1951);
                    pstmt.setBoolean(4, true);
                    pstmt.executeUpdate();
                    System.out.println("Inserted a single book.");
                }

                // Insert multiple books at once
                String insertManySql = "INSERT INTO books (title, author, publication_year, in_stock) VALUES (?, ?, ?, ?);";
                try (PreparedStatement pstmt = conn.prepareStatement(insertManySql)) {
                    Object[][] booksToInsert = {
                        {"The Hobbit", "J.R.R. Tolkien", 1937, true},
                        {"1984", "George Orwell", 1949, true},
                        {"Dune", "Frank Herbert", 1965, false}
                    };

                    for (Object[] book : booksToInsert) {
                        pstmt.setString(1, (String) book[0]);
                        pstmt.setString(2, (String) book[1]);
                        pstmt.setInt(3, (Integer) book[2]);
                        pstmt.setBoolean(4, (Boolean) book[3]);
                        pstmt.addBatch();
                    }
                    pstmt.executeBatch();
                    System.out.println("Inserted 3 rows of data.");
                }
            }
        } catch (Exception e) {
            System.out.println("Connection failed.");
            e.printStackTrace();
        }
    }
}
```

The above code does the following:

- Connects to the Neon database using the connection string from the `.env` file.
- Drops the `books` table if it already exists.
- Creates a new `books` table with columns for `id`, `title`, `author`, `publication_year`, and `in_stock`.
- Inserts a single book record.
- Inserts multiple book records in a batch operation.

Run the code to create the table and insert the data using the following command:

```bash
mvn exec:java -Dexec.mainClass="com.neon.quickstart.CreateTable"
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established
Finished dropping table (if it existed).
Finished creating table.
Inserted a single book.
Inserted 3 rows of data.
```

### Read data

Create a file named `ReadData.java`. This class fetches all rows from the `books` table and prints them.

```java title="src/main/java/com/neon/quickstart/ReadData.java"
package com.neon.quickstart;

import io.github.cdimascio.dotenv.Dotenv;
import java.sql.*;

public class ReadData {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        String connString = dotenv.get("DATABASE_URL");

        try (Connection conn = DriverManager.getConnection(connString);
             Statement stmt = conn.createStatement()) {
            System.out.println("Connection established");
            String sql = "SELECT * FROM books ORDER BY publication_year;";
            try (ResultSet rs = stmt.executeQuery(sql)) {
                System.out.println("\n--- Book Library ---");
                while (rs.next()) {
                    System.out.printf("ID: %d, Title: %s, Author: %s, Year: %d, In Stock: %b%n",
                            rs.getInt("id"), rs.getString("title"), rs.getString("author"),
                            rs.getInt("publication_year"), rs.getBoolean("in_stock"));
                }
                System.out.println("--------------------\n");
            }
        } catch (Exception e) {
            System.out.println("Connection failed.");
            e.printStackTrace();
        }
    }
}
```

The above code does the following:

- Connects to the Neon database using the connection string from the `.env` file.
- Executes a SQL query to select all rows from the `books` table, ordered by `publication_year`.
- Iterates through the result set and prints each book's details.

Run the code to read the data using the following command:

```bash
mvn exec:java -Dexec.mainClass="com.neon.quickstart.ReadData"
```

When the read logic runs, it produces the following output:

```text title="Output"
Connection established

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: true
ID: 3, Title: 1984, Author: George Orwell, Year: 1949, In Stock: true
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: true
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: false
--------------------
```

### Update data

Create a file named `UpdateData.java` to update the stock status of 'Dune' to `True`.

```java title="src/main/java/com/neon/quickstart/UpdateData.java"
package com.neon.quickstart;

import io.github.cdimascio.dotenv.Dotenv;
import java.sql.*;

public class UpdateData {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        String connString = dotenv.get("DATABASE_URL");
        String sql = "UPDATE books SET in_stock = ? WHERE title = ?;";

        try (Connection conn = DriverManager.getConnection(connString);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            System.out.println("Connection established");
            pstmt.setBoolean(1, true);
            pstmt.setString(2, "Dune");
            int rowsAffected = pstmt.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Updated stock status for 'Dune'.");
            }
        } catch (Exception e) {
            System.out.println("Connection failed.");
            e.printStackTrace();
        }
    }
}
```

The above code does the following:

- Connects to the Neon database.
- Prepares an SQL `UPDATE` statement to set the `in_stock` status of the book 'Dune' to `true`.
- Executes the update and prints a confirmation message if successful.

Run the code to update the data using the following command:

```bash
mvn exec:java -Dexec.mainClass="com.neon.quickstart.UpdateData"
```

After running the update, verify the change by running the `ReadData` class again.

```bash
mvn exec:java -Dexec.mainClass="com.neon.quickstart.ReadData"
```

The updated output will be:

```text title="Output"
--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: true
ID: 3, Title: 1984, Author: George Orwell, Year: 1949, In Stock: true
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: true
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: true
--------------------
```

> You can see that the stock status for 'Dune' has been updated to `true`.

### Delete data

Create a file named `DeleteData.java` to delete the book '1984' from the table.

```java title="src/main/java/com/neon/quickstart/DeleteData.java"
package com.neon.quickstart;

import io.github.cdimascio.dotenv.Dotenv;
import java.sql.*;

public class DeleteData {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        String connString = dotenv.get("DATABASE_URL");
        String sql = "DELETE FROM books WHERE title = ?;";

        try (Connection conn = DriverManager.getConnection(connString);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            System.out.println("Connection established");
            pstmt.setString(1, "1984");
            int rowsAffected = pstmt.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Deleted the book '1984' from the table.");
            }
        } catch (Exception e) {
            System.out.println("Connection failed.");
            e.printStackTrace();
        }
    }
}
```

The above code does the following:

- Connects to the Neon database.
- Prepares an SQL `DELETE` statement to remove the book '1984'.
- Executes the delete and prints a confirmation message if successful.

Run the code to delete the data using the following command:

```bash
mvn exec:java -Dexec.mainClass="com.neon.quickstart.DeleteData"
```

After running the delete, verify the change by running the `ReadData` class again.

```bash
mvn exec:java -Dexec.mainClass="com.neon.quickstart.ReadData"
```

The final output will be:

```text title="Output"
--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: true
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: true
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: true
--------------------
```

> You can see that the book '1984' has been successfully deleted from the `books` table.

</Steps>

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-java-jdbc" description="Get started with Java and Neon using standard JDBC." icon="github">Get started with Java and Neon using JDBC</a>

</DetailIconCards>

## Resources

- [PostgreSQL JDBC Driver Documentation](https://jdbc.postgresql.org/documentation/use/)
- [Apache Maven Quickstart](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html)

<NeedHelp/>

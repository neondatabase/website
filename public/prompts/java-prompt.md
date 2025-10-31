# 💡 AI Prompt: Connect a Java Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Java Maven project to connect to a Neon Postgres database.

**Purpose:** To add the necessary Maven dependencies and provide a working script in Java that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle and transaction management with Neon using the PostgreSQL JDBC driver.

**Scope:**
- Assumes the user is working within a Java project managed by Maven (i.e., a `pom.xml` file is present).
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Java project as follows:

### 1. Add Required Maven Dependencies

1.  Open the `pom.xml` file.
2.  Locate the `<dependencies>` section.
3.  Add the following two `<dependency>` blocks inside the `<dependencies>` section if they are not already present:
    ```xml
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
    ```

### 2. Verify the `.env` File

- Check for the presence of a `.env` file at the root of the project.
- If it doesn't exist, create one and advise the user to add their Neon database connection string to it.
- Provide the following format and instruct the user to replace the placeholders:
  ```
  DATABASE_URL="jdbc:postgresql://[neon_hostname]/[dbname]?user=[username]&password=[password]&sslmode=require&channelBinding=require"
  ```
- Prompt the user to get their connection string from the **Neon Console → Project → Dashboard → Connect**, making sure to select **Java** from the dropdown.

---

### 3. Update `App.java` with a Full CRUD and Transaction Example

Modify the main application file (e.g., `src/main/java/com/example/neonapp/App.java`). Apply the following logic:

- **If the file contains only the default template code** (e.g., `System.out.println("Hello World!");`), replace the entire file content with the Java code block below.
- **If the file contains any custom user code, preserve it.** Comment out the existing code by wrapping it in a block comment (`/* ... */`) and add a note like `// Existing code commented out to add Neon connection example.` Then, append the new Java code block after the commented section.

#### Java Code to Add:

```java
// Replace `com.example.neonapp` with your project's actual package name
package com.example.neonapp;

import io.github.cdimascio.dotenv.Dotenv;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class App {
    public static void main(String[] args) {
        // 1. Load environment variables
        Dotenv dotenv = Dotenv.load();
        String connString = dotenv.get("DATABASE_URL");

        Connection conn = null;
        try {
            // 2. Establish connection
            conn = DriverManager.getConnection(connString);
            System.out.println("Connection successful!");

            // Set up a table for the example
            try (Statement stmt = conn.createStatement()) {
                stmt.execute("DROP TABLE IF EXISTS todos; CREATE TABLE todos (id SERIAL PRIMARY KEY, task TEXT NOT NULL);");
                System.out.println("Table 'todos' created.");
            }

            // --- Start Transaction for atomic CRUD Operations ---
            conn.setAutoCommit(false);
            System.out.println("\nTransaction started.");

            try {
                // CREATE: Insert a new todo item
                try (PreparedStatement pstmt = conn.prepareStatement("INSERT INTO todos (task) VALUES (?);")) {
                    pstmt.setString(1, "Learn Neon with Java");
                    pstmt.executeUpdate();
                    System.out.println("CREATE: Row inserted.");
                }

                // READ: Retrieve the new todo item
                try (PreparedStatement pstmt = conn.prepareStatement("SELECT task FROM todos WHERE task = ?;")) {
                    pstmt.setString(1, "Learn Neon with Java");
                    ResultSet rs = pstmt.executeQuery();
                    if (rs.next()) {
                        System.out.println("READ: Fetched task - '" + rs.getString("task") + "'");
                    }
                }

                // UPDATE: Modify the todo item
                try (PreparedStatement pstmt = conn.prepareStatement("UPDATE todos SET task = ? WHERE task = ?;")) {
                    pstmt.setString(1, "Master Neon with Java!");
                    pstmt.setString(2, "Learn Neon with Java");
                    pstmt.executeUpdate();
                    System.out.println("UPDATE: Row updated.");
                }

                // DELETE: Remove the todo item
                try (PreparedStatement pstmt = conn.prepareStatement("DELETE FROM todos WHERE task = ?;")) {
                    pstmt.setString(1, "Master Neon with Java!");
                    pstmt.executeUpdate();
                    System.out.println("DELETE: Row deleted.");
                }

                // --- Commit Transaction ---
                conn.commit();
                System.out.println("Transaction committed successfully.\n");

            } catch (SQLException e) {
                // --- Rollback Transaction on Error ---
                System.out.println("An error occurred. Rolling back transaction.");
                conn.rollback();
                throw e; // Re-throw the exception
            }

        } catch (SQLException e) {
            System.err.println("Database operation failed.");
            e.printStackTrace();
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Advise the user to ensure their connection string is correctly set in the `.env` file.
2.  Instruct them to compile and run the application from their terminal. They will need to replace `com.example.neonapp.App` with their project's main class.
    ```bash
    mvn compile exec:java -Dexec.mainClass="com.example.neonapp.App"
    ```
3.  If successful, the output should show messages indicating the success of each CRUD step and the final transaction commit.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The `pom.xml` file contains the `postgresql` and `dotenv-java` dependencies in the `<dependencies>` section.
- A `.env` file is present or has been created.
- The connection string is loaded from the environment, not hardcoded.
- **All SQL operations (INSERT, UPDATE, DELETE) use `PreparedStatement`** for parameterization to prevent SQL injection. Do not use `Statement` for queries with user-provided data.
- **The primary business logic (CRUD operations) is wrapped in a transaction block** (`conn.setAutoCommit(false)`, `conn.commit()`, `conn.rollback()`).
- The JDBC `Connection` and other resources are properly closed, preferably using `try-with-resources` or a `finally` block.

---

## ❌ Do Not

- Do not hardcode credentials in any `.java` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- Do not add dependencies to the `<dependencyManagement>` section instead of `<dependencies>`.
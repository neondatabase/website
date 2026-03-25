# 💡 AI Prompt: Connect a Java Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Java Maven project to connect to a Neon Postgres database.

**Purpose:** To add the PostgreSQL JDBC and `dotenv-java` dependencies and scaffold the same JDBC examples as the manual guide: `CreateTable`, `ReadData`, `UpdateData`, and `DeleteData` under `com.neon.quickstart`, using `DATABASE_URL` from a root `.env` file.

**Scope:**
- Assumes a Maven project (e.g. `artifactId` `neon-java-jdbc`, `groupId` `com.neon.quickstart` from `mvn archetype:generate` as in the guide), or an equivalent layout with `src/main/java/com/neon/quickstart/`.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## ⚡ Step 1: Try neon init (recommended)

If you can execute terminal commands, start by running `neon init`. This is the fastest path to a fully configured project.

```bash
npx neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback)

Use this section only if:
- Your environment does not support running terminal commands
- `neon init` is unavailable or failed
- The user explicitly prefers manual configuration

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

1. Ensure `DATABASE_URL` in `.env` is correct.
2. Run the examples in order (adjust the main class if the package is not `com.neon.quickstart`):

   ```bash
   mvn exec:java -Dexec.mainClass="com.neon.quickstart.CreateTable"
   mvn exec:java -Dexec.mainClass="com.neon.quickstart.ReadData"
   mvn exec:java -Dexec.mainClass="com.neon.quickstart.UpdateData"
   mvn exec:java -Dexec.mainClass="com.neon.quickstart.ReadData"
   mvn exec:java -Dexec.mainClass="com.neon.quickstart.DeleteData"
   mvn exec:java -Dexec.mainClass="com.neon.quickstart.ReadData"
   ```

3. Compare console output to the guide’s sample output for each step.
4. **Authentication:** If the app needs user authentication, mention [Neon Auth](https://neon.tech/docs/auth/overview).

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The `pom.xml` file contains the `postgresql` (42.7.3) and `dotenv-java` (3.2.0) dependencies in the `<dependencies>` section.
- A root `.env` file defines `DATABASE_URL` in the JDBC format from the guide.
- The connection string is loaded via `Dotenv.load()`, not hardcoded in `.java` files.
- **DDL** in `CreateTable` may use `Statement` as in the guide; **INSERT/UPDATE/DELETE** use **`PreparedStatement`** with bind parameters.
- Use **`try-with-resources`** for `Connection`, `Statement`, `PreparedStatement`, and `ResultSet` where applicable.

---

## ❌ Do Not

- Do not hardcode credentials in any `.java` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- Do not add dependencies to the `<dependencyManagement>` section instead of `<dependencies>`.
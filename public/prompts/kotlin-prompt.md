# 💡 AI Prompt: Connect a Kotlin Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Kotlin Gradle project to connect to a Neon Postgres database.

**Purpose:** To add the necessary Gradle dependencies and provide working Kotlin code that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle and transaction management with Neon using the PostgreSQL JDBC driver.

**Scope:**
- Assumes the user is working within a Kotlin project managed by Gradle (i.e., `build.gradle.kts` / `settings.gradle.kts` are present).
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Kotlin project as follows:

### 1. Add Required Gradle Dependencies

1.  If the project uses a version catalog (`gradle/libs.versions.toml`), add:
    ```toml
    [versions]
    postgresql = "42.7.13"
    dotenv = "6.5.1"

    [libraries]
    postgresql = { module = "org.postgresql:postgresql", version.ref = "postgresql" }
    dotenv = { module = "io.github.cdimascio:dotenv-kotlin", version.ref = "dotenv" }
    ```
    Then in the application module `build.gradle.kts` (often `app/build.gradle.kts`), add inside `dependencies`:
    ```kotlin
    implementation(libs.postgresql)
    implementation(libs.dotenv)
    ```
2.  If there is no version catalog, add these dependencies directly to the module `build.gradle.kts`:
    ```kotlin
    implementation("org.postgresql:postgresql:42.7.13")
    implementation("io.github.cdimascio:dotenv-kotlin:6.5.1")
    ```

### 2. Verify the `.env` File

- Check for the presence of a `.env` file in the application module directory (for multi-project Gradle apps, typically `app/.env`) or the project root.
- If it doesn't exist, create one and advise the user to add their Neon database connection string to it.
- Provide the following format and instruct the user to replace the placeholders:
  ```
  DATABASE_URL="jdbc:postgresql://[neon_hostname]/[dbname]?user=[username]&password=[password]&sslmode=require&channelBinding=require"
  ```
- Prompt the user to get their connection string from the **Neon Console → Project → Dashboard → Connect**, making sure to select **Java** from the dropdown (Kotlin uses the same JDBC URL format).

---

### 3. Add Kotlin JDBC CRUD Examples

Create or update Kotlin source files under the project package (for example, `app/src/main/kotlin/com/example/neonapp/`). Prefer package-level functions selected from `App.kt`, unless the project already uses a different structure.

**If `App.kt` (or the main entry file) contains only default template code**, replace it with:

```kotlin
package com.example.neonapp

fun main() {
    // Uncomment the example you want to run.
    createTable()
    // readData()
    // updateData()
    // deleteData()
    // transactionExample()
}
```

**If the file contains custom user code, preserve it.** Comment out the existing logic and add a note like `// Existing code commented out to add Neon connection example.` Then wire the Neon example entry point as above.

Add the following example functions in the same package (separate files or one file is fine):

#### Create table and insert data

```kotlin
package com.example.neonapp

import io.github.cdimascio.dotenv.dotenv
import java.sql.DriverManager

fun createTable() {
    val dotEnv = dotenv()
    val connString = dotEnv["DATABASE_URL"]

    try {
        DriverManager.getConnection(connString).use { conn ->
            println("Connection established")

            conn.createStatement().use { stmt ->
                stmt.execute("DROP TABLE IF EXISTS books;")
                println("Finished dropping table (if it existed).")

                stmt.execute(
                    """
                    CREATE TABLE books (
                        id SERIAL PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        author VARCHAR(255),
                        publication_year INT,
                        in_stock BOOLEAN DEFAULT TRUE
                    );
                    """.trimIndent()
                )
                println("Finished creating table.")

                val insertOneSql = """
                    INSERT INTO books (title, author, publication_year, in_stock)
                    VALUES (?, ?, ?, ?);
                """.trimIndent()

                conn.prepareStatement(insertOneSql).use { pstmt ->
                    pstmt.setString(1, "The Catcher in the Rye")
                    pstmt.setString(2, "J.D. Salinger")
                    pstmt.setInt(3, 1951)
                    pstmt.setBoolean(4, true)
                    pstmt.executeUpdate()
                    println("Inserted a single book.")
                }

                val insertManySql = """
                    INSERT INTO books (title, author, publication_year, in_stock)
                    VALUES (?, ?, ?, ?);
                """.trimIndent()

                conn.prepareStatement(insertManySql).use { pstmt ->
                    val booksToInsert = listOf(
                        listOf("The Hobbit", "J.R.R. Tolkien", 1937, true),
                        listOf("1984", "George Orwell", 1949, true),
                        listOf("Dune", "Frank Herbert", 1965, false)
                    )

                    for (book in booksToInsert) {
                        pstmt.setString(1, book[0] as String)
                        pstmt.setString(2, book[1] as String)
                        pstmt.setInt(3, book[2] as Int)
                        pstmt.setBoolean(4, book[3] as Boolean)
                        pstmt.addBatch()
                    }

                    pstmt.executeBatch()
                    println("Inserted 3 rows of data.")
                }
            }
        }
    } catch (e: Exception) {
        println("Connection failed.")
        e.printStackTrace()
    }
}
```

#### Compact CRUD + transaction demo (optional single-file alternative)

If the project prefers a single self-contained example in the main file, use this transaction-wrapped todos demo instead of (or in addition to) the books examples:

```kotlin
package com.example.neonapp

import io.github.cdimascio.dotenv.dotenv
import java.sql.DriverManager
import java.sql.SQLException

fun main() {
    val dotenv = dotenv()
    val connString = dotenv["DATABASE_URL"]

    DriverManager.getConnection(connString).use { conn ->
        try {
            conn.createStatement().use { stmt ->
                stmt.execute("DROP TABLE IF EXISTS todos; CREATE TABLE todos (id SERIAL PRIMARY KEY, task TEXT NOT NULL);")
                println("Table 'todos' created.")
            }

            conn.autoCommit = false
            println("\nTransaction started.")

            try {
                conn.prepareStatement("INSERT INTO todos (task) VALUES (?);").use { pstmt ->
                    pstmt.setString(1, "Learn Neon with Kotlin")
                    pstmt.executeUpdate()
                    println("CREATE: Row inserted.")
                }

                conn.prepareStatement("SELECT task FROM todos WHERE task = ?;").use { pstmt ->
                    pstmt.setString(1, "Learn Neon with Kotlin")
                    pstmt.executeQuery().use { rs ->
                        if (rs.next()) {
                            println("READ: Fetched task - '${rs.getString("task")}'")
                        }
                    }
                }

                conn.prepareStatement("UPDATE todos SET task = ? WHERE task = ?;").use { pstmt ->
                    pstmt.setString(1, "Master Neon with Kotlin!")
                    pstmt.setString(2, "Learn Neon with Kotlin")
                    pstmt.executeUpdate()
                    println("UPDATE: Row updated.")
                }

                conn.prepareStatement("DELETE FROM todos WHERE task = ?;").use { pstmt ->
                    pstmt.setString(1, "Master Neon with Kotlin!")
                    pstmt.executeUpdate()
                    println("DELETE: Row deleted.")
                }

                conn.commit()
                println("Transaction committed successfully.\n")
            } catch (e: SQLException) {
                println("An error occurred. Rolling back transaction.")
                conn.rollback()
                throw e
            }
        } catch (e: SQLException) {
            System.err.println("Database operation failed.")
            e.printStackTrace()
        }
    }
}
```

Replace `com.example.neonapp` with the project's actual package name.

---

## 🚀 Next Steps

Once the setup is complete:

1.  Advise the user to ensure their connection string is correctly set in the `.env` file.
2.  Instruct them to run the application from their terminal:
    ```bash
    ./gradlew run
    ```
    On Windows: `gradlew.bat run`
3.  If successful, the output should show messages indicating the success of each CRUD step and the final transaction commit (for the compact demo), or the selected example function output.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The Gradle build file includes the `postgresql` and `dotenv-kotlin` dependencies.
- A `.env` file is present or has been created.
- The connection string is loaded from the environment, not hardcoded.
- **All SQL operations (INSERT, UPDATE, DELETE) use `PreparedStatement`** for parameterization to prevent SQL injection. Do not use `Statement` for queries with user-provided data.
- **Multi-step business logic is wrapped in a transaction block** (`autoCommit = false`, `commit()`, `rollback()`).
- JDBC `Connection` and other resources are properly closed, preferably using Kotlin `.use { }`.

---

## ❌ Do Not

- Do not hardcode credentials in any `.kt` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- Do not add Maven `pom.xml` dependencies unless the project is actually Maven-based.

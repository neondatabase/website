---
title: Connect a Kotlin application to Neon Postgres
subtitle: Learn how to run SQL queries in Neon from Kotlin using the PostgreSQL JDBC
  driver
summary: >-
  Connect a Kotlin application to Neon Postgres using the PostgreSQL JDBC driver
  with Gradle. Covers complete CRUD examples including PreparedStatement
  inserts, batch operations, and transaction control with autoCommit, commit,
  and rollback. Also covers dotenv-kotlin for credential management. Focuses on
  raw JDBC without an ORM, unlike Micronaut or Hibernate guides.
enableTableOfContents: true
updatedOn: '2026-07-17T21:07:05.131Z'
---

<CopyPrompt src="/prompts/kotlin-prompt.md"
description="Pre-built prompt for connecting Kotlin applications to Neon"/>

This guide describes how to create a Neon project and connect to it from a Kotlin application using **Java Database Connectivity (JDBC)**, the standard API for interacting with relational databases on the JVM.

You will learn how to set up a project, connect to your database, and perform basic create, read, update, and delete (CRUD) operations.

## Prerequisites

- A Neon account. If you do not have one, see [Sign up](https://console.neon.tech/signup).
- [Java Development Kit (JDK) 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or later.
- [Gradle](https://gradle.org/install/) to manage the project and dependencies.

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1.  Navigate to the [Projects](https://console.neon.tech/app/projects) page in the [Neon Console](https://console.neon.tech).
2.  Click **New Project**.
3.  Specify your project settings and click **Create Project**.

Your project is created with a ready-to-use database named `neondb`. In the following steps, you will connect to this database from your Kotlin application.

## Create a Kotlin project

Create a project using the Gradle `init` command. This sets up a standard Kotlin application structure.

1.  Run the following command in your terminal to generate a new Kotlin application project.

    ```bash
    gradle init \
        --type kotlin-application \
        --dsl kotlin \
        --project-name neon-kotlin-jdbc \
        --package com.neon.quickstart
    ```

2.  Change into the newly created project directory.

    ```bash
    cd neon-kotlin-jdbc
    ```

    > Open this directory in your preferred code editor (for example, VS Code, IntelliJ IDEA).

3.  Add the `postgresql` driver and `dotenv-kotlin` libraries. With a Gradle version catalog (created by `gradle init`), declare the libraries in `gradle/libs.versions.toml`, then reference them from `app/build.gradle.kts`.

    Add the versions and library entries to `gradle/libs.versions.toml`:

    ```toml title="gradle/libs.versions.toml"
    [versions]
    postgresql = "42.7.13"
    dotenv = "6.5.1"

    [libraries]
    postgresql = { module = "org.postgresql:postgresql", version.ref = "postgresql" }
    dotenv = { module = "io.github.cdimascio:dotenv-kotlin", version.ref = "dotenv" }
    ```

    Then add the dependencies in `app/build.gradle.kts` inside the `dependencies` block:

    ```kotlin title="app/build.gradle.kts"
    dependencies {
        implementation(libs.postgresql)
        implementation(libs.dotenv)
    }
    ```

    Save both files.

4.  Compile the project to download the dependencies.

    ```bash
    ./gradlew build
    ```

    On Windows, use `gradlew.bat build`.

    This command compiles your Kotlin code and downloads the required dependencies.

## Store your Neon connection string

Create a file named `.env` in the `app` directory. This file will securely store your database connection string. Place it next to the application module so `dotenv-kotlin` can load it when you run the app with Gradle.

1.  In the [Neon Console](https://console.neon.tech), select your project on the **Dashboard**.
2.  Click **Connect** on your **Project Dashboard** to open the **Connect to your database** modal.
3.  Select **Java** as your programming language. Kotlin uses the same JDBC connection string format.
    ![Connection modal](/docs/connect/java_connection_details.png)
4.  Copy the connection string, which includes your password.
5.  Create a file named `.env` in the `app` directory and add the connection string to it as shown below:

    ```text title="app/.env"
    DATABASE_URL="jdbc:postgresql://[neon_hostname]/[dbname]?user=[user]&password=[password]&sslmode=require&channelBinding=require"
    ```

    > Replace `[user]`, `[password]`, `[neon_hostname]`, and `[dbname]` with your actual database credentials.

## Examples

This section provides code examples for performing CRUD operations. Place the example files inside `app/src/main/kotlin/com/neon/quickstart/`.

You can also clone the complete example project from GitHub: [neon-kotlin-jdbc](https://github.com/aaravmahajanofficial/neon-kotlin-jdbc).

Each example is a package-level function. Select which one to run by uncommenting it in `App.kt`:

```kotlin title="app/src/main/kotlin/com/neon/quickstart/App.kt"
package com.neon.quickstart

fun main() {
    // Uncomment the example you want to run.

    createTable()
    // readData()
    // updateData()
    // deleteData()
    // transactionExample()
}
```

Then run the selected example with:

```bash
./gradlew run
```

On Windows, use `gradlew.bat run`.

### Create a table and insert data

Create a file named `CreateTable.kt`. This function connects to your database, creates a table, and inserts data.

```kotlin title="app/src/main/kotlin/com/neon/quickstart/CreateTable.kt"
package com.neon.quickstart

import io.github.cdimascio.dotenv.dotenv
import java.sql.DriverManager

fun createTable() {
    val dotEnv = dotenv()
    val connString = dotEnv["DATABASE_URL"]

    try {
        DriverManager.getConnection(connString).use { conn ->
            println("Connection established")

            conn.createStatement().use { stmt ->
                // Drop the table if it already exists
                stmt.execute("DROP TABLE IF EXISTS books;")
                println("Finished dropping table (if it existed).")

                // Create a new table
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

                // Insert a single book record
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

                // Insert multiple books
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

The above code does the following:

- Connects to the Neon database using the connection string from the `.env` file.
- Drops the `books` table if it already exists.
- Creates a new `books` table with columns for `id`, `title`, `author`, `publication_year`, and `in_stock`.
- Inserts a single book record.
- Inserts multiple book records in a batch operation.

In `App.kt`, ensure only `createTable()` is uncommented, then run:

```bash
./gradlew run
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

Create a file named `ReadData.kt`. This function fetches all rows from the `books` table and prints them.

```kotlin title="app/src/main/kotlin/com/neon/quickstart/ReadData.kt"
package com.neon.quickstart

import io.github.cdimascio.dotenv.dotenv
import java.sql.DriverManager

fun readData() {
    val dotenv = dotenv()
    val connString = dotenv["DATABASE_URL"]

    try {
        DriverManager.getConnection(connString).use { conn ->
            conn.createStatement().use { stmt ->
                println("Connection established")

                val sql = "SELECT * FROM books ORDER BY publication_year;"

                stmt.executeQuery(sql).use { rs ->
                    println("\n--- Book Library ---")

                    while (rs.next()) {
                        println(
                            "ID: ${rs.getInt("id")}, " +
                                    "Title: ${rs.getString("title")}, " +
                                    "Author: ${rs.getString("author")}, " +
                                    "Year: ${rs.getInt("publication_year")}, " +
                                    "In Stock: ${rs.getBoolean("in_stock")}"
                        )
                    }

                    println("--------------------\n")
                }
            }
        }
    } catch (e: Exception) {
        println("Connection failed.")
        e.printStackTrace()
    }
}
```

The above code does the following:

- Connects to the Neon database using the connection string from the `.env` file.
- Executes a SQL query to select all rows from the `books` table, ordered by `publication_year`.
- Iterates through the result set and prints each book's details.

In `App.kt`, uncomment `readData()` (and comment out the other calls), then run:

```bash
./gradlew run
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

Create a file named `UpdateData.kt` to update the stock status of 'Dune' to `true`.

```kotlin title="app/src/main/kotlin/com/neon/quickstart/UpdateData.kt"
package com.neon.quickstart

import io.github.cdimascio.dotenv.dotenv
import java.sql.DriverManager

fun updateData() {
    val dotenv = dotenv()
    val connString = dotenv["DATABASE_URL"]
    val sql = "UPDATE books SET in_stock = ? WHERE title = ?;"

    try {
        DriverManager.getConnection(connString).use { conn ->
            conn.prepareStatement(sql).use { pstmt ->
                println("Connection established")

                pstmt.setBoolean(1, true)
                pstmt.setString(2, "Dune")

                val rowsAffected = pstmt.executeUpdate()

                if (rowsAffected > 0) {
                    println("Updated stock status for 'Dune'.")
                }
            }
        }
    } catch (e: Exception) {
        println("Connection failed.")
        e.printStackTrace()
    }
}
```

The above code does the following:

- Connects to the Neon database.
- Prepares an SQL `UPDATE` statement to set the `in_stock` status of the book 'Dune' to `true`.
- Executes the update and prints a confirmation message if successful.

In `App.kt`, uncomment `updateData()`, then run:

```bash
./gradlew run
```

After running the update, verify the change by switching `App.kt` to call `readData()` and running again.

```bash
./gradlew run
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

Create a file named `DeleteData.kt` to delete the book '1984' from the table.

```kotlin title="app/src/main/kotlin/com/neon/quickstart/DeleteData.kt"
package com.neon.quickstart

import io.github.cdimascio.dotenv.dotenv
import java.sql.DriverManager

fun deleteData() {
    val dotenv = dotenv()
    val connString = dotenv["DATABASE_URL"]
    val sql = "DELETE FROM books WHERE title = ?;"

    try {
        DriverManager.getConnection(connString).use { conn ->
            conn.prepareStatement(sql).use { pstmt ->
                println("Connection established")

                pstmt.setString(1, "1984")

                val rowsAffected = pstmt.executeUpdate()

                if (rowsAffected > 0) {
                    println("Deleted the book '1984' from the table.")
                }
            }
        }
    } catch (e: Exception) {
        println("Connection failed.")
        e.printStackTrace()
    }
}
```

The above code does the following:

- Connects to the Neon database.
- Prepares an SQL `DELETE` statement to remove the book '1984'.
- Executes the delete and prints a confirmation message if successful.

In `App.kt`, uncomment `deleteData()`, then run:

```bash
./gradlew run
```

After running the delete, verify the change by switching `App.kt` to call `readData()` and running again.

```bash
./gradlew run
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

### Using transactions

The examples above execute each operation independently. For production code where multiple operations must succeed or fail together, wrap them in a transaction. Set `autoCommit = false` to start a transaction, call `commit()` on success, and `rollback()` in the catch block on failure.

```kotlin title="app/src/main/kotlin/com/neon/quickstart/TransactionExample.kt"
package com.neon.quickstart

import io.github.cdimascio.dotenv.dotenv
import java.sql.DriverManager
import java.sql.SQLException

fun transactionExample() {
    val dotenv = dotenv()
    val connString = dotenv["DATABASE_URL"]

    DriverManager.getConnection(connString).use { conn ->
        try {
            conn.autoCommit = false // Begin Transaction

            // Insert
            conn.prepareStatement(
                "INSERT INTO books (title, author, publication_year) VALUES (?, ?, ?)"
            ).use { pstmt ->
                pstmt.setString(1, "Brave New World")
                pstmt.setString(2, "Aldous Huxley")
                pstmt.setInt(3, 1932)
                pstmt.executeUpdate()

                println("Inserted book.")
            }

            // Update
            conn.prepareStatement(
                "UPDATE books SET in_stock = ? WHERE title = ?"
            ).use { pstmt ->
                pstmt.setBoolean(1, false)
                pstmt.setString(2, "Brave New World")
                pstmt.executeUpdate()

                println("Updated stock status.")
            }

            conn.commit() // Commit transaction
            println("Transaction committed successfully.")

        } catch (e: SQLException) {
            println("Transaction failed. Rolling back.")

            conn.rollback()
            e.printStackTrace()
        }
    }
}
```

In `App.kt`, uncomment `transactionExample()`, then run:

```bash
./gradlew run
```

</Steps>

<details>
<summary>**Notes for AI-assisted setup**</summary>

- Always use `PreparedStatement` (with `?` placeholders) for INSERT, UPDATE, and DELETE operations. Do not use `Statement` for queries with user-provided data, as this is vulnerable to SQL injection.
- Add library versions to `gradle/libs.versions.toml` and reference them with `implementation(libs.*)` in `app/build.gradle.kts`.
- Wrap related database operations in a transaction (`autoCommit = false` / `commit()` / `rollback()`). Always call `rollback()` in a catch block to ensure atomicity on failure.
- Close JDBC connections and statements using Kotlin's `.use { }` (equivalent to Java try-with-resources) to prevent connection leaks.
- Do not hardcode credentials in `.kt` files. Use environment variables via `dotenv-kotlin`. For more information, see [Security overview](/docs/security/security-overview).

</details>

## Next steps: Using a framework

While this guide demonstrates how to connect to Neon using raw SQL queries, for more advanced and maintainable data interactions in your Kotlin applications, consider using a framework or ORM. Frameworks help you manage schema changes and keep your database structure in sync with your application models.

Explore the following resources to learn how to integrate frameworks with Neon:

- [Connect a Micronaut Kotlin application to Neon](/docs/guides/micronaut-kotlin)
- [Database Schema Changes with Hibernate, Spring Boot, and Neon](/guides/spring-boot-hibernate)

## Next steps: Neon backend services

- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

## Resources

- [Example project on GitHub](https://github.com/aaravmahajanofficial/neon-kotlin-jdbc)
- [PostgreSQL JDBC Driver Documentation](https://jdbc.postgresql.org/documentation/use/)
- [Gradle User Manual](https://docs.gradle.org/current/userguide/userguide.html)
- [dotenv-kotlin](https://github.com/cdimascio/dotenv-kotlin)
- [Connect a Micronaut Kotlin application to Neon](/docs/guides/micronaut-kotlin)

<NeedHelp/>

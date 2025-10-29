# 💡 AI Prompt: Connect Micronaut Kotlin to Neon Postgres

**Role:** You are an expert software agent specializing in the JVM ecosystem, specifically the Micronaut framework with Kotlin. Your task is to configure the current Micronaut project to connect to a Neon Postgres database.

**Purpose:** To connect the current Micronaut Kotlin project to Neon Postgres by validating dependencies, configuring the application, and scaffolding the necessary components (Entity, Repository, Controller, DB Migration) for a functional REST API.

**Scope:**
- Must be run inside an existing Micronaut project directory.
- Assumes the user has Micronaut Kotlin CLI and JDK 21 installed as they are required for project setup.
- Assumes the user has a Neon project and access to their full connection details (host, database, user, password).
- All modifications will follow Micronaut, Gradle, and Kotlin conventions.

✅ Read and understand the entire instruction set before executing.

---

## 📋 Prerequisites

- This prompt must be run inside an existing Micronaut project directory. Do not proceed if no Micronaut project is detected. You can identify a Micronaut project by the presence of Micronaut libraries in the `build.gradle.kts` file's dependency management section.
- **Setup for New Projects:** If the user does not have a project yet, run the following command. This command scaffolds a new project with all required features.

  ```bash
  mn create-app with-micronaut-kotlin --lang=kotlin --jdk=21 --features=postgres,jdbc-hikari,flyway,data-jdbc,yaml
  ```

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Micronaut project as follows:

### 1. Verify Project Setup and Dependencies

1.  **Check `build.gradle.kts`:** Ensure the project includes the necessary dependencies for this task. Look for implementations related to `micronaut-data-jdbc`, `micronaut-flyway`, and `postgresql`. If they are missing, add the necessary packages.

2.  **Ensure JDK Compatibility:** Check the `build.gradle.kts` file for the following block. If it is not present, add it inside the `kotlin { ... }` block to ensure compatibility with modern JDKs.

    ```kotlin
    // build.gradle.kts
    kotlin {
        jvmToolchain(21)
    }
    ```

---

### 2. Configure the Database Connection

1.  **Locate the configuration file:** Find the main configuration file at `src/main/resources/application.yml`.
2.  **Update the `datasources` block:** Modify this file to include connection details for Neon. **Prompt the user to replace the placeholder values** with their credentials.

    ```yaml title="src/main/resources/application.yml"
    micronaut:
      application:
        name: with-micronaut-kotlin
    datasources:
      default:
        url: 'jdbc:postgresql://<your-endpoint.neon.tech>/<dbname>?sslmode=require&channelBinding=require'
        username: '<your-db-username>'
        password: '<your-db-password>'
        driver-class-name: org.postgresql.Driver
        db-type: postgres
        dialect: POSTGRES
    flyway:
      datasources:
        default:
          enabled: true
    ```
3.  Direct the user to find their connection details in the **Neon Console → Project → Connect**. Explain that they need the host, database name, user, and password.

---

### 3. Create the Application Components

Create the necessary files for a complete CRUD API for an example `Book` entity. Assume the base package is `com.example`.

#### 3.A: Create the Database Migration

Create a new SQL file at `src/main/resources/db/migration/V1__create_book_table.sql`. This Flyway migration will create the `book` table and seed it with initial data upon application startup.

```sql title="src/main/resources/db/migration/V1__create_book_table.sql"
CREATE TABLE IF NOT EXISTS book (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL
);

INSERT INTO book (title, author) VALUES ('The Hobbit', 'J.R.R. Tolkien');
INSERT INTO book (title, author) VALUES ('1984', 'George Orwell');
```

#### 3.B: Create the Data Entity

Create the Kotlin data class at `src/main/kotlin/com/example/entity/Book.kt`. This class maps to the `book` table.

```kotlin title="src/main/kotlin/com/example/entity/Book.kt"
package com.example.entity

import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity
import io.micronaut.serde.annotation.Serdeable

@MappedEntity
@Serdeable
data class Book(
    @field:Id
    @field:GeneratedValue
    var id: Long? = null,
    var title: String,
    var author: String
)
```

#### 3.C: Create the Data Repository

Create the repository interface at `src/main/kotlin/com/example/repository/BookRepository.kt`. Micronaut Data will automatically implement the CRUD methods.

```kotlin title="src/main/kotlin/com/example/repository/BookRepository.kt"
package com.example.repository

import com.example.entity.Book
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository

@JdbcRepository(dialect = Dialect.POSTGRES)
interface BookRepository : CrudRepository<Book, Long>
```

#### 3.D: Create the REST Controller

Create the controller at `src/main/kotlin/com/example/controller/BookController.kt` to expose API endpoints.

```kotlin title="src/main/kotlin/com/example/controller/BookController.kt"
package com.example.controller

import com.example.entity.Book
import com.example.repository.BookRepository
import io.micronaut.http.annotation.*
import io.micronaut.scheduling.TaskExecutors
import io.micronaut.scheduling.annotation.ExecuteOn

@Controller("/books")
class BookController(private val bookRepository: BookRepository) {

    @Get
    @ExecuteOn(TaskExecutors.IO)
    fun getAll(): List<Book> = bookRepository.findAll().toList()

    @Get("/{id}")
    @ExecuteOn(TaskExecutors.IO)
    fun getById(id: Long): Book? = bookRepository.findById(id).orElse(null)

    @Post
    @ExecuteOn(TaskExecutors.IO)
    fun save(@Body book: Book): Book = bookRepository.save(book)
}
```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their connection details in `application.yml`. Do not proceed if placeholder values are still present.
2.  Start the Micronaut application using the Gradle wrapper:
    ```bash
    ./gradlew run
    ```
3.  Inform the user that the setup is complete. On startup, they will see logs from Hikari (connection pool) and Flyway (database migration). To test the API, they can use `curl`:

    ```bash
    # Get all books
    curl http://localhost:8080/books

    # Create a new book
    curl -X POST -H "Content-Type: application/json" -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald"}' http://localhost:8080/books
    ```

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The `build.gradle.kts` file contains the required Micronaut features (`data-jdbc`, `flyway`, `postgres`).
- The `application.yml` file contains the `datasources.default` block with placeholder credentials.
- The Flyway migration file `V1__create_book_table.sql` exists at the correct path.
- The `Book.kt`, `BookRepository.kt`, and `BookController.kt` files exist at their correct paths and use the `com.example` package.
- The controller correctly uses dependency injection to receive the repository.

---

## ❌ Do Not

- **Do not hardcode credentials** in any `.kt` or `.gradle` file. Always use the `application.yml` for configuration.
- **Do not output the user's full connection string or password** in any response or log.
- Do not modify the `build.gradle.kts` file beyond adding the `jvmToolchain` if necessary.
- Do not modify any files outside of the ones specified.
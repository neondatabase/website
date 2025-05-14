---
title: Connect Micronaut Kotlin to Postgres on Neon
subtitle: Learn how to make server-side queries to Postgres from a Micronaut Kotlin
  application
enableTableOfContents: true
updatedOn: '2025-05-09T22:55:40.565Z'
---

[Micronaut](https://micronaut.io/) is a modern, JVM-based, full-stack framework for building modular, easily testable microservice and serverless applications. This guide describes how to create a Neon Postgres database and connect to it from a Micronaut Kotlin application.

To create a Neon project and access it from a Micronaut Kotlin application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a Micronaut Kotlin project and add dependencies](#create-a-micronaut-kotlin-project-and-add-dependencies)
3. [Configure the Postgres connection](#configure-the-postgres-connection)
4. [Run the application](#run-the-application)

<Steps>
## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Micronaut Kotlin project and add dependencies

1. Create a Micronaut Kotlin project using the Micronaut CLI or the [Micronaut Launch](https://launch.micronaut.io/) website. Select Kotlin as the language and include the following features:

   - postgres
   - jdbc-hikari

   ```bash
   # Using Micronaut CLI
   mn create-app my-micronaut-app --lang=kotlin --features=postgres,jdbc-hikari
   ```

2. If you created your project without these dependencies, you can add them manually to your `build.gradle.kts` file:

   ```kotlin
   dependencies {
       // Existing dependencies...
       implementation("io.micronaut.sql:micronaut-jdbc-hikari")
       implementation("io.micronaut.data:micronaut-data-jdbc")
       implementation("io.micronaut.kotlin:micronaut-kotlin-runtime")
       implementation("org.postgresql:postgresql")
       // Other dependencies...
   }
   ```

## Store your Neon credentials

Add an `application.yml` file to your project at `src/main/resources/application.yml` and configure your Neon database connection:

```yaml
micronaut:
  application:
    name: mymicronautapp

datasources:
  default:
    url: ${JDBC_DATABASE_URL:`postgresql://user:password@endpoint.neon.tech:5432/dbname?sslmode=require`}
    driverClassName: org.postgresql.Driver
    username: ${JDBC_DATABASE_USERNAME:`user`}
    password: ${JDBC_DATABASE_PASSWORD:`password`}
    dialect: POSTGRES
```

For local development, you can create a `.env` file at the root of your project with your actual Neon credentials:

```shell
JDBC_DATABASE_URL=jdbc:postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require
JDBC_DATABASE_USERNAME=<user>
JDBC_DATABASE_PASSWORD=<password>
```

You can find your connection string by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

Remember to add `.env` to your `.gitignore` file to prevent committing sensitive credentials.

## Configure the Postgres connection

Create a simple entity class to demonstrate database connectivity. First, create an entity class:

```kotlin
// src/main/kotlin/com/example/entity/Book.kt
package com.example.entity

import io.micronaut.data.annotation.GeneratedValue
import io.micronaut.data.annotation.Id
import io.micronaut.data.annotation.MappedEntity

@MappedEntity
data class Book(
    @field:Id
    @field:GeneratedValue
    var id: Long? = null,
    var title: String,
    var author: String
)
```

Next, create a repository interface to interact with the database:

```kotlin
// src/main/kotlin/com/example/repository/BookRepository.kt
package com.example.repository

import com.example.entity.Book
import io.micronaut.data.jdbc.annotation.JdbcRepository
import io.micronaut.data.model.query.builder.sql.Dialect
import io.micronaut.data.repository.CrudRepository

@JdbcRepository(dialect = Dialect.POSTGRES)
interface BookRepository : CrudRepository<Book, Long> {
    fun findByTitleContains(title: String): List<Book>
}
```

Create a controller to expose REST endpoints:

```kotlin
// src/main/kotlin/com/example/controller/BookController.kt
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
    fun getAll(): List<Book> {
        return bookRepository.findAll().toList()
    }

    @Get("/{id}")
    @ExecuteOn(TaskExecutors.IO)
    fun getById(id: Long): Book? {
        return bookRepository.findById(id).orElse(null)
    }

    @Post
    @ExecuteOn(TaskExecutors.IO)
    fun save(@Body book: Book): Book {
        return bookRepository.save(book)
    }
}
```

Finally, create a simple migration to set up your database schema. Create a SQL file at `src/main/resources/db/migration/V1__create_book_table.sql`:

```sql
CREATE TABLE IF NOT EXISTS book (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL
);

INSERT INTO book (title, author) VALUES ('The Hobbit', 'J.R.R. Tolkien');
INSERT INTO book (title, author) VALUES ('1984', 'George Orwell');
```

Add the Flyway dependency to your `build.gradle.kts` to handle migrations:

```kotlin
dependencies {
    // Existing dependencies...
    implementation("io.micronaut.flyway:micronaut-flyway")
    // Other dependencies...
}
```

Configure Flyway in your `application.yml`:

```yaml
flyway:
  datasources:
    default:
      enabled: true
```

## Run the application

Run your Micronaut application using Gradle:

```bash
./gradlew run
```

The application will start, connect to your Neon database, create the `book` table, and insert sample data.

You can test the API using curl:

```bash
# Get all books
curl http://localhost:8080/books

# Get a specific book
curl http://localhost:8080/books/1

# Create a new book
curl -X POST -H "Content-Type: application/json" -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald"}' http://localhost:8080/books
```

## Source code

You can find the source code for the applications described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-micronaut-kotlin" description="Get started with Micronaut Kotlin and Neon" icon="github">Get started with Micronaut Kotlin and Neon</a>
</DetailIconCards>
</Steps>

<NeedHelp/>

---
title: Database Migrations in Spring Boot with Flyway and Neon
subtitle: Learn how to manage database schema changes in a Spring Boot application using Flyway with Neon Postgres.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-09-07T00:00:00.000Z'
updatedOn: '2024-09-07T00:00:00.000Z'
---

Database schema management is an essential part of every application development and maintenance process.

As your application grows, you need a reliable way to manage database changes across different environments.

This guide will walk you through setting up and using [Flyway](https://github.com/flyway/flyway) for database migrations in a [Spring Boot](https://github.com/spring-projects/spring-boot) application with Neon Postgres.

## Prerequisites

Before we begin, ensure you have:

- Java Development Kit installed
- [Maven](https://maven.apache.org/) for dependency management
- A [Neon](https://console.neon.tech/signup) account for serverless Postgres
- Basic familiarity with Spring Boot and SQL

Instead of Maven, you can use Gradle for dependency management. The steps will be similar but for this guide, we'll use Maven.

## Setting up the Project

Let's create a new Spring Boot project using [Spring Initializr](https://start.spring.io/) with the following dependencies:

- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Flyway Migration

![](https://imgur.com/KRACyq7.png)

Once you've selected the dependencies, click "Generate" to download the project. Then, extract the ZIP file and open it in your favorite IDE.

2. If you're using Maven, your `pom.xml` should include these dependencies:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

## Configuring the Database Connection

Now that we have our project set up, let's configure the database connection.

To configure your Neon database connection details, open the `application.properties` file in `src/main/resources` and add the following properties:

```properties
spring.datasource.url=jdbc:postgresql://<your-neon-hostname>/<your-database-name>
spring.datasource.username=<your-username>
spring.datasource.password=<your-password>

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate

spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

Replace the placeholders with your actual Neon database credentials.

Note that we set `spring.jpa.hibernate.ddl-auto=validate` to prevent Hibernate from automatically modifying the schema. Flyway will handle all schema changes.

To learn more about managing your database schema using Hibernate, refer to the [Database Schema Changes with Hibernate, Spring Boot, and Neon](/guides/spring-boot-hibernate) guide.

## Creating Migration Scripts

Flyway uses SQL scripts for migrations. These scripts should be placed in the `src/main/resources/db/migration` directory.

Unlike other migration tools, Flyway uses a version-based naming convention for migration scripts so that it can track the order in which they should be applied. This ensures that migrations are applied in the correct order and only once, but you need to be careful when renaming or modifying existing scripts.

Naming convention for migration scripts:

- `V<VERSION>__<DESCRIPTION>.sql`
- Example: `V2__Create_users_table.sql`

We will start with `V2__` as the first migration script, as Flyway will use `V1__` for its internal schema history table.

Let's create our first migration script:

1. Create a file named `V2__Create_users_table.sql` in `src/main/resources/db/migration`:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

2. Create another file named `V3__Create_posts_table.sql`:

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

These scripts will create the `users` and `posts` tables in your Neon database when you run the migrations.

## Running Migrations

Now that we've configured Flyway with our Spring Boot application and Neon database, we can proceed to run the database migrations.

There are two primary methods to execute Flyway migrations: using the Flyway Maven plugin or programmatically through the Flyway API. Let's explore both approaches in detail.

### 1. Using the Flyway Maven Plugin

The Flyway Maven plugin allows you to run migrations directly from the command line, which can be useful for CI/CD pipelines or local development.

First, add the Flyway Maven plugin to your `pom.xml` file:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-maven-plugin</artifactId>
            <version>8.0.0</version>
            <configuration>
				<url>jdbc:postgresql://<your_neon_hostname>/neondb?sslmode=require</url>
                <user>${spring.datasource.username}</user>
                <password>${spring.datasource.password}</password>
                <locations>
                    <location>classpath:db/migration</location>
                </locations>
            </configuration>
        </plugin>
    </plugins>
</build>
```

Next, run the following command to create the schema history table in your database:

```bash
mvn flyway:baseline
```

This will create the `flyway_schema_history` table if it doesn't already exist. The table is used by Flyway to track the applied migrations.

Now, you can run the following command to apply pending migrations:

```bash
mvn flyway:migrate
```

This command will execute all pending migrations in the order defined by their version numbers.

Additional useful Flyway Maven plugin commands include:

- `mvn flyway:info`: Displays the status of all migrations. This includes the version, description, type, and state of each migration.
- `mvn flyway:validate`: Validates the applied migrations against the available ones. This ensures that the schema history table is correct and that all migrations were applied successfully.
- `mvn flyway:repair`: Repairs the schema history table. This command is useful if you manually modify the schema history table or if a migration fails.

### 2. Using the Flyway API Programmatically

For more fine-grained control or to integrate migration execution within your application lifecycle, you can use the Flyway API programmatically.

Start by creating a configuration class to set up the Flyway bean:

```java
package com.example.neon;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;

@Configuration
public class FlywayConfig {

    @Bean(initMethod = "migrate")
    public Flyway flyway(DataSource dataSource) {
        return Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .load();
    }
}
```

This configuration automatically triggers the migration when the application starts. You can now run your Spring Boot application to apply the migrations:

```bash
mvn spring-boot:run
```

Alternatively, if you want more control over when migrations run, you can remove the `initMethod = "migrate"` and call the `migrate()` method manually:

```java
@Service
public class DatabaseMigrationService {

    private final Flyway flyway;

    @Autowired
    public DatabaseMigrationService(Flyway flyway) {
        this.flyway = flyway;
    }

    public void migrateDatabase() {
        flyway.migrate();
    }
}
```

You can then inject this service and call the `migrateDatabase()` method when appropriate, such as during application startup or as part of a maintenance routine.

## Handling Schema Changes

As your application evolves, you'll need to make changes to your database schema. Here's how to handle common scenarios:

### Adding a New Column

To add a new column to an existing table, you will just need to create a new migration script with the `ALTER TABLE` statement.

Create a new migration script, e.g., `V4__Add_user_role.sql`:

```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20);
```

After adding the new migration script, you can run the migration using the Flyway Maven plugin or programmatically by starting the Spring Boot application depending on your preferred method.

### Modifying an Existing Column

To modify an existing column, you can create a new migration script with the `ALTER TABLE` statement, e.g., `V5__Modify_user_role.sql`:

```sql
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
```

After adding the new migration script, you can check the status of your migrations using the Flyway Maven plugin:

```bash
mvn flyway:info
```

You should see the new migration in the list with a `Pending` state indicating that it hasn't been applied yet:

```sql
+-----------+---------+-----------------------+----------+---------------------+----------+
| Category  | Version | Description           | Type     | Installed On        | State    |
+-----------+---------+-----------------------+----------+---------------------+----------+
|           | 1       | << Flyway Baseline >> | BASELINE | 2024-09-07 16:27:26 | Baseline |
| Versioned | 2       | Create users table    | SQL      | 2024-09-07 16:34:20 | Success  |
| Versioned | 3       | Create posts table    | SQL      | 2024-09-07 16:34:23 | Success  |
| Versioned | 4       | Add user role         | SQL      | 2024-09-07 16:40:03 | Success  |
| Versioned | 5       | Modify user role      | SQL      |                     | Pending  |
+-----------+---------+-----------------------+----------+---------------------+----------+
```

Then run the migration using your preferred method to apply the changes.

### Creating a New Table

To create a new table, you would just add a new migration script with the `CREATE TABLE` statement, e.g., `V6__Create_comments_table.sql`:

```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Handling Rollbacks

The Flyway Community Edition doesn't support automatic rollbacks. When you need to roll back a migration, you can create a new migration script to undo the changes. This script should be named with a higher version number than the original migration.

Create a file named `V7__Remove_user_role.sql`:

```sql
ALTER TABLE users DROP COLUMN role;
```

Then run the migration as usual to apply the rollback. This will remove the `role` column from the `users` table as defined in the script.

The Flyway Pro and Enterprise Editions offer additional features like `undo` and `repair` commands for automatic rollback and fixing failed migrations. You can explore these options if you require more advanced rollback capabilities.

## Best Practices

There are several things to keep in mind when managing database migrations:

1. Always keep your migration scripts in version control along with your application code.

2. Make sure that your migrations can be applied multiple times without changing the result beyond the initial application.

3. When possible, write migrations that are backward compatible with the previous version of your application. This will make it easier to roll back changes if needed.

4. Test your migrations thoroughly in a non-production environment before applying them to production. A great way to do this is by using the Neon branching feature to create a separate environment for testing with your production data without affecting the live environment.

5. Once a migration has been applied to any environment, avoid modifying it. Instead, create a new migration to make further changes.

## Conclusion

Using Flyway with Spring Boot and Neon Postgres provides a production ready solution for managing database schema changes. By following these practices, you can ensure that your database schema evolves safely and consistently across all environments.

Remember to always test your migrations thoroughly and have a solid backup and rollback strategy in place. Neon's features like branching and point-in-time recovery can be a great addition to your already existing lifecycle of your database schema.

## Additional Resources

- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Spring Boot Flyway Integration](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway)
- [Neon Documentation](/docs)

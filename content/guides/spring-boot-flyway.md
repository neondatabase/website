---
title: Database migrations in Spring Boot with Flyway and Neon
subtitle: Learn how to manage database schema changes in a Spring Boot application using Flyway with Lakebase Postgres.
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-09-07T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

As your application grows, you need a reliable way to manage database schema changes across different environments.

This guide walks you through setting up and using [Flyway](https://github.com/flyway/flyway) for database migrations in a [Spring Boot](https://github.com/spring-projects/spring-boot) application with Lakebase Postgres.

## Prerequisites

Before we begin, ensure you have:

- Java Development Kit installed
- [Maven](https://maven.apache.org/) for dependency management
- A [Neon](https://console.neon.tech/signup) account
- Basic familiarity with Spring Boot and SQL

Instead of Maven, you can use Gradle for dependency management. The steps are similar, but this guide uses Maven.

## Setting up the project

1. Let's create a new Spring Boot project using [Spring Initializr](https://start.spring.io/) with the following dependencies:
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Flyway Migration

   ![](https://imgur.com/KRACyq7.png)

   Once you've selected the dependencies, click "Generate" to download the project. Then, extract the ZIP file and open it in your IDE.

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

## Configuring the database connection

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

Replace the placeholders with your Neon database credentials. Use a direct (non-pooled) connection string, without the `-pooler` suffix in the hostname, for Flyway. Neon's pooled connection uses PgBouncer in transaction mode, which doesn't support all the session-level operations that migration tools rely on. See [Connection pooling](/docs/connect/connection-pooling).

Note that we set `spring.jpa.hibernate.ddl-auto=validate` to prevent Hibernate from automatically modifying the schema. Flyway will handle all schema changes.

To learn more about managing your database schema using Hibernate, refer to the [Database Schema Changes with Hibernate, Spring Boot, and Neon](/guides/spring-boot-hibernate) guide.

## Creating migration scripts

Flyway uses SQL scripts for migrations. These scripts should be placed in the `src/main/resources/db/migration` directory.

Flyway uses a version-based naming convention for migration scripts to track the order in which to apply them. Each migration is applied once, in version order, so be careful when renaming or modifying existing scripts.

Naming convention for migration scripts:

- `V<VERSION>__<DESCRIPTION>.sql`
- Example: `V2__Create_users_table.sql`

This guide starts with `V2__` as the first migration script. The `mvn flyway:baseline` command later in this guide marks version 1 as the baseline, and Flyway skips migrations at or below the baseline version.

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

## Running migrations

You can run Flyway migrations with the Flyway Maven plugin or programmatically through the Flyway API.

### 1. Using the Flyway Maven plugin

The Flyway Maven plugin allows you to run migrations directly from the command line, which works for CI/CD pipelines and local development.

First, add the Flyway Maven plugin to your `pom.xml` file:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-maven-plugin</artifactId>
            <version>8.0.0</version>
            <configuration>
				<url>jdbc:postgresql://<your_neon_hostname>/neondb?sslmode=require&channel_binding=require</url>
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

Other Flyway Maven plugin commands include:

- `mvn flyway:info`: Displays the status of all migrations. This includes the version, description, type, and state of each migration.
- `mvn flyway:validate`: Validates the applied migrations against the available ones. This ensures that the schema history table is correct and that all migrations were applied successfully.
- `mvn flyway:repair`: Repairs the schema history table. This command is useful if you manually modify the schema history table or if a migration fails.

### 2. Using the Flyway API programmatically

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

## Handling schema changes

As your application evolves, you'll need to make changes to your database schema. Here's how to handle common scenarios:

### Adding a new column

To add a new column to an existing table, create a new migration script with the `ALTER TABLE` statement.

Create a new migration script, e.g., `V4__Add_user_role.sql`:

```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20);
```

After adding the new migration script, you can run the migration using the Flyway Maven plugin or programmatically by starting the Spring Boot application depending on your preferred method.

### Modifying an existing column

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

### Creating a new table

To create a new table, add a new migration script with the `CREATE TABLE` statement, e.g., `V6__Create_comments_table.sql`:

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

## Handling rollbacks

The Flyway Community Edition doesn't support automatic rollbacks. When you need to roll back a migration, you can create a new migration script to undo the changes. This script should be named with a higher version number than the original migration.

Create a file named `V7__Remove_user_role.sql`:

```sql
ALTER TABLE users DROP COLUMN role;
```

Then run the migration as usual to apply the rollback. This will remove the `role` column from the `users` table as defined in the script.

Paid Flyway editions add `undo` migrations for automatic rollback. The `repair` command covered earlier is available in all editions.

## Best practices

Keep the following in mind when managing database migrations:

1. Always keep your migration scripts in version control along with your application code.

2. Make sure that your migrations can be applied multiple times without changing the result beyond the initial application.

3. When possible, write migrations that are backward compatible with the previous version of your application. This will make it easier to roll back changes if needed.

4. Test your migrations in a non-production environment before applying them to production. With [Neon branching](/docs/introduction/branching), you can create a copy of your production data to test against without affecting the live database.

5. Once a migration has been applied to any environment, avoid modifying it. Instead, create a new migration to make further changes.

## Conclusion

You now have a Spring Boot application that applies versioned Flyway migrations to Lakebase Postgres, either from Maven or at application startup. As a next step, run your migrations against a Neon branch in CI before applying them to production, and use [instant restore](/docs/postgres/backup-restore/branch-restore) if you need to roll back data.

## Additional resources

- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Spring Boot Flyway Integration](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway)
- [Neon Documentation](/docs)

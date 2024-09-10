---
title: Database Schema Changes with Hibernate, Spring Boot, and Neon
subtitle: Learn how to manage database schema changes with Hibernate, Spring Boot, and Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-09-07T00:00:00.000Z'
updatedOn: '2024-09-07T00:00:00.000Z'
---

Managing database schema changes is an important aspect of any application development lifecycle.

When using Hibernate ORM with Spring Boot and Neon Postgres, you have several options for handling schema evolution.

This guide will explore different approaches, their pros and cons, and best practices for managing database schema changes.

## Prerequisites

Before we begin, ensure you have:

- Java Development Kit (JDK) 11 or later
- Maven or Gradle for dependency management
- A [Neon](https://console.neon.tech/signup) account for serverless Postgres
- Basic familiarity with Spring Boot, Hibernate, and JPA concepts

## Setting up the Project

1. Create a new Spring Boot project using [Spring Initializr](https://start.spring.io/) with the following dependencies:

   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver

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
           <groupId>org.postgresql</groupId>
           <artifactId>postgresql</artifactId>
           <scope>runtime</scope>
       </dependency>
   </dependencies>
   ```

3. Extract the project and open it in your favorite IDE.

## Configuring the Database Connection

Next, configure your application to connect to a Neon Postgres database. To do that define your Neon database connection in `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://<your-neon-hostname>/<your-database-name>
spring.datasource.username=<your-username>
spring.datasource.password=<your-password>
```

Replace the placeholders with your actual Neon database credentials.

While modifying the `application.properties` file, you can also configure Hibernate's DDL behavior and other properties:

```
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

We will revisit the `spring.jpa.hibernate.ddl-auto` property later in this guide.

## Approaches to Schema Management

Before we dive into specific schema changes, let's explore different approaches to managing schema changes with Hibernate and Spring Boot.

### 1. Hibernate Auto DDL (Development Only)

The `spring.jpa.hibernate.ddl-auto` property controls Hibernate's schema generation behavior.

The different possible values are:

- `create`: Drops and recreates the schema on each startup
- `create-drop`: Creates the schema on startup and drops it on shutdown
- `update`: Updates the schema if necessary and doesn't drop existing tables
- `validate`: Validates the schema but makes no changes
- `none`: Disables DDL handling

For development, you might use the `update` strategy in your `application.properties`:

```properties
spring.jpa.hibernate.ddl-auto=update
```

This allows Hibernate to automatically update the schema based on your entity classes.

**Pros:**

- Easy to use during development
- Automatically reflects changes in entity classes

**Cons:**

- Not suitable for production use due to potential data loss or corruption
- Doesn't provide fine-grained control over schema changes

The `update` strategy is useful for development but should be avoided in production environments due to the risk of data loss or corruption.

Another option is to use `validate` in production to prevent accidental schema changes. Or you can disable auto DDL and manage schema changes manually or programmatically.

A handy option is to use `create-drop` for integration tests to recreate the schema before each test run. This ensures a clean database state for each test, however you should not use this in production as it will drop the database on shutdown.

### 2. Schema Generation Scripts

Hibernate can generate schema creation and update scripts based on your entity mappings.

Add these properties to `application.properties`:

```properties
spring.jpa.properties.javax.persistence.schema-generation.scripts.action=create
spring.jpa.properties.javax.persistence.schema-generation.scripts.create-target=create.sql
spring.jpa.properties.javax.persistence.schema-generation.scripts.create-source=metadata
```

This generates a `create.sql` file in your project root, which you can then manually review and apply to your database.

**Pros:**

- Provides a SQL script that you can review and modify
- Allows for version control of schema changes

**Cons:**

- Requires manual application of scripts
- Doesn't handle incremental updates well

### 3. Programmatic Schema Management

You can use Hibernate's `SchemaManagementTool` for more control over schema updates. This allows you to programmatically create, update, or validate the schema.

You can call this method on application startup or trigger it manually when needed.

**Pros:**

- Provides programmatic control over schema updates
- Can be integrated into your application's lifecycle

**Cons:**

- Requires careful management to avoid unintended schema changes
- May not handle all types of schema changes smoothly

### 4. Using a Migration Tool (Recommended for Production)

For production environments, it's recommended to use a dedicated migration tool like Flyway or Liquibase. These tools provide better control, versioning, and rollback capabilities.

To use Flyway, add the dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

Then create migration scripts in `src/main/resources/db/migration` following Flyway's naming convention (e.g., `V1__Create_user_table.sql`).

**Pros:**

- Provides fine-grained control over schema changes
- Supports versioning and rollbacks
- Works well in production environments

**Cons:**

- Requires manual creation of migration scripts
- Adds complexity to the development process

For more information on using Flyway with Spring Boot, refer to the [Database Migrations in Spring Boot with Flyway and Neon](/guides/spring-boot-flyway) guide.

## Using Hibernate auto DDL

Now that we've covered different approaches to schema management, let's look at how to handle specific schema changes using Hibernate and Spring Boot with Neon Postgres.

As we pointed out earlier, Hibernate's auto DDL feature is convenient for development but not recommended for production use. Let's see how it works and how to handle common schema changes.

Start by setting `spring.jpa.hibernate.ddl-auto=update` in your `application.properties` file and then follow the examples below.

### Creating a New Entity

Once you've set the Hibernate auto DDL property to `update`, Hibernate will automatically create tables based on your entity classes. Start by creating a new entity class in your project called `Product`:

```java
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;
}
```

When you run your Spring Boot application, Hibernate will create the `products` table automatically with the `id`, `name`, and `price` columns based on your entity class.

### Adding a New Column

Now that you have the `Product` entity, let's add a new column to the `products` table.

1. Add the new field to your entity class:

   ```java
   @Entity
   public class Product {
       // ...existing fields

       @Column(name = "description")
       private String description;
   }
   ```

Run your application, and Hibernate will automatically add the `description` column to the `products` table. Quite convenient for development!

### Renaming and Dropping Columns

When using `update`, Hibernate doesn't handle column rename or drop operations automatically. You'll need to use migration scripts for these changes.

1. Update the `@Column` annotation in your entity:

   ```java
   @Column(name = "new_column_name")
   private String oldColumnName;
   ```

2. Create a migration script to rename the column:

   ```sql
   ALTER TABLE users RENAME COLUMN old_column_name TO new_column_name;
   ```

The same applies to dropping columns, where you'll need to create a migration script to drop the column from the table:

    ```sql
    ALTER TABLE users DROP COLUMN column_name;
    ```

For those types of changes, you should use a migration tool like Flyway or Liquibase to manage the schema changes.

An alternative approach here is to, use `create` or `create-drop` for `spring.jpa.hibernate.ddl-auto`. This will recreate the schema on each startup, which can be useful for development but can not be used in production as it will lead to data loss.

## Best Practices

With the various approaches to schema management in mind, here are some best practices to follow when managing database schema changes with Hibernate, Spring Boot, and Neon Postgres:

1. While Hibernate's auto DDL is convenient for development, use a dedicated migration tool like [Flyway](/guides/spring-boot-flyway) for production environments.

2. Keep your entity classes and migration scripts in version control.

3. Always test schema changes in a non-production environment before applying them to production. A great way to do this is by using Neon's [branching feature](/docs/introduction/branching).

4. When possible, make schema changes that are backward compatible with the previous version of your application.

5. Make small, incremental changes rather than large, sweeping changes to your schema.

6. When using Hibernate's schema generation, always review the generated SQL before applying it to your database.

## Conclusion

Managing database schema changes with Hibernate, Spring Boot, and Neon requires careful consideration of your development workflow and production requirements.

While Hibernate's auto DDL feature is convenient for development, a more controlled approach using migration tools is recommended for production environments.

Always test your schema changes thoroughly in a non-production environment before applying them to your production database. With careful planning and the right tools, you can maintain a flexible and evolving database schema that supports your application's growth.

## Additional Resources

- [Hibernate ORM Documentation](https://hibernate.org/orm/documentation/5.4/)
- [Spring Boot JPA Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/data.html#data.sql.jpa-and-spring-data)
- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Neon Documentation](/docs)

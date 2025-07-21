---
title: Using GORM with Neon Postgres
subtitle: Learn how to use GORM, Go's most popular ORM, with Neon's serverless Postgres for efficient database operations
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-02-15T00:00:00.000Z'
updatedOn: '2025-02-15T00:00:00.000Z'
---

[GORM](https://gorm.io/) is Go's most popular ORM library, providing a developer-friendly interface to interact with databases. When combined with Neon's serverless Postgres, it creates a great foundation for building scalable Go applications with minimal database management overhead.

This guide walks you through the process of integrating GORM with Neon Postgres, we will cover everything that you need to know to get started with GORM and Neon Postgres.

## Prerequisites

Before getting started, make sure you have:

- [Go](https://golang.org/dl/) 1.18 or later installed
- A [Neon](https://console.neon.tech/signup) account
- Basic familiarity with Go and SQL

## Setting Up Your Environment

### Create a Neon Project

If you don't have one already, create a Neon project:

1. Navigate to the [Projects page](https://console.neon.tech/app/projects) in the Neon Console
2. Click **New Project**
3. Specify your project settings and click **Create Project**

Save your connection details including your password. You'll need these when configuring your Go application.

### Initialize Your Go Project

Let's begin by setting up your project structure. In Go, projects are organized as modules, which manage dependencies and package versioning. A module is initialized with a unique module path that distinguishes your project in the Go ecosystem.

Start by creating a new directory for your project and initializing a Go module:

```bash
mkdir neon-gorm-example
cd neon-gorm-example
go mod init example.com/neon-gorm
```

This creates a `go.mod` file that will track your project's dependencies. The `example.com/neon-gorm` is the module path and should be replaced with your own domain or GitHub repository if you plan to publish your code.

### Install Required Packages

Now we need to install the packages our application will depend on. For this guide, we'll need two main packages:

1. **GORM** - The ORM library that provides a developer-friendly interface to interact with the database
2. **GORM Postgres Driver** - The database driver that allows GORM to connect to Postgres databases

Run the following commands to install these packages:

```bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
```

These commands fetch the latest versions of the packages and add them to your project's `go.mod` file. The `-u` flag ensures you get the most recent version of each package.

## Connecting to Neon with GORM

### Basic Connection Setup

Now let's establish a connection to your Neon Postgres database using GORM. This is an essential step that initializes the database connection that we'll use throughout our application.

Create a new file named `main.go` with the following code:

```go
package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	// Connection string for Neon Postgres
	dsn := "postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"

	// Connect to the database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info), // Set to Info level for development
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Get the underlying SQL DB object
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get DB object: %v", err)
	}

	// Verify connection
	if err := sqlDB.Ping(); err != nil {
		log.Fatalf("Failed to ping DB: %v", err)
	}

	fmt.Println("Successfully connected to Neon Postgres database!")
}
```

In this code, we're performing several important steps:

1. Defining a DSN - this is the connection string that contains all the information needed to connect to your Neon database
2. Using `gorm.Open()` to establish a connection with the Postgres driver
3. Configuring GORM's logger to show SQL queries during development, which helps with debugging
4. Getting the underlying `*sql.DB` object to access lower-level database functions
5. Verifying the connection is active by pinging the database

Make sure to replace `[user]`, `[password]`, `[neon_hostname]`, and `[dbname]` with your actual Neon database credentials. The `?sslmode=require&channel_binding=require` part of the connection string ensures secure communication with your Neon database.

Replace `[user]`, `[password]`, `[neon_hostname]`, and `[dbname]` with your actual Neon connection details. You can find these by clicking the **Connect** button on your Neon **Project Dashboard**.

### Connection Pooling and Configuration

Connection pooling is a technique that maintains a set of reusable database connections. This significantly improves performance by avoiding the overhead of establishing a new database connection for each operation.

#### Neon Connection Pooling

Neon provides a **built-in connection pooler**, powered by PgBouncer, to efficiently manage database connections. This pooler reduces connection overhead by reusing a limited number of persistent Postgres connections while supporting thousands of client sessions.

Instead of each request opening a new database connection, the pooler transparently distributes queries across existing backend connections, improving performance and scalability. To use it, simply enable connection pooling in the Neon console and update your connection string to include `-pooler` in the hostname.

This approach helps applications handle high concurrency while minimizing latency and resource consumption. However, since Neon's pooler operates in **transaction pooling mode**, session-based features like `LISTEN/NOTIFY`, `SET search_path`, and server-side prepared statements are not supported. For operations that require session persistence, it's best to use a direct (non-pooled) connection. You can find more details in the [Neon connection pooling documentation](/docs/connect/connection-pooling).

#### Configuring Connection Pooling in GORM

When using Go with Neon, GORM offers built-in connection pooling that works seamlessly with Neon's pooler. By configuring settings like `SetMaxOpenConns` and `SetConnMaxIdleTime`, developers can fine-tune how connections are managed within their application before they reach the database layer.

Since Neon already optimizes pooling on the database side, applications should maintain a moderate number of open connections to avoid excessive connection churn.

The recommended approach is to use a pooled connection string for normal queries and switch to a direct connection for migration tasks that require session state. For guidance on configuring connection pooling in Go, refer to the [GORM connection documentation](https://gorm.io/docs/generic_interface.html#Connection-Pool).

## Defining Models

In GORM, models are Go structs that represent tables in your database. Each field in the struct maps to a column in the table, and GORM uses struct tags (annotations enclosed in backticks) to configure how these fields are handled in the database.

Let's create a simple blogging application with `User` and `Post` models. These models will define the structure of our database tables and establish relationships between them.

```go
package main

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user in the system
type User struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Name      string         `gorm:"size:255;not null"`
	Email     string         `gorm:"size:255;not null;uniqueIndex"`
	Posts     []Post         `gorm:"foreignKey:UserID"`
}

// Post represents a blog post
type Post struct {
	ID        uint           `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Title     string         `gorm:"size:255;not null"`
	Content   string         `gorm:"type:text"`
	UserID    uint           `gorm:"not null"`
	User      User           `gorm:"foreignKey:UserID"`
}
```

Let's examine the key components of these models:

1. **Basic Fields**: `ID`, `CreatedAt`, `UpdatedAt`, and `DeletedAt` are standard fields in GORM models. They handle primary keys, timestamps, and soft deletion.

2. **Field Tags**: The struct tags like `gorm:"size:255;not null"` define constraints and properties for each field:
   - `primaryKey`: Designates a field as the table's primary key
   - `size:255`: Sets the column's maximum length
   - `not null`: Ensures the field cannot be empty
   - `uniqueIndex`: Creates a unique index on the column
   - `type:text`: Specifies the SQL data type

3. **Relationships**: The `Posts` field in the User model and the `User` field in the Post model establish a one-to-many relationship. The `foreignKey` tag specifies which field serves as the foreign key.

By default, GORM will pluralize struct names to create table names (e.g., "User" becomes "users"), but you can customize this using the `TableName` method or the `gorm:"tableName:custom_name"` tag. This is similar to how other ORMs like Sequelize and Elequent work.

GORM provides sensible defaults for table names (pluralized struct names) and column names (field names), but you can customize these using struct tags.

## Automatic Migrations

Migrations are a way to manage database schema changes over time. GORM provides a convenient `AutoMigrate` feature that automatically creates tables, indexes, constraints, and foreign keys based on your model definitions.

While this automation is extremely useful during development, it's worth noting that for production environments, you'll typically want more control over schema changes. We'll cover structured migrations for production later in this guide, but for now, let's see how to use GORM's automatic migrations for development.

Here's how to set up automatic migrations:

```go
func main() {
	// Connection setup (as shown above)

	// Auto-migrate the schema
	err = db.AutoMigrate(&User{}, &Post{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	fmt.Println("Database migrated successfully!")
}
```

When you run this code, GORM will:

1. Check if the tables exist, and create them if they don't
2. Add missing columns to existing tables
3. Create indexes and constraints
4. Establish foreign key relationships between tables

The `AutoMigrate` function works by comparing your Go struct definitions to the actual database schema and making necessary changes to align them. It accepts a list of model struct pointers and returns an error if something goes wrong.

Note that `AutoMigrate` only adds things that are missing—it won't delete columns or tables that exist in the database but not in your models. This is a safety feature to prevent accidental data loss.

This will create the necessary tables if they don't exist and update them to match your model definitions.

## Basic CRUD Operations

Now that we have our models and database connection set up, let's perform basic Create, Read, Update, and Delete (CRUD) operations:

### Creating Records

Now that we have our models defined and tables created, let's start adding data to our database. GORM makes it straightforward to create new records with the `Create` method.

Let's add a user and a blog post to our database:

```go
// Create a new user
user := User{
	Name:  "John Doe",
	Email: "john@example.com",
}
result := db.Create(&user)
if result.Error != nil {
	log.Fatalf("Failed to create user: %v", result.Error)
}
fmt.Printf("Created user with ID: %d\n", user.ID)

// Create a post for the user
post := Post{
	Title:   "Getting Started with GORM and Neon",
	Content: "GORM makes it easy to work with databases in Go...",
	UserID:  user.ID,
}
result = db.Create(&post)
if result.Error != nil {
	log.Fatalf("Failed to create post: %v", result.Error)
}
fmt.Printf("Created post with ID: %d\n", post.ID)
```

Here's what happens in this code:

1. We create a new `User` struct instance with basic information
2. We pass a pointer to this struct to the `db.Create()` method, which inserts it into the database
3. GORM automatically handles generating the primary key ID, timestamps, and other default values
4. After successful creation, the user's generated ID is populated in the `user.ID` field
5. We then create a `Post` struct, setting the `UserID` field to establish the relationship with our user
6. We insert the post into the database using the same `Create` method

Notice how GORM returns a `result` object that contains an `Error` field. Always check this field to ensure your database operations succeeded. The result object also provides other useful information like the number of rows affected by the operation.

### Reading Records

Reading data from the database is one of the most common operations in any application. GORM provides several methods for retrieving data, from simple lookups to complex queries.

Let's look at different ways to retrieve data from our database:

```go
// Retrieve a user by ID
var retrievedUser User
result = db.First(&retrievedUser, user.ID)
if result.Error != nil {
	log.Fatalf("Failed to retrieve user: %v", result.Error)
}
fmt.Printf("Retrieved user: %s (%s)\n", retrievedUser.Name, retrievedUser.Email)

// Retrieve a user with their posts
var userWithPosts User
result = db.Preload("Posts").First(&userWithPosts, user.ID)
if result.Error != nil {
	log.Fatalf("Failed to retrieve user with posts: %v", result.Error)
}
fmt.Printf("User %s has %d posts\n", userWithPosts.Name, len(userWithPosts.Posts))

// Find users with specific criteria
var users []User
result = db.Where("name LIKE ?", "%John%").Find(&users)
if result.Error != nil {
	log.Fatalf("Failed to find users: %v", result.Error)
}
fmt.Printf("Found %d users with 'John' in their name\n", len(users))
```

Let's break down these query operations:

1. **Simple Retrieval**: The `First` method retrieves the first record that matches the condition. In our first example, we're finding a user by their ID, which should return exactly one record since IDs are unique.

2. **Eager Loading with Preload**: The `Preload` method allows us to load related records in a single query. In our second example, we load a user and all their posts in one go. This is more efficient than performing separate queries for the user and their posts.

3. **Conditional Queries with Where**: The `Where` method allows us to specify conditions for our queries. In our third example, we're using the SQL `LIKE` operator to find users whose names contain "John". The `?` is a placeholder that helps prevent SQL injection attacks.

GORM provides many other query methods that we haven't covered here, such as:

- `Last`: Retrieves the last record matching the condition
- `Take`: Retrieves a record without any specified order
- `Pluck`: Retrieves a single column from the database as a slice
- `Count`: Returns the number of records matching the condition

All these methods return a result object that contains an `Error` field, which should be checked to ensure the query was successful.

### Updating Records

GORM provides several methods for updating records in the database. You can update a single field, multiple fields, or even use more complex update operations.

Let's look at how to update our user and post records:

```go
// Update a user's email
result = db.Model(&user).Update("email", "johndoe@example.com")
if result.Error != nil {
	log.Fatalf("Failed to update user: %v", result.Error)
}

// Update multiple fields at once
result = db.Model(&post).Updates(Post{
	Title:   "Updated: Getting Started with GORM and Neon",
	Content: "Updated content about GORM and Neon...",
})
if result.Error != nil {
	log.Fatalf("Failed to update post: %v", result.Error)
}
```

Here's what's happening in these update operations:

1. **Single Field Update**: The `Update` method allows us to change a single column's value. In the first example, we're updating the user's email address. We use the `Model` method to specify which record to update (based on its primary key).

2. **Multiple Field Update**: The `Updates` method allows us to change multiple columns at once. We provide a struct with the fields we want to update. Note that GORM will only update non-zero fields by default, which means fields with their zero values (empty string, 0, false, etc.) won't be updated unless you use `Updates` with a map.

GORM also offers other update methods:

- **Update with conditions**: `db.Model(&User{}).Where("name = ?", "john").Update("name", "jane")`
- **Batch updates**: `db.Table("users").Where("role = ?", "admin").Update("active", true)`
- **Raw SQL updates**: `db.Exec("UPDATE users SET name = ? WHERE age > ?", "Jane", 20)`

When updating records, GORM automatically sets the `UpdatedAt` field to the current time if your model includes this field. This helps track when records were last modified.

### Deleting Records

GORM provides two types of deletion: soft deletion and hard deletion. Soft deletion marks records as deleted without actually removing them from the database, while hard deletion permanently removes records.

Let's see how to perform both types of deletions:

```go
// Soft delete a post (with GORM's DeletedAt field)
result = db.Delete(&post)
if result.Error != nil {
	log.Fatalf("Failed to delete post: %v", result.Error)
}

// Hard delete a post (permanently remove from database)
result = db.Unscoped().Delete(&post)
if result.Error != nil {
	log.Fatalf("Failed to permanently delete post: %v", result.Error)
}
```

Here's what's happening in these deletion operations:

1. **Soft Deletion**: When we call `Delete` on a model that has a `DeletedAt` field (like our models do thanks to `gorm.Model`), GORM performs a soft delete. This doesn't actually remove the record from the database; instead, it sets the `DeletedAt` field to the current time. Subsequent queries will automatically exclude these "deleted" records unless you explicitly include them.

2. **Hard Deletion**: The `Unscoped` method tells GORM to ignore the soft delete mechanism and perform a true deletion, permanently removing the record from the database. This is used when you really want to delete data, not just hide it.

Soft deletion is particularly useful for:

- Keeping an audit trail of records
- Allowing data to be restored if deleted accidentally
- Maintaining referential integrity in related data
- Meeting regulatory requirements that prohibit true deletion

By default, GORM queries won't return soft-deleted records. If you need to include them, you can use the `Unscoped` method: `db.Unscoped().Where("name = ?", "John").Find(&users)`.

## Advanced GORM Features

With the basics covered, let's explore some advanced features of GORM that can help you build more robust and efficient applications.

### Transactions

Transactions are a way to group multiple database operations into a single unit of work. They ensure that either all operations succeed or none of them do, maintaining data consistency. This is especially important when you have multiple related changes that need to happen together.

GORM provides comprehensive support for database transactions:

```go
// Begin a transaction
tx := db.Begin()

// Perform operations within the transaction
user := User{Name: "Transaction User", Email: "tx@example.com"}
if err := tx.Create(&user).Error; err != nil {
	tx.Rollback() // Rollback if there's an error
	log.Fatalf("Failed to create user in transaction: %v", err)
}

post := Post{
	Title:   "Post in Transaction",
	Content: "This post is created in a transaction",
	UserID:  user.ID,
}
if err := tx.Create(&post).Error; err != nil {
	tx.Rollback() // Rollback if there's an error
	log.Fatalf("Failed to create post in transaction: %v", err)
}

// Commit the transaction
if err := tx.Commit().Error; err != nil {
	log.Fatalf("Failed to commit transaction: %v", err)
}
```

Let's break down how transactions work in GORM:

1. **Begin a Transaction**: The `Begin` method starts a new transaction and returns a transaction object.
2. **Perform Operations**: Use the transaction object (instead of the regular db object) to perform database operations. All operations will be part of the transaction.
3. **Rollback or Commit**: If any operation fails, call `Rollback` to cancel all changes. If all operations succeed, call `Commit` to permanently apply the changes to the database.

Transactions are essential in scenarios like:

- Creating a user and their profile simultaneously
- Transferring funds between accounts
- Processing an order with multiple line items

They help maintain data integrity by ensuring that related operations either all succeed or all fail, preventing partial updates that could leave your database in an inconsistent state.

For a more elegant and concise approach, GORM provides a transaction helper method that automatically handles the begin, commit, and rollback operations:

```go
err := db.Transaction(func(tx *gorm.DB) error {
	user := User{Name: "Transaction User", Email: "tx@example.com"}
	if err := tx.Create(&user).Error; err != nil {
		return err
	}

	post := Post{
		Title:   "Post in Transaction",
		Content: "This post is created in a transaction",
		UserID:  user.ID,
	}
	if err := tx.Create(&post).Error; err != nil {
		return err
	}

	return nil
})

if err != nil {
	log.Fatalf("Transaction failed: %v", err)
}
```

This approach is generally preferred for several reasons:

1. **Simplified Error Handling**: You simply return an error from the closure function, and GORM automatically rolls back the transaction if an error is returned.
2. **Cleaner Code**: The transaction logic is encapsulated in a single function, making the code more readable.
3. **Automatic Resource Management**: GORM ensures that the transaction is properly closed whether it succeeds or fails, preventing resource leaks.

With this method, you focus on the business logic inside the transaction rather than managing the transaction lifecycle. If the function returns nil, the transaction is committed; if it returns an error, the transaction is rolled back automatically.

### Raw SQL and Complex Queries

While GORM's built-in query methods are powerful and cover most common scenarios, sometimes you need more control or have complex requirements that are best expressed in raw SQL. GORM provides several ways to work with raw SQL while still benefiting from its safety features and result handling.

Here are different approaches to executing raw SQL and complex queries:

```go
// Execute raw SQL
var result []map[string]interface{}
db.Raw("SELECT u.name, COUNT(p.id) as post_count FROM users u LEFT JOIN posts p ON u.id = p.user_id GROUP BY u.name").Scan(&result)

// Combined with GORM methods
var users []User
db.Raw("SELECT * FROM users WHERE name = ?", "John").Scan(&users)

// Complex queries
var userStats []struct {
	UserName  string
	PostCount int
}
db.Table("users").
	Select("users.name as user_name, COUNT(posts.id) as post_count").
	Joins("left join posts on posts.user_id = users.id").
	Where("users.deleted_at IS NULL").
	Group("users.name").
	Having("COUNT(posts.id) > ?", 1).
	Find(&userStats)
```

Let's examine these different approaches:

1. **Raw SQL with Generic Results**: The first example executes a raw SQL query and scans the results into a slice of maps. This is useful when you don't have a predefined struct for the result or need flexibility in handling different result shapes.

2. **Raw SQL with Model Mapping**: The second example shows how you can execute raw SQL but still map the results to your model structs. GORM handles the mapping between column names and struct fields.

3. **Query Builder API**: The third example demonstrates GORM's query builder API, which provides a fluent interface for constructing complex queries. This approach offers:
   - Type safety and IDE auto-completion
   - SQL injection protection with parameter placeholders
   - Readability for complex queries
   - The ability to build queries dynamically based on conditions

When should you use raw SQL versus GORM's query builder?

- **Use raw SQL when**: You have complex queries that are difficult to express with the query builder, or when you're optimizing performance with database-specific features.
- **Use the query builder when**: You want type safety, need to build queries dynamically, or prefer a more Go-idiomatic approach.

In either case, GORM handles parameter binding to protect against SQL injection, making both approaches secure when used correctly.

### Hooks

Hooks (also known as callbacks) are functions that are called at specific stages of the database operation lifecycle. They allow you to inject custom logic before or after these operations, such as validation, data transformation, or triggering side effects.

GORM provides a comprehensive set of hooks for various operations, you can find the full list of hooks in the [GORM documentation](https://gorm.io/docs/hooks.html). But let's look at a couple of common hooks:

```go
// Define hooks in your model
type User struct {
	// ... fields as defined earlier
	Password string `gorm:"size:255;not null"`
}

// BeforeCreate is called before a record is created
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	// For demonstration purposes - in real apps use proper password hashing!
	u.Password = "hashed_" + u.Password
	return
}

// AfterFind is called after a record is retrieved
func (u *User) AfterFind(tx *gorm.DB) (err error) {
	// Custom logic after a user is found
	return
}
```

Hooks are a great way to keep your business logic consistent and avoid duplicating code across your application. By defining these methods directly on your model structs, the behavior is encapsulated with the data it operates on.

## Structured Migrations for Production

While `AutoMigrate` is convenient for development, production systems need more controlled migration management. In production environments, you need precise control over when and how database changes occur, with the ability to roll back changes if something goes wrong.

[Golang-migrate](https://github.com/golang-migrate/migrate) is a popular migration tool for Go applications that provides version-controlled, reversible database migrations. Let's set up proper migrations using this tool:

1. Install the migrate CLI:

   ```bash
   go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
   ```

   This installs the migration tool globally on your system, allowing you to run migrations from the command line.

2. Create the `migrations` directory:

   ```bash
   mkdir -p migrations
   ```

   This directory will store all your migration files in a structured, version-controlled format.

3. Create your first migration:

   ```bash
   migrate create -ext sql -dir migrations -seq create_users_table
   ```

   This creates two files: an "up" migration for applying changes and a "down" migration for reverting them. The `-seq` flag ensures migrations are numbered sequentially, which helps maintain the order of execution.

4. Edit the up migration (`migrations/000001_create_users_table.up.sql`):

   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       created_at TIMESTAMP NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
       deleted_at TIMESTAMP,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL UNIQUE
   );

   CREATE INDEX idx_users_deleted_at ON users(deleted_at);
   ```

   The "up" migration contains SQL to create new database objects or modify existing ones. Here, we're creating a users table with the necessary columns and an index.

5. Edit the down migration (`migrations/000001_create_users_table.down.sql`):

   ```sql
   DROP TABLE IF EXISTS users;
   ```

   The "down" migration contains SQL to undo the changes made by the corresponding "up" migration. This ensures you can roll back changes if needed. In this case, we're dropping the users table.

6. Create a migration for the posts table:

   ```bash
   migrate create -ext sql -dir migrations -seq create_posts_table
   ```

   Now we'll create the second migration for the posts table, which depends on the users table created in the first migration.

7. Edit the up migration (`migrations/000002_create_posts_table.up.sql`):

   ```sql
   CREATE TABLE posts (
       id SERIAL PRIMARY KEY,
       created_at TIMESTAMP NOT NULL DEFAULT NOW(),
       updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
       deleted_at TIMESTAMP,
       title VARCHAR(255) NOT NULL,
       content TEXT,
       user_id INTEGER NOT NULL REFERENCES users(id)
   );

   CREATE INDEX idx_posts_deleted_at ON posts(deleted_at);
   ```

   Note the foreign key reference to the users table (`REFERENCES users(id)`). This ensures referential integrity between the two tables.

8. Edit the down migration (`migrations/000002_create_posts_table.down.sql`):

   ```sql
   DROP TABLE IF EXISTS posts;
   ```

   Again, the down migration simply drops the table to reverse the changes.

9. Run the migrations:

   ```bash
   export POSTGRESQL_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
   migrate -database ${POSTGRESQL_URL} -path migrations up
   ```

   This command applies all pending migrations to your database. The `up` argument tells the tool to apply migrations that haven't been applied yet. You can also use `down` to reverse migrations, or specify a version number to migrate to a specific version.

The migrate tool keeps track of which migrations have been applied in a special table called `schema_migrations` in your database. This ensures that migrations are only applied once and in the correct order.

For more complex applications, you might want to create a Go function to run migrations programmatically. This approach offers several advantages:

1. Migrations can be run as part of your application startup
2. The same code can be used in different environments (development, staging, production)
3. You can implement custom logic around migrations, like waiting for the database to be ready

Here's how to create a Go function to run migrations programmatically:

```go
package main

import (
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func runMigrations() {
	m, err := migrate.New(
		"file://migrations",
		"postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require",
	)
	if err != nil {
		log.Fatalf("Failed to create migration instance: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	log.Println("Migrations completed successfully")
}

func main() {
	runMigrations()

	// Continue with your application...
}
```

This function:

1. Creates a new migration instance that reads migration files from the local filesystem
2. Configures the database connection using your Neon credentials
3. Runs all pending migrations with `m.Up()`
4. Handles errors appropriately, distinguishing between actual errors and the "no changes" case

You would typically call this function early in your application's startup process, before initializing your GORM instance. This ensures that your database schema is up-to-date before your application starts using it.

For more advanced scenarios, you might want to add features like:

- Checking database connectivity before running migrations
- Adding retry logic for transient connection issues
- Implementing a "migrate and seed" function for development environments
- Adding version reporting to track which migrations have been applied

## Performance Optimization with Neon

When working with Neon and GORM, consider these performance optimization techniques:

### Efficient Querying

One of the most effective ways to improve performance is to be selective about what data you retrieve from the database. Fetching only the specific fields you need reduces the amount of data transferred between Neon and your application, resulting in faster queries and less memory usage.

Let's look at how to query efficiently with GORM:

```go
var users []struct {
	ID    uint
	Name  string
	Email string
}
db.Model(&User{}).Select("id", "name", "email").Where("id > ?", 10).Find(&users)
```

In this example, instead of selecting all fields with `Find(&users)`, we're using the `Select` method to specify exactly which columns we want. This has several benefits:

1. **Reduced Data Transfer**: Only the specified columns are fetched, reducing network bandwidth usage.
2. **Improved Query Performance**: The database can optimize the query better when it knows exactly which columns to return.
3. **Lower Memory Usage**: Your application only stores the data it actually needs.

Notice that we're also using an anonymous struct that contains only the fields we're interested in, rather than using the full `User` model. This is another optimization that ensures we're not allocating memory for fields we don't need.

### Batch Processing

When working with large datasets, processing all the data at once can lead to performance issues, including high memory usage and long-running queries. Instead, you can use batch processing to handle large datasets in smaller, more manageable chunks.

GORM provides the `FindInBatches` method to simplify this pattern:

```go
// Find in batches
db.Model(&User{}).Where("active = ?", true).FindInBatches(&results, 100, func(tx *gorm.DB, batch int) error {
	for _, result := range results {
		// Process result...
	}
	return nil
})
```

Here's what this code does:

1. We start a query on the User model for active users
2. Instead of fetching all results at once, we use `FindInBatches` to retrieve them in batches of 100 records
3. For each batch, GORM calls the provided callback function with the batch results
4. Inside the callback, we process each result individually

Batch processing is particularly important when dealing with operations that might affect millions of records, such as data migrations, report generation, or bulk updates. It's also useful when you need to perform complex processing on each record that might be resource-intensive.

For more information on batch processing and other advanced querying techniques, refer to the [GORM documentation](https://gorm.io/docs/advanced_query.html#FindInBatches).

### Indexing

Proper indexing is essential for query performance. With GORM, you can define indexes in your models:

```go
type User struct {
	ID      uint   `gorm:"primaryKey"`
	Name    string `gorm:"index:idx_name_email,unique"`
	Email   string `gorm:"index:idx_name_email,unique"`
	Address string `gorm:"index"`
}
```

For more complex indexing requirements, use migrations as shown in the previous section.

For more information on indexing and optimizing database performance, refer to the [Neon indexing documentation](/postgresql/postgresql-indexes).

## Complete Application Example

Let's put everything together in a complete application example:

```go
package main

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// User model
type User struct {
	gorm.Model
	Name     string `gorm:"size:255;not null"`
	Email    string `gorm:"size:255;not null;uniqueIndex"`
	Password string `gorm:"size:255;not null"`
	Posts    []Post `gorm:"foreignKey:UserID"`
}

// BeforeCreate hook for User
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	// Simulate password hashing
	u.Password = "hashed_" + u.Password
	return
}

// Post model
type Post struct {
	gorm.Model
	Title   string `gorm:"size:255;not null"`
	Content string `gorm:"type:text"`
	UserID  uint   `gorm:"not null"`
	User    User   `gorm:"foreignKey:UserID"`
}

func main() {
	// Connection string for Neon Postgres
	dsn := "postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"

	// Connect to the database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Get the underlying SQL DB object
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get DB object: %v", err)
	}

	// Configure connection pool
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetConnMaxLifetime(time.Hour)
	sqlDB.SetConnMaxIdleTime(30 * time.Minute)

	// Auto-migrate the schema
	err = db.AutoMigrate(&User{}, &Post{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Create a new user
	user := User{
		Name:     "John Doe",
		Email:    "john@example.com",
		Password: "secret123",
	}

	result := db.Create(&user)
	if result.Error != nil {
		log.Fatalf("Failed to create user: %v", result.Error)
	}
	fmt.Printf("Created user with ID: %d\n", user.ID)

	// Create posts for the user
	posts := []Post{
		{Title: "First Post", Content: "Content of first post", UserID: user.ID},
		{Title: "Second Post", Content: "Content of second post", UserID: user.ID},
	}

	result = db.Create(&posts)
	if result.Error != nil {
		log.Fatalf("Failed to create posts: %v", result.Error)
	}

	// Retrieve user with posts
	var userWithPosts User
	result = db.Preload("Posts").First(&userWithPosts, user.ID)
	if result.Error != nil {
		log.Fatalf("Failed to retrieve user with posts: %v", result.Error)
	}

	fmt.Printf("Retrieved user: %s (%s)\n", userWithPosts.Name, userWithPosts.Email)
	fmt.Printf("User has %d posts:\n", len(userWithPosts.Posts))

	for i, post := range userWithPosts.Posts {
		fmt.Printf("  %d. %s: %s\n", i+1, post.Title, post.Content)
	}

	// Use transactions for related operations
	err = db.Transaction(func(tx *gorm.DB) error {
		// Update user's email
		if err := tx.Model(&user).Update("email", "john.doe@example.com").Error; err != nil {
			return err
		}

		// Update first post's title
		if err := tx.Model(&posts[0]).Update("title", "Updated: First Post").Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		log.Fatalf("Transaction failed: %v", err)
	}

	fmt.Println("Transaction completed successfully")

	// Query with raw SQL
	var stats []struct {
		UserName  string
		PostCount int
	}

	db.Raw(`
		SELECT u.name as user_name, COUNT(p.id) as post_count
		FROM users u
		LEFT JOIN posts p ON u.id = p.user_id
		WHERE u.deleted_at IS NULL
		GROUP BY u.name
	`).Scan(&stats)

	for _, stat := range stats {
		fmt.Printf("User %s has written %d posts\n", stat.UserName, stat.PostCount)
	}
}
```

Save this code in a file named `main.go`, run `go mod tidy` to download the necessary dependencies, and run it with `go run main.go`. This application puts everything we've covered into practice: connecting to the database, defining models, performing CRUD operations, using transactions, and executing raw SQL queries.

## Conclusion

GORM with Neon Postgres provides a great combination for building scalable Go applications. GORM's developer-friendly API simplifies database interactions, while Neon's serverless architecture ensures your database scales according to demand.

By following the steps in this guide, you can build robust applications that efficiently interact with your Neon database. As your application grows, you can leverage additional GORM features such as plugins, hooks, and more advanced querying techniques to meet your evolving needs.

## Additional Resources

- [GORM Documentation](https://gorm.io/docs/)
- [Neon Documentation](/docs)
- [Go Database/SQL Documentation](https://golang.org/pkg/database/sql/)
- [Effective Go](https://golang.org/doc/effective_go)

<NeedHelp />

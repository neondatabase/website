---
title: Connect a Go application to Neon Postgres
subtitle: Learn how to run SQL queries in Neon from Go using the pgx library
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/go
  - /docs/integrations/go
updatedOn: '2025-07-29T10:34:33.838Z'
---

This guide describes how to create a Neon project and connect to it from a Go (Golang) application using [pgx](https://github.com/jackc/pgx), a high-performance and feature-rich PostgreSQL driver for Go.

You'll learn how to connect to your Neon database from a Go application, and perform basic Create, Read, Update, and Delete (CRUD) operations.

## Prerequisites

- A Neon account. If you do not have one, see [Sign up](https://console.neon.tech/signup).
- Go 1.18 or later. If you do not have Go installed, see the [official installation guide](https://go.dev/doc/install).

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1.  Navigate to the [Projects](https://console.neon.tech/app/projects) page in the [Neon Console](https://console.neon.tech).
2.  Click **New Project**.
3.  Specify your project settings and click **Create Project**.

Your project is created with a ready-to-use database named `neondb`. In the following steps, you will connect to this database from your Go application.

## Create a Go project

For your Go project, create a project directory, initialize a Go module, and add the required libraries.

1.  Create a project directory and change into it.

    ```bash
    mkdir neon-go-quickstart
    cd neon-go-quickstart
    ```

    > Open the directory in your preferred code editor (e.g., VS Code, GoLand).

2.  Initialize a Go module. This command creates a `go.mod` file to track your project's dependencies.

    ```bash
    go mod init neon-go-quickstart
    ```

3.  Add the required Go packages using `go get`.
    - `pgx/v5`: The database driver for connecting to Postgres.
    - `godotenv`: A helper library to manage environment variables from a `.env` file.

    ```bash
    go get github.com/jackc/pgx/v5 github.com/joho/godotenv
    ```

    This will download the packages and add them to your `go.mod` and `go.sum` files.

## Store your Neon connection string

Create a file named `.env` in your project's root directory. This file will securely store your database connection string.

1.  In the [Neon Console](https://console.neon.tech), select your project on the **Dashboard**.
2.  Click **Connect** on your **Project Dashboard** to open the **Connect to your database** modal.
    ![Connection modal](/docs/connect/connection_details.png)
3.  Copy the connection string, which includes your password.
4.  Add the connection string to your `.env` file as shown below.
    ```text
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
    ```
    > Replace `[user]`, `[password]`, `[neon_hostname]`, and `[dbname]` with your actual database credentials.

## Examples

This section provides example Go scripts that demonstrate how to connect to your Neon database and perform basic operations such as [creating a table](#create-a-table-and-insert-data), [reading data](#read-data), [updating data](#update-data), and [deleting data](#deleting-data).

### Create a table and insert data

In your project directory, create a file named `create_table.go`. This script connects to your Neon database, creates a table named `books`, and inserts some sample data into it.

```go title="create_table.go"
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading .env file: %v\n", err)
		os.Exit(1)
	}

	// Get the connection string from the environment variable
	connString := os.Getenv("DATABASE_URL")
	if connString == "" {
		fmt.Fprintf(os.Stderr, "DATABASE_URL not set\n")
		os.Exit(1)
	}

	ctx := context.Background()

	// Connect to the database
	conn, err := pgx.Connect(ctx, connString)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(ctx)

	fmt.Println("Connection established")

	// Drop the table if it already exists
	_, err = conn.Exec(ctx, "DROP TABLE IF EXISTS books;")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to drop table: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Finished dropping table (if it existed).")

	// Create a new table
	_, err = conn.Exec(ctx, `
        CREATE TABLE books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255),
            publication_year INT,
            in_stock BOOLEAN DEFAULT TRUE
        );
    `)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create table: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Finished creating table.")

	// Insert a single book record
	_, err = conn.Exec(ctx,
		"INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4);",
		"The Catcher in the Rye", "J.D. Salinger", 1951, true,
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to insert single row: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Inserted a single book.")

	// Data to be inserted
	booksToInsert := [][]interface{}{
		{"The Hobbit", "J.R.R. Tolkien", 1937, true},
		{"1984", "George Orwell", 1949, true},
		{"Dune", "Frank Herbert", 1965, false},
	}

	// Use CopyFrom for efficient bulk insertion
	copyCount, err := conn.CopyFrom(
		ctx,
		pgx.Identifier{"books"},
		[]string{"title", "author", "publication_year", "in_stock"},
		pgx.CopyFromRows(booksToInsert),
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to copy rows: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Inserted %d rows of data.\n", copyCount)
}
```

The above code does the following:

- Loads the connection string from the `.env` file using the `godotenv` library.
- Connects to the Neon database using `pgx.Connect`. The `defer conn.Close(ctx)` statement ensures the connection is closed when the `main` function exits.
- Uses `conn.Exec` to run SQL commands that don't return rows, such as `DROP TABLE` and `CREATE TABLE`.
- Inserts a single row using `conn.Exec` with parameterized query placeholders (`$1`, `$2`, etc.) to prevent SQL injection.
- Uses `conn.CopyFrom` for efficient bulk insertion of multiple records.

Run the script using the following command:

```bash
go run create_table.go
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

In your project directory, create a file named `read_data.go`. This script connects to your Neon database and retrieves all rows from the `books` table.

```go title="read_data.go"
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading .env file: %v\n", err)
		os.Exit(1)
	}

	connString := os.Getenv("DATABASE_URL")
	if connString == "" {
		fmt.Fprintf(os.Stderr, "DATABASE_URL not set\n")
		os.Exit(1)
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, connString)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(ctx)
	fmt.Println("Connection established")

	// Fetch all rows from the books table
	rows, err := conn.Query(ctx, "SELECT * FROM books ORDER BY publication_year;")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Query failed: %v\n", err)
		os.Exit(1)
	}
	defer rows.Close()

	fmt.Println("\n--- Book Library ---")
	for rows.Next() {
		var id, publicationYear int
		var title, author string
		var inStock bool

		err := rows.Scan(&id, &title, &author, &publicationYear, &inStock)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Failed to scan row: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("ID: %d, Title: %s, Author: %s, Year: %d, In Stock: %t\n",
			id, title, author, publicationYear, inStock)
	}
	fmt.Println("--------------------\n")

	if err := rows.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "Error during rows iteration: %v\n", err)
		os.Exit(1)
	}
}
```

The above code does the following:

- Connects to the database using the connection string from the `.env` file.
- Uses `conn.Query` to execute a `SELECT` statement, which returns a `pgx.Rows` object.
- Iterates through the rows using `rows.Next()`.
- Uses `rows.Scan()` to copy the column values from the current row into Go variables.
- Prints each book's details in a formatted output.
- Checks for any errors that occurred during row iteration with `rows.Err()`.

Run the script using the following command:

```bash
go run read_data.go
```

When the code runs successfully, it produces the following output:

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

In your project directory, create a file named `update_data.go`. This script connects to your Neon database and updates the stock status of the book 'Dune' to `true`.

```go title="update_data.go"
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading .env file: %v\n", err)
		os.Exit(1)
	}

	connString := os.Getenv("DATABASE_URL")
	if connString == "" {
		fmt.Fprintf(os.Stderr, "DATABASE_URL not set\n")
		os.Exit(1)
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, connString)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(ctx)
	fmt.Println("Connection established")

	// Update a data row in the table
	_, err = conn.Exec(ctx, "UPDATE books SET in_stock = $1 WHERE title = $2;", true, "Dune")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Update failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Updated stock status for 'Dune'.")
}
```

The above code uses `conn.Exec` with a parameterized `UPDATE` statement to change the `in_stock` status of the book 'Dune'.

Run the script using the following command:

```bash
go run update_data.go
```

After running this script, you can run `read_data.go` again to verify that the row was updated.

```bash
go run read_data.go
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: true
ID: 3, Title: 1984, Author: George Orwell, Year: 1949, In Stock: true
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: true
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: true
--------------------
```

> You can see that the stock status for 'Dune' has been updated to `true`.

### Delete data

In your project directory, create a file named `delete_data.go`. This script connects to your Neon database and deletes the book '1984' from the `books` table.

```go title="delete_data.go"
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading .env file: %v\n", err)
		os.Exit(1)
	}

	connString := os.Getenv("DATABASE_URL")
	if connString == "" {
		fmt.Fprintf(os.Stderr, "DATABASE_URL not set\n")
		os.Exit(1)
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, connString)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(ctx)
	fmt.Println("Connection established")

	// Delete a data row from the table
	_, err = conn.Exec(ctx, "DELETE FROM books WHERE title = $1;", "1984")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Delete failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Deleted the book '1984' from the table.")
}
```

The above code uses `conn.Exec` with a parameterized `DELETE` statement to remove the book '1984' from the `books` table.

Run the script using the following command:

```bash
go run delete_data.go
```

After running this script, you can run `read_data.go` again to verify that the row was deleted.

```bash
go run read_data.go
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: true
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: true
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: true
--------------------
```

> You can see that the book '1984' has been successfully deleted from the `books` table.

</Steps>

## Next steps: Using an ORM or framework

While this guide demonstrates how to connect to Neon using raw SQL queries, for more advanced and maintainable data interactions in your Go applications, consider using an Object-Relational Mapping (ORM) framework. ORMs not only let you work with data as objects but also help manage schema changes through automated migrations keeping your database structure in sync with your application models.

Explore the following resources to learn how to integrate ORMs with Neon:

- [Connect a Go application to Neon using GORM](/guides/golang-gorm-postgres)

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-golang" description="Get started with Go and Neon using pgx" icon="github">Get started with Go and Neon using pgx</a>
</DetailIconCards>

## Resources

- [pgx Documentation](https://pkg.go.dev/github.com/jackc/pgx/v5)

<NeedHelp/>

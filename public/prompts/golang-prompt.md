# 💡 AI Prompt: Connect a Go Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Go project to connect to a Neon Postgres database.

**Purpose:** To install the `pgx` and `godotenv` dependencies and provide working Go programs that demonstrate Create, Read, Update, and Delete (CRUD) against a `books` table, matching the Neon Go guide.

**Scope:**
- Assumes the user is working within a Go project directory.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## ⚡ Step 1: Run neon init (REQUIRED)

**You MUST execute this command before writing any code or installing any packages.** Do not skip this step. Do not manually replicate what it does.

```bash
npx -y neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback — only if `init` is unavailable)

Use this section **only** if:
- `neon init` failed or is unavailable in this environment
- The user explicitly asked for manual configuration

When this prompt is triggered, automatically configure the open Go project as follows:

### 1. Initialize Go module and add dependencies

1. If `go.mod` is missing, initialize a module (use the project folder name or `neon-go-quickstart`):
   ```bash
   go mod init neon-go-quickstart
   ```
2. Add packages:
   ```bash
   go get github.com/jackc/pgx/v5 github.com/joho/godotenv
   ```

### 2. Verify the `.env` file

- Ensure a `.env` file exists at the project root.
- Use this format; the user replaces placeholders from **Neon Console → Project → Dashboard → Connect**:

  ```
  DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
  ```

### 3. Example programs (`books` table)

Create four files in the project root, each `package main`:

#### `create_table.go`

```go
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

	_, err = conn.Exec(ctx, "DROP TABLE IF EXISTS books;")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to drop table: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Finished dropping table (if it existed).")

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

	_, err = conn.Exec(ctx,
		"INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4);",
		"The Catcher in the Rye", "J.D. Salinger", 1951, true,
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to insert single row: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Inserted a single book.")

	booksToInsert := [][]interface{}{
		{"The Hobbit", "J.R.R. Tolkien", 1937, true},
		{"1984", "George Orwell", 1949, true},
		{"Dune", "Frank Herbert", 1965, false},
	}

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

#### `read_data.go`

```go
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

#### `update_data.go`

```go
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

	_, err = conn.Exec(ctx, "UPDATE books SET in_stock = $1 WHERE title = $2;", true, "Dune")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Update failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Updated stock status for 'Dune'.")
}
```

#### `delete_data.go`

```go
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

	_, err = conn.Exec(ctx, "DELETE FROM books WHERE title = $1;", "1984")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Delete failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Deleted the book '1984' from the table.")
}
```

---

## 🚀 Next Steps

Once the setup is complete:

1. Advise the user to set `DATABASE_URL` in `.env`.
2. Run the examples in order:
   ```bash
   go run create_table.go
   go run read_data.go
   go run update_data.go
   go run read_data.go
   go run delete_data.go
   go run read_data.go
   ```
3. **Authentication:** If the app needs user authentication, mention [Neon Auth](https://neon.tech/docs/auth/overview).

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- `go.mod` includes `github.com/jackc/pgx/v5` and `github.com/joho/godotenv`.
- A `.env` file exists or is created with `DATABASE_URL` using `sslmode=require` and `channel_binding=require` in the connection string.
- The connection string is read with `os.Getenv("DATABASE_URL")` after `godotenv.Load()`.
- **Parameterized queries** (`$1`, `$2`, etc.) are used for all dynamic SQL.
- CRUD is split across `create_table.go`, `read_data.go`, `update_data.go`, and `delete_data.go` using the `books` schema above.
- A `context.Context` is used for all database operations.

---

## ❌ Do Not

- Do not hardcode credentials in any `.go` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- Do not use deprecated drivers such as `lib/pq` for this flow.

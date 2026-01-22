# 💡 AI Prompt: Connect a Go Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Go project to connect to a Neon Postgres database.

**Purpose:** To install the `pgx` and `godotenv` dependencies and provide a working Go script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle and transaction management with Neon.

**Scope:**
- Assumes the user is working within a Go project directory.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Go project as follows:

### 1. Initialize Go Module and Add Dependencies

1.  Check if a `go.mod` file exists. If it does not, initialize a new module. You can use the current directory name as the module path.
    ```bash
    go mod init my-neon-go-app
    ```
2.  Run `go get` to download and add the required packages to the module:
    ```bash
    go get github.com/jackc/pgx/v5 github.com/joho/godotenv
    ```

---

### 2. Verify the `.env` File

- Check for the presence of a `.env` file at the root of the project.
- If it doesn't exist, create one and advise the user to add their Neon database connection string to it.
- Provide the following format and instruct the user to replace the placeholders:
  ```
  DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
  ```
- Prompt the user to get their connection string from the **Neon Console → Project → Dashboard → Connect**.

---

### 3. Create an Example Go Script with CRUD and Transactions

Create a new file named `main.go` and populate it with the following Go code. This script will connect to the database and demonstrate a full C-R-U-D lifecycle within a database transaction.

```go title="main.go"
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load environment variables
	if err := godotenv.Load(); err != nil {
		fmt.Fprintf(os.Stderr, "Error loading .env file: %v\n", err)
		os.Exit(1)
	}

	connString := os.Getenv("DATABASE_URL")
	if connString == "" {
		fmt.Fprintf(os.Stderr, "DATABASE_URL environment variable not set\n")
		os.Exit(1)
	}

	ctx := context.Background()

	// 2. Establish connection
	conn, err := pgx.Connect(ctx, connString)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(ctx)
	fmt.Println("Connection successful!")

	// Set up a table for the example
	_, err = conn.Exec(ctx, "DROP TABLE IF EXISTS todos; CREATE TABLE todos (id SERIAL PRIMARY KEY, task TEXT NOT NULL);")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to create table: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Table 'todos' created.")

	// --- Start Transaction for atomic CRUD Operations ---
	tx, err := conn.Begin(ctx)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to begin transaction: %v\n", err)
		os.Exit(1)
	}
	// Defer a rollback in case of panic or error. The rollback will be ignored if the transaction is already committed.
	defer tx.Rollback(ctx)

	fmt.Println("\nTransaction started.")

	// CREATE: Insert a new todo item
	_, err = tx.Exec(ctx, "INSERT INTO todos (task) VALUES ($1);", "Learn Neon with Go")
	if err != nil {
		fmt.Fprintf(os.Stderr, "CREATE failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("CREATE: Row inserted.")

	// READ: Retrieve the new todo item
	var task string
	err = tx.QueryRow(ctx, "SELECT task FROM todos WHERE task = $1;", "Learn Neon with Go").Scan(&task)
	if err != nil {
		fmt.Fprintf(os.Stderr, "READ failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("READ: Fetched task - '%s'\n", task)

	// UPDATE: Modify the todo item
	_, err = tx.Exec(ctx, "UPDATE todos SET task = $1 WHERE task = $2;", "Master Neon with Go!", "Learn Neon with Go")
	if err != nil {
		fmt.Fprintf(os.Stderr, "UPDATE failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("UPDATE: Row updated.")

	// DELETE: Remove the todo item
	_, err = tx.Exec(ctx, "DELETE FROM todos WHERE task = $1;", "Master Neon with Go!")
	if err != nil {
		fmt.Fprintf(os.Stderr, "DELETE failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("DELETE: Row deleted.")

	// --- Commit Transaction ---
	if err := tx.Commit(ctx); err != nil {
		fmt.Fprintf(os.Stderr, "Transaction commit failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Transaction committed successfully.\n")
}
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Advise the user to ensure their connection string is correctly set in the `.env` file.
2.  Instruct them to run the application from their terminal:
    ```bash
    go run main.go
    ```
3.  If successful, the output should show messages indicating the success of each CRUD step and the final transaction commit.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The `go.mod` file is present and lists `github.com/jackc/pgx/v5` and `github.com/joho/godotenv` as dependencies.
- A `.env` file is present or has been created.
- The connection string is loaded from an environment variable via `os.Getenv("DATABASE_URL")`.
- **All SQL operations (INSERT, UPDATE, DELETE) use parameterized queries** (`$1`, `$2`, etc.) to prevent SQL injection.
- **The primary business logic (CRUD operations) is wrapped in a `pgx` transaction block** (`conn.Begin`, `tx.Commit`, `tx.Rollback`).
- A `context.Context` is used for all database operations.

---

## ❌ Do Not

- Do not hardcode credentials in any `.go` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- Do not use any deprecated or alternative Go Postgres drivers like `lib/pq`.

# 💡 AI Prompt: Connect a Rust Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Rust project to connect to a Neon Postgres database.

**Purpose:** To install the necessary crates and provide a working Rust script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle and transaction management with Neon.

**Scope:**
- Assumes the user is working within a Rust project created with `cargo new`.
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

When this prompt is triggered, automatically configure the open Rust project as follows:

### 1. Select a Database Driver

First, ask the user to choose their preferred Rust Postgres driver and proceed based on their selection:
1.  **`postgres`**: A robust synchronous driver.
2.  **`tokio-postgres`**: A high-performance asynchronous driver for the Tokio runtime.

---

### 2. Add Required Crates

Based on the user's selection, run the appropriate `cargo add` command. **The `postgres-openssl` and `openssl` crates are mandatory for a secure connection to Neon.**

*   **If `postgres` (sync) is chosen:**
    ```bash
    cargo add postgres postgres-openssl openssl dotenvy
    ```
*   **If `tokio-postgres` (async) is chosen:**
    ```bash
    cargo add tokio --features full
    cargo add tokio-postgres postgres-openssl openssl dotenvy
    ```

---

### 3. Verify the `.env` File

- Check for the presence of a `.env` file at the root of the project.
- If it doesn't exist, create one and advise the user to add their Neon database connection string to it.
- Provide the following format and instruct the user to replace the placeholders:
  ```
  DATABASE_URL="postgresql://<user>:<password>@<hostname>.neon.tech:<port>/<dbname>?sslmode=require"
  ```
- Prompt the user to get their connection string from the **Neon Console → Project → Dashboard → Connect**.

---

### 4. Configure multiple binaries

Create one Rust binary per CRUD step (`create_table`, `read_data`, `update_data`, `delete_data`). Append to `Cargo.toml`:

```toml
[[bin]]
name = "create_table"
path = "src/create_table.rs"

[[bin]]
name = "read_data"
path = "src/read_data.rs"

[[bin]]
name = "update_data"
path = "src/update_data.rs"

[[bin]]
name = "delete_data"
path = "src/delete_data.rs"
```

Remove the default entry point when these bins are the examples:

```bash
rm src/main.rs
```

### 5. Source files (`books` table)

Use `dotenvy`, `openssl` (`SslConnector` / `SslMethod::tls()`), and `postgres_openssl::MakeTlsConnector` to build TLS. Load `DATABASE_URL` with `dotenvy::dotenv` and `std::env::var("DATABASE_URL")?`.

Below is the **synchronous `postgres`** implementation for all four binaries (same logic as the Neon Rust guide). For **`tokio-postgres`**, mirror the guide’s async pattern: `#[tokio::main]`, `tokio_postgres::connect`, `tokio::spawn` the connection future, then `.await` each call—see the async `create_table.rs` example after the sync sources, and apply the same structure to `read_data`, `update_data`, and `delete_data` using the SQL from the sync versions.

#### `src/create_table.rs` (`postgres` sync)

```rust
use dotenvy::dotenv;
use postgres::Client;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::env;

fn main() -> Result<(), Box<dyn std::error::Error>> {

    dotenv()?;
    let conn_string = env::var("DATABASE_URL")?;

    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());

    let mut client = Client::connect(&conn_string, connector)?;
    println!("Connection established");

    client.batch_execute("DROP TABLE IF EXISTS books;")?;
    println!("Finished dropping table (if it existed).");

    client.batch_execute(
        "CREATE TABLE books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255),
            publication_year INT,
            in_stock BOOLEAN DEFAULT TRUE
        );"
    )?;
    println!("Finished creating table.");

    client.execute(
        "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4)",
        &[&"The Catcher in the Rye", &"J.D. Salinger", &1951, &true],
    )?;
    println!("Inserted a single book.");

    let mut transaction = client.transaction()?;
    println!("Starting transaction to insert multiple books...");

    let books_to_insert = [
        ("The Hobbit", "J.R.R. Tolkien", 1937, true),
        ("1984", "George Orwell", 1949, true),
        ("Dune", "Frank Herbert", 1965, false),
    ];

    for book in &books_to_insert {
        transaction.execute(
            "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4)",
            &[&book.0, &book.1, &book.2, &book.3],
        )?;
    }

    transaction.commit()?;
    println!("Inserted 3 rows of data.");

    Ok(())
}
```

#### `src/read_data.rs` (`postgres` sync)

```rust
use dotenvy::dotenv;
use postgres::Client;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::env;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv()?;
    let conn_string = env::var("DATABASE_URL")?;

    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());

    let mut client = Client::connect(&conn_string, connector)?;
    println!("Connection established");

    let rows = client.query("SELECT * FROM books ORDER BY publication_year;", &[])?;

    println!("\n--- Book Library ---");
    for row in rows {
        let id: i32 = row.get("id");
        let title: &str = row.get("title");
        let author: &str = row.get("author");
        let year: i32 = row.get("publication_year");
        let in_stock: bool = row.get("in_stock");
        println!("ID: {}, Title: {}, Author: {}, Year: {}, In Stock: {}", id, title, author, year, in_stock);
    }
    println!("--------------------\n");

    Ok(())
}
```

#### `src/update_data.rs` (`postgres` sync)

```rust
use dotenvy::dotenv;
use postgres::Client;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::env;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv()?;
    let conn_string = env::var("DATABASE_URL")?;

    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());

    let mut client = Client::connect(&conn_string, connector)?;
    println!("Connection established");

    let updated_rows = client.execute(
        "UPDATE books SET in_stock = $1 WHERE title = $2",
        &[&true, &"Dune"],
    )?;

    if updated_rows > 0 {
        println!("Updated stock status for 'Dune'.");
    } else {
        println!("'Dune' not found or stock status already up to date.");
    }

    Ok(())
}
```

#### `src/delete_data.rs` (`postgres` sync)

```rust
use dotenvy::dotenv;
use postgres::Client;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::env;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv()?;
    let conn_string = env::var("DATABASE_URL")?;

    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());

    let mut client = Client::connect(&conn_string, connector)?;
    println!("Connection established");

    let deleted_rows = client.execute(
        "DELETE FROM books WHERE title = $1",
        &[&"1984"],
    )?;

    if deleted_rows > 0 {
        println!("Deleted the book '1984' from the table.");
    } else {
        println!("'1984' not found in the table.");
    }

    Ok(())
}
```

#### `src/create_table.rs` (`tokio-postgres` async reference)

```rust
use tokio_postgres;
use dotenvy::dotenv;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    dotenv()?;
    let conn_string = env::var("DATABASE_URL")?;

    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());

    let (mut client, connection) = tokio_postgres::connect(&conn_string, connector).await?;
    println!("Connection established");

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    client.batch_execute("DROP TABLE IF EXISTS books;").await?;
    println!("Finished dropping table (if it existed).");

    client.batch_execute(
        "CREATE TABLE books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255),
            publication_year INT,
            in_stock BOOLEAN DEFAULT TRUE
        );"
    ).await?;
    println!("Finished creating table.");

    client.execute(
        "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4)",
        &[&"The Catcher in the Rye", &"J.D. Salinger", &1951, &true],
    ).await?;
    println!("Inserted a single book.");

    let transaction = client.transaction().await?;
    println!("Starting transaction to insert multiple books...");

    let books_to_insert = [
        ("The Hobbit", "J.R.R. Tolkien", 1937, true),
        ("1984", "George Orwell", 1949, true),
        ("Dune", "Frank Herbert", 1965, false),
    ];

    for book in &books_to_insert {
        transaction.execute(
            "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4)",
            &[&book.0, &book.1, &book.2, &book.3],
        ).await?;
    }

    transaction.commit().await?;
    println!("Inserted 3 rows of data.");

    Ok(())
}
```

For **`tokio-postgres`**, implement `read_data.rs`, `update_data.rs`, and `delete_data.rs` by translating the synchronous versions above: same queries and logging, but use `#[tokio::main]`, `tokio_postgres::connect`, the `tokio::spawn` connection loop, and `.await` on `query`, `execute`, etc., matching the Neon Rust guide’s tokio-postgres tabs for those files.

---

## 🚀 Next Steps

Once the setup is complete:

1. Advise the user to set `DATABASE_URL` in `.env` using the canonical Neon format (including `sslmode=require` and `channel_binding=require`).
2. Run the binaries in order:
   ```bash
   cargo run --bin create_table
   cargo run --bin read_data
   cargo run --bin update_data
   cargo run --bin read_data
   cargo run --bin delete_data
   cargo run --bin read_data
   ```
3. **Authentication:** If the app needs user authentication, mention [Neon Auth](https://neon.tech/docs/auth/overview).

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- **`postgres-openssl`, `openssl`, and `dotenvy` are always included** for TLS and env loading; add either `postgres` or `tokio-postgres` plus `tokio` with features `"tokio/full"` when using the async stack.
- A `.env` file exists with `DATABASE_URL` in the canonical Neon format.
- The connection string is read from the environment, not hardcoded.
- `MakeTlsConnector` wraps an `SslConnector` built with `SslMethod::tls()` for every connection.
- **Parameterized queries** (`$1`, `$2`, …) are used for all dynamic SQL.
- `Cargo.toml` defines the four `[[bin]]` targets and the default `src/main.rs` is removed when those examples are the only mains.
- **`postgres` (sync):** `Client::connect` and `mut client` / `mut transaction` where the guide requires it.
- **`tokio-postgres` (async):** `tokio::spawn` drives the connection future; `client` is `mut` where needed for transactions; all I/O is `.await`ed.

---

## ❌ Do Not

- Do not hardcode credentials in any `.rs` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- **Do not forget the TLS/SSL connector setup.** The connection to Neon will fail without it.
# 💡 AI Prompt: Connect a Rust Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Rust project to connect to a Neon Postgres database.

**Purpose:** To install the necessary crates and provide a working Rust script that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle and transaction management with Neon.

**Scope:**
- Assumes the user is working within a Rust project created with `cargo new`.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

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

### 4. Create an Example `main.rs` Script

Modify the `src/main.rs` file to include code that connects to the database and demonstrates a full C-R-U-D lifecycle within a database transaction. Apply the following logic:

- **If `src/main.rs` contains only the default `cargo new` template code** (i.e., `fn main() { println!("Hello, world!"); }`), replace the entire file content with the appropriate Rust code block below.
- **If `src/main.rs` contains any custom user code, preserve it.** Comment out the existing code by wrapping it in a block comment (`/* ... */`) and add a note like `// Existing code commented out to add Neon connection example.` Then, append the new Rust code block (Synchronous or Asynchronous) after the commented section.

#### Option 1: `postgres` (Synchronous)
```rust title="src/main.rs"
use dotenvy::dotenv;
use openssl::ssl::{SslConnector, SslMethod};
use postgres::Client;
use postgres_openssl::MakeTlsConnector;
use std::env;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Load environment variables
    dotenv()?;
    let conn_string = env::var("DATABASE_URL")?;

    // 2. Set up the TLS connector required by Neon
    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());

    // 3. Establish connection
    let mut client = Client::connect(&conn_string, connector)?;
    println!("Connection successful!");

    // Set up a table for the example
    client.batch_execute("DROP TABLE IF EXISTS todos; CREATE TABLE todos (id SERIAL PRIMARY KEY, task TEXT NOT NULL);")?;
    println!("Table 'todos' created.");

    // --- Start Transaction for atomic CRUD Operations ---
    let mut transaction = client.transaction()?;
    println!("\nTransaction started.");

    // CREATE: Insert a new todo item
    transaction.execute("INSERT INTO todos (task) VALUES ($1)", &[&"Learn Neon with Rust"])?;
    println!("CREATE: Row inserted.");

    // READ: Retrieve the new todo item
    let row = transaction.query_one("SELECT task FROM todos WHERE task = $1", &[&"Learn Neon with Rust"])?;
    let task: &str = row.get(0);
    println!("READ: Fetched task - '{}'", task);

    // UPDATE: Modify the todo item
    transaction.execute("UPDATE todos SET task = $1 WHERE task = $2", &[&"Master Neon with Rust!", &"Learn Neon with Rust"])?;
    println!("UPDATE: Row updated.");

    // DELETE: Remove the todo item
    transaction.execute("DELETE FROM todos WHERE task = $1", &[&"Master Neon with Rust!"])?;
    println!("DELETE: Row deleted.");

    // --- Commit Transaction ---
    transaction.commit()?;
    println!("Transaction committed successfully.\n");

    Ok(())
}
```

#### Option 2: `tokio-postgres` (Asynchronous)
```rust title="src/main.rs"
use dotenvy::dotenv;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::env;
use tokio_postgres::Error;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // 1. Load environment variables
    dotenv().ok();
    let conn_string = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // 2. Set up the TLS connector required by Neon
    let builder = SslConnector::builder(SslMethod::tls()).unwrap();
    let connector = MakeTlsConnector::new(builder.build());

    // 3. Establish connection
    let (mut client, connection) = tokio_postgres::connect(&conn_string, connector).await?;
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });
    println!("Connection successful!");

    // Set up a table for the example
    client.batch_execute("DROP TABLE IF EXISTS todos; CREATE TABLE todos (id SERIAL PRIMARY KEY, task TEXT NOT NULL);").await?;
    println!("Table 'todos' created.");

    // --- Start Transaction for atomic CRUD Operations ---
    let transaction = client.transaction().await?;
    println!("\nTransaction started.");

    // CREATE: Insert a new todo item
    transaction.execute("INSERT INTO todos (task) VALUES ($1)", &[&"Learn Neon with Rust"]).await?;
    println!("CREATE: Row inserted.");

    // READ: Retrieve the new todo item
    let row = transaction.query_one("SELECT task FROM todos WHERE task = $1", &[&"Learn Neon with Rust"]).await?;
    let task: &str = row.get(0);
    println!("READ: Fetched task - '{}'", task);

    // UPDATE: Modify the todo item
    transaction.execute("UPDATE todos SET task = $1 WHERE task = $2", &[&"Master Neon with Rust!", &"Learn Neon with Rust"]).await?;
    println!("UPDATE: Row updated.");

    // DELETE: Remove the todo item
    transaction.execute("DELETE FROM todos WHERE task = $1", &[&"Master Neon with Rust!"]).await?;
    println!("DELETE: Row deleted.");

    // --- Commit Transaction ---
    transaction.commit().await?;
    println!("Transaction committed successfully.\n");

    Ok(())
}
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Advise the user to ensure their connection string is correctly set in the `.env` file.
2.  Instruct them to compile and run the application from their terminal:
    ```bash
    cargo run
    ```
3.  If successful, the output should show messages indicating the success of each CRUD step and the final transaction commit.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- **The `postgres-openssl`, `openssl`, and `dotenvy` crates are always included**, as they are mandatory for secure connections and configuration.
- A `.env` file is present or has been created.
- The connection string is loaded from the environment, not hardcoded.
- The `MakeTlsConnector` is correctly configured and used for the connection.
- **All SQL operations (INSERT, UPDATE, DELETE) use parameterized queries** (`$1`, `$2`, etc.) to prevent SQL injection.
- The primary business logic (CRUD operations) is wrapped in a transaction block.
- - **Ensure correct mutability based on the driver:** In `tokio-postgres`, the `client` must be mutable to start a transaction, but the returned `transaction` object is not. In the synchronous `postgres` crate, both the `client` and the `transaction` objects must be declared as mutable.

---

## ❌ Do Not

- Do not hardcode credentials in any `.rs` file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- **Do not forget the TLS/SSL connector setup.** The connection to Neon will fail without it.
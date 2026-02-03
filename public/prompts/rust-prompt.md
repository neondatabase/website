# AI Prompt: Connect a Rust Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Rust project to connect to a Neon Postgres database.

**Purpose:** Install crates and provide a working Rust script demonstrating CRUD operations with transactions.

**Scope:**
- Assumes user has a Rust project (`cargo new`)
- Assumes user has a Neon database and connection string

---

## Instructions (for AI-enabled editors)

### 1. Select a Database Driver

Ask user to choose their preferred Rust Postgres driver:
1. **`postgres`**: Synchronous driver
2. **`tokio-postgres`**: Async driver for Tokio runtime

### 2. Install Dependencies

Run these commands based on user selection:

**postgres (sync):**
```bash
cargo add postgres postgres-openssl openssl dotenvy
```

**tokio-postgres (async):**
```bash
cargo add tokio --features full
cargo add tokio-postgres postgres-openssl openssl dotenvy
```

### 3. Configure `.env` File

Check for `.env` at project root. If missing, create it:

```dotenv
DATABASE_URL="postgresql://[user]:[password]@[hostname]/[dbname]?sslmode=require"
```

Instruct user to get connection string from **Neon Console → Project → Dashboard → Connect**.

### 4. Create Example Script

Modify `src/main.rs`:
- If default template: replace entirely
- If has user code: comment it out and append new code

#### Option 1: `postgres` (Synchronous)

```rust title="src/main.rs"
use dotenvy::dotenv;
use openssl::ssl::{SslConnector, SslMethod};
use postgres::Client;
use postgres_openssl::MakeTlsConnector;
use std::env;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv()?;
    let conn_string = env::var("DATABASE_URL")?;

    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());
    let mut client = Client::connect(&conn_string, connector)?;
    println!("Connection successful!");

    client.batch_execute("DROP TABLE IF EXISTS todos; CREATE TABLE todos (id SERIAL PRIMARY KEY, task TEXT NOT NULL);")?;
    println!("Table 'todos' created.");

    let mut transaction = client.transaction()?;
    println!("\nTransaction started.");

    transaction.execute("INSERT INTO todos (task) VALUES ($1)", &[&"Learn Neon with Rust"])?;
    println!("CREATE: Row inserted.");

    let row = transaction.query_one("SELECT task FROM todos WHERE task = $1", &[&"Learn Neon with Rust"])?;
    let task: &str = row.get(0);
    println!("READ: Fetched task - '{}'", task);

    transaction.execute("UPDATE todos SET task = $1 WHERE task = $2", &[&"Master Neon with Rust!", &"Learn Neon with Rust"])?;
    println!("UPDATE: Row updated.");

    transaction.execute("DELETE FROM todos WHERE task = $1", &[&"Master Neon with Rust!"])?;
    println!("DELETE: Row deleted.");

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
    dotenv().ok();
    let conn_string = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let builder = SslConnector::builder(SslMethod::tls()).unwrap();
    let connector = MakeTlsConnector::new(builder.build());
    let (mut client, connection) = tokio_postgres::connect(&conn_string, connector).await?;
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });
    println!("Connection successful!");

    client.batch_execute("DROP TABLE IF EXISTS todos; CREATE TABLE todos (id SERIAL PRIMARY KEY, task TEXT NOT NULL);").await?;
    println!("Table 'todos' created.");

    let transaction = client.transaction().await?;
    println!("\nTransaction started.");

    transaction.execute("INSERT INTO todos (task) VALUES ($1)", &[&"Learn Neon with Rust"]).await?;
    println!("CREATE: Row inserted.");

    let row = transaction.query_one("SELECT task FROM todos WHERE task = $1", &[&"Learn Neon with Rust"]).await?;
    let task: &str = row.get(0);
    println!("READ: Fetched task - '{}'", task);

    transaction.execute("UPDATE todos SET task = $1 WHERE task = $2", &[&"Master Neon with Rust!", &"Learn Neon with Rust"]).await?;
    println!("UPDATE: Row updated.");

    transaction.execute("DELETE FROM todos WHERE task = $1", &[&"Master Neon with Rust!"]).await?;
    println!("DELETE: Row deleted.");

    transaction.commit().await?;
    println!("Transaction committed successfully.\n");

    Ok(())
}
```

---

## Next Steps

1. Verify user set `DATABASE_URL` in `.env`
2. Run `cargo run`
3. Output should show connection success and each CRUD operation

---

## Validation Rules

Before suggesting code:
- `postgres-openssl`, `openssl`, `dotenvy` crates are included
- `.env` file is present or created
- Connection string loaded from environment, not hardcoded
- `MakeTlsConnector` is configured correctly
- SQL operations use parameterized queries (`$1`, `$2`)
- CRUD operations wrapped in transaction
- Sync: `client` and `transaction` are mutable. Async: `client` is mutable, `transaction` is not

---

## Do Not

- Hardcode credentials in `.rs` files
- Output `.env` contents or connection string
- Skip TLS/SSL connector setup - connection will fail without it

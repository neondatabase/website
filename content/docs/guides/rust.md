---
title: Connect a Rust application to Neon Postgres
subtitle: Learn how to run SQL queries in Neon from Rust using the postgres or
  tokio-postgres crates
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/rust
  - /docs/integrations/rust
updatedOn: '2025-07-29T10:34:33.841Z'
---

This guide describes how to create a Neon project and connect to it from a Rust application using two popular Postgres drivers: [rust-postgres](https://crates.io/crates/postgres), a synchronous driver, and [tokio-postgres](https://crates.io/crates/tokio-postgres), an asynchronous driver for use with the [Tokio](https://tokio.rs/) runtime.

## Prerequisites

- A Neon account. If you do not have one, see [Sign up](https://console.neon.tech/signup).
- The Rust toolchain. If you do not have it installed, install it from the [official Rust website](https://www.rust-lang.org/tools/install).

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1.  Navigate to the [Projects](https://console.neon.tech/app/projects) page in the [Neon Console](https://console.neon.tech).
2.  Click **New Project**.
3.  Specify your project settings and click **Create Project**.

Your project is created with a ready-to-use database named `neondb`. In the following steps, you will connect to this database from your Rust application.

## Create a Rust project

For your Rust project, use `cargo` to create a new project and add the required library dependencies (called "crates").

1.  Create a project directory and change into it.

    ```bash
    cargo new neon-rust-quickstart
    cd neon-rust-quickstart
    ```

    This command creates a new directory named `neon-rust-quickstart` containing a `src/main.rs` file for your code and a `Cargo.toml` file for your project's configuration and dependencies.

    > Open the directory in your preferred code editor (e.g., VS Code, RustRover, etc.) to edit the files.

2.  Add the required crates using `cargo add`. Choose the set of commands for either a synchronous or asynchronous setup.

    <CodeTabs labels={["postgres (sync)", "tokio-postgres (async)"]}>

    ```bash shouldWrap
    cargo add postgres postgres-openssl openssl dotenvy
    ```

    ```bash shouldWrap
    cargo add tokio --features "tokio/full" tokio-postgres postgres-openssl openssl dotenvy
    ```

    </CodeTabs>

    <Admonition type="note" title="What are features?">
    The `--features` flag tells Cargo to enable optional functionality within a crate. Many crates are designed to be modular, and features allow you to include only the code you actually need. In this case, you are enabling the full Tokio runtime, which includes all components necessary for asynchronous programming.

    You can learn more about features in [The Cargo Book: Features](https://doc.rust-lang.org/cargo/reference/features.html).
    </Admonition>

    > Neon requires a secure SSL/TLS connection. In the commands above, the `postgres-openssl` crate provides the necessary OpenSSL bindings that both the synchronous `postgres` and asynchronous `tokio-postgres` drivers use to enable TLS.

3.  Configure multiple executables.

    You will create separate Rust scripts for each of the CRUD operations (Create, Read, Update, Delete). Each script will be a separate binary target in your project (`create_table.rs`, `read_data.rs`, `update_data.rs`, and `delete_data.rs`).

    To manage separate CRUD examples (`create_table`, `read_data`, etc.), you need to tell Cargo that your project has multiple binary targets.

    Open your `Cargo.toml` file and add the following `[[bin]]` sections to the end of it:

    ```toml title="Cargo.toml"
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

    You can now safely delete the default `src/main.rs` file. Since you have defined specific binary targets (like `create_table`) in `Cargo.toml`, Cargo no longer needs the default `main.rs` entry point.

    ```bash
    rm src/main.rs
    ```

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

## Choosing the right method to execute SQL commands

Before diving into the code examples, it's important to understand how to interact with your Neon database using Rust. The `postgres` and `tokio-postgres` crates provide several methods for executing SQL commands. Choosing the right method depends on your use case:

- `client.execute:`
  Use this for a single DML/DDL statement (`INSERT`, `UPDATE`, `DELETE`) or a fire-and-forget query. It supports parameter placeholders (`$1`, `$2`, etc.) and returns the number of rows affected (`u64`).

- `client.batch_execute:`  
  Ideal for running multiple SQL commands in one shot (schema migrations, DDL, seed data). Supply a semicolon-separated SQL string. This method does not support parameters and returns `()` on success.

- `client.query:`  
  The go-to for any `SELECT` that returns rows. It accepts placeholders and returns a `Vec<Row>`, so you can iterate over rows and extract typed values.

### Quick comparison

| Method                 | Use case                                                              | Parameters | Returns               |
| ---------------------- | --------------------------------------------------------------------- | ---------- | --------------------- |
| `client.execute`       | Single DML/DDL or ad-hoc query                                        | Yes        | `u64` (rows affected) |
| `client.batch_execute` | Multiple statements in one SQL blob <br/>(DDL, migrations, seed data) | No         | `()`                  |
| `client.query`         | Fetching rows from a `SELECT`                                         | Yes        | `Vec<Row>`            |

Now that you know how to connect to your Neon database and the available methods for executing SQL commands, let's look at some examples of how you can perform basic CRUD operations. You will use all three methods (`execute`, `batch_execute`, and `query`) in the examples to demonstrate their usage.

## Examples

This section provides example Rust scripts that demonstrate how to connect to your Neon database and perform basic operations such as [creating a table](#create-a-table-and-insert-data), [reading data](#read-data), [updating data](#update-data), and [deleting data](#delete-data).

### Create a table and insert data

In your project's `src` directory, create a file named `create_table.rs` and add the code for your preferred driver. This script connects to your Neon database, creates a table named `books`, and inserts some sample data into it.

<CodeTabs labels={["postgres (sync)", "tokio-postgres (async)"]}>

```rust title="src/create_table.rs"
use dotenvy::dotenv;
use postgres::Client;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::env;

fn main() -> Result<(), Box<dyn std::error::Error>> {

    // Load environment variables from .env file
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

    // Insert a single book record
    client.execute(
        "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4)",
        &[&"The Catcher in the Rye", &"J.D. Salinger", &1951, &true],
    )?;
    println!("Inserted a single book.");

    // Start a transaction
    let mut transaction = client.transaction()?;
    println!("Starting transaction to insert multiple books...");

    // Data to be inserted
    let books_to_insert = [
        ("The Hobbit", "J.R.R. Tolkien", 1937, true),
        ("1984", "George Orwell", 1949, true),
        ("Dune", "Frank Herbert", 1965, false),
    ];

    // Loop and insert within the transaction
    for book in &books_to_insert {
        transaction.execute(
            "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4)",
            &[&book.0, &book.1, &book.2, &book.3],
        )?;
    }

    // Commit the transaction
    transaction.commit()?;
    println!("Inserted 3 rows of data.");

    Ok(())
}
```

```rust title="src/create_table.rs"
use tokio_postgres;
use dotenvy::dotenv;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    // Load environment variables from .env file
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

    // Insert a single book record
    client.execute(
        "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4)",
        &[&"The Catcher in the Rye", &"J.D. Salinger", &1951, &true],
    ).await?;
    println!("Inserted a single book.");

    // Start a transaction
    let transaction = client.transaction().await?;
    println!("Starting transaction to insert multiple books...");

    // Data to be inserted
    let books_to_insert = [
        ("The Hobbit", "J.R.R. Tolkien", 1937, true),
        ("1984", "George Orwell", 1949, true),
        ("Dune", "Frank Herbert", 1965, false),
    ];

    // Loop and insert within the transaction
    for book in &books_to_insert {
        transaction.execute(
            "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4)",
            &[&book.0, &book.1, &book.2, &book.3],
        ).await?;
    }

    // Commit the transaction
    transaction.commit().await?;
    println!("Inserted 3 rows of data.");

    Ok(())
}
```

</CodeTabs>

The above code does the following:

- Load the connection string from the `.env` file.
- Connect to the Neon database using a secure TLS connection.
- Drop the `books` table if it already exists to ensure a clean slate.
- Create a new table named `books` with columns for `id`, `title`, `author`, `publication_year`, and `in_stock`.
- Insert a single book record.
- Start a transaction to insert multiple book records in a single operation.

  <Admonition type="info" title="Why use a transaction for inserting multiple rows?">
  Unlike database drivers in some other languages that offer a single high-level method for bulk inserts (like [Python's](/docs/guides/python#create-a-table-and-insert-data) `executemany` in `psycopg2`), the idiomatic Rust approach is to loop through the data inside a transaction.

  This guarantees atomicity: all rows are inserted successfully, or none are inserted if an error occurs.
  </Admonition>

Run the script using the following command:

```bash
cargo run --bin create_table
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established
Finished dropping table (if it existed).
Finished creating table.
Inserted a single book.
Starting transaction to insert multiple books...
Inserted 3 rows of data.
```

### Read data

In your `src` directory, create a file named `read_data.rs`. This script connects to your database and retrieves all rows from the `books` table.

<CodeTabs labels={["postgres (sync)", "tokio-postgres (async)"]}>

```rust title="src/read_data.rs"
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

    // Fetch all rows from the books table
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

```rust title="src/read_data.rs"
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

    let (client, connection) = tokio_postgres::connect(&conn_string, connector).await?;
    println!("Connection established");

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    // Fetch all rows from the books table
    let rows = client.query("SELECT * FROM books ORDER BY publication_year;", &[]).await?;

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

</CodeTabs>

The above code does the following:

- Load the connection string from the `.env` file.
- Connect to the Neon database using a secure TLS connection.
- Use a `client.query` method to fetch all rows from the `books` table, ordered by `publication_year`.
- Print each book's details in a formatted output.

Run the script using the following command:

```bash
cargo run --bin read_data
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

In your `src` directory, create a file named `update_data.rs`. This script updates the stock status of the book 'Dune' to `true`.

<CodeTabs labels={["postgres (sync)", "tokio-postgres (async)"]}>

```rust title="src/update_data.rs"
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

    // Update a data row in the table
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

```rust title="src/update_data.rs"
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

    let (client, connection) = tokio_postgres::connect(&conn_string, connector).await?;
    println!("Connection established");

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    // Update a data row in the table
    let updated_rows = client.execute(
        "UPDATE books SET in_stock = $1 WHERE title = $2",
        &[&true, &"Dune"],
    ).await?;

    if updated_rows > 0 {
        println!("Updated stock status for 'Dune'.");
    } else {
        println!("'Dune' not found or stock status already up to date.");
    }

    Ok(())
}
```

</CodeTabs>

The above code does the following:

- Load the connection string from the `.env` file.
- Connect to the Neon database using a secure TLS connection.
- Use a `client.execute` method to update the stock status of the book 'Dune' to `true`.

Run the script using the following command:

```bash
cargo run --bin update_data
```

After running this script, you can run `read_data` again to verify that the row was updated.

```bash
cargo run --bin read_data
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: true
ID: 3, Title: 1984, Author: George Orwell, Year: 1949, In Stock: true
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: true
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: true
---------------------
```

> You can see that the stock status for 'Dune' has been updated to `True`.

### Delete data

In your `src` directory, create a file named `delete_data.rs`. This script deletes the book '1984' from the `books` table.

<CodeTabs labels={["postgres (sync)", "tokio-postgres (async)"]}>

```rust title="src/delete_data.rs"
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

    // Delete a data row from the table
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

```rust title="src/delete_data.rs"
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

    let (client, connection) = tokio_postgres::connect(&conn_string, connector).await?;
    println!("Connection established");

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    // Delete a data row from the table
    let deleted_rows = client.execute(
        "DELETE FROM books WHERE title = $1",
        &[&"1984"],
    ).await?;

    if deleted_rows > 0 {
        println!("Deleted the book '1984' from the table.");
    } else {
        println!("'1984' not found in the table.");
    }

    Ok(())
}
```

</CodeTabs>

The above code does the following:

- Load the connection string from the `.env` file.
- Connect to the Neon database using a secure TLS connection.
- Use a `client.execute` method to delete the book '1984' from the `books` table.

Run the script using the following command:

```bash
cargo run --bin delete_data
```

After running this script, run `read_data` again to verify that the row was deleted.

```bash
cargo run --bin read_data
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

## Source code

You can find the source code for the applications described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-rust-postgres" description="Get started with Rust and Neon using the synchronous postgres crate" icon="github">Get started with Rust and Neon using postgres</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-rust-tokio-postgres" description="Get started with Rust and Neon using the asynchronous tokio-postgres crate" icon="github">Get started with Rust and Neon using tokio-postgres</a>

</DetailIconCards>

## Resources

- [The Rust Programming Language Book](https://doc.rust-lang.org/book/)
- [rust-postgres crate documentation](https://docs.rs/postgres/latest/postgres/)
- [tokio-postgres crate documentation](https://docs.rs/tokio-postgres/latest/tokio_postgres/)
- [Tokio async runtime](https://tokio.rs/)

<NeedHelp/>

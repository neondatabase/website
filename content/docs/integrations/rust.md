---
title: Getting Started with Rust
redirectFrom:
  - /docs/quickstart/rust
---

This topic describes how to create a Neon project and connect to it from a Rust app.

1. [Create a Neon project](#create-a-neon-project)
2. [Configure the connection](#configure-the-connection)

## Create a Neon project

When creating a Neon project, take note of your user name, password, and database name. This information is required when configuring a connection from your Rust app. 

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Enter a name for your project and click **Create Project**.

## Configure the connection

Add the Neon connection details to your `main.rs` file.

```rust
use postgres::{Client, NoTls};

fn main() {
 let mut client = Client::connect("user=<user> dbname=<dbname> host=pg.neon.tech password=<password>", NoTls).expect("connection error");

 for row in client.query("select version()", &[]).expect("query error") {
     let version: &str = row.get(0);
     println!("version: {}", version);
 }
}
```

where:

- `<user>` is the database user, which is found on the project **Dashboard**, under **Connection Details**.
- `<dbname>` is the database name (the default Neon project database is `main`).
- `<password>` is the database user's password, which is provided to you when you create a Neon project.

**_Note_**: The sample connection code shown above is also available on the [rust-lang playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=0d9daa9cde3c74d2916c8f05b24707a3).
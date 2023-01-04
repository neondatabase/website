---
title: Connect a Rust application to Neon
redirectFrom:
  - /docs/quickstart/rust
  - /docs/integrations/rust
---

This guide describes how to create a Neon project and connect to it from a Rust application.

1. [Create a Neon project](#create-a-neon-project)
2. [Configure the connection](#configure-the-connection)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

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

- `<user>` is the database user.
- `<dbname>` is the name of the database. The default Neon database is `neondb`
- `<password>` is the database user's password, which is provided to you when you create a Neon project.

You can find all of the connection details listed above, except for your password,  in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](../../connect/connect-from-any-app). If you have misplaced your password, see [Reset a password](../../manage/users/#reset-a-password).

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).

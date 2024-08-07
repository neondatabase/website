---
title: Connect a Rust application to Neon
subtitle: Set up a Neon project in seconds and connect from a Rust application
redirectFrom:
  - /docs/quickstart/rust
  - /docs/integrations/rust
updatedOn: '2024-02-23T00:24:06.826Z'
---

This guide describes how to create a Neon project and connect to it from a Rust application.

1. [Create a Neon project](#create-a-neon-project)
2. [Configure the connection](#configure-the-connection)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection string and password. They are required when defining connection settings.

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Configure the connection

<Admonition type="note">
To run the Rust solution below you have to install the required dependencies. You can do this by running `cargo add postgres postgres_openssl openssl`.
</Admonition>

Add the Neon connection details to your `main.rs` file, as in the following example:

```rust
use postgres::Client;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::error;

fn main() -> Result<(), Box<dyn error::Error>> {
    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());

    let mut client = Client::connect("postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require", connector)?;

    for row in client.query("SELECT 42", &[])? {
        let ret : i32 = row.get(0);
        println!("Result = {}", ret);
    }

    Ok(())
}
```

You can find all of the connection details listed above in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

<NeedHelp/>

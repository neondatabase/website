---
title: Connecting Neon to your stack
subtitle: Learn how to integrate Neon into your application
enableTableOfContents: true
updatedOn: '2024-09-20T19:10:25.305Z'
---

Using Neon as the serverless database in your tech stack means configuring connections. Whether it’s a direct connection string from your language or framework, setting environment variables for your deployment platform, connecting to ORMs like Prisma, or configuring deployment settings for CI/CD workflows, it starts with the connection.

## Connecting to your application

This section provides connection string samples for various frameworks and languages, helping you integrate Neon into your tech stack.

<CodeTabs labels={["psql", ".env", "Next.js", "Drizzle", "Prisma", "Python", "Ruby", "Rust", "Go"]}>

```bash
# psql example connection string
psql postgresql://username:password@hostname:5432/database?sslmode=require
```

```ini
# .env example
PGHOST=hostname
PGDATABASE=database
PGUSER=username
PGPASSWORD=password
PGPORT=5432
```

```javascript
// Next.js example
import postgres from 'postgres';

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const conn = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
});

function selectAll() {
  return conn.query('SELECT * FROM hello_world');
}
```

```javascript
// Drizzle example with the Neon serverless driver
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);

const result = await db.select().from(...);
```

```javascript
// Prisma example with the Neon serverless driver
import { neon } from '@neondatabase/serverless';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const sql = neon(process.env.DATABASE_URL);

const adapter = new PrismaNeonHTTP(sql);

const prisma = new PrismaClient({ adapter });
```

```python
# Python example with psycopg2
import os
import psycopg2

# Load the environment variable
database_url = os.getenv('DATABASE_URL')

# Connect to the PostgreSQL database
conn = psycopg2.connect(database_url)

with conn.cursor() as cur:
    cur.execute("SELECT version()")
    print(cur.fetchone())

# Close the connection
conn.close()
```

```ruby
# Ruby example
require 'pg'
require 'dotenv'

# Load environment variables from .env file
Dotenv.load

# Connect to the PostgreSQL database using the environment variable
conn = PG.connect(ENV['DATABASE_URL'])

# Execute a query
conn.exec("SELECT version()") do |result|
  result.each do |row|
    puts "Result = #{row['version']}"
  end
end

# Close the connection
conn.close
```

```rust
// Rust example
use postgres::Client;
use openssl::ssl::{SslConnector, SslMethod};
use postgres_openssl::MakeTlsConnector;
use std::error;
use std::env;
use dotenv::dotenv;

fn main() -> Result<(), Box<dyn error::Error>> {
    // Load environment variables from .env file
    dotenv().ok();

    // Get the connection string from the environment variable
    let conn_str = env::var("DATABASE_URL")?;

    let builder = SslConnector::builder(SslMethod::tls())?;
    let connector = MakeTlsConnector::new(builder.build());
    let mut client = Client::connect(&conn_str, connector)?;

    for row in client.query("select version()", &[])? {
        let ret: String = row.get(0);
        println!("Result = {}", ret);
    }
    Ok(())
}
```

```go
// Go example
package main
import (
    "database/sql"
    "fmt"
    "log"
    "os"

    _ "github.com/lib/pq"
    "github.com/joho/godotenv"
)

func main() {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file: %v", err)
    }

    connStr := os.Getenv("DATABASE_URL")
    if connStr == "" {
        panic("DATABASE_URL environment variable is not set")
    }

    db, err := sql.Open("postgres", connStr)
    if err != nil {
        panic(err)
    }
    defer db.Close()

    var version string
    if err := db.QueryRow("select version()").Scan(&version); err != nil {
        panic(err)
    }
    fmt.Printf("version=%s\n", version)
}
```

</CodeTabs>

## Obtaining connection details

When connecting to Neon from an application or client, you connect to a database in your Neon project. In Neon, a database belongs to a branch, which may be the default branch of your project (`main`) or a child branch.

You can obtain the database connection details you require from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a compute, a database, and a role. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

Neon supports pooled and direct connections to the database. Use a pooled connection string if your application uses a high number of concurrent connections. For more information, see [Connection pooling](/docs/connect/connection-pooling#connection-pooling).

A Neon connection string includes the role, password, hostname, and database name.

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
             ^    ^         ^                                               ^
       role -|    |         |- hostname                                     |- database
                  |
                  |- password
```

<Admonition type="note">
The hostname includes the ID of the compute, which has an `ep-` prefix: `ep-cool-darkness-123456`. For more information about Neon connection strings, see [Connection string](/docs/reference/glossary#connection-string).
</Admonition>

## Using connection details

You can use the details from the connection string or the connection string itself to configure a connection. For example, you might place the connection details in an `.env` file, assign the connection string to a variable, or pass the connection string on the command-line.

### `.env` file

```text
PGUSER=alex
PGHOST=ep-cool-darkness-123456.us-east-2.aws.neon.tech
PGDATABASE=dbname
PGPASSWORD=AbC123dEf
PGPORT=5432
```

### Variable

```text shouldWrap
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname"
```

### Command-line

```bash shouldWrap
psql postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
```

<Admonition type="note">
Neon requires that all connections use SSL/TLS encryption, but you can increase the level of protection by appending an `sslmode` parameter setting to your connection string. For instructions, see [Connect to Neon securely](/docs/connect/connect-securely).
</Admonition>

## FAQs

### Where do I obtain a password?

It's included in your Neon connection string, which you can find on the Neon **Dashboard**, in the **Connection Details** widget.

### What port does Neon use?

Neon uses the default Postgres port, `5432`.

## Network protocol support

Neon projects provisioned on AWS support both [IPv4](https://en.wikipedia.org/wiki/Internet_Protocol_version_4) and [IPv6](https://en.wikipedia.org/wiki/IPv6) addresses. Neon project provisioned on Azure currently on support IPv4.

Additionally, Neon provides a serverless driver that supports both WebSocket and HTTP connections. For further information, refer to our [Neon serverless driver](/docs/serverless/serverless-driver) documentation.

## Connection notes

- Some older client libraries and drivers, including older `psql` executables, are built without [Server Name Indication (SNI)](/docs/reference/glossary#sni) support and require a workaround. For more information, see [Connection errors](/docs/connect/connection-errors).
- Some Java-based tools that use the pgJDBC driver for connecting to Postgres, such as DBeaver, DataGrip, and CLion, do not support including a role name and password in a database connection string or URL field. When you find that a connection string is not accepted, try entering the database name, role, and password values in the appropriate fields in the tool's connection UI

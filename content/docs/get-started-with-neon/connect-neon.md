---
title: Connecting Neon to your stack
subtitle: Learn how to integrate Neon into your application
enableTableOfContents: true
updatedOn: '2024-02-27T14:37:51.432Z'
---

Using Neon as the serverless database in your tech stack means configuring connections. Whether it’s a direct connection string from your language or framework, setting environment variables for your deployment platform, connecting to ORMs like Prisma, or configuring deployment settings for CI/CD workflows, it starts with the connection.

## Connecting to your application

This section provides connection string samples for various frameworks and languages, helping you integrate Neon into your tech stack.

<CodeTabs labels={["psql", ".env", "Next.js", "Node.js", "Drizzle", "Prisma", "Python", "Django",  "Java", "Symfony", "Go", "Ruby"]}>

```bash
# psql example connection string
psql postgres://username:password@hostname:5432/database?sslmode=require
```

```text
# .env example connection string
PGHOST=hostname
PGDATABASE=database
PGUSER=username
PGPASSWORD=password
PGPORT=5432
```

```javascript
// Next.js example connection string
import postgres from "postgres";

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;


const conn = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
});

function selectAll() {
  return conn.query("SELECT * FROM hello_world");
}
```

```javascript
// Node.js example connection string
const postgres = require('postgres');
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();
```

```javascript
// Drizzle with the Neon serverless driver
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
    
const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql);
    
const result = await db.select().from(...);
```

```javascript
// Prisma with the Neon serverless driver 
import { neon } from '@neondatabase/serverless'
import { PrismaNeonHTTP } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const sql = neon(process.env.DATABASE_URL)

const adapter = new PrismaNeonHTTP(sql)

const prisma = new PrismaClient({ adapter })
```

```python
# Python psycopg2 example
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

```python
# Django example connection string
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'database',
        'USER': 'username',
        'PASSWORD': 'password',
        'HOST': 'hostname',
        'PORT': '5432',
    }
}
```

```java
// Java example connection string
jdbc:postgresql://hostname/dbname?user=usernamer&password=password&sslmode=require
```

```yaml
# Symfony example connection string
doctrine:
    dbal:
        url: '%env(resolve:DATABASE_URL)%'

# In your .env file
DATABASE_URL="postgres://user:password@hostname/dbname?charset=utf8&sslmode=require"
```

```go
// Go example connection string
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

```ruby
# config/database.yml
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

### .env File
DATABASE_URL="postgres://user:password@hostname/dbname"
```

</CodeTabs>

## Obtaining Connection Details

When connecting to Neon from an application or client, you connect to a database in your Neon project. In Neon, a database belongs to a branch, which may be the primary branch of your project (`main`) or a child branch.

You can obtain the database connection details you require from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a compute, a database, and a role. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

Neon supports pooled and direct connections to the database. Use a pooled connection string if your application uses a high number of concurrent connections. For more information, see [Connection pooling](/docs/connect/connection-pooling#connection-pooling).

A Neon connection string includes the role, password, hostname, and database name.

```text
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
           ^    ^         ^                                               ^
     role -|    |         |- hostname                                     |- database
                |
                |- password
```

<Admonition type="note">
The hostname includes the ID of the compute endpoint, which has an `ep-` prefix: `ep-cool-darkness-123456`. For more information about Neon connection strings, see [Connection string](/docs/reference/glossary#connection-string).
</Admonition>

## Using Connection Details

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
DATABASE_URL="postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname"
```

### Command-line

```bash shouldWrap
psql postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
```

<Admonition type="note">
Neon requires that all connections use SSL/TLS encryption, but you can increase the level of protection by appending an `sslmode` parameter setting to your connection string. For instructions, see [Connect to Neon securely](/docs/connect/connect-securely).
</Admonition>

## FAQs

### Where do I obtain a password?

It's included in your Neon connection string, which you can find on the Neon **Dashboard**, in the **Connection Details** widget.

### What port does Neon use?

Neon uses the default Postgres port, `5432`.

## Network Protocol Support

Neon supports both [IPv4](https://en.wikipedia.org/wiki/Internet_Protocol_version_4) and [IPv6](https://en.wikipedia.org/wiki/IPv6) addresses.

Additionally, Neon provides a serverless driver that supports both WebSocket and HTTP connections. For further information, refer to our [Neon serverless driver](/docs/serverless/serverless-driver) documentation.

## Connection Notes

- Some older client libraries and drivers, including older `psql` executables, are built without [Server Name Indication (SNI)](/docs/reference/glossary#sni) support and require a workaround. For more information, see [Connection errors](/docs/connect/connection-errors).
- Some Java-based tools that use the pgJDBC driver for connecting to Postgres, such as DBeaver, DataGrip, and CLion, do not support including a role name and password in a database connection string or URL field. When you find that a connection string is not accepted, try entering the database name, role, and password values in the appropriate fields in the tool's connection UI
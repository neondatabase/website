---
title: Connecting Neon to your stack
subtitle: Learn how to integrate Neon into your application
enableTableOfContents: true
updatedOn: '2024-02-27T14:37:51.432Z'
---

Using Neon as the serverless database in your tech stack means configuring connections. Whether it’s a direct connection string from your language or framework, setting environment variables for your deployment platform, connecting to ORMs like Prisma, or configuring deployment settings for CI/CD workflows, it starts with the connection.

## Connecting to your application

This section provides connection string samples for various frameworks and languages, helping you integrate Neon into your tech stack.

<CodeTabs labels={["psql", ".env", "Next.js", "Prisma", "Node.js", "Django", "SQLAlchemy", "Java", "Symfony", "Go", "Ruby on Rails"]}>

```bash
# psql example connection string
psql postgres://username:password@hostname:5432/database
```

```text
# .env example connection string
PGUSER=username
PGHOST=hostname
PGDATABASE=database
PGPASSWORD=password
PGPORT=5432
```

```javascript
// Next.js example connection string
const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://username:password@hostname:5432/database',
});
client.connect();
```

```prisma
// Prisma example connection string
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// In your .env file
DATABASE_URL="postgres://username:password@hostname:5432/database"
```

```javascript
// Node.js example connection string
const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://username:password@hostname:5432/database',
});
client.connect();
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

```python
# SQLAlchemy example connection string
from sqlalchemy import create_engine
engine = create_engine('postgresql://username:password@hostname:5432/database')
```

```java
// Java example connection string
String url = "jdbc:postgresql://hostname:5432/database?user=username&password=password";
```

```yaml
# Symfony example connection string
doctrine:
    dbal:
        url: '%env(resolve:DATABASE_URL)%'

# In your .env file
DATABASE_URL="postgres://username:password@hostname:5432/database"
```

```go
// Go example connection string
import (
  "database/sql"
  _ "github.com/lib/pq"
)
const connStr = "postgres://username:password@hostname:5432/database"
db, err := sql.Open("postgres", connStr)
```

```ruby
# config/database.yml
production:
  adapter: postgresql
  url: <%= ENV['DATABASE_URL'] =%>

### .env File
DATABASE_URL="postgres://<DB_ROLE>:<DB_PASSWORD>@<DB_HOSTNAME>/<DB_DATABASE_NAME>"

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
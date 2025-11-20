---
title: Building resilient applications with Postgres
subtitle: Learn best practices for building applications that gracefully handle brief connection drops with Managed Postgres services
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-11-13T00:00:00.000Z'
updatedOn: '2025-11n-13T00:00:00.000Z'
---

Building resilient applications is essential when working with managed database services, where brief connection drops though rare can occur. While this guide uses Neon as an example, these best practices and code examples apply to **any** managed database service, helping you handle interruptions gracefully and keep your application stable and responsive.

Managed database services routinely perform maintenance, apply updates, and optimize resources. While some maintenance can be scheduled, urgent security patches or critical updates may require brief compute restarts. These restarts can lead to temporary connection drops lasting a few seconds.

Instead of treating these events as errors, robust applications anticipate and handle them gracefully. This guide teaches you best practices and patterns such as connection pooling, intelligent retry logic, and idempotency for write operations that work across managed database services, ensuring your application remains stable and provides a seamless user experience.

## Understanding connection drops in Neon

In Neon, compute and storage are separate, so a "connection drop" typically means your compute instance has restarted: a fast operation that usually lasts only a few seconds. Understanding these restarts as a resilience challenge, not an availability issue, is key to building durable applications.

Compute restarts most commonly occur for three reasons:

- [Platform Maintenance](/docs/manage/platform-maintenance): Neon periodically performs essential infrastructure maintenance to ensure security, reliability, and performance, which sometimes requires a brief compute restart.
- [Compute Updates](/docs/manage/updates): To keep your Postgres instances optimized and current, Neon applies updates that require a quick restart.
- [Scale to Zero](/docs/introduction/scale-to-zero): To save costs, Neon automatically suspends idle computes after a period of inactivity (5 minutes by default on the Free plan). The first connection to a suspended compute triggers a "cold start," adding a few hundred milliseconds to connection time. Existing idle connections are terminated when the compute suspends.

For more details on schedules and the nature of these events, see [Neon Maintenance and updates overview](/docs/manage/maintenance-updates-overview).

## Core strategies for resilience

Building a resilient application involves three core strategies: using a connection pool, implementing intelligent retry logic, and configuring appropriate timeouts.

### Use a connection pool

A connection pool is essential. Instead of opening and closing connections for each query, a pool maintains a set of open connections that your application can borrow and return. This significantly reduces the overhead of establishing new connections and is the foundation for handling interruptions gracefully. Most production-grade database drivers and ORMs provide robust connection pooling implementations.

### Implement retry logic with exponential backoff

When a connection fails, your application shouldn't give up immediately. It should retry the operation. The best practice is to use **exponential backoff with jitter**:

- **Exponential Backoff**: Increase the delay between retries exponentially (e.g., 1s, 2s, 4s, 8s). This prevents overwhelming the server with rapid-fire retries if it's in the process of restarting.
- **Jitter**: Add a small, random amount of time to each delay. This prevents multiple instances of your application from retrying in lockstep (a [thundering herd problem](https://en.wikipedia.org/wiki/Thundering_herd_problem)), which can overload the database.

### Configure connection timeouts

A compute restart or cold start on Neon typically takes only a few hundred milliseconds, though in very rare cases it can extend to a few seconds. If your application's connection timeout is too aggressive (e.g., 1 second), it may fail before the compute is ready. It is thus recommended to set a connection timeout of at least **10-15 seconds** to comfortably handle these brief interruptions.

## Handling database errors

A resilient application needs to distinguish between temporary network issues and permanent application errors. This is done by inspecting error codes and, for write operations, ensuring safety through idempotency.

### Identifying transient errors with SQLSTATE

When a connection is terminated by Neon during a restart, Postgres sends a specific error code known as a `SQLSTATE`. Your application's retry logic should look for these specific codes to distinguish between a temporary (transient) issue and a permanent one (like invalid credentials).

The most common transient error codes you'll encounter with Neon are:

| SQLSTATE | Error Name                  | Description                                                              |
| :------- | :-------------------------- | :----------------------------------------------------------------------- |
| `57P01`  | `admin_shutdown`            | The server is shutting down. This is the typical error during a restart. |
| `08006`  | `connection_failure`        | The connection to the server was lost.                                   |
| `08003`  | `connection_does_not_exist` | The connection attempt failed because the server was not available.      |

Most database drivers wrap these SQLSTATEs in higher-level exceptions (e.g., `OperationalError` in Python's `psycopg` or a specific `NpgsqlException` in .NET). Your code should catch these exceptions and inspect them to decide whether to retry.

### Handling transactions and Idempotency

Retrying database operations is straightforward for read-only queries (`SELECT`), but write operations (`INSERT`, `UPDATE`, `DELETE`) require special care to avoid unintended side effects.

- **Read transactions**: If a connection drops during a `SELECT` query, it is always safe to reconnect and retry the query. The operation has no side effects on the state of the database.

- **Write transactions**: Retrying a write transaction is more complex due to the ambiguity of connection failures.

<Admonition type="important" title="The Challenge: Acknowledgment Loss">
Consider this scenario:
1. Your application sends a `COMMIT` command for an `INSERT` transaction.
2. The database successfully commits the transaction to disk.
3. A transient network failure occurs, and the success acknowledgment message from the database never reaches your application.

Your application receives a connection error and is left in an ambiguous state: it doesn't know if the transaction was committed or rolled back. A naive retry would re-execute the `INSERT`, potentially creating duplicate data, for example, charging a customer twice or creating a duplicate order.

While this specific scenario of a lost commit acknowledgment is rare, it is a critical edge case to handle for systems where data integrity is paramount, such as e-commerce, financial services, or booking platforms.
</Admonition>

#### The Idempotency Key Pattern

A robust solution is to make your write operations **idempotent**. An idempotent operation is one that can be performed multiple times with the same result as if it were performed only once. This can be achieved by using a client-generated **idempotency key**.

The pattern works as follows:

1.  **Generate a unique key**: Before the first attempt of a transaction, your application generates a unique identifier (e.g., a UUID). This key represents this specific operation and will be used for all retries of it.

2.  **Add a unique constraint**: In your database schema, add a column to your target table to store this idempotency key. This column must have a `UNIQUE` constraint.

    ```sql shouldWrap
    CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        idempotency_key UUID UNIQUE, -- Ensures each operation runs only once
        product_id INT,
        quantity INT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ```

3.  **Include the key in your transaction**: When your application performs the `INSERT` operation, it includes the generated idempotency key.

    ```sql shouldWrap
    -- In your application code
    idempotency_key = "f47ac10b-58cc-4372-a567-0e02b2c3d479"; -- Generated once per operation
    product = 123;
    quantity = 2;

    -- SQL sent to the database
    INSERT INTO orders (idempotency_key, product_id, quantity)
    VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 123, 2);
    ```

4.  **Handle the outcome and retries**:
    - If the first attempt succeeds, the key is stored in the database.
    - If the connection drops and your application retries the transaction with the **same idempotency key**, the database's `UNIQUE` constraint will prevent a duplicate insert. The database will return a `unique_violation` error (SQLSTATE `23505`).
    - Your application's retry logic should catch this specific `unique_violation` error and interpret it as a **successful commit from a previous attempt**, not as a failure. It can then safely proceed, knowing the operation is complete.

This pattern transforms an ambiguous connection error into a definitive success signal, ensuring that critical write operations are safely retriable without duplicating data.

## Language specific examples

The following code examples demonstrate implementing connection pooling, configuring appropriate timeouts, and adding retry logic with exponential backoff and jitter in various programming languages.

### Node.js

<Tabs labels={["node-postgres", "postgres.js", "Neon Serverless Driver" ]}>

<TabItem>

You can use the popular `pg` library (node-postgres) along with `async-retry` for implementing retry logic. Install the required packages:

```bash shouldWrap
npm install pg async-retry dotenv
```

The following example demonstrates these concepts:

```javascript shouldWrap
require('dotenv').config();
const { Pool } = require('pg');
const retry = require('async-retry');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 60000,
  max: 20,
});

function isTransientError(err) {
  const transientErrorCodes = ['57P01', '08006', '08003'];
  const transientErrorMessages = [
    'Connection terminated unexpectedly',
    'terminating connection due to administrator command',
    'Client has encountered a connection error and is not queryable',
    'network issue',
    'early eof',
    "Couldn't connect to compute node",
  ];

  return (
    transientErrorCodes.includes(err.code) ||
    transientErrorMessages.some((msg) => err.message.includes(msg))
  );
}

async function queryWithRetry(query, params) {
  return await retry(
    async (bail) => {
      const client = await pool.connect();

      // Handle background errors to prevent the app from crashing
      client.on('error', (err) => {
        console.error('[pg] A background error occurred on an active client:', err.stack);
      });

      try {
        console.log('Attempting to execute query...');
        const result = await client.query(query, params);
        console.log('Query successful!');
        return result;
      } catch (err) {
        console.warn(`Query failed with error: ${err.message}`);
        if (!isTransientError(err)) {
          console.error('Non-retriable error encountered.');
          bail(err); // Stop retrying for non-transient errors
          return;
        }

        // Throwback the error to trigger a retry for transient errors
        throw err;
      } finally {
        // The pool will discard the client if it's in an error state.
        client.release();
      }
    },
    {
      retries: 5, // Number of retry attempts
      factor: 2, // Exponential backoff factor
      minTimeout: 1000, // Initial delay 1s
      maxTimeout: 16000, // Max delay 16s
      randomize: true, // Add jitter to delays
      onRetry: (error, attempt) => {
        console.log(`Retrying... Attempt ${attempt}. Error: ${error.message}`);
      },
    }
  );
}

// --- Example Usage: Replace with your actual query ---
async function main() {
  try {
    const { rows } = await queryWithRetry('SELECT version()');
    console.log('PostgreSQL version:', rows[0].version);
  } catch (error) {
    console.error('Failed to execute query after multiple retries:', error.message);
  } finally {
    await pool.end();
  }
}

main();
```

In the above code:

- A connection pool is created with appropriate connection and idle timeouts.
- The `isTransientError` function checks if an error is transient based on `SQLSTATE` codes and error messages.
- The `queryWithRetry` function wraps the query execution in a retry mechanism using `async-retry`, implementing exponential backoff with jitter.
- The complete example demonstrates querying Postgres with a retry logic. It retries up to 5 times on transient errors, using exponential backoff with delays starting at 1 second and increasing to a maximum of 16 seconds, plus jitter.

</TabItem>

<TabItem>

You can also use the `postgres.js` library with `async-retry` for retry logic. Install the required packages:

```bash shouldWrap
npm install postgres async-retry dotenv
```

```javascript shouldWrap
require('dotenv').config();
const postgres = require('postgres');
const retry = require('async-retry');

const sql = postgres(process.env.DATABASE_URL, {
  connect_timeout: 15, // 15 seconds
  idle_timeout: 60, // 60 seconds
  max: 20, // max connections
  onnotice: () => {}, // suppress notices (optional)
});

function isTransientError(err) {
  const transientErrorCodes = ['57P01', '08006', '08003', 'CONNECTION_CLOSED'];
  const transientErrorMessages = [
    'Connection terminated unexpectedly',
    'terminating connection due to administrator command',
    'Client has encountered a connection error and is not queryable',
    'network issue',
    'early eof',
    "Couldn't connect to compute node",
  ];

  return (
    transientErrorCodes.includes(err.code) ||
    transientErrorMessages.some((msg) => err.message && err.message.includes(msg))
  );
}

async function queryWithRetry(query, params = []) {
  return await retry(
    async (bail) => {
      try {
        console.log('Attempting to execute query...');
        const result = await sql.unsafe(query, params);
        console.log('Query successful!');
        return result;
      } catch (err) {
        console.warn(`Query failed with error: ${err.message}`);
        if (!isTransientError(err)) {
          console.error('Non-retriable error encountered.');
          bail(err); // Stop retrying for non-transient errors
          return;
        }

        // Throw the error to trigger a retry for transient errors
        throw err;
      }
    },
    {
      retries: 5, // Number of retry attempts
      factor: 2, // Exponential backoff factor
      minTimeout: 1000, // Initial delay 1s
      maxTimeout: 16000, // Max delay 16s
      randomize: true, // Add jitter to delays
      onRetry: (error, attempt) => {
        console.log(`Retrying... Attempt ${attempt}. Error: ${error.message}`);
      },
    }
  );
}

// --- Example Usage: Replace with your actual query ---
async function main() {
  try {
    const rows = await queryWithRetry('SELECT version()');
    console.log('PostgreSQL version:', rows[0].version);
  } catch (error) {
    console.error('Failed to execute query after multiple retries:', error.message);
  } finally {
    await sql.end();
  }
}

main();
```

The above code:

- Initializes the `postgres.js` client with appropriate connection and idle timeouts.
- The `isTransientError` function checks if an error is transient based on `SQLSTATE` codes and error messages.
- The `queryWithRetry` function wraps the query execution in a retry mechanism using `async-retry`, implementing exponential backoff with jitter.
- The complete example demonstrates querying Postgres with a retry logic. It retries up to 5 times on transient errors, using exponential backoff with delays starting at 1 second and increasing to a maximum of 16 seconds, plus jitter.

</TabItem>

<TabItem>

The [Neon Serverless Driver](/docs/serverless/serverless-driver) communicates over [HTTP](/docs/serverless/serverless-driver#use-the-driver-over-http) or [WebSockets](/docs/serverless/serverless-driver#use-the-driver-over-websockets).

- You can use the Neon serverless driver with WebSocket in the same way you would use normal `node-postgres` with [Pool and Client](/docs/serverless/serverless-driver#use-the-driver-over-websockets). Thus, for WebSocket connections, the retry approach is similar to other drivers, employing connection pooling and retry logic as demonstrated for `node-postgres`.
- For HTTP connections, the notion of a "dropped connection" is different, as each request is stateless. Because the driver is built on `fetch`, you should wrap your database queries in a standard HTTP retry library or a manual retry loop.

The following example demonstrates using the Neon Serverless Driver over HTTP with `async-retry` for retry logic. Install the required packages:

```bash shouldWrap
npm install @neondatabase/serverless async-retry dotenv
```

```javascript shouldWrap
import { neon } from '@neondatabase/serverless';
import retry from 'async-retry';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function runQueryWithRetry(query) {
  try {
    const result = await retry(
      async (bail) => {
        const [row] = await sql.query(query);
        return row;
      },
      {
        retries: 5,
        factor: 2,
        minTimeout: 1000,
        randomize: true,
        onRetry: (err, attempt) => {
          console.warn(`Query failed, attempt ${attempt}: ${err.message}`);
        },
      }
    );
    console.log('Query successful! Result:', result);
  } catch (error) {
    console.error('Failed to query after multiple retries:', error.message);
  }
}

// --- Example Usage ---
runQueryWithRetry('SELECT VERSION();').catch(console.error);
```

In this example:

- The Neon Serverless Driver is initialized with the database URL.
- The `runQueryWithRetry` function wraps the query execution in a retry mechanism using `async-retry`, implementing exponential backoff with jitter.
- The complete example demonstrates querying Postgres with a retry logic. It retries up to 5 times on any error, using exponential backoff with delays starting at 1 second and increasing, plus jitter.

</TabItem>

</Tabs>

### Python

The following example uses the `psycopg` library (v3) with its built-in connection pool and the `tenacity` library for retry logic. Install the required packages:

```bash shouldWrap
pip install "psycopg[pool]" "psycopg[binary]" tenacity python-dotenv
```

```python shouldWrap
import os

from dotenv import load_dotenv
from psycopg.errors import OperationalError
from psycopg_pool import ConnectionPool
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_random_exponential,
)

load_dotenv()

pool = ConnectionPool(
    conninfo=os.getenv("DATABASE_URL"),
    min_size=2,
    max_size=10,
    open=True,
    kwargs={"connect_timeout": 15},
)


# Configure retry logic with tenacity:
# - Retry only on `OperationalError`, which psycopg raises for connection issues.
# - Stop after 5 attempts.
# - Use exponential backoff with jitter.
@retry(
    retry=retry_if_exception_type(OperationalError),
    stop=stop_after_attempt(5),
    wait=wait_random_exponential(multiplier=1, max=16),
)
def run_query(query, params=None):
    print("Attempting to connect and run query...")
    # The `with pool.connection()` block ensures the connection is
    # properly returned to the pool, even if errors occur.
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            print("Query successful!")
            return cur.fetchall()


# --- Example Usage ---
if __name__ == "__main__":
    try:
        result = run_query("SELECT version();")
        print(f"PostgreSQL version: {result[0][0]}")
    except OperationalError as e:
        print(f"Failed to connect to the database after multiple retries: {e}")
    finally:
        # Gracefully close all connections in the pool
        pool.close()
```

In the above code:

- A connection pool is created with appropriate connection timeouts.
- The `run_query` function is decorated with `tenacity`'s `@retry` to implement retry logic that retries on `OperationalError` (which indicates connection issues) with exponential backoff and jitter.
- The complete example demonstrates querying Postgres with retry logic. It retries up to 5 times on connection errors, using exponential backoff with delays starting at 1 second and increasing to a maximum of 16 seconds, plus jitter.

### .NET (C#)

The following example uses the `Npgsql` library with its built-in connection pooling and the `Polly` library for retry logic. Install the required packages via NuGet:

```bash shouldWrap
dotnet add package Npgsql
dotnet add package Polly
dotnet add package Microsoft.Extensions.Configuration
dotnet add package Microsoft.Extensions.Configuration.Json
```

```csharp shouldWrap
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Polly;

class Program
{
    static async Task Main(string[] args)
    {
        // 1. Load configuration from appsettings.json
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        string? connectionString = config.GetConnectionString("DefaultConnection");

        if (string.IsNullOrEmpty(connectionString))
        {
            Console.WriteLine("Error: Connection string 'DefaultConnection' was not found in appsettings.json.");
            return;
        }

        // 2. Setup Pooling
        using var dataSource = NpgsqlDataSource.Create(connectionString);

        // 3. Define the Retry Policy
        var retryPolicy = Policy
            .Handle<NpgsqlException>(ex =>
            {
                if (ex.IsTransient) return true;

                var msg = ex.Message;
                if (msg.Contains("Couldn't connect to compute node") ||
                    msg.Contains("Connection terminated unexpectedly") ||
                    msg.Contains("terminating connection due to administrator command") ||
                    msg.Contains("Client has encountered a connection error") ||
                    msg.Contains("network issue") ||
                    msg.Contains("early eof"))
                {
                    return true;
                }

                return false;
            })
            .WaitAndRetryAsync(
                retryCount: 5,
                sleepDurationProvider: retryAttempt =>
                {
                    var delay = TimeSpan.FromSeconds(Math.Pow(2, retryAttempt - 1));
                    var jitter = TimeSpan.FromMilliseconds(new Random().Next(0, 1000));
                    return delay + jitter;
                },
                onRetry: (exception, timeSpan, retryCount, context) =>
                {
                    Console.WriteLine($"Retrying... Attempt {retryCount}. Error: {exception.Message}");
                }
            );

        // 4. Execute the logic
        try
        {
            await QueryWithRetry(dataSource, retryPolicy, "SELECT version()");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Failed after multiple retries: {ex.Message}");
        }
    }

    static async Task QueryWithRetry(NpgsqlDataSource dataSource, AsyncPolicy policy, string query)
    {
        await policy.ExecuteAsync(async () =>
        {
            Console.WriteLine("Attempting to execute query...");

            using var conn = await dataSource.OpenConnectionAsync();
            using var cmd = new NpgsqlCommand(query, conn);

            var result = await cmd.ExecuteScalarAsync();

            Console.WriteLine("Query successful!");
            Console.WriteLine($"PostgreSQL version: {result}");
        });
    }
}
```

In the above code:

- A connection pool is created using `NpgsqlDataSource` with appropriate connection timeouts.
- The retry policy is defined using `Polly`, which retries on transient `NpgsqlExceptions` and specific error messages, implementing exponential backoff with jitter.
- The `QueryWithRetry` method executes the query within the retry policy.
- The complete example demonstrates querying Postgres with retry logic. It retries up to 5 times on transient errors, using exponential backoff with delays starting at 1 second and increasing to a maximum of 16 seconds, plus jitter.

### Java

The following example uses the `HikariCP` library for connection pooling and the `Failsafe` library for retry logic. Install the required dependencies via Maven:

```xml shouldWrap
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <version>42.7.2</version>
</dependency>
<dependency>
  <groupId>com.zaxxer</groupId>
  <artifactId>HikariCP</artifactId>
  <version>5.1.0</version>
</dependency>
<dependency>
  <groupId>dev.failsafe</groupId>
  <artifactId>failsafe</artifactId>
  <version>3.3.2</version>
</dependency>
<dependency>
  <groupId>io.github.cdimascio</groupId>
  <artifactId>dotenv-java</artifactId>
  <version>3.0.0</version>
</dependency>
<dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>slf4j-simple</artifactId>
  <version>1.7.36</version>
</dependency>
```

```java shouldWrap
package com.example;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import dev.failsafe.Failsafe;
import dev.failsafe.RetryPolicy;
import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;

public class App {

    private static final HikariDataSource pool;

    static {
        Dotenv dotenv = Dotenv.load();
        HikariConfig config = new HikariConfig();

        config.setJdbcUrl(dotenv.get("DATABASE_URL"));
        config.setConnectionTimeout(15000); // 15s
        config.setIdleTimeout(60000);  // 60s
        config.setMaximumPoolSize(20);
        config.setAutoCommit(true);

        pool = new HikariDataSource(config);
    }

    public static void main(String[] args) {
        try {
            String version = queryWithRetry("SELECT version()");
            System.out.println("Transaction Finished. PostgreSQL version: " + version);
        } catch (Exception e) {
            System.err.println("Failed to execute transaction after multiple retries: " + e.getMessage());
        } finally {
            pool.close();
        }
    }

    public static String queryWithRetry(String sql) {
        RetryPolicy<String> retryPolicy = RetryPolicy.<String>builder()
                .handle(SQLException.class)
                .withMaxRetries(5)
                .withBackoff(Duration.ofMillis(1000), Duration.ofMillis(16000), 2.0)
                .withJitter(0.5)
                .abortOn(e -> !isTransientError((SQLException) e))
                .onRetry(e -> System.out.println("Retrying... Attempt " + e.getAttemptCount() + ". Error: " + e.getLastException().getMessage()))
                .build();

        return Failsafe.with(retryPolicy).get(() -> {
            System.out.println("Attempting to execute transaction...");

            // Get connection
            try (Connection client = pool.getConnection()) {

                // Begin transaction
                client.setAutoCommit(false);

                try {
                    String resultVersion = null;

                    try (PreparedStatement stmt = client.prepareStatement(sql)) {
                        try (ResultSet rs = stmt.executeQuery()) {
                            System.out.println("Query 1 successful!");
                            if (rs.next()) {
                                resultVersion = rs.getString(1);
                            }
                        }
                    }

                    if (resultVersion == null) {
                        client.rollback();
                        return null;
                    }

                    // Perform async work or new query
                    try (PreparedStatement stmt2 = client.prepareStatement("SELECT NOW()")) {
                         try (ResultSet rs2 = stmt2.executeQuery()) {
                             if (rs2.next()) {
                                 System.out.println("Time: " + rs2.getString(1));
                             }
                         }
                    }

                    // Commit the transaction
                    client.commit();
                    System.out.println("Transaction Committed.");
                    return resultVersion;

                } catch (Exception e) {
                    // Rollback on failure
                    try {
                        System.out.println("Rolling back transaction due to: " + e.getMessage());
                        client.rollback();
                    } catch (SQLException rollbackEx) {
                        System.err.println("Rollback failed (connection likely lost): " + rollbackEx.getMessage());
                    }

                    // Re-throw so Failsafe knows to retry
                    throw e;
                }
            } catch (SQLException e) {
                System.out.println("Connection level error: " + e.getMessage());
                if (!isTransientError(e)) {
                    System.err.println("Non-retriable error encountered.");
                }
                throw e;
            }
        });
    }

    private static boolean isTransientError(SQLException err) {
        List<String> transientErrorCodes = Arrays.asList("57P01", "08006", "08003");
        List<String> transientErrorMessages = Arrays.asList(
                "Connection terminated unexpectedly",
                "terminating connection due to administrator command",
                "Client has encountered a connection error",
                "network issue",
                "early eof",
                "Couldn't connect to compute node",
                "This connection has been closed",
                "An I/O error occurred while sending to the backend"
        );

        String sqlState = err.getSQLState();
        String message = err.getMessage();

        boolean isCodeMatch = sqlState != null && transientErrorCodes.contains(sqlState);
        boolean isMessageMatch = message != null && transientErrorMessages.stream().anyMatch(message::contains);

        return isCodeMatch || isMessageMatch;
    }
}
```

The above code:

- Initializes a HikariCP connection pool with appropriate connection timeouts.
- Defines a retry policy using Failsafe that retries on `SQLException` with specific transient error codes and messages, implementing exponential backoff with jitter.
- The `queryWithRetry` method executes the query within the retry policy.
- The complete example demonstrates querying Postgres with retry logic. It retries up to 5 times on transient errors, using exponential backoff with delays starting at 1 second and increasing to a maximum of 16 seconds, plus jitter.

## How to test your application's resilience

After implementing connection pooling and retry logic, you must test it to ensure your application can gracefully recover from a sudden disconnection. The most effective way to do this is to manually restart your Neon compute while your application is in the middle of a database operation.

<Steps>

### 1. Prepare your test application

Your application needs to be running and performing a transaction that takes several seconds to complete. This provides a window of opportunity to trigger the restart while the connection is active and in use.

The Node.js example below, which uses `node-postgres`, is a perfect template for this test. It begins a transaction, performs a query, and then waits for 10 seconds before committing. This 10-second window is when you will restart the compute. You can adapt this pattern to your preferred programming language.

```javascript shouldWrap
// A test-ready application snippet (full code in previous section)
// ... (pool setup and isTransientError function) ...

async function queryWithRetry(query, params) {
  return await retry(
    async (bail) => {
      const client = await pool.connect();

      client.on('error', (err) => {
        console.error('[pg] A background error occurred on an active client:', err.stack);
      });

      try {
        console.log('Attempting to execute query...');
        await client.query('BEGIN');
        const result = await client.query(query, params);

        console.log('Simulating a 10-second transaction');
        // --- THIS IS THE 10-SECOND WINDOW TO RESTART THE COMPUTE ---
        await new Promise((resolve) => setTimeout(resolve, 10000));
        console.log('...transaction complete.');

        await client.query('COMMIT');
        console.log('Query successful!');
        return result;
      } catch (err) {
        // Best-effort rollback. This will likely fail if the connection is
        // already dead, which is expected. The database server will handle
        // rolling back the uncommitted transaction automatically.
        try {
          await client.query('ROLLBACK');
          console.log('Transaction rolled back successfully.');
        } catch (rollbackErr) {
          console.error(
            'Failed to rollback transaction (this is expected on a dead connection):',
            rollbackErr.message
          );
        }

        if (!isTransientError(err)) {
          console.error('Non-retriable error encountered.');
          bail(err);
          return;
        }

        throw err; // Trigger retry
      } finally {
        client.release();
      }
    },
    {
      /* ... retry options ... */
    }
  );
}

// ...
main();
```

Execute the application to start the transaction and begin the 10-second wait period. While the application is waiting, restart the compute to simulate a connection drop.

### 2. Restart the Neon compute

While your application is running (specifically, during the 10-second simulated transaction), restart the compute using one of the following methods.

<Tabs labels={["Neon Console", "Neon API"]}>

<TabItem>

Navigate to the **Branches** page in the Neon Console:

1. Select the branch your application is connected to.
2. Go to the **Computes** tab.
3. Click the menu ( **⫶** ) next to your compute endpoint.
4. Select **Restart compute**.

![Restarting a compute from the Neon Console](/docs/manage/restart_compute.png)

</TabItem>

<TabItem>

To use the Neon API, retrieve your Neon API key from the [API Keys](/docs/manage/api-keys) section in the Neon Console settings. You also need your project ID and endpoint ID, which you can find in the [Branches](/docs/manage/branches#view-branches) page of your project. For more details on project settings, see [Project Settings](/docs/manage/projects#project-settings). Additionally, refer to [Computes](/docs/manage/computes) for information on endpoints.

Use the [Restart compute endpoint](/docs/reference/api-reference#/operations/restartProjectEndpoint) API. This is ideal for automated testing.

```bash shouldWrap
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/your-project-id/endpoints/your-endpoint-id/restart \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'accept: application/json'
```

For more details on using the Neon API, see [Neon API Reference](/docs/reference/api-reference).

</TabItem>

</Tabs>

### 3. Analyze the log output

If your resilience logic is working correctly, your application will **not crash**. Instead, you should see a sequence of events in your logs demonstrating the failure and successful recovery.

```text title="Example Log Output" shouldWrap
$ node main.js
Attempting to execute query...
Simulating a 10-second transaction
[pg] A background error occurred on an active client: Error: Connection terminated unexpectedly
    ... (stack trace)
...transaction complete.
Query failed with error: Client has encountered a connection error and is not queryable
Failed to rollback transaction (this is expected on a dead connection): Client has encountered a connection error and is not queryable
Error Code: undefined
Error Message: Client has encountered a connection error and is not queryable
Retrying... Attempt 1. Error: Client has encountered a connection error and is not queryable
Attempting to execute query...
Simulating a 10-second transaction
...transaction complete.
Query successful!
PostgreSQL version: PostgreSQL 17.5 (aa1f746) on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14+deb12u1) 12.2.0, 64-bit
```

##### What's happening in the logs:

1.  **`[pg] A background error occurred...`**: This is the first sign of trouble. The `client.on('error', ...)` listener catches the unexpected connection termination, preventing the application from crashing.
2.  **`Query failed with error...`**: The `catch` block is triggered when the code attempts the `COMMIT` on the now-dead connection. The `pg` client immediately throws the error `Client has encountered a connection error and is not queryable`.
3.  **`Failed to rollback transaction...`**: This is expected. The `ROLLBACK` also fails because the client is not queryable. The database server will automatically roll back the uncommitted transaction on its own.
4.  **`Retrying... Attempt 1.`**: This is the payoff. The retry library catches the thrown error and, because `isTransientError` returned `true`, it initiates a new attempt.
5.  **`Query successful!`**: The retry succeeds. The pool provides a new, healthy connection, the entire operation is re-executed, and this time it completes without interruption.

This successful test run proves that your application can withstand a sudden compute restart, handle the resulting errors, and recover gracefully to complete its task.

</Steps>

## Pre-built AI prompt

Use the following pre-built prompt to help AI agents update your codebase with connection resilience best practices.

<CopyPrompt src="/prompts/connection-issues-prompt.md"
description="A pre-built prompt to help AI agents add connection resilience best practices to your codebase." />

## Resources

- [Neon Platform Updates](/docs/manage/updates)
- [Neon Platform maintenance](/docs/manage/platform-maintenance)
- [Connection latency and timeouts](/docs/connect/connection-latency)
- [Neon serverless driver](/docs/serverless/serverless-driver)
- [Restart a compute](/docs/manage/computes#restart-a-compute)
- [NpgsqlException: IsTransient](https://www.npgsql.org/doc/api/Npgsql.NpgsqlException.html#Npgsql_NpgsqlException_IsTransient)

<NeedHelp/>

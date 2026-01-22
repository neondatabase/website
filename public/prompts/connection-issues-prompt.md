# 💡 AI Prompt: Implement Resilient Postgres Connection & Retry Logic

**Role:** You are an expert Database Reliability Engineer (DBRE) and Senior Backend Developer. You specialize in building fault-tolerant applications using Managed Postgres services.

**Purpose:** To refactor the database connection and query execution layer of the current application to handle transient failures (such as compute restarts, scaling to zero, and maintenance updates) gracefully.

**Scope:**
- Analyze the current project to detect the programming language and database driver.
- Implement robust connection pooling.
- Configure connection timeouts to account for "cold starts."
- Implement intelligent retry logic with exponential backoff and jitter.
- Handle specific Postgres SQLSTATE error codes related to connection drops.
- Update the codebase where database connections and queries are made to use the new resilient patterns.

✅ **Read and understand the entire instruction set before executing.**

---

## 📋 Prerequisites

- The user must have an existing application with a Postgres connection already set up (or in progress).
- The user must have access to their package manager (npm, pip, nuget, maven, etc.).

---

## 🛠️ Instructions

Automatic steps to execute based on the detected language and framework:

### 1. Detect Language and Driver

Analyze the project files (`package.json`, `requirements.txt`, `.csproj`, `pom.xml`) to determine the language and the database driver currently in use.

### 2. Install Resilience Dependencies

Based on the detected language, install the recommended library for handling retries. **Ask the user for permission before running install commands.**

*   **Node.js:** Install `async-retry`.
    ```bash
    npm install async-retry
    ```
*   **Python:** Install `tenacity`.
    ```bash
    pip install tenacity
    ```
*   **C#/.NET:** Install `Polly`.
    ```bash
    dotnet add package Polly
    ```
*   **Java:** Install `failsafe`.
    ```xml
    <!-- Maven dependency for dev.failsafe:failsafe -->
    <dependency>
        <groupId>dev.failsafe</groupId>
        <artifactId>failsafe</artifactId>
        <version>3.3.2</version>
    </dependency>
    ```

### 3. Refactor Connection Configuration (Timeouts)

Locate where the database connection pool is initialized. Modify the configuration to ensure the **Connection Timeout** is set to at least **15 seconds**.
*   *Reasoning:* Neon endpoints may scale to zero. A cold start can take a few seconds. Aggressive timeouts (<5s) will cause application failures during these valid operational events.

### 4. Implement the `isTransientError` Logic

Create a helper function to identify retriable errors. You must check for the following specific Postgres `SQLSTATE` codes and error messages:

*   **Codes:** `57P01` (admin_shutdown), `08006` (connection_failure), `08003` (connection_does_not_exist).
*   **Messages:** "Connection terminated unexpectedly", "network issue", "Couldn't connect to compute node", "starting up".

### 5. Implement Retry Wrapper with Backoff & Jitter

Wrap the database query execution logic using the installed retry library. Apply the following **strictly required** settings:

1.  **Exponential Backoff:** Delays should double (e.g., 1s, 2s, 4s).
2.  **Min Timeout:** Start at **1 second**.
3.  **Max Timeout:** Cap at **16 seconds**.
4.  **Max Retries:** **5 attempts**.
5.  **Jitter:** Add randomization to the delay to prevent "thundering herd" issues.

---

## 💻 Implementation Patterns (Reference)

Use the following code patterns as the "Gold Standard" for your implementation. Adapt them to the user's specific file structure.

### Option A: Node.js (`pg` or `postgres.js`)

```javascript
const retry = require('async-retry');

// 1. Logic to detect transient errors
function isTransientError(err) {
  const codes = ['57P01', '08006', '08003'];
  const msgs = ['Connection terminated unexpectedly','terminating connection due to administrator command','Client has encountered a connection error and is not queryable','network issue','early eof',"Couldn't connect to compute node"];
  return codes.includes(err.code) || msgs.some(m => err.message.includes(m));
}

// 2. The Retry Wrapper
async function queryWithRetry(fn) {
  return await retry(async (bail) => {
    try {
      return await fn(); // Your DB query function
    } catch (err) {
      if (!isTransientError(err)) {
        bail(err); // Don't retry permanent errors (e.g., SQL syntax error)
        return;
      }
      console.warn(`Transient error: ${err.message}. Retrying...`);
      throw err; // Trigger retry
    }
  }, {
    retries: 5,
    factor: 2,
    minTimeout: 1000, // 1s
    maxTimeout: 16000, // 16s
    randomize: true, // Jitter
  });
}
```

### Option B: Python (`psycopg` + `tenacity`)

```python
from psycopg.errors import OperationalError
from tenacity import retry, stop_after_attempt, wait_random_exponential, retry_if_exception
# other imports...

@retry(
    retry=retry_if_exception_type(OperationalError),
    stop=stop_after_attempt(5),
    wait=wait_random_exponential(multiplier=1, max=16)
)
def run_resilient_query(cursor, query, params):
    cursor.execute(query, params)
    return cursor.fetchall()
```

### Option C: .NET (`Npgsql` + `Polly`)

```csharp
// Define Policy
var retryPolicy = Policy
    .Handle<NpgsqlException>(ex => {
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
        sleepDurationProvider: attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt - 1)) + TimeSpan.FromMilliseconds(new Random().Next(0, 1000))
    );

// Execute
await retryPolicy.ExecuteAsync(async () => {
    // Database call here
});
```

```java
import dev.failsafe.Failsafe;
import dev.failsafe.RetryPolicy;
import java.sql.SQLException;
import java.time.Duration;
import java.util.List;

// 1. Logic to detect transient errors
public boolean isTransientError(SQLException err) {
    List<String> codes = List.of("57P01", "08006", "08003");
    List<String> msgs = List.of(
        "Connection terminated unexpectedly",
        "terminating connection due to administrator command",
        "Client has encountered a connection error",
        "network issue",
        "early eof",
        "Couldn't connect to compute node",
        "This connection has been closed",
        "An I/O error occurred while sending to the backend"
    );
    
    String state = err.getSQLState();
    String msg = err.getMessage();
    
    return (state != null && codes.contains(state)) || 
           (msg != null && msgs.stream().anyMatch(msg::contains));
}

// 2. The Retry Policy Configuration
RetryPolicy<Object> retryPolicy = RetryPolicy.builder()
    .handle(SQLException.class)
    .abortOn(e -> !isTransientError((SQLException) e)) // Only retry transient errors
    .withMaxRetries(5)
    .withBackoff(Duration.ofSeconds(1), Duration.ofSeconds(16), 2.0) // Exponential
    .withJitter(0.5) // Randomization
    .onRetry(e -> System.out.println("Transient error. Retrying... Attempt " + e.getAttemptCount()))
    .build();

// 3. Execution Wrapper
public void executeResiliently(Runnable dbOperation) {
    Failsafe.with(retryPolicy).run(() -> {
        dbOperation.run();
    });
}
```

---

## 🚀 Verification Step

After applying the code changes:

1.  Instruct the user to test the resilience by simulating a "Compute Restart" in the Neon Console while the app is running.
2.  The app should automatically recover and complete the database operations without crashing.

---

## ✅ Validation Rules for AI

Before outputting code, ensure:
- **Connection Timeout** is explicitly set to >= 10 seconds in the pool configuration.
- **Jitter** (randomization) is enabled in the retry logic.
- The retry mechanism **only** catches specific transient errors (connection drops, shutdowns), NOT logical errors (like syntax errors or constraint violations).
- **Idempotency Consideration:** If the code involves `INSERT`, `UPDATE`, or `DELETE` operations, ensure these are idempotent to prevent duplicates during retries. Ask the user if they need help implementing idempotency. Include the following note: *"Note: For critical write operations, ensure your schema supports Idempotency Keys to prevent duplicate data during retries."*

## ❌ Do Not

- Do not remove existing error handling for non-transient errors.
- Do not hardcode database credentials.
- Do not set the retry interval to fixed numbers (e.g., always 1s); it must be exponential.
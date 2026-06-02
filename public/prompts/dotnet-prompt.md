# 💡 AI Prompt: Connect a .NET Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current .NET project to connect to a Neon Postgres database.

**Purpose:** To install the required NuGet packages and provide a working C# code example that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle and transaction management with Neon using the Npgsql driver.

**Scope:**
- Assumes the user has an open .NET project (e.g., a Console App created via `dotnet new console`).
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open .NET project as follows:

### 1. Install Required NuGet Packages

Run the following `dotnet` CLI commands to add the necessary packages to the project:

```bash
dotnet add package Npgsql
dotnet add package Microsoft.Extensions.Configuration.Json
dotnet add package Microsoft.Extensions.Configuration.Binder
```

---

### 2. Verify the `appsettings.json` File

- Check for the presence of an `appsettings.json` file at the root of the project.
- If it doesn't exist, create one and add the following JSON structure. Advise the user to replace the placeholder with the one copied from their Neon project.
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "Host=<hostname>;Database=<dbname>;Username=<user>;Password=<password>;SSL Mode=VerifyFull;Channel Binding=Require"
    }
  }
  ```
- **Do not hardcode** credentials directly in the code.
- Prompt the user to get their connection string from the **Neon Console → Project → Dashboard → Connect**, making sure to select **.NET** from the dropdown.

---

### 3. Update `Program.cs` with a Full CRUD and Transaction Example

Modify the `Program.cs` file to include code that connects to the database and demonstrate a full C-R-U-D lifecycle within a database transaction. Apply the following logic:

- **If `Program.cs` contains only the default template code** (e.g., `Console.WriteLine("Hello, World!");`), replace the entire file content with the C# code block below.
- **If `Program.cs` contains custom user code, preserve it**. Comment out the existing code and add a note like `// Existing code commented out to add Neon connection example`. Then, append the new C# code block after the commented section.

#### C# Code to Add:

```csharp
using Microsoft.Extensions.Configuration;
using Npgsql;

// 1. Build configuration
var config = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .Build();

// 2. Get connection string
var connectionString = config.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    Console.WriteLine("Connection string 'DefaultConnection' not found in appsettings.json.");
    return;
}

try
{
    // 3. Establish connection
    await using var conn = new NpgsqlConnection(connectionString);
    await conn.OpenAsync();
    Console.WriteLine("Connection successful!");

    // Set up a table for the example
    await using (var cmd = new NpgsqlCommand("DROP TABLE IF EXISTS todos; CREATE TABLE todos (id SERIAL PRIMARY KEY, task TEXT NOT NULL);", conn))
    {
        await cmd.ExecuteNonQueryAsync();
        Console.WriteLine("Table 'todos' created.");
    }

    // --- Start Transaction for atomic CRUD Operations ---
    await using var transaction = await conn.BeginTransactionAsync();
    Console.WriteLine("Transaction started.");

    try
    {
        // CREATE: Insert a new todo item
        await using (var cmd = new NpgsqlCommand("INSERT INTO todos (task) VALUES (@task);", conn, transaction))
        {
            cmd.Parameters.AddWithValue("task", "Learn Neon with .NET");
            await cmd.ExecuteNonQueryAsync();
            Console.WriteLine("CREATE: Row inserted.");
        }

        // READ: Retrieve the new todo item to verify insertion
        await using (var cmd = new NpgsqlCommand("SELECT task FROM todos WHERE task = @task;", conn, transaction))
        {
            cmd.Parameters.AddWithValue("task", "Learn Neon with .NET");
            var result = await cmd.ExecuteScalarAsync();
            Console.WriteLine($"READ: Fetched task - '{result}'");
        }

        // UPDATE: Modify the todo item
        await using (var cmd = new NpgsqlCommand("UPDATE todos SET task = @newTask WHERE task = @oldTask;", conn, transaction))
        {
            cmd.Parameters.AddWithValue("newTask", "Master Neon with .NET!");
            cmd.Parameters.AddWithValue("oldTask", "Learn Neon with .NET");
            await cmd.ExecuteNonQueryAsync();
            Console.WriteLine("UPDATE: Row updated.");
        }

        // DELETE: Remove the todo item
        await using (var cmd = new NpgsqlCommand("DELETE FROM todos WHERE task = @task;", conn, transaction))
        {
            cmd.Parameters.AddWithValue("task", "Master Neon with .NET!");
            await cmd.ExecuteNonQueryAsync();
            Console.WriteLine("DELETE: Row deleted.");
        }

        // --- Commit Transaction ---
        await transaction.CommitAsync();
        Console.WriteLine("Transaction committed successfully.");
    }
    catch
    {
        // --- Rollback Transaction on Error ---
        await transaction.RollbackAsync();
        Console.WriteLine("Transaction rolled back.");
        throw; // Re-throw the exception after rolling back
    }
}
catch (Exception e)
{
    Console.WriteLine("Operation failed.");
    Console.WriteLine(e.Message);
}
```

---

## 🚀 Next Steps

Once the setup is complete:

1. Advise the user to ensure their connection string is correctly set in the `appsettings.json` file.
2. Instruct them to run the application from their terminal:
   ```bash
   dotnet run
   ```
3. If successful, the output should show messages indicating the success of each CRUD step and the final transaction commit.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:

- The `Npgsql`, `Microsoft.Extensions.Configuration.Json`, and `Microsoft.Extensions.Configuration.Binder` packages are added.
- An `appsettings.json` file is present or has been created.
- The connection string is loaded from configuration, not hardcoded.
- **All SQL operations (INSERT, UPDATE, DELETE) use parameterized queries** to prevent SQL injection.
- **The primary business logic (CRUD operations) is wrapped in a transaction block** (`BeginTransactionAsync`, `CommitAsync`, `RollbackAsync`).

---

## ❌ Do Not

- Do not hardcode credentials in any `.cs` file.
- Do not output the contents of the `appsettings.json` file or the user's connection string in any response.
- Do not use any other database provider (e.g., for SQL Server or MySQL).

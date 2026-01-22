# 💡 AI Prompt: Connect a .NET Entity Framework Project to Neon Postgres

**Role:** You are an expert software agent specializing in .NET and Entity Framework. Your task is to configure the current .NET project to connect to a Neon Postgres database.

**Purpose:** To install the required NuGet packages, configure an Entity Framework `DbContext`, and provide a working C# code example that demonstrates a full CRUD (Create, Read, Update, Delete) lifecycle and transaction management using EF Core.

**Scope:**
- Assumes the user has an open .NET project (e.g., a Console App created via `dotnet new console`).
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open .NET project as follows:

### 1. Install Required NuGet Packages and Tools

1.  Run the following `dotnet` CLI commands to add the necessary packages to the project:

    ```bash
    dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL && \
    dotnet add package Microsoft.EntityFrameworkCore.Design && \
    dotnet add package Microsoft.Extensions.Configuration.Json && \
    dotnet add package Microsoft.Extensions.Configuration.Binder
    ```

2.  Ensure the EF Core command-line tool is installed globally. If not, install it.

    ```bash
    dotnet tool install --global dotnet-ef
    ```

---

### 2. Verify the `appsettings.json` File

- Check for the presence of an `appsettings.json` file at the root of the project.
- If it doesn't exist, create one and add the following JSON structure. Advise the user to replace the placeholder with their connection string copied from the Neon project.

  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "Host=<hostname>;Database=<dbname>;Username=<user>;Password=<password>;SSL Mode=Require;Channel Binding=Require"
    }
  }
  ```
- Prompt the user to get their connection string from the **Neon Console → Project → Dashboard → Connect**, making sure to select **.NET** from the dropdown.

---

### 3. Create the Design-Time DbContext Factory

Create a new file named `ApplicationDbContextFactory.cs` at the root of the project. This factory class is necessary for EF Core tools to create the `DbContext` at design time.

#### C# Code for `ApplicationDbContextFactory.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var connectionString = config.GetConnectionString("DefaultConnection");
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
```

---

### 4. Update `Program.cs` with a Full CRUD and Transaction Example

Modify the `Program.cs` file to include all necessary code for a self-contained EF Core example. This includes the model, the `DbContext`, and the main execution logic.

- **If `Program.cs` contains only the default template code** (e.g., `Console.WriteLine("Hello, World!");`), replace the entire file content with the C# code block below.
- **If `Program.cs` contains custom user code, preserve it**. Comment out the existing code with a note like `// Existing code commented out to add Neon EF Core example` and append the new C# code block.

#### C# Code to Add:

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

// --- 1. Define the Data Model ---
public class Todo
{
    public int Id { get; set; }
    public required string Task { get; set; }
    public bool IsComplete { get; set; } = false;
}

// --- 2. Define the EF Core DbContext ---
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}
    public DbSet<Todo> Todos => Set<Todo>();
}

// --- 3. Main Application Logic ---
public class Program
{
    public static async Task Main(string[] args)
    {
        // Build configuration to read from appsettings.json
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var connectionString = config.GetConnectionString("DefaultConnection");
        if (string.IsNullOrEmpty(connectionString))
        {
            Console.WriteLine("Connection string 'DefaultConnection' not found in appsettings.json.");
            return;
        }

        // Configure DbContext options
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        // Instantiate and use the context
        await using var context = new ApplicationDbContext(optionsBuilder.Options);

        try
        {
            // Apply any pending migrations automatically on startup
            await context.Database.MigrateAsync();
            Console.WriteLine("Database connection successful and migrations applied.");

            // Start a transaction for atomic CRUD operations
            await using var transaction = await context.Database.BeginTransactionAsync();
            Console.WriteLine("\n--- Transaction Started ---");

            try
            {
                // CREATE: Add a new todo item
                Console.WriteLine("\n[CREATE] Inserting a new todo...");
                var newTodo = new Todo { Task = "Learn Neon with EF Core" };
                context.Todos.Add(newTodo);
                await context.SaveChangesAsync();
                Console.WriteLine($"Inserted: Id = {newTodo.Id}, Task = '{newTodo.Task}'");

                // READ: Retrieve the new todo item
                Console.WriteLine("\n[READ] Fetching the new todo by ID...");
                var fetchedTodo = await context.Todos.FindAsync(newTodo.Id);
                Console.WriteLine($"Fetched: Id = {fetchedTodo!.Id}, Task = '{fetchedTodo.Task}'");

                // UPDATE: Mark the todo as complete
                Console.WriteLine("\n[UPDATE] Marking the todo as complete...");
                fetchedTodo.IsComplete = true;
                fetchedTodo.Task = "Master Neon with EF Core!";
                await context.SaveChangesAsync();
                Console.WriteLine($"Updated: Id = {fetchedTodo.Id}, Task = '{fetchedTodo.Task}', IsComplete = {fetchedTodo.IsComplete}");

                // DELETE: Remove the todo item
                Console.WriteLine("\n[DELETE] Deleting the todo...");
                context.Todos.Remove(fetchedTodo);
                await context.SaveChangesAsync();
                Console.WriteLine($"Deleted todo with Id = {fetchedTodo.Id}.");

                // Commit the transaction
                await transaction.CommitAsync();
                Console.WriteLine("\n--- Transaction Committed Successfully ---\n");
            }
            catch (Exception ex)
            {
                // Rollback the transaction on error
                Console.WriteLine("\n--- Rolling back transaction due to an error ---");
                await transaction.RollbackAsync();
                Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("\nOperation failed.");
            Console.WriteLine(e.Message);
        }
    }
}
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Verify the user has correctly set their `DefaultConnection` in the `appsettings.json` file. Do not proceed if placeholder values are still present.
2.  Create the initial database migration. This file tells EF Core how to create the database schema.
    ```bash
    dotnet ef migrations add InitialCreate
    ```
3.  Run the application. The code is configured to automatically apply the migration to the database.
    ```bash
    dotnet run
    ```
4.  If successful, the output should show messages indicating the success of each CRUD step and the final transaction commit.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- The `Npgsql.EntityFrameworkCore.PostgreSQL` and `Microsoft.EntityFrameworkCore.Design` packages are added.
- An `ApplicationDbContextFactory.cs` file exists and its class implements `IDesignTimeDbContextFactory<ApplicationDbContext>`.
- An `appsettings.json` file is present or has been created and added to `.gitignore` (if applicable).
- The connection string is loaded from configuration, not hardcoded.
- A class inheriting from `DbContext` is defined and correctly configured with `UseNpgsql`.
- **Database persistence is handled via `SaveChangesAsync()`**.
- **The primary business logic (CRUD operations) is wrapped in an EF Core transaction block** (`context.Database.BeginTransactionAsync`, `CommitAsync`, `RollbackAsync`).
- The example code includes a call to `context.Database.MigrateAsync()` to automatically set up the schema.

---

## ❌ Do Not

- Do not hardcode credentials in any `.cs` file.
- Do not output the contents of the `appsettings.json` file or the user's connection string in any response.
- Do not use any other EF Core database provider (e.g., for SQL Server or SQLite). Focus only on `Npgsql.EntityFrameworkCore.PostgreSQL`.
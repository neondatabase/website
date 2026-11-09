---
title: Connecting .NET applications to Neon
subtitle: Learn how to connect your .NET applications to a Postgres database on Neon
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-11-02T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

In this guide, we'll connect a .NET application to Lakebase Postgres on Neon and cover best practices for connection management and basic performance optimization.

## Prerequisites

Before we begin, make sure you have:

- .NET 8.0 or later installed
- A [Neon account](https://console.neon.tech/signup)
- Basic familiarity with .NET development

## Setting up your database on Neon

First, let's create a database on Neon that we'll connect to from our .NET application.

1. Log in to the [Neon Console](https://console.neon.tech)
2. Click **New Project** and follow the creation wizard
3. Once the project is created, click **Connect** on your project dashboard to see your connection details. Your connection string will look like this:

```
postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require
```

Save these details. You'll need them when setting up your .NET application.

## Creating a basic .NET project

Let's create a simple .NET project and add the necessary dependencies to connect to your Neon database.

Open your terminal and run:

```bash
dotnet new console -n NeonDemo
cd NeonDemo
```

This creates a new console application named "NeonDemo" and navigates to the project directory.

The directory will contain a `NeonDemo.csproj` file, which is the project file for your application, similar to a `package.json` file in Node.js if you are coming from a JavaScript background.

Next, we need to add the required package for Postgres connectivity. We can do this using the `dotnet add package` command:

```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

This package provides the Postgres database provider for Entity Framework Core, Microsoft's object-database mapper for .NET applications, and is a popular choice for working with Postgres databases.

## Configuring the database connection

There are several ways to manage your database connection string. Let's look at the most common approaches for .NET applications and how to handle sensitive information securely.

### Basic connection setup

For local development, start by creating an `appsettings.json` file in your project root. This file will store your connection string:

```json
{
  "ConnectionStrings": {
    "NeonConnection": "Host=your-neon-hostname;Database=neondb;Username=your-username;Password=your-password;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

This approach works well for development but isn't recommended for production use since it stores sensitive information in a file that might be committed to source control or exposed in other ways.

### Using environment variables

For production environments, it's better to use environment variables. Here's how to implement this:

```csharp
var connectionString = Environment.GetEnvironmentVariable("NEON_CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("NeonConnection");
```

This code first checks for an environment variable, falling back to the configuration file if not found. This lets you use different settings per environment and keeps secrets out of files you might commit.

You can set the `NEON_CONNECTION_STRING` environment variable in your production environment, or use a tool like [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/) to manage secrets.

## Understanding connection pooling

Connection pooling helps improve performance by maintaining and reusing database connections. Opening too many connections can degrade performance, so manage them carefully.

There are two levels of connection pooling available when working with Neon: [Neon's built-in connection pooling service](/docs/connect/connection-pooling) (PgBouncer) and application-side pooling through Npgsql.

### Neon connection pooling

Neon uses PgBouncer to provide connection pooling at the infrastructure level, supporting up to 10,000 concurrent client connections. To get a pooled connection string, click **Connect** on your project dashboard and turn on the **Connection pooling** toggle (it's on by default for new projects). A pooled connection string has a `-pooler` suffix on the endpoint ID:

```
postgresql://[user]:[password]@[endpoint_id]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require
```

Neon's PgBouncer runs in transaction mode, and some migration tools need session-level features that transaction mode doesn't support. For this reason, use a direct (non-pooled) connection when performing database migrations. For more information about direct and pooled connections, see [Connection pooling](/docs/connect/connection-pooling).

### Application-side pooling

While Neon handles connection pooling at the infrastructure level, you can also configure Npgsql's built-in connection pooling for additional control:

```csharp
using Npgsql;

var connectionStringBuilder = new NpgsqlConnectionStringBuilder(
    builder.Configuration.GetConnectionString("NeonConnection"))
{
    MaxPoolSize = 50,               // Maximum number of connections in the pool
    MinPoolSize = 5,                // Minimum number of connections to maintain
    ConnectionIdleLifetime = 300,   // How long in seconds an idle connection is kept
    ConnectionPruningInterval = 60, // How often to check for idle connections
    Pooling = true,                 // Enable connection pooling
    Timeout = 30,                   // Connection timeout in seconds
    CommandTimeout = 30             // Command timeout in seconds
};

services.AddDbContext<InventoryContext>(options =>
    options.UseNpgsql(connectionString));
```

This code snippet configures the connection pooling settings for Npgsql. You can adjust the `MaxPoolSize`, `MinPoolSize`, `ConnectionIdleLifetime`, and other parameters to suit your application's needs. In most cases, Neon's built-in connection pooling is enough.

### PgBouncer vs application-side pooling

Both pooling methods have advantages, and the same trade-off applies to other frameworks and languages:

- **Neon's PgBouncer**: Handles connection pooling at the infrastructure level and shares connections across multiple application instances.
- **Npgsql pooling**: Provides fine-grained control at the application level and can be useful for specific application requirements.

For most applications, using Neon's connection pooling service is sufficient. You can consider configuring application-side pooling if you have specific requirements or need additional control over connection management.

As mentioned earlier, when performing database migrations, it's recommended to use a direct connection to avoid potential issues with pooled connections.

## Basic performance optimization

Besides connection pooling, let's look at some simple ways to optimize your database operations. Most of these optimizations apply to all types of frameworks, but we'll focus on Entity Framework Core, a popular ORM for .NET applications.

### Using async operations

Always use async methods for database operations. This improves application responsiveness by not blocking threads while waiting for database operations to complete:

```csharp
// Example of a basic repository method using async/await
public async Task<List<User>> GetUsersAsync()
{
    using var context = new YourDbContext();
    // ToListAsync() is non-blocking
    return await context.Users.ToListAsync();
}
```

This approach is more efficient than synchronous operations, especially in high-traffic applications. The `ToListAsync` method is provided by Entity Framework Core and returns a `Task<List<T>>`.

### Batch operations

When working with multiple records, use batch operations to reduce database round trips.

For example, instead of saving one record at a time like this:

```csharp
foreach (var item in items)
{
    context.Items.Add(item);
    await context.SaveChangesAsync();
}
```

That makes a separate database call for every record. You can batch the operations like this:

```csharp
context.Items.AddRange(items);
await context.SaveChangesAsync();
```

This approach reduces the number of database calls, because Entity Framework Core sends the inserts in batches instead of one round trip per record. It matters most when you insert many records.

### Use NoTracking for read-only operations

The tracking feature in Entity Framework Core keeps track of changes to entities, which can be useful for update and delete operations.

However, for read-only operations where you don't need to track changes, you can disable tracking to improve performance:

```csharp
public async Task<List<User>> GetUsersAsync()
{
    using var context = new YourDbContext();
    return await context.Users.AsNoTracking().ToListAsync();
}
```

The `AsNoTracking` method tells Entity Framework Core not to track changes to entities, which can improve performance for read-only operations.

### Avoid N+1 queries

Avoid N+1 queries, a common performance issue in ORMs where an extra query runs for each record in a collection. This can lead to a large number of database calls and performance degradation.

This also applies to Entity Framework Core, especially when using lazy loading. To avoid N+1 queries, use eager loading or explicit loading:

```csharp
// Eager loading
var users = context.Users.Include(u => u.Orders).ToList();

// Explicit loading
var users = context.Users.ToList();
foreach (var user in users)
{
    context.Entry(user).Collection(u => u.Orders).Load();
}
```

Eager loading fetches related entities in a single query, while explicit loading allows you to load related entities on demand.

## Best practices

When working with Neon in your .NET applications, and any database in general, pay attention to connection management, error handling, and security.

### Connection management

Use `using` statements when working with database connections to make sure they're properly disposed of. This prevents connection leaks and returns connections to the pool:

```csharp
public async Task<User> GetUserByIdAsync(int id)
{
    // The using statement ensures the context is disposed properly
    using var context = new YourDbContext();
    return await context.Users.FindAsync(id);
}
```

For dependency injection scenarios, you can implement a scoped context:

```csharp
builder.Services.AddScoped<YourDbContext>();
```

For more information, see the [Working with DbContext](https://docs.microsoft.com/en-us/ef/core/dbcontext-configuration/) documentation.

### Error handling and retry logic

In production applications, handle errors and log them. For example, you can implement retry logic to handle failures that can occur in a distributed system:

```csharp
builder.Services.AddDbContext<YourDbContext>(options =>
{
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorCodesToAdd: null);
    });
});
```

In addition to retry logic, you can also consider adding logging and exception handling to your database operations:

```csharp
public async Task<User> GetUserByIdAsync(int id)
{
    try
    {
        using var context = new YourDbContext();
        return await context.Users.FindAsync(id);
    }
    catch (PostgresException ex)
    {
        _logger.LogError(ex, "Error retrieving user {UserId}", id);
        throw;
    }
}
```

## Monitoring database performance

Neon provides built-in monitoring capabilities, which you can complement with application-side monitoring in your .NET application.

### Using the Neon monitoring dashboard

The Neon Console includes a [monitoring dashboard](/docs/introduction/monitoring) that graphs your database's performance metrics. You can access it from the sidebar in the Neon Console and view metrics like CPU, RAM, connections, database size, and more.

Your Neon plan determines the range of metrics and historical data available. Use it to spot performance trends and decide when to adjust compute size or optimize queries.

### The pg_stat_statements extension

In addition to the monitoring dashboard, you can use the `pg_stat_statements` extension to track query performance and identify slow queries. This extension provides detailed statistics about query execution, including the number of times a query is executed, the total execution time, and more.

You can check out the [pg_stat_statements documentation](/docs/extensions/pg_stat_statements) for more information on how to enable and use this extension.

This helps you find performance bottlenecks and optimize your database queries. For example, once you identify slow queries, you can use tools like `EXPLAIN` to analyze query plans and then consider adding indexes or rewriting queries to improve performance. For more information, read the [Performance tips for Neon Postgres](/blog/performance-tips-for-neon-postgres) blog post.

### Application-side monitoring

Beyond Neon's monitoring capabilities, you can also implement application-side monitoring in your .NET application to track database operations and performance.

You can use the built-in health checks feature in ASP.NET Core to monitor database connectivity and performance. Here's an example of adding health checks for a Neon database:

```csharp
// Add health checks for database monitoring
builder.Services.AddHealthChecks()
    .AddNpgsql(
        connectionString,
        name: "neon-db",
        tags: new[] { "db", "postgres", "neon" },
        timeout: TimeSpan.FromSeconds(3));

// Add a health check endpoint
app.MapHealthChecks("/health/database");
```

Then, configure appropriate logging levels to track database operations:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Warning",
      "Npgsql": "Information"
    },
    "Console": {
      "TimestampFormat": "yyyy-MM-dd HH:mm:ss"
    }
  }
}
```

And after that, add basic operation logging in your data access layer:

```csharp
public class DatabaseService
{
    private readonly ILogger<DatabaseService> _logger;

    public async Task ExecuteOperation()
    {
        try
        {
            // Your database operation
            _logger.LogInformation("Database operation completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database operation failed");
            throw;
        }
    }
}
```

For more information on logging and monitoring in .NET applications, check out the [Logging in .NET Core](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/) documentation.

## Conclusion

You've connected a .NET application to Lakebase Postgres on Neon, configured connection pooling, and applied basic performance and security practices.

As a next step, consider checking out the [Building ASP.NET Core Applications with Neon and Entity Framework Core](/guides/dotnet-neon-entity-framework) guide for a more detailed example of integrating Neon with Entity Framework Core.

For more information, check out:

- [Neon Documentation](/docs)
- [Npgsql Documentation](https://www.npgsql.org/doc/index.html)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)

<NeedHelp />

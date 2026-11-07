---
title: Connect an Entity Framework application to Neon
subtitle: Set up a Neon project in seconds and connect from an Entity Framework
  application
summary: >-
  Entity Framework Core connection to Lakebase Postgres uses Npgsql as the EF Core
  provider, demonstrated through a complete ASP.NET Core Web API project with
  DbContext setup, connection string configuration, and EF migrations. Use this
  guide when wiring a .NET application (ASP.NET Core MVC, Blazor, or console
  app) to a Neon serverless Postgres database for the first time. Covers
  installing `Npgsql.EntityFrameworkCore.PostgreSQL`,
  `Microsoft.EntityFrameworkCore.Design`, and `dotnet-ef`, then applying the
  initial schema with `dotnet ef database update`.
enableTableOfContents: true
updatedOn: '2026-07-31T15:27:48.506Z'
---

<CopyPrompt src="/prompts/dotnet-ef-prompt.md"
description="Pre-built prompt for connecting .NET Entity Framework projects to Lakebase Postgres."/>

This guide describes how to create a Neon project and connect to it from an Entity Framework Core application. The example demonstrates how to set up a basic ASP.NET Core Web API project with Entity Framework Core using Npgsql as the database provider.

<Admonition type="note">
The same configuration steps can be used for any .NET application using Entity Framework Core, including ASP.NET Core MVC, Blazor, or console applications.
</Admonition>

To connect to Neon from an Entity Framework application:

1. [Create a Neon project](#create-a-neon-project)
2. [Create a .NET project and add dependencies](#create-a-net-project-and-add-dependencies)
3. [Configure Entity Framework](#configure-entity-framework)
4. [Run the application](#run-the-application)

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a .NET project and add dependencies

1. Create a new ASP.NET Core Web API project and change to the newly created directory:

   ```bash
   dotnet new webapi --use-controllers -n NeonEfExample
   cd NeonEfExample
   ```

   The `--use-controllers` option creates a controller-based project. Without it, .NET 8 and later create a minimal API project with no `Controllers` folder.

2. Delete the sample files `WeatherForecast.cs` and `Controllers/WeatherForecastController.cs`, which this guide doesn't use:

   ```bash
   rm WeatherForecast.cs Controllers/WeatherForecastController.cs
   ```

3. Install the EF Core tools and packages. Use package versions with the same major version as your .NET SDK. Run `dotnet --version` to check it: for example, `10.0.403` is .NET 10, so use `10.*`.

   ```bash
   dotnet tool install --global dotnet-ef --version '10.*'
   dotnet add package Microsoft.EntityFrameworkCore.Design --version '10.*'
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version '10.*'
   ```

   For .NET 9, use `'9.*'`; for .NET 8, use `'8.*'`. Don't pass the full SDK version (such as `10.0.403`): package versions don't match it, and the install fails.

## Configure Entity Framework

1. Create a model class in `Models/Todo.cs`:

   ```csharp
   namespace NeonEfExample.Models
   {
       public class Todo
       {
           public int Id { get; set; }
           public string? Title { get; set; }
           public bool IsComplete { get; set; }
       }
   }
   ```

2. Create a database context in `Data/ApplicationDbContext.cs`:

   ```csharp
   using Microsoft.EntityFrameworkCore;
   using NeonEfExample.Models;

   namespace NeonEfExample.Data
   {
       public class ApplicationDbContext : DbContext
       {
           public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
               : base(options)
           {
           }

           public DbSet<Todo> Todos => Set<Todo>();
       }
   }
   ```

3. Add a `ConnectionStrings` section to `appsettings.json` with your Neon connection details. Get them from the **Connect** modal in the Neon Console:

   ```json
   {
     "ConnectionStrings": {
       "TodoDbConnection": "Host=[neon_hostname];Database=[dbname];Username=[user];Password=[password];SSL Mode=Require;Channel Binding=Require"
     }
   }
   ```

   Keep the existing `Logging` and `AllowedHosts` settings in the file. Don't commit a real password: for local development, you can store the connection string with [user secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) instead.

4. Create a Todo controller in `Controllers/TodoController.cs`:

   ```csharp
   using Microsoft.AspNetCore.Mvc;
   using Microsoft.EntityFrameworkCore;
   using NeonEfExample.Data;
   using NeonEfExample.Models;

   namespace NeonEfExample.Controllers
   {
       [ApiController]
       [Route("api/[controller]")]
       public class TodoController : ControllerBase
       {
           private readonly ApplicationDbContext _context;

           public TodoController(ApplicationDbContext context)
           {
               _context = context;
           }

           [HttpGet]
           public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
           {
               return await _context.Todos.ToListAsync();
           }

           [HttpPost]
           public async Task<ActionResult<Todo>> PostTodo(Todo todo)
           {
               _context.Todos.Add(todo);
               await _context.SaveChangesAsync();
               return CreatedAtAction(nameof(GetTodos), new { id = todo.Id }, todo);
           }
       }
   }
   ```

5. Replace the contents of `Program.cs`:

   ```csharp
   using Microsoft.EntityFrameworkCore;
   using NeonEfExample.Data;

   var builder = WebApplication.CreateBuilder(args);

   builder.Services.AddControllers();
   builder.Services.AddOpenApi();

   builder.Services.AddDbContext<ApplicationDbContext>(options =>
       options.UseNpgsql(builder.Configuration.GetConnectionString("TodoDbConnection")));

   var app = builder.Build();

   if (app.Environment.IsDevelopment())
   {
       app.MapOpenApi();
   }

   app.UseHttpsRedirection();
   app.UseAuthorization();
   app.MapControllers();

   app.Run();
   ```

   The name passed to `GetConnectionString` must match the key in `appsettings.json` (`TodoDbConnection`). If it doesn't, `dotnet ef database update` fails with `The ConnectionString property has not been initialized`.

6. Create and apply the initial migration:

   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

## Run the application

1. Start the application on port 5001:

   ```bash
   dotnet run --urls http://localhost:5001
   ```

2. In another terminal, create a todo and then list todos:

   ```bash
   curl -X POST http://localhost:5001/api/todo \
     -H "Content-Type: application/json" \
     -d '{"title": "Try Neon", "isComplete": false}'

   curl http://localhost:5001/api/todo
   ```

   The second command returns the todo stored in your Neon database:

   ```json filename="Output"
   [{"id":1,"title":"Try Neon","isComplete":false}]
   ```

   In development, the OpenAPI document for the API is available at `http://localhost:5001/openapi/v1.json`.

## Resources

- [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/)

## Next steps

- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>

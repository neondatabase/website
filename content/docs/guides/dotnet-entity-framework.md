---
title: Connect an Entity Framework application to Neon
subtitle: Set up a Neon project in seconds and connect from an Entity Framework
  application
summary: >-
  Step-by-step guide for creating a Neon project and connecting it to an Entity
  Framework Core application, including setting up an ASP.NET Core Web API with
  Npgsql as the database provider.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.954Z'
---

<CopyPrompt src="/prompts/dotnet-ef-prompt.md"
description="Pre-built prompt for connecting .NET Entity Framework projects to Neon Postgres."/>

This guide describes how to create a Neon project and connect to it from an Entity Framework Core application. The example demonstrates how to set up a basic ASP.NET Core Web API project with Entity Framework Core using Npgsql as the database provider. Choose **Connect with neon init** for a quick, guided setup or **Connect manually** for step-by-step instructions.

<Admonition type="note">
The same configuration steps can be used for any .NET application using Entity Framework Core, including ASP.NET Core MVC, Blazor, or console applications.
</Admonition>

<Tabs labels={["Connect with neon init", "Connect manually"]}>

<TabItem>

To connect your Entity Framework app to Neon using AI-assisted setup:

<Steps>

## Create a .NET project

1. Create a new ASP.NET Core Web API project and change to the newly created directory:

   ```bash
   dotnet new webapi -n NeonEfExample
   cd NeonEfExample
   ```

2. Delete the files `WeatherForecast.cs` and `Controllers/WeatherForecastController.cs` as we won't be using them:

   ```bash
   rm WeatherForecast.cs Controllers/WeatherForecastController.cs
   ```

3. Install required packages

    <Admonition type="important" title="IMPORTANT">
    Ensure you install package versions that match your .NET version. You can verify your .NET version at any time by running `dotnet --version`.
    </Admonition>

   ```bash
   dotnet tool install --global dotnet-ef --version YOUR_DOTNET_VERSION
   dotnet add package Microsoft.EntityFrameworkCore.Design --version YOUR_DOTNET_VERSION
   ```

## Run neon init

1. From your Entity Framework project root, run [`neon init`](/docs/reference/cli-init):

   ```bash
   npx neonctl@latest init
   ```

2. Follow the interactive prompts to sign up for Neon (or log in) and select your editor(s). This installs the AI development tooling for your coding environment:
   - MCP server
   - Agent skills
   - IDE extensions
   - Plugins

3. **Restart your editor** to pick up the new tooling.

## Ask your AI assistant to get started

Open your AI assistant's chat and type:

> Get started with Neon

Your AI assistant will walk you through:

- Creating a database branch in a new or existing Neon project
- Storing the connection string in your project's `.env` file
- Installing the appropriate client libraries
- Configuring your Entity Framework app to connect to Neon
- Setting up [Neon Auth](/docs/auth/overview) for managed authentication, if your app needs it

## Run the application

1. Start the application:

   ```bash
   dotnet run
   ```

2. Test the connection by navigating to [`http://localhost:5001/swagger`](http://localhost:5001/swagger) in your browser. You can use the Swagger UI to create and retrieve Todo items.

</Steps>

<Admonition type="tip">
For details on what `neon init` creates and how to customize it, see the [CLI init reference](/docs/reference/cli-init).
</Admonition>

</TabItem>

<TabItem>

To create a Neon project and access it from an Entity Framework application:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a .NET project and add dependencies

1. Create a new ASP.NET Core Web API project and change to the newly created directory:

   ```bash
   dotnet new webapi -n NeonEfExample
   cd NeonEfExample
   ```

2. Delete the files `WeatherForecast.cs` and `Controllers/WeatherForecastController.cs` as we won't be using them:

   ```bash
   rm WeatherForecast.cs Controllers/WeatherForecastController.cs
   ```

3. Install required packages

    <Admonition type="important" title="IMPORTANT">
    Ensure you install package versions that match your .NET version. You can verify your .NET version at any time by running `dotnet --version`.
    </Admonition>

   ```bash
   dotnet tool install --global dotnet-ef --version YOUR_DOTNET_VERSION
   dotnet add package Microsoft.EntityFrameworkCore.Design --version YOUR_DOTNET_VERSION
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version YOUR_DOTNET_VERSION
   ```

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

3. Update `appsettings.json` / `appsettings.Development.json`:

   Add the connection string:

   ```json
   {
     "ConnectionStrings": {
       "TodoDbConnection": "Host=your-neon-host;Database=your-db;Username=your-username;Password=your-password;SSL Mode=Require"
     }
   }
   ```

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

5. Update `Program.cs`:

   ```csharp
   using Microsoft.EntityFrameworkCore;
   using NeonEfExample.Data;

   var builder = WebApplication.CreateBuilder(args);

   builder.Services.AddControllers();

   builder.Services.AddDbContext<ApplicationDbContext>(options =>
       options.UseNpgsql(builder.Configuration.GetConnectionString("TodoDbConnection")));

   builder.Services.AddEndpointsApiExplorer();
   builder.Services.AddSwaggerGen();

   var app = builder.Build();

   app.UseSwagger();
   app.UseSwaggerUI();
   app.UseAuthorization();
   app.MapControllers();

   if (app.Environment.IsDevelopment())
   {
       app.Run("http://localhost:5001");
   }
   else
   {
       app.UseHttpsRedirection();
       app.Run();
   }
   ```

6. Create and apply the initial migration:

   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

## Run the application

1. Start the application:

   ```bash
   dotnet run
   ```

2. Test the connection by navigating to [`http://localhost:5001/swagger`](http://localhost:5001/swagger) in your browser. You can use the Swagger UI to create and retrieve Todo items.

## Add authentication (optional)

If your app requires user authentication, Neon provides [Neon Auth](/docs/auth/overview), a managed authentication service that branches with your database.

</Steps>

</TabItem>

</Tabs>

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-dotnet-entity-framework" description="Get started with Entity Framework and Neon" icon="github">Get started with Entity Framework and Neon</a>
</DetailIconCards>

## Resources

- [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/)

<NeedHelp/>

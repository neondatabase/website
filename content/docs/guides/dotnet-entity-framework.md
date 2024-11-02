---
title: Connect an Entity Framework application to Neon
subtitle: Set up a Neon project in seconds and connect from an Entity Framework application
enableTableOfContents: true
updatedOn: '2024-11-01T00:00:00.000Z'
---

This guide describes how to create a Neon project and connect to it from an Entity Framework Core application. The example demonstrates how to set up a basic ASP.NET Core Web API project with Entity Framework Core using Npgsql as the database provider.

<Admonition type="note">
The same configuration steps can be used for any .NET application using Entity Framework Core, including ASP.NET Core MVC, Blazor, or console applications.
</Admonition>

To connect to Neon from an Entity Framework application:

1. [Create a Neon Project](#create-a-neon-project)
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
       options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-dotnet-ef" description="Get started with Entity Framework and Neon" icon="github">Get started with Entity Framework and Neon</a>
</DetailIconCards>

## Resources

- [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/)

<NeedHelp/>

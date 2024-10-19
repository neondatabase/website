---
title: Scale your .NET application with Entity Framework and Neon Postgres Read Replicas
subtitle: Learn how to scale .NET applications with Entity Framework's DbContext and Neon Postgres Read Replicas
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2024-10-13T00:00:00.000Z'
updatedOn: '2024-10-13T00:00:00.000Z'
---

[Neon read replicas](https://neon.tech/docs/introduction/read-replicas) are independent read-only compute instances that perform read operations on the same data as your primary read-write compute. A key advantage of Neon's architecture is that adding a read replica to a Neon project doesn't require additional storage, making it an efficient scaling solution.

This guide demonstrates how to leverage Neon read replicas to efficiently scale .NET applications using Entity Framework Core. You'll learn how to configure your DbContext to work with read replicas, enabling you to optimize your database operations and improve overall application performance.

## Prerequisites

- A Neon account and a Project. If you don't have one, you can sign up for a Neon account and create a project by following the [Getting Started guide](/docs/get-started-with-neon/signing-up).
- Basic knowledge of .NET Core
- Dotnet SDK installed on your local machine. You can download it from the [official .NET website](https://dotnet.microsoft.com/download).
- Dotnet Entity Framework Core CLI tools installed. You can install them by running the following command:

    ```bash
    dotnet tool install --global dotnet-ef
    ```

## Build the Todo app

To demonstrate how to use Neon read replicas with Entity Framework Core, we'll build a simple Todo application that uses a Neon database. We'll then update the application to use a read replica for read operations, improving the application's performance and scalability. This is just a simple example to demonstrate the concept, and you can apply the same principles to more complex applications.

### Part 1: Build the initial Todo app with a single database

#### Set up the project

Create a new .NET Core Web API project using the following commands:

```bash
dotnet new webapi -n TodoApi
cd TodoApi
```

#### Delete the WeatherForecast files

Delete the files `WeatherForecast.cs` and `Controllers/WeatherForecastController.cs` as we won't be using them:

```bash
rm WeatherForecast.cs Controllers/WeatherForecastController.cs
```

#### Install required packages

Install Entity Framework Core Design and Npgsql packages:

<Admonition type="tip" title="Best Practice">
Ensure you install package versions that match your .NET version. You can verify your .NET version at any time by running `dotnet --version`.
</Admonition>

```bash
dotnet add package Microsoft.EntityFrameworkCore.Design --version 6.0.4
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 6.0.4
```

#### Create the Todo model

Create a new file `Models/Todo.cs`:

```csharp
namespace TodoApi.Models
{
    public class Todo
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public bool IsComplete { get; set; }
    }
}
```

#### Create the database context

Create a new file `Data/TodoDbContext.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options) { }
        public DbSet<Todo> Todos => Set<Todo>();
    }
}
```

#### Update `appsettings.json` / `appsettings.Development.json`:

Add the connection string:

```json
{
  "ConnectionStrings": {
    "TodoDbConnection": "Host=your-neon-host;Database=your-db;Username=your-username;Password=your-password"
  }
}
```

#### Create the TodoController

Create a new file `Controllers/TodoController.cs`:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly TodoDbContext _context;

        public TodoController(TodoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
        {
            return await _context.Todos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Todo>> GetTodo(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            return todo;
        }

        [HttpPost]
        public async Task<ActionResult<Todo>> PostTodo(Todo todo)
        {
            _context.Todos.Add(todo);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodo(int id, Todo todo)
        {
            if (id != todo.Id)
            {
                return BadRequest();
            }
            _context.Entry(todo).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var todo = await _context.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
```

This controller defines CRUD operations (Create, Read, Update, Delete) for Todo items using HTTP requests. It uses `TodoDbContext` to interact with the database.

#### Update `Program.cs` with the following content:

```csharp
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<TodoDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("TodoDbConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

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

This code configures the application to use Entity Framework Core with a PostgreSQL database. It registers `TodoDbContext` with the application's services and sets up the database connection using the connection string from `appsettings.json` / `appsettings.Development.json`.

#### Create Migrations

Run the following commands to create and apply the initial migration:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### Run the application

Start the application:

```bash
dotnet run
```

Visit the Swagger UI at [`http://localhost:5001/swagger`](http://localhost:5001/swagger) to test the API.

![Swagger UI](/docs/guides/dotnet_ef_todo_swagger_demo.png)

### Part 2: Use a read replica for read-only operations

#### Create a read replica on Neon

To create a read replica:

1. In the Neon Console, select **Branches**.
2. Select the branch where your database resides.
3. Click **Add Read Replica**.
4. On the **Add new compute** dialog, select **Read replica** as the **Compute type**.
5. Specify the **Compute size settings** options. You can configure a **Fixed Size** compute with a specific amount of vCPU and RAM (the default) or enable autoscaling by configuring a minimum and maximum compute size. You can also configure the **Suspend compute after inactivity** setting, which is the amount of idle time after which your read replica compute is automatically suspended. The default setting is 5 minutes.
   <Admonition type="note">
   The compute size configuration determines the processing power of your database. More vCPU and memory means more processing power but also higher compute costs. For information about compute costs, see [Billing metrics](/docs/introduction/billing).
   </Admonition>
6. When you finish making selections, click **Create**.

Your read replica compute is provisioned and appears on the **Computes** tab of the **Branches** page.

Navigate to the **Dashboard** page, select the branch where the read replica compute was provisioned, and set the compute option to **Replica** to obtain the read replica connection string:

![Read replica connection string](/docs/guides/read_replica_connection_string.png)

#### Update the TodoDbContext

Modify `Data/TodoDbContext.cs` to include separate read and write contexts:

```csharp
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options) { }
        public DbSet<Todo> Todos => Set<Todo>();
    }

    public class TodoDbReadContext : DbContext
    {
        public TodoDbReadContext(DbContextOptions<TodoDbReadContext> options) : base(options) { }
        public DbSet<Todo> Todos => Set<Todo>();
    }
}
```

#### Update Program.cs

Modify `Program.cs` to include both read and write contexts:

```csharp
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<TodoDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("TodoDbConnection")));
builder.Services.AddDbContext<TodoDbReadContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("TodoDbConnectionRead")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

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

#### Update `appsettings.json` / `appsettings.Development.json`

Add the read replica connection string:

```json
{
  "ConnectionStrings": {
    "TodoDbConnection": "Host=your-neon-primary-host;Database=your-db;Username=your-username;Password=your-password",
    "TodoDbConnectionRead": "Host=your-neon-read-replica-host;Database=your-db;Username=your-username;Password=your-password"
  }
}
```

#### Update the TodoController

Modify `Controllers/TodoController.cs` to use separate read and write contexts:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly TodoDbContext _writeContext;
        private readonly TodoDbReadContext _readContext;

        public TodoController(TodoDbContext writeContext, TodoDbReadContext readContext)
        {
            _writeContext = writeContext;
            _readContext = readContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Todo>>> GetTodos()
        {
            return await _readContext.Todos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Todo>> GetTodo(int id)
        {
            var todo = await _readContext.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            return todo;
        }

        [HttpPost]
        public async Task<ActionResult<Todo>> PostTodo(Todo todo)
        {
            _writeContext.Todos.Add(todo);
            await _writeContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodo(int id, Todo todo)
        {
            if (id != todo.Id)
            {
                return BadRequest();
            }
            _writeContext.Entry(todo).State = EntityState.Modified;
            await _writeContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var todo = await _writeContext.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            _writeContext.Todos.Remove(todo);
            await _writeContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
```

<Admonition type="tip" title="Did you know?">
You can use dotnet-ef migrations even with multiple db contexts. You can specify the context to use by passing the `--context` option to the `dotnet ef` command.
</Admonition>

The Todo API is now set up to use separate read and write contexts, leveraging Neon's read replica feature. Read operations (`GET` requests) will use the read replica, while write operations (`POST`, `PUT`, `DELETE`) will use the primary database.

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/dhanushreddy291/neon-read-replica-entity-framework" description="Use read replicas with Entity Framework Core" icon="github">Read Replicas in .NET EF</a>
</DetailIconCards>

## Conclusion

This setup allows you to distribute your read load across one or more read replicas while ensuring that all write operations are performed on the primary database. Monitor your application's performance and adjust the number of read replicas as needed to handle your specific load requirements. With Neon, you can quickly scale out with as many read replicas as you need.

<NeedHelp/>

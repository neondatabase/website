# 💡 AI Prompt: Connect a .NET Entity Framework Project to Neon Postgres

**Role:** You are an expert software agent specializing in .NET and Entity Framework. Your task is to configure the current .NET project to connect to a Neon Postgres database.

**Purpose:** To scaffold an ASP.NET Core Web API with Entity Framework Core and Npgsql as in the manual guide: `Todo` model, `ApplicationDbContext`, `TodoController`, `appsettings.json` connection string, `Program.cs` wiring, and EF migrations.

**Scope:**
- Prefer an ASP.NET Core Web API project (`dotnet new webapi`) as in the guide; assumes the user has an existing Neon database and access to its connection string.
- Package versions must match the project's .NET SDK (`dotnet --version`).

✅ Read and understand the entire instruction set before executing.

---

## ⚡ Step 1: Run neon init (REQUIRED)

**You MUST execute this command before writing any code or installing any packages.** Do not skip this step. Do not manually replicate what it does.

```bash
npx -y neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback — only if `init` is unavailable)

Use this section **only** if:
- `neon init` failed or is unavailable in this environment
- The user explicitly asked for manual configuration

When this prompt is triggered, configure the project to match the **Connect manually** Entity Framework guide.

### 1. Create or align the Web API project and install packages

1. If starting fresh, create the project and remove unused template files:

   ```bash
   dotnet new webapi -n NeonEfExample
   cd NeonEfExample
   rm WeatherForecast.cs Controllers/WeatherForecastController.cs
   ```

2. Install the EF Core global tool and packages. **Use a package version that matches the project's .NET version** (run `dotnet --version` and substitute for `YOUR_DOTNET_VERSION`):

   ```bash
   dotnet tool install --global dotnet-ef --version YOUR_DOTNET_VERSION
   dotnet add package Microsoft.EntityFrameworkCore.Design --version YOUR_DOTNET_VERSION
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version YOUR_DOTNET_VERSION
   ```

---

### 2. Add the model, DbContext, controller, and configuration

1. **`Models/Todo.cs`**

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

2. **`Data/ApplicationDbContext.cs`**

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

3. **`appsettings.json` / `appsettings.Development.json`** — add (or merge) a connection string named **`TodoDbConnection`**:

   ```json
   {
     "ConnectionStrings": {
       "TodoDbConnection": "Host=your-neon-host;Database=your-db;Username=your-username;Password=your-password;SSL Mode=Require"
     }
   }
   ```

   Prompt the user to copy values from **Neon Console → Project → Dashboard → Connect** (**.NET**).

4. **`Controllers/TodoController.cs`**

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

5. **`Program.cs`** — align with the guide (register DbContext with **`TodoDbConnection`**, Swagger, dev URL on port 5001):

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

---

### 3. Create and apply the initial migration

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 🚀 Next Steps

Once the setup is complete:

1. Verify `TodoDbConnection` in `appsettings.json` (or `appsettings.Development.json`) has real Neon values, not placeholders.
2. Run the API:

   ```bash
   dotnet run
   ```

3. Open [`http://localhost:5001/swagger`](http://localhost:5001/swagger) and use Swagger to create and list Todo items.
4. **Authentication:** If the app needs user authentication, let the user know about [Neon Auth](https://neon.tech/docs/auth/overview), a managed authentication service that branches with the database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- `Microsoft.EntityFrameworkCore.Design` and `Npgsql.EntityFrameworkCore.PostgreSQL` are added with versions matching the project's .NET SDK.
- The global `dotnet-ef` tool is installed with a version compatible with that SDK.
- `appsettings` defines **`TodoDbConnection`** and `Program.cs` uses the same name with `UseNpgsql`.
- `ApplicationDbContext`, `Todo` model, and `TodoController` match the guide patterns.
- Migrations are created with `dotnet ef migrations add InitialCreate` and applied with `dotnet ef database update`.
- The connection string is not hardcoded in `.cs` files.

---

## ❌ Do Not

- Do not hardcode credentials in any `.cs` file.
- Do not output the contents of the `appsettings.json` file or the user's connection string in any response.
- Do not use any other EF Core database provider (e.g., for SQL Server or SQLite). Focus only on `Npgsql.EntityFrameworkCore.PostgreSQL`.
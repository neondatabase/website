---
title: Building ASP.NET Core Applications with Neon and Entity Framework Core
subtitle: Learn how to build a .NET application with Neon's serverless Postgres and Entity Framework Core
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-11-02T00:00:00.000Z'
updatedOn: '2024-11-02T00:00:00.000Z'
---

When building .NET applications, choosing the right database solution is an important step to good performance and scalability. Neon's serverless Postgres is a great choice for .NET developers, thanks to features like automatic scaling, branching, and connection pooling that integrate well with .NET's ecosystem.

In this guide, we'll walk through setting up a Neon database with a .NET application and explore best practices for connecting and interacting with Neon Postgres and structuring your application using Entity Framework Core.

## Prerequisites

- .NET 8.0 or later installed
- A [Neon account](https://console.neon.tech/signup)
- Basic familiarity with Entity Framework Core

## Setting Up Your Neon Database

1. Create a new Neon project from the [Neon Console](https://console.neon.tech)
2. Note your connection string from the connection details page

Your connection string will look similar to this:

```shell
postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require
```

## Creating a .NET Project with Neon Integration

With your Neon database set up, let's create a sample inventory management system to demonstrate Neon integration.

1. Create a new .NET Web API project:

   ```bash
   dotnet new webapi -n NeonInventoryApi
   ```

   This command creates a new Web API project with a basic structure including:

   - `Program.cs`: The entry point of your application
   - `appsettings.json`: Configuration files
   - `Properties/launchSettings.json`: Debug and launch configuration

   Then navigate to the project directory:

   ```bash
   cd NeonInventoryApi
   ```

2. Install the required NuGet packages:

   ```bash
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
   dotnet add package Microsoft.EntityFrameworkCore.Tools
   dotnet add package Microsoft.EntityFrameworkCore.Design
   ```

   These packages provide us with the following:

   - `Npgsql.EntityFrameworkCore.PostgreSQL`: The Postgres database provider for Entity Framework Core
   - `Microsoft.EntityFrameworkCore.Tools`: Command-line tools for migrations
   - `Microsoft.EntityFrameworkCore.Design`: Design-time tools for EF Core

3. Create a Models directory and add your entity models:

   ```bash
   mkdir Models
   ```

   Create a new file `Models/Product.cs`:

   ```csharp
   using System;
   using System.ComponentModel.DataAnnotations;

   namespace NeonInventoryApi.Models
   {
       public class Product
       {
           [Key]
           public int? Id { get; set; }

           [Required]
           [MaxLength(100)]
           public string? Name { get; set; }

           [Required]
           [MaxLength(20)]
           public string? SKU { get; set; }

           [Range(0, 999999.99)]
           public decimal? Price { get; set; }

           [Range(0, int.MaxValue)]
           public int? StockLevel { get; set; }

           public DateTime LastRestocked { get; set; }

           // Additional validation attributes
           [Timestamp]
           public byte[]? Version { get; set; }

       }
   }
   ```

   Our `Product` model includes the following:

   - Data annotations for validation
   - A unique identifier (`Id`)
   - Basic product information fields
   - Optimistic concurrency control (`Version`)
   - Comments indicating where to add relationships

4. Create a Data directory for your database context, this is where you will define your `DbContext` which represents your database schema:

   ```bash
   mkdir Data
   ```

   Create a new file `Data/InventoryContext.cs` with the following content:

   ```csharp
   using Microsoft.EntityFrameworkCore;
   using NeonInventoryApi.Models;
   using System.Reflection;

   namespace NeonInventoryApi.Data
   {
       public class InventoryContext : DbContext
       {
           public InventoryContext(DbContextOptions<InventoryContext> options)
               : base(options)
           { }

           public DbSet<Product> Products { get; set; }

           protected override void OnModelCreating(ModelBuilder modelBuilder)
           {
               // Configure the Product entity
               modelBuilder.Entity<Product>(entity =>
               {
                   // Create a unique index on SKU
                   entity.HasIndex(p => p.SKU)
                         .IsUnique();

                   // Configure the Name property
                   entity.Property(p => p.Name)
                         .IsRequired()
                         .HasMaxLength(100);

                   // Configure the Price property
                   entity.Property(p => p.Price)
                         .HasPrecision(10, 2);

                   // Add a default value for LastRestocked
                   entity.Property(p => p.LastRestocked)
                         .HasDefaultValueSql("CURRENT_TIMESTAMP");
               });

               modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

               base.OnModelCreating(modelBuilder);
           }
       }
   }
   ```

   The `DbContext` includes:

   - Entity configuration using Fluent API
   - Precision settings for decimal values
   - Default value configurations
   - Index definitions
   - Support for separate configuration classes

We've set up the basic structure for our application. Next, we'll configure the database connection and implement the repository pattern for database operations.

## Configuring Database Connection

With the database context in place, we need to configure the connection to our Neon database. Let's set this up securely.

### Basic Configuration

Update `Program.cs` to include the database context:

```csharp
using NeonInventoryApi.Data;

var connectionString = builder.Configuration.GetConnectionString("NeonConnection");

builder.Services.AddDbContext<InventoryContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("NeonConnection")));
```

### Managing Connection Strings Securely

There are two main approaches to storing your connection string securely:

1. **Development**: Use `appsettings.Development.json` for local development:

```json
{
  "ConnectionStrings": {
    "NeonConnection": "Server=your-neon-hostname;Database=neondb;User Id=your-username;Password=your-password;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

2. **Production**: Use environment variables:

```csharp
// Program.cs
var connectionString = Environment.GetEnvironmentVariable("NEON_CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("NeonConnection");
```

That way, you can set the `NEON_CONNECTION_STRING` environment variable in your production environment to securely store your connection string.

As an alternative, you can use the `Azure Key Vault` to store your connection string securely. To learn more about this approach, check out the [Azure Key Vault documentation](https://learn.microsoft.com/en-us/azure/key-vault/general/basic-concepts).

### Testing the Configuration

To verify everything is working correctly, start your application:

```bash
dotnet run
```

If everything is set up correctly, you should see a message indicating that the application is running and listening on a specific port.

## Implementing Repository Pattern

The repository pattern acts as an abstraction layer between your application logic and data access code. This pattern helps maintain clean separation of concerns and makes your code more testable and maintainable.

In our inventory system, we'll implement this pattern to handle all database operations related to products.

First, let's define the interface that specifies what operations our repository can perform. Create a new file `Repositories/IProductRepository.cs` with the following content:

```csharp
using NeonInventoryApi.Models;

namespace NeonInventoryApi.Repositories
{
    public interface IProductRepository
    {
        Task<Product> GetByIdAsync(int id);
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product> CreateAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
    }
}
```

This interface defines the contract for our repository. That way all implementations will provide these basic CRUD (Create, Read, Update, Delete) operations. Using an interface allows us to easily swap implementations or create mock versions for testing.

Next, let's implement the repository, starting with the `ProductRepository` class in `Repositories/ProductRepository.cs`:

```csharp
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NeonInventoryApi.Data;
using NeonInventoryApi.Models;

namespace NeonInventoryApi.Repositories{
    public class ProductRepository : IProductRepository
    {
        private readonly InventoryContext _context;

        public ProductRepository(InventoryContext context)
        {
            _context = context;
        }

        public async Task<Product> GetByIdAsync(int id)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product> CreateAsync(Product product)
        {
            product.LastRestocked = product.LastRestocked.ToUniversalTime();
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task UpdateAsync(Product product)
        {
            product.LastRestocked = product.LastRestocked.ToUniversalTime();
            _context.Products.Update(product);
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await GetByIdAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }
    }
}
```

Each method in the repository serves a specific purpose:

- `GetByIdAsync`: Retrieves a single product by its ID using asynchronous operations
- `GetAllAsync`: Returns all products from the database as an enumerable collection
- `CreateAsync`: Adds a new product to the database and returns the created product
- `UpdateAsync`: Modifies an existing product's information in the database
- `DeleteAsync`: Removes a product from the database by its ID

To use this repository in your application, register it with the dependency injection container in `Program.cs`:

```csharp
builder.Services.AddScoped<IProductRepository, ProductRepository>();
```

This registration makes the repository available throughout your application.

Then you can inject it into your controllers or services, create a new controller `Controllers/ProductsController.cs`:

```csharp
using Microsoft.AspNetCore.Mvc;
using NeonInventoryApi.Models;
using NeonInventoryApi.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeonInventoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _repository;

        public ProductsController(IProductRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            return Ok(await _repository.GetAllAsync());
        }

        [HttpPost]
        public async Task<ActionResult<Product>> Create([FromBody] Product product)
        {
            var createdProduct = await _repository.CreateAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, createdProduct);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetById(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] Product product)
        {
            if (id != product.Id)
                return BadRequest();

            await _repository.UpdateAsync(product);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
```

The controller uses the repository to interact with the database. Each action corresponds to a CRUD operation and returns appropriate HTTP status codes based on the operation's success.

The repository pattern is particularly useful when working with Postgres as it provides a single place to implement database-specific optimizations and connection handling strategies.

After implementing the repository pattern, make sure to register the controllers in `Program.cs`:

```csharp
app.MapControllers();
```

With the repository pattern in place, we are nearly ready to start using our Neon database. Before that, let's add some sample data to the database using migrations.

## Migrations

Similar to other web frameworks, Entity Framework Core uses migrations to keep track of changes to your database schema. With migrations, you can incrementally apply schema updates as your data models evolve over time.

### Installing `dotnet-ef`

Before creating migrations, make sure you have the `dotnet-ef` tool is installed. This tool provides command-line capabilities for managing Entity Framework migrations and database updates.

Install `dotnet-ef` globally by running:

```bash
dotnet tool install --global dotnet-ef
```

> **Note**: If you encounter any issues after installation, make sure your environment's `PATH` includes the directory where .NET global tools are installed. It is usually `~/.dotnet/tools` on macOS and Linux. You can add this to your `PATH` temporarily with the following command, or add it to your shell configuration file (like `.bashrc` or `.zshrc`) to make it permanent:

```bash
export PATH="$PATH:$HOME/.dotnet/tools"
```

### Creating and Applying Migrations

Once `dotnet-ef` is installed, you can create a migration to define your database schema based on your `DbContext` and entity classes.

1. The following command generates the initial migration files, representing the schema of your database:

   ```bash
   dotnet ef migrations add InitialCreate
   ```

   This command creates a new folder called `Migrations` (if it doesn't already exist) and generates files that contain code to create your database tables. It examines your `DbContext` and entity classes to determine the schema, so that you don't have to write SQL manually.

2. Now, apply the migration to your actual database:

   ```bash
   dotnet ef database update
   ```

   This command executes the generated migration code against the database, creating the necessary tables and constraints based on your model definitions.

After these steps, your database will be fully synchronized with your data model, and you're ready to start using it in your application.

Now if you run your application and navigate to `http://localhost:5221/api/products`, you should see an empty array `[]` as we haven't added any products yet.

## Testing CRUD Operations

With our API and database set up, we’re ready to test the CRUD operations. We’ll use simple HTTP requests to add, retrieve, update, and delete products from our Neon database.

### 1. Adding a New Product

To add a new product, send a `POST` request to `http://localhost:5221/api/products`. Here’s an example using `curl`:

```bash
curl -X POST http://localhost:5221/api/products \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Sample Product",
           "sku": "SP123",
           "price": 29.99,
           "stockLevel": 100,
           "lastRestocked": "2024-01-01T00:00:00"
         }'
```

> Alternatively, you can use Postman by setting up a `POST` request to the same URL, setting the header `Content-Type` to `application/json`, and adding the JSON body.

If the request is successful, the API will return the newly created product with an auto-generated `Id`.

### 2. Retrieving All Products

To retrieve all products, send a `GET` request to `http://localhost:5221/api/products`:

```bash
curl -X GET http://localhost:5221/api/products
```

This should return a list of all products in the database. If you just added one product, you’ll see an array with that single product.

### 3. Retrieving a Product by ID

To retrieve a specific product, send a `GET` request to `http://localhost:5221/api/products/{id}`, replacing `{id}` with the actual product ID. For example:

```bash
curl -X GET http://localhost:5221/api/products/1
```

This request will return the product with the specified `Id`. If no product is found, it may return a `404 Not Found`.

### 4. Updating a Product

To update an existing product, send a `PUT` request to `http://localhost:5221/api/products/{id}`. Include the updated information in the request body. Here’s an example:

```bash
curl -X PUT http://localhost:5221/api/products/1 \
     -H "Content-Type: application/json" \
     -d '{
           "id": 1,
           "name": "Updated Product",
           "sku": "SP123",
           "price": 24.99,
           "stockLevel": 120,
           "lastRestocked": "2024-01-02T00:00:00"
         }'
```

This request updates the product with `Id = 1`. The API will return the updated product information if the operation succeeds.

### 5. Deleting a Product

To delete a product, send a `DELETE` request to `http://localhost:5221/api/products/{id}`, replacing `{id}` with the product’s actual ID:

```bash
curl -X DELETE http://localhost:5221/api/products/1
```

If successful, the API will delete the product from the database and return a status code indicating success.

## Conclusion

Connecting .NET applications to Neon gives you a strong and scalable database setup. By following these steps and using features like connection pooling and automatic scaling, you can create applications that perform well even as they grow.

As next steps, consider adding more features to your application, such as authentication and authorization. You can also explore advanced Neon features like branching and data replication to enhance your application's performance and reliability.

For more details, check out:

- [Neon Documentation](/docs)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [Npgsql Documentation](https://www.npgsql.org/doc/index.html)

<NeedHelp />

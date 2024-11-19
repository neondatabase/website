---
title: Building a RESTful API with ASP.NET Core, Swagger, and Neon
subtitle: Learn how to connect your .NET applications to Neon's serverless Postgres database
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-11-03T00:00:00.000Z'
updatedOn: '2024-11-03T00:00:00.000Z'
---

In this guide, we'll walk through the process of developing a RESTful API using ASP.NET Core, connecting it to a Neon Postgres database. We will cover CRUD operations using Entity Framework Core (EF Core), generate interactive API documentation with Swagger, and explore best practices for testing your API endpoints. As a bonus, we'll also implement JWT authentication to secure your endpoints.

## Prerequisites

Before we start, make sure you have the following:

- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Neon account](https://neon.tech) for setting up your Postgres database
- [Postman](https://www.postman.com/downloads/) for API testing
- Basic knowledge of C# and ASP.NET Core
- Familiarity with Entity Framework Core

## Setting Up Your ASP.NET Core Project

First, create a new ASP.NET Core Web API project:

```bash
dotnet new webapi -n NeonApi
cd NeonApi
```

Install the required NuGet packages using the `dotnet add package` command:

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Swashbuckle.AspNetCore
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.EntityFrameworkCore.Design
```

The above packages include:

- `Microsoft.EntityFrameworkCore` - Entity Framework Core for database operations
- `Npgsql.EntityFrameworkCore.PostgreSQL` - PostgreSQL provider for EF Core
- `Swashbuckle.AspNetCore` - Swagger for API documentation
- `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT authentication for securing endpoints
- `Microsoft.EntityFrameworkCore.Design` - EF Core design tools for migrations

### Configuring the Neon Database

Head over to your [Neon Dashboard](https://neon.tech) and create a new project.

Once done, grab your database connection string and add it to your `appsettings.json`:

```json
"ConnectionStrings": {
  "NeonDb": "Host=<your-host>;Database=<your-database>;Username=<your-username>;Password=<your-password>;Port=5432"
}
```

While you're in `appsettings.json`, add a section for JWT authentication after the connection string:

```json
"Jwt": {
"SecretKey": "your-very-secure-secret-key"
}
```

We will cover JWT authentication in more detail later in this guide, but for now, let's focus on setting up the API.

Next, update your `Program.cs` file to include the database context, Swagger, and JWT authentication:

```csharp
using NeonApi.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add the Neon database context using Npgsql provider
builder.Services.AddDbContext<NeonDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("NeonDb")));

// Register controllers for handling incoming HTTP requests
builder.Services.AddControllers();

// Enable API endpoint exploration and Swagger documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Set up JWT authentication to secure API endpoints
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Validate that the token is signed with the specified key
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"])),

            // Disable issuer and audience validation for testing purposes
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

// Configure the middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

In the above, we configure the necessary services directly within `Program.cs` to connect our ASP.NET Core API to Neon and secure it with JWT authentication:

1. We use `AddDbContext` to set up `NeonDbContext` with the Npgsql provider, connecting to the Neon database using the connection string defined in `appsettings.json`. Make sure to update `"NeonDb"` with your actual connection string key if it's named differently.

2. We register controllers with `AddControllers()`, which allows the application to handle incoming API requests and map them to their respective endpoints.

3. By adding `EndpointsApiExplorer` and `SwaggerGen`, we enable automatic generation of API documentation. This provides a user-friendly interface to interact with your API endpoints, accessible at `/swagger`.

4. For the JWT authentication setup, we are implementing the following:
   - Here, we set up JWT authentication to protect your API routes. We use `AddJwtBearer` to validate tokens sent by clients.
   - The `TokenValidationParameters` section allows us to make sure that the token is signed with the specified key. Replace `"your-secret-key"` in `appsettings.json` with a secure key unique to your application.
   - For simplicity, `ValidateIssuer` and `ValidateAudience` are set to `false`, which means the API won't check who issued the token or its intended audience. This is useful for local development but should be tightened for production environments.

To avoid hardcoding sensitive information like the secret key, consider using environment variables or a configuration management system to securely store secrets.

## Creating the Entity Framework Core Models

Data models define the structure of your database tables and the relationships between them. Here, we'll create a simple `Product` model to represent products in our Neon database.

In the `Models` folder, create a `Product.cs` file:

```csharp
namespace NeonApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
    }
}
```

Here, we define a simple `Product` model with four properties:

- `Id`: This is the primary key, which will auto-increment.
- `Name`: Stores the product's name.
- `Price`: Holds the product's price as a decimal value.
- `Description`: Provides additional details about the product.

Each property corresponds to a column in the database table that Entity Framework will generate for us.

### Creating the Database Context

Next, we need to create a database context class, which serves as a bridge between our C# code and the Neon database.

Create a new folder named `Data` and add a `NeonDbContext.cs` file:

```csharp
namespace NeonApi.Data
{
    public class NeonDbContext : DbContext
    {
        public NeonDbContext(DbContextOptions<NeonDbContext> options) : base(options) { }

        // This DbSet represents the Products table in the Neon database
        public DbSet<Product> Products { get; set; }
    }
}
```

The above code snippet does the following:

- The `NeonDbContext` class inherits from `DbContext`, which is part of Entity Framework Core.
- We pass `DbContextOptions` to the constructor to configure the connection to our Neon database.
- The `DbSet<Product>` property represents the `Products` table. This allows us to perform CRUD operations on the `Product` model directly through this context.

### Running Migrations to Create the Database Schema

Now that we have defined our model and context, let's generate the database schema using migrations. Open your terminal and run the following commands:

```bash
dotnet ef migrations add InitialCreate
```

The above command generates a migration file based on the changes made to the database schema. The migration file contains instructions to create the `Products` table.

Next, apply the migration to your Neon database:

```bash
dotnet ef database update
```

The `dotnet ef database update` command applies the migration to your Neon database, creating the `Products` table and any other necessary schema changes.

> **Note**: Make sure your database connection string in `appsettings.json` is correctly configured before running the migrations. That way the changes are applied to your Neon database instance.

At this point, your database is set up and ready to store product data!

## Building the API Endpoints

With the database schema in place, let's create the API endpoints to perform CRUD operations on the `Products` table.

In the `Controllers` folder, create a `ProductsController.cs` file with the following content:

```csharp
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeonApi.Data;
using NeonApi.Models;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly NeonDbContext _context;

    public ProductsController(NeonDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        // Retrieve all products from the database
        return await _context.Products.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        // Retrieve a single product by ID
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound(); // Return 404 if not found
        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        // Add a new product to the database
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Return 201 Created status with the newly created product
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        // Ensure the ID in the URL matches the ID of the provided product
        if (id != product.Id) return BadRequest();

        // Mark the product as modified
        _context.Entry(product).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        // Return 204 No Content status after a successful update
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        // Find the product by ID
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound(); // Return 404 if not found

        // Remove the product from the database
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        // Return 204 No Content status after successful deletion
        return NoContent();
    }
}
```

In the code above, we define a `ProductsController` to handle all CRUD operations for our `Product` model. Here's a breakdown of how each endpoint works:

1. The `GetProducts` method handles `GET /api/products` requests, fetching all products stored in the Neon database.

2. The `GetProduct` method handles `GET /api/products/{id}` requests to retrieve a single product by its unique ID. If no product with the given ID is found, it responds with a `404 Not Found`. This ensures the client is notified when attempting to access a non-existent product.

3. The `CreateProduct` method handles `POST /api/products` requests to add a new product. The response uses `CreatedAtAction` to include a link to the newly created resource, following REST best practices.

4. The `UpdateProduct` method handles `PUT /api/products/{id}` requests to modify an existing product. Once the update is successful, it responds with a `204 No Content`, indicating the operation was successful without returning any additional data.

5. The `DeleteProduct` method handles `DELETE /api/products/{id}` requests to remove a product by its ID. If the product doesn't exist, it returns a `404 Not Found` response.

Each endpoint is fully asynchronous and interacts with the Neon database through the `NeonDbContext` context.

## Setting Up Swagger for API Documentation

To document our API and provide an interactive interface for testing, we'll integrate Swagger into our ASP.NET Core project.

Swagger automatically generates OpenAPI documentation, making it easy to explore your API and test its endpoints directly from your browser.

### Enabling Swagger in `Program.cs`

To set up Swagger, add the following code in the `Configure` method of your `Program.cs` file:

```csharp
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    // Configure Swagger UI at the root URL
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Neon API V1");
    c.RoutePrefix = string.Empty;
});
```

The `UseSwagger` middleware generates the OpenAPI documentation for your API, while `UseSwaggerUI` sets up the Swagger interface for interacting with your endpoints.

### Running Your Application

Now that Swagger is set up, start your application using:

```bash
dotnet run
```

Once the application is running, you will see the port where your API is hosted (usually `https://localhost:5229`), eg.:

```
Building...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5229
```

Visit `https://localhost:5229/swagger` in your browser to access the Swagger UI.

The Swagger UI will appear, displaying all your API endpoints with detailed documentation. You can test the endpoints by sending requests directly from the UI and viewing the responses, making it easy to verify that everything works as expected.

## Testing Your API with Postman

Now that your API is running, you can use Postman or any other API testing tool to interact with your endpoints. You can even use the Swagger UI to test the endpoints, but Postman provides a more robust environment for testing complex scenarios.

In this section, we'll walk through testing the CRUD operations using Postman but feel free to use any tool you're comfortable with like Insomnia or cURL.

Download and launch [Postman](https://www.postman.com/downloads/). Create a new request to interact with your API.

Open Postman and create the following requests:

1. `GET`: `/api/products`

   - **Description**: Fetches all products.
   - Set to `GET`, enter `https://localhost:5001/api/products`, and click **Send**.
   - You should receive a `200 OK` response with a list of products.

2. `POST`: `/api/products`

   - **Description**: Creates a new product.
   - Set to `POST`, enter `https://localhost:5001/api/products`, and go to **Body** → **raw** → **JSON**.
   - Add:
     ```json
     {
       "name": "New Product",
       "price": 19.99,
       "description": "Sample product"
     }
     ```
   - Click **Send**. Expect a `201 Created` response.

3. `PUT`: `/api/products/{id}`

   - **Description**: Updates a product.
   - Set to `PUT`, enter `https://localhost:5001/api/products/1`.
   - Add:
     ```json
     {
       "id": 1,
       "name": "Updated Product",
       "price": 29.99,
       "description": "Updated description"
     }
     ```
   - Click **Send**. You should receive a `204 No Content`.

4. `DELETE`: `/api/products/{id}`
   - **Description**: Deletes a product.
   - Set to `DELETE`, enter `https://localhost:5001/api/products/1`, and click **Send**.
   - Expect a `204 No Content`.

After testing, check that all changes are reflected in your Neon database. Use both Postman and Swagger UI to confirm the endpoints are functioning correctly.

## Securing Your API with JWT Authentication (Bonus)

To protect your API endpoints, we’ll use [JWT](https://jwt.io/) (JSON Web Token) authentication. By adding the `[Authorize]` attribute to specific controller actions, you can ensure that only authenticated users have access. Here’s how to secure the `GetProducts` endpoint:

```csharp
[Authorize]
[HttpGet]
public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
{
    return await _context.Products.ToListAsync();
}
```

Now, any requests to `GetProducts` will require a valid JWT token, if you try to access the endpoint without a token, you will receive a `401 Unauthorized` response.

### Generating and Using JWT Tokens

When a user successfully logs in, the server generates a JWT token containing the user's authentication details. This token typically includes claims such as the user's ID, email, and a unique identifier. The token is then signed with a secret key to ensure its integrity and prevent tampering. For example:

```csharp
public string GenerateJwtToken(User user)
{
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"]));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: null,
        audience: null,
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

The token looks like this:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImp0aSI6IjMzYjQwMzIwLWUwZjItNDIwZi1iZjIwLWUwZjIwZmJmMjAwMCIsImV4cCI6MTY0MzUwNzQwMH0.7
```

If you were to go to [jwt.io](https://jwt.io/), you could paste the token and see its decoded contents.

Once the token is generated, the client stores it in local storage or session storage and includes it in the `Authorization` header for all subsequent requests to secured endpoints. For instance:

```
Authorization: Bearer <your-jwt-token>
```

With this header in place, the server can authenticate the user without requiring them to log in again for each request.

## Conclusion

In this guide, we covered the process of building a RESTful API with ASP.NET Core, connecting it to a Neon Postgres database, and securing it with JWT authentication. We explored CRUD operations using Entity Framework Core, generated interactive API documentation with Swagger, and tested our endpoints using Postman.

As a next step, consider expanding your API with additional features, such as pagination, filtering, or sorting. You can also explore adding testing frameworks like xUnit or NUnit to write unit tests for your API endpoints.

For more information, check out:

- [Neon Documentation](/docs)
- [Npgsql Documentation](https://www.npgsql.org/doc/index.html)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)

<NeedHelp />

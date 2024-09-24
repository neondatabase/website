---
title: Schema migration with Neon Postgres and Entity Framework
subtitle: Set up Neon Postgres and run migrations for your Entity Framework project
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.651Z'
---

[Entity Framework](https://learn.microsoft.com/en-us/ef/) is a popular Object-Relational Mapping (ORM) framework for .NET applications. It simplifies database access by allowing developers to work with domain-specific objects and properties without focusing on the underlying database tables and columns. Entity Framework also provides a powerful migration system that enables you to define and manage database schema changes over time.

This guide demonstrates how to use Entity Framework with the Neon Postgres database. We'll create a simple .NET application and walk through the process of setting up the database, defining models, and generating and running migrations to manage schema changes.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A recent version of the [.NET SDK](https://dotnet.microsoft.com/en-us/download/dotnet) installed on your local machine. This guide uses .NET 8.0, which is the current Long-Term Support (LTS) version.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.
2. Select a project or click the **New Project** button to create a new one.

### Retrieve your Neon database connection string

On the Neon project dashboard, navigate to the **Connection Details** section in your project dashboard to find your database connection URI. It should be in the format below:

```
postgresql://username:password@hostname/dbname?sslmode=require
```

The Postgres client library we use in this guide requires the connection string to be in the following format:

```
Host=hostname;Port=5432;Database=dbname;Username=username;Password=password;SSLMode=Require
```

Construct the connection string in this format using the correct values for your Neon connection URI. Keep it handy for later use.

<Admonition type="note">
Neon supports both direct and pooled database connection strings, which can be copied from the **Connection Details** widget on your Neon Project Dashboard. A pooled connection string connects your application to the database via a PgBouncer connection pool, allowing for a higher number of concurrent connections. However, using a pooled connection string for migrations can lead to errors. For this reason, we recommend using a direct (non-pooled) connection when performing migrations. For more information about direct and pooled connections, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## Setting up the Entity Framework project

### Create a new .NET project

Open your terminal and run the following command to create a new .NET console application:

```bash
dotnet new console -o guide-neon-entityframework
cd guide-neon-entityframework
```

### Install dependencies

Run the following commands to install the necessary NuGet packages:

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add Microsoft.AspNetCore.App
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package dotenv.net
```

These packages include the Entity Framework Core libraries, the design-time components for migrations, and the Npgsql provider for PostgreSQL.

We will also need the `EF Core` tools to generate and run migrations. Install the `dotnet-ef` tool globally:

```bash
dotnet tool install --global dotnet-ef
```

### Set up the database configuration

Create a new file named `.env` in the project root directory and add the following configuration:

```bash
DATABASE_URL=NEON_POSTGRES_CONNECTION_STRING
```

Replace `NEON_POSTGRES_CONNECTION_STRING` with the **formatted** connection string you constructed earlier.

## Defining data models and running migrations

### Create the data models

Create a new file named `Models.cs` in the project directory and define the data models for your application:

```csharp
# Models.cs

using System;
using Microsoft.EntityFrameworkCore;

namespace NeonEFMigrations
{
    public class Author
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Bio { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int AuthorId { get; set; }
        public Author Author { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
```

This code defines two entities: `Author` and `Book`. The `Author` entity represents an author with properties for name, bio, and created timestamp. The `Book` entity represents a book with properties for title, author (as a foreign key to the `Author` entity), and created timestamp.

Also, create a new file named `ApplicationDbContext.cs` in the project directory and add the following code:

```csharp
# ApplicationDbContext.cs

using Microsoft.EntityFrameworkCore;
using GuideNeonEF.Models;
using dotenv.net;

namespace GuideNeonEF
{
    public class ApplicationDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                DotEnv.Load();
                optionsBuilder.UseNpgsql(Environment.GetEnvironmentVariable("DATABASE_URL"));
            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Author>()
                .Property(a => a.CreatedAt)
                .HasDefaultValueSql("Now()");

            modelBuilder.Entity<Book>()
                .Property(b => b.CreatedAt)
                .HasDefaultValueSql("Now()");

            modelBuilder.Seed();
        }
        public DbSet<Author> Authors { get; set; }
        public DbSet<Book> Books { get; set; }
    }
}
```

The `ApplicationDbContext` class derives from `DbContext` and represents the database context. It includes the method where we configure the database connection and seed the database at initialization. We also set default values for the `CreatedAt` properties of the `Author` and `Book` entities.

### Add seeding script

To seed the database with some initial data, create another script named `ModelBuilderExtensions.cs` in the project directory and add the following code:

```csharp
# ModelBuilderExtensions.cs

using Microsoft.EntityFrameworkCore;
using GuideNeonEF.Models;

namespace GuideNeonEF
{
    public static class ModelBuilderExtensions
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
            var authors = new[]
            {
                new Author { Id = 1, Name = "J.R.R. Tolkien", Bio = "The creator of Middle-earth and author of The Lord of the Rings.", Country = "United Kingdom"},
                new Author { Id = 2, Name = "George R.R. Martin", Bio = "The author of the epic fantasy series A Song of Ice and Fire.", Country = "United States"},
                new Author { Id = 3, Name = "J.K. Rowling", Bio = "The creator of the Harry Potter series.", Country = "United Kingdom"}
            };
            modelBuilder.Entity<Author>().HasData(authors);

            var books = new[]
            {
                new Book { Id = 1, Title = "The Fellowship of the Ring", AuthorId = 1 },
                new Book { Id = 2, Title = "The Two Towers", AuthorId = 1 },
                new Book { Id = 3, Title = "The Return of the King", AuthorId = 1 },
                new Book { Id = 4, Title = "A Game of Thrones", AuthorId = 2 },
                new Book { Id = 5, Title = "A Clash of Kings", AuthorId = 2 },
                new Book { Id = 6, Title = "Harry Potter and the Philosopher's Stone", AuthorId = 3 },
                new Book { Id = 7, Title = "Harry Potter and the Chamber of Secrets", AuthorId = 3 }
            };
            modelBuilder.Entity<Book>().HasData(books);
        }
    }
}
```

This code defines a static method `Seed` that populates the database with some initial authors and books. Entity framework will include this data when generating database migrations.

### Generate migration files

To generate migration files based on the defined models, run the following command:

```bash
dotnet ef migrations add InitialCreate
```

This command detects the new `Author` and `Book` entities and generates migration files in the `Migrations` directory to create the corresponding tables in the database.

### Apply the migration

To apply the migration and create the tables in the Neon Postgres database, run the following command:

```bash
dotnet ef database update
```

This command executes the migration file and creates the necessary tables in the database. It will also seed the database with the initial data defined in the `Seed` method.

## Creating the web application

### Implement the API endpoints

The project directory has a `Program.cs` file that contains the application entry point. Replace the contents of this file with the following code:

```csharp
# Program.cs

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using GuideNeonEF;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ApplicationDbContext>();

var app = builder.Build();

app.UseRouting();
app.MapGet("/authors", async (ApplicationDbContext db) =>
    await db.Authors.ToListAsync());
app.MapGet("/books/{authorId}", async (int authorId, ApplicationDbContext db) =>
    await db.Books.Where(b => b.AuthorId == authorId).ToListAsync());

app.Run();
```

This code sets up a simple web application with two endpoints: `/authors` and `/books/[authorId]`. The `/authors` endpoint returns a list of all authors, while the `/books/[authorId]` endpoint returns a list of books written by the author with the specified ID.

### Test the application

To test the application, run the following command:

```bash
dotnet run
```

This will start a local web server at `http://localhost:5000`. Navigate to these endpoints in your browser to view the seeded data.

```bash
curl http://localhost:5000/authors
curl http://localhost:5000/books/1
```

## Applying schema changes

We'll see how to handle schema changes by adding a new property `Country` to the `Author` entity to store the author's country of origin.

### Update the data model

Open the `Models.cs` file and add a new property to the `Author` entity:

```csharp
# Models.cs

public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Bio { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Country { get; set; }
}
```

Also, update the seed data entries for the `Author` model to include the `Country` property:

```csharp
# ModelBuilderExtensions.cs

namespace GuideNeonEF
{
    public static class ModelBuilderExtensions
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
            var authors = new[]
            {
                new Author { Id = 1, Name = "J.R.R. Tolkien", Bio = "The creator of Middle-earth and author of The Lord of the Rings.", Country = "United Kingdom" },
                new Author { Id = 2, Name = "George R.R. Martin", Bio = "The author of the epic fantasy series A Song of Ice and Fire.", Country = "United States" },
                new Author { Id = 3, Name = "J.K. Rowling", Bio = "The creator of the Harry Potter series.", Country = "United Kingdom" }
            };
            modelBuilder.Entity<Author>().HasData(authors);
            ...
        }
    }
}
```

### Generate and run the migration

To generate a new migration file for the above schema change, run the following command in the terminal:

```bash
dotnet ef migrations add AddCountryToAuthor
```

This command detects the updated `Author` entity and generates a new migration file to add the new column to the corresponding table in the database. It will also include upserting the seed data with the new property added.

Now, to apply the migration, run the following command:

```bash
dotnet ef database update
```

### Test the schema change

Run the application again:

```bash
dotnet run
```

Now, if you navigate to the `/authors` endpoint, you should see the new `Country` property included in the response.

```bash
curl http://localhost:5000/authors
```

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-entityframework" description="Run Neon database migrations in an Entity Framework project" icon="github">Migrations with Neon and Entity Framework</a>
</DetailIconCards>

## Conclusion

In this guide, we demonstrated how to set up an Entity Framework project with Neon Postgres, define data models, generate migrations, and run them. Entity Framework's migration system make it easy to interact with the database and manage schema evolution over time.

## Resources

For more information on the tools and concepts used in this guide, refer to the following resources:

- [Entity Framework Core Documentation](https://learn.microsoft.com/en-us/ef/core/)
- [Neon Postgres](https://neon.tech/docs/introduction)

<NeedHelp/>

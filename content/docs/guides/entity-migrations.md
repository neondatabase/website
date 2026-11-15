---
title: Schema migration with Lakebase Postgres and Entity Framework
subtitle: Set up a database on Neon and run migrations for your Entity Framework project
summary: >-
  Entity Framework Core schema migrations on Lakebase Postgres walks through
  installing the Npgsql EF Core provider, defining C# models, and running
  dotnet-ef commands to create and evolve tables in a database. Use this
  guide when you need to connect an EF Core application to Neon and generate or
  apply migrations, including incremental schema changes such as adding a
  column. Use a direct (non-pooled) Neon connection string for migrations.
enableTableOfContents: true
updatedOn: '2026-10-28T11:11:18.780Z'
---

[Entity Framework](https://learn.microsoft.com/en-us/ef/) is an Object-Relational Mapping (ORM) framework for .NET applications. It lets you work with domain-specific objects and properties without focusing on the underlying database tables and columns. Entity Framework also includes a migration system that lets you define and manage database schema changes over time.

This guide shows how to use Entity Framework with the Lakebase Postgres database. You'll create a small .NET web application, set up the database, define models, and generate and run migrations to manage schema changes.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- The [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet) installed on your local machine. .NET 10 is the current Long-Term Support (LTS) release. This guide was tested with .NET SDK 10.0.403.

## Setting up your Neon database

### Initialize a new project

1. Log in to the Neon Console and navigate to the [Projects](https://console.neon.tech/app/projects) section.
2. Select a project or click the **New Project** button to create a new one.

### Retrieve your Neon database connection string

Click the **Connect** button in the Console nav to open the **Connect to your branch** modal. The **Connection pooling** toggle is on by default, which shows a pooled connection string. Turn the toggle off to show the direct connection string. It should look similar to the following:

```bash
postgresql://username:password@hostname/dbname?sslmode=require&channel_binding=require
```

The Postgres client library we use in this guide requires the connection string to be in the following format:

```bash
Host=hostname;Port=5432;Database=dbname;Username=username;Password=password;SSLMode=Require
```

Construct the connection string in this format using the values from your direct connection string. Keep it handy for later use.

<Admonition type="important" title="Use a direct connection for migrations">
Neon supports both direct and pooled connection strings. A pooled connection string routes your connections through a PgBouncer connection pool, which allows more concurrent connections. Migrations can run into errors through a connection pool, so this guide uses the direct (non-pooled) connection string for all steps. For more information, see [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## Setting up the Entity Framework project

### Create a new .NET project

Open your terminal and run the following commands to create a new ASP.NET Core web project. The `web` template includes the web SDK that the API endpoints in this guide need:

```bash
dotnet new web -o guide-neon-entityframework
cd guide-neon-entityframework
```

### Install dependencies

Run the following commands to install the NuGet packages. The versions are pinned to EF Core 10 to match the .NET 10 SDK. Without the pins, the latest EF Core 11 packages require .NET 11 and won't restore:

```bash
dotnet add package Microsoft.EntityFrameworkCore --version 10.0.15
dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.15
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 10.0.3
dotnet add package dotenv.net
```

These packages include the Entity Framework Core libraries, the design-time components for migrations, and the Npgsql provider for Postgres.

You also need the `dotnet-ef` tool to generate and run migrations. Install the version that matches your EF Core packages:

```bash
dotnet tool install --global dotnet-ef --version 10.0.15
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

```csharp filename="Models.cs"
using System;
using Microsoft.EntityFrameworkCore;

namespace GuideNeonEF
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

This code defines two entities: `Author` and `Book`. The `Author` entity has properties for name, bio, and created timestamp. The `Book` entity has properties for title, author (a foreign key to the `Author` entity), and created timestamp.

Also, create a new file named `ApplicationDbContext.cs` in the project directory and add the following code:

```csharp filename="ApplicationDbContext.cs"
using Microsoft.EntityFrameworkCore;
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

The `ApplicationDbContext` class derives from `DbContext` and represents the database context. It loads the connection string from the `.env` file, and it seeds the database when the model is built. It also sets default values for the `CreatedAt` properties of the `Author` and `Book` entities.

### Add seeding script

To seed the database with some initial data, create another file named `ModelBuilderExtensions.cs` in the project directory and add the following code:

```csharp filename="ModelBuilderExtensions.cs"
using Microsoft.EntityFrameworkCore;

namespace GuideNeonEF
{
    public static class ModelBuilderExtensions
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
            var authors = new[]
            {
                new Author { Id = 1, Name = "J.R.R. Tolkien", Bio = "The creator of Middle-earth and author of The Lord of the Rings." },
                new Author { Id = 2, Name = "George R.R. Martin", Bio = "The author of the epic fantasy series A Song of Ice and Fire." },
                new Author { Id = 3, Name = "J.K. Rowling", Bio = "The creator of the Harry Potter series." }
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

This code defines a static method `Seed` that adds some initial authors and books. EF Core includes this data in the generated migrations.

### Generate migration files

To generate migration files based on the defined models, run the following command:

```bash
dotnet ef migrations add InitialCreate
```

This command detects the `Author` and `Book` entities and generates migration files in the `Migrations` directory to create the corresponding tables in the database.

### Apply the migration

To apply the migration and create the tables in the Lakebase Postgres database, run the following command:

```bash
dotnet ef database update
```

This command runs the migration file, creates the tables, and inserts the seed data defined in the `Seed` method.

## Creating the web application

### Implement the API endpoints

The project directory has a `Program.cs` file that contains the application entry point. Replace the contents of this file with the following code:

```csharp filename="Program.cs"
using Microsoft.EntityFrameworkCore;
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

This code sets up a simple web application with two endpoints: `/authors` and `/books/[authorId]`. The `/authors` endpoint returns a list of all authors, and the `/books/[authorId]` endpoint returns the books written by the author with the specified ID.

### Test the application

To start the application, run the following command:

```bash
dotnet run
```

The terminal prints the address the server listens on, for example `http://localhost:5086`. The port can change between runs, so use the address from your terminal. Open these endpoints in your browser, or use `curl` with your address:

```bash
curl http://localhost:5086/authors
curl http://localhost:5086/books/1
```

## Applying schema changes

You'll add a new property `Country` to the `Author` entity to store the author's country of origin.

### Update the data model

Open the `Models.cs` file and add a new property to the `Author` entity:

```csharp filename="Models.cs"
public class Author
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Bio { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Country { get; set; }
}
```

Also, update the seed data entries for the `Author` model in `ModelBuilderExtensions.cs` to include the `Country` property. The rest of the `Seed` method stays the same:

```csharp filename="ModelBuilderExtensions.cs"
var authors = new[]
{
    new Author { Id = 1, Name = "J.R.R. Tolkien", Bio = "The creator of Middle-earth and author of The Lord of the Rings.", Country = "United Kingdom" },
    new Author { Id = 2, Name = "George R.R. Martin", Bio = "The author of the epic fantasy series A Song of Ice and Fire.", Country = "United States" },
    new Author { Id = 3, Name = "J.K. Rowling", Bio = "The creator of the Harry Potter series.", Country = "United Kingdom" }
};
```

### Generate and run the migration

To generate a new migration file for the schema change, run the following command in the terminal:

```bash
dotnet ef migrations add AddCountryToAuthor
```

This command detects the new `Country` property and generates a migration that adds the column to the `Authors` table. It also updates the seeded author rows with their country values. The column is non-nullable with an empty string default, so rows that existed before the migration get an empty string until you update them.

EF Core prints a warning that the migration "may result in the loss of data." This warning refers to the `Down` method, which drops the column if you roll back. The `Up` method doesn't remove data.

Now, to apply the migration, run the following command:

```bash
dotnet ef database update
```

### Test the schema change

Run the application again:

```bash
dotnet run
```

Now, if you open the `/authors` endpoint, the response includes the `Country` property:

```bash
curl http://localhost:5086/authors
```

Use the address that `dotnet run` prints if it differs from `http://localhost:5086`.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/guide-neon-entityframework" description="Run Neon database migrations in an Entity Framework project" icon="github">Migrations with Neon and Entity Framework</a>
</DetailIconCards>

## Conclusion

In this guide, you set up an Entity Framework project with a Neon database, defined data models, generated migrations, and applied them. Each schema change lives in its own migration file, so the change history stays in your project.

## Resources

For more information on the tools and concepts used in this guide, refer to the following resources:

- [Entity Framework Core Documentation](https://learn.microsoft.com/en-us/ef/core/)
- [Neon](/docs)

<NeedHelp/>

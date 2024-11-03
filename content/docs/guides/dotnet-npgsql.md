---
title: Connect a .NET (C#) application to Neon
subtitle: Set up a Neon project in seconds and connect from a .NET (C#) application
enableTableOfContents: true
updatedOn: '2024-11-02T00:00:00.000Z'
---

This guide describes how to create a Neon project and connect to it from a .NET (C#) application. We'll build a simple book library that demonstrates basic database operations using the Npgsql provider.

<Admonition type="note">
The same configuration steps can be used for any .NET application type, including ASP.NET Core Web API, MVC, Blazor, or Windows Forms applications.
</Admonition>

To connect to Neon from a .NET application:

1. [Create a Neon Project](#create-a-neon-project)
2. [Create a .NET project and add dependencies](#create-a-net-project-and-add-dependencies)
3. [Store your Neon credentials](#store-your-neon-credentials)
4. [Perform database operations](#perform-database-operations)

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a .NET project and add dependencies

1. Create a new console application and change to the newly created directory:

   ```bash
   dotnet new console -n NeonLibraryExample
   cd NeonLibraryExample
   ```

   <Admonition type="important" title="IMPORTANT">
    Ensure you install package versions that match your .NET version. You can verify your .NET version at any time by running `dotnet --version`.
   </Admonition>

2. Add the Npgsql NuGet package:

   ```bash
   dotnet add package Npgsql --version YOUR_DOTNET_VERSION
   ```

## Store your Neon credentials

1. Create or update the `appsettings.json` file in the project directory with your Neon connection string:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=your-neon-host;Database=your-database;Username=your-username;Password=your-password;SSL Mode=Require;Trust Server Certificate=true"
     }
   }
   ```

2. Add the configuration package to read the settings:

   ```bash
   dotnet add package Microsoft.Extensions.Configuration.Json --version YOUR_DOTNET_VERSION
   ```

<Admonition type="important">
To ensure the security of your data, never commit your credentials to version control. Consider using user secrets or environment variables for development, and secure vault solutions for production.
</Admonition>

## Perform database operations

### Step 1: Create table

The following code gets the connection string from `appsettings.json`, establishes a connection to your Neon database, and creates a new table for storing books. We use the `NpgsqlConnection` to open a connection and then execute a `CREATE TABLE` statement using NpgsqlCommand's `ExecuteNonQuery()` method. The table includes columns for the book's ID (automatically generated), title, author, and publication year.

```csharp
var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .Build();

string connString = configuration.GetConnectionString("DefaultConnection");

using (var conn = new NpgsqlConnection(connString))
{
    Console.Out.WriteLine("Opening connection");
    conn.Open();

    using (var command = new NpgsqlCommand(
        @"DROP TABLE IF EXISTS books;
          CREATE TABLE books (
              id SERIAL PRIMARY KEY,
              title VARCHAR(100) NOT NULL,
              author VARCHAR(100) NOT NULL,
              year_published INTEGER
          )", conn))
    {
        command.ExecuteNonQuery();
        Console.Out.WriteLine("Finished creating table");
    }
}
```

### Step 2: Add books

Next, we'll insert some books into our new table. We use an `INSERT` statement with parameters to safely add books to the database. The `ExecuteNonQuery()` method tells us how many books were added.

```csharp
using (var conn = new NpgsqlConnection(connString))
{
    Console.Out.WriteLine("Opening connection");
    conn.Open();

    using (var command = new NpgsqlCommand(
        @"INSERT INTO books (title, author, year_published)
          VALUES (@t1, @a1, @y1), (@t2, @a2, @y2)", conn))
    {
        command.Parameters.AddWithValue("t1", "The Great Gatsby");
        command.Parameters.AddWithValue("a1", "F. Scott Fitzgerald");
        command.Parameters.AddWithValue("y1", 1925);

        command.Parameters.AddWithValue("t2", "1984");
        command.Parameters.AddWithValue("a2", "George Orwell");
        command.Parameters.AddWithValue("y2", 1949);

        int nRows = command.ExecuteNonQuery();
        Console.Out.WriteLine($"Number of books added={nRows}");
    }
}
```

### Step 3: List books

To retrieve our books, we'll use a `SELECT` statement and read the results using a DataReader. The reader allows us to iterate through the results row by row, accessing each column value with the appropriate Get method based on its data type.

```csharp
using (var conn = new NpgsqlConnection(connString))
{
    Console.Out.WriteLine("Opening connection");
    conn.Open();

    using (var command = new NpgsqlCommand("SELECT * FROM books", conn))
    using (var reader = command.ExecuteReader())
    {
        while (reader.Read())
        {
            Console.WriteLine(
                $"Reading from table=({reader.GetInt32(0)}, {reader.GetString(1)}, " +
                $"{reader.GetString(2)}, {reader.GetInt32(3)})"
            );
        }
    }
}
```

### Step 4: Update books

To update books in our database, we use an `UPDATE` statement with parameters to ensure the operation is performed safely. The `ExecuteNonQuery()` method tells us how many books were updated.

```csharp
using (var conn = new NpgsqlConnection(connString))
{
    Console.Out.WriteLine("Opening connection");
    conn.Open();

    using (var command = new NpgsqlCommand(
        @"UPDATE books
          SET year_published = @year
          WHERE id = @id", conn))
    {
        command.Parameters.AddWithValue("id", 1);
        command.Parameters.AddWithValue("year", 1926);

        int nRows = command.ExecuteNonQuery();
        Console.Out.WriteLine($"Number of books updated={nRows}");
    }
}
```

### Step 5: Remove books

To delete books from our database, we use a `DELETE` statement with parameters to ensure the operation is performed safely. The `ExecuteNonQuery()` method tells us how many books were deleted.

```csharp
using(var conn = new NpgsqlConnection(connString))
{
    Console.Out.WriteLine("Opening connection");
    conn.Open();
    
    using(var command = new NpgsqlCommand("DELETE FROM books WHERE id = @id", conn))
    {
        command.Parameters.AddWithValue("id", 2);
        int nRows = command.ExecuteNonQuery();
        Console.Out.WriteLine($ "Number of books deleted={nRows}");
    }
}
```

## Best Practices

When working with Neon and .NET:

1. Always use parameterized queries to prevent SQL injection
2. Handle database exceptions appropriately
3. Dispose of connections and commands properly using `using` statements
4. Keep your queries simple and focused

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-dotnet-npgsql" description="Get started with .NET (C#) and Neon" icon="github">Get started with .NET (C#) and Neon</a>
</DetailIconCards>

## Community Guides

- [Connect an Entity Framework application to Neon](/docs/guides/dotnet-entity-framework)

## Resources

- [Npgsql Documentation](https://www.npgsql.org/doc/index.html)
- [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)

<NeedHelp/>

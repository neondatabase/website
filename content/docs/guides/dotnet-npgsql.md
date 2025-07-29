---
title: Connect a .NET (C#) application to Neon Postgres
subtitle: Learn how to run SQL queries in Neon from .NET using the Npgsql library
enableTableOfContents: true
updatedOn: '2025-07-29T10:34:33.837Z'
---

This guide describes how to create a Neon project and connect to it from a .NET (C#) application using [Npgsql](https://www.npgsql.org/), a .NET data provider for PostgreSQL.

You'll build a console application that demonstrates how to connect to your Neon database and perform basic Create, Read, Update, and Delete (CRUD) operations.

<Admonition type="note">
The same configuration steps can be used for any .NET application type, including ASP.NET Core Web API, MVC, Blazor, or Windows Forms applications.
</Admonition>

## Prerequisites

- A Neon account. If you do not have one, see [Sign up](https://console.neon.tech/signup).
- The [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later.
  > _Other versions of .NET may work, but this guide is primarily tested with .NET 8._

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1.  Navigate to the [Projects](https://console.neon.tech/app/projects) page in the [Neon Console](https://console.neon.tech).
2.  Click **New Project**.
3.  Specify your project settings and click **Create Project**.

Your project is created with a ready-to-use database named `neondb`. In the following steps, you will connect to this database from your .NET application.

## Create a .NET project

For your .NET project, you will create a project directory and add the required packages using the `dotnet` CLI.

1.  Create a new console application and change into the newly created directory.

    ```bash
    dotnet new console -o NeonLibraryExample
    cd NeonLibraryExample
    ```

    > Open this directory in your preferred code editor (e.g., VS Code, Visual Studio).

2.  Add the required NuGet packages using `dotnet add package`.
    - `Npgsql`: The .NET data provider for PostgreSQL.
    - `Microsoft.Extensions.Configuration.Json`: To read configuration from `appsettings.json`.
    - `Microsoft.Extensions.Configuration.Binder`: To bind configuration values to objects.

    ```bash
    dotnet add package Npgsql
    dotnet add package Microsoft.Extensions.Configuration.Json
    dotnet add package Microsoft.Extensions.Configuration.Binder
    ```

## Store your Neon connection string

Create a file named `appsettings.json` in your project's root directory. This is the standard .NET approach for storing configuration data like connection strings.

1.  In the [Neon Console](https://console.neon.tech), select your project on the **Dashboard**.
2.  Click **Connect** on your **Project Dashboard** to open the **Connect to your database** modal.
3.  Select **.NET** as your connection method.
    ![Connection modal](/docs/connect/dotnet_connection_details.png)
4.  Copy the **pooled** connection string, which includes your password.
5.  Create an `appsettings.json` file in your project's root directory and add the connection string to it as shown below.

    ```json title="appsettings.json"
    {
      "ConnectionStrings": {
        "DefaultConnection": "Host=your-neon-host;Database=your-database;Username=your-username;Password=your-password;SSL Mode=VerifyFull; Channel Binding=Require"
      }
    }
    ```

    > Replace `your-neon-host`, `your-database`, `your-username`, and `your-password` with the actual values from your Neon connection string.

    <Admonition type="note">
    To ensure the security of your data, never commit your credentials to version control. In a production application, consider using environment variables or a secure secrets management solution to store sensitive information like connection strings.
    </Admonition>

## Write the application code

You will now write the C# code to connect to Neon and perform database operations. All the code will be in a single file named `Program.cs` which is the entry point of your console application.

Replace the contents of your `Program.cs` file with the following code:

```csharp title="Program.cs"
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Text;

// --- 1. Read configuration and build connection string ---
var config = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .Build();

var connectionString = config.GetConnectionString("DefaultConnection");

// --- 2. Establish connection and perform CRUD operations ---
await using var conn = new NpgsqlConnection(connectionString);
try
{
    await conn.OpenAsync();
    Console.WriteLine("Connection established");

    // --- CREATE a table and INSERT data ---
    await using (var cmd = new NpgsqlCommand())
    {
        cmd.Connection = conn;

        cmd.CommandText = "DROP TABLE IF EXISTS books;";
        await cmd.ExecuteNonQueryAsync();
        Console.WriteLine("Finished dropping table (if it existed).");

        cmd.CommandText = @"
            CREATE TABLE books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255),
                publication_year INT,
                in_stock BOOLEAN DEFAULT TRUE
            );";
        await cmd.ExecuteNonQueryAsync();
        Console.WriteLine("Finished creating table.");

        cmd.CommandText = "INSERT INTO books (title, author, publication_year, in_stock) VALUES (@t1, @a1, @y1, @s1);";
        cmd.Parameters.AddWithValue("t1", "The Catcher in the Rye");
        cmd.Parameters.AddWithValue("a1", "J.D. Salinger");
        cmd.Parameters.AddWithValue("y1", 1951);
        cmd.Parameters.AddWithValue("s1", true);
        await cmd.ExecuteNonQueryAsync();
        Console.WriteLine("Inserted a single book.");
        cmd.Parameters.Clear();

        var booksToInsert = new[] {
            new { Title = "The Hobbit", Author = "J.R.R. Tolkien", Year = 1937, InStock = true },
            new { Title = "1984", Author = "George Orwell", Year = 1949, InStock = true },
            new { Title = "Dune", Author = "Frank Herbert", Year = 1965, InStock = false }
        };

        foreach (var book in booksToInsert)
        {
            cmd.CommandText = "INSERT INTO books (title, author, publication_year, in_stock) VALUES (@title, @author, @year, @in_stock);";
            cmd.Parameters.AddWithValue("title", book.Title);
            cmd.Parameters.AddWithValue("author", book.Author);
            cmd.Parameters.AddWithValue("year", book.Year);
            cmd.Parameters.AddWithValue("in_stock", book.InStock);
            await cmd.ExecuteNonQueryAsync();
            cmd.Parameters.Clear();
        }
        Console.WriteLine("Inserted 3 rows of data.");
    }

    // --- READ the initial data ---
    await ReadDataAsync(conn, "Book Library");

    // --- UPDATE data ---
    await using (var cmd = new NpgsqlCommand("UPDATE books SET in_stock = @in_stock WHERE title = @title;", conn))
    {
        cmd.Parameters.AddWithValue("in_stock", true);
        cmd.Parameters.AddWithValue("title", "Dune");
        await cmd.ExecuteNonQueryAsync();
        Console.WriteLine("Updated stock status for 'Dune'.");
    }

    // --- READ data after update ---
    await ReadDataAsync(conn, "Book Library After Update");

    // --- DELETE data ---
    await using (var cmd = new NpgsqlCommand("DELETE FROM books WHERE title = @title;", conn))
    {
        cmd.Parameters.AddWithValue("title", "1984");
        await cmd.ExecuteNonQueryAsync();
        Console.WriteLine("Deleted the book '1984' from the table.");
    }

    // --- READ data after delete ---
    await ReadDataAsync(conn, "Book Library After Delete");

}
catch (Exception e)
{
    Console.WriteLine("Connection failed.");
    Console.WriteLine(e.Message);
}

// Helper function to read data and print it to the console
async Task ReadDataAsync(NpgsqlConnection conn, string title)
{
    Console.WriteLine($"\n--- {title} ---");
    await using var cmd = new NpgsqlCommand("SELECT * FROM books ORDER BY publication_year;", conn);
    await using var reader = await cmd.ExecuteReaderAsync();

    var books = new StringBuilder();
    while (await reader.ReadAsync())
    {
        books.AppendLine(
            $"ID: {reader.GetInt32(0)}, " +
            $"Title: {reader.GetString(1)}, " +
            $"Author: {reader.GetString(2)}, " +
            $"Year: {reader.GetInt32(3)}, " +
            $"In Stock: {reader.GetBoolean(4)}"
        );
    }
    Console.WriteLine(books.ToString().TrimEnd());
    Console.WriteLine("--------------------\n");
}
```

## Examples

This section walks through the code in `Program.cs`, explaining how each part performs a specific CRUD operation.

### Create a table and insert data

This snippet connects to your database, creates a `books` table, and populates it with initial data.

```csharp
await using var conn = new NpgsqlConnection(connectionString);
await conn.OpenAsync();
Console.WriteLine("Connection established");

await using (var cmd = new NpgsqlCommand())
{
    cmd.Connection = conn;

    cmd.CommandText = "DROP TABLE IF EXISTS books;";
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("Finished dropping table (if it existed).");

    cmd.CommandText = @"
        CREATE TABLE books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255),
            publication_year INT,
            in_stock BOOLEAN DEFAULT TRUE
        );";
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("Finished creating table.");

    cmd.CommandText = "INSERT INTO books (title, author, publication_year, in_stock) VALUES (@t1, @a1, @y1, @s1);";
    cmd.Parameters.AddWithValue("t1", "The Catcher in the Rye");
    cmd.Parameters.AddWithValue("a1", "J.D. Salinger");
    cmd.Parameters.AddWithValue("y1", 1951);
    cmd.Parameters.AddWithValue("s1", true);
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("Inserted a single book.");
    cmd.Parameters.Clear();

    var booksToInsert = new[] {
        new { Title = "The Hobbit", Author = "J.R.R. Tolkien", Year = 1937, InStock = true },
        new { Title = "1984", Author = "George Orwell", Year = 1949, InStock = true },
        new { Title = "Dune", Author = "Frank Herbert", Year = 1965, InStock = false }
    };

    foreach (var book in booksToInsert)
    {
        cmd.CommandText = "INSERT INTO books (title, author, publication_year, in_stock) VALUES (@title, @author, @year, @in_stock);";
        cmd.Parameters.AddWithValue("title", book.Title);
        cmd.Parameters.AddWithValue("author", book.Author);
        cmd.Parameters.AddWithValue("year", book.Year);
        cmd.Parameters.AddWithValue("in_stock", book.InStock);
        await cmd.ExecuteNonQueryAsync();
        cmd.Parameters.Clear();
    }
    Console.WriteLine("Inserted 3 rows of data.");
}
```

In the code above, you:

- Open a connection to your Neon database asynchronously. The `await using` statement ensures the connection is properly closed and disposed of.
- Drop the `books` table if it exists to ensure a clean start.
- Create a new `books` table with columns for book details.
- Insert a single book record using a parameterized query to prevent SQL injection.
- Insert three more books by looping through a collection.

When this code runs successfully, it produces the following output:

```text title="Output"
Connection established
Finished dropping table (if it existed).
Finished creating table.
Inserted a single book.
Inserted 3 rows of data.
```

### Read data

This snippet calls a helper function, `ReadDataAsync`, to retrieve and display all the books currently in the table.

```csharp
// The helper function definition
async Task ReadDataAsync(NpgsqlConnection conn, string title)
{
    Console.WriteLine($"\n--- {title} ---");
    await using var cmd = new NpgsqlCommand("SELECT * FROM books ORDER BY publication_year;", conn);
    await using var reader = await cmd.ExecuteReaderAsync();

    var books = new StringBuilder();
    while (await reader.ReadAsync())
    {
        books.AppendLine(
            $"ID: {reader.GetInt32(0)}, " +
            $"Title: {reader.GetString(1)}, " +
            $"Author: {reader.GetString(2)}, " +
            $"Year: {reader.GetInt32(3)}, " +
            $"In Stock: {reader.GetBoolean(4)}"
        );
    }
    Console.WriteLine(books.ToString().TrimEnd());
    Console.WriteLine("--------------------\n");
}

// How the function is called
await ReadDataAsync(conn, "Book Library");
```

In the code above, you:

- Execute a SQL `SELECT` statement to fetch all rows from the `books` table, ordered by publication year.
- Use an `NpgsqlDataReader` to iterate through the result set row by row.
- Read the column values for each row and format them into a string for display.

After the initial data insert, the output is:

```text title="Output"

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: True
ID: 3, Title: 1984, Author: George Orwell, Year: 1949, In Stock: True
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: True
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: False
--------------------

```

### Update data

This snippet updates the stock status for the book 'Dune' from `false` to `true`.

```csharp
await using (var cmd = new NpgsqlCommand("UPDATE books SET in_stock = @in_stock WHERE title = @title;", conn))
{
    cmd.Parameters.AddWithValue("in_stock", true);
    cmd.Parameters.AddWithValue("title", "Dune");
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("Updated stock status for 'Dune'.");
}

// Calling ReadDataAsync again to see the result
await ReadDataAsync(conn, "Book Library After Update");
```

In the code above, you:

- Execute a SQL `UPDATE` statement with parameters to identify the row to update (`WHERE title = @title`) and the new value (`SET in_stock = @in_stock`).
- Call `ReadDataAsync` again to show that the change was successful.

The output from this operation is:

```text title="Output"
Updated stock status for 'Dune'.

--- Book Library After Update ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: True
ID: 3, Title: 1984, Author: George Orwell, Year: 1949, In Stock: True
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: True
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: True
--------------------

```

> You can see that the stock status for 'Dune' has been updated to `True`.

### Delete data

This final snippet removes the book '1984' from the `books` table.

```csharp
await using (var cmd = new NpgsqlCommand("DELETE FROM books WHERE title = @title;", conn))
{
    cmd.Parameters.AddWithValue("title", "1984");
    await cmd.ExecuteNonQueryAsync();
    Console.WriteLine("Deleted the book '1984' from the table.");
}

// Calling ReadDataAsync one last time
await ReadDataAsync(conn, "Book Library After Delete");
```

In the code above, you:

- Execute a SQL `DELETE` statement with a `WHERE` clause to target the specific book for removal.
- Call `ReadDataAsync` a final time to verify that the row was deleted.

The output from this operation is:

```text title="Output"
Deleted the book '1984' from the table.

--- Book Library After Delete ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: True
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: True
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: True
--------------------

```

> You can see that the book '1984' has been successfully removed from the table.

## Run the application

To run the entire script, execute the following command from your project directory:

```bash
dotnet run
```

This command would compile and execute your application, connecting to the Neon database and performing all the CRUD operations defined in `Program.cs` as described above. You should see output in your console similar to the examples provided in the previous sections, indicating the success of each operation.

</Steps>

## Next steps: Using an ORM or framework

While this guide demonstrates how to connect to Neon using raw SQL queries, for more advanced and maintainable data interactions in your .NET applications, consider using an Object-Relational Mapping (ORM) framework. ORMs not only let you work with data as objects but also help manage schema changes through automated migrations keeping your database structure in sync with your application models.

Explore the following resources to learn how to integrate ORMs with Neon:

- [Connect an Entity Framework application to Neon](/docs/guides/dotnet-entity-framework)

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase/examples/tree/main/with-dotnet-npgsql/NeonLibraryExample" description="Get started with .NET (C#) and Neon" icon="github">Get started with .NET (C#) and Neon</a>
</DetailIconCards>

## Resources

- [Npgsql Documentation](https://www.npgsql.org/doc/index.html)
- [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Connect an Entity Framework application to Neon](/docs/guides/dotnet-entity-framework)

<NeedHelp/>

---
title: 'PostgreSQL C#: Connecting the PostgreSQL Database'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-connect/
ogImage: ./img/wp-content-uploads-2024-05-PostgreSQL-C-Connect.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to create a sample database in PostgreSQL and how to connect to the database from a C# program using ADO.NET

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Create a sample database

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open a terminal and [connect to the PostgreSQL database server](https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/):

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It'll prompt you to enter a password for the postgres user.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, [create a new database](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/) called `elearning`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE DATABASE elearning;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, change the current database to `elearning`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\c elearning
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, [create a new role](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/) (user) with the name `ed`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE ROLE ed WITH LOGIN PASSWORD 'YourPassword';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that you need to replace the `YourPassword` with your actual password and keep it for setting up the connection string later.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fifth, [grant all privileges](https://www.postgresqltutorial.com/postgresql-administration/postgresql-grant/) of the `elearning` database to the `ed` user:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
GRANT ALL PRIVILEGES ON SCHEMA public
TO ed;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, exit the psql database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
exit
```

<!-- /wp:code -->

<!-- wp:heading -->

## Create a new C# Project

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, launch Visual Studio.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, create a Console App with the name `ELearning`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, install the following Nuget packages:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
dotnet add package Microsoft.Extensions.Configuration
dotnet add package Microsoft.Extensions.Configuration.Json
dotnet add package Npgsql
```

<!-- /wp:code -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The `Npgsql` is a .NET data provider for PostgreSQL.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `Microsoft.Extensions`.Configuration and `Microsoft.Extensions`.`Configuration.Json` are packages that manage configurations.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Fourth, create `appsettings.json` file in the project and add the `ConnnectionStrings` setting as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"json"} -->

```
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=elearning;User Id=ed;Password=YourPassword;"
  }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the `appsettings.json` file, add the connection string that connects to the local PostgreSQL server, `elearning` database using the `ed` user with your selected password.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fifth, right-click the `appsettings.json` file, choose the **Properties...** and change the **Copy to Output Directory** to **"Copy if Newer"**:

<!-- /wp:paragraph -->

<!-- wp:image {"id":9019,"sizeSlug":"full","linkDestination":"none"} -->

![PostgreSQL C# Connect](./img/wp-content-uploads-2024-05-PostgreSQL-C-Connect.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Sixth, create a new `ConfigurationHelper.cs` file and define the `ConfigurationHelper` class with the following code:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
using Microsoft.Extensions.Configuration;

public static class ConfigurationHelper
{
    private static readonly IConfiguration _configuration;

    static ConfigurationHelper()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

        _configuration = builder.Build();
    }

    public static string GetConnectionString(string name)
    {
        var connectionString = _configuration.GetConnectionString(name);
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException($"The connection string '{name}' has not been initialized.");
        }
        return connectionString;
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `ConfigurationHelper` reads the `appsettings.json` file and returns the connection string from the `GetConnectionString()` method.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Seventh, add the following code to the `Program.cs` to connect to the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
using Npgsql;

// Get the connection string
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");


// Connect to the PostgreSQL server
await using var conn = new NpgsqlConnection(connectionString);
await conn.OpenAsync();

Console.WriteLine($"The PostgreSQL version: {conn.PostgreSqlVersion}");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, run the program.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If everything is fine, you should see the PostgreSQL server version on the screen.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## How the Program.cs file works

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, import the `Npgsql` namespace that allows you to use the classes provided by `Npgsql` to interact with the PostgreSQL database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
using Npgsql;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, get the connection string by calling the `GetConnectionString` from the `ConfigurationHelper` class:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create a `NpgsqlConnection` object that represents a connection to the PostgreSQL database with the provided connection string:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var conn = new NpgsqlConnection(connectionString);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `using` statement automatically closes the database connection when it goes out of scope.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

It's important to close a connection where it is no longer needed. If you do not close it, you'll encounter a connection leak, which may crash your program.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fourth, open a connection to the PostgreSQL Server by calling the `OpenAsync()` method:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await conn.OpenAsync();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, display the PostgreSQL server version by accessing the `PostgreSqlVersion` property of the `NpgsqlConnection` object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
Console.WriteLine($"The PostgreSQL version: {conn.PostgreSqlVersion}");
```

<!-- /wp:code -->

<!-- wp:heading -->

## Data source

<!-- /wp:heading -->

<!-- wp:paragraph -->

Npgsql 7.0 or later supports a new concept called data source. The data source represents the PostgreSQL database and manages your database connections automatically.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To create a new data source, you call the Create() method of the NpgsqlDataSource class:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After having a data source, you can perform database operations such as executing a query and handling a transaction.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Typically, you create and use a single data source object through your application. Note that the data source is thread-safe.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Sometimes, you may want to deal with the database connection manually. In such cases, you can use the data source object to create a new database connection:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
await using var conn = await dataSource.OpenConnectionAsync();
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use Npgsql .NET Data Provider to interact with the PostgreSQL database.
- <!-- /wp:list-item -->

<!-- /wp:list -->

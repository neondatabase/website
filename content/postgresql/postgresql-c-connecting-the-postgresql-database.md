---
createdAt: 2024-05-19T14:56:51.000Z
title: 'PostgreSQL C#: Connecting the PostgreSQL Database'
redirectFrom: 
            - /postgresql/postgresql-csharp/postgresql-csharp-connect
ogImage: /postgresqltutorial_data/wp-content-uploads-2024-05-PostgreSQL-C-Connect.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to create a sample database in PostgreSQL and how to connect to the database from a C# program using ADO.NET

## Create a sample database

First, open a terminal and [connect to the PostgreSQL database server](/postgresql/postgresql-getting-started/connect-to-postgresql-database):

```
psql -U postgres
```

It'll prompt you to enter a password for the postgres user.

Second, [create a new database](/postgresql/postgresql-administration/postgresql-create-database) called `elearning`:

```sql
CREATE DATABASE elearning;
```

Third, change the current database to `elearning`:

```
\c elearning
```

Fourth, [create a new role](/postgresql/postgresql-administration/postgresql-roles) (user) with the name `ed`:

```sql
CREATE ROLE ed WITH LOGIN PASSWORD 'YourPassword';
```

Note that you need to replace the `YourPassword` with your actual password and keep it for setting up the connection string later.

Fifth, [grant all privileges](/postgresql/postgresql-administration/postgresql-grant) of the `elearning` database to the `ed` user:

```sql
GRANT ALL PRIVILEGES ON SCHEMA public
TO ed;
```

Finally, exit the psql database:

```
exit
```

## Create a new C# Project

First, launch Visual Studio.

Second, create a Console App with the name `ELearning`.

Third, install the following Nuget packages:

```
dotnet add package Microsoft.Extensions.Configuration
dotnet add package Microsoft.Extensions.Configuration.Json
dotnet add package Npgsql
```

- The `Npgsql` is a .NET data provider for PostgreSQL.
-
- The `Microsoft.Extensions`.Configuration and `Microsoft.Extensions`.`Configuration.Json` are packages that manage configurations.

Fourth, create `appsettings.json` file in the project and add the `ConnnectionStrings` setting as follows:

```
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=elearning;User Id=ed;Password=YourPassword;"
  }
}
```

In the `appsettings.json` file, add the connection string that connects to the local PostgreSQL server, `elearning` database using the `ed` user with your selected password.

Fifth, right-click the `appsettings.json` file, choose the **Properties...** and change the **Copy to Output Directory** to **"Copy if Newer"**:

![PostgreSQL C# Connect](/postgresqltutorial_data/wp-content-uploads-2024-05-PostgreSQL-C-Connect.png)

Sixth, create a new `ConfigurationHelper.cs` file and define the `ConfigurationHelper` class with the following code:

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

The `ConfigurationHelper` reads the `appsettings.json` file and returns the connection string from the `GetConnectionString()` method.

Seventh, add the following code to the `Program.cs` to connect to the PostgreSQL server:

```
using Npgsql;

// Get the connection string
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");


// Connect to the PostgreSQL server
await using var conn = new NpgsqlConnection(connectionString);
await conn.OpenAsync();

Console.WriteLine($"The PostgreSQL version: {conn.PostgreSqlVersion}");
```

Finally, run the program.

If everything is fine, you should see the PostgreSQL server version on the screen.

## How the Program.cs file works

First, import the `Npgsql` namespace that allows you to use the classes provided by `Npgsql` to interact with the PostgreSQL database:

```
using Npgsql;
```

Second, get the connection string by calling the `GetConnectionString` from the `ConfigurationHelper` class:

```
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```

Third, create a `NpgsqlConnection` object that represents a connection to the PostgreSQL database with the provided connection string:

```
await using var conn = new NpgsqlConnection(connectionString);
```

The `using` statement automatically closes the database connection when it goes out of scope.

It's important to close a connection where it is no longer needed. If you do not close it, you'll encounter a connection leak, which may crash your program.

Fourth, open a connection to the PostgreSQL Server by calling the `OpenAsync()` method:

```
await conn.OpenAsync();
```

Finally, display the PostgreSQL server version by accessing the `PostgreSqlVersion` property of the `NpgsqlConnection` object:

```sql
Console.WriteLine($"The PostgreSQL version: {conn.PostgreSqlVersion}");
```

## Data source

Npgsql 7.0 or later supports a new concept called data source. The data source represents the PostgreSQL database and manages your database connections automatically.

To create a new data source, you call the Create() method of the NpgsqlDataSource class:

```
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```

After having a data source, you can perform database operations such as executing a query and handling a transaction.

Typically, you create and use a single data source object through your application. Note that the data source is thread-safe.

Sometimes, you may want to deal with the database connection manually. In such cases, you can use the data source object to create a new database connection:

```
await using var conn = await dataSource.OpenConnectionAsync();
```

## Summary

- Use Npgsql .NET Data Provider to interact with the PostgreSQL database.

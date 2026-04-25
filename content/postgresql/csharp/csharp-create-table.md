---
title: 'PostgreSQL C#: Creating Tables'
page_title: 'PostgreSQL C#: Create Tables'
page_description: >-
  In this tutorial, you will learn how to create new tables in the PostgreSQL
  database from a C# program.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-create-table/
ogImage: ''
updatedOn: '2024-05-21T00:46:06+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL C#: Connecting the PostgreSQL Database'
  slug: postgresql-csharp/postgresql-csharp-connect
nextLink:
  title: 'PostgreSQL C#: Inserting data'
  slug: postgresql-csharp/postgresql-csharp-insert
---
<Admonition type="info" id="CTA">
Creating tables with Npgsql and C# works the same against any PostgreSQL database, so the patterns here carry over wherever you run Postgres. If you're an enterprise building AI-era applications, [Lakebase](https://www.databricks.com/product/lakebase) delivers managed cloud Postgres with the performance, security, and native Lakehouse integration your data teams need. If you're a developer or startup who needs to ship fast and scale without friction, [Neon](https://neon.com) is the Postgres platform built for you.
</Admonition>

**Summary**: in this tutorial, you will learn how to create new tables in the PostgreSQL database from a C\# program.

This tutorial begins where the [Connecting to the PostgreSQL database from a C\# program tutorial](postgresql-csharp-connect) left off.

## How to create tables in PostgreSQL using C\#

To create a new table in a PostgreSQL database from a C\# program, you follow these steps:

First, construct a [`CREATE TABLE`](../postgresql-tutorial/postgresql-create-table) statement:

```cs
var sql = "CREATE TABLE  ...";
```

Second, open a connection to the PostgreSQL database:

```cs
await using var conn = new NpgsqlConnection(connectionString);
await conn.OpenAsync();
```

Third, create a `NpgsqlCommand` object:

```cs
 await using var cmd = new NpgsqlCommand(sql, conn);
```

Fourth, execute the `CREATE TABLE` statement by calling the `ExecuteNonQueryAsync()` method of the command object:

```cs
await cmd.ExecuteNonQueryAsync();
```

Finally, close the database connection. Note that the `using` statement automatically closes the database connection when it goes out of scope.

## Creating new tables

The following program illustrates how to create three tables `courses`, `students`, and `enrollments` in the `elearning` database:

```cs
using Npgsql;

// Construct CREATE TABLE statements
var statements = new List<string> {@"
    CREATE TABLE courses(
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        duration INTERVAL NOT NULL,
        description TEXT
    )",

    @"CREATE TABLE students(
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(400) NOT NULL UNIQUE,
        registration_date DATE NOT NULL
    )",

    @"CREATE TABLE enrollments(
        student_id INT NOT NULL,
        course_id INT NOT NULL,
        enrolled_date DATE NOT NULL,
        PRIMARY KEY(student_id, course_id)
    )"
};

// Get the connection string
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");

try
{
    // Create a new data source
    using var dataSource =  NpgsqlDataSource.Create(connectionString);

    // Execute each CREATE TABLE statement
    foreach (var statement in statements)
    {
        await using var cmd = dataSource.CreateCommand(statement);
        await cmd.ExecuteNonQueryAsync();
    }

    Console.WriteLine("The tables have been created successfully.");

}
catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

How it works.

First, construct a list of `CREATE` `TABLE` statements:

```cs
var statements = new List<string> {
   // ...
}
```

Next, get the connection string using the `ConfigurationHelper` class:

```cs
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```

Then, create a new data source from the connection string:

```cs
using var dataSource = NpgsqlDataSource.Create(connectionString);
```

After that, iterate over the statements list and execute each statement by calling the `ExecuteNonQueryAsync()` method:

```cs
foreach (var statement in statements)
{
    await using var cmd = dataSource.CreateCommand(statement);
    await cmd.ExecuteNonQueryAsync();
}
```

Finally, use the [try\-catch](https://www.csharptutorial.net/csharp-tutorial/csharp-try-catch/) statement to catch any exceptions that may occur and display the error message:

```cs
Console.WriteLine($"Error: {ex.Message}");
```

## Verify table creation

First, open a terminal and connect to the `elearning` database using the `ed` user:

```bash
psql -U ed -d elearning
```

It’ll prompt you to enter a password for the `ed` user. Input the valid password and press Enter to connect to the PostgreSQL.

Second, run the `\dt` command to [show all tables](../postgresql-administration/postgresql-show-tables) in the `elearning` database:

```
\dt
```

Output:

```
 Schema |    Name     | Type  | Owner
--------+-------------+-------+-------
 public | courses     | table | ed
 public | enrollments | table | ed
 public | students    | table | ed
(3 rows)
```

The output indicates that the program has successfully created three tables including `courses`, `enrollments`, and `students`.

## Summary

- Call the `ExecuteNonQueryAsync()` method of the `NpgsqlCommand` to execute a `CREATE` `TABLE` statement to create a new table in the PostgreSQL database.

---
title: 'PostgreSQL C#: Creating Tables'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-create-table/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to create new tables in the PostgreSQL database from a C# program.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

This tutorial begins where the [Connecting to the PostgreSQL database from a C# program tutorial](https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-connect/) left off.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## How to create tables in PostgreSQL using C

<!-- /wp:heading -->

<!-- wp:paragraph -->

To create a new table in a PostgreSQL database from a C# program, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, construct a `CREATE TABLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var sql = "CREATE TABLE  ...";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, open a connection to the PostgreSQL database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var conn = new NpgsqlConnection(connectionString);
await conn.OpenAsync();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create a `NpgsqlCommand` object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
 await using var cmd = new NpgsqlCommand(sql, conn);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, execute the `CREATE TABLE` statement by calling the `ExecuteNonQueryAsync()` method of the command object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await cmd.ExecuteNonQueryAsync();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, close the database connection. Note that the `using` statement automatically closes the database connection when it goes out of scope.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Creating new tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following program illustrates how to create three tables `courses`, `students`, and `enrollments` in the `elearning` database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, construct a list of `CREATE` `TABLE` statements:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var statements = new List<string> {
   // ...
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Next, get the connection string using the `ConfigurationHelper` class:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Then, create a new data source from the connection string:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
using var dataSource = NpgsqlDataSource.Create(connectionString);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After that, iterate over the statements list and execute each statement by calling the `ExecuteNonQueryAsync()` method:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
foreach (var statement in statements)
{
    await using var cmd = dataSource.CreateCommand(statement);
    await cmd.ExecuteNonQueryAsync();
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, use the [try-catch](https://www.csharptutorial.net/csharp-tutorial/csharp-try-catch/) statement to catch any exceptions that may occur and display the error message:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
Console.WriteLine($"Error: {ex.Message}");
```

<!-- /wp:code -->

<!-- wp:heading -->

## Verify table creation

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open a terminal and connect to the `elearning` database using the `ed` user:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
psql -U ed -d elearning
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It'll prompt you to enter a password for the `ed` user. Input the valid password and press Enter to connect to the PostgreSQL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, run the `\dt` command to [show all tables](https://www.postgresqltutorial.com/postgresql-administration/postgresql-show-tables/) in the `elearning` database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
\dt
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
 Schema |    Name     | Type  | Owner
--------+-------------+-------+-------
 public | courses     | table | ed
 public | enrollments | table | ed
 public | students    | table | ed
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the program has successfully created three tables including `courses`, `enrollments`, and `students`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Call the `ExecuteNonQueryAsync()` method of the `NpgsqlCommand` to execute a `CREATE` `TABLE` statement to create a new table in the PostgreSQL database.
- <!-- /wp:list-item -->

<!-- /wp:list -->

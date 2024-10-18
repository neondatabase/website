---
title: 'PostgreSQL C#: Updating Data'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-update/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to update data in the PostgreSQL database using C#.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

This tutorial begins where [importing data from a CSV file into PostgreSQL tutorial](https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-import-csv-file/) is left off.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## How to update data in PostgreSQL using C

<!-- /wp:heading -->

<!-- wp:paragraph -->

To update a row from a table in a PostgreSQL database from a C# program, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, construct an `UPDATE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var sql = "UPDATE .. ";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the `UPDATE` statement, you can add parameters in the format `@parameter`. When you execute the query, you need to bind values to these parameters.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Using the parameters in the query helps you to prevent SQL injection attacks when the values come from untrusted sources such as user inputs.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, create a data source that represents the PostgreSQL database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var conn = new NpgsqlConnection(connectionString);
await conn.OpenAsync();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create a `NpgsqlCommand` object and bind one or more values to the parameters:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var cmd = new NpgsqlCommand(sql, conn);

cmd.Parameters.AddWithValue("@parameter1", value1);
cmd.Parameters.AddWithValue("@parameter2", value2);
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, execute the `UPDATE` statement by calling the `ExecuteNonQueryAsync()` method of the command object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await cmd.ExecuteNonQueryAsync();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that the `using` statement will automatically close the database connection when it is not used.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Updating data in a table

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following C# program modifies the email of the row with id 1 in the `students` table in the `elearning` database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
using Npgsql;

// Construct an UPDATE statement
var sql = @"UPDATE email = @email FROM students WHERE id= @id";

// Get the connection string
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");

try
{
    // Set up a data source
    await using var dataSource = NpgsqlDataSource.Create(connectionString);

    // Create a Command object
    await using var cmd = dataSource.CreateCommand(sql);

    // Bind parameters
    cmd.Parameters.AddWithValue("@email", "john.doe@test.com");
    cmd.Parameters.AddWithValue("@id", 1);

    // Execute the UPDATE statement
    await cmd.ExecuteNonQueryAsync();

    Console.WriteLine("The row has been updated successfully.");

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

First, construct an [UPDATE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/) statement that inserts a new row into the `students` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var sql = @"UPDATE email = @email FROM students WHERE id= @id";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

These `@email` and `@id` are the placeholders for parameters in the `UPDATE` command.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, get the connection string from the configuration using the `ConfigurationHelper` class:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create a data source that represents the PostgreSQL database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, create a new `NpgsqlCommand` object and bind the values to its parameters:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var cmd = dataSource.CreateCommand(sql);

cmd.Parameters.AddWithValue("@email", "john.doe@test.com");
cmd.Parameters.AddWithValue("@id", 1);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, execute the `UPDATE` statement by calling the `ExecuteNonQueryAsync()` method and display a success message:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await cmd.ExecuteNonQueryAsync();
Console.WriteLine("The row has been updated successfully.");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, display an error message if any exceptions occur during the update:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
// ...
catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

<!-- /wp:code -->

<!-- wp:heading -->

## Verify the update

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

Second, query data from the `students` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
SELECT * FROM students
WHERE id = 1;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
 id | first_name | last_name |       email       | registration_date
----+------------+-----------+-------------------+-------------------
  1 | John       | Doe       | john.doe@test.com | 2024-05-20
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the program has successfully updated the email of row id 1 to `john.doe@test.com`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `NpgsqlCommand` object to execute an `UPDATE` statement that updates a row into a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

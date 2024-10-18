---
title: 'PostgreSQL C#: Deleting Data'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-delete/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to delete data from a table in a PostgreSQL database from a C# program.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

This tutorial begins where [updating data in PostgreSQL using C#](https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-update/) is left off.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## How to delete data from PostgreSQL using C

<!-- /wp:heading -->

<!-- wp:paragraph -->

To delete a row from a table in a PostgreSQL database from a C# program, you use the following steps:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, construct a `DELETE` statement that deletes one or more rows from a specified table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var sql = "DELETE.. ";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the `DELETE` statement, you can use parameters in the format `@parameter`. When executing the query, you need to bind values to these parameters.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Parameterized queries can prevent SQL injection attacks, especially when the data comes from untrusted sources.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, create a data source that represents the PostgreSQL database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create a `NpgsqlCommand` object and bind one or more values to the parameters:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var cmd = dataSource.CreateCommand(sql);

cmd.Parameters.AddWithValue("@parameter1", value1);
cmd.Parameters.AddWithValue("@parameter2", value2);
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, execute the `DELETE` statement by calling the `ExecuteNonQueryAsync()` method of the command object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await cmd.ExecuteNonQueryAsync();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that the `using` statement will automatically close the database connection.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Deleting data from a table

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following C# program shows how to delete the row with id 1 from the `students` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
using Npgsql;

// Construct a DELETE statement
var sql = @"DELETE FROM students WHERE id = @id";

// Get the connection string
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
try
{

    // Create a data source
    await using var dataSource = NpgsqlDataSource.Create(connectionString);

    // Create a Command object
    await using var cmd = dataSource.CreateCommand(sql);

    // Bind parameters
    cmd.Parameters.AddWithValue("@id", 1);

    // Execute the DELETE statement
    await cmd.ExecuteNonQueryAsync();

    Console.WriteLine("The row has been deleted successfully.");

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

First, construct an `DELETE` statement that deletes a row specified by an id from the `students` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var sql = @"DELETE FROM students WHERE id = @id";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `@id` is a placeholder for the parameter in the `DELETE` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, get the connection string from the configuration:

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
cmd.Parameters.AddWithValue("@id", 1);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, execute the `DELETE` statement by calling the `ExecuteNonQueryAsync()` method and display a success message:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await cmd.ExecuteNonQueryAsync();
Console.WriteLine("The row has been deleted successfully.");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, display an error message if any exceptions occur when deleting the data:

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

## Verify the deletion

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

Second, query the row with id 1 from the `students` table:

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
 id | first_name | last_name | email | registration_date
----+------------+-----------+-------+-------------------
(0 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the program has successfully deleted the row id 1.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `NpgsqlCommand` object to execute an `DELETE` statement that deletes a row from a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

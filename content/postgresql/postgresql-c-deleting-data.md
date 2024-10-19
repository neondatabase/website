---
prevPost: /postgresql/postgresql-exp-function
nextPost: /postgresql/postgresql-administration
createdAt: 2024-05-20T08:09:13.000Z
title: 'PostgreSQL C#: Deleting Data'
redirectFrom: 
            - /postgresql/postgresql-csharp/postgresql-csharp-delete
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to delete data from a table in a PostgreSQL database from a C# program.

This tutorial begins where [updating data in PostgreSQL using C#](/postgresql/postgresql-csharp/postgresql-csharp-update) is left off.

## How to delete data from PostgreSQL using C

To delete a row from a table in a PostgreSQL database from a C# program, you use the following steps:

First, construct a `DELETE` statement that deletes one or more rows from a specified table:

```
var sql = "DELETE.. ";
```

In the `DELETE` statement, you can use parameters in the format `@parameter`. When executing the query, you need to bind values to these parameters.

Parameterized queries can prevent SQL injection attacks, especially when the data comes from untrusted sources.

Second, create a data source that represents the PostgreSQL database:

```
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```

Third, create a `NpgsqlCommand` object and bind one or more values to the parameters:

```
await using var cmd = dataSource.CreateCommand(sql);

cmd.Parameters.AddWithValue("@parameter1", value1);
cmd.Parameters.AddWithValue("@parameter2", value2);
...
```

Finally, execute the `DELETE` statement by calling the `ExecuteNonQueryAsync()` method of the command object:

```
await cmd.ExecuteNonQueryAsync();
```

Note that the `using` statement will automatically close the database connection.

## Deleting data from a table

The following C# program shows how to delete the row with id 1 from the `students` table:

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

How it works.

First, construct an `DELETE` statement that deletes a row specified by an id from the `students` table:

```
var sql = @"DELETE FROM students WHERE id = @id";
```

The `@id` is a placeholder for the parameter in the `DELETE` statement.

Second, get the connection string from the configuration:

```
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```

Third, create a data source that represents the PostgreSQL database:

```
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```

Fourth, create a new `NpgsqlCommand` object and bind the values to its parameters:

```
await using var cmd = dataSource.CreateCommand(sql);
cmd.Parameters.AddWithValue("@id", 1);
```

Fifth, execute the `DELETE` statement by calling the `ExecuteNonQueryAsync()` method and display a success message:

```
await cmd.ExecuteNonQueryAsync();
Console.WriteLine("The row has been deleted successfully.");
```

Finally, display an error message if any exceptions occur when deleting the data:

```
// ...
catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

## Verify the deletion

First, open a terminal and connect to the `elearning` database using the `ed` user:

```
psql -U ed -d elearning
```

It'll prompt you to enter a password for the `ed` user. Input the valid password and press Enter to connect to the PostgreSQL.

Second, query the row with id 1 from the `students` table:

```sql
SELECT * FROM students
WHERE id = 1;
```

Output:

```
 id | first_name | last_name | email | registration_date
----+------------+-----------+-------+-------------------
(0 rows)
```

The output indicates that the program has successfully deleted the row id 1.

## Summary

- Use the `NpgsqlCommand` object to execute an `DELETE` statement that deletes a row from a table.

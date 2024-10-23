---
title: "PostgreSQL C#: Updating Data"
page_title: "PostgreSQL C#: Updating Data"
page_description: "In this tutorial, you will learn how to update data in a table of a PostgreSQL database from a C# program."
prev_url: "https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-update/"
ogImage: ""
updatedOn: "2024-05-21T03:27:42+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL C#: Importing Data from a CSV File into a Table"
  slug: "postgresql-csharp/postgresql-csharp-import-csv-file"
nextLink: 
  title: "PostgreSQL C#: Deleting Data"
  slug: "postgresql-csharp/postgresql-csharp-delete"
---




**Summary**: in this tutorial, you will learn how to update data in the PostgreSQL database using C\#.

This tutorial begins where [importing data from a CSV file into PostgreSQL tutorial](postgresql-csharp-import-csv-file) is left off.


## How to update data in PostgreSQL using C\#

To update a row from a table in a PostgreSQL database from a C\# program, you follow these steps:

First, construct an [`UPDATE`](../postgresql-tutorial/postgresql-update) statement:


```cssql
var sql = "UPDATE .. ";
```
In the `UPDATE` statement, you can add parameters in the format `@parameter`. When you execute the query, you need to bind values to these parameters.

Using the parameters in the query helps you to prevent SQL injection attacks when the values come from untrusted sources such as user inputs.

Second, create a data source that represents the PostgreSQL database:


```cs
await using var conn = new NpgsqlConnection(connectionString);
await conn.OpenAsync();
```
Third, create a `NpgsqlCommand` object and bind one or more values to the parameters:


```cs
await using var cmd = new NpgsqlCommand(sql, conn);

cmd.Parameters.AddWithValue("@parameter1", value1);
cmd.Parameters.AddWithValue("@parameter2", value2);
...
```
Finally, execute the `UPDATE` statement by calling the `ExecuteNonQueryAsync()` method of the command object:


```cs
await cmd.ExecuteNonQueryAsync();
```
Note that the `using` statement will automatically close the database connection when it is not used.


## Updating data in a table

The following C\# program modifies the email of the row with id 1 in the `students` table in the `elearning` database:


```cs
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
    cmd.Parameters.AddWithValue("@email", "[[email protected]](../cdn-cgi/l/email-protection.html)");
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
How it works.

First, construct an [UPDATE](../postgresql-tutorial/postgresql-update) statement that inserts a new row into the `students` table:


```cs
var sql = @"UPDATE email = @email FROM students WHERE id= @id";
```
These `@email` and `@id` are the placeholders for parameters in the `UPDATE` command.

Second, get the connection string from the configuration using the `ConfigurationHelper` class:


```cs
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```
Third, create a data source that represents the PostgreSQL database:


```
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```
Fourth, create a new `NpgsqlCommand` object and bind the values to its parameters:


```cs
await using var cmd = dataSource.CreateCommand(sql);

cmd.Parameters.AddWithValue("@email", "[[email protected]](../cdn-cgi/l/email-protection.html)");
cmd.Parameters.AddWithValue("@id", 1);
```
Fifth, execute the `UPDATE` statement by calling the `ExecuteNonQueryAsync()` method and display a success message:


```cs
await cmd.ExecuteNonQueryAsync();
Console.WriteLine("The row has been updated successfully.");
```
Finally, display an error message if any exceptions occur during the update:


```cs
// ...
catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

## Verify the update

First, open a terminal and connect to the `elearning` database using the `ed` user:


```cs
psql -U ed -d elearning
```
It’ll prompt you to enter a password for the `ed` user. Input the valid password and press Enter to connect to the PostgreSQL.

Second, query data from the `students` table:


```cs
SELECT * FROM students
WHERE id = 1;
```
Output:


```cs
 id | first_name | last_name |       email       | registration_date
----+------------+-----------+-------------------+-------------------
  1 | John       | Doe       | [[email protected]](../cdn-cgi/l/email-protection.html) | 2024-05-20
(1 row)
```
The output indicates that the program has successfully updated the email of row id 1 to `[[email protected]](../cdn-cgi/l/email-protection.html)`.


## Summary

* Use the `NpgsqlCommand` object to execute an `UPDATE` statement that updates a row into a table.


---
title: 'PostgreSQL C#: Updating Data'
redirectFrom: 
            - /docs/postgresql/postgresql-csharp/postgresql-csharp-update/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to update data in the PostgreSQL database using C#.





This tutorial begins where [importing data from a CSV file into PostgreSQL tutorial](https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-import-csv-file/) is left off.





## How to update data in PostgreSQL using C





To update a row from a table in a PostgreSQL database from a C# program, you follow these steps:





First, construct an `UPDATE` statement:





```
var sql = "UPDATE .. ";
```





In the `UPDATE` statement, you can add parameters in the format `@parameter`. When you execute the query, you need to bind values to these parameters.





Using the parameters in the query helps you to prevent SQL injection attacks when the values come from untrusted sources such as user inputs.





Second, create a data source that represents the PostgreSQL database:





```
await using var conn = new NpgsqlConnection(connectionString);
await conn.OpenAsync();
```





Third, create a `NpgsqlCommand` object and bind one or more values to the parameters:





```
await using var cmd = new NpgsqlCommand(sql, conn);

cmd.Parameters.AddWithValue("@parameter1", value1);
cmd.Parameters.AddWithValue("@parameter2", value2);
...
```





Finally, execute the `UPDATE` statement by calling the `ExecuteNonQueryAsync()` method of the command object:





```
await cmd.ExecuteNonQueryAsync();
```





Note that the `using` statement will automatically close the database connection when it is not used.





## Updating data in a table





The following C# program modifies the email of the row with id 1 in the `students` table in the `elearning` database:





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





How it works.





First, construct an [UPDATE](/docs/postgresql/postgresql-update) statement that inserts a new row into the `students` table:





```
var sql = @"UPDATE email = @email FROM students WHERE id= @id";
```





These `@email` and `@id` are the placeholders for parameters in the `UPDATE` command.





Second, get the connection string from the configuration using the `ConfigurationHelper` class:





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

cmd.Parameters.AddWithValue("@email", "john.doe@test.com");
cmd.Parameters.AddWithValue("@id", 1);
```





Fifth, execute the `UPDATE` statement by calling the `ExecuteNonQueryAsync()` method and display a success message:





```
await cmd.ExecuteNonQueryAsync();
Console.WriteLine("The row has been updated successfully.");
```





Finally, display an error message if any exceptions occur during the update:





```
// ...
catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```





## Verify the update





First, open a terminal and connect to the `elearning` database using the `ed` user:





```
psql -U ed -d elearning
```





It'll prompt you to enter a password for the `ed` user. Input the valid password and press Enter to connect to the PostgreSQL.





Second, query data from the `students` table:





```
SELECT * FROM students
WHERE id = 1;
```





Output:





```
 id | first_name | last_name |       email       | registration_date
----+------------+-----------+-------------------+-------------------
  1 | John       | Doe       | john.doe@test.com | 2024-05-20
(1 row)
```





The output indicates that the program has successfully updated the email of row id 1 to `john.doe@test.com`.





## Summary





- Use the `NpgsqlCommand` object to execute an `UPDATE` statement that updates a row into a table.



---
title: "PostgreSQL C#: Call a PostgreSQL Function"
page_title: "PostgreSQL C#: Call a PostgreSQL Function"
page_description: "In this tutorial, you will learn to call a PostgreSQL function with parameters from a C# program using ADO.NET"
prev_url: "https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-call-postgresql-function/"
ogImage: ""
updatedOn: "2024-05-21T07:40:03+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL C#: Transaction"
  slug: "postgresql-csharp/postgresql-csharp-transaction"
nextLink: 
  title: "PostgreSQL C#: Call a Stored Procedure"
  slug: "postgresql-csharp/postgresql-csharp-call-a-stored-procedure"
---




**Summary**: in this tutorial, you will learn to call a PostgreSQL function from a C\# program using ADO.NET


## How to call a PostgreSQL function in C\#

Here are the steps for calling a PostgreSQL function in C\#:

First, create a data source that represents the PostgreSQL database:


```cs
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```
Second, create a new `NpgsqlCommand` object from the statement that calls a PostgreSQL function:


```cs
await using var cmd = dataSource.CreateCommand("SELECT fn(?,?)");
```
Third, optionally, bind values to the query’s parameters:


```cs
cmd.Parameters.AddWithValue(value1);
cmd.Parameters.AddWithValue(value2);
```
Fourth, execute the function call by calling the `ExecuteReaderAsync()` method of the `NpgsqlCommand` object:


```cs
await using var reader = await cmd.ExecuteReaderAsync();
```
The `ExecuteReaderAsync()` returns a `NpgsqlDataReader` object.

Finally, read the return values of the function by calling the `ReadAsync()` method of the `NpgsqlDataReader` object:


```cs
while (await reader.ReadAsync()) 
{
    var result = reader.GetInt32(0);
    // ...
}
```
We’ll create a new function in the PostgreSQL server and call it from a C\# program.


## Creating a PostgreSQL function

First, open a terminal and connect to the `elearning` database using the `ed` user:


```plaintext
psql -U ed -d elearning
```
It’ll prompt you to enter a password for the `ed` user. Input the valid password and press Enter to connect to the PostgreSQL server.

Second, create a stored procedure in PostgreSQL, which enrolls a student in a course and creates a corresponding invoice:


```pgsql
create function get_student_count(begin_date date, end_date date) 
returns int
language plpgsql as $$
declare
   student_count integer;
begin
   select count(*) 
   into student_count
   from students
   where registration_date between begin_date and end_date;
   
   return student_count;
end;
$$;
```

## Calling the PostgreSQL function in C\#

The following C\# program invokes the \`enroll\_student\_and\_create\_invoice\` function from the PostgreSQL database:


```cs
using Npgsql;

var beginDate = new DateOnly(2024, 5, 10);
var endDate = new DateOnly(2024, 5, 15);

string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");

try
{
    await using var dataSource = NpgsqlDataSource.Create(connectionString);

    await using var cmd = dataSource.CreateCommand("SELECT get_student_count($1,$2)");

    cmd.Parameters.AddWithValue(beginDate);
    cmd.Parameters.AddWithValue(endDate);

    await using var reader = await cmd.ExecuteReaderAsync();

    if (await reader.ReadAsync()) 
    { 
        var studentCount = reader.GetInt32(0);

        Console.WriteLine($"Students who registered between {beginDate} and {endDate}: {studentCount} ");
    }

}
catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```
How it works.

First, declare and initialize variables `beginDate` and `endDate` to May 10 2024 and May 15 2024:


```cs
var beginDate = new DateOnly(2024, 5, 10);
var endDate = new DateOnly(2024, 5, 15);
```
Second, get the connection string from the configuration file using the `ConfigurationHelper` class:


```cs
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```
Third, create a data source that represents the PostgreSQL database:


```cs
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```
Fourth, create a new `NpgsqlCommand` object that will execute a function call to the `get_student_count()` function:


```cs
await using var cmd = dataSource.CreateCommand("SELECT get_student_count($1,$2)");
```
Notice that `$1` and `$2` are the parameter placeholders you need to bind values when executing the command.

Fifth, bind the `beginDate` and `endDate` to the parameters of the `NpgsqlCommand` object:


```cs
cmd.Parameters.AddWithValue(beginDate);
cmd.Parameters.AddWithValue(endDate);
```
Sixth, execute the command function call:


```cs
await using var reader = await cmd.ExecuteReaderAsync();
```
Seventh, read the student count and display it in the console:


```cs
if (await reader.ReadAsync())
{
    var studentCount = reader.GetInt32(0);
    Console.WriteLine($"Students who registered between {beginDate} and {endDate}: {studentCount} ");
}
```
Finally, display the error message if any exceptions occur:


```cs
// ...
} catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

## Summary

* Call the `ExecuteReaderAsync()` method of the `NpgsqlCommand` object to execute a call to a PostgreSQL function from a C\# program.


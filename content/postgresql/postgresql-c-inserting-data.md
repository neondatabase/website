---
title: 'PostgreSQL C#: Inserting data'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-insert/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to insert data into a table in the PostgreSQL database from a C# program.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"metadata":{"name":""},"className":"note"} -->

This tutorial begins where the [Creating Tables in PostgreSQL database from a C# program tutorial](https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-create-table/) left off.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## How to insert data into PostgreSQL database using C

<!-- /wp:heading -->

<!-- wp:paragraph -->

To insert a new row into a table in a PostgreSQL database from a C# program, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, construct an `INSERT` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var sql = "INSERT INTO ...";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the SQL statement, you can have one or more parameters in the format `@parameter`. When you execute it, you can bind values to these parameters.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

This allows you to prevent SQL injection attacks if the values come from untrusted sources such as form input.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, create a new data source from the connection string:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
using var dataSource = NpgsqlDataSource.Create(connectionString);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create a `NpgsqlCommand` object from the data source with the `INSERT` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var cmd = dataSource.CreateCommand(sql);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, execute the `INSERT` statement by calling the `ExecuteNonQueryAsync()` method of the command object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await cmd.ExecuteNonQueryAsync();
```

<!-- /wp:code -->

<!-- wp:heading -->

## Inserting data into a table

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following C# program inserts a row into the `students` table in the `elearning` database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
using Npgsql;

var student = new Student("John", "Doe", "john.doe@gmail.com", new DateOnly(2024, 5, 20));


// Construct INSERT statement
var sql = @"INSERT INTO students(first_name, last_name, email, registration_date) " +
          "VALUES(@first_name,@last_name,@email,@registration_date)";

// Get the connection string
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");

try
{
    // Create a new data source
    using var dataSource = NpgsqlDataSource.Create(connectionString);

    // Create a command
    await using var cmd = dataSource.CreateCommand(sql);

    // Bind parameters
    cmd.Parameters.AddWithValue("@first_name", student.FirstName);
    cmd.Parameters.AddWithValue("@last_name", student.LastName);
    cmd.Parameters.AddWithValue("@email", student.Email);
    cmd.Parameters.AddWithValue("@registration_date", student.RegistrationDate);

    await cmd.ExecuteNonQueryAsync();

    Console.WriteLine("The row has been inserted successfully.");

}
catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}


public record Student(string FirstName, string LastName, string Email, DateOnly RegistrationDate);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, create a new [record](https://www.csharptutorial.net/csharp-tutorial/csharp-record/) called `Student` that includes the `FirstName`, `LastName`, `Email`, and `RegistrationDate` fields:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
public record Student(string FirstName, string LastName, string Email, DateOnly RegistrationDate);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, define a new instance of the `Student` record for insertion into the `students` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var student = new Student("John", "Doe", "john.doe@gmail.com", new DateOnly(2024,5,20));
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, construct an `INSERT` statement that inserts a new row into the `students` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var sql = @"INSERT INTO students(first_name, last_name, email, registration_date) " +
          "VALUES(@first_name,@last_name,@email,@registration_date)";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

These `@first_name`,`@last_name`,`@email`, and `@registration_date` are placeholders for parameters in the SQL command.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fourth, get the connection string and establish a connection to the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
// Get the connection string
 string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, create a new `NpgsqlCommand` object and bind the values to its parameters:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var cmd = new NpgsqlCommand(sql, conn);

// Bind parameters
cmd.Parameters.AddWithValue("@first_name", student.FirstName);
cmd.Parameters.AddWithValue("@last_name", student.LastName);
cmd.Parameters.AddWithValue("@email", student.Email);
cmd.Parameters.AddWithValue("@registration_date", student.RegistrationDate);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sixth, execute the `INSERT` statement by calling the `ExecuteNonQueryAsync()` method:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await cmd.ExecuteNonQueryAsync();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, display an error message if any exceptions occur during the insertion:

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

## Verify the insert

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
SELECT * FROM students;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
 id | first_name | last_name |       email        | registration_date
----+------------+-----------+--------------------+-------------------
  1 | John       | Doe       | john.doe@gmail.com | 2024-05-20
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the program has successfully inserted a new row into the `students` table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `NpgsqlCommand` object to execute an `INSERT` statement that inserts a row into a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

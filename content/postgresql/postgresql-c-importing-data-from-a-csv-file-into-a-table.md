---
title: 'PostgreSQL C#: Importing Data from a CSV File into a Table'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-import-csv-file/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to import data from a CSV file into a table in PostgreSQL using C#.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

This tutorial begins where the [Inserting data into a table in PostgreSQL tutoria](https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-insert/)l left off.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## How to import a CSV file into the PostgreSQL database using C

<!-- /wp:heading -->

<!-- wp:paragraph -->

To import data from a CSV file into a table in PostgreSQL from a C# program, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, read data from the CSV file into a list of records.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, iterate over the list and [insert each record into the table](https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-insert/).
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Importing a CSV file into PostgreSQL

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following program illustrates how to import data from `students.csv` file into the `students` table in the `elearning` database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
using CsvHelper;
using System.Globalization;
using Npgsql;

namespace ELearning;

public record Student(string FirstName, string LastName, string Email, DateOnly RegistrationDate);

public class Program
{
    public static IEnumerable<Student> ReadStudentsFromCSV(string filePath)
    {
        using var reader = new StreamReader(filePath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

        // Skip header of the csv file
        csv.Read();

        // Read the header of the csv file to map to fields
        csv.ReadHeader();

        while (csv.Read())
        {
            var firstName = csv.GetField<string>("Firstname");
            var lastName = csv.GetField<string>("Lastname");
            var email = csv.GetField<string>("Email");
            var registrationDate = csv.GetField<DateOnly>("RegistrationDate");

            yield return new Student(firstName, lastName, email, registrationDate);
        }
    }
    public static async Task Main()
    {
        var csvFilePath = @"c:\db\students.csv";

        var sql = @"INSERT INTO students(first_name, last_name, email, registration_date) " +
          "VALUES(@first_name,@last_name,@email,@registration_date)";

        string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");

        try
        {
            // Create a new data source

            await using var dataSource = NpgsqlDataSource.Create(connectionString);


            // Insert lines of CSV into the students table
            foreach (var student in ReadStudentsFromCSV(csvFilePath))
            {
                await using var cmd = dataSource.CreateCommand(sql);

                cmd.Parameters.AddWithValue("@first_name", student.FirstName);
                cmd.Parameters.AddWithValue("@last_name", student.LastName);
                cmd.Parameters.AddWithValue("@email", student.Email);
                cmd.Parameters.AddWithValue("@registration_date", student.RegistrationDate);

                await cmd.ExecuteNonQueryAsync();
            }
        }
        catch (NpgSQLException ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this program, we use an external package for reading a CSV file called `CsvHelper`. You can install the `CsvHelper` package by running the following command in the Package Manager Console:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
Install-Package CsvHelper
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To learn more details on reading data from a CSV file using the `CsvHelper` package, check out the tutorial on [how to read a CSV file in C# using the CsvHelper package](https://www.csharptutorial.net/csharp-file/csharp-read-csv-file/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that you can [download the students.csv file](https://www.postgresqltutorial.com/wp-content/uploads/2024/05/students.csv) from here.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Let's discuss how the program works.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Declaring Student record

<!-- /wp:heading -->

<!-- wp:paragraph -->

Define a `Student` [record](https://www.csharptutorial.net/csharp-tutorial/csharp-record/) that includes the following fields: `FirstName`, `LastName`, `Email`, and `RegistrationDate`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
public record Student(string FirstName, string LastName, string Email, DateOnly RegistrationDate);
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Defining ReadStudentsFromCSV() method

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ReadStudentsFromCSV()` method reads data from a CSV file specified by a `filePath` and returns an enumerable sequence of `Student` records.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
public static IEnumerable<Student> ReadStudentsFromCSV(string filePath)
{
    using var reader = new StreamReader(filePath);
    using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

    // Skip header of the csv file
    csv.Read();

    // Read the header of the csv file to map to fields
    csv.ReadHeader();

    while (csv.Read())
    {
        var firstName = csv.GetField<string>("Firstname");
        var lastName = csv.GetField<string>("Lastname");
        var email = csv.GetField<string>("Email");
        var registrationDate = csv.GetField<DateOnly>("RegistrationDate");

        yield return new Student(firstName, lastName, email, registrationDate);
    }
}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, create a `StreamReader` from the CSV file specified by the `filePath`. The `using` statement ensures that the `StreamReader` is properly closed:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
using var reader = new StreamReader(filePath);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, create a `CsvReader` to parse the CSV data. The `CultureInfo.InvariantCulture` ensures consistent parsing across different locales:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, read the heading line from a CSV file, which advances the reader to the next line in the CSV file:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
csv.Read();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, read the header row of the CSV file to map the column names to fields:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
csv.ReadHeader();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, start a loop that iterates over each line in the CSV file. The `Read()` method reads the next line from the CSV file and returns true if successful, or false if there are no more lines:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
while (csv.Read())
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sixth, retrieve the values of the columns of the CSV file:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var firstName = csv.GetField<string>("Firstname");
var lastName = csv.GetField<string>("Lastname");
var email = csv.GetField<string>("Email");
var registrationDate = csv.GetField<DateOnly>("RegistrationDate");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, return a new `Student` record for each row in the CSV file. The `yield return` returns multiple `Student` records iteratively without loading them all in memory:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
yield return new Student(firstName, lastName, email, registrationDate);
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Defining Main() method

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, declare a variable `csvFilePath` and initialize it with the path to the CSV file:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var csvFilePath = @"c:\db\students.csv";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Next, declare a variable `sql` and initialize it with an SQL `INSERT` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var sql = @"INSERT INTO students(first_name, last_name, email, registration_date) " +
          "VALUES(@first_name,@last_name,@email,@registration_date)";
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Then, get a connection string from the `appsettings.json` file using the `ConfigurationHelper` class:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After that, create a data source that represents the PostgreSQL database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, iterate over each `Student` record list returned by the `ReadStudentsFromCSV()` method and execute the `INSERT` statement to insert the new row into the `students` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
foreach(var student in ReadStudentsFromCSV(csvFilePath)) {
  await using
  var cmd = dataSource.CreateCommand(sql);

  cmd.Parameters.AddWithValue("@first_name", student.FirstName);
  cmd.Parameters.AddWithValue("@last_name", student.LastName);
  cmd.Parameters.AddWithValue("@email", student.Email);
  cmd.Parameters.AddWithValue("@registration_date", student.RegistrationDate);

  await cmd.ExecuteNonQueryAsync();
}
```

<!-- /wp:code -->

<!-- wp:heading -->

## Verify the inserts

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

<!-- wp:code -->

```
 id | first_name | last_name |            email             | registration_date
----+------------+-----------+------------------------------+-------------------
  1 | John       | Doe       | john.doe@gmail.com           | 2024-05-20
  2 | Emma       | Smith     | emma.smith@gmail.com         | 2024-05-20
  3 | Liam       | Johnson   | liam.johnson@gmail.com       | 2024-05-20
  4 | Olivia     | Williams  | olivia.williams@gmail.com    | 2024-05-20
  5 | Noah       | Brown     | noah.brown@gmail.com         | 2024-05-15
  6 | Ava        | Jones     | ava.jones@gmail.com          | 2024-05-15
  7 | William    | Garcia    | william.garcia@gmail.com     | 2024-05-15
  8 | Sophia     | Miller    | sophia.miller@gmail.com      | 2024-05-10
  9 | James      | Davis     | james.davis@gmail.com        | 2024-05-10
 10 | Isabella   | Rodriguez | isabella.rodriguez@gmail.com | 2024-05-10
 11 | Benjamin   | Martinez  | benjamin.martinez@gmail.com  | 2024-05-10
(11 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the program has successfully imported 10 rows from the the `students.csv` file into the `students` table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Utilize the `CsvHelper` package to read data from a CSV file.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Call the `ExecuteNonQueryAsync()` method of the `NpgsqlCommand` object to execute an SQL `INSERT` statement to load data from a CSV file into a table in the SQLite database.
- <!-- /wp:list-item -->

<!-- /wp:list -->

---
title: 'PostgreSQL C#: Call a Stored Procedure'
page_title: 'PostgreSQL C#: Call a PostgreSQL Stored Procedure Using C#'
page_description: 'In this tutorial, you will learn to call a PostgreSQL stored procedure from a C# program using ADO.NET'
prev_url: 'https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-call-a-stored-procedure/'
ogImage: ''
updatedOn: '2024-05-21T12:55:45+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL C#: Call a PostgreSQL Function'
  slug: 'postgresql-csharp/postgresql-csharp-call-postgresql-function'
nextLink:
  title: 'PostgreSQL Cheat Sheet'
  slug: 'postgresql-csharp/../postgresql-cheat-sheet'
---

**Summary**: in this tutorial, you will learn to call a PostgreSQL stored procedure from a C\# program using ADO.NET

## How to call a PostgreSQL stored procedure in C\#

The following are the steps for calling a PostgreSQL stored procedure in C\#:

First, create a data source that represents the PostgreSQL database:

```cssql
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```

Second, create a new `NpgsqlCommand` object from the statement that calls a stored procedure:

```cs
await using var cmd = dataSource.CreateCommand("CALL sp($1,$2)");
```

The `$1` and `$2` are placeholders for binding parameters to the stored procedure.

Third, optionally, bind values to the command:

```cs
cmd.Parameters.AddWithValue(value1);
cmd.Parameters.AddWithValue(value2);
```

Fourth, execute the stored procedure call by calling the `ExecuteNonQueryAsync()` method of the `NpgsqlCommand` object:

```cs
await using var reader = await cmd.ExecuteReaderAsync();
```

We’ll create a new stored procedure in the PostgreSQL server and call it from a C\# program.

## Creating a PostgreSQL stored procedure

First, open a terminal and connect to the `elearning` database using the `ed` user:

```plaintext
psql -U ed -d elearning
```

It’ll prompt you to enter a password for the `ed` user. Input the valid password and press Enter to connect to the PostgreSQL server.

Second, create a PostgreSQL stored procedure that enrolls a student and creates an invoice:

```pgsql
CREATE OR REPLACE PROCEDURE enroll_student(
    p_student_id INTEGER,
    p_course_id INTEGER,
    p_amount DOUBLE PRECISION,
    p_tax DOUBLE PRECISION,
    p_invoice_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN

    -- Enroll the student in the course
	INSERT INTO enrollments (student_id, course_id, enrolled_date)
    VALUES (p_student_id, p_course_id, p_invoice_date);

    -- Create a new invoice for the student
    INSERT INTO invoices (student_id, course_id, amount, tax, invoice_date)
    VALUES (p_student_id, p_course_id, p_amount, p_tax, p_invoice_date);

END;
$$;
```

## Calling the PostgreSQL stored procedure in C\#

The following C\# program invokes the `enroll_student` stored procedure from the PostgreSQL database:

```cs
using Npgsql;

var studentId = 2;
var courseId = 2;
var amount = 49.99;
var tax = 0.05;
var invoiceDate = new DateOnly(2024, 05, 20);

string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");


try
{
    await using var dataSource = NpgsqlDataSource.Create(connectionString);
    await using var cmd = dataSource.CreateCommand("CALL enroll_student($1,$2,$3,$4,$5)");

    cmd.Parameters.AddWithValue(studentId);
    cmd.Parameters.AddWithValue(courseId);
    cmd.Parameters.AddWithValue(amount);
    cmd.Parameters.AddWithValue(tax);
    cmd.Parameters.AddWithValue(invoiceDate);


    await cmd.ExecuteNonQueryAsync();
}
catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

How it works.

First, declare and initialize variables for storing the enrollment details including `studentId`, `courseId`, `amount`, `tax`, and `invoiceDate`:

```cs
var studentId = 2;
var courseId = 2;
var amount = 49.99;
var tax = 0.05;
var invoiceDate = new DateOnly(2024, 05, 20);
```

Second, get the connection string from the configuration file using the `ConfigurationHelper` class:

```cs
string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");
```

Third, create a data source that represents the PostgreSQL database:

```cs
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```

Fourth, create a new `NpgsqlCommand` object that will execute a call to the `enroll_student` stored procedure:

```cs
await using var cmd = dataSource.CreateCommand("CALL enroll_student($1,$2,$3,$4,$5)");
```

Note that `$1`, `$2`, `$3`, `$4` and `$5` are the parameter placeholders you need to bind values when executing the command.

Fifth, bind the variables to the parameters of the `NpgsqlCommand` object:

```cs
cmd.Parameters.AddWithValue(studentId);
cmd.Parameters.AddWithValue(courseId);
cmd.Parameters.AddWithValue(amount);
cmd.Parameters.AddWithValue(tax);
cmd.Parameters.AddWithValue(invoiceDate);
```

Sixth, execute the command that calls the PostgreSQL stored procedure:

```cs
await cmd.ExecuteNonQueryAsync();
```

Finally, show the error message if any exceptions occur:

```cs
// ...
} catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

## Verify the stored procedure call

First, connect to the `elearning` database using the `ed` user:

```plaintext
psql -U ed -d elearning
```

Second, retrieve data from the enrollments table:

```plaintext
SELECT * FROM enrollments;
```

Output:

```sql
 student_id | course_id | enrolled_date
------------+-----------+---------------
          2 |         1 | 2024-05-20
          2 |         2 | 2024-05-20
(2 rows)
```

Third, retrieve data from the invoices table:

```
 SELECT * FROM invoices;
```

Output:

```
 id | student_id | course_id | amount | tax  | invoice_date
----+------------+-----------+--------+------+--------------
  1 |          2 |         1 |  99.50 | 0.05 | 2024-05-20
  2 |          2 |         2 |  49.99 | 0.05 | 2024-05-20
(2 rows)
```

The output shows that the program successfully called the stored procedure `enroll_student` that inserts new rows into the `enrollments` and `invoices` tables;

## Summary

- Call the `ExecuteNonQueryAsync()` method of the `NpgsqlCommand` object to execute a call to a PostgreSQL stored procedure from a C\# program.

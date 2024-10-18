---
title: 'PostgreSQL C#: Call a Stored Procedure'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-call-a-stored-procedure/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn to call a PostgreSQL stored procedure from a C# program using ADO.NET

<!-- /wp:paragraph -->

<!-- wp:heading -->

## How to call a PostgreSQL stored procedure in C

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following are the steps for calling a PostgreSQL stored procedure in C#:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, create a data source that represents the PostgreSQL database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var dataSource = NpgsqlDataSource.Create(connectionString);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, create a new `NpgsqlCommand` object from the statement that calls a stored procedure:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var cmd = dataSource.CreateCommand("CALL sp($1,$2)");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `$1` and `$2` are placeholders for binding parameters to the stored procedure.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, optionally, bind values to the command:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
cmd.Parameters.AddWithValue(value1);
cmd.Parameters.AddWithValue(value2);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, execute the stored procedure call by calling the `ExecuteNonQueryAsync()` method of the `NpgsqlCommand` object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var reader = await cmd.ExecuteReaderAsync();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

We'll create a new stored procedure in the PostgreSQL server and call it from a C# program.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Creating a PostgreSQL stored procedure

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open a terminal and connect to the `elearning` database using the `ed` user:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
psql -U ed -d elearning
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It'll prompt you to enter a password for the `ed` user. Input the valid password and press Enter to connect to the PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, create a PostgreSQL stored procedure that enrolls a student and creates an invoice:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
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

<!-- /wp:code -->

<!-- wp:heading -->

## Calling the PostgreSQL stored procedure in C

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following C# program invokes the `enroll_student` stored procedure from the PostgreSQL database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, declare and initialize variables for storing the enrollment details including `studentId`, `courseId`, `amount`, `tax`, and `invoiceDate`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
var studentId = 2;
var courseId = 2;
var amount = 49.99;
var tax = 0.05;
var invoiceDate = new DateOnly(2024, 05, 20);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, get the connection string from the configuration file using the `ConfigurationHelper` class:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

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

Fourth, create a new `NpgsqlCommand` object that will execute a call to the `enroll_student` stored procedure:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await using var cmd = dataSource.CreateCommand("CALL enroll_student($1,$2,$3,$4,$5)");
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that `$1`, `$2`, `$3`, `$4` and `$5` are the parameter placeholders you need to bind values when executing the command.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fifth, bind the variables to the parameters of the `NpgsqlCommand` object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
cmd.Parameters.AddWithValue(studentId);
cmd.Parameters.AddWithValue(courseId);
cmd.Parameters.AddWithValue(amount);
cmd.Parameters.AddWithValue(tax);
cmd.Parameters.AddWithValue(invoiceDate);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sixth, execute the command that calls the PostgreSQL stored procedure:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
await cmd.ExecuteNonQueryAsync();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, show the error message if any exceptions occur:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"cs"} -->

```
// ...
} catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

<!-- /wp:code -->

<!-- wp:heading -->

## Verify the stored procedure call

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, connect to the `elearning` database using the `ed` user:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
psql -U ed -d elearning
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, retrieve data from the enrollments table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM enrollments;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 student_id | course_id | enrolled_date
------------+-----------+---------------
          2 |         1 | 2024-05-20
          2 |         2 | 2024-05-20
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, retrieve data from the invoices table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 SELECT * FROM invoices;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
 id | student_id | course_id | amount | tax  | invoice_date
----+------------+-----------+--------+------+--------------
  1 |          2 |         1 |  99.50 | 0.05 | 2024-05-20
  2 |          2 |         2 |  49.99 | 0.05 | 2024-05-20
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output shows that the program successfully called the stored procedure `enroll_student` that inserts new rows into the `enrollments` and `invoices` tables;

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Call the `ExecuteNonQueryAsync()` method of the `NpgsqlCommand` object to execute a call to a PostgreSQL stored procedure from a C# program.
- <!-- /wp:list-item -->

<!-- /wp:list -->

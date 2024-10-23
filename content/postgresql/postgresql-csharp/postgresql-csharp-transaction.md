---
title: 'PostgreSQL C#: Transaction'
page_title: 'PostgreSQL C#: Transaction'
page_description: 'In this tutorial, you will learn how to perform a PostgreSQL transaction using C# ADO.NET.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-csharp/postgresql-csharp-transaction/'
ogImage: ''
updatedOn: '2024-05-21T03:56:12+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL C#: Selecting Data'
  slug: 'postgresql-csharp/postgresql-csharp-select'
nextLink:
  title: 'PostgreSQL C#: Call a PostgreSQL Function'
  slug: 'postgresql-csharp/postgresql-csharp-call-postgresql-function'
---

**Summary**: in this tutorial, you will learn how to perform a transaction in PostgreSQL using C\#.

## Creating a new table

First, open a terminal and connect to the `elearning` database using the `ed` user using `psql` program:

```plaintextsql
psql -U ed -d elearning
```

Second, [create a new table](../postgresql-tutorial/postgresql-create-table) called `invoices`:

```plaintext
CREATE TABLE invoices (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    amount DEC(19,2) NOT NULL,
    tax DEC(5,2) NOT NULL,
    invoice_date DATE NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students (id) ON DELETE CASCADE,
    FOREIGN KEY(course_id) REFERENCES courses (id) ON DELETE CASCADE
);
```

Third, [insert five rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `courses` table:

```sql
INSERT INTO courses ( name, duration)
VALUES
   ('Introduction to PostgreSQL', '10 hours'),
   ('Advanced PostgreSQL Performance Tuning', '15 hours'),
   ('C# Fundamentals', '12 hours' ),
   ('Building Web Applications with C# and ASP.NET', '20 hours'),
   ('PostgreSQL for Application Developers', '18 hours')
RETURNING id, name, duration;
```

Output:

```sql
 id |                     name                      | duration
----+-----------------------------------------------+----------
  1 | Introduction to PostgreSQL                    | 10:00:00
  2 | Advanced PostgreSQL Performance Tuning        | 15:00:00
  3 | C# Fundamentals                               | 12:00:00
  4 | Building Web Applications with C# and ASP.NET | 20:00:00
  5 | PostgreSQL for Application Developers         | 18:00:00
(5 rows)
```

Finally, exit the psql program:

```cs
exit
```

## Perform a transaction

The following program illustrates how to enroll a student in a course and create an invoice for the enrollment within a transaction:

```cs
using Npgsql;

var studentId = 2;
var courseId = 1;
var amount = 99.5;
var tax = 0.05;
var invoiceDate = new DateOnly(2024, 05, 20);

string connectionString = ConfigurationHelper.GetConnectionString("DefaultConnection");

try
{
    // Create a new database source
    await using var dataSource = NpgsqlDataSource.Create(connectionString);


    // Open a connection to the PostgreSQL server
    await using var conn = await dataSource.OpenConnectionAsync();

    // Start the transaction
    await using var tx = await conn.BeginTransactionAsync();

    try
    {
        // Enroll student id 2 with the course id 1
        var sql = "INSERT INTO enrollments (student_id, course_id, enrolled_date) " +
            "VALUES (@student_id,@course_id, @enrolled_date)";

        await using var cmd1 = new NpgsqlCommand(sql, conn,tx)
        {
            Parameters =
            {
                new("@student_id", studentId),
                new("@course_id", courseId),
                new("@enrolled_date", invoiceDate),
            }
        };
        await cmd1.ExecuteNonQueryAsync();

        // Create a new invoice
        sql = "INSERT INTO invoices(student_id, course_id, amount, tax, invoice_date) " +
            "VALUES(@student_id, @course_id, @amount, @tax, @invoice_date)";

        await using var cmd2 = new NpgsqlCommand(sql, conn, tx)
        {
            Parameters =
            {
                new("@student_id", studentId),
                new("@course_id", courseId),
                new("@amount", amount),
                new("@tax", tax),
                new("@invoice_date", invoiceDate),
            }
        };
        await cmd2.ExecuteNonQueryAsync();

        // Commit the transaction
        await tx.CommitAsync();
    }
    catch (NpgsqlException ex)
    {
        Console.WriteLine($"Error: {ex.Message}");

        // Roll back the transaction
        await tx.RollbackAsync();
    }

}
catch (NpgsqlException ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

## Verify the transaction

First, open a terminal and connect to the `elearning` database using the `ed` user:

```cs
psql -U ed -d elearning
```

It’ll prompt you to enter a password for the `ed` user. Input the valid password and press Enter to connect to the PostgreSQL.

Second, retrieve data from the `enrollments` table:

```cs
SELECT * FROM enrollments;
```

Output:

```sql
 student_id | course_id | enrolled_date
------------+-----------+---------------
          2 |         1 | 2024-05-20
(1 row)
```

Third, retrieve data from the `invoices` table:

```cs
SELECT * FROM invoices;
```

Output:

```
 id | student_id | course_id | amount | tax  | invoice_date
----+------------+-----------+--------+------+--------------
  1 |          2 |         1 |  99.50 | 0.05 | 2024-05-20
(1 row)
```

## Summary

- Call the `BeginTransactionAsync()` method of the `NpgsqlConnection` object to start a transaction.
- Call the `CommitAsync()` method of the `NpgsqlTransaction` object to apply the changes since the transaction started to the database permanently.
- Call the `RollbackAsync()` method of the `NpgsqlTransaction` object to roll back the changes.

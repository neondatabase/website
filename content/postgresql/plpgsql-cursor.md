---
modifiedAt: 2024-03-22 07:04:21
prevPost: postgresql-backup
nextPost: postgresql-to_number-function
createdAt: 2015-09-20T04:17:53.000Z
title: 'PL/pgSQL Cursor'
redirectFrom: 
            - /postgresql/postgresql-plpgsql/plpgsql-cursor
ogImage: /postgresqltutorial_data/wp-content-uploads-2015-09-plpgsql-cursor.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about the PL/pgSQL Cursors and how to use them to process a result set, row by row.

## Introduction to PL/pgSQL Cursor

In PostgreSQL, a cursor is a database object that allows you to traverse the result set of a query one row at a time.

Cursors can be useful when you deal with large result sets or when you need to process rows sequentially.

The following diagram illustrates how to use a cursor in PostgreSQL:

![PL/pgSQL Cursor](/postgresqltutorial_data/wp-content-uploads-2015-09-plpgsql-cursor.png)

1.
2. First, declare a cursor.
3.
4.
5.
6. Next, open the cursor.
7.
8.
9.
10. Then, fetch rows from the result set into a record or a variable list.
11.
12.
13.
14. After that, process the fetched row and exit the loop if there is no more row to fetch.
15.
16.
17.
18. Finally, close the cursor.
19.

We will examine each step in more detail in the following sections.

### Step 1. Declaring a cursor

To declare a cursor, you use the `DECLARE` statement. Here's the syntax for declaring a cursor:

```sql
DECLARE cursor_name CURSOR FOR query;
```

In this syntax:

- First, specify the name of the cursor (`cursor_name`) after the `DECLARE` keyword.
-
- Second, provide a `query` that defines the result set of the cursor.

### Step 2. Opening the cursor

After declaring a cursor, you need to open it using the `OPEN` statement:

```sql
OPEN cursor_name;
```

### Step 3. Fetching rows from the cursor

Once the cursor is open, you can fetch rows from it using the `FETCH` statement. PostgreSQL offers different ways to fetch rows:

- FETCH NEXT: fetches the next row from the cursor.
-
- FETCH PRIOR: fetches the previous row from the cursor.
-
- FETCH FIRST: fetches the first row from the cursor.
-
- FETCH LAST: fetches the last row from the cursor.
-
- FETCH ALL: fetches all rows from the cursor.

In practice, you often use the `FETCH NEXT` that fetches the next row from a cursor:

```sql
FETCH NEXT FROM cursor_name INTO variable_list;
```

In this syntax:

- `cursor_name` specifies the name of the cursor.
-
- `variable_list`: is a comma-separated list of variables that store the values fetched from the cursor. It also can be a record.

### Step 4. Processing rows

After fetching a row, you can process it. Typically, you use a [LOOP](/postgresql/postgresql-plpgsql/plpgsql-loop-statements) statement to process the rows fetched from the cursor:

```sql
LOOP
    -- Fetch the next row
    FETCH NEXT FROM cursor_name INTO variable_list;

    -- exit if not found
    EXIT WHEN NOT FOUND;

    -- Process the fetched row
    ...

END LOOP;
```

### Step 5. Closing the cursor

Once completing fetching rows, you need to close the cursor using the `CLOSE` statement:

```sql
CLOSE cursor_name;
```

The `CLOSE` statement releases the resources and frees up the cursor variable, allowing it to be opened again using the `OPEN` statement.

## PL/pgSQL cursor example

The following example illustrates how to use a cursor to traverse the rows from the film table in the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database):

```sql
CREATE OR REPLACE FUNCTION fetch_film_titles_and_years(
   OUT p_title VARCHAR(255),
   OUT p_release_year INTEGER
)
RETURNS SETOF RECORD AS
$$
DECLARE
    film_cursor CURSOR FOR
        SELECT title, release_year
        FROM film;
    film_record RECORD;
BEGIN
    -- Open cursor
    OPEN film_cursor;

    -- Fetch rows and return
    LOOP
        FETCH NEXT FROM film_cursor INTO film_record;
        EXIT WHEN NOT FOUND;

        p_title = film_record.title;
        p_release_year = film_record.release_year;
        RETURN NEXT;
    END LOOP;

    -- Close cursor
    CLOSE film_cursor;
END;
$$
LANGUAGE PLPGSQL;
```

The following shows how to call the `fetch_film_titles_and_years()` function:

```sql
SELECT * FROM fetch_film_titles_and_years();
```

Output:

```
           p_title           | p_release_year
-----------------------------+----------------
 Chamber Italian             |           2006
 Grosse Wonderful            |           2006
 Airport Pollock             |           2006
 Bright Encounters           |           2006
...
```

## Summary

- A cursor is a database object that allows you to traverse the rows of a result of a query one by one.

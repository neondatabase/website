---
title: 'PL/pgSQL Cursor'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-cursor/
ogImage: ./img/wp-content-uploads-2015-09-plpgsql-cursor.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PL/pgSQL Cursors and how to use them to process a result set, row by row.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PL/pgSQL Cursor

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a cursor is a database object that allows you to traverse the result set of a query one row at a time.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Cursors can be useful when you deal with large result sets or when you need to process rows sequentially.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following diagram illustrates how to use a cursor in PostgreSQL:

<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":1409} -->

![PL/pgSQL Cursor](./img/wp-content-uploads-2015-09-plpgsql-cursor.png)

<!-- /wp:image -->

<!-- wp:list {"ordered":true} -->

1. <!-- wp:list-item -->
2. First, declare a cursor.
3. <!-- /wp:list-item -->
4.
5. <!-- wp:list-item -->
6. Next, open the cursor.
7. <!-- /wp:list-item -->
8.
9. <!-- wp:list-item -->
10. Then, fetch rows from the result set into a record or a variable list.
11. <!-- /wp:list-item -->
12.
13. <!-- wp:list-item -->
14. After that, process the fetched row and exit the loop if there is no more row to fetch.
15. <!-- /wp:list-item -->
16.
17. <!-- wp:list-item -->
18. Finally, close the cursor.
19. <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

We will examine each step in more detail in the following sections.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Step 1. Declaring a cursor

<!-- /wp:heading -->

<!-- wp:paragraph -->

To declare a cursor, you use the `DECLARE` statement. Here's the syntax for declaring a cursor:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
DECLARE cursor_name CURSOR FOR query;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the cursor (`cursor_name`) after the `DECLARE` keyword.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, provide a `query` that defines the result set of the cursor.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading {"level":3} -->

### Step 2. Opening the cursor

<!-- /wp:heading -->

<!-- wp:paragraph -->

After declaring a cursor, you need to open it using the `OPEN` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
OPEN cursor_name;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Step 3. Fetching rows from the cursor

<!-- /wp:heading -->

<!-- wp:paragraph -->

Once the cursor is open, you can fetch rows from it using the `FETCH` statement. PostgreSQL offers different ways to fetch rows:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- FETCH NEXT: fetches the next row from the cursor.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- FETCH PRIOR: fetches the previous row from the cursor.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- FETCH FIRST: fetches the first row from the cursor.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- FETCH LAST: fetches the last row from the cursor.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- FETCH ALL: fetches all rows from the cursor.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

In practice, you often use the `FETCH NEXT` that fetches the next row from a cursor:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
FETCH NEXT FROM cursor_name INTO variable_list;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `cursor_name` specifies the name of the cursor.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `variable_list`: is a comma-separated list of variables that store the values fetched from the cursor. It also can be a record.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading {"level":3} -->

### Step 4. Processing rows

<!-- /wp:heading -->

<!-- wp:paragraph -->

After fetching a row, you can process it. Typically, you use a [LOOP](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-loop-statements/) statement to process the rows fetched from the cursor:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
LOOP
    -- Fetch the next row
    FETCH NEXT FROM cursor_name INTO variable_list;

    -- exit if not found
    EXIT WHEN NOT FOUND;

    -- Process the fetched row
    ...

END LOOP;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Step 5. Closing the cursor

<!-- /wp:heading -->

<!-- wp:paragraph -->

Once completing fetching rows, you need to close the cursor using the `CLOSE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CLOSE cursor_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `CLOSE` statement releases the resources and frees up the cursor variable, allowing it to be opened again using the `OPEN` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PL/pgSQL cursor example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example illustrates how to use a cursor to traverse the rows from the film table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

The following shows how to call the `fetch_film_titles_and_years()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT * FROM fetch_film_titles_and_years();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
           p_title           | p_release_year
-----------------------------+----------------
 Chamber Italian             |           2006
 Grosse Wonderful            |           2006
 Airport Pollock             |           2006
 Bright Encounters           |           2006
...
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- A cursor is a database object that allows you to traverse the rows of a result of a query one by one.
- <!-- /wp:list-item -->

<!-- /wp:list -->

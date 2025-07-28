---
title: Connect a Python application to Neon Postgres
subtitle: Connect to a Neon database using Python with the psycopg2 or asyncpg libraries to run INSERT, SELECT, UPDATE, and DELETE statements.
enableTableOfContents: true
updatedOn: '2025-07-22T14:51:02.373Z'
---

This guide describes how to create a Neon project and connect to it from a Python application using popular Postgres drivers like [Psycopg (psycopg2)](https://pypi.org/project/psycopg2-binary/), a synchronous database adapter, and [asyncpg](https://pypi.org/project/asyncpg/), an asynchronous adapter for use with `asyncio`.

You'll learn how to connect to your Neon database from a Python application and perform basic Create, Read, Update, and Delete (CRUD) operations.

## Prerequisites

- A Neon account. If you do not have one, see [Sign up](https://console.neon.tech/signup).
- Python 3.8 or later. If you do not have Python installed, install it from the [Python website](https://www.python.org/downloads/).

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1.  Navigate to the [Projects](https://console.neon.tech/app/projects) page in the [Neon Console](https://console.neon.tech).
2.  Click **New Project**.
3.  Specify your project settings and click **Create Project**.

Your project is created with a ready-to-use database named `neondb`. In the following steps, you will connect to this database from your Python application.

## Create a Python project

For your Python project, create a project directory, set up a virtual environment, and install the required libraries.

1.  Create a project directory and change into it.

    ```bash
    mkdir neon-python-quickstart
    cd neon-python-quickstart
    ```

    > Open the directory in your preferred code editor (e.g., VS Code, PyCharm).

2.  Create and activate a Python virtual environment. This isolates your project's dependencies from your system's Python environment.

    <CodeTabs labels={["MacOS / Linux / Windows Subsystem for Linux (WSL)", "Windows"]}>

    ```bash
    # Create a virtual environment
    python3 -m venv venv

    # Activate the virtual environment
    source venv/bin/activate
    ```

    ```bash
    # Create a virtual environment
    python -m venv venv

    # Activate the virtual environment
    .\venv\Scripts\activate
    ```

    </CodeTabs>

3.  Install the required libraries using `pip`.
    - `psycopg2-binary`: The synchronous database adapter for connecting to Postgres.
    - `asyncpg`: The asynchronous database adapter for connecting to Postgres.
    - `python-dotenv`: A helper library to manage environment variables.

    ```bash
    pip install psycopg2-binary asyncpg python-dotenv
    ```

    > Install either `psycopg2-binary` or `asyncpg`, depending on whether you want to use synchronous or asynchronous code.

## Store your Neon connection string

Create a file named `.env` in your project's root directory. This file will securely store your database connection string.

1.  In the [Neon Console](https://console.neon.tech), select your project on the **Dashboard**.
2.  Click **Connect** on your **Project Dashboard** to open the **Connect to your database** modal.
    ![Connection modal](/docs/connect/connection_details.png)
3.  Copy the connection string, which includes your password.
4.  Add the connection string to your `.env` file as shown below.
    ```text
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
    ```
    > Replace `[user]`, `[password]`, `[neon_hostname]`, and `[dbname]` with your actual database credentials.

## Examples

This section provides example Python scripts that demonstrate how to connect to your Neon database and perform basic operations such as [creating a table](#create-a-table-and-insert-data), [reading data](#read-data), [updating data](#update-data), and [deleting data](#delete-data).

### Create a table and insert data

In your project directory, create a file named `create_table.py` and add the code for your preferred library. This script connects to your Neon database, creates a table named `books`, and inserts some sample data into it.

<CodeTabs labels={["psycopg2", "asyncpg"]}>

```python title="create_table.py"
import os

import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the connection string from the environment variable
conn_string = os.getenv("DATABASE_URL")
conn = None

try:
    with psycopg2.connect(conn_string) as conn:
        print("Connection established")

        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            # Drop the table if it already exists
            cur.execute("DROP TABLE IF EXISTS books;")
            print("Finished dropping table (if it existed).")

            # Create a new table
            cur.execute("""
                CREATE TABLE books (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    author VARCHAR(255),
                    publication_year INT,
                    in_stock BOOLEAN DEFAULT TRUE
                );
            """)
            print("Finished creating table.")

            # Insert a single book record
            cur.execute(
                "INSERT INTO books (title, author, publication_year, in_stock) VALUES (%s, %s, %s, %s);",
                ("The Catcher in the Rye", "J.D. Salinger", 1951, True),
            )
            print("Inserted a single book.")

            # Data to be inserted
            books_to_insert = [
                ("The Hobbit", "J.R.R. Tolkien", 1937, True),
                ("1984", "George Orwell", 1949, True),
                ("Dune", "Frank Herbert", 1965, False),
            ]

            # Insert multiple books at once
            cur.executemany(
                "INSERT INTO books (title, author, publication_year, in_stock) VALUES (%s, %s, %s, %s);",
                books_to_insert,
            )

            print("Inserted 3 rows of data.")

            # Commit the changes to the database
            conn.commit()

except Exception as e:
    print("Connection failed.")
    print(e)
```

```python title="create_table.py"
import asyncio
import os

import asyncpg
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

async def run():
    # Get the connection string from the environment variable
    conn_string = os.getenv("DATABASE_URL")
    conn = None

    try:
        conn = await asyncpg.connect(conn_string)
        print("Connection established")

        # Drop the table if it already exists
        await conn.execute("DROP TABLE IF EXISTS books;")
        print("Finished dropping table (if it existed).")

        # Create a new table
        await conn.execute("""
            CREATE TABLE books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255),
                publication_year INT,
                in_stock BOOLEAN DEFAULT TRUE
            );
        """)
        print("Finished creating table.")

        # Insert a single book record (using $1, $2 for placeholders)
        await conn.execute(
            "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4);",
            "The Catcher in the Rye",
            "J.D. Salinger",
            1951,
            True,
        )
        print("Inserted a single book.")

        # Data to be inserted
        books_to_insert = [
            ("The Hobbit", "J.R.R. Tolkien", 1937, True),
            ("1984", "George Orwell", 1949, True),
            ("Dune", "Frank Herbert", 1965, False),
        ]

        # Insert multiple books at once
        await conn.executemany(
            "INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4);",
            books_to_insert,
        )
        print("Inserted 3 rows of data.")

    except Exception as e:
        print("Connection failed.")
        print(e)
    finally:
        if conn:
            await conn.close()

# Run the asynchronous function
asyncio.run(run())
```

</CodeTabs>

The above code does the following:

- Load the connection string from the `.env` file.
- Connect to the Neon database.
- Drop the `books` table if it already exists to ensure a clean slate.
- Create a table named `books` with columns for `id`, `title`, `author`, `publication_year`, and `in_stock`.
- Insert a single book record.
- Insert multiple book records.
- Commit the changes to the database.

Run the script using the following command:

```bash
python create_table.py
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established
Finished dropping table (if it existed).
Finished creating table.
Inserted a single book.
Inserted 3 rows of data.
```

### Read data

In your project directory, create a file named `read_data.py`. This script connects to your Neon database and retrieves all rows from the `books` table.

<CodeTabs labels={["psycopg2", "asyncpg"]}>

```python title="read_data.py"
import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()

conn_string = os.getenv("DATABASE_URL")
conn = None

try:
    with psycopg2.connect(conn_string) as conn:
        print("Connection established")
        with conn.cursor() as cur:
            # Fetch all rows from the books table
            cur.execute("SELECT * FROM books ORDER BY publication_year;")
            rows = cur.fetchall()

            print("\n--- Book Library ---")
            for row in rows:
                print(
                    f"ID: {row[0]}, Title: {row[1]}, Author: {row[2]}, Year: {row[3]}, In Stock: {row[4]}"
                )
            print("--------------------\n")

except Exception as e:
    print("Connection failed.")
    print(e)
```

```python title="read_data.py"
import asyncio
import os

import asyncpg
from dotenv import load_dotenv

load_dotenv()

async def run():
    conn_string = os.getenv("DATABASE_URL")
    conn = None

    try:
        conn = await asyncpg.connect(conn_string)
        print("Connection established")

        # Fetch all rows from the books table
        rows = await conn.fetch("SELECT * FROM books ORDER BY publication_year;")

        print("\n--- Book Library ---")
        for row in rows:
            # asyncpg rows can be accessed by index or column name
            print(
                f"ID: {row['id']}, Title: {row['title']}, Author: {row['author']}, Year: {row['publication_year']}, In Stock: {row['in_stock']}"
            )
        print("--------------------\n")

    except Exception as e:
        print("Connection failed.")
        print(e)
    finally:
        if conn:
            await conn.close()

asyncio.run(run())
```

</CodeTabs>

The above code does the following:

- Load the connection string from the `.env` file.
- Connect to the Neon database.
- Use a SQL `SELECT` statement to fetch all rows from the `books` table, ordered by `publication_year`.
- Print each book's details in a formatted output.

Run the script using the following command:

```bash
python read_data.py
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: True
ID: 3, Title: 1984, Author: George Orwell, Year: 1949, In Stock: True
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: True
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: False
--------------------
```

### Update data

In your project directory, create a file named `update_data.py`. This script connects to your Neon database and updates the stock status of the book 'Dune' to `True`.

<CodeTabs labels={["psycopg2", "asyncpg"]}>

```python title="update_data.py"
import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()
conn_string = os.getenv("DATABASE_URL")
conn = None

try:
    with psycopg2.connect(conn_string) as conn:
        print("Connection established")
        with conn.cursor() as cur:
            # Update a data row in the table
            cur.execute(
                "UPDATE books SET in_stock = %s WHERE title = %s;", (True, "Dune")
            )
            print("Updated stock status for 'Dune'.")

            # Commit the changes
            conn.commit()

except Exception as e:
    print("Connection failed.")
    print(e)
```

```python title="update_data.py"
import asyncio
import os

import asyncpg
from dotenv import load_dotenv

load_dotenv()

async def run():
    conn_string = os.getenv("DATABASE_URL")
    conn = None
    try:
        conn = await asyncpg.connect(conn_string)
        print("Connection established")

        # Update a data row in the table
        await conn.execute(
            "UPDATE books SET in_stock = $1 WHERE title = $2;", True, "Dune"
        )
        print("Updated stock status for 'Dune'.")

    except Exception as e:
        print("Connection failed.")
        print(e)
    finally:
        if conn:
            await conn.close()

asyncio.run(run())
```

</CodeTabs>

The above code does the following:

- Load the connection string from the `.env` file.
- Connect to the Neon database.
- Use a SQL `UPDATE` statement to change the `in_stock` status of the book 'Dune' to `True`.
- Commit the changes to the database.

Run the script using the following command:

```bash
python update_data.py
```

After running this script, you can run `read_data.py` again to verify that the row was updated.

```bash
python read_data.py
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: True
ID: 3, Title: 1984, Author: George Orwell, Year: 1949, In Stock: True
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: True
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: True
--------------------
```

> You can see that the stock status for 'Dune' has been updated to `True`.

### Delete data

In your project directory, create a file named `delete_data.py`. This script connects to your Neon database and deletes the book '1984' from the `books` table.

<CodeTabs labels={["psycopg2", "asyncpg"]}>

```python title="delete_data.py"
import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()
conn_string = os.getenv("DATABASE_URL")
conn = None

try:
    with psycopg2.connect(conn_string) as conn:
        print("Connection established")
        with conn.cursor() as cur:
            # Delete a data row from the table
            cur.execute("DELETE FROM books WHERE title = %s;", ("1984",))
            print("Deleted the book '1984' from the table.")

            # Commit the changes
            conn.commit()

except Exception as e:
    print("Connection failed.")
    print(e)
```

```python title="delete_data.py"
import asyncio
import os

import asyncpg
from dotenv import load_dotenv

load_dotenv()

async def run():
    conn_string = os.getenv("DATABASE_URL")
    conn = None
    try:
        conn = await asyncpg.connect(conn_string)
        print("Connection established")

        # Delete a data row from the table
        await conn.execute("DELETE FROM books WHERE title = $1;", "1984")
        print("Deleted the book '1984' from the table.")

    except Exception as e:
        print("Connection failed.")
        print(e)
    finally:
        if conn:
            await conn.close()

asyncio.run(run())
```

</CodeTabs>

The above code does the following:

- Load the connection string from the `.env` file.
- Connect to the Neon database.
- Use a SQL `DELETE` statement to remove the book '1984' from the `books` table.
- Commit the changes to the database.

Run the script using the following command:

```bash
python delete_data.py
```

After running this script, you can run `read_data.py` again to verify that the row was deleted.

```bash
python read_data.py
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: True
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: True
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: True
--------------------
```

> You can see that the book '1984' has been successfully deleted from the `books` table.

</Steps>

## Next steps: Using an ORM or framework

While this guide demonstrates how to connect to Neon using raw SQL queries, for more advanced and maintainable data interactions in your Python applications, consider using an Object-Relational Mapping (ORM) framework. ORMs not only let you work with data as objects but also help manage schema changes through automated migrations keeping your database structure in sync with your application models.

Explore the following resources to learn how to integrate ORMs with Neon:

- [Connect an SQLAlchemy application to Neon](/docs/guides/sqlalchemy)
- [Connect a Django application to Neon](/docs/guides/django)

## Source code

You can find the source code for the applications described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-python-psycopg2" description="Get started with Python and Neon using psycopg2" icon="github">Get started with Python and Neon using psycopg2</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-python-asyncpg" description="Get started with Python and Neon using asyncpg" icon="github">Get started with Python and Neon using asyncpg</a>

</DetailIconCards>

## Resources

- [Psycopg2 documentation](https://www.psycopg.org/docs/)
- [Asyncpg documentation](https://magicstack.github.io/asyncpg/current/)
- [Building an API with Django, Django REST Framework, and Neon Postgres](/guides/django-rest-api)

<NeedHelp/>

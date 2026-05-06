---
title: Connect a Tortoise ORM application to Neon
subtitle: Set up a Neon project in seconds and connect from a Python async application
summary: >-
  How to connect an asynchronous Python application to a Neon project using Tortoise ORM, the asycnpg driver.
enableTableOfContents: true
updatedOn: '2026-05-04T22:07:33.000Z'
---

<CopyPrompt src="/prompts/tortoise-orm-prompt.md" 
description="Pre-built prompt for connecting Tortoise ORM applications to Neon Postgres"/>

[Tortoise ORM](https://tortoise.github.io/) is an easy-to-use `asyncio` Object Relational Mapper (ORM) inspired by Django. It is designed specifically for asynchronous Python applications, making it a great choice for building efficient, non-blocking database interactions in frameworks like FastAPI, Starlette, or any custom async application.

In this guide, you’ll learn how to set up a Neon project and connect to it using Tortoise ORM with the `asyncpg` driver.

## Prerequisites

To complete the steps in this guide, ensure that you have Python 3.10+ installed. If you do not have Python installed, refer to the [official Python website](https://www.python.org/downloads/) for installation instructions.

To connect to Neon from Tortoise ORM:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details, including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create**.

## Set up your Python project

Create a new directory for your project and navigate into it:

```bash
mkdir tortoise-neon-demo
cd tortoise-neon-demo
```

Optionally, create and activate a virtual environment to manage your dependencies:

<Admonition type="tip" title="Why use a virtual environment?">
Using a virtual environment allows you to manage dependencies for your project in isolation, preventing conflicts with other Python projects on your system. It also makes it easier to maintain and share your project with others.
</Admonition>

```bash
python3 -m venv venv
source venv/bin/activate   # macOS / Linux
# venv\Scripts\activate    # Windows
```

## Install dependencies

Install Tortoise ORM, the `asyncpg` Postgres driver, and `python-dotenv` to manage environment variables securely. Tortoise provides a handy extra requirement flag to install `asyncpg` automatically.

Run the following command inside your virtual environment:

```shell
pip install "tortoise-orm[asyncpg]" python-dotenv
```

## Get your connection string

Find your database connection string by clicking the **Connect** button on your **Project Dashboard** to open the **Connect to your database** modal. Check the **Parameters only** option, which provides the individual components of the connection string that you will use to construct a connection URL.
![Connection details modal](/docs/connect/connection_details_parameters_only.png)

Create a `.env` file in your project's root directory and add a `DATABASE_URL` variable with the following format:

```text shouldWrap
DATABASE_URL="postgres://[PGUSER]:[PGPASSWORD]@[PGHOST]/[PGDATABASE]?ssl=true"
```

> Replace the placeholders `[PGUSER]`, `[PGPASSWORD]`, `[PGHOST]`, and `[PGDATABASE]` with the corresponding values from your Neon connection details. Make sure to include `ssl=true` to ensure a secure connection.

## Create the application

Create a file named `main.py` and add the following code. This script initializes Tortoise ORM, creates a simple `User` schema in your Neon database, inserts a record, and queries it back.

```python
import os
from dotenv import load_dotenv
from tortoise import Tortoise, fields, run_async
from tortoise.models import Model

load_dotenv()

# 1. Define your models
class User(Model):
    id = fields.IntField(primary_key=True)
    name = fields.CharField(max_length=50)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "demo_users"

    def __str__(self):
        return self.name

# 2. Define the main async function
async def main():
    database_url = os.getenv("DATABASE_URL")

    try:
        # Initialize Tortoise ORM
        print("Connecting to Neon Postgres...")
        await Tortoise.init(
            db_url=database_url,
            modules={"models": ["__main__"]},  # Looks for models in the current file
        )

        # Generate the schema (creates tables if they don't exist)
        await Tortoise.generate_schemas()

        # Insert a new user
        await User.create(name="Neon User")

        # Query the database
        users = await User.all()
        print(f"Successfully queried the database. Users found: {len(users)}")
        for user in users:
            print(f"- {user.name} (Created: {user.created_at})")

    finally:
        # 3. Clean up and close connections
        print("Closing database connections...")
        await Tortoise.close_connections()

if __name__ == "__main__":
    # run_async is a Tortoise helper that ensures connections are closed
    # if the script exits unexpectedly.
    run_async(main())
```

In this script, the `User` class defines your database schema, mapping Python types directly to PostgreSQL columns. The `Tortoise.init()` method connects to Neon using your connection string, while `generate_schemas()` safely creates the tables if they don't already exist. For real-world applications, you would typically define models in a dedicated file (like `models.py`) and load them into the initialization config using `modules={"models": ["my_project.models"]}`.

Run the script from your terminal:

```bash
python main.py
```

You should see output indicating that the connection was successful, the table was created, and the user was successfully saved and queried.

## Execute a transaction

Tortoise ORM provides an `in_transaction()` async context manager to ensure database operations succeed or fail together. Create a `transactions.py` file to test this:

```python
import os
from dotenv import load_dotenv
from tortoise import Tortoise, run_async
from tortoise.transactions import in_transaction
from main import User

load_dotenv()

async def transaction_demo():
    await Tortoise.init(
        db_url=os.getenv("DATABASE_URL"), modules={"models": ["__main__"]}
    )

    try:
        # Execute operations inside a transaction block
        async with in_transaction():
            user = await User.create(name="Alice")
            print(f"Created: {user.name}")

            # Simulating an error that triggers a rollback
            raise ValueError("Something went wrong! Rolling back...")

            await User.create(name="Bob")  # This won't happen

    except ValueError as e:
        print(f"Error caught: {e}")

    # Verify Alice was not saved
    count = await User.filter(name="Alice").count()
    print(f"Records named 'Alice' in database: {count}")

    await Tortoise.close_connections()


if __name__ == "__main__":
    run_async(transaction_demo())
```

The `in_transaction()` block ensures an all-or-nothing execution. Because the simulated `ValueError` interrupts the process, Tortoise automatically rolls back the transaction, preventing the partial insertion of "Alice" into the database.

</Steps>

<details>
<summary>**Notes for AI-assisted setup**</summary>

- Do not install packages globally. Always use a virtual environment and run commands with `venv/bin/pip` and `venv/bin/python` (or the activated equivalent).
- Install Tortoise ORM with the `asyncpg` extra: `pip install "tortoise-orm[asyncpg]"`.
- The connection string protocol must be `postgres://` for Tortoise to utilize the `asyncpg` driver automatically.
- Always include `ssl=true` in your connection string to ensure a secure connection to Neon.
- Always ensure `await Tortoise.close_connections()` is called during application teardown or use the `tortoise.run_async()` wrapper to prevent hanging python processes.
- Do not hardcode credentials in initialization scripts. Use environment variables via `python-dotenv` and `os.getenv()`.

</details>

## Resources

- [Tortoise ORM documentation](https://tortoise.github.io/)
- [asyncpg documentation](https://magicstack.github.io/asyncpg/current/)

<NeedHelp/>

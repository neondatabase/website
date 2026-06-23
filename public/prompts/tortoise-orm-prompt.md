# 💡 AI Prompt: Connect Tortoise ORM to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Python project to connect to a Neon Postgres database using Tortoise ORM.

**Purpose:** To correctly set up a virtual environment, install the required dependencies, and provide working code examples for connecting to a Neon Postgres database, executing queries, and handling transactions.

**Scope:**
- Must be run inside an existing Python project directory.
- Assumes the user has a Neon project and access to their database connection string.
- All package installations must occur within an active Python virtual environment.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Python project as follows:

### 1. Ensure a Virtual Environment is Active

This is a mandatory first step.
- Check for a virtual environment directory (e.g., `venv`, `.venv`) in the project.
- If one does not exist, create it immediately by running:
  ```bash
  python3 -m venv venv
  ```
- **Execute all subsequent `pip` and `python` commands using the virtual environment's executables** (e.g., `venv/bin/python`, `venv/bin/pip`).

---

### 2. Install Dependencies

Install the required Python packages into the virtual environment.

```bash
venv/bin/pip install "tortoise-orm[asyncpg]" python-dotenv
```
- **`tortoise-orm[asyncpg]`**: The core asynchronous ORM, including the high-performance `asyncpg` PostgreSQL driver.
- **`python-dotenv`**: To load the database connection string from a `.env` file securely.

---

### 3. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the `DATABASE_URL` variable to the `.env` file. **Prompt the user to replace the placeholder value** with their full connection string from the Neon console. Ensure the protocol is `postgres://` and `ssl=true` is appended.

    ```dotenv title=".env"
    DATABASE_URL="postgres://<user>:<password>@<host>.neon.tech/<dbname>?ssl=true"
    ```

3.  Direct the user to find the values in the **Neon Console → Project → Connect** (using the "Parameters only" view).

---

### 4. Create Example Connection and Transaction Scripts

To provide a clear and testable example, create a new file named `main.py` in the project root. This script connects to the database, defines a schema, creates a table, inserts a record, and demonstrates transaction rollbacks.

```python title="main.py"
import os
from dotenv import load_dotenv
from tortoise import Tortoise, fields, run_async
from tortoise.models import Model
from tortoise.transactions import in_transaction

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

    if not database_url:
        raise ValueError("DATABASE_URL environment variable is not set.")

    try:
        # Initialize Tortoise ORM
        print("Connecting to Neon Postgres...")
        await Tortoise.init(
            db_url=database_url,
            modules={"models": ["__main__"]},  # Looks for models in the current file
        )

        # Generate the schema (creates tables if they don't exist)
        await Tortoise.generate_schemas()

        # --- Basic Operations ---
        print("\n--- Basic Operations ---")
        await User.create(name="Neon User")

        users = await User.all()
        print(f"Successfully queried the database. Users found: {len(users)}")
        for user in users:
            print(f"- {user.name} (Created: {user.created_at})")

        # --- Transactions Demo ---
        print("\n--- Transactions Demo ---")
        try:
            # Execute operations inside a transaction block
            async with in_transaction():
                user = await User.create(name="Alice")
                print(f"Created inside transaction: {user.name}")

                # Simulating an error that triggers a rollback
                raise ValueError("Something went wrong! Rolling back...")

                await User.create(name="Bob")  # This won't happen

        except ValueError as e:
            print(f"Error caught: {e}")

        # Verify Alice was not saved
        count = await User.filter(name="Alice").count()
        print(f"Records named 'Alice' in database after rollback: {count}")

    finally:
        # 3. Clean up and close connections
        print("\nClosing database connections...")
        await Tortoise.close_connections()


if __name__ == "__main__":
    # run_async is a Tortoise helper that ensures connections are closed
    # if the script exits unexpectedly.
    run_async(main())
```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Prompt the user to confirm that their Neon `DATABASE_URL` is correctly set in the `.env` file.
2.  Run the example script to test the connection and transaction handling:
    ```bash
    venv/bin/python main.py
    ```

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A Python virtual environment exists and is intended for use.
- The `tortoise-orm[asyncpg]` and `python-dotenv` packages are installed in the virtual environment.
- A `.env` file is present or has been created with a valid `postgres://` connection string containing `ssl=true`.
- The example script (`main.py`) correctly load the `DATABASE_URL` from the environment using `os.getenv()`.
- The `Tortoise.close_connections()` method and `run_async()` wrapper are used to prevent hanging processes.

---

## ❌ Do Not

- **Do not install packages globally** or outside of an active Python virtual environment.
- **Do not hardcode credentials** or the connection string in any Python source code file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
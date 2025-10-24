# 💡 AI Prompt: Connect SQLAlchemy to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Python project to connect to a Neon Postgres database using SQLAlchemy.

**Purpose:** To correctly set up a virtual environment, install the required dependencies, and provide a working code example for connecting to a Neon Postgres database.

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
venv/bin/pip install SQLAlchemy psycopg2-binary python-dotenv
```
- **`SQLAlchemy`**: The core SQL toolkit and ORM.
- **`psycopg2-binary`**: The modern, high-performance PostgreSQL driver for Python.
- **`python-dotenv`**: To load the database connection string from a `.env` file.

---

### 3. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the `DATABASE_URL` variable to the `.env` file. **Prompt the user to replace the placeholder value** with their full connection string from the Neon console.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 4. Create an Example Connection Script

To provide a clear and testable example, create a new file named `main.py` in the project root with the following content. This script connects to the database, fetches the PostgreSQL version, and prints it to the console.

```python title="main.py"
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables from .env file
load_dotenv()

# Get the database connection string from the environment
database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise ValueError("DATABASE_URL environment variable is not set.")

try:
    # Create a SQLAlchemy engine.
    engine = create_engine(database_url)

    # Connect to the database and execute a query
    with engine.connect() as connection:
        print("Connection to Neon successful!")
        
        # Execute a simple query to get the database version
        result = connection.execute(text("SELECT version();"))
        db_version = result.scalar_one()
        
        print(f"PostgreSQL Version: {db_version}")

except Exception as e:
    print(f"An error occurred: {e}")

```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Prompt the user to confirm that their Neon `DATABASE_URL` is correctly set in the `.env` file.
2.  Run the example script to test the connection:
    ```bash
    venv/bin/python main.py
    ```
3.  If the connection is successful, the output will show "Connection to Neon successful!" followed by the PostgreSQL version of their database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A Python virtual environment exists and is intended for use.
- The `SQLAlchemy`, `psycopg2-binary`, and `python-dotenv` packages are installed in the virtual environment.
- A `.env` file is present or has been created.
- The example script (`main.py`) correctly loads the `DATABASE_URL` from the environment using `os.getenv()`.

---

## ❌ Do Not

- **Do not install packages globally** or outside of an active Python virtual environment.
- **Do not hardcode credentials** or the connection string in any Python source code file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
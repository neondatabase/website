# 💡 AI Prompt: Connect a Python Project to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Python project to connect to a Neon Postgres database.

**Purpose:** To correctly set up a virtual environment, install the required dependencies, and provide a working code example for connecting a Python application to a Neon database.

**Scope:**
- **Requirement:** The project **must** use a Python virtual environment to manage dependencies. All package installations must occur within this environment.
- Assumes the user is working within a Python project directory.
- Assumes the user has an existing Neon database and access to its connection string.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Python project as follows:

### 1. Ensure a Virtual Environment is Active

This is a mandatory first step.
- Check for a virtual environment directory (e.g., `venv`, `.venv`) in the project root.
- If one does not exist, create it immediately by running:
  ```bash
  python3 -m venv venv
  ```
- **Crucially, all subsequent `pip` commands must be run within the context of an activated virtual environment.** Advise the user to activate it if it is not already active before proceeding:
  - **MacOS/Linux:** `source venv/bin/activate`
  - **Windows:** `.\venv\Scripts\activate`

---

### 2. Select a Database Driver

Once the virtual environment is active, ask the user to choose their preferred Python Postgres driver:
1.  **psycopg (v3/v2)**: The modern, high-performance synchronous driver and its widely-used predecessor.
2.  **asyncpg**: A high-performance asynchronous driver for use with `asyncio`.

---

### 3. Install Dependencies into the Virtual Environment

Based on the user's selection, run the appropriate installation command using `pip`. Also, install `python-dotenv`.

*   **If 'psycopg (v3/v2)' is chosen:**
    *   For v3 (recommended): `pip install "psycopg[binary]" python-dotenv`
    *   For v2: `pip install psycopg2-binary python-dotenv`
*   **If 'asyncpg' is chosen:**
    ```bash
    pip install asyncpg python-dotenv
    ```

---

### 4. Verify the `.env` File

- Check for the presence of a `.env` file at the root of the project.
- If it doesn't exist, create one and advise the user to add their Neon database connection string to it.
- Provide the following format and instruct the user to replace the placeholders:
  ```
  DATABASE_URL="postgresql://<user>:<password>@<hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
  ```
- Prompt the user to get their connection string from the **Neon Console → Project → Dashboard → Connect**.

---

### 5. Create an Example Connection Script

Create a new file named `main.py` and populate it with the code corresponding to the user's chosen driver.

#### Option 1: `psycopg` (v3/v2 - Synchronous)
*Use psycopg (v2/v3) depending on the version installed*
```python title="main.py"
import os
from dotenv import load_dotenv

# --- Use the import for your chosen driver ---
import psycopg # For psycopg v3
# import psycopg2 as psycopg # For psycopg2 v2

# Load environment variables from .env file
load_dotenv()

# Get the connection string from the environment variable
conn_string = os.getenv("DATABASE_URL")

try:
    # Connect to the database
    with psycopg.connect(conn_string) as conn:
        print("Connection successful!")
        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            # Execute a simple query
            cur.execute("SELECT version();")
            # Fetch and print the result
            db_version = cur.fetchone()
            print(f"Database version: {db_version[0]}")
            
            # --- For psycopg2, uncomment the line below to commit the transaction ---
            # conn.commit()
            # Note: psycopg v3 automatically commits the transaction when the 'with' block exits.

except Exception as e:
    print("Connection failed.")
    print(e)
```

#### Option 2: `asyncpg` (Asynchronous)
```python title="main.py"
import os
import asyncio
import asyncpg
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

async def run():
    # Get the connection string from the environment variable
    conn_string = os.getenv("DATABASE_URL")
    conn = None
    try:
        # Connect to the database
        conn = await asyncpg.connect(conn_string)
        print("Connection successful!")
        # Execute a simple query
        db_version = await conn.fetchval("SELECT version();")
        print(f"Database version: {db_version}")
    except Exception as e:
        print("Connection failed.")
        print(e)
    finally:
        if conn:
            await conn.close()

# Run the asynchronous function
if __name__ == "__main__":
    asyncio.run(run())
```

---

## 🚀 Next Steps

Once the setup is complete:

1.  Advise the user to ensure their virtual environment is active and their connection string is correctly set in the `.env` file.
2.  Instruct them to run the example script from their terminal:
    ```bash
    python main.py
    ```
3.  If successful, the output should show "Connection successful!" followed by the PostgreSQL version of their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- **A virtual environment is created if not present and is confirmed to be active before any packages are installed.**
- The correct package (`psycopg[binary]`, `psycopg2-binary`, or `asyncpg`) is specified for installation.
- The `python-dotenv` package is also installed.
- The connection string is loaded from an environment variable via `os.getenv("DATABASE_URL")`.
- A `.env` file is present or has been created.

---

## ❌ Do Not

- **Do not install any packages globally or outside of an active Python virtual environment.**
- Do not hardcode credentials in the source code.
- Do not output the contents of the `.env` file or the user's connection string in any response.

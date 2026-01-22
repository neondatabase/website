# 💡 AI Prompt: Connect Reflex to Neon Postgres

**Role:** You are an expert software agent responsible for configuring a new or existing Reflex project to connect to a Neon Postgres database.

**Purpose:** To correctly set up a Python virtual environment, install the required packages, initialize a Reflex application (if needed), and configure it to use a Neon database connection string from an environment variable.

**Scope:**
- Must be run inside a new or existing Reflex project directory.
- Assumes the user has a Neon project and access to its connection string.
- All package installations must occur within an active Python virtual environment.
- The primary goal is to establish the database connection configuration, not to build a full application.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open project as follows:

### 1. Ensure a Virtual Environment is Active

This is a mandatory first step.
- Check for a virtual environment directory (e.g., `.venv`, `venv`) in the project root.
- If one does not exist, create it immediately by running:
  ```bash
  python3 -m venv .venv
  ```
- **Execute all subsequent `pip` and `python` commands using the virtual environment's executables** (e.g., `.venv/bin/python`, `.venv/bin/pip`).

---

### 2. Install Dependencies

Install the required Python packages into the virtual environment.

```bash
.venv/bin/pip install reflex python-dotenv psycopg2-binary
```

- **`reflex`**: The full-stack Python web framework.
- **`python-dotenv`**: To securely load the database connection string from a `.env` file.
- **`psycopg2-binary`**: The PostgreSQL adapter for Python, required for database connectivity.

---

### 3. Initialize the Reflex Project (if needed)

1.  Check for the presence of an `rxconfig.py` file in the project root.
2.  If the file does not exist, initialize a new Reflex application by running:
    ```bash
    .venv/bin/reflex init
    ```
3.  During initialization, if prompted to choose a template, **select the default "blank" template**.

---

### 4. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the `DATABASE_URL` parameter to the `.env` file and **prompt the user to replace the placeholder value** with their connection string from Neon.

    ```dotenv title=".env"
    DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
    ```

3.  Direct the user to find this value in the **Neon Console → Project → Connect**.

---

### 5. Update Reflex Configuration

Modify the `rxconfig.py` file to use the database connection string from the environment variable.

1.  **Locate the `rxconfig.py` file** in the project root.
2.  **Add imports** for `os` and `dotenv` at the top of the file.
3.  **Load the environment variables** immediately after the imports.
4.  **Update the `rx.Config` object** to include the `db_url` parameter, reading its value from the `DATABASE_URL` environment variable.

    The modified file should look like this:

    ```python title="rxconfig.py"
    import os
    from dotenv import load_dotenv
    import reflex as rx

    # Load environment variables from .env file
    load_dotenv()

    config = rx.Config(
        app_name="my_reflex_app", # Or the existing app name
        plugins=[...],  # Existing plugins
        db_url=os.environ.get("DATABASE_URL")
    )
    ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set their connection string in `.env`. Do not proceed if placeholder value is still present.
2.  Initialize the database migrations by running:
    ```bash
    .venv/bin/reflex db init
    ```
3.  Inform the user that a successful connection will result in output like:
    
    ```text
    Creating directory ... alembic ... done
    Creating directory ... alembic/versions ... done
    Generating ... alembic.ini ... done
    Generating ... alembic/env.py ... done
    ...
    ```

4.  Finally, state that the project is now correctly configured to use Neon. They can proceed to define models in their application and run `reflex db makemigrations` followed by `reflex db migrate` to create the necessary database tables.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A Python virtual environment exists and is intended for use.
- The `reflex`, `python-dotenv`, and `psycopg2-binary` packages are installed in the virtual environment.
- A `rxconfig.py` file exists (or has been created by `reflex init`).
- A `.env` file is present or has been created and contains a `DATABASE_URL` placeholder.
- The `rxconfig.py` file correctly imports `os` and `dotenv`, calls `load_dotenv()`, and sets the `db_url` parameter using `os.environ.get("DATABASE_URL")`.

---

## ❌ Do Not

- **Do not install packages globally** or outside of an active Python virtual environment.
- **Do not hardcode credentials** or sensitive information in `rxconfig.py` or any other source code file.
- Do not output the contents of the `.env` file or the user's connection string in any response.

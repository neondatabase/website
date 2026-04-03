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

## ⚡ Step 1: Run neon init (REQUIRED)

**You MUST execute this command before writing any code or installing any packages.** Do not skip this step. Do not manually replicate what it does.

```bash
npx -y neonctl@latest init
```

`neon init` handles everything automatically: it authenticates the user with Neon (sign up or log in), then installs the AI development tooling for the user's coding environment (MCP server, agent skills, IDE extensions, and plugins).

After it completes, instruct the user to **restart their editor**. Once restarted, you can guide them through an interactive "Get started with Neon" flow to create a project, obtain a connection string, store it in the project, install client libraries, and configure the app, including optional [Neon Auth](https://neon.tech/docs/auth/overview) setup.

**If `neon init` succeeds, skip to [Next Steps](#-next-steps).** The rest of the manual instructions below are not needed.

---

## 🛠️ Step 2: Manual setup (fallback — only if `init` is unavailable)

Use this section **only** if:
- `neon init` failed or is unavailable in this environment
- The user explicitly asked for manual configuration

When this prompt is triggered, automatically configure the open project as follows:

### 1. Ensure a Virtual Environment is Active

This is a mandatory first step.
- Check for a virtual environment directory (e.g., `.venv`, `venv`) in the project root.
- If one does not exist, create it immediately by running:
  ```bash
  python3 -m venv .venv
  ```
- **Execute all subsequent `pip` and `python` commands using the virtual environment's executables** (e.g., `.venv/bin/python`, `.venv/bin/pip`).
- On Windows, use `py -3 -m venv .venv` and `.venv\Scripts\activate` per the Reflex guide.

---

### 2. Install Dependencies

Install the required Python packages into the virtual environment (same as the guide’s manual tab):

```bash
.venv/bin/pip install reflex python-dotenv psycopg2-binary
```

- **`reflex`**: Full-stack Python web framework.
- **`python-dotenv`**: Load environment variables from `.env`.
- **`psycopg2-binary`**: PostgreSQL driver for Reflex’s DB integration.

---

### 3. Initialize the Reflex Project (if needed)

1.  Check for the presence of an `rxconfig.py` file in the project root.
2.  If the file does not exist, initialize a new Reflex application by running:
    ```bash
    .venv/bin/reflex init
    ```
3.  When prompted, choose **A blank Reflex app** (option **1** in the guide).

---

### 4. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add **`DATABASE_URL`** and prompt the user to replace placeholders with values from **Neon Console → Project → Connect**:

    ```dotenv title=".env"
    DATABASE_URL="postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require&channel_binding=require"
    ```

---

### 5. Update Reflex Configuration (`rxconfig.py`)

Match the guide’s manual tab: `load_dotenv()`, import `reflex as rx`, and set `db_url` from `DATABASE_URL`. Preserve any existing `app_name` and non-database settings.

If the project already has `plugins` in `rx.Config`, keep them; otherwise align with the guide’s defaults:

```python title="rxconfig.py"
import os
from dotenv import load_dotenv
import reflex as rx

load_dotenv()

config = rx.Config(
    app_name="with_reflex",  # Use the project’s actual app name / directory name
    plugins=[
        rx.plugins.SitemapPlugin(),
        rx.plugins.TailwindV4Plugin(),
    ],
    db_url=os.environ.get("DATABASE_URL"),
)
```

If `rx.Config` already includes other valid keys, merge `db_url` and `load_dotenv()` without removing user customization.

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Verify the user has correctly set `DATABASE_URL` in `.env` (no placeholders).
2.  For database schema, follow the guide: define `rx.Model` classes, then run:
    ```bash
    .venv/bin/reflex db init
    .venv/bin/reflex db makemigrations --message 'describe change'
    .venv/bin/reflex db migrate
    ```
3.  Run the app: `.venv/bin/reflex run` (default dev URL `http://localhost:3000` per the guide).
4.  **Authentication:** If the app needs user authentication, mention [Neon Auth](https://neon.tech/docs/auth/overview).

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A Python virtual environment exists and is intended for use.
- The `reflex`, `python-dotenv`, and `psycopg2-binary` packages are installed in the virtual environment.
- A `rxconfig.py` file exists (or has been created by `reflex init`).
- A `.env` file is present or has been created with a `DATABASE_URL` placeholder in the guide’s format (`sslmode=require` and `channel_binding=require`).
- The `rxconfig.py` file imports `os` and `dotenv`, calls `load_dotenv()`, and sets `db_url=os.environ.get("DATABASE_URL")`, with `plugins` consistent with the Reflex guide where applicable.

---

## ❌ Do Not

- **Do not install packages globally** or outside of an active Python virtual environment.
- **Do not hardcode credentials** or sensitive information in `rxconfig.py` or any other source code file.
- Do not output the contents of the `.env` file or the user's connection string in any response.

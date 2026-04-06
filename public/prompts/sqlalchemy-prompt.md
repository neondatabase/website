# 💡 AI Prompt: Connect SQLAlchemy to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Python project to connect to a Neon Postgres database using SQLAlchemy.

**Purpose:** To install the Postgres driver and SQLAlchemy, then provide examples aligned with the SQLAlchemy guide’s manual tab: a direct `psycopg2` connection string and an SQLAlchemy `create_engine` URL.

**Scope:**
- Must be run inside an existing Python project directory.
- Assumes the user has a Neon project and can copy connection details from the Neon Console.
- All package installations must occur within an active Python virtual environment.

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

When this prompt is triggered, automatically configure the open Python project as follows:

### 1. Ensure a Virtual Environment is Active

- Check for a virtual environment (e.g., `venv`, `.venv`) in the project root.
- If one does not exist, create it: `python3 -m venv venv`.
- Run subsequent `pip` / `python` commands with that environment activated or via `venv/bin/pip` and `venv/bin/python`.

---

### 2. Install Dependencies

The guide’s manual tab installs **`psycopg2-binary`** and assumes **SQLAlchemy** is available (see prerequisites in the guide).

```bash
pip install SQLAlchemy psycopg2-binary python-dotenv
```

Use `python-dotenv` when loading credentials from `.env` (the guide’s code blocks use inline variables; agents should prefer env vars and never commit secrets).

---

### 3. Connection Details

Users obtain host, user, password, database, and port from **Neon Console → Project → Connect**.

**Psycopg2 keyword connection string** (same shape as the guide’s “hello neon” example—substitute real values or read from `os.getenv`):

```python
# Example structure from the guide (use env vars in real projects, not literals)
conn_str = (
    f"dbname={PROJECT} user={USERNAME} password={PASSWORD} "
    f"host={HOST} port={PORT} sslmode=require channel_binding=require"
)
conn = psycopg2.connect(conn_str)
```

**SQLAlchemy engine URL** (same pattern as the guide):

```python
conn_str = (
    f"postgresql://{USERNAME}:{PASSWORD}@{HOST}/{DATABASE}"
    f"?sslmode=require&channel_binding=require"
)
engine = create_engine(conn_str)
```

If using `.env`, define variables such as `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE` (or a single `DATABASE_URL` that already matches the `postgresql://...?sslmode=require&channel_binding=require` form) and build the strings in code—**do not commit secrets**.

---

### 4. Example Script

Create a small script (e.g. `main.py`) that mirrors the guide: SQLAlchemy engine + a simple query. Prefer `create_engine` + `text()` for SQLAlchemy 2.x style.

```python title="main.py"
import os

import psycopg2
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

USERNAME = os.getenv("PGUSER")
PASSWORD = os.getenv("PGPASSWORD")
HOST = os.getenv("PGHOST")
PORT = os.getenv("PGPORT", "5432")
DATABASE = os.getenv("PGDATABASE")

# Optional: quick raw check (guide "hello neon" pattern)
conn_info = (
    f"dbname={DATABASE} user={USERNAME} password={PASSWORD} "
    f"host={HOST} port={PORT} sslmode=require channel_binding=require"
)
with psycopg2.connect(conn_info) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT 'hello neon';")
        print("psycopg2:", cur.fetchall())

# SQLAlchemy engine (guide pattern)
url = (
    f"postgresql://{USERNAME}:{PASSWORD}@{HOST}/{DATABASE}"
    f"?sslmode=require&channel_binding=require"
)
engine = create_engine(url)

with engine.connect() as connection:
    result = connection.execute(text("SELECT version();"))
    print("SQLAlchemy:", result.scalar_one())
```

Adjust imports if the project does not use `python-dotenv`; then load configuration the way the app already does.

**Pool / idle compute:** For long-lived apps, mention `pool_pre_ping=True` and `pool_recycle` per the [SQLAlchemy + Neon guide](https://neon.tech/docs/guides/sqlalchemy) if they see disconnect errors after idle periods.

---

## 🚀 Next Steps

1. Run the script with the venv’s Python: `python main.py` (or your filename).
2. For migrations, point to [SQLAlchemy Migrations with Neon](https://neon.tech/docs/guides/sqlalchemy-migrations).
3. **Authentication:** If needed, mention [Neon Auth](https://neon.tech/docs/auth/overview).

---

## ✅ Validation Rules for AI

- Virtual environment exists; install **`SQLAlchemy`**, **`psycopg2-binary`**, and (if using `.env`) **`python-dotenv`** in that environment.
- Connection strings include **`sslmode=require`** and **`channel_binding=require`** in the same forms as the guide (`postgresql://...` for SQLAlchemy; keyword/libpq string for `psycopg2.connect`).
- No credentials committed in source; use env vars or `.env` (gitignored).
- Prefer SQLAlchemy **2.0.33+** when choosing versions, per the guide’s connection-errors section.

---

## ❌ Do Not

- **Do not skip `neon init`.** Do not scaffold the project or install packages before running `npx -y neonctl@latest init`. It must be the first step.
- **Do not use third-party auth libraries** (e.g. `next-auth`, `Auth.js`, Passport) when the user asks for Neon. Neon includes Neon Auth (`@neondatabase/auth`).
- **Do not install packages globally** outside the project virtual environment.
- **Do not hardcode** Neon passwords or connection strings in tracked files.
- Do not echo `.env` contents or live secrets in chat output.

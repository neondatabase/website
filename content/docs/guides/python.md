---
title: Connect a Python application to Neon
subtitle: Create a uv project, link it with neon link, and query Lakebase Postgres from Python with psycopg 3
summary: >-
  To connect a Python app to Lakebase Postgres on Neon, create a uv project, run
  neon link to write DATABASE_URL to .env.local, and query it with psycopg 3.
  Covers one runnable example (create, insert, select, update, delete, and a
  transaction), running the app elsewhere, troubleshooting, and the Django,
  Reflex, SQLAlchemy, and Tortoise ORM guides as next steps.
enableTableOfContents: true
updatedOn: '2026-11-20T22:23:16.924Z'
---

<PromptBlock src="/prompts/python-prompt.md" labels={["Set up your agent and follow this guide", "Look up driver docs", "Connect your Python project"]} />

<Steps>

## Create a Python project

Create a project with [uv](https://docs.astral.sh/uv/), a Python package and project manager. You need Python 3.10 or later, the minimum for psycopg 3. uv uses a matching Python it finds, and can install one for the project. Skip this step if you already have a Python project.

```bash filename="Terminal"
uv init neon-python-app
cd neon-python-app
```

This creates `pyproject.toml`, a `main.py` placeholder, and a git repository.

If you use pip in a virtual environment instead of uv, skip the `uv add` step: install the driver with `pip install "psycopg[binary]"` in the activated environment, and run each script with `uv run --no-project --env-file .env.local python main.py` in place of `uv run`.

## Add Neon's agent skills (optional)

Add Neon's [agent skills](/docs/ai/agent-skills) to your project with the command below. They teach your AI coding agent how to use the Neon CLI, branches, and Neon's backend services. The agent prompt at the top of this page installs them, so skip this step if you used it. The command runs through npm, so it needs Node.js 22.20 or later, even though the app is Python.

```bash filename="Terminal"
npx neon@latest skills
```

The [Neon MCP Server](/docs/ai/neon-mcp-server) connects your agent to Neon's tools as well; its page covers the setup.

## Create a Neon project

Create a Neon project in a region that runs every Neon backend service: `aws-us-east-2` (Ohio), `aws-us-east-1` (N. Virginia), `aws-eu-central-1` (Frankfurt), or `aws-ap-southeast-1` (Singapore). Postgres and [Managed Better Auth](/docs/auth/overview) run in every region; Object Storage, Neon Functions, the AI Gateway, and Realtime run in those four (see [product availability](/docs/introduction/regions#product-availability)). Skip this step if you already have a Neon project you want to use.

<Tabs labels={["Neon CLI", "API", "Console"]}>

<TabItem>

Install the [Neon CLI](/docs/cli/install), sign in, and create the project. The npm install needs Node.js 20.19 or later; without Node.js, run `brew install neonctl` (Homebrew) or use another option on the install page:

```bash filename="Terminal"
npm i -g neon@latest
neon login
neon projects create --name my-app --region-id aws-us-east-2 --no-secrets
```

`--region-id` sets the region. `--no-secrets` keeps the connection string out of the output, since the next step pulls it into your env file. Pass `--org-id` to choose the organization (find IDs with `neon orgs list`).

</TabItem>

<TabItem>

Create an [API key](https://console.neon.tech/app/settings/api-keys), export it, then create the project in your organization:

```bash filename="Terminal"
export NEON_API_KEY=napi_...

curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-app", "region_id": "aws-us-east-2", "org_id": "<org-id>"}}'
```

The response includes the project's connection string in `connection_uris[0].connection_uri`. See [Create a project with the API](/docs/manage/projects#create-a-project-with-the-api) for the other options.

</TabItem>

<TabItem>

Go to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console, click **New Project**, and pick one of the regions above.

</TabItem>

</Tabs>

## Connect your app to the project

The first tab runs `neon link --no-config` in your project directory, which writes `DATABASE_URL` into `.env.local` (or `.env` if one exists); the second tab copies the connection string into that file by hand. Add the env files to `.gitignore` first, so the connection string stays out of git:

```bash filename="Terminal"
printf '\n.env\n.env.local\n' >> .gitignore
```

Python doesn't read env files itself: `uv run --env-file` in [Connect and run a query](#connect-and-run-a-query) loads them, so you don't need `python-dotenv`.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your project's directory, link it to the Neon project. Install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't.

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's Neon variables, including `DATABASE_URL`, into `.env.local`, or into `.env` if your project already has one.

`--no-config` skips the offer to create a [`neon.ts`](/docs/reference/neon-ts) file, which is for Node.js projects.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy the connection string from **Connect** in the Console nav, or from the API response, and add it to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

The development branch step below needs the Neon CLI, so skip it in this tab.

</TabItem>

</Tabs>

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install a Postgres driver

Install [psycopg 3](https://www.psycopg.org/psycopg3/docs/), the synchronous Postgres driver for Python. The `binary` extra includes libpq, the Postgres client library, so you don't need to install it separately. psycopg 3 also has an async API for `asyncio` code, `psycopg.AsyncConnection`, described in its [async docs](https://www.psycopg.org/psycopg3/docs/advanced/async.html). The `DATABASE_URL` from the previous step works with both.

If your code already uses [asyncpg](https://magicstack.github.io/asyncpg/current/), the same `DATABASE_URL` works. Pass an SSL context so that asyncpg verifies the server certificate, which `sslmode=require` alone doesn't do: `await asyncpg.connect(os.environ["DATABASE_URL"], ssl=ssl.create_default_context())`. asyncpg doesn't support channel binding, so it ignores `channel_binding=require`.

```bash filename="Terminal"
uv add "psycopg[binary]"
```

`uv add` records the package in `pyproject.toml` and installs it into the project's `.venv` directory.

## Connect and run a query

Replace the `main.py` that `uv init` created (or your existing script) with a script that prints the Postgres version. `uv run` installs the project's packages if they're missing. `--env-file` loads the env file into the script's environment; use `.env` there instead if `neon link` wrote to `.env`.

```python filename="main.py"
import os

import psycopg

with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT version()")
        print(cur.fetchone()[0])
```

```bash filename="Terminal"
uv run --env-file .env.local main.py
```

The output shows the Postgres version of your database, which confirms the connection:

```text
PostgreSQL 18.7 (84da7d8) on aarch64-unknown-linux-gnu, compiled by gcc ...
```

</Steps>

## Examples

The example is one script that creates a `books` table, then inserts, selects, updates, and deletes rows, with a transaction in the middle. The script deletes the rows it adds, so you can run it again. Save it as `books.py` in your project, and run it with `uv run --env-file .env.local books.py`. The example creates the `books` table and writes rows to the branch that your `DATABASE_URL` points at, so run it on a development branch: complete [Work on a development branch](#work-on-a-development-branch-optional) first. Without the CLI, create a branch in the Neon Console and copy its connection string into `.env.local`, as described in [Create a branch](/docs/manage/branches#create-a-branch).

```python filename="books.py"
import os

import psycopg

with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    with conn.cursor() as cur:
        # Create a table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                year INT
            )
        """)

        # Insert a row and get its id back
        cur.execute(
            "INSERT INTO books (title, author, year) VALUES (%s, %s, %s) RETURNING id",
            ("Dune", "Frank Herbert", 1965),
        )
        dune_id = cur.fetchone()[0]

        # Select the row
        cur.execute("SELECT id, title, year FROM books WHERE id = %s", (dune_id,))
        print("Selected:", cur.fetchone())

        # Update the row
        cur.execute("UPDATE books SET year = %s WHERE id = %s", (1966, dune_id))

        # Insert two rows in a transaction: both commit, or neither does
        with conn.transaction():
            cur.execute(
                "INSERT INTO books (title, author, year) VALUES (%s, %s, %s) RETURNING id",
                ("Emma", "Jane Austen", 1815),
            )
            emma_id = cur.fetchone()[0]
            cur.execute(
                "INSERT INTO books (title, author, year) VALUES (%s, %s, %s) RETURNING id",
                ("Persuasion", "Jane Austen", 1817),
            )
            persuasion_id = cur.fetchone()[0]

        cur.execute("SELECT title, year FROM books ORDER BY year")
        print("All books:", cur.fetchall())

        # Delete the rows this script added
        cur.execute(
            "DELETE FROM books WHERE id = ANY(%s)",
            ([dune_id, emma_id, persuasion_id],),
        )
```

`with psycopg.connect()` commits when the block ends without an error, so the script doesn't call `commit()`.

## Run it elsewhere

On a host, set `DATABASE_URL` in the host's environment instead of an env file. For production, use your default branch's pooled connection string, which goes through [Neon's connection pooler](/docs/connect/connection-pooling): run `neon connection-string main --pooled` in your own terminal, replacing `main` with `production` if that's your project's default branch, because the command prints the password. Neon's pooler already pools connections, so you don't need to add a pool in your app; if you do, return connections to it promptly (see [Double pooling](/docs/connect/choose-connection#common-pitfalls)).

## Add more of your backend

Neon also runs object storage, a model gateway, and serverless functions next to your database. Each entry below says what the service does.

<DefinitionList>

Object Storage
: S3-compatible buckets for uploads and files, used with boto3. See [Object Storage](/docs/storage/overview).

AI Gateway
: Routes calls to models from Anthropic, OpenAI, Google, and more through one endpoint on your branch, used with the OpenAI SDK. See [AI Gateway](/docs/ai-gateway/overview).

Neon Functions
: Long-running Node.js compute (the server that runs your code next to your database), called over HTTP. See [Neon Functions](/docs/compute/functions/overview).

</DefinitionList>

## Troubleshooting

<DefinitionList>

`KeyError: 'DATABASE_URL'`
: The script ran without `DATABASE_URL` in its environment. Run it with `uv run --env-file .env.local`, or set the variable in your shell.

``error: No environment file found at: `.env.local` ``
: `neon link` wrote `.env` because your project already had one, so `.env.local` doesn't exist. Pass `--env-file .env` instead.

`ModuleNotFoundError: No module named 'psycopg'`
: The script ran with `python` instead of `uv run`, so it isn't using the project's virtual environment. Run it with `uv run --env-file .env.local` from the project directory.

</DefinitionList>

## Next steps

- [Connect a Django application to Neon](/docs/guides/django): Query Neon from a Django view, with branches and deployment.
- [Connect a Reflex application to Neon](/docs/guides/reflex): Define a SQLAlchemy model in a Reflex app, migrate it with Alembic, and query it from a page.
- [Connect from SQLAlchemy to Neon](/docs/guides/sqlalchemy): Use SQLAlchemy's models and queries instead of raw SQL.
- [Connect from Tortoise ORM to Neon](/docs/guides/tortoise-orm): Use an asyncio-native ORM.

<NeedHelp/>

---
title: Connect from SQLAlchemy to Neon
subtitle: Create a Neon project, link it with neon link, and query Lakebase Postgres through SQLAlchemy 2.1 and psycopg 3
summary: >-
  To connect a SQLAlchemy app to Lakebase Postgres on Neon, run neon link to get a
  pooled DATABASE_URL and a direct DATABASE_URL_UNPOOLED, then define a model, run
  an Alembic migration, and query it with SQLAlchemy 2.1 and the psycopg 3 driver.
  Covers why migrations use the direct connection, an optional development branch,
  the agent prompt, and notes for SQLAlchemy 2.0.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/sqlalchemy
  - /docs/integrations/sqlalchemy
updatedOn: '2026-11-20T21:28:32.916Z'
---

<PromptBlock src="/prompts/sqlalchemy-prompt.md" labels={["Set up your agent and follow this guide", "Look up SQLAlchemy's docs", "Connect your SQLAlchemy app"]} />

<Steps>

## Start from a Python project

SQLAlchemy 2.1, a Python toolkit that maps Python classes to database tables, needs Python 3.11 or later. Use a project you already have, or create one with [Connect a Python application to Neon](/docs/guides/python). Skip this step if you already have a project.

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

Get two connection strings into an env file. The **pooled** `DATABASE_URL` goes through Neon's connection pooler, and your app uses it. The **direct** `DATABASE_URL_UNPOOLED` goes straight to Postgres, and Alembic uses it for migrations (see [Why two connection strings?](#why-two-connection-strings)). Add the env files to `.gitignore` first, so the connection strings stay out of git:

```bash filename="Terminal"
printf '\n.env\n.env.local\n' >> .gitignore
```

The commands in this guide read `.env.local`. If `neon link` wrote to `.env` instead, because your project already had one, use `--env-file .env` in their place.

<Tabs labels={["Neon CLI", "Without the CLI"]}>

<TabItem>

From your project's directory, link it to the Neon project. Install the [Neon CLI](/docs/cli/install) and run `neon login` first if you haven't:

```bash filename="Terminal"
neon link --no-config
```

`neon link` prompts you to pick an organization and a project, or to create a new project. Then it:

- writes a `.neon` file with the project context;
- pins a branch (pass `--branch` to choose one);
- pulls that branch's `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into `.env.local`, or into `.env` if your project already has one.

`--no-config` skips the offer to create a [`neon.ts`](/docs/reference/neon-ts) file, which is for Node.js projects.

To skip the prompts, pass `-y` with `--org-id` and `--project-id`, or with `--org-id`, `--project-name`, and `--region-id` to create a project. Find IDs with `neon orgs list` and `neon projects list --org-id <org-id>`.

</TabItem>

<TabItem>

Copy both connection strings from **Connect** in the Neon Console, or from the API response, and add them to a `.env.local` file in your project directory. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell filename=".env.local" shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
```

The development branch step below needs the Neon CLI, so skip it in this tab.

</TabItem>

</Tabs>

## Work on a development branch (optional)

Run `neon checkout dev --create` to develop on a branch of your database instead of the default branch, where production data usually lives. The default branch is `main` for projects created with the CLI or API, and `production` for projects created in the Console. A [branch](/docs/introduction/branching) starts from its parent's data and schema without copying them (copy-on-write: only the changes you make are stored), so you can change it freely:

```bash filename="Terminal"
neon checkout dev --create
```

This creates the `dev` branch, pins it in `.neon`, and pulls its `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into the same env file, so your app now uses the branch. To switch back, run `neon checkout main` (or `production`).

## Install SQLAlchemy and a driver

Install [SQLAlchemy](https://docs.sqlalchemy.org/en/21/), [Alembic](https://alembic.sqlalchemy.org/en/latest/) (the migration tool for SQLAlchemy), and [psycopg 3](https://www.psycopg.org/psycopg3/docs/), the Postgres driver. The `binary` extra includes libpq, the Postgres client library, so you don't need to install it separately:

```bash filename="Terminal"
uv add sqlalchemy alembic "psycopg[binary]"
```

`uv add` records the packages in `pyproject.toml` and installs them into the project's `.venv` directory. With SQLAlchemy 2.1, a `postgresql://` URL uses psycopg 3, so the URL from the previous step works without a change. If you use pip in an activated virtual environment instead of uv, run `pip install sqlalchemy alembic "psycopg[binary]"` and replace `uv run` with `uv run --no-project` in the commands below.

This guide uses SQLAlchemy 2.1. For SQLAlchemy 2.0, see the note in Troubleshooting.

## Configure SQLAlchemy

Create `db.py` with one engine for the app. An engine holds the connection pool, so create it once and import it wherever you query. It reads the pooled `DATABASE_URL`, and `pool_pre_ping=True` checks a pooled connection before each use, so the app doesn't reuse a connection that Neon closed while the compute was suspended.

```python filename="db.py"
import os

from sqlalchemy import create_engine

engine = create_engine(os.environ["DATABASE_URL"], pool_pre_ping=True)
```

## Define a model and run a migration

Create `models.py` with a `Book` model. `Base` is SQLAlchemy's declarative base class, which collects the table definitions that Alembic compares with the database:

```python filename="models.py"
from sqlalchemy import Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    author: Mapped[str] = mapped_column(String(200))
    year: Mapped[int | None] = mapped_column(Integer)
```

Run `alembic init` to create the `alembic` folder and `alembic.ini`, then replace `alembic/env.py` with the file below. Alembic reads the direct `DATABASE_URL_UNPOOLED` in this file and compares `Base.metadata` with the database. Also delete the `sqlalchemy.url` line from `alembic.ini`, because `env.py` sets the connection now.

```bash filename="Terminal"
uv run alembic init alembic
```

```python filename="alembic/env.py"
import os
from logging.config import fileConfig

from sqlalchemy import create_engine, pool

from alembic import context
from models import Base

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=os.environ["DATABASE_URL_UNPOOLED"],
        target_metadata=target_metadata,
        literal_binds=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    engine = create_engine(os.environ["DATABASE_URL_UNPOOLED"], poolclass=pool.NullPool)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()
    engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

Generate a migration from the model, then apply it:

```bash filename="Terminal"
uv run --env-file .env.local alembic revision --autogenerate -m "create books"
uv run --env-file .env.local alembic upgrade head
```

`revision --autogenerate` writes a migration file to `alembic/versions`, and `upgrade head` runs it. Run `upgrade head` again after each new migration.

## Query it

Create `main.py`. It adds a book with a session, which tracks the objects you change and writes them in one transaction on `commit`. Then it reads the book back and prints the Postgres version:

```python filename="main.py"
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from db import engine
from models import Book

with Session(engine) as session:
    book = Book(title="Dune", author="Frank Herbert", year=1965)
    session.add(book)
    session.commit()

    found = session.scalars(select(Book).where(Book.id == book.id)).one()
    print("Book:", found.id, found.title, found.year)

    print(session.execute(text("SELECT version()")).scalar())
```

Run the script:

```bash filename="Terminal"
uv run --env-file .env.local main.py
```

The output shows the new book and the Postgres version. Each run adds one book, so run it on a development branch.

```text
Book: 1 Dune 1965
PostgreSQL 18.7 (84da7d8) on aarch64-unknown-linux-gnu, compiled by gcc ...
```

</Steps>

## Why two connection strings?

Your app uses the pooled `DATABASE_URL`, which goes through PgBouncer, the connection pooler Neon runs in [transaction mode](/docs/connect/connection-pooling#connection-pooling-in-transaction-mode). Alembic uses the direct `DATABASE_URL_UNPOOLED`, as Neon recommends for [schema changes](/docs/connect/connection-pooling).

## Troubleshooting

<DefinitionList>

`KeyError: 'DATABASE_URL'`
: The script ran without `DATABASE_URL` in its environment. Run it with `uv run --env-file .env.local`, or set the variable in your shell. Alembic reads `DATABASE_URL_UNPOOLED` instead, so a missing direct URL fails with `KeyError: 'DATABASE_URL_UNPOOLED'`.

``error: No environment file found at: `.env.local` ``
: `neon link` wrote `.env` because your project already had one, so `.env.local` doesn't exist. Pass `--env-file .env` instead.

`ModuleNotFoundError: No module named 'psycopg2'`
: You're on SQLAlchemy 2.0, where a `postgresql://` URL selects the psycopg2 driver. This guide uses psycopg 3, so change the scheme in code: `os.environ["DATABASE_URL"].replace("postgresql://", "postgresql+psycopg://", 1)` in `db.py`, and in `alembic/env.py` for `DATABASE_URL_UNPOOLED`. Passing `module=psycopg` to `create_engine` doesn't fix it, because the URL still selects the psycopg2 dialect. Or upgrade to SQLAlchemy 2.1, which uses psycopg 3 for `postgresql://` URLs. The [SQLAlchemy 2.1 migration notes](https://docs.sqlalchemy.org/en/21/changelog/migration_21.html) describe the change.

`SSL connection has been closed unexpectedly`
: The app reused a pooled connection that Neon closed while the compute was suspended for [scale to zero](/docs/connect/connection-latency). Check that the engine in `db.py` passes `pool_pre_ping=True`, which tests a connection before use and replaces it if it's closed.

</DefinitionList>

## Next steps

- [Schema migration with SQLAlchemy and Lakebase Postgres on Neon](/docs/guides/sqlalchemy-migrations): a longer tutorial that builds a FastAPI app and changes its schema.
- **Deploy:** set `DATABASE_URL` and `DATABASE_URL_UNPOOLED` in your host's environment, and run `alembic upgrade head` before you start the app.
- **Add more of your backend:** [Managed Better Auth](/docs/auth/overview) for sign-in, [Object Storage](/docs/storage/overview) for files, [Neon Functions](/docs/compute/functions/overview) for long-running work, and [AI Gateway](/docs/ai-gateway/overview) for LLM calls. Each one branches with your database.
- [SQLAlchemy documentation](https://docs.sqlalchemy.org/en/21/): the SQLAlchemy 2.1 reference.

<NeedHelp/>

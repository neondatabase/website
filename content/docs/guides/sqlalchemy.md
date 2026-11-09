---
title: Connect an SQLAlchemy application to Lakebase Postgres
subtitle: Set up a project on Neon in seconds and connect from an SQLAlchemy application
summary: >-
  SQLAlchemy, a Python SQL toolkit and ORM, connects to Lakebase Postgres by
  installing psycopg (v3) and passing a postgresql+psycopg connection string to
  SQLAlchemy's create_engine function. Use this guide to build a working connection, then
  resolve Lakebase-specific errors caused by compute scale-to-zero suspension,
  including SSL connection drops when idle connections are reused. A recent
  version of SQLAlchemy is required to avoid idle connection reuse bugs. Set
  pool_recycle or pool_pre_ping to prevent SSL SYSCALL EOF errors.
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/sqlalchemy
  - /docs/integrations/sqlalchemy
updatedOn: '2026-09-16T19:45:35.340Z'
---

<CopyPrompt src="/prompts/sqlalchemy-prompt.md" 
description="Pre-built prompt for connecting SQLAlchemy to Lakebase Postgres"/>

SQLAlchemy is a Python SQL toolkit and Object Relational Mapper (ORM). This guide describes how to create a project on Neon and connect to it from SQLAlchemy.

**Prerequisites:**

- Python 3.11 or later (required by SQLAlchemy 2.1).
- A Python virtual environment for your project.

The instructions below use `psycopg` (v3), the default Postgres driver in SQLAlchemy 2.1.

To connect to a Lakebase Postgres database from SQLAlchemy:

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Install SQLAlchemy and a driver

Install SQLAlchemy, the `psycopg` driver, and `python-dotenv` in your virtual environment:

```shell
pip install sqlalchemy "psycopg[binary]" python-dotenv
```

For more installation options, see [Installation](https://docs.sqlalchemy.org/en/20/intro.html#installation) in the SQLAlchemy documentation.

## Store your connection string

Add a `.env` file to your project directory with your connection string. You can find it by clicking the **Connect** button in the Console nav. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

Change the scheme from `postgresql://` to `postgresql+psycopg://` so that SQLAlchemy uses the `psycopg` driver on any SQLAlchemy 2.x version:

```shell shouldWrap
DATABASE_URL="postgresql+psycopg://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

<Admonition type="note">
To use `psycopg2` instead, install `psycopg2-binary` and use the `postgresql+psycopg2://` scheme. SQLAlchemy 2.0 uses `psycopg2` for plain `postgresql://` URLs; SQLAlchemy 2.1 uses `psycopg`.
</Admonition>

## Create an SQLAlchemy engine and run a query

SQLAlchemy uses an engine to manage database connections. Create a file named `main.py` that creates an engine from your connection string and runs a query:

```python
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

engine = create_engine(os.environ["DATABASE_URL"], pool_pre_ping=True)

with engine.connect() as conn:
    result = conn.execute(text("SELECT 'hello neon'"))
    print(result.scalar())
```

`pool_pre_ping=True` checks that a pooled connection is still alive before using it, which avoids errors after your compute scales to zero.

Run the script:

```shell
python main.py
```

The output is:

```text
hello neon
```

For additional information about connecting from SQLAlchemy, refer to the following topics in the SQLAlchemy documentation:

- [Establishing Connectivity - the Engine](https://docs.sqlalchemy.org/en/20/tutorial/engine.html)
- [Connecting to PostgreSQL with SQLAlchemy](https://docs.sqlalchemy.org/en/20/core/engines.html#postgresql)

</Steps>

## SQLAlchemy connection errors

- SQLAlchemy versions prior to 2.0.33 may reuse idle connections, leading to connection errors. If this occurs, you could encounter an `SSL connection has been closed unexpectedly` error. To resolve this, upgrade to SQLAlchemy 2.0.33 or later. For more details, see the [SQLAlchemy 2.0.33 changelog](https://docs.sqlalchemy.org/en/20/changelog/changelog_20.html#change-2.0.33-postgresql).
- If you encounter an `SSL SYSCALL error: EOF detected` when connecting to the database, this typically happens because the application is trying to reuse a connection after the Neon compute has been suspended due to inactivity. To resolve this issue, try one of the following options:
  - Set the SQLAlchemy `pool_recycle` parameter to a value less than or equal to the scale to zero setting configured for your compute.
  - Set the SQLAlchemy `pool_pre_ping` parameter to `True`. This ensures that your engine checks if the connection is alive before executing a query.

  For more details on the `pool_recycle` and `pool_pre_ping` parameters, refer to [SQLAlchemy: Connection Pool Configuration](https://docs.sqlalchemy.org/en/20/core/pooling.html#connection-pool-configuration) and [Dealing with Disconnects](https://docs.sqlalchemy.org/en/20/core/pooling.html#dealing-with-disconnects). For information on configuring Neon's scale to zero setting, see [Configuring Scale to Zero for Neon computes](/docs/guides/scale-to-zero-guide).

## Schema migration with SQLAlchemy

For schema migration with SQLAlchemy, see:

<DetailIconCards>

<a href="/docs/guides/sqlalchemy-migrations" description="Schema migration with Lakebase Postgres and SQLAlchemy" icon="app-store">SQLAlchemy Migrations</a>

</DetailIconCards>

## Next steps

- [Add Object Storage](/docs/storage/overview): S3-compatible file storage that branches with your database
- [Call an LLM with AI Gateway](/docs/ai-gateway/overview): Access foundation models from Anthropic, OpenAI, Google, and more with one credential

<NeedHelp/>

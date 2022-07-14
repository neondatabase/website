---
title: Run a SQL Alchemy App
redirectFrom:
  - docs/quickstart/sqlalchemy
---

### Introduction

SQLAlchemy is among the most popular ORMs in the Python universe. Because Neon is fully compatible with vanilla PostgreSQL, you only need to fill in the correct connection details.

## Prerequisites

To complete this section, you will need to already have the following:

- Created a Project on Neon Cloud service
- Have SQLAlchemy installed with a PostgresSQL driver (such as psycopg2, the default driver for PostgreSQL in SQLAlchemy)
  - Use the following guide for installation details on [SQLAlchemy](https://docs.sqlalchemy.org/en/14/intro.html#installation) and [psycopg2](https://www.psycopg.org/docs/install.html).

## Create SQLAlchemy engine pointing to the Neon Project

SQLALchemy uses Engine abstraction to manage database connections and exposes a `create_engine` function as the primary endpoint for engine initialization.

See the following example on how to create SQLAlchemy engine pointing to the Neon Project:

```python
from sqlalchemy import create_engine

USERNAME = # Your GitHub username
PASSWORD = # Password generated in "Connection Details" tab
PROJECT_ID = # Name of your project
CONNSTR = f'postgresql://{USERNAME}:{PASSWORD}@{PROJECT_ID}.cloud.neon.tech/main'

engine = create_engine(CONNSTR)
```

## References

- [Establishing Connectivity - the Engine](https://docs.sqlalchemy.org/en/14/tutorial/engine.html)
- [Connecting to PostgreSQL with SQLAlchemy](https://docs.sqlalchemy.org/en/14/core/engines.html#postgresql)

## Using from Python + psycopg2

Psycopg2 is the most popular python library for running raw postgres queries. If you are interested in a higher-level ORM on top of psycopg2, see our guides on [SQLAlchemy](#using-from-sqlalchemy) and [Django](#using-from-django).

This step will cover how to get started with writing postgres queries against Neon via psycopg2.

First, register on the Neon cloud service and create a Project.

Next, navigate to your Project on [console.neon.tech](https://console.neon.tech/).

Then, install psycopg2. You may also need psycopg2-binary depending on your system. To install psycopg2-binary, You can run `pip install psycopg2 psycopg2-binary` or use a dependency manager like [Poetry](https://python-poetry.org/) to do the same.

Finally, run the “hello neon” program:

```python
import psycopg2

# Optional: tell psycopg2 to cancel the query on Ctrl-C
import psycopg2.extras; psycopg2.extensions.set_wait_callback(psycopg2.extras.wait_select)

# NOTE: the password can be set to None if it's specified in the ~/.pgpass file
USERNAME = "<your-username>"
PASSWORD = "<your-password>"
HOST = "pg.neon.tech"
PORT = "5432"
PROJECT = "main"

conn = psycopg2.connect(
 host=HOST,
 port=PORT,
 user=USERNAME,
 password=PASSWORD,
 database=PROJECT)

with conn.cursor() as cur:
 cur.execute("SELECT 'hello neon';")
 print(cur.fetchall())
```

_Note: This example was tested with Python 3 and psycopg2 version 2.9.3._

Now, build great things with Neon! Any Postgres tutorial will be able to guide you on the syntax.

## Conclusion

In this section, you have learned how to create SQLAlchemy engine that points to your Neon Project and write Postgres queries using psycopg2.

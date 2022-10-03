---
title: Run a SQL Alchemy App
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/sqlalchemy
---

SQLAlchemy is a Python SQL toolkit and Object Relational Mapper (ORM) that provides application developers with the full power and flexibility of SQL. This topic describes how to create a Neon project and connect to it from SQLAlchemy.

**Prerequisites:**

To complete the steps in this topic, ensure that you have an SQLAlchemy installation with a PostgreSQL driver. The following instructions use `psycopg2`, the default driver for PostgreSQL in SQLAlchemy. For SQLAlchemy installation instructions, refer to the [SQLAlchemy Installation Guide](https://docs.sqlalchemy.org/en/14/intro.html#installation). `psycopg2` installation instructions are provided below.

To connect to Neon from SQLAlchemy:

1. [Create a Neon project](#create-a-neon-project)
1. [Install psycopg2](#install-psycopg2)
1. [Create the "hello neon" program](#create-the-hello-neon-program)
1. [Create an SQLAlchemy engine for your Neon project](#create-an-sqlalchemy-engine-for-your-neon-project)

## Create a Neon project

To create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Enter a name for your project and click **Create Project**.
4. After creating a project, you are directed to the Neon **Dashboard** tab, where a connection string with your password is provided under **Connection Details**. The connection string includes your password until you navigate away from the **Dashboard** tab. Copy the connection string. It contains the details required to connect to Neon from SQLAlchemy.

## Install psycopg2

Psycopg2 is a popular python library for running raw PostgreSQL queries.

For most operating systems, the quickest installation method is using the PIP package manager. For example:

```shell
pip install psycopg2-binary
```

For additional information about installing `psycopg2`, refer to the [psycopg2 installation documentation](https://www.psycopg.org/docs/install.html).


## Create the "hello neon" program

```python
import psycopg2

# Optional: tell psycopg2 to cancel the query on Ctrl-C
import psycopg2.extras; psycopg2.extensions.set_wait_callback(psycopg2.extras.wait_select)

# You can set the password to None if it is specified in a ~/.pgpass file
USERNAME = "<username>"
PASSWORD = "<password>"
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

where:

- `<username>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.

_**Note**_: This example was tested with Python 3 and psycopg2 version 2.9.3.

## Create an SQLAlchemy engine for your Neon project

SQLAlchemy uses engine abstraction to manage database connections, and exposes a `create_engine` function as the primary endpoint for engine initialization.

The following example creates an SQLAlchemy engine that points to your Neon project:

```python
from sqlalchemy import create_engine

USERNAME = <username>
PASSWORD = <password>
PROJECT_ID = <project_id>
CONNSTR = f'postgresql://{USERNAME}:{PASSWORD}@{PROJECT_ID}.cloud.neon.tech/main'

engine = create_engine(CONNSTR)
```

where:

- `<username>` is the database user, which is found on the Neon Console **Dashboard** tab, under **Connection Details**.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.
- `<project_id>` is the ID of the Neon project, which is found on the Neon Console **Settings** tab, under **General Settings**.

For additional information about connecting from SQLAlchemy, refer to the following topics in the SQLAlchemy documentation:

- [Establishing Connectivity - the Engine](https://docs.sqlalchemy.org/en/14/tutorial/engine.html)
- [Connecting to PostgreSQL with SQLAlchemy](https://docs.sqlalchemy.org/en/14/core/engines.html#postgresql)
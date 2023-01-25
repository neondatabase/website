---
title: Connect an SQLAlchemy application to Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/sqlalchemy
  - /docs/integrations/sqlalchemy
---

SQLAlchemy is a Python SQL toolkit and Object Relational Mapper (ORM) that provides application developers with the full power and flexibility of SQL. This guide describes how to create a Neon project and connect to it from SQLAlchemy.

**Prerequisites:**

To complete the steps in this topic, ensure that you have an SQLAlchemy installation with a PostgreSQL driver. The following instructions use `psycopg2`, the default driver for PostgreSQL in SQLAlchemy. For SQLAlchemy installation instructions, refer to the [SQLAlchemy Installation Guide](https://docs.sqlalchemy.org/en/14/intro.html#installation). `psycopg2` installation instructions are provided below.

To connect to Neon from SQLAlchemy:

1. [Create a Neon project](#create-a-neon-project)
1. [Install psycopg2](#install-psycopg2)
1. [Create the "hello neon" program](#create-the-hello-neon-program)
1. [Create an SQLAlchemy engine for your Neon project](#create-an-sqlalchemy-engine-for-your-neon-project)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify a name, a PostgreSQL version, a region, and click **Create Project**.

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
PROJECT = "neondb"

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

- `<username>` is the database user.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.

You can find all of the connection details mentioned above, except for your password, in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](../../connect/connect-from-any-app). If you have misplaced your password, see [Reset a password](../../manage/users/#reset-a-password).

<Admonition type="note">
This example was tested with Python 3 and psycopg2 version 2.9.3.
</Admonition>

## Create an SQLAlchemy engine for your Neon project

SQLAlchemy uses engine abstraction to manage database connections, and exposes a `create_engine` function as the primary endpoint for engine initialization.

The following example creates an SQLAlchemy engine that points to your Neon branch:

```python
from sqlalchemy import create_engine

USERNAME = <username>
PASSWORD = <password>
ENDPOINT = <endpoint_hostname>
CONNSTR = f'postgresql://{USERNAME}:{PASSWORD}@{ENDPOINT}/neondb'

engine = create_engine(CONNSTR)
```

where:

- `<username>` is the database user.
- `<password>` is the database user's password, which is provided to you when you create a Neon project.
- `<endpoint_hostname>` the hostname of the branch endpoint. The endpoint hostname has an `ep-` prefix and appears similar to this: `ep-tight-salad-272396.us-east-2.aws.neon.tech`.

You can find all of the connection details listed above, except for your password, in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](../../connect/connect-from-any-app). If you have misplaced your password, see [Reset a password](../../manage/users/#reset-a-password).

For additional information about connecting from SQLAlchemy, refer to the following topics in the SQLAlchemy documentation:

- [Establishing Connectivity - the Engine](https://docs.sqlalchemy.org/en/14/tutorial/engine.html)
- [Connecting to PostgreSQL with SQLAlchemy](https://docs.sqlalchemy.org/en/14/core/engines.html#postgresql)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).

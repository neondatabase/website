---
title: Run a SQL Alchemy App
---

SQLAlchemy is among the most popular ORMs in the Python universe. Because Neon is fully compatible with vanilla PostgreSQL, you only need to fill in the correct connection details.

Prerequisites:

Here we assume that you have already created a project on Neon cloud service and have sqlalchemy installed with a PostgreSQL driver (example assumes psycopg2 - the default one for PostgreSQL in SQLAlchemy). For installation details see corresponding pages for [SQLAlchemy](https://docs.sqlalchemy.org/en/14/intro.html#installation) and [psycopg2](https://www.psycopg.org/docs/install.html).

SQLALchemy uses Engine abstraction to manage database connections and exposes a `create_engine` function as the primary endpoint for engine initialization. See the following example on how to create SQLAlchemy engine pointing to the Neon Project.

```python
from sqlalchemy import create_engine

USERNAME = # Your GitHub username
TOKEN = # Token generated in "Connection Details" tab
DBNAME = # Name of your project
CONNSTR = f'postgresql://{USERNAME}@neon:{TOKEN}@start.stage.neon.tech/{DBNAME}

engine = create_engine(CONNSTR)
```

References:

- [Establishing Connectivity - the Engine](https://docs.sqlalchemy.org/en/14/tutorial/engine.html)
- [Connecting to PostgreSQL with SQLAlchemy](https://docs.sqlalchemy.org/en/14/core/engines.html#postgresql)

### Using from python + psycopg2

Psycopg2 is the most popular python library for running raw postgres queries. If you’re interested in a higher-level ORM on top of psycopg2, see our guides on [SQLAlchemy](#using-from-sqlalchemy) and [Django](#using-from-django).

To get started writing postgres queries against neon via psycopg2:

1. Register on Neon cloud service and create a project
2. Navigate to your Project on console.neon.tech and find the Postgres Username and access token in the “Connection Details” section. The Postgres Username should end with @neon.
3. Install psycopg2. You might also need psycopg2-binary depending on your system. You can run “pip install psycopg2 psycopg2-binary” or use a dependency manager like poetry to do the same.
4. Run the “hello neon” program:

```python
import psycopg2

# Optional: tell psycopg2 to cancel the query on Ctrl-C
import psycopg2.extras; psycopg2.extensions.set_wait_callback(psycopg2.extras.wait_select)

# NOTE: the password can be set to None if it's specified in the ~/.pgpass file
USERNAME = "<your-username>"
ACCESS_TOKEN = "<your-access-token>"
HOST = "pg.neon.tech"
PORT = "5432"
PROJECT = "main"

conn = psycopg2.connect(
 host=HOST,
 port=PORT,
 user=USERNAME,
 password=ACCESS_TOKEN,
 database=PROJECT)

with conn.cursor() as cur:
 cur.execute("SELECT 'hello neon';")
 print(cur.fetchall())
```

5. Build great things with Neon! Any postgres tutorial will be able to guide you on the syntax.

Note: This example was tested with python 3 and psycopg2 version 2.9.3

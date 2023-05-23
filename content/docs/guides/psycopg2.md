---
title: Connect from Python application to Neon using pycopg2
subtitle: Set up a Neon project in seconds and connect from a Node.js application
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/node
  - /docs/integrations/node
---

This guide describes how to create a Neon project and connect to it from a simple Python application that uses `psycopg2`.

To connect to Neon from a Python application using `psycopg2`:

1. [Create a Neon Project](#create-a-neon-project)
2. [Create a Python project](#create-a-python-project)
3. [Store your Neon credentials](#store-your-neon-credentials)
4. [Configure your Python script](#configure-your-python-script)
5. [Test your connection](#test-your-connection)

## Create a Neon project

If you do not have one already, create a Neon project.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a Python project

1. Create a project directory and change to the newly created directory.

   ```shell
   mkdir neon-python-example
   cd neon-python-example
   ```

2. Set up a Python virtual environment in this directory. This will help isolate your project's Python environment (including installed packages) from the rest of your system.

   ```bash
   python3 -m venv env
   ```

3. Activate the virtual environment. When the virtual environment is activated, Python will use this environment's version of Python and any installed packages.

   ```bash
   source env/bin/activate
   ```

4. Install `psycopg2` and `python-dotenv`. You can install them using `pip`:

```bash
pip install psycopg2-binary python-dotenv
```

## Store your Neon credentials

Add a `.env` file to your project's root directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](../connect/connect-from-any-app).

Your connection string will look something like this:

<CodeBlock shouldWrap>

```shell
DATABASE_URL=postgres://<users>:<password>@ep-snowy-unit-550577.us-east-2.aws.neon.tech/neondb
```

</CodeBlock>

<Admonition type="important">
To ensure the security of your data, never expose your Neon credentials to the browser.
</Admonition>

## Configure your python script

Add a `neon-connect.py` file to your project directory and add the following code snippet to connect to your Neon database using the `psycopg2` client. The script connects to your Neon database and retrives the current time and PostgreSQL version.

```python
import os
import psycopg2
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Get the connection string from the environment variable
connection_string = os.getenv('DATABASE_URL')

# Connect to the PostgreSQL database
conn = psycopg2.connect(connection_string)

# Create a cursor object
cur = conn.cursor()

# Execute SQL commands to retrieve the current time and version from PostgreSQL
cur.execute('SELECT NOW();')
time = cur.fetchone()[0]

cur.execute('SELECT version();')
version = cur.fetchone()[0]

# Close the cursor and connection
cur.close()
conn.close()

# Print the results
print('Current time:', time)
print('PostgreSQL version:', version)
```

## Test your connection

Run `neon-connect.py` script to test your connection.

```shell
python3 neon-connect.py
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
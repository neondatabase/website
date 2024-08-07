---
title: Azure Data Studio Notebooks
subtitle: Use Azure Data Studio Notebooks with Neon for vector similarity search
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.634Z'
---

A Jupyter Notebook is an open-source web application that allows you to create and share documents containing live code, equations, visualizations, and narrative text. Azure Data Studio supports Jupyter Notebooks, enabling users to combine SQL queries, Python code, and markdown text in a single interactive document.

This guide describes how to create a new python notebook in Azure Data Studio, connect to a Neon database, install the `pgvector` extension to enable Neon as a vector store, and run a vector search query.

## Prerequisites

To perform the steps in this guide, you will require:

- Azure Data Studio - Download the latest version of Azure Data Studio for your operating system [here](https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio).

- A Neon account - If you do not have one, sign up at [Neon](https://console.neon.tech/signup). Your Neon project comes with a ready-to-use Postgres database named `neondb`. You can use it, or create your own by following the instructions [here](/docs/manage/databases#create-a-database).

## Retrieve your Neon database connection string

In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

## Create a notebook

1. Go to the **File** menu for Azure Data Studio and select **New Notebook**.
2. Select **Python 3** for the Kernel and set **Attach to** to "localhost" where it can access your Python installation.

You can save the notebook using the **Save** or **Save as...** command from the **File** menu.

## Configure Python for Notebooks

The first time you connect to the Python kernel in a notebook, the **Configure Python for Notebooks** page is displayed. You can select either:

- **New Python installation** to install a new copy of Python for Azure Data Studio, or
- **Use existing Python installation** to specify the path to an existing Python installation for Azure Data Studio to use

To view the location and version of the active Python kernel, you can create a code cell and run the following Python commands:

```python
import os
import sys
print(sys.version_info)
print(os.path.dirname(sys.executable))
```

## Running a code cell

You can create cells containing Python code that you can run in place by clicking the **Run cell** button (the round blue arrow) to the left of the cell. The results are shown in the notebook after the cell finishes running. In the `pgvector` example that follows, you'll add and execute several code cells.

## pgvector example

After you've set up Azure Data Studio and have created a notebook, you can use the following basic example to get started with Neon and `pgvector`.

### Install the psycopg driver

psycopg is a popular Postgres database adapter for the Python programming language. It allows Python applications to connect to and interact with Postgres databases.

Install the `psycopg` adapter by adding and executing the following code cell:

```python
!pip install psycopg
```

### Connect to your database

1. In your notebook, create a code block to define your Neon database connection and create a cursor object. Replace `postgresql://[user]:[password]@[neon_hostname]/[dbname]` with the database connection string you retrieved previously.

   ```python shouldWrap
   import os
   import psycopg

   # Provide your Neon connection string
   connection_string = "postgresql://[user]:[password]@[neon_hostname]/[dbname]"

   # Connect using the connection string
   connection = psycopg.connect(connection_string)

   # Create a new cursor object
   cursor = connection.cursor()
   ```

2. Execute the code block.

3. Add a code block for testing the database connection.

   ```python
   # Execute this query to test the database connection
   cursor.execute("SELECT 1;")
   result = cursor.fetchone()

   # Check the query result
   if result == (1,):
       print("Your database connection was successful!")
   else:
       print("Your connection failed.")
   ```

4. Execute the code block.

### Install the pgvector extension

1. Create a codeblock to install the `pgvector` extension to enable your Neon database as a vector store:

   ```python
   # Execute this query to install the pgvector extension
   cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
   ```

2. Execute the code block.

### Create a table and add vector data

1. Add a code block to create a table and insert data:

   ```python shouldWrap
   create_table_sql = '''
   CREATE TABLE items (
   id BIGSERIAL PRIMARY KEY,
   embedding VECTOR(3)
   );
   '''

   # Insert data
   insert_data_sql = '''
   INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]'), ('[7,8,9]');
   '''

   # Execute the SQL statements
   cursor.execute(create_table_sql)
   cursor.execute(insert_data_sql)

   # Commit the changes
   connection.commit()
   ```

2. Execute the code block.

### Query your data

1. Add a codeblock to perform a vector similarity search.

   ```python shouldWrap
   cursor.execute("SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 1;")
   all_data = cursor.fetchall()
   print(all_data)
   ```

2. Execute the code block.

### Next steps

For more information about using Neon with `pgvector`, see [The pgvector extension](/docs/extensions/pgvector).

<NeedHelp/>

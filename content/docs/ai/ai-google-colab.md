---
title: Google Colab
subtitle: Use Google Colab with Neon for vector similarity search
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.637Z'
---

[Google Colab](https://colab.research.google.com/) is a hosted Jupyter Notebook service that requires no setup to use and provides free access to computing resources, including GPUs and TPUs.
You can use Google Colab to run python code through the browser.

This guide shows how to create a notebook in Colab, connect to a Neon database, install the `pgvector` extension to enabled Neon as a vector store, and run a vector search query.

## Prerequisites

To perform the steps in this guide, you require a Neon database for storing vectors. You can use the ready-to-use `neondb` database or create your own. See [Create a database](/docs/manage/databases#create-a-database) for instructions.

## Retrieve your database connection string

In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

## Create a notebook

In your browser, navigate to [Google Colab](https://colab.research.google.com/), and click **New notebook**.

![Google Colab](/docs/ai/google_colab.png)

Alternatively, you can open a predefined Google Colab notebook for this guide by clicking the **Open in Colab** button below.

<a target="_blank" href="https://colab.research.google.com/github/neondatabase/neon-google-colab-notebooks/blob/main/neon_pgvector_quickstart.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>

## Connect to your database

1. In your Colab notebook, create a code block to define your database connection and create a cursor object. Replace `postgresql://[user]:[password]@[neon_hostname]/[dbname]` with the database connection string you retrieved in the previous step.

   ```python shouldWrap
   import os
   import psycopg2

   # Provide your Neon connection string
   connection_string = "postgresql://[user]:[password]@[neon_hostname]/[dbname]"

   # Connect using the connection string
   connection = psycopg2.connect(connection_string)

   # Create a new cursor object
   cursor = connection.cursor()
   ```

2. Execute the code block (**Ctrl** + **Enter**).

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

4. Execute the code block (**Ctrl** + **Enter**).

## Install the pgvector extension

1. Create a codeblock to install the `pgvector` extension to enable your Neon database as a vector store:

   ```python
   # Execute this query to install the pgvector extension
   cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
   ```

2. Execute the code block (**Ctrl** + **Enter**).

## Create a table and add vector data

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

2. Execute the code block (**Ctrl** + **Enter**).

## Query your data

1. Add a codeblock to perform a vector similarity search.

   ```python shouldWrap
   cursor.execute("SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 3;")
   all_data = cursor.fetchall()
   print(all_data)
   ```

2. Execute the code block (**Ctrl** + **Enter**).

## Next steps

For more information about using Neon with `pgvector`, see [The pgvector extension](/docs/extensions/pgvector).

<NeedHelp/>

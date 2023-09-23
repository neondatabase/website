---
title: Google Colab
subtitle: Use Google Colab with your Neon vector store
enableTableOfContents: true
---

Google Colab is a hosted Jupyter Notebook service that requires no setup to use and provides free access to computing resources, including GPUs and TPUs.
You can use Google Colab to run python code through the browser.

This guide provides a simple example that shows how to create a notebook in Colab, connect to a Neon database, install the `pgvector` extension to enabled Neon as a vector store, and load and query data.

## Prerequisites

- A Neon database for storing vectors. You can use the ready-to-use `neondb` database or create your own. See [Create a database](/docs/manage/create-a-database) for instructions.

## Retrieve your database connection string

In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

## Create a notebook

In your browser, navigate to [Google Colab](https://colab.research.google.com/) and Click **New notebook**.

![Google Colab](/docs/ai/google_colab.png)

## Connect to your database

1. In your Colab notebook, create a code block and add the following code to define your database connection and create a cursor object:

    ```python
    import os
    import psycopg2

    # Replace the next line with Your Neon connection string.
    connection_string = "postgres://daniel:<password>@ep-frosty-brook-74249556.us-east-2.aws.neon.tech/neondb"

    # Connect using the connection string
    connection = psycopg2.connect(connection_string)

    # Create a new cursor object
    cursor = connection.cursor()
    ```

2. Execute the code block (ctrl+enter).

3. Add another code block to test your database connection.

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

4. Execute the code block (ctrl+enter) to verify that your connection works.

## Create a table and add vector data

1. Add the following code block to create a table and insert data:

    ```python
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

2. Execute the code block (ctrl+enter).

## Query your data

Add the following codeblock to perform a vector similarity search.

```python
cursor.execute("SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 3;")
all_data = cursor.fetchall()
print(all_data)
```

## Next steps

For a more extensive Jupyter notebook example that you can try with Google Colab, refer to our [Jupyter Notebook for vector search with Neon, pgvector, and OpenAI](https://github.com/neondatabase/neon-vector-search-openai-notebooks). This notebook shows how to create a search vector using the OpenAI API and perform a similarity search on Wikipedia article vector data.

<DetailIconCards>
<a href="https://github.com/neondatabase/neon-vector-search-openai-notebooks" description="Jupyter Notebook for vector search with Neon, pgvector, and OpenAI" icon="github">Jupyter Notebook for vector search with Neon</a>
</DetailIconCards>

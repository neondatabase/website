---
title: Use Langchain with Neon
subtitle: Chat with your Neon database with Langchain
enableTableOfContents: true
---

LangChain is an open-source toolkit that enables developers to create applications that operate on Large Language Models (LLMs). It introduces a system to connect LLMs with external data sources such as personal files or online content. With LangChain, developers can sequence multiple commands to develop sophisticated applications. Essentially, it acts as a platform that facilitates running a series of prompts to achieve a desired result.

This guide shows how to connect to a Neon database, install the `pgvector` extension to enabled Neon as a vector store, use chat with your database using Langchain.

## Prerequisites

- A Neon database. You can use the ready-to-use `neondb` database or create your own. See [Create a database](/docs/manage/create-a-database) for instructions.

## Configure an environment variable for your OpenAI API key

You can use any open source models with langchain. However openai models gives better results than the open source models. Openai key is required to access langchain if you are using any openai models. This tutorial designed with the openai model. Follow the steps to create a new openai key.

1. Navigate to [https://platform.openai.com/](https://platform.openai.com/).
2 Click on your name or icon, located at the top right corner of the page, and select **View API Keys**.
3. Click on the **Create new secret key** button to create a new OpenAI API key.
4. Create a file named `.env` and add the OpenAI API key as shown:

```text
OPENAI_API_KEY=<your_openai_key>
```

## Retrieve your Neon database connection string

1. In the Neon Console, select your project to open the **Dashboard**.

2. In the **Connection Details** widget on the Neon **Dashboard**, select a branch, a user, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

## Set up your environment

1. Create and activate a virtual environment by executing the following command.

```python
python -m venv venv
source venv/bin/activate #for ubuntu
venv/Scripts/activate #for windows
```

## Install dependencies

2. Install langchain, openai, python-environ and psycopg2 libraries using pip.

```sql
pip install langchain openai python-environ psycopg2 
```

## Create you table and insert data

```python
import psycopg2

import environ
env = environ.Env()
environ.Env.read_env()

# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(
    host='localhost',
    port=5432,
    user='postgres',
    password=env('DBPASS'),
    database=env('DATABASE')
)

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

# Create the tasks table if it doesn't exist
cursor.execute('''CREATE TABLE IF NOT EXISTS tasks
             (id SERIAL PRIMARY KEY,
             task TEXT NOT NULL,
             completed BOOLEAN,
             due_date DATE,
             completion_date DATE,
             priority INTEGER)''')

# Insert sample tasks into the tasks table
cursor.execute("INSERT INTO tasks (task, completed, due_date, completion_date, priority) VALUES (%s, %s, %s, %s, %s)",
               ('Complete the web page design', True, '2023-05-01', '2023-05-03', 1))
cursor.execute("INSERT INTO tasks (task, completed, due_date, completion_date, priority) VALUES (%s, %s, %s, %s, %s)",
               ('Create login and signup pages', True, '2023-05-03', '2023-05-05', 2))
cursor.execute("INSERT INTO tasks (task, completed, due_date, completion_date, priority) VALUES (%s, %s, %s, %s, %s)",
               ('Product management', False, '2023-05-05', None, 3))
cursor.execute("INSERT INTO tasks (task, completed, due_date, completion_date, priority) VALUES (%s, %s, %s, %s, %s)",
               ('Cart and wishlist creation', False, '2023-05-08', None, 4))
cursor.execute("INSERT INTO tasks (task, completed, due_date, completion_date, priority) VALUES (%s, %s, %s, %s, %s)",
               ('Payment gateway integration', False, '2023-05-10', None, 5))
cursor.execute("INSERT INTO tasks (task, completed, due_date, completion_date, priority) VALUES (%s, %s, %s, %s, %s)",
               ('Order management', False, '2023-05-10', None, 6))

# Commit the changes and close the connection
conn.commit()
conn.close()
```

We have installed the `psycopg2` library and accessed environment variables `DBPASS` and `DATABASE` from the `.env` file. The `conn` object will establish a connection to the PostgreSQL database using `psycopg2.connect()` method. The SQL queries for creating the task table and inserting some values in it will be executed with the help of cursor object.

## Run script

To create the task table and insert values to it, run the `db.py` script using the following command.

```bash
python db.py
```

## Setup the SQL Database Chain

```python
from langchain import OpenAI, SQLDatabase, SQLDatabaseChain

import environ
env = environ.Env()
environ.Env.read_env()

API_KEY = env('OPENAI_API_KEY')

# Setup database
db = SQLDatabase.from_uri(
    f"postgresql+psycopg2://postgres:{env('DBPASS')}@localhost:5432/{env('DATABASE')}",
)

# setup llm
llm = OpenAI(temperature=0, openai_api_key=API_KEY)

# Create db chain
QUERY = """
Given an input question, first create a syntactically correct PostgreSQL query to run, and then look at the results of the query and return the answer.
Use the following format:

Question: Question here
SQLQuery: SQL Query to run
SQLResult: Result of the SQLQuery
Answer: Final answer here

{question}
"""

# Setup the database chain
db_chain = SQLDatabaseChain(llm=llm, database=db, verbose=True)


def get_prompt():
    print("Type 'exit' to quit")

    while True:
        prompt = input("Enter a prompt: ")

        if prompt.lower() == 'exit':
            print('Exiting...')
            break
        else:
            try:
                question = QUERY.format(question=prompt)
                print(db_chain.run(question))
            except Exception as e:
                print(e)

get_prompt()
```

Understanding the code:

- Import Langchain modules `OpenAI`, `SQLDatabase`, and `SQLDatabaseChain`
- Access `OPENAI_API_KEY` from the environment variables file.
- Setup the database connection using `SQLDatabase.from_uri()` method by specifying the connection URL.
- Create llm object using `OpenAI()` by specifying the `temperature` and the `openai_api_key`.
- Create the database chain object called db_chain using `SQLDatabaseChain()` by specifying the llm and database objects.
- `get_prompt()` takes user input from the console and creates a query in the format by mentioning the question as an argument. It runs the SQL database chain using `db_chain.run()` method.

## Run the app

Run the SQL database chain using the following command.

```bash
python app.py
```

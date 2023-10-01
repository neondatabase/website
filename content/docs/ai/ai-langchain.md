---
title: Use LangChain with Neon
subtitle: Chat with your Neon database using LangChain and OpenAI
enableTableOfContents: true
---

LangChain is an open-source framework for developing applications powered by Large Language Models (LLMs). It enables developers to build sophisticated AI-powered applications that use LLMs to reason about how to provide answers and take actions based on the provided context. Context includes such things as prompt instructions, example inputs and responses, and the content or data that responses should be based on.

With LangChain, you can connect LLMs with external data sources and sequence multiple commands (a series of prompts) to achieve the desired result.

This guide shows how to create a Python application that allows you to ask your database questions in natural language. The application transforms your question into an SQL query, runs the query, and returns a natural language response based on the query result. This guide uses the [Titanic Dataset](https://www.kaggle.com/datasets/vinicius150987/titanic3), found on [Kaggle](https://www.kaggle.com). The application allows you to ask questions about passengers of the Titanic. You can click here to view the data: [passenger data](https://github.com/neondatabase/postgres-sample-dbs/blob/main/titanic.csv).

A version of this application is also available for Google Colab.

<a target="_blank" href="https://colab.research.google.com/github/neondatabase/neon-google-colab-notebooks/blob/main/chat_with_your_database_using_langchain.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>

## Prerequisites

- A Neon project. If you do not have one, see [Create your first project](/docs/get-started-with-neon/setting-up-a-project).
- An OpenAI API key. You can use any open source model with LangChain, but this guide uses an OpenAI model. You will require an OpenAI API key. Instructions for obtaining an OpenAI API key are provided below.
- Python and `pip`.

## Obtain an OpenAI API key

This guide is designed to use an OpenAI model. To use an OpenAI model, an OpenAI API key is required. If you do not have an OpenAI API key, follow these steps to create one:

1. Navigate to [https://platform.openai.com/](https://platform.openai.com/).
2. Click on your name or icon, located at the top right corner of the page, and select **View API Keys**.
3. Click on the **Create new secret key** button to create a new OpenAI API key.

## Create a directory for your application

```bash
mkdir titanic_app
cd titanic_app
```

## Set up your environment

Create and activate a Python virtual environment in your application directory by executing the following command:

```python
python -m venv venv
```

## Install dependencies

Install `LangChain`, `openai`, `python-environ`, `psycopg2`, `environ`, and `requests` libraries using `pip`.

```sql
pip install LangChain LangChain-experimental openai python-environ psycopg2 
```

## Create a database in Neon

In Neon, create a database named `titanic`. You can do this from the Neon console by following these steps:

1. Navigate to the [Neon Console](https://console.neon.tech).
1. Select a project.
1. Select **Databases**.
1. Select the branch where you want to create the database.
1. Click **New Database**.
1. Enter `titanic` as the database name, and select a database owner.
1. Click **Create**.

## Retrieve your database connection string

Retrieve the connection string for your `titanic` database. You can copy it from the **Connection Details** widget on the Neon **Dashboard**. It will look something like this:

```text
postgres://<users>:<password>@ep-morning-limit-06265452.us-east-2.aws.neon.tech/titanic
```

## Set up your environment variables

Create a `.env` file in your application directory and configure variables for your OpenAI API key and database connection string:

```text
OPENAI_API_KEY=<your_openai_api_key>
DATABASE_URL="postgres://<users>:<password>@ep-morning-limit-06265452.us-east-2.aws.neon.tech/titanic"
```

## Create a table and insert data

Create a file named `db.py` in your application directory and add the following code to connect to your database, create a `passenger` table, and load the `passenger` table with data from a `titanic.csv` file that is hosted on GitHub.

```python
import os
import psycopg2
import environ
import requests
import io

# 1. Setup and read the .env file
env = environ.Env()
environ.Env.read_env()

# 2. Establish a connection to the PostgreSQL database
connection_string = env('DATABASE_URL')
conn = psycopg2.connect(connection_string)
cursor = conn.cursor()

# 3. Create the passenger table if it doesn't already exist
table_creation_sql = """
CREATE TABLE IF NOT EXISTS public.passenger (
    passengerid integer NOT NULL,
    survived double precision,
    pclass integer,
    name text,
    sex text,
    age double precision,
    sibsp integer,
    parch integer,
    ticket text,
    fare double precision,
    cabin text,
    embarked text,
    wikiid double precision,
    name_wiki text,
    age_wiki double precision,
    hometown text,
    boarded text,
    destination text,
    lifeboat text,
    body text,
    class integer
);
"""
cursor.execute(table_creation_sql)

# 4. Download the titanic.csv file from GitHub
url = "https://github.com/neondatabase/postgres-sample-dbs/raw/main/titanic.csv"
response = requests.get(url)
response.raise_for_status()

# Use StringIO to convert text data into file-like object so it can be read into the database
csv_file = io.StringIO(response.text)

# 5. Load the data from the titanic.csv into the passenger table
copy_command = '''
COPY public.passenger (passengerid, survived, pclass, name, sex, age, sibsp, parch, ticket, fare, cabin, embarked, wikiid, name_wiki, age_wiki, hometown, boarded, destination, lifeboat, body, class)
FROM STDIN WITH (FORMAT CSV, HEADER true, DELIMITER ',');
'''
cursor.copy_expert(copy_command, csv_file)

# 6. Commit any changes and close the connection
conn.commit()
conn.close()
```

<details>
<summary>Understanding the db.py code</summary>

- **Importing Necessary Modules**:
  - `os`: Allows interaction with the operating system, mainly to access environment variables.
  - `psycopg2`: The PostgreSQL adapter for Python. It provides methods to connect and interact with the PostgreSQL database.
  - `environ`: A module to manage environment variables and `.env` files.
  - `requests`: Enables the app to make HTTP requests, specifically to fetch the `titanic.csv` from GitHub.
  - `io`: Provides support for various types of I/O operations. In this case, it's used to read the downloaded CSV data.

- **Setup and Read the .env File**:
  - This section uses the `environ` module to load environment variables from a `.env` file.

- **Establish a Connection to the PostgreSQL Database**:
  - A connection string is constructed from the environment variable `DATABASE_URL`.
  - `psycopg2.connect()` is used to establish a connection to the PostgreSQL database using the provided connection string.
  - A cursor object is created, which will be used to execute SQL commands.

- **Create the `passenger` Table**:
  - A SQL command to create the `passenger` table is defined. The `IF NOT EXISTS` clause ensures the table is only created if it doesn't already exist.
  - The command is then executed using the `cursor.execute()` method.

- **Download the `titanic.csv` File from GitHub**:
  - The app uses the `requests` module to download the `titanic.csv` file from a GitHub URL.
  - If there's an issue with the download, `response.raise_for_status()` will raise an exception.

- **Prepare the Downloaded Data for Loading**:
  - The `io.StringIO` function is used to create a file-like object from the downloaded CSV data. This allows the app to treat the in-memory data as if it were a file.

- **Load the Data from the `titanic.csv` into the `passenger` Table**:
  - A PostgreSQL `COPY` command is defined. This command specifies the table, columns, and format of the incoming data.
  - The `cursor.copy_expert()` method is used to execute the `COPY` command and load the CSV data into the database.

- **Commit Changes and Close the Connection**:
  - Any pending database changes are committed using `conn.commit()`.
  - Finally, the connection to the database is closed with `conn.close()`.

</details>

## Run the db.py script

Run the `db.py` script using the following command:

```bash
python db.py
```

You can verify that the data was loaded by viewing the data in the Neon console. Select **Tables** from the sidebar, and navigate to the `titanic` database.

## Setup the SQL database chain

Create a file named `app.py` in your application directory and add the following code. When you run `app.py`, you will be prompted for a question to ask your database.

```python
import os
import environ
import psycopg2
from urllib.parse import urlparse
from langchain.utilities import SQLDatabase
from langchain.llms import OpenAI
from langchain_experimental.sql import SQLDatabaseChain
from langchain.prompts import PromptTemplate

# Set up and read the .env file
env = environ.Env()
environ.Env.read_env()

# Extract connection details from the .env file
connection_string = env('DATABASE_URL')
parsed_uri = urlparse(connection_string)
username = parsed_uri.username
password = parsed_uri.password
host = parsed_uri.hostname
port = parsed_uri.port or 5432
database = parsed_uri.path[1:]  # remove leading '/'

# Setup database
db = SQLDatabase.from_uri(
    f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{database}"
)

# Setup llm
llm = OpenAI(temperature=0, openai_api_key=os.environ["OPENAI_API_KEY"])

# Define table_info and few_shot_examples
table_info = """public.passenger (
    passengerid integer NOT NULL,
    survived double precision,
    pclass integer,
    name text,
    sex text,
    age double precision,
    sibsp integer,
    parch integer,
    ticket text,
    fare double precision,
    cabin text,
    embarked text,
    wikiid double precision,
    name_wiki text,
    age_wiki double precision,
    hometown text,
    boarded text,
    destination text,
    lifeboat text,
    body text,
    class integer
)"""

few_shot_examples = """
- Question: "How many passengers survived?"
  SQLQuery: "SELECT COUNT(*) FROM public.passenger WHERE survived = 1;"

- Question: "What was the average age of passengers?"
  SQLQuery: "SELECT AVG(age) FROM public.passenger;"

- Question: "How many male and female passengers were there?"
  SQLQuery: "SELECT sex, COUNT(*) FROM public.passenger GROUP BY sex;"

- Question: "Which passenger had the highest fare?"
  SQLQuery: "SELECT name, fare FROM public.passenger WHERE fare IS NOT NULL ORDER BY fare DESC LIMIT 1;"

- Question: "How many passengers boarded from each location?"
  SQLQuery: "SELECT embarked, COUNT(*) FROM public.passenger GROUP BY embarked;"

- Question: "Who is the oldest passenger and what was their age?"
  SQLQuery: "SELECT name, age FROM public.passenger WHERE age IS NOT NULL ORDER BY age DESC LIMIT 1;"
"""

# Define Custom Prompt
TEMPLATE = """Given an input question, first create a syntactically correct {dialect} query to run, then look at the results of the query and return the answer.
Use the following format:

Question: "Question here"
SQLQuery: "SQL Query to run"
SQLResult: "Result of the SQLQuery"
Answer: "Final answer here"

Only use the following tables:

{table_info}

Some examples of SQL queries that correspond to questions are:

{few_shot_examples}

Question: {input}"""

CUSTOM_PROMPT = PromptTemplate(
    input_variables=["input", "few_shot_examples", "table_info", "dialect"], template=TEMPLATE
)

# Setup the database chain
db_chain = SQLDatabaseChain(llm=llm, database=db, verbose=True)

def get_prompt():
    print("Type 'exit' to quit")
    while True:
        prompt = input("Ask a question or type exit to quit: ")

        if prompt.lower() == 'exit':
            print('Exiting...')
            break
        else:
            try:
                question = CUSTOM_PROMPT.format(
                    input=prompt,
                    few_shot_examples=few_shot_examples,
                    table_info=table_info,
                    dialect="PostgreSQL"
                )
                print(db_chain.run(question))
            except Exception as e:
                print(e)

get_prompt()
```

<details>
<summary>Understanding the app.py code</summary>

- **Importing Necessary Modules**:
  - `os`: Provides a portable way of using operating system-dependent functionality, mainly for accessing environment variables.
  - `psycopg2`: The PostgreSQL adapter for Python, allowing interaction with the PostgreSQL database.
  - `environ`: Used to manage environment variables and `.env` files.
  - `urlparse`: Part of Python's standard library for parsing URLs.
  - `langchain` related imports: A suite of utilities and modules for querying the database using natural language.

- **Setup and Read the .env File**:
  - The `environ` module is used to read environment variables, specifically the database connection details, from a `.env` file.

- **Extract Connection Details from the .env File**:
  - The connection string is retrieved from the `.env` file and parsed to extract database connection details like username, password, host, port, and database name.

- **Setup Database Connection**:
  - The `SQLDatabase.from_uri()` method from the `langchain.utilities` module establishes a connection to the PostgreSQL database using the extracted details.

- **Setup Language Learning Model (llm)**:
  - An instance of `OpenAI` from `langchain.llms` is created, with certain parameters like temperature. It also requires an API key, which is fetched from the environment variables.

- **Defining Table Information and Few Shot Examples**:
  - This section provides context for the language model. It describes the table structure and gives a few examples of questions and their corresponding SQL queries.

- **Defining Custom Prompt**:
  - The `TEMPLATE` provides a format that the language model should adhere to when processing input questions. 
  - `CUSTOM_PROMPT` is an instance of `PromptTemplate` that formats the TEMPLATE using the provided input variables.

- **Setting up the Database Chain**:
  - `SQLDatabaseChain` initializes the chain between the language learning model and the SQL database. This chain is responsible for processing the user's questions and fetching answers from the database.

- **Interactive Prompt Function**:
  - The `get_prompt()` function initiates an interactive session for the user to ask questions. 
  - For each question, the app tries to formulate an SQL query using the language model, executes the query on the database, and returns the answer.
  - If the user types "exit", the loop breaks, and the session ends.

- **Start the Interactive Session**:
  - The last line calls the `get_prompt()` function, starting the interactive session when the script is run.

</details>

## Run the application

Run the application using the following command. When prompted, ask your `titanic` database a question like, "How many passengers survived?" or "What was the average age of passengers?".

```bash
python app.py
```

## Reference

[LangChain: SQL](https://python.LangChain.com/docs/use_cases/qa_structured/sql)

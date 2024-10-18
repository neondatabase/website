---
title: 'PostgreSQL Python: Connect to PostgreSQL Database Server'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-python/connect/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to connect to the PostgreSQL server in Python using the `psycopg2` package.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Creating a virtual environment

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open the Command Prompt on Windows or Terminal on Unix-like systems.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, create a new directory to store the project files such as `suppliers`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
mkdir suppliers
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, [create a new virtual environment](https://www.pythontutorial.net/python-basics/python-virtual-environments/) called `venv` using the built-in `venv` module:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
python -m venv venv
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, activate the virtual environment on Windows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
venv/scripts/activate
```

<!-- /wp:code -->

<!-- wp:paragraph -->

on Unix-like systems:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
source venv/bin/activate
```

<!-- /wp:code -->

<!-- wp:heading -->

## Installing the psycopg2 module

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, install the `psycopg2` package using the following `pip` command:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
pip install psycopg2
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, create the `requirements.txt` file:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
pip freeze > requirements.txt
```

<!-- /wp:code -->

<!-- wp:heading -->

## Creating a new database

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [connect to the PostgreSQL server](https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/) using the `psql` client tool:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [create a new database](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/) called `suppliers`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE DATABASE suppliers;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, exit the `psql`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
exit
```

<!-- /wp:code -->

<!-- wp:heading -->

## Connecting to the PostgreSQL database from Python

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a configuration file called `database.ini` in the project directory to store database connection parameters:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
[postgresql]
host=localhost
database=suppliers
user=YourUsername
password=YourPassword
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the `database.ini` file, you need to replace the `YourUsername` and `YourPassword` with the real ones.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, create a new file called `config.py` in the project directory and define a function called `load_config()` that reads configuration data from the `database.ini` file:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
from configparser import ConfigParser

def load_config(filename='database.ini', section='postgresql'):
    parser = ConfigParser()
    parser.read(filename)

    # get section, default to postgresql
    config = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            config[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return config

if __name__ == '__main__':
    config = load_config()
    print(config)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `config.py` module uses the built-in `configparser` module to read data from the `database.ini` file.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

By using the `database.ini`, you can change the PostgreSQL connection parameters when moving the code to different environments such as testing or production.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Notice that if you git source control, you need to add the `database.ini` to the `.gitignore` file to avoid committing sensitive information to a public repository like GitHub:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
database.ini
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create a new file called `connect.py` that uses the `config.py` module to read the database configuration and connect to the PostgreSQL:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
import psycopg2
from config import load_config

def connect(config):
    """ Connect to the PostgreSQL database server """
    try:
        # connecting to the PostgreSQL server
        with psycopg2.connect(**config) as conn:
            print('Connected to the PostgreSQL server.')
            return conn
    except (psycopg2.DatabaseError, Exception) as error:
        print(error)


if __name__ == '__main__':
    config = load_config()
    connect(config)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To connect to the `suppliers` database, you use the `connect()` function of the `psycopg2` module.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `connect()` function creates a new database session and returns a new instance of the `connection` class.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To call the `connect()` function, you specify the PostgreSQL database parameters as a connection string and pass it to the function like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
conn = psycopg2.connect("dbname=suppliers user=YourUsername password=YourPassword")
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Alternatively, you can use keyword arguments:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
conn = psycopg2.connect(
    host="localhost",
    database="suppliers",
    user="YourUsername",
    password="YourPassword"
)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following is the list of the connection parameters:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `database`: the name of the database that you want to connect.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `user`: the username used to authenticate.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `password`: password used to authenticate.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `host`: database server address e.g., localhost or an IP address.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `port`: the port number that defaults to 5432 if it is not provided.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Since we use the `config.py` module, we can pass the configuration to the `connect()` function and unpack it using the `**` operator:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
with psycopg2.connect(**config) as conn:
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `with` statement automatically closes the database connection so you don't have to call the `close()` method explicitly.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Executing the connect.py module

<!-- /wp:heading -->

<!-- wp:paragraph -->

To execute the `connect.py` file, you use the following command:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
python connect.py
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
Connected to the PostgreSQL server.
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that you have successfully connected to the PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

[Download the project source code](https://www.postgresqltutorial.com/wp-content/uploads/2024/01/connect.zip)

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `psycopg2` package to connect to the PostgreSQL server from Python.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Call the `connect()` function of the `psycopg2` module to connect to the PostgreSQL server.
- <!-- /wp:list-item -->

<!-- /wp:list -->

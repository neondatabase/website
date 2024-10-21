---
modifiedAt: 2024-01-29 06:45:56
prevPost: plpgsql-record-types
nextPost: postgresql-and-operator
createdAt: 2020-08-03T03:38:42.000Z
title: 'PostgreSQL Python: Call PostgreSQL Functions'
redirectFrom: 
            - /postgresql/postgresql-python/postgresql-python-call-postgresql-functions
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to call PostgreSQL functions from a Python program.

This tutorial picks up from where the [Transaction Tutorial](/postgresql/postgresql-python/transaction) left off.

## Calling a PostgreSQL function in Python

To call a PostgreSQL function from a Python program, you use the following steps:

First, [create a new database connection](/postgresql/postgresql-python/connect) to the PostgreSQL server by calling the `connect()` function of the `psycopg2` module.

```
conn = psycopg2.connect(config)
```

The `connect()` method returns a new instance of the `connection` class.

Next, create a new cursor by calling the `cursor()` method of the `connection` object.

```
cur = conn.cursor()
```

Then, pass the name of the function and the optionally pass values to the `callproc()` method of the `cursor` object:

```
cur.callproc('function_name', (value1,value2))
```

Internally, the `callproc()` method translates the function call and input values into the following statement:

```sql
SELECT * FROM function_name(value1,value2);
```

Therefore, you can use the `execute()` method of the `cursor` object to call a function as follows:

```
cur.execute("SELECT * FROM function_name( %s,%s); ",(value1,value2))
```

Both statements have the same effect.

After that, process the result set returned by the function using the `fetchone()`, `fetchall()`, or `fetchmany()` method.

Finally, call the `close()` method of the `cursor` and `connection` objects to close the communication with the PostgreSQL database server:

```
cur.close()
conn.close()
```

## Calling a PostgreSQL function example

Let's take an example of calling a PostgreSQL function from Python.

### 1) Create a new function

First, open the Command Prompt on Windows or Terminal on Unix-like systems and connect to the `suppliers` database:

```
psql -U postgres -d suppliers
```

Second, execute the following command to create a new function called `get_parts_by_vendors()` that returns a list of parts by a specified vendor:

```sql
CREATE OR REPLACE FUNCTION get_parts_by_vendor(id INTEGER)
  RETURNS TABLE(part_id INTEGER, part_name VARCHAR) AS
$$
BEGIN
 RETURN QUERY

 SELECT parts.part_id, parts.part_name
 FROM parts
 INNER JOIN vendor_parts on vendor_parts.part_id = parts.part_id
 WHERE vendor_id = id;

END; $$

LANGUAGE plpgsql;
```

Notice that you can use any PostgreSQL client tools to create a function such as pgAdmin.

### 2) Create call_function.py module

First, create a new module in the project directory called `call_function.py`:

Second, define a new function called `get_parts()` that calls the `get_parts_by_vendors()` function in PostgreSQL:

```
import psycopg2
from config import load_config


def get_parts(vendor_id):
    """ Get parts provided by a vendor specified by the vendor_id """
    parts = []
    # read database configuration
    params = load_config()
    try:
        # connect to the PostgreSQL database
        with  psycopg2.connect(**params) as conn:
            with conn.cursor() as cur:
                # create a cursor object for execution
                cur = conn.cursor()
                cur.callproc('get_parts_by_vendor', (vendor_id,))

                # process the result set
                row = cur.fetchone()
                while row is not None:
                    parts.append(row)
                    row = cur.fetchone()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        return parts

if __name__ == '__main__':
    parts = get_parts(1)
    print(parts)
```

### 3) Call the call_function.py module

Run the following command to execute the `call_function.py` module:

```
python call_function.py
```

Output:

```
[(1, 'SIM Tray'), (5, 'Home Button'), (6, 'LTE Modem')]
```

[Download the project source code](/postgresqltutorial_data/call_function.zip)

## Summary

- Use the `callproc()` method of the `cursor` object to call a function in PostgreSQL from Python.

---
title: 'PostgreSQL Python: Call Stored Procedures'
redirectFrom: 
            - /docs/postgresql/postgresql-python/call-stored-procedures
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to call PostgreSQL stored procedures from a Python program.

This tutorial picks up from where the [Call PostgreSQL Functions Tutorial](/docs/postgresql/postgresql-python/postgresql-python-call-postgresql-functions) left off.

## Steps for calling a PostgreSQL stored procedure in Python

To call a PostgreSQL stored procedure in a Python program, you follow these steps:

First, [create a new database connection](/docs/postgresql/postgresql-python/connect) to the PostgreSQL database server by calling the `connect()` function:

```
conn = psycopg2.connect(config)
```

The `connect()` method returns a new instance of the `connection` class.

Next, create a new cursor by calling the `cursor()` method of the `connection` object.

```
cur = conn.cursor()
```

Then, pass the name of the stored procedure and optional input values to the `execute()` method of the `cursor` object. For example:

```
cur.execute("CALL sp_name(%s, %s);", (val1, val2))
```

If your stored procedure does not accept any parameters, you can omit the second argument like this:

```
cur.execute("CALL sp_name);")
```

After that, call the `commit()` method to commit the transaction:

```
conn.commit();
```

Finally, call the `close()` method of the `cursor` and `connection` objects to close the connection to the PostgreSQL database server.

```
cur.close()
conn.close()
```

If you use context managers, you don't need to explicitly call the `close()` method of the cursor and connection.

## Calling a stored procedure example

Let's take an example of calling a PostgreSQL stored procedure in Python.

### 1) Create a new stored procedure

First, open the Command Prompt on Windows or Terminal on Unix-like systems.

Second, connect to the `suppliers` database on the local PostgreSQL server:

```
psql -U postgres -d suppliers
```

Third, create a new stored procedure called `add_new_part()`:

```sql
CREATE OR REPLACE PROCEDURE add_new_part(
 new_part_name varchar,
 new_vendor_name varchar
)
AS $$
DECLARE
 v_part_id INT;
 v_vendor_id INT;
BEGIN
 -- insert into the parts table
 INSERT INTO parts(part_name)
 VALUES(new_part_name)
 RETURNING part_id INTO v_part_id;

 -- insert a new vendor
 INSERT INTO vendors(vendor_name)
 VALUES(new_vendor_name)
 RETURNING vendor_id INTO v_vendor_id;

 -- insert into vendor_parts
 INSERT INTO vendor_parts(part_id, vendor_id)
 VALUEs(v_part_id,v_vendor_id);

END;
$$
LANGUAGE PLPGSQL;
```

### 2) Create the call_stored_procedure.py module

First, create a new module called `call_stored_procedure.py` file in the project directory.

Second, define the following `add_part()` function that calls the `add_new_part()` stored procedure from the `suppliers` database:

```
import psycopg2
from config import load_config


def add_part(part_name, vendor_name):
    """ Add a new part """
    # read database configuration
    params = load_config()

    try:
        # connect to the PostgreSQL database
        with psycopg2.connect(**params) as conn:
            with conn.cursor() as cur:
                # call a stored procedure
                cur.execute('CALL add_new_part(%s,%s)', (part_name, vendor_name))

            # commit the transaction
            conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


if __name__ == '__main__':
    add_part('OLED', 'LG')
```

### 3) Execute the Python module

Execute the following command to run the `call_stored_procedure.py` module:

```
python call_stored_procedure.py
```

### 4) Verify the result

Execute the following statement to retrieve data from the `parts`, `vendors`, and `vendor_parts` tables to verify the result:

```sql
SELECT * FROM parts;
SELECT * FROM vendors;
SELECT * FROM vendor_parts;
```

[Download the project source code](/postgresqltutorial_data/call_stored_procedure.zip)

## Summary

- Use the `execute()` method of a `cursor` object to execute a stored procedure call.
-
- Use the `CALL sp_name(arguments)` syntax to construct a stored procedure call.

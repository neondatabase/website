---
title: 'PostgreSQL Python: Call Stored Procedures'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-python/call-stored-procedures/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to call PostgreSQL stored procedures from a Python program.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

This tutorial picks up from where the [Call PostgreSQL Functions Tutorial](https://www.postgresqltutorial.com/postgresql-python/postgresql-python-call-postgresql-functions/) left off.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Steps for calling a PostgreSQL stored procedure in Python

<!-- /wp:heading -->

<!-- wp:paragraph -->

To call a PostgreSQL stored procedure in a Python program, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a new database connection](https://www.postgresqltutorial.com/postgresql-python/connect/) to the PostgreSQL database server by calling the `connect()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
conn = psycopg2.connect(config)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `connect()` method returns a new instance of the `connection` class.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Next, create a new cursor by calling the `cursor()` method of the `connection` object.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
cur = conn.cursor()
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Then, pass the name of the stored procedure and optional input values to the `execute()` method of the `cursor` object. For example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
cur.execute("CALL sp_name(%s, %s);", (val1, val2))
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If your stored procedure does not accept any parameters, you can omit the second argument like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
cur.execute("CALL sp_name);")
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After that, call the `commit()` method to commit the transaction:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
conn.commit();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, call the `close()` method of the `cursor` and `connection` objects to close the connection to the PostgreSQL database server.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
cur.close()
conn.close()
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you use context managers, you don't need to explicitly call the `close()` method of the cursor and connection.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Calling a stored procedure example

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take an example of calling a PostgreSQL stored procedure in Python.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Create a new stored procedure

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open the Command Prompt on Windows or Terminal on Unix-like systems.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, connect to the `suppliers` database on the local PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres -d suppliers
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create a new stored procedure called `add_new_part()`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Create the call_stored_procedure.py module

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, create a new module called `call_stored_procedure.py` file in the project directory.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, define the following `add_part()` function that calls the `add_new_part()` stored procedure from the `suppliers` database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

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

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Execute the Python module

<!-- /wp:heading -->

<!-- wp:paragraph -->

Execute the following command to run the `call_stored_procedure.py` module:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
python call_stored_procedure.py
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Verify the result

<!-- /wp:heading -->

<!-- wp:paragraph -->

Execute the following statement to retrieve data from the `parts`, `vendors`, and `vendor_parts` tables to verify the result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM parts;
SELECT * FROM vendors;
SELECT * FROM vendor_parts;
```

<!-- /wp:code -->

<!-- wp:paragraph {"className":"note"} -->

[Download the project source code](https://www.postgresqltutorial.com/wp-content/uploads/2024/01/call_stored_procedure.zip)

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `execute()` method of a `cursor` object to execute a stored procedure call.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `CALL sp_name(arguments)` syntax to construct a stored procedure call.
- <!-- /wp:list-item -->

<!-- /wp:list -->

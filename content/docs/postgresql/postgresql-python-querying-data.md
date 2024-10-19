---
title: 'PostgreSQL Python: Querying Data'
redirectFrom: 
            - /docs/postgresql/postgresql-python/query
ogImage: /postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-Python-Sample-Database-Diagram.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to query data from the PostgreSQL tables in Python.

This tutorial picks up from where the [Handling BLOB Data Tutorial](/docs/postgresql/postgresql-python/blob) left off.

## The steps for querying data from a PostgreSQL table in Python

To query data from one or more PostgreSQL tables in Python, you use the following steps.

First, [establish a connection to the PostgreSQL server](/docs/postgresql/postgresql-python/connect) by calling the `connect()` function of the `psycopg2` module.

```
conn = psycopg2.connect(config)
```

If the connection is created successfully, the `connect()` function returns a new `Connection` object; Otherwise, it throws a `DatabaseError` exception.

Next, create a new cursor by calling the `cursor()` method of the `Connection` object. The `cursor` object is used to execute a [SELECT](/docs/postgresql/postgresql-select) statement.

```
cur = conn.cursor()
```

Then, execute a `SELECT` statement by calling the `execute()` method. If you want to pass values to the `SELECT` statement, you use the placeholder ( `%s`) in the `SELECT` statement and bind the input values when calling the `execute()` method:

```
cur.execute(sql, (value1,value2))
```

After that, process the result set returned by the SELECT statement using the `fetchone()`, `fetchall()`, or `fetchmany()` method.

- The `fetchone()` fetches the next row in the result set. It returns a single tuple or `None` when no more row is available.
- The `fetchmany(size=cursor.arraysize)` fetches the next set of rows specified by the `size` parameter. If you omit this parameter, the `arraysize` will determine the number of rows to be fetched. The `fetchmany()` method returns a list of tuples or an empty list if no more rows are available.
- The `fetchall()` fetches all rows in the result set and returns a list of tuples. If there are no rows to fetch, the `fetchall()` method returns an empty list.

Finally, close the database connection by calling the `close()` method of the `Cursor` and `Connection` objects

```
cur.close()
conn.close()
```

If you use context managers, you don't need to explicitly call the `close()` methods of the `Cursor` and `Connection` objects.

## Querying data using the fetchone() method

For the demonstration purposes, we will use the `parts`, `vendors`, and `vendor_parts` tables in the `suppliers` database:

![PostgreSQL Python Sample Database Diagram](/postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-Python-Sample-Database-Diagram.png)

The following `get_vendor()` function selects data from the `vendors` table and fetches the rows using the `fetchone()` method.

```
import psycopg2
from config import load_config

def get_vendors():
    """ Retrieve data from the vendors table """
    config  = load_config()
    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT vendor_id, vendor_name FROM vendors ORDER BY vendor_name")
                print("The number of parts: ", cur.rowcount)
                row = cur.fetchone()

                while row is not None:
                    print(row)
                    row = cur.fetchone()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

if __name__ == '__main__':
    get_vendors()
```

Output:

```sql
The number of parts:  8
(1, '3M Corp')
(2, 'AKM Semiconductor Inc.')
(3, 'Asahi Glass Co Ltd.')
(4, 'Daikin Industries Ltd.')
(5, 'Dynacast International Inc.')
(6, 'Foster Electric Co. Ltd.')
(8, 'LG')
(7, 'Murata Manufacturing Co. Ltd.')
```

## Querying data using the fetchall() method

The following `get_parts()` function uses the `fetchall()` method of the cursor object to fetch rows from the result set and display all the parts in the `parts` table.

```
import psycopg2
from config import load_config

def get_vendors():
    """ Retrieve data from the vendors table """
    config  = load_config()
    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT vendor_id, vendor_name FROM vendors ORDER BY vendor_name")
                rows = cur.fetchall()

                print("The number of parts: ", cur.rowcount)
                for row in rows:
                    print(row)

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

if __name__ == '__main__':
    get_vendors()
```

```sql
The number of parts:  8
(1, '3M Corp')
(2, 'AKM Semiconductor Inc.')
(3, 'Asahi Glass Co Ltd.')
(4, 'Daikin Industries Ltd.')
(5, 'Dynacast International Inc.')
(6, 'Foster Electric Co. Ltd.')
(8, 'LG')
(7, 'Murata Manufacturing Co. Ltd.')
```

## Querying data using the fetchmany() method

The following `get_suppliers()` function selects parts and vendor data using the `fetchmany()` method.

```
import psycopg2
from config import load_config

def iter_row(cursor, size=10):
    while True:
        rows = cursor.fetchmany(size)
        if not rows:
            break
        for row in rows:
            yield row

def get_part_vendors():
    """ Retrieve data from the vendors table """
    config  = load_config()
    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT part_name, vendor_name
                    FROM parts
                    INNER JOIN vendor_parts ON vendor_parts.part_id = parts.part_id
                    INNER JOIN vendors ON vendors.vendor_id = vendor_parts.vendor_id
                    ORDER BY part_name;
                """)
                for row in iter_row(cur, 10):
                    print(row)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

if __name__ == '__main__':
    get_part_vendors()
```

Output:

```
('Antenna', 'Foster Electric Co. Ltd.')
('Antenna', 'Murata Manufacturing Co. Ltd.')
('Home Button', 'Dynacast International Inc.')
('Home Button', '3M Corp')
('LTE Modem', 'Dynacast International Inc.')
('LTE Modem', '3M Corp')
('SIM Tray', 'AKM Semiconductor Inc.')
('SIM Tray', '3M Corp')
('Speaker', 'Daikin Industries Ltd.')
('Speaker', 'Asahi Glass Co Ltd.')
('Vibrator', 'Dynacast International Inc.')
('Vibrator', 'Foster Electric Co. Ltd.')
```

[Download the project source code](/postgresqltutorial_data/query.zip)

In this tutorial, we have learned how to select data from the PostgreSQL tables in Python using the `fetchone()`, `fetchall()`, and `fetchmany()` methods.

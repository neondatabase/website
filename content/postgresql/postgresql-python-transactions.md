---
title: 'PostgreSQL Python: Transactions'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-python/transaction/
ogImage: ./img/wp-content-uploads-2016-06-parts_vendors_tables.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to handle PostgreSQL transactions in Python.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

This tutorial picks up from where the [Updating Data in a Table Tutorial](https://www.postgresqltutorial.com/postgresql-python/update/) left off.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to transactions in Python

<!-- /wp:heading -->

<!-- wp:paragraph -->

In the `psycopg2` package, the `connection` class is responsible for managing transactions.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When you send the first SQL statement to the PostgreSQL database using a `cursor` object, `psycopg2` initiates a new [transaction](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-transaction/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Subsequentially, all the following statements are executed within the same transaction. If any statement encounters an error, `psycopg2` will abort the entire transaction.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `connection` class has two methods for concluding a transaction:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `commit()` - Use this method to permanently apply all changes to the PostgreSQL database.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `rollback()` - Call this method to discard the changes.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Closing a connection object by calling the close() method or deleting it using `del` will also trigger an implicit rollback:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
conn.close()
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Or

<!-- /wp:paragraph -->

<!-- wp:code -->

```
del conn
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Alternatively, you can set the `autocommit` attribute of the `connection` object to `True`. This ensures that `psycopg2` executes every statement and commits it immediately.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `autocommit` mode can be particularly useful when executing statements that need to operate outside a transaction, such as [CREATE DATABASE](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/) and `VACUUM`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following shows a typical pattern for managing a transaction in `psycopg2`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
import psycopg2

conn = None
try:
    conn = psycopg2.connect(config)
    cur = conn.cursor()

    # execute 1st statement
    cur.execute(statement1)

    # execute 2nd statement
    cur.execute(statement2)

    # commit the transaction
    conn.commit()

    # close the cursor
    cur.close()
except psycopg2.DatabaseError as error:
    if conn:
       conn.rollback()
    print(error)
finally:
    if conn:
        conn.close()
```

<!-- /wp:code -->

<!-- wp:heading -->

## Managing transactions using context managers

<!-- /wp:heading -->

<!-- wp:paragraph -->

Starting from `psycopg` 2.5, the connection and cursor are [context managers](https://www.pythontutorial.net/advanced-python/python-context-managers/) therefore you can use them in the `with` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
with psycopg2.connect(config) as conn:
    with conn.cursor() as cur:
        cur.execute(sql)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `psycopg2` commits the transaction if no exception occurs within the `with` block, otherwise, it rolls back the transaction.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Unlike other [context manager](https://www.pythontutorial.net/advanced-python/python-context-managers/) objects, exiting the `with` block does not close the connection but only terminates the transaction. Consequentially, you can use the same `connection` object in the subsequent `with` statements in another transaction as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
conn = psycopg2.connect(config)

# transaction 1
with conn:
    with conn.cursor() as cur:
        cur.execute(sql)

# transaction 2
with conn:
    with conn.cursor() as cur:
        cur.execute(sql)

conn.close()
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL transaction example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `parts` and `vendor_parts` tables in the `suppliers` database:

<!-- /wp:paragraph -->

<!-- wp:image {"id":2143} -->

![parts_vendors_tables](./img/wp-content-uploads-2016-06-parts_vendors_tables.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Suppose you need to add a new part and assign the vendors who supply the part at the same time.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To achieve this, you can do as follows:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, [insert a new row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `parts` table and get the part id.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Then, insert rows into the `vendor_parts` table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The following `add_part()` function demonstrates the steps:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
import psycopg2
from config import load_config


def add_part(part_name, vendor_list):
    # statement for inserting a new row into the parts table
    insert_part = "INSERT INTO parts(part_name) VALUES(%s) RETURNING part_id;"

    # statement for inserting a new row into the vendor_parts table
    assign_vendor = "INSERT INTO vendor_parts(vendor_id,part_id) VALUES(%s,%s)"

    conn = None
    config = load_config()

    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                # insert a new part
                cur.execute(insert_part, (part_name,))

                # get the part id
                row = cur.fetchone()
                if row:
                    part_id = row[0]
                else:
                    raise Exception('Could not get the part id')

                # assign parts provided by vendors
                for vendor_id in vendor_list:
                    cur.execute(assign_vendor, (vendor_id, part_id))

                # commit the transaction
                conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        if conn:
            conn.rollback()

        print(error)

if __name__ == '__main__':
    add_part('SIM Tray', (1, 2))
    add_part('Speaker', (3, 4))
    add_part('Vibrator', (5, 6))
    add_part('Antenna', (6, 7))
    add_part('Home Button', (1, 5))
    add_part('LTE Modem', (1, 5))
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Execute the transaction.py module

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open the Command Prompt on Windows or Terminal on Unix-like systems.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, run the following command to execute the `transaction.py` module:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
python transaction.py
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Verify transaction

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, connect to the `suppliers` on the PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres -d suppliers
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, retrieve data from the `parts` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM parts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 part_id |  part_name
---------+-------------
       1 | SIM Tray
       2 | Speaker
       3 | Vibrator
       4 | Antenna
       5 | Home Button
       6 | LTE Modem
(6 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, query data from the `vendor_parts` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM vendor_parts;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 vendor_id | part_id
-----------+---------
         1 |       1
         2 |       1
         3 |       2
         4 |       2
         5 |       3
         6 |       3
         6 |       4
         7 |       4
         1 |       5
         5 |       5
         1 |       6
         5 |       6
(12 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Test a failed transaction

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's insert another part, but this time, we intentionally use an invalid vendor id for demonstration purposes.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The program should not add a new part without assigning it to a vendor.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"python"} -->

```
if __name__ == '__main__':
    # no rows inserted into the parts and vendor_parts tables
    add_part('Power Amplifier', (99,))
```

<!-- /wp:code -->

<!-- wp:paragraph -->

An exception occurred.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
insert or update on table "vendor_parts" violates foreign key constraint "vendor_parts_vendor_id_fkey"
DETAIL:  Key (vendor_id)=(99) is not present in table "vendors".
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You can query data from the `parts` and `vendor_parts` tables again. There will be no new data, meaning that the program works as expected.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

[Download the project source code](https://www.postgresqltutorial.com/wp-content/uploads/2024/01/transaction.zip)

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `commit()` method to permanently apply all changes to the database.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `rollback()` method to discard the changes.
- <!-- /wp:list-item -->

<!-- /wp:list -->

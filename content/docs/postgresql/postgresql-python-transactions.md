---
title: 'PostgreSQL Python: Transactions'
redirectFrom: 
            - /docs/postgresql/postgresql-python/transaction/
ogImage: ./img/wp-content-uploads-2016-06-parts_vendors_tables.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to handle PostgreSQL transactions in Python.





This tutorial picks up from where the [Updating Data in a Table Tutorial](https://www.postgresqltutorial.com/postgresql-python/update/) left off.





## Introduction to transactions in Python





In the `psycopg2` package, the `connection` class is responsible for managing transactions.





When you send the first SQL statement to the PostgreSQL database using a `cursor` object, `psycopg2` initiates a new [transaction](/docs/postgresql/postgresql-transaction).





Subsequentially, all the following statements are executed within the same transaction. If any statement encounters an error, `psycopg2` will abort the entire transaction.





The `connection` class has two methods for concluding a transaction:





- 
- `commit()` - Use this method to permanently apply all changes to the PostgreSQL database.
- 
-
- 
- `rollback()` - Call this method to discard the changes.
- 





Closing a connection object by calling the close() method or deleting it using `del` will also trigger an implicit rollback:





```
conn.close()
```





Or





```
del conn
```





Alternatively, you can set the `autocommit` attribute of the `connection` object to `True`. This ensures that `psycopg2` executes every statement and commits it immediately.





The `autocommit` mode can be particularly useful when executing statements that need to operate outside a transaction, such as [CREATE DATABASE](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/) and `VACUUM`.





The following shows a typical pattern for managing a transaction in `psycopg2`:





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





## Managing transactions using context managers





Starting from `psycopg` 2.5, the connection and cursor are [context managers](https://www.pythontutorial.net/advanced-python/python-context-managers/) therefore you can use them in the `with` statement:





```
with psycopg2.connect(config) as conn:
    with conn.cursor() as cur:
        cur.execute(sql)
```





The `psycopg2` commits the transaction if no exception occurs within the `with` block, otherwise, it rolls back the transaction.





Unlike other [context manager](https://www.pythontutorial.net/advanced-python/python-context-managers/) objects, exiting the `with` block does not close the connection but only terminates the transaction. Consequentially, you can use the same `connection` object in the subsequent `with` statements in another transaction as follows:





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





## PostgreSQL transaction example





We will use the `parts` and `vendor_parts` tables in the `suppliers` database:





![parts_vendors_tables](./img/wp-content-uploads-2016-06-parts_vendors_tables.png)





Suppose you need to add a new part and assign the vendors who supply the part at the same time.





To achieve this, you can do as follows:





- 
- First, [insert a new row](/docs/postgresql/postgresql-insert) into the `parts` table and get the part id.
- 
-
- 
- Then, insert rows into the `vendor_parts` table.
- 





The following `add_part()` function demonstrates the steps:





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





### 2) Execute the transaction.py module





First, open the Command Prompt on Windows or Terminal on Unix-like systems.





Second, run the following command to execute the `transaction.py` module:





```
python transaction.py
```





### 3) Verify transaction





First, connect to the `suppliers` on the PostgreSQL server:





```
psql -U postgres -d suppliers
```





Second, retrieve data from the `parts` table:





```
SELECT * FROM parts;
```





Output:





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





Third, query data from the `vendor_parts` table:





```
SELECT * FROM vendor_parts;
```





Output:





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





### 4) Test a failed transaction





Let's insert another part, but this time, we intentionally use an invalid vendor id for demonstration purposes.





The program should not add a new part without assigning it to a vendor.





```
if __name__ == '__main__':
    # no rows inserted into the parts and vendor_parts tables
    add_part('Power Amplifier', (99,))
```





An exception occurred.





```
insert or update on table "vendor_parts" violates foreign key constraint "vendor_parts_vendor_id_fkey"
DETAIL:  Key (vendor_id)=(99) is not present in table "vendors".
```





You can query data from the `parts` and `vendor_parts` tables again. There will be no new data, meaning that the program works as expected.





[Download the project source code](https://www.postgresqltutorial.com/wp-content/uploads/2024/01/transaction.zip)





## Summary





- 
- Use the `commit()` method to permanently apply all changes to the database.
- 
-
- 
- Use the `rollback()` method to discard the changes.
- 



---
title: 'PostgreSQL Python: Update Data in a Table'
redirectFrom: 
            - /docs/postgresql/postgresql-python/update/
ogImage: /postgresqltutorial_data/wp-content-uploads-2016-06-vendors_table.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to update data in a PostgreSQL table from a Python program.



This tutorial picks up from where the [Inserting Data Into Table Tutorial](https://www.postgresqltutorial.com/postgresql-python/insert/) left off.



## Steps for updating data in a PostgreSQL table from Python



To update data from a table in Python, you follow these steps:



- First, [connect to the PostgreSQL server](https://www.postgresqltutorial.com/postgresql-python/connect/).
- -
- Next, create a `cursor` object from the `connection` object.
- -
- Then, execute an [UPDATE](/docs/postgresql/postgresql-update) statement by calling the `execute()` method of the `cursor` object.
- -
- After that, commit the changes by calling the `commit()` method of the `connection` object.
- -
- Finally, optionally obtain the number of updated rows from the `rowcount` property of the `cursor` object.
- 


## Updating data in a table example



We will use the `vendors` table in the `suppliers` database for the demonstration:



![vendors_table](/postgresqltutorial_data/wp-content-uploads-2016-06-vendors_table.png)



### 1) Creating update.py module



Suppose a vendor changed its name, you need to reflect these changes in the `vendors` table.



To achieve this, you can define a function `update_vendor()`, which updates the vendor name based on the vendor id.



First, create a new module called `update.py` in the project directory.



Second, define `update_vendor()` function in the `update.py` module:



```
import psycopg2
from config import load_config


def update_vendor(vendor_id, vendor_name):
    """ Update vendor name based on the vendor id """

    updated_row_count = 0

    sql = """ UPDATE vendors
                SET vendor_name = %s
                WHERE vendor_id = %s"""

    config = load_config()

    try:
        with  psycopg2.connect(**config) as conn:
            with  conn.cursor() as cur:

                # execute the UPDATE statement
                cur.execute(sql, (vendor_name, vendor_id))
                updated_row_count = cur.rowcount

            # commit the changes to the database
            conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        return updated_row_count

if __name__ == '__main__':
    update_vendor(1, "3M Corp")
```



### 2) Execute the update.py module



First, open the Command Prompt on Windows or Terminal on Unix-like systems.



Second, execute the `update.py` module:



```
python update.py
```



### 3) Verify the update



First, connect to the PostgreSQL server using the `psql` client tool:



```
psql -U postgres
```



Second, change the current database to `suppliers`:



```
\c suppliers
```



Third, retrieve data from the `vendors` table with the vendor id 1:



```
SELECT
  *
FROM
  vendors
WHERE
  vendor_id = 1;
```



Output:



```
 vendor_id | vendor_name
-----------+-------------
         1 | 3M Corp
(1 row)
```



The name of the vendor id 1 has been changed as expected.



[Download the project source code](https://www.postgresqltutorial.com/wp-content/uploads/2024/01/update.zip)



## Summary



- Use the `execute()` method of a `cursor` object to execute an `UPDATE` statement that updates data in a table
- 
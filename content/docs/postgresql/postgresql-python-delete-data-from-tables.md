---
title: 'PostgreSQL Python: Delete Data from Tables'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-python/delete/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: This tutorial shows you how to delete data from PostgreSQL tables in Python.



This tutorial picks up from where the [Querying Data from Tables Tutorial](https://www.postgresqltutorial.com/postgresql-python/query/) left off.



## Steps for deleting data from a PostgreSQL table in Python



To delete data from the PostgreSQL table in Python, you use the following steps:



First, [create a new database connection](https://www.postgresqltutorial.com/postgresql-python/connect/) by calling the `connect()` function of the `psycopg2` module.



```
conn = psycopg2.connect(config)
```



The `connect()` function returns a new `connection` object.



Next, create a new `Cursor` object by calling the `cursor()` method of the `Connection` object:



```
cur = conn.cursor()
```



Then, execute the [DELETE](/docs/postgresql/postgresql-delete) statement. If you want to pass values to the `DELETE` statement, you use the placeholders ( `%s`) in the `DELETE` statement and pass input values to the second parameter of the `execute()` method.



The `DELETE` statement with a placeholder for the value of the `id` field is as follows:



```
DELETE FROM table_1 WHERE id = %s;
```



To bind value `value1` to the placeholder, you call the `execute()` method and pass the input value as a tuple to the second parameter like the following:



```
cur.execute(delete_sql, (value1,))
```



After that, save the changes to the database permanently by calling the `commit()` method of the `connection` object.



```
conn.commit()
```



Finally, close the communication with the PostgreSQL database server by calling the `close()` method of the `cursor` and `connection` objects.



```
cur.close()
conn.close()
```



If you use context managers, you don't need to explicitly close the cursor or connection.



## Example of deleting data in PostgreSQL table in Python



We will use the `parts` table in the `suppliers` database for the demonstration purposes.



The following `delete_part()` function deletes a row in the `parts` table specified by the `part_id`.



```
import psycopg2
from config import load_config


def delete_part(part_id):
    """ Delete part by part id """

    rows_deleted  = 0
    sql = 'DELETE FROM parts WHERE part_id = %s'
    config = load_config()

    try:
        with  psycopg2.connect(**config) as conn:
            with  conn.cursor() as cur:
                # execute the UPDATE statement
                cur.execute(sql, (part_id,))
                rows_deleted = cur.rowcount

            # commit the changes to the database
            conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        return rows_deleted

if __name__ == '__main__':
    deleted_rows = delete_part(2)
    print('The number of deleted rows: ', deleted_rows)
```



Now we run the Python program to delete the part with the part id 1.



```
python delete.py
```



Output:



```
The number of deleted rows:  1
```



Retrieve data from the `parts` table again to confirm the deletion:



```
SELECT * FROM parts;
```



Output:



```
 part_id |  part_name
---------+-------------
       1 | SIM Tray
       3 | Vibrator
       4 | Antenna
       5 | Home Button
       6 | LTE Modem
       8 | OLED
(6 rows)
```



The output indicates that part id 2 has been deleted successfully.



[Download the project source code](https://www.postgresqltutorial.com/wp-content/uploads/2024/01/delete.zip)



## Summary



- - Use the `execute()` method of a `cursor` object to delete a row from a table.
- 

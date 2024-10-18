---
title: 'PostgreSQL Python'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-python/
ogImage: ./img/wp-content-uploads-2016-06-PostgreSQL-Python-Sample-Database-Diagram.png
tableOfContents: true
---
<!-- wp:paragraph -->

This PostgreSQL Python section shows you how to work with PostgreSQL using the [Python programming language](https://www.pythontutorial.net/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Python has various database drivers for PostgreSQL. Currently, the [psycopg](http://initd.org/psycopg/) is the most popular PostgreSQL database adapter for the Python language. The psycopg fully implements the Python DB-API 2.0 specification.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The current version of the psycopg is 2 or psycopg2. The psycopg2 database adapter is implemented in C as a [libpq](https://www.postgresql.org/docs/9.0/static/libpq.html) wrapper resulting in both fast and secure. The psycopg2 provides many useful features such as client-side and server-side [cursors](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-cursor/), asynchronous notification and communication, COPY command support, etc.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Besides, the psycopg2 driver supports many Python types out-of-the-box. The psycopg2 matches Python objects to the [PostgreSQL data types](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-data-types/), e.g., list to the [array](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array/), tuples to records, and dictionary to [hstore](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-hstore/). If you want to customize and extend the type adaption, you can use a flexible object adaption system.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

This PostgreSQL Python section covers the most common activities for interacting with PostgreSQL in Python applications:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Connecting to the PostgreSQL database server ](https://www.postgresqltutorial.com/postgresql-python/connect/)– show you how to connect to the PostgreSQL database server from Python.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Creating new PostgreSQL tables in Python](https://www.postgresqltutorial.com/postgresql-python/create-tables/) – show you how to create new tables in PostgreSQL from Python.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Inserting data into the PostgreSQL table in Python ](https://www.postgresqltutorial.com/postgresql-python/insert/)– explain to you how to insert data into a PostgreSQL database table in Python.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Updating data in the PostgreSQL table in Python ](https://www.postgresqltutorial.com/postgresql-python/update/)– learn various ways to update data in the PostgreSQL table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Transaction](https://www.postgresqltutorial.com/postgresql-python/transaction/) - show you how to perform transactions in Python.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Calling a PostgreSQL function in Python](https://www.postgresqltutorial.com/postgresql-python/postgresql-python-call-postgresql-functions/) - show you step by step how to call a PostgreSQL function in Python.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Calling a PostgreSQL stored procedure in Python](https://www.postgresqltutorial.com/postgresql-python/call-stored-procedures/) – guide you on how to call a stored procedure from in a Python application.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Handling PostgreSQL BLOB data in Python](https://www.postgresqltutorial.com/postgresql-python/blob/)– give you an example of inserting and selecting the PostgreSQL BLOB data in a Python application.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Querying data from the PostgreSQL tables ](https://www.postgresqltutorial.com/postgresql-python/query/)– walk you through the steps of querying data from the PostgreSQL tables in a Python application.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Deleting data from PostgreSQL tables in Python](https://www.postgresqltutorial.com/postgresql-python/delete/) - show you how to delete data in a table in Python.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

For demonstration purposes, we will use the `suppliers` sample database. The following picture illustrates the structure of the `suppliers` database:

<!-- /wp:paragraph -->

<!-- wp:image {"id":2076} -->

![PostgreSQL Python Sample Database Diagram](./img/wp-content-uploads-2016-06-PostgreSQL-Python-Sample-Database-Diagram.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The `suppliers` database has the following tables:

<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->

1. <!-- wp:list-item -->
2. `vendors` table: stores vendor data.
3. <!-- /wp:list-item -->
4.
5. <!-- wp:list-item -->
6. `parts` table: stores parts data.
7. <!-- /wp:list-item -->
8.
9. <!-- wp:list-item -->
10. `parts_drawings` table: stores the drawing of a part.
11. <!-- /wp:list-item -->
12.
13. <!-- wp:list-item -->
14. `vendor_parts` table: stores the data of which parts are supplied by which vendor.
15. <!-- /wp:list-item -->

<!-- /wp:list -->

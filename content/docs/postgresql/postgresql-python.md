---
title: 'PostgreSQL Python'
ogImage: /postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-Python-Sample-Database-Diagram.png
tableOfContents: true
---


This PostgreSQL Python section shows you how to work with PostgreSQL using the [Python programming language](https://www.pythontutorial.net/).

Python has various database drivers for PostgreSQL. Currently, the [psycopg](http://initd.org/psycopg/) is the most popular PostgreSQL database adapter for the Python language. The psycopg fully implements the Python DB-API 2.0 specification.

The current version of the psycopg is 2 or psycopg2. The psycopg2 database adapter is implemented in C as a [libpq](https://www.postgresql.org/docs/9.0/static/libpq.html) wrapper resulting in both fast and secure. The psycopg2 provides many useful features such as client-side and server-side [cursors](/docs/postgresql/postgresql-plpgsql/plpgsql-cursor), asynchronous notification and communication, COPY command support, etc.

Besides, the psycopg2 driver supports many Python types out-of-the-box. The psycopg2 matches Python objects to the [PostgreSQL data types](/docs/postgresql/postgresql-data-types), e.g., list to the [array](/docs/postgresql/postgresql-tutorial/postgresql-array), tuples to records, and dictionary to [hstore](/docs/postgresql/postgresql-tutorial/postgresql-hstore). If you want to customize and extend the type adaption, you can use a flexible object adaption system.

This PostgreSQL Python section covers the most common activities for interacting with PostgreSQL in Python applications:

- [Connecting to the PostgreSQL database server](/docs/postgresql/postgresql-python/connect)– show you how to connect to the PostgreSQL database server from Python.
-
- [Creating new PostgreSQL tables in Python](/docs/postgresql/postgresql-python/create-tables) – show you how to create new tables in PostgreSQL from Python.
-
- [Inserting data into the PostgreSQL table in Python](/docs/postgresql/postgresql-python/insert)– explain to you how to insert data into a PostgreSQL database table in Python.
-
- [Updating data in the PostgreSQL table in Python](/docs/postgresql/postgresql-python/update)– learn various ways to update data in the PostgreSQL table.
-
- [Transaction](/docs/postgresql/postgresql-python/transaction) - show you how to perform transactions in Python.
-
- [Calling a PostgreSQL function in Python](/docs/postgresql/postgresql-python/postgresql-python-call-postgresql-functions) - show you step by step how to call a PostgreSQL function in Python.
-
- [Calling a PostgreSQL stored procedure in Python](/docs/postgresql/postgresql-python/call-stored-procedures) – guide you on how to call a stored procedure from in a Python application.
-
- [Handling PostgreSQL BLOB data in Python](/docs/postgresql/postgresql-python/blob)– give you an example of inserting and selecting the PostgreSQL BLOB data in a Python application.
-
- [Querying data from the PostgreSQL tables](/docs/postgresql/postgresql-python/query)– walk you through the steps of querying data from the PostgreSQL tables in a Python application.
-
- [Deleting data from PostgreSQL tables in Python](/docs/postgresql/postgresql-python/delete) - show you how to delete data in a table in Python.

For demonstration purposes, we will use the `suppliers` sample database. The following picture illustrates the structure of the `suppliers` database:

![PostgreSQL Python Sample Database Diagram](/postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-Python-Sample-Database-Diagram.png)

The `suppliers` database has the following tables:

1.
2. `vendors` table: stores vendor data.
3.
4.
5.
6. `parts` table: stores parts data.
7.
8.
9.
10. `parts_drawings` table: stores the drawing of a part.
11.
12.
13.
14. `vendor_parts` table: stores the data of which parts are supplied by which vendor.
15.

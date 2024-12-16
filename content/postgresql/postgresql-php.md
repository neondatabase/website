---
title: 'PostgreSQL PHP'
page_title: 'PostgreSQL PHP - Using PHP PDO to Access PostgreSQL'
page_description: 'This PostgreSQL PHP tutorial series shows you how to use PHP PDO to manage data in PostgreSQL databases effectively.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-php/'
ogImage: '/postgresqltutorial/PostgreSQL-PHP-1.png'
updatedOn: '2024-01-30T00:39:28+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL jsonb_populate_recordset() Function'
  slug: 'postgresql-json-functions/postgresql-jsonb_populate_recordset'
nextLink:
  title: 'PostgreSQL PHP: Connect to PostgreSQL Database Using PDO'
  slug: 'postgresql-php/connect'
---

![PostgreSQL-PHP](/postgresqltutorial/PostgreSQL-PHP-1.png?alignright)
This PostgreSQL PHP section shows you how to interact with the PostgreSQL database using [PHP Data Objects](http://php.net/manual/en/book.pdo.php) (PDO) API. It guides you through the steps of performing the common database operations in PHP, including creating new tables, inserting data, updating data, querying data, deleting data, using transactions, calling stored procedures, and handling binary large objects.

PHP is a highly popular scripting language for developing web applications and websites. PHP is fast, flexible, and easy to learn. It powers everything from a personal blog to complex e\-commerce platforms, making it a powerful tool for web development.

The PHP Data Objects (PDO) defines a unified interface for accessing relational databases in PHP. Each database defines the database\-specific driver that implements the PDO interface. Additionally, each driver can expose the database\-specific features as regular extension functions.

Many PHP distributions include the `PDO_PGSQL` driver that allows you to interact with PostgreSQL databases through the PDO API.

- [Connecting to a PostgreSQL database](postgresql-php/connect) – shows you how to set up a simple PHP application structure and connect to a PostgreSQL database.
- [Creating new PostgreSQL database tables](postgresql-php/create-tables) – walks you through the steps of creating database tables in PostgreSQL using PHP.
- [Inserting data into PostgreSQL tables](postgresql-php/insert) – guides you on how to insert data into a table using PHP PDO.
- [Updating data in the table](postgresql-php/update) – provides you with the steps of updating data in the database tables.
- [Querying data from a table](postgresql-php/query) – shows you various ways to query data in the PostgreSQL database from PHP.
- [Performing transactions](postgresql-php/transaction) – explains the transaction concept and shows you how to perform transactions in PHP.
- [Working with the binary large objects (BLOB)](postgresql-php/postgresql-blob) – shows you how to insert, select, and delete large objects in PostgreSQL using PHP.
- [Calling PostgreSQL stored procedures](postgresql-php/call-stored-procedures) – explains to you the steps of calling [PostgreSQL stored procedures](https://neon.tech/postgresql/postgresql-stored-procedures/) from PHP.
- [Deleting data in a PostgreSQL table using PHP PDO](postgresql-php/delete) – teaches you how to delete data from the PostgreSQL table in the PHP application using PDO.

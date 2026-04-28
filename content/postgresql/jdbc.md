---
title: PostgreSQL JDBC
page_title: PostgreSQL JDBC
page_description: >-
  In this PostgreSQL JDBC section, you will learn how to interact with the
  PostgreSQL databases in Java using the PostgreSQL JDBC driver.
prev_url: 'https://www.postgresqltutorial.com/postgresql-jdbc/'
ogImage: 'https://www.postgresqltutorial.com//postgresqltutorial/PostgreSQL-JDBC.png'
updatedOn: '2024-01-31T08:53:11+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Python: Delete Data from Tables'
  slug: postgresql-python/delete
nextLink:
  title: 'PostgreSQL JDBC: Connecting to PostgreSQL Databases'
  slug: postgresql-jdbc/connecting-to-postgresql-database
---
<Admonition type="info" id="CTA">
Working with PostgreSQL through JDBC follows the same patterns on any Postgres deployment, so everything here applies whether you're running Postgres locally, on a VM, or on a managed service. For enterprises building in the AI era, [Lakebase](https://www.databricks.com/product/lakebase) delivers the best managed cloud Postgres, with the performance, security, and native Lakehouse integration that production AI workloads demand. For developers and startups who need to ship and scale fast, [Neon](https://neon.com) is the Postgres platform that gets you from prototype to production without slowing down.
</Admonition>

In this section on PostgreSQL JDBC, you’ll learn the process of interacting with the PostgreSQL databases from Java programs using the JDBC driver.

JDBC, as the core API of Java, offers a standardized interface for communication with SQL\-compliant databases, especially PostgreSQL.

![PostgreSQL JDBC Tutorial](/postgresqltutorial/PostgreSQL-JDBC.jpg?alignright)

### What you’ll learn

- Install JDK, setup Java IDE, and download PostgreSQL JDBC driver
- Connect to the PostgreSQL server from Java programs.
- Perform common database operations such as creating tables, inserting data, querying data, updating data, and deleting data.
- Call PostgreSQL stored functions and stored procedures.
- Handle Transactions.

### Prerequisites

- Basic Java programming.
- Know how to connect to PostgreSQL using psql and execute queries.

## Section 1\. Getting Started

This section helps you get started by setting up JDK, installing Java IDE, downloading the PostgreSQL JDBC driver, and connecting to the PostgreSQL server from a Java program.

- [Connecting to the PostgreSQL database server](postgresql-jdbc/connecting-to-postgresql-database) – Show you how to connect to the PostgreSQL database server from a Java program.

## Section 2\. Performing Common Database Operations

This section shows you how to perform common database operations including creating tables, inserting data, querying data, updating data, and deleting data.

- [Creating Tables](postgresql-jdbc/create-tables) – Learn how to create tables in the PostgreSQL database using JDBC.
- [Inserting Data](postgresql-jdbc/insert) – Guide you on how to insert one or more rows into a table.
- [Querying Data](postgresql-jdbc/query) – Walk you through the steps for querying data from a table.
- [Updating Data](postgresql-jdbc/update) – Provide you with the steps for updating existing data in a table.
- [Deleting Data](postgresql-jdbc/delete) – Show you how to delete one or more rows from a table.

## Section 3\. Calling stored functions \& stored procedures

This section guides you on how to call stored functions and stored procedures in PostgreSQL from Java programs.

- [Calling PostgreSQL stored functions](postgresql-jdbc/call-postgresql-stored-function) – Guide you on how to call PostgreSQL stored functions including built\-in and user\-defined stored functions.

## Section 4\. Handling Transactions

This section explores how to manage PostgreSQL transactions in a Java program.

- [Handling database transactions](postgresql-jdbc/transaction) – Show you how to manage PostgreSQL transactions in Java.

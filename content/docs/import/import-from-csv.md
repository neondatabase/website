---
title: Import data from CSV
enableTableOfContents: true
updatedOn: '2024-02-08T15:20:54.292Z'
---

This topic describes how to import data into a Neon database table from a CSV file.

The instructions require a working installation of [psql](https://www.postgresql.org/download/). The `psql` client is the native command-line client for Postgres. It provides an interactive session for sending commands to Postgres. For more information about `psql`, refer to the [psql reference](https://www.postgresql.org/docs/current/app-psql.html), in the _PostgreSQL Documentation_.

The following example uses the ready-to-use `neondb` database that is created with your Neon project, a table named `customer`, and a data file named `customer.csv`. Data is loaded from the `customer.csv` file into the `customer` table.

1. Connect to the `neondb` database using `psql`. For example:

   ```bash shouldWrap
   psql postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

   <Admonition type="note">
   For more information about connecting to Neon with `psql`, see [Connect with psql](/docs/connect/query-with-psql-editor).
   </Admonition>

2. Create the `customer` table.

   ```sql
   CREATE TABLE customer (
     id SERIAL,
     first_name VARCHAR(50),
     last_name VARCHAR(50),
     email VARCHAR(255),
     PRIMARY KEY (id)
   )
   ```

   <Admonition type="tip">
   You can also create tables using the **SQL Editor** in the Neon Console. See [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).
   </Admonition>

3. Prepare a `customer.csv` file with the following data:

   ```text
   First Name,Last Name,Email
   1,Casey,Smith,casey.smith@example.com
   2,Sally,Jones,sally.jones@example.com
   ```

4. From your `psql` prompt, load the data from the `customer.csv` file using the `\copy` option.

   ```bash
   \copy customer FROM '/path/to/customer.csv' DELIMITER ',' CSV HEADER
   ```

   If the command runs successfully, it returns the number of records copied to the database:

   ```bash
   COPY 2
   ```

   For more information about the `\copy` option, refer to the [psql reference](https://www.postgresql.org/docs/current/app-psql.html), in the _PostgreSQL Documentation_.

<NeedHelp/>

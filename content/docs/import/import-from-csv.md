---
title: Import data from CSV
enableTableOfContents: true
---
This topic describes how to import data into a Neon database table from a CSV file.

The instructions require a working installation of [psql](https://www.postgresql.org/download/). The `psql` client is the native command-line client for PostgreSQL. It provides an interactive session for sending commands to PostgreSQL. For more information about `psql`, refer to the [psql reference](https://www.postgresql.org/docs/15/app-psql.html), in the _PostgreSQL Documentation_.

The following example uses the default `neondb` database that is created with each Neon project, a table named `customer`, and a data file named `customer.csv`. Data is loaded from the `customer.csv` into the `customer` table.

1. Connect to the neondb database using `psql`. For example:

   ```bash
   psql postgres://casey:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/neondb
   ```

   <Admonition type="tip">
   For more information about connecting with `psql`, see [Connect with psql](../../connect/query-with-psql-editor).
   </Adminition>

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

3. Load the data from the `customer.csv` file.

   The `customer.csv` file has the following data:

   ```text
   First Name,Last Name,Email
   Casey,Smith,casey.smith@example.com
   Sally,Jones,sally.jones@example.com
   ```

   From your `psql` prompt, load the data using the `\copy` option:

    ```bash
    \copy customer FROM '/path/to/customer.csv' DELIMITER ',' CSV HEADER
    ```

    The `/copy` option performs a frontend (client) copy. It runs an SQL `COPY` command, but instead of the server reading or writing the specified file, `psql` reads or writes the file and routes the data between remote host and the local file system, which means that file accessibility and privileges are those of the local user, and no SQL superuser privileges are required. For more information about the `/copy` option, refer to the [psql documentation](https://www.postgresql.org/docs/current/app-psql.html).

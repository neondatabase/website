---
title: Import data from CSV
enableTableOfContents: true
updatedOn: '2025-04-21T13:38:49.804Z'
---

This topic shows how to import data into a Neon database table from a CSV file using a simple example.

The instructions require a working installation of [psql](https://www.postgresql.org/download/). The `psql` client is the native command-line client for Postgres. It provides an interactive session for sending commands to Postgres. For installation instructions, see [How to install psql](/docs/connect/query-with-psql-editor#how-to-install-psql).

The following example uses the ready-to-use `neondb` database that is created with your Neon project, a table named `customer`, and a data file named `customer.csv`. Data is loaded from the `customer.csv` file into the `customer` table.

<Steps>

## Connect to your database

Connect to the `neondb` database using `psql`. For example:

```bash shouldWrap
psql "<your_neon_database_connection_string>"
```

You can find your connection string on your Neon Project Dashboard. Click on the **Connect** button. Use the drop-down menu to copy a full `psql` connection command.

<Admonition type="note">
For more information about connecting to Neon with `psql`, see [Connect with psql](/docs/connect/query-with-psql-editor).
</Admonition>

## Create the target table

Create the `customer` table — table you are importing to must exist in your database and the columns must match your CSV file.

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
You can also create tables using the **SQL Editor** in the Neon Console. See [Query with Neon's SQL Editor](/docs/get-started/query-with-neon-sql-editor).
</Admonition>

## Prepare the CSV file

Prepare a `customer.csv` file with the following data — note that the columns in the CSV file match the columns in the table you created in the previous step.

```text
First Name,Last Name,Email
1,Casey,Smith,casey.smith@example.com
2,Sally,Jones,sally.jones@example.com
```

## Load the data

From your `psql` prompt, load the data from the `customer.csv` file using the `\copy` option.

```bash
\copy customer FROM '/path/to/customer.csv' DELIMITER ',' CSV HEADER
```

If the command runs successfully, it returns the number of records copied to the database:

```bash
COPY 2
```

For more information about the `\copy` option, refer to the [psql reference](https://www.postgresql.org/docs/current/app-psql.html), in the _PostgreSQL Documentation_.

</Steps>

<NeedHelp/>

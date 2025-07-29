---
title: Connect a JavaScript/Node.js application to Neon Postgres
subtitle: Learn how to run SQL queries in Neon from JavaScript using pg, postgres.js, or
  the Neon serverless driver
enableTableOfContents: true
updatedOn: '2025-07-29T10:34:33.840Z'
---

This guide describes how to create a Neon project and connect to it from a Node.js application using popular Postgres clients:

- **[node-postgres (pg)](https://www.npmjs.com/package/pg)**: The most widely-used and robust driver for Node.js.
- **[Postgres.js](https://www.npmjs.com/package/postgres)**: A modern, high-performance driver with a focus on a great developer experience.
- **[@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless)**: The Neon serverless driver, which connects over HTTP and is optimized for serverless and edge environments.

You'll learn how to connect to your Neon database from a JavaScript application and perform basic Create, Read, Update, and Delete (CRUD) operations.

<Admonition type="important" title="Connect from the Server-Side Only">
Your database connection string contains sensitive credentials and must **never** be exposed in client-side javascript code (e.g., in a browser). All database operations should be handled in a secure, server-side environment like a Node.js backend or a serverless function.
</Admonition>

## Prerequisites

- A Neon account. If you do not have one, see [Sign up](https://console.neon.tech/signup).
- [Node.js](https://nodejs.org/) v18 or later.

<Steps>

## Create a Neon project

If you do not have one already, create a Neon project.

1.  Navigate to the [Projects](https://console.neon.tech/app/projects) page in the [Neon Console](https://console.neon.tech).
2.  Click **New Project**.
3.  Specify your project settings and click **Create Project**.

Your project is created with a ready-to-use database named `neondb`. In the following steps, you will connect to this database from your JavaScript application.

## Create a Node.js project

For your Node.js project, create a project directory, initialize it with `npm`, and install the required libraries.

1.  Create a project directory and change into it.

    ```bash
    mkdir neon-nodejs-quickstart
    cd neon-nodejs-quickstart
    ```

    > Open the directory in your preferred code editor (e.g., VS Code).

2.  Initialize a new Node.js project. The `-y` flag accepts all the default settings.

    ```bash
    npm init -y
    ```

3.  Install the required libraries using `npm`.

    <CodeTabs labels={["node-postgres (pg)", "Neon serverless driver", "postgres.js"]}>

    ```bash title="Install node-postgres (pg)"
    npm install pg dotenv
    ```

    ```bash title="Install Neon serverless driver"
    npm install @neondatabase/serverless dotenv
    ```

    ```bash title="Install postgres.js"
    npm install postgres dotenv
    ```

    </CodeTabs>

4.  Open your `package.json` file and add the following line into it:

    ```json
    {
      // other properties
      "type": "module"
    }
    ```

    This allows you to use ES module syntax (`import`) in your JavaScript files.

## Store your Neon connection string

Create a file named `.env` in your project's root directory. This file will securely store your database connection string, keeping your credentials separate from your source code.

1.  In the [Neon Console](https://console.neon.tech), select your project on the **Dashboard**.
2.  Click **Connect** on your **Project Dashboard** to open the **Connect to your database** modal.
    ![Connection modal](/docs/connect/connection_details.png)
3.  Select **Node.js** from the connection string dropdown and copy the full connection string.
4.  Add the connection string to your `.env` file as shown below.
    ```text
    DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
    ```
    > Replace `[user]`, `[password]`, `[neon_hostname]`, and `[dbname]` with your actual database credentials.

## Examples

This section provides example JavaScript scripts that demonstrate how to connect to your Neon database and perform basic operations such as [creating a table](#create-a-table-and-insert-data), [reading data](#read-data), [updating data](#update-data), and [deleting data](#deleting-data).

### Create a table and insert data

In your project directory, create a file named `create_table.js` and add the code for your preferred library. This script connects to your Neon database, creates a table named `books`, and inserts some sample data into it.

<CodeTabs labels={["node-postgres (pg)", "Neon serverless driver", "postgres.js"]}>

```javascript title="create_table.js"
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function setup() {
  const client = await pool.connect();
  try {
    console.log('Connection established');

    // Drop the table if it already exists
    await client.query('DROP TABLE IF EXISTS books;');
    console.log('Finished dropping table (if it existed).');

    // Create a new table
    await client.query(`
      CREATE TABLE books (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          author VARCHAR(255),
          publication_year INT,
          in_stock BOOLEAN DEFAULT TRUE
      );
    `);
    console.log('Finished creating table.');

    // Insert a single book record
    await client.query(
      'INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4);',
      ['The Catcher in the Rye', 'J.D. Salinger', 1951, true]
    );
    console.log('Inserted a single book.');

    // Data to be inserted
    const booksToInsert = [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, in_stock: true },
      { title: '1984', author: 'George Orwell', year: 1949, in_stock: true },
      { title: 'Dune', author: 'Frank Herbert', year: 1965, in_stock: false },
    ];

    // Insert multiple books
    for (const book of booksToInsert) {
      await client.query(
        'INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4);',
        [book.title, book.author, book.year, book.in_stock]
      );
    }
    console.log('Inserted 3 rows of data.');
  } catch (err) {
    console.error('Connection failed.', err.stack);
  } finally {
    client.release();
    pool.end();
  }
}

setup();
```

```javascript title="create_table.js"
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function setup() {
  try {
    console.log('Connection established');

    // Drop the table if it already exists
    await sql`DROP TABLE IF EXISTS books;`;
    console.log('Finished dropping table (if it existed).');

    // Create a new table
    await sql`
      CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        publication_year INT,
        in_stock BOOLEAN DEFAULT TRUE
      );
    `;
    console.log('Finished creating table.');

    // Insert a single book record
    await sql`
      INSERT INTO books (title, author, publication_year, in_stock)
      VALUES ('The Catcher in the Rye', 'J.D. Salinger', 1951, true);
    `;
    console.log('Inserted a single book.');

    // Data to be inserted
    const booksToInsert = [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', publication_year: 1937, in_stock: true },
      { title: '1984', author: 'George Orwell', publication_year: 1949, in_stock: true },
      { title: 'Dune', author: 'Frank Herbert', publication_year: 1965, in_stock: false },
    ];

    // Insert multiple books
    await sql`
      INSERT INTO books (title, author, publication_year, in_stock)
      VALUES (${booksToInsert[0].title}, ${booksToInsert[0].author}, ${booksToInsert[0].publication_year}, ${booksToInsert[0].in_stock}),
             (${booksToInsert[1].title}, ${booksToInsert[1].author}, ${booksToInsert[1].publication_year}, ${booksToInsert[1].in_stock}),
             (${booksToInsert[2].title}, ${booksToInsert[2].author}, ${booksToInsert[2].publication_year}, ${booksToInsert[2].in_stock});
    `;
    console.log('Inserted 3 rows of data.');
  } catch (err) {
    console.error('Connection failed.', err);
  }
}

setup();
```

```javascript title="create_table.js"
import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
});

async function setup() {
  try {
    console.log('Connection established');

    // Drop the table if it already exists
    await sql`DROP TABLE IF EXISTS books;`;
    console.log('Finished dropping table (if it existed).');

    // Create a new table
    await sql`
      CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        publication_year INT,
        in_stock BOOLEAN DEFAULT TRUE
      );
    `;
    console.log('Finished creating table.');

    // Insert a single book record
    await sql`
      INSERT INTO books (title, author, publication_year, in_stock)
      VALUES ('The Catcher in the Rye', 'J.D. Salinger', 1951, true);
    `;
    console.log('Inserted a single book.');

    // Data to be inserted
    const booksToInsert = [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', publication_year: 1937, in_stock: true },
      { title: '1984', author: 'George Orwell', publication_year: 1949, in_stock: true },
      { title: 'Dune', author: 'Frank Herbert', publication_year: 1965, in_stock: false },
    ];

    // Insert multiple books
    await sql`
      INSERT INTO books ${sql(booksToInsert, 'title', 'author', 'publication_year', 'in_stock')}
    `;
    console.log('Inserted 3 rows of data.');
  } catch (err) {
    console.error('Connection failed.', err);
  } finally {
    sql.end();
  }
}

setup();
```

</CodeTabs>

The above code does the following:

- Loads the connection string from the `.env` file.
- Connects to the Neon database.
- Drops the `books` table if it already exists to ensure a clean slate.
- Creates a table named `books` with columns for `id`, `title`, `author`, `publication_year`, and `in_stock`.
- Inserts a single book record and then multiple book records.

Run the script using the command for your runtime:

```bash
node create_table.js
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established
Finished dropping table (if it existed).
Finished creating table.
Inserted a single book.
Inserted 3 rows of data.
```

### Read data

In your project directory, create a file named `read_data.js`. This script connects to your Neon database and retrieves all rows from the `books` table.

<CodeTabs labels={[ "node-postgres (pg)","Neon serverless driver", "postgres.js"]}>

```javascript title="read_data.js"
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function readData() {
  const client = await pool.connect();
  try {
    console.log('Connection established');

    // Fetch all rows from the books table
    const { rows } = await client.query('SELECT * FROM books ORDER BY publication_year;');

    console.log('\n--- Book Library ---');
    rows.forEach((row) => {
      console.log(
        `ID: ${row.id}, Title: ${row.title}, Author: ${row.author}, Year: ${row.publication_year}, In Stock: ${row.in_stock}`
      );
    });
    console.log('--------------------\n');
  } catch (err) {
    console.error('Connection failed.', err.stack);
  } finally {
    client.release();
    pool.end();
  }
}

readData();
```

```javascript title="read_data.js"
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function readData() {
  try {
    console.log('Connection established');

    // Fetch all rows from the books table
    const books = await sql`SELECT * FROM books ORDER BY publication_year;`;

    console.log('\n--- Book Library ---');
    books.forEach((book) => {
      console.log(
        `ID: ${book.id}, Title: ${book.title}, Author: ${book.author}, Year: ${book.publication_year}, In Stock: ${book.in_stock}`
      );
    });
    console.log('--------------------\n');
  } catch (err) {
    console.error('Connection failed.', err);
  }
}

readData();
```

```javascript title="read_data.js"
import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
});

async function readData() {
  try {
    console.log('Connection established');

    // Fetch all rows from the books table
    const books = await sql`SELECT * FROM books ORDER BY publication_year;`;

    console.log('\n--- Book Library ---');
    books.forEach((book) => {
      console.log(
        `ID: ${book.id}, Title: ${book.title}, Author: ${book.author}, Year: ${book.publication_year}, In Stock: ${book.in_stock}`
      );
    });
    console.log('--------------------\n');
  } catch (err) {
    console.error('Connection failed.', err);
  } finally {
    sql.end();
  }
}

readData();
```

</CodeTabs>

Run the script using the command for your runtime:

```bash
node read_data.js
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: true
ID: 3, Title: 1984, Author: George Orwell, Year: 1949, In Stock: true
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: true
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: false
--------------------
```

### Update data

In your project directory, create a file named `update_data.js`. This script connects to your Neon database and updates the stock status of the book 'Dune' to `true`.

<CodeTabs labels={["node-postgres (pg)","Neon serverless driver", "postgres.js"]}>

```javascript title="update_data.js"
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function updateData() {
  const client = await pool.connect();
  try {
    console.log('Connection established');

    // Update a data row in the table
    await client.query('UPDATE books SET in_stock = $1 WHERE title = $2;', [true, 'Dune']);
    console.log("Updated stock status for 'Dune'.");
  } catch (err) {
    console.error('Connection failed.', err.stack);
  } finally {
    client.release();
    pool.end();
  }
}

updateData();
```

```javascript title="update_data.js"
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function updateData() {
  try {
    console.log('Connection established');

    // Update a data row in the table
    await sql`UPDATE books SET in_stock = ${true} WHERE title = ${'Dune'}`;
    console.log("Updated stock status for 'Dune'.");
  } catch (err) {
    console.error('Connection failed.', err);
  }
}

updateData();
```

```javascript title="update_data.js"
import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
});

async function updateData() {
  try {
    console.log('Connection established');

    // Update a data row in the table
    await sql`UPDATE books SET in_stock = ${true} WHERE title = ${'Dune'}`;
    console.log("Updated stock status for 'Dune'.");
  } catch (err) {
    console.error('Connection failed.', err);
  } finally {
    sql.end();
  }
}

updateData();
```

</CodeTabs>

Run the script using the command for your runtime:

```bash
node update_data.js
```

After running this script, you can run `read_data.js` again to verify the change.

```bash
node read_data.js
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: true
ID: 3, Title: 1984, Author: George Orwell, Year: 1949, In Stock: true
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: true
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: true
--------------------
```

> You can see that the stock status for 'Dune' has been updated to `true`.

### Delete data

In your project directory, create a file named `delete_data.js`. This script connects to your Neon database and deletes the book '1984' from the `books` table.

<CodeTabs labels={["node-postgres (pg)", "Neon serverless driver", "postgres.js"]}>

```javascript title="delete_data.js"
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function deleteData() {
  const client = await pool.connect();
  try {
    console.log('Connection established');

    // Delete a data row from the table
    await client.query('DELETE FROM books WHERE title = $1;', ['1984']);
    console.log("Deleted the book '1984' from the table.");
  } catch (err) {
    console.error('Connection failed.', err.stack);
  } finally {
    client.release();
    pool.end();
  }
}

deleteData();
```

```javascript title="delete_data.js"
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function deleteData() {
  try {
    console.log('Connection established');

    // Delete a data row from the table
    await sql`DELETE FROM books WHERE title = ${'1984'}`;
    console.log("Deleted the book '1984' from the table.");
  } catch (err) {
    console.error('Connection failed.', err);
  }
}

deleteData();
```

```javascript title="delete_data.js"
import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
});

async function deleteData() {
  try {
    console.log('Connection established');

    // Delete a data row from the table
    await sql`DELETE FROM books WHERE title = ${'1984'}`;
    console.log("Deleted the book '1984' from the table.");
  } catch (err) {
    console.error('Connection failed.', err);
  } finally {
    sql.end();
  }
}

deleteData();
```

</CodeTabs>

Run the script using the command for your runtime:

```bash
node delete_data.js
```

After running this script, you can run `read_data.js` again to verify that the row has been deleted.

```bash
node read_data.js
```

When the code runs successfully, it produces the following output:

```text title="Output"
Connection established

--- Book Library ---
ID: 2, Title: The Hobbit, Author: J.R.R. Tolkien, Year: 1937, In Stock: true
ID: 1, Title: The Catcher in the Rye, Author: J.D. Salinger, Year: 1951, In Stock: true
ID: 4, Title: Dune, Author: Frank Herbert, Year: 1965, In Stock: true
--------------------
```

> You can see that the book '1984' has been successfully deleted from the `books` table.

</Steps>

## Next steps: Using an ORM or framework

While this guide demonstrates raw SQL queries, for more advanced and maintainable data interactions, consider using an Object-Relational Mapper (ORM) or query builder. ORMs let you work with your data as objects and manage schema changes through migrations, keeping your database structure in sync with your application models.

Explore these guides to integrate popular data tools with Neon:

- [Connect with Prisma](/docs/guides/prisma)
- [Connect with Drizzle ORM](/docs/guides/drizzle)
- [Connect with TypeORM](/docs/guides/typeorm)
- [Connect with Sequelize](/docs/guides/sequelize)

## Using Bun or Deno

If you are using Bun or Deno, you can also connect to Neon databases using the Neon serverless driver or other Postgres clients. Follow these guides for more information:

- [Connect with Bun](/docs/guides/bun)
- [Connect with Deno](/docs/guides/deno)

## Source code

You can find the source code for the applications described in this guide on GitHub.

<DetailIconCards>

<a href="https://github.com/neondatabase/examples/tree/main/with-node-postgres" description="Get started with Node.js and Neon using node-postgres (pg)" icon="github">Get started with node-postgres (pg)</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-neon-serverless" description="Get started with Node.js and the Neon Serverless Driver" icon="github">Get started with the Neon Serverless Driver</a>

<a href="https://github.com/neondatabase/examples/tree/main/with-node-postgres-js" description="Get started with Node.js and Neon using postgres.js" icon="github">Get started with postgres.js</a>

</DetailIconCards>

## Resources

- [Neon Serverless Driver Documentation](https://github.com/neondatabase/serverless)
- [node-postgres (pg) documentation](https://node-postgres.com/)
- [Postgres.js documentation](https://github.com/porsager/postgres)

<NeedHelp/>

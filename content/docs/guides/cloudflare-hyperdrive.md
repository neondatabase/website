---
title: Use Neon with Cloudflare Hyperdrive
subtitle: Connect Cloudflare Hyperdrive to your Neon Postgres database for faster queries
enableTableOfContents: true
updatedOn: '2024-02-12T00:00:00.000Z'
---

[Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) is a serverless application that proxies queries to Postgres databases, and accelerates them. It works by maintaining a globally distributed pool of connections to your database, and routing queries to the closest available connection. 

This is specifically useful for serverless applications which can't maintain a persistent database connection and need to establish a new connection for each request. Hyperdrive can significantly reduce the latency of these queries and improve latency for your users.

This guide demonstrates how to configure a `Hyperdrive` service to connect to your Neon Postgres database. You cna then use the regular `node-postgres` client library to make queries to your database, and benefit from the performance improvements that Hyperdrive provides. 

NOTE: You need to be on Cloudflare Workers' paid plan to use Hyperdrive.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`. We'll use this database in the following examples.
- A Cloudflare account. If you do not have one, sign up for [Cloudflare Workers](https://workers.cloudflare.com/) to get started. 
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your local machine. We'll use Node.js to build and deploy our Workers application. 

## Setting up your Neon database

### Initialize a new project

Log in to the Neon console and navigate to the [Projects](https://console.neon.tech/app/projects) section.

- Click the `New Project` button to create a new project.

- From your project dashboard, navigate to the `SQL Editor` from the sidebar, and run the following SQL command to create a new table in your database:

    ```sql
    CREATE TABLE books_to_read (
        id SERIAL PRIMARY KEY,
        title TEXT,
        author TEXT
    );
    ```

    Next, we insert some sample data into the `books_to_read` table, so we can query it later:

    ```sql
    INSERT INTO books_to_read (title, author)
    VALUES
        ('The Way of Kings', 'Brandon Sanderson'),
        ('The Name of the Wind', 'Patrick Rothfuss'),
        ('Coders at Work', 'Peter Seibel'),
        ('1984', 'George Orwell');
    ```

### Retrieve your Neon database connection string

From your project dashboard, navigate to the **Connection Details** section to find your database connection string. It should look similar to this:

```bash
postgres://username:password@your-database-url.neon.tech/neondb?sslmode=require
```

Keep this connection string handy for later use. 

## Implementing your Node.js application

Create a new directory for your project and initialize a new Node.js project using the following commands:

```bash
mkdir neon-hyperdrive && cd neon-hyperdrive
npm init -y && npm pkg set type="module"
npm install pg
touch .env
```

We use the `npm pkg set type="module"` command to enable ES6 module support in our project. We also create a new `.env` file to store the DATABASE_URL environment variable, which we'll use to connect to our Neon database. Lastly, we install the `pg` library which is the Postgres driver we use to connect to our database.

```bash
# .env
DATABASE_URL=NEON_DATABASE_CONNECTION_STRING
```

We implement a simple Node.js application that connects to our Neon database and retrieves the list of books from the `books_to_read` table. Create a new file named `index.js` and add the following code to it:

```javascript
import pkg from 'pg';

const { Client } = pkg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
    await client.connect();

    const query = 'SELECT * FROM books_to_read';
    const result = await client.query(query);

    console.log('Books to read:');
    result.rows.forEach(row => {
        console.log(`${row.title} by ${row.author}`);
    });

    await client.end();
}

main().catch(console.error);
```

This code creates a new `Client` instance and connects to the database using the `DATABASE_URL` environment variable. It then runs a simple query to retrieve the list of books from the `books_to_read` table and prints them to the console. 

Test your application by running the following command:

```bash
node --env-file=.env index.js
```

You should see the list of books printed to the console. 
```txt
Books to read:
The Way of Kings by Brandon Sanderson
The Name of the Wind by Patrick Rothfuss
Coders at Work by Peter Seibel
1984 by George Orwell
```

npx wrangler hyperdrive create neon-test

## Setting up Cloudflare Hyperdrive

With our Node.js apllication working, we will now set up Cloudflare Hyperdrive to connect to Neon and accelerate the database queries.

### Create a new Hyperdrive service

We need to install the `Wrangler` CLI tool to create and deploy our Hyperdrive service. Run the following command to install the `Wrangler` CLI:

```bash
npm install wrangler
```


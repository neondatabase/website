---
title: Connect from Sequelize to Neon
subtitle: Learn how to connect to a Neon database from Sequelize
enableTableOfContents: true
---

[Sequelize](https://sequelize.org/) is a promise-based Node.js Object-Relational Mapping (ORM) library for SQL databases such as PostgreSQL. It provides a high-level abstraction for working with SQL databases and allows developers to interact with databases using JavaScript or TypeScript instead of writing SQL queries. It supports various features like transactions, relations, read replication, and more.

This guide provides a simple example showing how to set up Sequelize and connect to a Neon database. For more information about using Sequelize, please refer to the [Sequelize documentation](https://sequelize.org/docs/v6/).

## Prerequisites

- A Neon project. See [Create a Neon project](../manage/projects#create-a-project).
- Sequelize is a Node.js module, so you will need to have Node.js and npm (node package manager) installed on your machine. For instructions for your operating system, refer to the [npm Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

  On Debian-based system including Ubuntu, you can install Node.js and npm using `apt`.

  ```bash
  sudo apt update
  sudo apt install nodejs npm
  ```

  You can verify your installation by checking the versions of Node.js and npm:

  ```bash
  node -v
  npm -v
  ```

## Retrieve your Neon connection string

A database connection string is required to connect to your Neon database. To retrieve a connection string for your database:

1. Navigate to the Neon **Dashboard**.
2. Copy the connection string for your database from the **Connection Details** widget. The connection string should appear similar to the following:

    ```text
    postgres://<user>:<password>@ep-crimson-wildflower-999999.eu-central-1.aws.neon.tech/neondb
    ```

## Initialize a new Node.js project

Create a new directory for your project, navigate into it, and initialize a new Node.js project:

```bash
mkdir sequelize_test
cd sequelize_test
npm init -y
```

The `npm init -y` command initializes a new Node.js project with default settings.

## Install Sequelize and the PostgreSQL driver

In your project directory, install Sequelize and the PostgreSQL driver (`pg` and `pg-hstore`) using npm:

```bash
npm install --save sequelize pg pg-hstore
```

## Create a new JavaScript file to test the connection

1. In your project directory, create a new file (for example, `dbTest.js`) and open it in your favorite text editor.

    ```bash
    touch dbTest.js
    nano dbTest.js
    ```

2. In the `dbTest.js` file, add the following code. Replace the connection string with your own Neon connection string.

    <Admonition type="note">
    Neon requires a secure SSL connection. The `require: true` option tells Sequelize to connect over SSL.
    </Admonition>

    ```js
    const { Sequelize } = require('sequelize');

    const sequelize = new Sequelize('postgres://<user>:<password>@ep-crimson-wildflower-999999.eu-central-1.aws.neon.tech/neondb', {
    dialectOptions: {
        ssl: {
        require: true
        }
    }
    });

    sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');

        // Query the PostgreSQL version
        sequelize.query("SELECT version();")
        .then(results => {
            console.log('PostgreSQL Version:', results[0][0].version);
        })
        .catch(err => {
            console.error('Unable to retrieve PostgreSQL version:', err);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
    ```

## Run the script to test the connection

Save your file and exit the text editor. Then, run your script with Node.

```bash
node dbTest.js
```

If everything is set up correctly, you should see "Connection has been established successfully", and the PostgreSQL version you are connecting to should be returned.

<Admonition type="important">
Remember to handle your connection string securely, as it contains sensitive information. In a real project, you would not hardcode the connection string into your application; instead, you would use environment variables or some other secure configuration method.
</Admonition>

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).

---
title: Real-Time Notifications using pg_notify with Neon Postgres
subtitle: A step-by-step guide describing how to implement real-time notifications using pg_notify in Postgres
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-07-02T13:24:36.612Z'
updatedOn: '2024-07-02T13:24:36.612Z'
---

This step-by-step guide shows how you can implement real-time notifications in Postgres (powered by Neon). Real-time notifications provide a way to instantly notify users in an application. With [pg_notify](https://www.postgresql.org/docs/current/sql-notify.html) and [Postgres triggers](https://www.postgresql.org/docs/current/triggers.html), you can create a webhook-like system to invoke external services on specific database operations.

## Prerequisites

To follow the steps in this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en/blog/announcements/v18-release-announce) or later
- A [Neon](https://console.neon.tech/signup) account

## Steps

- [Provisioning a Postgres database powered by Neon](#provisioning-a-postgres-database-powered-by-neon)
- [Creating a new Node.js application](#creating-a-new-nodejs-application)
- [Set up triggers](#set-up-triggers)
- [Set up a Notifications Listener](#set-up-a-notifications-listener)
- [Notify using triggers](#notify-using-triggers)

## Provisioning a Postgres database powered by Neon

To get started, go to the [Neon console](https://console.neon.tech/app/projects) and enter the name of your choice as the project name.

You will then be presented with a dialog that provides a connecting string of your database. Make sure to **uncheck** the **Pooled connection checkbox** on the top right of the dialog and the connecting string automatically updates in the box below it.

![](/guides/images/pg-notify/index.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>
```

- `user` is the database user.
- `password` is the database user’s password.
- `endpoint_hostname` is the host with neon.tech as the [TLD](https://www.cloudflare.com/en-gb/learning/dns/top-level-domain/).
- `port` is the Neon port number. The default port number is 5432.
- `dbname` is the name of the database. “neondb” is the default database created with each Neon project.
- `?sslmode=require` an optional query parameter that enforces the [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode while connecting to the Postgres instance for better security.

Save this connecting string somewhere safe to be used as the `DATABASE_URL` further in the guide. Proceed further in this guide to create a Node.js application.

## Creating a new Node.js application

To start building the application, create a new Node.js project. Open your terminal and run the following command:

```bash
npm init -y
```

Further, execute the following command to install the dependencies to read the environment variables and connect to Postgres:

```bash
npm install pg dotenv
```

The libraries installed include:

- `pg`: A Postgres client for Node.js.
- `dotenv`: A library for handling environment variables.

Now, let's move on to setting up event triggers that will send notifications upon insertion of a row in a specific table.

## Set up triggers

To set up event triggers for a specific table (say `my_table`), you will define a trigger function called `my_trigger_function`. Create a file named `setup.js` with the following code:

```js shouldWrap
// File: setup.js

// Load all the environment variables
require('dotenv').config();

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

const client = new Client({ connectionString });

async function setupTrigger() {
  try {
    // Connect to Postgres
    await client.connect();
    // Create a my_table if it does not already exist
    await client.query(`CREATE TABLE IF NOT EXISTS
    my_table (id SERIAL PRIMARY KEY, message TEXT)`);
    // Define the my_trigger_function function to send notifications
    await client.query(`
    CREATE OR REPLACE FUNCTION my_trigger_function() RETURNS trigger AS $$
    BEGIN
      PERFORM pg_notify('channel_name', NEW.message);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`);
    // Create the my_trigger to call the my_trigger_function after each insert
    await client.query(`
    CREATE TRIGGER my_trigger
    AFTER INSERT ON my_table
    FOR EACH ROW
    EXECUTE FUNCTION my_trigger_function();`);
    console.log('Event triggers setup complete.');
    await client.end();
  } catch (e) {
    console.log(e);
  }
}

setupTrigger().catch(console.log);
```

In the code above, `my_trigger_function` function uses `pg_notify` to send a notification to the channel named `my_channel` with the content of the newly inserted `message`. Finally, it creates a trigger named `my_trigger` that will execute this function after each insertion in table named `my_table`. This ensures that any new message inserted into the table triggers the notification.

To execute the script as above, run the following command:

```bash
node setup.js
```

Now, let's move to setting up a notifications listener in Node.js.

## Set up a Notifications Listener

To listen for notifications in Node.js intended for the channel named `my_channel`, create a file `listen.js` with the following code:

```js
// File: listen.js

// Load all the environment variables
require('dotenv').config();

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

const client = new Client({ connectionString });

async function listenToNotifications() {
  try {
    // Connect to Postgres
    await client.connect();
    // Listen to specific channel in Postgres
    // Attach a listener to notifications received
    client.on('notification', (msg) => {
      console.log('Notification received', msg.payload);
    });
    await client.query('LISTEN channel_name');
    console.log('Listening for notifications on my_channel');
  } catch (e) {
    console.log(e);
  }
}

listenToNotifications().catch(console.log);
```

The code above begins with importing `pg` and loading all the enviroment variables into scope. Further, it initializes a client connection to your Postgres. In the `listenToNotifications` function, it sets up a listener to notifications using `client.on('notification', ...)` callback. To invoke the callback, it starts listening for notifications to channel named `my_channel`, using `LISTEN my_channel` command.

To keep listening to the notifications, you would want to keep running the following command:

```bash
node listen.js
```

Now, let's insert a row to invoke the triggers that will notify the listeners.

## Notify using triggers

To notify the listeners, you will use Postgres triggers. To programtically trigger an event that will be created upon insertion into the table named `my_table`, create a file `send.js` with the following code:

```js
// File: send.js

// Load all the environment variables
require('dotenv').config();

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

const client = new Client({ connectionString });

async function insertRow(message) {
  try {
    // Connect to Postgres
    await client.connect();
    // Insert a row into Postgres table
    await client.query('INSERT INTO my_table (message) VALUES ($1)', [message]);
    console.log("Inserted a row in the 'my_table' table.");
    await client.end();
  } catch (e) {
    console.log(e);
  }
}

insertRow('Hello, world!').catch(console.log);
```

The code above begins with importing `pg` and loading all the enviroment variables into scope. Further, it initializes a client connection to your Postgres. In the `insertRow` function, it simply inserts a row into the table named `my_table`.

To execute the script as above, run the following command:

```bash
node send.js
```

<Admonition type="note" title="Note">
As by default, [Neon's Autosuspend](/docs/introduction/auto-suspend) scales to zero after 5 minutes of inactivity, the NOTIFY/LISTEN command(s) only exist for the duration of the current session, and are lost when the session ends.
</Admonition>

## Summary

In this guide, you learned how to receive and send real-time notifications using `pg_notify` in Serverless Postgres. Using Postgres triggers, you can selectively listen to changes happening in specific database table(s), and perform a function that invokes `pg_notify` to send out the notifications to the connected listeners.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href='https://github.com/neondatabase/examples/tree/main/with-nodejs-pg-notify' description='pg_notify with Node.js and Neon' icon='github'>Set up notifications using pg_notify with Node.js and Neon</a>
</DetailIconCards>

<NeedHelp />

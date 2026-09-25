---
title: Real-time notifications using pg_notify with Lakebase Postgres
subtitle: A step-by-step guide describing how to implement real-time notifications using pg_notify in Postgres
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-07-02T13:24:36.612Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

This step-by-step guide shows how to implement real-time notifications in Postgres on Neon. Real-time notifications let an application react to database changes as they happen. With [pg_notify](https://www.postgresql.org/docs/current/sql-notify.html) and [Postgres triggers](https://www.postgresql.org/docs/current/triggers.html), you can create a webhook-like system to invoke external services on specific database operations.

## Prerequisites

To follow the steps in this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en/blog/announcements/v18-release-announce) or later
- A [Neon](https://console.neon.tech/signup) account

## Steps

- [Provisioning a Postgres database powered by Neon](#provisioning-a-postgres-database-powered-by-neon)
- [Creating a new Node.js application](#creating-a-new-nodejs-application)
- [Set up triggers](#set-up-triggers)
- [Set up a notifications listener](#set-up-a-notifications-listener)
- [Notify using triggers](#notify-using-triggers)

## Provisioning a Postgres database powered by Neon

To get started, go to the [Neon Console](https://console.neon.tech/app/projects) and create a project with the name of your choice.

Click **Connect** on the project dashboard to open the **Connect to your branch** modal. Turn off the **Connection pooling** toggle to get a direct connection string. `LISTEN` needs a persistent session, which the pooler's transaction mode doesn't provide.

![Neon Connection String without pooling](/docs/connect/connection_details_without_connection_pooling.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>
```

- `user` is the database user.
- `password` is the database user’s password.
- `endpoint_hostname` is your compute endpoint's hostname, which ends in `neon.tech`.
- `port` is the port number. The default is 5432.
- `dbname` is the name of the database. “neondb” is the default database created with each Neon project.
- `?sslmode=require&channel_binding=require` optional query parameters that enforce the [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode and channel binding when connecting to Postgres.

Save this connection string somewhere safe. You'll use it as the `DATABASE_URL` later in the guide.

## Creating a new Node.js application

To start building the application, create a new Node.js project. Open your terminal and run the following command:

```bash
npm init -y
```

Next, run the following command to install the dependencies to read the environment variables and connect to Postgres:

```bash
npm install pg dotenv
```

The libraries installed include:

- `pg`: A Postgres client for Node.js.
- `dotenv`: A library for handling environment variables.

Now, let's move on to setting up event triggers that will send notifications upon insertion of a row in a specific table.

## Configure environment variables

Create a `.env` file in the root directory of your project and add the following line, replacing `<your_connection_string>` with the connection string you saved earlier:

```env
DATABASE_URL=<your_connection_string>
```

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

In the code above, the `my_trigger_function` function uses `pg_notify` to send a notification to the channel named `channel_name` with the content of the newly inserted `message`. The script then creates a trigger named `my_trigger` that runs this function after each insert into `my_table`, so every new message sends a notification.

To execute the script as above, run the following command:

```bash
node setup.js
```

Now, let's move to setting up a notifications listener in Node.js.

## Set up a notifications listener

To listen in Node.js for notifications on the channel named `channel_name`, create a file `listen.js` with the following code:

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

The code above imports `pg`, loads the environment variables, and creates a client for your database. The `listenToNotifications` function registers a `client.on('notification', ...)` callback, then subscribes to the `channel_name` channel with the `LISTEN channel_name` command.

Run the listener and leave it running:

```bash
node listen.js
```

Now, let's insert a row to invoke the triggers that will notify the listeners.

## Notify using triggers

To notify the listeners, you will use Postgres triggers. To programmatically trigger an event that will be created upon insertion into the table named `my_table`, create a file `send.js` with the following code:

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

The code above imports `pg`, loads the environment variables, and creates a client for your database. The `insertRow` function inserts a row into `my_table`, which fires the trigger and notifies the listener.

To execute the script as above, run the following command:

```bash
node send.js
```

<Admonition type="note" title="Note">
By default, a Neon compute scales to zero after 5 minutes of inactivity, which ends any running sessions. `NOTIFY` and `LISTEN` only persist for the duration of the current session and are lost when the session ends.

If you need persistent listeners, you can [disable scale to zero](/docs/guides/scale-to-zero-guide#enable-or-disable-scale-to-zero) on a paid plan. Listeners are still [terminated when the compute restarts](/docs/reference/compatibility#session-context), so your listener should reconnect and re-run `LISTEN`, and it may miss messages sent while it was disconnected.
</Admonition>

## Summary

You now have a Postgres trigger that calls `pg_notify` on every insert into `my_table`, and a Node.js listener that receives those notifications. You can apply the same pattern to other tables and send the payloads on to external services.

## Source code

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
<a href='https://github.com/neondatabase/examples/tree/main/with-nodejs-pg-notify' description='pg_notify with Node.js and Neon' icon='github'>Set up notifications using pg_notify with Node.js and Neon</a>
</DetailIconCards>

<NeedHelp />

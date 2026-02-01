---
title: Using LISTEN and NOTIFY for Pub/Sub in PostgreSQL
subtitle: A step-by-step guide describing how to use LISTEN and NOTIFY for pub/sub in Postgres
author: vkarpov15
enableTableOfContents: true
createdAt: '2025-03-28T13:24:36.612Z'
updatedOn: '2025-03-28T13:24:36.612Z'
---

PostgreSQL has a built-in mechanism for publish/subscribe (Pub/Sub) communication using the `LISTEN` and `NOTIFY` commands.
This allows different sessions to send messages to each other using Postgres, without needing a separate service like Kafka or RabbitMQ.

## Steps

- Overview
- Set Up a Listener in Node.js
- Send a Message using `NOTIFY`
- Limitations of `LISTEN`/`NOTIFY`

### Overview

At a high level, the following is how `LISTEN` and `NOTIFY` are used.

1. A client subscribes to a notification channel using `LISTEN`.
2. Another client sends a message to that channel using `NOTIFY`.
3. The subscribed client receives the notification asynchronously.

### Set Up a Listener in Node.js

Because of connection pooling, setting up a pub/sub listener in the Neon console is tricky.
But you can create a Node.js script that listens to notifications on the channel `my_channel` as follows.
Note that you do **not** need to explicitly create the `my_channel` channel, subscribing to the channel also creates the channel.

Create a new directory and initialize a new Node.js project.

```bash
mkdir pg-listen-notify
cd pg-listen-notify
npm init -y && npm install pg dotenv
```

Then, create a new file `listener.js` with the following content.

```javascript
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function setupListener() {
  await client.connect();
  await client.query('LISTEN my_channel');
  console.log('Listening for notifications on my_channel...');

  client.on('notification', (msg) => {
    console.log('Received notification:', msg.payload);
  });
}

setupListener().catch(console.error);
```

Make sure to disable connection pooling in your Neon connection string (make sure your connection string does not include `-pooler`).

![Connection String without Pooler](/docs/connect/connection_details_without_connection_pooling.png)

`LISTEN` and `NOTIFY` are session-specific features and are not compatible with Neon connection pooling.

Create a `.env` file in the same directory with your Neon connection string.

```
DATABASE_URL=your_neon_connection_string_without_pooler
```

Run the listener script:

```bash
node listener.js
```

You should see the following output:

```
Listening for notifications on my_channel...
```

Keep the above script running, you will trigger a notification in the next section.

### Send a Message using NOTIFY

With the listener now configured, connect to your Neon database using the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or a client like [psql](/docs/connect/query-with-psql-editor). Then, run the following command to publish a notification to the `my_channel` channel.

```sql
NOTIFY my_channel, 'Hello from another session!';
```

After running the above, your Node.js script should print out the following output.

```
Received notification: Hello from another session!
```

You can also use the `pg_notify()` function as follows, which is equivalent to the `NOTIFY` command above.

```sql
SELECT pg_notify('my_channel', 'Hello from pg_notify!');
```

Note that you don't need to explicitly create a channel.

### Limitations of LISTEN/NOTIFY

Postgres `LISTEN` and `NOTIFY` run entirely in memory and do not persist any data.
If there are no listeners when a `NOTIFY` runs, the message disappears and Postgres does not provide a mechanism to replay messages.
While the memory overhead of `LISTEN` is minimal, `LISTEN` can cause performance degradations at scale if notifications start using up too much memory.

There is also no way to ensure that a message was delivered to a listener.
If you need message persistence or guarantees that a message was processed, you should look at dedicated message queues like RabbitMQ or Kafka.

If you are using `LISTEN` and `NOTIFY`, you should disable Neon's [Scale to Zero feature](/docs/introduction/scale-to-zero).
If Neon scales your compute to 0, [it will terminate all listeners](/docs/reference/compatibility#session-context), which may lead to lost messages when your database reactivates.

## Resources

- [PostgreSQL Documentation on LISTEN and NOTIFY](https://www.postgresql.org/docs/current/sql-listen.html)

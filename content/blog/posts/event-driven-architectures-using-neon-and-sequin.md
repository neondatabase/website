---
title: Event-driven architectures using Neon and Sequin
description: A low-maintenance stack to stream database changes
excerpt: >-
  You’ll often want changes in your database to trigger changes in your
  application. Or want to replicate a database change to another service. Think
  of fanning out work when a new order comes in, updating a materialized view as
  sales finalize, or logging a change to an audit syste...
date: '2024-10-22T15:57:27'
updatedOn: '2024-10-22T15:59:20'
category: community
categories:
  - community
authors:
  - eric-goldman
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/event-driven-architectures-using-neon-and-sequin/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Event-driven architectures using Neon and Sequin - Neon
  description: >-
    A lightweight CDC stack to detect, stream, and process every row change in
    Neon with no new dependencies using Sequin.
  keywords: []
  noindex: false
  ogTitle: Event-driven architectures using Neon and Sequin - Neon
  ogDescription: >-
    A lightweight CDC stack to detect, stream, and process every row change in
    Neon with no new dependencies using Sequin.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/event-driven-architectures-using-neon-and-sequin/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/event-driven-architectures-using-neon-and-sequin/event-driven-architectures-using-neon-and-sequin-1-1024x576-f98b77f4.jpg)

You’ll often want changes in your database to trigger changes in your application. Or want to replicate a database change to another service. Think of fanning out work when a new order comes in, updating a materialized view as sales finalize, or logging a change to an audit system.

Capturing changes from your database (CDC) to then trigger events or replicate data is commonly implemented [with a combination of Debezium and Kafka](https://neon.tech/docs/guides/logical-replication-kafka-confluent). Debezium captures the changes while Kafka persists those changes until they are processed. But this is a notoriously complex stack: both tools require significant time and expertise to properly configure while also requiring you to master and scale new infrastructure. It’s a heavy dependency compared to the nimbleness of Neon.

In this post, we present you with an alternative, using [Sequin](https://sequinstream.com/) to detect, stream, and process every row change in Neon with no new dependencies.

## How Sequin streams rows from Neon

Sequin is a tool for capturing changes and streaming data from your Postgres database. It uses a logical replication slot to create a strictly ordered view of rows in your tables, making it possible to process every change to a table’s rows as a stream. You can then consume rows using Sequin’s APIs.

So, when you complete an `insert into order`, Sequin detects the new row and delivers it to your consumers. Sequin will retry delivery of a row until it is processed – just like Debezium / Kafka.

In effect, Sequin streams rows from your Neon table without copying the data to a new service. Because it’s all Postgres under the hood – Neon’s amazing developer tooling (like branching, recovery, etc) works with Sequin as well.

Let’s see how to get this set up:

## Streaming a Neon table with Sequin

You can use Sequin as an open-source, self-hosted Docker container in front of your Neon database, or take advantage of their hosted service.

You’ll then connect your Neon database to Sequin, configure the tables you want to stream, and then begin processing changes in real-time using Sequin’s APIs. We’ll walk through the steps below, but feel free to check out the [integration guide in the Neon docs](https://neon.tech/docs/guides/sequin) if you need more details.

### Connect your Neon database to Sequin

Sequin uses a logical replication slot to detect changes from your Postgres database. As a first step, [enable logical replication for your project:](https://neon.tech/docs/guides/logical-replication-postgres)

1. Select your project in the Neon Console.
2. Navigate to settings and select **Logical Replication**.
3. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query in the Neon SQL Editor:

````sql
```
SHOW wal_level;
wal_level
-----------
logical
```
````

Now that your Neon database is set up for replication, connect it to Sequin:

1. In the Neon Console, copy your database connection string from the **Connection Details** section on the **Project Dashboard.**

1.

1. Open the Sequin Console in a new tab and click the **Connect Database** button. Select the **Autofill with URL** button and paste your database string.
1. Use the SQL Editor in your Neon project to create a replication slot for Sequin by executing the following SQL query:

```sql
SELECT pg_create_logical_replication_slot('sequin_slot', 'pgoutput');
```

4. Create a publication to indicate which tables will publish changes to the replication slot. Run the following SQL command:

```sql
CREATE PUBLICATION sequin_pub FOR ALL TABLES;
```

5\. Finally, back in the Sequin Console, give your database a name (e.g., `neondb`) and click **Create Database.**

### Create a sequence

Sequin is now connected to your Neon database via a replication slot. You’ll now create a Sequence – which is how Sequin creates a strictly ordered view of the rows in your table that you can consume, rewind, and replay as a stream.

1. Navigate to the **Sequence** tab and click **Create Sequence.**
2. Select the table you want to stream and then finish setting up the Sequence by selecting a sort column.
3. Click **Create Sequence.**

Your Neon table is now configured to stream rows as they change. Notably, Sequin’s designed to pull rows right from your table before delivering them to consumers. It doesn’t copy rows into a new system.

### Setup a new consumer group

1. Navigate to the **Consumers** tab and click **Create Consumer Group.**
2. Select the Sequence you configured in the previous step and add any filters. Sequin can filter which messages are delivered to your consumer using SQL where conditions.
3. Now, select where in the Sequence the consumer should start. You can have the consumer start at the beginning of the Sequence, at a specific point in the Sequence, or from now onward..
4. Finally, select **pull** and click **Create Consumer.**

Every time a row changes in your Neon database, Sequin will add it to the end of the Sequence. The row will be delivered to your consumer until it is acknowledged, providing an exactly-once processing guarantee.

### Process rows

Now, work with the rows streaming from your table. Here’s how you might process orders.

Create a new order:

1.

```sql
INSERT INTO orders (order_id, customer_id, order_date, total_amount, status) 
VALUES (1001, 'CUST123', '2024-10-11', 199.99, 'PENDING');`
```

Now, **receive** the next message from your consumer:

1.

```bash
	curl --request POST \
  	--url https://api.sequinstream.com/api/http_pull_consumers/orders-pull-consumer/receive \
  	--header 'Authorization: Bearer YOUR_API_TOKEN' \
  	--header 'Content-Type: application/json' \
 	 -d '{ "batch_size": 10 }'
```

Which will return the order you just created:

```bash
{
  "data": [
    {
      "ackToken": "MTYyeJ7abUjl1pO",
      "data": {
        "record": {
          "id": 1001,
          "customerId": "CUST123",
          "orderDate": "2024-10-11",
          "totalAmount": 199.99,
          "status": "PENDING"
        }
      }
    }
  ]
}
```

Once you process the order, your consumer can acknowledge the message:

```bash
	curl --request POST \
 	 --url https://api.sequinstream.com/api/http_pull_consumers/orders-pull-consumer/ack \
 	 --header 'Authorization: Bearer YOUR_API_TOKEN'\
  	--header 'Content-Type: application/json' \
  	--data '{
   		 "ack_tokens": ["MTYyeJ7abUjl1pO"]
  		}'
```

Every change to your orders table will be captured, added to the Sequence, and made available to consumers until processed.

## Getting started

You can start streaming data from your Neon database right now:

- Create a [Neon project](https://neon.tech/)
- Create a [Sequin account](https://sequinstream.com/)

If you have any questions, we’ll be happy to help on the [Neon](https://discord.gg/92vNTzKDGp) or [Sequin](https://discord.gg/BV8wFXvNtY) Discord servers.

---
title: Stream database changes in real-time with Prisma Pulse
subtitle: Learn how to create event-driven flows on your backend triggered by changes in
  your Neon Postgres database
enableTableOfContents: true
isDraft: false
updatedOn: '2024-08-20T15:54:36.214Z'
---

<LRBeta/>

Neon's Logical Replication feature enables you to subscribe to changes in your database, supporting things like replication or creating event-driven functionality.

[Prisma Pulse](https://www.prisma.io/data-platform/pulse?utm_source=neon&utm_medium=pulse-guide) is a fully managed, production-ready service that connects to your Neon Postgres database, and allows you to stream changes from your database in real-time, integrated closely with [Prisma ORM](https://www.prisma.io/orm?utm_source=neon&utm_medium=pulse-guide).

In this guide, you will learn how to set up Prisma Pulse with your Neon database and create your first event stream.

<Admonition type="tip">
What can you make with database event-driven architecture?

Set up real-time triggers for your Inngest workflows, re-index your TypeSense search whenever data changes, and much more.
</Admonition>

## Prerequisites

- A [Neon account](https://console.neon.tech/)
- A [Prisma Data Platform account](https://pris.ly/pdp?utm_source=neon&utm_medium=pulse-guide)

## Enable logical replication in Neon

<Admonition type="important">
Enabling logical replication modifies the Postgres `wal_level` configuration parameter, changing it from `replica` to `logical` for all databases in your Neon project. Once the `wal_level` setting is changed to `logical`, it cannot be reverted. Enabling logical replication also restarts all computes in your Neon project, meaning active connections will be dropped and have to reconnect.
</Admonition>

To enable logical replication in Neon:

1. Select your project in the Neon Console.
2. On the Neon **Dashboard**, select **Project settings**.
3. Select **Beta**.
4. Click **Enable** to enable logical replication.

You can verify that logical replication is enabled by running the following query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor):

```sql
SHOW wal_level;
 wal_level
-----------
 logical
```

## Connect Prisma Pulse

1. If you haven't already done so, create a new account or sign in on the [Prisma Data Platform](https://pris.ly/pdp?utm_source=neon&utm_medium=pulse-guide).
2. In the [Prisma Data Platform Console](https://console.prisma.io?utm_source=neon&utm_medium=pulse-guide) create a new project by clicking the **New project** button.
3. In the **New project** configuration, select **Pulse** as your starting point.
4. Copy your database connection string from Neon into the database connection input field on the Platform Console.
5. Choose a region that is closest to your Neon database.
6. Click **Create project**.
7. We recommend leaving **Event persistence** switched **on** (default). This means Prisma Pulse will automatically store events in the case your server goes down, allowing you to resume again with zero data loss.
8. Click **Enable Pulse**.
9. After Pulse has been enabled (this may take a moment), generate an API key by clicking **Generate API key**. Save this for later.

## Your first stream

### Set up your project

Create a new TypeScript project with Prisma:

```
npx try-prisma -t typescript/starter
```

If you already have a TypeScript project with Prisma client installed, you can skip this.

### From the root of your project, install the Pulse extension

```bash
npm install @prisma/extension-pulse@latest
```

### Extend your Prisma Client instance with the Pulse extension

Add the following to extend your existing Prisma Client instance with the Prisma Pulse extension. Don't forget to insert your own API key.

```tsx
import { PrismaClient } from '@prisma/client';
import { withPulse } from '@prisma/extension-pulse';

const prisma = new PrismaClient().$extends(withPulse({ apiKey: '<your Pulse API key>' }));
```

<Admonition type="note">
For a real production use case, you should consider moving sensitive values like your API key into environment variables.
</Admonition>

### Create your first Pulse stream

The code below subscribes to a `User` model in your Prisma schema. You can use a similar approach to subscribe to any model that exists in your project.

```tsx
import { PrismaClient } from '@prisma/client';
import { withPulse } from '@prisma/extension-pulse';

const prisma = new PrismaClient().$extends(withPulse({ apiKey: '<your Pulse API key>' }));

async function main() {
  // Create a stream from the 'User' model
  const stream = await prisma.user.stream({ name: 'user-stream' });

  for await (const event of stream) {
    console.log('Just received an event:', event);
  }
}

main();
```

### Trigger a database change

You can use Prisma Studio to easily make changes in your database, to trigger events. Open Prisma Studio by running: `npx prisma studio`

After making a change in Studio, you should see messages appearing in your terminal like this:

```bash
Just received an event: {
  action: 'create',
  created: {
    id: 'clzvgzq4b0d016s28yluse9r1',
    name: 'Polly Pulse',
    age: 35
  },
  id: '01J5BCFR8F8DBJDXAQ5YJPZ6VY',
  modelName: 'User'
}
```

## What's next?

- [Set up real-time triggers for your Inngest workflows](https://pris.ly/pulse-inngest-router?utm_source=neon&utm_medium=pulse-guide)
- [Re-index your TypeSense search instantly when data changes](https://pris.ly/pulse-typesense?utm_source=neon&utm_medium=pulse-guide)
- [Automatically send onboarding emails with Resend when a new user is created](https://pris.ly/pulse-resend?utm_source=neon&utm_medium=pulse-guide)

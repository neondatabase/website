---
title: Trigger serverless functions
subtitle: Use Inngest to trigger serverless functions from your Neon database changes
enableTableOfContents: true
updatedOn: '2024-10-27T12:04:25.600Z'
---

Combining your serverless Neon database with [Inngest](https://www.inngest.com/?utm_source=neon&utm_medium=trigger-serverless-functions-guide) enables you to **trigger serverless functions** running on Vercel, AWS, and Cloudflare Worker **based on database changes.**

By enabling your serverless functions to react to database changes, you open the door to many use cases. From onboarding to ETL and AI workflows, the possibilities are endless.

![trigger serverless functions with inngest](/docs/guides/inngest.jpg)

This guide describes setting up a Neon database, configuring the Inngest integration, and connecting your Serverless functions to your Neon database with Inngest. It covers:

- Creating a Neon project and enabling [Logical Replication](/docs/guides/logical-replication-guide).
- Configuring the Inngest integration on your Neon database.
- Configure your Vercel, AWS, or Cloudflare functions to react to your Neon database changes using Inngest.

## Prerequisites

- A Neon account. If you do not have one, see [Sign up](/docs/get-started-with-neon/signing-up) for instructions.
- An Inngest account. You can create a free Inngest account by [signing up](https://app.inngest.com/sign-up?utm_source=neon&utm_medium=trigger-serverless-functions-guide).

## Create a Neon project

If you do not have one already, create a Neon project:

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Create a table in Neon

To create a table, navigate to the **SQL Editor** in the [Neon Console](https://console.neon.tech/):

In the SQL Editor, run the following queries to create a `users` table and insert some data:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (name, email)
VALUES
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com'),
    ('Charlie', 'charlie@example.com'),
    ('Dave', 'dave@example.com'),
    ('Eve', 'eve@example.com');
```

## Enabling Logical Replication on your database

The Inngest Integration relies on Neon’s Logical Replication feature to get notified upon database changes.

Navigate to your Neon Project using the Neon Console and open the **Settings** > **Logical Replication** page. From here, follow the instructions to enable Logical Replication:

![Neon dashboard settings with option to enable logical replication](/docs/guides/neon-console-settings-logical-replication.png)

## Configuring the Inngest integration

Your Neon database is now ready to work with Inngest.

To configure the Inngest Neon Integration, navigate to the Inngest Platform, open the [Integrations page](https://app.inngest.com/settings/integrations?utm_source=neon&utm_medium=trigger-serverless-functions-guide), and follow the instructions of the [Neon Integration installation wizard](https://app.inngest.com/settings/integrations/neon/connect?utm_source=neon&utm_medium=trigger-serverless-functions-guide):

![Neon integration card inside the Inngest integrations page](/docs/guides/inngest-integrations-page.png)

The Inngest Integration requires Postgres admin credentials to complete its setup. _These credentials are not stored and are only used during the installation process_.

![Neon authorization step inside the Inngest integrations page](/docs/guides/inngest-integration-neon-authorize-step.png)

You can find your admin Postgres credentials in your Neon project dashboard’s **Connection Details** section:

![Connection details section on the Neon console dashboard](/docs/guides/neon-console-connection-details.png)

## Triggering Serverless functions from database changes

Any changes to your Neon database are now dispatched to your Inngest account.  
To enable your Serverless functions to react to database changes, we will:

- Install the Inngest client to your Serverless project
- Expose a serverless endpoint enabling Inngest to discover your Serverless functions
- Configure your Serverless application environment variables
- Connect a Serverless function to any change performed to the `users` table.

### 1. Configuring the Inngest client

First, install the Inngest client:

```bash
npm i inngest
```

Then, create a `inngest/client.ts` (_or `inngest/client.js`_) file as follows:

```typescript
// inngest/client.ts
import { Inngest } from 'inngest';

export const inngest = new Inngest({ id: 'neon-inngest-project' });
```

### 2. Listen for new `users` rows

Any change performed on our Neon database will trigger an [Inngest Event](https://www.inngest.com/docs/features/events-triggers?utm_source=neon&utm_medium=trigger-serverless-functions-guide) as follows:

```json
{
  "name": "db/users.inserted",
  "data": {
    "new": {
      "id": {
        "data": 2,
        "encoding": "i"
      },
      "name": {
        "data": "Charly",
        "encoding": "t"
      },
      "email": {
        "data": "charly@inngest.com",
        "encoding": "t"
      }
    },
    "table": "users",
    "txn_commit_time": "2024-09-24T14:41:19.75149Z",
    "txn_id": 36530520
  },
  "ts": 1727146545006
}
```

Inngest enables you to create [Inngest Functions](https://www.inngest.com/docs/features/inngest-functions?utm_source=neon&utm_medium=trigger-serverless-functions-guide) that react to Inngest events (here, database changes).

Let's create an Inngest Function listening for `"db/users.inserted"` events:

```typescript
// inngest/functions/new-user.ts
import { inngest } from '../client'

export newUser = inngest.createFunction(
  { id: "new-user" },
  { event: "db/users.inserted" },
  async ({ event, step }) => {
    const user = event.data.new

    await step.run("send-welcome-email", async () => {
      // Send welcome email
      await sendEmail({
        template: "welcome",
        to: user.email,
      });
    });

    await step.sleep("wait-before-tips", "3d");

    await step.run("send-new-user-tips-email", async () => {
      // Follow up with some helpful tips
      await sendEmail({
        template: "new-user-tips",
        to: user.email,
      });
    });
  }
)
```

### 3. Exposing your Serverless Functions to Inngest

To allow Inngest to run your Inngest Functions, add the following Serverless Function, which serves as a router:

<CodeTabs labels={["Vercel", "AWS Lambda", "Cloudflare Workers"]}>

```typescript
// src/app/api/inngest/route.ts
import { serve } from 'inngest/next';
import { inngest } from '@lib/inngest/client';
import newUsers from '@lib/inngest/functions/newUsers'; // Your own functions

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [newUsers],
});
```

```typescript
import { serve } from 'inngest/lambda';
import { inngest } from './client';
import newUsers from './functions/newUsers'; // Your own function

export const handler = serve({
  client: inngest,
  functions: [newUsers],
});
```

```js
// /functions/api/inngest.js
import { serve } from 'inngest/cloudflare';
import { inngest } from './client';
import newUsers from './functions/newUsers';

export default {
  fetch: serve({
    client: inngest,
    functions: [newUsers],
  }),
};
```

</CodeTabs>

<Admonition type="note">
You can find more information about serving Inngest Functions in [Inngest's documentation](https://www.inngest.com/docs/reference/serve?utm_source=neon&utm_medium=trigger-serverless-functions-guide#serve-client-functions-options).
</Admonition>

### 4. Configuring your Serverless application

We can now configure your Serverless application to sync with the Inngest Platform:

- **Vercel:** Configure the [Inngest Vercel Integration](https://www.inngest.com/docs/deploy/vercel?utm_source=neon&utm_medium=trigger-serverless-functions-guide).
- **AWS Lambda:** Configure a [Lambda function URLs](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html) and [sync your serve Lambda with Inngest](https://www.inngest.com/docs/apps/cloud?utm_source=neon&utm_medium=trigger-serverless-functions-guide#sync-a-new-app-in-inngest-cloud).
- **Cloudflare Workers:** [Add the proper environment variables](https://www.inngest.com/docs/deploy/cloudflare?utm_source=neon&utm_medium=trigger-serverless-functions-guide) to your Cloudflare Pages project and [sync with Inngest](https://www.inngest.com/docs/apps/cloud?utm_source=neon&utm_medium=trigger-serverless-functions-guide#sync-a-new-app-in-inngest-cloud).

### 5. Testing our Serverless function

We are now all set!

Go to the **Tables** page in the Neon Console and add a new record to the `users` table:

![You can add a new record to the users table directly from the Neon console](/docs/guides/inngest-integration-neon-console-users-table-add-new-record.png)

You should see a new run of the `new-user` function appear on the [Inngest Platform](https://app.inngest.com/?utm_source=neon&utm_medium=trigger-serverless-functions-guide):

![The Inngest Platform lists all the runs](/docs/guides/inngest-integrations-inngest-platform-new-runs.png)

## Going further

Your Serverless functions can now react to your Neon database changes.

In addition to being good for system design, Inngest has some special features that work great with database triggers:

- **[Fan-out](https://www.inngest.com/docs/guides/fan-out-jobs?utm_source=neon&utm_medium=trigger-serverless-functions-guide)**: Lets **one database event start multiple functions** at the same time. For example, when a new user is added, it could send a welcome email and set up a free trial, all at once.
- **[Batching](https://www.inngest.com/docs/guides/batching?utm_source=neon&utm_medium=trigger-serverless-functions-guide)** **Groups many database changes together** to handle them more efficiently. It's useful when you need to update lots of things at once, like when working with online stores.
- **[Flow control](https://www.inngest.com/docs/guides/flow-control?utm_source=neon&utm_medium=trigger-serverless-functions-guide)**: Helps manage how often functions run. It can slow things down to **avoid overloading systems, or wait a bit to avoid doing unnecessary work**. This is helpful when working with other services that have limits on how often you can use them.

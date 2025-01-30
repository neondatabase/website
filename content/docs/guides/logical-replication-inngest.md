---
title: Replicate data with Inngest
subtitle: Learn how to replicate data from Neon with Inngest
enableTableOfContents: true
isDraft: false
updatedOn: '2024-12-26T17:57:49.405Z'
---

Neon's logical replication feature allows you to replicate data from your Neon Postgres database to external destinations.

[Inngest](https://www.inngest.com?utm_source=neon&utm_medium=logical-replication-guide) is a durable workflow platform that allows you to trigger workflow based on Neon database changes. With its native Neon integration, it is the easiest way to set up data replication with custom transformations or 3rd party API destinations (ex, Neon to Amplitude, Neon to S3).

In this guide, you will learn how to configure your Inngest account for ingesting changes from your Neon database, enabling you to replicate data from Neon to Inngest workflows.

## Prerequisites

- A [Inngest account](https://www.inngest.com?utm_source=neon&utm_medium=logical-replication-guide)
- A [Neon account](https://console.neon.tech/)
- Read the [important notices about logical replication in Neon](/docs/guides/logical-replication-neon#important-notices) before you begin

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

## Example: Replicating data to Amplitude

The below example demonstrates how to replicate new `users` table rows to Amplitude using Amplitude's API.

Once the Inngest integration is installed, a flow of `"db/*"` events will be created when updates are made to your database.

For example, if you create a new user in your database, a `"db/users.updated"` [event](https://www.inngest.com/docs/features/events-triggers?utm_source=neon&utm_medium=logical-replication-guide) will be created:

```json
{
  "name": "db/users.updated",
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

Such events can be used to trigger Inngest functions to transform and replicate data to external destinations like Amplitude:

```typescript
// inngest/functions/users-replication.ts
import { inngest } from './client';

export const updateAmplitudeUserMapping = inngest.createFunction(
  { id: 'update-amplitude-user-mapping' },
  { event: 'db/users.updated' },
  async ({ event, step }) => {
    // Extract the user data from the event
    const { data } = event;
    const { id, email } = data.new;

    // Update the user mapping in Amplitude
    await step.run('update-amplitude-user-mapping', async () => {
      const response = await fetch(
        `https://api.amplitude.com/usermap?mapping=[{"user_id":"${id}", "global_user_id": "${email}"}]&api_key=${process.env.AMPLITUDE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to send user data to Amplitude: ${response.statusText}`);
      }

      return response.json();
    });

    return { success: true };
  }
);
```

<NeedHelp/>

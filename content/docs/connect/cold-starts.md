---
title: Manage cold starts
enableTableOfContents: true
isDraft: true
---

With serverless architectures and auto-scaling systems such as Neon, a common challenge that arises is "cold starts". For Neon, a cold start refers to the situation where a compute instance is started in response to a request after being in an idle state. Cold starts can result in longer response times and connection failures or timeouts due to the few seconds required to restart an idle compute.

One of Neon's core features is 'scale to zero', which is designed to minimize costs by automatically scaling a compute resource down to zero after a period of inactivity. By default, Neon scales a compute to zero after 5 minutes of inactivity. Currently, restarting a compute from an idle state takes approximately 4 seconds. 

<Admonition type="note">
It's also important to remember that services you integrate with Neon may have their own cold starts, compounding connection time issues. This topic does not address cold starts of other vendors, but if your application connects to Neon via other services, do not forget to consider cold start times for those services as well.
</Admonition>

Neon is working to reduce cold start times, but in the interim, the following section describes strategies that you can implement to minimize the impact of cold starts on your applications.

## Strategies for handling cold starts

Given the potential impact on application responsiveness, it's important to have strategies in place for managing cold starts. Here are some methods you can implement:

- [Adjust your Auto-suspend (scale to zero) configuration](#adjust-your-auto-suspend-scale-to-zero-configuration)
- [Increase your connection timeout](#increase-your-connection-timeout)
- [Build connection timeout handling into your application](#build-connection-timeout-handling-into-your-application)
- [Automate compute startup via a scheduled connection](#automate-compute-startup-via-a-scheduled-connection)
- [Use application-level caching](#use-application-level-caching)

### Adjust your Auto-suspend (scale to zero) configuration

The [Neon Pro plan](/docs/introduction/pro-plan) allows you to configure the period before the system scales down to zero, providing you with control over the balance between performance and cost. The configuration setting is called **Auto-suspend delay**, and it is set to 300 seconds (5 minutes) by default. You can either disable Auto-suspend entirely or increase the setting up to a maximum of 7 days. This strategy eliminates or reduces cold starts, respectively, but increases compute time, which means higher compute costs. For configuration instructions, see [Edit a compute endpoint](/docs/manage/endpoints#edit-a-compute-endpoint).

Consider combining this strategy Autoscaling (available with the [Neon Pro plan](/docs/introduction/pro-plan)), which allows you to run a compute with minimal resources and scale up on demand. For example, with Autoscaling, you can configure a minimum compute size to reduce costs when your compute is active during off-peak times. In the image shown below, the **Auto-suspend delay** is set to 3600 seconds (1 hour) so that your compute only suspends after an hour of inactivity, and Autoscaling is configured with the 1/4 minimum compute size to keep costs low during periods periods of inactivity or light usage.

![Cold start Auto-suspend and Autoscaling configuration](/docs/connect/cold_start_compute_config.png)

For information about what an "always-on" minimum compute size might cost you, please refer to our [Billing](/docs/introduction/billing) documentation or the pricing calculator on our [Pricing](https://neon.tech/pricing) page.

For Autoscaling configuration instructions, see [Compute size and Autoscaling configuration](https://neon.tech/docs/manage/endpoints#compute-size-and-autoscaling-configuration).

### Increase your connection timeout

By configuring longer connection timeout durations, your application has more time to handle a cold start, minimizing connection failures.

Connection timeout settings are typically configured in your application or the database client library you're using, and the specific way to do it depends on the language and framework you're using.

Here are examples of how to increase connection timeout settings in a few common programming languages and frameworks:

<CodeTabs labels={["Node.js", "Python", "Java", "Prisma" ]}>

```js
const { Pool } = require('pg')

const pool = new Pool({
connectionString: process.env.DATABASE_URL,
connectionTimeoutMillis: 10000, // connection timeout in milliseconds
idleTimeoutMillis: 10000 // idle timeout in milliseconds
})
```

```python
import psycopg2
from psycopg2 import connect
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

DATABASE_URL = os.environ['DATABASE_URL']

conn = psycopg2.connect(DATABASE_URL, connect_timeout=10)
```

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

String dbUrl = System.getenv("DATABASE_URL");
Properties properties = new Properties();
properties.setProperty("connectTimeout", "10");

Connection conn = DriverManager.getConnection(dbUrl, properties);
```

```prisma
DATABASE_URL=postgres://<user>:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb?connect_timeout=20`
```

</CodeTabs>

For more information about timeouts when connecting from Prisma, see [Connection timeouts](../guides/prisma#connection-timeouts) in our Prisma documentation.

Remember that increasing the connection timeout might impact the responsiveness of your application, as users could end up waiting longer for their requests to be processed. Always test and monitor your application's performance when making changes like these.

### Build connection timeout handling into your application

You can enhance your application to better handle connection timeouts. This might involve using retries with exponential backoff. This Typescript example connects to the database using the `pg` library and uses the `node-retry` library to handle connection retries with an exponential backoff. The general logic can be easily translated into other languages.

```typescript
require('dotenv').config();
const { Client } = require('pg');
const retry = require('retry');

// Connection string from .env file
const connectionString = process.env.DATABASE_URL;

async function connectWithRetry() {
  const operation = retry.operation({
    retries: 5,               // number of retries before giving up
    minTimeout: 4000,         // minimum time between retries in milliseconds
    randomize: true,          // adds randomness to timeouts to prevent retries from overwhelming the server
  });

  operation.attempt(async (currentAttempt) => {
    const client = new Client({ connectionString });

    try {
      await client.connect();
      console.log('Connected to the database');
      
      // Perform your operations with the client
      // For example, let's run a simple SELECT query
      const res = await client.query('SELECT NOW()');
      console.log(res.rows[0]);
      
      await client.end();
    } catch (err) {
      if (operation.retry(err)) {
        console.warn(`Failed to connect on attempt ${currentAttempt}, retrying...`);
        return;
      }

      console.error('Failed to connect to the database after multiple attempts:', err);
    }
  });
}

// Usage
connectWithRetry();
```

In the example above, the `operation.attempt` function executes the connection logic. If the connection fails (i.e., `client.connect()` throws an error), the error is passed to `operation.retry(err)`. If there are retries left, the retry function schedules another attempt with an exponentially increasing delay. Otherwise, the error is logged to the console.

<Admonition type="note">
The example above is a simplification. In a production application, you might want to be more sophisticated, e.g., by initially trying to reconnect quickly in case the problem was a transient network issue, then fall back to slower retries if the problem persists. This could be achieved by using the `factor` option in the `retry` library, or by implementing your own backoff logic.
</Admonition>

### Automate compute startup via a scheduled connection

If your database usage follows predictable patterns, consider scheduling compute instances to start just before peak usage periods to avoid timeouts or failures on the initial connection. This can be achieved using various tools, such as Cron Jobs in Unix-based systems, as in the following example:

1. Create a shell script called `db_connect.sh` that connects to your database. Here's an example in which we use the `psql` command line tool to connect to the database. Replace `<connection_string>` with your Neon connection string:

    <CodeBlock shouldWrap>

    ```bash
    #!/bin/sh
    export PGPASSWORD='<password>'

    psql "postgres://<user>@ep-snowy-unit-123456.us-east-2.aws.neon.tech/neondb" -c 'SELECT 1'
    ```

    </CodeBlock>

2. After creating the script, make sure it's executable by running the following command:

    ```bash
    chmod +x db_connect.sh
    ```

3. Then, you can schedule the script using a Cron job. Open your crontab file with this command:

    ```bash
    crontab -e
    ```

4. Then add the following line to your crontab file to schedule the script to run at 7AM daily, for example:

    ```text
    0 7 * * * /path/to/your/script/db_connect.sh
    ```

<Admonition type="note">
This is a simple example and may need to be adapted to fit your specific needs. Also, please consider using a more secure method of handling your database credentials, such as a secrets manager.
</Admonition>

If you do not have access to a Unix-base system, there are other tools and services you can use to schedule tasks, such as [AWS Lambda functions with CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/RunLambdaSchedule.html), [Google Cloud Scheduler](https://cloud.google.com/scheduler), or [Task Scheduler](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/devenv-task-scheduler) if you are using Windows.

### Use application-level caching

Implement a caching system like [Redis](https://redis.io/) or [PolyScale](https://www.polyscale.ai/) to keep frequently accessed data readily available. This reduces the load on your database and helps avoid the latency associated with cold starts.

## Conclusion

Cold starts can be a challenge in a system that balances cost-effectiveness with performance. However, with the right strategies, you can significantly reduce their impact and ensure your application delivers a consistently high level of performance. The best solution often involves a combination of these strategies, so experiment and find the perfect balance for your specific use case.

---
title: 'Simulate production load using Neon branching and k6'
subtitle: 'Learn how to fork your production database into an isolated Neon branch and run k6 load tests against it to analyze and optimize query performance safely.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-04-26T00:00:00.000Z'
updatedOn: '2026-04-26T00:00:00.000Z'
---

Performance testing is one of the hardest parts of shipping applications. Teams often turn to staging environments for testing, but these rarely reflect the realities of production. Staging databases are smaller, cleaner, and more predictable. Queries that seem instantaneous in staging can become serious bottlenecks when executed against millions of rows in production.

Testing directly on production isn’t a safe alternative either. High‑concurrency load can overwhelm connections, saturate CPU, and degrade the experience for real users. That leaves teams with a frustrating choice: either test against unrealistic data or risk harming production.

Neon removes that trade‑off with [**Database Branching**](/docs/introduction/branching). In seconds, you can create an isolated clone of your production database identical in data volume and distribution, but backed by its own compute resources. This makes it possible to run high‑concurrency load tests against a Neon branch without any risk to production.

In this guide, you’ll use [Grafana k6](https://k6.io/) to generate API load against a dedicated Neon branch. You will build a simple Node.js API that queries a products database, seed it with realistic data, and then run k6 load tests to analyze performance. When you identify a bottleneck, you will apply an optimization (adding an index) directly on the branch and re-run the test to verify the improvement against production‑scale data.

## Prerequisites

Before you begin, ensure you have the following installed and set up:

- **Node.js** installed locally. Follow the [Node.js installation guide](https://nodejs.org/en/download/) if you don't have it already.
- **k6 CLI:** The load-testing framework. Follow the [k6 installation guide](https://grafana.com/docs/k6/latest/set-up/install-k6/)
- **Neon account:** Sign up at [console.neon.tech](https://console.neon.tech).

<Steps>

## Set up the example project

You will create a simple Express API that connects to a Neon database and exposes an endpoint to fetch products by category. This API will be the target of your k6 load tests.

<Admonition type="note" title="Apply this workflow to your own codebase">
The Express API in this guide is only a simple example to make the load‑testing pattern clear. You can follow along with your own application code and schema, applying the same k6 testing and Neon branching workflow to analyze and optimize real production queries. The process is identical regardless of your tech stack or schema design: create a Neon branch, point your app to it, run k6 load tests, and iterate on optimizations until you’re satisfied. Once testing is complete, you can safely tear down the branch and roll the improvements into production with confidence.
</Admonition>

Create a new directory, initialize a Node project, and install the required dependencies:

```bash
mkdir neon-k6-load-test && cd neon-k6-load-test
npm init -y
npm install express pg dotenv
```

Create an `index.js` file. This script sets up a basic API endpoint that fetches products from a database based on a category filter.

```javascript
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true },
});

// API Endpoint to fetch products by category
app.get('/api/products', async (req, res) => {
    const category = req.query.category || 'Electronics';

    try {
        // A deliberate query that might perform poorly on large datasets without an index
        const result = await pool.query(
            'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC LIMIT 50',
            [category]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`🚀 API Server running on http://localhost:${port}`);
});
```

## Seed the database with realistic data

<Admonition type="info" title="Bring your own data">
If you are following along with your own application, you can skip this step. This guide seeds a new database from scratch to demonstrate the workflow. In a real-world scenario, you would already have a Neon project populated with your production schema and data, and you would simply branch from it.
</Admonition>

For a load test to be meaningful, the database needs data. You will create a `products` table and insert 500,000 rows to simulate a production-like volume.

1. Log in to the [Neon Console](https://console.neon.tech) and create a new project. Name it something like `k6-load-test`.
2. Navigate to your Project dashboard and click on the **Connect** button to view your connection details.
   ![Connection details in Neon Console](/docs/connect/connection_details.png)

3. Create a `.env` file in your project directory and add the connection string by copying it from the Neon Console:

   ```env
   DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/postgres?sslmode=require&channel_binding=require"
   ```

4. Create a `seed.js` script to set up the `products` table and populate it with data. This script will create a table with columns for `id`, `name`, `category`, `price`, and `created_at`. It will then insert 500,000 rows of sample product data across various categories.

   ```javascript
   require('dotenv').config();
   const { Client } = require('pg');

   const client = new Client({
     connectionString: process.env.DATABASE_URL,
     ssl: { require: true },
   });

   const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Toys', 'Sports'];

   async function seed() {
     await client.connect();
     console.log('📦 Creating table...');

     await client.query(`
       DROP TABLE IF EXISTS products;
       CREATE TABLE products (
         id SERIAL PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         category VARCHAR(50) NOT NULL,
         price DECIMAL(10, 2) NOT NULL,
         created_at TIMESTAMP DEFAULT NOW()
       );
     `);

     console.log('🌱 Seeding 500,000 rows (this may take a minute)...');

     const batchSize = 10000;
     for (let i = 0; i < 50; i++) {
       const values = [];
       for (let j = 0; j < batchSize; j++) {
         const category = categories[Math.floor(Math.random() * categories.length)];
         values.push(`('Product ${i * batchSize + j}', '${category}', ${Math.random() * 100})`);
       }
       await client.query(`INSERT INTO products (name, category, price) VALUES ${values.join(',')}`);
       process.stdout.write(`\rInserted ${((i + 1) * batchSize).toLocaleString()} rows`);
     }

     console.log('\n✅ Seeding complete!');
     await client.end();
   }

   seed().catch(console.error);
   ```

5. Run the seed script:
   ```bash
   node seed.js
   ```

## Create a Neon branch for load testing

Now that your "production" database has real data, it's time to run a load test.

Instead of pointing your test traffic at the `production` branch, you will create an isolated branch. This ensures that the massive influx of requests generated by k6 won't affect your production compute resources or interfere with production metrics.

In the Neon Console:

1. Open your project and select **Branches** from the sidebar.
2. Click **New branch**.
3. Set **Parent branch** to your production branch.
4. Enter `load-test-branch` as the branch name.
5. In **Include in the new branch**, choose **Current data** so your test branch mirrors production data volume.
6. Click **Create**.

After the branch is created, you should be greeted with the connection string for `load-test-branch`. Update your `.env` file to use this new connection string:

```env
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/postgres?sslmode=require&channel_binding=require"
```

Start your API server. It is now safely connected to the isolated database clone.

```bash
node index.js
```

## Configure k6 load test

With your API running against the `load-test-branch`, you can now configure a k6 script to generate load and analyze performance. You will create a k6 script that simulates multiple virtual users making requests to the `/api/products` endpoint with different category filters. The script will include thresholds to automatically fail if response times degrade beyond acceptable limits.

Create a file named `load-test.js`:

```javascript
const http = require('k6/http');
const { check, sleep } = require('k6');

// 1. Define the test execution options
export const options = {
    stages: [
        { duration: '10s', target: 20 }, // Ramp up to 20 virtual users over 10 seconds
        { duration: '30s', target: 50 }, // Ramp up to 50 users and hold for 30 seconds
        { duration: '10s', target: 0 },  // Ramp down to 0 users gracefully
    ],
    thresholds: {
      // The test fails if 95% of requests don't complete within 50ms
      http_req_duration: ['p(95)<50'],
        // The test fails if more than 1% of requests return an error
        http_req_failed: ['rate<0.01'],
    },
};

const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Toys', 'Sports'];

// 2. Define the Virtual User (VU) logic
export default function () {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const res = http.get(`http://localhost:3000/api/products?category=${randomCategory}`);

    // 3. Assertions (Checks)
    check(res, {
        'status is 200': (r) => r.status === 200,
        'returns data': (r) => JSON.parse(r.body).length > 0,
    });

    // 4. Sleep for 1 second between iterations to simulate user think time
    sleep(1);
}
```

The k6 script is set to ramp up to 50 virtual users over 40 seconds, simulating a realistic load pattern. The thresholds will automatically fail the test if the response times degrade beyond 50ms for 95% of requests or if more than 1% of requests fail.

## Run the baseline load test

<Admonition type="note" title="Network latency and geography">
The latency metrics you observe (`http_req_duration`) will vary depending on the geographic distance between where you run the k6 CLI and the region you selected when creating your Neon project. For the most accurate and lowest-latency results, run your k6 tests from a server located in the same region as your Neon Project.
</Admonition>

Run the script using the k6 CLI:

```bash
k6 run load-test.js
```

Watch the terminal as k6 executes the test. Once it finishes, you will see a detailed summary output. Pay close attention to the `http_req_duration` metric:

```text
$ k6 run load-test.js

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/


     execution: local
        script: load-test.js
        output: -

     scenarios: (100.00%) 1 scenario, 50 max VUs, 1m20s max duration (incl. graceful stop):
              * default: Up to 50 looping VUs for 50s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS

    http_req_duration
    ✗ 'p(95)<50' p(95)=193.74ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 2592    51.15722/s
    checks_succeeded...: 100.00% 2592 out of 2592
    checks_failed......: 0.00%   0 out of 2592

    ✓ status is 200
    ✓ returns data

    HTTP
    http_req_duration..............: avg=90.61ms min=23.13ms med=82.25ms max=439.42ms p(90)=156.48ms p(95)=193.74m
      { expected_response:true }...: avg=90.61ms min=23.13ms med=82.25ms max=439.42ms p(90)=156.48ms p(95)=193.74m
    http_req_failed................: 0.00%  0 out of 1296
    http_reqs......................: 1296   25.57861/s

    EXECUTION
    iteration_duration.............: avg=1.09s   min=1.02s   med=1.08s   max=1.44s    p(90)=1.15s    p(95)=1.19s
    iterations.....................: 1296   25.57861/s
    vus............................: 3      min=2         max=50
    vus_max........................: 50     min=50        max=50

    NETWORK
    data_received..................: 7.7 MB 152 kB/s
    data_sent......................: 127 kB 2.5 kB/s


running (0m50.7s), 00/50 VUs, 1296 complete and 0 interrupted iterations
default ✓ [======================================] 00/50 VUs  50s
ERRO[0050] thresholds on metrics 'http_req_duration' have been crossed
ERRO[0050] thresholds on metrics 'http_req_duration' have been crossed
```

The test failed. With a `p(95)` of `193.74ms`, the response times are significantly higher than the `50ms` threshold you set. This indicates the query is performing poorly under load. Given that the database contains 500,000 rows and there is no index on the `category` column, Postgres is forced to perform a Sequential Scan reading every row for each request from the 50 virtual users. Under load, this results in a substantial CPU bottleneck and degraded performance.

## Apply optimizations safely on the branch

Because you are on an isolated branch, you can test database optimizations without fear of locking production tables or disrupting real users.

For this query pattern, use a composite index that matches both the filter and sort order:

```sql
SELECT *
FROM products
WHERE category = $1
ORDER BY created_at DESC
LIMIT 50;
```

The ideal index for this query is on `(category, created_at DESC)`. This allows Postgres to efficiently filter by category and retrieve the most recent products without scanning the entire table.

Add the index using the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or execute it from a Node script.

<Tabs labels={["Node script", "SQL Command"]}>

<TabItem>

Create a file named `optimize.js`:

```javascript
require('dotenv').config();
const { Client } = require('pg');

async function optimize() {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { require: true },
    });
    await client.connect();

  console.log('🛠️ Creating composite index...');
  await client.query(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_created_at_desc
    ON products (category, created_at DESC);
  `);

    console.log('✅ Optimization applied!');
    await client.end();
}

optimize().catch(console.error);
```

Run `node optimize.js` to apply the index to your `load-test-branch`.

</TabItem>
<TabItem>

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_created_at_desc
ON products (category, created_at DESC);
```

</TabItem>
</Tabs>

## Re-run the load test to verify

With the composite index in place on your branch, run the same test again and compare the metrics.

```bash
k6 run load-test.js
```

This time, you should see a significant improvement in response times. The `p(95)` latency should drop dramatically, and the test should pass without crossing any thresholds.

```text
$ k6 run load-test.js

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/


     execution: local
        script: load-test.js
        output: -

     scenarios: (100.00%) 1 scenario, 50 max VUs, 1m20s max duration (incl. graceful stop):
              * default: Up to 50 looping VUs for 50s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ THRESHOLDS

    http_req_duration
    ✓ 'p(95)<50' p(95)=6.04ms

    http_req_failed
    ✓ 'rate<0.01' rate=0.00%


  █ TOTAL RESULTS

    checks_total.......: 2814    55.863943/s
    checks_succeeded...: 100.00% 2814 out of 2814
    checks_failed......: 0.00%   0 out of 2814

    ✓ status is 200
    ✓ returns data

    HTTP
    http_req_duration..............: avg=4.43ms min=2.31ms med=4.07ms max=91.21ms p(90)=5.28ms p(95)=6.04ms
      { expected_response:true }...: avg=4.43ms min=2.31ms med=4.07ms max=91.21ms p(90)=5.28ms p(95)=6.04ms
    http_req_failed................: 0.00%  0 out of 1407
    http_reqs......................: 1407   27.931971/s

    EXECUTION
    iteration_duration.............: avg=1s     min=1s     med=1s     max=1.09s   p(90)=1s     p(95)=1s
    iterations.....................: 1407   27.931971/s
    vus............................: 2      min=2         max=50
    vus_max........................: 50     min=50        max=50

    NETWORK
    data_received..................: 8.4 MB 166 kB/s
    data_sent......................: 139 kB 2.7 kB/s




running (0m50.4s), 00/50 VUs, 1407 complete and 0 interrupted iterations
default ✓ [======================================] 00/50 VUs  50s
```

Compared to the baseline run (`p(95)=193.74ms`, `avg=90.61ms`), the composite index run improved latency to `p(95)=6.04ms` and `avg=4.43ms` while keeping `http_req_failed=0.00%`.

## Roll out to production and clean up

Once your test results look good, the next step is to apply the same optimization to production, then remove the temporary test branch.

1. Apply the validated change to your production branch (for example, create the same index in production through your migration workflow).
2. If your optimization includes application-level query changes, deploy those code changes to production.
3. Run a quick production-safe verification, such as checking endpoint latency and error rate after deployment.
4. You can now safely delete the `load-test-branch` to clean up the temporary resources.
5. From the Neon Console, navigate to **Branches**, find `load-test-branch`, click the three dots on the right, and select **Delete**.
6. Confirm deletion.

</Steps>

## Conclusion

You have successfully built a workflow that delivers production realism without production risk. By branching from real data, running repeatable load tests on isolated compute with k6, and validating optimizations using clear metrics, you can tune queries and ship faster. This approach makes performance testing a standard, safe part of development rather than a risky one-off exercise.

## Next steps

To maximize the value of this workflow, automate it. Provision and tear down Neon branches in CI, run your load tests, and automatically fail builds on latency or error-rate regressions. Using this strategy as a routine safety check especially before major schema changes, query rewrites, or ORM upgrades helps catch performance issues early and keeps your production rollouts safe.

For guidance on creating Neon branches programmatically and integrating them into CI pipelines, see the [Resources](#resources) below.

## Resources

- [Mastering Database Branching Workflows](/branching)
- [Grafana k6 Documentation](https://grafana.com/docs/k6)
- [Branching with the Neon CLI](/docs/guides/branching-neon-cli)
- [Automate branching with GitHub Actions](/docs/guides/branching-github-actions)
- [Branching with the Neon API](/docs/guides/branching-neon-api)

<NeedHelp/>

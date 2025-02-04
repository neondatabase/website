---
title: Building a Serverless Referral System with Neon Postgres and Azure Functions
subtitle: Learn how to create a serverless referral system using Neon Postgres and Azure Functions
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-11-24T00:00:00.000Z'
updatedOn: '2024-11-24T00:00:00.000Z'
---

Serverless computing makes it easier for developers to build and run apps without worrying about managing and scaling servers. By combining Azure Functions with Neon's serverless Postgres, you can create scalable and cost-effective applications that handle high volumes of traffic with ease.

In this guide, we'll explore how to create a serverless referral system using Azure Serverless Functions and Neon Postgres. We'll build a simple serverless referral system that allows users to create referral codes, track successful referrals, and award points to referrers.

## Prerequisites

Before we begin, make sure you have:

- [Node.js](https://nodejs.org/) 18.x or later installed
- [Visual Studio Code](https://code.visualstudio.com/) with the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
- An [Azure account](https://azure.microsoft.com/free/) with an active subscription
- A [Neon account](https://console.neon.tech/signup) and project
- [Azure Functions Core Tools version 4.x](https://learn.microsoft.com/en-gb/azure/azure-functions/create-first-function-vs-code-node?pivots=nodejs-model-v4#install-or-update-core-tools)

## Creating Your Neon Project

Neon is now available in Azure! You can create serverless Postgres databases that run on Azure infrastructure. To learn more about Neon's Azure launch, check out the [announcement post](https://neon.tech/blog/neon-is-coming-to-azure).

To create your Neon project on Azure:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Click **Create Project**.
3. Give your project a name.
4. Under **Cloud Service Provider**, select **Azure**.
5. Select a **Region** for your project.
6. Select the **Compute size** for your Neon database.
7. Click **Create Project**.

Once created, save your connection details - you'll need these to configure your Azure Functions connection to Neon Postgres.

## Database Schema Design

Let's start by designing the database schema for our referral system. We'll need tables to track users, referral codes, and rewards.

1. Create the `users` table:

   ```sql
   CREATE TABLE users (
       user_id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       name VARCHAR(100),
       points INT DEFAULT 0,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. Create the `referral_codes` table:

   ```sql
   CREATE TABLE referral_codes (
       code_id SERIAL PRIMARY KEY,
       referrer_id INT REFERENCES users(user_id),
       code VARCHAR(10) UNIQUE NOT NULL,
       times_used INT DEFAULT 0,
       max_uses INT DEFAULT 10,
       points_per_referral INT DEFAULT 100,
       expires_at TIMESTAMP,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT valid_points CHECK (points_per_referral > 0)
   );
   ```

3. Create the `referrals` table to track successful user referrals:

   ```sql
   CREATE TABLE referrals (
       referral_id SERIAL PRIMARY KEY,
       referrer_id INT REFERENCES users(user_id),
       referred_id INT REFERENCES users(user_id),
       code_id INT REFERENCES referral_codes(code_id),
       points_awarded INT,
       status VARCHAR(20) DEFAULT 'pending',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT unique_referral UNIQUE(referred_id),
       CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'rejected'))
   );
   ```

With the three tables in place, our database schema:

- Tracks users and their total points
- Manages referral codes with usage limits and expiration dates
- Records each referral transaction
- Enforces data integrity through constraints
- Prevents duplicate referrals for the same user

## Setting Up Your Development Environment

To start building serverless applications with Azure Functions you need to set up your development environment first.

### Installing Required Tools

If you don't have the required tools installed, you can follow these steps to set up your development environment:

1. Install the **Azure Functions** extension for VS Code (if you haven't already):

   - Open VS Code
   - Click the Extensions icon or press `Ctrl+Shift+X` or `Cmd+Shift+X`
   - Search for "Azure Functions"
   - Install the extension from Microsoft

2. Install **Azure Functions Core Tools version 4.x**:

   In Visual Studio Code, select `F1` to open the command palette, and then search for and run the command 'Azure Functions: Install or Update Core Tools'.

   The Core Tools provide a local development environment and CLI commands for creating, testing, and deploying Azure Functions.

### Project Setup

With the required Azure tools installed, you're ready to create your first Azure Functions project.

1. Open a terminal and navigate to the directory where you want to create your project.

   Create a new directory for your project:

   ```bash
   mkdir referral-system
   ```

   Change to the project directory:

   ```bash
   cd referral-system
   ```

   Initialize a new Azure Functions project:

   ```bash
   func init
   ```

   When prompted, select:

   - Node.js as the runtime
   - JavaScript as the language

   This might take a few moments to complete, and it creates a basic project structure with the following files:

   - `host.json`: Contains global configuration options
   - `local.settings.json`: Stores app settings and connection strings for local development
   - `package.json`: Manages project dependencies

2. Install the required dependencies:

   ```bash
   npm install pg uuid dotenv
   ```

   We're using:

   - `pg` for Postgres connection to Neon
   - `uuid` for generating unique referral codes
   - `dotenv` for environment variables management

3. Configure your database connection by creating a `.env` file:

   ```bash
   NEON_CONNECTION_STRING=postgres://user:password@ep-xyz.region.azure.neon.tech/neondb
   ```

   Replace `user`, `password`, `ep-xyz.region`, and `neondb` with your Neon connection details.

4. Create a database utility file `src/utils/db.js` for our connection management:

   ```js
   const { Pool } = require('pg');
   require('dotenv').config();

   const pool = new Pool({
     connectionString: process.env.NEON_CONNECTION_STRING,
     ssl: true,
   });

   // Wrapper for queries with automatic connection handling
   async function query(text, params) {
     const client = await pool.connect();
     try {
       const result = await client.query(text, params);
       return result;
     } finally {
       client.release();
     }
   }

   module.exports = {
     query,
     pool,
   };
   ```

   We will use this utility to execute queries against the Neon Postgres database across our Azure Functions.

With your project set up, you're ready to start building the core functions for your referral system.

## Creating the Core Functions

We'll create several Azure Functions to handle different aspects of the referral system.

Each function will be an HTTP-triggered function that interacts with the Neon Postgres database to generate referral codes, process referrals, and retrieve referral statistics.

Other types of triggers, such as queue or timer triggers, can also be used depending on your requirements, but for this guide, we'll focus on HTTP triggers.

### 1. Generate Referral Code

Let's start by creating a function to generate unique referral codes for users.

Run the following command to create a new HTTP-triggered function:

```bash
func new --name generateReferralCode --template "HTTP trigger"
```

This will create a new function in `src/functions/generateReferralCode.js`. Open the file and replace the contents with the following code:

```js
const { app } = require('@azure/functions');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../utils/db');

app.http('generateReferralCode', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const { userId } = await request.json();

      // Generate unique 8-character code
      const code = uuidv4().split('-')[0];

      // Insert new referral code
      const result = await query(
        `INSERT INTO referral_codes
                (referrer_id, code, max_uses, points_per_referral, expires_at)
                VALUES ($1, $2, $3, $4, NOW() + INTERVAL '30 days')
                RETURNING *`,
        [userId, code, 10, 100]
      );

      return {
        status: 201,
        body: JSON.stringify({
          code: result.rows[0].code,
          expiresAt: result.rows[0].expires_at,
        }),
      };
    } catch (error) {
      context.log('Error generating referral code:', error);
      return {
        status: 500,
        body: 'Error generating referral code',
      };
    }
  },
});
```

This function:

- Generates an 8-character referral code using `uuidv4`
- Inserts the code into the `referral_codes` table with a 30-day expiration
- Returns the generated code and expiration date

The endpoint will be available at `http://localhost:7071/api/generateReferralCode` and expects a JSON payload with the `userId` of the referrer. We'll be testing this function shortly once all functions are in place.

### 2. Process Referral

With the referral code generation function in place, let's create a function to process referrals when new users sign up.

Create a new HTTP-triggered function, again using the Azure Functions CLI:

```bash
func new --name processReferral --template "HTTP trigger"
```

This will create a new function in `src/functions/processReferral.js`. Replace the contents with the following code:

```js
const { app } = require('@azure/functions');
const { query } = require('../utils/db');

app.http('processReferral', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const { referralCode, newUserEmail, newUserName } = await request.json();

      // Start transaction
      await query('BEGIN');

      // Verify referral code
      const codeResult = await query(
        `SELECT * FROM referral_codes
                WHERE code = $1
                AND times_used < max_uses
                AND expires_at > NOW()`,
        [referralCode]
      );

      if (codeResult.rows.length === 0) {
        await query('ROLLBACK');
        return {
          status: 400,
          body: 'Invalid or expired referral code',
        };
      }

      const code = codeResult.rows[0];

      // Create new user
      const newUserResult = await query(
        `INSERT INTO users (email, name)
                VALUES ($1, $2)
                RETURNING user_id`,
        [newUserEmail, newUserName]
      );

      // Record referral
      await query(
        `INSERT INTO referrals
                (referrer_id, referred_id, code_id, points_awarded, status)
                VALUES ($1, $2, $3, $4, 'completed')`,
        [code.referrer_id, newUserResult.rows[0].user_id, code.code_id, code.points_per_referral]
      );

      // Update referral code usage
      await query(
        `UPDATE referral_codes
                SET times_used = times_used + 1
                WHERE code_id = $1`,
        [code.code_id]
      );

      // Award points to referrer
      await query(
        `UPDATE users
                SET points = points + $1
                WHERE user_id = $2`,
        [code.points_per_referral, code.referrer_id]
      );

      await query('COMMIT');

      return {
        status: 200,
        body: JSON.stringify({
          message: 'Referral processed successfully',
        }),
      };
    } catch (error) {
      await query('ROLLBACK');
      context.log('Error processing referral:', error);
      return {
        status: 500,
        body: 'Error processing referral',
      };
    }
  },
});
```

There is a bit more going on in this function, so let's break it down:

- The function accepts `POST` requests with the referral code, new user email, and name
- It starts a transaction to ensure data integrity
- Verifies the referral code is valid and not expired
- Creates a new user record
- Records the referral transaction
- Updates the referral code usage and awards points to the referrer
- Commits the transaction if successful, otherwise rolls back

The endpoint will be available at `http://localhost:7071/api/processReferral` and expects a JSON payload with the referral code, new user email, and name.

### 3. Get Referral Stats

Finally, let's create a function to retrieve referral statistics for a given user.

Create a new HTTP-triggered function using the Azure Functions CLI:

```bash
func new --name getReferralStats --template "HTTP trigger"
```

Open the generated file `src/functions/getReferralStats.js` and replace the contents with the following code:

```js
const { app } = require('@azure/functions');
const { query } = require('../utils/db');

app.http('getReferralStats', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const userId = request.query.get('userId');

      const stats = await query(
        `SELECT
                    u.points as total_points,
                    COUNT(r.referral_id) as total_referrals,
                    COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as successful_referrals,
                    COUNT(CASE WHEN r.created_at > NOW() - INTERVAL '30 days' THEN 1 END) as recent_referrals
                FROM users u
                LEFT JOIN referrals r ON u.user_id = r.referrer_id
                WHERE u.user_id = $1
                GROUP BY u.user_id, u.points`,
        [userId]
      );

      return {
        status: 200,
        body: JSON.stringify(stats.rows[0]),
      };
    } catch (error) {
      context.log('Error fetching referral stats:', error);
      return {
        status: 500,
        body: 'Error fetching referral stats',
      };
    }
  },
});
```

Let's again break down the function:

- The function accepts `GET` requests with a `userId` query parameter
- It retrieves the total points, total referrals, successful referrals, and recent referrals for the given user
- The query joins the `users` and `referrals` tables to calculate the statistics
- The results are returned as JSON

The endpoint will be available at `http://localhost:7071/api/getReferralStats?userId=1`, where `userId` is the ID of the user to fetch statistics for.

## Testing Your Functions Locally

With all the core functions in place, it's time to test them locally before deploying to Azure.

Let's test each function locally to ensure everything works as expected.

1. Start the Azure Functions runtime locally:

   ```bash
    func start
   ```

   You should see output indicating your functions are running, typically on `http://localhost:7071`. And you should see the URLs for each function:

   ```bash
   Functions:

    generateReferralCode: [POST] http://localhost:7071/api/generateReferralCode

    getReferralStats: [GET] http://localhost:7071/api/getReferralStats

    processReferral: [POST] http://localhost:7071/api/processReferral
   ```

2. To test the functions, you can use `curl` or a tool like Postman.

   First, create a test user in your database:

   ```sql
   INSERT INTO users (email, name)
   VALUES ('test@example.com', 'Test User')
   RETURNING user_id;
   ```

   Note the returned `user_id` (let's say it's 1) and use it to test the referral code generation:

   ```bash
   curl -X POST http://localhost:7071/api/generateReferralCode \
   -H "Content-Type: application/json" \
   -d '{"userId": 1}'
   ```

   You should receive a response like:

   ```json
   {
     "code": "a1b2c3d4",
     "expiresAt": "2024-12-29T14:30:00.000Z"
   }
   ```

   Check the response for the generated referral code and expiration date.

   Verify in the database:

   ```sql
   SELECT * FROM referral_codes WHERE referrer_id = 1;
   ```

3. With the referral code in hand, test the referral processing function.

   Using the referral code from the previous step:

   ```bash

   curl -X POST http://localhost:7071/api/processReferral \
    -H "Content-Type: application/json" \
    -d '{
        "referralCode": "a1b2c3d4",
        "newUserEmail": "friend@example.com",
        "newUserName": "Referred Friend"
    }'
   ```

   If the referral is successful, you should see:

   ```json
   {
     "message": "Referral processed successfully"
   }
   ```

   Otherwise, check the response for error messages from the function.

   Verify the changes in the database:

   ```sql
   -- Check the new user was created
   SELECT * FROM users WHERE email = 'friend@example.com';

   -- Check the referral was recorded
   SELECT * FROM referrals ORDER BY created_at DESC LIMIT 1;

   -- Verify points were awarded to the referrer
   SELECT points FROM users WHERE user_id = 1;

   -- Check referral code usage was incremented
   SELECT times_used FROM referral_codes WHERE code = 'a1b2c3d4';
   ```

4. Next, test the referral statistics function.

   Using the original user's ID:

   ```bash
   curl "http://localhost:7071/api/getReferralStats?userId=1"
   ```

   You should see something like:

   ```json
   {
     "total_points": 100,
     "total_referrals": 1,
     "successful_referrals": 1,
     "recent_referrals": 1
   }
   ```

5. You can also test error conditions to ensure your functions handle them correctly.

   Test invalid referral code:

   ```bash
   curl -X POST http://localhost:7071/api/processReferral \
    -H "Content-Type: application/json" \
    -d '{
        "referralCode": "invalid",
        "newUserEmail": "another@example.com",
        "newUserName": "Another Friend"
    }'
   ```

   Test duplicate referral by using the same email:

   ```bash
   curl -X POST http://localhost:7071/api/processReferral \
    -H "Content-Type: application/json" \
    -d '{
        "referralCode": "a1b2c3d4",
        "newUserEmail": "friend@example.com",
        "newUserName": "Duplicate User"
    }'
   ```

6. The Azure Functions runtime will output logs to your terminal.

   Watch for any errors or debugging information as you test:

   ```bash
   [2024-11-29T14:30:00.000Z] Executing 'Functions.generateReferralCode'
      (Reason='This function was programmatically called via the host APIs.', Id=...)
   ```

If you encounter any issues, you can check the function logs or query the database directly to understand what's happening. Common issues might include:

If you need to, you can reset the test data in your database state by running the following SQL commands to delete the test data:

```sql
-- Clean up test data
DELETE FROM referrals;
DELETE FROM referral_codes;
DELETE FROM users;
-- Reset sequences
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
ALTER SEQUENCE referral_codes_code_id_seq RESTART WITH 1;
ALTER SEQUENCE referrals_referral_id_seq RESTART WITH 1;
```

After testing your functions locally, you're ready to deploy them to Azure.

## Deploying to Azure

Deploying your referral system to Azure involves three main steps:

1. Create Azure Resources
2. Configure Application Settings
3. Deploy Your Functions

Let's walk through each step.

### Step 1: Create Azure Resources

First, you need to create the necessary resources in Azure: a resource group, a storage account, and a Function App.

1. Log in to Azure CLI:

   ```bash
   az login
   ```

   Follow the instructions to authenticate with your Azure account and select the appropriate subscription.

2. Create a resource group:

   ```bash
   az group create --name referral-system --location eastus2
   ```

   This command creates a new resource group named `referral-system` in the East US 2 region. You can choose a different region if needed. A resource group is a logical container for your Azure resources and helps you manage them together more efficiently for billing, access control, and monitoring.

3. Create a storage account:

   Azure Functions requires a storage account to store logs and runtime state.

   ```bash
   az storage account create \
     --name <referral-storage-unique-name> \
     --location eastus \
     --resource-group referral-system \
     --sku Standard_LRS
   ```

   Make sure to replace `referral-storage-unique-name` with a unique name for your storage account. Otherwise, the command will fail.

4. Create the Function App:

   Use the following command to create a Function App running Node.js 18 on the Consumption Plan:

   ```bash
   az functionapp create \
     --name referral-system \
     --storage-account <referral-storage-unique-name> \
     --consumption-plan-location eastus2 \
     --resource-group referral-system \
     --runtime node \
     --runtime-version 18 \
     --functions-version 4
   ```

   Replace `referral-system` with your desired Function App name and `referral-storage-unique-name` with your storage account name.

### Step 2: Configure Application Settings

After creating the Function App, you need to configure it to connect to your Neon database by setting environment variables.

1. Set the `NEON_CONNECTION_STRING` using the Azure CLI:

   ```bash
   az functionapp config appsettings set \
     --name referral-system \
     --resource-group referral-system \
     --settings NEON_CONNECTION_STRING="postgres://user:password@ep-xyz.region.azure.neon.tech/neondb?sslmode=require"
   ```

2. Alternative: Configure settings in the Azure Portal:

   - Go to your **Function App** in the Azure Portal.
   - Select **Configuration** under the **Settings** section.
   - Add a new application setting:
     - **Name:** `NEON_CONNECTION_STRING`
     - **Value:** `postgres://user:password@ep-xyz.region.azure.neon.tech/neondb`
   - Save your changes.

### Step 3: Deploy Your Functions

With everything set up, you can now deploy your functions to Azure directly from Visual Studio Code.

- Open **VS Code** and press `F1` to open the command palette.
- Search for and select **Azure sign in** to authenticate with your Azure account.
- Then again press `F1` to open the command palette.
- Search for and select **Azure Functions: Deploy to Function App...**.
- Select your Azure subscription.
- Choose the Function App (`referral-system`) you created earlier.
- Click **Deploy** when prompted.

You'll see a notification in VS Code once the deployment is successful but it may take a few minutes to complete.

### Step 4: Verify the Deployment

After deploying your functions, test them to ensure they're working correctly.

1. Retrieve the function URL:

   Use the Azure CLI to get the URL for your `generateReferralCode` function:

   ```bash
   az functionapp function show \
     --name referral-system \
     --resource-group referral-system \
     --function-name generateReferralCode \
     --query "invokeUrlTemplate"
   ```

2. Test the function:

   Replace `<function-url>` with the URL returned from the previous step:

   ```bash
   curl -X POST <function-url> \
     -H "Content-Type: application/json" \
     -d '{"userId": 1}'
   ```

## Performance Optimization

With your referral system deployed to Azure, you should consider some standard performance optimizations to make sure it scales well under load.

1. Add indexes to frequently queried columns:

   ```sql
   CREATE INDEX idx_referral_codes_code ON referral_codes(code);
   CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
   CREATE INDEX idx_referrals_status ON referrals(status);
   ```

   You can learn more about indexing in the [Neon documentation](https://neon.tech/postgresql/postgresql-indexes).

2. Implement connection pooling in your database utility:

   ```js
   const pool = new Pool({
     connectionString: process.env.NEON_CONNECTION_STRING,
     ssl: true,
     max: 20, // maximum number of clients
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   ```

   Alternatively, you can use the [Neon connection pool](https://neon.tech/docs/connect/connection-pooling) feature to manage connections efficiently.

3. On the Azure Functions side, consider enabling [Azure Functions Premium Plan](https://azure.microsoft.com/en-us/pricing/details/functions/), which offers more control over scaling and performance.

### Cleaning Up Azure Resources (Optional)

If you no longer need the Azure resources created for this project, you can delete them to avoid incurring any charges.

1. Deleting the resource group will remove all associated resources, including the Function App, storage account, and any other resources within the group:

   ```bash
   az group delete --name referral-system --yes --no-wait
   ```

   - The `--yes` flag skips the confirmation prompt.
   - The `--no-wait` flag allows the command to run asynchronously.

2. To verify the deletion:
   - Log in to the [Azure Portal](https://portal.azure.com).
   - Navigate to **Resource Groups** and confirm that the `referral-system` group is no longer listed.

## Conclusion

You now have a scalable referral system built with Neon Postgres and Azure Functions. The system handles referral code generation, tracks successful referrals, awards points, and provides referral statistics.

As a next step, you can add more features to your referral system, such as authentication, email notifications, and user dashboards.

## Additional Resources

- [Neon Documentation](/docs)
- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Node-Postgres Documentation](https://node-postgres.com/)

<NeedHelp />

---
title: Automating workflows with Azure Logic Apps and Neon
subtitle: Learn how to automate database operations and processes by connecting Azure Logic Apps with Lakebase Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-01-26T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Azure Logic Apps lets you build automated workflows that connect apps, data, and services. Combined with Lakebase Postgres on Neon, those workflows can run database operations in response to triggers and events.

In this guide, you'll create a Logic Apps workflow that inserts incoming orders into a Lakebase Postgres database.

## Prerequisites

Before starting this guide, ensure you have:

- [Azure account](https://azure.microsoft.com/free/) with an active subscription
- [Neon account](https://console.neon.tech/signup) and project
- Basic familiarity with SQL and Azure services

## Understanding Azure Logic Apps

[Azure Logic Apps](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-overview) is a cloud service that helps you schedule, automate, and orchestrate tasks, business processes, and workflows. With Logic Apps, you can:

- Trigger workflows based on events or schedules
- Connect to various services and APIs
- Process data using built-in operations and custom implementations
- Handle errors, implement retries, and monitor your workflow execution

## Setting up your environment

Before you can start creating workflows with Azure Logic Apps and Neon, you need to set up your environment.

### Step 1: Create a Neon project

1. Log in to the [Neon Console](https://console.neon.tech)
2. Click **New Project**
3. Name your project and choose an AWS region, ideally one close to the Azure region you'll use for Logic Apps
4. Click **Create project**

Save your connection details. You'll need them to connect Logic Apps to your database.

### Step 2: Create the database schema

For this guide, create a sample table for tracking customer orders:

```sql
CREATE TABLE orders (
    customer_email VARCHAR(255) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

You can run the SQL statement in the **SQL Editor** in the Neon Console to create the schema. This table will store order details, including the customer's email, product name, quantity, status, and creation timestamp.

### Step 3: Set up Azure Logic Apps

With your Neon project and database schema in place, you can now set up Azure Logic Apps.

1. Go to the [Azure Portal](https://portal.azure.com)
1. Search for "Logic Apps" and select it
1. Click "Add" to create a new Logic App
1. Select "Consumption" plan type
1. Fill in the basics:
   - Choose your subscription
   - Select or create a resource group
   - Name your Logic App
   - Choose a region close to your Neon project's AWS region
1. Click "Review + create" and then "Create"

This will take a few moments to deploy your Logic App. Once it's ready, you can start building workflows.

## Creating your first workflow

Before you start building your first workflow, let's understand the key components of an Azure Logic App:

- **Trigger**: An event that starts the workflow. It could be a timer, HTTP request, or a change in a service. Each workflow must have at least one trigger.
- **Action**: A step that performs a specific operation, such as sending an email, updating a database, or calling an API.

You can chain multiple actions together to automate multi-step business processes.

Let's create a workflow that automatically processes new orders. For our fictional store the workflow will:

1. Trigger when a new order record is created
1. Update the order status in the database
1. Send a notification email to the customer

### Step 1: Configure a trigger

For our order processing workflow, we'll use an HTTP trigger that listens for new orders:

1. Open your Logic App in the Azure Portal
1. Go to the Logic App Designer, it is under "Development Tools"
1. Click "Add a trigger"
1. Search for "When an HTTP request is received" and select it
1. For the payload schema you can use the following example:
   ```json
   {
     "type": "object",
     "properties": {
       "customerEmail": {
         "type": "string"
       },
       "productName": {
         "type": "string"
       },
       "quantity": {
         "type": "integer"
       }
     },
     "required": ["customer_email", "product_name", "quantity"]
   }
   ```
1. Click "Save" which will generate a URL that you can use to trigger the workflow

### Step 2: Add a Postgres connection

With the trigger in place, you can now add actions to the workflow. Let's start by connecting to your Lakebase Postgres database where you store order data:

1. While in the Logic App Designer, click "Add an action"
1. Search for "PostgreSQL" and select "Insert row"
1. Configure the connection:
   - Connection Name: "NeonConnection"
   - Server: Your Neon host (e.g., "ep-cool-smoke-123456.us-east-1.aws.neon.tech")
   - Database name: Your database name
   - Username: Your Neon database username
   - Password: Your Neon database password
   - Encrypt connection: Yes
1. Click "Create"

### Step 3: Insert order data

The [Azure Logic Apps PostgreSQL connector](https://learn.microsoft.com/en-gb/connectors/postgresql/#insert-row) has a limitation: the insert row operation requires an explicit value for a primary key column, even when a default or autoincrement value is defined. The `orders` table in this guide has no primary key column, so it isn't affected.

With the database connection set up, you can now insert the order data into the database using the trigger payload:

1. While still in the Logic App Designer, from the "Table name" dropdown, select the "orders" table you created earlier
1. For the "Columns" field, set the values:
   - customer_email: `@triggerBody()?['customerEmail']`
   - product_name: `@triggerBody()?['productName']`
   - quantity: `@triggerBody()?['quantity']`
1. If you were to check "Code View", you would see the following JSON:
   ```json
   {
     "type": "ApiConnection",
     "inputs": {
       "host": {
         "connection": {
           "referenceName": "postgresql"
         }
       },
       "method": "post",
       "body": {
         "customer_email": "@triggerBody()?['customerEmail']",
         "product_name": "@triggerBody()?['productName']",
         "quantity": "@triggerBody()?['quantity']"
       },
       "path": "/datasets/default/tables/@{encodeURIComponent(encodeURIComponent('[public].[orders]'))}/items"
     },
     "runAfter": {}
   }
   ```
1. After adding the database action, click "Save"

### Step 4: Test the workflow

To test the workflow, let's use the Azure Logic Apps run interface:

1. Go to the Logic App Designer
1. Click the "Run" dropdown and select "Run with payload" to trigger the workflow
1. Under "Request body", enter sample order data:
   ```json
   {
     "customerEmail": "test@example.com",
     "productName": "Laptop",
     "quantity": 2
   }
   ```
1. Click "Run" to execute the workflow
1. Check the database to verify that the order was inserted

## Extending your workflow

Once the basic workflow works, you can add more actions. A common one is sending an email notification when a new order is placed.

### Adding an email notification

You can use the built-in email actions in Azure Logic Apps to notify customers when their order is received:

1. In the Logic App Designer, click **Add an action** after the database insertion step.
2. Search for "Send an email" and select your preferred email service (e.g., **Outlook.com**, **Gmail**, or **SendGrid**).
3. Follow the prompts to connect your email provider.
4. Depending on the service you choose, you may need to authorize Azure Logic Apps to send emails on your behalf. For example, if you're using Gmail, you can follow [this guide](https://learn.microsoft.com/en-gb/connectors/gmail/) to set up the email action.
5. Click "Save".

Now, every time a new order is placed, the Logic App inserts the order into your Lakebase Postgres database and send a confirmation email to the customer.

## Conclusion

You now have a Logic App that takes orders over HTTP, writes them to Lakebase Postgres through the PostgreSQL connector, and can email customers, all without writing application code. From here, you can add other Logic Apps connectors to route the same order data to more services.

## Additional resources

- [Azure Logic Apps documentation](https://docs.microsoft.com/azure/logic-apps/)
- [Neon documentation](/docs)
- [PostgreSQL connector documentation](https://docs.microsoft.com/connectors/postgresql/)

<NeedHelp />

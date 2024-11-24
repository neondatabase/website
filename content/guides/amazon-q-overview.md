---
title: Querying Neon Postgres with Natural Language via Amazon Q Business
subtitle: Learn how to set up Amazon Q Business to query your Neon Postgres database using natural language
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-11-23T00:00:00.000Z'
updatedOn: '2024-11-23T00:00:00.000Z'
---

Amazon Q Business enables you to build an interactive chat application that combines your Neon Postgres data with large language model capabilities.

Rather than querying your database directly, Amazon Q Business creates an index of your data which users can then interact with through a natural language interface.

In this guide, you'll learn how to set up Amazon Q Business to query your Neon Postgres database using natural language. We'll cover the following topics:

## Prerequisites

Before starting, you'll need:

- An [AWS Account](https://aws.amazon.com/q/) with Amazon Q Business subscription (Pro or Lite plan)
- A [Neon](https://console.neon.tech/signup) account and project
- [AWS IAM Identity Center](https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/idc-setup.html) configured (recommended) or Identity Federation through IAM
- Basic understanding of databases and SQL

## Setting Up Your Environment

In order to use Amazon Q, you will need to have an AWS Organization set up with the IAM Identity Center enabled. This will allow you to manage your users and permissions across multiple AWS accounts.

### Configure IAM Identity Center

To begin setting up the AWS Q Business application, you will have to configure the application environment to enable end-user access by integrating AWS IAM Identity Center for streamlined user management.

If you haven't set up IAM Identity Center yet, complete the setup process first following AWS's [detailed guide](https://docs.aws.amazon.com/singlesignon/latest/userguide/get-set-up-for-idc.html).

The exact steps may vary depending on your organization's requirements, existing identity sources, security policies, and other factors. It's recommended to work with your organization's IT or security team to ensure a smooth setup.

You can follow the [IAM Identity Center setup guide](https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/create-application.html) for detailed steps.

### Create Your Application Environment

Once IAM Identity Center is configured, next you will have to create your Amazon Q Business application:

1. Navigate to the [Amazon Q Business Console](https://us-east-1.console.aws.amazon.com/amazonq/business/welcome) and choose "Create application". You must add, assign, and subscribe at least one user to your Amazon Q Business application environment for it to work as intended.

2. Configure basic settings:

   - Name: Pick a unique name for your application
   - Outcome: Choose 'Web experience', this will allow you to access Q as a managed web experience
   - For Access management method select 'IAM Identity Center' or 'IAM Identity Provider' depending on your setup
   - Under the 'Quick start user' section, select the user that you've created in the IAM Identity Center or click the 'Add new users and groups' button to create a new user if you haven't done so already
   - Next to the selected user, make sure to select subscription plan (Pro or Lite) and assign the user to the application

3. Once ready, click the create button. Amazon Q Business will automatically create a web experience unless you opt out. For detailed steps, follow the [application creation guide](https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/create-app.html).

Now that your environment is set up, you can proceed to connecting your Neon database as a data source and configuring the natural language interface.

## Database Setup

If you already have data in your Neon Postgres database, you can skip this section. Otherwise, follow these steps to create a sample database and set up data syncing with Amazon Q Business.

Let's set up a sample database with customer data:

```sql
-- Create customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    subscription_tier VARCHAR(50),
    monthly_spend DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO customers (name, email, subscription_tier, monthly_spend) VALUES
('TechWave Solutions', 'contact@example.com', 'Premium', 9500.00),
('BlueSky Innovations', 'hello@example.com', 'Growth', 2200.00),
('Greenfield Consulting', 'info@example.com', 'Standard', 600.00),
('BrightFuture Partners', 'support@example.com', 'Premium', 12000.00),
('UrbanTech Solutions', 'services@example.com', 'Basic', 300.00);
```

The above SQL script creates a `customers` table. The table stores customer information which we will use demonstrate data syncing with Amazon Q Business and querying through natural language.

## Configuring Data Source

Once your Neon database is set up, you can configure it as a data source in Amazon Q Business.

Head to the [Amazon Q Business Console](https://us-east-1.console.aws.amazon.com/amazonq/business/applications), click on the application you created, and then follow these steps:

1. Navigate to "Data sources" and click "Add data source"
2. Search for the "PostgreSQL" connector and click "Add"
3. Configure connection details:

   Under '**Source**' add the following details:

   - Data source name: Neon Database
   - Host: your-neon-hostname.neon.tech
   - Port: 5432
   - Instance: `your_neon_database`
   - Check the '**Enable SSL Certificate Location**' box but leave the '**SSL Certificate Location**' field empty

   Under '**Authentication**', click on the '**Create and add a secret**' button and add the following details:

   - Secret name: Neon Database Secret
   - Username: `your_neon_database_username`
   - Password: `your_neon_database_password`

   Click '**Create secret**' and then select the secret that you've just created from the dropdown.

   Under '**IAM role**', create a new role or select an existing one with the necessary permissions for Amazon Q Business to access your Neon credentials through the secret manager. You can click the '**Create a new service role**' button to create a new role if you don't have one already.

4. After setting up your database connection, you'll need to configure how Amazon Q Business should sync your data. Here's how to configure the sync scope:

   Enter your SQL query that defines what data to sync. For example:

   ```sql
   SELECT
       id,
       name,
       CONCAT(subscription_tier, ': ', monthly_spend) AS body
   FROM customers
   ```

   > Note: SQL queries must be less than 32 KB in size and must only use DQL (Data Query Language) operations.

   - Define the required columns:
     - **Primary key column**: `id`
     - **Title column**: `name`
     - **Body column**: `body`

   Amazon Q Business offers additional configuration options like change-detecting columns, user IDs, groups, timestamps, and more. These settings help you fine-tune how the sync process works and when data should be updated. For most use cases, the default settings will work well.

5. Once you've configured the sync scope, you can set up the '**Sync Mode**' and '**Sync Schedule**'. The sync mode determines how Amazon Q Business should handle data changes, while the sync schedule defines how often the sync job should run.

   - **Sync Mode**: Choose between '**Full Sync**' or '**New and Modified Content Sync**'. Full Sync will reindex all data each time, while New and Modified Content Sync will only update new or modified data.
   - **Sync Schedule**: Define the sync schedule. You can choose from options like on-demand, hourly, daily, weekly, monthly, or a custom cron expression. For most applications, a daily sync schedule is sufficient to keep data up-to-date unless you have a high amount of data changes.

Once you've configured your data source, click the '**Sync**' button and Amazon Q Business will start syncing your Neon database data. You can monitor the sync status and view the indexed data in the Amazon Q Business Console.

It can take from a few minutes to a few hours depending on the size of your database and the sync frequency you've set.

## Web Experience Setup

Once your data source is synced, you can access and share the Amazon Q Business web interface. The web experience provides a chat interface out of the box where users can query your Neon database using natural language.

### Finding Your Web Experience URL

The web experience URL is automatically generated by Amazon Q Business. To find it:

1. Navigate to your application in the Amazon Q Business Console
2. Look for the '**Web experience settings**' section
3. Find the '**Deployed URL**' - this is the URL you'll share with your authorized users

Once you have the URL, visit it in your browser to access the Amazon Q Business web interface. You will be prompted to log in using your IAM Identity Center credentials and then you can start querying your Neon database using natural language.

### Customizing the Experience

Before sharing with users, you can customize the web interface:

1. Click '**Customize web experience**' in your application settings
2. Configure the following:
   - Title: Your Database Assistant
   - Subtitle: Query your database using natural language
   - Welcome message: Ask questions about your data in plain English

### Example Queries

Once users access the web experience, they can select the '**Company Knowledge**' tab and ask questions like:

- "Show me all enterprise customers"
- "What's our total monthly spend by subscription tier?"
- "Who are our top customers by monthly spend?"

### Access Control

Only users who have been granted access through IAM Identity Center can access the web experience. Make sure to add users to the appropriate groups and configure permissions correctly based on your organization's policies.

After users click the web experience URL, they'll be prompted to log in using their IAM Identity Center credentials. Once authenticated, they can start querying your Neon database using natural language.

Keep in mind that Amazon Q Business is optimized for English language queries, so instruct your users to formulate their questions in English for best results.

## Conclusion

Amazon Q provides a natural language interface to query your Neon Postgres database, making it easier for team members who aren't SQL experts to access data.

Amazon Q Business also provides several methods to add data to your application beyond your primary Neon database connection, you can upload files like documentation, guides, or data dictionaries directly through the AWS Q console. Or use a Web Crawler to index web pages and documents directly from your website or the internet.

## Additional Resources

- [Neon Documentation](/docs)
- [Amazon Q Business Documentation](https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/what-is.html))
- [AWS IAM Identity Center Guide](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html)

<NeedHelp />

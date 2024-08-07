---
title: Chat with Neon Postgres with AskYourDatabase
subtitle: Chat with your Neon Postgres database without writing SQL
enableTableOfContents: true
updatedOn: '2024-07-02T09:02:30.704Z'
---

AskYourDatabase is the ChatGPT for SQL databases, enabling you to interact with your SQL databases using natural language. You can use it for data management, business intelligence, schema design & migration, data visualization, and more. To learn more, see [AskYourDatabase](https://www.askyourdatabase.com/).

This guide shows how to connect from AskYourDatabase to Neon Postgres.

## Prerequisites

- AskYourDatabase Desktop app. See [Download AskYourDatabase](https://www.askyourdatabase.com/download).
- A Neon project. See [Create a Neon project](/docs/manage/projects#create-a-project).

## Connect to Neon from AskYourDatabase

1. Get the Neon URL by navigating to the Neon Console and copying the connection string. The URL will look something like this:

   ```text shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
   ```

2. Go to AskYourDatabase and click **Connect to your database**:
   ![Connect to new db](/docs/guides/askyourdatabase_connect_neon_1.png)

3. Select PostgreSQL as your database type, and paste your connection string:

   ![Paste connection string](/docs/guides/askyourdatabase_connect_neon_2.png)

4. A new chat session opens if the connection is successful:

   ![New chat session](/docs/guides/askyourdatabase_connect_neon_3.png)

## Chat with your data

Within the chat session, you can start asking your database questions.

For example, suppose you have a `user` table with a column named `dbType` that indicates the type of database.

If you want to know what the four most popular databases are and visualize the distribution in a pie chart, you can quickly and easily do so with a natural language question, as shown below:

![Chat with Neon](/docs/guides/askyourdatabase_ask_neon.png)

## What's more

AskYourDatabase also supports a customer-facing chatbot that can connect to a Neon Postgres database. You can embed the chatbot in your existing website, enabling your customers to explore analytics data by asking questions in natural language. To learn more, see [Create and Integrate Chatbot](https://www.askyourdatabase.com/docs/chatbot), in the AskYourDatabase documentation.

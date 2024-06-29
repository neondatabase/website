---
title: Chat with Neon in AskYourDatabase
subtitle: Chat with your Neon DB without writing SQL
enableTableOfContents: true
updatedOn: '2024-06-29T07:55:54.403Z'
---

AskYourDatabase is the ChatGPT for SQL databases, enabling you to interact with your SQL databases using natural language. You can use it for data management, business intelligence, schema design & migration, data visualization, and more. To learn more, see [here](https://www.askyourdatabase.com/).

## Prerequisites

- AskYourDatabase Desktop app. See [Download AskYourDatabase](https://www.askyourdatabase.com/download).
- A Neon project. See [Create a Neon project](/docs/manage/projects#create-a-project).

## Connect to Neon in AskYourDatabase

Get the Neon URL by navigating to Neon console and copying the connection string. The URL should look like this: `postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname`.

Go to AskYourDatabase and click **Connect to your database**: ![Connect to new db](/docs/guides/askyourdatabase_connect_neon_1.png)

And then select PostgreSQL as your database type, and paste your connection string:

![Paste connection string](/docs/guides/askyourdatabase_connect_neon_2.png)

It will open a new chat session if connected successfully:

![New chat session](/docs/guides/askyourdatabase_connect_neon_3.png)

## Chat with your data

Within the chat session, you can start to ask your data any questions. For example, let's suppose we have a `user` table with a column named `dbType` that indicates what type of database they are using.

Now we want to know what the four most popular databases are and try to visualize their distribution in a pie chart:

![Chat with Neon](/docs/guides/askyourdatabase_ask_neon.png)

## What's more

AskYourDatabase also supports a customer-facing chatbot that can connect to Neon DB and serve as a chatbot embedded in your existing website, enabling your customers to explore the analytic data by asking questions. To learn more, please go to [AI Chatbot that connects to database](https://www.askyourdatabase.com/docs/chatbot).

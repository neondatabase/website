---
title: Chat with Neon in AskYourDatabase
subtitle: Chat with your Neon Postgres database without writing SQL
enableTableOfContents: true
updatedOn: '2024-06-29T07:55:54.403Z'
---

AskYourDatabase is the ChatGPT for SQL databases, enabling you to interact with your SQL databases using natural language. You can use it for data management, business intelligence, schema design & migration, data visualization, and more. To learn more, see [AskYourDatabase](https://www.askyourdatabase.com/).

This guide shows how to connect from AskYourDatabase to Neon Postgres and chat with your database using natural language.

## Prerequisites

- AskYourDatabase Desktop app. See [Download AskYourDatabase](https://www.askyourdatabase.com/download).
- A Neon project. See [Create a Neon project](/docs/manage/projects#create-a-project).

## Connect to Neon in AskYourDatabase

Get the Neon URL by navigating to Neon Console and copying the connection string. The URL will look something like this: `postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname`.

Go to AskYourDatabase and click **Connect to your database**: ![Connect to new db](/docs/guides/askyourdatabase_connect_neon_1.png)

Select PostgreSQL as your database type, and paste your connection string:

![Paste connection string](/docs/guides/askyourdatabase_connect_neon_2.png)

A new chat session opens if the connection is successful:

![New chat session](/docs/guides/askyourdatabase_connect_neon_3.png)

## Chat with your data

Within the chat session, you can start to ask your data any questions. For example, let's suppose we have a `user` table with a column named `dbType` that indicates the type of database.

Now, we want to know what the four most popular databases are and visualize the distribution in a pie chart:

![Chat with Neon](/docs/guides/askyourdatabase_ask_neon.png)

## What's more

AskYourDatabase also supports a customer-facing chatbot that can connect to a Neon Postgres database. You can embed the chatbot in your existing website, enabling your customers to explore analytics data by asking questions in natural language. To learn more, see [Create and Integrate Chatbot](https://www.askyourdatabase.com/docs/chatbot), in the AskYourDatabase documentation.

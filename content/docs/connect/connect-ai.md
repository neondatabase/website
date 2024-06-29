---
title: Connect with AI
subtitle: Add AI capabilities to your Neon Postgres database with AskYourDatabase
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.362Z'
---

You can integrate your Neon Postgres database with various AI-enabled tools like [AskYourDatabase](https://www.askyourdatabase.com/), [Outerbase](https://www.outerbase.com/), and [LangChain](https://www.langchain.com/) to help with various tasks including querying data, data analysis, business intelligence, and more.

## Connect to Neon

We will step through connecting to Neon with AskYourDatabase as an example. To download the Desktop App, see [Downlaod AskYourDatabase](https://www.askyourdatabase.com/download).

To connect, grab your Neon database connection string from the **Connection Details** widget on the **Neon Dashboard**.

![Connection details widget](/docs/connect/connection_details.png)

Paste the connection string into the **Database Configuration** dialog and click **Connect**:

![Connect to AskYourDatabase](/docs/guides/askyourdatabase_connect_neon_2.png)

After the connection is established, you can query your data and even make data visualizations by asking your database questions in natural language.

For example, let's suppose we have a `user` table with a column named `dbType` that indicates what type of database they are using.

With AskYourDatabase, you can ask what the four most popular database types are and visualize the distribution in a pie chart:

![Connect to AskYourDatabase](/docs/guides/askyourdatabase_ask_neon.png)

<NeedHelp/>

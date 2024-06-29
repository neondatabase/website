---
title: Connect with AI
subtitle: Learn how to integrate AI capabilities into Neon
enableTableOfContents: true
updatedOn: '2024-06-29T14:19:59.862Z'
---

You can integrate various AI tools like [AskYourDatabase](https://www.askyourdatabase.com/), [Outerbase](https://www.outerbase.com/), [LangChain](https://www.langchain.com/) with Neon DB to help you with various tasks including querying data, data analysis, business intelligence, and more.

## Connect to Neon

We will walk through AskYourDatabase as an example, other tools are similar.

To connect, you just need to grab the connection string, which you can obtain from the **Connection Details** widget on the **Neon Dashboard**.

![Connection details widget](/docs/connect/connection_details.png)

And paste the connection string and click connect:

![Connect to AskYourDatabase](/docs/guides/askyourdatabase_connect_neon_2.png)

Once the process completes, you can start to query data and make data visualizations by asking questions against your data.

For example, let's suppose we have a `user` table with a column named `dbType` that indicates what type of database they are using.

Now we want to know what the four most popular databases are and try to visualize their distribution in a pie chart:

![Connect to AskYourDatabase](/docs/guides/askyourdatabase_ask_neon.png)

<NeedHelp/>

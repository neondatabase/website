---
title: Build dashboards on Neon Postgres with Draxlr
subtitle: Create live Neon dashboards and reports directly from your Postgres data
summary: >-
  Step-by-step guide for connecting Draxlr to a Neon Postgres database, enabling
  users to build dashboards and reports using SQL, visual queries, or AI for
  data analysis and insights.
redirectFrom:
  - /docs/integrations/draxlr
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.955Z'
---

[Draxlr](https://www.draxlr.com) is a no code analytics tool for Neon Postgres that lets you build dashboards, reports, and insights using SQL, visual queries, or AI. It is commonly used for product analytics, reporting, and embedded dashboards.

This guide shows how to connect Draxlr to a Neon Postgres database.

## Prerequisites

- A Draxlr account. See [Sign up for Draxlr](https://app.draxlr.com/register/).
- A Neon project with a Postgres database. See [Create a Neon project](/docs/manage/projects#create-a-project).

## Connect Neon Postgres to Draxlr

1. **Get your Neon connection string**
   In the Neon Console, open your project and copy the Postgres connection string. It will look similar to the following:

   ```text shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

2. Open Draxlr and add a new data source
   - Log in to Draxlr.
   - Click on **Connect Database**.
3. Select **Neon** as the database type
   ![Connect to neon](/docs/guides/draxlr_connect_1.png)
4. Paste the Neon connection details
   - Click on **Import from URL** and paste the Neon connection string into the connection URL field, or
   - Enter the _Host, Port, Database name, Username, and Password_ manually using values from the Neon Console.

   ![Adding connection details](/docs/guides/draxlr_connect_2.png)

5. Save the connection
   - Click Next and if the connection is successful, choose your desired schemas. Your Neon Postgres database is now connected to Draxlr.

## Neon analytics with visual queries and SQL

Once connected, Draxlr works as a Neon analytics tool that lets you analyze data in multiple ways.

- **Visual Query Builder for Neon Analytics**: Build queries using a point-and-click interface. Select tables, define joins, apply filters, and create aggregations without writing SQL.
  ![Draxlr Visual Query Builder](/docs/guides/draxlr_queries_1.png)
- **Raw SQL for Neon Reporting and Analysis**: Switch to raw query mode to write SQL directly. This is ideal for advanced queries, performance tuning, or when you want full control over your Postgres queries.
  ![Draxlr Raw SQL Mode](/docs/guides/draxlr_queries_2.png)

You can freely move between visual queries and SQL, making it easy to start visually and refine queries as needed.

## Ask questions with AI chat

Draxlr also includes an AI-powered chat interface that lets you ask questions about your Neon Postgres data in natural language.

For example, you can ask:

- "What were the top 5 customers by revenue last month?"
- "Show me daily signups for the past 30 days."
- "Compare average order value by region."
  ![Draxlr AI Chat](/docs/guides/draxlr_queries_3.png)

Draxlr translates these questions into database queries, runs them on your Neon Postgres database, and returns results as tables or visualizations - no SQL required.

## What's next?

With Draxlr and Neon, you can go beyond one off queries and build reliable Neon analytics workflows.

You can:

1. Monitor key metrics from your Neon Postgres database in real time and receive automated alerts via email or Slack when values changes.
2. Create live Neon dashboards and embed them into customer facing applications for interactive analytics.

Together, Draxlr and Neon provide a simple way to analyze, monitor, and visualize Neon Postgres data.

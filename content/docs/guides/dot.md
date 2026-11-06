---
title: Ask questions about Lakebase Postgres data with Dot
subtitle: Let your team ask questions in Slack, Microsoft Teams, or the web and get answers from your Neon database
summary: >-
  Dot is an AI data analyst that connects to a Lakebase Postgres database and
  answers plain-English questions with SQL-backed tables and charts in Slack,
  Microsoft Teams, or the Dot web app. Use this guide to create a read-only
  Postgres role for Dot, paste your Neon connection string into Dot's Neon
  connection, choose the tables Dot uses, and add table and column comments
  that help Dot write accurate queries.
enableTableOfContents: true
---

[Dot](https://www.getdot.ai) is an AI data analyst. Your team asks questions in Slack, Microsoft Teams, or the Dot web app. Dot writes the SQL, runs it on your Lakebase Postgres database, and answers with tables and charts.

This guide shows how to connect Dot to a Neon database with a read-only role.

## Prerequisites

- A Dot account. See [Sign up for Dot](https://app.getdot.ai/register).
- A Neon project with a Postgres database. See [Create a Neon project](/docs/manage/projects#create-a-project).

## Create a read-only role for Dot

Dot only reads your data, so give it a role that can't change anything. Roles you create in the Neon Console are administrators, so create this one with SQL. In the Neon Console, open the **SQL Editor** for your database and run the following statements. Replace `dbname` with your database name, and repeat the last three statements for each schema Dot should see.

```sql
CREATE ROLE dot_reader WITH LOGIN PASSWORD '<password>';
GRANT CONNECT ON DATABASE dbname TO dot_reader;
GRANT USAGE ON SCHEMA public TO dot_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO dot_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO dot_reader;
```

The password must have at least 60 bits of entropy. See [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql). To learn more about read-only access, see [Create a read-only role](/docs/manage/database-access#create-a-read-only-role).

## Connect Neon to Dot

1. **Copy your connection string**

   In the Neon Console, click **Connect** on your project dashboard. Select your branch, your database, and the `dot_reader` role, then copy the connection string. Pooled and direct connection strings both work. The connection string looks similar to the following:

   ```text shouldWrap
   postgresql://dot_reader:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
   ```

2. **Open the Neon connection in Dot**

   In Dot, go to **Settings** > **Connections** and click **Neon**.

   ![Dot connections page](/docs/guides/dot_connect_1.png)

3. **Paste the connection string**

   Paste the connection string into **Host**. Dot fills in the host, port, database, username, and password. **Schemas** is optional: list the schemas Dot should sync, for example `public`, or leave it empty to sync every schema the role can read.

   ![Neon connection details in Dot](/docs/guides/dot_connect_2.png)

   Dot always uses SSL mode `require`. It also removes `-pooler` from a pooled hostname and connects to the direct host, because it sets a time limit on each query and [Neon's connection pooler](/docs/connect/connection-pooling) doesn't accept that limit as a startup setting.

4. **Connect**

   Click **Connect**. Dot checks the connection, then syncs your tables, columns, and comments.

<Admonition type="tip">
If you restrict access with [IP Allow](/docs/introduction/ip-allow), add Dot's IP addresses: `5.78.211.110` for the US region and `178.105.217.177` for the EU region.
</Admonition>

## Choose the tables Dot uses

After the first sync, open **Model** in Dot. Under **Data Sources**, turn on the tables Dot should use for answers. Dot answers only from tables that are on. If Neon is the first database your team connects to Dot, Dot turns on up to 10 tables that look most useful and lists them at the end of the sync log. Otherwise, new tables start off.

![Choosing tables in Dot](/docs/guides/dot_model.png)

## Ask questions about your data

Open Dot in the web app and ask a question in plain English. Dot writes a Postgres query, runs it on your Neon database, and answers with a table or chart. For example:

- "Which 10 countries bring in the most revenue?"
- "How did monthly sales change last year?"
- "Who are our top customers, and which support rep looks after them?"

![Dot answering a question about Neon data](/docs/guides/dot_answer_1.png)

Every answer shows the SQL that Dot ran on the **Query** tab, so you can check how it got the result.

![The SQL behind a Dot answer](/docs/guides/dot_answer_2.png)

## Help Dot understand your data

Dot reads the comments on your tables and columns. Short comments that explain what a table holds, which column to sum, or how tables relate help Dot pick the right columns and write accurate queries. For example:

```sql
COMMENT ON TABLE "Invoice" IS 'One row per customer purchase.';
COMMENT ON COLUMN "Invoice"."Total" IS 'Invoice amount in US dollars. Sum it for revenue.';
```

Dot picks up new comments the next time it syncs the connection.

## What's next?

- Add Dot to [Slack](https://docs.getdot.ai/integrations/slack-and-teams/slack) or [Microsoft Teams](https://docs.getdot.ai/integrations/slack-and-teams/microsoft-teams) so your team can ask questions where they already work.
- Learn more about the [Neon connection in Dot](https://docs.getdot.ai/integrations/databases/neon).

<NeedHelp/>

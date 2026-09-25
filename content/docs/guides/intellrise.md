---
title: Query Lakebase Postgres in plain English with Intellrise
subtitle: Connect a Neon database and ask questions in English instead of SQL
summary: >-
  Intellrise is a conversational analytics tool that connects to a Lakebase
  Postgres database, writes the SQL for a question asked in plain English,
  runs it, and returns a chart or a table. Use this guide to connect a Neon
  project to Intellrise, including how to map each part of a Neon connection
  string onto the fields Intellrise asks for separately. The guide also
  covers what Intellrise reads from your database and what it does not, the
  network access it needs from a Neon project, and the read-only Postgres
  role worth creating before you point it at production.
enableTableOfContents: true
updatedOn: '2026-08-24T03:30:00.000Z'
---

[Intellrise](https://intellrise.com/) is a conversational analytics tool for Lakebase Postgres. You ask a question in English, it writes the SQL, runs it against your database, and returns a chart or a number, with the table it came from and the SQL it ran each one click away. It is built for people who own the data question but do not want to own the query, such as founders, operators, and independent data consultants.

This guide shows how to connect Intellrise to a Lakebase Postgres database.

## Prerequisites

- An Intellrise account. See [Intellrise](https://app.intellrise.com/login). A free account can connect one database.
- A Neon project with a Postgres database. See [Create a Neon project](/docs/manage/projects#create-a-project).
- An API key from a model provider. Intellrise has no platform key on any tier, so you bring your own. See [Bring your own model key](#bring-your-own-model-key).

## Connect Neon to Intellrise

1. Get your Neon connection string. In the Neon Console, open your project and copy the Postgres connection string. It looks similar to this:

   ```text shouldWrap
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
   ```

2. In Intellrise, open **Settings**. You land on the **Data Sources** tab. Click **Connect Data Source**.
3. Under the **Database** group, select **PostgreSQL**. On an account with no source connected yet, the **File / Sheet** group is listed first, so scroll past it to reach **Database**.
4. Fill in the connection fields. Intellrise asks for the parts of the connection separately rather than for the whole URL, so you split the string from step 1 across the form. The next section maps each piece.
5. Click **Connect**. Intellrise saves the source and immediately tests it. If the test fails, you get your database's own error text rather than a generic message, and the row stays in the list. Use the pencil icon on that row to correct the details, and re-enter the password when you do: the connection is only rebuilt when a password is supplied.

## Map a Neon connection string to the Intellrise form

There is no field for pasting a connection string, so take the example from step 1 apart like this. The fields are listed in the order the form presents them.

| Intellrise field | Value from the Neon connection string                |
| ---------------- | ---------------------------------------------------- |
| Display Name     | Any label you want to see in your data source list   |
| Host / IP        | `ep-cool-darkness-123456.us-east-2.aws.neon.tech`    |
| Port             | `5432`, already filled in when you pick PostgreSQL   |
| Database Name    | `dbname`                                             |
| Schema           | `public` by default, or the schema you want to query |
| Username         | `alex`                                               |
| Password         | `AbC123dEf`                                          |

One thing you do not have to configure: Intellrise appends `sslmode=require` to every Postgres connection string it builds, and there is no switch for it. That matches Neon, which requires SSL. A server that refuses encryption fails to connect here by design.

## Let Intellrise reach your Neon project

Intellrise connects from its own servers rather than from your browser, so the project has to accept an inbound connection from the internet.

On Neon this matters in one specific case. If you have turned on IP Allow for the project, the Intellrise egress ranges have to be on that allowlist, or the attempt fails with a timeout that reads like a wrong hostname. Those ranges are printed on the same Settings screen where you add the source, so copy them from there rather than from this page, where they would go stale. They belong to a hosting provider and are shared with its other tenants in the same region, so allowlisting them is narrower than opening the port to the internet, but it is not a rule that admits only Intellrise.

## What Intellrise reads, and what it does not

Before you point this at a production Neon project, it is worth being precise about the access it takes.

- **Queries run against a read-only attachment.** Postgres sources are attached `READ_ONLY`, and every statement, including SQL the model writes, is refused if it carries `DROP`, `DELETE`, `UPDATE`, `INSERT`, `CREATE`, `ALTER`, `TRUNCATE`, `GRANT`, or one of ten more in the same list.
- **That guard is a keyword filter, not a SQL parser.** This is why a read-only Postgres role is still the control worth having. Intellrise does not check that the account you enter is read-only. Create a role that holds `SELECT` on only the schema you want to expose, and use that role here. On Neon you can also point Intellrise at a branch rather than at your primary.
- **Views and materialized views are included.** Schema introspection covers ordinary tables, partitioned parents, views and materialized views, so a number that lives in a reporting view is something the model can read directly rather than something it recomputes from the base tables and gets subtly differently. Children of a declarative partitioned table are left out, because the parent already carries their rows.
- **A relation it cannot sample is still described.** Intellrise reads a few rows of each relation for context. When that read fails or times out, which a materialized view created `WITH NO DATA` or a deliberately slow view will do, the relation keeps its place and the model still knows its columns.

## Bring your own model key

Every chat turn is routed through a model key you add yourself, and there is no platform key fallback on any tier. Add a key under **Settings**, in **AI Keys**, before asking your first question. Gemini, OpenAI, Anthropic, DeepSeek and MiniMax are supported, as is any OpenAI-compatible endpoint you point at a base URL.

This is a deliberate trade. You pay your model provider directly and are not metered against an included credit allowance, and in exchange the first run has one more step than a tool that ships its own key. Check your provider's terms for how it treats the prompts you send, because free and paid tiers often differ on that point.

## What's next

With the source connected and a key in place, ask a question in the chat. Every result carries a **Show SQL** link that reveals the query Intellrise ran, so you can check it before you trust the number.

For a published record of what the model got right and wrong on a sample e-commerce dataset, including a case where it counted cancelled orders as revenue and moved a name in and out of a top ten list, see the [Intellrise demo page](https://intellrise.com/demo/).

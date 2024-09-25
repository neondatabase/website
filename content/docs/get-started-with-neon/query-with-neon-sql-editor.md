---
title: Query with Neon's SQL Editor
subtitle: Query your database from the Neon Console using the Neon SQL Editor
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/tutorials
updatedOn: '2024-09-18T16:25:02.707Z'
---

The Neon SQL Editor allows you to run queries on your Neon databases directly from the Neon Console. In addition, the editor keeps a query history, permits saving queries, and provides [**Explain**](https://www.postgresql.org/docs/current/sql-explain.html) and [**Analyze**](https://www.postgresql.org/docs/current/using-explain.html#USING-EXPLAIN-ANALYZE) features.

<a id="query-via-ui/"></a>

To use the SQL Editor:

1. Navigate to the [Neon Console](https://console.neon.tech/).
2. Select your project.
3. Select **SQL Editor**.
4. Select a branch and database.
5. Enter a query into the editor and click **Run** to view the results.

![Neon SQL Editor](/docs/get-started-with-neon/sql_editor.png)

You can use the following query to try the SQL Editor. The query creates a table, adds data, and retrieves the data from the table.

```sql
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
INSERT INTO playing_with_neon(name, value)
SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
SELECT * FROM playing_with_neon;
```

Running multiple query statements at once returns a separate result set for each statement. The result sets are displayed in separate tabs, numbered in order of execution, as shown above.

To clear the editor, click **New Query**.

<Admonition type="tip">
When querying objects such as tables and columns with upper case letters in their name, remember to enclose the identifier name in quotes. For example: `SELECT * FROM "Company"`. Postgres changes identifier names to lower case unless they are quoted. The same applies when creating objects in Postgres. For example, `CREATE TABLE DEPARTMENT(id INT)` creates a table named `department` in Postgres. For more information about how quoted and unquoted identifiers are treated by Postgres, see [Identifiers and Key Words](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS), in the _PostgreSQL documentation_.
</Admonition>

## Save your queries

The SQL Editor allows you to save your queries.

To save a query:

1. Enter the query into the editor.
2. Click **Save** to open the **SAVE QUERY** dialog.
3. Enter a name for the query and click **Save**.

The query is added to the **Saved** list in the left pane of the SQL Editor. You can rerun a query by selecting it from the **Saved** list.

You can rename or delete a saved query by selecting **Rename** or **Delete** from the more options menu associated with the saved query.

## View the query history

The SQL Editor maintains a query history for the project. To view your query history, select **History** in the left pane of the SQL Editor. You can click an item in the **History** list to view the query that was run.

<Admonition type="note">
Queries saved to **History** are limited to 9 KB in length. While you can execute longer queries from the SQL Editor, any query exceeding 9 KB will be truncated when saved. A `-- QUERY TRUNCATED` comment is added at the beginning of these queries to indicate truncation. Additionally, if you input a query longer than 9 KB in the Neon SQL Editor, a warning similar to the following will appear: `This query will still run, but the last 1234 characters will be truncated from query history`.
</Admonition>

## Explain and Analyze

The Neon SQL Editor provides **Explain** and **Analyze** features.

- The **Explain** feature runs the specified query with the Postgres [EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html) command, which returns the execution plan for the query. The **Explain** feature only returns a plan with estimates. It does not execute the query.
- The **Analyze** feature runs the specified query with [EXPLAIN ANALYZE](https://www.postgresql.org/docs/current/using-explain.html#USING-EXPLAIN-ANALYZE). The `ANALYZE` parameter causes the query to be executed and returns actual row counts and run times for plan nodes along with the `EXPLAIN` estimates.

Understanding the information provided by the **Explain** and **Analyze** features requires familiarity with the Postgres [EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html) command and its `ANALYZE` parameter. Refer to the [EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html) documentation and the [Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) topic in the _PostgreSQL documentation_.

## Time Travel

You can toggle Time Travel in the SQL Editor to switch from querying your current data to querying against a selected point within your [history retention window](/docs/manage/projects#configure-history-retention).

![time travel in SQL Editor](/docs/get-started-with-neon/time_travel_sql_editor.png 'no-border')

For more details about using Time Travel queries, see:

- [Time Travel](/docs/guides/time-travel-assist)
- [Time Travel tutorial](/docs/guides/time-travel-tutorial)

## Export data to CSV, JSON and XLSX

The Neon SQL Editor supports exporting your data to `JSON`, `CSV` and `XLSX`. You can access the download button from the bottom right corner of the **SQL Editor** page. The download button only appears when there is a result set to download.

## Expand results section of the SQL Editor window

You can expand the results section of the SQL Editor window by selecting the expand window button from the bottom right corner of the **SQL Editor** page. There must be query results to display, otherwise the expanded results section will appear blank.

## Meta-commands

The Neon SQL Editor supports using Postgres meta-commands, which act like shortcuts for interacting with your database. If you are already familiar with using meta-commands from the `psql` command-line interface, you can use many of those same commands in the SQL Editor.

### Benefits of Meta-Commands

Meta-commands can significantly speed up your workflow by providing quick access to database schemas and other critical information without needing to write full SQL queries. They are especially useful for database management tasks, making it easier to handle administrative duties directly from the Neon Console.

### Available meta-commands

Here are some of the meta-commands that you can use within the Neon SQL Editor:

- `\dt` — List all tables in the current database.
- `\d [table_name]` — Describe a table's structure.
- `\l` — List all databases.
- `\?` - A cheat sheet of available meta-commands
- `\h [NAME]` - Get help for any Postgres command. For example, try `\h SELECT`.

Note that not all meta-commands are supported in the SQL Editor. To get a list of supported commands, use `\?`.

<details>
<summary>Example of supported commands</summary>
```bash
Informational
  (options: S = show system objects, + = additional detail)
  \d[S+]                 list tables, views, and sequences
  \d[S+]  NAME           describe table, view, sequence, or index
  \da[S]  [PATTERN]      list aggregates
  \dA[+]  [PATTERN]      list access methods
  \dAc[+] [AMPTRN [TYPEPTRN]]  list operator classes
  \dAf[+] [AMPTRN [TYPEPTRN]]  list operator families
  \dAo[+] [AMPTRN [OPFPTRN]]   list operators of operator families
  \dAp[+] [AMPTRN [OPFPTRN]]   list support functions of operator families
  \db[+]  [PATTERN]      list tablespaces
  \dc[S+] [PATTERN]      list conversions
  \dconfig[+] [PATTERN]  list configuration parameters
  \dC[+]  [PATTERN]      list casts
  \dd[S]  [PATTERN]      show object descriptions not displayed elsewhere
  \dD[S+] [PATTERN]      list domains
  \ddp    [PATTERN]      list default privileges
  \dE[S+] [PATTERN]      list foreign tables
  \des[+] [PATTERN]      list foreign servers
  \det[+] [PATTERN]      list foreign tables
  \deu[+] [PATTERN]      list user mappings
  \dew[+] [PATTERN]      list foreign-data wrappers
  \df[anptw][S+] [FUNCPTRN [TYPEPTRN ...]]
                         list [only agg/normal/procedure/trigger/window] functions
  \dF[+]  [PATTERN]      list text search configurations
  \dFd[+] [PATTERN]      list text search dictionaries
  \dFp[+] [PATTERN]      list text search parsers
  \dFt[+] [PATTERN]      list text search templates
  \dg[S+] [PATTERN]      list roles
  \di[S+] [PATTERN]      list indexes
  \dl[+]                 list large objects, same as \lo_list
  \dL[S+] [PATTERN]      list procedural languages
  \dm[S+] [PATTERN]      list materialized views
  \dn[S+] [PATTERN]      list schemas
  \do[S+] [OPPTRN [TYPEPTRN [TYPEPTRN]]]
                         list operators
  \dO[S+] [PATTERN]      list collations
  \dp[S]  [PATTERN]      list table, view, and sequence access privileges
  \dP[itn+] [PATTERN]    list [only index/table] partitioned relations [n=nested]
  \drds [ROLEPTRN [DBPTRN]] list per-database role settings
  \drg[S] [PATTERN]      list role grants
  \dRp[+] [PATTERN]      list replication publications
  \dRs[+] [PATTERN]      list replication subscriptions
  \ds[S+] [PATTERN]      list sequences
  \dt[S+] [PATTERN]      list tables
  \dT[S+] [PATTERN]      list data types
  \du[S+] [PATTERN]      list roles
  \dv[S+] [PATTERN]      list views
  \dx[+]  [PATTERN]      list extensions
  \dX     [PATTERN]      list extended statistics
  \dy[+]  [PATTERN]      list event triggers
  \l[+]   [PATTERN]      list databases
  \lo_list[+]            list large objects
  \sf[+]  FUNCNAME       show a function's definition
  \sv[+]  VIEWNAME       show a view's definition
  \z[S]   [PATTERN]      same as \dp
  ```
</details>

For more information about meta-commands, see [PostgreSQL Meta-Commands](https://www.postgresql.org/docs/current/app-psql.html#APP-PSQL-META-COMMANDS).

### How to Use Meta-Commands

To use a meta-command in the SQL Editor:

1. Enter the meta-command in the editor, just like you would a SQL query.
1. Press **Run**. The result of the meta-command will be displayed in the output pane, similar to how SQL query results are shown.

   For example, here's the schema for the `playing_with_neon` table we created above, using the meta-command `\d playing_with_neon`:

   ![metacommand example](/docs/get-started-with-neon/sql_editor_metacommand.png)

## AI features

<EarlyAccess/>

The Neon SQL Editor offers three AI-driven features:

-  **SQL generation**: Easily convert natural language requests to SQL. Press the ✨ button or **Cmd/Ctrl+Shift+M**, type your request, and the AI assistant will generate the corresponding SQL for you. It’s schema-aware, meaning you can reference any table names, functions, or other objects in your schema.
    ![SQL generation](/docs/relnotes/sql_editor_ai.png)
- **Fix with AI**: If your query returns an error, simply click **Fix with AI** next to the error message. The AI assistant will analyze the error, suggest a fix, and update the SQL Editor so you can run the query again.
  ![Fix withn AI](/docs/relnotes/fix_with_ai.png)
- **AI-generated query names**: Descriptive names are automatically assigned to your queries in the Neon SQL Editor's **History**. This feature helps you quickly identify and reuse previously executed queries.
  ![AI-generated query names](/docs/relnotes/query_names.png)

<Admonition type="important">
To enhance your experience with the Neon SQL Editor's AI features, we share your database schema with the AI agent. No actual data is shared. We currently use AWS Bedrock as our LLM provider, ensuring all requests remain within AWS's secure infrastructure where other Neon resources are also managed.
</Admonition>

<NeedHelp/>

---
title: Query with Neon's SQL Editor
subtitle: Query your database from the Neon Console using the Neon SQL Editor
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/tutorials
updatedOn: '2023-11-14T12:31:38.456Z'
---

The Neon SQL Editor allows you to run queries on your Neon databases directly from the Neon Console. In addition, the editor keeps a query history, permits saving queries, and provides [**Explain**](https://www.postgresql.org/docs/current/sql-explain.html) and [**Analyze**](https://www.postgresql.org/docs/current/using-explain.html#USING-EXPLAIN-ANALYZE) features.

<a id="query-via-ui/"></a>

To use the SQL Editor:

1. Navigate to the [Neon console](https://console.neon.tech/).
2. Select your project.
3. Select **SQL Editor**.
4. Select a branch and database.
5. Enter a query into the editor and click **Run** to view the results.

![Neon SQL Editor](/docs/get-started-with-neon/sql_editor.png)

You can use the following query to try the SQL Editor. The query creates a table, adds data, and retrieves the data from the table.

```sql
CREATE TABLE playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
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

You can rename or delete a saved query by selecting **Rename** or **Delete** from the kebab menu associated with the saved query.

## View the query history

The SQL Editor maintains a query history for the project. To view your query history, select **History** in the left pane of the SQL Editor. You can click an item in the **History** list to view the query that was run.

## Explain and Analyze

The Neon SQL Editor provides **Explain** and **Analyze** features.

- The **Explain** feature runs the specified query with the Postgres [EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html) command, which returns the execution plan for the query. The **Explain** feature only returns a plan with estimates. It does not execute the query.
- The **Analyze** feature runs the specified query with [EXPLAIN ANALYZE](https://www.postgresql.org/docs/current/using-explain.html#USING-EXPLAIN-ANALYZE). The `ANALYZE` parameter causes the query to be executed and returns actual row counts and run times for plan nodes along with the `EXPLAIN` estimates.

Understanding the information provided by the **Explain** and **Analyze** features requires familiarity with the Postgres [EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html) command and its `ANALYZE` parameter. Refer to the [EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html) documentation and the [Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) topic in the _PostgreSQL documentation_.

<NeedHelp/>

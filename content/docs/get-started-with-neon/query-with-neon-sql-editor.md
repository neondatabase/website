---
title: Query with Neon's SQL Editor
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/tutorials
---

<a id="query-via-ui/"></a>

To use the SQL Editor:

1. Navigate to the [Neon console](https://console.neon.tech/).
2. On the **Dashboard** tab, select your project from project drop-down list.
3. Select the **SQL Editor** tab.
4. Enter a query into the editor and click **Run** to view the results.

You can use the following queries to try the SQL Editor:

```sql
CREATE TABLE t (c int);
INSERT INTO t SELECT generate_series(1,100);
SELECT count(*) FROM t;
```

<Admonition type="note">
Running multiple query statements at once returns a separate result set for each statement. The result sets are displayed in separate tabs, numbered in order of execution.
</Admonition>

To clear the editor, click **New Query**.

## Saving queries

The SQL Editor allows you to save your queries.

To save a query:

1. Enter the query into the editor.
2. Click **Save** to open the **SAVE QUERY** dialog.
3. Enter a name for the query and click **Save**.

The query is added to the **Saved** list in the left pane of the SQL Editor. You can rerun a query by selecting it from the **Saved** list.

You can rename or delete a saved query by selecting **Rename** or **Delete** from the the kebab menu associated with the saved query.

## Viewing the query history

The SQL Editor maintains a query history for the project. To view your query history, select **History** in the left pane of the SQL Editor.

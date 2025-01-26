---
title: The pg_repack extension
subtitle: Remove bloat from your tables and indexes with minimal locking
enableTableOfContents: true
tag: new
updatedOn: '2025-01-24T20:21:15.308Z'
---

Postgres, like any database system, can accumulate bloat over time due to frequent updates and deletes. Bloat refers to wasted space within your tables and indexes, which can lead to decreased query performance and increased storage usage. `pg_repack` is a powerful Postgres extension that allows you to efficiently remove this bloat by rewriting tables and indexes online, with minimal locking. Unlike `VACUUM FULL` or `CLUSTER`, `pg_repack` avoids exclusive locks, ensuring your applications remain available during the reorganization process.

<CTA />

This guide provides an introduction to the `pg_repack` extension and how to leverage it within your Neon database. You’ll learn how to install and use `pg_repack` to reclaim disk space and improve database performance by removing bloat from your tables and indexes.

## Enable the `pg_repack` extension

`pg_repack` is currently available only on paid Neon plans. To install `pg_repack`, it must first be enabled by Neon support. [Open a support ticket](https://console.neon.tech/app/projects?modal=support) with your endpoint ID and database name to request it. After it's enabled by Neon Support, you need to [restart your compute](/docs/manage/endpoints#restart-a-compute) to apply the changes.

You can then enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS pg_repack;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Understanding `pg_repack` and bloat

Before using `pg_repack`, it's helpful to understand what causes bloat and how `pg_repack` addresses it.

### What is Bloat?

In Postgres, when rows in a table are updated or deleted, the space they occupied isn't immediately reclaimed. Instead, Postgres uses a mechanism called Multi-Version Concurrency Control (MVCC). While MVCC is essential for concurrency and transactional integrity, it can lead to **dead tuples** – outdated row versions that are no longer needed but still occupy space. Indexes also become bloated as they point to these dead tuples or become fragmented over time. This unused space is known as bloat.

### Why remove bloat?

Bloat can negatively impact your database in several ways:

- **Reduced query performance:** Postgres has to scan through bloated tables and indexes, increasing I/O operations and slowing down queries.
- **Increased storage usage:** Bloat consumes disk space, leading to higher storage costs in the long run, especially in a cloud environment like Neon.
- **Inefficient vacuuming:** While regular `VACUUM` helps, it doesn't fully reclaim space from bloat. `VACUUM FULL` does, but it requires an exclusive lock, causing downtime.

### How `pg_repack` works

`pg_repack` provides an online solution to defragment tables and indexes. It works by creating a new copy of the table and indexes, efficiently copying data from the original table to the new one, and then atomically replacing the old table with the new one.

Key features of `pg_repack` include:

- **Online operation:** It operates without requiring exclusive locks for most of the process, minimizing downtime.
- **Minimal locking:** Only short `ACCESS EXCLUSIVE` locks are needed at the beginning and end of the repack process.
- **Bloat removal:** Effectively removes bloat from both tables and indexes, reclaiming disk space and improving performance.
- **Reordering options:** Allows you to optionally reorder table rows based on a clustered index or specified columns, further optimizing data access.
- **Index repack:** You can repack indexes independently of the table, which can be useful for index-specific bloat issues.

<Admonition type="important">
`pg_repack` requires the target table to have a `PRIMARY KEY` or at least a `UNIQUE` index on a `NOT NULL` column. Ensure your table meets this requirement before running `pg_repack`.
</Admonition>

## Understanding `pg_repack` Syntax

While `psql` allows you to run commands directly within the SQL environment, `pg_repack` is a command-line tool that you execute from your terminal. If you haven't installed it yet, you'll find installation instructions on the [pg_repack GitHub repository](https://reorg.github.io/pg_repack/#download). The general syntax is as follows:

<Admonition type="note">
Make sure to install the correct version of `pg_repack` that is being used in your Neon environment. Currently, Neon uses `pg_repack` version 1.5.2
</Admonition>

```bash
pg_repack [OPTIONS]... [DBNAME]
```

Let's break down the key components:

- **`pg_repack`**: This is the command itself, invoking the `pg_repack` executable. Ensure that `pg_repack` is installed and accessible in your system's `PATH`.
- **`[OPTIONS]...`**: These are command-line options that modify the behavior of `pg_repack`. Options are typically provided in the format `--option-name=value` or `-short-option value`. You can specify multiple options to customize the repack operation.
- **`[DBNAME]`**: This is the name of the Postgres database you want to connect to. You can also specify the database connection details using connection options (see below), in which case you might omit `DBNAME` here.

### Common `pg_repack` options

`pg_repack` offers a variety of options to control its behavior. Here are some of the most commonly used options:

### Reorganization options

- **`-t TABLE`, `--table=TABLE`**: Specifies the table to be reorganized. You can reorganize multiple tables by using this option multiple times (e.g., `-t table1 -t table2`). By default, all eligible tables in the target databases are reorganized.
- **`-I TABLE`, `--parent-table=TABLE`**: Reorganize both the specified table(s) and its inheritors.
- **`-c SCHEMA`, `--schema=SCHEMA`**: Repacks all eligible tables within the specified schema(s).
- **`-o COLUMNS [,...]`, `--order-by=COLUMNS [,...]`**: Reorders the table rows based on the specified column(s). This performs an online `CLUSTER`.
- **`-n`, `--no-order`**: Performs an online `VACUUM FULL` instead of a `CLUSTER` operation, even for clustered tables. This is the default for non-clustered tables since `pg_repack` 1.2.
- **`-x`, `--only-indexes`**: Repacks only the indexes of the specified table(s). Requires using `-t` or `-I` to specify the target table.
- **`-i INDEX`, `--index=INDEX`**: Repacks only the specified index. You can specify multiple indexes with multiple `-i` options.
- **`-j NUM`, `--jobs=NUM`**: Uses multiple parallel jobs (connections) to speed up index rebuilding. Useful for servers with multiple CPU cores and sufficient I/O capacity.
- **`-N`, `--dry-run`**: Performs a "dry run," listing the actions `pg_repack` _would_ take without actually executing them. Useful for previewing the operation.
- **`-Z`, `--no-analyze`**: Skips running `ANALYZE` on the repacked table(s) at the end of the process. By default, `pg_repack` runs `ANALYZE`.
- **`-k`, `--no-superuser-check`**: **Crucially important for Neon!** Skips the superuser check. You must use this option when running `pg_repack` against Neon, as Neon users are not superusers.

### Connection options

These options specify how `pg_repack` connects to your database. You can often omit the `DBNAME` from the main command if you provide these connection options.

- **`-d DBNAME`, `--dbname=DBNAME`**: Specifies the database name to connect to.
- **`-h HOSTNAME`, `--host=HOSTNAME`**: Specifies the hostname of your Neon endpoint. You can find this in your Neon **Connection Details**.
- **`-p PORT`, `--port=PORT`**: Specifies the port. For Neon, this is always `5432`.
- **`-U USERNAME`, `--username=USERNAME`**: Specifies your Neon username. You can find this in your Neon **Connection Details**.
- **`-W`, `--password`**: Forces `pg_repack` to prompt for your password.

### Generic options

- **`-e`, `--echo`**: Prints the SQL commands executed by `pg_repack` to the terminal. Useful for debugging or understanding the process.
- **`-E LEVEL`, `--elevel=LEVEL`**: Sets the output message level (e.g., `DEBUG`, `INFO`, `WARNING`, `ERROR`). Defaults to `INFO`.
- `--help`: Displays help information about `pg_repack` and its options.
- `--version`: Displays the version of `pg_repack`.

## Key use cases for `pg_repack`

`pg_repack` is a versatile tool that can address various performance and maintenance challenges. Here are some common use cases where `pg_repack` can be beneficial:

### Reclaim space from bloated tables

    Over time, tables can accumulate bloat from updates and deletes, wasting storage and impacting performance. `pg_repack` rewrites tables to remove dead rows and reclaim unused space, similar to `VACUUM FULL`, but crucially, **without blocking write operations**. This is essential for maintaining application availability.

    ```bash
    -- Repack a single table (performs online VACUUM FULL)
    pg_repack --no-order --table orders;
    ```

### Reorder data by an index for optimized queries

    If you frequently query your data based on a specific index, physically reordering the table rows according to that index can significantly improve query performance. This is similar to the `CLUSTER` command, but `pg_repack` performs this reordering **online**, minimizing disruption.

    ```bash
    -- Reorder the 'orders' table by 'order_date' in descending order
    pg_repack --table orders --order-by "order_date DESC";
    ```

### Rebuild indexes online to improve scan performance

    Indexes can become fragmented over time, leading to less efficient index scans. `pg_repack` can rebuild indexes **online**, creating fresh, optimized indexes to improve query performance without locking the table for writes.

    ```bash
    -- Rebuild all indexes of the 'orders' table
    pg_repack --table orders --only-indexes;
    ```

### Example syntax

Here are a few examples of how to use `pg_repack` with different options:

### Basic repack of a table

    ```bash shouldWrap
    pg_repack -k -h <your_neon_host> -p 5432 -d <your_neon_database> -U <your_neon_username> --table your_table_name
    ```

### Reordering a table by a column

    ```bash shouldWrap
    pg_repack -k -h <your_neon_host> -p 5432 -d <your_neon_database> -U <your_neon_username> --table your_table_name --order-by "indexed_column DESC"
    ```

### Repacking only indexes of a table

    ```bash shouldWrap
    pg_repack -k -h <your_neon_host> -p 5432 -d <your_neon_database> -U <your_neon_username> --table your_table_name --only-indexes
    ```

### Dry run to preview repack operations

    ```bash shouldWrap
    pg_repack -k -N -h <your_neon_host> -p 5432 -d <your_neon_database> -U <your_neon_username> --table your_table_name
    ```

## Using `pg_repack` to reorganize tables

Let's walk through a practical example of using `pg_repack` to reorganize a table in your Neon database.

### Connect to your Neon Database

Ensure you are connected to your Neon database using [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor). You can find your connection details in the **Connection Details** widget on the **Neon Console**

### Create a sample table with bloat (Optional)

For demonstration purposes, let's create a sample table and introduce some bloat. If you already have a table you want to repack, you can skip this step.

```sql
CREATE TABLE public.bloated_table (
    id SERIAL PRIMARY KEY,
    data TEXT
);

-- Insert some initial data
INSERT INTO public.bloated_table (data)
SELECT md5(random()::text)
FROM generate_series(1, 100000);

-- Delete a significant portion of the data to simulate bloat
DELETE FROM public.bloated_table WHERE id % 2 = 0;
```

### Verify table size before `pg_repack`

Let's check the size of the table before running `pg_repack`. You can use the `\dt+` command in `psql` or query `pg_relation_size` in SQL.

In `psql`:

```psql
\dt+ bloated_table
```

Or in SQL:

```sql
SELECT pg_size_pretty(pg_relation_size('bloated_table'));
```

Note the size of the table before repack.

### Run `pg_repack`

Now, execute the `pg_repack` command from your terminal

```bash shouldWrap
pg_repack -k -h <your_neon_host> -p 5432 -d <your_neon_database> -U <your_neon_username> --table bloated_table
```

Replace the placeholders with your Neon connection details.

- `-h <your_neon_host>`: Your Neon hostname.
- `-p 5432`: The port (always 5432 for Neon Postgres).
- `-d <your_neon_database>`: Your Neon database name.
- `-U <your_neon_username>`: Your Neon username.
- `--table bloated_table`: Specifies the table to repack.

You will be prompted to enter your Neon password after running the command.

### Verify table size after `pg_repack`

After `pg_repack` completes successfully, check the table size again using the same command as before.
You should observe a reduction in the table size, indicating that `pg_repack` has successfully removed bloat.

**Example Output (Size Reduction)**

Before `pg_repack`:

```text
 Schema |      Name       | Type  |    Owner     | Persistence | Access method |   Size   | Description
--------+-----------------+-------+--------------+-------------+---------------+----------+-------------
 public | bloated_table   | table | neondb_owner | permanent   | heap          | 8192 kB  |
(1 row)
```

After `pg_repack`:

```text
 Schema |      Name       | Type  |    Owner     | Persistence | Access method |   Size   | Description
--------+-----------------+-------+--------------+-------------+---------------+----------+-------------
 public | bloated_table   | table | neondb_owner | permanent   | heap          | 4096 kB  |
(1 row)
```

In this example, the table size was reduced from 8MB to 4MB after running `pg_repack`. The actual size reduction will depend on the amount of bloat present in your table.

## Best Practices and Considerations

While `pg_repack` generally works seamlessly with Neon, here are a few things to keep in mind:

- **`-k` / `--no-superuser-check` flag:** Always use the `-k` / `--no-superuser-check` flag when running `pg_repack` against your Neon database.
- **Disk space:** `pg_repack` requires temporary disk space roughly double the size of the table being repacked. Ensure you have sufficient storage for your Neon Project.
- **Resource usage:** While `pg_repack` is designed to be online, it does consume resources (CPU, I/O) during operation. Consider running it during off-peak hours for very resource-intensive operations, especially on production databases.

## Conclusion

`pg_repack` is an invaluable tool for maintaining the health and performance of your Neon Postgres database. By enabling you to remove bloat online and with minimal locking, it helps ensure your database remains efficient, responsive, and cost-effective. Regularly using `pg_repack`, especially on tables with frequent updates and deletes, can help you reclaim disk space, improve query performance, and optimize your database.

## References

- [pg_repack GitHub Repository](https://github.com/reorg/pg_repack)
- [pg_repack Documentation on PGXN](https://pgxn.org/dist/pg_repack/)
- [Investigating Postgres Query Performance](https://neon.tech/blog/postgres-support-recap-investigating-postgres-query-performance)

<NeedHelp/>

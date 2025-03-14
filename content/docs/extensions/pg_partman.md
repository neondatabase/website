---
title: The pg_partman extension
subtitle: Manage large Postgres tables using the PostgreSQL Partition Manager extension
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.370Z'
---

`pg_partman` is a Postgres extension that simplifies the management of partitioned tables. Partitioning refers to splitting a single table into smaller pieces called `partitions`. This is done based on the values in a key column or set of columns. Even though partitions are stored as separate physical tables, the partitioned table can still be queried as a single logical table. This can significantly enhance query performance and also help you manage the data lifecycle of tables that grow very large.

While Postgres natively supports partitioning a table, `pg_partman` helps set up and manage partitioned tables:

- **Automated partition creation**: `pg_partman` automatically creates new partitions as new records are inserted, based on a specified interval for the partition key.
- **Automated maintenance**: `pg_partman` bundles a background worker process that manages maintenance tasks without needing an external scheduler or cron job. For example, it can automatically detach old partitions from the main table based on a retention policy, run `analyze` on partitions to update statistics, and more.

<CTA />

In this guide, we’ll learn how to set up and use the `pg_partman` extension with your Neon Postgres project. We'll cover why partitioning is helpful, how to enable `pg_partman`, creating partitioned tables, and automating partition maintenance.

<Admonition type="note">
`pg_partman` is an open-source Postgres extension that can be installed in any Neon project using the instructions below. Detailed installation instructions and compatibility information can be found in the [pg_partman](https://github.com/pgpartman/pg_partman) documentation.
</Admonition>

## Enable the `pg_partman` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon. Creatig a `partman` schema is optional (but recommended) and you can name the schema whatever you like, but it cannot be changed after installation.

```sql
CREATE SCHEMA partman;
CREATE EXTENSION pg_partman SCHEMA partman;
```

The `pg_partman` extension does not require a superuser to run, but it's recommended to create a dedicated role for running `pg_partman` functions and to act as the owner of all partition sets that `pg_partman` will maintain.

Here is a sample SQL script to create a dedicated role with the minimum required privileges, assuming that `pg_partman` is installed to the `partman` schema and the dedicated role is named `partman_user`:

```sql
CREATE ROLE partman_user WITH LOGIN;
ALTER ROLE partman_user WITH PASSWORD '{PASSWORD_FOR_PARTMAN_USER}';

GRANT ALL ON SCHEMA partman TO partman_user;
GRANT ALL ON ALL TABLES IN SCHEMA partman TO partman_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA partman TO partman_user;
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA partman TO partman_user;
GRANT ALL ON SCHEMA '{WORKING_SCHEMA_NAME}' TO partman_user;
GRANT TEMPORARY ON DATABASE '{WORKING_DATABASE_NAME}' to partman_user; -- allow creation of temp tables to move data out of default
```

If the role needs to create schemas, you'll have to grant `CREATE` on the database as well. This is only required if you give the role above the `CREATE` privilege on pre-existing schemas that will contain partition sets.

```sql
GRANT CREATE ON DATABASE '{WORKING_DATABASE_NAME}' TO partman_user;
```

When you create a new `Neon` project, the default database name is `neondb` and the default schema name is `public`. Replace `{WORKING_DATABASE_NAME}` and `{WORKING_SCHEMA_NAME}` with the actual database and schema names you want to manage the partitioned tables in. To find out more about the privileges needed to run `pg_partman`, refer to the [pg_partman documentation](https://github.com/pgpartman/pg_partman).

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

**Version Compatibility:**

`pg_partman` works with Postgres 14 and above, complementing the native partitioning features introduced in these versions.

## Why partition your data?

For tables that grow very large, partitioning offers several benefits:

- **Faster queries:** Partitioning allows Postgres to quickly locate and retrieve data within a specific partition, rather than scanning the entire table.
- **Scalability:** Partitioning makes database administration simpler. For example, smaller partitions are easier to load and delete or back up and recover.
- **Managing the data lifecycle:** Easier management of the data lifecycle by archiving or purging old partitions, which can be moved to cheaper storage options without affecting the active dataset.

### Native partitioning vs pg_partman

Postgres supports partitioning tables natively, with the following strategies to divide the data:

- **List partitioning**: Data is distributed across partitions based on a list of values, such as a category or location.
- **Range partitioning**: Data is distributed across partitions based on ranges of values, such as dates or numerical ranges.

With native partitioning, you need to manually create and manage partitions for your table.

```sql
CREATE TABLE measurement (
    city_id         int not null,
    logdate         date not null,
    peaktemp        int
) PARTITION BY RANGE (logdate);

-- Create a partition for each month of logged data.
-- Records with `logdate` in this range are automatically routed to this partition table
CREATE TABLE measurement_y2006m02 PARTITION OF measurement
    FOR VALUES FROM ('2006-02-01') TO ('2006-03-01');

-- Moving older data to a different table.
-- Queries against the main table will not include the data in the detached partition
ALTER TABLE measurement DETACH PARTITION measurement_y2005m10;
```

`pg_partman` supports creating partitions that are number or time-based, with each partition covering a range of values. It is particularly useful when partitions need to be created automatically as new records come in. So, list partitioning isn't applicable since the partition key values are not known in advance.

## Example: Partitioning user-activity data

Consider a social media platform that tracks user interactions in their website application, such as likes, comments, and shares. The data is stored in a table called `user_activities`, where `activity_type` stores the type of activity and the other columns store additional information about the activity.

### Setting up a new partitioned table

Given the large volume of data generated by user interactions, partitioning the `user_activities` table can help keep queries manageable. Recent activity data is typically the most interesting for both the platform and its users, so `activity_time` is a good candidate to partition on.

We can create the partitioned table using the following SQL statement, similar to defining a native partitioned table:

```sql
CREATE TABLE user_activities (
    activity_id serial,
    activity_time TIMESTAMPTZ NOT NULL,
    activity_type TEXT NOT NULL,
    content_id INT NOT NULL,
    user_id INT NOT NULL
)
PARTITION BY RANGE (activity_time);
```

To create a partition for each week of activity data, you can run the following query:

```sql
SELECT create_parent('public.user_activities', 'activity_time', '1 week');
```

This will create a new partition for each week of data in the `user_activities` table. We can insert some sample data into the table:

```sql
INSERT INTO user_activities (activity_time, activity_type, content_id, user_id)
VALUES
    ('2024-03-15 10:00:00', 'like', 1001, 101),
    ('2024-03-16 15:30:00', 'comment', 1002, 102),
    ('2024-03-17 09:45:00', 'share', 1003, 103),
    ('2024-03-18 18:20:00', 'like', 1004, 104),
    ('2024-03-19 12:10:00', 'comment', 1005, 105),
    ('2024-03-20 08:00:00', 'like', 1006, 106),
    ('2024-03-21 14:15:00', 'share', 1007, 107),
    ('2024-03-22 11:30:00', 'like', 1008, 108),
    ('2024-03-23 16:45:00', 'comment', 1009, 109),
    ('2024-03-24 20:00:00', 'share', 1010, 110),
    ('2024-03-25 09:30:00', 'like', 1011, 111),
    ('2024-03-26 13:45:00', 'comment', 1012, 112),
    ('2024-03-27 17:00:00', 'share', 1013, 113),
    ('2024-03-28 11:15:00', 'like', 1014, 114),
    ('2024-03-29 15:30:00', 'comment', 1015, 115);
```

### Querying partitioned tables

We can query against the `user_activities` table as if it were a single table, and Postgres will automatically route the query to the correct partition(s) based on the `activity_time` column.

```sql
SELECT * FROM user_activities WHERE activity_time BETWEEN '2024-03-20' AND '2024-03-25';
```

This query returns the following results:

```text
 activity_id |     activity_time      | activity_type | content_id | user_id
-------------+------------------------+---------------+------------+---------
          16 | 2024-03-20 08:00:00+00 | like          |       1006 |     106
          17 | 2024-03-21 14:15:00+00 | share         |       1007 |     107
          18 | 2024-03-22 11:30:00+00 | like          |       1008 |     108
          19 | 2024-03-23 16:45:00+00 | comment       |       1009 |     109
          20 | 2024-03-24 20:00:00+00 | share         |       1010 |     110
(5 rows)
```

To see the list of all partitions created for the `user_activities` table, you can run the following query:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'user_activities_%';
```

This will return the following results:

```text
        table_name
---------------------------
 user_activities_p20240329
 user_activities_p20240405
 user_activities_p20240315
 user_activities_p20240322
 user_activities_p20240412
 user_activities_p20240419
 user_activities_p20240426
 user_activities_default
 user_activities_p20240301
 user_activities_p20240308
(10 rows)
```

`pg_partman` automatically created tables for weekly intervals close to the current data. As more data is inserted, it will create new partitions. Additionally, there is a `user_activities_default` table that stores data that doesn't fit into any of the existing partitions.

### Data retention policies

To make sure that old data is automatically removed from the main table, you can set up a retention policy:

```sql
UPDATE part_config
SET retention = '4 weeks', retention_keep_table = true
WHERE parent_table = 'public.user_activities';
```

The background worker process that comes bundled with `pg_partman` automatically detaches the old partitions that are older than 4 weeks from the main table. Since we've set `retention_keep_table` to `true`, the old partitions are kept as separate tables, and not dropped from the database.

## Additional considerations

### Partitioning an existing table with `pg_partman`

If you have an existing table that you want to partition, you can use `pg_partman` for it. However, it isn't straightforward since it can't be directly altered into the parent table for a partition set. Instead, you need to create a new partitioned table and copy the data from the existing table into the new partitioned table.

We describe the `offline` method here, where queries to the existing table are stopped while the data is being copied over to the new partitioned table. It is also possible to achieve this while keeping the existing table operational, but it involves more complex steps. For more details, refer to the [pg_partman documentation](https://github.com/pgpartman/pg_partman/blob/master/doc/pg_partman_howto.md).

#### Example: Partitioning an existing table

To illustrate, we recreate the `test_user_activities` table from the previous example but without specifying partitioning:

```sql
CREATE TABLE public.test_user_activities (
  activity_id serial,
  activity_time TIMESTAMPTZ NOT NULL,
  activity_type TEXT NOT NULL,
  content_id INT NOT NULL,
  user_id INT NOT NULL
);

INSERT INTO test_user_activities (activity_time, activity_type, content_id, user_id)
VALUES
    ('2024-03-15 10:00:00', 'like', 1001, 101),
    ('2024-03-16 15:30:00', 'comment', 1002, 102),
    ('2024-03-17 09:45:00', 'share', 1003, 103),
    ('2024-03-18 18:20:00', 'like', 1004, 104),
    ('2024-03-19 12:10:00', 'comment', 1005, 105),
    ('2024-03-20 08:00:00', 'like', 1006, 106),
    ('2024-03-21 14:15:00', 'share', 1007, 107),
    ('2024-03-22 11:30:00', 'like', 1008, 108),
    ('2024-03-23 16:45:00', 'comment', 1009, 109),
    ('2024-03-24 20:00:00', 'share', 1010, 110),
    ('2024-03-25 09:30:00', 'like', 1011, 111),
    ('2024-03-26 13:45:00', 'comment', 1012, 112),
    ('2024-03-27 17:00:00', 'share', 1013, 113),
    ('2024-03-28 11:15:00', 'like', 1014, 114),
    ('2024-03-29 15:30:00', 'comment', 1015, 115);
```

Now, we'll partition the existing `test_user_activities` table using `pg_partman`.

1. Rename the original table so that the partitioned table can be created with the original table's name:

```sql
ALTER TABLE public.test_user_activities RENAME TO old_user_activities;
```

2. Create a new table with the same name as the original table, but with partitioning enabled:

```sql
CREATE TABLE public.test_user_activities (
  activity_id serial,
  activity_time TIMESTAMPTZ NOT NULL,
  activity_type TEXT NOT NULL,
  content_id INT NOT NULL,
  user_id INT NOT NULL
)
PARTITION BY RANGE (activity_time);
```

We were using a `SERIAL` column for `activity_id` in the original table. If you want to keep the same sequence for the new table, you can set the sequence value to the last value of the original table:

```sql
SELECT setval('public.test_user_activities_activity_id_seq', (SELECT MAX(activity_id) FROM public.old_user_activities));
```

In general, we also need to ensure other properties from the old table, such as privileges, constraints, defaults, indexes, etc. are also applied to the new table.

3. Use the `create_parent()` function provided by `pg_partman` to set up partitioning on the new table:

```sql
SELECT partman.create_parent(
  p_parent_table := 'public.test_user_activities',
  p_control := 'activity_time',
  p_interval := '1 week'
);
```

4. Now, to we can migrate data from the old table to the new partitioned table in smaller batches:

```sql
CALL partman.partition_data_proc(
  p_parent_table := 'public.test_user_activities',
  p_loop_count := 200,
  p_interval := '1 day',
  p_source_table := 'public.old_user_activities'
);
```

This will move the data from `old_user_activities` to the new `test_user_activities` table in daily intervals, committing after each batch. The `p_interval` parameter specifies the interval of values to select in each batch, and `p_loop_count` specifies the total number of batches to move.

5. After the data migration is complete, the old table should be empty, and the new partitioned table should contain all the data and child tables. You can verify this by counting the number of rows in both the tables:

```sql
SELECT COUNT(*) FROM public.test_user_activities
UNION ALL
SELECT COUNT(*) FROM public.old_user_activities;
```

This should return 15 and 0 rows, respectively.

6. Finally, run `VACUUM ANALYZE` on the new partitioned table to update statistics:

```sql
VACUUM ANALYZE public.test_user_activities;
```

The `test_user_activities` table is now successfully partitioned using `pg_partman`, with the data migrated from the old table to the new partitioned structure.

### Uniqueness constraints for partitioned tables

This section applies to partitioned tables created natively in Postgres, as well as those created using `pg_partman`.

Postgres doesn't support indexes or unique constraints that span multiple tables. Since a partitioned table is made up of multiple physical tables, you can't create a unique constraint that spans all the partitions. For example, the following query will fail:

```sql
ALTER TABLE user_activities ADD CONSTRAINT unique_activity UNIQUE (activity_id);
```

It returns the following error:

```text
ERROR:  unique constraint on partitioned table must include all partitioning columns
DETAIL:  UNIQUE constraint on table "user_activities" lacks column "activity_time" which is part of the partition key.
```

However, when the unique constraint involves partition key columns, Postgres can guarantee uniqueness across all partitions. In this way, different partitions cannot share the same values for the partition key columns, which allows unique constraints to be enforced.

For example, including the `activity_time` column in the unique constraint will work because `activity_time` is a partition key column:

```sql
ALTER TABLE user_activities ADD CONSTRAINT unique_activity UNIQUE (activity_id, activity_time);
```

## Conclusion

By leveraging `pg_partman`, you can significantly enhance the native partitioning functionality of Postgres, particularly for large-scale and time-series datasets. The extension simplifies partition management, automates retention and archival tasks, and improves query performance.

## Reference

- [pg_partman Documentation](https://github.com/pgpartman/pg_partman)
- [PostgreSQL Partitioning Documentation](https://www.postgresql.org/docs/current/ddl-partitioning.html)

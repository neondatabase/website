[#id](#LOGICAL-REPLICATION-ROW-FILTER)

## 31.3. Row Filters [#](#LOGICAL-REPLICATION-ROW-FILTER)

- [31.3.1. Row Filter Rules](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-RULES)
- [31.3.2. Expression Restrictions](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-RESTRICTIONS)
- [31.3.3. UPDATE Transformations](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-TRANSFORMATIONS)
- [31.3.4. Partitioned Tables](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-PARTITIONED-TABLE)
- [31.3.5. Initial Data Synchronization](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-INITIAL-DATA-SYNC)
- [31.3.6. Combining Multiple Row Filters](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-COMBINING)
- [31.3.7. Examples](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-EXAMPLES)

By default, all data from all published tables will be replicated to the appropriate subscribers. The replicated data can be reduced by using a _row filter_. A user might choose to use row filters for behavioral, security or performance reasons. If a published table sets a row filter, a row is replicated only if its data satisfies the row filter expression. This allows a set of tables to be partially replicated. The row filter is defined per table. Use a `WHERE` clause after the table name for each published table that requires data to be filtered out. The `WHERE` clause must be enclosed by parentheses. See [CREATE PUBLICATION](sql-createpublication) for details.

[#id](#LOGICAL-REPLICATION-ROW-FILTER-RULES)

### 31.3.1. Row Filter Rules [#](#LOGICAL-REPLICATION-ROW-FILTER-RULES)

Row filters are applied _before_ publishing the changes. If the row filter evaluates to `false` or `NULL` then the row is not replicated. The `WHERE` clause expression is evaluated with the same role used for the replication connection (i.e. the role specified in the [`CONNECTION`](sql-createsubscription#SQL-CREATESUBSCRIPTION-CONNECTION) clause of the [CREATE SUBSCRIPTION](sql-createsubscription)). Row filters have no effect for `TRUNCATE` command.

[#id](#LOGICAL-REPLICATION-ROW-FILTER-RESTRICTIONS)

### 31.3.2. Expression Restrictions [#](#LOGICAL-REPLICATION-ROW-FILTER-RESTRICTIONS)

The `WHERE` clause allows only simple expressions. It cannot contain user-defined functions, operators, types, and collations, system column references or non-immutable built-in functions.

If a publication publishes `UPDATE` or `DELETE` operations, the row filter `WHERE` clause must contain only columns that are covered by the replica identity (see [`REPLICA IDENTITY`](sql-altertable#SQL-ALTERTABLE-REPLICA-IDENTITY)). If a publication publishes only `INSERT` operations, the row filter `WHERE` clause can use any column.

[#id](#LOGICAL-REPLICATION-ROW-FILTER-TRANSFORMATIONS)

### 31.3.3. UPDATE Transformations [#](#LOGICAL-REPLICATION-ROW-FILTER-TRANSFORMATIONS)

Whenever an `UPDATE` is processed, the row filter expression is evaluated for both the old and new row (i.e. using the data before and after the update). If both evaluations are `true`, it replicates the `UPDATE` change. If both evaluations are `false`, it doesn't replicate the change. If only one of the old/new rows matches the row filter expression, the `UPDATE` is transformed to `INSERT` or `DELETE`, to avoid any data inconsistency. The row on the subscriber should reflect what is defined by the row filter expression on the publisher.

If the old row satisfies the row filter expression (it was sent to the subscriber) but the new row doesn't, then, from a data consistency perspective the old row should be removed from the subscriber. So the `UPDATE` is transformed into a `DELETE`.

If the old row doesn't satisfy the row filter expression (it wasn't sent to the subscriber) but the new row does, then, from a data consistency perspective the new row should be added to the subscriber. So the `UPDATE` is transformed into an `INSERT`.

[Table 31.1](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-TRANSFORMATIONS-SUMMARY) summarizes the applied transformations.

[#id](#LOGICAL-REPLICATION-ROW-FILTER-TRANSFORMATIONS-SUMMARY)

**Table 31.1. `UPDATE` Transformation Summary**

| Old row  | New row  | Transformation  |
| -------- | -------- | --------------- |
| no match | no match | don't replicate |
| no match | match    | `INSERT`        |
| match    | no match | `DELETE`        |
| match    | match    | `UPDATE`        |

[#id](#LOGICAL-REPLICATION-ROW-FILTER-PARTITIONED-TABLE)

### 31.3.4. Partitioned Tables [#](#LOGICAL-REPLICATION-ROW-FILTER-PARTITIONED-TABLE)

If the publication contains a partitioned table, the publication parameter [`publish_via_partition_root`](sql-createpublication#SQL-CREATEPUBLICATION-WITH-PUBLISH-VIA-PARTITION-ROOT) determines which row filter is used. If `publish_via_partition_root` is `true`, the _root partitioned table's_ row filter is used. Otherwise, if `publish_via_partition_root` is `false` (default), each _partition's_ row filter is used.

[#id](#LOGICAL-REPLICATION-ROW-FILTER-INITIAL-DATA-SYNC)

### 31.3.5. Initial Data Synchronization [#](#LOGICAL-REPLICATION-ROW-FILTER-INITIAL-DATA-SYNC)

If the subscription requires copying pre-existing table data and a publication contains `WHERE` clauses, only data that satisfies the row filter expressions is copied to the subscriber.

If the subscription has several publications in which a table has been published with different `WHERE` clauses, rows that satisfy _any_ of the expressions will be copied. See [Section 31.3.6](logical-replication-row-filter#LOGICAL-REPLICATION-ROW-FILTER-COMBINING) for details.

### Warning

Because initial data synchronization does not take into account the [`publish`](sql-createpublication#SQL-CREATEPUBLICATION-WITH-PUBLISH) parameter when copying existing table data, some rows may be copied that would not be replicated using DML. Refer to [Section 31.7.1](logical-replication-architecture#LOGICAL-REPLICATION-SNAPSHOT), and see [Section 31.2.2](logical-replication-subscription#LOGICAL-REPLICATION-SUBSCRIPTION-EXAMPLES) for examples.

### Note

If the subscriber is in a release prior to 15, copy pre-existing data doesn't use row filters even if they are defined in the publication. This is because old releases can only copy the entire table data.

[#id](#LOGICAL-REPLICATION-ROW-FILTER-COMBINING)

### 31.3.6. Combining Multiple Row Filters [#](#LOGICAL-REPLICATION-ROW-FILTER-COMBINING)

If the subscription has several publications in which the same table has been published with different row filters (for the same [`publish`](sql-createpublication#SQL-CREATEPUBLICATION-WITH-PUBLISH) operation), those expressions get ORed together, so that rows satisfying _any_ of the expressions will be replicated. This means all the other row filters for the same table become redundant if:

- One of the publications has no row filter.

- One of the publications was created using [`FOR ALL TABLES`](sql-createpublication#SQL-CREATEPUBLICATION-FOR-ALL-TABLES). This clause does not allow row filters.

- One of the publications was created using [`FOR TABLES IN SCHEMA`](sql-createpublication#SQL-CREATEPUBLICATION-FOR-TABLES-IN-SCHEMA) and the table belongs to the referred schema. This clause does not allow row filters.

[#id](#LOGICAL-REPLICATION-ROW-FILTER-EXAMPLES)

### 31.3.7. Examples [#](#LOGICAL-REPLICATION-ROW-FILTER-EXAMPLES)

Create some tables to be used in the following examples.

```
test_pub=# CREATE TABLE t1(a int, b int, c text, PRIMARY KEY(a,c));
CREATE TABLE
test_pub=# CREATE TABLE t2(d int, e int, f int, PRIMARY KEY(d));
CREATE TABLE
test_pub=# CREATE TABLE t3(g int, h int, i int, PRIMARY KEY(g));
CREATE TABLE
```

Create some publications. Publication `p1` has one table (`t1`) and that table has a row filter. Publication `p2` has two tables. Table `t1` has no row filter, and table `t2` has a row filter. Publication `p3` has two tables, and both of them have a row filter.

```
test_pub=# CREATE PUBLICATION p1 FOR TABLE t1 WHERE (a > 5 AND c = 'NSW');
CREATE PUBLICATION
test_pub=# CREATE PUBLICATION p2 FOR TABLE t1, t2 WHERE (e = 99);
CREATE PUBLICATION
test_pub=# CREATE PUBLICATION p3 FOR TABLE t2 WHERE (d = 10), t3 WHERE (g = 10);
CREATE PUBLICATION
```

`psql` can be used to show the row filter expressions (if defined) for each publication.

```
test_pub=# \dRp+
                               Publication p1
  Owner   | All tables | Inserts | Updates | Deletes | Truncates | Via root
----------+------------+---------+---------+---------+-----------+----------
 postgres | f          | t       | t       | t       | t         | f
Tables:
    "public.t1" WHERE ((a > 5) AND (c = 'NSW'::text))

                               Publication p2
  Owner   | All tables | Inserts | Updates | Deletes | Truncates | Via root
----------+------------+---------+---------+---------+-----------+----------
 postgres | f          | t       | t       | t       | t         | f
Tables:
    "public.t1"
    "public.t2" WHERE (e = 99)

                               Publication p3
  Owner   | All tables | Inserts | Updates | Deletes | Truncates | Via root
----------+------------+---------+---------+---------+-----------+----------
 postgres | f          | t       | t       | t       | t         | f
Tables:
    "public.t2" WHERE (d = 10)
    "public.t3" WHERE (g = 10)
```

`psql` can be used to show the row filter expressions (if defined) for each table. See that table `t1` is a member of two publications, but has a row filter only in `p1`. See that table `t2` is a member of two publications, and has a different row filter in each of them.

```
test_pub=# \d t1
                 Table "public.t1"
 Column |  Type   | Collation | Nullable | Default
--------+---------+-----------+----------+---------
 a      | integer |           | not null |
 b      | integer |           |          |
 c      | text    |           | not null |
Indexes:
    "t1_pkey" PRIMARY KEY, btree (a, c)
Publications:
    "p1" WHERE ((a > 5) AND (c = 'NSW'::text))
    "p2"

test_pub=# \d t2
                 Table "public.t2"
 Column |  Type   | Collation | Nullable | Default
--------+---------+-----------+----------+---------
 d      | integer |           | not null |
 e      | integer |           |          |
 f      | integer |           |          |
Indexes:
    "t2_pkey" PRIMARY KEY, btree (d)
Publications:
    "p2" WHERE (e = 99)
    "p3" WHERE (d = 10)

test_pub=# \d t3
                 Table "public.t3"
 Column |  Type   | Collation | Nullable | Default
--------+---------+-----------+----------+---------
 g      | integer |           | not null |
 h      | integer |           |          |
 i      | integer |           |          |
Indexes:
    "t3_pkey" PRIMARY KEY, btree (g)
Publications:
    "p3" WHERE (g = 10)
```

On the subscriber node, create a table `t1` with the same definition as the one on the publisher, and also create the subscription `s1` that subscribes to the publication `p1`.

```
test_sub=# CREATE TABLE t1(a int, b int, c text, PRIMARY KEY(a,c));
CREATE TABLE
test_sub=# CREATE SUBSCRIPTION s1
test_sub-# CONNECTION 'host=localhost dbname=test_pub application_name=s1'
test_sub-# PUBLICATION p1;
CREATE SUBSCRIPTION
```

Insert some rows. Only the rows satisfying the `t1 WHERE` clause of publication `p1` are replicated.

```
test_pub=# INSERT INTO t1 VALUES (2, 102, 'NSW');
INSERT 0 1
test_pub=# INSERT INTO t1 VALUES (3, 103, 'QLD');
INSERT 0 1
test_pub=# INSERT INTO t1 VALUES (4, 104, 'VIC');
INSERT 0 1
test_pub=# INSERT INTO t1 VALUES (5, 105, 'ACT');
INSERT 0 1
test_pub=# INSERT INTO t1 VALUES (6, 106, 'NSW');
INSERT 0 1
test_pub=# INSERT INTO t1 VALUES (7, 107, 'NT');
INSERT 0 1
test_pub=# INSERT INTO t1 VALUES (8, 108, 'QLD');
INSERT 0 1
test_pub=# INSERT INTO t1 VALUES (9, 109, 'NSW');
INSERT 0 1

test_pub=# SELECT * FROM t1;
 a |  b  |  c
---+-----+-----
 2 | 102 | NSW
 3 | 103 | QLD
 4 | 104 | VIC
 5 | 105 | ACT
 6 | 106 | NSW
 7 | 107 | NT
 8 | 108 | QLD
 9 | 109 | NSW
(8 rows)
```

```
test_sub=# SELECT * FROM t1;
 a |  b  |  c
---+-----+-----
 6 | 106 | NSW
 9 | 109 | NSW
(2 rows)
```

Update some data, where the old and new row values both satisfy the `t1 WHERE` clause of publication `p1`. The `UPDATE` replicates the change as normal.

```
test_pub=# UPDATE t1 SET b = 999 WHERE a = 6;
UPDATE 1

test_pub=# SELECT * FROM t1;
 a |  b  |  c
---+-----+-----
 2 | 102 | NSW
 3 | 103 | QLD
 4 | 104 | VIC
 5 | 105 | ACT
 7 | 107 | NT
 8 | 108 | QLD
 9 | 109 | NSW
 6 | 999 | NSW
(8 rows)
```

```
test_sub=# SELECT * FROM t1;
 a |  b  |  c
---+-----+-----
 9 | 109 | NSW
 6 | 999 | NSW
(2 rows)
```

Update some data, where the old row values did not satisfy the `t1 WHERE` clause of publication `p1`, but the new row values do satisfy it. The `UPDATE` is transformed into an `INSERT` and the change is replicated. See the new row on the subscriber.

```
test_pub=# UPDATE t1 SET a = 555 WHERE a = 2;
UPDATE 1

test_pub=# SELECT * FROM t1;
  a  |  b  |  c
-----+-----+-----
   3 | 103 | QLD
   4 | 104 | VIC
   5 | 105 | ACT
   7 | 107 | NT
   8 | 108 | QLD
   9 | 109 | NSW
   6 | 999 | NSW
 555 | 102 | NSW
(8 rows)
```

```
test_sub=# SELECT * FROM t1;
  a  |  b  |  c
-----+-----+-----
   9 | 109 | NSW
   6 | 999 | NSW
 555 | 102 | NSW
(3 rows)
```

Update some data, where the old row values satisfied the `t1 WHERE` clause of publication `p1`, but the new row values do not satisfy it. The `UPDATE` is transformed into a `DELETE` and the change is replicated. See that the row is removed from the subscriber.

```
test_pub=# UPDATE t1 SET c = 'VIC' WHERE a = 9;
UPDATE 1

test_pub=# SELECT * FROM t1;
  a  |  b  |  c
-----+-----+-----
   3 | 103 | QLD
   4 | 104 | VIC
   5 | 105 | ACT
   7 | 107 | NT
   8 | 108 | QLD
   6 | 999 | NSW
 555 | 102 | NSW
   9 | 109 | VIC
(8 rows)
```

```
test_sub=# SELECT * FROM t1;
  a  |  b  |  c
-----+-----+-----
   6 | 999 | NSW
 555 | 102 | NSW
(2 rows)
```

The following examples show how the publication parameter [`publish_via_partition_root`](sql-createpublication#SQL-CREATEPUBLICATION-WITH-PUBLISH-VIA-PARTITION-ROOT) determines whether the row filter of the parent or child table will be used in the case of partitioned tables.

Create a partitioned table on the publisher.

```
test_pub=# CREATE TABLE parent(a int PRIMARY KEY) PARTITION BY RANGE(a);
CREATE TABLE
test_pub=# CREATE TABLE child PARTITION OF parent DEFAULT;
CREATE TABLE
```

Create the same tables on the subscriber.

```
test_sub=# CREATE TABLE parent(a int PRIMARY KEY) PARTITION BY RANGE(a);
CREATE TABLE
test_sub=# CREATE TABLE child PARTITION OF parent DEFAULT;
CREATE TABLE
```

Create a publication `p4`, and then subscribe to it. The publication parameter `publish_via_partition_root` is set as true. There are row filters defined on both the partitioned table (`parent`), and on the partition (`child`).

```
test_pub=# CREATE PUBLICATION p4 FOR TABLE parent WHERE (a < 5), child WHERE (a >= 5)
test_pub-# WITH (publish_via_partition_root=true);
CREATE PUBLICATION
```

```
test_sub=# CREATE SUBSCRIPTION s4
test_sub-# CONNECTION 'host=localhost dbname=test_pub application_name=s4'
test_sub-# PUBLICATION p4;
CREATE SUBSCRIPTION
```

Insert some values directly into the `parent` and `child` tables. They replicate using the row filter of `parent` (because `publish_via_partition_root` is true).

```
test_pub=# INSERT INTO parent VALUES (2), (4), (6);
INSERT 0 3
test_pub=# INSERT INTO child VALUES (3), (5), (7);
INSERT 0 3

test_pub=# SELECT * FROM parent ORDER BY a;
 a
---
 2
 3
 4
 5
 6
 7
(6 rows)
```

```
test_sub=# SELECT * FROM parent ORDER BY a;
 a
---
 2
 3
 4
(3 rows)
```

Repeat the same test, but with a different value for `publish_via_partition_root`. The publication parameter `publish_via_partition_root` is set as false. A row filter is defined on the partition (`child`).

```
test_pub=# DROP PUBLICATION p4;
DROP PUBLICATION
test_pub=# CREATE PUBLICATION p4 FOR TABLE parent, child WHERE (a >= 5)
test_pub-# WITH (publish_via_partition_root=false);
CREATE PUBLICATION
```

```
test_sub=# ALTER SUBSCRIPTION s4 REFRESH PUBLICATION;
ALTER SUBSCRIPTION
```

Do the inserts on the publisher same as before. They replicate using the row filter of `child` (because `publish_via_partition_root` is false).

```
test_pub=# TRUNCATE parent;
TRUNCATE TABLE
test_pub=# INSERT INTO parent VALUES (2), (4), (6);
INSERT 0 3
test_pub=# INSERT INTO child VALUES (3), (5), (7);
INSERT 0 3

test_pub=# SELECT * FROM parent ORDER BY a;
 a
---
 2
 3
 4
 5
 6
 7
(6 rows)
```

```
test_sub=# SELECT * FROM child ORDER BY a;
 a
---
 5
 6
 7
(3 rows)
```

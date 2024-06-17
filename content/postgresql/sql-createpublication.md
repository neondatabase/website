[#id](#SQL-CREATEPUBLICATION)

## CREATE PUBLICATION

CREATE PUBLICATION — define a new publication

## Synopsis

```
CREATE PUBLICATION name
    [ FOR ALL TABLES
      | FOR publication_object [, ... ] ]
    [ WITH ( publication_parameter [= value] [, ... ] ) ]

where publication_object is one of:

    TABLE [ ONLY ] table_name [ * ] [ ( column_name [, ... ] ) ] [ WHERE ( expression ) ] [, ... ]
    TABLES IN SCHEMA { schema_name | CURRENT_SCHEMA } [, ... ]
```

[#id](#id-1.9.3.77.5)

## Description

`CREATE PUBLICATION` adds a new publication into the current database. The publication name must be distinct from the name of any existing publication in the current database.

A publication is essentially a group of tables whose data changes are intended to be replicated through logical replication. See [Section 31.1](logical-replication-publication) for details about how publications fit into the logical replication setup.

[#id](#id-1.9.3.77.6)

## Parameters

- _`name`_ [#](#SQL-CREATEPUBLICATION-NAME)

  The name of the new publication.

- `FOR TABLE` [#](#SQL-CREATEPUBLICATION-FOR-TABLE)

  Specifies a list of tables to add to the publication. If `ONLY` is specified before the table name, only that table is added to the publication. If `ONLY` is not specified, the table and all its descendant tables (if any) are added. Optionally, `*` can be specified after the table name to explicitly indicate that descendant tables are included. This does not apply to a partitioned table, however. The partitions of a partitioned table are always implicitly considered part of the publication, so they are never explicitly added to the publication.

  If the optional `WHERE` clause is specified, it defines a _row filter_ expression. Rows for which the _`expression`_ evaluates to false or null will not be published. Note that parentheses are required around the expression. It has no effect on `TRUNCATE` commands.

  When a column list is specified, only the named columns are replicated. If no column list is specified, all columns of the table are replicated through this publication, including any columns added later. It has no effect on `TRUNCATE` commands. See [Section 31.4](logical-replication-col-lists) for details about column lists.

  Only persistent base tables and partitioned tables can be part of a publication. Temporary tables, unlogged tables, foreign tables, materialized views, and regular views cannot be part of a publication.

  Specifying a column list when the publication also publishes `FOR TABLES IN SCHEMA` is not supported.

  When a partitioned table is added to a publication, all of its existing and future partitions are implicitly considered to be part of the publication. So, even operations that are performed directly on a partition are also published via publications that its ancestors are part of.

- `FOR ALL TABLES` [#](#SQL-CREATEPUBLICATION-FOR-ALL-TABLES)

  Marks the publication as one that replicates changes for all tables in the database, including tables created in the future.

- `FOR TABLES IN SCHEMA` [#](#SQL-CREATEPUBLICATION-FOR-TABLES-IN-SCHEMA)

  Marks the publication as one that replicates changes for all tables in the specified list of schemas, including tables created in the future.

  Specifying a schema when the publication also publishes a table with a column list is not supported.

  Only persistent base tables and partitioned tables present in the schema will be included as part of the publication. Temporary tables, unlogged tables, foreign tables, materialized views, and regular views from the schema will not be part of the publication.

  When a partitioned table is published via schema level publication, all of its existing and future partitions are implicitly considered to be part of the publication, regardless of whether they are from the publication schema or not. So, even operations that are performed directly on a partition are also published via publications that its ancestors are part of.

- `WITH ( publication_parameter [= value] [, ... ] )` [#](#SQL-CREATEPUBLICATION-WITH)

  This clause specifies optional parameters for a publication. The following parameters are supported:

  - `publish` (`string`) [#](#SQL-CREATEPUBLICATION-WITH-PUBLISH)

    This parameter determines which DML operations will be published by the new publication to the subscribers. The value is comma-separated list of operations. The allowed operations are `insert`, `update`, `delete`, and `truncate`. The default is to publish all actions, and so the default value for this option is `'insert, update, delete, truncate'`.

    This parameter only affects DML operations. In particular, the initial data synchronization (see [Section 31.7.1](logical-replication-architecture#LOGICAL-REPLICATION-SNAPSHOT)) for logical replication does not take this parameter into account when copying existing table data.

  - `publish_via_partition_root` (`boolean`) [#](#SQL-CREATEPUBLICATION-WITH-PUBLISH-VIA-PARTITION-ROOT)

    This parameter determines whether changes in a partitioned table (or on its partitions) contained in the publication will be published using the identity and schema of the partitioned table rather than that of the individual partitions that are actually changed; the latter is the default. Enabling this allows the changes to be replicated into a non-partitioned table or a partitioned table consisting of a different set of partitions.

    There can be a case where a subscription combines multiple publications. If a partitioned table is published by any subscribed publications which set `publish_via_partition_root = true`, changes on this partitioned table (or on its partitions) will be published using the identity and schema of this partitioned table rather than that of the individual partitions.

    This parameter also affects how row filters and column lists are chosen for partitions; see below for details.

    If this is enabled, `TRUNCATE` operations performed directly on partitions are not replicated.

When specifying a parameter of type `boolean`, the `=` _`value`_ part can be omitted, which is equivalent to specifying `TRUE`.

[#id](#id-1.9.3.77.7)

## Notes

If `FOR TABLE`, `FOR ALL TABLES` or `FOR TABLES IN SCHEMA` are not specified, then the publication starts out with an empty set of tables. That is useful if tables or schemas are to be added later.

The creation of a publication does not start replication. It only defines a grouping and filtering logic for future subscribers.

To create a publication, the invoking user must have the `CREATE` privilege for the current database. (Of course, superusers bypass this check.)

To add a table to a publication, the invoking user must have ownership rights on the table. The `FOR ALL TABLES` and `FOR TABLES IN SCHEMA` clauses require the invoking user to be a superuser.

The tables added to a publication that publishes `UPDATE` and/or `DELETE` operations must have `REPLICA IDENTITY` defined. Otherwise those operations will be disallowed on those tables.

Any column list must include the `REPLICA IDENTITY` columns in order for `UPDATE` or `DELETE` operations to be published. There are no column list restrictions if the publication publishes only `INSERT` operations.

A row filter expression (i.e., the `WHERE` clause) must contain only columns that are covered by the `REPLICA IDENTITY`, in order for `UPDATE` and `DELETE` operations to be published. For publication of `INSERT` operations, any column may be used in the `WHERE` expression. The row filter allows simple expressions that don't have user-defined functions, user-defined operators, user-defined types, user-defined collations, non-immutable built-in functions, or references to system columns.

The row filter on a table becomes redundant if `FOR TABLES IN SCHEMA` is specified and the table belongs to the referred schema.

For published partitioned tables, the row filter for each partition is taken from the published partitioned table if the publication parameter `publish_via_partition_root` is true, or from the partition itself if it is false (the default). See [Section 31.3](logical-replication-row-filter) for details about row filters. Similarly, for published partitioned tables, the column list for each partition is taken from the published partitioned table if the publication parameter `publish_via_partition_root` is true, or from the partition itself if it is false.

For an `INSERT ... ON CONFLICT` command, the publication will publish the operation that results from the command. Depending on the outcome, it may be published as either `INSERT` or `UPDATE`, or it may not be published at all.

For a `MERGE` command, the publication will publish an `INSERT`, `UPDATE`, or `DELETE` for each row inserted, updated, or deleted.

`ATTACH`ing a table into a partition tree whose root is published using a publication with `publish_via_partition_root` set to `true` does not result in the table's existing contents being replicated.

`COPY ... FROM` commands are published as `INSERT` operations.

DDL operations are not published.

The `WHERE` clause expression is executed with the role used for the replication connection.

[#id](#id-1.9.3.77.8)

## Examples

Create a publication that publishes all changes in two tables:

```
CREATE PUBLICATION mypublication FOR TABLE users, departments;
```

Create a publication that publishes all changes from active departments:

```
CREATE PUBLICATION active_departments FOR TABLE departments WHERE (active IS TRUE);
```

Create a publication that publishes all changes in all tables:

```
CREATE PUBLICATION alltables FOR ALL TABLES;
```

Create a publication that only publishes `INSERT` operations in one table:

```
CREATE PUBLICATION insert_only FOR TABLE mydata
    WITH (publish = 'insert');
```

Create a publication that publishes all changes for tables `users`, `departments` and all changes for all the tables present in the schema `production`:

```
CREATE PUBLICATION production_publication FOR TABLE users, departments, TABLES IN SCHEMA production;
```

Create a publication that publishes all changes for all the tables present in the schemas `marketing` and `sales`:

```
CREATE PUBLICATION sales_publication FOR TABLES IN SCHEMA marketing, sales;
```

Create a publication that publishes all changes for table `users`, but replicates only columns `user_id` and `firstname`:

```
CREATE PUBLICATION users_filtered FOR TABLE users (user_id, firstname);
```

[#id](#id-1.9.3.77.9)

## Compatibility

`CREATE PUBLICATION` is a PostgreSQL extension.

[#id](#id-1.9.3.77.10)

## See Also

[ALTER PUBLICATION](sql-alterpublication), [DROP PUBLICATION](sql-droppublication), [CREATE SUBSCRIPTION](sql-createsubscription), [ALTER SUBSCRIPTION](sql-altersubscription)

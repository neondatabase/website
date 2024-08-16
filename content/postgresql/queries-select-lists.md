[#id](#QUERIES-SELECT-LISTS)

## 7.3. Select Lists [#](#QUERIES-SELECT-LISTS)

- [7.3.1. Select-List Items](queries-select-lists#QUERIES-SELECT-LIST-ITEMS)
- [7.3.2. Column Labels](queries-select-lists#QUERIES-COLUMN-LABELS)
- [7.3.3. `DISTINCT`](queries-select-lists#QUERIES-DISTINCT)

As shown in the previous section, the table expression in the `SELECT` command constructs an intermediate virtual table by possibly combining tables, views, eliminating rows, grouping, etc. This table is finally passed on to processing by the _select list_. The select list determines which _columns_ of the intermediate table are actually output.

[#id](#QUERIES-SELECT-LIST-ITEMS)

### 7.3.1. Select-List Items [#](#QUERIES-SELECT-LIST-ITEMS)

The simplest kind of select list is `*` which emits all columns that the table expression produces. Otherwise, a select list is a comma-separated list of value expressions (as defined in [Section 4.2](sql-expressions)). For instance, it could be a list of column names:

```
SELECT a, b, c FROM ...
```

The columns names `a`, `b`, and `c` are either the actual names of the columns of tables referenced in the `FROM` clause, or the aliases given to them as explained in [Section 7.2.1.2](queries-table-expressions#QUERIES-TABLE-ALIASES). The name space available in the select list is the same as in the `WHERE` clause, unless grouping is used, in which case it is the same as in the `HAVING` clause.

If more than one table has a column of the same name, the table name must also be given, as in:

```
SELECT tbl1.a, tbl2.a, tbl1.b FROM ...
```

When working with multiple tables, it can also be useful to ask for all the columns of a particular table:

```
SELECT tbl1.*, tbl2.a FROM ...
```

See [Section 8.16.5](rowtypes#ROWTYPES-USAGE) for more about the _`table_name`_`.*` notation.

If an arbitrary value expression is used in the select list, it conceptually adds a new virtual column to the returned table. The value expression is evaluated once for each result row, with the row's values substituted for any column references. But the expressions in the select list do not have to reference any columns in the table expression of the `FROM` clause; they can be constant arithmetic expressions, for instance.

[#id](#QUERIES-COLUMN-LABELS)

### 7.3.2. Column Labels [#](#QUERIES-COLUMN-LABELS)

The entries in the select list can be assigned names for subsequent processing, such as for use in an `ORDER BY` clause or for display by the client application. For example:

```
SELECT a AS value, b + c AS sum FROM ...
```

If no output column name is specified using `AS`, the system assigns a default column name. For simple column references, this is the name of the referenced column. For function calls, this is the name of the function. For complex expressions, the system will generate a generic name.

The `AS` key word is usually optional, but in some cases where the desired column name matches a PostgreSQL key word, you must write `AS` or double-quote the column name in order to avoid ambiguity. ([Appendix C](sql-keywords-appendix) shows which key words require `AS` to be used as a column label.) For example, `FROM` is one such key word, so this does not work:

```
SELECT a from, b + c AS sum FROM ...
```

but either of these do:

```
SELECT a AS from, b + c AS sum FROM ...
SELECT a "from", b + c AS sum FROM ...
```

For greatest safety against possible future key word additions, it is recommended that you always either write `AS` or double-quote the output column name.

### Note

The naming of output columns here is different from that done in the `FROM` clause (see [Section 7.2.1.2](queries-table-expressions#QUERIES-TABLE-ALIASES)). It is possible to rename the same column twice, but the name assigned in the select list is the one that will be passed on.

[#id](#QUERIES-DISTINCT)

### 7.3.3. `DISTINCT` [#](#QUERIES-DISTINCT)

After the select list has been processed, the result table can optionally be subject to the elimination of duplicate rows. The `DISTINCT` key word is written directly after `SELECT` to specify this:

```
SELECT DISTINCT select_list ...
```

(Instead of `DISTINCT` the key word `ALL` can be used to specify the default behavior of retaining all rows.)

Obviously, two rows are considered distinct if they differ in at least one column value. Null values are considered equal in this comparison.

Alternatively, an arbitrary expression can determine what rows are to be considered distinct:

```
SELECT DISTINCT ON (expression [, expression ...]) select_list ...
```

Here _`expression`_ is an arbitrary value expression that is evaluated for all rows. A set of rows for which all the expressions are equal are considered duplicates, and only the first row of the set is kept in the output. Note that the “first row” of a set is unpredictable unless the query is sorted on enough columns to guarantee a unique ordering of the rows arriving at the `DISTINCT` filter. (`DISTINCT ON` processing occurs after `ORDER BY` sorting.)

The `DISTINCT ON` clause is not part of the SQL standard and is sometimes considered bad style because of the potentially indeterminate nature of its results. With judicious use of `GROUP BY` and subqueries in `FROM`, this construct can be avoided, but it is often the most convenient alternative.

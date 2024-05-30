[#id](#FUNCTIONS-COMPARISONS)

## 9.24. Row and Array Comparisons [#](#FUNCTIONS-COMPARISONS)

- [9.24.1. `IN`](functions-comparisons#FUNCTIONS-COMPARISONS-IN-SCALAR)
- [9.24.2. `NOT IN`](functions-comparisons#FUNCTIONS-COMPARISONS-NOT-IN)
- [9.24.3. `ANY`/`SOME` (array)](functions-comparisons#FUNCTIONS-COMPARISONS-ANY-SOME)
- [9.24.4. `ALL` (array)](functions-comparisons#FUNCTIONS-COMPARISONS-ALL)
- [9.24.5. Row Constructor Comparison](functions-comparisons#ROW-WISE-COMPARISON)
- [9.24.6. Composite Type Comparison](functions-comparisons#COMPOSITE-TYPE-COMPARISON)

This section describes several specialized constructs for making multiple comparisons between groups of values. These forms are syntactically related to the subquery forms of the previous section, but do not involve subqueries. The forms involving array subexpressions are PostgreSQL extensions; the rest are SQL-compliant. All of the expression forms documented in this section return Boolean (true/false) results.

[#id](#FUNCTIONS-COMPARISONS-IN-SCALAR)

### 9.24.1. `IN` [#](#FUNCTIONS-COMPARISONS-IN-SCALAR)

```

expression IN (value [, ...])
```

The right-hand side is a parenthesized list of expressions. The result is “true” if the left-hand expression's result is equal to any of the right-hand expressions. This is a shorthand notation for

```

expression = value1
OR
expression = value2
OR
...
```

Note that if the left-hand expression yields null, or if there are no equal right-hand values and at least one right-hand expression yields null, the result of the `IN` construct will be null, not false. This is in accordance with SQL's normal rules for Boolean combinations of null values.

[#id](#FUNCTIONS-COMPARISONS-NOT-IN)

### 9.24.2. `NOT IN` [#](#FUNCTIONS-COMPARISONS-NOT-IN)

```

expression NOT IN (value [, ...])
```

The right-hand side is a parenthesized list of expressions. The result is “true” if the left-hand expression's result is unequal to all of the right-hand expressions. This is a shorthand notation for

```

expression <> value1
AND
expression <> value2
AND
...
```

Note that if the left-hand expression yields null, or if there are no equal right-hand values and at least one right-hand expression yields null, the result of the `NOT IN` construct will be null, not true as one might naively expect. This is in accordance with SQL's normal rules for Boolean combinations of null values.

### Tip

`x NOT IN y` is equivalent to `NOT (x IN y)` in all cases. However, null values are much more likely to trip up the novice when working with `NOT IN` than when working with `IN`. It is best to express your condition positively if possible.

[#id](#FUNCTIONS-COMPARISONS-ANY-SOME)

### 9.24.3. `ANY`/`SOME` (array) [#](#FUNCTIONS-COMPARISONS-ANY-SOME)

```

expression operator ANY (array expression)
expression operator SOME (array expression)
```

The right-hand side is a parenthesized expression, which must yield an array value. The left-hand expression is evaluated and compared to each element of the array using the given _`operator`_, which must yield a Boolean result. The result of `ANY` is “true” if any true result is obtained. The result is “false” if no true result is found (including the case where the array has zero elements).

If the array expression yields a null array, the result of `ANY` will be null. If the left-hand expression yields null, the result of `ANY` is ordinarily null (though a non-strict comparison operator could possibly yield a different result). Also, if the right-hand array contains any null elements and no true comparison result is obtained, the result of `ANY` will be null, not false (again, assuming a strict comparison operator). This is in accordance with SQL's normal rules for Boolean combinations of null values.

`SOME` is a synonym for `ANY`.

[#id](#FUNCTIONS-COMPARISONS-ALL)

### 9.24.4. `ALL` (array) [#](#FUNCTIONS-COMPARISONS-ALL)

```

expression operator ALL (array expression)
```

The right-hand side is a parenthesized expression, which must yield an array value. The left-hand expression is evaluated and compared to each element of the array using the given _`operator`_, which must yield a Boolean result. The result of `ALL` is “true” if all comparisons yield true (including the case where the array has zero elements). The result is “false” if any false result is found.

If the array expression yields a null array, the result of `ALL` will be null. If the left-hand expression yields null, the result of `ALL` is ordinarily null (though a non-strict comparison operator could possibly yield a different result). Also, if the right-hand array contains any null elements and no false comparison result is obtained, the result of `ALL` will be null, not true (again, assuming a strict comparison operator). This is in accordance with SQL's normal rules for Boolean combinations of null values.

[#id](#ROW-WISE-COMPARISON)

### 9.24.5. Row Constructor Comparison [#](#ROW-WISE-COMPARISON)

```

row_constructor operator row_constructor
```

Each side is a row constructor, as described in [Section 4.2.13](sql-expressions#SQL-SYNTAX-ROW-CONSTRUCTORS). The two row constructors must have the same number of fields. The given _`operator`_ is applied to each pair of corresponding fields. (Since the fields could be of different types, this means that a different specific operator could be selected for each pair.) All the selected operators must be members of some B-tree operator class, or be the negator of an `=` member of a B-tree operator class, meaning that row constructor comparison is only possible when the _`operator`_ is `=`, `<>`, `<`, `<=`, `>`, or `>=`, or has semantics similar to one of these.

The `=` and `<>` cases work slightly differently from the others. Two rows are considered equal if all their corresponding members are non-null and equal; the rows are unequal if any corresponding members are non-null and unequal; otherwise the result of the row comparison is unknown (null).

For the `<`, `<=`, `>` and `>=` cases, the row elements are compared left-to-right, stopping as soon as an unequal or null pair of elements is found. If either of this pair of elements is null, the result of the row comparison is unknown (null); otherwise comparison of this pair of elements determines the result. For example, `ROW(1,2,NULL) < ROW(1,3,0)` yields true, not null, because the third pair of elements are not considered.

```

row_constructor IS DISTINCT FROM row_constructor
```

This construct is similar to a `<>` row comparison, but it does not yield null for null inputs. Instead, any null value is considered unequal to (distinct from) any non-null value, and any two nulls are considered equal (not distinct). Thus the result will either be true or false, never null.

```

row_constructor IS NOT DISTINCT FROM row_constructor
```

This construct is similar to a `=` row comparison, but it does not yield null for null inputs. Instead, any null value is considered unequal to (distinct from) any non-null value, and any two nulls are considered equal (not distinct). Thus the result will always be either true or false, never null.

[#id](#COMPOSITE-TYPE-COMPARISON)

### 9.24.6. Composite Type Comparison [#](#COMPOSITE-TYPE-COMPARISON)

```

record operator record
```

The SQL specification requires row-wise comparison to return NULL if the result depends on comparing two NULL values or a NULL and a non-NULL. PostgreSQL does this only when comparing the results of two row constructors (as in [Section 9.24.5](functions-comparisons#ROW-WISE-COMPARISON)) or comparing a row constructor to the output of a subquery (as in [Section 9.23](functions-subquery)). In other contexts where two composite-type values are compared, two NULL field values are considered equal, and a NULL is considered larger than a non-NULL. This is necessary in order to have consistent sorting and indexing behavior for composite types.

Each side is evaluated and they are compared row-wise. Composite type comparisons are allowed when the _`operator`_ is `=`, `<>`, `<`, `<=`, `>` or `>=`, or has semantics similar to one of these. (To be specific, an operator can be a row comparison operator if it is a member of a B-tree operator class, or is the negator of the `=` member of a B-tree operator class.) The default behavior of the above operators is the same as for `IS [ NOT ] DISTINCT FROM` for row constructors (see [Section 9.24.5](functions-comparisons#ROW-WISE-COMPARISON)).

To support matching of rows which include elements without a default B-tree operator class, the following operators are defined for composite type comparison: `*=`, `*<>`, `*<`, `*<=`, `*>`, and `*>=`. These operators compare the internal binary representation of the two rows. Two rows might have a different binary representation even though comparisons of the two rows with the equality operator is true. The ordering of rows under these comparison operators is deterministic but not otherwise meaningful. These operators are used internally for materialized views and might be useful for other specialized purposes such as replication and B-Tree deduplication (see [Section 67.4.3](btree-implementation#BTREE-DEDUPLICATION)). They are not intended to be generally useful for writing queries, though.

<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|          9.2. Comparison Functions and Operators         |                                                           |                                    |                                                       |                                                                          |
| :------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------: |
| [Prev](functions-logical.html "9.1. Logical Operators")  | [Up](functions.html "Chapter 9. Functions and Operators") | Chapter 9. Functions and Operators | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](functions-math.html "9.3. Mathematical Functions and Operators") |

***

## 9.2. Comparison Functions and Operators [#](#FUNCTIONS-COMPARISON)

The usual comparison operators are available, as shown in [Table 9.1](functions-comparison.html#FUNCTIONS-COMPARISON-OP-TABLE "Table 9.1. Comparison Operators").

**Table 9.1. Comparison Operators**

| Operator                                   | Description              |
| ------------------------------------------ | ------------------------ |
| *`datatype`* `<` *`datatype`* → `boolean`  | Less than                |
| *`datatype`* `>` *`datatype`* → `boolean`  | Greater than             |
| *`datatype`* `<=` *`datatype`* → `boolean` | Less than or equal to    |
| *`datatype`* `>=` *`datatype`* → `boolean` | Greater than or equal to |
| *`datatype`* `=` *`datatype`* → `boolean`  | Equal                    |
| *`datatype`* `<>` *`datatype`* → `boolean` | Not equal                |
| *`datatype`* `!=` *`datatype`* → `boolean` | Not equal                |

\

### Note

`<>` is the standard SQL notation for “not equal”. `!=` is an alias, which is converted to `<>` at a very early stage of parsing. Hence, it is not possible to implement `!=` and `<>` operators that do different things.

These comparison operators are available for all built-in data types that have a natural ordering, including numeric, string, and date/time types. In addition, arrays, composite types, and ranges can be compared if their component data types are comparable.

It is usually possible to compare values of related data types as well; for example `integer` `>` `bigint` will work. Some cases of this sort are implemented directly by “cross-type” comparison operators, but if no such operator is available, the parser will coerce the less-general type to the more-general type and apply the latter's comparison operator.

As shown above, all comparison operators are binary operators that return values of type `boolean`. Thus, expressions like `1 < 2 < 3` are not valid (because there is no `<` operator to compare a Boolean value with `3`). Use the `BETWEEN` predicates shown below to perform range tests.

There are also some comparison predicates, as shown in [Table 9.2](functions-comparison.html#FUNCTIONS-COMPARISON-PRED-TABLE "Table 9.2. Comparison Predicates"). These behave much like operators, but have special syntax mandated by the SQL standard.

**Table 9.2. Comparison Predicates**

| PredicateDescriptionExample(s)                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| *`datatype`* `BETWEEN` *`datatype`* `AND` *`datatype`* → `boolean`Between (inclusive of the range endpoints).`2 BETWEEN 1 AND 3` → `t``2 BETWEEN 3 AND 1` → `f`                                                            |
| *`datatype`* `NOT BETWEEN` *`datatype`* `AND` *`datatype`* → `boolean`Not between (the negation of `BETWEEN`).`2 NOT BETWEEN 1 AND 3` → `f`                                                                                |
| *`datatype`* `BETWEEN SYMMETRIC` *`datatype`* `AND` *`datatype`* → `boolean`Between, after sorting the two endpoint values.`2 BETWEEN SYMMETRIC 3 AND 1` → `t`                                                             |
| *`datatype`* `NOT BETWEEN SYMMETRIC` *`datatype`* `AND` *`datatype`* → `boolean`Not between, after sorting the two endpoint values.`2 NOT BETWEEN SYMMETRIC 3 AND 1` → `f`                                                 |
| *`datatype`* `IS DISTINCT FROM` *`datatype`* → `boolean`Not equal, treating null as a comparable value.`1 IS DISTINCT FROM NULL` → `t` (rather than `NULL`)`NULL IS DISTINCT FROM NULL` → `f` (rather than `NULL`)         |
| *`datatype`* `IS NOT DISTINCT FROM` *`datatype`* → `boolean`Equal, treating null as a comparable value.`1 IS NOT DISTINCT FROM NULL` → `f` (rather than `NULL`)`NULL IS NOT DISTINCT FROM NULL` → `t` (rather than `NULL`) |
| *`datatype`* `IS NULL` → `boolean`Test whether value is null.`1.5 IS NULL` → `f`                                                                                                                                           |
| *`datatype`* `IS NOT NULL` → `boolean`Test whether value is not null.`'null' IS NOT NULL` → `t`                                                                                                                            |
| *`datatype`* `ISNULL` → `boolean`Test whether value is null (nonstandard syntax).                                                                                                                                          |
| *`datatype`* `NOTNULL` → `boolean`Test whether value is not null (nonstandard syntax).                                                                                                                                     |
| `boolean` `IS TRUE` → `boolean`Test whether boolean expression yields true.`true IS TRUE` → `t``NULL::boolean IS TRUE` → `f` (rather than `NULL`)                                                                          |
| `boolean` `IS NOT TRUE` → `boolean`Test whether boolean expression yields false or unknown.`true IS NOT TRUE` → `f``NULL::boolean IS NOT TRUE` → `t` (rather than `NULL`)                                                  |
| `boolean` `IS FALSE` → `boolean`Test whether boolean expression yields false.`true IS FALSE` → `f``NULL::boolean IS FALSE` → `f` (rather than `NULL`)                                                                      |
| `boolean` `IS NOT FALSE` → `boolean`Test whether boolean expression yields true or unknown.`true IS NOT FALSE` → `t``NULL::boolean IS NOT FALSE` → `t` (rather than `NULL`)                                                |
| `boolean` `IS UNKNOWN` → `boolean`Test whether boolean expression yields unknown.`true IS UNKNOWN` → `f``NULL::boolean IS UNKNOWN` → `t` (rather than `NULL`)                                                              |
| `boolean` `IS NOT UNKNOWN` → `boolean`Test whether boolean expression yields true or false.`true IS NOT UNKNOWN` → `t``NULL::boolean IS NOT UNKNOWN` → `f` (rather than `NULL`)                                            |

\

The `BETWEEN` predicate simplifies range tests:

    a BETWEEN x AND y

is equivalent to

    a >= x AND a <= y

Notice that `BETWEEN` treats the endpoint values as included in the range. `BETWEEN SYMMETRIC` is like `BETWEEN` except there is no requirement that the argument to the left of `AND` be less than or equal to the argument on the right. If it is not, those two arguments are automatically swapped, so that a nonempty range is always implied.

The various variants of `BETWEEN` are implemented in terms of the ordinary comparison operators, and therefore will work for any data type(s) that can be compared.

### Note

The use of `AND` in the `BETWEEN` syntax creates an ambiguity with the use of `AND` as a logical operator. To resolve this, only a limited set of expression types are allowed as the second argument of a `BETWEEN` clause. If you need to write a more complex sub-expression in `BETWEEN`, write parentheses around the sub-expression.

Ordinary comparison operators yield null (signifying “unknown”), not true or false, when either input is null. For example, `7 = NULL` yields null, as does `7 <> NULL`. When this behavior is not suitable, use the `IS [ NOT ] DISTINCT FROM` predicates:

    a IS DISTINCT FROM b
    a IS NOT DISTINCT FROM b

For non-null inputs, `IS DISTINCT FROM` is the same as the `<>` operator. However, if both inputs are null it returns false, and if only one input is null it returns true. Similarly, `IS NOT DISTINCT FROM` is identical to `=` for non-null inputs, but it returns true when both inputs are null, and false when only one input is null. Thus, these predicates effectively act as though null were a normal data value, rather than “unknown”.

To check whether a value is or is not null, use the predicates:

    expression IS NULL
    expression IS NOT NULL

or the equivalent, but nonstandard, predicates:

    expression ISNULL
    expression NOTNULL

Do *not* write `expression = NULL` because `NULL` is not “equal to” `NULL`. (The null value represents an unknown value, and it is not known whether two unknown values are equal.)

### Tip

Some applications might expect that `expression = NULL` returns true if *`expression`* evaluates to the null value. It is highly recommended that these applications be modified to comply with the SQL standard. However, if that cannot be done the [transform\_null\_equals](runtime-config-compatible.html#GUC-TRANSFORM-NULL-EQUALS) configuration variable is available. If it is enabled, PostgreSQL will convert `x = NULL` clauses to `x IS NULL`.

If the *`expression`* is row-valued, then `IS NULL` is true when the row expression itself is null or when all the row's fields are null, while `IS NOT NULL` is true when the row expression itself is non-null and all the row's fields are non-null. Because of this behavior, `IS NULL` and `IS NOT NULL` do not always return inverse results for row-valued expressions; in particular, a row-valued expression that contains both null and non-null fields will return false for both tests. In some cases, it may be preferable to write *`row`* `IS DISTINCT FROM NULL` or *`row`* `IS NOT DISTINCT FROM NULL`, which will simply check whether the overall row value is null without any additional tests on the row fields.

Boolean values can also be tested using the predicates

    boolean_expression IS TRUE
    boolean_expression IS NOT TRUE
    boolean_expression IS FALSE
    boolean_expression IS NOT FALSE
    boolean_expression IS UNKNOWN
    boolean_expression IS NOT UNKNOWN

These will always return true or false, never a null value, even when the operand is null. A null input is treated as the logical value “unknown”. Notice that `IS UNKNOWN` and `IS NOT UNKNOWN` are effectively the same as `IS NULL` and `IS NOT NULL`, respectively, except that the input expression must be of Boolean type.

Some comparison-related functions are also available, as shown in [Table 9.3](functions-comparison.html#FUNCTIONS-COMPARISON-FUNC-TABLE "Table 9.3. Comparison Functions").

**Table 9.3. Comparison Functions**

| FunctionDescriptionExample(s)                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------ |
| `num_nonnulls` ( `VARIADIC` `"any"` ) → `integer`Returns the number of non-null arguments.`num_nonnulls(1, NULL, 2)` → `2` |
| `num_nulls` ( `VARIADIC` `"any"` ) → `integer`Returns the number of null arguments.`num_nulls(1, NULL, 2)` → `1`           |

***

|                                                          |                                                           |                                                                          |
| :------------------------------------------------------- | :-------------------------------------------------------: | -----------------------------------------------------------------------: |
| [Prev](functions-logical.html "9.1. Logical Operators")  | [Up](functions.html "Chapter 9. Functions and Operators") |  [Next](functions-math.html "9.3. Mathematical Functions and Operators") |
| 9.1. Logical Operators                                   |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                9.3. Mathematical Functions and Operators |

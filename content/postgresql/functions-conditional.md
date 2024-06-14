[#id](#FUNCTIONS-CONDITIONAL)

## 9.18. Conditional Expressions [#](#FUNCTIONS-CONDITIONAL)

- [9.18.1. `CASE`](functions-conditional#FUNCTIONS-CASE)
- [9.18.2. `COALESCE`](functions-conditional#FUNCTIONS-COALESCE-NVL-IFNULL)
- [9.18.3. `NULLIF`](functions-conditional#FUNCTIONS-NULLIF)
- [9.18.4. `GREATEST` and `LEAST`](functions-conditional#FUNCTIONS-GREATEST-LEAST)

This section describes the SQL-compliant conditional expressions available in PostgreSQL.

### Tip

If your needs go beyond the capabilities of these conditional expressions, you might want to consider writing a server-side function in a more expressive programming language.

### Note

Although `COALESCE`, `GREATEST`, and `LEAST` are syntactically similar to functions, they are not ordinary functions, and thus cannot be used with explicit `VARIADIC` array arguments.

[#id](#FUNCTIONS-CASE)

### 9.18.1. `CASE` [#](#FUNCTIONS-CASE)

The SQL `CASE` expression is a generic conditional expression, similar to if/else statements in other programming languages:

```

CASE WHEN condition THEN result
     [WHEN ...]
     [ELSE result]
END
```

`CASE` clauses can be used wherever an expression is valid. Each _`condition`_ is an expression that returns a `boolean` result. If the condition's result is true, the value of the `CASE` expression is the _`result`_ that follows the condition, and the remainder of the `CASE` expression is not processed. If the condition's result is not true, any subsequent `WHEN` clauses are examined in the same manner. If no `WHEN` _`condition`_ yields true, the value of the `CASE` expression is the _`result`_ of the `ELSE` clause. If the `ELSE` clause is omitted and no condition is true, the result is null.

An example:

```

SELECT * FROM test;

 a
---
 1
 2
 3


SELECT a,
       CASE WHEN a=1 THEN 'one'
            WHEN a=2 THEN 'two'
            ELSE 'other'
       END
    FROM test;

 a | case
---+-------
 1 | one
 2 | two
 3 | other
```

The data types of all the _`result`_ expressions must be convertible to a single output type. See [Section 10.5](typeconv-union-case) for more details.

There is a “simple” form of `CASE` expression that is a variant of the general form above:

```

CASE expression
    WHEN value THEN result
    [WHEN ...]
    [ELSE result]
END
```

The first _`expression`_ is computed, then compared to each of the _`value`_ expressions in the `WHEN` clauses until one is found that is equal to it. If no match is found, the _`result`_ of the `ELSE` clause (or a null value) is returned. This is similar to the `switch` statement in C.

The example above can be written using the simple `CASE` syntax:

```

SELECT a,
       CASE a WHEN 1 THEN 'one'
              WHEN 2 THEN 'two'
              ELSE 'other'
       END
    FROM test;

 a | case
---+-------
 1 | one
 2 | two
 3 | other
```

A `CASE` expression does not evaluate any subexpressions that are not needed to determine the result. For example, this is a possible way of avoiding a division-by-zero failure:

```

SELECT ... WHERE CASE WHEN x <> 0 THEN y/x > 1.5 ELSE false END;
```

### Note

As described in [Section 4.2.14](sql-expressions#SYNTAX-EXPRESS-EVAL), there are various situations in which subexpressions of an expression are evaluated at different times, so that the principle that “`CASE` evaluates only necessary subexpressions” is not ironclad. For example a constant `1/0` subexpression will usually result in a division-by-zero failure at planning time, even if it's within a `CASE` arm that would never be entered at run time.

[#id](#FUNCTIONS-COALESCE-NVL-IFNULL)

### 9.18.2. `COALESCE` [#](#FUNCTIONS-COALESCE-NVL-IFNULL)

```

COALESCE(value [, ...])
```

The `COALESCE` function returns the first of its arguments that is not null. Null is returned only if all arguments are null. It is often used to substitute a default value for null values when data is retrieved for display, for example:

```

SELECT COALESCE(description, short_description, '(none)') ...
```

This returns `description` if it is not null, otherwise `short_description` if it is not null, otherwise `(none)`.

The arguments must all be convertible to a common data type, which will be the type of the result (see [Section 10.5](typeconv-union-case) for details).

Like a `CASE` expression, `COALESCE` only evaluates the arguments that are needed to determine the result; that is, arguments to the right of the first non-null argument are not evaluated. This SQL-standard function provides capabilities similar to `NVL` and `IFNULL`, which are used in some other database systems.

[#id](#FUNCTIONS-NULLIF)

### 9.18.3. `NULLIF` [#](#FUNCTIONS-NULLIF)

```

NULLIF(value1, value2)
```

The `NULLIF` function returns a null value if _`value1`_ equals _`value2`_; otherwise it returns _`value1`_. This can be used to perform the inverse operation of the `COALESCE` example given above:

```

SELECT NULLIF(value, '(none)') ...
```

In this example, if `value` is `(none)`, null is returned, otherwise the value of `value` is returned.

The two arguments must be of comparable types. To be specific, they are compared exactly as if you had written `value1 = value2`, so there must be a suitable `=` operator available.

The result has the same type as the first argument — but there is a subtlety. What is actually returned is the first argument of the implied `=` operator, and in some cases that will have been promoted to match the second argument's type. For example, `NULLIF(1, 2.2)` yields `numeric`, because there is no `integer` `=` `numeric` operator, only `numeric` `=` `numeric`.

[#id](#FUNCTIONS-GREATEST-LEAST)

### 9.18.4. `GREATEST` and `LEAST` [#](#FUNCTIONS-GREATEST-LEAST)

```

GREATEST(value [, ...])
```

```

LEAST(value [, ...])
```

The `GREATEST` and `LEAST` functions select the largest or smallest value from a list of any number of expressions. The expressions must all be convertible to a common data type, which will be the type of the result (see [Section 10.5](typeconv-union-case) for details).

NULL values in the argument list are ignored. The result will be NULL only if all the expressions evaluate to NULL. (This is a deviation from the SQL standard. According to the standard, the return value is NULL if any argument is NULL. Some other databases behave this way.)

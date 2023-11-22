[#id](#FUNCTIONS-COMPARISON)

## 9.2. Comparison Functions and Operators [#](#FUNCTIONS-COMPARISON)

The usual comparison operators are available, as shown in [Table 9.1](functions-comparison#FUNCTIONS-COMPARISON-OP-TABLE).

[#id](#FUNCTIONS-COMPARISON-OP-TABLE)

**Table 9.1. Comparison Operators**

| Operator                                   | Description              |
| ------------------------------------------ | ------------------------ |
| _`datatype`_ `<` _`datatype`_ → `boolean`  | Less than                |
| _`datatype`_ `>` _`datatype`_ → `boolean`  | Greater than             |
| _`datatype`_ `<=` _`datatype`_ → `boolean` | Less than or equal to    |
| _`datatype`_ `>=` _`datatype`_ → `boolean` | Greater than or equal to |
| _`datatype`_ `=` _`datatype`_ → `boolean`  | Equal                    |
| _`datatype`_ `<>` _`datatype`_ → `boolean` | Not equal                |
| _`datatype`_ `!=` _`datatype`_ → `boolean` | Not equal                |

### Note

`<>` is the standard SQL notation for “not equal”. `!=` is an alias, which is converted to `<>` at a very early stage of parsing. Hence, it is not possible to implement `!=` and `<>` operators that do different things.

These comparison operators are available for all built-in data types that have a natural ordering, including numeric, string, and date/time types. In addition, arrays, composite types, and ranges can be compared if their component data types are comparable.

It is usually possible to compare values of related data types as well; for example `integer` `>` `bigint` will work. Some cases of this sort are implemented directly by “cross-type” comparison operators, but if no such operator is available, the parser will coerce the less-general type to the more-general type and apply the latter's comparison operator.

As shown above, all comparison operators are binary operators that return values of type `boolean`. Thus, expressions like `1 < 2 < 3` are not valid (because there is no `<` operator to compare a Boolean value with `3`). Use the `BETWEEN` predicates shown below to perform range tests.

There are also some comparison predicates, as shown in [Table 9.2](functions-comparison#FUNCTIONS-COMPARISON-PRED-TABLE). These behave much like operators, but have special syntax mandated by the SQL standard.

[#id](#FUNCTIONS-COMPARISON-PRED-TABLE)

**Table 9.2. Comparison Predicates**

<table class="table" summary="Comparison Predicates" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <p class="func_signature">Predicate</p>
        <p>Description</p>
        <p>Example(s)</p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <em class="replaceable"><code>datatype</code></em> <code class="literal">BETWEEN</code>
          <em class="replaceable"><code>datatype</code></em> <code class="literal">AND</code>
          <em class="replaceable"><code>datatype</code></em> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Between (inclusive of the range endpoints).</p>
        <p>
          <code class="literal">2 BETWEEN 1 AND 3</code>
          → <code class="returnvalue">t</code>
        </p>
        <p>
          <code class="literal">2 BETWEEN 3 AND 1</code>
          → <code class="returnvalue">f</code>
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <em class="replaceable"><code>datatype</code></em>
          <code class="literal">NOT BETWEEN</code>
          <em class="replaceable"><code>datatype</code></em> <code class="literal">AND</code>
          <em class="replaceable"><code>datatype</code></em> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Not between (the negation of <code class="literal">BETWEEN</code>).</p>
        <p>
          <code class="literal">2 NOT BETWEEN 1 AND 3</code>
          → <code class="returnvalue">f</code>
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <em class="replaceable"><code>datatype</code></em>
          <code class="literal">BETWEEN SYMMETRIC</code>
          <em class="replaceable"><code>datatype</code></em> <code class="literal">AND</code>
          <em class="replaceable"><code>datatype</code></em> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Between, after sorting the two endpoint values.</p>
        <p>
          <code class="literal">2 BETWEEN SYMMETRIC 3 AND 1</code>
          → <code class="returnvalue">t</code>
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <em class="replaceable"><code>datatype</code></em>
          <code class="literal">NOT BETWEEN SYMMETRIC</code>
          <em class="replaceable"><code>datatype</code></em> <code class="literal">AND</code>
          <em class="replaceable"><code>datatype</code></em> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Not between, after sorting the two endpoint values.</p>
        <p>
          <code class="literal">2 NOT BETWEEN SYMMETRIC 3 AND 1</code>
          → <code class="returnvalue">f</code>
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <em class="replaceable"><code>datatype</code></em>
          <code class="literal">IS DISTINCT FROM</code>
          <em class="replaceable"><code>datatype</code></em> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Not equal, treating null as a comparable value.</p>
        <p>
          <code class="literal">1 IS DISTINCT FROM NULL</code>
          → <code class="returnvalue">t</code> (rather than <code class="literal">NULL</code>)
        </p>
        <p>
          <code class="literal">NULL IS DISTINCT FROM NULL</code>
          → <code class="returnvalue">f</code> (rather than <code class="literal">NULL</code>)
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <em class="replaceable"><code>datatype</code></em>
          <code class="literal">IS NOT DISTINCT FROM</code>
          <em class="replaceable"><code>datatype</code></em> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Equal, treating null as a comparable value.</p>
        <p>
          <code class="literal">1 IS NOT DISTINCT FROM NULL</code>
          → <code class="returnvalue">f</code> (rather than <code class="literal">NULL</code>)
        </p>
        <p>
          <code class="literal">NULL IS NOT DISTINCT FROM NULL</code>
          → <code class="returnvalue">t</code> (rather than <code class="literal">NULL</code>)
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <em class="replaceable"><code>datatype</code></em> <code class="literal">IS NULL</code> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Test whether value is null.</p>
        <p>
          <code class="literal">1.5 IS NULL</code>
          → <code class="returnvalue">f</code>
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <em class="replaceable"><code>datatype</code></em>
          <code class="literal">IS NOT NULL</code> → <code class="returnvalue">boolean</code>
        </p>
        <p>Test whether value is not null.</p>
        <p>
          <code class="literal">'null' IS NOT NULL</code>
          → <code class="returnvalue">t</code>
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <em class="replaceable"><code>datatype</code></em> <code class="literal">ISNULL</code> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Test whether value is null (nonstandard syntax).</p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <em class="replaceable"><code>datatype</code></em> <code class="literal">NOTNULL</code> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Test whether value is not null (nonstandard syntax).</p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <code class="type">boolean</code> <code class="literal">IS TRUE</code> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Test whether boolean expression yields true.</p>
        <p>
          <code class="literal">true IS TRUE</code>
          → <code class="returnvalue">t</code>
        </p>
        <p>
          <code class="literal">NULL::boolean IS TRUE</code>
          → <code class="returnvalue">f</code> (rather than <code class="literal">NULL</code>)
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <code class="type">boolean</code> <code class="literal">IS NOT TRUE</code> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Test whether boolean expression yields false or unknown.</p>
        <p>
          <code class="literal">true IS NOT TRUE</code>
          → <code class="returnvalue">f</code>
        </p>
        <p>
          <code class="literal">NULL::boolean IS NOT TRUE</code>
          → <code class="returnvalue">t</code> (rather than <code class="literal">NULL</code>)
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <code class="type">boolean</code> <code class="literal">IS FALSE</code> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Test whether boolean expression yields false.</p>
        <p>
          <code class="literal">true IS FALSE</code>
          → <code class="returnvalue">f</code>
        </p>
        <p>
          <code class="literal">NULL::boolean IS FALSE</code>
          → <code class="returnvalue">f</code> (rather than <code class="literal">NULL</code>)
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <code class="type">boolean</code> <code class="literal">IS NOT FALSE</code> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Test whether boolean expression yields true or unknown.</p>
        <p>
          <code class="literal">true IS NOT FALSE</code>
          → <code class="returnvalue">t</code>
        </p>
        <p>
          <code class="literal">NULL::boolean IS NOT FALSE</code>
          → <code class="returnvalue">t</code> (rather than <code class="literal">NULL</code>)
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <code class="type">boolean</code> <code class="literal">IS UNKNOWN</code> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Test whether boolean expression yields unknown.</p>
        <p>
          <code class="literal">true IS UNKNOWN</code>
          → <code class="returnvalue">f</code>
        </p>
        <p>
          <code class="literal">NULL::boolean IS UNKNOWN</code>
          → <code class="returnvalue">t</code> (rather than <code class="literal">NULL</code>)
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <code class="type">boolean</code> <code class="literal">IS NOT UNKNOWN</code> →
          <code class="returnvalue">boolean</code>
        </p>
        <p>Test whether boolean expression yields true or false.</p>
        <p>
          <code class="literal">true IS NOT UNKNOWN</code>
          → <code class="returnvalue">t</code>
        </p>
        <p>
          <code class="literal">NULL::boolean IS NOT UNKNOWN</code>
          → <code class="returnvalue">f</code> (rather than <code class="literal">NULL</code>)
        </p>
      </td>
    </tr>
  </tbody>
</table>

The `BETWEEN` predicate simplifies range tests:

```

a BETWEEN x AND y
```

is equivalent to

```

a >= x AND a <= y
```

Notice that `BETWEEN` treats the endpoint values as included in the range. `BETWEEN SYMMETRIC` is like `BETWEEN` except there is no requirement that the argument to the left of `AND` be less than or equal to the argument on the right. If it is not, those two arguments are automatically swapped, so that a nonempty range is always implied.

The various variants of `BETWEEN` are implemented in terms of the ordinary comparison operators, and therefore will work for any data type(s) that can be compared.

### Note

The use of `AND` in the `BETWEEN` syntax creates an ambiguity with the use of `AND` as a logical operator. To resolve this, only a limited set of expression types are allowed as the second argument of a `BETWEEN` clause. If you need to write a more complex sub-expression in `BETWEEN`, write parentheses around the sub-expression.

Ordinary comparison operators yield null (signifying “unknown”), not true or false, when either input is null. For example, `7 = NULL` yields null, as does `7 <> NULL`. When this behavior is not suitable, use the `IS [ NOT ] DISTINCT FROM` predicates:

```

a IS DISTINCT FROM b
a IS NOT DISTINCT FROM b
```

For non-null inputs, `IS DISTINCT FROM` is the same as the `<>` operator. However, if both inputs are null it returns false, and if only one input is null it returns true. Similarly, `IS NOT DISTINCT FROM` is identical to `=` for non-null inputs, but it returns true when both inputs are null, and false when only one input is null. Thus, these predicates effectively act as though null were a normal data value, rather than “unknown”.

To check whether a value is or is not null, use the predicates:

```

expression IS NULL
expression IS NOT NULL
```

or the equivalent, but nonstandard, predicates:

```

expression ISNULL
expression NOTNULL
```

Do _not_ write `expression = NULL` because `NULL` is not “equal to” `NULL`. (The null value represents an unknown value, and it is not known whether two unknown values are equal.)

### Tip

Some applications might expect that `expression = NULL` returns true if _`expression`_ evaluates to the null value. It is highly recommended that these applications be modified to comply with the SQL standard. However, if that cannot be done the [transform_null_equals](runtime-config-compatible#GUC-TRANSFORM-NULL-EQUALS) configuration variable is available. If it is enabled, PostgreSQL will convert `x = NULL` clauses to `x IS NULL`.

If the _`expression`_ is row-valued, then `IS NULL` is true when the row expression itself is null or when all the row's fields are null, while `IS NOT NULL` is true when the row expression itself is non-null and all the row's fields are non-null. Because of this behavior, `IS NULL` and `IS NOT NULL` do not always return inverse results for row-valued expressions; in particular, a row-valued expression that contains both null and non-null fields will return false for both tests. In some cases, it may be preferable to write _`row`_ `IS DISTINCT FROM NULL` or _`row`_ `IS NOT DISTINCT FROM NULL`, which will simply check whether the overall row value is null without any additional tests on the row fields.

Boolean values can also be tested using the predicates

```

boolean_expression IS TRUE
boolean_expression IS NOT TRUE
boolean_expression IS FALSE
boolean_expression IS NOT FALSE
boolean_expression IS UNKNOWN
boolean_expression IS NOT UNKNOWN
```

These will always return true or false, never a null value, even when the operand is null. A null input is treated as the logical value “unknown”. Notice that `IS UNKNOWN` and `IS NOT UNKNOWN` are effectively the same as `IS NULL` and `IS NOT NULL`, respectively, except that the input expression must be of Boolean type.

Some comparison-related functions are also available, as shown in [Table 9.3](functions-comparison#FUNCTIONS-COMPARISON-FUNC-TABLE).

[#id](#FUNCTIONS-COMPARISON-FUNC-TABLE)

**Table 9.3. Comparison Functions**

<table class="table" summary="Comparison Functions" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <p class="func_signature">Function</p>
        <p>Description</p>
        <p>Example(s)</p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <a id="id-1.5.8.8.21.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">num_nonnulls</code> ( <code class="literal">VARIADIC</code>
          <code class="type">"any"</code> ) → <code class="returnvalue">integer</code>
        </p>
        <p>Returns the number of non-null arguments.</p>
        <p>
          <code class="literal">num_nonnulls(1, NULL, 2)</code>
          → <code class="returnvalue">2</code>
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <a id="id-1.5.8.8.21.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">num_nulls</code> ( <code class="literal">VARIADIC</code>
          <code class="type">"any"</code> ) → <code class="returnvalue">integer</code>
        </p>
        <p>Returns the number of null arguments.</p>
        <p>
          <code class="literal">num_nulls(1, NULL, 2)</code>
          → <code class="returnvalue">1</code>
        </p>
      </td>
    </tr>
  </tbody>
</table>

[#id](#SEG)

## F.39. seg — a datatype for line segments or floating point intervals [#](#SEG)

- [F.39.1. Rationale](seg#SEG-RATIONALE)
- [F.39.2. Syntax](seg#SEG-SYNTAX)
- [F.39.3. Precision](seg#SEG-PRECISION)
- [F.39.4. Usage](seg#SEG-USAGE)
- [F.39.5. Notes](seg#SEG-NOTES)
- [F.39.6. Credits](seg#SEG-CREDITS)

This module implements a data type `seg` for representing line segments, or floating point intervals. `seg` can represent uncertainty in the interval endpoints, making it especially useful for representing laboratory measurements.

This module is considered “trusted”, that is, it can be installed by non-superusers who have `CREATE` privilege on the current database.

[#id](#SEG-RATIONALE)

### F.39.1. Rationale [#](#SEG-RATIONALE)

The geometry of measurements is usually more complex than that of a point in a numeric continuum. A measurement is usually a segment of that continuum with somewhat fuzzy limits. The measurements come out as intervals because of uncertainty and randomness, as well as because the value being measured may naturally be an interval indicating some condition, such as the temperature range of stability of a protein.

Using just common sense, it appears more convenient to store such data as intervals, rather than pairs of numbers. In practice, it even turns out more efficient in most applications.

Further along the line of common sense, the fuzziness of the limits suggests that the use of traditional numeric data types leads to a certain loss of information. Consider this: your instrument reads 6.50, and you input this reading into the database. What do you get when you fetch it? Watch:

```
test=> select 6.50 :: float8 as "pH";
 pH
---
6.5
(1 row)
```

In the world of measurements, 6.50 is not the same as 6.5. It may sometimes be critically different. The experimenters usually write down (and publish) the digits they trust. 6.50 is actually a fuzzy interval contained within a bigger and even fuzzier interval, 6.5, with their center points being (probably) the only common feature they share. We definitely do not want such different data items to appear the same.

Conclusion? It is nice to have a special data type that can record the limits of an interval with arbitrarily variable precision. Variable in the sense that each data element records its own precision.

Check this out:

```
test=> select '6.25 .. 6.50'::seg as "pH";
          pH
------------
6.25 .. 6.50
(1 row)
```

[#id](#SEG-SYNTAX)

### F.39.2. Syntax [#](#SEG-SYNTAX)

The external representation of an interval is formed using one or two floating-point numbers joined by the range operator (`..` or `...`). Alternatively, it can be specified as a center point plus or minus a deviation. Optional certainty indicators (`<`, `>` or `~`) can be stored as well. (Certainty indicators are ignored by all the built-in operators, however.) [Table F.28](seg#SEG-REPR-TABLE) gives an overview of allowed representations; [Table F.29](seg#SEG-INPUT-EXAMPLES) shows some examples.

In [Table F.28](seg#SEG-REPR-TABLE), _`x`_, _`y`_, and _`delta`_ denote floating-point numbers. _`x`_ and _`y`_, but not _`delta`_, can be preceded by a certainty indicator.

[#id](#SEG-REPR-TABLE)

**Table F.28. `seg` External Representations**

|                |                                                      |
| -------------- | ---------------------------------------------------- |
| `x`            | Single value (zero-length interval)                  |
| `x .. y`       | Interval from _`x`_ to _`y`_                         |
| `x (+-) delta` | Interval from _`x`_ - _`delta`_ to _`x`_ + _`delta`_ |
| `x ..`         | Open interval with lower bound _`x`_                 |
| `.. x`         | Open interval with upper bound _`x`_                 |

[#id](#SEG-INPUT-EXAMPLES)

**Table F.29. Examples of Valid `seg` Input**

|                  |                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `5.0`            | Creates a zero-length segment (a point, if you will)                                                                          |
| `~5.0`           | Creates a zero-length segment and records `~` in the data. `~` is ignored by `seg` operations, but is preserved as a comment. |
| `<5.0`           | Creates a point at 5.0. `<` is ignored but is preserved as a comment.                                                         |
| `>5.0`           | Creates a point at 5.0. `>` is ignored but is preserved as a comment.                                                         |
| `5(+-)0.3`       | Creates an interval `4.7 .. 5.3`. Note that the `(+-)` notation isn't preserved.                                              |
| `50 ..`          | Everything that is greater than or equal to 50                                                                                |
| `.. 0`           | Everything that is less than or equal to 0                                                                                    |
| `1.5e-2 .. 2E-2` | Creates an interval `0.015 .. 0.02`                                                                                           |
| `1 ... 2`        | The same as `1...2`, or `1 .. 2`, or `1..2` (spaces around the range operator are ignored)                                    |

Because the `...` operator is widely used in data sources, it is allowed as an alternative spelling of the `..` operator. Unfortunately, this creates a parsing ambiguity: it is not clear whether the upper bound in `0...23` is meant to be `23` or `0.23`. This is resolved by requiring at least one digit before the decimal point in all numbers in `seg` input.

As a sanity check, `seg` rejects intervals with the lower bound greater than the upper, for example `5 .. 2`.

[#id](#SEG-PRECISION)

### F.39.3. Precision [#](#SEG-PRECISION)

`seg` values are stored internally as pairs of 32-bit floating point numbers. This means that numbers with more than 7 significant digits will be truncated.

Numbers with 7 or fewer significant digits retain their original precision. That is, if your query returns 0.00, you will be sure that the trailing zeroes are not the artifacts of formatting: they reflect the precision of the original data. The number of leading zeroes does not affect precision: the value 0.0067 is considered to have just 2 significant digits.

[#id](#SEG-USAGE)

### F.39.4. Usage [#](#SEG-USAGE)

The `seg` module includes a GiST index operator class for `seg` values. The operators supported by the GiST operator class are shown in [Table F.30](seg#SEG-GIST-OPERATORS).

[#id](#SEG-GIST-OPERATORS)

**Table F.30. Seg GiST Operators**

<figure class="table-wrapper">
<table class="table" summary="Seg GiST Operators" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Operator</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">seg</code> <code class="literal">&lt;&lt;</code>
          <code class="type">seg</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Is the first <code class="type">seg</code> entirely to the left of the second? [a, b]
          &lt;&lt; [c, d] is true if b &lt; c.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">seg</code> <code class="literal">&gt;&gt;</code>
          <code class="type">seg</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Is the first <code class="type">seg</code> entirely to the right of the second? [a, b]
          &gt;&gt; [c, d] is true if a &gt; d.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">seg</code> <code class="literal">&amp;&lt;</code>
          <code class="type">seg</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does the first <code class="type">seg</code> not extend to the right of the second? [a, b]
          &amp;&lt; [c, d] is true if b &lt;= d.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">seg</code> <code class="literal">&amp;&gt;</code>
          <code class="type">seg</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does the first <code class="type">seg</code> not extend to the left of the second? [a, b]
          &amp;&gt; [c, d] is true if a &gt;= c.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">seg</code> <code class="literal">=</code>
          <code class="type">seg</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Are the two <code class="type">seg</code>s equal?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">seg</code> <code class="literal">&amp;&amp;</code>
          <code class="type">seg</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Do the two <code class="type">seg</code>s overlap?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">seg</code> <code class="literal">@&gt;</code>
          <code class="type">seg</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the first <code class="type">seg</code> contain the second?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">seg</code> <code class="literal">&lt;@</code>
          <code class="type">seg</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the first <code class="type">seg</code> contained in the second?</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

In addition to the above operators, the usual comparison operators shown in [Table 9.1](functions-comparison#FUNCTIONS-COMPARISON-OP-TABLE) are available for type `seg`. These operators first compare (a) to (c), and if these are equal, compare (b) to (d). That results in reasonably good sorting in most cases, which is useful if you want to use ORDER BY with this type.

[#id](#SEG-NOTES)

### F.39.5. Notes [#](#SEG-NOTES)

For examples of usage, see the regression test `sql/seg.sql`.

The mechanism that converts `(+-)` to regular ranges isn't completely accurate in determining the number of significant digits for the boundaries. For example, it adds an extra digit to the lower boundary if the resulting interval includes a power of ten:

```
postgres=> select '10(+-)1'::seg as seg;
      seg
---------
9.0 .. 11             -- should be: 9 .. 11
```

The performance of an R-tree index can largely depend on the initial order of input values. It may be very helpful to sort the input table on the `seg` column; see the script `sort-segments.pl` for an example.

[#id](#SEG-CREDITS)

### F.39.6. Credits [#](#SEG-CREDITS)

Original author: Gene Selkov, Jr. `<selkovjr@mcs.anl.gov>`, Mathematics and Computer Science Division, Argonne National Laboratory.

My thanks are primarily to Prof. Joe Hellerstein ([https://dsf.berkeley.edu/jmh/](https://dsf.berkeley.edu/jmh/)) for elucidating the gist of the GiST ([http://gist.cs.berkeley.edu/](http://gist.cs.berkeley.edu/)). I am also grateful to all Postgres developers, present and past, for enabling myself to create my own world and live undisturbed in it. And I would like to acknowledge my gratitude to Argonne Lab and to the U.S. Department of Energy for the years of faithful support of my database research.

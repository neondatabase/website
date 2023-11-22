[#id](#FUNCTIONS-WINDOW)

## 9.22. Window Functions [#](#FUNCTIONS-WINDOW)

_Window functions_ provide the ability to perform calculations across sets of rows that are related to the current query row. See [Section 3.5](tutorial-window) for an introduction to this feature, and [Section 4.2.8](sql-expressions#SYNTAX-WINDOW-FUNCTIONS) for syntax details.

The built-in window functions are listed in [Table 9.64](functions-window#FUNCTIONS-WINDOW-TABLE). Note that these functions _must_ be invoked using window function syntax, i.e., an `OVER` clause is required.

In addition to these functions, any built-in or user-defined ordinary aggregate (i.e., not ordered-set or hypothetical-set aggregates) can be used as a window function; see [Section 9.21](functions-aggregate) for a list of the built-in aggregates. Aggregate functions act as window functions only when an `OVER` clause follows the call; otherwise they act as plain aggregates and return a single row for the entire set.

[#id](#FUNCTIONS-WINDOW-TABLE)

**Table 9.64. General-Purpose Window Functions**

<figure class="table-wrapper">
  <table class="table" summary="General-Purpose Window Functions" border="1">
    <colgroup>
      <col />
    </colgroup>
    <thead>
      <tr>
        <th class="func_table_entry">
          <div class="func_signature">Function</div>
          <div>Description</div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.1.1.1.1" class="indexterm"></a>
            <code class="function">row_number</code> () → <code class="returnvalue">bigint</code>
          </div>
          <div>Returns the number of the current row within its partition, counting from 1.</div>
        </td>
      </tr>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.2.1.1.1" class="indexterm"></a>
            <code class="function">rank</code> () → <code class="returnvalue">bigint</code>
          </div>
          <div>
            Returns the rank of the current row, with gaps; that is, the
            <code class="function">row_number</code> of the first row in its peer group.
          </div>
        </td>
      </tr>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.3.1.1.1" class="indexterm"></a>
            <code class="function">dense_rank</code> () → <code class="returnvalue">bigint</code>
          </div>
          <div>
            Returns the rank of the current row, without gaps; this function effectively counts peer
            groups.
          </div>
        </td>
      </tr>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.4.1.1.1" class="indexterm"></a>
            <code class="function">percent_rank</code> () →
            <code class="returnvalue">double precision</code>
          </div>
          <div>
            Returns the relative rank of the current row, that is (<code class="function">rank</code>
            - 1) / (total partition rows - 1). The value thus ranges from 0 to 1 inclusive.
          </div>
        </td>
      </tr>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.5.1.1.1" class="indexterm"></a>
            <code class="function">cume_dist</code> () →
            <code class="returnvalue">double precision</code>
          </div>
          <div>
            Returns the cumulative distribution, that is (number of partition rows preceding or
            peers with current row) / (total partition rows). The value thus ranges from 1/<em
              class="parameter"><code>N</code></em>
            to 1.
          </div>
        </td>
      </tr>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.6.1.1.1" class="indexterm"></a>
            <code class="function">ntile</code> (
            <em class="parameter"><code>num_buckets</code></em> <code class="type">integer</code> )
            → <code class="returnvalue">integer</code>
          </div>
          <div>
            Returns an integer ranging from 1 to the argument value, dividing the partition as
            equally as possible.
          </div>
        </td>
      </tr>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.7.1.1.1" class="indexterm"></a>
            <code class="function">lag</code> ( <em class="parameter"><code>value</code></em>
            <code class="type">anycompatible</code> [<span class="optional">, <em class="parameter"><code>offset</code></em>
              <code class="type">integer</code> [<span class="optional">, <em class="parameter"><code>default</code></em>
                <code class="type">anycompatible</code> </span>]</span>] ) → <code class="returnvalue">anycompatible</code>
          </div>
          <div>
            Returns <em class="parameter"><code>value</code></em> evaluated at the row that is
            <em class="parameter"><code>offset</code></em> rows before the current row within the
            partition; if there is no such row, instead returns
            <em class="parameter"><code>default</code></em>
            (which must be of a type compatible with
            <em class="parameter"><code>value</code></em>). Both <em class="parameter"><code>offset</code></em> and
            <em class="parameter"><code>default</code></em> are evaluated with respect to the
            current row. If omitted, <em class="parameter"><code>offset</code></em> defaults to 1
            and <em class="parameter"><code>default</code></em> to
            <code class="literal">NULL</code>.
          </div>
        </td>
      </tr>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.8.1.1.1" class="indexterm"></a>
            <code class="function">lead</code> ( <em class="parameter"><code>value</code></em>
            <code class="type">anycompatible</code> [<span class="optional">, <em class="parameter"><code>offset</code></em>
              <code class="type">integer</code> [<span class="optional">, <em class="parameter"><code>default</code></em>
                <code class="type">anycompatible</code> </span>]</span>] ) → <code class="returnvalue">anycompatible</code>
          </div>
          <div>
            Returns <em class="parameter"><code>value</code></em> evaluated at the row that is
            <em class="parameter"><code>offset</code></em> rows after the current row within the
            partition; if there is no such row, instead returns
            <em class="parameter"><code>default</code></em>
            (which must be of a type compatible with
            <em class="parameter"><code>value</code></em>). Both <em class="parameter"><code>offset</code></em> and
            <em class="parameter"><code>default</code></em> are evaluated with respect to the
            current row. If omitted, <em class="parameter"><code>offset</code></em> defaults to 1
            and <em class="parameter"><code>default</code></em> to
            <code class="literal">NULL</code>.
          </div>
        </td>
      </tr>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.9.1.1.1" class="indexterm"></a>
            <code class="function">first_value</code> (
            <em class="parameter"><code>value</code></em> <code class="type">anyelement</code> ) →
            <code class="returnvalue">anyelement</code>
          </div>
          <div>
            Returns <em class="parameter"><code>value</code></em> evaluated at the row that is the
            first row of the window frame.
          </div>
        </td>
      </tr>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.10.1.1.1" class="indexterm"></a>
            <code class="function">last_value</code> (
            <em class="parameter"><code>value</code></em> <code class="type">anyelement</code> ) →
            <code class="returnvalue">anyelement</code>
          </div>
          <div>
            Returns <em class="parameter"><code>value</code></em> evaluated at the row that is the
            last row of the window frame.
          </div>
        </td>
      </tr>
      <tr>
        <td class="func_table_entry">
          <div class="func_signature">
            <a id="id-1.5.8.28.6.2.2.11.1.1.1" class="indexterm"></a>
            <code class="function">nth_value</code> ( <em class="parameter"><code>value</code></em>
            <code class="type">anyelement</code>, <em class="parameter"><code>n</code></em>
            <code class="type">integer</code> ) → <code class="returnvalue">anyelement</code>
          </div>
          <div>
            Returns <em class="parameter"><code>value</code></em> evaluated at the row that is the
            <em class="parameter"><code>n</code></em>'th row of the window frame (counting from 1); returns
            <code class="literal">NULL</code> if there is no such row.
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</figure>

All of the functions listed in [Table 9.64](functions-window#FUNCTIONS-WINDOW-TABLE) depend on the sort ordering specified by the `ORDER BY` clause of the associated window definition. Rows that are not distinct when considering only the `ORDER BY` columns are said to be _peers_. The four ranking functions (including `cume_dist`) are defined so that they give the same answer for all rows of a peer group.

Note that `first_value`, `last_value`, and `nth_value` consider only the rows within the “window frame”, which by default contains the rows from the start of the partition through the last peer of the current row. This is likely to give unhelpful results for `last_value` and sometimes also `nth_value`. You can redefine the frame by adding a suitable frame specification (`RANGE`, `ROWS` or `GROUPS`) to the `OVER` clause. See [Section 4.2.8](sql-expressions#SYNTAX-WINDOW-FUNCTIONS) for more information about frame specifications.

When an aggregate function is used as a window function, it aggregates over the rows within the current row's window frame. An aggregate used with `ORDER BY` and the default window frame definition produces a “running sum” type of behavior, which may or may not be what's wanted. To obtain aggregation over the whole partition, omit `ORDER BY` or use `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. Other frame specifications can be used to obtain other effects.

### Note

The SQL standard defines a `RESPECT NULLS` or `IGNORE NULLS` option for `lead`, `lag`, `first_value`, `last_value`, and `nth_value`. This is not implemented in PostgreSQL: the behavior is always the same as the standard's default, namely `RESPECT NULLS`. Likewise, the standard's `FROM FIRST` or `FROM LAST` option for `nth_value` is not implemented: only the default `FROM FIRST` behavior is supported. (You can achieve the result of `FROM LAST` by reversing the `ORDER BY` ordering.)

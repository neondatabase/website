[#id](#FUNCTIONS-ARRAY)

## 9.19. Array Functions and Operators [#](#FUNCTIONS-ARRAY)

[Table 9.53](functions-array#ARRAY-OPERATORS-TABLE) shows the specialized operators available for array types. In addition to those, the usual comparison operators shown in [Table 9.1](functions-comparison#FUNCTIONS-COMPARISON-OP-TABLE) are available for arrays. The comparison operators compare the array contents element-by-element, using the default B-tree comparison function for the element data type, and sort based on the first difference. In multidimensional arrays the elements are visited in row-major order (last subscript varies most rapidly). If the contents of two arrays are equal but the dimensionality is different, the first difference in the dimensionality information determines the sort order.

[#id](#ARRAY-OPERATORS-TABLE)

**Table 9.53. Array Operators**

<figure class="table-wrapper">
<table class="table" summary="Array Operators" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Operator</div>
        <div>Description</div>
        <div>Example(s)</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyarray</code> <code class="literal">@&gt;</code>
          <code class="type">anyarray</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does the first array contain the second, that is, does each element appearing in the
          second array equal some element of the first array? (Duplicates are not treated specially,
          thus <code class="literal">ARRAY[1]</code> and <code class="literal">ARRAY[1,1]</code> are
          each considered to contain the other.)
        </div>
        <div>
          <code class="literal">ARRAY[1,4,3] @&gt; ARRAY[3,1,3]</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyarray</code> <code class="literal">&lt;@</code>
          <code class="type">anyarray</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the first array contained by the second?</div>
        <div>
          <code class="literal">ARRAY[2,2,7] &lt;@ ARRAY[1,7,4,2,6]</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyarray</code> <code class="literal">&amp;&amp;</code>
          <code class="type">anyarray</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Do the arrays overlap, that is, have any elements in common?</div>
        <div>
          <code class="literal">ARRAY[1,4,3] &amp;&amp; ARRAY[2,1]</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anycompatiblearray</code> <code class="literal">||</code>
          <code class="type">anycompatiblearray</code> →
          <code class="returnvalue">anycompatiblearray</code>
        </div>
        <div>
          Concatenates the two arrays. Concatenating a null or empty array is a no-op; otherwise the
          arrays must have the same number of dimensions (as illustrated by the first example) or
          differ in number of dimensions by one (as illustrated by the second). If the arrays are
          not of identical element types, they will be coerced to a common type (see
          <a
            class="xref"
            href="typeconv-union-case.html"
            title="10.5. UNION, CASE, and Related Constructs">Section 10.5</a>).
        </div>
        <div>
          <code class="literal">ARRAY[1,2,3] || ARRAY[4,5,6,7]</code>
          → <code class="returnvalue">{1,2,3,4,5,6,7}</code>
        </div>
        <div>
          <code class="literal">ARRAY[1,2,3] || ARRAY[[4,5,6],[7,8,9.9]]</code>
          → <code class="returnvalue">\{\{1,2,3},\{4,5,6},\{7,8,9.9}}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anycompatible</code> <code class="literal">||</code>
          <code class="type">anycompatiblearray</code> →
          <code class="returnvalue">anycompatiblearray</code>
        </div>
        <div>
          Concatenates an element onto the front of an array (which must be empty or
          one-dimensional).
        </div>
        <div>
          <code class="literal">3 || ARRAY[4,5,6]</code>
          → <code class="returnvalue">{3,4,5,6}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anycompatiblearray</code> <code class="literal">||</code>
          <code class="type">anycompatible</code> →
          <code class="returnvalue">anycompatiblearray</code>
        </div>
        <div>
          Concatenates an element onto the end of an array (which must be empty or one-dimensional).
        </div>
        <div>
          <code class="literal">ARRAY[4,5,6] || 7</code>
          → <code class="returnvalue">{4,5,6,7}</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

See [Section 8.15](arrays) for more details about array operator behavior. See [Section 11.2](indexes-types) for more details about which operators support indexed operations.

[Table 9.54](functions-array#ARRAY-FUNCTIONS-TABLE) shows the functions available for use with array types. See [Section 8.15](arrays) for more information and examples of the use of these functions.

[#id](#ARRAY-FUNCTIONS-TABLE)

**Table 9.54. Array Functions**

<figure class="table-wrapper">
<table class="table" summary="Array Functions" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function</div>
        <div>Description</div>
        <div>Example(s)</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">array_append</code> ( <code class="type">anycompatiblearray</code>,
          <code class="type">anycompatible</code> ) →
          <code class="returnvalue">anycompatiblearray</code>
        </div>
        <div>
          Appends an element to the end of an array (same as the
          <code class="type">anycompatiblearray</code> <code class="literal">||</code>
          <code class="type">anycompatible</code>
          operator).
        </div>
        <div>
          <code class="literal">array_append(ARRAY[1,2], 3)</code>
          → <code class="returnvalue">{1,2,3}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">array_cat</code> ( <code class="type">anycompatiblearray</code>,
          <code class="type">anycompatiblearray</code> ) →
          <code class="returnvalue">anycompatiblearray</code>
        </div>
        <div>
          Concatenates two arrays (same as the <code class="type">anycompatiblearray</code>
          <code class="literal">||</code> <code class="type">anycompatiblearray</code>
          operator).
        </div>
        <div>
          <code class="literal">array_cat(ARRAY[1,2,3], ARRAY[4,5])</code>
          → <code class="returnvalue">{1,2,3,4,5}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">array_dims</code> ( <code class="type">anyarray</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>Returns a text representation of the array's dimensions.</div>
        <div>
          <code class="literal">array_dims(ARRAY[[1,2,3], [4,5,6]])</code>
          → <code class="returnvalue">[1:2][1:3]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">array_fill</code> ( <code class="type">anyelement</code>,
          <code class="type">integer[]</code> [<span class="optional">, <code class="type">integer[]</code> </span>] ) → <code class="returnvalue">anyarray</code>
        </div>
        <div>
          Returns an array filled with copies of the given value, having dimensions of the lengths
          specified by the second argument. The optional third argument supplies lower-bound values
          for each dimension (which default to all <code class="literal">1</code>).
        </div>
        <div>
          <code class="literal">array_fill(11, ARRAY[2,3])</code>
          → <code class="returnvalue">\{\{11,11,11},\{11,11,11}}</code>
        </div>
        <div>
          <code class="literal">array_fill(7, ARRAY[3], ARRAY[2])</code>
          → <code class="returnvalue">[2:4]={7,7,7}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">array_length</code> ( <code class="type">anyarray</code>,
          <code class="type">integer</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns the length of the requested array dimension. (Produces NULL instead of 0 for empty
          or missing array dimensions.)
        </div>
        <div>
          <code class="literal">array_length(array[1,2,3], 1)</code>
          → <code class="returnvalue">3</code>
        </div>
        <div>
          <code class="literal">array_length(array[]::int[], 1)</code>
          → <code class="returnvalue">NULL</code>
        </div>
        <div>
          <code class="literal">array_length(array['text'], 2)</code>
          → <code class="returnvalue">NULL</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">array_lower</code> ( <code class="type">anyarray</code>,
          <code class="type">integer</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>Returns the lower bound of the requested array dimension.</div>
        <div>
          <code class="literal">array_lower('[0:2]={1,2,3}'::integer[], 1)</code>
          → <code class="returnvalue">0</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">array_ndims</code> ( <code class="type">anyarray</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns the number of dimensions of the array.</div>
        <div>
          <code class="literal">array_ndims(ARRAY[[1,2,3], [4,5,6]])</code>
          → <code class="returnvalue">2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">array_position</code> (
          <code class="type">anycompatiblearray</code>,
          <code class="type">anycompatible</code> [<span class="optional">, <code class="type">integer</code> </span>] ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns the subscript of the first occurrence of the second argument in the array, or
          <code class="literal">NULL</code> if it's not present. If the third argument is given, the
          search begins at that subscript. The array must be one-dimensional. Comparisons are done
          using <code class="literal">IS NOT DISTINCT FROM</code> semantics, so it is possible to
          search for <code class="literal">NULL</code>.
        </div>
        <div>
          <code class="literal">array_position(ARRAY['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'], 'mon')</code>
          → <code class="returnvalue">2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">array_positions</code> (
          <code class="type">anycompatiblearray</code>, <code class="type">anycompatible</code> ) →
          <code class="returnvalue">integer[]</code>
        </div>
        <div>
          Returns an array of the subscripts of all occurrences of the second argument in the array
          given as first argument. The array must be one-dimensional. Comparisons are done using
          <code class="literal">IS NOT DISTINCT FROM</code> semantics, so it is possible to search
          for <code class="literal">NULL</code>. <code class="literal">NULL</code> is returned only
          if the array is <code class="literal">NULL</code>; if the value is not found in the array,
          an empty array is returned.
        </div>
        <div>
          <code class="literal">array_positions(ARRAY['A','A','B','A'], 'A')</code>
          → <code class="returnvalue">{1,2,4}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">array_prepend</code> ( <code class="type">anycompatible</code>,
          <code class="type">anycompatiblearray</code> ) →
          <code class="returnvalue">anycompatiblearray</code>
        </div>
        <div>
          Prepends an element to the beginning of an array (same as the
          <code class="type">anycompatible</code> <code class="literal">||</code>
          <code class="type">anycompatiblearray</code>
          operator).
        </div>
        <div>
          <code class="literal">array_prepend(1, ARRAY[2,3])</code>
          → <code class="returnvalue">{1,2,3}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">array_remove</code> ( <code class="type">anycompatiblearray</code>,
          <code class="type">anycompatible</code> ) →
          <code class="returnvalue">anycompatiblearray</code>
        </div>
        <div>
          Removes all elements equal to the given value from the array. The array must be
          one-dimensional. Comparisons are done using
          <code class="literal">IS NOT DISTINCT FROM</code> semantics, so it is possible to remove
          <code class="literal">NULL</code>s.
        </div>
        <div>
          <code class="literal">array_remove(ARRAY[1,2,3,2], 2)</code>
          → <code class="returnvalue">{1,3}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">array_replace</code> (
          <code class="type">anycompatiblearray</code>, <code class="type">anycompatible</code>,
          <code class="type">anycompatible</code> ) →
          <code class="returnvalue">anycompatiblearray</code>
        </div>
        <div>Replaces each array element equal to the second argument with the third argument.</div>
        <div>
          <code class="literal">array_replace(ARRAY[1,2,5,4], 5, 3)</code>
          → <code class="returnvalue">{1,2,3,4}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">array_sample</code> (
          <em class="parameter"><code>array</code></em> <code class="type">anyarray</code>,
          <em class="parameter"><code>n</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">anyarray</code>
        </div>
        <div>
          Returns an array of <em class="parameter"><code>n</code></em> items randomly selected from
          <em class="parameter"><code>array</code></em>. <em class="parameter"><code>n</code></em> may not exceed the length of
          <em class="parameter"><code>array</code></em>'s first dimension. If <em class="parameter"><code>array</code></em> is
          multi-dimensional, an <span class="quote">“<span class="quote">item</span>”</span> is a
          slice having a given first subscript.
        </div>
        <div>
          <code class="literal">array_sample(ARRAY[1,2,3,4,5,6], 3)</code>
          → <code class="returnvalue">{2,6,1}</code>
        </div>
        <div>
          <code class="literal">array_sample(ARRAY[[1,2],[3,4],[5,6]], 2)</code>
          → <code class="returnvalue">\{\{5,6},\{1,2}}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.14.1.1.1" class="indexterm"></a>
          <code class="function">array_shuffle</code> ( <code class="type">anyarray</code> ) →
          <code class="returnvalue">anyarray</code>
        </div>
        <div>Randomly shuffles the first dimension of the array.</div>
        <div>
          <code class="literal">array_shuffle(ARRAY[[1,2],[3,4],[5,6]])</code>
          → <code class="returnvalue">\{\{5,6},\{1,2},\{3,4}}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="FUNCTION-ARRAY-TO-STRING" class="indexterm"></a>
          <code class="function">array_to_string</code> (
          <em class="parameter"><code>array</code></em> <code class="type">anyarray</code>,
          <em class="parameter"><code>delimiter</code></em> <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>null_string</code></em>
            <code class="type">text</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Converts each array element to its text representation, and concatenates those separated
          by the <em class="parameter"><code>delimiter</code></em> string. If
          <em class="parameter"><code>null_string</code></em> is given and is not
          <code class="literal">NULL</code>, then <code class="literal">NULL</code> array entries
          are represented by that string; otherwise, they are omitted. See also
          <a class="link" href="functions-string.html#FUNCTION-STRING-TO-ARRAY"><code class="function">string_to_array</code></a>.
        </div>
        <div>
          <code class="literal">array_to_string(ARRAY[1, 2, 3, NULL, 5], ",", "\*") </code>
          → <code class="returnvalue">1,2,3,*,5</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.16.1.1.1" class="indexterm"></a>
          <code class="function">array_upper</code> ( <code class="type">anyarray</code>,
          <code class="type">integer</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>Returns the upper bound of the requested array dimension.</div>
        <div>
          <code class="literal">array_upper(ARRAY[1,8,3,7], 1)</code>
          → <code class="returnvalue">4</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.17.1.1.1" class="indexterm"></a>
          <code class="function">cardinality</code> ( <code class="type">anyarray</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns the total number of elements in the array, or 0 if the array is empty.</div>
        <div>
          <code class="literal">cardinality(ARRAY[[1,2],[3,4]])</code>
          → <code class="returnvalue">4</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.18.1.1.1" class="indexterm"></a>
          <code class="function">trim_array</code> ( <em class="parameter"><code>array</code></em>
          <code class="type">anyarray</code>, <em class="parameter"><code>n</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">anyarray</code>
        </div>
        <div>
          Trims an array by removing the last <em class="parameter"><code>n</code></em> elements. If
          the array is multidimensional, only the first dimension is trimmed.
        </div>
        <div>
          <code class="literal">trim_array(ARRAY[1,2,3,4,5,6], 2)</code>
          → <code class="returnvalue">{1,2,3,4}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.25.6.2.2.19.1.1.1" class="indexterm"></a>
          <code class="function">unnest</code> ( <code class="type">anyarray</code> ) →
          <code class="returnvalue">setof anyelement</code>
        </div>
        <div>
          Expands an array into a set of rows. The array's elements are read out in storage order.
        </div>
        <div>
          <code class="literal">unnest(ARRAY[1,2])</code>
          → <code class="returnvalue"></code>
        </div>
        <div>
        <pre class="programlisting">
 1
 2
</pre>
</div>
        <div>
          <code class="literal">unnest(ARRAY[['foo','bar'],['baz','quux']])</code>
          → <code class="returnvalue"></code>
        </div>
        <div>
        <pre class="programlisting">
 foo
 bar
 baz
 quux
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">unnest</code> ( <code class="type">anyarray</code>,
          <code class="type">anyarray</code> [<span class="optional">, ... </span>] ) →
          <code class="returnvalue">setof anyelement, anyelement [, ... ]</code>
        </div>
        <div>
          Expands multiple arrays (possibly of different data types) into a set of rows. If the
          arrays are not all the same length then the shorter ones are padded with
          <code class="literal">NULL</code>s. This form is only allowed in a query's FROM clause;
          see
          <a
            class="xref"
            href="queries-table-expressions.html#QUERIES-TABLEFUNCTIONS"
            title="7.2.1.4. Table Functions">Section 7.2.1.4</a>.
        </div>
        <div>
          <code class="literal">select* from unnest(ARRAY[1,2], ARRAY['foo','bar','baz']) as x(a,b)</code>
          → <code class="returnvalue"></code>
        </div>
        <div>
        <pre class="programlisting">
 a |  b
---+-----
 1 | foo
 2 | bar
   | baz
</pre>
</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

See also [Section 9.21](functions-aggregate) about the aggregate function `array_agg` for use with arrays.

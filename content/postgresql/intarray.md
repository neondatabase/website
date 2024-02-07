[#id](#INTARRAY)

## F.20. intarray — manipulate arrays of integers [#](#INTARRAY)

- [F.20.1. `intarray` Functions and Operators](intarray#INTARRAY-FUNCS-OPS)
- [F.20.2. Index Support](intarray#INTARRAY-INDEX)
- [F.20.3. Example](intarray#INTARRAY-EXAMPLE)
- [F.20.4. Benchmark](intarray#INTARRAY-BENCHMARK)
- [F.20.5. Authors](intarray#INTARRAY-AUTHORS)

The `intarray` module provides a number of useful functions and operators for manipulating null-free arrays of integers. There is also support for indexed searches using some of the operators.

All of these operations will throw an error if a supplied array contains any NULL elements.

Many of these operations are only sensible for one-dimensional arrays. Although they will accept input arrays of more dimensions, the data is treated as though it were a linear array in storage order.

This module is considered “trusted”, that is, it can be installed by non-superusers who have `CREATE` privilege on the current database.

[#id](#INTARRAY-FUNCS-OPS)

### F.20.1. `intarray` Functions and Operators [#](#INTARRAY-FUNCS-OPS)

The functions provided by the `intarray` module are shown in [Table F.9](intarray#INTARRAY-FUNC-TABLE), the operators in [Table F.10](intarray#INTARRAY-OP-TABLE).

[#id](#INTARRAY-FUNC-TABLE)

**Table F.9. `intarray` Functions**

<figure class="table-wrapper">
<table class="table" summary="intarray Functions" border="1">
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
          <a id="id-1.11.7.30.7.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">icount</code> ( <code class="type">integer[]</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns the number of elements in the array.</div>
        <div>
          <code class="literal">icount('{1,2,3}'::integer[])</code>
          → <code class="returnvalue">3</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.30.7.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">sort</code> ( <code class="type">integer[]</code>,
          <em class="parameter"><code>dir</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">integer[]</code>
        </div>
        <div>
          Sorts the array in either ascending or descending order.
          <em class="parameter"><code>dir</code></em> must be <code class="literal">asc</code> or
          <code class="literal">desc</code>.
        </div>
        <div>
          <code class="literal">sort('{1,3,2}'::integer[], 'desc')</code>
          → <code class="returnvalue">{3,2,1}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">sort</code> ( <code class="type">integer[]</code> ) →
          <code class="returnvalue">integer[]</code>
        </div>
        <div class="func_signature">
          <a id="id-1.11.7.30.7.3.2.2.3.1.2.1" class="indexterm"></a>
          <code class="function">sort_asc</code> ( <code class="type">integer[]</code> ) →
          <code class="returnvalue">integer[]</code>
        </div>
        <div>Sorts in ascending order.</div>
        <div>
          <code class="literal">sort(array[11,77,44])</code>
          → <code class="returnvalue">{11,44,77}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.30.7.3.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">sort_desc</code> ( <code class="type">integer[]</code> ) →
          <code class="returnvalue">integer[]</code>
        </div>
        <div>Sorts in descending order.</div>
        <div>
          <code class="literal">sort_desc(array[11,77,44])</code>
          → <code class="returnvalue">{77,44,11}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.30.7.3.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">uniq</code> ( <code class="type">integer[]</code> ) →
          <code class="returnvalue">integer[]</code>
        </div>
        <div>
          Removes adjacent duplicates. Often used with <code class="function">sort</code> to remove
          all duplicates.
        </div>
        <div>
          <code class="literal">uniq('{1,2,2,3,1,1}'::integer[])</code>
          → <code class="returnvalue">{1,2,3,1}</code>
        </div>
        <div>
          <code class="literal">uniq(sort('{1,2,3,2,1}'::integer[]))</code>
          → <code class="returnvalue">{1,2,3}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.30.7.3.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">idx</code> ( <code class="type">integer[]</code>,
          <em class="parameter"><code>item</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns index of the first array element matching
          <em class="parameter"><code>item</code></em>, or 0 if no match.
        </div>
        <div>
          <code class="literal">idx(array[11,22,33,22,11], 22)</code>
          → <code class="returnvalue">2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.30.7.3.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">subarray</code> ( <code class="type">integer[]</code>,
          <em class="parameter"><code>start</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>len</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">integer[]</code>
        </div>
        <div>
          Extracts the portion of the array starting at position
          <em class="parameter"><code>start</code></em>, with <em class="parameter"><code>len</code></em>
          elements.
        </div>
        <div>
          <code class="literal">subarray('{1,2,3,2,1}'::integer[], 2, 3)</code>
          → <code class="returnvalue">{2,3,2}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">subarray</code> ( <code class="type">integer[]</code>,
          <em class="parameter"><code>start</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">integer[]</code>
        </div>
        <div>
          Extracts the portion of the array starting at position
          <em class="parameter"><code>start</code></em>.
        </div>
        <div>
          <code class="literal">subarray('{1,2,3,2,1}'::integer[], 2)</code>
          → <code class="returnvalue">{2,3,2,1}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.30.7.3.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">intset</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">integer[]</code>
        </div>
        <div>Makes a single-element array.</div>
        <div>
          <code class="literal">intset(42)</code>
          → <code class="returnvalue">{42}</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#INTARRAY-OP-TABLE)

**Table F.10. `intarray` Operators**

<figure class="table-wrapper">
<table class="table" summary="intarray Operators" border="1">
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
          <code class="type">integer[]</code> <code class="literal">&amp;&amp;</code>
          <code class="type">integer[]</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Do arrays overlap (have at least one element in common)?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">@&gt;</code>
          <code class="type">integer[]</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does left array contain right array?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">&lt;@</code>
          <code class="type">integer[]</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is left array contained in right array?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type"></code> <code class="literal">#</code>
          <code class="type">integer[]</code> → <code class="returnvalue">integer</code>
        </div>
        <div>Returns the number of elements in the array.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">#</code>
          <code class="type">integer</code> → <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns index of the first array element matching the right argument, or 0 if no match.
          (Same as <code class="function">idx</code> function.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">+</code>
          <code class="type">integer</code> → <code class="returnvalue">integer[]</code>
        </div>
        <div>Adds element to end of array.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">+</code>
          <code class="type">integer[]</code> → <code class="returnvalue">integer[]</code>
        </div>
        <div>Concatenates the arrays.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">-</code>
          <code class="type">integer</code> → <code class="returnvalue">integer[]</code>
        </div>
        <div>Removes entries matching the right argument from the array.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">-</code>
          <code class="type">integer[]</code> → <code class="returnvalue">integer[]</code>
        </div>
        <div>Removes elements of the right array from the left array.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">|</code>
          <code class="type">integer</code> → <code class="returnvalue">integer[]</code>
        </div>
        <div>Computes the union of the arguments.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">|</code>
          <code class="type">integer[]</code> → <code class="returnvalue">integer[]</code>
        </div>
        <div>Computes the union of the arguments.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">&amp;</code>
          <code class="type">integer[]</code> → <code class="returnvalue">integer[]</code>
        </div>
        <div>Computes the intersection of the arguments.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">integer[]</code> <code class="literal">@@</code>
          <code class="type">query_int</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does array satisfy query? (see below)</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">query_int</code> <code class="literal">~~</code>
          <code class="type">integer[]</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does array satisfy query? (commutator of <code class="literal">@@</code>)</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

The operators `&&`, `@>` and `<@` are equivalent to PostgreSQL's built-in operators of the same names, except that they work only on integer arrays that do not contain nulls, while the built-in operators work for any array type. This restriction makes them faster than the built-in operators in many cases.

The `@@` and `~~` operators test whether an array satisfies a _query_, which is expressed as a value of a specialized data type `query_int`. A _query_ consists of integer values that are checked against the elements of the array, possibly combined using the operators `&` (AND), `|` (OR), and `!` (NOT). Parentheses can be used as needed. For example, the query `1&(2|3)` matches arrays that contain 1 and also contain either 2 or 3.

[#id](#INTARRAY-INDEX)

### F.20.2. Index Support [#](#INTARRAY-INDEX)

`intarray` provides index support for the `&&`, `@>`, and `@@` operators, as well as regular array equality.

Two parameterized GiST index operator classes are provided: `gist__int_ops` (used by default) is suitable for small- to medium-size data sets, while `gist__intbig_ops` uses a larger signature and is more suitable for indexing large data sets (i.e., columns containing a large number of distinct array values). The implementation uses an RD-tree data structure with built-in lossy compression.

`gist__int_ops` approximates an integer set as an array of integer ranges. Its optional integer parameter `numranges` determines the maximum number of ranges in one index key. The default value of `numranges` is 100. Valid values are between 1 and 253. Using larger arrays as GiST index keys leads to a more precise search (scanning a smaller fraction of the index and fewer heap pages), at the cost of a larger index.

`gist__intbig_ops` approximates an integer set as a bitmap signature. Its optional integer parameter `siglen` determines the signature length in bytes. The default signature length is 16 bytes. Valid values of signature length are between 1 and 2024 bytes. Longer signatures lead to a more precise search (scanning a smaller fraction of the index and fewer heap pages), at the cost of a larger index.

There is also a non-default GIN operator class `gin__int_ops`, which supports these operators as well as `<@`.

The choice between GiST and GIN indexing depends on the relative performance characteristics of GiST and GIN, which are discussed elsewhere.

[#id](#INTARRAY-EXAMPLE)

### F.20.3. Example [#](#INTARRAY-EXAMPLE)

```
-- a message can be in one or more “sections”
CREATE TABLE message (mid INT PRIMARY KEY, sections INT[], ...);

-- create specialized index with signature length of 32 bytes
CREATE INDEX message_rdtree_idx ON message USING GIST (sections gist__intbig_ops (siglen = 32));

-- select messages in section 1 OR 2 - OVERLAP operator
SELECT message.mid FROM message WHERE message.sections && '{1,2}';

-- select messages in sections 1 AND 2 - CONTAINS operator
SELECT message.mid FROM message WHERE message.sections @> '{1,2}';

-- the same, using QUERY operator
SELECT message.mid FROM message WHERE message.sections @@ '1&2'::query_int;
```

[#id](#INTARRAY-BENCHMARK)

### F.20.4. Benchmark [#](#INTARRAY-BENCHMARK)

The source directory `contrib/intarray/bench` contains a benchmark test suite, which can be run against an installed PostgreSQL server. (It also requires `DBD::Pg` to be installed.) To run:

```
cd .../contrib/intarray/bench
createdb TEST
psql -c "CREATE EXTENSION intarray" TEST
./create_test.pl | psql TEST
./bench.pl
```

The `bench.pl` script has numerous options, which are displayed when it is run without any arguments.

[#id](#INTARRAY-AUTHORS)

### F.20.5. Authors [#](#INTARRAY-AUTHORS)

All work was done by Teodor Sigaev (`<teodor@sigaev.ru>`) and Oleg Bartunov (`<oleg@sai.msu.su>`). See [http://www.sai.msu.su/~megera/postgres/gist/](http://www.sai.msu.su/~megera/postgres/gist/) for additional information. Andrey Oktyabrski did a great work on adding new functions and operations.

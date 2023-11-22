[#id](#FUNCTIONS-AGGREGATE)

## 9.21. Aggregate Functions [#](#FUNCTIONS-AGGREGATE)

_Aggregate functions_ compute a single result from a set of input values. The built-in general-purpose aggregate functions are listed in [Table 9.59](functions-aggregate#FUNCTIONS-AGGREGATE-TABLE) while statistical aggregates are in [Table 9.60](functions-aggregate#FUNCTIONS-AGGREGATE-STATISTICS-TABLE). The built-in within-group ordered-set aggregate functions are listed in [Table 9.61](functions-aggregate#FUNCTIONS-ORDEREDSET-TABLE) while the built-in within-group hypothetical-set ones are in [Table 9.62](functions-aggregate#FUNCTIONS-HYPOTHETICAL-TABLE). Grouping operations, which are closely related to aggregate functions, are listed in [Table 9.63](functions-aggregate#FUNCTIONS-GROUPING-TABLE). The special syntax considerations for aggregate functions are explained in [Section 4.2.7](sql-expressions#SYNTAX-AGGREGATES). Consult [Section 2.7](tutorial-agg) for additional introductory information.

Aggregate functions that support _Partial Mode_ are eligible to participate in various optimizations, such as parallel aggregation.

[#id](#FUNCTIONS-AGGREGATE-TABLE)

**Table 9.59. General-Purpose Aggregate Functions**

<figure class="table-wrapper">
<table class="table" summary="General-Purpose Aggregate Functions" border="1">
  <colgroup>
    <col class="col1" />
    <col class="col2" />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function</div>
        <div>Description</div>
      </th>
      <th>Partial Mode</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.1.1.1.1" class="indexterm"></a>
          <code class="function">any_value</code> ( <code class="type">anyelement</code> ) →
          <code class="returnvalue"><em class="replaceable"><code>same as input type</code></em></code>
        </div>
        <div>Returns an arbitrary value from the non-null input values.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.2.1.1.1" class="indexterm"></a>
          <code class="function">array_agg</code> ( <code class="type">anynonarray</code> ) →
          <code class="returnvalue">anyarray</code>
        </div>
        <div>Collects all the input values, including nulls, into an array.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">array_agg</code> ( <code class="type">anyarray</code> ) →
          <code class="returnvalue">anyarray</code>
        </div>
        <div>
          Concatenates all the input arrays into an array of one higher dimension. (The inputs must
          all have the same dimensionality, and cannot be empty or null.)
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.4.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.5.2.4.4.1.1.2" class="indexterm"></a>
          <code class="function">avg</code> ( <code class="type">smallint</code> ) →
          <code class="returnvalue">numeric</code>
        </div>
        <div class="func_signature">
          <code class="function">avg</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">numeric</code>
        </div>
        <div class="func_signature">
          <code class="function">avg</code> ( <code class="type">bigint</code> ) →
          <code class="returnvalue">numeric</code>
        </div>
        <div class="func_signature">
          <code class="function">avg</code> ( <code class="type">numeric</code> ) →
          <code class="returnvalue">numeric</code>
        </div>
        <div class="func_signature">
          <code class="function">avg</code> ( <code class="type">real</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div class="func_signature">
          <code class="function">avg</code> ( <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div class="func_signature">
          <code class="function">avg</code> ( <code class="type">interval</code> ) →
          <code class="returnvalue">interval</code>
        </div>
        <div>Computes the average (arithmetic mean) of all the non-null input values.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.5.1.1.1" class="indexterm"></a>
          <code class="function">bit_and</code> ( <code class="type">smallint</code> ) →
          <code class="returnvalue">smallint</code>
        </div>
        <div class="func_signature">
          <code class="function">bit_and</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div class="func_signature">
          <code class="function">bit_and</code> ( <code class="type">bigint</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div class="func_signature">
          <code class="function">bit_and</code> ( <code class="type">bit</code> ) →
          <code class="returnvalue">bit</code>
        </div>
        <div>Computes the bitwise AND of all non-null input values.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.6.1.1.1" class="indexterm"></a>
          <code class="function">bit_or</code> ( <code class="type">smallint</code> ) →
          <code class="returnvalue">smallint</code>
        </div>
        <div class="func_signature">
          <code class="function">bit_or</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div class="func_signature">
          <code class="function">bit_or</code> ( <code class="type">bigint</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div class="func_signature">
          <code class="function">bit_or</code> ( <code class="type">bit</code> ) →
          <code class="returnvalue">bit</code>
        </div>
        <div>Computes the bitwise OR of all non-null input values.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.7.1.1.1" class="indexterm"></a>
          <code class="function">bit_xor</code> ( <code class="type">smallint</code> ) →
          <code class="returnvalue">smallint</code>
        </div>
        <div class="func_signature">
          <code class="function">bit_xor</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div class="func_signature">
          <code class="function">bit_xor</code> ( <code class="type">bigint</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div class="func_signature">
          <code class="function">bit_xor</code> ( <code class="type">bit</code> ) →
          <code class="returnvalue">bit</code>
        </div>
        <div>
          Computes the bitwise exclusive OR of all non-null input values. Can be useful as a
          checksum for an unordered set of values.
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.8.1.1.1" class="indexterm"></a>
          <code class="function">bool_and</code> ( <code class="type">boolean</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Returns true if all non-null input values are true, otherwise false.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.9.1.1.1" class="indexterm"></a>
          <code class="function">bool_or</code> ( <code class="type">boolean</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Returns true if any non-null input value is true, otherwise false.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.10.1.1.1" class="indexterm"></a>
          <code class="function">count</code> ( <code class="literal">*</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>Computes the number of input rows.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">count</code> ( <code class="type">"any"</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>Computes the number of input rows in which the input value is not null.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.12.1.1.1" class="indexterm"></a>
          <code class="function">every</code> ( <code class="type">boolean</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>This is the SQL standard's equivalent to <code class="function">bool_and</code>.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.13.1.1.1" class="indexterm"></a>
          <code class="function">json_agg</code> ( <code class="type">anyelement</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.13.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_agg</code> ( <code class="type">anyelement</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Collects all the input values, including nulls, into a JSON array. Values are converted to
          JSON as per <code class="function">to_json</code> or
          <code class="function">to_jsonb</code>.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.14.1.1.1" class="indexterm"></a>
          <code class="function">json_objectagg</code> ( [<span class="optional">
            \{ <em class="replaceable"><code>key_expression</code></em> \{
            <code class="literal">VALUE</code> | ':' }
            <em class="replaceable"><code>value_expression</code></em> } </span>] [<span class="optional">
            \{ <code class="literal">NULL</code> | <code class="literal">ABSENT</code> }
            <code class="literal">ON NULL</code> </span>] [<span class="optional">
            \{ <code class="literal">WITH</code> | <code class="literal">WITHOUT</code> }
            <code class="literal">UNIQUE</code> [<span class="optional">
              <code class="literal">KEYS</code> </span>] </span>] [<span class="optional">
            <code class="literal">RETURNING</code>
            <em class="replaceable"><code>data_type</code></em> [<span class="optional">
              <code class="literal">FORMAT JSON</code> [<span class="optional">
                <code class="literal">ENCODING UTF8</code> </span>] </span>] </span>])
        </div>
        <div>
          Behaves like <code class="function">json_object</code>, but as an aggregate function, so
          it only takes one <em class="replaceable"><code>key_expression</code></em> and one
          <em class="replaceable"><code>value_expression</code></em> parameter.
        </div>
        <div>
          <code class="literal">SELECT json_objectagg(k:v) FROM (VALUES ('a'::text,current_date),('b',current_date +
            1)) AS t(k,v)</code>
          → <code class="returnvalue">\{ "a" : "2022-05-10", "b" : "2022-05-11" }</code>
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.15.1.1.1" class="indexterm"></a>
          <code class="function">json_object_agg</code> (
          <em class="parameter"><code>key</code></em> <code class="type">"any"</code>,
          <em class="parameter"><code>value</code></em> <code class="type">"any"</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.15.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_object_agg</code> (
          <em class="parameter"><code>key</code></em> <code class="type">"any"</code>,
          <em class="parameter"><code>value</code></em> <code class="type">"any"</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Collects all the key/value pairs into a JSON object. Key arguments are coerced to text;
          value arguments are converted as per
          <code class="function">to_json</code> or <code class="function">to_jsonb</code>. Values
          can be null, but keys cannot.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.16.1.1.1" class="indexterm"></a>
          <code class="function">json_object_agg_strict</code> (
          <em class="parameter"><code>key</code></em> <code class="type">"any"</code>,
          <em class="parameter"><code>value</code></em> <code class="type">"any"</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.16.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_object_agg_strict</code> (
          <em class="parameter"><code>key</code></em> <code class="type">"any"</code>,
          <em class="parameter"><code>value</code></em> <code class="type">"any"</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Collects all the key/value pairs into a JSON object. Key arguments are coerced to text;
          value arguments are converted as per
          <code class="function">to_json</code> or <code class="function">to_jsonb</code>. The
          <em class="parameter"><code>key</code></em> can not be null. If the
          <em class="parameter"><code>value</code></em> is null then the entry is skipped,
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.17.1.1.1" class="indexterm"></a>
          <code class="function">json_object_agg_unique</code> (
          <em class="parameter"><code>key</code></em> <code class="type">"any"</code>,
          <em class="parameter"><code>value</code></em> <code class="type">"any"</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.17.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_object_agg_unique</code> (
          <em class="parameter"><code>key</code></em> <code class="type">"any"</code>,
          <em class="parameter"><code>value</code></em> <code class="type">"any"</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Collects all the key/value pairs into a JSON object. Key arguments are coerced to text;
          value arguments are converted as per
          <code class="function">to_json</code> or <code class="function">to_jsonb</code>. Values
          can be null, but keys cannot. If there is a duplicate key an error is thrown.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.18.1.1.1" class="indexterm"></a>
          <code class="function">json_arrayagg</code> ( [<span class="optional"><em class="replaceable"><code>value_expression</code></em> </span>] [<span class="optional"><code class="literal">ORDER BY</code><em class="replaceable"><code>sort_expression</code></em> </span>] [<span class="optional">{ <code class="literal">NULL</code> | <code class="literal">ABSENT</code> }<code class="literal">ON NULL</code> </span>] [<span class="optional"><code class="literal">RETURNING</code><em class="replaceable"><code>data_type</code></em> [<span class="optional"><code class="literal">FORMAT JSON</code> [<span class="optional"><code class="literal">ENCODING UTF8</code> </span>] </span>] </span>])
        </div>
        <div>
          Behaves in the same way as <code class="function">json_array</code>
          but as an aggregate function so it only takes one
          <em class="replaceable"><code>value_expression</code></em> parameter. If
          <code class="literal">ABSENT ON NULL</code> is specified, any NULL values are omitted. If
          <code class="literal">ORDER BY</code> is specified, the elements will appear in the array
          in that order rather than in the input order.
        </div>
        <div>
          <code class="literal">SELECT json_arrayagg(v) FROM (VALUES(2),(1)) t(v)</code>
          → <code class="returnvalue">[2, 1]</code>
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.19.1.1.1" class="indexterm"></a>
          <code class="function">json_object_agg_unique_strict</code> (
          <em class="parameter"><code>key</code></em> <code class="type">"any"</code>,
          <em class="parameter"><code>value</code></em> <code class="type">"any"</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.19.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_object_agg_unique_strict</code> (
          <em class="parameter"><code>key</code></em> <code class="type">"any"</code>,
          <em class="parameter"><code>value</code></em> <code class="type">"any"</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Collects all the key/value pairs into a JSON object. Key arguments are coerced to text;
          value arguments are converted as per
          <code class="function">to_json</code> or <code class="function">to_jsonb</code>. The
          <em class="parameter"><code>key</code></em> can not be null. If the
          <em class="parameter"><code>value</code></em> is null then the entry is skipped. If there
          is a duplicate key an error is thrown.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.20.1.1.1" class="indexterm"></a>
          <code class="function">max</code> ( <em class="replaceable"><code>see text</code></em> ) →
          <code class="returnvalue"><em class="replaceable"><code>same as input type</code></em></code>
        </div>
        <div>
          Computes the maximum of the non-null input values. Available for any numeric, string,
          date/time, or enum type, as well as <code class="type">inet</code>,
          <code class="type">interval</code>, <code class="type">money</code>,
          <code class="type">oid</code>, <code class="type">pg_lsn</code>,
          <code class="type">tid</code>, <code class="type">xid8</code>, and arrays of any of these
          types.
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.21.1.1.1" class="indexterm"></a>
          <code class="function">min</code> ( <em class="replaceable"><code>see text</code></em> ) →
          <code class="returnvalue"><em class="replaceable"><code>same as input type</code></em></code>
        </div>
        <div>
          Computes the minimum of the non-null input values. Available for any numeric, string,
          date/time, or enum type, as well as <code class="type">inet</code>,
          <code class="type">interval</code>, <code class="type">money</code>,
          <code class="type">oid</code>, <code class="type">pg_lsn</code>,
          <code class="type">tid</code>, <code class="type">xid8</code>, and arrays of any of these
          types.
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.22.1.1.1" class="indexterm"></a>
          <code class="function">range_agg</code> ( <em class="parameter"><code>value</code></em>
          <code class="type">anyrange</code> ) → <code class="returnvalue">anymultirange</code>
        </div>
        <div class="func_signature">
          <code class="function">range_agg</code> ( <em class="parameter"><code>value</code></em>
          <code class="type">anymultirange</code> ) → <code class="returnvalue">anymultirange</code>
        </div>
        <div>Computes the union of the non-null input values.</div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.23.1.1.1" class="indexterm"></a>
          <code class="function">range_intersect_agg</code> (
          <em class="parameter"><code>value</code></em> <code class="type">anyrange</code> ) →
          <code class="returnvalue">anyrange</code>
        </div>
        <div class="func_signature">
          <code class="function">range_intersect_agg</code> (
          <em class="parameter"><code>value</code></em> <code class="type">anymultirange</code> ) →
          <code class="returnvalue">anymultirange</code>
        </div>
        <div>Computes the intersection of the non-null input values.</div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.24.1.1.1" class="indexterm"></a>
          <code class="function">json_agg_strict</code> ( <code class="type">anyelement</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.24.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_agg_strict</code> ( <code class="type">anyelement</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Collects all the input values, skipping nulls, into a JSON array. Values are converted to
          JSON as per <code class="function">to_json</code> or
          <code class="function">to_jsonb</code>.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.25.1.1.1" class="indexterm"></a>
          <code class="function">string_agg</code> ( <em class="parameter"><code>value</code></em>
          <code class="type">text</code>, <em class="parameter"><code>delimiter</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="function">string_agg</code> ( <em class="parameter"><code>value</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>delimiter</code></em>
          <code class="type">bytea</code> ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Concatenates the non-null input values into a string. Each value after the first is
          preceded by the corresponding <em class="parameter"><code>delimiter</code></em> (if it's
          not null).
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.26.1.1.1" class="indexterm"></a>
          <code class="function">sum</code> ( <code class="type">smallint</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div class="func_signature">
          <code class="function">sum</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div class="func_signature">
          <code class="function">sum</code> ( <code class="type">bigint</code> ) →
          <code class="returnvalue">numeric</code>
        </div>
        <div class="func_signature">
          <code class="function">sum</code> ( <code class="type">numeric</code> ) →
          <code class="returnvalue">numeric</code>
        </div>
        <div class="func_signature">
          <code class="function">sum</code> ( <code class="type">real</code> ) →
          <code class="returnvalue">real</code>
        </div>
        <div class="func_signature">
          <code class="function">sum</code> ( <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div class="func_signature">
          <code class="function">sum</code> ( <code class="type">interval</code> ) →
          <code class="returnvalue">interval</code>
        </div>
        <div class="func_signature">
          <code class="function">sum</code> ( <code class="type">money</code> ) →
          <code class="returnvalue">money</code>
        </div>
        <div>Computes the sum of the non-null input values.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.5.2.4.27.1.1.1" class="indexterm"></a>
          <code class="function">xmlagg</code> ( <code class="type">xml</code> ) →
          <code class="returnvalue">xml</code>
        </div>
        <div>
          Concatenates the non-null XML input values (see
          <a class="xref" href="functions-xml.html#FUNCTIONS-XML-XMLAGG" title="9.15.1.7. xmlagg">Section 9.15.1.7</a>).
        </div>
      </td>
      <td>No</td>
    </tr>
  </tbody>
</table>
</figure>

It should be noted that except for `count`, these functions return a null value when no rows are selected. In particular, `sum` of no rows returns null, not zero as one might expect, and `array_agg` returns null rather than an empty array when there are no input rows. The `coalesce` function can be used to substitute zero or an empty array for null when necessary.

The aggregate functions `array_agg`, `json_agg`, `jsonb_agg`, `json_agg_strict`, `jsonb_agg_strict`, `json_object_agg`, `jsonb_object_agg`, `json_object_agg_strict`, `jsonb_object_agg_strict`, `json_object_agg_unique`, `jsonb_object_agg_unique`, `json_object_agg_unique_strict`, `jsonb_object_agg_unique_strict`, `string_agg`, and `xmlagg`, as well as similar user-defined aggregate functions, produce meaningfully different result values depending on the order of the input values. This ordering is unspecified by default, but can be controlled by writing an `ORDER BY` clause within the aggregate call, as shown in [Section 4.2.7](sql-expressions#SYNTAX-AGGREGATES). Alternatively, supplying the input values from a sorted subquery will usually work. For example:

```

SELECT xmlagg(x) FROM (SELECT x FROM test ORDER BY y DESC) AS tab;
```

Beware that this approach can fail if the outer query level contains additional processing, such as a join, because that might cause the subquery's output to be reordered before the aggregate is computed.

### Note

The boolean aggregates `bool_and` and `bool_or` correspond to the standard SQL aggregates `every` and `any` or `some`. PostgreSQL supports `every`, but not `any` or `some`, because there is an ambiguity built into the standard syntax:

```

SELECT b1 = ANY((SELECT b2 FROM t2 ...)) FROM t1 ...;
```

Here `ANY` can be considered either as introducing a subquery, or as being an aggregate function, if the subquery returns one row with a Boolean value. Thus the standard name cannot be given to these aggregates.

### Note

Users accustomed to working with other SQL database management systems might be disappointed by the performance of the `count` aggregate when it is applied to the entire table. A query like:

```

SELECT count(*) FROM sometable;
```

will require effort proportional to the size of the table: PostgreSQL will need to scan either the entire table or the entirety of an index that includes all rows in the table.

[Table 9.60](functions-aggregate#FUNCTIONS-AGGREGATE-STATISTICS-TABLE) shows aggregate functions typically used in statistical analysis. (These are separated out merely to avoid cluttering the listing of more-commonly-used aggregates.) Functions shown as accepting _`numeric_type`_ are available for all the types `smallint`, `integer`, `bigint`, `numeric`, `real`, and `double precision`. Where the description mentions _`N`_, it means the number of input rows for which all the input expressions are non-null. In all cases, null is returned if the computation is meaningless, for example when _`N`_ is zero.

[#id](#FUNCTIONS-AGGREGATE-STATISTICS-TABLE)

**Table 9.60. Aggregate Functions for Statistics**

<figure class="table-wrapper">
<table class="table" summary="Aggregate Functions for Statistics" border="1">
  <colgroup>
    <col class="col1" />
    <col class="col2" />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function</div>
        <div>Description</div>
      </th>
      <th>Partial Mode</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.1.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.13.2.4.1.1.1.2" class="indexterm"></a>
          <code class="function">corr</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>Computes the correlation coefficient.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.2.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.13.2.4.2.1.1.2" class="indexterm"></a>
          <code class="function">covar_pop</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>Computes the population covariance.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.3.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.13.2.4.3.1.1.2" class="indexterm"></a>
          <code class="function">covar_samp</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>Computes the sample covariance.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.4.1.1.1" class="indexterm"></a>
          <code class="function">regr_avgx</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>
          Computes the average of the independent variable,
          <code class="literal">sum(<em class="parameter"><code>X</code></em>)/<em class="parameter"><code>N</code></em></code>.
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.5.1.1.1" class="indexterm"></a>
          <code class="function">regr_avgy</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>
          Computes the average of the dependent variable,
          <code class="literal">sum(<em class="parameter"><code>Y</code></em>)/<em class="parameter"><code>N</code></em></code>.
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.6.1.1.1" class="indexterm"></a>
          <code class="function">regr_count</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) → <code class="returnvalue">bigint</code>
        </div>
        <div>Computes the number of rows in which both inputs are non-null.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.7.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.13.2.4.7.1.1.2" class="indexterm"></a>
          <code class="function">regr_intercept</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>
          Computes the y-intercept of the least-squares-fit linear equation determined by the (<em
            class="parameter"><code>X</code></em>, <em class="parameter"><code>Y</code></em>) pairs.
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.8.1.1.1" class="indexterm"></a>
          <code class="function">regr_r2</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>Computes the square of the correlation coefficient.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.9.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.13.2.4.9.1.1.2" class="indexterm"></a>
          <code class="function">regr_slope</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>
          Computes the slope of the least-squares-fit linear equation determined by the (<em
            class="parameter"><code>X</code></em>, <em class="parameter"><code>Y</code></em>) pairs.
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.10.1.1.1" class="indexterm"></a>
          <code class="function">regr_sxx</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>
          Computes the <span class="quote">“<span class="quote">sum of squares</span>”</span> of the
          independent variable,
          <code class="literal">sum(<em class="parameter"><code>X</code></em>^2) - sum(<em class="parameter"><code>X</code></em>)^2/<em class="parameter"><code>N</code></em></code>.
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.11.1.1.1" class="indexterm"></a>
          <code class="function">regr_sxy</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>
          Computes the <span class="quote">“<span class="quote">sum of products</span>”</span> of
          independent times dependent variables,
          <code class="literal">sum(<em class="parameter"><code>X</code></em>*<em class="parameter"><code>Y</code></em>) - sum(<em class="parameter"><code>X</code></em>)* sum(<em class="parameter"><code>Y</code></em>)/<em class="parameter"><code>N</code></em></code>.
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.12.1.1.1" class="indexterm"></a>
          <code class="function">regr_syy</code> ( <em class="parameter"><code>Y</code></em>
          <code class="type">double precision</code>, <em class="parameter"><code>X</code></em>
          <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>
          Computes the <span class="quote">“<span class="quote">sum of squares</span>”</span> of the
          dependent variable,
          <code class="literal">sum(<em class="parameter"><code>Y</code></em>^2) - sum(<em class="parameter"><code>Y</code></em>)^2/<em class="parameter"><code>N</code></em></code>.
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.13.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.13.2.4.13.1.1.2" class="indexterm"></a>
          <code class="function">stddev</code> (
          <em class="replaceable"><code>numeric_type</code></em> ) →
          <code class="returnvalue"></code> <code class="type">double precision</code> for
          <code class="type">real</code> or <code class="type">double precision</code>, otherwise
          <code class="type">numeric</code>
        </div>
        <div>This is a historical alias for <code class="function">stddev_samp</code>.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.14.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.13.2.4.14.1.1.2" class="indexterm"></a>
          <code class="function">stddev_pop</code> (
          <em class="replaceable"><code>numeric_type</code></em> ) →
          <code class="returnvalue"></code> <code class="type">double precision</code> for
          <code class="type">real</code> or <code class="type">double precision</code>, otherwise
          <code class="type">numeric</code>
        </div>
        <div>Computes the population standard deviation of the input values.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.15.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.13.2.4.15.1.1.2" class="indexterm"></a>
          <code class="function">stddev_samp</code> (
          <em class="replaceable"><code>numeric_type</code></em> ) →
          <code class="returnvalue"></code> <code class="type">double precision</code> for
          <code class="type">real</code> or <code class="type">double precision</code>, otherwise
          <code class="type">numeric</code>
        </div>
        <div>Computes the sample standard deviation of the input values.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.16.1.1.1" class="indexterm"></a>
          <code class="function">variance</code> (
          <em class="replaceable"><code>numeric_type</code></em> ) →
          <code class="returnvalue"></code> <code class="type">double precision</code> for
          <code class="type">real</code> or <code class="type">double precision</code>, otherwise
          <code class="type">numeric</code>
        </div>
        <div>This is a historical alias for <code class="function">var_samp</code>.</div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.17.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.13.2.4.17.1.1.2" class="indexterm"></a>
          <code class="function">var_pop</code> (
          <em class="replaceable"><code>numeric_type</code></em> ) →
          <code class="returnvalue"></code> <code class="type">double precision</code> for
          <code class="type">real</code> or <code class="type">double precision</code>, otherwise
          <code class="type">numeric</code>
        </div>
        <div>
          Computes the population variance of the input values (square of the population standard
          deviation).
        </div>
      </td>
      <td>Yes</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.13.2.4.18.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.27.13.2.4.18.1.1.2" class="indexterm"></a>
          <code class="function">var_samp</code> (
          <em class="replaceable"><code>numeric_type</code></em> ) →
          <code class="returnvalue"></code> <code class="type">double precision</code> for
          <code class="type">real</code> or <code class="type">double precision</code>, otherwise
          <code class="type">numeric</code>
        </div>
        <div>
          Computes the sample variance of the input values (square of the sample standard
          deviation).
        </div>
      </td>
      <td>Yes</td>
    </tr>
  </tbody>
</table>
</figure>

[Table 9.61](functions-aggregate#FUNCTIONS-ORDEREDSET-TABLE) shows some aggregate functions that use the _ordered-set aggregate_ syntax. These functions are sometimes referred to as “inverse distribution” functions. Their aggregated input is introduced by `ORDER BY`, and they may also take a _direct argument_ that is not aggregated, but is computed only once. All these functions ignore null values in their aggregated input. For those that take a _`fraction`_ parameter, the fraction value must be between 0 and 1; an error is thrown if not. However, a null _`fraction`_ value simply produces a null result.

[#id](#FUNCTIONS-ORDEREDSET-TABLE)

**Table 9.61. Ordered-Set Aggregate Functions**

<figure class="table-wrapper">
<table class="table" summary="Ordered-Set Aggregate Functions" border="1">
  <colgroup>
    <col class="col1" />
    <col class="col2" />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function</div>
        <div>Description</div>
      </th>
      <th>Partial Mode</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.17.2.4.1.1.1.1" class="indexterm"></a>
          <code class="function">mode</code> () <code class="literal">WITHIN GROUP</code> (
          <code class="literal">ORDER BY</code> <code class="type">anyelement</code> ) →
          <code class="returnvalue">anyelement</code>
        </div>
        <div>
          Computes the <em class="firstterm">mode</em>, the most frequent value of the aggregated
          argument (arbitrarily choosing the first one if there are multiple equally-frequent
          values). The aggregated argument must be of a sortable type.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.17.2.4.2.1.1.1" class="indexterm"></a>
          <code class="function">percentile_cont</code> (
          <em class="parameter"><code>fraction</code></em>
          <code class="type">double precision</code> ) <code class="literal">WITHIN GROUP</code> (
          <code class="literal">ORDER BY</code> <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div class="func_signature">
          <code class="function">percentile_cont</code> (
          <em class="parameter"><code>fraction</code></em>
          <code class="type">double precision</code> ) <code class="literal">WITHIN GROUP</code> (
          <code class="literal">ORDER BY</code> <code class="type">interval</code> ) →
          <code class="returnvalue">interval</code>
        </div>
        <div>
          Computes the <em class="firstterm">continuous percentile</em>, a value corresponding to
          the specified <em class="parameter"><code>fraction</code></em>
          within the ordered set of aggregated argument values. This will interpolate between
          adjacent input items if needed.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">percentile_cont</code> (
          <em class="parameter"><code>fractions</code></em>
          <code class="type">double precision[]</code> ) <code class="literal">WITHIN GROUP</code> (
          <code class="literal">ORDER BY</code> <code class="type">double precision</code> ) →
          <code class="returnvalue">double precision[]</code>
        </div>
        <div class="func_signature">
          <code class="function">percentile_cont</code> (
          <em class="parameter"><code>fractions</code></em>
          <code class="type">double precision[]</code> ) <code class="literal">WITHIN GROUP</code> (
          <code class="literal">ORDER BY</code> <code class="type">interval</code> ) →
          <code class="returnvalue">interval[]</code>
        </div>
        <div>
          Computes multiple continuous percentiles. The result is an array of the same dimensions as
          the <em class="parameter"><code>fractions</code></em>
          parameter, with each non-null element replaced by the (possibly interpolated) value
          corresponding to that percentile.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.17.2.4.4.1.1.1" class="indexterm"></a>
          <code class="function">percentile_disc</code> (
          <em class="parameter"><code>fraction</code></em>
          <code class="type">double precision</code> ) <code class="literal">WITHIN GROUP</code> (
          <code class="literal">ORDER BY</code> <code class="type">anyelement</code> ) →
          <code class="returnvalue">anyelement</code>
        </div>
        <div>
          Computes the <em class="firstterm">discrete percentile</em>, the first value within the
          ordered set of aggregated argument values whose position in the ordering equals or exceeds
          the specified <em class="parameter"><code>fraction</code></em>. The aggregated argument must be of a sortable type.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">percentile_disc</code> (
          <em class="parameter"><code>fractions</code></em>
          <code class="type">double precision[]</code> ) <code class="literal">WITHIN GROUP</code> (
          <code class="literal">ORDER BY</code> <code class="type">anyelement</code> ) →
          <code class="returnvalue">anyarray</code>
        </div>
        <div>
          Computes multiple discrete percentiles. The result is an array of the same dimensions as
          the <em class="parameter"><code>fractions</code></em> parameter, with each non-null
          element replaced by the input value corresponding to that percentile. The aggregated
          argument must be of a sortable type.
        </div>
      </td>
      <td>No</td>
    </tr>
  </tbody>
</table>
</figure>

Each of the “hypothetical-set” aggregates listed in [Table 9.62](functions-aggregate#FUNCTIONS-HYPOTHETICAL-TABLE) is associated with a window function of the same name defined in [Section 9.22](functions-window). In each case, the aggregate's result is the value that the associated window function would have returned for the “hypothetical” row constructed from _`args`_, if such a row had been added to the sorted group of rows represented by the _`sorted_args`_. For each of these functions, the list of direct arguments given in _`args`_ must match the number and types of the aggregated arguments given in _`sorted_args`_. Unlike most built-in aggregates, these aggregates are not strict, that is they do not drop input rows containing nulls. Null values sort according to the rule specified in the `ORDER BY` clause.

[#id](#FUNCTIONS-HYPOTHETICAL-TABLE)

**Table 9.62. Hypothetical-Set Aggregate Functions**

<figure class="table-wrapper">
<table class="table" summary="Hypothetical-Set Aggregate Functions" border="1">
  <colgroup>
    <col class="col1" />
    <col class="col2" />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function</div>
        <div>Description</div>
      </th>
      <th>Partial Mode</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.20.2.4.1.1.1.1" class="indexterm"></a>
          <code class="function">rank</code> ( <em class="replaceable"><code>args</code></em> )
          <code class="literal">WITHIN GROUP</code> ( <code class="literal">ORDER BY</code>
          <em class="replaceable"><code>sorted_args</code></em> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>
          Computes the rank of the hypothetical row, with gaps; that is, the row number of the first
          row in its peer group.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.20.2.4.2.1.1.1" class="indexterm"></a>
          <code class="function">dense_rank</code> (
          <em class="replaceable"><code>args</code></em> )
          <code class="literal">WITHIN GROUP</code> ( <code class="literal">ORDER BY</code>
          <em class="replaceable"><code>sorted_args</code></em> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>
          Computes the rank of the hypothetical row, without gaps; this function effectively counts
          peer groups.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.20.2.4.3.1.1.1" class="indexterm"></a>
          <code class="function">percent_rank</code> (
          <em class="replaceable"><code>args</code></em> )
          <code class="literal">WITHIN GROUP</code> ( <code class="literal">ORDER BY</code>
          <em class="replaceable"><code>sorted_args</code></em> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>
          Computes the relative rank of the hypothetical row, that is (<code class="function">rank</code>
          - 1) / (total rows - 1). The value thus ranges from 0 to 1 inclusive.
        </div>
      </td>
      <td>No</td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.27.20.2.4.4.1.1.1" class="indexterm"></a>
          <code class="function">cume_dist</code> ( <em class="replaceable"><code>args</code></em> )
          <code class="literal">WITHIN GROUP</code> ( <code class="literal">ORDER BY</code>
          <em class="replaceable"><code>sorted_args</code></em> ) →
          <code class="returnvalue">double precision</code>
        </div>
        <div>
          Computes the cumulative distribution, that is (number of rows preceding or peers with
          hypothetical row) / (total rows). The value thus ranges from 1/<em class="parameter"><code>N</code></em>
          to 1.
        </div>
      </td>
      <td>No</td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-GROUPING-TABLE)

**Table 9.63. Grouping Operations**

<figure class="table-wrapper">
<table class="table" summary="Grouping Operations" border="1">
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
          <a id="id-1.5.8.27.21.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">GROUPING</code> (
          <em class="replaceable"><code>group_by_expression(s)</code></em> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns a bit mask indicating which <code class="literal">GROUP BY</code>
          expressions are not included in the current grouping set. Bits are assigned with the
          rightmost argument corresponding to the least-significant bit; each bit is 0 if the
          corresponding expression is included in the grouping criteria of the grouping set
          generating the current result row, and 1 if it is not included.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

The grouping operations shown in [Table 9.63](functions-aggregate#FUNCTIONS-GROUPING-TABLE) are used in conjunction with grouping sets (see [Section 7.2.4](queries-table-expressions#QUERIES-GROUPING-SETS)) to distinguish result rows. The arguments to the `GROUPING` function are not actually evaluated, but they must exactly match expressions given in the `GROUP BY` clause of the associated query level. For example:

```

=> SELECT * FROM items_sold;
 make  | model | sales
-------+-------+-------
 Foo   | GT    |  10
 Foo   | Tour  |  20
 Bar   | City  |  15
 Bar   | Sport |  5
(4 rows)

=> SELECT make, model, GROUPING(make,model), sum(sales) FROM items_sold GROUP BY ROLLUP(make,model);
 make  | model | grouping | sum
-------+-------+----------+-----
 Foo   | GT    |        0 | 10
 Foo   | Tour  |        0 | 20
 Bar   | City  |        0 | 15
 Bar   | Sport |        0 | 5
 Foo   |       |        1 | 30
 Bar   |       |        1 | 20
       |       |        3 | 50
(7 rows)
```

Here, the `grouping` value `0` in the first four rows shows that those have been grouped normally, over both the grouping columns. The value `1` indicates that `model` was not grouped by in the next-to-last two rows, and the value `3` indicates that neither `make` nor `model` was grouped by in the last row (which therefore is an aggregate over all the input rows).

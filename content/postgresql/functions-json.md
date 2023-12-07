[#id](#FUNCTIONS-JSON)

## 9.16. JSON Functions and Operators [#](#FUNCTIONS-JSON)

- [9.16.1. Processing and Creating JSON Data](functions-json#FUNCTIONS-JSON-PROCESSING)
- [9.16.2. The SQL/JSON Path Language](functions-json#FUNCTIONS-SQLJSON-PATH)

This section describes:

- functions and operators for processing and creating JSON data

- the SQL/JSON path language

To provide native support for JSON data types within the SQL environment, PostgreSQL implements the _SQL/JSON data model_. This model comprises sequences of items. Each item can hold SQL scalar values, with an additional SQL/JSON null value, and composite data structures that use JSON arrays and objects. The model is a formalization of the implied data model in the JSON specification [RFC 7159](https://tools.ietf.org/html/rfc7159).

SQL/JSON allows you to handle JSON data alongside regular SQL data, with transaction support, including:

- Uploading JSON data into the database and storing it in regular SQL columns as character or binary strings.

- Generating JSON objects and arrays from relational data.

- Querying JSON data using SQL/JSON query functions and SQL/JSON path language expressions.

To learn more about the SQL/JSON standard, see [\[sqltr-19075-6\]](biblio#SQLTR-19075-6). For details on JSON types supported in PostgreSQL, see [Section 8.14](datatype-json).

[#id](#FUNCTIONS-JSON-PROCESSING)

### 9.16.1. Processing and Creating JSON Data [#](#FUNCTIONS-JSON-PROCESSING)

[Table 9.45](functions-json#FUNCTIONS-JSON-OP-TABLE) shows the operators that are available for use with JSON data types (see [Section 8.14](datatype-json)). In addition, the usual comparison operators shown in [Table 9.1](functions-comparison#FUNCTIONS-COMPARISON-OP-TABLE) are available for `jsonb`, though not for `json`. The comparison operators follow the ordering rules for B-tree operations outlined in [Section 8.14.4](datatype-json#JSON-INDEXING). See also [Section 9.21](functions-aggregate) for the aggregate function `json_agg` which aggregates record values as JSON, the aggregate function `json_object_agg` which aggregates pairs of values into a JSON object, and their `jsonb` equivalents, `jsonb_agg` and `jsonb_object_agg`.

[#id](#FUNCTIONS-JSON-OP-TABLE)

**Table 9.45. `json` and `jsonb` Operators**

<figure class="table-wrapper">
<table class="table" summary="json and jsonb Operators" border="1">
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
          <code class="type">json</code> <code class="literal">-&gt;</code>
          <code class="type">integer</code> → <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">-&gt;</code>
          <code class="type">integer</code> → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Extracts <em class="parameter"><code>n</code></em>'th element of JSON array (array elements are indexed from zero, but negative integers
          count from the end).
        </div>
        <div>
          <code class="literal">'[\{"a":"foo"},\{"b":"bar"},\{"c":"baz"}]'::json -&gt; 2</code>
          → <code class="returnvalue">\{"c":"baz"}</code>
        </div>
        <div>
          <code class="literal">'[\{"a":"foo"},\{"b":"bar"},\{"c":"baz"}]'::json -&gt; -3</code>
          → <code class="returnvalue">\{"a":"foo"}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">json</code> <code class="literal">-&gt;</code>
          <code class="type">text</code> → <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">-&gt;</code>
          <code class="type">text</code> → <code class="returnvalue">jsonb</code>
        </div>
        <div>Extracts JSON object field with the given key.</div>
        <div>
          <code class="literal">'\{"a": \{"b":"foo"}}'::json -&gt; 'a'</code>
          → <code class="returnvalue">\{"b":"foo"}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">json</code> <code class="literal">-&gt;&gt;</code>
          <code class="type">integer</code> → <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">-&gt;&gt;</code>
          <code class="type">integer</code> → <code class="returnvalue">text</code>
        </div>
        <div>
          Extracts <em class="parameter"><code>n</code></em>'th element of JSON array, as <code class="type">text</code>.
        </div>
        <div>
          <code class="literal">'[1,2,3]'::json -&gt;&gt; 2</code>
          → <code class="returnvalue">3</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">json</code> <code class="literal">-&gt;&gt;</code>
          <code class="type">text</code> → <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">-&gt;&gt;</code>
          <code class="type">text</code> → <code class="returnvalue">text</code>
        </div>
        <div>Extracts JSON object field with the given key, as <code class="type">text</code>.</div>
        <div>
          <code class="literal">'\{"a":1,"b":2}'::json -&gt;&gt; 'b'</code>
          → <code class="returnvalue">2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">json</code> <code class="literal">#&gt;</code>
          <code class="type">text[]</code> → <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">#&gt;</code>
          <code class="type">text[]</code> → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Extracts JSON sub-object at the specified path, where path elements can be either field
          keys or array indexes.
        </div>
        <div>
          <code class="literal">'\{"a": \{"b": ["foo","bar"]}}'::json #&gt; '\{a,b,1}'</code>
          → <code class="returnvalue">"bar"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">json</code> <code class="literal">#&gt;&gt;</code>
          <code class="type">text[]</code> → <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">#&gt;&gt;</code>
          <code class="type">text[]</code> → <code class="returnvalue">text</code>
        </div>
        <div>Extracts JSON sub-object at the specified path as <code class="type">text</code>.</div>
        <div>
          <code class="literal">'\{"a": \{"b": ["foo","bar"]}}'::json #&gt;&gt; '\{a,b,1}'</code>
          → <code class="returnvalue">bar</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

### Note

The field/element/path extraction operators return NULL, rather than failing, if the JSON input does not have the right structure to match the request; for example if no such key or array element exists.

Some further operators exist only for `jsonb`, as shown in [Table 9.46](functions-json#FUNCTIONS-JSONB-OP-TABLE). [Section 8.14.4](datatype-json#JSON-INDEXING) describes how these operators can be used to effectively search indexed `jsonb` data.

[#id](#FUNCTIONS-JSONB-OP-TABLE)

**Table 9.46. Additional `jsonb` Operators**

<figure class="table-wrapper">
<table class="table" summary="Additional jsonb Operators" border="1">
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
          <code class="type">jsonb</code> <code class="literal">@&gt;</code>
          <code class="type">jsonb</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does the first JSON value contain the second? (See
          <a
            class="xref"
            href="datatype-json.html#JSON-CONTAINMENT"
            title="8.14.3.&nbsp;jsonb Containment and Existence">Section&nbsp;8.14.3</a>
          for details about containment.)
        </div>
        <div>
          <code class="literal">'\{"a":1, "b":2}'::jsonb @&gt; '\{"b":2}'::jsonb</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">&lt;@</code>
          <code class="type">jsonb</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the first JSON value contained in the second?</div>
        <div>
          <code class="literal">'\{"b":2}'::jsonb &lt;@ '\{"a":1, "b":2}'::jsonb</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">?</code>
          <code class="type">text</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the text string exist as a top-level key or array element within the JSON value?</div>
        <div>
          <code class="literal">'\{"a":1, "b":2}'::jsonb ? 'b'</code>
          → <code class="returnvalue">t</code>
        </div>
        <div>
          <code class="literal">'["a", "b", "c"]'::jsonb ? 'b'</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">?|</code>
          <code class="type">text[]</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Do any of the strings in the text array exist as top-level keys or array elements?</div>
        <div>
          <code class="literal">'\{"a":1, "b":2, "c":3}'::jsonb ?| array['b', 'd']</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">?&amp;</code>
          <code class="type">text[]</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Do all of the strings in the text array exist as top-level keys or array elements?</div>
        <div>
          <code class="literal">'["a", "b", "c"]'::jsonb ?&amp; array['a', 'b']</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">||</code>
          <code class="type">jsonb</code> → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Concatenates two <code class="type">jsonb</code> values. Concatenating two arrays
          generates an array containing all the elements of each input. Concatenating two objects
          generates an object containing the union of their keys, taking the second object's value
          when there are duplicate keys. All other cases are treated by converting a non-array input
          into a single-element array, and then proceeding as for two arrays. Does not operate
          recursively: only the top-level array or object structure is merged.
        </div>
        <div>
          <code class="literal">'["a", "b"]'::jsonb || '["a", "d"]'::jsonb</code>
          → <code class="returnvalue">["a", "b", "a", "d"]</code>
        </div>
        <div>
          <code class="literal">'\{"a": "b"}'::jsonb || '\{"c": "d"}'::jsonb</code>
          → <code class="returnvalue">\{"a": "b", "c": "d"}</code>
        </div>
        <div>
          <code class="literal">'[1, 2]'::jsonb || '3'::jsonb</code>
          → <code class="returnvalue">[1, 2, 3]</code>
        </div>
        <div>
          <code class="literal">'\{"a": "b"}'::jsonb || '42'::jsonb</code>
          → <code class="returnvalue">[\{"a": "b"}, 42]</code>
        </div>
        <div>
          To append an array to another array as a single entry, wrap it in an additional layer of
          array, for example:
        </div>
        <div>
          <code class="literal">'[1, 2]'::jsonb || jsonb_build_array('[3, 4]'::jsonb)</code>
          → <code class="returnvalue">[1, 2, [3, 4]]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">-</code>
          <code class="type">text</code> → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Deletes a key (and its value) from a JSON object, or matching string value(s) from a JSON
          array.
        </div>
        <div>
          <code class="literal">'\{"a": "b", "c": "d"}'::jsonb - 'a'</code>
          → <code class="returnvalue">\{"c": "d"}</code>
        </div>
        <div>
          <code class="literal">'["a", "b", "c", "b"]'::jsonb - 'b'</code>
          → <code class="returnvalue">["a", "c"]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">-</code>
          <code class="type">text[]</code> → <code class="returnvalue">jsonb</code>
        </div>
        <div>Deletes all matching keys or array elements from the left operand.</div>
        <div>
          <code class="literal">'\{"a": "b", "c": "d"}'::jsonb - '\{a,c}'::text[]</code>
          → <code class="returnvalue">\{}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">-</code>
          <code class="type">integer</code> → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Deletes the array element with specified index (negative integers count from the end).
          Throws an error if JSON value is not an array.
        </div>
        <div>
          <code class="literal">'["a", "b"]'::jsonb - 1 </code>
          → <code class="returnvalue">["a"]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">#-</code>
          <code class="type">text[]</code> → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Deletes the field or array element at the specified path, where path elements can be
          either field keys or array indexes.
        </div>
        <div>
          <code class="literal">'["a", \{"b":1}]'::jsonb #- '\{1,b}'</code>
          → <code class="returnvalue">["a", \{}]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">@?</code>
          <code class="type">jsonpath</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does JSON path return any item for the specified JSON value?</div>
        <div>
          <code class="literal">'\{"a":[1,2,3,4,5]}'::jsonb @? '$.a[*] ? (@ &gt; 2)'</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">jsonb</code> <code class="literal">@@</code>
          <code class="type">jsonpath</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Returns the result of a JSON path predicate check for the specified JSON value. Only the
          first item of the result is taken into account. If the result is not Boolean, then
          <code class="literal">NULL</code>
          is returned.
        </div>
        <div>
          <code class="literal">'\{"a":[1,2,3,4,5]}'::jsonb @@ '$.a[*] &gt; 2'</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

### Note

The `jsonpath` operators `@?` and `@@` suppress the following errors: missing object field or array element, unexpected JSON item type, datetime and numeric errors. The `jsonpath`-related functions described below can also be told to suppress these types of errors. This behavior might be helpful when searching JSON document collections of varying structure.

[Table 9.47](functions-json#FUNCTIONS-JSON-CREATION-TABLE) shows the functions that are available for constructing `json` and `jsonb` values. Some functions in this table have a `RETURNING` clause, which specifies the data type returned. It must be one of `json`, `jsonb`, `bytea`, a character string type (`text`, `char`, `varchar`, or `nchar`), or a type for which there is a cast from `json` to that type. By default, the `json` type is returned.

[#id](#FUNCTIONS-JSON-CREATION-TABLE)

**Table 9.47. JSON Creation Functions**

<figure class="table-wrapper">
<table class="table" summary="JSON Creation Functions" border="1">
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
          <a id="id-1.5.8.22.8.9.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">to_json</code> ( <code class="type">anyelement</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.1.1.2.1" class="indexterm"></a>
          <code class="function">to_jsonb</code> ( <code class="type">anyelement</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Converts any SQL value to <code class="type">json</code> or
          <code class="type">jsonb</code>. Arrays and composites are converted recursively to arrays
          and objects (multidimensional arrays become arrays of arrays in JSON). Otherwise, if there
          is a cast from the SQL data type to <code class="type">json</code>, the cast function will
          be used to perform the conversion;<a
            href="#ftn.id-1.5.8.22.8.9.2.2.1.1.3.4"
            class="footnote"><sup class="footnote" id="id-1.5.8.22.8.9.2.2.1.1.3.4">[a]</sup></a>
          otherwise, a scalar JSON value is produced. For any scalar other than a number, a Boolean,
          or a null value, the text representation will be used, with escaping as necessary to make
          it a valid JSON string value.
        </div>
        <div>
          <code class="literal">to_json('Fred said "Hi."'::text)</code>
          → <code class="returnvalue">"Fred said \"Hi.\""</code>
        </div>
        <div>
          <code class="literal">to_jsonb(row(42, 'Fred said "Hi."'::text))</code>
          → <code class="returnvalue">\{"f1": 42, "f2": "Fred said \"Hi.\""}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">array_to_json</code> ( <code class="type">anyarray</code> [<span
            class="optional">, <code class="type">boolean</code> </span>] ) → <code class="returnvalue">json</code>
        </div>
        <div>
          Converts an SQL array to a JSON array. The behavior is the same as
          <code class="function">to_json</code> except that line feeds will be added between
          top-level array elements if the optional boolean parameter is true.
        </div>
        <div>
          <code class="literal">array_to_json('\{\{1,5},\{99,100}}'::int[])</code>
          → <code class="returnvalue">[[1,5],[99,100]]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">json_array</code> ( [<span class="optional">
            \{ <em class="replaceable"><code>value_expression</code></em> [<span class="optional">
              <code class="literal">FORMAT JSON</code> </span>] } [<span class="optional">, ...</span>] </span>] [<span class="optional">
            \{ <code class="literal">NULL</code> | <code class="literal">ABSENT</code> }
            <code class="literal">ON NULL</code> </span>] [<span class="optional">
            <code class="literal">RETURNING</code>
            <em class="replaceable"><code>data_type</code></em> [<span class="optional">
              <code class="literal">FORMAT JSON</code> [<span class="optional">
                <code class="literal">ENCODING UTF8</code> </span>] </span>] </span>])
        </div>
        <div class="func_signature">
          <code class="function">json_array</code> ( [<span class="optional">
            <em class="replaceable"><code>query_expression</code></em> </span>] [<span class="optional">
            <code class="literal">RETURNING</code>
            <em class="replaceable"><code>data_type</code></em> [<span class="optional">
              <code class="literal">FORMAT JSON</code> [<span class="optional">
                <code class="literal">ENCODING UTF8</code> </span>] </span>] </span>])
        </div>
        <div>
          Constructs a JSON array from either a series of
          <em class="replaceable"><code>value_expression</code></em> parameters or from the results
          of <em class="replaceable"><code>query_expression</code></em>, which must be a SELECT query returning a single column. If
          <code class="literal">ABSENT ON NULL</code> is specified, NULL values are ignored. This is
          always the case if a <em class="replaceable"><code>query_expression</code></em> is used.
        </div>
        <div>
          <code class="literal">json_array(1,true,json '\{"a":null}')</code>
          → <code class="returnvalue">[1, true, \{"a":null}]</code>
        </div>
        <div>
          <code class="literal">json_array(SELECT * FROM (VALUES(1),(2)) t)</code>
          → <code class="returnvalue">[1, 2]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">row_to_json</code> ( <code class="type">record</code> [<span
            class="optional">, <code class="type">boolean</code> </span>] ) → <code class="returnvalue">json</code>
        </div>
        <div>
          Converts an SQL composite value to a JSON object. The behavior is the same as
          <code class="function">to_json</code> except that line feeds will be added between
          top-level elements if the optional boolean parameter is true.
        </div>
        <div>
          <code class="literal">row_to_json(row(1,'foo'))</code>
          → <code class="returnvalue">\{"f1":1,"f2":"foo"}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">json_build_array</code> ( <code class="literal">VARIADIC</code>
          <code class="type">"any"</code> ) → <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.5.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_build_array</code> ( <code class="literal">VARIADIC</code>
          <code class="type">"any"</code> ) → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Builds a possibly-heterogeneously-typed JSON array out of a variadic argument list. Each
          argument is converted as per <code class="function">to_json</code> or
          <code class="function">to_jsonb</code>.
        </div>
        <div>
          <code class="literal">json_build_array(1, 2, 'foo', 4, 5)</code>
          → <code class="returnvalue">[1, 2, "foo", 4, 5]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">json_build_object</code> ( <code class="literal">VARIADIC</code>
          <code class="type">"any"</code> ) → <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.6.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_build_object</code> ( <code class="literal">VARIADIC</code>
          <code class="type">"any"</code> ) → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Builds a JSON object out of a variadic argument list. By convention, the argument list
          consists of alternating keys and values. Key arguments are coerced to text; value
          arguments are converted as per <code class="function">to_json</code> or
          <code class="function">to_jsonb</code>.
        </div>
        <div>
          <code class="literal">json_build_object('foo', 1, 2, row(3,'bar'))</code>
          → <code class="returnvalue">\{"foo" : 1, "2" : \{"f1":3,"f2":"bar"}}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">json_object</code> ( [<span class="optional">
            \{ <em class="replaceable"><code>key_expression</code></em> \{
            <code class="literal">VALUE</code> | ':' }
            <em class="replaceable"><code>value_expression</code></em> [<span class="optional">
              <code class="literal">FORMAT JSON</code> [<span class="optional">
                <code class="literal">ENCODING UTF8</code> </span>] </span>] }[<span class="optional">, ...</span>] </span>] [<span class="optional">
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
          Constructs a JSON object of all the key/value pairs given, or an empty object if none are
          given.
          <em class="replaceable"><code>key_expression</code></em> is a scalar expression defining
          the <acronym class="acronym">JSON</acronym> key, which is converted to the
          <code class="type">text</code> type. It cannot be <code class="literal">NULL</code> nor
          can it belong to a type that has a cast to the <code class="type">json</code> type. If
          <code class="literal">WITH UNIQUE KEYS</code> is specified, there must not be any
          duplicate <em class="replaceable"><code>key_expression</code></em>. Any pair for which the
          <em class="replaceable"><code>value_expression</code></em> evaluates to
          <code class="literal">NULL</code> is omitted from the output if
          <code class="literal">ABSENT ON NULL</code> is specified; if
          <code class="literal">NULL ON NULL</code> is specified or the clause omitted, the key is
          included with value <code class="literal">NULL</code>.
        </div>
        <div>
          <code class="literal">json_object('code' VALUE 'P123', 'title': 'Jaws')</code>
          → <code class="returnvalue">\{"code" : "P123", "title" : "Jaws"}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">json_object</code> ( <code class="type">text[]</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.8.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_object</code> ( <code class="type">text[]</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Builds a JSON object out of a text array. The array must have either exactly one dimension
          with an even number of members, in which case they are taken as alternating key/value
          pairs, or two dimensions such that each inner array has exactly two elements, which are
          taken as a key/value pair. All values are converted to JSON strings.
        </div>
        <div>
          <code class="literal">json_object('\{a, 1, b, "def", c, 3.5}')</code>
          → <code class="returnvalue">\{"a" : "1", "b" : "def", "c" : "3.5"}</code>
        </div>
        <div>
          <code class="literal">json_object('\{\{a, 1}, \{b, "def"}, \{c, 3.5}}')</code> →
          <code class="returnvalue">\{"a" : "1", "b" : "def", "c" : "3.5"}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">json_object</code> ( <em class="parameter"><code>keys</code></em>
          <code class="type">text[]</code>, <em class="parameter"><code>values</code></em>
          <code class="type">text[]</code> ) → <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <code class="function">jsonb_object</code> ( <em class="parameter"><code>keys</code></em>
          <code class="type">text[]</code>, <em class="parameter"><code>values</code></em>
          <code class="type">text[]</code> ) → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          This form of <code class="function">json_object</code> takes keys and values pairwise from
          separate text arrays. Otherwise it is identical to the one-argument form.
        </div>
        <div>
          <code class="literal">json_object('\{a,b}', '\{1,2}')</code>
          → <code class="returnvalue">\{"a": "1", "b": "2"}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">json</code> (
          <em class="replaceable"><code>expression</code></em>
          [<span class="optional">
            <code class="literal">FORMAT JSON</code> [<span class="optional">
              <code class="literal">ENCODING UTF8</code> </span>]</span>] [<span class="optional">
            \{ <code class="literal">WITH</code> | <code class="literal">WITHOUT</code> }
            <code class="literal">UNIQUE</code> [<span class="optional">
              <code class="literal">KEYS</code> </span>]</span>] ) → <code class="returnvalue">json</code>
        </div>
        <div>
          Converts a given expression specified as <code class="type">text</code> or
          <code class="type">bytea</code> string (in UTF8 encoding) into a JSON value. If
          <em class="replaceable"><code>expression</code></em> is NULL, an
          <acronym class="acronym">SQL</acronym> null value is returned. If
          <code class="literal">WITH UNIQUE</code> is specified, the
          <em class="replaceable"><code>expression</code></em> must not contain any duplicate object
          keys.
        </div>
        <div>
          <code class="literal">json('\{"a":123, "b":[true,"foo"], "a":"bar"}')</code>
          → <code class="returnvalue">\{"a":123, "b":[true,"foo"], "a":"bar"}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.9.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">json_scalar</code> (
          <em class="replaceable"><code>expression</code></em> )
        </div>
        <div>
          Converts a given SQL scalar value into a JSON scalar value. If the input is NULL, an
          <acronym class="acronym">SQL</acronym> null is returned. If the input is number or a
          boolean value, a corresponding JSON number or boolean value is returned. For any other
          value, a JSON string is returned.
        </div>
        <div>
          <code class="literal">json_scalar(123.45)</code>
          → <code class="returnvalue">123.45</code>
        </div>
        <div>
          <code class="literal">json_scalar(CURRENT_TIMESTAMP)</code>
          → <code class="returnvalue">"2022-05-10T10:51:04.62128-04:00"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">json_serialize</code> (
          <em class="replaceable"><code>expression</code></em> [<span class="optional">
            <code class="literal">FORMAT JSON</code> [<span class="optional">
              <code class="literal">ENCODING UTF8</code> </span>] </span>] [<span class="optional">
            <code class="literal">RETURNING</code>
            <em class="replaceable"><code>data_type</code></em> [<span class="optional">
              <code class="literal">FORMAT JSON</code> [<span class="optional">
                <code class="literal">ENCODING UTF8</code> </span>] </span>] </span>] )
        </div>
        <div>
          Converts an SQL/JSON expression into a character or binary string. The
          <em class="replaceable"><code>expression</code></em> can be of any JSON type, any
          character string type, or <code class="type">bytea</code> in UTF8 encoding. The returned
          type used in <code class="literal"> RETURNING</code> can be any character string type or
          <code class="type">bytea</code>. The default is <code class="type">text</code>.
        </div>
        <div>
          <code class="literal">json_serialize('\{ "a" : 1 } ' RETURNING bytea)</code>
          → <code class="returnvalue">\x7b20226122203a2031207d20</code>
        </div>
      </td>
    </tr>
  </tbody>
  <tbody class="footnotes">
    <tr>
      <td colspan="1">
        <div id="ftn.id-1.5.8.22.8.9.2.2.1.1.3.4" class="footnote">
          <div>
            <a href="#id-1.5.8.22.8.9.2.2.1.1.3.4" class="para"><sup class="para">[a] </sup></a> For
            example, the
            <a class="xref" href="hstore.html" title="F.18.&nbsp;hstore — hstore key/value datatype">hstore</a>
            extension has a cast from <code class="type">hstore</code> to
            <code class="type">json</code>, so that <code class="type">hstore</code> values
            converted via the JSON creation functions will be represented as JSON objects, not as
            primitive string values.
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[Table 9.48](functions-json#FUNCTIONS-SQLJSON-MISC) details SQL/JSON facilities for testing JSON.

[#id](#FUNCTIONS-SQLJSON-MISC)

**Table 9.48. SQL/JSON Testing Functions**

<figure class="table-wrapper">
<table class="table" summary="SQL/JSON Testing Functions" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function signature</div>
        <div>Description</div>
        <div>Example(s)</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.11.2.2.1.1.1.1" class="indexterm"></a>
          <em class="replaceable"><code>expression</code></em>
          <code class="literal">IS</code> [<span class="optional">
            <code class="literal">NOT</code> </span>] <code class="literal">JSON</code> [<span class="optional">
            \{ <code class="literal">VALUE</code> | <code class="literal">SCALAR</code> |
            <code class="literal">ARRAY</code> | <code class="literal">OBJECT</code> } </span>] [<span class="optional">
            \{ <code class="literal">WITH</code> | <code class="literal">WITHOUT</code> }
            <code class="literal">UNIQUE</code> [<span class="optional">
              <code class="literal">KEYS</code> </span>] </span>]
        </div>
        <div>
          This predicate tests whether <em class="replaceable"><code>expression</code></em> can be
          parsed as JSON, possibly of a specified type. If <code class="literal">SCALAR</code> or
          <code class="literal">ARRAY</code> or <code class="literal">OBJECT</code> is specified,
          the test is whether or not the JSON is of that particular type. If
          <code class="literal">WITH UNIQUE KEYS</code> is specified, then any object in the
          <em class="replaceable"><code>expression</code></em> is also tested to see if it has
          duplicate keys.
        </div>
        <div>
        <pre class="programlisting">
SELECT js,
  js IS JSON "json?",
  js IS JSON SCALAR "scalar?",
  js IS JSON OBJECT "object?",
  js IS JSON ARRAY "array?"
FROM (VALUES
      ('123'), ('"abc"'), ('\{"a": "b"}'), ('[1,2]'),('abc')) foo(js);
     js     | json? | scalar? | object? | array?
------------+-------+---------+---------+--------
 123        | t     | t       | f       | f
 "abc"      | t     | t       | f       | f
 \{"a": "b"} | t     | f       | t       | f
 [1,2]      | t     | f       | f       | t
 abc        | f     | f       | f       | f
</pre>
        </div>
        <div>
        <pre class="programlisting">
SELECT js,
  js IS JSON OBJECT "object?",
  js IS JSON ARRAY "array?",
  js IS JSON ARRAY WITH UNIQUE KEYS "array w. UK?",
  js IS JSON ARRAY WITHOUT UNIQUE KEYS "array w/o UK?"
FROM (VALUES ('[\{"a":"1"},
 \{"b":"2","b":"3"}]')) foo(js);
-[ RECORD 1 ]-+--------------------
js            | [\{"a":"1"},        +
              |  \{"b":"2","b":"3"}]
object?       | f
array?        | t
array w. UK?  | f
array w/o UK? | t
</pre>
</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[Table 9.49](functions-json#FUNCTIONS-JSON-PROCESSING-TABLE) shows the functions that are available for processing `json` and `jsonb` values.

[#id](#FUNCTIONS-JSON-PROCESSING-TABLE)

**Table 9.49. JSON Processing Functions**

<figure class="table-wrapper">
<table class="table" summary="JSON Processing Functions" border="1">
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
          <a id="id-1.5.8.22.8.13.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">json_array_elements</code> ( <code class="type">json</code> ) →
          <code class="returnvalue">setof json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.1.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_array_elements</code> ( <code class="type">jsonb</code> ) →
          <code class="returnvalue">setof jsonb</code>
        </div>
        <div>Expands the top-level JSON array into a set of JSON values.</div>
        <div>
          <code class="literal">select * from json_array_elements('[1,true, [2,false]]')</code>
          → <code class="returnvalue"></code>
        </div>
        ```bash
        value
        -----------

        1
        true
        [2,false]
        ```

  </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">json_array_elements_text</code> ( <code class="type">json</code> )
          → <code class="returnvalue">setof text</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.2.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_array_elements_text</code> (
          <code class="type">jsonb</code> ) → <code class="returnvalue">setof text</code>
        </div>
        <div>Expands the top-level JSON array into a set of <code class="type">text</code> values.</div>
        <div>
          <code class="literal">select * from json_array_elements_text('["foo", "bar"]')</code>
          → <code class="returnvalue"></code>
        </div>
        ```bash
        value
        -----------

        foo
        bar
        ```

  </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">json_array_length</code> ( <code class="type">json</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.3.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_array_length</code> ( <code class="type">jsonb</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns the number of elements in the top-level JSON array.</div>
        <div>
          <code class="literal">json_array_length('[1,2,3,\{"f1":1,"f2":[5,6]},4]')</code>
          → <code class="returnvalue">5</code>
        </div>
        <div>
          <code class="literal">jsonb_array_length('[]')</code>
          → <code class="returnvalue">0</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">json_each</code> ( <code class="type">json</code> ) →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>key</code></em> <code class="type">text</code>,
          <em class="parameter"><code>value</code></em> <code class="type">json</code> )
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.4.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_each</code> ( <code class="type">jsonb</code> ) →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>key</code></em> <code class="type">text</code>,
          <em class="parameter"><code>value</code></em> <code class="type">jsonb</code> )
        </div>
        <div>Expands the top-level JSON object into a set of key/value pairs.</div>
        <div>
          <code class="literal">select _from json_each('\{"a":"foo", "b":"bar"}')</code>
          → <code class="returnvalue"></code>
        </div><div>
        <pre class="programlisting">
 key | value
-----+-------
 a   | "foo"
 b   | "bar"
</pre>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">json_each_text</code> ( <code class="type">json</code> ) →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>key</code></em> <code class="type">text</code>,
          <em class="parameter"><code>value</code></em> <code class="type">text</code> )
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.5.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_each_text</code> ( <code class="type">jsonb</code> ) →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>key</code></em> <code class="type">text</code>,
          <em class="parameter"><code>value</code></em> <code class="type">text</code> )
        </div>
        <div>
          Expands the top-level JSON object into a set of key/value pairs. The returned
          <em class="parameter"><code>value</code></em>s will be of type <code class="type">text</code>.
        </div>
        <div>
          <code class="literal">select_ from json_each_text('\{"a":"foo", "b":"bar"}')</code>
          → <code class="returnvalue"></code>
        </div><div>
        <pre class="programlisting">
 key | value
-----+-------
 a   | foo
 b   | bar
</pre>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">json_extract_path</code> (
          <em class="parameter"><code>from_json</code></em> <code class="type">json</code>,
          <code class="literal">VARIADIC</code> <em class="parameter"><code>path_elems</code></em>
          <code class="type">text[]</code> ) → <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.6.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_extract_path</code> (
          <em class="parameter"><code>from_json</code></em> <code class="type">jsonb</code>,
          <code class="literal">VARIADIC</code> <em class="parameter"><code>path_elems</code></em>
          <code class="type">text[]</code> ) → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Extracts JSON sub-object at the specified path. (This is functionally equivalent to the
          <code class="literal">#&gt;</code>
          operator, but writing the path out as a variadic list can be more convenient in some
          cases.)
        </div>
        <div>
          <code class="literal">json_extract_path('\{"f2":\{"f3":1},"f4":\{"f5":99,"f6":"foo"}}', 'f4', 'f6')</code>
          → <code class="returnvalue">"foo"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">json_extract_path_text</code> (
          <em class="parameter"><code>from_json</code></em> <code class="type">json</code>,
          <code class="literal">VARIADIC</code> <em class="parameter"><code>path_elems</code></em>
          <code class="type">text[]</code> ) → <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.7.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_extract_path_text</code> (
          <em class="parameter"><code>from_json</code></em> <code class="type">jsonb</code>,
          <code class="literal">VARIADIC</code> <em class="parameter"><code>path_elems</code></em>
          <code class="type">text[]</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Extracts JSON sub-object at the specified path as <code class="type">text</code>. (This is
          functionally equivalent to the <code class="literal">#&gt;&gt;</code>
          operator.)
        </div>
        <div>
          <code class="literal">json_extract_path_text('\{"f2":\{"f3":1},"f4":\{"f5":99,"f6":"foo"}}', 'f4', 'f6')</code>
          → <code class="returnvalue">foo</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">json_object_keys</code> ( <code class="type">json</code> ) →
          <code class="returnvalue">setof text</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.8.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_object_keys</code> ( <code class="type">jsonb</code> ) →
          <code class="returnvalue">setof text</code>
        </div>
        <div>Returns the set of keys in the top-level JSON object.</div>
        <div>
          <code class="literal">select * from json_object_keys('\{"f1":"abc","f2":\{"f3":"a", "f4":"b"}}')</code>
          → <code class="returnvalue"></code>
        </div><div>
        <pre class="programlisting">
 json_object_keys
------------------

f1
f2

</pre>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">json_populate_record</code> (
          <em class="parameter"><code>base</code></em> <code class="type">anyelement</code>,
          <em class="parameter"><code>from_json</code></em> <code class="type">json</code> ) →
          <code class="returnvalue">anyelement</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.9.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_populate_record</code> (
          <em class="parameter"><code>base</code></em> <code class="type">anyelement</code>,
          <em class="parameter"><code>from_json</code></em> <code class="type">jsonb</code> ) →
          <code class="returnvalue">anyelement</code>
        </div>
        <div>
          Expands the top-level JSON object to a row having the composite type of the
          <em class="parameter"><code>base</code></em> argument. The JSON object is scanned for
          fields whose names match column names of the output row type, and their values are
          inserted into those columns of the output. (Fields that do not correspond to any output
          column name are ignored.) In typical use, the value of
          <em class="parameter"><code>base</code></em> is just <code class="literal">NULL</code>,
          which means that any output columns that do not match any object field will be filled with
          nulls. However, if <em class="parameter"><code>base</code></em> isn't
          <code class="literal">NULL</code> then the values it contains will be used for unmatched
          columns.
        </div>
        <div>
          To convert a JSON value to the SQL type of an output column, the following rules are
          applied in sequence:
        </div>
        <div class="itemizedlist">
          <ul class="itemizedlist compact">
            <li class="listitem">
              <div>A JSON null value is converted to an SQL null in all cases.</div>
            </li>
            <li class="listitem">
              <div>
                If the output column is of type <code class="type">json</code> or
                <code class="type">jsonb</code>, the JSON value is just reproduced exactly.
              </div>
            </li>
            <li class="listitem">
              <div>
                If the output column is a composite (row) type, and the JSON value is a JSON object,
                the fields of the object are converted to columns of the output row type by
                recursive application of these rules.
              </div>
            </li>
            <li class="listitem">
              <div>
                Likewise, if the output column is an array type and the JSON value is a JSON array,
                the elements of the JSON array are converted to elements of the output array by
                recursive application of these rules.
              </div>
            </li>
            <li class="listitem">
              <div>
                Otherwise, if the JSON value is a string, the contents of the string are fed to the
                input conversion function for the column's data type.
              </div>
            </li>
            <li class="listitem">
              <div>
                Otherwise, the ordinary text representation of the JSON value is fed to the input
                conversion function for the column's data type.
              </div>
            </li>
          </ul>
        </div>
        <div></div>
        <div>
          While the example below uses a constant JSON value, typical use would be to reference a
          <code class="type">json</code> or <code class="type">jsonb</code> column laterally from
          another table in the query's <code class="literal">FROM</code> clause. Writing
          <code class="function">json_populate_record</code> in the
          <code class="literal">FROM</code> clause is good practice, since all of the extracted
          columns are available for use without duplicate function calls.
        </div>
        <div>
          <code class="literal">create type subrowtype as (d int, e text);</code>
          <code class="literal">create type myrowtype as (a int, b text[], c subrowtype);</code>
        </div>
        <div>
          <code class="literal">select _from json_populate_record(null::myrowtype, '\{"a": 1, "b": ["2", "a b"], "c":
            \{"d": 4, "e": "a b c"}, "x": "foo"}')</code>
          → <code class="returnvalue"></code>
        </div><div>
        <pre class="programlisting">
 a |   b       |      c
---+-----------+-------------
 1 | \{2,"a b"} | (4,"a b c")
</pre>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">json_populate_recordset</code> (
          <em class="parameter"><code>base</code></em> <code class="type">anyelement</code>,
          <em class="parameter"><code>from_json</code></em> <code class="type">json</code> ) →
          <code class="returnvalue">setof anyelement</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.10.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_populate_recordset</code> (
          <em class="parameter"><code>base</code></em> <code class="type">anyelement</code>,
          <em class="parameter"><code>from_json</code></em> <code class="type">jsonb</code> ) →
          <code class="returnvalue">setof anyelement</code>
        </div>
        <div>
          Expands the top-level JSON array of objects to a set of rows having the composite type of
          the <em class="parameter"><code>base</code></em> argument. Each element of the JSON array
          is processed as described above for <code class="function">json[b]_populate_record</code>.
        </div>
        <div>
          <code class="literal">create type twoints as (a int, b int);</code>
        </div>
        <div>
          <code class="literal">select_ from json_populate_recordset(null::twoints, '[\{"a":1,"b":2},
            \{"a":3,"b":4}]')</code>
          → <code class="returnvalue"></code>
        </div><div>
        <pre class="programlisting">
 a | b
---+---
 1 | 2
 3 | 4
</pre>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">json_to_record</code> ( <code class="type">json</code> ) →
          <code class="returnvalue">record</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.11.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_to_record</code> ( <code class="type">jsonb</code> ) →
          <code class="returnvalue">record</code>
        </div>
        <div>
          Expands the top-level JSON object to a row having the composite type defined by an
          <code class="literal">AS</code> clause. (As with all functions returning
          <code class="type">record</code>, the calling query must explicitly define the structure
          of the record with an <code class="literal">AS</code> clause.) The output record is filled
          from fields of the JSON object, in the same way as described above for
          <code class="function">json[b]_populate_record</code>. Since there is no input record
          value, unmatched columns are always filled with nulls.
        </div>
        <div>
          <code class="literal">create type myrowtype as (a int, b text);</code>
        </div>
        <div>
          <code class="literal">select_from json_to_record('\{"a":1,"b":[1,2,3],"c":[1,2,3],"e":"bar","r": \{"a": 123,
            "b": "a b c"}}') as x(a int, b text, c int[], d text, r myrowtype)</code>
          → <code class="returnvalue"></code>
        </div><div>
        <pre class="programlisting">
 a |    b    |    c    | d |       r
---+---------+---------+---+---------------
 1 | [1,2,3] | {1,2,3} |   | (123,"a b c")
</pre>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">json_to_recordset</code> ( <code class="type">json</code> ) →
          <code class="returnvalue">setof record</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.12.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_to_recordset</code> ( <code class="type">jsonb</code> ) →
          <code class="returnvalue">setof record</code>
        </div>
        <div>
          Expands the top-level JSON array of objects to a set of rows having the composite type
          defined by an <code class="literal">AS</code> clause. (As with all functions returning
          <code class="type">record</code>, the calling query must explicitly define the structure
          of the record with an <code class="literal">AS</code> clause.) Each element of the JSON
          array is processed as described above for
          <code class="function">json[b]_populate_record</code>.
        </div>
        <div>
          <code class="literal">select_ from json_to_recordset('[\{"a":1,"b":"foo"}, \{"a":"2","c":"bar"}]') as x(a int,
            b text)</code>
          → <code class="returnvalue"></code>
        </div><div>
        <pre class="programlisting">
 a |  b
---+-----
 1 | foo
 2 |
</pre>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">jsonb_set</code> ( <em class="parameter"><code>target</code></em>
          <code class="type">jsonb</code>, <em class="parameter"><code>path</code></em>
          <code class="type">text[]</code>, <em class="parameter"><code>new_value</code></em>
          <code class="type">jsonb</code> [<span class="optional">, <em class="parameter"><code>create_if_missing</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Returns <em class="parameter"><code>target</code></em> with the item designated by
          <em class="parameter"><code>path</code></em> replaced by
          <em class="parameter"><code>new_value</code></em>, or with <em class="parameter"><code>new_value</code></em> added if
          <em class="parameter"><code>create_if_missing</code></em> is true (which is the default)
          and the item designated by <em class="parameter"><code>path</code></em> does not exist.
          All earlier steps in the path must exist, or the
          <em class="parameter"><code>target</code></em> is returned unchanged. As with the path
          oriented operators, negative integers that appear in the
          <em class="parameter"><code>path</code></em> count from the end of JSON arrays. If the
          last path step is an array index that is out of range, and
          <em class="parameter"><code>create_if_missing</code></em> is true, the new value is added
          at the beginning of the array if the index is negative, or at the end of the array if it
          is positive.
        </div>
        <div>
          <code class="literal">jsonb_set('[\{"f1":1,"f2":null},2,null,3]', '\{0,f1}', '[2,3,4]', false)</code>
          → <code class="returnvalue">[\{"f1": [2, 3, 4], "f2": null}, 2, null, 3]</code>
        </div>
        <div>
          <code class="literal">jsonb_set('[\{"f1":1,"f2":null},2]', '\{0,f3}', '[2,3,4]')</code>
          → <code class="returnvalue">[\{"f1": 1, "f2": null, "f3": [2, 3, 4]}, 2]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.14.1.1.1" class="indexterm"></a>
          <code class="function">jsonb_set_lax</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">text[]</code>,
          <em class="parameter"><code>new_value</code></em> <code class="type">jsonb</code> [<span
            class="optional">, <em class="parameter"><code>create_if_missing</code></em>
            <code class="type">boolean</code> [<span class="optional">, <em class="parameter"><code>null_value_treatment</code></em>
              <code class="type">text</code> </span>]</span>] ) → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          If <em class="parameter"><code>new_value</code></em> is not
          <code class="literal">NULL</code>, behaves identically to
          <code class="literal">jsonb_set</code>. Otherwise behaves according to the value of
          <em class="parameter"><code>null_value_treatment</code></em> which must be one of
          <code class="literal">'raise_exception'</code>,
          <code class="literal">'use_json_null'</code>, <code class="literal">'delete_key'</code>,
          or <code class="literal">'return_target'</code>. The default is
          <code class="literal">'use_json_null'</code>.
        </div>
        <div>
          <code class="literal">jsonb_set_lax('[\{"f1":1,"f2":null},2,null,3]', '\{0,f1}', null)</code>
          → <code class="returnvalue">[\{"f1": null, "f2": null}, 2, null, 3]</code>
        </div>
        <div>
          <code class="literal">jsonb_set_lax('[\{"f1":99,"f2":null},2]', '\{0,f3}', null, true, 'return_target')</code>
          → <code class="returnvalue">[\{"f1": 99, "f2": null}, 2]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.15.1.1.1" class="indexterm"></a>
          <code class="function">jsonb_insert</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">text[]</code>,
          <em class="parameter"><code>new_value</code></em> <code class="type">jsonb</code> [<span
            class="optional">, <em class="parameter"><code>insert_after</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Returns <em class="parameter"><code>target</code></em> with
          <em class="parameter"><code>new_value</code></em> inserted. If the item designated by the
          <em class="parameter"><code>path</code></em> is an array element,
          <em class="parameter"><code>new_value</code></em> will be inserted before that item if
          <em class="parameter"><code>insert_after</code></em> is false (which is the default), or
          after it if <em class="parameter"><code>insert_after</code></em> is true. If the item
          designated by the <em class="parameter"><code>path</code></em> is an object field,
          <em class="parameter"><code>new_value</code></em> will be inserted only if the object does
          not already contain that key. All earlier steps in the path must exist, or the
          <em class="parameter"><code>target</code></em> is returned unchanged. As with the path
          oriented operators, negative integers that appear in the
          <em class="parameter"><code>path</code></em> count from the end of JSON arrays. If the
          last path step is an array index that is out of range, the new value is added at the
          beginning of the array if the index is negative, or at the end of the array if it is
          positive.
        </div>
        <div>
          <code class="literal">jsonb_insert('\{"a": [0,1,2]}', '\{a, 1}', '"new_value"')</code>
          → <code class="returnvalue">\{"a": [0, "new_value", 1, 2]}</code>
        </div>
        <div>
          <code class="literal">jsonb_insert('\{"a": [0,1,2]}', '\{a, 1}', '"new_value"', true)</code>
          → <code class="returnvalue">\{"a": [0, 1, "new_value", 2]}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.16.1.1.1" class="indexterm"></a>
          <code class="function">json_strip_nulls</code> ( <code class="type">json</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.16.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_strip_nulls</code> ( <code class="type">jsonb</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Deletes all object fields that have null values from the given JSON value, recursively.
          Null values that are not object fields are untouched.
        </div>
        <div>
          <code class="literal">json_strip_nulls('[\{"f1":1, "f2":null}, 2, null, 3]')</code>
          → <code class="returnvalue">[\{"f1":1},2,null,3]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.17.1.1.1" class="indexterm"></a>
          <code class="function">jsonb_path_exists</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">jsonpath</code> [<span
            class="optional">, <em class="parameter"><code>vars</code></em> <code class="type">jsonb</code> [<span
              class="optional">, <em class="parameter"><code>silent</code></em>
              <code class="type">boolean</code> </span>]</span>] ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Checks whether the JSON path returns any item for the specified JSON value. If the
          <em class="parameter"><code>vars</code></em> argument is specified, it must be a JSON
          object, and its fields provide named values to be substituted into the
          <code class="type">jsonpath</code> expression. If the
          <em class="parameter"><code>silent</code></em> argument is specified and is
          <code class="literal">true</code>, the function suppresses the same errors as the
          <code class="literal">@?</code> and <code class="literal">@@</code> operators do.
        </div>
        <div>
          <code class="literal">jsonb_path_exists('\{"a":[1,2,3,4,5]}', '$.a[*] ? (@ &gt;= $min &amp;&amp; @ &lt;=$max)', '\{"min":2, "max":4}')</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.18.1.1.1" class="indexterm"></a>
          <code class="function">jsonb_path_match</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">jsonpath</code> [<span
            class="optional">, <em class="parameter"><code>vars</code></em> <code class="type">jsonb</code> [<span
              class="optional">, <em class="parameter"><code>silent</code></em>
              <code class="type">boolean</code> </span>]</span>] ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Returns the result of a JSON path predicate check for the specified JSON value. Only the
          first item of the result is taken into account. If the result is not Boolean, then
          <code class="literal">NULL</code> is returned. The optional
          <em class="parameter"><code>vars</code></em> and
          <em class="parameter"><code>silent</code></em> arguments act the same as for
          <code class="function">jsonb_path_exists</code>.
        </div>
        <div>
          <code class="literal">jsonb_path_match('\{"a":[1,2,3,4,5]}', 'exists($.a[*] ? (@ &gt;= $min &amp;&amp; @ &lt;=$max))', '\{"min":2, "max":4}')</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.19.1.1.1" class="indexterm"></a>
          <code class="function">jsonb_path_query</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">jsonpath</code> [<span
            class="optional">, <em class="parameter"><code>vars</code></em> <code class="type">jsonb</code> [<span
              class="optional">, <em class="parameter"><code>silent</code></em>
              <code class="type">boolean</code> </span>]</span>] ) → <code class="returnvalue">setof jsonb</code>
        </div>
        <div>
          Returns all JSON items returned by the JSON path for the specified JSON value. The
          optional <em class="parameter"><code>vars</code></em> and
          <em class="parameter"><code>silent</code></em> arguments act the same as for
          <code class="function">jsonb_path_exists</code>.
        </div>
        <div>
          <code class="literal">select * from jsonb_path_query('\{"a":[1,2,3,4,5]}', '$.a[*] ? (@ &gt;= $min &amp;&amp;
            @ &lt;= $max)', '\{"min":2, "max":4}')</code>
          → <code class="returnvalue"></code>
        </div>
        ```bash
        jsonb_path_query
        ------------------
        2
        3
        4
        ```
    </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.20.1.1.1" class="indexterm"></a>
          <code class="function">jsonb_path_query_array</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">jsonpath</code> [<span
            class="optional">, <em class="parameter"><code>vars</code></em> <code class="type">jsonb</code> [<span
              class="optional">, <em class="parameter"><code>silent</code></em>
              <code class="type">boolean</code> </span>]</span>] ) → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Returns all JSON items returned by the JSON path for the specified JSON value, as a JSON
          array. The optional <em class="parameter"><code>vars</code></em> and
          <em class="parameter"><code>silent</code></em> arguments act the same as for
          <code class="function">jsonb_path_exists</code>.
        </div>
        <div>
          <code class="literal">jsonb_path_query_array('\{"a":[1,2,3,4,5]}', '$.a[*] ? (@ &gt;= $min &amp;&amp; @ &lt;=$max)', '\{"min":2, "max":4}')</code>
          → <code class="returnvalue">[2, 3, 4]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.21.1.1.1" class="indexterm"></a>
          <code class="function">jsonb_path_query_first</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">jsonpath</code> [<span
            class="optional">, <em class="parameter"><code>vars</code></em> <code class="type">jsonb</code> [<span
              class="optional">, <em class="parameter"><code>silent</code></em>
              <code class="type">boolean</code> </span>]</span>] ) → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Returns the first JSON item returned by the JSON path for the specified JSON value.
          Returns <code class="literal">NULL</code> if there are no results. The optional
          <em class="parameter"><code>vars</code></em> and
          <em class="parameter"><code>silent</code></em> arguments act the same as for
          <code class="function">jsonb_path_exists</code>.
        </div>
        <div>
          <code class="literal">jsonb_path_query_first('\{"a":[1,2,3,4,5]}', '$.a[*] ? (@ &gt;= $min &amp;&amp; @ &lt;=$max)', '\{"min":2, "max":4}')</code>
          → <code class="returnvalue">2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.22.1.1.1" class="indexterm"></a>
          <code class="function">jsonb_path_exists_tz</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">jsonpath</code> [<span
            class="optional">, <em class="parameter"><code>vars</code></em> <code class="type">jsonb</code> [<span
              class="optional">, <em class="parameter"><code>silent</code></em>
              <code class="type">boolean</code> </span>]</span>] ) → <code class="returnvalue">boolean</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.22.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_path_match_tz</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">jsonpath</code> [<span
            class="optional">, <em class="parameter"><code>vars</code></em> <code class="type">jsonb</code> [<span
              class="optional">, <em class="parameter"><code>silent</code></em>
              <code class="type">boolean</code> </span>]</span>] ) → <code class="returnvalue">boolean</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.22.1.3.1" class="indexterm"></a>
          <code class="function">jsonb_path_query_tz</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">jsonpath</code> [<span
            class="optional">, <em class="parameter"><code>vars</code></em> <code class="type">jsonb</code> [<span
              class="optional">, <em class="parameter"><code>silent</code></em>
              <code class="type">boolean</code> </span>]</span>] ) → <code class="returnvalue">setof jsonb</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.22.1.4.1" class="indexterm"></a>
          <code class="function">jsonb_path_query_array_tz</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">jsonpath</code> [<span
            class="optional">, <em class="parameter"><code>vars</code></em> <code class="type">jsonb</code> [<span
              class="optional">, <em class="parameter"><code>silent</code></em>
              <code class="type">boolean</code> </span>]</span>] ) → <code class="returnvalue">jsonb</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.22.1.5.1" class="indexterm"></a>
          <code class="function">jsonb_path_query_first_tz</code> (
          <em class="parameter"><code>target</code></em> <code class="type">jsonb</code>,
          <em class="parameter"><code>path</code></em> <code class="type">jsonpath</code> [<span
            class="optional">, <em class="parameter"><code>vars</code></em> <code class="type">jsonb</code> [<span
              class="optional">, <em class="parameter"><code>silent</code></em>
              <code class="type">boolean</code> </span>]</span>] ) → <code class="returnvalue">jsonb</code>
        </div>
        <div>
          These functions act like their counterparts described above without the
          <code class="literal">_tz</code> suffix, except that these functions support comparisons
          of date/time values that require timezone-aware conversions. The example below requires
          interpretation of the date-only value <code class="literal">2015-08-02</code> as a
          timestamp with time zone, so the result depends on the current
          <a class="xref" href="runtime-config-client.html#GUC-TIMEZONE">TimeZone</a> setting. Due
          to this dependency, these functions are marked as stable, which means these functions
          cannot be used in indexes. Their counterparts are immutable, and so can be used in
          indexes; but they will throw errors if asked to make such comparisons.
        </div>
        <div>
          <code class="literal">jsonb_path_exists_tz('["2015-08-01 12:00:00-05"]', '$[*] ? (@.datetime() &lt;
            "2015-08-02".datetime())')</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.23.1.1.1" class="indexterm"></a>
          <code class="function">jsonb_pretty</code> ( <code class="type">jsonb</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>Converts the given JSON value to pretty-printed, indented text.</div>
        <div>
          <code class="literal">jsonb_pretty('[\{"f1":1,"f2":null}, 2]')</code>
          → <code class="returnvalue"></code>
        </div>

```json
[
  {
    "f1": 1,
    "f2": null
  }
]
```

  </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.24.1.1.1" class="indexterm"></a>
          <code class="function">json_typeof</code> ( <code class="type">json</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.22.8.13.2.2.24.1.2.1" class="indexterm"></a>
          <code class="function">jsonb_typeof</code> ( <code class="type">jsonb</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the type of the top-level JSON value as a text string. Possible types are
          <code class="literal">object</code>, <code class="literal">array</code>,
          <code class="literal">string</code>, <code class="literal">number</code>,
          <code class="literal">boolean</code>, and <code class="literal">null</code>. (The
          <code class="literal">null</code> result should not be confused with an SQL NULL; see the
          examples.)
        </div>
        <div>
          <code class="literal">json_typeof('-123.4')</code>
          → <code class="returnvalue">number</code>
        </div>
        <div>
          <code class="literal">json_typeof('null'::json)</code>
          → <code class="returnvalue">null</code>
        </div>
        <div>
          <code class="literal">json_typeof(NULL::json) IS NULL</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-SQLJSON-PATH)

### 9.16.2. The SQL/JSON Path Language [#](#FUNCTIONS-SQLJSON-PATH)

SQL/JSON path expressions specify the items to be retrieved from the JSON data, similar to XPath expressions used for SQL access to XML. In PostgreSQL, path expressions are implemented as the `jsonpath` data type and can use any elements described in [Section 8.14.7](datatype-json#DATATYPE-JSONPATH).

JSON query functions and operators pass the provided path expression to the _path engine_ for evaluation. If the expression matches the queried JSON data, the corresponding JSON item, or set of items, is returned. Path expressions are written in the SQL/JSON path language and can include arithmetic expressions and functions.

A path expression consists of a sequence of elements allowed by the `jsonpath` data type. The path expression is normally evaluated from left to right, but you can use parentheses to change the order of operations. If the evaluation is successful, a sequence of JSON items is produced, and the evaluation result is returned to the JSON query function that completes the specified computation.

To refer to the JSON value being queried (the _context item_), use the `$` variable in the path expression. It can be followed by one or more [accessor operators](datatype-json#TYPE-JSONPATH-ACCESSORS), which go down the JSON structure level by level to retrieve sub-items of the context item. Each operator that follows deals with the result of the previous evaluation step.

For example, suppose you have some JSON data from a GPS tracker that you would like to parse, such as:

```json
{
  "track": {
    "segments": [
      {
        "location": [47.763, 13.4034],
        "start time": "2018-10-14 10:05:14",
        "HR": 73
      },
      {
        "location": [47.706, 13.2635],
        "start time": "2018-10-14 10:39:21",
        "HR": 135
      }
    ]
  }
}
```

To retrieve the available track segments, you need to use the `.key` accessor operator to descend through surrounding JSON objects:

```

$.track.segments

```

To retrieve the contents of an array, you typically use the `[*]` operator. For example, the following path will return the location coordinates for all the available track segments:

```

$.track.segments[*].location

```

To return the coordinates of the first segment only, you can specify the corresponding subscript in the `[]` accessor operator. Recall that JSON array indexes are 0-relative:

```

$.track.segments[0].location

```

The result of each path evaluation step can be processed by one or more `jsonpath` operators and methods listed in [Section 9.16.2.2](functions-json#FUNCTIONS-SQLJSON-PATH-OPERATORS). Each method name must be preceded by a dot. For example, you can get the size of an array:

```

$.track.segments.size()

```

More examples of using `jsonpath` operators and methods within path expressions appear below in [Section 9.16.2.2](functions-json#FUNCTIONS-SQLJSON-PATH-OPERATORS).

When defining a path, you can also use one or more _filter expressions_ that work similarly to the `WHERE` clause in SQL. A filter expression begins with a question mark and provides a condition in parentheses:

```

? (condition)

```

Filter expressions must be written just after the path evaluation step to which they should apply. The result of that step is filtered to include only those items that satisfy the provided condition. SQL/JSON defines three-valued logic, so the condition can be `true`, `false`, or `unknown`. The `unknown` value plays the same role as SQL `NULL` and can be tested for with the `is unknown` predicate. Further path evaluation steps use only those items for which the filter expression returned `true`.

The functions and operators that can be used in filter expressions are listed in [Table 9.51](functions-json#FUNCTIONS-SQLJSON-FILTER-EX-TABLE). Within a filter expression, the `@` variable denotes the value being filtered (i.e., one result of the preceding path step). You can write accessor operators after `@` to retrieve component items.

For example, suppose you would like to retrieve all heart rate values higher than 130. You can achieve this using the following expression:

```

$.track.segments[*].HR ? (@ > 130)

```

To get the start times of segments with such values, you have to filter out irrelevant segments before returning the start times, so the filter expression is applied to the previous step, and the path used in the condition is different:

```

$.track.segments[*] ? (@.HR > 130)."start time"

```

You can use several filter expressions in sequence, if required. For example, the following expression selects start times of all segments that contain locations with relevant coordinates and high heart rate values:

```

$.track.segments[*] ? (@.location[1] < 13.4) ? (@.HR > 130)."start time"

```

Using filter expressions at different nesting levels is also allowed. The following example first filters all segments by location, and then returns high heart rate values for these segments, if available:

```

$.track.segments[*] ? (@.location[1] < 13.4).HR ? (@ > 130)

```

You can also nest filter expressions within each other:

```

$.track ? (exists(@.segments[*] ? (@.HR > 130))).segments.size()

```

This expression returns the size of the track if it contains any segments with high heart rate values, or an empty sequence otherwise.

PostgreSQL's implementation of the SQL/JSON path language has the following deviations from the SQL/JSON standard:

- A path expression can be a Boolean predicate, although the SQL/JSON standard allows predicates only in filters. This is necessary for implementation of the `@@` operator. For example, the following `jsonpath` expression is valid in PostgreSQL:

```

$.track.segments[*].HR < 70

```

- There are minor differences in the interpretation of regular expression patterns used in `like_regex` filters, as described in [Section 9.16.2.3](functions-json#JSONPATH-REGULAR-EXPRESSIONS).

[#id](#STRICT-AND-LAX-MODES)

#### 9.16.2.1. Strict and Lax Modes [#](#STRICT-AND-LAX-MODES)

When you query JSON data, the path expression may not match the actual JSON data structure. An attempt to access a non-existent member of an object or element of an array results in a structural error. SQL/JSON path expressions have two modes of handling structural errors:

- lax (default) — the path engine implicitly adapts the queried data to the specified path. Any remaining structural errors are suppressed and converted to empty SQL/JSON sequences.

- strict — if a structural error occurs, an error is raised.

The lax mode facilitates matching of a JSON document structure and path expression if the JSON data does not conform to the expected schema. If an operand does not match the requirements of a particular operation, it can be automatically wrapped as an SQL/JSON array or unwrapped by converting its elements into an SQL/JSON sequence before performing this operation. Besides, comparison operators automatically unwrap their operands in the lax mode, so you can compare SQL/JSON arrays out-of-the-box. An array of size 1 is considered equal to its sole element. Automatic unwrapping is not performed only when:

- The path expression contains `type()` or `size()` methods that return the type and the number of elements in the array, respectively.

- The queried JSON data contain nested arrays. In this case, only the outermost array is unwrapped, while all the inner arrays remain unchanged. Thus, implicit unwrapping can only go one level down within each path evaluation step.

For example, when querying the GPS data listed above, you can abstract from the fact that it stores an array of segments when using the lax mode:

```

lax $.track.segments.location

```

In the strict mode, the specified path must exactly match the structure of the queried JSON document to return an SQL/JSON item, so using this path expression will cause an error. To get the same result as in the lax mode, you have to explicitly unwrap the `segments` array:

```

strict $.track.segments[*].location

```

The `.**` accessor can lead to surprising results when using the lax mode. For instance, the following query selects every `HR` value twice:

```

lax $.\*\*.HR

```

This happens because the `.**` accessor selects both the `segments` array and each of its elements, while the `.HR` accessor automatically unwraps arrays when using the lax mode. To avoid surprising results, we recommend using the `.**` accessor only in the strict mode. The following query selects each `HR` value just once:

```

strict $.\*\*.HR

```

[#id](#FUNCTIONS-SQLJSON-PATH-OPERATORS)

#### 9.16.2.2. SQL/JSON Path Operators and Methods [#](#FUNCTIONS-SQLJSON-PATH-OPERATORS)

[Table 9.50](functions-json#FUNCTIONS-SQLJSON-OP-TABLE) shows the operators and methods available in `jsonpath`. Note that while the unary operators and methods can be applied to multiple values resulting from a preceding path step, the binary operators (addition etc.) can only be applied to single values.

[#id](#FUNCTIONS-SQLJSON-OP-TABLE)

**Table 9.50. `jsonpath` Operators and Methods**

<figure class="table-wrapper">
<table class="table" summary="jsonpath Operators and Methods" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Operator/Method</div>
        <div>Description</div>
        <div>Example(s)</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>number</code></em> <code class="literal">+</code>
          <em class="replaceable"><code>number</code></em> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Addition</div>
        <div>
          <code class="literal">jsonb_path_query('[2]', '$[0] + 3')</code>
          → <code class="returnvalue">5</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">+</code> <em class="replaceable"><code>number</code></em> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Unary plus (no operation); unlike addition, this can iterate over multiple values</div>
        <div>
          <code class="literal">jsonb_path_query_array('\{"x": [2,3,4]}', '+ $.x')</code>
          → <code class="returnvalue">[2, 3, 4]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>number</code></em> <code class="literal">-</code>
          <em class="replaceable"><code>number</code></em> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Subtraction</div>
        <div>
          <code class="literal">jsonb_path_query('[2]', '7 - $[0]')</code>
          → <code class="returnvalue">5</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">-</code> <em class="replaceable"><code>number</code></em> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Negation; unlike subtraction, this can iterate over multiple values</div>
        <div>
          <code class="literal">jsonb_path_query_array('\{"x": [2,3,4]}', '- $.x')</code>
          → <code class="returnvalue">[-2, -3, -4]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>number</code></em> <code class="literal">*</code>
          <em class="replaceable"><code>number</code></em> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Multiplication</div>
        <div>
          <code class="literal">jsonb_path_query('[4]', '2* $[0]')</code>
          → <code class="returnvalue">8</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>number</code></em> <code class="literal">/</code>
          <em class="replaceable"><code>number</code></em> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Division</div>
        <div>
          <code class="literal">jsonb_path_query('[8.5]', '$[0] / 2')</code>
          → <code class="returnvalue">4.2500000000000000</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>number</code></em> <code class="literal">%</code>
          <em class="replaceable"><code>number</code></em> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Modulo (remainder)</div>
        <div>
          <code class="literal">jsonb_path_query('[32]', '$[0] % 10')</code>
          → <code class="returnvalue">2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>value</code></em> <code class="literal">.</code>
          <code class="literal">type()</code> →
          <code class="returnvalue"><em class="replaceable"><code>string</code></em></code>
        </div>
        <div>Type of the JSON item (see <code class="function">json_typeof</code>)</div>
        <div>
          <code class="literal">jsonb_path_query_array('[1, "2", \{}]', '$[*].type()')</code>
          → <code class="returnvalue">["number", "string", "object"]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>value</code></em> <code class="literal">.</code>
          <code class="literal">size()</code> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Size of the JSON item (number of array elements, or 1 if not an array)</div>
        <div>
          <code class="literal">jsonb_path_query('\{"m": [11, 15]}', '$.m.size()')</code>
          → <code class="returnvalue">2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>value</code></em> <code class="literal">.</code>
          <code class="literal">double()</code> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Approximate floating-point number converted from a JSON number or string</div>
        <div>
          <code class="literal">jsonb_path_query('\{"len": "1.9"}', '$.len.double() * 2')</code>
          → <code class="returnvalue">3.8</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>number</code></em> <code class="literal">.</code>
          <code class="literal">ceiling()</code> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Nearest integer greater than or equal to the given number</div>
        <div>
          <code class="literal">jsonb_path_query('\{"h": 1.3}', '$.h.ceiling()')</code>
          → <code class="returnvalue">2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>number</code></em> <code class="literal">.</code>
          <code class="literal">floor()</code> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Nearest integer less than or equal to the given number</div>
        <div>
          <code class="literal">jsonb_path_query('\{"h": 1.7}', '$.h.floor()')</code>
          → <code class="returnvalue">1</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>number</code></em> <code class="literal">.</code>
          <code class="literal">abs()</code> →
          <code class="returnvalue"><em class="replaceable"><code>number</code></em></code>
        </div>
        <div>Absolute value of the given number</div>
        <div>
          <code class="literal">jsonb_path_query('\{"z": -0.3}', '$.z.abs()')</code>
          → <code class="returnvalue">0.3</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>string</code></em> <code class="literal">.</code>
          <code class="literal">datetime()</code> →
          <code class="returnvalue"><em class="replaceable"><code>datetime_type</code></em></code>
          (see note)
        </div>
        <div>Date/time value converted from a string</div>
        <div>
          <code class="literal">jsonb_path_query('["2015-8-1", "2015-08-12"]', '$[*] ? (@.datetime() &lt;
            "2015-08-2".datetime())')</code>
          → <code class="returnvalue">"2015-8-1"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>string</code></em> <code class="literal">.</code>
          <code class="literal">datetime(<em class="replaceable"><code>template</code></em>)</code>
          →
          <code class="returnvalue"><em class="replaceable"><code>datetime_type</code></em></code>
          (see note)
        </div>
        <div>
          Date/time value converted from a string using the specified
          <code class="function">to_timestamp</code> template
        </div>
        <div>
          <code class="literal">jsonb_path_query_array('["12:30", "18:40"]', '$[*].datetime("HH24:MI")')</code>
          → <code class="returnvalue">["12:30:00", "18:40:00"]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>object</code></em> <code class="literal">.</code>
          <code class="literal">keyvalue()</code> →
          <code class="returnvalue"><em class="replaceable"><code>array</code></em></code>
        </div>
        <div>
          The object's key-value pairs, represented as an array of objects containing three fields:
          <code class="literal">"key"</code>, <code class="literal">"value"</code>, and
          <code class="literal">"id"</code>; <code class="literal">"id"</code> is a unique
          identifier of the object the key-value pair belongs to
        </div>
        <div>
          <code class="literal">jsonb_path_query_array('\{"x": "20", "y": 32}', '$.keyvalue()')</code>
          →
          <code class="returnvalue">[\{"id": 0, "key": "x", "value": "20"}, \{"id": 0, "key": "y", "value": 32}]</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

### Note

The result type of the `datetime()` and `datetime(template)` methods can be `date`, `timetz`, `time`, `timestamptz`, or `timestamp`. Both methods determine their result type dynamically.

The `datetime()` method sequentially tries to match its input string to the ISO formats for `date`, `timetz`, `time`, `timestamptz`, and `timestamp`. It stops on the first matching format and emits the corresponding data type.

The `datetime(template)` method determines the result type according to the fields used in the provided template string.

The `datetime()` and `datetime(template)` methods use the same parsing rules as the `to_timestamp` SQL function does (see [Section 9.8](functions-formatting)), with three exceptions. First, these methods don't allow unmatched template patterns. Second, only the following separators are allowed in the template string: minus sign, period, solidus (slash), comma, apostrophe, semicolon, colon and space. Third, separators in the template string must exactly match the input string.

If different date/time types need to be compared, an implicit cast is applied. A `date` value can be cast to `timestamp` or `timestamptz`, `timestamp` can be cast to `timestamptz`, and `time` to `timetz`. However, all but the first of these conversions depend on the current [TimeZone](runtime-config-client#GUC-TIMEZONE) setting, and thus can only be performed within timezone-aware `jsonpath` functions.

[Table 9.51](functions-json#FUNCTIONS-SQLJSON-FILTER-EX-TABLE) shows the available filter expression elements.

[#id](#FUNCTIONS-SQLJSON-FILTER-EX-TABLE)

**Table 9.51. `jsonpath` Filter Expression Elements**

<figure class="table-wrapper">
<table class="table" summary="jsonpath Filter Expression Elements" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Predicate/Value</div>
        <div>Description</div>
        <div>Example(s)</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>value</code></em> <code class="literal">==</code>
          <em class="replaceable"><code>value</code></em> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Equality comparison (this, and the other comparison operators, work on all JSON scalar
          values)
        </div>
        <div>
          <code class="literal">jsonb_path_query_array('[1, "a", 1, 3]', '$[*] ? (@ == 1)')</code>
          → <code class="returnvalue">[1, 1]</code>
        </div>
        <div>
          <code class="literal">jsonb_path_query_array('[1, "a", 1, 3]', '$[*] ? (@ == "a")')</code>
          → <code class="returnvalue">["a"]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>value</code></em> <code class="literal">!=</code>
          <em class="replaceable"><code>value</code></em> → <code class="returnvalue">boolean</code>
        </div>
        <div class="func_signature">
          <em class="replaceable"><code>value</code></em> <code class="literal">&lt;&gt;</code>
          <em class="replaceable"><code>value</code></em> → <code class="returnvalue">boolean</code>
        </div>
        <div>Non-equality comparison</div>
        <div>
          <code class="literal">jsonb_path_query_array('[1, 2, 1, 3]', '$[*] ? (@ != 1)')</code>
          → <code class="returnvalue">[2, 3]</code>
        </div>
        <div>
          <code class="literal">jsonb_path_query_array('["a", "b", "c"]', '$[*] ? (@ &lt;&gt; "b")')</code>
          → <code class="returnvalue">["a", "c"]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>value</code></em> <code class="literal">&lt;</code>
          <em class="replaceable"><code>value</code></em> → <code class="returnvalue">boolean</code>
        </div>
        <div>Less-than comparison</div>
        <div>
          <code class="literal">jsonb_path_query_array('[1, 2, 3]', '$[*] ? (@ &lt; 2)')</code>
          → <code class="returnvalue">[1]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>value</code></em> <code class="literal">&lt;=</code>
          <em class="replaceable"><code>value</code></em> → <code class="returnvalue">boolean</code>
        </div>
        <div>Less-than-or-equal-to comparison</div>
        <div>
          <code class="literal">jsonb_path_query_array('["a", "b", "c"]', '$[*] ? (@ &lt;= "b")')</code>
          → <code class="returnvalue">["a", "b"]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>value</code></em> <code class="literal">&gt;</code>
          <em class="replaceable"><code>value</code></em> → <code class="returnvalue">boolean</code>
        </div>
        <div>Greater-than comparison</div>
        <div>
          <code class="literal">jsonb_path_query_array('[1, 2, 3]', '$[*] ? (@ &gt; 2)')</code>
          → <code class="returnvalue">[3]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>value</code></em> <code class="literal">&gt;=</code>
          <em class="replaceable"><code>value</code></em> → <code class="returnvalue">boolean</code>
        </div>
        <div>Greater-than-or-equal-to comparison</div>
        <div>
          <code class="literal">jsonb_path_query_array('[1, 2, 3]', '$[*] ? (@ &gt;= 2)')</code>
          → <code class="returnvalue">[2, 3]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">true</code>
          → <code class="returnvalue">boolean</code>
        </div>
        <div>JSON constant <code class="literal">true</code></div>
        <div>
          <code class="literal">jsonb_path_query('[\{"name": "John", "parent": false}, \{"name": "Chris", "parent":
            true}]', '$[*] ? (@.parent == true)')</code>
          → <code class="returnvalue">\{"name": "Chris", "parent": true}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">false</code>
          → <code class="returnvalue">boolean</code>
        </div>
        <div>JSON constant <code class="literal">false</code></div>
        <div>
          <code class="literal">jsonb_path_query('[\{"name": "John", "parent": false}, \{"name": "Chris", "parent":
            true}]', '$[*] ? (@.parent == false)')</code>
          → <code class="returnvalue">\{"name": "John", "parent": false}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">null</code>
          →
          <code class="returnvalue"
            ><em class="replaceable"><code>value</code></em></code>
        </div>
        <div>
          JSON constant <code class="literal">null</code> (note that, unlike in SQL, comparison to
          <code class="literal">null</code> works normally)
        </div>
        <div>
          <code class="literal">jsonb_path_query('[\{"name": "Mary", "job": null}, \{"name": "Michael", "job":
            "driver"}]', '$[*] ? (@.job == null) .name')</code>
          → <code class="returnvalue">"Mary"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>boolean</code></em> <code class="literal">&amp;&amp;</code>
          <em class="replaceable"><code>boolean</code></em> →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Boolean AND</div>
        <div>
          <code class="literal">jsonb_path_query('[1, 3, 7]', '$[*] ? (@ &gt; 1 &amp;&amp; @ &lt; 5)')</code>
          → <code class="returnvalue">3</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>boolean</code></em> <code class="literal">||</code>
          <em class="replaceable"><code>boolean</code></em> →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Boolean OR</div>
        <div>
          <code class="literal">jsonb_path_query('[1, 3, 7]', '$[*] ? (@ &lt; 1 || @ &gt; 5)')</code>
          → <code class="returnvalue">7</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">!</code> <em class="replaceable"><code>boolean</code></em> →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Boolean NOT</div>
        <div>
          <code class="literal">jsonb_path_query('[1, 3, 7]', '$[*] ? (!(@ &lt; 5))')</code>
          → <code class="returnvalue">7</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>boolean</code></em>
          <code class="literal">is unknown</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Tests whether a Boolean condition is <code class="literal">unknown</code>.</div>
        <div>
          <code class="literal">jsonb_path_query('[-1, 2, 7, "foo"]', '$[*] ? ((@ &gt; 0) is unknown)')</code>
          → <code class="returnvalue">"foo"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>string</code></em> <code class="literal">like_regex</code>
          <em class="replaceable"><code>string</code></em> [<span class="optional">
            <code class="literal">flag</code>
            <em class="replaceable"><code>string</code></em> </span>] → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Tests whether the first operand matches the regular expression given by the second
          operand, optionally with modifications described by a string of
          <code class="literal">flag</code> characters (see
          <a
            class="xref"
            href="functions-json.html#JSONPATH-REGULAR-EXPRESSIONS"
            title="9.16.2.3.&nbsp;SQL/JSON Regular Expressions"
            >Section&nbsp;9.16.2.3</a>).
        </div>
        <div>
          <code class="literal">jsonb_path_query_array('["abc", "abd", "aBdC", "abdacb", "babc"]', '$[*] ? (@
            like_regex "^ab.*c")')</code>
          → <code class="returnvalue">["abc", "abdacb"]</code>
        </div>
        <div>
          <code class="literal">jsonb_path_query_array('["abc", "abd", "aBdC", "abdacb", "babc"]', '$[*] ? (@
            like_regex "^ab.*c" flag "i")')</code>
          → <code class="returnvalue">["abc", "aBdC", "abdacb"]</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <em class="replaceable"><code>string</code></em> <code class="literal">starts with</code>
          <em class="replaceable"><code>string</code></em> →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Tests whether the second operand is an initial substring of the first operand.</div>
        <div>
          <code class="literal">jsonb_path_query('["John Smith", "Mary Stone", "Bob Johnson"]', '$[*] ? (@ starts with
            "John")')</code>
          → <code class="returnvalue">"John Smith"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">exists</code> <code class="literal">(</code>
          <em class="replaceable"><code>path_expression</code></em> <code class="literal">)</code> →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Tests whether a path expression matches at least one SQL/JSON item. Returns
          <code class="literal">unknown</code> if the path expression would result in an error; the
          second example uses this to avoid a no-such-key error in strict mode.
        </div>
        <div>
          <code class="literal">jsonb_path_query('\{"x": [1, 2], "y": [2, 4]}', 'strict $.* ? (exists (@ ? (@[*] &gt;
            2)))')</code>
          → <code class="returnvalue">[2, 4]</code>
        </div>
        <div>
          <code class="literal">jsonb_path_query_array('\{"value": 41}', 'strict $ ? (exists (@.name)) .name')</code>
          → <code class="returnvalue">[]</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#JSONPATH-REGULAR-EXPRESSIONS)

#### 9.16.2.3. SQL/JSON Regular Expressions [#](#JSONPATH-REGULAR-EXPRESSIONS)

SQL/JSON path expressions allow matching text to a regular expression with the `like_regex` filter. For example, the following SQL/JSON path query would case-insensitively match all strings in an array that start with an English vowel:

```

$[*] ? (@ like_regex "^[aeiou]" flag "i")

```

The optional `flag` string may include one or more of the characters `i` for case-insensitive match, `m` to allow `^` and `$` to match at newlines, `s` to allow `.` to match a newline, and `q` to quote the whole pattern (reducing the behavior to a simple substring match).

The SQL/JSON standard borrows its definition for regular expressions from the `LIKE_REGEX` operator, which in turn uses the XQuery standard. PostgreSQL does not currently support the `LIKE_REGEX` operator. Therefore, the `like_regex` filter is implemented using the POSIX regular expression engine described in [Section 9.7.3](functions-matching#FUNCTIONS-POSIX-REGEXP). This leads to various minor discrepancies from standard SQL/JSON behavior, which are cataloged in [Section 9.7.3.8](functions-matching#POSIX-VS-XQUERY). Note, however, that the flag-letter incompatibilities described there do not apply to SQL/JSON, as it translates the XQuery flag letters to match what the POSIX engine expects.

Keep in mind that the pattern argument of `like_regex` is a JSON path string literal, written according to the rules given in [Section 8.14.7](datatype-json#DATATYPE-JSONPATH). This means in particular that any backslashes you want to use in the regular expression must be doubled. For example, to match string values of the root document that contain only digits:

```

$.* ? (@ like_regex "^\\d+$")

```

```

```

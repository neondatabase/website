[#id](#HSTORE)

## F.18. hstore — hstore key/value datatype [#](#HSTORE)

- [F.18.1. `hstore` External Representation](hstore#HSTORE-EXTERNAL-REP)
- [F.18.2. `hstore` Operators and Functions](hstore#HSTORE-OPS-FUNCS)
- [F.18.3. Indexes](hstore#HSTORE-INDEXES)
- [F.18.4. Examples](hstore#HSTORE-EXAMPLES)
- [F.18.5. Statistics](hstore#HSTORE-STATISTICS)
- [F.18.6. Compatibility](hstore#HSTORE-COMPATIBILITY)
- [F.18.7. Transforms](hstore#HSTORE-TRANSFORMS)
- [F.18.8. Authors](hstore#HSTORE-AUTHORS)

This module implements the `hstore` data type for storing sets of key/value pairs within a single PostgreSQL value. This can be useful in various scenarios, such as rows with many attributes that are rarely examined, or semi-structured data. Keys and values are simply text strings.

This module is considered “trusted”, that is, it can be installed by non-superusers who have `CREATE` privilege on the current database.

[#id](#HSTORE-EXTERNAL-REP)

### F.18.1. `hstore` External Representation [#](#HSTORE-EXTERNAL-REP)

The text representation of an `hstore`, used for input and output, includes zero or more _`key`_ `=>` _`value`_ pairs separated by commas. Some examples:

```

k => v
foo => bar, baz => whatever
"1-a" => "anything at all"
```

The order of the pairs is not significant (and may not be reproduced on output). Whitespace between pairs or around the `=>` sign is ignored. Double-quote keys and values that include whitespace, commas, `=`s or `>`s. To include a double quote or a backslash in a key or value, escape it with a backslash.

Each key in an `hstore` is unique. If you declare an `hstore` with duplicate keys, only one will be stored in the `hstore` and there is no guarantee as to which will be kept:

```

SELECT 'a=>1,a=>2'::hstore;
  hstore
----------
 "a"=>"1"
```

A value (but not a key) can be an SQL `NULL`. For example:

```

key => NULL
```

The `NULL` keyword is case-insensitive. Double-quote the `NULL` to treat it as the ordinary string “NULL”.

### Note

Keep in mind that the `hstore` text format, when used for input, applies _before_ any required quoting or escaping. If you are passing an `hstore` literal via a parameter, then no additional processing is needed. But if you're passing it as a quoted literal constant, then any single-quote characters and (depending on the setting of the `standard_conforming_strings` configuration parameter) backslash characters need to be escaped correctly. See [Section 4.1.2.1](sql-syntax-lexical#SQL-SYNTAX-STRINGS) for more on the handling of string constants.

On output, double quotes always surround keys and values, even when it's not strictly necessary.

[#id](#HSTORE-OPS-FUNCS)

### F.18.2. `hstore` Operators and Functions [#](#HSTORE-OPS-FUNCS)

The operators provided by the `hstore` module are shown in [Table F.7](hstore#HSTORE-OP-TABLE), the functions in [Table F.8](hstore#HSTORE-FUNC-TABLE).

[#id](#HSTORE-OP-TABLE)

**Table F.7. `hstore` Operators**

<figure class="table-wrapper">
<table class="table" summary="hstore Operators" border="1">
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
          <code class="type">hstore</code> <code class="literal">-&gt;</code>
          <code class="type">text</code> → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns value associated with given key, or <code class="literal">NULL</code> if not
          present.
        </div>
        <div>
          <code class="literal">'a=&gt;x, b=&gt;y'::hstore -&gt; 'a'</code>
          → <code class="returnvalue">x</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">hstore</code> <code class="literal">-&gt;</code>
          <code class="type">text[]</code> → <code class="returnvalue">text[]</code>
        </div>
        <div>
          Returns values associated with given keys, or <code class="literal">NULL</code>
          if not present.
        </div>
        <div>
          <code class="literal">'a=&gt;x, b=&gt;y, c=&gt;z'::hstore -&gt; ARRAY['c','a']</code>
          → <code class="returnvalue">\{"z","x"}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">hstore</code> <code class="literal">||</code>
          <code class="type">hstore</code> → <code class="returnvalue">hstore</code>
        </div>
        <div>Concatenates two <code class="type">hstore</code>s.</div>
        <div>
          <code class="literal">'a=&gt;b, c=&gt;d'::hstore || 'c=&gt;x, d=&gt;q'::hstore</code>
          → <code class="returnvalue">"a"=&gt;"b", "c"=&gt;"x", "d"=&gt;"q"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">hstore</code> <code class="literal">?</code>
          <code class="type">text</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does <code class="type">hstore</code> contain key?</div>
        <div>
          <code class="literal">'a=&gt;1'::hstore ? 'a'</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">hstore</code> <code class="literal">?&amp;</code>
          <code class="type">text[]</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does <code class="type">hstore</code> contain all the specified keys?</div>
        <div>
          <code class="literal">'a=&gt;1,b=&gt;2'::hstore ?&amp; ARRAY['a','b']</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">hstore</code> <code class="literal">?|</code>
          <code class="type">text[]</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does <code class="type">hstore</code> contain any of the specified keys?</div>
        <div>
          <code class="literal">'a=&gt;1,b=&gt;2'::hstore ?| ARRAY['b','c']</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">hstore</code> <code class="literal">@&gt;</code>
          <code class="type">hstore</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does left operand contain right?</div>
        <div>
          <code class="literal">'a=&gt;b, b=&gt;1, c=&gt;NULL'::hstore @&gt; 'b=&gt;1'</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">hstore</code> <code class="literal">&lt;@</code>
          <code class="type">hstore</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is left operand contained in right?</div>
        <div>
          <code class="literal">'a=&gt;c'::hstore &lt;@ 'a=&gt;b, b=&gt;1, c=&gt;NULL'</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">hstore</code> <code class="literal">-</code>
          <code class="type">text</code> → <code class="returnvalue">hstore</code>
        </div>
        <div>Deletes key from left operand.</div>
        <div>
          <code class="literal">'a=&gt;1, b=&gt;2, c=&gt;3'::hstore - 'b'::text</code>
          → <code class="returnvalue">"a"=&gt;"1", "c"=&gt;"3"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">hstore</code> <code class="literal">-</code>
          <code class="type">text[]</code> → <code class="returnvalue">hstore</code>
        </div>
        <div>Deletes keys from left operand.</div>
        <div>
          <code class="literal">'a=&gt;1, b=&gt;2, c=&gt;3'::hstore - ARRAY['a','b']</code>
          → <code class="returnvalue">"c"=&gt;"3"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">hstore</code> <code class="literal">-</code>
          <code class="type">hstore</code> → <code class="returnvalue">hstore</code>
        </div>
        <div>Deletes pairs from left operand that match pairs in the right operand.</div>
        <div>
          <code class="literal">'a=&gt;1, b=&gt;2, c=&gt;3'::hstore - 'a=&gt;4, b=&gt;2'::hstore</code>
          → <code class="returnvalue">"a"=&gt;"1", "c"=&gt;"3"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyelement</code> <code class="literal">#=</code>
          <code class="type">hstore</code> → <code class="returnvalue">anyelement</code>
        </div>
        <div>
          Replaces fields in the left operand (which must be a composite type) with matching values
          from <code class="type">hstore</code>.
        </div>
        <div>
          <code class="literal">ROW(1,3) #= 'f1=&gt;11'::hstore</code>
          → <code class="returnvalue">(11,3)</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">%%</code> <code class="type">hstore</code> →
          <code class="returnvalue">text[]</code>
        </div>
        <div>Converts <code class="type">hstore</code> to an array of alternating keys and values.</div>
        <div>
          <code class="literal">%% 'a=&gt;foo, b=&gt;bar'::hstore</code>
          → <code class="returnvalue">\{a,foo,b,bar}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">%#</code> <code class="type">hstore</code> →
          <code class="returnvalue">text[]</code>
        </div>
        <div>Converts <code class="type">hstore</code> to a two-dimensional key/value array.</div>
        <div>
          <code class="literal">%# 'a=&gt;foo, b=&gt;bar'::hstore</code>
          → <code class="returnvalue">\{\{a,foo},\{b,bar}}</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#HSTORE-FUNC-TABLE)

**Table F.8. `hstore` Functions**

<figure class="table-wrapper">
<table class="table" summary="hstore Functions" border="1">
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
          <a id="id-1.11.7.28.6.4.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">hstore</code> ( <code class="type">record</code> ) →
          <code class="returnvalue">hstore</code>
        </div>
        <div>Constructs an <code class="type">hstore</code> from a record or row.</div>
        <div>
          <code class="literal">hstore(ROW(1,2))</code>
          → <code class="returnvalue">"f1"=&gt;"1", "f2"=&gt;"2"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">hstore</code> ( <code class="type">text[]</code> ) →
          <code class="returnvalue">hstore</code>
        </div>
        <div>
          Constructs an <code class="type">hstore</code> from an array, which may be either a
          key/value array, or a two-dimensional array.
        </div>
        <div>
          <code class="literal">hstore(ARRAY['a','1','b','2'])</code>
          → <code class="returnvalue">"a"=&gt;"1", "b"=&gt;"2"</code>
        </div>
        <div>
          <code class="literal">hstore(ARRAY[['c','3'],['d','4']])</code>
          → <code class="returnvalue">"c"=&gt;"3", "d"=&gt;"4"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">hstore</code> ( <code class="type">text[]</code>,
          <code class="type">text[]</code> ) → <code class="returnvalue">hstore</code>
        </div>
        <div>Constructs an <code class="type">hstore</code> from separate key and value arrays.</div>
        <div>
          <code class="literal">hstore(ARRAY['a','b'], ARRAY['1','2'])</code>
          → <code class="returnvalue">"a"=&gt;"1", "b"=&gt;"2"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">hstore</code> ( <code class="type">text</code>,
          <code class="type">text</code> ) → <code class="returnvalue">hstore</code>
        </div>
        <div>Makes a single-item <code class="type">hstore</code>.</div>
        <div>
          <code class="literal">hstore('a', 'b')</code>
          → <code class="returnvalue">"a"=&gt;"b"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">akeys</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">text[]</code>
        </div>
        <div>Extracts an <code class="type">hstore</code>'s keys as an array.</div>
        <div>
          <code class="literal">akeys('a=&gt;1,b=&gt;2')</code>
          → <code class="returnvalue">\{a,b}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">skeys</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">setof text</code>
        </div>
        <div>Extracts an <code class="type">hstore</code>'s keys as a set.</div>
        <div>
          <code class="literal">skeys('a=&gt;1,b=&gt;2')</code>
          → <code class="returnvalue"></code>
        </div><div>
        <pre class="programlisting">
a
b
</pre>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">avals</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">text[]</code>
        </div>
        <div>Extracts an <code class="type">hstore</code>'s values as an array.</div>
        <div>
          <code class="literal">avals('a=&gt;1,b=&gt;2')</code>
          → <code class="returnvalue">\{1,2}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">svals</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">setof text</code>
        </div>
        <div>Extracts an <code class="type">hstore</code>'s values as a set.</div>
        <div>
          <code class="literal">svals('a=&gt;1,b=&gt;2')</code>
          → <code class="returnvalue"></code>
        </div><div>
        <pre class="programlisting">
1
2
</pre>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">hstore_to_array</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">text[]</code>
        </div>
        <div>
          Extracts an <code class="type">hstore</code>'s keys and values as an array of alternating
          keys and values.
        </div>
        <div>
          <code class="literal">hstore_to_array('a=&gt;1,b=&gt;2')</code>
          → <code class="returnvalue">\{a,1,b,2}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">hstore_to_matrix</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">text[]</code>
        </div>
        <div>
          Extracts an <code class="type">hstore</code>'s keys and values as a two-dimensional array.
        </div>
        <div>
          <code class="literal">hstore_to_matrix('a=&gt;1,b=&gt;2')</code>
          → <code class="returnvalue">\{\{a,1},\{b,2}}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">hstore_to_json</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div>
          Converts an <code class="type">hstore</code> to a <code class="type">json</code> value,
          converting all non-null values to JSON strings.
        </div>
        <div>
          This function is used implicitly when an <code class="type">hstore</code> value is cast to
          <code class="type">json</code>.
        </div>
        <div>
          <code class="literal">hstore_to_json('"a key"=&gt;1, b=&gt;t, c=&gt;null, d=&gt;12345, e=&gt;012345,
            f=&gt;1.234, g=&gt;2.345e+4')</code>
          →
          <code class="returnvalue">\{"a key": "1", "b": "t", "c": null, "d": "12345", "e": "012345", "f": "1.234", "g":
            "2.345e+4"}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">hstore_to_jsonb</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Converts an <code class="type">hstore</code> to a <code class="type">jsonb</code> value,
          converting all non-null values to JSON strings.
        </div>
        <div>
          This function is used implicitly when an <code class="type">hstore</code> value is cast to
          <code class="type">jsonb</code>.
        </div>
        <div>
          <code class="literal">hstore_to_jsonb('"a key"=&gt;1, b=&gt;t, c=&gt;null, d=&gt;12345, e=&gt;012345,
            f=&gt;1.234, g=&gt;2.345e+4')</code>
          →
          <code class="returnvalue">\{"a key": "1", "b": "t", "c": null, "d": "12345", "e": "012345", "f": "1.234", "g":
            "2.345e+4"}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">hstore_to_json_loose</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">json</code>
        </div>
        <div>
          Converts an <code class="type">hstore</code> to a <code class="type">json</code> value,
          but attempts to distinguish numerical and Boolean values so they are unquoted in the JSON.
        </div>
        <div>
          <code class="literal">hstore_to_json_loose('"a key"=&gt;1, b=&gt;t, c=&gt;null, d=&gt;12345, e=&gt;012345,
            f=&gt;1.234, g=&gt;2.345e+4')</code>
          →
          <code class="returnvalue">\{"a key": 1, "b": true, "c": null, "d": 12345, "e": "012345", "f": 1.234, "g":
            2.345e+4}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.14.1.1.1" class="indexterm"></a>
          <code class="function">hstore_to_jsonb_loose</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">jsonb</code>
        </div>
        <div>
          Converts an <code class="type">hstore</code> to a <code class="type">jsonb</code> value,
          but attempts to distinguish numerical and Boolean values so they are unquoted in the JSON.
        </div>
        <div>
          <code class="literal">hstore_to_jsonb_loose('"a key"=&gt;1, b=&gt;t, c=&gt;null, d=&gt;12345, e=&gt;012345,
            f=&gt;1.234, g=&gt;2.345e+4')</code>
          →
          <code class="returnvalue">\{"a key": 1, "b": true, "c": null, "d": 12345, "e": "012345", "f": 1.234, "g":
            2.345e+4}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.15.1.1.1" class="indexterm"></a>
          <code class="function">slice</code> ( <code class="type">hstore</code>,
          <code class="type">text[]</code> ) → <code class="returnvalue">hstore</code>
        </div>
        <div>
          Extracts a subset of an <code class="type">hstore</code> containing only the specified
          keys.
        </div>
        <div>
          <code class="literal">slice('a=&gt;1,b=&gt;2,c=&gt;3'::hstore, ARRAY['b','c','x'])</code>
          → <code class="returnvalue">"b"=&gt;"2", "c"=&gt;"3"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.16.1.1.1" class="indexterm"></a>
          <code class="function">each</code> ( <code class="type">hstore</code> ) →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>key</code></em> <code class="type">text</code>,
          <em class="parameter"><code>value</code></em> <code class="type">text</code> )
        </div>
        <div>Extracts an <code class="type">hstore</code>'s keys and values as a set of records.</div>
        <div>
          <code class="literal">select * from each('a=&gt;1,b=&gt;2')</code>
          → <code class="returnvalue"></code>
        </div><div>
        <pre class="programlisting">
 key | value
-----+-------
 a   | 1
 b   | 2
</pre>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.17.1.1.1" class="indexterm"></a>
          <code class="function">exist</code> ( <code class="type">hstore</code>,
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>Does <code class="type">hstore</code> contain key?</div>
        <div>
          <code class="literal">exist('a=&gt;1', 'a')</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.18.1.1.1" class="indexterm"></a>
          <code class="function">defined</code> ( <code class="type">hstore</code>,
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does <code class="type">hstore</code> contain a non-<code class="literal">NULL</code>
          value for key?
        </div>
        <div>
          <code class="literal">defined('a=&gt;NULL', 'a')</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.19.1.1.1" class="indexterm"></a>
          <code class="function">delete</code> ( <code class="type">hstore</code>,
          <code class="type">text</code> ) → <code class="returnvalue">hstore</code>
        </div>
        <div>Deletes pair with matching key.</div>
        <div>
          <code class="literal">delete('a=&gt;1,b=&gt;2', 'b')</code>
          → <code class="returnvalue">"a"=&gt;"1"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">delete</code> ( <code class="type">hstore</code>,
          <code class="type">text[]</code> ) → <code class="returnvalue">hstore</code>
        </div>
        <div>Deletes pairs with matching keys.</div>
        <div>
          <code class="literal">delete('a=&gt;1,b=&gt;2,c=&gt;3', ARRAY['a','b'])</code>
          → <code class="returnvalue">"c"=&gt;"3"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">delete</code> ( <code class="type">hstore</code>,
          <code class="type">hstore</code> ) → <code class="returnvalue">hstore</code>
        </div>
        <div>Deletes pairs matching those in the second argument.</div>
        <div>
          <code class="literal">delete('a=&gt;1,b=&gt;2', 'a=&gt;4,b=&gt;2'::hstore)</code>
          → <code class="returnvalue">"a"=&gt;"1"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.11.7.28.6.4.2.2.22.1.1.1" class="indexterm"></a>
          <code class="function">populate_record</code> ( <code class="type">anyelement</code>,
          <code class="type">hstore</code> ) → <code class="returnvalue">anyelement</code>
        </div>
        <div>
          Replaces fields in the left operand (which must be a composite type) with matching values
          from <code class="type">hstore</code>.
        </div>
        <div>
          <code class="literal">populate_record(ROW(1,2), 'f1=&gt;42'::hstore)</code>
          → <code class="returnvalue">(42,2)</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

In addition to these operators and functions, values of the `hstore` type can be subscripted, allowing them to act like associative arrays. Only a single subscript of type `text` can be specified; it is interpreted as a key and the corresponding value is fetched or stored. For example,

```

CREATE TABLE mytable (h hstore);
INSERT INTO mytable VALUES ('a=>b, c=>d');
SELECT h['a'] FROM mytable;
h

---

b
(1 row)

UPDATE mytable SET h['c'] = 'new';
SELECT h FROM mytable;
h

---

"a"=>"b", "c"=>"new"
(1 row)

```

A subscripted fetch returns `NULL` if the subscript is `NULL` or that key does not exist in the `hstore`. (Thus, a subscripted fetch is not greatly different from the `->` operator.) A subscripted update fails if the subscript is `NULL`; otherwise, it replaces the value for that key, adding an entry to the `hstore` if the key does not already exist.

[#id](#HSTORE-INDEXES)

### F.18.3. Indexes [#](#HSTORE-INDEXES)

`hstore` has GiST and GIN index support for the `@>`, `?`, `?&` and `?|` operators. For example:

```

CREATE INDEX hidx ON testhstore USING GIST (h);

CREATE INDEX hidx ON testhstore USING GIN (h);

```

`gist_hstore_ops` GiST opclass approximates a set of key/value pairs as a bitmap signature. Its optional integer parameter `siglen` determines the signature length in bytes. The default length is 16 bytes. Valid values of signature length are between 1 and 2024 bytes. Longer signatures lead to a more precise search (scanning a smaller fraction of the index and fewer heap pages), at the cost of a larger index.

Example of creating such an index with a signature length of 32 bytes:

```

CREATE INDEX hidx ON testhstore USING GIST (h gist_hstore_ops(siglen=32));

```

`hstore` also supports `btree` or `hash` indexes for the `=` operator. This allows `hstore` columns to be declared `UNIQUE`, or to be used in `GROUP BY`, `ORDER BY` or `DISTINCT` expressions. The sort ordering for `hstore` values is not particularly useful, but these indexes may be useful for equivalence lookups. Create indexes for `=` comparisons as follows:

```

CREATE INDEX hidx ON testhstore USING BTREE (h);

CREATE INDEX hidx ON testhstore USING HASH (h);

```

[#id](#HSTORE-EXAMPLES)

### F.18.4. Examples [#](#HSTORE-EXAMPLES)

Add a key, or update an existing key with a new value:

```

UPDATE tab SET h['c'] = '3';

```

Another way to do the same thing is:

```

UPDATE tab SET h = h || hstore('c', '3');

```

If multiple keys are to be added or changed in one operation, the concatenation approach is more efficient than subscripting:

```

UPDATE tab SET h = h || hstore(array['q', 'w'], array['11', '12']);

```

Delete a key:

```

UPDATE tab SET h = delete(h, 'k1');

```

Convert a `record` to an `hstore`:

```

CREATE TABLE test (col1 integer, col2 text, col3 text);
INSERT INTO test VALUES (123, 'foo', 'bar');

SELECT hstore(t) FROM test AS t;
hstore

---

"col1"=>"123", "col2"=>"foo", "col3"=>"bar"
(1 row)

```

Convert an `hstore` to a predefined `record` type:

```

CREATE TABLE test (col1 integer, col2 text, col3 text);

SELECT \* FROM populate_record(null::test,
'"col1"=>"456", "col2"=>"zzz"');
col1 | col2 | col3
------+------+------
456 | zzz |
(1 row)

```

Modify an existing record using the values from an `hstore`:

```

CREATE TABLE test (col1 integer, col2 text, col3 text);
INSERT INTO test VALUES (123, 'foo', 'bar');

SELECT (r).\* FROM (SELECT t #= '"col3"=>"baz"' AS r FROM test t) s;
col1 | col2 | col3
------+------+------
123 | foo | baz
(1 row)

```

[#id](#HSTORE-STATISTICS)

### F.18.5. Statistics [#](#HSTORE-STATISTICS)

The `hstore` type, because of its intrinsic liberality, could contain a lot of different keys. Checking for valid keys is the task of the application. The following examples demonstrate several techniques for checking keys and obtaining statistics.

Simple example:

```

SELECT \* FROM each('aaa=>bq, b=>NULL, ""=>1');

```

Using a table:

```

CREATE TABLE stat AS SELECT (each(h)).key, (each(h)).value FROM testhstore;

```

Online statistics:

```

SELECT key, count(\*) FROM
(SELECT (each(h)).key FROM testhstore) AS stat
GROUP BY key
ORDER BY count DESC, key;
key | count
-----------+-------
line | 883
query | 207
pos | 203
node | 202
space | 197
status | 195
public | 194
title | 190
org | 189
...................

```

[#id](#HSTORE-COMPATIBILITY)

### F.18.6. Compatibility [#](#HSTORE-COMPATIBILITY)

As of PostgreSQL 9.0, `hstore` uses a different internal representation than previous versions. This presents no obstacle for dump/restore upgrades since the text representation (used in the dump) is unchanged.

In the event of a binary upgrade, upward compatibility is maintained by having the new code recognize old-format data. This will entail a slight performance penalty when processing data that has not yet been modified by the new code. It is possible to force an upgrade of all values in a table column by doing an `UPDATE` statement as follows:

```

UPDATE tablename SET hstorecol = hstorecol || '';

```

Another way to do it is:

```

ALTER TABLE tablename ALTER hstorecol TYPE hstore USING hstorecol || '';

```

The `ALTER TABLE` method requires an `ACCESS EXCLUSIVE` lock on the table, but does not result in bloating the table with old row versions.

[#id](#HSTORE-TRANSFORMS)

### F.18.7. Transforms [#](#HSTORE-TRANSFORMS)

Additional extensions are available that implement transforms for the `hstore` type for the languages PL/Perl and PL/Python. The extensions for PL/Perl are called `hstore_plperl` and `hstore_plperlu`, for trusted and untrusted PL/Perl. If you install these transforms and specify them when creating a function, `hstore` values are mapped to Perl hashes. The extension for PL/Python is called `hstore_plpython3u`. If you use it, `hstore` values are mapped to Python dictionaries.

### Caution

It is strongly recommended that the transform extensions be installed in the same schema as `hstore`. Otherwise there are installation-time security hazards if a transform extension's schema contains objects defined by a hostile user.

[#id](#HSTORE-AUTHORS)

### F.18.8. Authors [#](#HSTORE-AUTHORS)

Oleg Bartunov `<oleg@sai.msu.su>`, Moscow, Moscow University, Russia

Teodor Sigaev `<teodor@sigaev.ru>`, Moscow, Delta-Soft Ltd., Russia

Additional enhancements by Andrew Gierth `<andrew@tao11.riddles.org.uk>`, United Kingdom

```
````

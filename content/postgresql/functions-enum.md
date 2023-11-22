[#id](#FUNCTIONS-ENUM)

## 9.10. Enum Support Functions [#](#FUNCTIONS-ENUM)

For enum types (described in [Section 8.7](datatype-enum)), there are several functions that allow cleaner programming without hard-coding particular values of an enum type. These are listed in [Table 9.35](functions-enum#FUNCTIONS-ENUM-TABLE). The examples assume an enum type created as:

```

CREATE TYPE rainbow AS ENUM ('red', 'orange', 'yellow', 'green', 'blue', 'purple');
```

[#id](#FUNCTIONS-ENUM-TABLE)

**Table 9.35. Enum Support Functions**

<table class="table" summary="Enum Support Functions" border="1">
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
          <a id="id-1.5.8.16.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">enum_first</code> ( <code class="type">anyenum</code> ) →
          <code class="returnvalue">anyenum</code>
        </p>
        <p>Returns the first value of the input enum type.</p>
        <p>
          <code class="literal">enum_first(null::rainbow)</code>
          → <code class="returnvalue">red</code>
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <a id="id-1.5.8.16.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">enum_last</code> ( <code class="type">anyenum</code> ) →
          <code class="returnvalue">anyenum</code>
        </p>
        <p>Returns the last value of the input enum type.</p>
        <p>
          <code class="literal">enum_last(null::rainbow)</code>
          → <code class="returnvalue">purple</code>
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <a id="id-1.5.8.16.3.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">enum_range</code> ( <code class="type">anyenum</code> ) →
          <code class="returnvalue">anyarray</code>
        </p>
        <p>Returns all values of the input enum type in an ordered array.</p>
        <p>
          <code class="literal">enum_range(null::rainbow)</code>
          → <code class="returnvalue">{red,orange,yellow,​green,blue,purple}</code>
        </p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <p class="func_signature">
          <code class="function">enum_range</code> ( <code class="type">anyenum</code>,
          <code class="type">anyenum</code> ) → <code class="returnvalue">anyarray</code>
        </p>
        <p>
          Returns the range between the two given enum values, as an ordered array. The values must
          be from the same enum type. If the first parameter is null, the result will start with the
          first value of the enum type. If the second parameter is null, the result will end with
          the last value of the enum type.
        </p>
        <p>
          <code class="literal">enum_range('orange'::rainbow, 'green'::rainbow)</code>
          → <code class="returnvalue">{orange,yellow,green}</code>
        </p>
        <p>
          <code class="literal">enum_range(NULL, 'green'::rainbow)</code>
          → <code class="returnvalue">{red,orange,​yellow,green}</code>
        </p>
        <p>
          <code class="literal">enum_range('orange'::rainbow, NULL)</code>
          → <code class="returnvalue">{orange,yellow,green,​blue,purple}</code>
        </p>
      </td>
    </tr>
  </tbody>
</table>

Notice that except for the two-argument form of `enum_range`, these functions disregard the specific value passed to them; they care only about its declared data type. Either null or a specific value of the type can be passed, with the same result. It is more common to apply these functions to a table column or function argument than to a hardwired type name as used in the examples.

[#id](#FUNCTIONS-STRING)

## 9.4. String Functions and Operators [#](#FUNCTIONS-STRING)

- [9.4.1. `format`](functions-string#FUNCTIONS-STRING-FORMAT)

This section describes functions and operators for examining and manipulating string values. Strings in this context include values of the types `character`, `character varying`, and `text`. Except where noted, these functions and operators are declared to accept and return type `text`. They will interchangeably accept `character varying` arguments. Values of type `character` will be converted to `text` before the function or operator is applied, resulting in stripping any trailing spaces in the `character` value.

SQL defines some string functions that use key words, rather than commas, to separate arguments. Details are in [Table 9.9](functions-string#FUNCTIONS-STRING-SQL). PostgreSQL also provides versions of these functions that use the regular function invocation syntax (see [Table 9.10](functions-string#FUNCTIONS-STRING-OTHER)).

### Note

The string concatenation operator (`||`) will accept non-string input, so long as at least one input is of string type, as shown in [Table 9.9](functions-string#FUNCTIONS-STRING-SQL). For other cases, inserting an explicit coercion to `text` can be used to have non-string input accepted.

[#id](#FUNCTIONS-STRING-SQL)

**Table 9.9. SQL String Functions and Operators**

<figure class="table-wrapper">
<table class="table" summary="SQL String Functions and Operators" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function/Operator</div>
        <div>Description</div>
        <div>Example(s)</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.1.1.1.1" class="indexterm"></a>
          <code class="type">text</code> <code class="literal">||</code>
          <code class="type">text</code> → <code class="returnvalue">text</code>
        </div>
        <div>Concatenates the two strings.</div>
        <div>
          <code class="literal">'Post' || 'greSQL'</code>
          → <code class="returnvalue">PostgreSQL</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">text</code> <code class="literal">||</code>
          <code class="type">anynonarray</code> → <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="type">anynonarray</code> <code class="literal">||</code>
          <code class="type">text</code> → <code class="returnvalue">text</code>
        </div>
        <div>
          Converts the non-string input to text, then concatenates the two strings. (The non-string
          input cannot be of an array type, because that would create ambiguity with the array
          <code class="literal">||</code> operators. If you want to concatenate an array's text
          equivalent, cast it to <code class="type">text</code> explicitly.)
        </div>
        <div>
          <code class="literal">'Value: ' || 42</code>
          → <code class="returnvalue">Value: 42</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">btrim</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code> [<span class="optional">, <em class="parameter"><code>characters</code></em>
            <code class="type">text</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Removes the longest string containing only characters in
          <em class="parameter"><code>characters</code></em> (a space by default) from the start and
          end of <em class="parameter"><code>string</code></em>.
        </div>
        <div>
          <code class="literal">btrim('xyxtrimyyx', 'xyz')</code>
          → <code class="returnvalue">trim</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.4.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.10.5.2.2.4.1.1.2" class="indexterm"></a>
          <code class="type">text</code> <code class="literal">IS</code> [<span class="optional"><code class="literal">NOT</code></span>] [<span class="optional"><em class="parameter"><code>form</code></em></span>] <code class="literal">NORMALIZED</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Checks whether the string is in the specified Unicode normalization form. The optional
          <em class="parameter"><code>form</code></em> key word specifies the form:
          <code class="literal">NFC</code> (the default), <code class="literal">NFD</code>,
          <code class="literal">NFKC</code>, or <code class="literal">NFKD</code>. This expression
          can only be used when the server encoding is <code class="literal">UTF8</code>. Note that
          checking for normalization using this expression is often faster than normalizing possibly
          already normalized strings.
        </div>
        <div>
          <code class="literal">U&amp;'\0061\0308bc' IS NFD NORMALIZED</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">bit_length</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns number of bits in the string (8 times the
          <code class="function">octet_length</code>).
        </div>
        <div>
          <code class="literal">bit_length('jose')</code>
          → <code class="returnvalue">32</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.6.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.10.5.2.2.6.1.1.2" class="indexterm"></a>
          <a id="id-1.5.8.10.5.2.2.6.1.1.3" class="indexterm"></a>
          <code class="function">char_length</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.6.1.2.1" class="indexterm"></a>
          <code class="function">character_length</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns number of characters in the string.</div>
        <div>
          <code class="literal">char_length('josé')</code>
          → <code class="returnvalue">4</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">lower</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Converts the string to all lower case, according to the rules of the database's locale.
        </div>
        <div>
          <code class="literal">lower('TOM')</code>
          → <code class="returnvalue">tom</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">lpad</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>length</code></em>
          <code class="type">integer</code> [<span class="optional">, <em class="parameter"><code>fill</code></em> <code class="type">text</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Extends the <em class="parameter"><code>string</code></em> to length
          <em class="parameter"><code>length</code></em> by prepending the characters
          <em class="parameter"><code>fill</code></em> (a space by default). If the
          <em class="parameter"><code>string</code></em> is already longer than
          <em class="parameter"><code>length</code></em> then it is truncated (on the right).
        </div>
        <div>
          <code class="literal">lpad('hi', 5, 'xy')</code>
          → <code class="returnvalue">xyxhi</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">ltrim</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code> [<span class="optional">, <em class="parameter"><code>characters</code></em>
            <code class="type">text</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Removes the longest string containing only characters in
          <em class="parameter"><code>characters</code></em> (a space by default) from the start of
          <em class="parameter"><code>string</code></em>.
        </div>
        <div>
          <code class="literal">ltrim('zzzytest', 'xyz')</code>
          → <code class="returnvalue">test</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.10.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.10.5.2.2.10.1.1.2" class="indexterm"></a>
          <code class="function">normalize</code> ( <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>form</code></em> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Converts the string to the specified Unicode normalization form. The optional
          <em class="parameter"><code>form</code></em> key word specifies the form:
          <code class="literal">NFC</code> (the default), <code class="literal">NFD</code>,
          <code class="literal">NFKC</code>, or <code class="literal">NFKD</code>. This function can
          only be used when the server encoding is <code class="literal">UTF8</code>.
        </div>
        <div>
          <code class="literal">normalize(U&amp;'\0061\0308bc', NFC)</code>
          → <code class="returnvalue">U&amp;'\00E4bc'</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">octet_length</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns number of bytes in the string.</div>
        <div>
          <code class="literal">octet_length('josé')</code>
          → <code class="returnvalue">5</code> (if server encoding is UTF8)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">octet_length</code> ( <code class="type">character</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns number of bytes in the string. Since this version of the function accepts type
          <code class="type">character</code> directly, it will not strip trailing spaces.
        </div>
        <div>
          <code class="literal">octet_length('abc '::character(4))</code>
          → <code class="returnvalue">4</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">overlay</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code> <code class="literal">PLACING</code>
          <em class="parameter"><code>newsubstring</code></em> <code class="type">text</code>
          <code class="literal">FROM</code> <em class="parameter"><code>start</code></em>
          <code class="type">integer</code> [<span class="optional">
            <code class="literal">FOR</code> <em class="parameter"><code>count</code></em>
            <code class="type">integer</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Replaces the substring of <em class="parameter"><code>string</code></em> that starts at
          the <em class="parameter"><code>start</code></em>'th character and extends for <em class="parameter"><code>count</code></em> characters
          with <em class="parameter"><code>newsubstring</code></em>. If <em class="parameter"><code>count</code></em> is omitted, it defaults to the length
          of <em class="parameter"><code>newsubstring</code></em>.
        </div>
        <div>
          <code class="literal">overlay('Txxxxas' placing 'hom' from 2 for 4)</code>
          → <code class="returnvalue">Thomas</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.14.1.1.1" class="indexterm"></a>
          <code class="function">position</code> (
          <em class="parameter"><code>substring</code></em> <code class="type">text</code>
          <code class="literal">IN</code> <em class="parameter"><code>string</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns first starting index of the specified
          <em class="parameter"><code>substring</code></em> within
          <em class="parameter"><code>string</code></em>, or zero if it's not present.
        </div>
        <div>
          <code class="literal">position('om' in 'Thomas')</code>
          → <code class="returnvalue">3</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.15.1.1.1" class="indexterm"></a>
          <code class="function">rpad</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>length</code></em>
          <code class="type">integer</code> [<span class="optional">, <em class="parameter"><code>fill</code></em> <code class="type">text</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Extends the <em class="parameter"><code>string</code></em> to length
          <em class="parameter"><code>length</code></em> by appending the characters
          <em class="parameter"><code>fill</code></em> (a space by default). If the
          <em class="parameter"><code>string</code></em> is already longer than
          <em class="parameter"><code>length</code></em> then it is truncated.
        </div>
        <div>
          <code class="literal">rpad('hi', 5, 'xy')</code>
          → <code class="returnvalue">hixyx</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.16.1.1.1" class="indexterm"></a>
          <code class="function">rtrim</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code> [<span class="optional">, <em class="parameter"><code>characters</code></em>
            <code class="type">text</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Removes the longest string containing only characters in
          <em class="parameter"><code>characters</code></em> (a space by default) from the end of
          <em class="parameter"><code>string</code></em>.
        </div>
        <div>
          <code class="literal">rtrim('testxxzx', 'xyz')</code>
          → <code class="returnvalue">test</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.17.1.1.1" class="indexterm"></a>
          <code class="function">substring</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code> [<span class="optional">
            <code class="literal">FROM</code> <em class="parameter"><code>start</code></em>
            <code class="type">integer</code> </span>] [<span class="optional">
            <code class="literal">FOR</code> <em class="parameter"><code>count</code></em>
            <code class="type">integer</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Extracts the substring of <em class="parameter"><code>string</code></em> starting at the
          <em class="parameter"><code>start</code></em>'th character if that is specified, and stopping after
          <em class="parameter"><code>count</code></em> characters if that is specified. Provide at
          least one of <em class="parameter"><code>start</code></em> and
          <em class="parameter"><code>count</code></em>.
        </div>
        <div>
          <code class="literal">substring('Thomas' from 2 for 3)</code>
          → <code class="returnvalue">hom</code>
        </div>
        <div>
          <code class="literal">substring('Thomas' from 3)</code>
          → <code class="returnvalue">omas</code>
        </div>
        <div>
          <code class="literal">substring('Thomas' for 2)</code>
          → <code class="returnvalue">Th</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">substring</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code> <code class="literal">FROM</code>
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Extracts the first substring matching POSIX regular expression; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">substring('Thomas' from '...$')</code>
          → <code class="returnvalue">mas</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">substring</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code> <code class="literal">SIMILAR</code>
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code>
          <code class="literal">ESCAPE</code> <em class="parameter"><code>escape</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="function">substring</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code> <code class="literal">FROM</code>
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code>
          <code class="literal">FOR</code> <em class="parameter"><code>escape</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Extracts the first substring matching <acronym class="acronym">SQL</acronym> regular
          expression; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-SIMILARTO-REGEXP"
            title="9.7.2.&nbsp;SIMILAR TO Regular Expressions">Section&nbsp;9.7.2</a>. The first form has been specified since SQL:2003; the second form was only in SQL:1999
          and should be considered obsolete.
        </div>
        <div>
          <code class="literal">substring('Thomas' similar '%#"o_a#"_' escape '#')</code>
          → <code class="returnvalue">oma</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.20.1.1.1" class="indexterm"></a>
          <code class="function">trim</code> ( [<span class="optional">
            <code class="literal">LEADING</code> | <code class="literal">TRAILING</code> |
            <code class="literal">BOTH</code> </span>] [<span class="optional">
            <em class="parameter"><code>characters</code></em> <code class="type">text</code> </span>] <code class="literal">FROM</code> <em class="parameter"><code>string</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Removes the longest string containing only characters in
          <em class="parameter"><code>characters</code></em> (a space by default) from the start,
          end, or both ends (<code class="literal">BOTH</code> is the default) of
          <em class="parameter"><code>string</code></em>.
        </div>
        <div>
          <code class="literal">trim(both 'xyz' from 'yxTomxx')</code>
          → <code class="returnvalue">Tom</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">trim</code> ( [<span class="optional">
            <code class="literal">LEADING</code> | <code class="literal">TRAILING</code> |
            <code class="literal">BOTH</code> </span>] [<span class="optional"> <code class="literal">FROM</code> </span>]
          <em class="parameter"><code>string</code></em> <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>characters</code></em>
            <code class="type">text</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>This is a non-standard syntax for <code class="function">trim()</code>.</div>
        <div>
          <code class="literal">trim(both from 'yxTomxx', 'xyz')</code>
          → <code class="returnvalue">Tom</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.5.2.2.22.1.1.1" class="indexterm"></a>
          <code class="function">upper</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Converts the string to all upper case, according to the rules of the database's locale.
        </div>
        <div>
          <code class="literal">upper('tom')</code>
          → <code class="returnvalue">TOM</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

Additional string manipulation functions and operators are available and are listed in [Table 9.10](functions-string#FUNCTIONS-STRING-OTHER). (Some of these are used internally to implement the SQL-standard string functions listed in [Table 9.9](functions-string#FUNCTIONS-STRING-SQL).) There are also pattern-matching operators, which are described in [Section 9.7](functions-matching), and operators for full-text search, which are described in [Chapter 12](textsearch).

[#id](#FUNCTIONS-STRING-OTHER)

**Table 9.10. Other String Functions and Operators**

<figure class="table-wrapper">
<table class="table" summary="Other String Functions and Operators" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function/Operator</div>
        <div>Description</div>
        <div>Example(s)</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.1.1.1.1" class="indexterm"></a>
          <code class="type">text</code> <code class="literal">^@</code>
          <code class="type">text</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Returns true if the first string starts with the second string (equivalent to the
          <code class="function">starts_with()</code> function).
        </div>
        <div>
          <code class="literal">'alphabet' ^@ 'alph'</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">ascii</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns the numeric code of the first character of the argument. In
          <acronym class="acronym">UTF8</acronym> encoding, returns the Unicode code point of the
          character. In other multibyte encodings, the argument must be an
          <acronym class="acronym">ASCII</acronym> character.
        </div>
        <div>
          <code class="literal">ascii('x')</code>
          → <code class="returnvalue">120</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">chr</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the character with the given code. In
          <acronym class="acronym">UTF8</acronym> encoding the argument is treated as a Unicode code
          point. In other multibyte encodings the argument must designate an
          <acronym class="acronym">ASCII</acronym> character. <code class="literal">chr(0)</code> is
          disallowed because text data types cannot store that character.
        </div>
        <div>
          <code class="literal">chr(65)</code>
          → <code class="returnvalue">A</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">concat</code> ( <em class="parameter"><code>val1</code></em>
          <code class="type">"any"</code> [, <em class="parameter"><code>val2</code></em>
          <code class="type">"any"</code> [, ...] ] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Concatenates the text representations of all the arguments. NULL arguments are ignored.
        </div>
        <div>
          <code class="literal">concat('abcde', 2, NULL, 22)</code>
          → <code class="returnvalue">abcde222</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">concat_ws</code> ( <em class="parameter"><code>sep</code></em>
          <code class="type">text</code>, <em class="parameter"><code>val1</code></em>
          <code class="type">"any"</code> [, <em class="parameter"><code>val2</code></em>
          <code class="type">"any"</code> [, ...] ] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Concatenates all but the first argument, with separators. The first argument is used as
          the separator string, and should not be NULL. Other NULL arguments are ignored.
        </div>
        <div>
          <code class="literal">concat_ws(',', 'abcde', 2, NULL, 22)</code>
          → <code class="returnvalue">abcde,2,22</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">format</code> ( <em class="parameter"><code>formatstr</code></em>
          <code class="type">text</code> [, <em class="parameter"><code>formatarg</code></em>
          <code class="type">"any"</code> [, ...] ] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Formats arguments according to a format string; see
          <a
            class="xref"
            href="functions-string.html#FUNCTIONS-STRING-FORMAT"
            title="9.4.1.&nbsp;format">Section&nbsp;9.4.1</a>. This function is similar to the C function <code class="function">sprintf</code>.
        </div>
        <div>
          <code class="literal">format('Hello %s, %1$s', 'World')</code>
          → <code class="returnvalue">Hello World, World</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">initcap</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Converts the first letter of each word to upper case and the rest to lower case. Words are
          sequences of alphanumeric characters separated by non-alphanumeric characters.
        </div>
        <div>
          <code class="literal">initcap('hi THOMAS')</code>
          → <code class="returnvalue">Hi Thomas</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">left</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>n</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns first <em class="parameter"><code>n</code></em> characters in the string, or when
          <em class="parameter"><code>n</code></em> is negative, returns all but last |<em
            class="parameter"><code>n</code></em>| characters.
        </div>
        <div>
          <code class="literal">left('abcde', 2)</code>
          → <code class="returnvalue">ab</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">length</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns the number of characters in the string.</div>
        <div>
          <code class="literal">length('jose')</code>
          → <code class="returnvalue">4</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">md5</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Computes the MD5
          <a class="link" href="functions-binarystring.html#FUNCTIONS-HASH-NOTE">hash</a> of the
          argument, with the result written in hexadecimal.
        </div>
        <div>
          <code class="literal">md5('abc')</code>
          → <code class="returnvalue">900150983cd24fb0&ZeroWidthSpace;d6963f7d28e17f72</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">parse_ident</code> (
          <em class="parameter"><code>qualified_identifier</code></em>
          <code class="type">text</code> [, <em class="parameter"><code>strict_mode</code></em>
          <code class="type">boolean</code> <code class="literal">DEFAULT</code>
          <code class="literal">true</code> ] ) → <code class="returnvalue">text[]</code>
        </div>
        <div>
          Splits <em class="parameter"><code>qualified_identifier</code></em> into an array of
          identifiers, removing any quoting of individual identifiers. By default, extra characters
          after the last identifier are considered an error; but if the second parameter is
          <code class="literal">false</code>, then such extra characters are ignored. (This behavior
          is useful for parsing names for objects like functions.) Note that this function does not
          truncate over-length identifiers. If you want truncation you can cast the result to
          <code class="type">name[]</code>.
        </div>
        <div>
          <code class="literal">parse_ident('"SomeSchema".someTable')</code>
          → <code class="returnvalue">\{SomeSchema,sometable}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">pg_client_encoding</code> ( ) →
          <code class="returnvalue">name</code>
        </div>
        <div>Returns current client encoding name.</div>
        <div>
          <code class="literal">pg_client_encoding()</code>
          → <code class="returnvalue">UTF8</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">quote_ident</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the given string suitably quoted to be used as an identifier in an
          <acronym class="acronym">SQL</acronym> statement string. Quotes are added only if
          necessary (i.e., if the string contains non-identifier characters or would be
          case-folded). Embedded quotes are properly doubled. See also
          <a
            class="xref"
            href="plpgsql-statements.html#PLPGSQL-QUOTE-LITERAL-EXAMPLE"
            title="Example&nbsp;43.1.&nbsp;Quoting Values in Dynamic Queries">Example&nbsp;43.1</a>.
        </div>
        <div>
          <code class="literal">quote_ident('Foo bar')</code>
          → <code class="returnvalue">"Foo bar"</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.14.1.1.1" class="indexterm"></a>
          <code class="function">quote_literal</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the given string suitably quoted to be used as a string literal in an
          <acronym class="acronym">SQL</acronym> statement string. Embedded single-quotes and
          backslashes are properly doubled. Note that
          <code class="function">quote_literal</code> returns null on null input; if the argument
          might be null, <code class="function">quote_nullable</code> is often more suitable. See
          also
          <a
            class="xref"
            href="plpgsql-statements.html#PLPGSQL-QUOTE-LITERAL-EXAMPLE"
            title="Example&nbsp;43.1.&nbsp;Quoting Values in Dynamic Queries">Example&nbsp;43.1</a>.
        </div>
        <div>
          <code class="literal">quote_literal(E'O\'Reilly')</code>
          → <code class="returnvalue">'O''Reilly'</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">quote_literal</code> ( <code class="type">anyelement</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Converts the given value to text and then quotes it as a literal. Embedded single-quotes
          and backslashes are properly doubled.
        </div>
        <div>
          <code class="literal">quote_literal(42.5)</code>
          → <code class="returnvalue">'42.5'</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.16.1.1.1" class="indexterm"></a>
          <code class="function">quote_nullable</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the given string suitably quoted to be used as a string literal in an
          <acronym class="acronym">SQL</acronym> statement string; or, if the argument is null,
          returns <code class="literal">NULL</code>. Embedded single-quotes and backslashes are
          properly doubled. See also
          <a
            class="xref"
            href="plpgsql-statements.html#PLPGSQL-QUOTE-LITERAL-EXAMPLE"
            title="Example&nbsp;43.1.&nbsp;Quoting Values in Dynamic Queries">Example&nbsp;43.1</a>.
        </div>
        <div>
          <code class="literal">quote_nullable(NULL)</code>
          → <code class="returnvalue">NULL</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">quote_nullable</code> ( <code class="type">anyelement</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Converts the given value to text and then quotes it as a literal; or, if the argument is
          null, returns <code class="literal">NULL</code>. Embedded single-quotes and backslashes
          are properly doubled.
        </div>
        <div>
          <code class="literal">quote_nullable(42.5)</code>
          → <code class="returnvalue">'42.5'</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.18.1.1.1" class="indexterm"></a>
          <code class="function">regexp_count</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>start</code></em> <code class="type">integer</code> [,
          <em class="parameter"><code>flags</code></em> <code class="type">text</code> ] ] ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns the number of times the POSIX regular expression
          <em class="parameter"><code>pattern</code></em> matches in the
          <em class="parameter"><code>string</code></em>; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">regexp_count('123456789012', '\d\d\d', 2)</code>
          → <code class="returnvalue">3</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.19.1.1.1" class="indexterm"></a>
          <code class="function">regexp_instr</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>start</code></em> <code class="type">integer</code> [,
          <em class="parameter"><code>N</code></em> <code class="type">integer</code> [,
          <em class="parameter"><code>endoption</code></em> <code class="type">integer</code> [,
          <em class="parameter"><code>flags</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>subexpr</code></em> <code class="type">integer</code> ] ] ] ]
          ] ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns the position within <em class="parameter"><code>string</code></em> where the
          <em class="parameter"><code>N</code></em>'th match of the POSIX regular expression
          <em class="parameter"><code>pattern</code></em> occurs, or zero if there is no such match;
          see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">regexp_instr('ABCDEF', 'c(.)(..)', 1, 1, 0, 'i')</code>
          → <code class="returnvalue">3</code>
        </div>
        <div>
          <code class="literal">regexp_instr('ABCDEF', 'c(.)(..)', 1, 1, 0, 'i', 2)</code>
          → <code class="returnvalue">5</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.20.1.1.1" class="indexterm"></a>
          <code class="function">regexp_like</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>flags</code></em> <code class="type">text</code> ] ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Checks whether a match of the POSIX regular expression
          <em class="parameter"><code>pattern</code></em> occurs within
          <em class="parameter"><code>string</code></em>; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">regexp_like('Hello World', 'world$', 'i')</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.21.1.1.1" class="indexterm"></a>
          <code class="function">regexp_match</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>flags</code></em> <code class="type">text</code> ] ) →
          <code class="returnvalue">text[]</code>
        </div>
        <div>
          Returns substrings within the first match of the POSIX regular expression
          <em class="parameter"><code>pattern</code></em> to the
          <em class="parameter"><code>string</code></em>; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">regexp_match('foobarbequebaz', '(bar)(beque)')</code>
          → <code class="returnvalue">\{bar,beque}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.22.1.1.1" class="indexterm"></a>
          <code class="function">regexp_matches</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>flags</code></em> <code class="type">text</code> ] ) →
          <code class="returnvalue">setof text[]</code>
        </div>
        <div>
          Returns substrings within the first match of the POSIX regular expression
          <em class="parameter"><code>pattern</code></em> to the
          <em class="parameter"><code>string</code></em>, or substrings within all such matches if the <code class="literal">g</code> flag is
          used; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">regexp_matches('foobarbequebaz', 'ba.', 'g')</code>
          → <code class="returnvalue"></code>
        </div>
        <pre class="programlisting">
 \{bar}
 \{baz}
</pre>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.23.1.1.1" class="indexterm"></a>
          <code class="function">regexp_replace</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code>,
          <em class="parameter"><code>replacement</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>start</code></em> <code class="type">integer</code> ] [,
          <em class="parameter"><code>flags</code></em> <code class="type">text</code> ] ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Replaces the substring that is the first match to the POSIX regular expression
          <em class="parameter"><code>pattern</code></em>, or all such matches if the <code class="literal">g</code> flag is used; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">regexp_replace('Thomas', '.[mN]a.', 'M')</code>
          → <code class="returnvalue">ThM</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">regexp_replace</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code>,
          <em class="parameter"><code>replacement</code></em> <code class="type">text</code>,
          <em class="parameter"><code>start</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>N</code></em> <code class="type">integer</code> [,
          <em class="parameter"><code>flags</code></em> <code class="type">text</code> ] ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Replaces the substring that is the <em class="parameter"><code>N</code></em>'th match to the POSIX regular expression <em class="parameter"><code>pattern</code></em>, or all such matches if <em class="parameter"><code>N</code></em> is zero; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">regexp_replace('Thomas', '.', 'X', 3, 2)</code>
          → <code class="returnvalue">ThoXas</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.25.1.1.1" class="indexterm"></a>
          <code class="function">regexp_split_to_array</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>flags</code></em> <code class="type">text</code> ] ) →
          <code class="returnvalue">text[]</code>
        </div>
        <div>
          Splits <em class="parameter"><code>string</code></em> using a POSIX regular expression as
          the delimiter, producing an array of results; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">regexp_split_to_array('hello world', '\s+')</code>
          → <code class="returnvalue">\{hello,world}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.26.1.1.1" class="indexterm"></a>
          <code class="function">regexp_split_to_table</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>flags</code></em> <code class="type">text</code> ] ) →
          <code class="returnvalue">setof text</code>
        </div>
        <div>
          Splits <em class="parameter"><code>string</code></em> using a POSIX regular expression as
          the delimiter, producing a set of results; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">regexp_split_to_table('hello world', '\s+')</code>
          → <code class="returnvalue"></code>
        </div>
        <pre class="programlisting">
 hello
 world
</pre>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.27.1.1.1" class="indexterm"></a>
          <code class="function">regexp_substr</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>pattern</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>start</code></em> <code class="type">integer</code> [,
          <em class="parameter"><code>N</code></em> <code class="type">integer</code> [,
          <em class="parameter"><code>flags</code></em> <code class="type">text</code> [,
          <em class="parameter"><code>subexpr</code></em> <code class="type">integer</code> ] ] ] ]
          ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the substring within <em class="parameter"><code>string</code></em> that matches
          the <em class="parameter"><code>N</code></em>'th occurrence of the POSIX regular expression
          <em class="parameter"><code>pattern</code></em>, or <code class="literal">NULL</code> if there is no such match; see
          <a
            class="xref"
            href="functions-matching.html#FUNCTIONS-POSIX-REGEXP"
            title="9.7.3.&nbsp;POSIX Regular Expressions">Section&nbsp;9.7.3</a>.
        </div>
        <div>
          <code class="literal">regexp_substr('ABCDEF', 'c(.)(..)', 1, 1, 'i')</code>
          → <code class="returnvalue">CDEF</code>
        </div>
        <div>
          <code class="literal">regexp_substr('ABCDEF', 'c(.)(..)', 1, 1, 'i', 2)</code>
          → <code class="returnvalue">EF</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.28.1.1.1" class="indexterm"></a>
          <code class="function">repeat</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>number</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Repeats <em class="parameter"><code>string</code></em> the specified
          <em class="parameter"><code>number</code></em> of times.
        </div>
        <div>
          <code class="literal">repeat('Pg', 4)</code>
          → <code class="returnvalue">PgPgPgPg</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.29.1.1.1" class="indexterm"></a>
          <code class="function">replace</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>from</code></em>
          <code class="type">text</code>, <em class="parameter"><code>to</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Replaces all occurrences in <em class="parameter"><code>string</code></em> of substring
          <em class="parameter"><code>from</code></em> with substring
          <em class="parameter"><code>to</code></em>.
        </div>
        <div>
          <code class="literal">replace('abcdefabcdef', 'cd', 'XX')</code>
          → <code class="returnvalue">abXXefabXXef</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.30.1.1.1" class="indexterm"></a>
          <code class="function">reverse</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>Reverses the order of the characters in the string.</div>
        <div>
          <code class="literal">reverse('abcde')</code>
          → <code class="returnvalue">edcba</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.31.1.1.1" class="indexterm"></a>
          <code class="function">right</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>n</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns last <em class="parameter"><code>n</code></em> characters in the string, or when
          <em class="parameter"><code>n</code></em> is negative, returns all but first |<em
            class="parameter"><code>n</code></em>| characters.
        </div>
        <div>
          <code class="literal">right('abcde', 2)</code>
          → <code class="returnvalue">de</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.32.1.1.1" class="indexterm"></a>
          <code class="function">split_part</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>delimiter</code></em>
          <code class="type">text</code>, <em class="parameter"><code>n</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Splits <em class="parameter"><code>string</code></em> at occurrences of
          <em class="parameter"><code>delimiter</code></em> and returns the
          <em class="parameter"><code>n</code></em>'th field (counting from one), or when <em class="parameter"><code>n</code></em> is
          negative, returns the |<em class="parameter"><code>n</code></em>|'th-from-last field.
        </div>
        <div>
          <code class="literal">split_part('abc~@~def~@~ghi', '~@~', 2)</code>
          → <code class="returnvalue">def</code>
        </div>
        <div>
          <code class="literal">split_part('abc,def,ghi,jkl', ',', -2)</code>
          → <code class="returnvalue">ghi</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.33.1.1.1" class="indexterm"></a>
          <code class="function">starts_with</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>prefix</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Returns true if <em class="parameter"><code>string</code></em> starts with
          <em class="parameter"><code>prefix</code></em>.
        </div>
        <div>
          <code class="literal">starts_with('alphabet', 'alph')</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="FUNCTION-STRING-TO-ARRAY" class="indexterm"></a>
          <code class="function">string_to_array</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>delimiter</code></em> <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>null_string</code></em>
            <code class="type">text</code> </span>] ) → <code class="returnvalue">text[]</code>
        </div>
        <div>
          Splits the <em class="parameter"><code>string</code></em> at occurrences of
          <em class="parameter"><code>delimiter</code></em> and forms the resulting fields into a
          <code class="type">text</code> array. If
          <em class="parameter"><code>delimiter</code></em> is <code class="literal">NULL</code>,
          each character in the <em class="parameter"><code>string</code></em> will become a
          separate element in the array. If <em class="parameter"><code>delimiter</code></em> is an
          empty string, then the <em class="parameter"><code>string</code></em> is treated as a
          single field. If <em class="parameter"><code>null_string</code></em> is supplied and is
          not <code class="literal">NULL</code>, fields matching that string are replaced by
          <code class="literal">NULL</code>. See also
          <a class="link" href="functions-array.html#FUNCTION-ARRAY-TO-STRING"><code class="function">array_to_string</code></a>.
        </div>
        <div>
          <code class="literal">string_to_array('xx~~yy~~zz', '~~', 'yy')</code>
          → <code class="returnvalue">\{xx,NULL,zz}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.35.1.1.1" class="indexterm"></a>
          <code class="function">string_to_table</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>delimiter</code></em> <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>null_string</code></em>
            <code class="type">text</code> </span>] ) → <code class="returnvalue">setof text</code>
        </div>
        <div>
          Splits the <em class="parameter"><code>string</code></em> at occurrences of
          <em class="parameter"><code>delimiter</code></em> and returns the resulting fields as a
          set of <code class="type">text</code> rows. If
          <em class="parameter"><code>delimiter</code></em> is <code class="literal">NULL</code>,
          each character in the <em class="parameter"><code>string</code></em> will become a
          separate row of the result. If <em class="parameter"><code>delimiter</code></em> is an
          empty string, then the <em class="parameter"><code>string</code></em> is treated as a
          single field. If <em class="parameter"><code>null_string</code></em> is supplied and is
          not <code class="literal">NULL</code>, fields matching that string are replaced by
          <code class="literal">NULL</code>.
        </div>
        <div>
          <code class="literal">string_to_table('xx~^~yy~^~zz', '~^~', 'yy')</code>
          → <code class="returnvalue"></code>
        </div>
        <pre class="programlisting">
 xx
 NULL
 zz
</pre>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.36.1.1.1" class="indexterm"></a>
          <code class="function">strpos</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>substring</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns first starting index of the specified
          <em class="parameter"><code>substring</code></em> within
          <em class="parameter"><code>string</code></em>, or zero if it's not present. (Same as
          <code class="literal">position(<em class="parameter"><code>substring</code></em> in
            <em class="parameter"><code>string</code></em>)</code>, but note the reversed argument order.)
        </div>
        <div>
          <code class="literal">strpos('high', 'ig')</code>
          → <code class="returnvalue">2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.37.1.1.1" class="indexterm"></a>
          <code class="function">substr</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>start</code></em>
          <code class="type">integer</code> [<span class="optional">, <em class="parameter"><code>count</code></em>
            <code class="type">integer</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Extracts the substring of <em class="parameter"><code>string</code></em> starting at the
          <em class="parameter"><code>start</code></em>'th character, and extending for <em class="parameter"><code>count</code></em> characters
          if that is specified. (Same as
          <code class="literal">substring(<em class="parameter"><code>string</code></em> from
            <em class="parameter"><code>start</code></em> for
            <em class="parameter"><code>count</code></em>)</code>.)
        </div>
        <div>
          <code class="literal">substr('alphabet', 3)</code>
          → <code class="returnvalue">phabet</code>
        </div>
        <div>
          <code class="literal">substr('alphabet', 3, 2)</code>
          → <code class="returnvalue">ph</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.38.1.1.1" class="indexterm"></a>
          <code class="function">to_ascii</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="function">to_ascii</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>encoding</code></em>
          <code class="type">name</code> ) → <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="function">to_ascii</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>encoding</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Converts <em class="parameter"><code>string</code></em> to
          <acronym class="acronym">ASCII</acronym> from another encoding, which may be identified by
          name or number. If <em class="parameter"><code>encoding</code></em> is omitted the
          database encoding is assumed (which in practice is the only useful case). The conversion
          consists primarily of dropping accents. Conversion is only supported from
          <code class="literal">LATIN1</code>, <code class="literal">LATIN2</code>,
          <code class="literal">LATIN9</code>, and <code class="literal">WIN1250</code> encodings.
          (See the
          <a
            class="xref"
            href="unaccent.html"
            title="F.47.&nbsp;unaccent — a text search dictionary which removes diacritics">unaccent</a>
          module for another, more flexible solution.)
        </div>
        <div>
          <code class="literal">to_ascii('Karél')</code>
          → <code class="returnvalue">Karel</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.39.1.1.1" class="indexterm"></a>
          <code class="function">to_bin</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="function">to_bin</code> ( <code class="type">bigint</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>Converts the number to its equivalent two's complement binary representation.</div>
        <div>
          <code class="literal">to_bin(2147483647)</code>
          → <code class="returnvalue">1111111111111111111111111111111</code>
        </div>
        <div>
          <code class="literal">to_bin(-1234)</code>
          → <code class="returnvalue">11111111111111111111101100101110</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.40.1.1.1" class="indexterm"></a>
          <code class="function">to_hex</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="function">to_hex</code> ( <code class="type">bigint</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>Converts the number to its equivalent two's complement hexadecimal representation.</div>
        <div>
          <code class="literal">to_hex(2147483647)</code>
          → <code class="returnvalue">7fffffff</code>
        </div>
        <div>
          <code class="literal">to_hex(-1234)</code>
          → <code class="returnvalue">fffffb2e</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.41.1.1.1" class="indexterm"></a>
          <code class="function">to_oct</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="function">to_oct</code> ( <code class="type">bigint</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>Converts the number to its equivalent two's complement octal representation.</div>
        <div>
          <code class="literal">to_oct(2147483647)</code>
          → <code class="returnvalue">17777777777</code>
        </div>
        <div>
          <code class="literal">to_oct(-1234)</code>
          → <code class="returnvalue">37777775456</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.42.1.1.1" class="indexterm"></a>
          <code class="function">translate</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>from</code></em>
          <code class="type">text</code>, <em class="parameter"><code>to</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Replaces each character in <em class="parameter"><code>string</code></em> that matches a
          character in the <em class="parameter"><code>from</code></em> set with the corresponding
          character in the <em class="parameter"><code>to</code></em> set. If
          <em class="parameter"><code>from</code></em> is longer than
          <em class="parameter"><code>to</code></em>, occurrences of the extra characters in <em class="parameter"><code>from</code></em> are
          deleted.
        </div>
        <div>
          <code class="literal">translate('12345', '143', 'ax')</code>
          → <code class="returnvalue">a2x5</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.10.7.2.2.43.1.1.1" class="indexterm"></a>
          <code class="function">unistr</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Evaluate escaped Unicode characters in the argument. Unicode characters can be specified as
          <code class="literal"><em class="replaceable"><code>\XXXX</code></em></code>(4 hexadecimal digits),
          <code class="literal"><em class="replaceable"><code>\+XXXXXX</code></em></code>(6 hexadecimal digits),
          <code class="literal"><em class="replaceable"><code>\uXXXX</code></em></code>(4 hexadecimal digits), or
          <code class="literal"><em class="replaceable"><code>\UXXXXXXXX</code></em></code>(8 hexadecimal digits). To specify a backslash, write two backslashes. All othercharacters are taken literally.
        </div>
        <div>
          If the server encoding is not UTF-8, the Unicode code point identified by one of these
          escape sequences is converted to the actual server encoding; an error is reported if
          that's not possible.
        </div>
        <div>
          This function provides a (non-standard) alternative to string constants with Unicode
          escapes (see
          <a
            class="xref"
            href="sql-syntax-lexical.html#SQL-SYNTAX-STRINGS-UESCAPE"
            title="4.1.2.3.&nbsp;String Constants with Unicode Escapes">Section&nbsp;4.1.2.3</a>).
        </div>
        <div>
          <code class="literal">unistr('d\0061t\+000061')</code>
          → <code class="returnvalue">data</code>
        </div>
        <div>
          <code class="literal">unistr('d\u0061t\U00000061')</code>
          → <code class="returnvalue">data</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

The `concat`, `concat_ws` and `format` functions are variadic, so it is possible to pass the values to be concatenated or formatted as an array marked with the `VARIADIC` keyword (see [Section 38.5.6](xfunc-sql#XFUNC-SQL-VARIADIC-FUNCTIONS)). The array's elements are treated as if they were separate ordinary arguments to the function. If the variadic array argument is NULL, `concat` and `concat_ws` return NULL, but `format` treats a NULL as a zero-element array.

See also the aggregate function `string_agg` in [Section 9.21](functions-aggregate), and the functions for converting between strings and the `bytea` type in [Table 9.13](functions-binarystring#FUNCTIONS-BINARYSTRING-CONVERSIONS).

[#id](#FUNCTIONS-STRING-FORMAT)

### 9.4.1. `format` [#](#FUNCTIONS-STRING-FORMAT)

The function `format` produces output formatted according to a format string, in a style similar to the C function `sprintf`.

```

format(formatstr text [, formatarg "any" [, ...] ])

```

_`formatstr`_ is a format string that specifies how the result should be formatted. Text in the format string is copied directly to the result, except where _format specifiers_ are used. Format specifiers act as placeholders in the string, defining how subsequent function arguments should be formatted and inserted into the result. Each _`formatarg`_ argument is converted to text according to the usual output rules for its data type, and then formatted and inserted into the result string according to the format specifier(s).

Format specifiers are introduced by a `%` character and have the form

```

%[position][flags][width]type

```

where the component fields are:

- _`position`_ (optional)

  A string of the form `n$` where _`n`_ is the index of the argument to print. Index 1 means the first argument after _`formatstr`_. If the _`position`_ is omitted, the default is to use the next argument in sequence.

- _`flags`_ (optional)

  Additional options controlling how the format specifier's output is formatted. Currently the only supported flag is a minus sign (`-`) which will cause the format specifier's output to be left-justified. This has no effect unless the _`width`_ field is also specified.

- _`width`_ (optional)

  Specifies the _minimum_ number of characters to use to display the format specifier's output. The output is padded on the left or right (depending on the `-` flag) with spaces as needed to fill the width. A too-small width does not cause truncation of the output, but is simply ignored. The width may be specified using any of the following: a positive integer; an asterisk (`*`) to use the next function argument as the width; or a string of the form `*n$` to use the *`n`*th function argument as the width.

  If the width comes from a function argument, that argument is consumed before the argument that is used for the format specifier's value. If the width argument is negative, the result is left aligned (as if the `-` flag had been specified) within a field of length `abs`(_`width`_).

- _`type`_ (required)

  The type of format conversion to use to produce the format specifier's output. The following types are supported:

  - `s` formats the argument value as a simple string. A null value is treated as an empty string.

  - `I` treats the argument value as an SQL identifier, double-quoting it if necessary. It is an error for the value to be null (equivalent to `quote_ident`).

  - `L` quotes the argument value as an SQL literal. A null value is displayed as the string `NULL`, without quotes (equivalent to `quote_nullable`).

In addition to the format specifiers described above, the special sequence `%%` may be used to output a literal `%` character.

Here are some examples of the basic format conversions:

```

SELECT format('Hello %s', 'World');
Result: Hello World

SELECT format('Testing %s, %s, %s, %%', 'one', 'two', 'three');
Result: Testing one, two, three, %

SELECT format('INSERT INTO %I VALUES(%L)', 'Foo bar', E'O\'Reilly');
Result: INSERT INTO "Foo bar" VALUES('O''Reilly')

SELECT format('INSERT INTO %I VALUES(%L)', 'locations', 'C:\Program Files');
Result: INSERT INTO locations VALUES('C:\Program Files')

```

Here are examples using _`width`_ fields and the `-` flag:

```

SELECT format('|%10s|', 'foo');
Result: |       foo|

SELECT format('|%-10s|', 'foo');
Result: |foo       |

SELECT format('|%*s|', 10, 'foo');
Result: |       foo|

SELECT format('|%*s|', -10, 'foo');
Result: |foo       |

SELECT format('|%-*s|', 10, 'foo');
Result: |foo       |

SELECT format('|%-*s|', -10, 'foo');
Result: |foo       |

```

These examples show use of _`position`_ fields:

```

SELECT format('Testing %3$s, %2$s, %1$s', 'one', 'two', 'three');
Result: Testing three, two, one

SELECT format('|%*2$s|', 'foo', 10, 'bar');
Result: |       bar|

SELECT format('|%1$*2$s|', 'foo', 10, 'bar');
Result: |       foo|

```

Unlike the standard C function `sprintf`, PostgreSQL's `format` function allows format specifiers with and without _`position`_ fields to be mixed in the same format string. A format specifier without a _`position`_ field always uses the next argument after the last argument consumed. In addition, the `format` function does not require all function arguments to be used in the format string. For example:

```

SELECT format('Testing %3$s, %2$s, %s', 'one', 'two', 'three');
Result: Testing three, two, three

```

The `%I` and `%L` format specifiers are particularly useful for safely constructing dynamic SQL statements. See [Example 43.1](plpgsql-statements#PLPGSQL-QUOTE-LITERAL-EXAMPLE).

[#id](#FUNCTIONS-BINARYSTRING)

## 9.5. Binary String Functions and Operators [#](#FUNCTIONS-BINARYSTRING)

This section describes functions and operators for examining and manipulating binary strings, that is values of type `bytea`. Many of these are equivalent, in purpose and syntax, to the text-string functions described in the previous section.

SQL defines some string functions that use key words, rather than commas, to separate arguments. Details are in [Table 9.11](functions-binarystring#FUNCTIONS-BINARYSTRING-SQL). PostgreSQL also provides versions of these functions that use the regular function invocation syntax (see [Table 9.12](functions-binarystring#FUNCTIONS-BINARYSTRING-OTHER)).

[#id](#FUNCTIONS-BINARYSTRING-SQL)

**Table 9.11. SQL Binary String Functions and Operators**

<figure class="table-wrapper">
<table class="table" summary="SQL Binary String Functions and Operators" border="1">
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
          <a id="id-1.5.8.11.5.2.2.1.1.1.1" class="indexterm"></a>
          <code class="type">bytea</code> <code class="literal">||</code>
          <code class="type">bytea</code> → <code class="returnvalue">bytea</code>
        </div>
        <div>Concatenates the two binary strings.</div>
        <div>
          <code class="literal">'\x123456'::bytea || '\x789a00bcde'::bytea</code>
          → <code class="returnvalue">\x123456789a00bcde</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.5.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">bit_length</code> ( <code class="type">bytea</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns number of bits in the binary string (8 times the
          <code class="function">octet_length</code>).
        </div>
        <div>
          <code class="literal">bit_length('\x123456'::bytea)</code>
          → <code class="returnvalue">24</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.5.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">btrim</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>bytesremoved</code></em>
          <code class="type">bytea</code> ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Removes the longest string containing only bytes appearing in
          <em class="parameter"><code>bytesremoved</code></em> from the start and end of
          <em class="parameter"><code>bytes</code></em>.
        </div>
        <div>
          <code class="literal">btrim('\x1234567890'::bytea, '\x9012'::bytea)</code>
          → <code class="returnvalue">\x345678</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.5.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">ltrim</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>bytesremoved</code></em>
          <code class="type">bytea</code> ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Removes the longest string containing only bytes appearing in
          <em class="parameter"><code>bytesremoved</code></em> from the start of
          <em class="parameter"><code>bytes</code></em>.
        </div>
        <div>
          <code class="literal">ltrim('\x1234567890'::bytea, '\x9012'::bytea)</code>
          → <code class="returnvalue">\x34567890</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.5.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">octet_length</code> ( <code class="type">bytea</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns number of bytes in the binary string.</div>
        <div>
          <code class="literal">octet_length('\x123456'::bytea)</code>
          → <code class="returnvalue">3</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.5.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">overlay</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code> <code class="literal">PLACING</code>
          <em class="parameter"><code>newsubstring</code></em> <code class="type">bytea</code>
          <code class="literal">FROM</code> <em class="parameter"><code>start</code></em>
          <code class="type">integer</code> [<span class="optional">
            <code class="literal">FOR</code> <em class="parameter"><code>count</code></em>
            <code class="type">integer</code> </span>] ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Replaces the substring of <em class="parameter"><code>bytes</code></em> that starts at the
          <em class="parameter"><code>start</code></em>'th byte and extends for <em class="parameter"><code>count</code></em> bytes with
          <em class="parameter"><code>newsubstring</code></em>. If <em class="parameter"><code>count</code></em> is omitted, it defaults to the length
          of <em class="parameter"><code>newsubstring</code></em>.
        </div>
        <div>
          <code class="literal">overlay('\x1234567890'::bytea placing '\002\003'::bytea from 2 for 3)</code>
          → <code class="returnvalue">\x12020390</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.5.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">position</code> (
          <em class="parameter"><code>substring</code></em> <code class="type">bytea</code>
          <code class="literal">IN</code> <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns first starting index of the specified
          <em class="parameter"><code>substring</code></em> within
          <em class="parameter"><code>bytes</code></em>, or zero if it's not present.
        </div>
        <div>
          <code class="literal">position('\x5678'::bytea in '\x1234567890'::bytea)</code>
          → <code class="returnvalue">3</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.5.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">rtrim</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>bytesremoved</code></em>
          <code class="type">bytea</code> ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Removes the longest string containing only bytes appearing in
          <em class="parameter"><code>bytesremoved</code></em> from the end of
          <em class="parameter"><code>bytes</code></em>.
        </div>
        <div>
          <code class="literal">rtrim('\x1234567890'::bytea, '\x9012'::bytea)</code>
          → <code class="returnvalue">\x12345678</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.5.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">substring</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code> [<span class="optional">
            <code class="literal">FROM</code> <em class="parameter"><code>start</code></em>
            <code class="type">integer</code> </span>] [<span class="optional">
            <code class="literal">FOR</code> <em class="parameter"><code>count</code></em>
            <code class="type">integer</code> </span>] ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Extracts the substring of <em class="parameter"><code>bytes</code></em> starting at the
          <em class="parameter"><code>start</code></em>'th byte if that is specified, and stopping after
          <em class="parameter"><code>count</code></em> bytes if that is specified. Provide at least
          one of <em class="parameter"><code>start</code></em> and
          <em class="parameter"><code>count</code></em>.
        </div>
        <div>
          <code class="literal">substring('\x1234567890'::bytea from 3 for 2)</code>
          → <code class="returnvalue">\x5678</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.5.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">trim</code> ( [<span class="optional">
            <code class="literal">LEADING</code> | <code class="literal">TRAILING</code> |
            <code class="literal">BOTH</code> </span>] <em class="parameter"><code>bytesremoved</code></em> <code class="type">bytea</code>
          <code class="literal">FROM</code> <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code> ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Removes the longest string containing only bytes appearing in
          <em class="parameter"><code>bytesremoved</code></em> from the start, end, or both ends
          (<code class="literal">BOTH</code> is the default) of
          <em class="parameter"><code>bytes</code></em>.
        </div>
        <div>
          <code class="literal">trim('\x9012'::bytea from '\x1234567890'::bytea)</code>
          → <code class="returnvalue">\x345678</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">trim</code> ( [<span class="optional">
            <code class="literal">LEADING</code> | <code class="literal">TRAILING</code> |
            <code class="literal">BOTH</code> </span>] [<span class="optional"> <code class="literal">FROM</code> </span>]
          <em class="parameter"><code>bytes</code></em> <code class="type">bytea</code>,
          <em class="parameter"><code>bytesremoved</code></em> <code class="type">bytea</code> ) →
          <code class="returnvalue">bytea</code>
        </div>
        <div>This is a non-standard syntax for <code class="function">trim()</code>.</div>
        <div>
          <code class="literal">trim(both from '\x1234567890'::bytea, '\x9012'::bytea)</code>
          → <code class="returnvalue">\x345678</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

Additional binary string manipulation functions are available and are listed in [Table 9.12](functions-binarystring#FUNCTIONS-BINARYSTRING-OTHER). Some of them are used internally to implement the SQL-standard string functions listed in [Table 9.11](functions-binarystring#FUNCTIONS-BINARYSTRING-SQL).

[#id](#FUNCTIONS-BINARYSTRING-OTHER)

**Table 9.12. Other Binary String Functions**

<figure class="table-wrapper">
<table class="table" summary="Other Binary String Functions" border="1">
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
          <a id="id-1.5.8.11.7.2.2.1.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.11.7.2.2.1.1.1.2" class="indexterm"></a>
          <code class="function">bit_count</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code> ) → <code class="returnvalue">bigint</code>
        </div>
        <div>
          Returns the number of bits set in the binary string (also known as
          <span class="quote">“<span class="quote">popcount</span>”</span>).
        </div>
        <div>
          <code class="literal">bit_count('\x1234567890'::bytea)</code>
          → <code class="returnvalue">15</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">get_bit</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>n</code></em>
          <code class="type">bigint</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Extracts
          <a class="link" href="functions-binarystring.html#FUNCTIONS-ZEROBASED-NOTE">n'th</a> bit
          from binary string.
        </div>
        <div>
          <code class="literal">get_bit('\x1234567890'::bytea, 30)</code>
          → <code class="returnvalue">1</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">get_byte</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>n</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Extracts
          <a class="link" href="functions-binarystring.html#FUNCTIONS-ZEROBASED-NOTE">n'th</a> byte
          from binary string.
        </div>
        <div>
          <code class="literal">get_byte('\x1234567890'::bytea, 4)</code>
          → <code class="returnvalue">144</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.4.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.11.7.2.2.4.1.1.2" class="indexterm"></a>
          <a id="id-1.5.8.11.7.2.2.4.1.1.3" class="indexterm"></a>
          <code class="function">length</code> ( <code class="type">bytea</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns the number of bytes in the binary string.</div>
        <div>
          <code class="literal">length('\x1234567890'::bytea)</code>
          → <code class="returnvalue">5</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">length</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>encoding</code></em>
          <code class="type">name</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns the number of characters in the binary string, assuming that it is text in the
          given <em class="parameter"><code>encoding</code></em>.
        </div>
        <div>
          <code class="literal">length('jose'::bytea, 'UTF8')</code>
          → <code class="returnvalue">4</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">md5</code> ( <code class="type">bytea</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Computes the MD5
          <a class="link" href="functions-binarystring.html#FUNCTIONS-HASH-NOTE">hash</a> of the
          binary string, with the result written in hexadecimal.
        </div>
        <div>
          <code class="literal">md5('Th\000omas'::bytea)</code>
          → <code class="returnvalue">8ab2d3c9689aaf18​b4958c334c82d8b1</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">set_bit</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>n</code></em>
          <code class="type">bigint</code>, <em class="parameter"><code>newvalue</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Sets
          <a class="link" href="functions-binarystring.html#FUNCTIONS-ZEROBASED-NOTE">n'th</a> bit
          in binary string to <em class="parameter"><code>newvalue</code></em>.
        </div>
        <div>
          <code class="literal">set_bit('\x1234567890'::bytea, 30, 0)</code>
          → <code class="returnvalue">\x1234563890</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">set_byte</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>n</code></em>
          <code class="type">integer</code>, <em class="parameter"><code>newvalue</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Sets
          <a class="link" href="functions-binarystring.html#FUNCTIONS-ZEROBASED-NOTE">n'th</a> byte
          in binary string to <em class="parameter"><code>newvalue</code></em>.
        </div>
        <div>
          <code class="literal">set_byte('\x1234567890'::bytea, 4, 64)</code>
          → <code class="returnvalue">\x1234567840</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">sha224</code> ( <code class="type">bytea</code> ) →
          <code class="returnvalue">bytea</code>
        </div>
        <div>
          Computes the SHA-224
          <a class="link" href="functions-binarystring.html#FUNCTIONS-HASH-NOTE">hash</a>
          of the binary string.
        </div>
        <div>
          <code class="literal">sha224('abc'::bytea)</code>
          →
          <code class="returnvalue">\x23097d223405d8228642a477bda2​55b32aadbce4bda0b3f7e36c9da7</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">sha256</code> ( <code class="type">bytea</code> ) →
          <code class="returnvalue">bytea</code>
        </div>
        <div>
          Computes the SHA-256
          <a class="link" href="functions-binarystring.html#FUNCTIONS-HASH-NOTE">hash</a>
          of the binary string.
        </div>
        <div>
          <code class="literal">sha256('abc'::bytea)</code>
          →
          <code class="returnvalue">\xba7816bf8f01cfea414140de5dae2223​b00361a396177a9cb410ff61f20015ad</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">sha384</code> ( <code class="type">bytea</code> ) →
          <code class="returnvalue">bytea</code>
        </div>
        <div>
          Computes the SHA-384
          <a class="link" href="functions-binarystring.html#FUNCTIONS-HASH-NOTE">hash</a>
          of the binary string.
        </div>
        <div>
          <code class="literal">sha384('abc'::bytea)</code>
          →
          <code class="returnvalue">\xcb00753f45a35e8bb5a03d699ac65007​272c32ab0eded1631a8b605a43ff5bed​8086072ba1e7cc2358baeca134c825a7</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">sha512</code> ( <code class="type">bytea</code> ) →
          <code class="returnvalue">bytea</code>
        </div>
        <div>
          Computes the SHA-512
          <a class="link" href="functions-binarystring.html#FUNCTIONS-HASH-NOTE">hash</a>
          of the binary string.
        </div>
        <div>
          <code class="literal">sha512('abc'::bytea)</code>
          →
          <code class="returnvalue">\xddaf35a193617abacc417349ae204131​12e6fa4e89a97ea20a9eeee64b55d39a​2192992a274fc1a836ba3c23a3feebbd​454d4423643ce80e2a9ac94fa54ca49f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.7.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">substr</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>start</code></em>
          <code class="type">integer</code> [<span class="optional">, <em class="parameter"><code>count</code></em>
            <code class="type">integer</code> </span>] ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Extracts the substring of <em class="parameter"><code>bytes</code></em> starting at the
          <em class="parameter"><code>start</code></em>'th byte, and extending for <em class="parameter"><code>count</code></em> bytes if that
          is specified. (Same as
          <code class="literal">substring(<em class="parameter"><code>bytes</code></em> from
            <em class="parameter"><code>start</code></em> for
            <em class="parameter"><code>count</code></em>)</code>.)
        </div>
        <div>
          <code class="literal">substr('\x1234567890'::bytea, 3, 2)</code>
          → <code class="returnvalue">\x5678</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

Functions `get_byte` and `set_byte` number the first byte of a binary string as byte 0. Functions `get_bit` and `set_bit` number bits from the right within each byte; for example bit 0 is the least significant bit of the first byte, and bit 15 is the most significant bit of the second byte.

For historical reasons, the function `md5` returns a hex-encoded value of type `text` whereas the SHA-2 functions return type `bytea`. Use the functions [`encode`](functions-binarystring#FUNCTION-ENCODE) and [`decode`](functions-binarystring#FUNCTION-DECODE) to convert between the two. For example write `encode(sha256('abc'), 'hex')` to get a hex-encoded text representation, or `decode(md5('abc'), 'hex')` to get a `bytea` value.

Functions for converting strings between different character sets (encodings), and for representing arbitrary binary data in textual form, are shown in [Table 9.13](functions-binarystring#FUNCTIONS-BINARYSTRING-CONVERSIONS). For these functions, an argument or result of type `text` is expressed in the database's default encoding, while arguments or results of type `bytea` are in an encoding named by another argument.

[#id](#FUNCTIONS-BINARYSTRING-CONVERSIONS)

**Table 9.13. Text/Binary String Conversion Functions**

<figure class="table-wrapper">
<table class="table" summary="Text/Binary String Conversion Functions" border="1">
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
          <a id="id-1.5.8.11.11.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">convert</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>src_encoding</code></em>
          <code class="type">name</code>, <em class="parameter"><code>dest_encoding</code></em>
          <code class="type">name</code> ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Converts a binary string representing text in encoding
          <em class="parameter"><code>src_encoding</code></em> to a binary string in encoding
          <em class="parameter"><code>dest_encoding</code></em> (see
          <a
            class="xref"
            href="multibyte.html#MULTIBYTE-CONVERSIONS-SUPPORTED"
            title="24.3.4. Available Character Set Conversions">Section 24.3.4</a>
          for available conversions).
        </div>
        <div>
          <code class="literal">convert('text_in_utf8', 'UTF8', 'LATIN1')</code>
          → <code class="returnvalue">\x746578745f696e5f75746638</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.11.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">convert_from</code> (
          <em class="parameter"><code>bytes</code></em> <code class="type">bytea</code>,
          <em class="parameter"><code>src_encoding</code></em> <code class="type">name</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Converts a binary string representing text in encoding
          <em class="parameter"><code>src_encoding</code></em> to <code class="type">text</code> in
          the database encoding (see
          <a
            class="xref"
            href="multibyte.html#MULTIBYTE-CONVERSIONS-SUPPORTED"
            title="24.3.4. Available Character Set Conversions">Section 24.3.4</a>
          for available conversions).
        </div>
        <div>
          <code class="literal">convert_from('text_in_utf8', 'UTF8')</code>
          → <code class="returnvalue">text_in_utf8</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.11.11.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">convert_to</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>dest_encoding</code></em>
          <code class="type">name</code> ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Converts a <code class="type">text</code> string (in the database encoding) to a binary
          string encoded in encoding <em class="parameter"><code>dest_encoding</code></em> (see
          <a
            class="xref"
            href="multibyte.html#MULTIBYTE-CONVERSIONS-SUPPORTED"
            title="24.3.4. Available Character Set Conversions">Section 24.3.4</a>
          for available conversions).
        </div>
        <div>
          <code class="literal">convert_to('some_text', 'UTF8')</code>
          → <code class="returnvalue">\x736f6d655f74657874</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="FUNCTION-ENCODE" class="indexterm"></a>
          <code class="function">encode</code> ( <em class="parameter"><code>bytes</code></em>
          <code class="type">bytea</code>, <em class="parameter"><code>format</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Encodes binary data into a textual representation; supported
          <em class="parameter"><code>format</code></em> values are:
          <a class="link" href="functions-binarystring.html#ENCODE-FORMAT-BASE64"><code class="literal">base64</code></a>,
          <a class="link" href="functions-binarystring.html#ENCODE-FORMAT-ESCAPE"><code class="literal">escape</code></a>,
          <a class="link" href="functions-binarystring.html#ENCODE-FORMAT-HEX"><code class="literal">hex</code></a>.
        </div>
        <div>
          <code class="literal">encode('123\000\001', 'base64')</code>
          → <code class="returnvalue">MTIzAAE=</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="FUNCTION-DECODE" class="indexterm"></a>
          <code class="function">decode</code> ( <em class="parameter"><code>string</code></em>
          <code class="type">text</code>, <em class="parameter"><code>format</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Decodes binary data from a textual representation; supported
          <em class="parameter"><code>format</code></em> values are the same as for
          <code class="function">encode</code>.
        </div>
        <div>
          <code class="literal">decode('MTIzAAE=', 'base64')</code>
          → <code class="returnvalue">\x3132330001</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

The `encode` and `decode` functions support the following textual formats:

- base64 [#](#ENCODE-FORMAT-BASE64)

  The `base64` format is that of [RFC 2045 Section 6.8](https://tools.ietf.org/html/rfc2045#section-6.8). As per the RFC, encoded lines are broken at 76 characters. However instead of the MIME CRLF end-of-line marker, only a newline is used for end-of-line. The `decode` function ignores carriage-return, newline, space, and tab characters. Otherwise, an error is raised when `decode` is supplied invalid base64 data — including when trailing padding is incorrect.

- escape [#](#ENCODE-FORMAT-ESCAPE)

  The `escape` format converts zero bytes and bytes with the high bit set into octal escape sequences (`\`_`nnn`_), and it doubles backslashes. Other byte values are represented literally. The `decode` function will raise an error if a backslash is not followed by either a second backslash or three octal digits; it accepts other byte values unchanged.

- hex [#](#ENCODE-FORMAT-HEX)

  The `hex` format represents each 4 bits of data as one hexadecimal digit, `0` through `f`, writing the higher-order digit of each byte first. The `encode` function outputs the `a`-`f` hex digits in lower case. Because the smallest unit of data is 8 bits, there are always an even number of characters returned by `encode`. The `decode` function accepts the `a`-`f` characters in either upper or lower case. An error is raised when `decode` is given invalid hex data — including when given an odd number of characters.

See also the aggregate function `string_agg` in [Section 9.21](functions-aggregate) and the large object functions in [Section 35.4](lo-funcs).

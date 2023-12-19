[#id](#FUNCTIONS-BITSTRING)

## 9.6. Bit String Functions and Operators [#](#FUNCTIONS-BITSTRING)

This section describes functions and operators for examining and manipulating bit strings, that is values of the types `bit` and `bit varying`. (While only type `bit` is mentioned in these tables, values of type `bit varying` can be used interchangeably.) Bit strings support the usual comparison operators shown in [Table 9.1](functions-comparison#FUNCTIONS-COMPARISON-OP-TABLE), as well as the operators shown in [Table 9.14](functions-bitstring#FUNCTIONS-BIT-STRING-OP-TABLE).

[#id](#FUNCTIONS-BIT-STRING-OP-TABLE)

**Table 9.14. Bit String Operators**

<figure class="table-wrapper">
<table class="table" summary="Bit String Operators" border="1">
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
          <code class="type">bit</code> <code class="literal">||</code>
          <code class="type">bit</code> → <code class="returnvalue">bit</code>
        </div>
        <div>Concatenation</div>
        <div>
          <code class="literal">B'10001' || B'011'</code>
          → <code class="returnvalue">10001011</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">bit</code> <code class="literal">&amp;</code>
          <code class="type">bit</code> → <code class="returnvalue">bit</code>
        </div>
        <div>Bitwise AND (inputs must be of equal length)</div>
        <div>
          <code class="literal">B'10001' &amp; B'01101'</code>
          → <code class="returnvalue">00001</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">bit</code> <code class="literal">|</code>
          <code class="type">bit</code> → <code class="returnvalue">bit</code>
        </div>
        <div>Bitwise OR (inputs must be of equal length)</div>
        <div>
          <code class="literal">B'10001' | B'01101'</code>
          → <code class="returnvalue">11101</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">bit</code> <code class="literal">#</code>
          <code class="type">bit</code> → <code class="returnvalue">bit</code>
        </div>
        <div>Bitwise exclusive OR (inputs must be of equal length)</div>
        <div>
          <code class="literal">B'10001' # B'01101'</code>
          → <code class="returnvalue">11100</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">~</code> <code class="type">bit</code> →
          <code class="returnvalue">bit</code>
        </div>
        <div>Bitwise NOT</div>
        <div>
          <code class="literal">~ B'10001'</code>
          → <code class="returnvalue">01110</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">bit</code> <code class="literal">&lt;&lt;</code>
          <code class="type">integer</code> → <code class="returnvalue">bit</code>
        </div>
        <div>Bitwise shift left (string length is preserved)</div>
        <div>
          <code class="literal">B'10001' &lt;&lt; 3</code>
          → <code class="returnvalue">01000</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">bit</code> <code class="literal">&gt;&gt;</code>
          <code class="type">integer</code> → <code class="returnvalue">bit</code>
        </div>
        <div>Bitwise shift right (string length is preserved)</div>
        <div>
          <code class="literal">B'10001' &gt;&gt; 2</code>
          → <code class="returnvalue">00100</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

Some of the functions available for binary strings are also available for bit strings, as shown in [Table 9.15](functions-bitstring#FUNCTIONS-BIT-STRING-TABLE).

[#id](#FUNCTIONS-BIT-STRING-TABLE)

**Table 9.15. Bit String Functions**

<figure class="table-wrapper">
<table class="table" summary="Bit String Functions" border="1">
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
          <a id="id-1.5.8.12.6.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">bit_count</code> ( <code class="type">bit</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>
          Returns the number of bits set in the bit string (also known as
          <span class="quote">“<span class="quote">popcount</span>”</span>).
        </div>
        <div>
          <code class="literal">bit_count(B'10111')</code>
          → <code class="returnvalue">4</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.12.6.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">bit_length</code> ( <code class="type">bit</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns number of bits in the bit string.</div>
        <div>
          <code class="literal">bit_length(B'10111')</code>
          → <code class="returnvalue">5</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.12.6.2.2.3.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.12.6.2.2.3.1.1.2" class="indexterm"></a>
          <code class="function">length</code> ( <code class="type">bit</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns number of bits in the bit string.</div>
        <div>
          <code class="literal">length(B'10111')</code>
          → <code class="returnvalue">5</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.12.6.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">octet_length</code> ( <code class="type">bit</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns number of bytes in the bit string.</div>
        <div>
          <code class="literal">octet_length(B'1011111011')</code>
          → <code class="returnvalue">2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.12.6.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">overlay</code> ( <em class="parameter"><code>bits</code></em>
          <code class="type">bit</code> <code class="literal">PLACING</code>
          <em class="parameter"><code>newsubstring</code></em> <code class="type">bit</code>
          <code class="literal">FROM</code> <em class="parameter"><code>start</code></em>
          <code class="type">integer</code> [<span class="optional">
            <code class="literal">FOR</code> <em class="parameter"><code>count</code></em>
            <code class="type">integer</code> </span>] ) → <code class="returnvalue">bit</code>
        </div>
        <div>
          Replaces the substring of <em class="parameter"><code>bits</code></em> that starts at the
          <em class="parameter"><code>start</code></em>'th bit and extends for <em class="parameter"><code>count</code></em> bits with
          <em class="parameter"><code>newsubstring</code></em>. If <em class="parameter"><code>count</code></em> is omitted, it defaults to the length
          of <em class="parameter"><code>newsubstring</code></em>.
        </div>
        <div>
          <code class="literal">overlay(B'01010101010101010' placing B'11111' from 2 for 3)</code>
          → <code class="returnvalue">0111110101010101010</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.12.6.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">position</code> (
          <em class="parameter"><code>substring</code></em> <code class="type">bit</code>
          <code class="literal">IN</code> <em class="parameter"><code>bits</code></em>
          <code class="type">bit</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns first starting index of the specified
          <em class="parameter"><code>substring</code></em> within
          <em class="parameter"><code>bits</code></em>, or zero if it's not present.
        </div>
        <div>
          <code class="literal">position(B'010' in B'000001101011')</code>
          → <code class="returnvalue">8</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.12.6.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">substring</code> ( <em class="parameter"><code>bits</code></em>
          <code class="type">bit</code> [<span class="optional">
            <code class="literal">FROM</code> <em class="parameter"><code>start</code></em>
            <code class="type">integer</code> </span>] [<span class="optional">
            <code class="literal">FOR</code> <em class="parameter"><code>count</code></em>
            <code class="type">integer</code> </span>] ) → <code class="returnvalue">bit</code>
        </div>
        <div>
          Extracts the substring of <em class="parameter"><code>bits</code></em> starting at the
          <em class="parameter"><code>start</code></em>'th bit if that is specified, and stopping after
          <em class="parameter"><code>count</code></em> bits if that is specified. Provide at least
          one of <em class="parameter"><code>start</code></em> and
          <em class="parameter"><code>count</code></em>.
        </div>
        <div>
          <code class="literal">substring(B'110010111111' from 3 for 2)</code>
          → <code class="returnvalue">00</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.12.6.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">get_bit</code> ( <em class="parameter"><code>bits</code></em>
          <code class="type">bit</code>, <em class="parameter"><code>n</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>
          Extracts <em class="parameter"><code>n</code></em>'th bit from bit string; the first (leftmost) bit is bit 0.
        </div>
        <div>
          <code class="literal">get_bit(B'101010101010101010', 6)</code>
          → <code class="returnvalue">1</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.12.6.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">set_bit</code> ( <em class="parameter"><code>bits</code></em>
          <code class="type">bit</code>, <em class="parameter"><code>n</code></em>
          <code class="type">integer</code>, <em class="parameter"><code>newvalue</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">bit</code>
        </div>
        <div>
          Sets <em class="parameter"><code>n</code></em>'th bit in bit string to <em class="parameter"><code>newvalue</code></em>; the first (leftmost) bit is bit 0.
        </div>
        <div>
          <code class="literal">set_bit(B'101010101010101010', 6, 0)</code>
          → <code class="returnvalue">101010001010101010</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

In addition, it is possible to cast integral values to and from type `bit`. Casting an integer to `bit(n)` copies the rightmost `n` bits. Casting an integer to a bit string width wider than the integer itself will sign-extend on the left. Some examples:

```

44::bit(10)                    0000101100
44::bit(3)                     100
cast(-44 as bit(12))           111111010100
'1110'::bit(4)::integer        14
```

Note that casting to just “bit” means casting to `bit(1)`, and so will deliver only the least significant bit of the integer.

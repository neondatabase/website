[#id](#FUNCTIONS-RANGE)

## 9.20. Range/Multirange Functions and Operators [#](#FUNCTIONS-RANGE)

See [Section 8.17](rangetypes) for an overview of range types.

[Table 9.55](functions-range#RANGE-OPERATORS-TABLE) shows the specialized operators available for range types. [Table 9.56](functions-range#MULTIRANGE-OPERATORS-TABLE) shows the specialized operators available for multirange types. In addition to those, the usual comparison operators shown in [Table 9.1](functions-comparison#FUNCTIONS-COMPARISON-OP-TABLE) are available for range and multirange types. The comparison operators order first by the range lower bounds, and only if those are equal do they compare the upper bounds. The multirange operators compare each range until one is unequal. This does not usually result in a useful overall ordering, but the operators are provided to allow unique indexes to be constructed on ranges.

[#id](#RANGE-OPERATORS-TABLE)

**Table 9.55. Range Operators**

<figure class="table-wrapper">
<table class="table" summary="Range Operators" border="1">
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
          <code class="type">anyrange</code> <code class="literal">@&gt;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the first range contain the second?</div>
        <div>
          <code class="literal">int4range(2,4) @&gt; int4range(2,3)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">@&gt;</code>
          <code class="type">anyelement</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the range contain the element?</div>
        <div>
          <code class="literal">'[2011-01-01,2011-03-01)'::tsrange @&gt; '2011-01-10'::timestamp</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&lt;@</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the first range contained by the second?</div>
        <div>
          <code class="literal">int4range(2,4) &lt;@ int4range(1,7)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyelement</code> <code class="literal">&lt;@</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the element contained in the range?</div>
        <div>
          <code class="literal">42 &lt;@ int4range(1,7)</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&amp;&amp;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Do the ranges overlap, that is, have any elements in common?</div>
        <div>
          <code class="literal">int8range(3,7) &amp;&amp; int8range(4,12)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&lt;&lt;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the first range strictly left of the second?</div>
        <div>
          <code class="literal">int8range(1,10) &lt;&lt; int8range(100,110)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&gt;&gt;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the first range strictly right of the second?</div>
        <div>
          <code class="literal">int8range(50,60) &gt;&gt; int8range(20,30)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&amp;&lt;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the first range not extend to the right of the second?</div>
        <div>
          <code class="literal">int8range(1,20) &amp;&lt; int8range(18,20)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&amp;&gt;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the first range not extend to the left of the second?</div>
        <div>
          <code class="literal">int8range(7,20) &amp;&gt; int8range(5,10)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">-|-</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Are the ranges adjacent?</div>
        <div>
          <code class="literal">numrange(1.1,2.2) -|- numrange(2.2,3.3)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">+</code>
          <code class="type">anyrange</code> → <code class="returnvalue">anyrange</code>
        </div>
        <div>
          Computes the union of the ranges. The ranges must overlap or be adjacent, so that the
          union is a single range (but see <code class="function">range_merge()</code>).
        </div>
        <div>
          <code class="literal">numrange(5,15) + numrange(10,20)</code>
          → <code class="returnvalue">[5,20)</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">*</code>
          <code class="type">anyrange</code> → <code class="returnvalue">anyrange</code>
        </div>
        <div>Computes the intersection of the ranges.</div>
        <div>
          <code class="literal">int8range(5,15)* int8range(10,20)</code>
          → <code class="returnvalue">[10,15)</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">-</code>
          <code class="type">anyrange</code> → <code class="returnvalue">anyrange</code>
        </div>
        <div>
          Computes the difference of the ranges. The second range must not be contained in the first
          in such a way that the difference would not be a single range.
        </div>
        <div>
          <code class="literal">int8range(5,15) - int8range(10,20)</code>
          → <code class="returnvalue">[5,10)</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MULTIRANGE-OPERATORS-TABLE)

**Table 9.56. Multirange Operators**

<figure class="table-wrapper">
<table class="table" summary="Multirange Operators" border="1">
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
          <code class="type">anymultirange</code> <code class="literal">@&gt;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the first multirange contain the second?</div>
        <div>
          <code class="literal">'\{[2,4)}'::int4multirange @&gt; '\{[2,3)}'::int4multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">@&gt;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the multirange contain the range?</div>
        <div>
          <code class="literal">'\{[2,4)}'::int4multirange @&gt; int4range(2,3)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">@&gt;</code>
          <code class="type">anyelement</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the multirange contain the element?</div>
        <div>
          <code class="literal">'\{[2011-01-01,2011-03-01)}'::tsmultirange @&gt; '2011-01-10'::timestamp</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">@&gt;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the range contain the multirange?</div>
        <div>
          <code class="literal">'[2,4)'::int4range @&gt; '\{[2,3)}'::int4multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&lt;@</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the first multirange contained by the second?</div>
        <div>
          <code class="literal">'\{[2,4)}'::int4multirange &lt;@ '\{[1,7)}'::int4multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&lt;@</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the multirange contained by the range?</div>
        <div>
          <code class="literal">'\{[2,4)}'::int4multirange &lt;@ int4range(1,7)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&lt;@</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the range contained by the multirange?</div>
        <div>
          <code class="literal">int4range(2,4) &lt;@ '\{[1,7)}'::int4multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyelement</code> <code class="literal">&lt;@</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the element contained by the multirange?</div>
        <div>
          <code class="literal">4 &lt;@ '\{[1,7)}'::int4multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&amp;&amp;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Do the multiranges overlap, that is, have any elements in common?</div>
        <div>
          <code class="literal">'\{[3,7)}'::int8multirange &amp;&amp; '\{[4,12)}'::int8multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&amp;&amp;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the multirange overlap the range?</div>
        <div>
          <code class="literal">'\{[3,7)}'::int8multirange &amp;&amp; int8range(4,12)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&amp;&amp;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the range overlap the multirange?</div>
        <div>
          <code class="literal">int8range(3,7) &amp;&amp; '\{[4,12)}'::int8multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&lt;&lt;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the first multirange strictly left of the second?</div>
        <div>
          <code class="literal">'\{[1,10)}'::int8multirange &lt;&lt; '\{[100,110)}'::int8multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&lt;&lt;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the multirange strictly left of the range?</div>
        <div>
          <code class="literal">'\{[1,10)}'::int8multirange &lt;&lt; int8range(100,110)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&lt;&lt;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the range strictly left of the multirange?</div>
        <div>
          <code class="literal">int8range(1,10) &lt;&lt; '\{[100,110)}'::int8multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&gt;&gt;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the first multirange strictly right of the second?</div>
        <div>
          <code class="literal">'\{[50,60)}'::int8multirange &gt;&gt; '\{[20,30)}'::int8multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&gt;&gt;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the multirange strictly right of the range?</div>
        <div>
          <code class="literal">'\{[50,60)}'::int8multirange &gt;&gt; int8range(20,30)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&gt;&gt;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the range strictly right of the multirange?</div>
        <div>
          <code class="literal">int8range(50,60) &gt;&gt; '\{[20,30)}'::int8multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&amp;&lt;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the first multirange not extend to the right of the second?</div>
        <div>
          <code class="literal">'\{[1,20)}'::int8multirange &amp;&lt; '\{[18,20)}'::int8multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&amp;&lt;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the multirange not extend to the right of the range?</div>
        <div>
          <code class="literal">'\{[1,20)}'::int8multirange &amp;&lt; int8range(18,20)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&amp;&lt;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the range not extend to the right of the multirange?</div>
        <div>
          <code class="literal">int8range(1,20) &amp;&lt; '\{[18,20)}'::int8multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&amp;&gt;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the first multirange not extend to the left of the second?</div>
        <div>
          <code class="literal">'\{[7,20)}'::int8multirange &amp;&gt; '\{[5,10)}'::int8multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">&amp;&gt;</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the multirange not extend to the left of the range?</div>
        <div>
          <code class="literal">'\{[7,20)}'::int8multirange &amp;&gt; int8range(5,10)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">&amp;&gt;</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does the range not extend to the left of the multirange?</div>
        <div>
          <code class="literal">int8range(7,20) &amp;&gt; '\{[5,10)}'::int8multirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">-|-</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Are the multiranges adjacent?</div>
        <div>
          <code class="literal">'\{[1.1,2.2)}'::nummultirange -|- '\{[2.2,3.3)}'::nummultirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">-|-</code>
          <code class="type">anyrange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the multirange adjacent to the range?</div>
        <div>
          <code class="literal">'\{[1.1,2.2)}'::nummultirange -|- numrange(2.2,3.3)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anyrange</code> <code class="literal">-|-</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is the range adjacent to the multirange?</div>
        <div>
          <code class="literal">numrange(1.1,2.2) -|- '\{[2.2,3.3)}'::nummultirange</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">+</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">anymultirange</code>
        </div>
        <div>
          Computes the union of the multiranges. The multiranges need not overlap or be adjacent.
        </div>
        <div>
          <code class="literal">'\{[5,10)}'::nummultirange + '\{[15,20)}'::nummultirange</code>
          → <code class="returnvalue">\{[5,10), [15,20)}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">*</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">anymultirange</code>
        </div>
        <div>Computes the intersection of the multiranges.</div>
        <div>
          <code class="literal">'\{[5,15)}'::int8multirange* '\{[10,20)}'::int8multirange</code>
          → <code class="returnvalue">\{[10,15)}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">anymultirange</code> <code class="literal">-</code>
          <code class="type">anymultirange</code> → <code class="returnvalue">anymultirange</code>
        </div>
        <div>Computes the difference of the multiranges.</div>
        <div>
          <code class="literal">'\{[5,20)}'::int8multirange - '\{[10,15)}'::int8multirange</code>
          → <code class="returnvalue">\{[5,10), [15,20)}</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

The left-of/right-of/adjacent operators always return false when an empty range or multirange is involved; that is, an empty range is not considered to be either before or after any other range.

Elsewhere empty ranges and multiranges are treated as the additive identity: anything unioned with an empty value is itself. Anything minus an empty value is itself. An empty multirange has exactly the same points as an empty range. Every range contains the empty range. Every multirange contains as many empty ranges as you like.

The range union and difference operators will fail if the resulting range would need to contain two disjoint sub-ranges, as such a range cannot be represented. There are separate operators for union and difference that take multirange parameters and return a multirange, and they do not fail even if their arguments are disjoint. So if you need a union or difference operation for ranges that may be disjoint, you can avoid errors by first casting your ranges to multiranges.

[Table 9.57](functions-range#RANGE-FUNCTIONS-TABLE) shows the functions available for use with range types. [Table 9.58](functions-range#MULTIRANGE-FUNCTIONS-TABLE) shows the functions available for use with multirange types.

[#id](#RANGE-FUNCTIONS-TABLE)

**Table 9.57. Range Functions**

<figure class="table-wrapper">
<table class="table" summary="Range Functions" border="1">
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
          <a id="id-1.5.8.26.10.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">lower</code> ( <code class="type">anyrange</code> ) →
          <code class="returnvalue">anyelement</code>
        </div>
        <div>
          Extracts the lower bound of the range (<code class="literal">NULL</code> if the range is
          empty or the lower bound is infinite).
        </div>
        <div>
          <code class="literal">lower(numrange(1.1,2.2))</code>
          → <code class="returnvalue">1.1</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.10.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">upper</code> ( <code class="type">anyrange</code> ) →
          <code class="returnvalue">anyelement</code>
        </div>
        <div>
          Extracts the upper bound of the range (<code class="literal">NULL</code> if the range is
          empty or the upper bound is infinite).
        </div>
        <div>
          <code class="literal">upper(numrange(1.1,2.2))</code>
          → <code class="returnvalue">2.2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.10.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">isempty</code> ( <code class="type">anyrange</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is the range empty?</div>
        <div>
          <code class="literal">isempty(numrange(1.1,2.2))</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.10.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">lower_inc</code> ( <code class="type">anyrange</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is the range's lower bound inclusive?</div>
        <div>
          <code class="literal">lower_inc(numrange(1.1,2.2))</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.10.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">upper_inc</code> ( <code class="type">anyrange</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is the range's upper bound inclusive?</div>
        <div>
          <code class="literal">upper_inc(numrange(1.1,2.2))</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.10.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">lower_inf</code> ( <code class="type">anyrange</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is the range's lower bound infinite?</div>
        <div>
          <code class="literal">lower_inf('(,)'::daterange)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.10.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">upper_inf</code> ( <code class="type">anyrange</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is the range's upper bound infinite?</div>
        <div>
          <code class="literal">upper_inf('(,)'::daterange)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.10.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">range_merge</code> ( <code class="type">anyrange</code>,
          <code class="type">anyrange</code> ) → <code class="returnvalue">anyrange</code>
        </div>
        <div>Computes the smallest range that includes both of the given ranges.</div>
        <div>
          <code class="literal">range_merge('[1,2)'::int4range, '[3,4)'::int4range)</code>
          → <code class="returnvalue">[1,4)</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MULTIRANGE-FUNCTIONS-TABLE)

**Table 9.58. Multirange Functions**

<figure class="table-wrapper">
<table class="table" summary="Multirange Functions" border="1">
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
          <a id="id-1.5.8.26.11.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">lower</code> ( <code class="type">anymultirange</code> ) →
          <code class="returnvalue">anyelement</code>
        </div>
        <div>
          Extracts the lower bound of the multirange (<code class="literal">NULL</code> if the
          multirange is empty or the lower bound is infinite).
        </div>
        <div>
          <code class="literal">lower('\{[1.1,2.2)}'::nummultirange)</code>
          → <code class="returnvalue">1.1</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.11.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">upper</code> ( <code class="type">anymultirange</code> ) →
          <code class="returnvalue">anyelement</code>
        </div>
        <div>
          Extracts the upper bound of the multirange (<code class="literal">NULL</code> if the
          multirange is empty or the upper bound is infinite).
        </div>
        <div>
          <code class="literal">upper('\{[1.1,2.2)}'::nummultirange)</code>
          → <code class="returnvalue">2.2</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.11.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">isempty</code> ( <code class="type">anymultirange</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is the multirange empty?</div>
        <div>
          <code class="literal">isempty('\{[1.1,2.2)}'::nummultirange)</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.11.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">lower_inc</code> ( <code class="type">anymultirange</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is the multirange's lower bound inclusive?</div>
        <div>
          <code class="literal">lower_inc('\{[1.1,2.2)}'::nummultirange)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.11.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">upper_inc</code> ( <code class="type">anymultirange</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is the multirange's upper bound inclusive?</div>
        <div>
          <code class="literal">upper_inc('\{[1.1,2.2)}'::nummultirange)</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.11.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">lower_inf</code> ( <code class="type">anymultirange</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is the multirange's lower bound infinite?</div>
        <div>
          <code class="literal">lower_inf('\{(,)}'::datemultirange)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.11.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">upper_inf</code> ( <code class="type">anymultirange</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is the multirange's upper bound infinite?</div>
        <div>
          <code class="literal">upper_inf('\{(,)}'::datemultirange)</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.11.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">range_merge</code> ( <code class="type">anymultirange</code> ) →
          <code class="returnvalue">anyrange</code>
        </div>
        <div>Computes the smallest range that includes the entire multirange.</div>
        <div>
          <code class="literal">range_merge('\{[1,2), [3,4)}'::int4multirange)</code>
          → <code class="returnvalue">[1,4)</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.11.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">multirange</code> ( <code class="type">anyrange</code> ) →
          <code class="returnvalue">anymultirange</code>
        </div>
        <div>Returns a multirange containing just the given range.</div>
        <div>
          <code class="literal">multirange('[1,2)'::int4range)</code>
          → <code class="returnvalue">\{[1,2)}</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.26.11.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">unnest</code> ( <code class="type">anymultirange</code> ) →
          <code class="returnvalue">setof anyrange</code>
        </div>
        <div>
          Expands a multirange into a set of ranges. The ranges are read out in storage order
          (ascending).
        </div>
        <div>
          <code class="literal">unnest('\{[1,2), [3,4)}'::int4multirange)</code>
          → <code class="returnvalue"></code>
        </div>
        <div>
        <pre class="programlisting">
 [1,2)
 [3,4)
</pre>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

The `lower_inc`, `upper_inc`, `lower_inf`, and `upper_inf` functions all return false for an empty range or multirange.

[#id](#FUNCTIONS-NET)

## 9.12. Network Address Functions and Operators [#](#FUNCTIONS-NET)

The IP network address types, `cidr` and `inet`, support the usual comparison operators shown in [Table 9.1](functions-comparison#FUNCTIONS-COMPARISON-OP-TABLE) as well as the specialized operators and functions shown in [Table 9.39](functions-net#CIDR-INET-OPERATORS-TABLE) and [Table 9.40](functions-net#CIDR-INET-FUNCTIONS-TABLE).

Any `cidr` value can be cast to `inet` implicitly; therefore, the operators and functions shown below as operating on `inet` also work on `cidr` values. (Where there are separate functions for `inet` and `cidr`, it is because the behavior should be different for the two cases.) Also, it is permitted to cast an `inet` value to `cidr`. When this is done, any bits to the right of the netmask are silently zeroed to create a valid `cidr` value.

[#id](#CIDR-INET-OPERATORS-TABLE)

**Table 9.39. IP Address Operators**

<figure class="table-wrapper">
<table class="table" summary="IP Address Operators" border="1">
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
          <code class="type">inet</code> <code class="literal">&lt;&lt;</code>
          <code class="type">inet</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Is subnet strictly contained by subnet? This operator, and the next four, test for subnet
          inclusion. They consider only the network parts of the two addresses (ignoring any bits to
          the right of the netmasks) and determine whether one network is identical to or a subnet
          of the other.
        </div>
        <div>
          <code class="literal">inet '192.168.1.5' &lt;&lt; inet '192.168.1/24'</code>
          → <code class="returnvalue">t</code>
        </div>
        <div>
          <code class="literal">inet '192.168.0.5' &lt;&lt; inet '192.168.1/24'</code>
          → <code class="returnvalue">f</code>
        </div>
        <div>
          <code class="literal">inet '192.168.1/24' &lt;&lt; inet '192.168.1/24'</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">inet</code> <code class="literal">&lt;&lt;=</code>
          <code class="type">inet</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Is subnet contained by or equal to subnet?</div>
        <div>
          <code class="literal">inet '192.168.1/24' &lt;&lt;= inet '192.168.1/24'</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">inet</code> <code class="literal">&gt;&gt;</code>
          <code class="type">inet</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does subnet strictly contain subnet?</div>
        <div>
          <code class="literal">inet '192.168.1/24' &gt;&gt; inet '192.168.1.5'</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">inet</code> <code class="literal">&gt;&gt;=</code>
          <code class="type">inet</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does subnet contain or equal subnet?</div>
        <div>
          <code class="literal">inet '192.168.1/24' &gt;&gt;= inet '192.168.1/24'</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">inet</code> <code class="literal">&amp;&amp;</code>
          <code class="type">inet</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>Does either subnet contain or equal the other?</div>
        <div>
          <code class="literal">inet '192.168.1/24' &amp;&amp; inet '192.168.1.80/28'</code>
          → <code class="returnvalue">t</code>
        </div>
        <div>
          <code class="literal">inet '192.168.1/24' &amp;&amp; inet '192.168.2.0/28'</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="literal">~</code> <code class="type">inet</code> →
          <code class="returnvalue">inet</code>
        </div>
        <div>Computes bitwise NOT.</div>
        <div>
          <code class="literal">~ inet '192.168.1.6'</code>
          → <code class="returnvalue">63.87.254.249</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">inet</code> <code class="literal">&amp;</code>
          <code class="type">inet</code> → <code class="returnvalue">inet</code>
        </div>
        <div>Computes bitwise AND.</div>
        <div>
          <code class="literal">inet '192.168.1.6' &amp; inet '0.0.0.255'</code>
          → <code class="returnvalue">0.0.0.6</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">inet</code> <code class="literal">|</code>
          <code class="type">inet</code> → <code class="returnvalue">inet</code>
        </div>
        <div>Computes bitwise OR.</div>
        <div>
          <code class="literal">inet '192.168.1.6' | inet '0.0.0.255'</code>
          → <code class="returnvalue">192.168.1.255</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">inet</code> <code class="literal">+</code>
          <code class="type">bigint</code> → <code class="returnvalue">inet</code>
        </div>
        <div>Adds an offset to an address.</div>
        <div>
          <code class="literal">inet '192.168.1.6' + 25</code>
          → <code class="returnvalue">192.168.1.31</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">bigint</code> <code class="literal">+</code>
          <code class="type">inet</code> → <code class="returnvalue">inet</code>
        </div>
        <div>Adds an offset to an address.</div>
        <div>
          <code class="literal">200 + inet '::ffff:fff0:1'</code>
          → <code class="returnvalue">::ffff:255.240.0.201</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">inet</code> <code class="literal">-</code>
          <code class="type">bigint</code> → <code class="returnvalue">inet</code>
        </div>
        <div>Subtracts an offset from an address.</div>
        <div>
          <code class="literal">inet '192.168.1.43' - 36</code>
          → <code class="returnvalue">192.168.1.7</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">inet</code> <code class="literal">-</code>
          <code class="type">inet</code> → <code class="returnvalue">bigint</code>
        </div>
        <div>Computes the difference of two addresses.</div>
        <div>
          <code class="literal">inet '192.168.1.43' - inet '192.168.1.19'</code>
          → <code class="returnvalue">24</code>
        </div>
        <div>
          <code class="literal">inet '::1' - inet '::ffff:1'</code>
          → <code class="returnvalue">-4294901760</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#CIDR-INET-FUNCTIONS-TABLE)

**Table 9.40. IP Address Functions**

<figure class="table-wrapper">
<table class="table" summary="IP Address Functions" border="1">
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
          <a id="id-1.5.8.18.5.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">abbrev</code> ( <code class="type">inet</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Creates an abbreviated display format as text. (The result is the same as the
          <code class="type">inet</code> output function produces; it is
          <span class="quote">“<span class="quote">abbreviated</span>”</span> only in comparison to
          the result of an explicit cast to <code class="type">text</code>, which for historical
          reasons will never suppress the netmask part.)
        </div>
        <div>
          <code class="literal">abbrev(inet '10.1.0.0/32')</code>
          → <code class="returnvalue">10.1.0.0</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">abbrev</code> ( <code class="type">cidr</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Creates an abbreviated display format as text. (The abbreviation consists of dropping
          all-zero octets to the right of the netmask; more examples are in
          <a
            class="xref"
            href="datatype-net-types.html#DATATYPE-NET-CIDR-TABLE"
            title="Table&nbsp;8.22.&nbsp;cidr Type Input Examples">Table&nbsp;8.22</a>.)
        </div>
        <div>
          <code class="literal">abbrev(cidr '10.1.0.0/16')</code>
          → <code class="returnvalue">10.1/16</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">broadcast</code> ( <code class="type">inet</code> ) →
          <code class="returnvalue">inet</code>
        </div>
        <div>Computes the broadcast address for the address's network.</div>
        <div>
          <code class="literal">broadcast(inet '192.168.1.5/24')</code>
          → <code class="returnvalue">192.168.1.255/24</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">family</code> ( <code class="type">inet</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns the address's family: <code class="literal">4</code> for IPv4,
          <code class="literal">6</code> for IPv6.
        </div>
        <div>
          <code class="literal">family(inet '::1')</code>
          → <code class="returnvalue">6</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">host</code> ( <code class="type">inet</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>Returns the IP address as text, ignoring the netmask.</div>
        <div>
          <code class="literal">host(inet '192.168.1.0/24')</code>
          → <code class="returnvalue">192.168.1.0</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">hostmask</code> ( <code class="type">inet</code> ) →
          <code class="returnvalue">inet</code>
        </div>
        <div>Computes the host mask for the address's network.</div>
        <div>
          <code class="literal">hostmask(inet '192.168.23.20/30')</code>
          → <code class="returnvalue">0.0.0.3</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">inet_merge</code> ( <code class="type">inet</code>,
          <code class="type">inet</code> ) → <code class="returnvalue">cidr</code>
        </div>
        <div>Computes the smallest network that includes both of the given networks.</div>
        <div>
          <code class="literal">inet_merge(inet '192.168.1.5/24', inet '192.168.2.5/24')</code>
          → <code class="returnvalue">192.168.0.0/22</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">inet_same_family</code> ( <code class="type">inet</code>,
          <code class="type">inet</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>Tests whether the addresses belong to the same IP family.</div>
        <div>
          <code class="literal">inet_same_family(inet '192.168.1.5/24', inet '::1')</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">masklen</code> ( <code class="type">inet</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>Returns the netmask length in bits.</div>
        <div>
          <code class="literal">masklen(inet '192.168.1.5/24')</code>
          → <code class="returnvalue">24</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">netmask</code> ( <code class="type">inet</code> ) →
          <code class="returnvalue">inet</code>
        </div>
        <div>Computes the network mask for the address's network.</div>
        <div>
          <code class="literal">netmask(inet '192.168.1.5/24')</code>
          → <code class="returnvalue">255.255.255.0</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">network</code> ( <code class="type">inet</code> ) →
          <code class="returnvalue">cidr</code>
        </div>
        <div>
          Returns the network part of the address, zeroing out whatever is to the right of the
          netmask. (This is equivalent to casting the value to <code class="type">cidr</code>.)
        </div>
        <div>
          <code class="literal">network(inet '192.168.1.5/24')</code>
          → <code class="returnvalue">192.168.1.0/24</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">set_masklen</code> ( <code class="type">inet</code>,
          <code class="type">integer</code> ) → <code class="returnvalue">inet</code>
        </div>
        <div>
          Sets the netmask length for an <code class="type">inet</code> value. The address part does
          not change.
        </div>
        <div>
          <code class="literal">set_masklen(inet '192.168.1.5/24', 16)</code>
          → <code class="returnvalue">192.168.1.5/16</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">set_masklen</code> ( <code class="type">cidr</code>,
          <code class="type">integer</code> ) → <code class="returnvalue">cidr</code>
        </div>
        <div>
          Sets the netmask length for a <code class="type">cidr</code> value. Address bits to the
          right of the new netmask are set to zero.
        </div>
        <div>
          <code class="literal">set_masklen(cidr '192.168.1.0/24', 16)</code>
          → <code class="returnvalue">192.168.0.0/16</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.5.2.2.14.1.1.1" class="indexterm"></a>
          <code class="function">text</code> ( <code class="type">inet</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the unabbreviated IP address and netmask length as text. (This has the same result
          as an explicit cast to <code class="type">text</code>.)
        </div>
        <div>
          <code class="literal">text(inet '192.168.1.5')</code>
          → <code class="returnvalue">192.168.1.5/32</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

### Tip

The `abbrev`, `host`, and `text` functions are primarily intended to offer alternative display formats for IP addresses.

The MAC address types, `macaddr` and `macaddr8`, support the usual comparison operators shown in [Table 9.1](functions-comparison#FUNCTIONS-COMPARISON-OP-TABLE) as well as the specialized functions shown in [Table 9.41](functions-net#MACADDR-FUNCTIONS-TABLE). In addition, they support the bitwise logical operators `~`, `&` and `|` (NOT, AND and OR), just as shown above for IP addresses.

[#id](#MACADDR-FUNCTIONS-TABLE)

**Table 9.41. MAC Address Functions**

<figure class="table-wrapper">
<table class="table" summary="MAC Address Functions" border="1">
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
          <a id="id-1.5.8.18.8.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">trunc</code> ( <code class="type">macaddr</code> ) →
          <code class="returnvalue">macaddr</code>
        </div>
        <div>
          Sets the last 3 bytes of the address to zero. The remaining prefix can be associated with
          a particular manufacturer (using data not included in
          <span class="productname">PostgreSQL</span>).
        </div>
        <div>
          <code class="literal">trunc(macaddr '12:34:56:78:90:ab')</code>
          → <code class="returnvalue">12:34:56:00:00:00</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">trunc</code> ( <code class="type">macaddr8</code> ) →
          <code class="returnvalue">macaddr8</code>
        </div>
        <div>
          Sets the last 5 bytes of the address to zero. The remaining prefix can be associated with
          a particular manufacturer (using data not included in
          <span class="productname">PostgreSQL</span>).
        </div>
        <div>
          <code class="literal">trunc(macaddr8 '12:34:56:78:90:ab:cd:ef')</code>
          → <code class="returnvalue">12:34:56:00:00:00:00:00</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.18.8.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">macaddr8_set7bit</code> ( <code class="type">macaddr8</code> ) →
          <code class="returnvalue">macaddr8</code>
        </div>
        <div>
          Sets the 7th bit of the address to one, creating what is known as modified EUI-64, for
          inclusion in an IPv6 address.
        </div>
        <div>
          <code class="literal">macaddr8_set7bit(macaddr8 '00:34:56:ab:cd:ef')</code>
          → <code class="returnvalue">02:34:56:ff:fe:ab:cd:ef</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-SEQUENCE)

## 9.17. Sequence Manipulation Functions [#](#FUNCTIONS-SEQUENCE)

This section describes functions for operating on _sequence objects_, also called sequence generators or just sequences. Sequence objects are special single-row tables created with [CREATE SEQUENCE](sql-createsequence). Sequence objects are commonly used to generate unique identifiers for rows of a table. The sequence functions, listed in [Table 9.52](functions-sequence#FUNCTIONS-SEQUENCE-TABLE), provide simple, multiuser-safe methods for obtaining successive sequence values from sequence objects.

[#id](#FUNCTIONS-SEQUENCE-TABLE)

**Table 9.52. Sequence Functions**

<figure class="table-wrapper">
<table class="table" summary="Sequence Functions" border="1">
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
          <a id="id-1.5.8.23.4.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">nextval</code> ( <code class="type">regclass</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>
          Advances the sequence object to its next value and returns that value. This is done
          atomically: even if multiple sessions execute
          <code class="function">nextval</code> concurrently, each will safely receive a distinct
          sequence value. If the sequence object has been created with default parameters,
          successive <code class="function">nextval</code> calls will return successive values
          beginning with 1. Other behaviors can be obtained by using appropriate parameters in the
          <a class="xref" href="sql-createsequence.html" title="CREATE SEQUENCE"><span class="refentrytitle">CREATE SEQUENCE</span></a>
          command.
        </div>
        <div>
          This function requires <code class="literal">USAGE</code> or
          <code class="literal">UPDATE</code> privilege on the sequence.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.23.4.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">setval</code> ( <code class="type">regclass</code>,
          <code class="type">bigint</code> [<span class="optional">, <code class="type">boolean</code> </span>] ) → <code class="returnvalue">bigint</code>
        </div>
        <div>
          Sets the sequence object's current value, and optionally its
          <code class="literal">is_called</code> flag. The two-parameter form sets the sequence's
          <code class="literal">last_value</code> field to the specified value and sets its
          <code class="literal">is_called</code> field to <code class="literal">true</code>, meaning
          that the next <code class="function">nextval</code> will advance the sequence before
          returning a value. The value that will be reported by
          <code class="function">currval</code> is also set to the specified value. In the
          three-parameter form, <code class="literal">is_called</code> can be set to either
          <code class="literal">true</code> or <code class="literal">false</code>.
          <code class="literal">true</code> has the same effect as the two-parameter form. If it is
          set to <code class="literal">false</code>, the next
          <code class="function">nextval</code> will return exactly the specified value, and
          sequence advancement commences with the following <code class="function">nextval</code>.
          Furthermore, the value reported by <code class="function">currval</code> is not changed in
          this case. For example,
        </div>
        <div>
        <pre class="programlisting">
        SELECT setval('myseq', 42);<em class="lineannotation"><span class="lineannotation">Next <code class="function">nextval</code> will return 43</span></em>
        SELECT setval('myseq', 42, true);<em class="lineannotation"><span class="lineannotation">Same as above</span></em>
        SELECT setval('myseq', 42, false);<em class="lineannotation"><span class="lineannotation">Next <code class="function">nextval</code> will return 42</span></em>
        </pre>
        </div>
        <div>
          The result returned by <code class="function">setval</code> is just the value of its
          second argument.
        </div>
        <div>This function requires <code class="literal">UPDATE</code> privilege on the sequence.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.23.4.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">currval</code> ( <code class="type">regclass</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>
          Returns the value most recently obtained by <code class="function">nextval</code> for this
          sequence in the current session. (An error is reported if
          <code class="function">nextval</code> has never been called for this sequence in this
          session.) Because this is returning a session-local value, it gives a predictable answer
          whether or not other sessions have executed <code class="function">nextval</code> since
          the current session did.
        </div>
        <div>
          This function requires <code class="literal">USAGE</code> or
          <code class="literal">SELECT</code> privilege on the sequence.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.23.4.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">lastval</code> () → <code class="returnvalue">bigint</code>
        </div>
        <div>
          Returns the value most recently returned by
          <code class="function">nextval</code> in the current session. This function is identical
          to <code class="function">currval</code>, except that instead of taking the sequence name
          as an argument it refers to whichever sequence <code class="function">nextval</code> was
          most recently applied to in the current session. It is an error to call
          <code class="function">lastval</code> if <code class="function">nextval</code>
          has not yet been called in the current session.
        </div>
        <div>
          This function requires <code class="literal">USAGE</code> or
          <code class="literal">SELECT</code> privilege on the last used sequence.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

### Caution

To avoid blocking concurrent transactions that obtain numbers from the same sequence, the value obtained by `nextval` is not reclaimed for re-use if the calling transaction later aborts. This means that transaction aborts or database crashes can result in gaps in the sequence of assigned values. That can happen without a transaction abort, too. For example an `INSERT` with an `ON CONFLICT` clause will compute the to-be-inserted tuple, including doing any required `nextval` calls, before detecting any conflict that would cause it to follow the `ON CONFLICT` rule instead. Thus, PostgreSQL sequence objects _cannot be used to obtain “gapless” sequences_.

Likewise, sequence state changes made by `setval` are immediately visible to other transactions, and are not undone if the calling transaction rolls back.

If the database cluster crashes before committing a transaction containing a `nextval` or `setval` call, the sequence state change might not have made its way to persistent storage, so that it is uncertain whether the sequence will have its original or updated state after the cluster restarts. This is harmless for usage of the sequence within the database, since other effects of uncommitted transactions will not be visible either. However, if you wish to use a sequence value for persistent outside-the-database purposes, make sure that the `nextval` call has been committed before doing so.

The sequence to be operated on by a sequence function is specified by a `regclass` argument, which is simply the OID of the sequence in the `pg_class` system catalog. You do not have to look up the OID by hand, however, since the `regclass` data type's input converter will do the work for you. See [Section 8.19](datatype-oid) for details.

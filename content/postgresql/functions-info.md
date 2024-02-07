[#id](#FUNCTIONS-INFO)

## 9.26. System Information Functions and Operators [#](#FUNCTIONS-INFO)

- [9.26.1. Session Information Functions](functions-info#FUNCTIONS-INFO-SESSION)
- [9.26.2. Access Privilege Inquiry Functions](functions-info#FUNCTIONS-INFO-ACCESS)
- [9.26.3. Schema Visibility Inquiry Functions](functions-info#FUNCTIONS-INFO-SCHEMA)
- [9.26.4. System Catalog Information Functions](functions-info#FUNCTIONS-INFO-CATALOG)
- [9.26.5. Object Information and Addressing Functions](functions-info#FUNCTIONS-INFO-OBJECT)
- [9.26.6. Comment Information Functions](functions-info#FUNCTIONS-INFO-COMMENT)
- [9.26.7. Data Validity Checking Functions](functions-info#FUNCTIONS-INFO-VALIDITY)
- [9.26.8. Transaction ID and Snapshot Information Functions](functions-info#FUNCTIONS-INFO-SNAPSHOT)
- [9.26.9. Committed Transaction Information Functions](functions-info#FUNCTIONS-INFO-COMMIT-TIMESTAMP)
- [9.26.10. Control Data Functions](functions-info#FUNCTIONS-INFO-CONTROLDATA)

The functions described in this section are used to obtain various information about a PostgreSQL installation.

[#id](#FUNCTIONS-INFO-SESSION)

### 9.26.1. Session Information Functions [#](#FUNCTIONS-INFO-SESSION)

[Table 9.67](functions-info#FUNCTIONS-INFO-SESSION-TABLE) shows several functions that extract session and system information.

In addition to the functions listed in this section, there are a number of functions related to the statistics system that also provide system information. See [Section 28.2.2](monitoring-stats#MONITORING-STATS-VIEWS) for more information.

[#id](#FUNCTIONS-INFO-SESSION-TABLE)

**Table 9.67. Session Information Functions**

<figure class="table-wrapper">
<table class="table" summary="Session Information Functions" border="1">
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
          <a id="id-1.5.8.32.3.4.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">current_catalog</code>
          → <code class="returnvalue">name</code>
        </div>
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.1.1.2.1" class="indexterm"></a>
          <code class="function">current_database</code> () → <code class="returnvalue">name</code>
        </div>
        <div>
          Returns the name of the current database. (Databases are called
          <span class="quote">“<span class="quote">catalogs</span>”</span> in the SQL standard, so
          <code class="function">current_catalog</code> is the standard's spelling.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">current_query</code> () → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the text of the currently executing query, as submitted by the client (which might
          contain more than one statement).
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">current_role</code>
          → <code class="returnvalue">name</code>
        </div>
        <div>This is equivalent to <code class="function">current_user</code>.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.4.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.32.3.4.2.2.4.1.1.2" class="indexterm"></a>
          <code class="function">current_schema</code>
          → <code class="returnvalue">name</code>
        </div>
        <div class="func_signature">
          <code class="function">current_schema</code> () → <code class="returnvalue">name</code>
        </div>
        <div>
          Returns the name of the schema that is first in the search path (or a null value if the
          search path is empty). This is the schema that will be used for any tables or other named
          objects that are created without specifying a target schema.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.5.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.32.3.4.2.2.5.1.1.2" class="indexterm"></a>
          <code class="function">current_schemas</code> (
          <em class="parameter"><code>include_implicit</code></em>
          <code class="type">boolean</code> ) → <code class="returnvalue">name[]</code>
        </div>
        <div>
          Returns an array of the names of all schemas presently in the effective search path, in
          their priority order. (Items in the current
          <a class="xref" href="runtime-config-client.html#GUC-SEARCH-PATH">search_path</a> setting
          that do not correspond to existing, searchable schemas are omitted.) If the Boolean
          argument is <code class="literal">true</code>, then implicitly-searched system schemas
          such as <code class="literal">pg_catalog</code> are included in the result.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.6.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.32.3.4.2.2.6.1.1.2" class="indexterm"></a>
          <code class="function">current_user</code>
          → <code class="returnvalue">name</code>
        </div>
        <div>Returns the user name of the current execution context.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">inet_client_addr</code> () → <code class="returnvalue">inet</code>
        </div>
        <div>
          Returns the IP address of the current client, or <code class="literal">NULL</code> if the
          current connection is via a Unix-domain socket.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">inet_client_port</code> () →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns the IP port number of the current client, or <code class="literal">NULL</code> if
          the current connection is via a Unix-domain socket.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">inet_server_addr</code> () → <code class="returnvalue">inet</code>
        </div>
        <div>
          Returns the IP address on which the server accepted the current connection, or
          <code class="literal">NULL</code> if the current connection is via a Unix-domain socket.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">inet_server_port</code> () →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns the IP port number on which the server accepted the current connection, or
          <code class="literal">NULL</code> if the current connection is via a Unix-domain socket.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">pg_backend_pid</code> () → <code class="returnvalue">integer</code>
        </div>
        <div>Returns the process ID of the server process attached to the current session.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">pg_blocking_pids</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">integer[]</code>
        </div>
        <div>
          Returns an array of the process ID(s) of the sessions that are blocking the server process
          with the specified process ID from acquiring a lock, or an empty array if there is no such
          server process or it is not blocked.
        </div>
        <div>
          One server process blocks another if it either holds a lock that conflicts with the
          blocked process's lock request (hard block), or is waiting for a lock that would conflict
          with the blocked process's lock request and is ahead of it in the wait queue (soft block).
          When using parallel queries the result always lists client-visible process IDs (that is,
          <code class="function">pg_backend_pid</code> results) even if the actual lock is held or
          awaited by a child worker process. As a result of that, there may be duplicated PIDs in
          the result. Also note that when a prepared transaction holds a conflicting lock, it will
          be represented by a zero process ID.
        </div>
        <div>
          Frequent calls to this function could have some impact on database performance, because it
          needs exclusive access to the lock manager's shared state for a short time.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">pg_conf_load_time</code> () →
          <code class="returnvalue">timestamp with time zone</code>
        </div>
        <div>
          Returns the time when the server configuration files were last loaded. If the current
          session was alive at the time, this will be the time when the session itself re-read the
          configuration files (so the reading will vary a little in different sessions). Otherwise
          it is the time when the postmaster process re-read the configuration files.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.14.1.1.1" class="indexterm"></a>
          <a id="id-1.5.8.32.3.4.2.2.14.1.1.2" class="indexterm"></a>
          <a id="id-1.5.8.32.3.4.2.2.14.1.1.3" class="indexterm"></a>
          <a id="id-1.5.8.32.3.4.2.2.14.1.1.4" class="indexterm"></a>
          <code class="function">pg_current_logfile</code> ( [<span class="optional">
            <code class="type">text</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the path name of the log file currently in use by the logging collector. The path
          includes the
          <a class="xref" href="runtime-config-logging.html#GUC-LOG-DIRECTORY">log_directory</a>
          directory and the individual log file name. The result is
          <code class="literal">NULL</code> if the logging collector is disabled. When multiple log
          files exist, each in a different format,
          <code class="function">pg_current_logfile</code> without an argument returns the path of
          the file having the first format found in the ordered list:
          <code class="literal">stderr</code>, <code class="literal">csvlog</code>,
          <code class="literal">jsonlog</code>. <code class="literal">NULL</code> is returned if no
          log file has any of these formats. To request information about a specific log file
          format, supply either <code class="literal">csvlog</code>,
          <code class="literal">jsonlog</code> or <code class="literal">stderr</code> as the value
          of the optional parameter. The result is <code class="literal">NULL</code>
          if the log format requested is not configured in
          <a class="xref" href="runtime-config-logging.html#GUC-LOG-DESTINATION">log_destination</a>. The result reflects the contents of the
          <code class="filename">current_logfiles</code> file.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.15.1.1.1" class="indexterm"></a>
          <code class="function">pg_my_temp_schema</code> () → <code class="returnvalue">oid</code>
        </div>
        <div>
          Returns the OID of the current session's temporary schema, or zero if it has none (because
          it has not created any temporary tables).
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.16.1.1.1" class="indexterm"></a>
          <code class="function">pg_is_other_temp_schema</code> ( <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Returns true if the given OID is the OID of another session's temporary schema. (This can
          be useful, for example, to exclude other sessions' temporary tables from a catalog
          display.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.17.1.1.1" class="indexterm"></a>
          <code class="function">pg_jit_available</code> () →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Returns true if a <acronym class="acronym">JIT</acronym> compiler extension is available
          (see
          <a class="xref" href="jit.html" title="Chapter 32. Just-in-Time Compilation (JIT)">Chapter 32</a>) and the <a class="xref" href="runtime-config-query.html#GUC-JIT">jit</a> configuration
          parameter is set to <code class="literal">on</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.18.1.1.1" class="indexterm"></a>
          <code class="function">pg_listening_channels</code> () →
          <code class="returnvalue">setof text</code>
        </div>
        <div>
          Returns the set of names of asynchronous notification channels that the current session is
          listening to.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.19.1.1.1" class="indexterm"></a>
          <code class="function">pg_notification_queue_usage</code> () →
          <code class="returnvalue">double precision</code>
        </div>
        <div>
          Returns the fraction (0–1) of the asynchronous notification queue's maximum size that is
          currently occupied by notifications that are waiting to be processed. See
          <a class="xref" href="sql-listen.html" title="LISTEN"
            ><span class="refentrytitle">LISTEN</span></a>
          and
          <a class="xref" href="sql-notify.html" title="NOTIFY"><span class="refentrytitle">NOTIFY</span></a>
          for more information.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.20.1.1.1" class="indexterm"></a>
          <code class="function">pg_postmaster_start_time</code> () →
          <code class="returnvalue">timestamp with time zone</code>
        </div>
        <div>Returns the time when the server started.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.21.1.1.1" class="indexterm"></a>
          <code class="function">pg_safe_snapshot_blocking_pids</code> (
          <code class="type">integer</code> ) → <code class="returnvalue">integer[]</code>
        </div>
        <div>
          Returns an array of the process ID(s) of the sessions that are blocking the server process
          with the specified process ID from acquiring a safe snapshot, or an empty array if there
          is no such server process or it is not blocked.
        </div>
        <div>
          A session running a <code class="literal">SERIALIZABLE</code> transaction blocks a
          <code class="literal">SERIALIZABLE READ ONLY DEFERRABLE</code> transaction from acquiring
          a snapshot until the latter determines that it is safe to avoid taking any predicate
          locks. See
          <a
            class="xref"
            href="transaction-iso.html#XACT-SERIALIZABLE"
            title="13.2.3. Serializable Isolation Level">Section 13.2.3</a>
          for more information about serializable and deferrable transactions.
        </div>
        <div>
          Frequent calls to this function could have some impact on database performance, because it
          needs access to the predicate lock manager's shared state for a short time.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.22.1.1.1" class="indexterm"></a>
          <code class="function">pg_trigger_depth</code> () →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Returns the current nesting level of <span class="productname">PostgreSQL</span> triggers
          (0 if not called, directly or indirectly, from inside a trigger).
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.23.1.1.1" class="indexterm"></a>
          <code class="function">session_user</code>
          → <code class="returnvalue">name</code>
        </div>
        <div>Returns the session user's name.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.24.1.1.1" class="indexterm"></a>
          <code class="function">system_user</code>
          → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the authentication method and the identity (if any) that the user presented during
          the authentication cycle before they were assigned a database role. It is represented as
          <code class="literal">auth_method:identity</code> or <code class="literal">NULL</code> if
          the user has not been authenticated (for example if
          <a class="link" href="auth-trust.html" title="21.4. Trust Authentication">Trust authentication</a>
          has been used).
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.25.1.1.1" class="indexterm"></a>
          <code class="function">user</code>
          → <code class="returnvalue">name</code>
        </div>
        <div>This is equivalent to <code class="function">current_user</code>.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.3.4.2.2.26.1.1.1" class="indexterm"></a>
          <code class="function">version</code> () → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns a string describing the <span class="productname">PostgreSQL</span>
          server's version. You can also get this information from
          <a class="xref" href="runtime-config-preset.html#GUC-SERVER-VERSION">server_version</a>,
          or for a machine-readable version use
          <a class="xref" href="runtime-config-preset.html#GUC-SERVER-VERSION-NUM">server_version_num</a>. Software developers should use
          <code class="varname">server_version_num</code> (available since 8.2) or
          <a class="xref" href="libpq-status.html#LIBPQ-PQSERVERVERSION"><code class="function">PQserverVersion</code></a>
          instead of parsing the text version.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

### Note

`current_catalog`, `current_role`, `current_schema`, `current_user`, `session_user`, and `user` have special syntactic status in SQL: they must be called without trailing parentheses. In PostgreSQL, parentheses can optionally be used with `current_schema`, but not with the others.

The `session_user` is normally the user who initiated the current database connection; but superusers can change this setting with [SET SESSION AUTHORIZATION](sql-set-session-authorization). The `current_user` is the user identifier that is applicable for permission checking. Normally it is equal to the session user, but it can be changed with [SET ROLE](sql-set-role). It also changes during the execution of functions with the attribute `SECURITY DEFINER`. In Unix parlance, the session user is the “real user” and the current user is the “effective user”. `current_role` and `user` are synonyms for `current_user`. (The SQL standard draws a distinction between `current_role` and `current_user`, but PostgreSQL does not, since it unifies users and roles into a single kind of entity.)

[#id](#FUNCTIONS-INFO-ACCESS)

### 9.26.2. Access Privilege Inquiry Functions [#](#FUNCTIONS-INFO-ACCESS)

[Table 9.68](functions-info#FUNCTIONS-INFO-ACCESS-TABLE) lists functions that allow querying object access privileges programmatically. (See [Section 5.7](ddl-priv) for more information about privileges.) In these functions, the user whose privileges are being inquired about can be specified by name or by OID (`pg_authid`.`oid`), or if the name is given as `public` then the privileges of the PUBLIC pseudo-role are checked. Also, the _`user`_ argument can be omitted entirely, in which case the `current_user` is assumed. The object that is being inquired about can be specified either by name or by OID, too. When specifying by name, a schema name can be included if relevant. The access privilege of interest is specified by a text string, which must evaluate to one of the appropriate privilege keywords for the object's type (e.g., `SELECT`). Optionally, `WITH GRANT OPTION` can be added to a privilege type to test whether the privilege is held with grant option. Also, multiple privilege types can be listed separated by commas, in which case the result will be true if any of the listed privileges is held. (Case of the privilege string is not significant, and extra whitespace is allowed between but not within privilege names.) Some examples:

```

SELECT has_table_privilege('myschema.mytable', 'select');
SELECT has_table_privilege('joe', 'mytable', 'INSERT, SELECT WITH GRANT OPTION');
```

[#id](#FUNCTIONS-INFO-ACCESS-TABLE)

**Table 9.68. Access Privilege Inquiry Functions**

<figure class="table-wrapper">
<table class="table" summary="Access Privilege Inquiry Functions" border="1">
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
          <a id="id-1.5.8.32.4.4.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">has_any_column_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>table</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for any column of table? This succeeds either if the privilege is
          held for the whole table, or if there is a column-level grant of the privilege for at
          least one column. Allowable privilege types are
          <code class="literal">SELECT</code>, <code class="literal">INSERT</code>,
          <code class="literal">UPDATE</code>, and <code class="literal">REFERENCES</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">has_column_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>table</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>column</code></em>
          <code class="type">text</code> or <code class="type">smallint</code>,
          <em class="parameter"><code>privilege</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for the specified table column? This succeeds either if the
          privilege is held for the whole table, or if there is a column-level grant of the
          privilege for the column. The column can be specified by name or by attribute number
          (<code class="structname">pg_attribute</code>.<code class="structfield">attnum</code>).
          Allowable privilege types are <code class="literal">SELECT</code>,
          <code class="literal">INSERT</code>, <code class="literal">UPDATE</code>, and
          <code class="literal">REFERENCES</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">has_database_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>database</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for database? Allowable privilege types are
          <code class="literal">CREATE</code>, <code class="literal">CONNECT</code>,
          <code class="literal">TEMPORARY</code>, and <code class="literal">TEMP</code> (which is
          equivalent to <code class="literal">TEMPORARY</code>).
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">has_foreign_data_wrapper_privilege</code> ( [<span
            class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>fdw</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for foreign-data wrapper? The only allowable privilege type is
          <code class="literal">USAGE</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">has_function_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>function</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for function? The only allowable privilege type is
          <code class="literal">EXECUTE</code>.
        </div>
        <div>
          When specifying a function by name rather than by OID, the allowed input is the same as
          for the <code class="type">regprocedure</code> data type (see
          <a class="xref" href="datatype-oid.html" title="8.19. Object Identifier Types">Section 8.19</a>). An example is:
        </div>
        <pre class="programlisting">
SELECT has_function_privilege('joeuser', 'myfunc(int, text)', 'execute');
</pre>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">has_language_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>language</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for language? The only allowable privilege type is
          <code class="literal">USAGE</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">has_parameter_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>parameter</code></em> <code class="type">text</code>,
          <em class="parameter"><code>privilege</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for configuration parameter? The parameter name is
          case-insensitive. Allowable privilege types are <code class="literal">SET</code> and
          <code class="literal">ALTER SYSTEM</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">has_schema_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>schema</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for schema? Allowable privilege types are
          <code class="literal">CREATE</code> and <code class="literal">USAGE</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">has_sequence_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>sequence</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for sequence? Allowable privilege types are
          <code class="literal">USAGE</code>, <code class="literal">SELECT</code>, and
          <code class="literal">UPDATE</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">has_server_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>server</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for foreign server? The only allowable privilege type is
          <code class="literal">USAGE</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">has_table_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>table</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for table? Allowable privilege types are
          <code class="literal">SELECT</code>, <code class="literal">INSERT</code>,
          <code class="literal">UPDATE</code>, <code class="literal">DELETE</code>,
          <code class="literal">TRUNCATE</code>, <code class="literal">REFERENCES</code>, and
          <code class="literal">TRIGGER</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">has_tablespace_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>tablespace</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for tablespace? The only allowable privilege type is
          <code class="literal">CREATE</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">has_type_privilege</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>type</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for data type? The only allowable privilege type is
          <code class="literal">USAGE</code>. When specifying a type by name rather than by OID, the
          allowed input is the same as for the <code class="type">regtype</code> data type (see
          <a class="xref" href="datatype-oid.html" title="8.19. Object Identifier Types"
            >Section 8.19</a>).
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.14.1.1.1" class="indexterm"></a>
          <code class="function">pg_has_role</code> ( [<span class="optional">
            <em class="parameter"><code>user</code></em> <code class="type">name</code> or
            <code class="type">oid</code>, </span>] <em class="parameter"><code>role</code></em> <code class="type">text</code> or
          <code class="type">oid</code>, <em class="parameter"><code>privilege</code></em>
          <code class="type">text</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does user have privilege for role? Allowable privilege types are
          <code class="literal">MEMBER</code>, <code class="literal">USAGE</code>, and
          <code class="literal">SET</code>. <code class="literal">MEMBER</code> denotes direct or
          indirect membership in the role without regard to what specific privileges may be
          conferred. <code class="literal">USAGE</code> denotes whether the privileges of the role
          are immediately available without doing <code class="command">SET ROLE</code>, while
          <code class="literal">SET</code> denotes whether it is possible to change to the role
          using the <code class="literal">SET ROLE</code> command. This function does not allow the
          special case of setting <em class="parameter"><code>user</code></em> to
          <code class="literal">public</code>, because the PUBLIC pseudo-role can never be a member
          of real roles.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.4.2.2.15.1.1.1" class="indexterm"></a>
          <code class="function">row_security_active</code> (
          <em class="parameter"><code>table</code></em> <code class="type">text</code> or
          <code class="type">oid</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Is row-level security active for the specified table in the context of the current user
          and current environment?
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[Table 9.69](functions-info#FUNCTIONS-ACLITEM-OP-TABLE) shows the operators available for the `aclitem` type, which is the catalog representation of access privileges. See [Section 5.7](ddl-priv) for information about how to read access privilege values.

[#id](#FUNCTIONS-ACLITEM-OP-TABLE)

**Table 9.69. `aclitem` Operators**

<figure class="table-wrapper">
<table class="table" summary="aclitem Operators" border="1">
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
          <a id="id-1.5.8.32.4.6.2.2.1.1.1.1" class="indexterm"></a>
          <code class="type">aclitem</code> <code class="literal">=</code>
          <code class="type">aclitem</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Are <code class="type">aclitem</code>s equal? (Notice that type
          <code class="type">aclitem</code> lacks the usual set of comparison operators; it has only
          equality. In turn, <code class="type">aclitem</code>
          arrays can only be compared for equality.)
        </div>
        <div>
          <code class="literal">'calvin=r*w/hobbes'::aclitem = 'calvin=r*w*/hobbes'::aclitem</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.6.2.2.2.1.1.1" class="indexterm"></a>
          <code class="type">aclitem[]</code> <code class="literal">@&gt;</code>
          <code class="type">aclitem</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Does array contain the specified privileges? (This is true if there is an array entry that
          matches the <code class="type">aclitem</code>'s grantee and grantor, and has at least the
          specified set of privileges.)
        </div>
        <div>
          <code class="literal">'\{calvin=r*w/hobbes,hobbes=r*w*/postgres}'::aclitem[] @&gt;
            'calvin=r*/hobbes'::aclitem</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="type">aclitem[]</code> <code class="literal">~</code>
          <code class="type">aclitem</code> → <code class="returnvalue">boolean</code>
        </div>
        <div>This is a deprecated alias for <code class="literal">@&gt;</code>.</div>
        <div>
          <code class="literal">'\{calvin=r*w/hobbes,hobbes=r*w*/postgres}'::aclitem[] ~
            'calvin=r*/hobbes'::aclitem</code>
          → <code class="returnvalue">t</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[Table 9.70](functions-info#FUNCTIONS-ACLITEM-FN-TABLE) shows some additional functions to manage the `aclitem` type.

[#id](#FUNCTIONS-ACLITEM-FN-TABLE)

**Table 9.70. `aclitem` Functions**

<figure class="table-wrapper">
<table class="table" summary="aclitem Functions" border="1">
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
          <a id="id-1.5.8.32.4.8.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">acldefault</code> ( <em class="parameter"><code>type</code></em>
          <code class="type">"char"</code>, <em class="parameter"><code>ownerId</code></em>
          <code class="type">oid</code> ) → <code class="returnvalue">aclitem[]</code>
        </div>
        <div>
          Constructs an <code class="type">aclitem</code> array holding the default access
          privileges for an object of type <em class="parameter"><code>type</code></em> belonging to
          the role with OID <em class="parameter"><code>ownerId</code></em>. This represents the access privileges that will be assumed when an object's ACL entry
          is null. (The default access privileges are described in
          <a class="xref" href="ddl-priv.html" title="5.7.&nbsp;Privileges">Section&nbsp;5.7</a>.)
          The <em class="parameter"><code>type</code></em> parameter must be one of 'c' for
          <code class="literal">COLUMN</code>, 'r' for <code class="literal">TABLE</code> and
          table-like objects, 's' for <code class="literal">SEQUENCE</code>, 'd' for
          <code class="literal">DATABASE</code>, 'f' for <code class="literal">FUNCTION</code> or
          <code class="literal">PROCEDURE</code>, 'l' for <code class="literal">LANGUAGE</code>, 'L'
          for <code class="literal">LARGE OBJECT</code>, 'n' for
          <code class="literal">SCHEMA</code>, 'p' for <code class="literal">PARAMETER</code>, 't'
          for <code class="literal">TABLESPACE</code>, 'F' for
          <code class="literal">FOREIGN DATA WRAPPER</code>, 'S' for
          <code class="literal">FOREIGN SERVER</code>, or 'T' for
          <code class="literal">TYPE</code> or <code class="literal">DOMAIN</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.8.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">aclexplode</code> ( <code class="type">aclitem[]</code> ) →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>grantor</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>grantee</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>privilege_type</code></em> <code class="type">text</code>,
          <em class="parameter"><code>is_grantable</code></em> <code class="type">boolean</code> )
        </div>
        <div>
          Returns the <code class="type">aclitem</code> array as a set of rows. If the grantee is
          the pseudo-role PUBLIC, it is represented by zero in the
          <em class="parameter"><code>grantee</code></em> column. Each granted privilege is
          represented as <code class="literal">SELECT</code>, <code class="literal">INSERT</code>,
          etc (see
          <a
            class="xref"
            href="ddl-priv.html#PRIVILEGE-ABBREVS-TABLE"
            title="Table&nbsp;5.1.&nbsp;ACL Privilege Abbreviations">Table&nbsp;5.1</a>
          for a full list). Note that each privilege is broken out as a separate row, so only one
          keyword appears in the <em class="parameter"><code>privilege_type</code></em>
          column.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.4.8.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">makeaclitem</code> (
          <em class="parameter"><code>grantee</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>grantor</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>privileges</code></em> <code class="type">text</code>,
          <em class="parameter"><code>is_grantable</code></em> <code class="type">boolean</code> ) →
          <code class="returnvalue">aclitem</code>
        </div>
        <div>
          Constructs an <code class="type">aclitem</code> with the given properties.
          <em class="parameter"><code>privileges</code></em> is a comma-separated list of privilege
          names such as <code class="literal">SELECT</code>, <code class="literal">INSERT</code>,
          etc, all of which are set in the result. (Case of the privilege string is not significant,
          and extra whitespace is allowed between but not within privilege names.)
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-INFO-SCHEMA)

### 9.26.3. Schema Visibility Inquiry Functions [#](#FUNCTIONS-INFO-SCHEMA)

[Table 9.71](functions-info#FUNCTIONS-INFO-SCHEMA-TABLE) shows functions that determine whether a certain object is _visible_ in the current schema search path. For example, a table is said to be visible if its containing schema is in the search path and no table of the same name appears earlier in the search path. This is equivalent to the statement that the table can be referenced by name without explicit schema qualification. Thus, to list the names of all visible tables:

```

SELECT relname FROM pg_class WHERE pg_table_is_visible(oid);

```

For functions and operators, an object in the search path is said to be visible if there is no object of the same name _and argument data type(s)_ earlier in the path. For operator classes and families, both the name and the associated index access method are considered.

[#id](#FUNCTIONS-INFO-SCHEMA-TABLE)

**Table 9.71. Schema Visibility Inquiry Functions**

<figure class="table-wrapper">
<table class="table" summary="Schema Visibility Inquiry Functions" border="1">
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
          <a id="id-1.5.8.32.5.4.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_collation_is_visible</code> (
          <em class="parameter"><code>collation</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is collation visible in search path?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_conversion_is_visible</code> (
          <em class="parameter"><code>conversion</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is conversion visible in search path?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_function_is_visible</code> (
          <em class="parameter"><code>function</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is function visible in search path? (This also works for procedures and aggregates.)</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_opclass_is_visible</code> (
          <em class="parameter"><code>opclass</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is operator class visible in search path?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_operator_is_visible</code> (
          <em class="parameter"><code>operator</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is operator visible in search path?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">pg_opfamily_is_visible</code> (
          <em class="parameter"><code>opclass</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is operator family visible in search path?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">pg_statistics_obj_is_visible</code> (
          <em class="parameter"><code>stat</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is statistics object visible in search path?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">pg_table_is_visible</code> (
          <em class="parameter"><code>table</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Is table visible in search path? (This works for all types of relations, including views,
          materialized views, indexes, sequences and foreign tables.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">pg_ts_config_is_visible</code> (
          <em class="parameter"><code>config</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is text search configuration visible in search path?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">pg_ts_dict_is_visible</code> (
          <em class="parameter"><code>dict</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is text search dictionary visible in search path?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">pg_ts_parser_is_visible</code> (
          <em class="parameter"><code>parser</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is text search parser visible in search path?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">pg_ts_template_is_visible</code> (
          <em class="parameter"><code>template</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is text search template visible in search path?</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.5.4.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">pg_type_is_visible</code> (
          <em class="parameter"><code>type</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Is type (or domain) visible in search path?</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

All these functions require object OIDs to identify the object to be checked. If you want to test an object by name, it is convenient to use the OID alias types (`regclass`, `regtype`, `regprocedure`, `regoperator`, `regconfig`, or `regdictionary`), for example:

```

SELECT pg_type_is_visible('myschema.widget'::regtype);

```

Note that it would not make much sense to test a non-schema-qualified type name in this way — if the name can be recognized at all, it must be visible.

[#id](#FUNCTIONS-INFO-CATALOG)

### 9.26.4. System Catalog Information Functions [#](#FUNCTIONS-INFO-CATALOG)

[Table 9.72](functions-info#FUNCTIONS-INFO-CATALOG-TABLE) lists functions that extract information from the system catalogs.

[#id](#FUNCTIONS-INFO-CATALOG-TABLE)

**Table 9.72. System Catalog Information Functions**

<figure class="table-wrapper">
<table class="table" summary="System Catalog Information Functions" border="1">
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
          <a id="id-1.5.8.32.6.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">format_type</code> ( <em class="parameter"><code>type</code></em>
          <code class="type">oid</code>, <em class="parameter"><code>typemod</code></em>
          <code class="type">integer</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the SQL name for a data type that is identified by its type OID and possibly a
          type modifier. Pass NULL for the type modifier if no specific modifier is known.
        </div>
      </td>
    </tr>
    <tr>
      <td id="PG-CHAR-TO-ENCODING" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_char_to_encoding</code> (
          <em class="parameter"><code>encoding</code></em> <code class="type">name</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Converts the supplied encoding name into an integer representing the internal identifier
          used in some system catalog tables. Returns <code class="literal">-1</code> if an unknown
          encoding name is provided.
        </div>
      </td>
    </tr>
    <tr>
      <td id="PG-ENCODING-TO-CHAR" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_encoding_to_char</code> (
          <em class="parameter"><code>encoding</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">name</code>
        </div>
        <div>
          Converts the integer used as the internal identifier of an encoding in some system catalog
          tables into a human-readable string. Returns an empty string if an invalid encoding number
          is provided.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_catalog_foreign_keys</code> () →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>fktable</code></em> <code class="type">regclass</code>,
          <em class="parameter"><code>fkcols</code></em> <code class="type">text[]</code>,
          <em class="parameter"><code>pktable</code></em> <code class="type">regclass</code>,
          <em class="parameter"><code>pkcols</code></em> <code class="type">text[]</code>,
          <em class="parameter"><code>is_array</code></em> <code class="type">boolean</code>,
          <em class="parameter"><code>is_opt</code></em> <code class="type">boolean</code> )
        </div>
        <div>
          Returns a set of records describing the foreign key relationships that exist within the
          <span class="productname">PostgreSQL</span> system catalogs. The
          <em class="parameter"><code>fktable</code></em> column contains the name of the
          referencing catalog, and the <em class="parameter"><code>fkcols</code></em> column
          contains the name(s) of the referencing column(s). Similarly, the
          <em class="parameter"><code>pktable</code></em> column contains the name of the referenced
          catalog, and the <em class="parameter"><code>pkcols</code></em> column contains the
          name(s) of the referenced column(s). If
          <em class="parameter"><code>is_array</code></em> is true, the last referencing column is
          an array, each of whose elements should match some entry in the referenced catalog. If
          <em class="parameter"><code>is_opt</code></em> is true, the referencing column(s) are
          allowed to contain zeroes instead of a valid reference.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_constraintdef</code> (
          <em class="parameter"><code>constraint</code></em> <code class="type">oid</code> [<span
            class="optional">, <em class="parameter"><code>pretty</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the creating command for a constraint. (This is a decompiled reconstruction,
          not the original text of the command.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_expr</code> ( <em class="parameter"><code>expr</code></em>
          <code class="type">pg_node_tree</code>, <em class="parameter"><code>relation</code></em>
          <code class="type">oid</code> [<span class="optional">, <em class="parameter"><code>pretty</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Decompiles the internal form of an expression stored in the system catalogs, such as the
          default value for a column. If the expression might contain Vars, specify the OID of the
          relation they refer to as the second parameter; if no Vars are expected, passing zero is
          sufficient.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_functiondef</code> (
          <em class="parameter"><code>func</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the creating command for a function or procedure. (This is a decompiled
          reconstruction, not the original text of the command.) The result is a complete
          <code class="command">CREATE OR REPLACE FUNCTION</code> or
          <code class="command">CREATE OR REPLACE PROCEDURE</code> statement.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_function_arguments</code> (
          <em class="parameter"><code>func</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the argument list of a function or procedure, in the form it would need to
          appear in within <code class="command">CREATE FUNCTION</code>
          (including default values).
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_function_identity_arguments</code> (
          <em class="parameter"><code>func</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the argument list necessary to identify a function or procedure, in the form
          it would need to appear in within commands such as
          <code class="command">ALTER FUNCTION</code>. This form omits default values.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_function_result</code> (
          <em class="parameter"><code>func</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the <code class="literal">RETURNS</code> clause of a function, in the form it
          would need to appear in within <code class="command">CREATE FUNCTION</code>. Returns
          <code class="literal">NULL</code> for a procedure.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_indexdef</code> (
          <em class="parameter"><code>index</code></em> <code class="type">oid</code> [<span
            class="optional">, <em class="parameter"><code>column</code></em> <code class="type">integer</code>,
            <em class="parameter"><code>pretty</code></em> <code class="type">boolean</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the creating command for an index. (This is a decompiled reconstruction, not
          the original text of the command.) If <em class="parameter"><code>column</code></em> is
          supplied and is not zero, only the definition of that column is reconstructed.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_keywords</code> () →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>word</code></em> <code class="type">text</code>,
          <em class="parameter"><code>catcode</code></em> <code class="type">"char"</code>,
          <em class="parameter"><code>barelabel</code></em> <code class="type">boolean</code>,
          <em class="parameter"><code>catdesc</code></em> <code class="type">text</code>,
          <em class="parameter"><code>baredesc</code></em> <code class="type">text</code> )
        </div>
        <div>
          Returns a set of records describing the SQL keywords recognized by the server. The
          <em class="parameter"><code>word</code></em> column contains the keyword. The
          <em class="parameter"><code>catcode</code></em> column contains a category code:
          <code class="literal">U</code> for an unreserved keyword,
          <code class="literal">C</code> for a keyword that can be a column name,
          <code class="literal">T</code> for a keyword that can be a type or function name, or
          <code class="literal">R</code> for a fully reserved keyword. The
          <em class="parameter"><code>barelabel</code></em> column contains
          <code class="literal">true</code> if the keyword can be used as a
          <span class="quote">“<span class="quote">bare</span>”</span> column label in
          <code class="command">SELECT</code> lists, or <code class="literal">false</code> if it can
          only be used after <code class="literal">AS</code>. The
          <em class="parameter"><code>catdesc</code></em> column contains a possibly-localized
          string describing the keyword's category. The
          <em class="parameter"><code>baredesc</code></em> column contains a possibly-localized
          string describing the keyword's column label status.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_partkeydef</code> (
          <em class="parameter"><code>table</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the definition of a partitioned table's partition key, in the form it would
          have in the <code class="literal">PARTITION BY</code> clause of
          <code class="command">CREATE TABLE</code>. (This is a decompiled reconstruction, not the
          original text of the command.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.14.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_ruledef</code> (
          <em class="parameter"><code>rule</code></em> <code class="type">oid</code> [<span
            class="optional">, <em class="parameter"><code>pretty</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the creating command for a rule. (This is a decompiled reconstruction, not
          the original text of the command.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.15.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_serial_sequence</code> (
          <em class="parameter"><code>table</code></em> <code class="type">text</code>,
          <em class="parameter"><code>column</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the name of the sequence associated with a column, or NULL if no sequence is
          associated with the column. If the column is an identity column, the associated sequence
          is the sequence internally created for that column. For columns created using one of the
          serial types (<code class="type">serial</code>, <code class="type">smallserial</code>,
          <code class="type">bigserial</code>), it is the sequence created for that serial column
          definition. In the latter case, the association can be modified or removed with
          <code class="command">ALTER SEQUENCE OWNED BY</code>. (This function probably should have
          been called <code class="function">pg_get_owned_sequence</code>; its current name reflects
          the fact that it has historically been used with serial-type columns.) The first parameter
          is a table name with optional schema, and the second parameter is a column name. Because
          the first parameter potentially contains both schema and table names, it is parsed per
          usual SQL rules, meaning it is lower-cased by default. The second parameter, being just a
          column name, is treated literally and so has its case preserved. The result is suitably
          formatted for passing to the sequence functions (see
          <a
            class="xref"
            href="functions-sequence.html"
            title="9.17.&nbsp;Sequence Manipulation Functions">Section&nbsp;9.17</a>).
        </div>
        <div>
          A typical use is in reading the current value of the sequence for an identity or serial
          column, for example:
        </div>
        <pre class="programlisting">
SELECT currval(pg_get_serial_sequence('sometable', 'id'));
</pre>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.16.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_statisticsobjdef</code> (
          <em class="parameter"><code>statobj</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the creating command for an extended statistics object. (This is a decompiled
          reconstruction, not the original text of the command.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.17.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_triggerdef</code> (
          <em class="parameter"><code>trigger</code></em> <code class="type">oid</code> [<span
            class="optional">, <em class="parameter"><code>pretty</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the creating command for a trigger. (This is a decompiled reconstruction, not
          the original text of the command.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.18.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_userbyid</code> (
          <em class="parameter"><code>role</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">name</code>
        </div>
        <div>Returns a role's name given its OID.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.19.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_viewdef</code> (
          <em class="parameter"><code>view</code></em> <code class="type">oid</code> [<span
            class="optional">, <em class="parameter"><code>pretty</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the underlying <code class="command">SELECT</code> command for a view or
          materialized view. (This is a decompiled reconstruction, not the original text of the
          command.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">pg_get_viewdef</code> (
          <em class="parameter"><code>view</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>wrap_column</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the underlying <code class="command">SELECT</code> command for a view or
          materialized view. (This is a decompiled reconstruction, not the original text of the
          command.) In this form of the function, pretty-printing is always enabled, and long lines
          are wrapped to try to keep them shorter than the specified number of columns.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">pg_get_viewdef</code> (
          <em class="parameter"><code>view</code></em> <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>pretty</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Reconstructs the underlying <code class="command">SELECT</code> command for a view or
          materialized view, working from a textual name for the view rather than its OID. (This is
          deprecated; use the OID variant instead.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.22.1.1.1" class="indexterm"></a>
          <code class="function">pg_index_column_has_property</code> (
          <em class="parameter"><code>index</code></em> <code class="type">regclass</code>,
          <em class="parameter"><code>column</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>property</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Tests whether an index column has the named property. Common index column properties are
          listed in
          <a
            class="xref"
            href="functions-info.html#FUNCTIONS-INFO-INDEX-COLUMN-PROPS"
            title="Table&nbsp;9.73.&nbsp;Index Column Properties"
            >Table&nbsp;9.73</a>. (Note that extension access methods can define additional property names for their
          indexes.) <code class="literal">NULL</code> is returned if the property name is not known
          or does not apply to the particular object, or if the OID or column number does not
          identify a valid object.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.23.1.1.1" class="indexterm"></a>
          <code class="function">pg_index_has_property</code> (
          <em class="parameter"><code>index</code></em> <code class="type">regclass</code>,
          <em class="parameter"><code>property</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Tests whether an index has the named property. Common index properties are listed in
          <a
            class="xref"
            href="functions-info.html#FUNCTIONS-INFO-INDEX-PROPS"
            title="Table&nbsp;9.74.&nbsp;Index Properties"
            >Table&nbsp;9.74</a>. (Note that extension access methods can define additional property names for their
          indexes.) <code class="literal">NULL</code> is returned if the property name is not known
          or does not apply to the particular object, or if the OID does not identify a valid
          object.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.24.1.1.1" class="indexterm"></a>
          <code class="function">pg_indexam_has_property</code> (
          <em class="parameter"><code>am</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>property</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Tests whether an index access method has the named property. Access method properties are
          listed in
          <a
            class="xref"
            href="functions-info.html#FUNCTIONS-INFO-INDEXAM-PROPS"
            title="Table&nbsp;9.75.&nbsp;Index Access Method Properties"
            >Table&nbsp;9.75</a>. <code class="literal">NULL</code> is returned if the property name is not known or does
          not apply to the particular object, or if the OID does not identify a valid object.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.25.1.1.1" class="indexterm"></a>
          <code class="function">pg_options_to_table</code> (
          <em class="parameter"><code>options_array</code></em> <code class="type">text[]</code> ) →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>option_name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>option_value</code></em> <code class="type">text</code> )
        </div>
        <div>
          Returns the set of storage options represented by a value from
          <code class="structname">pg_class</code>.<code class="structfield">reloptions</code> or
          <code class="structname">pg_attribute</code>.<code class="structfield">attoptions</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.26.1.1.1" class="indexterm"></a>
          <code class="function">pg_settings_get_flags</code> (
          <em class="parameter"><code>guc</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">text[]</code>
        </div>
        <div>
          Returns an array of the flags associated with the given GUC, or
          <code class="literal">NULL</code> if it does not exist. The result is an empty array if
          the GUC exists but there are no flags to show. Only the most useful flags listed in
          <a
            class="xref"
            href="functions-info.html#FUNCTIONS-PG-SETTINGS-FLAGS"
            title="Table&nbsp;9.76.&nbsp;GUC Flags"
            >Table&nbsp;9.76</a>
          are exposed.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.27.1.1.1" class="indexterm"></a>
          <code class="function">pg_tablespace_databases</code> (
          <em class="parameter"><code>tablespace</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">setof oid</code>
        </div>
        <div>
          Returns the set of OIDs of databases that have objects stored in the specified tablespace.
          If this function returns any rows, the tablespace is not empty and cannot be dropped. To
          identify the specific objects populating the tablespace, you will need to connect to the
          database(s) identified by <code class="function">pg_tablespace_databases</code> and query
          their <code class="structname">pg_class</code> catalogs.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.28.1.1.1" class="indexterm"></a>
          <code class="function">pg_tablespace_location</code> (
          <em class="parameter"><code>tablespace</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>Returns the file system path that this tablespace is located in.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.29.1.1.1" class="indexterm"></a>
          <code class="function">pg_typeof</code> ( <code class="type">"any"</code> ) →
          <code class="returnvalue">regtype</code>
        </div>
        <div>
          Returns the OID of the data type of the value that is passed to it. This can be helpful
          for troubleshooting or dynamically constructing SQL queries. The function is declared as
          returning <code class="type">regtype</code>, which is an OID alias type (see
          <a class="xref" href="datatype-oid.html" title="8.19.&nbsp;Object Identifier Types"
            >Section&nbsp;8.19</a>); this means that it is the same as an OID for comparison purposes but displays as a
          type name.
        </div>
        <div>For example:</div>
        <pre class="programlisting">
SELECT pg_typeof(33);
 pg_typeof
-----------
 integer

SELECT typlen FROM pg_type WHERE oid = pg_typeof(33);
typlen

---

      4

</pre>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.30.1.1.1" class="indexterm"></a>
          <code class="function">COLLATION FOR</code> ( <code class="type">"any"</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the name of the collation of the value that is passed to it. The value is quoted
          and schema-qualified if necessary. If no collation was derived for the argument
          expression, then <code class="literal">NULL</code> is returned. If the argument is not of
          a collatable data type, then an error is raised.
        </div>
        <div>For example:</div>
        <pre class="programlisting">
SELECT collation for (description) FROM pg_description LIMIT 1;
 pg_collation_for
------------------

"default"

SELECT collation for ('foo' COLLATE "de_DE");
pg_collation_for

---

"de_DE"

</pre>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.31.1.1.1" class="indexterm"></a>
          <code class="function">to_regclass</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">regclass</code>
        </div>
        <div>
          Translates a textual relation name to its OID. A similar result is obtained by casting the
          string to type <code class="type">regclass</code> (see
          <a class="xref" href="datatype-oid.html" title="8.19.&nbsp;Object Identifier Types">Section&nbsp;8.19</a>); however, this function will return <code class="literal">NULL</code> rather than
          throwing an error if the name is not found.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.32.1.1.1" class="indexterm"></a>
          <code class="function">to_regcollation</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">regcollation</code>
        </div>
        <div>
          Translates a textual collation name to its OID. A similar result is obtained by casting
          the string to type <code class="type">regcollation</code> (see
          <a class="xref" href="datatype-oid.html" title="8.19.&nbsp;Object Identifier Types"
            >Section&nbsp;8.19</a>); however, this function will return <code class="literal">NULL</code> rather than
          throwing an error if the name is not found.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.33.1.1.1" class="indexterm"></a>
          <code class="function">to_regnamespace</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">regnamespace</code>
        </div>
        <div>
          Translates a textual schema name to its OID. A similar result is obtained by casting the
          string to type <code class="type">regnamespace</code> (see
          <a class="xref" href="datatype-oid.html" title="8.19.&nbsp;Object Identifier Types">Section&nbsp;8.19</a>); however, this function will return <code class="literal">NULL</code> rather than
          throwing an error if the name is not found.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.34.1.1.1" class="indexterm"></a>
          <code class="function">to_regoper</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">regoper</code>
        </div>
        <div>
          Translates a textual operator name to its OID. A similar result is obtained by casting the
          string to type <code class="type">regoper</code> (see
          <a class="xref" href="datatype-oid.html" title="8.19.&nbsp;Object Identifier Types">Section&nbsp;8.19</a>); however, this function will return <code class="literal">NULL</code> rather than
          throwing an error if the name is not found or is ambiguous.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.35.1.1.1" class="indexterm"></a>
          <code class="function">to_regoperator</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">regoperator</code>
        </div>
        <div>
          Translates a textual operator name (with parameter types) to its OID. A similar result is
          obtained by casting the string to type <code class="type">regoperator</code> (see
          <a class="xref" href="datatype-oid.html" title="8.19.&nbsp;Object Identifier Types"
            >Section&nbsp;8.19</a>); however, this function will return <code class="literal">NULL</code> rather than
          throwing an error if the name is not found.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.36.1.1.1" class="indexterm"></a>
          <code class="function">to_regproc</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">regproc</code>
        </div>
        <div>
          Translates a textual function or procedure name to its OID. A similar result is obtained
          by casting the string to type <code class="type">regproc</code> (see
          <a class="xref" href="datatype-oid.html" title="8.19.&nbsp;Object Identifier Types">Section&nbsp;8.19</a>); however, this function will return <code class="literal">NULL</code> rather than
          throwing an error if the name is not found or is ambiguous.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.37.1.1.1" class="indexterm"></a>
          <code class="function">to_regprocedure</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">regprocedure</code>
        </div>
        <div>
          Translates a textual function or procedure name (with argument types) to its OID. A
          similar result is obtained by casting the string to type
          <code class="type">regprocedure</code> (see
          <a class="xref" href="datatype-oid.html" title="8.19.&nbsp;Object Identifier Types">Section&nbsp;8.19</a>); however, this function will return <code class="literal">NULL</code> rather than
          throwing an error if the name is not found.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.38.1.1.1" class="indexterm"></a>
          <code class="function">to_regrole</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">regrole</code>
        </div>
        <div>
          Translates a textual role name to its OID. A similar result is obtained by casting the
          string to type <code class="type">regrole</code> (see
          <a class="xref" href="datatype-oid.html" title="8.19.&nbsp;Object Identifier Types">Section&nbsp;8.19</a>); however, this function will return <code class="literal">NULL</code> rather than
          throwing an error if the name is not found.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.6.3.2.2.39.1.1.1" class="indexterm"></a>
          <code class="function">to_regtype</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">regtype</code>
        </div>
        <div>
          Translates a textual type name to its OID. A similar result is obtained by casting the
          string to type <code class="type">regtype</code> (see
          <a class="xref" href="datatype-oid.html" title="8.19.&nbsp;Object Identifier Types">Section&nbsp;8.19</a>); however, this function will return <code class="literal">NULL</code> rather than
          throwing an error if the name is not found.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

Most of the functions that reconstruct (decompile) database objects have an optional _`pretty`_ flag, which if `true` causes the result to be “pretty-printed”. Pretty-printing suppresses unnecessary parentheses and adds whitespace for legibility. The pretty-printed format is more readable, but the default format is more likely to be interpreted the same way by future versions of PostgreSQL; so avoid using pretty-printed output for dump purposes. Passing `false` for the _`pretty`_ parameter yields the same result as omitting the parameter.

[#id](#FUNCTIONS-INFO-INDEX-COLUMN-PROPS)

**Table 9.73. Index Column Properties**

| Name                 | Description                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `asc`                | Does the column sort in ascending order on a forward scan?                                             |
| `desc`               | Does the column sort in descending order on a forward scan?                                            |
| `nulls_first`        | Does the column sort with nulls first on a forward scan?                                               |
| `nulls_last`         | Does the column sort with nulls last on a forward scan?                                                |
| `orderable`          | Does the column possess any defined sort ordering?                                                     |
| `distance_orderable` | Can the column be scanned in order by a “distance” operator, for example `ORDER BY col <-> constant` ? |
| `returnable`         | Can the column value be returned by an index-only scan?                                                |
| `search_array`       | Does the column natively support `col = ANY(array)` searches?                                          |
| `search_nulls`       | Does the column support `IS NULL` and `IS NOT NULL` searches?                                          |

[#id](#FUNCTIONS-INFO-INDEX-PROPS)

**Table 9.74. Index Properties**

| Name            | Description                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `clusterable`   | Can the index be used in a `CLUSTER` command?                                                                            |
| `index_scan`    | Does the index support plain (non-bitmap) scans?                                                                         |
| `bitmap_scan`   | Does the index support bitmap scans?                                                                                     |
| `backward_scan` | Can the scan direction be changed in mid-scan (to support `FETCH BACKWARD` on a cursor without needing materialization)? |

[#id](#FUNCTIONS-INFO-INDEXAM-PROPS)

**Table 9.75. Index Access Method Properties**

| Name            | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| `can_order`     | Does the access method support `ASC`, `DESC` and related keywords in `CREATE INDEX`? |
| `can_unique`    | Does the access method support unique indexes?                                       |
| `can_multi_col` | Does the access method support indexes with multiple columns?                        |
| `can_exclude`   | Does the access method support exclusion constraints?                                |
| `can_include`   | Does the access method support the `INCLUDE` clause of `CREATE INDEX`?               |

[#id](#FUNCTIONS-PG-SETTINGS-FLAGS)

**Table 9.76. GUC Flags**

| Flag               | Description                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `EXPLAIN`          | Parameters with this flag are included in `EXPLAIN (SETTINGS)` commands.    |
| `NO_SHOW_ALL`      | Parameters with this flag are excluded from `SHOW ALL` commands.            |
| `NO_RESET`         | Parameters with this flag do not support `RESET` commands.                  |
| `NO_RESET_ALL`     | Parameters with this flag are excluded from `RESET ALL` commands.           |
| `NOT_IN_SAMPLE`    | Parameters with this flag are not included in `postgresql.conf` by default. |
| `RUNTIME_COMPUTED` | Parameters with this flag are runtime-computed ones.                        |

[#id](#FUNCTIONS-INFO-OBJECT)

### 9.26.5. Object Information and Addressing Functions [#](#FUNCTIONS-INFO-OBJECT)

[Table 9.77](functions-info#FUNCTIONS-INFO-OBJECT-TABLE) lists functions related to database object identification and addressing.

[#id](#FUNCTIONS-INFO-OBJECT-TABLE)

**Table 9.77. Object Information and Addressing Functions**

<figure class="table-wrapper">
<table class="table" summary="Object Information and Addressing Functions" border="1">
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
          <a id="id-1.5.8.32.7.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_describe_object</code> (
          <em class="parameter"><code>classid</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>objid</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>objsubid</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns a textual description of a database object identified by catalog OID, object OID,
          and sub-object ID (such as a column number within a table; the sub-object ID is zero when
          referring to a whole object). This description is intended to be human-readable, and might
          be translated, depending on server configuration. This is especially useful to determine
          the identity of an object referenced in the
          <code class="structname">pg_depend</code> catalog. This function returns
          <code class="literal">NULL</code> values for undefined objects.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.7.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_identify_object</code> (
          <em class="parameter"><code>classid</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>objid</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>objsubid</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">record</code> ( <em class="parameter"><code>type</code></em>
          <code class="type">text</code>, <em class="parameter"><code>schema</code></em>
          <code class="type">text</code>, <em class="parameter"><code>name</code></em>
          <code class="type">text</code>, <em class="parameter"><code>identity</code></em>
          <code class="type">text</code> )
        </div>
        <div>
          Returns a row containing enough information to uniquely identify the database object
          specified by catalog OID, object OID and sub-object ID. This information is intended to be
          machine-readable, and is never translated.
          <em class="parameter"><code>type</code></em> identifies the type of database object;
          <em class="parameter"><code>schema</code></em> is the schema name that the object belongs
          in, or <code class="literal">NULL</code> for object types that do not belong to schemas;
          <em class="parameter"><code>name</code></em> is the name of the object, quoted if
          necessary, if the name (along with schema name, if pertinent) is sufficient to uniquely
          identify the object, otherwise <code class="literal">NULL</code>;
          <em class="parameter"><code>identity</code></em> is the complete object identity, with the
          precise format depending on object type, and each name within the format being
          schema-qualified and quoted as necessary. Undefined objects are identified with
          <code class="literal">NULL</code> values.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.7.3.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_identify_object_as_address</code> (
          <em class="parameter"><code>classid</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>objid</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>objsubid</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">record</code> ( <em class="parameter"><code>type</code></em>
          <code class="type">text</code>, <em class="parameter"><code>object_names</code></em>
          <code class="type">text[]</code>, <em class="parameter"><code>object_args</code></em>
          <code class="type">text[]</code> )
        </div>
        <div>
          Returns a row containing enough information to uniquely identify the database object
          specified by catalog OID, object OID and sub-object ID. The returned information is
          independent of the current server, that is, it could be used to identify an identically
          named object in another server.
          <em class="parameter"><code>type</code></em> identifies the type of database object;
          <em class="parameter"><code>object_names</code></em> and
          <em class="parameter"><code>object_args</code></em>
          are text arrays that together form a reference to the object. These three values can be
          passed to <code class="function">pg_get_object_address</code> to obtain the internal
          address of the object.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.7.3.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_object_address</code> (
          <em class="parameter"><code>type</code></em> <code class="type">text</code>,
          <em class="parameter"><code>object_names</code></em> <code class="type">text[]</code>,
          <em class="parameter"><code>object_args</code></em> <code class="type">text[]</code> ) →
          <code class="returnvalue">record</code> ( <em class="parameter"><code>classid</code></em>
          <code class="type">oid</code>, <em class="parameter"><code>objid</code></em>
          <code class="type">oid</code>, <em class="parameter"><code>objsubid</code></em>
          <code class="type">integer</code> )
        </div>
        <div>
          Returns a row containing enough information to uniquely identify the database object
          specified by a type code and object name and argument arrays. The returned values are the
          ones that would be used in system catalogs such as
          <code class="structname">pg_depend</code>; they can be passed to other system functions
          such as <code class="function">pg_describe_object</code> or
          <code class="function">pg_identify_object</code>.
          <em class="parameter"><code>classid</code></em> is the OID of the system catalog
          containing the object; <em class="parameter"><code>objid</code></em> is the OID of the
          object itself, and <em class="parameter"><code>objsubid</code></em> is the sub-object ID,
          or zero if none. This function is the inverse of
          <code class="function">pg_identify_object_as_address</code>. Undefined objects are
          identified with <code class="literal">NULL</code> values.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-INFO-COMMENT)

### 9.26.6. Comment Information Functions [#](#FUNCTIONS-INFO-COMMENT)

The functions shown in [Table 9.78](functions-info#FUNCTIONS-INFO-COMMENT-TABLE) extract comments previously stored with the [COMMENT](sql-comment) command. A null value is returned if no comment could be found for the specified parameters.

[#id](#FUNCTIONS-INFO-COMMENT-TABLE)

**Table 9.78. Comment Information Functions**

<figure class="table-wrapper">
<table class="table" summary="Comment Information Functions" border="1">
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
          <a id="id-1.5.8.32.8.4.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">col_description</code> (
          <em class="parameter"><code>table</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>column</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the comment for a table column, which is specified by the OID of its table and its
          column number. (<code class="function">obj_description</code> cannot be used for table
          columns, since columns do not have OIDs of their own.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.8.4.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">obj_description</code> (
          <em class="parameter"><code>object</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>catalog</code></em> <code class="type">name</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the comment for a database object specified by its OID and the name of the
          containing system catalog. For example,
          <code class="literal">obj_description(123456, 'pg_class')</code> would retrieve the
          comment for the table with OID 123456.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">obj_description</code> (
          <em class="parameter"><code>object</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the comment for a database object specified by its OID alone. This is
          <span class="emphasis"><em>deprecated</em></span> since there is no guarantee that OIDs
          are unique across different system catalogs; therefore, the wrong comment might be
          returned.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.8.4.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">shobj_description</code> (
          <em class="parameter"><code>object</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>catalog</code></em> <code class="type">name</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the comment for a shared database object specified by its OID and the name of the
          containing system catalog. This is just like
          <code class="function">obj_description</code> except that it is used for retrieving
          comments on shared objects (that is, databases, roles, and tablespaces). Some system
          catalogs are global to all databases within each cluster, and the descriptions for objects
          in them are stored globally as well.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-INFO-VALIDITY)

### 9.26.7. Data Validity Checking Functions [#](#FUNCTIONS-INFO-VALIDITY)

The functions shown in [Table 9.79](functions-info#FUNCTIONS-INFO-VALIDITY-TABLE) can be helpful for checking validity of proposed input data.

[#id](#FUNCTIONS-INFO-VALIDITY-TABLE)

**Table 9.79. Data Validity Checking Functions**

<figure class="table-wrapper">
<table class="table" summary="Data Validity Checking Functions" border="1">
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
          <a id="id-1.5.8.32.9.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_input_is_valid</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>type</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Tests whether the given <em class="parameter"><code>string</code></em> is valid input for
          the specified data type, returning true or false.
        </div>
        <div>
          This function will only work as desired if the data type's input function has been updated
          to report invalid input as a
          <span class="quote">“<span class="quote">soft</span>”</span> error. Otherwise, invalid
          input will abort the transaction, just as if the string had been cast to the type
          directly.
        </div>
        <div>
          <code class="literal">pg_input_is_valid('42', 'integer')</code>
          → <code class="returnvalue">t</code>
        </div>
        <div>
          <code class="literal">pg_input_is_valid('42000000000', 'integer')</code>
          → <code class="returnvalue">f</code>
        </div>
        <div>
          <code class="literal">pg_input_is_valid('1234.567', 'numeric(7,4)')</code>
          → <code class="returnvalue">f</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.9.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_input_error_info</code> (
          <em class="parameter"><code>string</code></em> <code class="type">text</code>,
          <em class="parameter"><code>type</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">record</code> ( <em class="parameter"><code>message</code></em>
          <code class="type">text</code>, <em class="parameter"><code>detail</code></em>
          <code class="type">text</code>, <em class="parameter"><code>hint</code></em>
          <code class="type">text</code>, <em class="parameter"><code>sql_error_code</code></em>
          <code class="type">text</code> )
        </div>
        <div>
          Tests whether the given <em class="parameter"><code>string</code></em> is valid input for
          the specified data type; if not, return the details of the error that would have been
          thrown. If the input is valid, the results are NULL. The inputs are the same as for
          <code class="function">pg_input_is_valid</code>.
        </div>
        <div>
          This function will only work as desired if the data type's input function has been updated
          to report invalid input as a
          <span class="quote">“<span class="quote">soft</span>”</span> error. Otherwise, invalid
          input will abort the transaction, just as if the string had been cast to the type
          directly.
        </div>
        <div>
          <code class="literal">select * from pg_input_error_info('42000000000', 'integer')</code>
          → <code class="returnvalue"></code>
        </div>
        <pre class="programlisting">
                       message                        | detail | hint | sql_error_code
------------------------------------------------------+--------+------+----------------
 value "42000000000" is out of range for type integer |        |      | 22003
</pre>
        <div></div>
        <div>
          <code class="literal">select message, detail from pg_input_error_info('1234.567', 'numeric(7,4)')</code>
          → <code class="returnvalue"></code>
        </div>
        <pre class="programlisting">
        message         |                                      detail
------------------------+----------------------------------&ZeroWidthSpace;-------------------------------------------------
 numeric field overflow | A field with precision 7, scale 4 must round to an absolute value less than 10^3.
</pre>
        <div></div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-INFO-SNAPSHOT)

### 9.26.8. Transaction ID and Snapshot Information Functions [#](#FUNCTIONS-INFO-SNAPSHOT)

The functions shown in [Table 9.80](functions-info#FUNCTIONS-PG-SNAPSHOT) provide server transaction information in an exportable form. The main use of these functions is to determine which transactions were committed between two snapshots.

[#id](#FUNCTIONS-PG-SNAPSHOT)

**Table 9.80. Transaction ID and Snapshot Information Functions**

<figure class="table-wrapper">
<table class="table" summary="Transaction ID and Snapshot Information Functions" border="1">
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
          <a id="id-1.5.8.32.10.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_current_xact_id</code> () →
          <code class="returnvalue">xid8</code>
        </div>
        <div>
          Returns the current transaction's ID. It will assign a new one if the current transaction
          does not have one already (because it has not performed any database updates); see
          <a class="xref" href="transaction-id.html" title="74.1.&nbsp;Transactions and Identifiers">Section&nbsp;74.1</a>
          for details. If executed in a subtransaction, this will return the top-level transaction
          ID; see
          <a class="xref" href="subxacts.html" title="74.3.&nbsp;Subtransactions">Section&nbsp;74.3</a>
          for details.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_current_xact_id_if_assigned</code> () →
          <code class="returnvalue">xid8</code>
        </div>
        <div>
          Returns the current transaction's ID, or <code class="literal">NULL</code> if no ID is
          assigned yet. (It's best to use this variant if the transaction might otherwise be
          read-only, to avoid unnecessary consumption of an XID.) If executed in a subtransaction,
          this will return the top-level transaction ID.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.3.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_xact_status</code> ( <code class="type">xid8</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Reports the commit status of a recent transaction. The result is one of
          <code class="literal">in progress</code>, <code class="literal">committed</code>, or
          <code class="literal">aborted</code>, provided that the transaction is recent enough that
          the system retains the commit status of that transaction. If it is old enough that no
          references to the transaction survive in the system and the commit status information has
          been discarded, the result is <code class="literal">NULL</code>. Applications might use
          this function, for example, to determine whether their transaction committed or aborted
          after the application and database server become disconnected while a
          <code class="literal">COMMIT</code> is in progress. Note that prepared transactions are
          reported as <code class="literal">in progress</code>; applications must check
          <a class="link" href="view-pg-prepared-xacts.html" title="54.16.&nbsp;pg_prepared_xacts"><code class="structname">pg_prepared_xacts</code></a>
          if they need to determine whether a transaction ID belongs to a prepared transaction.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.3.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_current_snapshot</code> () →
          <code class="returnvalue">pg_snapshot</code>
        </div>
        <div>
          Returns a current <em class="firstterm">snapshot</em>, a data structure showing which
          transaction IDs are now in-progress. Only top-level transaction IDs are included in the
          snapshot; subtransaction IDs are not shown; see
          <a class="xref" href="subxacts.html" title="74.3.&nbsp;Subtransactions">Section&nbsp;74.3</a>
          for details.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.3.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_snapshot_xip</code> ( <code class="type">pg_snapshot</code> ) →
          <code class="returnvalue">setof xid8</code>
        </div>
        <div>Returns the set of in-progress transaction IDs contained in a snapshot.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.3.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">pg_snapshot_xmax</code> ( <code class="type">pg_snapshot</code> ) →
          <code class="returnvalue">xid8</code>
        </div>
        <div>Returns the <code class="structfield">xmax</code> of a snapshot.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.3.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">pg_snapshot_xmin</code> ( <code class="type">pg_snapshot</code> ) →
          <code class="returnvalue">xid8</code>
        </div>
        <div>Returns the <code class="structfield">xmin</code> of a snapshot.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.3.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">pg_visible_in_snapshot</code> ( <code class="type">xid8</code>,
          <code class="type">pg_snapshot</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Is the given transaction ID <em class="firstterm">visible</em> according to this snapshot
          (that is, was it completed before the snapshot was taken)? Note that this function will
          not give the correct answer for a subtransaction ID (subxid); see
          <a class="xref" href="subxacts.html" title="74.3.&nbsp;Subtransactions">Section&nbsp;74.3</a>
          for details.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

The internal transaction ID type `xid` is 32 bits wide and wraps around every 4 billion transactions. However, the functions shown in [Table 9.80](functions-info#FUNCTIONS-PG-SNAPSHOT) use a 64-bit type `xid8` that does not wrap around during the life of an installation and can be converted to `xid` by casting if required; see [Section 74.1](transaction-id) for details. The data type `pg_snapshot` stores information about transaction ID visibility at a particular moment in time. Its components are described in [Table 9.81](functions-info#FUNCTIONS-PG-SNAPSHOT-PARTS). `pg_snapshot`'s textual representation is `xmin:xmax:xip_list`. For example `10:20:10,14,15` means `xmin=10, xmax=20, xip_list=10, 14, 15`.

[#id](#FUNCTIONS-PG-SNAPSHOT-PARTS)

**Table 9.81. Snapshot Components**

| Name       | Description                                                                                                                                                                                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `xmin`     | Lowest transaction ID that was still active. All transaction IDs less than `xmin` are either committed and visible, or rolled back and dead.                                                                                                                                                                              |
| `xmax`     | One past the highest completed transaction ID. All transaction IDs greater than or equal to `xmax` had not yet completed as of the time of the snapshot, and thus are invisible.                                                                                                                                          |
| `xip_list` | Transactions in progress at the time of the snapshot. A transaction ID that is `xmin <= X < xmax` and not in this list was already completed at the time of the snapshot, and thus is either visible or dead according to its commit status. This list does not include the transaction IDs of subtransactions (subxids). |

In releases of PostgreSQL before 13 there was no `xid8` type, so variants of these functions were provided that used `bigint` to represent a 64-bit XID, with a correspondingly distinct snapshot data type `txid_snapshot`. These older functions have `txid` in their names. They are still supported for backward compatibility, but may be removed from a future release. See [Table 9.82](functions-info#FUNCTIONS-TXID-SNAPSHOT).

[#id](#FUNCTIONS-TXID-SNAPSHOT)

**Table 9.82. Deprecated Transaction ID and Snapshot Information Functions**

<figure class="table-wrapper">
<table
  class="table"
  summary="Deprecated Transaction ID and Snapshot Information Functions"
  border="1"
>
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
          <a id="id-1.5.8.32.10.7.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">txid_current</code> () → <code class="returnvalue">bigint</code>
        </div>
        <div>See <code class="function">pg_current_xact_id()</code>.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.7.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">txid_current_if_assigned</code> () →
          <code class="returnvalue">bigint</code>
        </div>
        <div>See <code class="function">pg_current_xact_id_if_assigned()</code>.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.7.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">txid_current_snapshot</code> () →
          <code class="returnvalue">txid_snapshot</code>
        </div>
        <div>See <code class="function">pg_current_snapshot()</code>.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.7.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">txid_snapshot_xip</code> (
          <code class="type">txid_snapshot</code> ) → <code class="returnvalue">setof bigint</code>
        </div>
        <div>See <code class="function">pg_snapshot_xip()</code>.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.7.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">txid_snapshot_xmax</code> (
          <code class="type">txid_snapshot</code> ) → <code class="returnvalue">bigint</code>
        </div>
        <div>See <code class="function">pg_snapshot_xmax()</code>.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.7.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">txid_snapshot_xmin</code> (
          <code class="type">txid_snapshot</code> ) → <code class="returnvalue">bigint</code>
        </div>
        <div>See <code class="function">pg_snapshot_xmin()</code>.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.7.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">txid_visible_in_snapshot</code> ( <code class="type">bigint</code>,
          <code class="type">txid_snapshot</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>See <code class="function">pg_visible_in_snapshot()</code>.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.10.7.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">txid_status</code> ( <code class="type">bigint</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>See <code class="function">pg_xact_status()</code>.</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-INFO-COMMIT-TIMESTAMP)

### 9.26.9. Committed Transaction Information Functions [#](#FUNCTIONS-INFO-COMMIT-TIMESTAMP)

The functions shown in [Table 9.83](functions-info#FUNCTIONS-COMMIT-TIMESTAMP) provide information about when past transactions were committed. They only provide useful data when the [track_commit_timestamp](runtime-config-replication#GUC-TRACK-COMMIT-TIMESTAMP) configuration option is enabled, and only for transactions that were committed after it was enabled.

[#id](#FUNCTIONS-COMMIT-TIMESTAMP)

**Table 9.83. Committed Transaction Information Functions**

<figure class="table-wrapper">
<table class="table" summary="Committed Transaction Information Functions" border="1">
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
          <a id="id-1.5.8.32.11.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_xact_commit_timestamp</code> ( <code class="type">xid</code> ) →
          <code class="returnvalue">timestamp with time zone</code>
        </div>
        <div>Returns the commit timestamp of a transaction.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.11.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_xact_commit_timestamp_origin</code> (
          <code class="type">xid</code> ) → <code class="returnvalue">record</code> (
          <em class="parameter"><code>timestamp</code></em>
          <code class="type">timestamp with time zone</code>,
          <em class="parameter"><code>roident</code></em> <code class="type">oid</code>)
        </div>
        <div>Returns the commit timestamp and replication origin of a transaction.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.11.3.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_last_committed_xact</code> () →
          <code class="returnvalue">record</code> ( <em class="parameter"><code>xid</code></em>
          <code class="type">xid</code>, <em class="parameter"><code>timestamp</code></em>
          <code class="type">timestamp with time zone</code>,
          <em class="parameter"><code>roident</code></em> <code class="type">oid</code> )
        </div>
        <div>
          Returns the transaction ID, commit timestamp and replication origin of the latest
          committed transaction.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-INFO-CONTROLDATA)

### 9.26.10. Control Data Functions [#](#FUNCTIONS-INFO-CONTROLDATA)

The functions shown in [Table 9.84](functions-info#FUNCTIONS-CONTROLDATA) print information initialized during `initdb`, such as the catalog version. They also show information about write-ahead logging and checkpoint processing. This information is cluster-wide, not specific to any one database. These functions provide most of the same information, from the same source, as the [pg_controldata](app-pgcontroldata) application.

[#id](#FUNCTIONS-CONTROLDATA)

**Table 9.84. Control Data Functions**

<figure class="table-wrapper">
<table class="table" summary="Control Data Functions" border="1">
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
          <a id="id-1.5.8.32.12.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_control_checkpoint</code> () →
          <code class="returnvalue">record</code>
        </div>
        <div>
          Returns information about current checkpoint state, as shown in
          <a
            class="xref"
            href="functions-info.html#FUNCTIONS-PG-CONTROL-CHECKPOINT"
            title="Table&nbsp;9.85.&nbsp;pg_control_checkpoint Output Columns">Table&nbsp;9.85</a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.12.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_control_system</code> () →
          <code class="returnvalue">record</code>
        </div>
        <div>
          Returns information about current control file state, as shown in
          <a
            class="xref"
            href="functions-info.html#FUNCTIONS-PG-CONTROL-SYSTEM"
            title="Table&nbsp;9.86.&nbsp;pg_control_system Output Columns">Table&nbsp;9.86</a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.12.3.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_control_init</code> () → <code class="returnvalue">record</code>
        </div>
        <div>
          Returns information about cluster initialization state, as shown in
          <a
            class="xref"
            href="functions-info.html#FUNCTIONS-PG-CONTROL-INIT"
            title="Table&nbsp;9.87.&nbsp;pg_control_init Output Columns">Table&nbsp;9.87</a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.32.12.3.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_control_recovery</code> () →
          <code class="returnvalue">record</code>
        </div>
        <div>
          Returns information about recovery state, as shown in
          <a
            class="xref"
            href="functions-info.html#FUNCTIONS-PG-CONTROL-RECOVERY"
            title="Table&nbsp;9.88.&nbsp;pg_control_recovery Output Columns">Table&nbsp;9.88</a>.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-PG-CONTROL-CHECKPOINT)

**Table 9.85. `pg_control_checkpoint` Output Columns**

| Column Name            | Data Type                  |
| ---------------------- | -------------------------- |
| `checkpoint_lsn`       | `pg_lsn`                   |
| `redo_lsn`             | `pg_lsn`                   |
| `redo_wal_file`        | `text`                     |
| `timeline_id`          | `integer`                  |
| `prev_timeline_id`     | `integer`                  |
| `full_page_writes`     | `boolean`                  |
| `next_xid`             | `text`                     |
| `next_oid`             | `oid`                      |
| `next_multixact_id`    | `xid`                      |
| `next_multi_offset`    | `xid`                      |
| `oldest_xid`           | `xid`                      |
| `oldest_xid_dbid`      | `oid`                      |
| `oldest_active_xid`    | `xid`                      |
| `oldest_multi_xid`     | `xid`                      |
| `oldest_multi_dbid`    | `oid`                      |
| `oldest_commit_ts_xid` | `xid`                      |
| `newest_commit_ts_xid` | `xid`                      |
| `checkpoint_time`      | `timestamp with time zone` |

[#id](#FUNCTIONS-PG-CONTROL-SYSTEM)

**Table 9.86. `pg_control_system` Output Columns**

| Column Name                | Data Type                  |
| -------------------------- | -------------------------- |
| `pg_control_version`       | `integer`                  |
| `catalog_version_no`       | `integer`                  |
| `system_identifier`        | `bigint`                   |
| `pg_control_last_modified` | `timestamp with time zone` |

[#id](#FUNCTIONS-PG-CONTROL-INIT)

**Table 9.87. `pg_control_init` Output Columns**

| Column Name                  | Data Type |
| ---------------------------- | --------- |
| `max_data_alignment`         | `integer` |
| `database_block_size`        | `integer` |
| `blocks_per_segment`         | `integer` |
| `wal_block_size`             | `integer` |
| `bytes_per_wal_segment`      | `integer` |
| `max_identifier_length`      | `integer` |
| `max_index_columns`          | `integer` |
| `max_toast_chunk_size`       | `integer` |
| `large_object_chunk_size`    | `integer` |
| `float8_pass_by_value`       | `boolean` |
| `data_page_checksum_version` | `integer` |

[#id](#FUNCTIONS-PG-CONTROL-RECOVERY)

**Table 9.88. `pg_control_recovery` Output Columns**

| Column Name                     | Data Type |
| ------------------------------- | --------- |
| `min_recovery_end_lsn`          | `pg_lsn`  |
| `min_recovery_end_timeline`     | `integer` |
| `backup_start_lsn`              | `pg_lsn`  |
| `backup_end_lsn`                | `pg_lsn`  |
| `end_of_backup_record_required` | `boolean` |

```

```

[#id](#FUNCTIONS-ADMIN)

## 9.27. System Administration Functions [#](#FUNCTIONS-ADMIN)

- [9.27.1. Configuration Settings Functions](functions-admin#FUNCTIONS-ADMIN-SET)
- [9.27.2. Server Signaling Functions](functions-admin#FUNCTIONS-ADMIN-SIGNAL)
- [9.27.3. Backup Control Functions](functions-admin#FUNCTIONS-ADMIN-BACKUP)
- [9.27.4. Recovery Control Functions](functions-admin#FUNCTIONS-RECOVERY-CONTROL)
- [9.27.5. Snapshot Synchronization Functions](functions-admin#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION)
- [9.27.6. Replication Management Functions](functions-admin#FUNCTIONS-REPLICATION)
- [9.27.7. Database Object Management Functions](functions-admin#FUNCTIONS-ADMIN-DBOBJECT)
- [9.27.8. Index Maintenance Functions](functions-admin#FUNCTIONS-ADMIN-INDEX)
- [9.27.9. Generic File Access Functions](functions-admin#FUNCTIONS-ADMIN-GENFILE)
- [9.27.10. Advisory Lock Functions](functions-admin#FUNCTIONS-ADVISORY-LOCKS)

The functions described in this section are used to control and monitor a PostgreSQL installation.

[#id](#FUNCTIONS-ADMIN-SET)

### 9.27.1. Configuration Settings Functions [#](#FUNCTIONS-ADMIN-SET)

[Table 9.89](functions-admin#FUNCTIONS-ADMIN-SET-TABLE) shows the functions available to query and alter run-time configuration parameters.

[#id](#FUNCTIONS-ADMIN-SET-TABLE)

**Table 9.89. Configuration Settings Functions**

<figure class="table-wrapper">
<table class="table" summary="Configuration Settings Functions" border="1">
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
          <a id="id-1.5.8.33.3.6.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">current_setting</code> (
          <em class="parameter"><code>setting_name</code></em> <code class="type">text</code> [<span class="optional">, <em class="parameter"><code>missing_ok</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the current value of the setting
          <em class="parameter"><code>setting_name</code></em>. If there is no such setting, <code class="function">current_setting</code> throws an
          error unless <em class="parameter"><code>missing_ok</code></em> is supplied and is
          <code class="literal">true</code> (in which case NULL is returned). This function
          corresponds to the <acronym class="acronym">SQL</acronym> command
          <a class="xref" href="sql-show.html" title="SHOW"
            ><span class="refentrytitle">SHOW</span></a>.
        </div>
        <div>
          <code class="literal">current_setting('datestyle')</code>
          → <code class="returnvalue">ISO, MDY</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.3.6.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">set_config</code> (
          <em class="parameter"><code>setting_name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>new_value</code></em> <code class="type">text</code>,
          <em class="parameter"><code>is_local</code></em> <code class="type">boolean</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Sets the parameter <em class="parameter"><code>setting_name</code></em> to
          <em class="parameter"><code>new_value</code></em>, and returns that value. If <em class="parameter"><code>is_local</code></em> is
          <code class="literal">true</code>, the new value will only apply during the current
          transaction. If you want the new value to apply for the rest of the current session, use
          <code class="literal">false</code> instead. This function corresponds to the SQL command
          <a class="xref" href="sql-set.html" title="SET"><span class="refentrytitle">SET</span></a>.
        </div>
        <div>
          <code class="literal">set_config('log_statement_stats', 'off', false)</code>
          → <code class="returnvalue">off</code>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-ADMIN-SIGNAL)

### 9.27.2. Server Signaling Functions [#](#FUNCTIONS-ADMIN-SIGNAL)

The functions shown in [Table 9.90](functions-admin#FUNCTIONS-ADMIN-SIGNAL-TABLE) send control signals to other server processes. Use of these functions is restricted to superusers by default but access may be granted to others using `GRANT`, with noted exceptions.

Each of these functions returns `true` if the signal was successfully sent and `false` if sending the signal failed.

[#id](#FUNCTIONS-ADMIN-SIGNAL-TABLE)

**Table 9.90. Server Signaling Functions**

<figure class="table-wrapper">
<table class="table" summary="Server Signaling Functions" border="1">
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
          <a id="id-1.5.8.33.4.5.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_cancel_backend</code> (
          <em class="parameter"><code>pid</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Cancels the current query of the session whose backend process has the specified process
          ID. This is also allowed if the calling role is a member of the role whose backend is
          being canceled or the calling role has privileges of
          <code class="literal">pg_signal_backend</code>, however only superusers can cancel
          superuser backends.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.4.5.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_log_backend_memory_contexts</code> (
          <em class="parameter"><code>pid</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Requests to log the memory contexts of the backend with the specified process ID. This
          function can send the request to backends and auxiliary processes except logger. These
          memory contexts will be logged at
          <code class="literal">LOG</code> message level. They will appear in the server log based
          on the log configuration set (see
          <a
            class="xref"
            href="runtime-config-logging.html"
            title="20.8. Error Reporting and Logging">Section 20.8</a>
          for more information), but will not be sent to the client regardless of
          <a class="xref" href="runtime-config-client.html#GUC-CLIENT-MIN-MESSAGES">client_min_messages</a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.4.5.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_reload_conf</code> () → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Causes all processes of the <span class="productname">PostgreSQL</span> server to reload
          their configuration files. (This is initiated by sending a
          <span class="systemitem">SIGHUP</span> signal to the postmaster process, which in turn
          sends <span class="systemitem">SIGHUP</span> to each of its children.) You can use the
          <a class="link" href="view-pg-file-settings.html" title="54.7. pg_file_settings"><code class="structname">pg_file_settings</code></a>,
          <a class="link" href="view-pg-hba-file-rules.html" title="54.9. pg_hba_file_rules"><code class="structname">pg_hba_file_rules</code></a>
          and
          <a class="link" href="view-pg-hba-file-rules.html" title="54.9. pg_hba_file_rules"><code class="structname">pg_ident_file_mappings</code></a>
          views to check the configuration files for possible errors, before reloading.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.4.5.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_rotate_logfile</code> () →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Signals the log-file manager to switch to a new output file immediately. This works only
          when the built-in log collector is running, since otherwise there is no log-file manager
          subprocess.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.4.5.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_terminate_backend</code> (
          <em class="parameter"><code>pid</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>timeout</code></em> <code class="type">bigint</code>
          <code class="literal">DEFAULT</code> <code class="literal">0</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Terminates the session whose backend process has the specified process ID. This is also
          allowed if the calling role is a member of the role whose backend is being terminated or
          the calling role has privileges of <code class="literal">pg_signal_backend</code>, however
          only superusers can terminate superuser backends.
        </div>
        <div>
          If <em class="parameter"><code>timeout</code></em> is not specified or zero, this function
          returns <code class="literal">true</code> whether the process actually terminates or not,
          indicating only that the sending of the signal was successful. If the
          <em class="parameter"><code>timeout</code></em> is specified (in milliseconds) and greater
          than zero, the function waits until the process is actually terminated or until the given
          time has passed. If the process is terminated, the function returns
          <code class="literal">true</code>. On timeout, a warning is emitted and
          <code class="literal">false</code> is returned.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

`pg_cancel_backend` and `pg_terminate_backend` send signals (SIGINT or SIGTERM respectively) to backend processes identified by process ID. The process ID of an active backend can be found from the `pid` column of the `pg_stat_activity` view, or by listing the `postgres` processes on the server (using ps on Unix or the Task Manager on Windows). The role of an active backend can be found from the `usename` column of the `pg_stat_activity` view.

`pg_log_backend_memory_contexts` can be used to log the memory contexts of a backend process. For example:

```

postgres=# SELECT pg_log_backend_memory_contexts(pg_backend_pid());
 pg_log_backend_memory_contexts
--------------------------------
 t
(1 row)
```

One message for each memory context will be logged. For example:

```

LOG:  logging memory contexts of PID 10377
STATEMENT:  SELECT pg_log_backend_memory_contexts(pg_backend_pid());
LOG:  level: 0; TopMemoryContext: 80800 total in 6 blocks; 14432 free (5 chunks); 66368 used
LOG:  level: 1; pgstat TabStatusArray lookup hash table: 8192 total in 1 blocks; 1408 free (0 chunks); 6784 used
LOG:  level: 1; TopTransactionContext: 8192 total in 1 blocks; 7720 free (1 chunks); 472 used
LOG:  level: 1; RowDescriptionContext: 8192 total in 1 blocks; 6880 free (0 chunks); 1312 used
LOG:  level: 1; MessageContext: 16384 total in 2 blocks; 5152 free (0 chunks); 11232 used
LOG:  level: 1; Operator class cache: 8192 total in 1 blocks; 512 free (0 chunks); 7680 used
LOG:  level: 1; smgr relation table: 16384 total in 2 blocks; 4544 free (3 chunks); 11840 used
LOG:  level: 1; TransactionAbortContext: 32768 total in 1 blocks; 32504 free (0 chunks); 264 used
...
LOG:  level: 1; ErrorContext: 8192 total in 1 blocks; 7928 free (3 chunks); 264 used
LOG:  Grand total: 1651920 bytes in 201 blocks; 622360 free (88 chunks); 1029560 used
```

If there are more than 100 child contexts under the same parent, the first 100 child contexts are logged, along with a summary of the remaining contexts. Note that frequent calls to this function could incur significant overhead, because it may generate a large number of log messages.

[#id](#FUNCTIONS-ADMIN-BACKUP)

### 9.27.3. Backup Control Functions [#](#FUNCTIONS-ADMIN-BACKUP)

The functions shown in [Table 9.91](functions-admin#FUNCTIONS-ADMIN-BACKUP-TABLE) assist in making on-line backups. These functions cannot be executed during recovery (except `pg_backup_start`, `pg_backup_stop`, and `pg_wal_lsn_diff`).

For details about proper usage of these functions, see [Section 26.3](continuous-archiving).

[#id](#FUNCTIONS-ADMIN-BACKUP-TABLE)

**Table 9.91. Backup Control Functions**

<figure class="table-wrapper">
<table class="table" summary="Backup Control Functions" border="1">
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
          <a id="id-1.5.8.33.5.5.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_create_restore_point</code> (
          <em class="parameter"><code>name</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div>
          Creates a named marker record in the write-ahead log that can later be used as a recovery
          target, and returns the corresponding write-ahead log location. The given name can then be
          used with
          <a class="xref" href="runtime-config-wal.html#GUC-RECOVERY-TARGET-NAME">recovery_target_name</a>
          to specify the point up to which recovery will proceed. Avoid creating multiple restore
          points with the same name, since recovery will stop at the first one whose name matches
          the recovery target.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.5.5.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_current_wal_flush_lsn</code> () →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div>Returns the current write-ahead log flush location (see notes below).</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.5.5.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_current_wal_insert_lsn</code> () →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div>Returns the current write-ahead log insert location (see notes below).</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.5.5.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_current_wal_lsn</code> () →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div>Returns the current write-ahead log write location (see notes below).</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.5.5.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_backup_start</code> (
          <em class="parameter"><code>label</code></em> <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>fast</code></em> <code class="type">boolean</code> </span>] ) → <code class="returnvalue">pg_lsn</code>
        </div>
        <div>
          Prepares the server to begin an on-line backup. The only required parameter is an
          arbitrary user-defined label for the backup. (Typically this would be the name under which
          the backup dump file will be stored.) If the optional second parameter is given as
          <code class="literal">true</code>, it specifies executing
          <code class="function">pg_backup_start</code> as quickly as possible. This forces an
          immediate checkpoint which will cause a spike in I/O operations, slowing any concurrently
          executing queries.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.5.5.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">pg_backup_stop</code> ( [<span class="optional"><em class="parameter"><code>wait_for_archive</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">record</code> (
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>labelfile</code></em> <code class="type">text</code>,
          <em class="parameter"><code>spcmapfile</code></em> <code class="type">text</code> )
        </div>
        <div>
          Finishes performing an on-line backup. The desired contents of the backup label file and
          the tablespace map file are returned as part of the result of the function and must be
          written to files in the backup area. These files must not be written to the live data
          directory (doing so will cause PostgreSQL to fail to restart in the event of a crash).
        </div>
        <div>
          There is an optional parameter of type <code class="type">boolean</code>. If false, the
          function will return immediately after the backup is completed, without waiting for WAL to
          be archived. This behavior is only useful with backup software that independently monitors
          WAL archiving. Otherwise, WAL required to make the backup consistent might be missing and
          make the backup useless. By default or when this parameter is true,
          <code class="function">pg_backup_stop</code> will wait for WAL to be archived when
          archiving is enabled. (On a standby, this means that it will wait only when
          <code class="varname">archive_mode</code> = <code class="literal">always</code>. If write
          activity on the primary is low, it may be useful to run
          <code class="function">pg_switch_wal</code> on the primary in order to trigger an
          immediate segment switch.)
        </div>
        <div>
          When executed on a primary, this function also creates a backup history file in the
          write-ahead log archive area. The history file includes the label given to
          <code class="function">pg_backup_start</code>, the starting and ending write-ahead log
          locations for the backup, and the starting and ending times of the backup. After recording
          the ending location, the current write-ahead log insertion point is automatically advanced
          to the next write-ahead log file, so that the ending write-ahead log file can be archived
          immediately to complete the backup.
        </div>
        <div>
          The result of the function is a single record. The
          <em class="parameter"><code>lsn</code></em> column holds the backup's ending write-ahead
          log location (which again can be ignored). The second column returns the contents of the
          backup label file, and the third column returns the contents of the tablespace map file.
          These must be stored as part of the backup and are required as part of the restore
          process.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.5.5.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">pg_switch_wal</code> () → <code class="returnvalue">pg_lsn</code>
        </div>
        <div>
          Forces the server to switch to a new write-ahead log file, which allows the current file
          to be archived (assuming you are using continuous archiving). The result is the ending
          write-ahead log location plus 1 within the just-completed write-ahead log file. If there
          has been no write-ahead log activity since the last write-ahead log switch,
          <code class="function">pg_switch_wal</code> does nothing and returns the start location of
          the write-ahead log file currently in use.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.5.5.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">pg_walfile_name</code> (
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Converts a write-ahead log location to the name of the WAL file holding that location.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.5.5.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">pg_walfile_name_offset</code> (
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code> ) →
          <code class="returnvalue">record</code> (
          <em class="parameter"><code>file_name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>file_offset</code></em> <code class="type">integer</code> )
        </div>
        <div>
          Converts a write-ahead log location to a WAL file name and byte offset within that file.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.5.5.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">pg_split_walfile_name</code> (
          <em class="parameter"><code>file_name</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">record</code> (
          <em class="parameter"><code>segment_number</code></em> <code class="type">numeric</code>,
          <em class="parameter"><code>timeline_id</code></em> <code class="type">bigint</code> )
        </div>
        <div>Extracts the sequence number and timeline ID from a WAL file name.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.5.5.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">pg_wal_lsn_diff</code> (
          <em class="parameter"><code>lsn1</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>lsn2</code></em> <code class="type">pg_lsn</code> ) →
          <code class="returnvalue">numeric</code>
        </div>
        <div>
          Calculates the difference in bytes (<em class="parameter"><code>lsn1</code></em> -
          <em class="parameter"><code>lsn2</code></em>) between two write-ahead log locations. This can be used with
          <code class="structname">pg_stat_replication</code> or some of the functions shown in
          <a
            class="xref"
            href="functions-admin.html#FUNCTIONS-ADMIN-BACKUP-TABLE"
            title="Table 9.91. Backup Control Functions">Table 9.91</a>
          to get the replication lag.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

`pg_current_wal_lsn` displays the current write-ahead log write location in the same format used by the above functions. Similarly, `pg_current_wal_insert_lsn` displays the current write-ahead log insertion location and `pg_current_wal_flush_lsn` displays the current write-ahead log flush location. The insertion location is the “logical” end of the write-ahead log at any instant, while the write location is the end of what has actually been written out from the server's internal buffers, and the flush location is the last location known to be written to durable storage. The write location is the end of what can be examined from outside the server, and is usually what you want if you are interested in archiving partially-complete write-ahead log files. The insertion and flush locations are made available primarily for server debugging purposes. These are all read-only operations and do not require superuser permissions.

You can use `pg_walfile_name_offset` to extract the corresponding write-ahead log file name and byte offset from a `pg_lsn` value. For example:

```

postgres=# SELECT * FROM pg_walfile_name_offset((pg_backup_stop()).lsn);
        file_name         | file_offset
--------------------------+-------------
 00000001000000000000000D |     4039624
(1 row)
```

Similarly, `pg_walfile_name` extracts just the write-ahead log file name. When the given write-ahead log location is exactly at a write-ahead log file boundary, both these functions return the name of the preceding write-ahead log file. This is usually the desired behavior for managing write-ahead log archiving behavior, since the preceding file is the last one that currently needs to be archived.

`pg_split_walfile_name` is useful to compute a LSN from a file offset and WAL file name, for example:

```

postgres=# \set file_name '000000010000000100C000AB'
postgres=# \set offset 256
postgres=# SELECT '0/0'::pg_lsn + pd.segment_number * ps.setting::int + :offset AS lsn
  FROM pg_split_walfile_name(:'file_name') pd,
       pg_show_all_settings() ps
  WHERE ps.name = 'wal_segment_size';
      lsn
---------------
 C001/AB000100
(1 row)
```

[#id](#FUNCTIONS-RECOVERY-CONTROL)

### 9.27.4. Recovery Control Functions [#](#FUNCTIONS-RECOVERY-CONTROL)

The functions shown in [Table 9.92](functions-admin#FUNCTIONS-RECOVERY-INFO-TABLE) provide information about the current status of a standby server. These functions may be executed both during recovery and in normal running.

[#id](#FUNCTIONS-RECOVERY-INFO-TABLE)

**Table 9.92. Recovery Information Functions**

<figure class="table-wrapper">
<table class="table" summary="Recovery Information Functions" border="1">
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
          <a id="id-1.5.8.33.6.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_is_in_recovery</code> () →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Returns true if recovery is still in progress.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.6.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_last_wal_receive_lsn</code> () →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div>
          Returns the last write-ahead log location that has been received and synced to disk by
          streaming replication. While streaming replication is in progress this will increase
          monotonically. If recovery has completed then this will remain static at the location of
          the last WAL record received and synced to disk during recovery. If streaming replication
          is disabled, or if it has not yet started, the function returns
          <code class="literal">NULL</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.6.3.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_last_wal_replay_lsn</code> () →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div>
          Returns the last write-ahead log location that has been replayed during recovery. If
          recovery is still in progress this will increase monotonically. If recovery has completed
          then this will remain static at the location of the last WAL record applied during
          recovery. When the server has been started normally without recovery, the function returns
          <code class="literal">NULL</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.6.3.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_last_xact_replay_timestamp</code> () →
          <code class="returnvalue">timestamp with time zone</code>
        </div>
        <div>
          Returns the time stamp of the last transaction replayed during recovery. This is the time
          at which the commit or abort WAL record for that transaction was generated on the primary.
          If no transactions have been replayed during recovery, the function returns
          <code class="literal">NULL</code>. Otherwise, if recovery is still in progress this will
          increase monotonically. If recovery has completed then this will remain static at the time
          of the last transaction applied during recovery. When the server has been started normally
          without recovery, the function returns <code class="literal">NULL</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.6.3.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_wal_resource_managers</code> () →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>rm_id</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>rm_name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>rm_builtin</code></em> <code class="type">boolean</code> )
        </div>
        <div>
          Returns the currently-loaded WAL resource managers in the system. The column
          <em class="parameter"><code>rm_builtin</code></em> indicates whether it's a built-in
          resource manager, or a custom resource manager loaded by an extension.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

The functions shown in [Table 9.93](functions-admin#FUNCTIONS-RECOVERY-CONTROL-TABLE) control the progress of recovery. These functions may be executed only during recovery.

[#id](#FUNCTIONS-RECOVERY-CONTROL-TABLE)

**Table 9.93. Recovery Control Functions**

<figure class="table-wrapper">
<table class="table" summary="Recovery Control Functions" border="1">
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
          <a id="id-1.5.8.33.6.5.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_is_wal_replay_paused</code> () →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Returns true if recovery pause is requested.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.6.5.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_get_wal_replay_pause_state</code> () →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns recovery pause state. The return values are
          <code class="literal"> not paused</code> if pause is not requested,
          <code class="literal"> pause requested</code> if pause is requested but recovery is not
          yet paused, and <code class="literal">paused</code> if the recovery is actually paused.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.6.5.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_promote</code> ( <em class="parameter"><code>wait</code></em>
          <code class="type">boolean</code> <code class="literal">DEFAULT</code>
          <code class="literal">true</code>, <em class="parameter"><code>wait_seconds</code></em>
          <code class="type">integer</code> <code class="literal">DEFAULT</code>
          <code class="literal">60</code> ) → <code class="returnvalue">boolean</code>
        </div>
        <div>
          Promotes a standby server to primary status. With
          <em class="parameter"><code>wait</code></em> set to <code class="literal">true</code> (the
          default), the function waits until promotion is completed or
          <em class="parameter"><code>wait_seconds</code></em> seconds have passed, and returns
          <code class="literal">true</code> if promotion is successful and
          <code class="literal">false</code> otherwise. If
          <em class="parameter"><code>wait</code></em> is set to <code class="literal">false</code>,
          the function returns <code class="literal">true</code> immediately after sending a
          <code class="literal">SIGUSR1</code> signal to the postmaster to trigger promotion.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.6.5.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_wal_replay_pause</code> () →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Request to pause recovery. A request doesn't mean that recovery stops right away. If you
          want a guarantee that recovery is actually paused, you need to check for the recovery
          pause state returned by
          <code class="function">pg_get_wal_replay_pause_state()</code>. Note that
          <code class="function">pg_is_wal_replay_paused()</code> returns whether a request is made.
          While recovery is paused, no further database changes are applied. If hot standby is
          active, all new queries will see the same consistent snapshot of the database, and no
          further query conflicts will be generated until recovery is resumed.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.6.5.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_wal_replay_resume</code> () →
          <code class="returnvalue">void</code>
        </div>
        <div>Restarts recovery if it was paused.</div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

`pg_wal_replay_pause` and `pg_wal_replay_resume` cannot be executed while a promotion is ongoing. If a promotion is triggered while recovery is paused, the paused state ends and promotion continues.

If streaming replication is disabled, the paused state may continue indefinitely without a problem. If streaming replication is in progress then WAL records will continue to be received, which will eventually fill available disk space, depending upon the duration of the pause, the rate of WAL generation and available disk space.

[#id](#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION)

### 9.27.5. Snapshot Synchronization Functions [#](#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION)

PostgreSQL allows database sessions to synchronize their snapshots. A _snapshot_ determines which data is visible to the transaction that is using the snapshot. Synchronized snapshots are necessary when two or more sessions need to see identical content in the database. If two sessions just start their transactions independently, there is always a possibility that some third transaction commits between the executions of the two `START TRANSACTION` commands, so that one session sees the effects of that transaction and the other does not.

To solve this problem, PostgreSQL allows a transaction to _export_ the snapshot it is using. As long as the exporting transaction remains open, other transactions can _import_ its snapshot, and thereby be guaranteed that they see exactly the same view of the database that the first transaction sees. But note that any database changes made by any one of these transactions remain invisible to the other transactions, as is usual for changes made by uncommitted transactions. So the transactions are synchronized with respect to pre-existing data, but act normally for changes they make themselves.

Snapshots are exported with the `pg_export_snapshot` function, shown in [Table 9.94](functions-admin#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION-TABLE), and imported with the [SET TRANSACTION](sql-set-transaction) command.

[#id](#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION-TABLE)

**Table 9.94. Snapshot Synchronization Functions**

<figure class="table-wrapper">
<table class="table" summary="Snapshot Synchronization Functions" border="1">
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
          <a id="id-1.5.8.33.7.5.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_export_snapshot</code> () →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Saves the transaction's current snapshot and returns a
          <code class="type">text</code> string identifying the snapshot. This string must be passed
          (outside the database) to clients that want to import the snapshot. The snapshot is
          available for import only until the end of the transaction that exported it.
        </div>
        <div>
          A transaction can export more than one snapshot, if needed. Note that doing so is only
          useful in <code class="literal">READ COMMITTED</code> transactions, since in
          <code class="literal">REPEATABLE READ</code> and higher isolation levels, transactions use
          the same snapshot throughout their lifetime. Once a transaction has exported any
          snapshots, it cannot be prepared with
          <a class="xref" href="sql-prepare-transaction.html" title="PREPARE TRANSACTION"><span class="refentrytitle">PREPARE TRANSACTION</span></a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.7.5.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_log_standby_snapshot</code> () →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div>
          Take a snapshot of running transactions and write it to WAL, without having to wait for
          bgwriter or checkpointer to log one. This is useful for logical decoding on standby, as
          logical slot creation has to wait until such a record is replayed on the standby.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-REPLICATION)

### 9.27.6. Replication Management Functions [#](#FUNCTIONS-REPLICATION)

The functions shown in [Table 9.95](functions-admin#FUNCTIONS-REPLICATION-TABLE) are for controlling and interacting with replication features. See [Section 27.2.5](warm-standby#STREAMING-REPLICATION), [Section 27.2.6](warm-standby#STREAMING-REPLICATION-SLOTS), and [Chapter 50](replication-origins) for information about the underlying features. Use of functions for replication origin is only allowed to the superuser by default, but may be allowed to other users by using the `GRANT` command. Use of functions for replication slots is restricted to superusers and users having `REPLICATION` privilege.

Many of these functions have equivalent commands in the replication protocol; see [Section 55.4](protocol-replication).

The functions described in [Section 9.27.3](functions-admin#FUNCTIONS-ADMIN-BACKUP), [Section 9.27.4](functions-admin#FUNCTIONS-RECOVERY-CONTROL), and [Section 9.27.5](functions-admin#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION) are also relevant for replication.

[#id](#FUNCTIONS-REPLICATION-TABLE)

**Table 9.95. Replication Management Functions**

<figure class="table-wrapper">
<table class="table" summary="Replication Management Functions" border="1">
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
          <a id="id-1.5.8.33.8.5.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_create_physical_replication_slot</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code> [<span class="optional">, <em class="parameter"><code>immediately_reserve</code></em>
            <code class="type">boolean</code>, <em class="parameter"><code>temporary</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">record</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code> )
        </div>
        <div>
          Creates a new physical replication slot named
          <em class="parameter"><code>slot_name</code></em>. The optional second parameter, when <code class="literal">true</code>, specifies that
          the <acronym class="acronym">LSN</acronym> for this replication slot be reserved
          immediately; otherwise the <acronym class="acronym">LSN</acronym> is reserved on first
          connection from a streaming replication client. Streaming changes from a physical slot is
          only possible with the streaming-replication protocol — see
          <a
            class="xref"
            href="protocol-replication.html"
            title="55.4. Streaming Replication Protocol">Section 55.4</a>. The optional third parameter, <em class="parameter"><code>temporary</code></em>, when set to true, specifies that the slot should not be permanently stored to disk and
          is only meant for use by the current session. Temporary slots are also released upon any
          error. This function corresponds to the replication protocol command
          <code class="literal">CREATE_REPLICATION_SLOT ... PHYSICAL</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_drop_replication_slot</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Drops the physical or logical replication slot named
          <em class="parameter"><code>slot_name</code></em>. Same as replication protocol command
          <code class="literal">DROP_REPLICATION_SLOT</code>. For logical slots, this must be called
          while connected to the same database the slot was created on.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_create_logical_replication_slot</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>plugin</code></em> <code class="type">name</code> [<span class="optional">, <em class="parameter"><code>temporary</code></em> <code class="type">boolean</code>,
            <em class="parameter"><code>twophase</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">record</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code> )
        </div>
        <div>
          Creates a new logical (decoding) replication slot named
          <em class="parameter"><code>slot_name</code></em> using the output plugin
          <em class="parameter"><code>plugin</code></em>. The optional third parameter, <em class="parameter"><code>temporary</code></em>, when set to true, specifies that the slot should not be permanently stored to disk and
          is only meant for use by the current session. Temporary slots are also released upon any
          error. The optional fourth parameter, <em class="parameter"><code>twophase</code></em>, when set to true, specifies that the decoding of prepared transactions is enabled for
          this slot. A call to this function has the same effect as the replication protocol command
          <code class="literal">CREATE_REPLICATION_SLOT ... LOGICAL</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_copy_physical_replication_slot</code> (
          <em class="parameter"><code>src_slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>dst_slot_name</code></em>
          <code class="type">name</code> [<span class="optional">, <em class="parameter"><code>temporary</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">record</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code> )
        </div>
        <div>
          Copies an existing physical replication slot named
          <em class="parameter"><code>src_slot_name</code></em> to a physical replication slot named
          <em class="parameter"><code>dst_slot_name</code></em>. The copied physical slot starts to reserve WAL from the same
          <acronym class="acronym">LSN</acronym> as the source slot.
          <em class="parameter"><code>temporary</code></em> is optional. If
          <em class="parameter"><code>temporary</code></em>
          is omitted, the same value as the source slot is used.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_copy_logical_replication_slot</code> (
          <em class="parameter"><code>src_slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>dst_slot_name</code></em>
          <code class="type">name</code> [<span class="optional">, <em class="parameter"><code>temporary</code></em>
            <code class="type">boolean</code> [<span class="optional">, <em class="parameter"><code>plugin</code></em>
              <code class="type">name</code> </span>]</span>] ) → <code class="returnvalue">record</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code> )
        </div>
        <div>
          Copies an existing logical replication slot named
          <em class="parameter"><code>src_slot_name</code></em> to a logical replication slot named
          <em class="parameter"><code>dst_slot_name</code></em>, optionally changing the output plugin and persistence. The copied logical slot starts
          from the same <acronym class="acronym">LSN</acronym> as the source logical slot. Both
          <em class="parameter"><code>temporary</code></em> and
          <em class="parameter"><code>plugin</code></em> are optional; if they are omitted, the
          values of the source slot are used.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">pg_logical_slot_get_changes</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>upto_lsn</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>upto_nchanges</code></em> <code class="type">integer</code>,
          <code class="literal">VARIADIC</code> <em class="parameter"><code>options</code></em>
          <code class="type">text[]</code> ) → <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>xid</code></em> <code class="type">xid</code>,
          <em class="parameter"><code>data</code></em> <code class="type">text</code> )
        </div>
        <div>
          Returns changes in the slot <em class="parameter"><code>slot_name</code></em>, starting from the point from which changes have been consumed last. If
          <em class="parameter"><code>upto_lsn</code></em>
          and <em class="parameter"><code>upto_nchanges</code></em> are NULL, logical decoding will
          continue until end of WAL. If <em class="parameter"><code>upto_lsn</code></em> is
          non-NULL, decoding will include only those transactions which commit prior to the
          specified LSN. If <em class="parameter"><code>upto_nchanges</code></em> is non-NULL,
          decoding will stop when the number of rows produced by decoding exceeds the specified
          value. Note, however, that the actual number of rows returned may be larger, since this
          limit is only checked after adding the rows produced when decoding each new transaction
          commit.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">pg_logical_slot_peek_changes</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>upto_lsn</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>upto_nchanges</code></em> <code class="type">integer</code>,
          <code class="literal">VARIADIC</code> <em class="parameter"><code>options</code></em>
          <code class="type">text[]</code> ) → <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>xid</code></em> <code class="type">xid</code>,
          <em class="parameter"><code>data</code></em> <code class="type">text</code> )
        </div>
        <div>
          Behaves just like the
          <code class="function">pg_logical_slot_get_changes()</code> function, except that changes
          are not consumed; that is, they will be returned again on future calls.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">pg_logical_slot_get_binary_changes</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>upto_lsn</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>upto_nchanges</code></em> <code class="type">integer</code>,
          <code class="literal">VARIADIC</code> <em class="parameter"><code>options</code></em>
          <code class="type">text[]</code> ) → <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>xid</code></em> <code class="type">xid</code>,
          <em class="parameter"><code>data</code></em> <code class="type">bytea</code> )
        </div>
        <div>
          Behaves just like the
          <code class="function">pg_logical_slot_get_changes()</code> function, except that changes
          are returned as <code class="type">bytea</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">pg_logical_slot_peek_binary_changes</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>upto_lsn</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>upto_nchanges</code></em> <code class="type">integer</code>,
          <code class="literal">VARIADIC</code> <em class="parameter"><code>options</code></em>
          <code class="type">text[]</code> ) → <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>xid</code></em> <code class="type">xid</code>,
          <em class="parameter"><code>data</code></em> <code class="type">bytea</code> )
        </div>
        <div>
          Behaves just like the
          <code class="function">pg_logical_slot_peek_changes()</code> function, except that changes
          are returned as <code class="type">bytea</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_slot_advance</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>upto_lsn</code></em> <code class="type">pg_lsn</code> ) →
          <code class="returnvalue">record</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">name</code>,
          <em class="parameter"><code>end_lsn</code></em> <code class="type">pg_lsn</code> )
        </div>
        <div>
          Advances the current confirmed position of a replication slot named
          <em class="parameter"><code>slot_name</code></em>. The slot will not be moved backwards, and it will not be moved beyond the current
          insert location. Returns the name of the slot and the actual position that it was advanced
          to. The updated slot position information is written out at the next checkpoint if any
          advancing is done. So in the event of a crash, the slot may return to an earlier position.
        </div>
      </td>
    </tr>
    <tr>
      <td id="PG-REPLICATION-ORIGIN-CREATE" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_create</code> (
          <em class="parameter"><code>node_name</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">oid</code>
        </div>
        <div>
          Creates a replication origin with the given external name, and returns the internal ID
          assigned to it.
        </div>
      </td>
    </tr>
    <tr>
      <td id="PG-REPLICATION-ORIGIN-DROP" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_drop</code> (
          <em class="parameter"><code>node_name</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Deletes a previously-created replication origin, including any associated replay progress.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_oid</code> (
          <em class="parameter"><code>node_name</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">oid</code>
        </div>
        <div>
          Looks up a replication origin by name and returns the internal ID. If no such replication
          origin is found, <code class="literal">NULL</code> is returned.
        </div>
      </td>
    </tr>
    <tr>
      <td id="PG-REPLICATION-ORIGIN-SESSION-SETUP" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.14.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_session_setup</code> (
          <em class="parameter"><code>node_name</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Marks the current session as replaying from the given origin, allowing replay progress to
          be tracked. Can only be used if no origin is currently selected. Use
          <code class="function">pg_replication_origin_session_reset</code> to undo.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.15.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_session_reset</code> () →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Cancels the effects of
          <code class="function">pg_replication_origin_session_setup()</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.16.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_session_is_setup</code> () →
          <code class="returnvalue">boolean</code>
        </div>
        <div>Returns true if a replication origin has been selected in the current session.</div>
      </td>
    </tr>
    <tr>
      <td id="PG-REPLICATION-ORIGIN-SESSION-PROGRESS" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.17.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_session_progress</code> (
          <em class="parameter"><code>flush</code></em> <code class="type">boolean</code> ) →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div>
          Returns the replay location for the replication origin selected in the current session.
          The parameter <em class="parameter"><code>flush</code></em>
          determines whether the corresponding local transaction will be guaranteed to have been
          flushed to disk or not.
        </div>
      </td>
    </tr>
    <tr>
      <td id="PG-REPLICATION-ORIGIN-XACT-SETUP" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.18.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_xact_setup</code> (
          <em class="parameter"><code>origin_lsn</code></em> <code class="type">pg_lsn</code>,
          <em class="parameter"><code>origin_timestamp</code></em>
          <code class="type">timestamp with time zone</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Marks the current transaction as replaying a transaction that has committed at the given
          <acronym class="acronym">LSN</acronym> and timestamp. Can only be called when a
          replication origin has been selected using
          <code class="function">pg_replication_origin_session_setup</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td id="PG-REPLICATION-ORIGIN-XACT-RESET" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.19.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_xact_reset</code> () →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Cancels the effects of
          <code class="function">pg_replication_origin_xact_setup()</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td id="PG-REPLICATION-ORIGIN-ADVANCE" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.20.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_advance</code> (
          <em class="parameter"><code>node_name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>lsn</code></em> <code class="type">pg_lsn</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Sets replication progress for the given node to the given location. This is primarily
          useful for setting up the initial location, or setting a new location after configuration
          changes and similar. Be aware that careless use of this function can lead to
          inconsistently replicated data.
        </div>
      </td>
    </tr>
    <tr>
      <td id="PG-REPLICATION-ORIGIN-PROGRESS" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.21.1.1.1" class="indexterm"></a>
          <code class="function">pg_replication_origin_progress</code> (
          <em class="parameter"><code>node_name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>flush</code></em> <code class="type">boolean</code> ) →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div>
          Returns the replay location for the given replication origin. The parameter
          <em class="parameter"><code>flush</code></em> determines whether the corresponding local
          transaction will be guaranteed to have been flushed to disk or not.
        </div>
      </td>
    </tr>
    <tr>
      <td id="PG-LOGICAL-EMIT-MESSAGE" class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.8.5.2.2.22.1.1.1" class="indexterm"></a>
          <code class="function">pg_logical_emit_message</code> (
          <em class="parameter"><code>transactional</code></em> <code class="type">boolean</code>,
          <em class="parameter"><code>prefix</code></em> <code class="type">text</code>,
          <em class="parameter"><code>content</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_logical_emit_message</code> (
          <em class="parameter"><code>transactional</code></em> <code class="type">boolean</code>,
          <em class="parameter"><code>prefix</code></em> <code class="type">text</code>,
          <em class="parameter"><code>content</code></em> <code class="type">bytea</code> ) →
          <code class="returnvalue">pg_lsn</code>
        </div>
        <div>
          Emits a logical decoding message. This can be used to pass generic messages to logical
          decoding plugins through WAL. The
          <em class="parameter"><code>transactional</code></em> parameter specifies if the message
          should be part of the current transaction, or if it should be written immediately and
          decoded as soon as the logical decoder reads the record. The
          <em class="parameter"><code>prefix</code></em> parameter is a textual prefix that can be
          used by logical decoding plugins to easily recognize messages that are interesting for
          them. The <em class="parameter"><code>content</code></em> parameter is the content of the
          message, given either in text or binary form.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-ADMIN-DBOBJECT)

### 9.27.7. Database Object Management Functions [#](#FUNCTIONS-ADMIN-DBOBJECT)

The functions shown in [Table 9.96](functions-admin#FUNCTIONS-ADMIN-DBSIZE) calculate the disk space usage of database objects, or assist in presentation or understanding of usage results. `bigint` results are measured in bytes. If an OID that does not represent an existing object is passed to one of these functions, `NULL` is returned.

[#id](#FUNCTIONS-ADMIN-DBSIZE)

**Table 9.96. Database Object Size Functions**

<figure class="table-wrapper">
<table class="table" summary="Database Object Size Functions" border="1">
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
          <a id="id-1.5.8.33.9.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_column_size</code> ( <code class="type">"any"</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Shows the number of bytes used to store any individual data value. If applied directly to
          a table column value, this reflects any compression that was done.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_column_compression</code> ( <code class="type">"any"</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Shows the compression algorithm that was used to compress an individual variable-length
          value. Returns <code class="literal">NULL</code>
          if the value is not compressed.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.3.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_database_size</code> ( <code class="type">name</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_database_size</code> ( <code class="type">oid</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>
          Computes the total disk space used by the database with the specified name or OID. To use
          this function, you must have <code class="literal">CONNECT</code> privilege on the
          specified database (which is granted by default) or have privileges of the
          <code class="literal">pg_read_all_stats</code> role.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.3.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_indexes_size</code> ( <code class="type">regclass</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>Computes the total disk space used by indexes attached to the specified table.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.3.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_relation_size</code> (
          <em class="parameter"><code>relation</code></em> <code class="type">regclass</code> [<span class="optional">, <em class="parameter"><code>fork</code></em> <code class="type">text</code> </span>] ) → <code class="returnvalue">bigint</code>
        </div>
        <div>
          Computes the disk space used by one
          <span class="quote">“<span class="quote">fork</span>”</span> of the specified relation.
          (Note that for most purposes it is more convenient to use the higher-level functions
          <code class="function">pg_total_relation_size</code> or
          <code class="function">pg_table_size</code>, which sum the sizes of all forks.) With one
          argument, this returns the size of the main data fork of the relation. The second argument
          can be provided to specify which fork to examine:
        </div>
        <div class="itemizedlist">
          <ul class="itemizedlist compact">
            <li class="listitem">
              <div>
                <code class="literal">main</code> returns the size of the main data fork of the
                relation.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">fsm</code> returns the size of the Free Space Map (see
                <a class="xref" href="storage-fsm.html" title="73.3. Free Space Map">Section 73.3</a>) associated with the relation.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">vm</code> returns the size of the Visibility Map (see
                <a class="xref" href="storage-vm.html" title="73.4. Visibility Map">Section 73.4</a>) associated with the relation.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">init</code> returns the size of the initialization fork, if
                any, associated with the relation.
              </div>
            </li>
          </ul>
        </div>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.3.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">pg_size_bytes</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>
          Converts a size in human-readable format (as returned by
          <code class="function">pg_size_pretty</code>) into bytes. Valid units are
          <code class="literal">bytes</code>, <code class="literal">B</code>,
          <code class="literal">kB</code>, <code class="literal">MB</code>,
          <code class="literal">GB</code>, <code class="literal">TB</code>, and
          <code class="literal">PB</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.3.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">pg_size_pretty</code> ( <code class="type">bigint</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_size_pretty</code> ( <code class="type">numeric</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Converts a size in bytes into a more easily human-readable format with size units (bytes,
          kB, MB, GB, TB, or PB as appropriate). Note that the units are powers of 2 rather than
          powers of 10, so 1kB is 1024 bytes, 1MB is 1024<sup>2</sup> = 1048576 bytes, and so on.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.3.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">pg_table_size</code> ( <code class="type">regclass</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>
          Computes the disk space used by the specified table, excluding indexes (but including its
          TOAST table if any, free space map, and visibility map).
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.3.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">pg_tablespace_size</code> ( <code class="type">name</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_tablespace_size</code> ( <code class="type">oid</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>
          Computes the total disk space used in the tablespace with the specified name or OID. To
          use this function, you must have <code class="literal">CREATE</code> privilege on the
          specified tablespace or have privileges of the
          <code class="literal">pg_read_all_stats</code> role, unless it is the default tablespace
          for the current database.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.3.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">pg_total_relation_size</code> (
          <code class="type">regclass</code> ) → <code class="returnvalue">bigint</code>
        </div>
        <div>
          Computes the total disk space used by the specified table, including all indexes and
          <acronym class="acronym">TOAST</acronym> data. The result is equivalent to
          <code class="function">pg_table_size</code> <code class="literal">+</code>
          <code class="function">pg_indexes_size</code>.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

The functions above that operate on tables or indexes accept a `regclass` argument, which is simply the OID of the table or index in the `pg_class` system catalog. You do not have to look up the OID by hand, however, since the `regclass` data type's input converter will do the work for you. See [Section 8.19](datatype-oid) for details.

The functions shown in [Table 9.97](functions-admin#FUNCTIONS-ADMIN-DBLOCATION) assist in identifying the specific disk files associated with database objects.

[#id](#FUNCTIONS-ADMIN-DBLOCATION)

**Table 9.97. Database Object Location Functions**

<figure class="table-wrapper">
<table class="table" summary="Database Object Location Functions" border="1">
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
          <a id="id-1.5.8.33.9.6.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_relation_filenode</code> (
          <em class="parameter"><code>relation</code></em> <code class="type">regclass</code> ) →
          <code class="returnvalue">oid</code>
        </div>
        <div>
          Returns the <span class="quote">“<span class="quote">filenode</span>”</span> number
          currently assigned to the specified relation. The filenode is the base component of the
          file name(s) used for the relation (see
          <a class="xref" href="storage-file-layout.html" title="73.1. Database File Layout">Section 73.1</a>
          for more information). For most relations the result is the same as
          <code class="structname">pg_class</code>.<code class="structfield">relfilenode</code>, but
          for certain system catalogs <code class="structfield">relfilenode</code>
          is zero and this function must be used to get the correct value. The function returns NULL
          if passed a relation that does not have storage, such as a view.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.6.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_relation_filepath</code> (
          <em class="parameter"><code>relation</code></em> <code class="type">regclass</code> ) →
          <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the entire file path name (relative to the database cluster's data directory,
          <code class="varname">PGDATA</code>) of the relation.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.6.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_filenode_relation</code> (
          <em class="parameter"><code>tablespace</code></em> <code class="type">oid</code>,
          <em class="parameter"><code>filenode</code></em> <code class="type">oid</code> ) →
          <code class="returnvalue">regclass</code>
        </div>
        <div>
          Returns a relation's OID given the tablespace OID and filenode it is stored under. This is
          essentially the inverse mapping of
          <code class="function">pg_relation_filepath</code>. For a relation in the database's
          default tablespace, the tablespace can be specified as zero. Returns
          <code class="literal">NULL</code> if no relation in the current database is associated
          with the given values.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[Table 9.98](functions-admin#FUNCTIONS-ADMIN-COLLATION) lists functions used to manage collations.

[#id](#FUNCTIONS-ADMIN-COLLATION)

**Table 9.98. Collation Management Functions**

<figure class="table-wrapper">
<table class="table" summary="Collation Management Functions" border="1">
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
          <a id="id-1.5.8.33.9.8.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_collation_actual_version</code> (
          <code class="type">oid</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the actual version of the collation object as it is currently installed in the
          operating system. If this is different from the value in
          <code class="structname">pg_collation</code>.<code class="structfield">collversion</code>,
          then objects depending on the collation might need to be rebuilt. See also
          <a class="xref" href="sql-altercollation.html" title="ALTER COLLATION"><span class="refentrytitle">ALTER COLLATION</span></a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.8.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_database_collation_actual_version</code> (
          <code class="type">oid</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the actual version of the database's collation as it is currently installed in the
          operating system. If this is different from the value in
          <code class="structname">pg_database</code>.<code class="structfield">datcollversion</code>, then objects depending on the collation might need to be rebuilt. See also
          <a class="xref" href="sql-alterdatabase.html" title="ALTER DATABASE"
            ><span class="refentrytitle">ALTER DATABASE</span></a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.8.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_import_system_collations</code> (
          <em class="parameter"><code>schema</code></em> <code class="type">regnamespace</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Adds collations to the system catalog <code class="structname">pg_collation</code> based
          on all the locales it finds in the operating system. This is what
          <code class="command">initdb</code> uses; see
          <a
            class="xref"
            href="collation.html#COLLATION-MANAGING"
            title="24.2.2. Managing Collations">Section 24.2.2</a>
          for more details. If additional locales are installed into the operating system later on,
          this function can be run again to add collations for the new locales. Locales that match
          existing entries in <code class="structname">pg_collation</code> will be skipped. (But
          collation objects based on locales that are no longer present in the operating system are
          not removed by this function.) The
          <em class="parameter"><code>schema</code></em> parameter would typically be
          <code class="literal">pg_catalog</code>, but that is not a requirement; the collations
          could be installed into some other schema as well. The function returns the number of new
          collation objects it created. Use of this function is restricted to superusers.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[Table 9.99](functions-admin#FUNCTIONS-INFO-PARTITION) lists functions that provide information about the structure of partitioned tables.

[#id](#FUNCTIONS-INFO-PARTITION)

**Table 9.99. Partitioning Information Functions**

<figure class="table-wrapper">
<table class="table" summary="Partitioning Information Functions" border="1">
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
          <a id="id-1.5.8.33.9.10.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_partition_tree</code> ( <code class="type">regclass</code> ) →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>relid</code></em> <code class="type">regclass</code>,
          <em class="parameter"><code>parentrelid</code></em> <code class="type">regclass</code>,
          <em class="parameter"><code>isleaf</code></em> <code class="type">boolean</code>,
          <em class="parameter"><code>level</code></em> <code class="type">integer</code> )
        </div>
        <div>
          Lists the tables or indexes in the partition tree of the given partitioned table or
          partitioned index, with one row for each partition. Information provided includes the OID
          of the partition, the OID of its immediate parent, a boolean value telling if the
          partition is a leaf, and an integer telling its level in the hierarchy. The level value is
          0 for the input table or index, 1 for its immediate child partitions, 2 for their
          partitions, and so on. Returns no rows if the relation does not exist or is not a
          partition or partitioned table.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.10.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_partition_ancestors</code> (
          <code class="type">regclass</code> ) → <code class="returnvalue">setof regclass</code>
        </div>
        <div>
          Lists the ancestor relations of the given partition, including the relation itself.
          Returns no rows if the relation does not exist or is not a partition or partitioned table.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.9.10.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_partition_root</code> ( <code class="type">regclass</code> ) →
          <code class="returnvalue">regclass</code>
        </div>
        <div>
          Returns the top-most parent of the partition tree to which the given relation belongs.
          Returns <code class="literal">NULL</code> if the relation does not exist or is not a
          partition or partitioned table.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

For example, to check the total size of the data contained in a partitioned table `measurement`, one could use the following query:

```

SELECT pg_size_pretty(sum(pg_relation_size(relid))) AS total_size
  FROM pg_partition_tree('measurement');
```

[#id](#FUNCTIONS-ADMIN-INDEX)

### 9.27.8. Index Maintenance Functions [#](#FUNCTIONS-ADMIN-INDEX)

[Table 9.100](functions-admin#FUNCTIONS-ADMIN-INDEX-TABLE) shows the functions available for index maintenance tasks. (Note that these maintenance tasks are normally done automatically by autovacuum; use of these functions is only required in special cases.) These functions cannot be executed during recovery. Use of these functions is restricted to superusers and the owner of the given index.

[#id](#FUNCTIONS-ADMIN-INDEX-TABLE)

**Table 9.100. Index Maintenance Functions**

<figure class="table-wrapper">
<table class="table" summary="Index Maintenance Functions" border="1">
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
          <a id="id-1.5.8.33.10.3.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">brin_summarize_new_values</code> (
          <em class="parameter"><code>index</code></em> <code class="type">regclass</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Scans the specified BRIN index to find page ranges in the base table that are not
          currently summarized by the index; for any such range it creates a new summary index tuple
          by scanning those table pages. Returns the number of new page range summaries that were
          inserted into the index.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.10.3.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">brin_summarize_range</code> (
          <em class="parameter"><code>index</code></em> <code class="type">regclass</code>,
          <em class="parameter"><code>blockNumber</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">integer</code>
        </div>
        <div>
          Summarizes the page range covering the given block, if not already summarized. This is
          like <code class="function">brin_summarize_new_values</code> except that it only processes
          the page range that covers the given table block number.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.10.3.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">brin_desummarize_range</code> (
          <em class="parameter"><code>index</code></em> <code class="type">regclass</code>,
          <em class="parameter"><code>blockNumber</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Removes the BRIN index tuple that summarizes the page range covering the given table
          block, if there is one.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.10.3.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">gin_clean_pending_list</code> (
          <em class="parameter"><code>index</code></em> <code class="type">regclass</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <div>
          Cleans up the <span class="quote">“<span class="quote">pending</span>”</span> list of the
          specified GIN index by moving entries in it, in bulk, to the main GIN data structure.
          Returns the number of pages removed from the pending list. If the argument is a GIN index
          built with the <code class="literal">fastupdate</code> option disabled, no cleanup happens
          and the result is zero, because the index doesn't have a pending list. See
          <a
            class="xref"
            href="gin-implementation.html#GIN-FAST-UPDATE"
            title="70.4.1. GIN Fast Update Technique">Section 70.4.1</a>
          and
          <a class="xref" href="gin-tips.html" title="70.5. GIN Tips and Tricks">Section 70.5</a>
          for details about the pending list and <code class="literal">fastupdate</code>
          option.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-ADMIN-GENFILE)

### 9.27.9. Generic File Access Functions [#](#FUNCTIONS-ADMIN-GENFILE)

The functions shown in [Table 9.101](functions-admin#FUNCTIONS-ADMIN-GENFILE-TABLE) provide native access to files on the machine hosting the server. Only files within the database cluster directory and the `log_directory` can be accessed, unless the user is a superuser or is granted the role `pg_read_server_files`. Use a relative path for files in the cluster directory, and a path matching the `log_directory` configuration setting for log files.

Note that granting users the EXECUTE privilege on `pg_read_file()`, or related functions, allows them the ability to read any file on the server that the database server process can read; these functions bypass all in-database privilege checks. This means that, for example, a user with such access is able to read the contents of the `pg_authid` table where authentication information is stored, as well as read any table data in the database. Therefore, granting access to these functions should be carefully considered.

When granting privilege on these functions, note that the table entries showing optional parameters are mostly implemented as several physical functions with different parameter lists. Privilege must be granted separately on each such function, if it is to be used. psql's `\df` command can be useful to check what the actual function signatures are.

Some of these functions take an optional _`missing_ok`_ parameter, which specifies the behavior when the file or directory does not exist. If `true`, the function returns `NULL` or an empty result set, as appropriate. If `false`, an error is raised. (Failure conditions other than “file not found” are reported as errors in any case.) The default is `false`.

[#id](#FUNCTIONS-ADMIN-GENFILE-TABLE)

**Table 9.101. Generic File Access Functions**

<figure class="table-wrapper">
<table class="table" summary="Generic File Access Functions" border="1">
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
          <a id="id-1.5.8.33.11.6.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_ls_dir</code> ( <em class="parameter"><code>dirname</code></em>
          <code class="type">text</code> [<span class="optional">, <em class="parameter"><code>missing_ok</code></em> <code class="type">boolean</code>,
            <em class="parameter"><code>include_dot_dirs</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">setof text</code>
        </div>
        <div>
          Returns the names of all files (and directories and other special files) in the specified
          directory. The <em class="parameter"><code>include_dot_dirs</code></em> parameter
          indicates whether <span class="quote">“<span class="quote">.</span>”</span> and
          <span class="quote">“<span class="quote">..</span>”</span> are to be included in the
          result set; the default is to exclude them. Including them can be useful when
          <em class="parameter"><code>missing_ok</code></em> is <code class="literal">true</code>,
          to distinguish an empty directory from a non-existent directory.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.11.6.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_ls_logdir</code> () →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>size</code></em> <code class="type">bigint</code>,
          <em class="parameter"><code>modification</code></em>
          <code class="type">timestamp with time zone</code> )
        </div>
        <div>
          Returns the name, size, and last modification time (mtime) of each ordinary file in the
          server's log directory. Filenames beginning with a dot, directories, and other special
          files are excluded.
        </div>
        <div>
          This function is restricted to superusers and roles with privileges of the
          <code class="literal">pg_monitor</code> role by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.11.6.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_ls_waldir</code> () →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>size</code></em> <code class="type">bigint</code>,
          <em class="parameter"><code>modification</code></em>
          <code class="type">timestamp with time zone</code> )
        </div>
        <div>
          Returns the name, size, and last modification time (mtime) of each ordinary file in the
          server's write-ahead log (WAL) directory. Filenames beginning with a dot, directories, and
          other special files are excluded.
        </div>
        <div>
          This function is restricted to superusers and roles with privileges of the
          <code class="literal">pg_monitor</code> role by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.11.6.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_ls_logicalmapdir</code> () →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>size</code></em> <code class="type">bigint</code>,
          <em class="parameter"><code>modification</code></em>
          <code class="type">timestamp with time zone</code> )
        </div>
        <div>
          Returns the name, size, and last modification time (mtime) of each ordinary file in the
          server's <code class="filename">pg_logical/mappings</code>
          directory. Filenames beginning with a dot, directories, and other special files are
          excluded.
        </div>
        <div>
          This function is restricted to superusers and members of the
          <code class="literal">pg_monitor</code> role by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.11.6.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_ls_logicalsnapdir</code> () →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>size</code></em> <code class="type">bigint</code>,
          <em class="parameter"><code>modification</code></em>
          <code class="type">timestamp with time zone</code> )
        </div>
        <div>
          Returns the name, size, and last modification time (mtime) of each ordinary file in the
          server's <code class="filename">pg_logical/snapshots</code>
          directory. Filenames beginning with a dot, directories, and other special files are
          excluded.
        </div>
        <div>
          This function is restricted to superusers and members of the
          <code class="literal">pg_monitor</code> role by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.11.6.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">pg_ls_replslotdir</code> (
          <em class="parameter"><code>slot_name</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>size</code></em> <code class="type">bigint</code>,
          <em class="parameter"><code>modification</code></em>
          <code class="type">timestamp with time zone</code> )
        </div>
        <div>
          Returns the name, size, and last modification time (mtime) of each ordinary file in the
          server's <code class="filename">pg_replslot/slot_name</code> directory, where
          <em class="parameter"><code>slot_name</code></em> is the name of the replication slot
          provided as input of the function. Filenames beginning with a dot, directories, and other
          special files are excluded.
        </div>
        <div>
          This function is restricted to superusers and members of the
          <code class="literal">pg_monitor</code> role by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.11.6.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">pg_ls_archive_statusdir</code> () →
          <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>size</code></em> <code class="type">bigint</code>,
          <em class="parameter"><code>modification</code></em>
          <code class="type">timestamp with time zone</code> )
        </div>
        <div>
          Returns the name, size, and last modification time (mtime) of each ordinary file in the
          server's WAL archive status directory (<code class="filename">pg_wal/archive_status</code>). Filenames beginning with a dot, directories, and other special files are excluded.
        </div>
        <div>
          This function is restricted to superusers and members of the
          <code class="literal">pg_monitor</code> role by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.11.6.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">pg_ls_tmpdir</code> ( [<span class="optional">
            <em class="parameter"><code>tablespace</code></em> <code class="type">oid</code> </span>] ) → <code class="returnvalue">setof record</code> (
          <em class="parameter"><code>name</code></em> <code class="type">text</code>,
          <em class="parameter"><code>size</code></em> <code class="type">bigint</code>,
          <em class="parameter"><code>modification</code></em>
          <code class="type">timestamp with time zone</code> )
        </div>
        <div>
          Returns the name, size, and last modification time (mtime) of each ordinary file in the
          temporary file directory for the specified
          <em class="parameter"><code>tablespace</code></em>. If <em class="parameter"><code>tablespace</code></em> is not provided, the
          <code class="literal">pg_default</code> tablespace is examined. Filenames beginning with a
          dot, directories, and other special files are excluded.
        </div>
        <div>
          This function is restricted to superusers and members of the
          <code class="literal">pg_monitor</code> role by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.11.6.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">pg_read_file</code> (
          <em class="parameter"><code>filename</code></em> <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>offset</code></em> <code class="type">bigint</code>,
            <em class="parameter"><code>length</code></em> <code class="type">bigint</code> </span>] [<span class="optional">, <em class="parameter"><code>missing_ok</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns all or part of a text file, starting at the given byte
          <em class="parameter"><code>offset</code></em>, returning at most <em class="parameter"><code>length</code></em> bytes (less if the end
          of file is reached first). If <em class="parameter"><code>offset</code></em> is negative,
          it is relative to the end of the file. If
          <em class="parameter"><code>offset</code></em> and
          <em class="parameter"><code>length</code></em> are omitted, the entire file is returned.
          The bytes read from the file are interpreted as a string in the database's encoding; an
          error is thrown if they are not valid in that encoding.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.11.6.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">pg_read_binary_file</code> (
          <em class="parameter"><code>filename</code></em> <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>offset</code></em> <code class="type">bigint</code>,
            <em class="parameter"><code>length</code></em> <code class="type">bigint</code> </span>] [<span class="optional">, <em class="parameter"><code>missing_ok</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">bytea</code>
        </div>
        <div>
          Returns all or part of a file. This function is identical to
          <code class="function">pg_read_file</code> except that it can read arbitrary binary data,
          returning the result as <code class="type">bytea</code> not
          <code class="type">text</code>; accordingly, no encoding checks are performed.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
        <div>
          In combination with the <code class="function">convert_from</code> function, this function
          can be used to read a text file in a specified encoding and convert to the database's
          encoding:
        </div>
        <pre class="programlisting">
SELECT convert_from(pg_read_binary_file('file_in_utf8.txt'), 'UTF8');
</pre>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.11.6.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_file</code> (
          <em class="parameter"><code>filename</code></em> <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>missing_ok</code></em>
            <code class="type">boolean</code> </span>] ) → <code class="returnvalue">record</code> (
          <em class="parameter"><code>size</code></em> <code class="type">bigint</code>,
          <em class="parameter"><code>access</code></em>
          <code class="type">timestamp with time zone</code>,
          <em class="parameter"><code>modification</code></em>
          <code class="type">timestamp with time zone</code>,
          <em class="parameter"><code>change</code></em>
          <code class="type">timestamp with time zone</code>,
          <em class="parameter"><code>creation</code></em>
          <code class="type">timestamp with time zone</code>,
          <em class="parameter"><code>isdir</code></em> <code class="type">boolean</code> )
        </div>
        <div>
          Returns a record containing the file's size, last access time stamp, last modification
          time stamp, last file status change time stamp (Unix platforms only), file creation time
          stamp (Windows only), and a flag indicating if it is a directory.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#FUNCTIONS-ADVISORY-LOCKS)

### 9.27.10. Advisory Lock Functions [#](#FUNCTIONS-ADVISORY-LOCKS)

The functions shown in [Table 9.102](functions-admin#FUNCTIONS-ADVISORY-LOCKS-TABLE) manage advisory locks. For details about proper use of these functions, see [Section 13.3.5](explicit-locking#ADVISORY-LOCKS).

All these functions are intended to be used to lock application-defined resources, which can be identified either by a single 64-bit key value or two 32-bit key values (note that these two key spaces do not overlap). If another session already holds a conflicting lock on the same resource identifier, the functions will either wait until the resource becomes available, or return a `false` result, as appropriate for the function. Locks can be either shared or exclusive: a shared lock does not conflict with other shared locks on the same resource, only with exclusive locks. Locks can be taken at session level (so that they are held until released or the session ends) or at transaction level (so that they are held until the current transaction ends; there is no provision for manual release). Multiple session-level lock requests stack, so that if the same resource identifier is locked three times there must then be three unlock requests to release the resource in advance of session end.

[#id](#FUNCTIONS-ADVISORY-LOCKS-TABLE)

**Table 9.102. Advisory Lock Functions**

<figure class="table-wrapper">
<table class="table" summary="Advisory Lock Functions" border="1">
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
          <a id="id-1.5.8.33.12.4.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_advisory_lock</code> (
          <em class="parameter"><code>key</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_advisory_lock</code> (
          <em class="parameter"><code>key1</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>key2</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>Obtains an exclusive session-level advisory lock, waiting if necessary.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.12.4.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_advisory_lock_shared</code> (
          <em class="parameter"><code>key</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_advisory_lock_shared</code> (
          <em class="parameter"><code>key1</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>key2</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>Obtains a shared session-level advisory lock, waiting if necessary.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.12.4.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_advisory_unlock</code> (
          <em class="parameter"><code>key</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_advisory_unlock</code> (
          <em class="parameter"><code>key1</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>key2</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Releases a previously-acquired exclusive session-level advisory lock. Returns
          <code class="literal">true</code> if the lock is successfully released. If the lock was
          not held, <code class="literal">false</code> is returned, and in addition, an SQL warning
          will be reported by the server.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.12.4.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_advisory_unlock_all</code> () →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Releases all session-level advisory locks held by the current session. (This function is
          implicitly invoked at session end, even if the client disconnects ungracefully.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.12.4.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_advisory_unlock_shared</code> (
          <em class="parameter"><code>key</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_advisory_unlock_shared</code> (
          <em class="parameter"><code>key1</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>key2</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Releases a previously-acquired shared session-level advisory lock. Returns
          <code class="literal">true</code> if the lock is successfully released. If the lock was
          not held, <code class="literal">false</code> is returned, and in addition, an SQL warning
          will be reported by the server.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.12.4.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">pg_advisory_xact_lock</code> (
          <em class="parameter"><code>key</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_advisory_xact_lock</code> (
          <em class="parameter"><code>key1</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>key2</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>Obtains an exclusive transaction-level advisory lock, waiting if necessary.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.12.4.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">pg_advisory_xact_lock_shared</code> (
          <em class="parameter"><code>key</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_advisory_xact_lock_shared</code> (
          <em class="parameter"><code>key1</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>key2</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>Obtains a shared transaction-level advisory lock, waiting if necessary.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.12.4.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">pg_try_advisory_lock</code> (
          <em class="parameter"><code>key</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_try_advisory_lock</code> (
          <em class="parameter"><code>key1</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>key2</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Obtains an exclusive session-level advisory lock if available. This will either obtain the
          lock immediately and return <code class="literal">true</code>, or return
          <code class="literal">false</code>
          without waiting if the lock cannot be acquired immediately.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.12.4.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">pg_try_advisory_lock_shared</code> (
          <em class="parameter"><code>key</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_try_advisory_lock_shared</code> (
          <em class="parameter"><code>key1</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>key2</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Obtains a shared session-level advisory lock if available. This will either obtain the
          lock immediately and return <code class="literal">true</code>, or return
          <code class="literal">false</code>
          without waiting if the lock cannot be acquired immediately.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.12.4.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">pg_try_advisory_xact_lock</code> (
          <em class="parameter"><code>key</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_try_advisory_xact_lock</code> (
          <em class="parameter"><code>key1</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>key2</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Obtains an exclusive transaction-level advisory lock if available. This will either obtain
          the lock immediately and return <code class="literal">true</code>, or return
          <code class="literal">false</code>
          without waiting if the lock cannot be acquired immediately.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.5.8.33.12.4.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">pg_try_advisory_xact_lock_shared</code> (
          <em class="parameter"><code>key</code></em> <code class="type">bigint</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div class="func_signature">
          <code class="function">pg_try_advisory_xact_lock_shared</code> (
          <em class="parameter"><code>key1</code></em> <code class="type">integer</code>,
          <em class="parameter"><code>key2</code></em> <code class="type">integer</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <div>
          Obtains a shared transaction-level advisory lock if available. This will either obtain the
          lock immediately and return <code class="literal">true</code>, or return
          <code class="literal">false</code>
          without waiting if the lock cannot be acquired immediately.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

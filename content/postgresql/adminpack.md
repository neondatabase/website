[#id](#ADMINPACK)

## F.1. adminpack — pgAdmin support toolpack [#](#ADMINPACK)

`adminpack` provides a number of support functions which pgAdmin and other administration and management tools can use to provide additional functionality, such as remote management of server log files. Use of all these functions is only allowed to database superusers by default, but may be allowed to other users by using the `GRANT` command.

The functions shown in [Table F.1](adminpack#FUNCTIONS-ADMINPACK-TABLE) provide write access to files on the machine hosting the server. (See also the functions in [Table 9.101](functions-admin#FUNCTIONS-ADMIN-GENFILE-TABLE), which provide read-only access.) Only files within the database cluster directory can be accessed, unless the user is a superuser or given privileges of one of the `pg_read_server_files` or `pg_write_server_files` roles, as appropriate for the function, but either a relative or absolute path is allowable.

[#id](#FUNCTIONS-ADMINPACK-TABLE)

**Table F.1. `adminpack` Functions**

<table class="table" summary="adminpack Functions" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function</div>
        <p>Description</p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">pg_catalog.pg_file_write</code> (
          <em class="parameter"><code>filename</code></em> <code class="type">text</code>,
          <em class="parameter"><code>data</code></em> <code class="type">text</code>,
          <em class="parameter"><code>append</code></em> <code class="type">boolean</code> ) →
          <code class="returnvalue">bigint</code>
        </div>
        <p>Writes, or appends to, a text file.</p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">pg_catalog.pg_file_sync</code> (
          <em class="parameter"><code>filename</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <p>Flushes a file or directory to disk.</p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">pg_catalog.pg_file_rename</code> (
          <em class="parameter"><code>oldname</code></em> <code class="type">text</code>,
          <em class="parameter"><code>newname</code></em> <code class="type">text</code> [<span
            class="optional">, <em class="parameter"><code>archivename</code></em>
            <code class="type">text</code> </span>] ) → <code class="returnvalue">boolean</code>
        </div>
        <p>Renames a file.</p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">pg_catalog.pg_file_unlink</code> (
          <em class="parameter"><code>filename</code></em> <code class="type">text</code> ) →
          <code class="returnvalue">boolean</code>
        </div>
        <p>Removes a file.</p>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">pg_catalog.pg_logdir_ls</code> () →
          <code class="returnvalue">setof record</code>
        </div>
        <p>Lists the log files in the <code class="varname">log_directory</code> directory.</p>
      </td>
    </tr>
  </tbody>
</table>

`pg_file_write` writes the specified _`data`_ into the file named by _`filename`_. If _`append`_ is false, the file must not already exist. If _`append`_ is true, the file can already exist, and will be appended to if so. Returns the number of bytes written.

`pg_file_sync` fsyncs the specified file or directory named by _`filename`_. An error is thrown on failure (e.g., the specified file is not present). Note that [data_sync_retry](runtime-config-error-handling#GUC-DATA-SYNC-RETRY) has no effect on this function, and therefore a PANIC-level error will not be raised even on failure to flush database files.

`pg_file_rename` renames a file. If _`archivename`_ is omitted or NULL, it simply renames _`oldname`_ to _`newname`_ (which must not already exist). If _`archivename`_ is provided, it first renames _`newname`_ to _`archivename`_ (which must not already exist), and then renames _`oldname`_ to _`newname`_. In event of failure of the second rename step, it will try to rename _`archivename`_ back to _`newname`_ before reporting the error. Returns true on success, false if the source file(s) are not present or not writable; other cases throw errors.

`pg_file_unlink` removes the specified file. Returns true on success, false if the specified file is not present or the `unlink()` call fails; other cases throw errors.

`pg_logdir_ls` returns the start timestamps and path names of all the log files in the [log_directory](runtime-config-logging#GUC-LOG-DIRECTORY) directory. The [log_filename](runtime-config-logging#GUC-LOG-FILENAME) parameter must have its default setting (`postgresql-%Y-%m-%d_%H%M%S.log`) to use this function.

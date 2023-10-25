

|                    F.1. adminpack — pgAdmin support toolpack                   |                                                                             |                                                        |                                                       |                                                                                    |
| :----------------------------------------------------------------------------: | :-------------------------------------------------------------------------- | :----------------------------------------------------: | ----------------------------------------------------: | ---------------------------------------------------------------------------------: |
| [Prev](contrib.html "Appendix F. Additional Supplied Modules and Extensions")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") | Appendix F. Additional Supplied Modules and Extensions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](amcheck.html "F.2. amcheck — tools to verify table and index consistency") |

***

## F.1. adminpack — pgAdmin support toolpack [#](#ADMINPACK)

`adminpack` provides a number of support functions which pgAdmin and other administration and management tools can use to provide additional functionality, such as remote management of server log files. Use of all these functions is only allowed to database superusers by default, but may be allowed to other users by using the `GRANT` command.

The functions shown in [Table F.1](adminpack.html#FUNCTIONS-ADMINPACK-TABLE "Table F.1. adminpack Functions") provide write access to files on the machine hosting the server. (See also the functions in [Table 9.101](functions-admin.html#FUNCTIONS-ADMIN-GENFILE-TABLE "Table 9.101. Generic File Access Functions"), which provide read-only access.) Only files within the database cluster directory can be accessed, unless the user is a superuser or given privileges of one of the `pg_read_server_files` or `pg_write_server_files` roles, as appropriate for the function, but either a relative or absolute path is allowable.

**Table F.1. `adminpack` Functions**

| FunctionDescription                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------- |
| `pg_catalog.pg_file_write` ( *`filename`* `text`, *`data`* `text`, *`append`* `boolean` ) → `bigint`Writes, or appends to, a text file. |
| `pg_catalog.pg_file_sync` ( *`filename`* `text` ) → `void`Flushes a file or directory to disk.                                          |
| `pg_catalog.pg_file_rename` ( *`oldname`* `text`, *`newname`* `text` \[, *`archivename`* `text` ] ) → `boolean`Renames a file.          |
| `pg_catalog.pg_file_unlink` ( *`filename`* `text` ) → `boolean`Removes a file.                                                          |
| `pg_catalog.pg_logdir_ls` () → `setof record`Lists the log files in the `log_directory` directory.                                      |

\

`pg_file_write` writes the specified *`data`* into the file named by *`filename`*. If *`append`* is false, the file must not already exist. If *`append`* is true, the file can already exist, and will be appended to if so. Returns the number of bytes written.

`pg_file_sync` fsyncs the specified file or directory named by *`filename`*. An error is thrown on failure (e.g., the specified file is not present). Note that [data\_sync\_retry](runtime-config-error-handling.html#GUC-DATA-SYNC-RETRY) has no effect on this function, and therefore a PANIC-level error will not be raised even on failure to flush database files.

`pg_file_rename` renames a file. If *`archivename`* is omitted or NULL, it simply renames *`oldname`* to *`newname`* (which must not already exist). If *`archivename`* is provided, it first renames *`newname`* to *`archivename`* (which must not already exist), and then renames *`oldname`* to *`newname`*. In event of failure of the second rename step, it will try to rename *`archivename`* back to *`newname`* before reporting the error. Returns true on success, false if the source file(s) are not present or not writable; other cases throw errors.

`pg_file_unlink` removes the specified file. Returns true on success, false if the specified file is not present or the `unlink()` call fails; other cases throw errors.

`pg_logdir_ls` returns the start timestamps and path names of all the log files in the [log\_directory](runtime-config-logging.html#GUC-LOG-DIRECTORY) directory. The [log\_filename](runtime-config-logging.html#GUC-LOG-FILENAME) parameter must have its default setting (`postgresql-%Y-%m-%d_%H%M%S.log`) to use this function.

***

|                                                                                |                                                                             |                                                                                    |
| :----------------------------------------------------------------------------- | :-------------------------------------------------------------------------: | ---------------------------------------------------------------------------------: |
| [Prev](contrib.html "Appendix F. Additional Supplied Modules and Extensions")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") |  [Next](amcheck.html "F.2. amcheck — tools to verify table and index consistency") |
| Appendix F. Additional Supplied Modules and Extensions                         |            [Home](index.html "PostgreSQL 17devel Documentation")            |                         F.2. amcheck — tools to verify table and index consistency |

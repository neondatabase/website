[#id](#ECPG-ERRORS)

## 36.8. Error Handling [#](#ECPG-ERRORS)

- [36.8.1. Setting Callbacks](ecpg-errors#ECPG-WHENEVER)
- [36.8.2. sqlca](ecpg-errors#ECPG-SQLCA)
- [36.8.3. `SQLSTATE` vs. `SQLCODE`](ecpg-errors#ECPG-SQLSTATE-SQLCODE)

This section describes how you can handle exceptional conditions and warnings in an embedded SQL program. There are two nonexclusive facilities for this.

- Callbacks can be configured to handle warning and error conditions using the `WHENEVER` command.
- Detailed information about the error or warning can be obtained from the `sqlca` variable.

[#id](#ECPG-WHENEVER)

### 36.8.1. Setting Callbacks [#](#ECPG-WHENEVER)

One simple method to catch errors and warnings is to set a specific action to be executed whenever a particular condition occurs. In general:

```

EXEC SQL WHENEVER condition action;
```

_`condition`_ can be one of the following:

- `SQLERROR` [#](#ECPG-WHENEVER-SQLERROR)

  The specified action is called whenever an error occurs during the execution of an SQL statement.

- `SQLWARNING` [#](#ECPG-WHENEVER-SQLWARNING)

  The specified action is called whenever a warning occurs during the execution of an SQL statement.

- `NOT FOUND` [#](#ECPG-WHENEVER-NOT-FOUND)

  The specified action is called whenever an SQL statement retrieves or affects zero rows. (This condition is not an error, but you might be interested in handling it specially.)

_`action`_ can be one of the following:

- `CONTINUE` [#](#ECPG-WHENEVER-CONTINUE)

  This effectively means that the condition is ignored. This is the default.

- `GOTO label``GO TO label` [#](#ECPG-WHENEVER-GOTO)

  Jump to the specified label (using a C `goto` statement).

- `SQLPRINT` [#](#ECPG-WHENEVER-SQLPRINT)

  Print a message to standard error. This is useful for simple programs or during prototyping. The details of the message cannot be configured.

- `STOP` [#](#ECPG-WHENEVER-STOP)

  Call `exit(1)`, which will terminate the program.

- `DO BREAK` [#](#ECPG-WHENEVER-DO-BREAK)

  Execute the C statement `break`. This should only be used in loops or `switch` statements.

- `DO CONTINUE` [#](#ECPG-WHENEVER-DO-CONTINUE)

  Execute the C statement `continue`. This should only be used in loops statements. if executed, will cause the flow of control to return to the top of the loop.

- `CALL name (args)``DO name (args)` [#](#ECPG-WHENEVER-CALL)

  Call the specified C functions with the specified arguments. (This use is different from the meaning of `CALL` and `DO` in the normal PostgreSQL grammar.)

The SQL standard only provides for the actions `CONTINUE` and `GOTO` (and `GO TO`).

Here is an example that you might want to use in a simple program. It prints a simple message when a warning occurs and aborts the program when an error happens:

```

EXEC SQL WHENEVER SQLWARNING SQLPRINT;
EXEC SQL WHENEVER SQLERROR STOP;
```

The statement `EXEC SQL WHENEVER` is a directive of the SQL preprocessor, not a C statement. The error or warning actions that it sets apply to all embedded SQL statements that appear below the point where the handler is set, unless a different action was set for the same condition between the first `EXEC SQL WHENEVER` and the SQL statement causing the condition, regardless of the flow of control in the C program. So neither of the two following C program excerpts will have the desired effect:

```

/*
 * WRONG
 */
int main(int argc, char *argv[])
{
    ...
    if (verbose) {
        EXEC SQL WHENEVER SQLWARNING SQLPRINT;
    }
    ...
    EXEC SQL SELECT ...;
    ...
}
```

```

/*
 * WRONG
 */
int main(int argc, char *argv[])
{
    ...
    set_error_handler();
    ...
    EXEC SQL SELECT ...;
    ...
}

static void set_error_handler(void)
{
    EXEC SQL WHENEVER SQLERROR STOP;
}
```

[#id](#ECPG-SQLCA)

### 36.8.2. sqlca [#](#ECPG-SQLCA)

For more powerful error handling, the embedded SQL interface provides a global variable with the name `sqlca` (SQL communication area) that has the following structure:

```

struct
{
    char sqlcaid[8];
    long sqlabc;
    long sqlcode;
    struct
    {
        int sqlerrml;
        char sqlerrmc[SQLERRMC_LEN];
    } sqlerrm;
    char sqlerrp[8];
    long sqlerrd[6];
    char sqlwarn[8];
    char sqlstate[5];
} sqlca;
```

(In a multithreaded program, every thread automatically gets its own copy of `sqlca`. This works similarly to the handling of the standard C global variable `errno`.)

`sqlca` covers both warnings and errors. If multiple warnings or errors occur during the execution of a statement, then `sqlca` will only contain information about the last one.

If no error occurred in the last SQL statement, `sqlca.sqlcode` will be 0 and `sqlca.sqlstate` will be `"00000"`. If a warning or error occurred, then `sqlca.sqlcode` will be negative and `sqlca.sqlstate` will be different from `"00000"`. A positive `sqlca.sqlcode` indicates a harmless condition, such as that the last query returned zero rows. `sqlcode` and `sqlstate` are two different error code schemes; details appear below.

If the last SQL statement was successful, then `sqlca.sqlerrd[1]` contains the OID of the processed row, if applicable, and `sqlca.sqlerrd[2]` contains the number of processed or returned rows, if applicable to the command.

In case of an error or warning, `sqlca.sqlerrm.sqlerrmc` will contain a string that describes the error. The field `sqlca.sqlerrm.sqlerrml` contains the length of the error message that is stored in `sqlca.sqlerrm.sqlerrmc` (the result of `strlen()`, not really interesting for a C programmer). Note that some messages are too long to fit in the fixed-size `sqlerrmc` array; they will be truncated.

In case of a warning, `sqlca.sqlwarn[2]` is set to `W`. (In all other cases, it is set to something different from `W`.) If `sqlca.sqlwarn[1]` is set to `W`, then a value was truncated when it was stored in a host variable. `sqlca.sqlwarn[0]` is set to `W` if any of the other elements are set to indicate a warning.

The fields `sqlcaid`, `sqlabc`, `sqlerrp`, and the remaining elements of `sqlerrd` and `sqlwarn` currently contain no useful information.

The structure `sqlca` is not defined in the SQL standard, but is implemented in several other SQL database systems. The definitions are similar at the core, but if you want to write portable applications, then you should investigate the different implementations carefully.

Here is one example that combines the use of `WHENEVER` and `sqlca`, printing out the contents of `sqlca` when an error occurs. This is perhaps useful for debugging or prototyping applications, before installing a more “user-friendly” error handler.

```

EXEC SQL WHENEVER SQLERROR CALL print_sqlca();

void
print_sqlca()
{
    fprintf(stderr, "==== sqlca ====\n");
    fprintf(stderr, "sqlcode: %ld\n", sqlca.sqlcode);
    fprintf(stderr, "sqlerrm.sqlerrml: %d\n", sqlca.sqlerrm.sqlerrml);
    fprintf(stderr, "sqlerrm.sqlerrmc: %s\n", sqlca.sqlerrm.sqlerrmc);
    fprintf(stderr, "sqlerrd: %ld %ld %ld %ld %ld %ld\n", sqlca.sqlerrd[0],sqlca.sqlerrd[1],sqlca.sqlerrd[2],
                                                          sqlca.sqlerrd[3],sqlca.sqlerrd[4],sqlca.sqlerrd[5]);
    fprintf(stderr, "sqlwarn: %d %d %d %d %d %d %d %d\n", sqlca.sqlwarn[0], sqlca.sqlwarn[1], sqlca.sqlwarn[2],
                                                          sqlca.sqlwarn[3], sqlca.sqlwarn[4], sqlca.sqlwarn[5],
                                                          sqlca.sqlwarn[6], sqlca.sqlwarn[7]);
    fprintf(stderr, "sqlstate: %5s\n", sqlca.sqlstate);
    fprintf(stderr, "===============\n");
}
```

The result could look as follows (here an error due to a misspelled table name):

```

==== sqlca ====
sqlcode: -400
sqlerrm.sqlerrml: 49
sqlerrm.sqlerrmc: relation "pg_databasep" does not exist on line 38
sqlerrd: 0 0 0 0 0 0
sqlwarn: 0 0 0 0 0 0 0 0
sqlstate: 42P01
===============
```

[#id](#ECPG-SQLSTATE-SQLCODE)

### 36.8.3. `SQLSTATE` vs. `SQLCODE` [#](#ECPG-SQLSTATE-SQLCODE)

The fields `sqlca.sqlstate` and `sqlca.sqlcode` are two different schemes that provide error codes. Both are derived from the SQL standard, but `SQLCODE` has been marked deprecated in the SQL-92 edition of the standard and has been dropped in later editions. Therefore, new applications are strongly encouraged to use `SQLSTATE`.

`SQLSTATE` is a five-character array. The five characters contain digits or upper-case letters that represent codes of various error and warning conditions. `SQLSTATE` has a hierarchical scheme: the first two characters indicate the general class of the condition, the last three characters indicate a subclass of the general condition. A successful state is indicated by the code `00000`. The `SQLSTATE` codes are for the most part defined in the SQL standard. The PostgreSQL server natively supports `SQLSTATE` error codes; therefore a high degree of consistency can be achieved by using this error code scheme throughout all applications. For further information see [Appendix A](errcodes-appendix).

`SQLCODE`, the deprecated error code scheme, is a simple integer. A value of 0 indicates success, a positive value indicates success with additional information, a negative value indicates an error. The SQL standard only defines the positive value +100, which indicates that the last command returned or affected zero rows, and no specific negative values. Therefore, this scheme can only achieve poor portability and does not have a hierarchical code assignment. Historically, the embedded SQL processor for PostgreSQL has assigned some specific `SQLCODE` values for its use, which are listed below with their numeric value and their symbolic name. Remember that these are not portable to other SQL implementations. To simplify the porting of applications to the `SQLSTATE` scheme, the corresponding `SQLSTATE` is also listed. There is, however, no one-to-one or one-to-many mapping between the two schemes (indeed it is many-to-many), so you should consult the global `SQLSTATE` listing in [Appendix A](errcodes-appendix) in each case.

These are the assigned `SQLCODE` values:

- 0 (`ECPG_NO_ERROR`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-NO-ERROR)

  Indicates no error. (SQLSTATE 00000)

- 100 (`ECPG_NOT_FOUND`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-NOT-FOUND)

  This is a harmless condition indicating that the last command retrieved or processed zero rows, or that you are at the end of the cursor. (SQLSTATE 02000)

  When processing a cursor in a loop, you could use this code as a way to detect when to abort the loop, like this:

  ```

  while (1)
  {
      EXEC SQL FETCH ... ;
      if (sqlca.sqlcode == ECPG_NOT_FOUND)
          break;
  }
  ```

  But `WHENEVER NOT FOUND DO BREAK` effectively does this internally, so there is usually no advantage in writing this out explicitly.

- -12 (`ECPG_OUT_OF_MEMORY`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-OUT-OF-MEMORY)

  Indicates that your virtual memory is exhausted. The numeric value is defined as `-ENOMEM`. (SQLSTATE YE001)

- -200 (`ECPG_UNSUPPORTED`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-UNSUPPORTED)

  Indicates the preprocessor has generated something that the library does not know about. Perhaps you are running incompatible versions of the preprocessor and the library. (SQLSTATE YE002)

- -201 (`ECPG_TOO_MANY_ARGUMENTS`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-TOO-MANY-ARGUMENTS)

  This means that the command specified more host variables than the command expected. (SQLSTATE 07001 or 07002)

- -202 (`ECPG_TOO_FEW_ARGUMENTS`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-TOO-FEW-ARGUMENTS)

  This means that the command specified fewer host variables than the command expected. (SQLSTATE 07001 or 07002)

- -203 (`ECPG_TOO_MANY_MATCHES`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-TOO-MANY-MATCHES)

  This means a query has returned multiple rows but the statement was only prepared to store one result row (for example, because the specified variables are not arrays). (SQLSTATE 21000)

- -204 (`ECPG_INT_FORMAT`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-INT-FORMAT)

  The host variable is of type `int` and the datum in the database is of a different type and contains a value that cannot be interpreted as an `int`. The library uses `strtol()` for this conversion. (SQLSTATE 42804)

- -205 (`ECPG_UINT_FORMAT`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-UINT-FORMAT)

  The host variable is of type `unsigned int` and the datum in the database is of a different type and contains a value that cannot be interpreted as an `unsigned int`. The library uses `strtoul()` for this conversion. (SQLSTATE 42804)

- -206 (`ECPG_FLOAT_FORMAT`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-FLOAT-FORMAT)

  The host variable is of type `float` and the datum in the database is of another type and contains a value that cannot be interpreted as a `float`. The library uses `strtod()` for this conversion. (SQLSTATE 42804)

- -207 (`ECPG_NUMERIC_FORMAT`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-NUMERIC-FORMAT)

  The host variable is of type `numeric` and the datum in the database is of another type and contains a value that cannot be interpreted as a `numeric` value. (SQLSTATE 42804)

- -208 (`ECPG_INTERVAL_FORMAT`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-INTERVAL-FORMAT)

  The host variable is of type `interval` and the datum in the database is of another type and contains a value that cannot be interpreted as an `interval` value. (SQLSTATE 42804)

- -209 (`ECPG_DATE_FORMAT`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-DATE-FORMAT)

  The host variable is of type `date` and the datum in the database is of another type and contains a value that cannot be interpreted as a `date` value. (SQLSTATE 42804)

- -210 (`ECPG_TIMESTAMP_FORMAT`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-TIMESTAMP-FORMAT)

  The host variable is of type `timestamp` and the datum in the database is of another type and contains a value that cannot be interpreted as a `timestamp` value. (SQLSTATE 42804)

- -211 (`ECPG_CONVERT_BOOL`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-CONVERT-BOOL)

  This means the host variable is of type `bool` and the datum in the database is neither `'t'` nor `'f'`. (SQLSTATE 42804)

- -212 (`ECPG_EMPTY`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-EMPTY)

  The statement sent to the PostgreSQL server was empty. (This cannot normally happen in an embedded SQL program, so it might point to an internal error.) (SQLSTATE YE002)

- -213 (`ECPG_MISSING_INDICATOR`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-MISSING-INDICATOR)

  A null value was returned and no null indicator variable was supplied. (SQLSTATE 22002)

- -214 (`ECPG_NO_ARRAY`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-NO-ARRAY)

  An ordinary variable was used in a place that requires an array. (SQLSTATE 42804)

- -215 (`ECPG_DATA_NOT_ARRAY`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-DATA-NOT-ARRAY)

  The database returned an ordinary variable in a place that requires array value. (SQLSTATE 42804)

- -216 (`ECPG_ARRAY_INSERT`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-ARRAY-INSERT)

  The value could not be inserted into the array. (SQLSTATE 42804)

- -220 (`ECPG_NO_CONN`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-NO-CONN)

  The program tried to access a connection that does not exist. (SQLSTATE 08003)

- -221 (`ECPG_NOT_CONN`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-NOT-CONN)

  The program tried to access a connection that does exist but is not open. (This is an internal error.) (SQLSTATE YE002)

- -230 (`ECPG_INVALID_STMT`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-INVALID-STMT)

  The statement you are trying to use has not been prepared. (SQLSTATE 26000)

- -239 (`ECPG_INFORMIX_DUPLICATE_KEY`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-INFORMIX-DUPLICATE-KEY)

  Duplicate key error, violation of unique constraint (Informix compatibility mode). (SQLSTATE 23505)

- -240 (`ECPG_UNKNOWN_DESCRIPTOR`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-UNKNOWN-DESCRIPTOR)

  The descriptor specified was not found. The statement you are trying to use has not been prepared. (SQLSTATE 33000)

- -241 (`ECPG_INVALID_DESCRIPTOR_INDEX`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-INVALID-DESCRIPTOR-INDEX)

  The descriptor index specified was out of range. (SQLSTATE 07009)

- -242 (`ECPG_UNKNOWN_DESCRIPTOR_ITEM`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-UNKNOWN-DESCRIPTOR-ITEM)

  An invalid descriptor item was requested. (This is an internal error.) (SQLSTATE YE002)

- -243 (`ECPG_VAR_NOT_NUMERIC`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-VAR-NOT-NUMERIC)

  During the execution of a dynamic statement, the database returned a numeric value and the host variable was not numeric. (SQLSTATE 07006)

- -244 (`ECPG_VAR_NOT_CHAR`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-VAR-NOT-CHAR)

  During the execution of a dynamic statement, the database returned a non-numeric value and the host variable was numeric. (SQLSTATE 07006)

- -284 (`ECPG_INFORMIX_SUBSELECT_NOT_ONE`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-INFORMIX-SUBSELECT-NOT-ONE)

  A result of the subquery is not single row (Informix compatibility mode). (SQLSTATE 21000)

- -400 (`ECPG_PGSQL`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-PGSQL)

  Some error caused by the PostgreSQL server. The message contains the error message from the PostgreSQL server.

- -401 (`ECPG_TRANS`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-TRANS)

  The PostgreSQL server signaled that we cannot start, commit, or rollback the transaction. (SQLSTATE 08007)

- -402 (`ECPG_CONNECT`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-CONNECT)

  The connection attempt to the database did not succeed. (SQLSTATE 08001)

- -403 (`ECPG_DUPLICATE_KEY`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-DUPLICATE-KEY)

  Duplicate key error, violation of unique constraint. (SQLSTATE 23505)

- -404 (`ECPG_SUBSELECT_NOT_ONE`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-SUBSELECT-NOT-ONE)

  A result for the subquery is not single row. (SQLSTATE 21000)

- -602 (`ECPG_WARNING_UNKNOWN_PORTAL`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-WARNING-UNKNOWN-PORTAL)

  An invalid cursor name was specified. (SQLSTATE 34000)

- -603 (`ECPG_WARNING_IN_TRANSACTION`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-WARNING-IN-TRANSACTION)

  Transaction is in progress. (SQLSTATE 25001)

- -604 (`ECPG_WARNING_NO_TRANSACTION`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-WARNING-NO-TRANSACTION)

  There is no active (in-progress) transaction. (SQLSTATE 25P01)

- -605 (`ECPG_WARNING_PORTAL_EXISTS`) [#](#ECPG-SQLSTATE-SQLCODE-ECPG-WARNING-PORTAL-EXISTS)

  An existing cursor name was specified. (SQLSTATE 42P03)

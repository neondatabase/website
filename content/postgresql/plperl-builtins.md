[#id](#PLPERL-BUILTINS)

## 45.3. Built-in Functions [#](#PLPERL-BUILTINS)

- [45.3.1. Database Access from PL/Perl](plperl-builtins#PLPERL-DATABASE)
- [45.3.2. Utility Functions in PL/Perl](plperl-builtins#PLPERL-UTILITY-FUNCTIONS)

[#id](#PLPERL-DATABASE)

### 45.3.1. Database Access from PL/Perl [#](#PLPERL-DATABASE)

Access to the database itself from your Perl function can be done via the following functions:

- `spi_exec_query(query [, limit])`

  `spi_exec_query` executes an SQL command and returns the entire row set as a reference to an array of hash references. If _`limit`_ is specified and is greater than zero, then `spi_exec_query` retrieves at most _`limit`_ rows, much as if the query included a `LIMIT` clause. Omitting _`limit`_ or specifying it as zero results in no row limit.

  _You should only use this command when you know that the result set will be relatively small._ Here is an example of a query (`SELECT` command) with the optional maximum number of rows:

  ```
  $rv = spi_exec_query('SELECT * FROM my_table', 5);
  ```

  This returns up to 5 rows from the table `my_table`. If `my_table` has a column `my_column`, you can get that value from row `$i` of the result like this:

  ```
  $foo = $rv->{rows}[$i]->{my_column};
  ```

  The total number of rows returned from a `SELECT` query can be accessed like this:

  ```
  $nrows = $rv->{processed}
  ```

  Here is an example using a different command type:

  ```
  $query = "INSERT INTO my_table VALUES (1, 'test')";
  $rv = spi_exec_query($query);
  ```

  You can then access the command status (e.g., `SPI_OK_INSERT`) like this:

  ```
  $res = $rv->{status};
  ```

  To get the number of rows affected, do:

  ```
  $nrows = $rv->{processed};
  ```

  Here is a complete example:

  ```
  CREATE TABLE test (
      i int,
      v varchar
  );

  INSERT INTO test (i, v) VALUES (1, 'first line');
  INSERT INTO test (i, v) VALUES (2, 'second line');
  INSERT INTO test (i, v) VALUES (3, 'third line');
  INSERT INTO test (i, v) VALUES (4, 'immortal');

  CREATE OR REPLACE FUNCTION test_munge() RETURNS SETOF test AS $$
      my $rv = spi_exec_query('select i, v from test;');
      my $status = $rv->{status};
      my $nrows = $rv->{processed};
      foreach my $rn (0 .. $nrows - 1) {
          my $row = $rv->{rows}[$rn];
          $row->{i} += 200 if defined($row->{i});
          $row->{v} =~ tr/A-Za-z/a-zA-Z/ if (defined($row->{v}));
          return_next($row);
      }
      return undef;
  $$ LANGUAGE plperl;

  SELECT * FROM test_munge();
  ```

- `spi_query(command)``spi_fetchrow(cursor)``spi_cursor_close(cursor)`

  `spi_query` and `spi_fetchrow` work together as a pair for row sets which might be large, or for cases where you wish to return rows as they arrive. `spi_fetchrow` works _only_ with `spi_query`. The following example illustrates how you use them together:

  ```
  CREATE TYPE foo_type AS (the_num INTEGER, the_text TEXT);

  CREATE OR REPLACE FUNCTION lotsa_md5 (INTEGER) RETURNS SETOF foo_type AS $$
      use Digest::MD5 qw(md5_hex);
      my $file = '/usr/share/dict/words';
      my $t = localtime;
      elog(NOTICE, "opening file $file at $t" );
      open my $fh, '<', $file # ooh, it's a file access!
          or elog(ERROR, "cannot open $file for reading: $!");
      my @words = <$fh>;
      close $fh;
      $t = localtime;
      elog(NOTICE, "closed file $file at $t");
      chomp(@words);
      my $row;
      my $sth = spi_query("SELECT * FROM generate_series(1,$_[0]) AS b(a)");
      while (defined ($row = spi_fetchrow($sth))) {
          return_next({
              the_num => $row->{a},
              the_text => md5_hex($words[rand @words])
          });
      }
      return;
  $$ LANGUAGE plperlu;

  SELECT * from lotsa_md5(500);
  ```

  Normally, `spi_fetchrow` should be repeated until it returns `undef`, indicating that there are no more rows to read. The cursor returned by `spi_query` is automatically freed when `spi_fetchrow` returns `undef`. If you do not wish to read all the rows, instead call `spi_cursor_close` to free the cursor. Failure to do so will result in memory leaks.

- `spi_prepare(command, argument types)``spi_query_prepared(plan, arguments)``spi_exec_prepared(plan [, attributes], arguments)``spi_freeplan(plan)`

  `spi_prepare`, `spi_query_prepared`, `spi_exec_prepared`, and `spi_freeplan` implement the same functionality but for prepared queries. `spi_prepare` accepts a query string with numbered argument placeholders ($1, $2, etc.) and a string list of argument types:

  ```
  $plan = spi_prepare('SELECT * FROM test WHERE id > $1 AND name = $2',
                                                       'INTEGER', 'TEXT');
  ```

  Once a query plan is prepared by a call to `spi_prepare`, the plan can be used instead of the string query, either in `spi_exec_prepared`, where the result is the same as returned by `spi_exec_query`, or in `spi_query_prepared` which returns a cursor exactly as `spi_query` does, which can be later passed to `spi_fetchrow`. The optional second parameter to `spi_exec_prepared` is a hash reference of attributes; the only attribute currently supported is `limit`, which sets the maximum number of rows returned from the query. Omitting `limit` or specifying it as zero results in no row limit.

  The advantage of prepared queries is that is it possible to use one prepared plan for more than one query execution. After the plan is not needed anymore, it can be freed with `spi_freeplan`:

  ```
  CREATE OR REPLACE FUNCTION init() RETURNS VOID AS $$
          $_SHARED{my_plan} = spi_prepare('SELECT (now() + $1)::date AS now',
                                          'INTERVAL');
  $$ LANGUAGE plperl;

  CREATE OR REPLACE FUNCTION add_time( INTERVAL ) RETURNS TEXT AS $$
          return spi_exec_prepared(
                  $_SHARED{my_plan},
                  $_[0]
          )->{rows}->[0]->{now};
  $$ LANGUAGE plperl;

  CREATE OR REPLACE FUNCTION done() RETURNS VOID AS $$
          spi_freeplan( $_SHARED{my_plan});
          undef $_SHARED{my_plan};
  $$ LANGUAGE plperl;

  SELECT init();
  SELECT add_time('1 day'), add_time('2 days'), add_time('3 days');
  SELECT done();

    add_time  |  add_time  |  add_time
  ------------+------------+------------
   2005-12-10 | 2005-12-11 | 2005-12-12
  ```

  Note that the parameter subscript in `spi_prepare` is defined via $1, $2, $3, etc., so avoid declaring query strings in double quotes that might easily lead to hard-to-catch bugs.

  Another example illustrates usage of an optional parameter in `spi_exec_prepared`:

  ```
  CREATE TABLE hosts AS SELECT id, ('192.168.1.'||id)::inet AS address
                        FROM generate_series(1,3) AS id;

  CREATE OR REPLACE FUNCTION init_hosts_query() RETURNS VOID AS $$
          $_SHARED{plan} = spi_prepare('SELECT * FROM hosts
                                        WHERE address << $1', 'inet');
  $$ LANGUAGE plperl;

  CREATE OR REPLACE FUNCTION query_hosts(inet) RETURNS SETOF hosts AS $$
          return spi_exec_prepared(
                  $_SHARED{plan},
                  {limit => 2},
                  $_[0]
          )->{rows};
  $$ LANGUAGE plperl;

  CREATE OR REPLACE FUNCTION release_hosts_query() RETURNS VOID AS $$
          spi_freeplan($_SHARED{plan});
          undef $_SHARED{plan};
  $$ LANGUAGE plperl;

  SELECT init_hosts_query();
  SELECT query_hosts('192.168.1.0/30');
  SELECT release_hosts_query();

      query_hosts
  -----------------
   (1,192.168.1.1)
   (2,192.168.1.2)
  (2 rows)
  ```

- `spi_commit()``spi_rollback()`

  Commit or roll back the current transaction. This can only be called in a procedure or anonymous code block (`DO` command) called from the top level. (Note that it is not possible to run the SQL commands `COMMIT` or `ROLLBACK` via `spi_exec_query` or similar. It has to be done using these functions.) After a transaction is ended, a new transaction is automatically started, so there is no separate function for that.

  Here is an example:

  ```
  CREATE PROCEDURE transaction_test1()
  LANGUAGE plperl
  AS $$
  foreach my $i (0..9) {
      spi_exec_query("INSERT INTO test1 (a) VALUES ($i)");
      if ($i % 2 == 0) {
          spi_commit();
      } else {
          spi_rollback();
      }
  }
  $$;

  CALL transaction_test1();
  ```

[#id](#PLPERL-UTILITY-FUNCTIONS)

### 45.3.2. Utility Functions in PL/Perl [#](#PLPERL-UTILITY-FUNCTIONS)

- `elog(level, msg)`

  Emit a log or error message. Possible levels are `DEBUG`, `LOG`, `INFO`, `NOTICE`, `WARNING`, and `ERROR`. `ERROR` raises an error condition; if this is not trapped by the surrounding Perl code, the error propagates out to the calling query, causing the current transaction or subtransaction to be aborted. This is effectively the same as the Perl `die` command. The other levels only generate messages of different priority levels. Whether messages of a particular priority are reported to the client, written to the server log, or both is controlled by the [log_min_messages](runtime-config-logging#GUC-LOG-MIN-MESSAGES) and [client_min_messages](runtime-config-client#GUC-CLIENT-MIN-MESSAGES) configuration variables. See [Chapter 20](runtime-config) for more information.

- `quote_literal(string)`

  Return the given string suitably quoted to be used as a string literal in an SQL statement string. Embedded single-quotes and backslashes are properly doubled. Note that `quote_literal` returns undef on undef input; if the argument might be undef, `quote_nullable` is often more suitable.

- `quote_nullable(string)`

  Return the given string suitably quoted to be used as a string literal in an SQL statement string; or, if the argument is undef, return the unquoted string "NULL". Embedded single-quotes and backslashes are properly doubled.

- `quote_ident(string)`

  Return the given string suitably quoted to be used as an identifier in an SQL statement string. Quotes are added only if necessary (i.e., if the string contains non-identifier characters or would be case-folded). Embedded quotes are properly doubled.

- `decode_bytea(string)`

  Return the unescaped binary data represented by the contents of the given string, which should be `bytea` encoded.

- `encode_bytea(string)`

  Return the `bytea` encoded form of the binary data contents of the given string.

- `encode_array_literal(array)``encode_array_literal(array, delimiter)`

  Returns the contents of the referenced array as a string in array literal format (see [Section 8.15.2](arrays#ARRAYS-INPUT)). Returns the argument value unaltered if it's not a reference to an array. The delimiter used between elements of the array literal defaults to "`, `" if a delimiter is not specified or is undef.

- `encode_typed_literal(value, typename)`

  Converts a Perl variable to the value of the data type passed as a second argument and returns a string representation of this value. Correctly handles nested arrays and values of composite types.

- `encode_array_constructor(array)`

  Returns the contents of the referenced array as a string in array constructor format (see [Section 4.2.12](sql-expressions#SQL-SYNTAX-ARRAY-CONSTRUCTORS)). Individual values are quoted using `quote_nullable`. Returns the argument value, quoted using `quote_nullable`, if it's not a reference to an array.

- `looks_like_number(string)`

  Returns a true value if the content of the given string looks like a number, according to Perl, returns false otherwise. Returns undef if the argument is undef. Leading and trailing space is ignored. `Inf` and `Infinity` are regarded as numbers.

- `is_array_ref(argument)`

  Returns a true value if the given argument may be treated as an array reference, that is, if ref of the argument is `ARRAY` or `PostgreSQL::InServer::ARRAY`. Returns false otherwise.

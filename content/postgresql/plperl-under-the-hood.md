[#id](#PLPERL-UNDER-THE-HOOD)

## 45.8. PL/Perl Under the Hood [#](#PLPERL-UNDER-THE-HOOD)

- [45.8.1. Configuration](plperl-under-the-hood#PLPERL-CONFIG)
- [45.8.2. Limitations and Missing Features](plperl-under-the-hood#PLPERL-MISSING)

[#id](#PLPERL-CONFIG)

### 45.8.1. Configuration [#](#PLPERL-CONFIG)

This section lists configuration parameters that affect PL/Perl.

- `plperl.on_init` (`string`) [#](#GUC-PLPERL-ON-INIT)

  Specifies Perl code to be executed when a Perl interpreter is first initialized, before it is specialized for use by `plperl` or `plperlu`. The SPI functions are not available when this code is executed. If the code fails with an error it will abort the initialization of the interpreter and propagate out to the calling query, causing the current transaction or subtransaction to be aborted.

  The Perl code is limited to a single string. Longer code can be placed into a module and loaded by the `on_init` string. Examples:

  ```
  plperl.on_init = 'require "plperlinit.pl"'
  plperl.on_init = 'use lib "/my/app"; use MyApp::PgInit;'
  ```

  Any modules loaded by `plperl.on_init`, either directly or indirectly, will be available for use by `plperl`. This may create a security risk. To see what modules have been loaded you can use:

  ```
  DO 'elog(WARNING, join ", ", sort keys %INC)' LANGUAGE plperl;
  ```

  Initialization will happen in the postmaster if the `plperl` library is included in [shared_preload_libraries](runtime-config-client#GUC-SHARED-PRELOAD-LIBRARIES), in which case extra consideration should be given to the risk of destabilizing the postmaster. The principal reason for making use of this feature is that Perl modules loaded by `plperl.on_init` need be loaded only at postmaster start, and will be instantly available without loading overhead in individual database sessions. However, keep in mind that the overhead is avoided only for the first Perl interpreter used by a database session — either PL/PerlU, or PL/Perl for the first SQL role that calls a PL/Perl function. Any additional Perl interpreters created in a database session will have to execute `plperl.on_init` afresh. Also, on Windows there will be no savings whatsoever from preloading, since the Perl interpreter created in the postmaster process does not propagate to child processes.

  This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `plperl.on_plperl_init` (`string`)`plperl.on_plperlu_init` (`string`) [#](#GUC-PLPERL-ON-PLPERL-INIT)

  These parameters specify Perl code to be executed when a Perl interpreter is specialized for `plperl` or `plperlu` respectively. This will happen when a PL/Perl or PL/PerlU function is first executed in a database session, or when an additional interpreter has to be created because the other language is called or a PL/Perl function is called by a new SQL role. This follows any initialization done by `plperl.on_init`. The SPI functions are not available when this code is executed. The Perl code in `plperl.on_plperl_init` is executed after “locking down” the interpreter, and thus it can only perform trusted operations.

  If the code fails with an error it will abort the initialization and propagate out to the calling query, causing the current transaction or subtransaction to be aborted. Any actions already done within Perl won't be undone; however, that interpreter won't be used again. If the language is used again the initialization will be attempted again within a fresh Perl interpreter.

  Only superusers can change these settings. Although these settings can be changed within a session, such changes will not affect Perl interpreters that have already been used to execute functions.

- `plperl.use_strict` (`boolean`) [#](#GUC-PLPERL-USE-STRICT)

  When set true subsequent compilations of PL/Perl functions will have the `strict` pragma enabled. This parameter does not affect functions already compiled in the current session.

[#id](#PLPERL-MISSING)

### 45.8.2. Limitations and Missing Features [#](#PLPERL-MISSING)

The following features are currently missing from PL/Perl, but they would make welcome contributions.

- PL/Perl functions cannot call each other directly.

- SPI is not yet fully implemented.

- If you are fetching very large data sets using `spi_exec_query`, you should be aware that these will all go into memory. You can avoid this by using `spi_query`/`spi_fetchrow` as illustrated earlier.

  A similar problem occurs if a set-returning function passes a large set of rows back to PostgreSQL via `return`. You can avoid this problem too by instead using `return_next` for each row returned, as shown previously.

- When a session ends normally, not due to a fatal error, any `END` blocks that have been defined are executed. Currently no other actions are performed. Specifically, file handles are not automatically flushed and objects are not automatically destroyed.

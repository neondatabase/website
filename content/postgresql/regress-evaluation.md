[#id](#REGRESS-EVALUATION)

## 33.2. Test Evaluation [#](#REGRESS-EVALUATION)

- [33.2.1. Error Message Differences](regress-evaluation#REGRESS-EVALUATION-MESSAGE-DIFFERENCES)
- [33.2.2. Locale Differences](regress-evaluation#REGRESS-EVALUATION-LOCALE-DIFFERENCES)
- [33.2.3. Date and Time Differences](regress-evaluation#REGRESS-EVALUATION-DATE-TIME-DIFFERENCES)
- [33.2.4. Floating-Point Differences](regress-evaluation#REGRESS-EVALUATION-FLOAT-DIFFERENCES)
- [33.2.5. Row Ordering Differences](regress-evaluation#REGRESS-EVALUATION-ORDERING-DIFFERENCES)
- [33.2.6. Insufficient Stack Depth](regress-evaluation#REGRESS-EVALUATION-STACK-DEPTH)
- [33.2.7. The “random” Test](regress-evaluation#REGRESS-EVALUATION-RANDOM-TEST)
- [33.2.8. Configuration Parameters](regress-evaluation#REGRESS-EVALUATION-CONFIG-PARAMS)

Some properly installed and fully functional PostgreSQL installations can “fail” some of these regression tests due to platform-specific artifacts such as varying floating-point representation and message wording. The tests are currently evaluated using a simple `diff` comparison against the outputs generated on a reference system, so the results are sensitive to small system differences. When a test is reported as “failed”, always examine the differences between expected and actual results; you might find that the differences are not significant. Nonetheless, we still strive to maintain accurate reference files across all supported platforms, so it can be expected that all tests pass.

The actual outputs of the regression tests are in files in the `src/test/regress/results` directory. The test script uses `diff` to compare each output file against the reference outputs stored in the `src/test/regress/expected` directory. Any differences are saved for your inspection in `src/test/regress/regression.diffs`. (When running a test suite other than the core tests, these files of course appear in the relevant subdirectory, not `src/test/regress`.)

If you don't like the `diff` options that are used by default, set the environment variable `PG_REGRESS_DIFF_OPTS`, for instance `PG_REGRESS_DIFF_OPTS='-c'`. (Or you can run `diff` yourself, if you prefer.)

If for some reason a particular platform generates a “failure” for a given test, but inspection of the output convinces you that the result is valid, you can add a new comparison file to silence the failure report in future test runs. See [Section 33.3](regress-variant) for details.

[#id](#REGRESS-EVALUATION-MESSAGE-DIFFERENCES)

### 33.2.1. Error Message Differences [#](#REGRESS-EVALUATION-MESSAGE-DIFFERENCES)

Some of the regression tests involve intentional invalid input values. Error messages can come from either the PostgreSQL code or from the host platform system routines. In the latter case, the messages can vary between platforms, but should reflect similar information. These differences in messages will result in a “failed” regression test that can be validated by inspection.

[#id](#REGRESS-EVALUATION-LOCALE-DIFFERENCES)

### 33.2.2. Locale Differences [#](#REGRESS-EVALUATION-LOCALE-DIFFERENCES)

If you run the tests against a server that was initialized with a collation-order locale other than C, then there might be differences due to sort order and subsequent failures. The regression test suite is set up to handle this problem by providing alternate result files that together are known to handle a large number of locales.

To run the tests in a different locale when using the temporary-installation method, pass the appropriate locale-related environment variables on the `make` command line, for example:

```
make check LANG=de_DE.utf8
```

(The regression test driver unsets `LC_ALL`, so it does not work to choose the locale using that variable.) To use no locale, either unset all locale-related environment variables (or set them to `C`) or use the following special invocation:

```
make check NO_LOCALE=1
```

When running the tests against an existing installation, the locale setup is determined by the existing installation. To change it, initialize the database cluster with a different locale by passing the appropriate options to `initdb`.

In general, it is advisable to try to run the regression tests in the locale setup that is wanted for production use, as this will exercise the locale- and encoding-related code portions that will actually be used in production. Depending on the operating system environment, you might get failures, but then you will at least know what locale-specific behaviors to expect when running real applications.

[#id](#REGRESS-EVALUATION-DATE-TIME-DIFFERENCES)

### 33.2.3. Date and Time Differences [#](#REGRESS-EVALUATION-DATE-TIME-DIFFERENCES)

Most of the date and time results are dependent on the time zone environment. The reference files are generated for time zone `PST8PDT` (Berkeley, California), and there will be apparent failures if the tests are not run with that time zone setting. The regression test driver sets environment variable `PGTZ` to `PST8PDT`, which normally ensures proper results.

[#id](#REGRESS-EVALUATION-FLOAT-DIFFERENCES)

### 33.2.4. Floating-Point Differences [#](#REGRESS-EVALUATION-FLOAT-DIFFERENCES)

Some of the tests involve computing 64-bit floating-point numbers (`double precision`) from table columns. Differences in results involving mathematical functions of `double precision` columns have been observed. The `float8` and `geometry` tests are particularly prone to small differences across platforms, or even with different compiler optimization settings. Human eyeball comparison is needed to determine the real significance of these differences which are usually 10 places to the right of the decimal point.

Some systems display minus zero as `-0`, while others just show `0`.

Some systems signal errors from `pow()` and `exp()` differently from the mechanism expected by the current PostgreSQL code.

[#id](#REGRESS-EVALUATION-ORDERING-DIFFERENCES)

### 33.2.5. Row Ordering Differences [#](#REGRESS-EVALUATION-ORDERING-DIFFERENCES)

You might see differences in which the same rows are output in a different order than what appears in the expected file. In most cases this is not, strictly speaking, a bug. Most of the regression test scripts are not so pedantic as to use an `ORDER BY` for every single `SELECT`, and so their result row orderings are not well-defined according to the SQL specification. In practice, since we are looking at the same queries being executed on the same data by the same software, we usually get the same result ordering on all platforms, so the lack of `ORDER BY` is not a problem. Some queries do exhibit cross-platform ordering differences, however. When testing against an already-installed server, ordering differences can also be caused by non-C locale settings or non-default parameter settings, such as custom values of `work_mem` or the planner cost parameters.

Therefore, if you see an ordering difference, it's not something to worry about, unless the query does have an `ORDER BY` that your result is violating. However, please report it anyway, so that we can add an `ORDER BY` to that particular query to eliminate the bogus “failure” in future releases.

You might wonder why we don't order all the regression test queries explicitly to get rid of this issue once and for all. The reason is that that would make the regression tests less useful, not more, since they'd tend to exercise query plan types that produce ordered results to the exclusion of those that don't.

[#id](#REGRESS-EVALUATION-STACK-DEPTH)

### 33.2.6. Insufficient Stack Depth [#](#REGRESS-EVALUATION-STACK-DEPTH)

If the `errors` test results in a server crash at the `select infinite_recurse()` command, it means that the platform's limit on process stack size is smaller than the [max_stack_depth](runtime-config-resource#GUC-MAX-STACK-DEPTH) parameter indicates. This can be fixed by running the server under a higher stack size limit (4MB is recommended with the default value of `max_stack_depth`). If you are unable to do that, an alternative is to reduce the value of `max_stack_depth`.

On platforms supporting `getrlimit()`, the server should automatically choose a safe value of `max_stack_depth`; so unless you've manually overridden this setting, a failure of this kind is a reportable bug.

[#id](#REGRESS-EVALUATION-RANDOM-TEST)

### 33.2.7. The “random” Test [#](#REGRESS-EVALUATION-RANDOM-TEST)

The `random` test script is intended to produce random results. In very rare cases, this causes that regression test to fail. Typing:

```
diff results/random.out expected/random.out
```

should produce only one or a few lines of differences. You need not worry unless the random test fails repeatedly.

[#id](#REGRESS-EVALUATION-CONFIG-PARAMS)

### 33.2.8. Configuration Parameters [#](#REGRESS-EVALUATION-CONFIG-PARAMS)

When running the tests against an existing installation, some non-default parameter settings could cause the tests to fail. For example, changing parameters such as `enable_seqscan` or `enable_indexscan` could cause plan changes that would affect the results of tests that use `EXPLAIN`.

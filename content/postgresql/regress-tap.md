[#id](#REGRESS-TAP)

## 33.4. TAP Tests [#](#REGRESS-TAP)

- [33.4.1. Environment Variables](regress-tap#REGRESS-TAP-VARS)

Various tests, particularly the client program tests under `src/bin`, use the Perl TAP tools and are run using the Perl testing program `prove`. You can pass command-line options to `prove` by setting the `make` variable `PROVE_FLAGS`, for example:

```
make -C src/bin check PROVE_FLAGS='--timer'
```

See the manual page of `prove` for more information.

The `make` variable `PROVE_TESTS` can be used to define a whitespace-separated list of paths relative to the `Makefile` invoking `prove` to run the specified subset of tests instead of the default `t/*.pl`. For example:

```
make check PROVE_TESTS='t/001_test1.pl t/003_test3.pl'
```

The TAP tests require the Perl module `IPC::Run`. This module is available from [CPAN](https://metacpan.org/dist/IPC-Run) or an operating system package. They also require PostgreSQL to be configured with the option `--enable-tap-tests`.

Generically speaking, the TAP tests will test the executables in a previously-installed installation tree if you say `make installcheck`, or will build a new local installation tree from current sources if you say `make check`. In either case they will initialize a local instance (data directory) and transiently run a server in it. Some of these tests run more than one server. Thus, these tests can be fairly resource-intensive.

It's important to realize that the TAP tests will start test server(s) even when you say `make installcheck`; this is unlike the traditional non-TAP testing infrastructure, which expects to use an already-running test server in that case. Some PostgreSQL subdirectories contain both traditional-style and TAP-style tests, meaning that `make installcheck` will produce a mix of results from temporary servers and the already-running test server.

[#id](#REGRESS-TAP-VARS)

### 33.4.1. Environment Variables [#](#REGRESS-TAP-VARS)

Data directories are named according to the test filename, and will be retained if a test fails. If the environment variable `PG_TEST_NOCLEAN` is set, data directories will be retained regardless of test status. For example, retaining the data directory regardless of test results when running the pg_dump tests:

```
PG_TEST_NOCLEAN=1 make -C src/bin/pg_dump check
```

This environment variable also prevents the test's temporary directories from being removed.

Many operations in the test suites use a 180-second timeout, which on slow hosts may lead to load-induced timeouts. Setting the environment variable `PG_TEST_TIMEOUT_DEFAULT` to a higher number will change the default to avoid this.

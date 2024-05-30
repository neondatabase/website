[#id](#EXTEND-PGXS)

## 38.18. Extension Building Infrastructure [#](#EXTEND-PGXS)

If you are thinking about distributing your PostgreSQL extension modules, setting up a portable build system for them can be fairly difficult. Therefore the PostgreSQL installation provides a build infrastructure for extensions, called PGXS, so that simple extension modules can be built simply against an already installed server. PGXS is mainly intended for extensions that include C code, although it can be used for pure-SQL extensions too. Note that PGXS is not intended to be a universal build system framework that can be used to build any software interfacing to PostgreSQL; it simply automates common build rules for simple server extension modules. For more complicated packages, you might need to write your own build system.

To use the PGXS infrastructure for your extension, you must write a simple makefile. In the makefile, you need to set some variables and include the global PGXS makefile. Here is an example that builds an extension module named `isbn_issn`, consisting of a shared library containing some C code, an extension control file, an SQL script, an include file (only needed if other modules might need to access the extension functions without going via SQL), and a documentation text file:

```

MODULES = isbn_issn
EXTENSION = isbn_issn
DATA = isbn_issn--1.0.sql
DOCS = README.isbn_issn
HEADERS_isbn_issn = isbn_issn.h

PG_CONFIG = pg_config
PGXS := $(shell $(PG_CONFIG) --pgxs)
include $(PGXS)
```

The last three lines should always be the same. Earlier in the file, you assign variables or add custom make rules.

Set one of these three variables to specify what is built:

- `MODULES` [#](#EXTEND-PGXS-MODULES)

  list of shared-library objects to be built from source files with same stem (do not include library suffixes in this list)

- `MODULE_big` [#](#EXTEND-PGXS-MODULE-BIG)

  a shared library to build from multiple source files (list object files in `OBJS`)

- `PROGRAM` [#](#EXTEND-PGXS-PROGRAM)

  an executable program to build (list object files in `OBJS`)

The following variables can also be set:

- `EXTENSION` [#](#EXTEND-PGXS-EXTENSION)

  extension name(s); for each name you must provide an `extension.control` file, which will be installed into `prefix/share/extension`

- `MODULEDIR` [#](#EXTEND-PGXS-MODULEDIR)

  subdirectory of `prefix/share` into which DATA and DOCS files should be installed (if not set, default is `extension` if `EXTENSION` is set, or `contrib` if not)

- `DATA` [#](#EXTEND-PGXS-DATA)

  random files to install into `prefix/share/$MODULEDIR`

- `DATA_built` [#](#EXTEND-PGXS-DATA-BUILT)

  random files to install into `prefix/share/$MODULEDIR`, which need to be built first

- `DATA_TSEARCH` [#](#EXTEND-PGXS-DATA-TSEARCH)

  random files to install under `prefix/share/tsearch_data`

- `DOCS` [#](#EXTEND-PGXS-DOCS)

  random files to install under `prefix/doc/$MODULEDIR`

- `HEADERS``HEADERS_built` [#](#EXTEND-PGXS-HEADERS)

  Files to (optionally build and) install under `prefix/include/server/$MODULEDIR/$MODULE_big`.

  Unlike `DATA_built`, files in `HEADERS_built` are not removed by the `clean` target; if you want them removed, also add them to `EXTRA_CLEAN` or add your own rules to do it.

- `HEADERS_$MODULE``HEADERS_built_$MODULE` [#](#EXTEND-PGXS-HEADERS-MODULE)

  Files to install (after building if specified) under `prefix/include/server/$MODULEDIR/$MODULE`, where `$MODULE` must be a module name used in `MODULES` or `MODULE_big`.

  Unlike `DATA_built`, files in `HEADERS_built_$MODULE` are not removed by the `clean` target; if you want them removed, also add them to `EXTRA_CLEAN` or add your own rules to do it.

  It is legal to use both variables for the same module, or any combination, unless you have two module names in the `MODULES` list that differ only by the presence of a prefix `built_`, which would cause ambiguity. In that (hopefully unlikely) case, you should use only the `HEADERS_built_$MODULE` variables.

- `SCRIPTS` [#](#EXTEND-PGXS-SCRIPTS)

  script files (not binaries) to install into `prefix/bin`

- `SCRIPTS_built` [#](#EXTEND-PGXS-SCRIPTS-BUILT)

  script files (not binaries) to install into `prefix/bin`, which need to be built first

- `REGRESS` [#](#EXTEND-PGXS-REGRESS)

  list of regression test cases (without suffix), see below

- `REGRESS_OPTS` [#](#EXTEND-PGXS-REGRESS-OPTS)

  additional switches to pass to pg_regress

- `ISOLATION` [#](#EXTEND-PGXS-ISOLATION)

  list of isolation test cases, see below for more details

- `ISOLATION_OPTS` [#](#EXTEND-PGXS-ISOLATION-OPTS)

  additional switches to pass to pg_isolation_regress

- `TAP_TESTS` [#](#EXTEND-PGXS-TAP-TESTS)

  switch defining if TAP tests need to be run, see below

- `NO_INSTALL` [#](#EXTEND-PGXS-NO-INSTALL)

  don't define an `install` target, useful for test modules that don't need their build products to be installed

- `NO_INSTALLCHECK` [#](#EXTEND-PGXS-NO-INSTALLCHECK)

  don't define an `installcheck` target, useful e.g., if tests require special configuration, or don't use pg_regress

- `EXTRA_CLEAN` [#](#EXTEND-PGXS-EXTRA-CLEAN)

  extra files to remove in `make clean`

- `PG_CPPFLAGS` [#](#EXTEND-PGXS-PG-CPPFLAGS)

  will be prepended to `CPPFLAGS`

- `PG_CFLAGS` [#](#EXTEND-PGXS-PG-CFLAGS)

  will be appended to `CFLAGS`

- `PG_CXXFLAGS` [#](#EXTEND-PGXS-PG-CXXFLAGS)

  will be appended to `CXXFLAGS`

- `PG_LDFLAGS` [#](#EXTEND-PGXS-PG-LDFLAGS)

  will be prepended to `LDFLAGS`

- `PG_LIBS` [#](#EXTEND-PGXS-PG-LIBS)

  will be added to `PROGRAM` link line

- `SHLIB_LINK` [#](#EXTEND-PGXS-SHLIB-LINK)

  will be added to `MODULE_big` link line

- `PG_CONFIG` [#](#EXTEND-PGXS-PG-CONFIG)

  path to pg_config program for the PostgreSQL installation to build against (typically just `pg_config` to use the first one in your `PATH`)

Put this makefile as `Makefile` in the directory which holds your extension. Then you can do `make` to compile, and then `make install` to install your module. By default, the extension is compiled and installed for the PostgreSQL installation that corresponds to the first `pg_config` program found in your `PATH`. You can use a different installation by setting `PG_CONFIG` to point to its `pg_config` program, either within the makefile or on the `make` command line.

You can also run `make` in a directory outside the source tree of your extension, if you want to keep the build directory separate. This procedure is also called a _VPATH_ build. Here's how:

```

mkdir build_dir
cd build_dir
make -f /path/to/extension/source/tree/Makefile
make -f /path/to/extension/source/tree/Makefile install
```

Alternatively, you can set up a directory for a VPATH build in a similar way to how it is done for the core code. One way to do this is using the core script `config/prep_buildtree`. Once this has been done you can build by setting the `make` variable `VPATH` like this:

```

make VPATH=/path/to/extension/source/tree
make VPATH=/path/to/extension/source/tree install
```

This procedure can work with a greater variety of directory layouts.

The scripts listed in the `REGRESS` variable are used for regression testing of your module, which can be invoked by `make installcheck` after doing `make install`. For this to work you must have a running PostgreSQL server. The script files listed in `REGRESS` must appear in a subdirectory named `sql/` in your extension's directory. These files must have extension `.sql`, which must not be included in the `REGRESS` list in the makefile. For each test there should also be a file containing the expected output in a subdirectory named `expected/`, with the same stem and extension `.out`. `make installcheck` executes each test script with psql, and compares the resulting output to the matching expected file. Any differences will be written to the file `regression.diffs` in `diff -c` format. Note that trying to run a test that is missing its expected file will be reported as “trouble”, so make sure you have all expected files.

The scripts listed in the `ISOLATION` variable are used for tests stressing behavior of concurrent session with your module, which can be invoked by `make installcheck` after doing `make install`. For this to work you must have a running PostgreSQL server. The script files listed in `ISOLATION` must appear in a subdirectory named `specs/` in your extension's directory. These files must have extension `.spec`, which must not be included in the `ISOLATION` list in the makefile. For each test there should also be a file containing the expected output in a subdirectory named `expected/`, with the same stem and extension `.out`. `make installcheck` executes each test script, and compares the resulting output to the matching expected file. Any differences will be written to the file `output_iso/regression.diffs` in `diff -c` format. Note that trying to run a test that is missing its expected file will be reported as “trouble”, so make sure you have all expected files.

`TAP_TESTS` enables the use of TAP tests. Data from each run is present in a subdirectory named `tmp_check/`. See also [Section 33.4](regress-tap) for more details.

### Tip

The easiest way to create the expected files is to create empty files, then do a test run (which will of course report differences). Inspect the actual result files found in the `results/` directory (for tests in `REGRESS`), or `output_iso/results/` directory (for tests in `ISOLATION`), then copy them to `expected/` if they match what you expect from the test.

[#id](#INSTALL-MAKE)

## 17.3. Building and Installation with Autoconf and Make [#](#INSTALL-MAKE)

- [17.3.1. Short Version](install-make#INSTALL-SHORT-MAKE)
- [17.3.2. Installation Procedure](install-make#INSTALL-PROCEDURE-MAKE)
- [17.3.3. `configure` Options](install-make#CONFIGURE-OPTIONS)
- [17.3.4. `configure` Environment Variables](install-make#CONFIGURE-ENVVARS)

[#id](#INSTALL-SHORT-MAKE)

### 17.3.1. Short Version [#](#INSTALL-SHORT-MAKE)

```
./configure
make
su
make install
adduser postgres
mkdir -p /usr/local/pgsql/data
chown postgres /usr/local/pgsql/data
su - postgres
/usr/local/pgsql/bin/initdb -D /usr/local/pgsql/data
/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data -l logfile start
/usr/local/pgsql/bin/createdb test
/usr/local/pgsql/bin/psql test
```

The long version is the rest of this section.

[#id](#INSTALL-PROCEDURE-MAKE)

### 17.3.2. Installation Procedure [#](#INSTALL-PROCEDURE-MAKE)

1. **Configuration**

   The first step of the installation procedure is to configure the source tree for your system and choose the options you would like. This is done by running the `configure` script. For a default installation simply enter:

   ```
   ./configure
   ```

   This script will run a number of tests to determine values for various system dependent variables and detect any quirks of your operating system, and finally will create several files in the build tree to record what it found.

   You can also run `configure` in a directory outside the source tree, and then build there, if you want to keep the build directory separate from the original source files. This procedure is called a _VPATH_ build. Here's how:

   ```
   mkdir build_dir
   cd build_dir
   /path/to/source/tree/configure [options go here]
   make
   ```

   The default configuration will build the server and utilities, as well as all client applications and interfaces that require only a C compiler. All files will be installed under `/usr/local/pgsql` by default.

   You can customize the build and installation process by supplying one or more command line options to `configure`. Typically you would customize the install location, or the set of optional features that are built. `configure` has a large number of options, which are described in [Section 17.3.3](install-make#CONFIGURE-OPTIONS).

   Also, `configure` responds to certain environment variables, as described in [Section 17.3.4](install-make#CONFIGURE-ENVVARS). These provide additional ways to customize the configuration.

2. **Build**

   To start the build, type either of:

   ```
   make
   make all
   ```

   (Remember to use GNU make.) The build will take a few minutes depending on your hardware.

   If you want to build everything that can be built, including the documentation (HTML and man pages), and the additional modules (`contrib`), type instead:

   ```
   make world
   ```

   If you want to build everything that can be built, including the additional modules (`contrib`), but without the documentation, type instead:

   ```
   make world-bin
   ```

   If you want to invoke the build from another makefile rather than manually, you must unset `MAKELEVEL` or set it to zero, for instance like this:

   ```
   build-postgresql:
           $(MAKE) -C postgresql MAKELEVEL=0 all
   ```

   Failure to do that can lead to strange error messages, typically about missing header files.

3. **Regression Tests**

   If you want to test the newly built server before you install it, you can run the regression tests at this point. The regression tests are a test suite to verify that PostgreSQL runs on your machine in the way the developers expected it to. Type:

   ```
   make check
   ```

   (This won't work as root; do it as an unprivileged user.) See [Chapter 33](regress) for detailed information about interpreting the test results. You can repeat this test at any later time by issuing the same command.

4. **Installing the Files**

   ### Note

   If you are upgrading an existing system be sure to read [Section 19.6](upgrading), which has instructions about upgrading a cluster.

   To install PostgreSQL enter:

   ```
   make install
   ```

   This will install files into the directories that were specified in [Step 1](install-make#CONFIGURE). Make sure that you have appropriate permissions to write into that area. Normally you need to do this step as root. Alternatively, you can create the target directories in advance and arrange for appropriate permissions to be granted.

   To install the documentation (HTML and man pages), enter:

   ```
   make install-docs
   ```

   If you built the world above, type instead:

   ```
   make install-world
   ```

   This also installs the documentation.

   If you built the world without the documentation above, type instead:

   ```
   make install-world-bin
   ```

   You can use `make install-strip` instead of `make install` to strip the executable files and libraries as they are installed. This will save some space. If you built with debugging support, stripping will effectively remove the debugging support, so it should only be done if debugging is no longer needed. `install-strip` tries to do a reasonable job saving space, but it does not have perfect knowledge of how to strip every unneeded byte from an executable file, so if you want to save all the disk space you possibly can, you will have to do manual work.

   The standard installation provides all the header files needed for client application development as well as for server-side program development, such as custom functions or data types written in C.

   **Client-only installation: ** If you want to install only the client applications and interface libraries, then you can use these commands:

   ```
   make -C src/bin install
   make -C src/include install
   make -C src/interfaces install
   make -C doc install
   ```

   `src/bin` has a few binaries for server-only use, but they are small.

**Uninstallation: ** To undo the installation use the command `make uninstall`. However, this will not remove any created directories.

**Cleaning: ** After the installation you can free disk space by removing the built files from the source tree with the command `make clean`. This will preserve the files made by the `configure` program, so that you can rebuild everything with `make` later on. To reset the source tree to the state in which it was distributed, use `make distclean`. If you are going to build for several platforms within the same source tree you must do this and re-configure for each platform. (Alternatively, use a separate build tree for each platform, so that the source tree remains unmodified.)

If you perform a build and then discover that your `configure` options were wrong, or if you change anything that `configure` investigates (for example, software upgrades), then it's a good idea to do `make distclean` before reconfiguring and rebuilding. Without this, your changes in configuration choices might not propagate everywhere they need to.

[#id](#CONFIGURE-OPTIONS)

### 17.3.3. `configure` Options [#](#CONFIGURE-OPTIONS)

`configure`'s command line options are explained below. This list is not exhaustive (use `./configure --help` to get one that is). The options not covered here are meant for advanced use-cases such as cross-compilation, and are documented in the standard Autoconf documentation.

[#id](#CONFIGURE-OPTIONS-LOCATIONS)

#### 17.3.3.1. Installation Locations [#](#CONFIGURE-OPTIONS-LOCATIONS)

These options control where `make install` will put the files. The `--prefix` option is sufficient for most cases. If you have special needs, you can customize the installation subdirectories with the other options described in this section. Beware however that changing the relative locations of the different subdirectories may render the installation non-relocatable, meaning you won't be able to move it after installation. (The `man` and `doc` locations are not affected by this restriction.) For relocatable installs, you might want to use the `--disable-rpath` option described later.

- `--prefix=PREFIX` [#](#CONFIGURE-OPTION-PREFIX)

  Install all files under the directory _`PREFIX`_ instead of `/usr/local/pgsql`. The actual files will be installed into various subdirectories; no files will ever be installed directly into the _`PREFIX`_ directory.

- `--exec-prefix=EXEC-PREFIX` [#](#CONFIGURE-OPTION-EXEC-PREFIX)

  You can install architecture-dependent files under a different prefix, _`EXEC-PREFIX`_, than what _`PREFIX`_ was set to. This can be useful to share architecture-independent files between hosts. If you omit this, then _`EXEC-PREFIX`_ is set equal to _`PREFIX`_ and both architecture-dependent and independent files will be installed under the same tree, which is probably what you want.

- `--bindir=DIRECTORY` [#](#CONFIGURE-OPTION-BINDIR)

  Specifies the directory for executable programs. The default is `EXEC-PREFIX/bin`, which normally means `/usr/local/pgsql/bin`.

- `--sysconfdir=DIRECTORY` [#](#CONFIGURE-OPTION-SYSCONFDIR)

  Sets the directory for various configuration files, `PREFIX/etc` by default.

- `--libdir=DIRECTORY` [#](#CONFIGURE-OPTION-LIBDIR)

  Sets the location to install libraries and dynamically loadable modules. The default is `EXEC-PREFIX/lib`.

- `--includedir=DIRECTORY` [#](#CONFIGURE-OPTION-INCLUDEDIR)

  Sets the directory for installing C and C++ header files. The default is `PREFIX/include`.

- `--datarootdir=DIRECTORY` [#](#CONFIGURE-OPTION-DATAROOTDIR)

  Sets the root directory for various types of read-only data files. This only sets the default for some of the following options. The default is `PREFIX/share`.

- `--datadir=DIRECTORY` [#](#CONFIGURE-OPTION-DATADIR)

  Sets the directory for read-only data files used by the installed programs. The default is `DATAROOTDIR`. Note that this has nothing to do with where your database files will be placed.

- `--localedir=DIRECTORY` [#](#CONFIGURE-OPTION-LOCALEDIR)

  Sets the directory for installing locale data, in particular message translation catalog files. The default is `DATAROOTDIR/locale`.

- `--mandir=DIRECTORY` [#](#CONFIGURE-OPTION-MANDIR)

  The man pages that come with PostgreSQL will be installed under this directory, in their respective `manx` subdirectories. The default is `DATAROOTDIR/man`.

- `--docdir=DIRECTORY` [#](#CONFIGURE-OPTION-DOCDIR)

  Sets the root directory for installing documentation files, except “man” pages. This only sets the default for the following options. The default value for this option is `DATAROOTDIR/doc/postgresql`.

- `--htmldir=DIRECTORY` [#](#CONFIGURE-OPTION-HTMLDIR)

  The HTML-formatted documentation for PostgreSQL will be installed under this directory. The default is `DATAROOTDIR`.

### Note

Care has been taken to make it possible to install PostgreSQL into shared installation locations (such as `/usr/local/include`) without interfering with the namespace of the rest of the system. First, the string “`/postgresql`” is automatically appended to `datadir`, `sysconfdir`, and `docdir`, unless the fully expanded directory name already contains the string “`postgres`” or “`pgsql`”. For example, if you choose `/usr/local` as prefix, the documentation will be installed in `/usr/local/doc/postgresql`, but if the prefix is `/opt/postgres`, then it will be in `/opt/postgres/doc`. The public C header files of the client interfaces are installed into `includedir` and are namespace-clean. The internal header files and the server header files are installed into private directories under `includedir`. See the documentation of each interface for information about how to access its header files. Finally, a private subdirectory will also be created, if appropriate, under `libdir` for dynamically loadable modules.

[#id](#CONFIGURE-OPTIONS-FEATURES)

#### 17.3.3.2. PostgreSQL Features [#](#CONFIGURE-OPTIONS-FEATURES)

The options described in this section enable building of various PostgreSQL features that are not built by default. Most of these are non-default only because they require additional software, as described in [Section 17.1](install-requirements).

- `--enable-nls[=LANGUAGES]` [#](#CONFIGURE-OPTION-ENABLE-NLS)

  Enables Native Language Support (NLS), that is, the ability to display a program's messages in a language other than English. _`LANGUAGES`_ is an optional space-separated list of codes of the languages that you want supported, for example `--enable-nls='de fr'`. (The intersection between your list and the set of actually provided translations will be computed automatically.) If you do not specify a list, then all available translations are installed.

  To use this option, you will need an implementation of the Gettext API.

- `--with-perl` [#](#CONFIGURE-OPTION-WITH-PERL)

  Build the PL/Perl server-side language.

- `--with-python` [#](#CONFIGURE-OPTION-WITH-PYTHON)

  Build the PL/Python server-side language.

- `--with-tcl` [#](#CONFIGURE-OPTION-WITH-TCL)

  Build the PL/Tcl server-side language.

- `--with-tclconfig=DIRECTORY` [#](#CONFIGURE-OPTION-WITH-TCLCONFIG)

  Tcl installs the file `tclConfig.sh`, which contains configuration information needed to build modules interfacing to Tcl. This file is normally found automatically at a well-known location, but if you want to use a different version of Tcl you can specify the directory in which to look for `tclConfig.sh`.

- `--with-llvm` [#](#CONFIGURE-WITH-LLVM)

  Build with support for LLVM based JIT compilation (see [Chapter 32](jit)). This requires the LLVM library to be installed. The minimum required version of LLVM is currently 3.9.

  `llvm-config` will be used to find the required compilation options. `llvm-config`, and then `llvm-config-$major-$minor` for all supported versions, will be searched for in your `PATH`. If that would not yield the desired program, use `LLVM_CONFIG` to specify a path to the correct `llvm-config`. For example

  ```
  ./configure ... --with-llvm LLVM_CONFIG='/path/to/llvm/bin/llvm-config'
  ```

  LLVM support requires a compatible `clang` compiler (specified, if necessary, using the `CLANG` environment variable), and a working C++ compiler (specified, if necessary, using the `CXX` environment variable).

- `--with-lz4` [#](#CONFIGURE-OPTION-WITH-LZ4)

  Build with LZ4 compression support.

- `--with-zstd` [#](#CONFIGURE-OPTION-WITH-ZSTD)

  Build with Zstandard compression support.

- `--with-ssl=LIBRARY` [#](#CONFIGURE-OPTION-WITH-SSL)

  Build with support for SSL (encrypted) connections. The only _`LIBRARY`_ supported is `openssl`. This requires the OpenSSL package to be installed. `configure` will check for the required header files and libraries to make sure that your OpenSSL installation is sufficient before proceeding.

- `--with-openssl` [#](#CONFIGURE-OPTION-WITH-OPENSSL)

  Obsolete equivalent of `--with-ssl=openssl`.

- `--with-gssapi` [#](#CONFIGURE-OPTION-WITH-GSSAPI)

  Build with support for GSSAPI authentication. MIT Kerberos is required to be installed for GSSAPI. On many systems, the GSSAPI system (a part of the MIT Kerberos installation) is not installed in a location that is searched by default (e.g., `/usr/include`, `/usr/lib`), so you must use the options `--with-includes` and `--with-libraries` in addition to this option. `configure` will check for the required header files and libraries to make sure that your GSSAPI installation is sufficient before proceeding.

- `--with-ldap` [#](#CONFIGURE-OPTION-WITH-LDAP)

  Build with LDAP support for authentication and connection parameter lookup (see [Section 34.18](libpq-ldap) and [Section 21.10](auth-ldap) for more information). On Unix, this requires the OpenLDAP package to be installed. On Windows, the default WinLDAP library is used. `configure` will check for the required header files and libraries to make sure that your OpenLDAP installation is sufficient before proceeding.

- `--with-pam` [#](#CONFIGURE-OPTION-WITH-PAM)

  Build with PAM (Pluggable Authentication Modules) support.

- `--with-bsd-auth` [#](#CONFIGURE-OPTION-WITH-BSD-AUTH)

  Build with BSD Authentication support. (The BSD Authentication framework is currently only available on OpenBSD.)

- `--with-systemd` [#](#CONFIGURE-OPTION-WITH-SYSTEMD)

  Build with support for systemd service notifications. This improves integration if the server is started under systemd but has no impact otherwise; see [Section 19.3](server-start) for more information. libsystemd and the associated header files need to be installed to use this option.

- `--with-bonjour` [#](#CONFIGURE-OPTION-WITH-BONJOUR)

  Build with support for Bonjour automatic service discovery. This requires Bonjour support in your operating system. Recommended on macOS.

- `--with-uuid=LIBRARY` [#](#CONFIGURE-OPTION-WITH-UUID)

  Build the [uuid-ossp](uuid-ossp) module (which provides functions to generate UUIDs), using the specified UUID library. _`LIBRARY`_ must be one of:

  - `bsd` to use the UUID functions found in FreeBSD and some other BSD-derived systems

  - `e2fs` to use the UUID library created by the `e2fsprogs` project; this library is present in most Linux systems and in macOS, and can be obtained for other platforms as well

  - `ossp` to use the [OSSP UUID library](http://www.ossp.org/pkg/lib/uuid/)

- `--with-ossp-uuid` [#](#CONFIGURE-OPTION-WITH-OSSP-UUID)

  Obsolete equivalent of `--with-uuid=ossp`.

- `--with-libxml` [#](#CONFIGURE-OPTION-WITH-LIBXML)

  Build with libxml2, enabling SQL/XML support. Libxml2 version 2.6.23 or later is required for this feature.

  To detect the required compiler and linker options, PostgreSQL will query `pkg-config`, if that is installed and knows about libxml2. Otherwise the program `xml2-config`, which is installed by libxml2, will be used if it is found. Use of `pkg-config` is preferred, because it can deal with multi-architecture installations better.

  To use a libxml2 installation that is in an unusual location, you can set `pkg-config`-related environment variables (see its documentation), or set the environment variable `XML2_CONFIG` to point to the `xml2-config` program belonging to the libxml2 installation, or set the variables `XML2_CFLAGS` and `XML2_LIBS`. (If `pkg-config` is installed, then to override its idea of where libxml2 is you must either set `XML2_CONFIG` or set both `XML2_CFLAGS` and `XML2_LIBS` to nonempty strings.)

- `--with-libxslt` [#](#CONFIGURE-OPTION-WITH-LIBXSLT)

  Build with libxslt, enabling the [xml2](xml2) module to perform XSL transformations of XML. `--with-libxml` must be specified as well.

[#id](#CONFIGURE-OPTIONS-ANTI-FEATURES)

#### 17.3.3.3. Anti-Features [#](#CONFIGURE-OPTIONS-ANTI-FEATURES)

The options described in this section allow disabling certain PostgreSQL features that are built by default, but which might need to be turned off if the required software or system features are not available. Using these options is not recommended unless really necessary.

- `--without-icu` [#](#CONFIGURE-OPTION-WITHOUT-ICU)

  Build without support for the ICU library, disabling the use of ICU collation features (see [Section 24.2](collation)).

- `--without-readline` [#](#CONFIGURE-OPTION-WITHOUT-READLINE)

  Prevents use of the Readline library (and libedit as well). This option disables command-line editing and history in psql.

- `--with-libedit-preferred` [#](#CONFIGURE-OPTION-WITH-LIBEDIT-PREFERRED)

  Favors the use of the BSD-licensed libedit library rather than GPL-licensed Readline. This option is significant only if you have both libraries installed; the default in that case is to use Readline.

- `--without-zlib` [#](#CONFIGURE-OPTION-WITHOUT-ZLIB)

  Prevents use of the Zlib library. This disables support for compressed archives in pg_dump and pg_restore.

- `--disable-spinlocks` [#](#CONFIGURE-OPTION-DISABLE-SPINLOCKS)

  Allow the build to succeed even if PostgreSQL has no CPU spinlock support for the platform. The lack of spinlock support will result in very poor performance; therefore, this option should only be used if the build aborts and informs you that the platform lacks spinlock support. If this option is required to build PostgreSQL on your platform, please report the problem to the PostgreSQL developers.

- `--disable-atomics` [#](#CONFIGURE-OPTION-DISABLE-ATOMICS)

  Disable use of CPU atomic operations. This option does nothing on platforms that lack such operations. On platforms that do have them, this will result in poor performance. This option is only useful for debugging or making performance comparisons.

- `--disable-thread-safety` [#](#CONFIGURE-OPTION-DISABLE-THREAD-SAFETY)

  Disable the thread-safety of client libraries. This prevents concurrent threads in libpq and ECPG programs from safely controlling their private connection handles. Use this only on platforms with deficient threading support.

[#id](#CONFIGURE-OPTIONS-BUILD-PROCESS)

#### 17.3.3.4. Build Process Details [#](#CONFIGURE-OPTIONS-BUILD-PROCESS)

- `--with-includes=DIRECTORIES` [#](#CONFIGURE-OPTION-WITH-INCLUDES)

  _`DIRECTORIES`_ is a colon-separated list of directories that will be added to the list the compiler searches for header files. If you have optional packages (such as GNU Readline) installed in a non-standard location, you have to use this option and probably also the corresponding `--with-libraries` option.

  Example: `--with-includes=/opt/gnu/include:/usr/sup/include`.

- `--with-libraries=DIRECTORIES` [#](#CONFIGURE-OPTION-WITH-LIBRARIES)

  _`DIRECTORIES`_ is a colon-separated list of directories to search for libraries. You will probably have to use this option (and the corresponding `--with-includes` option) if you have packages installed in non-standard locations.

  Example: `--with-libraries=/opt/gnu/lib:/usr/sup/lib`.

- `--with-system-tzdata=DIRECTORY` [#](#CONFIGURE-OPTION-WITH-SYSTEM-TZDATA)

  PostgreSQL includes its own time zone database, which it requires for date and time operations. This time zone database is in fact compatible with the IANA time zone database provided by many operating systems such as FreeBSD, Linux, and Solaris, so it would be redundant to install it again. When this option is used, the system-supplied time zone database in _`DIRECTORY`_ is used instead of the one included in the PostgreSQL source distribution. _`DIRECTORY`_ must be specified as an absolute path. `/usr/share/zoneinfo` is a likely directory on some operating systems. Note that the installation routine will not detect mismatching or erroneous time zone data. If you use this option, you are advised to run the regression tests to verify that the time zone data you have pointed to works correctly with PostgreSQL.

  This option is mainly aimed at binary package distributors who know their target operating system well. The main advantage of using this option is that the PostgreSQL package won't need to be upgraded whenever any of the many local daylight-saving time rules change. Another advantage is that PostgreSQL can be cross-compiled more straightforwardly if the time zone database files do not need to be built during the installation.

- `--with-extra-version=STRING` [#](#CONFIGURE-OPTION-WITH-EXTRA-VERSION)

  Append _`STRING`_ to the PostgreSQL version number. You can use this, for example, to mark binaries built from unreleased Git snapshots or containing custom patches with an extra version string, such as a `git describe` identifier or a distribution package release number.

- `--disable-rpath` [#](#CONFIGURE-OPTION-DISABLE-RPATH)

  Do not mark PostgreSQL's executables to indicate that they should search for shared libraries in the installation's library directory (see `--libdir`). On most platforms, this marking uses an absolute path to the library directory, so that it will be unhelpful if you relocate the installation later. However, you will then need to provide some other way for the executables to find the shared libraries. Typically this requires configuring the operating system's dynamic linker to search the library directory; see [Section 17.5.1](install-post#INSTALL-POST-SHLIBS) for more detail.

[#id](#CONFIGURE-OPTIONS-MISC)

#### 17.3.3.5. Miscellaneous [#](#CONFIGURE-OPTIONS-MISC)

It's fairly common, particularly for test builds, to adjust the default port number with `--with-pgport`. The other options in this section are recommended only for advanced users.

- `--with-pgport=NUMBER` [#](#CONFIGURE-OPTION-WITH-PGPORT)

  Set _`NUMBER`_ as the default port number for server and clients. The default is 5432. The port can always be changed later on, but if you specify it here then both server and clients will have the same default compiled in, which can be very convenient. Usually the only good reason to select a non-default value is if you intend to run multiple PostgreSQL servers on the same machine.

- `--with-krb-srvnam=NAME` [#](#CONFIGURE-OPTION-WITH-KRB-SRVNAM)

  The default name of the Kerberos service principal used by GSSAPI. `postgres` is the default. There's usually no reason to change this unless you are building for a Windows environment, in which case it must be set to upper case `POSTGRES`.

- `--with-segsize=SEGSIZE` [#](#CONFIGURE-OPTION-WITH-SEGSIZE)

  Set the _segment size_, in gigabytes. Large tables are divided into multiple operating-system files, each of size equal to the segment size. This avoids problems with file size limits that exist on many platforms. The default segment size, 1 gigabyte, is safe on all supported platforms. If your operating system has “largefile” support (which most do, nowadays), you can use a larger segment size. This can be helpful to reduce the number of file descriptors consumed when working with very large tables. But be careful not to select a value larger than is supported by your platform and the file systems you intend to use. Other tools you might wish to use, such as tar, could also set limits on the usable file size. It is recommended, though not absolutely required, that this value be a power of 2. Note that changing this value breaks on-disk database compatibility, meaning you cannot use `pg_upgrade` to upgrade to a build with a different segment size.

- `--with-blocksize=BLOCKSIZE` [#](#CONFIGURE-OPTION-WITH-BLOCKSIZE)

  Set the _block size_, in kilobytes. This is the unit of storage and I/O within tables. The default, 8 kilobytes, is suitable for most situations; but other values may be useful in special cases. The value must be a power of 2 between 1 and 32 (kilobytes). Note that changing this value breaks on-disk database compatibility, meaning you cannot use `pg_upgrade` to upgrade to a build with a different block size.

- `--with-wal-blocksize=BLOCKSIZE` [#](#CONFIGURE-OPTION-WITH-WAL-BLOCKSIZE)

  Set the _WAL block size_, in kilobytes. This is the unit of storage and I/O within the WAL log. The default, 8 kilobytes, is suitable for most situations; but other values may be useful in special cases. The value must be a power of 2 between 1 and 64 (kilobytes). Note that changing this value breaks on-disk database compatibility, meaning you cannot use `pg_upgrade` to upgrade to a build with a different WAL block size.

[#id](#CONFIGURE-OPTIONS-DEVEL)

#### 17.3.3.6. Developer Options [#](#CONFIGURE-OPTIONS-DEVEL)

Most of the options in this section are only of interest for developing or debugging PostgreSQL. They are not recommended for production builds, except for `--enable-debug`, which can be useful to enable detailed bug reports in the unlucky event that you encounter a bug. On platforms supporting DTrace, `--enable-dtrace` may also be reasonable to use in production.

When building an installation that will be used to develop code inside the server, it is recommended to use at least the options `--enable-debug` and `--enable-cassert`.

- `--enable-debug` [#](#CONFIGURE-OPTION-ENABLE-DEBUG)

  Compiles all programs and libraries with debugging symbols. This means that you can run the programs in a debugger to analyze problems. This enlarges the size of the installed executables considerably, and on non-GCC compilers it usually also disables compiler optimization, causing slowdowns. However, having the symbols available is extremely helpful for dealing with any problems that might arise. Currently, this option is recommended for production installations only if you use GCC. But you should always have it on if you are doing development work or running a beta version.

- `--enable-cassert` [#](#CONFIGURE-OPTION-ENABLE-CASSERT)

  Enables _assertion_ checks in the server, which test for many “cannot happen” conditions. This is invaluable for code development purposes, but the tests can slow down the server significantly. Also, having the tests turned on won't necessarily enhance the stability of your server! The assertion checks are not categorized for severity, and so what might be a relatively harmless bug will still lead to server restarts if it triggers an assertion failure. This option is not recommended for production use, but you should have it on for development work or when running a beta version.

- `--enable-tap-tests` [#](#CONFIGURE-OPTION-ENABLE-TAP-TESTS)

  Enable tests using the Perl TAP tools. This requires a Perl installation and the Perl module `IPC::Run`. See [Section 33.4](regress-tap) for more information.

- `--enable-depend` [#](#CONFIGURE-OPTION-ENABLE-DEPEND)

  Enables automatic dependency tracking. With this option, the makefiles are set up so that all affected object files will be rebuilt when any header file is changed. This is useful if you are doing development work, but is just wasted overhead if you intend only to compile once and install. At present, this option only works with GCC.

- `--enable-coverage` [#](#CONFIGURE-OPTION-ENABLE-COVERAGE)

  If using GCC, all programs and libraries are compiled with code coverage testing instrumentation. When run, they generate files in the build directory with code coverage metrics. See [Section 33.5](regress-coverage) for more information. This option is for use only with GCC and when doing development work.

- `--enable-profiling` [#](#CONFIGURE-OPTION-ENABLE-PROFILING)

  If using GCC, all programs and libraries are compiled so they can be profiled. On backend exit, a subdirectory will be created that contains the `gmon.out` file containing profile data. This option is for use only with GCC and when doing development work.

- `--enable-dtrace` [#](#CONFIGURE-OPTION-ENABLE-DTRACE)

  Compiles PostgreSQL with support for the dynamic tracing tool DTrace. See [Section 28.5](dynamic-trace) for more information.

  To point to the `dtrace` program, the environment variable `DTRACE` can be set. This will often be necessary because `dtrace` is typically installed under `/usr/sbin`, which might not be in your `PATH`.

  Extra command-line options for the `dtrace` program can be specified in the environment variable `DTRACEFLAGS`. On Solaris, to include DTrace support in a 64-bit binary, you must specify `DTRACEFLAGS="-64"`. For example, using the GCC compiler:

  ```
  ./configure CC='gcc -m64' --enable-dtrace DTRACEFLAGS='-64' ...
  ```

  Using Sun's compiler:

  ```
  ./configure CC='/opt/SUNWspro/bin/cc -xtarget=native64' --enable-dtrace DTRACEFLAGS='-64' ...
  ```

- `--with-segsize-blocks=SEGSIZE_BLOCKS` [#](#CONFIGURE-OPTION-WITH-SEGSIZE-BLOCKS)

  Specify the segment size in blocks. If both `--with-segsize` and this option are specified, this option wins. This option is only for developers, to test segment related code.

[#id](#CONFIGURE-ENVVARS)

### 17.3.4. `configure` Environment Variables [#](#CONFIGURE-ENVVARS)

In addition to the ordinary command-line options described above, `configure` responds to a number of environment variables. You can specify environment variables on the `configure` command line, for example:

```
./configure CC=/opt/bin/gcc CFLAGS='-O2 -pipe'
```

In this usage an environment variable is little different from a command-line option. You can also set such variables beforehand:

```
export CC=/opt/bin/gcc
export CFLAGS='-O2 -pipe'
./configure
```

This usage can be convenient because many programs' configuration scripts respond to these variables in similar ways.

The most commonly used of these environment variables are `CC` and `CFLAGS`. If you prefer a C compiler different from the one `configure` picks, you can set the variable `CC` to the program of your choice. By default, `configure` will pick `gcc` if available, else the platform's default (usually `cc`). Similarly, you can override the default compiler flags if needed with the `CFLAGS` variable.

Here is a list of the significant variables that can be set in this manner:

- `BISON` [#](#CONFIGURE-ENVVARS-BISON)

  Bison program

- `CC` [#](#CONFIGURE-ENVVARS-CC)

  C compiler

- `CFLAGS` [#](#CONFIGURE-ENVVARS-CFLAGS)

  options to pass to the C compiler

- `CLANG` [#](#CONFIGURE-ENVVARS-CLANG)

  path to `clang` program used to process source code for inlining when compiling with `--with-llvm`

- `CPP` [#](#CONFIGURE-ENVVARS-CPP)

  C preprocessor

- `CPPFLAGS` [#](#CONFIGURE-ENVVARS-CPPFLAGS)

  options to pass to the C preprocessor

- `CXX` [#](#CONFIGURE-ENVVARS-CXX)

  C++ compiler

- `CXXFLAGS` [#](#CONFIGURE-ENVVARS-CXXFLAGS)

  options to pass to the C++ compiler

- `DTRACE` [#](#CONFIGURE-ENVVARS-DTRACE)

  location of the `dtrace` program

- `DTRACEFLAGS` [#](#CONFIGURE-ENVVARS-DTRACEFLAGS)

  options to pass to the `dtrace` program

- `FLEX` [#](#CONFIGURE-ENVVARS-FLEX)

  Flex program

- `LDFLAGS` [#](#CONFIGURE-ENVVARS-LDFLAGS)

  options to use when linking either executables or shared libraries

- `LDFLAGS_EX` [#](#CONFIGURE-ENVVARS-LDFLAGS-EX)

  additional options for linking executables only

- `LDFLAGS_SL` [#](#CONFIGURE-ENVVARS-LDFLAGS-SL)

  additional options for linking shared libraries only

- `LLVM_CONFIG` [#](#CONFIGURE-ENVVARS-LLVM-CONFIG)

  `llvm-config` program used to locate the LLVM installation

- `MSGFMT` [#](#CONFIGURE-ENVVARS-MSGFMT)

  `msgfmt` program for native language support

- `PERL` [#](#CONFIGURE-ENVVARS-PERL)

  Perl interpreter program. This will be used to determine the dependencies for building PL/Perl. The default is `perl`.

- `PYTHON` [#](#CONFIGURE-ENVVARS-PYTHON)

  Python interpreter program. This will be used to determine the dependencies for building PL/Python. If this is not set, the following are probed in this order: `python3 python`.

- `TCLSH` [#](#CONFIGURE-ENVVARS-TCLSH)

  Tcl interpreter program. This will be used to determine the dependencies for building PL/Tcl. If this is not set, the following are probed in this order: `tclsh tcl tclsh8.6 tclsh86 tclsh8.5 tclsh85 tclsh8.4 tclsh84`.

- `XML2_CONFIG` [#](#CONFIGURE-ENVVARS-XML2-CONFIG)

  `xml2-config` program used to locate the libxml2 installation

Sometimes it is useful to add compiler flags after-the-fact to the set that were chosen by `configure`. An important example is that gcc's `-Werror` option cannot be included in the `CFLAGS` passed to `configure`, because it will break many of `configure`'s built-in tests. To add such flags, include them in the `COPT` environment variable while running `make`. The contents of `COPT` are added to both the `CFLAGS` and `LDFLAGS` options set up by `configure`. For example, you could do

```
make COPT='-Werror'
```

or

```
export COPT='-Werror'
make
```

### Note

If using GCC, it is best to build with an optimization level of at least `-O1`, because using no optimization (`-O0`) disables some important compiler warnings (such as the use of uninitialized variables). However, non-zero optimization levels can complicate debugging because stepping through compiled code will usually not match up one-to-one with source code lines. If you get confused while trying to debug optimized code, recompile the specific files of interest with `-O0`. An easy way to do this is by passing an option to make: `make PROFILE=-O0 file.o`.

The `COPT` and `PROFILE` environment variables are actually handled identically by the PostgreSQL makefiles. Which to use is a matter of preference, but a common habit among developers is to use `PROFILE` for one-time flag adjustments, while `COPT` might be kept set all the time.

[#id](#INSTALL-WINDOWS-FULL)

## 18.1. Building with Visual C++ or the Microsoft Windows SDK [#](#INSTALL-WINDOWS-FULL)

- [18.1.1. Requirements](install-windows-full#INSTALL-WINDOWS-FULL-REQUIREMENTS)
- [18.1.2. Special Considerations for 64-Bit Windows](install-windows-full#INSTALL-WINDOWS-FULL-64-BIT)
- [18.1.3. Building](install-windows-full#INSTALL-WINDOWS-FULL-BUILD)
- [18.1.4. Cleaning and Installing](install-windows-full#INSTALL-WINDOWS-FULL-CLEAN-INST)
- [18.1.5. Running the Regression Tests](install-windows-full#INSTALL-WINDOWS-FULL-REG-TESTS)

PostgreSQL can be built using the Visual C++ compiler suite from Microsoft. These compilers can be either from Visual Studio, Visual Studio Express or some versions of the Microsoft Windows SDK. If you do not already have a Visual Studio environment set up, the easiest ways are to use the compilers from Visual Studio 2022 or those in the Windows SDK 10, which are both free downloads from Microsoft.

Both 32-bit and 64-bit builds are possible with the Microsoft Compiler suite. 32-bit PostgreSQL builds are possible with Visual Studio 2015 to Visual Studio 2022, as well as standalone Windows SDK releases 10 and above. 64-bit PostgreSQL builds are supported with Microsoft Windows SDK version 10 and above or Visual Studio 2015 and above.

The tools for building using Visual C++ or Platform SDK are in the `src\tools\msvc` directory. When building, make sure there are no tools from MinGW or Cygwin present in your system PATH. Also, make sure you have all the required Visual C++ tools available in the PATH. In Visual Studio, start the Visual Studio Command Prompt. If you wish to build a 64-bit version, you must use the 64-bit version of the command, and vice versa. Starting with Visual Studio 2017 this can be done from the command line using `VsDevCmd.bat`, see `-help` for the available options and their default values. `vsvars32.bat` is available in Visual Studio 2015 and earlier versions for the same purpose. From the Visual Studio Command Prompt, you can change the targeted CPU architecture, build type, and target OS by using the `vcvarsall.bat` command, e.g., `vcvarsall.bat x64 10.0.10240.0` to target Windows 10 with a 64-bit release build. See `-help` for the other options of `vcvarsall.bat`. All commands should be run from the `src\tools\msvc` directory.

Before you build, you can create the file `config.pl` to reflect any configuration options you want to change, or the paths to any third party libraries to use. The complete configuration is determined by first reading and parsing the file `config_default.pl`, and then apply any changes from `config.pl`. For example, to specify the location of your Python installation, put the following in `config.pl`:

```
$config->{python} = 'c:\python310';
```

You only need to specify those parameters that are different from what's in `config_default.pl`.

If you need to set any other environment variables, create a file called `buildenv.pl` and put the required commands there. For example, to add the path for bison when it's not in the PATH, create a file containing:

```
$ENV{PATH}=$ENV{PATH} . ';c:\some\where\bison\bin';
```

To pass additional command line arguments to the Visual Studio build command (msbuild or vcbuild):

```
$ENV{MSBFLAGS}="/m";
```

[#id](#INSTALL-WINDOWS-FULL-REQUIREMENTS)

### 18.1.1. Requirements [#](#INSTALL-WINDOWS-FULL-REQUIREMENTS)

The following additional products are required to build PostgreSQL. Use the `config.pl` file to specify which directories the libraries are available in.

- Microsoft Windows SDK

  If your build environment doesn't ship with a supported version of the Microsoft Windows SDK it is recommended that you upgrade to the latest version (currently version 10), available for download from [https://www.microsoft.com/download](https://www.microsoft.com/download).

  You must always include the Windows Headers and Libraries part of the SDK. If you install a Windows SDK including the Visual C++ Compilers, you don't need Visual Studio to build. Note that as of Version 8.0a the Windows SDK no longer ships with a complete command-line build environment.

- ActiveState Perl

  ActiveState Perl is required to run the build generation scripts. MinGW or Cygwin Perl will not work. It must also be present in the PATH. Binaries can be downloaded from [https://www.activestate.com](https://www.activestate.com) (Note: version 5.14 or later is required, the free Standard Distribution is sufficient).

The following additional products are not required to get started, but are required to build the complete package. Use the `config.pl` file to specify which directories the libraries are available in.

- ActiveState TCL

  Required for building PL/Tcl (Note: version 8.4 is required, the free Standard Distribution is sufficient).

- Bison and Flex

  Bison and Flex are required to build from Git, but not required when building from a release file. Only Bison versions 2.3 and later will work. Flex must be version 2.5.35 or later.

  Both Bison and Flex are included in the msys tool suite, available from [http://www.mingw.org/wiki/MSYS](http://www.mingw.org/wiki/MSYS) as part of the MinGW compiler suite.

  You will need to add the directory containing `flex.exe` and `bison.exe` to the PATH environment variable in `buildenv.pl` unless they are already in PATH. In the case of MinGW, the directory is the `\msys\1.0\bin` subdirectory of your MinGW installation directory.

  ### Note

  The Bison distribution from GnuWin32 appears to have a bug that causes Bison to malfunction when installed in a directory with spaces in the name, such as the default location on English installations `C:\Program Files\GnuWin32`. Consider installing into `C:\GnuWin32` or use the NTFS short name path to GnuWin32 in your PATH environment setting (e.g., `C:\PROGRA~1\GnuWin32`).

- Diff

  Diff is required to run the regression tests, and can be downloaded from [http://gnuwin32.sourceforge.net](http://gnuwin32.sourceforge.net).

- Gettext

  Gettext is required to build with NLS support, and can be downloaded from [http://gnuwin32.sourceforge.net](http://gnuwin32.sourceforge.net). Note that binaries, dependencies and developer files are all needed.

- MIT Kerberos

  Required for GSSAPI authentication support. MIT Kerberos can be downloaded from [https://web.mit.edu/Kerberos/dist/index.html](https://web.mit.edu/Kerberos/dist/index.html).

- libxml2 and libxslt

  Required for XML support. Binaries can be downloaded from [https://zlatkovic.com/pub/libxml](https://zlatkovic.com/pub/libxml) or source from [http://xmlsoft.org](http://xmlsoft.org). Note that libxml2 requires iconv, which is available from the same download location.

- LZ4

  Required for supporting LZ4 compression. Binaries and source can be downloaded from [https://github.com/lz4/lz4/releases](https://github.com/lz4/lz4/releases).

- Zstandard

  Required for supporting Zstandard compression. Binaries and source can be downloaded from [https://github.com/facebook/zstd/releases](https://github.com/facebook/zstd/releases).

- OpenSSL

  Required for SSL support. Binaries can be downloaded from [https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html) or source from [https://www.openssl.org](https://www.openssl.org).

- ossp-uuid

  Required for UUID-OSSP support (contrib only). Source can be downloaded from [http://www.ossp.org/pkg/lib/uuid/](http://www.ossp.org/pkg/lib/uuid/).

- Python

  Required for building PL/Python. Binaries can be downloaded from [https://www.python.org](https://www.python.org).

- zlib

  Required for compression support in pg_dump and pg_restore. Binaries can be downloaded from [https://www.zlib.net](https://www.zlib.net).

[#id](#INSTALL-WINDOWS-FULL-64-BIT)

### 18.1.2. Special Considerations for 64-Bit Windows [#](#INSTALL-WINDOWS-FULL-64-BIT)

PostgreSQL will only build for the x64 architecture on 64-bit Windows.

Mixing 32- and 64-bit versions in the same build tree is not supported. The build system will automatically detect if it's running in a 32- or 64-bit environment, and build PostgreSQL accordingly. For this reason, it is important to start the correct command prompt before building.

To use a server-side third party library such as Python or OpenSSL, this library _must_ also be 64-bit. There is no support for loading a 32-bit library in a 64-bit server. Several of the third party libraries that PostgreSQL supports may only be available in 32-bit versions, in which case they cannot be used with 64-bit PostgreSQL.

[#id](#INSTALL-WINDOWS-FULL-BUILD)

### 18.1.3. Building [#](#INSTALL-WINDOWS-FULL-BUILD)

To build all of PostgreSQL in release configuration (the default), run the command:

```
build
```

To build all of PostgreSQL in debug configuration, run the command:

```
build DEBUG
```

To build just a single project, for example psql, run the commands:

```
build psql
build DEBUG psql
```

To change the default build configuration to debug, put the following in the `buildenv.pl` file:

```
$ENV{CONFIG}="Debug";
```

It is also possible to build from inside the Visual Studio GUI. In this case, you need to run:

```
perl mkvcbuild.pl
```

from the command prompt, and then open the generated `pgsql.sln` (in the root directory of the source tree) in Visual Studio.

[#id](#INSTALL-WINDOWS-FULL-CLEAN-INST)

### 18.1.4. Cleaning and Installing [#](#INSTALL-WINDOWS-FULL-CLEAN-INST)

Most of the time, the automatic dependency tracking in Visual Studio will handle changed files. But if there have been large changes, you may need to clean the installation. To do this, simply run the `clean.bat` command, which will automatically clean out all generated files. You can also run it with the _`dist`_ parameter, in which case it will behave like **`make distclean`** and remove the flex/bison output files as well.

By default, all files are written into a subdirectory of the `debug` or `release` directories. To install these files using the standard layout, and also generate the files required to initialize and use the database, run the command:

```
install c:\destination\directory
```

If you want to install only the client applications and interface libraries, then you can use these commands:

```
install c:\destination\directory client
```

[#id](#INSTALL-WINDOWS-FULL-REG-TESTS)

### 18.1.5. Running the Regression Tests [#](#INSTALL-WINDOWS-FULL-REG-TESTS)

To run the regression tests, make sure you have completed the build of all required parts first. Also, make sure that the DLLs required to load all parts of the system (such as the Perl and Python DLLs for the procedural languages) are present in the system path. If they are not, set it through the `buildenv.pl` file. To run the tests, run one of the following commands from the `src\tools\msvc` directory:

```
vcregress check
vcregress installcheck
vcregress plcheck
vcregress contribcheck
vcregress modulescheck
vcregress ecpgcheck
vcregress isolationcheck
vcregress bincheck
vcregress recoverycheck
```

To change the schedule used (default is parallel), append it to the command line like:

```
vcregress check serial
```

For more information about the regression tests, see [Chapter 33](regress).

Running the regression tests on client programs, with `vcregress bincheck`, or on recovery tests, with `vcregress recoverycheck`, requires an additional Perl module to be installed:

- IPC::Run

  As of this writing, `IPC::Run` is not included in the ActiveState Perl installation, nor in the ActiveState Perl Package Manager (PPM) library. To install, download the `IPC-Run-<version>.tar.gz` source archive from CPAN, at [https://metacpan.org/dist/IPC-Run](https://metacpan.org/dist/IPC-Run), and uncompress. Edit the `buildenv.pl` file, and add a PERL5LIB variable to point to the `lib` subdirectory from the extracted archive. For example:

  ```
  $ENV{PERL5LIB}=$ENV{PERL5LIB} . ';c:\IPC-Run-0.94\lib';
  ```

The TAP tests run with `vcregress` support the environment variables `PROVE_TESTS`, that is expanded automatically using the name patterns given, and `PROVE_FLAGS`. These can be set on a Windows terminal, before running `vcregress`:

```
set PROVE_FLAGS=--timer --jobs 2
set PROVE_TESTS=t/020*.pl t/010*.pl
```

It is also possible to set up those parameters in `buildenv.pl`:

```
$ENV{PROVE_FLAGS}='--timer --jobs 2'
$ENV{PROVE_TESTS}='t/020*.pl t/010*.pl'
```

Additionally, the behavior of TAP tests can be controlled by a set of environment variables, see [Section 33.4.1](regress-tap#REGRESS-TAP-VARS).

Some of the TAP tests depend on a set of external commands that would optionally trigger tests related to them. Each one of those variables can be set or unset in `buildenv.pl`:

- `GZIP_PROGRAM`

  Path to a gzip command. The default is `gzip`, which will search for a command by that name in the configured `PATH`.

- `LZ4`

  Path to a lz4 command. The default is `lz4`, which will search for a command by that name in the configured `PATH`.

- `OPENSSL`

  Path to an openssl command. The default is `openssl`, which will search for a command by that name in the configured `PATH`.

- `TAR`

  Path to a tar command. The default is `tar`, which will search for a command by that name in the configured `PATH`.

- `ZSTD`

  Path to a zstd command. The default is `zstd`, which will search for a command by that name in the configured `PATH`.

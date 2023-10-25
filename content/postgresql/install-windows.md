<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            Chapter 18. Installation from Source Code on Windows           |                                                    |                                 |                                                       |                                                                                                        |
| :-----------------------------------------------------------------------: | :------------------------------------------------- | :-----------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------------------------------------: |
| [Prev](installation-platform-notes.html "17.7. Platform-Specific Notes")  | [Up](admin.html "Part III. Server Administration") | Part III. Server Administration | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](install-windows-full.html "18.1. Building with Visual C++ or the&#xA;  Microsoft Windows SDK") |

***

## Chapter 18. Installation from Source Code on Windows

**Table of Contents**

*   [18.1. Building with Visual C++ or the Microsoft Windows SDK](install-windows-full.html)

    *   *   [18.1.1. Requirements](install-windows-full.html#INSTALL-WINDOWS-FULL-REQUIREMENTS)
        *   [18.1.2. Special Considerations for 64-Bit Windows](install-windows-full.html#INSTALL-WINDOWS-FULL-64-BIT)
        *   [18.1.3. Building](install-windows-full.html#INSTALL-WINDOWS-FULL-BUILD)
        *   [18.1.4. Cleaning and Installing](install-windows-full.html#INSTALL-WINDOWS-FULL-CLEAN-INST)
        *   [18.1.5. Running the Regression Tests](install-windows-full.html#INSTALL-WINDOWS-FULL-REG-TESTS)



It is recommended that most users download the binary distribution for Windows, available as a graphical installer package from the PostgreSQL website at <https://www.postgresql.org/download/>. Building from source is only intended for people developing PostgreSQL or extensions.

There are several different ways of building PostgreSQL on Windows. The simplest way to build with Microsoft tools is to install Visual Studio 2022 and use the included compiler. It is also possible to build with the full Microsoft Visual C++ 2015 to 2022. In some cases that requires the installation of the Windows SDK in addition to the compiler.

It is also possible to build PostgreSQL using the GNU compiler tools provided by MinGW, or using Cygwin for older versions of Windows.

Building using MinGW or Cygwin uses the normal build system, see [Chapter 17](installation.html "Chapter 17. Installation from Source Code") and the specific notes in [Section 17.7.4](installation-platform-notes.html#INSTALLATION-NOTES-MINGW "17.7.4. MinGW/Native Windows") and [Section 17.7.2](installation-platform-notes.html#INSTALLATION-NOTES-CYGWIN "17.7.2. Cygwin"). To produce native 64 bit binaries in these environments, use the tools from MinGW-w64. These tools can also be used to cross-compile for 32 bit and 64 bit Windows targets on other hosts, such as Linux and macOS. Cygwin is not recommended for running a production server, and it should only be used for running on older versions of Windows where the native build does not work. The official binaries are built using Visual Studio.

Native builds of psql don't support command line editing. The Cygwin build does support command line editing, so it should be used where psql is needed for interactive use on Windows.

***

|                                                                           |                                                       |                                                                                                        |
| :------------------------------------------------------------------------ | :---------------------------------------------------: | -----------------------------------------------------------------------------------------------------: |
| [Prev](installation-platform-notes.html "17.7. Platform-Specific Notes")  |   [Up](admin.html "Part III. Server Administration")  |  [Next](install-windows-full.html "18.1. Building with Visual C++ or the&#xA;  Microsoft Windows SDK") |
| 17.7. Platform-Specific Notes                                             | [Home](index.html "PostgreSQL 17devel Documentation") |                                            18.1. Building with Visual C++ or the Microsoft Windows SDK |

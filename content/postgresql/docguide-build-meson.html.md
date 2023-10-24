<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                J.4. Building the Documentation with Meson                |                                                 |                           |                                                       |                                                                 |
| :----------------------------------------------------------------------: | :---------------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](docguide-build.html "J.3. Building the Documentation with Make")  | [Up](docguide.html "Appendix J. Documentation") | Appendix J. Documentation | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](docguide-authoring.html "J.5. Documentation Authoring") |

***

## J.4. Building the Documentation with Meson [#](#DOCGUIDE-BUILD-MESON)

Two options are provided for building the documentation using Meson. Change to the `build` directory before running one of these commands, or add `-C build` to the command.

To build just the HTML version of the documentation:

    build$ ninja docs

To build all forms of the documentation:

    build$ ninja alldocs

The output appears in the subdirectory `build/doc/src/sgml`.

***

|                                                                          |                                                       |                                                                 |
| :----------------------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](docguide-build.html "J.3. Building the Documentation with Make")  |    [Up](docguide.html "Appendix J. Documentation")    |  [Next](docguide-authoring.html "J.5. Documentation Authoring") |
| J.3. Building the Documentation with Make                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                    J.5. Documentation Authoring |

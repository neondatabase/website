

|                44.12. Tcl Procedure Names                |                                                                 |                                              |                                                       |                                                                       |
| :------------------------------------------------------: | :-------------------------------------------------------------- | :------------------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](pltcl-config.html "44.11. PL/Tcl Configuration")  | [Up](pltcl.html "Chapter 44. PL/Tcl — Tcl Procedural Language") | Chapter 44. PL/Tcl — Tcl Procedural Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](plperl.html "Chapter 45. PL/Perl — Perl Procedural Language") |

***

## 44.12. Tcl Procedure Names [#](#PLTCL-PROCNAMES)

In PostgreSQL, the same function name can be used for different function definitions as long as the number of arguments or their types differ. Tcl, however, requires all procedure names to be distinct. PL/Tcl deals with this by making the internal Tcl procedure names contain the object ID of the function from the system table `pg_proc` as part of their name. Thus, PostgreSQL functions with the same name and different argument types will be different Tcl procedures, too. This is not normally a concern for a PL/Tcl programmer, but it might be visible when debugging.

***

|                                                          |                                                                 |                                                                       |
| :------------------------------------------------------- | :-------------------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](pltcl-config.html "44.11. PL/Tcl Configuration")  | [Up](pltcl.html "Chapter 44. PL/Tcl — Tcl Procedural Language") |  [Next](plperl.html "Chapter 45. PL/Perl — Perl Procedural Language") |
| 44.11. PL/Tcl Configuration                              |      [Home](index.html "PostgreSQL 17devel Documentation")      |                        Chapter 45. PL/Perl — Perl Procedural Language |

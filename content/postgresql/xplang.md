<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|              Chapter 42. Procedural Languages              |                                                            |                            |                                                       |                                                                      |
| :--------------------------------------------------------: | :--------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](rules-triggers.html "41.7. Rules Versus Triggers")  | [Up](server-programming.html "Part V. Server Programming") | Part V. Server Programming | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](xplang-install.html "42.1. Installing Procedural Languages") |

***

## Chapter 42. Procedural Languages

**Table of Contents**

*   [42.1. Installing Procedural Languages](xplang-install.html)



PostgreSQL allows user-defined functions to be written in other languages besides SQL and C. These other languages are generically called *procedural languages* (PLs). For a function written in a procedural language, the database server has no built-in knowledge about how to interpret the function's source text. Instead, the task is passed to a special handler that knows the details of the language. The handler could either do all the work of parsing, syntax analysis, execution, etc. itself, or it could serve as “glue” between PostgreSQL and an existing implementation of a programming language. The handler itself is a C language function compiled into a shared object and loaded on demand, just like any other C function.

There are currently four procedural languages available in the standard PostgreSQL distribution: PL/pgSQL ([Chapter 43](plpgsql.html "Chapter 43. PL/pgSQL — SQL Procedural Language")), PL/Tcl ([Chapter 44](pltcl.html "Chapter 44. PL/Tcl — Tcl Procedural Language")), PL/Perl ([Chapter 45](plperl.html "Chapter 45. PL/Perl — Perl Procedural Language")), and PL/Python ([Chapter 46](plpython.html "Chapter 46. PL/Python — Python Procedural Language")). There are additional procedural languages available that are not included in the core distribution. [Appendix H](external-projects.html "Appendix H. External Projects") has information about finding them. In addition other languages can be defined by users; the basics of developing a new procedural language are covered in [Chapter 58](plhandler.html "Chapter 58. Writing a Procedural Language Handler").

***

|                                                            |                                                            |                                                                      |
| :--------------------------------------------------------- | :--------------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](rules-triggers.html "41.7. Rules Versus Triggers")  | [Up](server-programming.html "Part V. Server Programming") |  [Next](xplang-install.html "42.1. Installing Procedural Languages") |
| 41.7. Rules Versus Triggers                                |    [Home](index.html "PostgreSQL 17devel Documentation")   |                                42.1. Installing Procedural Languages |

<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                         Chapter 39. Triggers                         |                                                            |                            |                                                       |                                                                       |
| :------------------------------------------------------------------: | :--------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](extend-pgxs.html "38.18. Extension Building Infrastructure")  | [Up](server-programming.html "Part V. Server Programming") | Part V. Server Programming | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](trigger-definition.html "39.1. Overview of Trigger Behavior") |

***

## Chapter 39. Triggers

**Table of Contents**

*   *   [39.1. Overview of Trigger Behavior](trigger-definition.html)
    *   [39.2. Visibility of Data Changes](trigger-datachanges.html)
    *   [39.3. Writing Trigger Functions in C](trigger-interface.html)
    *   [39.4. A Complete Trigger Example](trigger-example.html)

[]()

This chapter provides general information about writing trigger functions. Trigger functions can be written in most of the available procedural languages, including PL/pgSQL ([Chapter 43](plpgsql.html "Chapter 43. PL/pgSQL — SQL Procedural Language")), PL/Tcl ([Chapter 44](pltcl.html "Chapter 44. PL/Tcl — Tcl Procedural Language")), PL/Perl ([Chapter 45](plperl.html "Chapter 45. PL/Perl — Perl Procedural Language")), and PL/Python ([Chapter 46](plpython.html "Chapter 46. PL/Python — Python Procedural Language")). After reading this chapter, you should consult the chapter for your favorite procedural language to find out the language-specific details of writing a trigger in it.

It is also possible to write a trigger function in C, although most people find it easier to use one of the procedural languages. It is not currently possible to write a trigger function in the plain SQL function language.

***

|                                                                      |                                                            |                                                                       |
| :------------------------------------------------------------------- | :--------------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](extend-pgxs.html "38.18. Extension Building Infrastructure")  | [Up](server-programming.html "Part V. Server Programming") |  [Next](trigger-definition.html "39.1. Overview of Trigger Behavior") |
| 38.18. Extension Building Infrastructure                             |    [Home](index.html "PostgreSQL 17devel Documentation")   |                                    39.1. Overview of Trigger Behavior |

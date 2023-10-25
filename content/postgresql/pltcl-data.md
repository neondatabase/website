<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      44.3. Data Values in PL/Tcl                     |                                                                 |                                              |                                                       |                                                          |
| :------------------------------------------------------------------: | :-------------------------------------------------------------- | :------------------------------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](pltcl-functions.html "44.2. PL/Tcl Functions and Arguments")  | [Up](pltcl.html "Chapter 44. PL/Tcl — Tcl Procedural Language") | Chapter 44. PL/Tcl — Tcl Procedural Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](pltcl-global.html "44.4. Global Data in PL/Tcl") |

***

## 44.3. Data Values in PL/Tcl [#](#PLTCL-DATA)

The argument values supplied to a PL/Tcl function's code are simply the input arguments converted to text form (just as if they had been displayed by a `SELECT` statement). Conversely, the `return` and `return_next` commands will accept any string that is acceptable input format for the function's declared result type, or for the specified column of a composite result type.

***

|                                                                      |                                                                 |                                                          |
| :------------------------------------------------------------------- | :-------------------------------------------------------------: | -------------------------------------------------------: |
| [Prev](pltcl-functions.html "44.2. PL/Tcl Functions and Arguments")  | [Up](pltcl.html "Chapter 44. PL/Tcl — Tcl Procedural Language") |  [Next](pltcl-global.html "44.4. Global Data in PL/Tcl") |
| 44.2. PL/Tcl Functions and Arguments                                 |      [Home](index.html "PostgreSQL 17devel Documentation")      |                              44.4. Global Data in PL/Tcl |

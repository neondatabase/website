<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                     36.16. Oracle Compatibility Mode                    |                                                        |                                      |                                                       |                                               |
| :---------------------------------------------------------------------: | :----------------------------------------------------- | :----------------------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](ecpg-informix-compat.html "36.15. Informix Compatibility Mode")  | [Up](ecpg.html "Chapter 36. ECPG — Embedded SQL in C") | Chapter 36. ECPG — Embedded SQL in C | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ecpg-develop.html "36.17. Internals") |

***

## 36.16. Oracle Compatibility Mode [#](#ECPG-ORACLE-COMPAT)

`ecpg` can be run in a so-called *Oracle compatibility mode*. If this mode is active, it tries to behave as if it were Oracle Pro\*C.

Specifically, this mode changes `ecpg` in three ways:

* Pad character arrays receiving character string types with trailing spaces to the specified length
* Zero byte terminate these character arrays, and set the indicator variable if truncation occurs
* Set the null indicator to `-1` when character arrays receive empty character string types

***

|                                                                         |                                                        |                                               |
| :---------------------------------------------------------------------- | :----------------------------------------------------: | --------------------------------------------: |
| [Prev](ecpg-informix-compat.html "36.15. Informix Compatibility Mode")  | [Up](ecpg.html "Chapter 36. ECPG — Embedded SQL in C") |  [Next](ecpg-develop.html "36.17. Internals") |
| 36.15. Informix Compatibility Mode                                      |  [Home](index.html "PostgreSQL 17devel Documentation") |                              36.17. Internals |

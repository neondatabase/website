

|                    45.2. Data Values in PL/Perl                    |                                                                    |                                                |                                                       |                                                          |
| :----------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](plperl-funcs.html "45.1. PL/Perl Functions and Arguments")  | [Up](plperl.html "Chapter 45. PL/Perl — Perl Procedural Language") | Chapter 45. PL/Perl — Perl Procedural Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](plperl-builtins.html "45.3. Built-in Functions") |

***

## 45.2. Data Values in PL/Perl [#](#PLPERL-DATA)

The argument values supplied to a PL/Perl function's code are simply the input arguments converted to text form (just as if they had been displayed by a `SELECT` statement). Conversely, the `return` and `return_next` commands will accept any string that is acceptable input format for the function's declared return type.

If this behavior is inconvenient for a particular case, it can be improved by using a transform, as already illustrated for `bool` values. Several examples of transform modules are included in the PostgreSQL distribution.

***

|                                                                    |                                                                    |                                                          |
| :----------------------------------------------------------------- | :----------------------------------------------------------------: | -------------------------------------------------------: |
| [Prev](plperl-funcs.html "45.1. PL/Perl Functions and Arguments")  | [Up](plperl.html "Chapter 45. PL/Perl — Perl Procedural Language") |  [Next](plperl-builtins.html "45.3. Built-in Functions") |
| 45.1. PL/Perl Functions and Arguments                              |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                 45.3. Built-in Functions |

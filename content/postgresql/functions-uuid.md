

|                              9.14. UUID Functions                              |                                                           |                                    |                                                       |                                                   |
| :----------------------------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------: |
| [Prev](functions-textsearch.html "9.13. Text Search Functions and Operators")  | [Up](functions.html "Chapter 9. Functions and Operators") | Chapter 9. Functions and Operators | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](functions-xml.html "9.15. XML Functions") |

***

## 9.14. UUID Functions [#](#FUNCTIONS-UUID)

PostgreSQL includes one function to generate a UUID:

```

gen_random_uuid () → uuid
```

This function returns a version 4 (random) UUID. This is the most commonly used type of UUID and is appropriate for most applications.

The [uuid-ossp](uuid-ossp.html "F.48. uuid-ossp — a UUID generator") module provides additional functions that implement other standard algorithms for generating UUIDs.

PostgreSQL also provides the usual comparison operators shown in [Table 9.1](functions-comparison.html#FUNCTIONS-COMPARISON-OP-TABLE "Table 9.1. Comparison Operators") for UUIDs.

***

|                                                                                |                                                           |                                                   |
| :----------------------------------------------------------------------------- | :-------------------------------------------------------: | ------------------------------------------------: |
| [Prev](functions-textsearch.html "9.13. Text Search Functions and Operators")  | [Up](functions.html "Chapter 9. Functions and Operators") |  [Next](functions-xml.html "9.15. XML Functions") |
| 9.13. Text Search Functions and Operators                                      |   [Home](index.html "PostgreSQL 17devel Documentation")   |                               9.15. XML Functions |

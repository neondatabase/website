<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                         Chapter 10. Type Conversion                         |                                            |                           |                                                       |                                                  |
| :-------------------------------------------------------------------------: | :----------------------------------------- | :-----------------------: | ----------------------------------------------------: | -----------------------------------------------: |
| [Prev](functions-statistics.html "9.30. Statistics Information Functions")  | [Up](sql.html "Part II. The SQL Language") | Part II. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](typeconv-overview.html "10.1. Overview") |

***

## Chapter 10. Type Conversion

**Table of Contents**

*   *   [10.1. Overview](typeconv-overview.html)
    *   [10.2. Operators](typeconv-oper.html)
    *   [10.3. Functions](typeconv-func.html)
    *   [10.4. Value Storage](typeconv-query.html)
    *   [10.5. `UNION`, `CASE`, and Related Constructs](typeconv-union-case.html)
    *   [10.6. `SELECT` Output Columns](typeconv-select.html)

[]()

SQL statements can, intentionally or not, require the mixing of different data types in the same expression. PostgreSQL has extensive facilities for evaluating mixed-type expressions.

In many cases a user does not need to understand the details of the type conversion mechanism. However, implicit conversions done by PostgreSQL can affect the results of a query. When necessary, these results can be tailored by using *explicit* type conversion.

This chapter introduces the PostgreSQL type conversion mechanisms and conventions. Refer to the relevant sections in [Chapter 8](datatype.html "Chapter 8. Data Types") and [Chapter 9](functions.html "Chapter 9. Functions and Operators") for more information on specific data types and allowed functions and operators.

***

|                                                                             |                                                       |                                                  |
| :-------------------------------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------: |
| [Prev](functions-statistics.html "9.30. Statistics Information Functions")  |       [Up](sql.html "Part II. The SQL Language")      |  [Next](typeconv-overview.html "10.1. Overview") |
| 9.30. Statistics Information Functions                                      | [Home](index.html "PostgreSQL 17devel Documentation") |                                   10.1. Overview |

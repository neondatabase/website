[#id](#TYPECONV)

## Chapter 10. Type Conversion

**Table of Contents**

- [10.1. Overview](typeconv-overview)
- [10.2. Operators](typeconv-oper)
- [10.3. Functions](typeconv-func)
- [10.4. Value Storage](typeconv-query)
- [10.5. `UNION`, `CASE`, and Related Constructs](typeconv-union-case)
- [10.6. `SELECT` Output Columns](typeconv-select)

SQL statements can, intentionally or not, require the mixing of different data types in the same expression. PostgreSQL has extensive facilities for evaluating mixed-type expressions.

In many cases a user does not need to understand the details of the type conversion mechanism. However, implicit conversions done by PostgreSQL can affect the results of a query. When necessary, these results can be tailored by using _explicit_ type conversion.

This chapter introduces the PostgreSQL type conversion mechanisms and conventions. Refer to the relevant sections in [Chapter 8](datatype) and [Chapter 9](functions) for more information on specific data types and allowed functions and operators.

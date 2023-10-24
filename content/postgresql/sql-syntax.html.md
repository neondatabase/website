<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             Chapter 4. SQL Syntax             |                                            |                           |                                                       |                                                           |
| :-------------------------------------------: | :----------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------------------: |
| [Prev](sql.html "Part II. The SQL Language")  | [Up](sql.html "Part II. The SQL Language") | Part II. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-syntax-lexical.html "4.1. Lexical Structure") |

***

## Chapter 4. SQL Syntax

**Table of Contents**

*   [4.1. Lexical Structure](sql-syntax-lexical.html)

    *   *   [4.1.1. Identifiers and Key Words](sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)
        *   [4.1.2. Constants](sql-syntax-lexical.html#SQL-SYNTAX-CONSTANTS)
        *   [4.1.3. Operators](sql-syntax-lexical.html#SQL-SYNTAX-OPERATORS)
        *   [4.1.4. Special Characters](sql-syntax-lexical.html#SQL-SYNTAX-SPECIAL-CHARS)
        *   [4.1.5. Comments](sql-syntax-lexical.html#SQL-SYNTAX-COMMENTS)
        *   [4.1.6. Operator Precedence](sql-syntax-lexical.html#SQL-PRECEDENCE)

*   [4.2. Value Expressions](sql-expressions.html)

    *   *   [4.2.1. Column References](sql-expressions.html#SQL-EXPRESSIONS-COLUMN-REFS)
        *   [4.2.2. Positional Parameters](sql-expressions.html#SQL-EXPRESSIONS-PARAMETERS-POSITIONAL)
        *   [4.2.3. Subscripts](sql-expressions.html#SQL-EXPRESSIONS-SUBSCRIPTS)
        *   [4.2.4. Field Selection](sql-expressions.html#FIELD-SELECTION)
        *   [4.2.5. Operator Invocations](sql-expressions.html#SQL-EXPRESSIONS-OPERATOR-CALLS)
        *   [4.2.6. Function Calls](sql-expressions.html#SQL-EXPRESSIONS-FUNCTION-CALLS)
        *   [4.2.7. Aggregate Expressions](sql-expressions.html#SYNTAX-AGGREGATES)
        *   [4.2.8. Window Function Calls](sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS)
        *   [4.2.9. Type Casts](sql-expressions.html#SQL-SYNTAX-TYPE-CASTS)
        *   [4.2.10. Collation Expressions](sql-expressions.html#SQL-SYNTAX-COLLATE-EXPRS)
        *   [4.2.11. Scalar Subqueries](sql-expressions.html#SQL-SYNTAX-SCALAR-SUBQUERIES)
        *   [4.2.12. Array Constructors](sql-expressions.html#SQL-SYNTAX-ARRAY-CONSTRUCTORS)
        *   [4.2.13. Row Constructors](sql-expressions.html#SQL-SYNTAX-ROW-CONSTRUCTORS)
        *   [4.2.14. Expression Evaluation Rules](sql-expressions.html#SYNTAX-EXPRESS-EVAL)

*   [4.3. Calling Functions](sql-syntax-calling-funcs.html)

    *   *   [4.3.1. Using Positional Notation](sql-syntax-calling-funcs.html#SQL-SYNTAX-CALLING-FUNCS-POSITIONAL)
        *   [4.3.2. Using Named Notation](sql-syntax-calling-funcs.html#SQL-SYNTAX-CALLING-FUNCS-NAMED)
        *   [4.3.3. Using Mixed Notation](sql-syntax-calling-funcs.html#SQL-SYNTAX-CALLING-FUNCS-MIXED)

[]()

This chapter describes the syntax of SQL. It forms the foundation for understanding the following chapters which will go into detail about how SQL commands are applied to define and modify data.

We also advise users who are already familiar with SQL to read this chapter carefully because it contains several rules and concepts that are implemented inconsistently among SQL databases or that are specific to PostgreSQL.

***

|                                               |                                                       |                                                           |
| :-------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------: |
| [Prev](sql.html "Part II. The SQL Language")  |       [Up](sql.html "Part II. The SQL Language")      |  [Next](sql-syntax-lexical.html "4.1. Lexical Structure") |
| Part II. The SQL Language                     | [Home](index.html "PostgreSQL 17devel Documentation") |                                    4.1. Lexical Structure |

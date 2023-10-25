

|                   Chapter 38. Extending SQL                   |                                                            |                            |                                                       |                                                          |
| :-----------------------------------------------------------: | :--------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](server-programming.html "Part V. Server Programming")  | [Up](server-programming.html "Part V. Server Programming") | Part V. Server Programming | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](extend-how.html "38.1. How Extensibility Works") |

***

## Chapter 38. Extending SQL

**Table of Contents**

  * *   [38.1. How Extensibility Works](extend-how.html)
  * [38.2. The PostgreSQL Type System](extend-type-system.html)

    

  * *   [38.2.1. Base Types](extend-type-system.html#EXTEND-TYPE-SYSTEM-BASE)
    * [38.2.2. Container Types](extend-type-system.html#EXTEND-TYPE-SYSTEM-CONTAINER)
    * [38.2.3. Domains](extend-type-system.html#EXTEND-TYPE-SYSTEM-DOMAINS)
    * [38.2.4. Pseudo-Types](extend-type-system.html#EXTEND-TYPE-SYSTEM-PSEUDO)
    * [38.2.5. Polymorphic Types](extend-type-system.html#EXTEND-TYPES-POLYMORPHIC)

  * *   [38.3. User-Defined Functions](xfunc.html)
  * [38.4. User-Defined Procedures](xproc.html)
  * [38.5. Query Language (SQL) Functions](xfunc-sql.html)

    

  * *   [38.5.1. Arguments for SQL Functions](xfunc-sql.html#XFUNC-SQL-FUNCTION-ARGUMENTS)
    * [38.5.2. SQL Functions on Base Types](xfunc-sql.html#XFUNC-SQL-BASE-FUNCTIONS)
    * [38.5.3. SQL Functions on Composite Types](xfunc-sql.html#XFUNC-SQL-COMPOSITE-FUNCTIONS)
    * [38.5.4. SQL Functions with Output Parameters](xfunc-sql.html#XFUNC-OUTPUT-PARAMETERS)
    * [38.5.5. SQL Procedures with Output Parameters](xfunc-sql.html#XFUNC-OUTPUT-PARAMETERS-PROC)
    * [38.5.6. SQL Functions with Variable Numbers of Arguments](xfunc-sql.html#XFUNC-SQL-VARIADIC-FUNCTIONS)
    * [38.5.7. SQL Functions with Default Values for Arguments](xfunc-sql.html#XFUNC-SQL-PARAMETER-DEFAULTS)
    * [38.5.8. SQL Functions as Table Sources](xfunc-sql.html#XFUNC-SQL-TABLE-FUNCTIONS)
    * [38.5.9. SQL Functions Returning Sets](xfunc-sql.html#XFUNC-SQL-FUNCTIONS-RETURNING-SET)
    * [38.5.10. SQL Functions Returning `TABLE`](xfunc-sql.html#XFUNC-SQL-FUNCTIONS-RETURNING-TABLE)
    * [38.5.11. Polymorphic SQL Functions](xfunc-sql.html#XFUNC-SQL-POLYMORPHIC-FUNCTIONS)
    * [38.5.12. SQL Functions with Collations](xfunc-sql.html#XFUNC-SQL-COLLATIONS)

  * *   [38.6. Function Overloading](xfunc-overload.html)
  * [38.7. Function Volatility Categories](xfunc-volatility.html)
  * [38.8. Procedural Language Functions](xfunc-pl.html)
  * [38.9. Internal Functions](xfunc-internal.html)
  * [38.10. C-Language Functions](xfunc-c.html)

    

  * *   [38.10.1. Dynamic Loading](xfunc-c.html#XFUNC-C-DYNLOAD)
    * [38.10.2. Base Types in C-Language Functions](xfunc-c.html#XFUNC-C-BASETYPE)
    * [38.10.3. Version 1 Calling Conventions](xfunc-c.html#XFUNC-C-V1-CALL-CONV)
    * [38.10.4. Writing Code](xfunc-c.html#XFUNC-C-CODE)
    * [38.10.5. Compiling and Linking Dynamically-Loaded Functions](xfunc-c.html#DFUNC)
    * [38.10.6. Composite-Type Arguments](xfunc-c.html#XFUNC-C-COMPOSITE-TYPE-ARGS)
    * [38.10.7. Returning Rows (Composite Types)](xfunc-c.html#XFUNC-C-RETURNING-ROWS)
    * [38.10.8. Returning Sets](xfunc-c.html#XFUNC-C-RETURN-SET)
    * [38.10.9. Polymorphic Arguments and Return Types](xfunc-c.html#XFUNC-C-POLYMORPHIC)
    * [38.10.10. Shared Memory and LWLocks](xfunc-c.html#XFUNC-SHARED-ADDIN)
    * [38.10.11. Custom Wait Events](xfunc-c.html#XFUNC-ADDIN-WAIT-EVENTS)
    * [38.10.12. Using C++ for Extensibility](xfunc-c.html#EXTEND-CPP)

  * *   [38.11. Function Optimization Information](xfunc-optimization.html)
  * [38.12. User-Defined Aggregates](xaggr.html)

    

  * *   [38.12.1. Moving-Aggregate Mode](xaggr.html#XAGGR-MOVING-AGGREGATES)
    * [38.12.2. Polymorphic and Variadic Aggregates](xaggr.html#XAGGR-POLYMORPHIC-AGGREGATES)
    * [38.12.3. Ordered-Set Aggregates](xaggr.html#XAGGR-ORDERED-SET-AGGREGATES)
    * [38.12.4. Partial Aggregation](xaggr.html#XAGGR-PARTIAL-AGGREGATES)
    * [38.12.5. Support Functions for Aggregates](xaggr.html#XAGGR-SUPPORT-FUNCTIONS)

* [38.13. User-Defined Types](xtypes.html)

  * [38.13.1. TOAST Considerations](xtypes.html#XTYPES-TOAST)

  * *   [38.14. User-Defined Operators](xoper.html)
  * [38.15. Operator Optimization Information](xoper-optimization.html)

    

  * *   [38.15.1. `COMMUTATOR`](xoper-optimization.html#XOPER-COMMUTATOR)
    * [38.15.2. `NEGATOR`](xoper-optimization.html#XOPER-NEGATOR)
    * [38.15.3. `RESTRICT`](xoper-optimization.html#XOPER-RESTRICT)
    * [38.15.4. `JOIN`](xoper-optimization.html#XOPER-JOIN)
    * [38.15.5. `HASHES`](xoper-optimization.html#XOPER-HASHES)
    * [38.15.6. `MERGES`](xoper-optimization.html#XOPER-MERGES)

* [38.16. Interfacing Extensions to Indexes](xindex.html)

  * *   [38.16.1. Index Methods and Operator Classes](xindex.html#XINDEX-OPCLASS)
    * [38.16.2. Index Method Strategies](xindex.html#XINDEX-STRATEGIES)
    * [38.16.3. Index Method Support Routines](xindex.html#XINDEX-SUPPORT)
    * [38.16.4. An Example](xindex.html#XINDEX-EXAMPLE)
    * [38.16.5. Operator Classes and Operator Families](xindex.html#XINDEX-OPFAMILY)
    * [38.16.6. System Dependencies on Operator Classes](xindex.html#XINDEX-OPCLASS-DEPENDENCIES)
    * [38.16.7. Ordering Operators](xindex.html#XINDEX-ORDERING-OPS)
    * [38.16.8. Special Features of Operator Classes](xindex.html#XINDEX-OPCLASS-FEATURES)

* [38.17. Packaging Related Objects into an Extension](extend-extensions.html)

  * *   [38.17.1. Extension Files](extend-extensions.html#EXTEND-EXTENSIONS-FILES)
    * [38.17.2. Extension Relocatability](extend-extensions.html#EXTEND-EXTENSIONS-RELOCATION)
    * [38.17.3. Extension Configuration Tables](extend-extensions.html#EXTEND-EXTENSIONS-CONFIG-TABLES)
    * [38.17.4. Extension Updates](extend-extensions.html#EXTEND-EXTENSIONS-UPDATES)
    * [38.17.5. Installing Extensions Using Update Scripts](extend-extensions.html#EXTEND-EXTENSIONS-UPDATE-SCRIPTS)
    * [38.17.6. Security Considerations for Extensions](extend-extensions.html#EXTEND-EXTENSIONS-SECURITY)
    * [38.17.7. Extension Example](extend-extensions.html#EXTEND-EXTENSIONS-EXAMPLE)

* [38.18. Extension Building Infrastructure](extend-pgxs.html)

In the sections that follow, we will discuss how you can extend the PostgreSQL SQL query language by adding:

* functions (starting in [Section 38.3](xfunc.html "38.3. User-Defined Functions"))
* aggregates (starting in [Section 38.12](xaggr.html "38.12. User-Defined Aggregates"))
* data types (starting in [Section 38.13](xtypes.html "38.13. User-Defined Types"))
* operators (starting in [Section 38.14](xoper.html "38.14. User-Defined Operators"))
* operator classes for indexes (starting in [Section 38.16](xindex.html "38.16. Interfacing Extensions to Indexes"))
* packages of related objects (starting in [Section 38.17](extend-extensions.html "38.17. Packaging Related Objects into an Extension"))

***

|                                                               |                                                            |                                                          |
| :------------------------------------------------------------ | :--------------------------------------------------------: | -------------------------------------------------------: |
| [Prev](server-programming.html "Part V. Server Programming")  | [Up](server-programming.html "Part V. Server Programming") |  [Next](extend-how.html "38.1. How Extensibility Works") |
| Part V. Server Programming                                    |    [Home](index.html "PostgreSQL 17devel Documentation")   |                            38.1. How Extensibility Works |

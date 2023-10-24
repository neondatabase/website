<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|         Chapter 9. Functions and Operators         |                                            |                           |                                                       |                                                          |
| :------------------------------------------------: | :----------------------------------------- | :-----------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](datatype-pseudo.html "8.21. Pseudo-Types")  | [Up](sql.html "Part II. The SQL Language") | Part II. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](functions-logical.html "9.1. Logical Operators") |

***

## Chapter 9. Functions and Operators

**Table of Contents**

*   *   [9.1. Logical Operators](functions-logical.html)
    *   [9.2. Comparison Functions and Operators](functions-comparison.html)
    *   [9.3. Mathematical Functions and Operators](functions-math.html)
    *   [9.4. String Functions and Operators](functions-string.html)

    <!---->

    *   [9.4.1. `format`](functions-string.html#FUNCTIONS-STRING-FORMAT)

*   *   [9.5. Binary String Functions and Operators](functions-binarystring.html)
    *   [9.6. Bit String Functions and Operators](functions-bitstring.html)
    *   [9.7. Pattern Matching](functions-matching.html)

    <!---->

    *   *   [9.7.1. `LIKE`](functions-matching.html#FUNCTIONS-LIKE)
        *   [9.7.2. `SIMILAR TO` Regular Expressions](functions-matching.html#FUNCTIONS-SIMILARTO-REGEXP)
        *   [9.7.3. POSIX Regular Expressions](functions-matching.html#FUNCTIONS-POSIX-REGEXP)

*   *   [9.8. Data Type Formatting Functions](functions-formatting.html)
    *   [9.9. Date/Time Functions and Operators](functions-datetime.html)

    <!---->

    *   *   [9.9.1. `EXTRACT`, `date_part`](functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT)
        *   [9.9.2. `date_trunc`](functions-datetime.html#FUNCTIONS-DATETIME-TRUNC)
        *   [9.9.3. `date_bin`](functions-datetime.html#FUNCTIONS-DATETIME-BIN)
        *   [9.9.4. `AT TIME ZONE and AT LOCAL`](functions-datetime.html#FUNCTIONS-DATETIME-ZONECONVERT)
        *   [9.9.5. Current Date/Time](functions-datetime.html#FUNCTIONS-DATETIME-CURRENT)
        *   [9.9.6. Delaying Execution](functions-datetime.html#FUNCTIONS-DATETIME-DELAY)

*   *   [9.10. Enum Support Functions](functions-enum.html)
    *   [9.11. Geometric Functions and Operators](functions-geometry.html)
    *   [9.12. Network Address Functions and Operators](functions-net.html)
    *   [9.13. Text Search Functions and Operators](functions-textsearch.html)
    *   [9.14. UUID Functions](functions-uuid.html)
    *   [9.15. XML Functions](functions-xml.html)

    <!---->

    *   *   [9.15.1. Producing XML Content](functions-xml.html#FUNCTIONS-PRODUCING-XML)
        *   [9.15.2. XML Predicates](functions-xml.html#FUNCTIONS-XML-PREDICATES)
        *   [9.15.3. Processing XML](functions-xml.html#FUNCTIONS-XML-PROCESSING)
        *   [9.15.4. Mapping Tables to XML](functions-xml.html#FUNCTIONS-XML-MAPPING)

*   [9.16. JSON Functions and Operators](functions-json.html)

    *   *   [9.16.1. Processing and Creating JSON Data](functions-json.html#FUNCTIONS-JSON-PROCESSING)
        *   [9.16.2. The SQL/JSON Path Language](functions-json.html#FUNCTIONS-SQLJSON-PATH)

*   *   [9.17. Sequence Manipulation Functions](functions-sequence.html)
    *   [9.18. Conditional Expressions](functions-conditional.html)

    <!---->

    *   *   [9.18.1. `CASE`](functions-conditional.html#FUNCTIONS-CASE)
        *   [9.18.2. `COALESCE`](functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL)
        *   [9.18.3. `NULLIF`](functions-conditional.html#FUNCTIONS-NULLIF)
        *   [9.18.4. `GREATEST` and `LEAST`](functions-conditional.html#FUNCTIONS-GREATEST-LEAST)

*   *   [9.19. Array Functions and Operators](functions-array.html)
    *   [9.20. Range/Multirange Functions and Operators](functions-range.html)
    *   [9.21. Aggregate Functions](functions-aggregate.html)
    *   [9.22. Window Functions](functions-window.html)
    *   [9.23. Subquery Expressions](functions-subquery.html)

    <!---->

    *   *   [9.23.1. `EXISTS`](functions-subquery.html#FUNCTIONS-SUBQUERY-EXISTS)
        *   [9.23.2. `IN`](functions-subquery.html#FUNCTIONS-SUBQUERY-IN)
        *   [9.23.3. `NOT IN`](functions-subquery.html#FUNCTIONS-SUBQUERY-NOTIN)
        *   [9.23.4. `ANY`/`SOME`](functions-subquery.html#FUNCTIONS-SUBQUERY-ANY-SOME)
        *   [9.23.5. `ALL`](functions-subquery.html#FUNCTIONS-SUBQUERY-ALL)
        *   [9.23.6. Single-Row Comparison](functions-subquery.html#FUNCTIONS-SUBQUERY-SINGLE-ROW-COMP)

*   [9.24. Row and Array Comparisons](functions-comparisons.html)

    *   *   [9.24.1. `IN`](functions-comparisons.html#FUNCTIONS-COMPARISONS-IN-SCALAR)
        *   [9.24.2. `NOT IN`](functions-comparisons.html#FUNCTIONS-COMPARISONS-NOT-IN)
        *   [9.24.3. `ANY`/`SOME` (array)](functions-comparisons.html#FUNCTIONS-COMPARISONS-ANY-SOME)
        *   [9.24.4. `ALL` (array)](functions-comparisons.html#FUNCTIONS-COMPARISONS-ALL)
        *   [9.24.5. Row Constructor Comparison](functions-comparisons.html#ROW-WISE-COMPARISON)
        *   [9.24.6. Composite Type Comparison](functions-comparisons.html#COMPOSITE-TYPE-COMPARISON)

*   *   [9.25. Set Returning Functions](functions-srf.html)
    *   [9.26. System Information Functions and Operators](functions-info.html)

    <!---->

    *   *   [9.26.1. Session Information Functions](functions-info.html#FUNCTIONS-INFO-SESSION)
        *   [9.26.2. Access Privilege Inquiry Functions](functions-info.html#FUNCTIONS-INFO-ACCESS)
        *   [9.26.3. Schema Visibility Inquiry Functions](functions-info.html#FUNCTIONS-INFO-SCHEMA)
        *   [9.26.4. System Catalog Information Functions](functions-info.html#FUNCTIONS-INFO-CATALOG)
        *   [9.26.5. Object Information and Addressing Functions](functions-info.html#FUNCTIONS-INFO-OBJECT)
        *   [9.26.6. Comment Information Functions](functions-info.html#FUNCTIONS-INFO-COMMENT)
        *   [9.26.7. Data Validity Checking Functions](functions-info.html#FUNCTIONS-INFO-VALIDITY)
        *   [9.26.8. Transaction ID and Snapshot Information Functions](functions-info.html#FUNCTIONS-INFO-SNAPSHOT)
        *   [9.26.9. Committed Transaction Information Functions](functions-info.html#FUNCTIONS-INFO-COMMIT-TIMESTAMP)
        *   [9.26.10. Control Data Functions](functions-info.html#FUNCTIONS-INFO-CONTROLDATA)

*   [9.27. System Administration Functions](functions-admin.html)

    *   *   [9.27.1. Configuration Settings Functions](functions-admin.html#FUNCTIONS-ADMIN-SET)
        *   [9.27.2. Server Signaling Functions](functions-admin.html#FUNCTIONS-ADMIN-SIGNAL)
        *   [9.27.3. Backup Control Functions](functions-admin.html#FUNCTIONS-ADMIN-BACKUP)
        *   [9.27.4. Recovery Control Functions](functions-admin.html#FUNCTIONS-RECOVERY-CONTROL)
        *   [9.27.5. Snapshot Synchronization Functions](functions-admin.html#FUNCTIONS-SNAPSHOT-SYNCHRONIZATION)
        *   [9.27.6. Replication Management Functions](functions-admin.html#FUNCTIONS-REPLICATION)
        *   [9.27.7. Database Object Management Functions](functions-admin.html#FUNCTIONS-ADMIN-DBOBJECT)
        *   [9.27.8. Index Maintenance Functions](functions-admin.html#FUNCTIONS-ADMIN-INDEX)
        *   [9.27.9. Generic File Access Functions](functions-admin.html#FUNCTIONS-ADMIN-GENFILE)
        *   [9.27.10. Advisory Lock Functions](functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)

*   *   [9.28. Trigger Functions](functions-trigger.html)
    *   [9.29. Event Trigger Functions](functions-event-triggers.html)

    <!---->

    *   *   [9.29.1. Capturing Changes at Command End](functions-event-triggers.html#PG-EVENT-TRIGGER-DDL-COMMAND-END-FUNCTIONS)
        *   [9.29.2. Processing Objects Dropped by a DDL Command](functions-event-triggers.html#PG-EVENT-TRIGGER-SQL-DROP-FUNCTIONS)
        *   [9.29.3. Handling a Table Rewrite Event](functions-event-triggers.html#PG-EVENT-TRIGGER-TABLE-REWRITE-FUNCTIONS)

*   [9.30. Statistics Information Functions](functions-statistics.html)

    *   [9.30.1. Inspecting MCV Lists](functions-statistics.html#FUNCTIONS-STATISTICS-MCV)

[]()[]()

PostgreSQL provides a large number of functions and operators for the built-in data types. This chapter describes most of them, although additional special-purpose functions appear in relevant sections of the manual. Users can also define their own functions and operators, as described in [Part V](server-programming.html "Part V. Server Programming"). The psql commands `\df` and `\do` can be used to list all available functions and operators, respectively.

The notation used throughout this chapter to describe the argument and result data types of a function or operator is like this:

    repeat ( text, integer ) → text

which says that the function `repeat` takes one text and one integer argument and returns a result of type text. The right arrow is also used to indicate the result of an example, thus:

    repeat('Pg', 4) → PgPgPgPg

If you are concerned about portability then note that most of the functions and operators described in this chapter, with the exception of the most trivial arithmetic and comparison operators and some explicitly marked functions, are not specified by the SQL standard. Some of this extended functionality is present in other SQL database management systems, and in many cases this functionality is compatible and consistent between the various implementations.

***

|                                                    |                                                       |                                                          |
| :------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------: |
| [Prev](datatype-pseudo.html "8.21. Pseudo-Types")  |       [Up](sql.html "Part II. The SQL Language")      |  [Next](functions-logical.html "9.1. Logical Operators") |
| 8.21. Pseudo-Types                                 | [Home](index.html "PostgreSQL 17devel Documentation") |                                   9.1. Logical Operators |

[#id](#SQL)

# Part II. The SQL Language

[#id](#id-1.5.2)

This part describes the use of the SQL language in PostgreSQL. We start with describing the general syntax of SQL, then explain how to create the structures to hold data, how to populate the database, and how to query it. The middle part lists the available data types and functions for use in SQL commands. The rest treats several aspects that are important for tuning a database for optimal performance.

The information in this part is arranged so that a novice user can follow it start to end to gain a full understanding of the topics without having to refer forward too many times. The chapters are intended to be self-contained, so that advanced users can read the chapters individually as they choose. The information in this part is presented in a narrative fashion in topical units. Readers looking for a complete description of a particular command should see [Part VI](reference).

Readers of this part should know how to connect to a PostgreSQL database and issue SQL commands. Readers that are unfamiliar with these issues are encouraged to read [Part I](tutorial) first. SQL commands are typically entered using the PostgreSQL interactive terminal psql, but other programs that have similar functionality can be used as well.

**Table of Contents**

- [4. SQL Syntax](sql-syntax)

  - [4.1. Lexical Structure](sql-syntax-lexical)
  - [4.2. Value Expressions](sql-expressions)
  - [4.3. Calling Functions](sql-syntax-calling-funcs)

- [5. Data Definition](ddl)

  - [5.1. Table Basics](ddl-basics)
  - [5.2. Default Values](ddl-default)
  - [5.3. Generated Columns](ddl-generated-columns)
  - [5.4. Constraints](ddl-constraints)
  - [5.5. System Columns](ddl-system-columns)
  - [5.6. Modifying Tables](ddl-alter)
  - [5.7. Privileges](ddl-priv)
  - [5.8. Row Security Policies](ddl-rowsecurity)
  - [5.9. Schemas](ddl-schemas)
  - [5.10. Inheritance](ddl-inherit)
  - [5.11. Table Partitioning](ddl-partitioning)
  - [5.12. Foreign Data](ddl-foreign-data)
  - [5.13. Other Database Objects](ddl-others)
  - [5.14. Dependency Tracking](ddl-depend)

- [6. Data Manipulation](dml)

  - [6.1. Inserting Data](dml-insert)
  - [6.2. Updating Data](dml-update)
  - [6.3. Deleting Data](dml-delete)
  - [6.4. Returning Data from Modified Rows](dml-returning)

- [7. Queries](queries)

  - [7.1. Overview](queries-overview)
  - [7.2. Table Expressions](queries-table-expressions)
  - [7.3. Select Lists](queries-select-lists)
  - [7.4. Combining Queries (`UNION`, `INTERSECT`, `EXCEPT`)](queries-union)
  - [7.5. Sorting Rows (`ORDER BY`)](queries-order)
  - [7.6. `LIMIT` and `OFFSET`](queries-limit)
  - [7.7. `VALUES` Lists](queries-values)
  - [7.8. `WITH` Queries (Common Table Expressions)](queries-with)

- [8. Data Types](datatype)

  - [8.1. Numeric Types](datatype-numeric)
  - [8.2. Monetary Types](datatype-money)
  - [8.3. Character Types](datatype-character)
  - [8.4. Binary Data Types](datatype-binary)
  - [8.5. Date/Time Types](datatype-datetime)
  - [8.6. Boolean Type](datatype-boolean)
  - [8.7. Enumerated Types](datatype-enum)
  - [8.8. Geometric Types](datatype-geometric)
  - [8.9. Network Address Types](datatype-net-types)
  - [8.10. Bit String Types](datatype-bit)
  - [8.11. Text Search Types](datatype-textsearch)
  - [8.12. UUID Type](datatype-uuid)
  - [8.13. XML Type](datatype-xml)
  - [8.14. JSON Types](datatype-json)
  - [8.15. Arrays](arrays)
  - [8.16. Composite Types](rowtypes)
  - [8.17. Range Types](rangetypes)
  - [8.18. Domain Types](domains)
  - [8.19. Object Identifier Types](datatype-oid)
  - [8.20. `pg_lsn` Type](datatype-pg-lsn)
  - [8.21. Pseudo-Types](datatype-pseudo)

- [9. Functions and Operators](functions)

  - [9.1. Logical Operators](functions-logical)
  - [9.2. Comparison Functions and Operators](functions-comparison)
  - [9.3. Mathematical Functions and Operators](functions-math)
  - [9.4. String Functions and Operators](functions-string)
  - [9.5. Binary String Functions and Operators](functions-binarystring)
  - [9.6. Bit String Functions and Operators](functions-bitstring)
  - [9.7. Pattern Matching](functions-matching)
  - [9.8. Data Type Formatting Functions](functions-formatting)
  - [9.9. Date/Time Functions and Operators](functions-datetime)
  - [9.10. Enum Support Functions](functions-enum)
  - [9.11. Geometric Functions and Operators](functions-geometry)
  - [9.12. Network Address Functions and Operators](functions-net)
  - [9.13. Text Search Functions and Operators](functions-textsearch)
  - [9.14. UUID Functions](functions-uuid)
  - [9.15. XML Functions](functions-xml)
  - [9.16. JSON Functions and Operators](functions-json)
  - [9.17. Sequence Manipulation Functions](functions-sequence)
  - [9.18. Conditional Expressions](functions-conditional)
  - [9.19. Array Functions and Operators](functions-array)
  - [9.20. Range/Multirange Functions and Operators](functions-range)
  - [9.21. Aggregate Functions](functions-aggregate)
  - [9.22. Window Functions](functions-window)
  - [9.23. Subquery Expressions](functions-subquery)
  - [9.24. Row and Array Comparisons](functions-comparisons)
  - [9.25. Set Returning Functions](functions-srf)
  - [9.26. System Information Functions and Operators](functions-info)
  - [9.27. System Administration Functions](functions-admin)
  - [9.28. Trigger Functions](functions-trigger)
  - [9.29. Event Trigger Functions](functions-event-triggers)
  - [9.30. Statistics Information Functions](functions-statistics)

- [10. Type Conversion](typeconv)

  - [10.1. Overview](typeconv-overview)
  - [10.2. Operators](typeconv-oper)
  - [10.3. Functions](typeconv-func)
  - [10.4. Value Storage](typeconv-query)
  - [10.5. `UNION`, `CASE`, and Related Constructs](typeconv-union-case)
  - [10.6. `SELECT` Output Columns](typeconv-select)

- [11. Indexes](indexes)

  - [11.1. Introduction](indexes-intro)
  - [11.2. Index Types](indexes-types)
  - [11.3. Multicolumn Indexes](indexes-multicolumn)
  - [11.4. Indexes and `ORDER BY`](indexes-ordering)
  - [11.5. Combining Multiple Indexes](indexes-bitmap-scans)
  - [11.6. Unique Indexes](indexes-unique)
  - [11.7. Indexes on Expressions](indexes-expressional)
  - [11.8. Partial Indexes](indexes-partial)
  - [11.9. Index-Only Scans and Covering Indexes](indexes-index-only-scans)
  - [11.10. Operator Classes and Operator Families](indexes-opclass)
  - [11.11. Indexes and Collations](indexes-collations)
  - [11.12. Examining Index Usage](indexes-examine)

- [12. Full Text Search](textsearch)

  - [12.1. Introduction](textsearch-intro)
  - [12.2. Tables and Indexes](textsearch-tables)
  - [12.3. Controlling Text Search](textsearch-controls)
  - [12.4. Additional Features](textsearch-features)
  - [12.5. Parsers](textsearch-parsers)
  - [12.6. Dictionaries](textsearch-dictionaries)
  - [12.7. Configuration Example](textsearch-configuration)
  - [12.8. Testing and Debugging Text Search](textsearch-debugging)
  - [12.9. Preferred Index Types for Text Search](textsearch-indexes)
  - [12.10. psql Support](textsearch-psql)
  - [12.11. Limitations](textsearch-limitations)

- [13. Concurrency Control](mvcc)

  - [13.1. Introduction](mvcc-intro)
  - [13.2. Transaction Isolation](transaction-iso)
  - [13.3. Explicit Locking](explicit-locking)
  - [13.4. Data Consistency Checks at the Application Level](applevel-consistency)
  - [13.5. Serialization Failure Handling](mvcc-serialization-failure-handling)
  - [13.6. Caveats](mvcc-caveats)
  - [13.7. Locking and Indexes](locking-indexes)

- [14. Performance Tips](performance-tips)

  - [14.1. Using `EXPLAIN`](using-explain)
  - [14.2. Statistics Used by the Planner](planner-stats)
  - [14.3. Controlling the Planner with Explicit `JOIN` Clauses](explicit-joins)
  - [14.4. Populating a Database](populate)
  - [14.5. Non-Durable Settings](non-durability)

- [15. Parallel Query](parallel-query)

  - [15.1. How Parallel Query Works](how-parallel-query-works)
  - [15.2. When Can Parallel Query Be Used?](when-can-parallel-query-be-used)
  - [15.3. Parallel Plans](parallel-plans)
  - [15.4. Parallel Safety](parallel-safety)

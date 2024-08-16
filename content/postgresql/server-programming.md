[#id](#SERVER-PROGRAMMING)

# Part V. Server Programming

[#id](#id-1.8.2)

This part is about extending the server functionality with user-defined functions, data types, triggers, etc. These are advanced topics which should probably be approached only after all the other user documentation about PostgreSQL has been understood. Later chapters in this part describe the server-side programming languages available in the PostgreSQL distribution as well as general issues concerning server-side programming languages. It is essential to read at least the earlier sections of [Chapter 38](extend) (covering functions) before diving into the material about server-side programming languages.

**Table of Contents**

- [38. Extending SQL](extend)

  - [38.1. How Extensibility Works](extend-how)
  - [38.2. The PostgreSQL Type System](extend-type-system)
  - [38.3. User-Defined Functions](xfunc)
  - [38.4. User-Defined Procedures](xproc)
  - [38.5. Query Language (SQL) Functions](xfunc-sql)
  - [38.6. Function Overloading](xfunc-overload)
  - [38.7. Function Volatility Categories](xfunc-volatility)
  - [38.8. Procedural Language Functions](xfunc-pl)
  - [38.9. Internal Functions](xfunc-internal)
  - [38.10. C-Language Functions](xfunc-c)
  - [38.11. Function Optimization Information](xfunc-optimization)
  - [38.12. User-Defined Aggregates](xaggr)
  - [38.13. User-Defined Types](xtypes)
  - [38.14. User-Defined Operators](xoper)
  - [38.15. Operator Optimization Information](xoper-optimization)
  - [38.16. Interfacing Extensions to Indexes](xindex)
  - [38.17. Packaging Related Objects into an Extension](extend-extensions)
  - [38.18. Extension Building Infrastructure](extend-pgxs)

- [39. Triggers](triggers)

  - [39.1. Overview of Trigger Behavior](trigger-definition)
  - [39.2. Visibility of Data Changes](trigger-datachanges)
  - [39.3. Writing Trigger Functions in C](trigger-interface)
  - [39.4. A Complete Trigger Example](trigger-example)

- [40. Event Triggers](event-triggers)

  - [40.1. Overview of Event Trigger Behavior](event-trigger-definition)
  - [40.2. Event Trigger Firing Matrix](event-trigger-matrix)
  - [40.3. Writing Event Trigger Functions in C](event-trigger-interface)
  - [40.4. A Complete Event Trigger Example](event-trigger-example)
  - [40.5. A Table Rewrite Event Trigger Example](event-trigger-table-rewrite-example)

- [41. The Rule System](rules)

  - [41.1. The Query Tree](querytree)
  - [41.2. Views and the Rule System](rules-views)
  - [41.3. Materialized Views](rules-materializedviews)
  - [41.4. Rules on `INSERT`, `UPDATE`, and `DELETE`](rules-update)
  - [41.5. Rules and Privileges](rules-privileges)
  - [41.6. Rules and Command Status](rules-status)
  - [41.7. Rules Versus Triggers](rules-triggers)

- [42. Procedural Languages](xplang)

  - [42.1. Installing Procedural Languages](xplang-install)

- [43. PL/pgSQL — SQL Procedural Language](plpgsql)

  - [43.1. Overview](plpgsql-overview)
  - [43.2. Structure of PL/pgSQL](plpgsql-structure)
  - [43.3. Declarations](plpgsql-declarations)
  - [43.4. Expressions](plpgsql-expressions)
  - [43.5. Basic Statements](plpgsql-statements)
  - [43.6. Control Structures](plpgsql-control-structures)
  - [43.7. Cursors](plpgsql-cursors)
  - [43.8. Transaction Management](plpgsql-transactions)
  - [43.9. Errors and Messages](plpgsql-errors-and-messages)
  - [43.10. Trigger Functions](plpgsql-trigger)
  - [43.11. PL/pgSQL under the Hood](plpgsql-implementation)
  - [43.12. Tips for Developing in PL/pgSQL](plpgsql-development-tips)
  - [43.13. Porting from Oracle PL/SQL](plpgsql-porting)

- [44. PL/Tcl — Tcl Procedural Language](pltcl)

  - [44.1. Overview](pltcl-overview)
  - [44.2. PL/Tcl Functions and Arguments](pltcl-functions)
  - [44.3. Data Values in PL/Tcl](pltcl-data)
  - [44.4. Global Data in PL/Tcl](pltcl-global)
  - [44.5. Database Access from PL/Tcl](pltcl-dbaccess)
  - [44.6. Trigger Functions in PL/Tcl](pltcl-trigger)
  - [44.7. Event Trigger Functions in PL/Tcl](pltcl-event-trigger)
  - [44.8. Error Handling in PL/Tcl](pltcl-error-handling)
  - [44.9. Explicit Subtransactions in PL/Tcl](pltcl-subtransactions)
  - [44.10. Transaction Management](pltcl-transactions)
  - [44.11. PL/Tcl Configuration](pltcl-config)
  - [44.12. Tcl Procedure Names](pltcl-procnames)

- [45. PL/Perl — Perl Procedural Language](plperl)

  - [45.1. PL/Perl Functions and Arguments](plperl-funcs)
  - [45.2. Data Values in PL/Perl](plperl-data)
  - [45.3. Built-in Functions](plperl-builtins)
  - [45.4. Global Values in PL/Perl](plperl-global)
  - [45.5. Trusted and Untrusted PL/Perl](plperl-trusted)
  - [45.6. PL/Perl Triggers](plperl-triggers)
  - [45.7. PL/Perl Event Triggers](plperl-event-triggers)
  - [45.8. PL/Perl Under the Hood](plperl-under-the-hood)

- [46. PL/Python — Python Procedural Language](plpython)

  - [46.1. PL/Python Functions](plpython-funcs)
  - [46.2. Data Values](plpython-data)
  - [46.3. Sharing Data](plpython-sharing)
  - [46.4. Anonymous Code Blocks](plpython-do)
  - [46.5. Trigger Functions](plpython-trigger)
  - [46.6. Database Access](plpython-database)
  - [46.7. Explicit Subtransactions](plpython-subtransaction)
  - [46.8. Transaction Management](plpython-transactions)
  - [46.9. Utility Functions](plpython-util)
  - [46.10. Python 2 vs. Python 3](plpython-python23)
  - [46.11. Environment Variables](plpython-envar)

- [47. Server Programming Interface](spi)

  - [47.1. Interface Functions](spi-interface)
  - [47.2. Interface Support Functions](spi-interface-support)
  - [47.3. Memory Management](spi-memory)
  - [47.4. Transaction Management](spi-transaction)
  - [47.5. Visibility of Data Changes](spi-visibility)
  - [47.6. Examples](spi-examples)

  - [48. Background Worker Processes](bgworker)
  - [49. Logical Decoding](logicaldecoding)

    - [49.1. Logical Decoding Examples](logicaldecoding-example)
    - [49.2. Logical Decoding Concepts](logicaldecoding-explanation)
    - [49.3. Streaming Replication Protocol Interface](logicaldecoding-walsender)
    - [49.4. Logical Decoding SQL Interface](logicaldecoding-sql)
    - [49.5. System Catalogs Related to Logical Decoding](logicaldecoding-catalogs)
    - [49.6. Logical Decoding Output Plugins](logicaldecoding-output-plugin)
    - [49.7. Logical Decoding Output Writers](logicaldecoding-writer)
    - [49.8. Synchronous Replication Support for Logical Decoding](logicaldecoding-synchronous)
    - [49.9. Streaming of Large Transactions for Logical Decoding](logicaldecoding-streaming)
    - [49.10. Two-phase Commit Support for Logical Decoding](logicaldecoding-two-phase-commits)

  - [50. Replication Progress Tracking](replication-origins)
  - [51. Archive Modules](archive-modules)

    - [51.1. Initialization Functions](archive-module-init)
    - [51.2. Archive Module Callbacks](archive-module-callbacks)

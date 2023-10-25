<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|           Part V. Server Programming          |                                                     |                                  |                                                       |                                                  |
| :-------------------------------------------: | :-------------------------------------------------- | :------------------------------: | ----------------------------------------------------: | -----------------------------------------------: |
| [Prev](infoschema-views.html "37.66. views")  | [Up](index.html "PostgreSQL 17devel Documentation") | PostgreSQL 17devel Documentation | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](extend.html "Chapter 38. Extending SQL") |

***

# Part V. Server Programming

This part is about extending the server functionality with user-defined functions, data types, triggers, etc. These are advanced topics which should probably be approached only after all the other user documentation about PostgreSQL has been understood. Later chapters in this part describe the server-side programming languages available in the PostgreSQL distribution as well as general issues concerning server-side programming languages. It is essential to read at least the earlier sections of [Chapter 38](extend.html "Chapter 38. Extending SQL") (covering functions) before diving into the material about server-side programming languages.

**Table of Contents**

* [38. Extending SQL](extend.html)

  * *   [38.1. How Extensibility Works](extend-how.html)
    * [38.2. The PostgreSQL Type System](extend-type-system.html)
    * [38.3. User-Defined Functions](xfunc.html)
    * [38.4. User-Defined Procedures](xproc.html)
    * [38.5. Query Language (SQL) Functions](xfunc-sql.html)
    * [38.6. Function Overloading](xfunc-overload.html)
    * [38.7. Function Volatility Categories](xfunc-volatility.html)
    * [38.8. Procedural Language Functions](xfunc-pl.html)
    * [38.9. Internal Functions](xfunc-internal.html)
    * [38.10. C-Language Functions](xfunc-c.html)
    * [38.11. Function Optimization Information](xfunc-optimization.html)
    * [38.12. User-Defined Aggregates](xaggr.html)
    * [38.13. User-Defined Types](xtypes.html)
    * [38.14. User-Defined Operators](xoper.html)
    * [38.15. Operator Optimization Information](xoper-optimization.html)
    * [38.16. Interfacing Extensions to Indexes](xindex.html)
    * [38.17. Packaging Related Objects into an Extension](extend-extensions.html)
    * [38.18. Extension Building Infrastructure](extend-pgxs.html)

* [39. Triggers](triggers.html)

  * *   [39.1. Overview of Trigger Behavior](trigger-definition.html)
    * [39.2. Visibility of Data Changes](trigger-datachanges.html)
    * [39.3. Writing Trigger Functions in C](trigger-interface.html)
    * [39.4. A Complete Trigger Example](trigger-example.html)

* [40. Event Triggers](event-triggers.html)

  * *   [40.1. Overview of Event Trigger Behavior](event-trigger-definition.html)
    * [40.2. Event Trigger Firing Matrix](event-trigger-matrix.html)
    * [40.3. Writing Event Trigger Functions in C](event-trigger-interface.html)
    * [40.4. A Complete Event Trigger Example](event-trigger-example.html)
    * [40.5. A Table Rewrite Event Trigger Example](event-trigger-table-rewrite-example.html)
    * [40.6. A Database Login Event Trigger Example](event-trigger-database-login-example.html)

* [41. The Rule System](rules.html)

  * *   [41.1. The Query Tree](querytree.html)
    * [41.2. Views and the Rule System](rules-views.html)
    * [41.3. Materialized Views](rules-materializedviews.html)
    * [41.4. Rules on `INSERT`, `UPDATE`, and `DELETE`](rules-update.html)
    * [41.5. Rules and Privileges](rules-privileges.html)
    * [41.6. Rules and Command Status](rules-status.html)
    * [41.7. Rules Versus Triggers](rules-triggers.html)

* [42. Procedural Languages](xplang.html)

  * [42.1. Installing Procedural Languages](xplang-install.html)

* [43. PL/pgSQL — SQL Procedural Language](plpgsql.html)

  * *   [43.1. Overview](plpgsql-overview.html)
    * [43.2. Structure of PL/pgSQL](plpgsql-structure.html)
    * [43.3. Declarations](plpgsql-declarations.html)
    * [43.4. Expressions](plpgsql-expressions.html)
    * [43.5. Basic Statements](plpgsql-statements.html)
    * [43.6. Control Structures](plpgsql-control-structures.html)
    * [43.7. Cursors](plpgsql-cursors.html)
    * [43.8. Transaction Management](plpgsql-transactions.html)
    * [43.9. Errors and Messages](plpgsql-errors-and-messages.html)
    * [43.10. Trigger Functions](plpgsql-trigger.html)
    * [43.11. PL/pgSQL under the Hood](plpgsql-implementation.html)
    * [43.12. Tips for Developing in PL/pgSQL](plpgsql-development-tips.html)
    * [43.13. Porting from Oracle PL/SQL](plpgsql-porting.html)

* [44. PL/Tcl — Tcl Procedural Language](pltcl.html)

  * *   [44.1. Overview](pltcl-overview.html)
    * [44.2. PL/Tcl Functions and Arguments](pltcl-functions.html)
    * [44.3. Data Values in PL/Tcl](pltcl-data.html)
    * [44.4. Global Data in PL/Tcl](pltcl-global.html)
    * [44.5. Database Access from PL/Tcl](pltcl-dbaccess.html)
    * [44.6. Trigger Functions in PL/Tcl](pltcl-trigger.html)
    * [44.7. Event Trigger Functions in PL/Tcl](pltcl-event-trigger.html)
    * [44.8. Error Handling in PL/Tcl](pltcl-error-handling.html)
    * [44.9. Explicit Subtransactions in PL/Tcl](pltcl-subtransactions.html)
    * [44.10. Transaction Management](pltcl-transactions.html)
    * [44.11. PL/Tcl Configuration](pltcl-config.html)
    * [44.12. Tcl Procedure Names](pltcl-procnames.html)

* [45. PL/Perl — Perl Procedural Language](plperl.html)

  * *   [45.1. PL/Perl Functions and Arguments](plperl-funcs.html)
    * [45.2. Data Values in PL/Perl](plperl-data.html)
    * [45.3. Built-in Functions](plperl-builtins.html)
    * [45.4. Global Values in PL/Perl](plperl-global.html)
    * [45.5. Trusted and Untrusted PL/Perl](plperl-trusted.html)
    * [45.6. PL/Perl Triggers](plperl-triggers.html)
    * [45.7. PL/Perl Event Triggers](plperl-event-triggers.html)
    * [45.8. PL/Perl Under the Hood](plperl-under-the-hood.html)

* [46. PL/Python — Python Procedural Language](plpython.html)

  * *   [46.1. PL/Python Functions](plpython-funcs.html)
    * [46.2. Data Values](plpython-data.html)
    * [46.3. Sharing Data](plpython-sharing.html)
    * [46.4. Anonymous Code Blocks](plpython-do.html)
    * [46.5. Trigger Functions](plpython-trigger.html)
    * [46.6. Database Access](plpython-database.html)
    * [46.7. Explicit Subtransactions](plpython-subtransaction.html)
    * [46.8. Transaction Management](plpython-transactions.html)
    * [46.9. Utility Functions](plpython-util.html)
    * [46.10. Python 2 vs. Python 3](plpython-python23.html)
    * [46.11. Environment Variables](plpython-envar.html)

* [47. Server Programming Interface](spi.html)

  * *   [47.1. Interface Functions](spi-interface.html)
    * [47.2. Interface Support Functions](spi-interface-support.html)
    * [47.3. Memory Management](spi-memory.html)
    * [47.4. Transaction Management](spi-transaction.html)
    * [47.5. Visibility of Data Changes](spi-visibility.html)
    * [47.6. Examples](spi-examples.html)

  * *   [48. Background Worker Processes](bgworker.html)
  * [49. Logical Decoding](logicaldecoding.html)

    <!---->

  * *   [49.1. Logical Decoding Examples](logicaldecoding-example.html)
    * [49.2. Logical Decoding Concepts](logicaldecoding-explanation.html)
    * [49.3. Streaming Replication Protocol Interface](logicaldecoding-walsender.html)
    * [49.4. Logical Decoding SQL Interface](logicaldecoding-sql.html)
    * [49.5. System Catalogs Related to Logical Decoding](logicaldecoding-catalogs.html)
    * [49.6. Logical Decoding Output Plugins](logicaldecoding-output-plugin.html)
    * [49.7. Logical Decoding Output Writers](logicaldecoding-writer.html)
    * [49.8. Synchronous Replication Support for Logical Decoding](logicaldecoding-synchronous.html)
    * [49.9. Streaming of Large Transactions for Logical Decoding](logicaldecoding-streaming.html)
    * [49.10. Two-phase Commit Support for Logical Decoding](logicaldecoding-two-phase-commits.html)

  * *   [50. Replication Progress Tracking](replication-origins.html)
  * [51. Archive Modules](archive-modules.html)

    <!---->

  * *   [51.1. Initialization Functions](archive-module-init.html)
    * [51.2. Archive Module Callbacks](archive-module-callbacks.html)

***

|                                               |                                                       |                                                  |
| :-------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------: |
| [Prev](infoschema-views.html "37.66. views")  |  [Up](index.html "PostgreSQL 17devel Documentation")  |  [Next](extend.html "Chapter 38. Extending SQL") |
| 37.66. `views`                                | [Home](index.html "PostgreSQL 17devel Documentation") |                        Chapter 38. Extending SQL |

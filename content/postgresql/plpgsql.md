## Chapter 43. PL/pgSQL — SQL Procedural Language

**Table of Contents**

* [43.1. Overview](plpgsql-overview.html)

  * *   [43.1.1. Advantages of Using PL/pgSQL](plpgsql-overview.html#PLPGSQL-ADVANTAGES)
    * [43.1.2. Supported Argument and Result Data Types](plpgsql-overview.html#PLPGSQL-ARGS-RESULTS)

  * *   [43.2. Structure of PL/pgSQL](plpgsql-structure.html)
  * [43.3. Declarations](plpgsql-declarations.html)

    

  * *   [43.3.1. Declaring Function Parameters](plpgsql-declarations.html#PLPGSQL-DECLARATION-PARAMETERS)
    * [43.3.2. `ALIAS`](plpgsql-declarations.html#PLPGSQL-DECLARATION-ALIAS)
    * [43.3.3. Copying Types](plpgsql-declarations.html#PLPGSQL-DECLARATION-TYPE)
    * [43.3.4. Row Types](plpgsql-declarations.html#PLPGSQL-DECLARATION-ROWTYPES)
    * [43.3.5. Record Types](plpgsql-declarations.html#PLPGSQL-DECLARATION-RECORDS)
    * [43.3.6. Collation of PL/pgSQL Variables](plpgsql-declarations.html#PLPGSQL-DECLARATION-COLLATION)

  * *   [43.4. Expressions](plpgsql-expressions.html)
  * [43.5. Basic Statements](plpgsql-statements.html)

    

  * *   [43.5.1. Assignment](plpgsql-statements.html#PLPGSQL-STATEMENTS-ASSIGNMENT)
    * [43.5.2. Executing SQL Commands](plpgsql-statements.html#PLPGSQL-STATEMENTS-GENERAL-SQL)
    * [43.5.3. Executing a Command with a Single-Row Result](plpgsql-statements.html#PLPGSQL-STATEMENTS-SQL-ONEROW)
    * [43.5.4. Executing Dynamic Commands](plpgsql-statements.html#PLPGSQL-STATEMENTS-EXECUTING-DYN)
    * [43.5.5. Obtaining the Result Status](plpgsql-statements.html#PLPGSQL-STATEMENTS-DIAGNOSTICS)
    * [43.5.6. Doing Nothing At All](plpgsql-statements.html#PLPGSQL-STATEMENTS-NULL)

* [43.6. Control Structures](plpgsql-control-structures.html)

  * *   [43.6.1. Returning from a Function](plpgsql-control-structures.html#PLPGSQL-STATEMENTS-RETURNING)
    * [43.6.2. Returning from a Procedure](plpgsql-control-structures.html#PLPGSQL-STATEMENTS-RETURNING-PROCEDURE)
    * [43.6.3. Calling a Procedure](plpgsql-control-structures.html#PLPGSQL-STATEMENTS-CALLING-PROCEDURE)
    * [43.6.4. Conditionals](plpgsql-control-structures.html#PLPGSQL-CONDITIONALS)
    * [43.6.5. Simple Loops](plpgsql-control-structures.html#PLPGSQL-CONTROL-STRUCTURES-LOOPS)
    * [43.6.6. Looping through Query Results](plpgsql-control-structures.html#PLPGSQL-RECORDS-ITERATING)
    * [43.6.7. Looping through Arrays](plpgsql-control-structures.html#PLPGSQL-FOREACH-ARRAY)
    * [43.6.8. Trapping Errors](plpgsql-control-structures.html#PLPGSQL-ERROR-TRAPPING)
    * [43.6.9. Obtaining Execution Location Information](plpgsql-control-structures.html#PLPGSQL-CALL-STACK)

* [43.7. Cursors](plpgsql-cursors.html)

  * *   [43.7.1. Declaring Cursor Variables](plpgsql-cursors.html#PLPGSQL-CURSOR-DECLARATIONS)
    * [43.7.2. Opening Cursors](plpgsql-cursors.html#PLPGSQL-CURSOR-OPENING)
    * [43.7.3. Using Cursors](plpgsql-cursors.html#PLPGSQL-CURSOR-USING)
    * [43.7.4. Looping through a Cursor's Result](plpgsql-cursors.html#PLPGSQL-CURSOR-FOR-LOOP)

  * *   [43.8. Transaction Management](plpgsql-transactions.html)
  * [43.9. Errors and Messages](plpgsql-errors-and-messages.html)

    

  * *   [43.9.1. Reporting Errors and Messages](plpgsql-errors-and-messages.html#PLPGSQL-STATEMENTS-RAISE)
    * [43.9.2. Checking Assertions](plpgsql-errors-and-messages.html#PLPGSQL-STATEMENTS-ASSERT)

* [43.10. Trigger Functions](plpgsql-trigger.html)

  * *   [43.10.1. Triggers on Data Changes](plpgsql-trigger.html#PLPGSQL-DML-TRIGGER)
    * [43.10.2. Triggers on Events](plpgsql-trigger.html#PLPGSQL-EVENT-TRIGGER)

* [43.11. PL/pgSQL under the Hood](plpgsql-implementation.html)

  * *   [43.11.1. Variable Substitution](plpgsql-implementation.html#PLPGSQL-VAR-SUBST)
    * [43.11.2. Plan Caching](plpgsql-implementation.html#PLPGSQL-PLAN-CACHING)

* [43.12. Tips for Developing in PL/pgSQL](plpgsql-development-tips.html)

  * *   [43.12.1. Handling of Quotation Marks](plpgsql-development-tips.html#PLPGSQL-QUOTE-TIPS)
    * [43.12.2. Additional Compile-Time and Run-Time Checks](plpgsql-development-tips.html#PLPGSQL-EXTRA-CHECKS)

* [43.13. Porting from Oracle PL/SQL](plpgsql-porting.html)

  * *   [43.13.1. Porting Examples](plpgsql-porting.html#PLPGSQL-PORTING-EXAMPLES)
    * [43.13.2. Other Things to Watch For](plpgsql-porting.html#PLPGSQL-PORTING-OTHER)
    * [43.13.3. Appendix](plpgsql-porting.html#PLPGSQL-PORTING-APPENDIX)
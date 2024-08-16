[#id](#PLPGSQL)

## Chapter 43. PL/pgSQL — SQL Procedural Language

**Table of Contents**

- [43.1. Overview](plpgsql-overview)

  - [43.1.1. Advantages of Using PL/pgSQL](plpgsql-overview#PLPGSQL-ADVANTAGES)
  - [43.1.2. Supported Argument and Result Data Types](plpgsql-overview#PLPGSQL-ARGS-RESULTS)

  - [43.2. Structure of PL/pgSQL](plpgsql-structure)
  - [43.3. Declarations](plpgsql-declarations)

    - [43.3.1. Declaring Function Parameters](plpgsql-declarations#PLPGSQL-DECLARATION-PARAMETERS)
    - [43.3.2. `ALIAS`](plpgsql-declarations#PLPGSQL-DECLARATION-ALIAS)
    - [43.3.3. Copying Types](plpgsql-declarations#PLPGSQL-DECLARATION-TYPE)
    - [43.3.4. Row Types](plpgsql-declarations#PLPGSQL-DECLARATION-ROWTYPES)
    - [43.3.5. Record Types](plpgsql-declarations#PLPGSQL-DECLARATION-RECORDS)
    - [43.3.6. Collation of PL/pgSQL Variables](plpgsql-declarations#PLPGSQL-DECLARATION-COLLATION)

  - [43.4. Expressions](plpgsql-expressions)
  - [43.5. Basic Statements](plpgsql-statements)

    - [43.5.1. Assignment](plpgsql-statements#PLPGSQL-STATEMENTS-ASSIGNMENT)
    - [43.5.2. Executing SQL Commands](plpgsql-statements#PLPGSQL-STATEMENTS-GENERAL-SQL)
    - [43.5.3. Executing a Command with a Single-Row Result](plpgsql-statements#PLPGSQL-STATEMENTS-SQL-ONEROW)
    - [43.5.4. Executing Dynamic Commands](plpgsql-statements#PLPGSQL-STATEMENTS-EXECUTING-DYN)
    - [43.5.5. Obtaining the Result Status](plpgsql-statements#PLPGSQL-STATEMENTS-DIAGNOSTICS)
    - [43.5.6. Doing Nothing At All](plpgsql-statements#PLPGSQL-STATEMENTS-NULL)

- [43.6. Control Structures](plpgsql-control-structures)

  - [43.6.1. Returning from a Function](plpgsql-control-structures#PLPGSQL-STATEMENTS-RETURNING)
  - [43.6.2. Returning from a Procedure](plpgsql-control-structures#PLPGSQL-STATEMENTS-RETURNING-PROCEDURE)
  - [43.6.3. Calling a Procedure](plpgsql-control-structures#PLPGSQL-STATEMENTS-CALLING-PROCEDURE)
  - [43.6.4. Conditionals](plpgsql-control-structures#PLPGSQL-CONDITIONALS)
  - [43.6.5. Simple Loops](plpgsql-control-structures#PLPGSQL-CONTROL-STRUCTURES-LOOPS)
  - [43.6.6. Looping through Query Results](plpgsql-control-structures#PLPGSQL-RECORDS-ITERATING)
  - [43.6.7. Looping through Arrays](plpgsql-control-structures#PLPGSQL-FOREACH-ARRAY)
  - [43.6.8. Trapping Errors](plpgsql-control-structures#PLPGSQL-ERROR-TRAPPING)
  - [43.6.9. Obtaining Execution Location Information](plpgsql-control-structures#PLPGSQL-CALL-STACK)

- [43.7. Cursors](plpgsql-cursors)

  - [43.7.1. Declaring Cursor Variables](plpgsql-cursors#PLPGSQL-CURSOR-DECLARATIONS)
  - [43.7.2. Opening Cursors](plpgsql-cursors#PLPGSQL-CURSOR-OPENING)
  - [43.7.3. Using Cursors](plpgsql-cursors#PLPGSQL-CURSOR-USING)
  - [43.7.4. Looping through a Cursor's Result](plpgsql-cursors#PLPGSQL-CURSOR-FOR-LOOP)

  - [43.8. Transaction Management](plpgsql-transactions)
  - [43.9. Errors and Messages](plpgsql-errors-and-messages)

    - [43.9.1. Reporting Errors and Messages](plpgsql-errors-and-messages#PLPGSQL-STATEMENTS-RAISE)
    - [43.9.2. Checking Assertions](plpgsql-errors-and-messages#PLPGSQL-STATEMENTS-ASSERT)

- [43.10. Trigger Functions](plpgsql-trigger)

  - [43.10.1. Triggers on Data Changes](plpgsql-trigger#PLPGSQL-DML-TRIGGER)
  - [43.10.2. Triggers on Events](plpgsql-trigger#PLPGSQL-EVENT-TRIGGER)

- [43.11. PL/pgSQL under the Hood](plpgsql-implementation)

  - [43.11.1. Variable Substitution](plpgsql-implementation#PLPGSQL-VAR-SUBST)
  - [43.11.2. Plan Caching](plpgsql-implementation#PLPGSQL-PLAN-CACHING)

- [43.12. Tips for Developing in PL/pgSQL](plpgsql-development-tips)

  - [43.12.1. Handling of Quotation Marks](plpgsql-development-tips#PLPGSQL-QUOTE-TIPS)
  - [43.12.2. Additional Compile-Time and Run-Time Checks](plpgsql-development-tips#PLPGSQL-EXTRA-CHECKS)

- [43.13. Porting from Oracle PL/SQL](plpgsql-porting)

  - [43.13.1. Porting Examples](plpgsql-porting#PLPGSQL-PORTING-EXAMPLES)
  - [43.13.2. Other Things to Watch For](plpgsql-porting#PLPGSQL-PORTING-OTHER)
  - [43.13.3. Appendix](plpgsql-porting#PLPGSQL-PORTING-APPENDIX)

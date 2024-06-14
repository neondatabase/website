[#id](#ECPG)

## Chapter 36. ECPG — Embedded SQL in C

**Table of Contents**

- [36.1. The Concept](ecpg-concept)
- [36.2. Managing Database Connections](ecpg-connect)

  - [36.2.1. Connecting to the Database Server](ecpg-connect#ECPG-CONNECTING)
  - [36.2.2. Choosing a Connection](ecpg-connect#ECPG-SET-CONNECTION)
  - [36.2.3. Closing a Connection](ecpg-connect#ECPG-DISCONNECT)

- [36.3. Running SQL Commands](ecpg-commands)

  - [36.3.1. Executing SQL Statements](ecpg-commands#ECPG-EXECUTING)
  - [36.3.2. Using Cursors](ecpg-commands#ECPG-CURSORS)
  - [36.3.3. Managing Transactions](ecpg-commands#ECPG-TRANSACTIONS)
  - [36.3.4. Prepared Statements](ecpg-commands#ECPG-PREPARED)

- [36.4. Using Host Variables](ecpg-variables)

  - [36.4.1. Overview](ecpg-variables#ECPG-VARIABLES-OVERVIEW)
  - [36.4.2. Declare Sections](ecpg-variables#ECPG-DECLARE-SECTIONS)
  - [36.4.3. Retrieving Query Results](ecpg-variables#ECPG-RETRIEVING)
  - [36.4.4. Type Mapping](ecpg-variables#ECPG-VARIABLES-TYPE-MAPPING)
  - [36.4.5. Handling Nonprimitive SQL Data Types](ecpg-variables#ECPG-VARIABLES-NONPRIMITIVE-SQL)
  - [36.4.6. Indicators](ecpg-variables#ECPG-INDICATORS)

- [36.5. Dynamic SQL](ecpg-dynamic)

  - [36.5.1. Executing Statements without a Result Set](ecpg-dynamic#ECPG-DYNAMIC-WITHOUT-RESULT)
  - [36.5.2. Executing a Statement with Input Parameters](ecpg-dynamic#ECPG-DYNAMIC-INPUT)
  - [36.5.3. Executing a Statement with a Result Set](ecpg-dynamic#ECPG-DYNAMIC-WITH-RESULT)

- [36.6. pgtypes Library](ecpg-pgtypes)

  - [36.6.1. Character Strings](ecpg-pgtypes#ECPG-PGTYPES-CSTRINGS)
  - [36.6.2. The numeric Type](ecpg-pgtypes#ECPG-PGTYPES-NUMERIC)
  - [36.6.3. The date Type](ecpg-pgtypes#ECPG-PGTYPES-DATE)
  - [36.6.4. The timestamp Type](ecpg-pgtypes#ECPG-PGTYPES-TIMESTAMP)
  - [36.6.5. The interval Type](ecpg-pgtypes#ECPG-PGTYPES-INTERVAL)
  - [36.6.6. The decimal Type](ecpg-pgtypes#ECPG-PGTYPES-DECIMAL)
  - [36.6.7. errno Values of pgtypeslib](ecpg-pgtypes#ECPG-PGTYPES-ERRNO)
  - [36.6.8. Special Constants of pgtypeslib](ecpg-pgtypes#ECPG-PGTYPES-CONSTANTS)

- [36.7. Using Descriptor Areas](ecpg-descriptors)

  - [36.7.1. Named SQL Descriptor Areas](ecpg-descriptors#ECPG-NAMED-DESCRIPTORS)
  - [36.7.2. SQLDA Descriptor Areas](ecpg-descriptors#ECPG-SQLDA-DESCRIPTORS)

- [36.8. Error Handling](ecpg-errors)

  - [36.8.1. Setting Callbacks](ecpg-errors#ECPG-WHENEVER)
  - [36.8.2. sqlca](ecpg-errors#ECPG-SQLCA)
  - [36.8.3. `SQLSTATE` vs. `SQLCODE`](ecpg-errors#ECPG-SQLSTATE-SQLCODE)

- [36.9. Preprocessor Directives](ecpg-preproc)

  - [36.9.1. Including Files](ecpg-preproc#ECPG-INCLUDE)
  - [36.9.2. The define and undef Directives](ecpg-preproc#ECPG-DEFINE)
  - [36.9.3. ifdef, ifndef, elif, else, and endif Directives](ecpg-preproc#ECPG-IFDEF)

  - [36.10. Processing Embedded SQL Programs](ecpg-process)
  - [36.11. Library Functions](ecpg-library)
  - [36.12. Large Objects](ecpg-lo)
  - [36.13. C++ Applications](ecpg-cpp)

    - [36.13.1. Scope for Host Variables](ecpg-cpp#ECPG-CPP-SCOPE)
    - [36.13.2. C++ Application Development with External C Module](ecpg-cpp#ECPG-CPP-AND-C)

- [36.14. Embedded SQL Commands](ecpg-sql-commands)

  - [ALLOCATE DESCRIPTOR](ecpg-sql-allocate-descriptor) — allocate an SQL descriptor area
  - [CONNECT](ecpg-sql-connect) — establish a database connection
  - [DEALLOCATE DESCRIPTOR](ecpg-sql-deallocate-descriptor) — deallocate an SQL descriptor area
  - [DECLARE](ecpg-sql-declare) — define a cursor
  - [DECLARE STATEMENT](ecpg-sql-declare-statement) — declare SQL statement identifier
  - [DESCRIBE](ecpg-sql-describe) — obtain information about a prepared statement or result set
  - [DISCONNECT](ecpg-sql-disconnect) — terminate a database connection
  - [EXECUTE IMMEDIATE](ecpg-sql-execute-immediate) — dynamically prepare and execute a statement
  - [GET DESCRIPTOR](ecpg-sql-get-descriptor) — get information from an SQL descriptor area
  - [OPEN](ecpg-sql-open) — open a dynamic cursor
  - [PREPARE](ecpg-sql-prepare) — prepare a statement for execution
  - [SET AUTOCOMMIT](ecpg-sql-set-autocommit) — set the autocommit behavior of the current session
  - [SET CONNECTION](ecpg-sql-set-connection) — select a database connection
  - [SET DESCRIPTOR](ecpg-sql-set-descriptor) — set information in an SQL descriptor area
  - [TYPE](ecpg-sql-type) — define a new data type
  - [VAR](ecpg-sql-var) — define a variable
  - [WHENEVER](ecpg-sql-whenever) — specify the action to be taken when an SQL statement causes a specific class condition to be raised

- [36.15. Informix Compatibility Mode](ecpg-informix-compat)

  - [36.15.1. Additional Types](ecpg-informix-compat#ECPG-INFORMIX-TYPES)
  - [36.15.2. Additional/Missing Embedded SQL Statements](ecpg-informix-compat#ECPG-INFORMIX-STATEMENTS)
  - [36.15.3. Informix-compatible SQLDA Descriptor Areas](ecpg-informix-compat#ECPG-INFORMIX-SQLDA)
  - [36.15.4. Additional Functions](ecpg-informix-compat#ECPG-INFORMIX-FUNCTIONS)
  - [36.15.5. Additional Constants](ecpg-informix-compat#ECPG-INFORMIX-CONSTANTS)

  - [36.16. Oracle Compatibility Mode](ecpg-oracle-compat)
  - [36.17. Internals](ecpg-develop)

This chapter describes the embedded SQL package for PostgreSQL. It was written by Linus Tolke (`<linus@epact.se>`) and Michael Meskes (`<meskes@postgresql.org>`). Originally it was written to work with C. It also works with C++, but it does not recognize all C++ constructs yet.

This documentation is quite incomplete. But since this interface is standardized, additional information can be found in many resources about SQL.

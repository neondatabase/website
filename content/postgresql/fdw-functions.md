

|                  59.1. Foreign Data Wrapper Functions                 |                                                                    |                                            |                                                       |                                                                            |
| :-------------------------------------------------------------------: | :----------------------------------------------------------------- | :----------------------------------------: | ----------------------------------------------------: | -------------------------------------------------------------------------: |
| [Prev](fdwhandler.html "Chapter 59. Writing a Foreign Data Wrapper")  | [Up](fdwhandler.html "Chapter 59. Writing a Foreign Data Wrapper") | Chapter 59. Writing a Foreign Data Wrapper | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](fdw-callbacks.html "59.2. Foreign Data Wrapper Callback Routines") |

***

## 59.1. Foreign Data Wrapper Functions [#](#FDW-FUNCTIONS)

The FDW author needs to implement a handler function, and optionally a validator function. Both functions must be written in a compiled language such as C, using the version-1 interface. For details on C language calling conventions and dynamic loading, see [Section 38.10](xfunc-c.html "38.10. C-Language Functions").

The handler function simply returns a struct of function pointers to callback functions that will be called by the planner, executor, and various maintenance commands. Most of the effort in writing an FDW is in implementing these callback functions. The handler function must be registered with PostgreSQL as taking no arguments and returning the special pseudo-type `fdw_handler`. The callback functions are plain C functions and are not visible or callable at the SQL level. The callback functions are described in [Section 59.2](fdw-callbacks.html "59.2. Foreign Data Wrapper Callback Routines").

The validator function is responsible for validating options given in `CREATE` and `ALTER` commands for its foreign data wrapper, as well as foreign servers, user mappings, and foreign tables using the wrapper. The validator function must be registered as taking two arguments, a text array containing the options to be validated, and an OID representing the type of object the options are associated with (in the form of the OID of the system catalog the object would be stored in, either `ForeignDataWrapperRelationId`, `ForeignServerRelationId`, `UserMappingRelationId`, or `ForeignTableRelationId`). If no validator function is supplied, options are not checked at object creation time or object alteration time.

***

|                                                                       |                                                                    |                                                                            |
| :-------------------------------------------------------------------- | :----------------------------------------------------------------: | -------------------------------------------------------------------------: |
| [Prev](fdwhandler.html "Chapter 59. Writing a Foreign Data Wrapper")  | [Up](fdwhandler.html "Chapter 59. Writing a Foreign Data Wrapper") |  [Next](fdw-callbacks.html "59.2. Foreign Data Wrapper Callback Routines") |
| Chapter 59. Writing a Foreign Data Wrapper                            |        [Home](index.html "PostgreSQL 17devel Documentation")       |                               59.2. Foreign Data Wrapper Callback Routines |

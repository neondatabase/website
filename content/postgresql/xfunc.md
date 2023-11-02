## 38.3. User-Defined Functions [#](#XFUNC)

PostgreSQL provides four kinds of functions:

* query language functions (functions written in SQL) ([Section 38.5](xfunc-sql "38.5. Query Language (SQL) Functions"))
* procedural language functions (functions written in, for example, PL/pgSQL or PL/Tcl) ([Section 38.8](xfunc-pl "38.8. Procedural Language Functions"))
* internal functions ([Section 38.9](xfunc-internal "38.9. Internal Functions"))
* C-language functions ([Section 38.10](xfunc-c "38.10. C-Language Functions"))

Every kind of function can take base types, composite types, or combinations of these as arguments (parameters). In addition, every kind of function can return a base type or a composite type. Functions can also be defined to return sets of base or composite values.

Many kinds of functions can take or return certain pseudo-types (such as polymorphic types), but the available facilities vary. Consult the description of each kind of function for more details.

It's easiest to define SQL functions, so we'll start by discussing those. Most of the concepts presented for SQL functions will carry over to the other types of functions.

Throughout this chapter, it can be useful to look at the reference page of the [`CREATE FUNCTION`](sql-createfunction "CREATE FUNCTION") command to understand the examples better. Some examples from this chapter can be found in `funcs.sql` and `funcs.c` in the `src/tutorial` directory in the PostgreSQL source distribution.
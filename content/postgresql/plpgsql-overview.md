[#id](#PLPGSQL-OVERVIEW)

## 43.1. Overview [#](#PLPGSQL-OVERVIEW)

- [43.1.1. Advantages of Using PL/pgSQL](plpgsql-overview#PLPGSQL-ADVANTAGES)
- [43.1.2. Supported Argument and Result Data Types](plpgsql-overview#PLPGSQL-ARGS-RESULTS)

PL/pgSQL is a loadable procedural language for the PostgreSQL database system. The design goals of PL/pgSQL were to create a loadable procedural language that

- can be used to create functions, procedures, and triggers,

- adds control structures to the SQL language,

- can perform complex computations,

- inherits all user-defined types, functions, procedures, and operators,

- can be defined to be trusted by the server,

- is easy to use.

Functions created with PL/pgSQL can be used anywhere that built-in functions could be used. For example, it is possible to create complex conditional computation functions and later use them to define operators or use them in index expressions.

In PostgreSQL 9.0 and later, PL/pgSQL is installed by default. However it is still a loadable module, so especially security-conscious administrators could choose to remove it.

[#id](#PLPGSQL-ADVANTAGES)

### 43.1.1. Advantages of Using PL/pgSQL [#](#PLPGSQL-ADVANTAGES)

SQL is the language PostgreSQL and most other relational databases use as query language. It's portable and easy to learn. But every SQL statement must be executed individually by the database server.

That means that your client application must send each query to the database server, wait for it to be processed, receive and process the results, do some computation, then send further queries to the server. All this incurs interprocess communication and will also incur network overhead if your client is on a different machine than the database server.

With PL/pgSQL you can group a block of computation and a series of queries _inside_ the database server, thus having the power of a procedural language and the ease of use of SQL, but with considerable savings of client/server communication overhead.

- Extra round trips between client and server are eliminated

- Intermediate results that the client does not need do not have to be marshaled or transferred between server and client

- Multiple rounds of query parsing can be avoided

This can result in a considerable performance increase as compared to an application that does not use stored functions.

Also, with PL/pgSQL you can use all the data types, operators and functions of SQL.

[#id](#PLPGSQL-ARGS-RESULTS)

### 43.1.2. Supported Argument and Result Data Types [#](#PLPGSQL-ARGS-RESULTS)

Functions written in PL/pgSQL can accept as arguments any scalar or array data type supported by the server, and they can return a result of any of these types. They can also accept or return any composite type (row type) specified by name. It is also possible to declare a PL/pgSQL function as accepting `record`, which means that any composite type will do as input, or as returning `record`, which means that the result is a row type whose columns are determined by specification in the calling query, as discussed in [Section 7.2.1.4](queries-table-expressions#QUERIES-TABLEFUNCTIONS).

PL/pgSQL functions can be declared to accept a variable number of arguments by using the `VARIADIC` marker. This works exactly the same way as for SQL functions, as discussed in [Section 38.5.6](xfunc-sql#XFUNC-SQL-VARIADIC-FUNCTIONS).

PL/pgSQL functions can also be declared to accept and return the polymorphic types described in [Section 38.2.5](extend-type-system#EXTEND-TYPES-POLYMORPHIC), thus allowing the actual data types handled by the function to vary from call to call. Examples appear in [Section 43.3.1](plpgsql-declarations#PLPGSQL-DECLARATION-PARAMETERS).

PL/pgSQL functions can also be declared to return a “set” (or table) of any data type that can be returned as a single instance. Such a function generates its output by executing `RETURN NEXT` for each desired element of the result set, or by using `RETURN QUERY` to output the result of evaluating a query.

Finally, a PL/pgSQL function can be declared to return `void` if it has no useful return value. (Alternatively, it could be written as a procedure in that case.)

PL/pgSQL functions can also be declared with output parameters in place of an explicit specification of the return type. This does not add any fundamental capability to the language, but it is often convenient, especially for returning multiple values. The `RETURNS TABLE` notation can also be used in place of `RETURNS SETOF`.

Specific examples appear in [Section 43.3.1](plpgsql-declarations#PLPGSQL-DECLARATION-PARAMETERS) and [Section 43.6.1](plpgsql-control-structures#PLPGSQL-STATEMENTS-RETURNING).

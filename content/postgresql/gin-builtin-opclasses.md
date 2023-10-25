

|        70.2. Built-in Operator Classes       |                                          |                         |                                                       |                                                       |
| :------------------------------------------: | :--------------------------------------- | :---------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](gin-intro.html "70.1. Introduction")  | [Up](gin.html "Chapter 70. GIN Indexes") | Chapter 70. GIN Indexes | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](gin-extensibility.html "70.3. Extensibility") |

***

## 70.2. Built-in Operator Classes [#](#GIN-BUILTIN-OPCLASSES)

The core PostgreSQL distribution includes the GIN operator classes shown in [Table 70.1](gin-builtin-opclasses.html#GIN-BUILTIN-OPCLASSES-TABLE "Table 70.1. Built-in GIN Operator Classes"). (Some of the optional modules described in [Appendix F](contrib.html "Appendix F. Additional Supplied Modules and Extensions") provide additional GIN operator classes.)

**Table 70.1. Built-in GIN Operator Classes**

| Name             | Indexable Operators      |
| ---------------- | ------------------------ |
| `array_ops`      | `&& (anyarray,anyarray)` |
|                  | `@> (anyarray,anyarray)` |
|                  | `<@ (anyarray,anyarray)` |
|                  | `= (anyarray,anyarray)`  |
| `jsonb_ops`      | `@> (jsonb,jsonb)`       |
|                  | `@? (jsonb,jsonpath)`    |
|                  | `@@ (jsonb,jsonpath)`    |
|                  | `? (jsonb,text)`         |
|                  | `?\| (jsonb,text[])`     |
|                  | `?& (jsonb,text[])`      |
| `jsonb_path_ops` | `@> (jsonb,jsonb)`       |
|                  | `@? (jsonb,jsonpath)`    |
|                  | `@@ (jsonb,jsonpath)`    |
| `tsvector_ops`   | `@@ (tsvector,tsquery)`  |
|                  | `@@@ (tsvector,tsquery)` |

\

Of the two operator classes for type `jsonb`, `jsonb_ops` is the default. `jsonb_path_ops` supports fewer operators but offers better performance for those operators. See [Section 8.14.4](datatype-json.html#JSON-INDEXING "8.14.4. jsonb Indexing") for details.

***

|                                              |                                                       |                                                       |
| :------------------------------------------- | :---------------------------------------------------: | ----------------------------------------------------: |
| [Prev](gin-intro.html "70.1. Introduction")  |        [Up](gin.html "Chapter 70. GIN Indexes")       |  [Next](gin-extensibility.html "70.3. Extensibility") |
| 70.1. Introduction                           | [Home](index.html "PostgreSQL 17devel Documentation") |                                   70.3. Extensibility |

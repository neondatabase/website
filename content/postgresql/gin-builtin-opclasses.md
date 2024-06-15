[#id](#GIN-BUILTIN-OPCLASSES)

## 70.2. Built-in Operator Classes [#](#GIN-BUILTIN-OPCLASSES)

The core PostgreSQL distribution includes the GIN operator classes shown in [Table 70.1](gin-builtin-opclasses#GIN-BUILTIN-OPCLASSES-TABLE). (Some of the optional modules described in [Appendix F](contrib) provide additional GIN operator classes.)

[#id](#GIN-BUILTIN-OPCLASSES-TABLE)

**Table 70.1. Built-in GIN Operator Classes**

| Name                     | Indexable Operators      |
| ------------------------ | ------------------------ |
| `array_ops`              | `&& (anyarray,anyarray)` |
| `@> (anyarray,anyarray)` |                          |
| `<@ (anyarray,anyarray)` |                          |
| `= (anyarray,anyarray)`  |                          |
| `jsonb_ops`              | `@> (jsonb,jsonb)`       |
| `@? (jsonb,jsonpath)`    |                          |
| `@@ (jsonb,jsonpath)`    |                          |
| `? (jsonb,text)`         |                          |
| `?\| (jsonb,text[])`     |                          |
| `?& (jsonb,text[])`      |                          |
| `jsonb_path_ops`         | `@> (jsonb,jsonb)`       |
| `@? (jsonb,jsonpath)`    |                          |
| `@@ (jsonb,jsonpath)`    |                          |
| `tsvector_ops`           | `@@ (tsvector,tsquery)`  |
| `@@@ (tsvector,tsquery)` |                          |

Of the two operator classes for type `jsonb`, `jsonb_ops` is the default. `jsonb_path_ops` supports fewer operators but offers better performance for those operators. See [Section 8.14.4](datatype-json#JSON-INDEXING) for details.

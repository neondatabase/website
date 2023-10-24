<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                           Chapter 8. Data Types                           |                                            |                           |                                                       |                                                     |
| :-----------------------------------------------------------------------: | :----------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](queries-with.html "7.8. WITH Queries (Common Table Expressions)")  | [Up](sql.html "Part II. The SQL Language") | Part II. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](datatype-numeric.html "8.1. Numeric Types") |

***

## Chapter 8. Data Types

**Table of Contents**

* [8.1. Numeric Types](datatype-numeric.html)

  * *   [8.1.1. Integer Types](datatype-numeric.html#DATATYPE-INT)
  * [8.1.2. Arbitrary Precision Numbers](datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL)
  * [8.1.3. Floating-Point Types](datatype-numeric.html#DATATYPE-FLOAT)
  * [8.1.4. Serial Types](datatype-numeric.html#DATATYPE-SERIAL)

      * *   [8.2. Monetary Types](datatype-money.html)
  * [8.3. Character Types](datatype-character.html)
  * [8.4. Binary Data Types](datatype-binary.html)

    <!---->

      * *   [8.4.1. `bytea` Hex Format](datatype-binary.html#DATATYPE-BINARY-BYTEA-HEX-FORMAT)
    * [8.4.2. `bytea` Escape Format](datatype-binary.html#DATATYPE-BINARY-BYTEA-ESCAPE-FORMAT)

* [8.5. Date/Time Types](datatype-datetime.html)

  * *   [8.5.1. Date/Time Input](datatype-datetime.html#DATATYPE-DATETIME-INPUT)
  * [8.5.2. Date/Time Output](datatype-datetime.html#DATATYPE-DATETIME-OUTPUT)
  * [8.5.3. Time Zones](datatype-datetime.html#DATATYPE-TIMEZONES)
  * [8.5.4. Interval Input](datatype-datetime.html#DATATYPE-INTERVAL-INPUT)
  * [8.5.5. Interval Output](datatype-datetime.html#DATATYPE-INTERVAL-OUTPUT)

      * *   [8.6. Boolean Type](datatype-boolean.html)
  * [8.7. Enumerated Types](datatype-enum.html)

    <!---->

      * *   [8.7.1. Declaration of Enumerated Types](datatype-enum.html#DATATYPE-ENUM-DECLARATION)
    * [8.7.2. Ordering](datatype-enum.html#DATATYPE-ENUM-ORDERING)
    * [8.7.3. Type Safety](datatype-enum.html#DATATYPE-ENUM-TYPE-SAFETY)
    * [8.7.4. Implementation Details](datatype-enum.html#DATATYPE-ENUM-IMPLEMENTATION-DETAILS)

* [8.8. Geometric Types](datatype-geometric.html)

  * *   [8.8.1. Points](datatype-geometric.html#DATATYPE-GEOMETRIC-POINTS)
  * [8.8.2. Lines](datatype-geometric.html#DATATYPE-LINE)
  * [8.8.3. Line Segments](datatype-geometric.html#DATATYPE-LSEG)
  * [8.8.4. Boxes](datatype-geometric.html#DATATYPE-GEOMETRIC-BOXES)
  * [8.8.5. Paths](datatype-geometric.html#DATATYPE-GEOMETRIC-PATHS)
  * [8.8.6. Polygons](datatype-geometric.html#DATATYPE-POLYGON)
  * [8.8.7. Circles](datatype-geometric.html#DATATYPE-CIRCLE)

* [8.9. Network Address Types](datatype-net-types.html)

  * *   [8.9.1. `inet`](datatype-net-types.html#DATATYPE-INET)
  * [8.9.2. `cidr`](datatype-net-types.html#DATATYPE-CIDR)
  * [8.9.3. `inet` vs. `cidr`](datatype-net-types.html#DATATYPE-INET-VS-CIDR)
  * [8.9.4. `macaddr`](datatype-net-types.html#DATATYPE-MACADDR)
  * [8.9.5. `macaddr8`](datatype-net-types.html#DATATYPE-MACADDR8)

      * *   [8.10. Bit String Types](datatype-bit.html)
  * [8.11. Text Search Types](datatype-textsearch.html)

    <!---->

      * *   [8.11.1. `tsvector`](datatype-textsearch.html#DATATYPE-TSVECTOR)
    * [8.11.2. `tsquery`](datatype-textsearch.html#DATATYPE-TSQUERY)

      * *   [8.12. UUID Type](datatype-uuid.html)
  * [8.13. XML Type](datatype-xml.html)

    <!---->

      * *   [8.13.1. Creating XML Values](datatype-xml.html#DATATYPE-XML-CREATING)
    * [8.13.2. Encoding Handling](datatype-xml.html#DATATYPE-XML-ENCODING-HANDLING)
    * [8.13.3. Accessing XML Values](datatype-xml.html#DATATYPE-XML-ACCESSING-XML-VALUES)

* [8.14. JSON Types](datatype-json.html)

  * *   [8.14.1. JSON Input and Output Syntax](datatype-json.html#JSON-KEYS-ELEMENTS)
  * [8.14.2. Designing JSON Documents](datatype-json.html#JSON-DOC-DESIGN)
  * [8.14.3. `jsonb` Containment and Existence](datatype-json.html#JSON-CONTAINMENT)
  * [8.14.4. `jsonb` Indexing](datatype-json.html#JSON-INDEXING)
  * [8.14.5. `jsonb` Subscripting](datatype-json.html#JSONB-SUBSCRIPTING)
  * [8.14.6. Transforms](datatype-json.html#DATATYPE-JSON-TRANSFORMS)
  * [8.14.7. jsonpath Type](datatype-json.html#DATATYPE-JSONPATH)

* [8.15. Arrays](arrays.html)

  * *   [8.15.1. Declaration of Array Types](arrays.html#ARRAYS-DECLARATION)
  * [8.15.2. Array Value Input](arrays.html#ARRAYS-INPUT)
  * [8.15.3. Accessing Arrays](arrays.html#ARRAYS-ACCESSING)
  * [8.15.4. Modifying Arrays](arrays.html#ARRAYS-MODIFYING)
  * [8.15.5. Searching in Arrays](arrays.html#ARRAYS-SEARCHING)
  * [8.15.6. Array Input and Output Syntax](arrays.html#ARRAYS-IO)

* [8.16. Composite Types](rowtypes.html)

  * *   [8.16.1. Declaration of Composite Types](rowtypes.html#ROWTYPES-DECLARING)
  * [8.16.2. Constructing Composite Values](rowtypes.html#ROWTYPES-CONSTRUCTING)
  * [8.16.3. Accessing Composite Types](rowtypes.html#ROWTYPES-ACCESSING)
  * [8.16.4. Modifying Composite Types](rowtypes.html#ROWTYPES-MODIFYING)
  * [8.16.5. Using Composite Types in Queries](rowtypes.html#ROWTYPES-USAGE)
  * [8.16.6. Composite Type Input and Output Syntax](rowtypes.html#ROWTYPES-IO-SYNTAX)

* [8.17. Range Types](rangetypes.html)

  * *   [8.17.1. Built-in Range and Multirange Types](rangetypes.html#RANGETYPES-BUILTIN)
  * [8.17.2. Examples](rangetypes.html#RANGETYPES-EXAMPLES)
  * [8.17.3. Inclusive and Exclusive Bounds](rangetypes.html#RANGETYPES-INCLUSIVITY)
  * [8.17.4. Infinite (Unbounded) Ranges](rangetypes.html#RANGETYPES-INFINITE)
  * [8.17.5. Range Input/Output](rangetypes.html#RANGETYPES-IO)
  * [8.17.6. Constructing Ranges and Multiranges](rangetypes.html#RANGETYPES-CONSTRUCT)
  * [8.17.7. Discrete Range Types](rangetypes.html#RANGETYPES-DISCRETE)
  * [8.17.8. Defining New Range Types](rangetypes.html#RANGETYPES-DEFINING)
  * [8.17.9. Indexing](rangetypes.html#RANGETYPES-INDEXING)
  * [8.17.10. Constraints on Ranges](rangetypes.html#RANGETYPES-CONSTRAINT)

      * *   [8.18. Domain Types](domains.html)
  * [8.19. Object Identifier Types](datatype-oid.html)
  * [8.20. `pg_lsn` Type](datatype-pg-lsn.html)
  * [8.21. Pseudo-Types](datatype-pseudo.html)

PostgreSQL has a rich set of native data types available to users. Users can add new types to PostgreSQL using the [CREATE TYPE](sql-createtype.html "CREATE TYPE") command.

[Table 8.1](datatype.html#DATATYPE-TABLE "Table 8.1. Data Types") shows all the built-in general-purpose data types. Most of the alternative names listed in the “Aliases” column are the names used internally by PostgreSQL for historical reasons. In addition, some internally used or deprecated types are available, but are not listed here.

**Table 8.1. Data Types**

| Name                                      | Aliases              | Description                                                        |
| ----------------------------------------- | -------------------- | ------------------------------------------------------------------ |
| `bigint`                                  | `int8`               | signed eight-byte integer                                          |
| `bigserial`                               | `serial8`            | autoincrementing eight-byte integer                                |
| `bit [ (n) ]`                             |                      | fixed-length bit string                                            |
| `bit varying [ (n) ]`                     | `varbit [ (n) ]`     | variable-length bit string                                         |
| `boolean`                                 | `bool`               | logical Boolean (true/false)                                       |
| `box`                                     |                      | rectangular box on a plane                                         |
| `bytea`                                   |                      | binary data (“byte array”)                                         |
| `character [ (n) ]`                       | `char [ (n) ]`       | fixed-length character string                                      |
| `character varying [ (n) ]`               | `varchar [ (n) ]`    | variable-length character string                                   |
| `cidr`                                    |                      | IPv4 or IPv6 network address                                       |
| `circle`                                  |                      | circle on a plane                                                  |
| `date`                                    |                      | calendar date (year, month, day)                                   |
| `double precision`                        | `float8`             | double precision floating-point number (8 bytes)                   |
| `inet`                                    |                      | IPv4 or IPv6 host address                                          |
| `integer`                                 | `int`, `int4`        | signed four-byte integer                                           |
| `interval [ fields ] [ (p) ]`             |                      | time span                                                          |
| `json`                                    |                      | textual JSON data                                                  |
| `jsonb`                                   |                      | binary JSON data, decomposed                                       |
| `line`                                    |                      | infinite line on a plane                                           |
| `lseg`                                    |                      | line segment on a plane                                            |
| `macaddr`                                 |                      | MAC (Media Access Control) address                                 |
| `macaddr8`                                |                      | MAC (Media Access Control) address (EUI-64 format)                 |
| `money`                                   |                      | currency amount                                                    |
| `numeric [ (p, s) ]`                      | `decimal [ (p, s) ]` | exact numeric of selectable precision                              |
| `path`                                    |                      | geometric path on a plane                                          |
| `pg_lsn`                                  |                      | PostgreSQL Log Sequence Number                                     |
| `pg_snapshot`                             |                      | user-level transaction ID snapshot                                 |
| `point`                                   |                      | geometric point on a plane                                         |
| `polygon`                                 |                      | closed geometric path on a plane                                   |
| `real`                                    | `float4`             | single precision floating-point number (4 bytes)                   |
| `smallint`                                | `int2`               | signed two-byte integer                                            |
| `smallserial`                             | `serial2`            | autoincrementing two-byte integer                                  |
| `serial`                                  | `serial4`            | autoincrementing four-byte integer                                 |
| `text`                                    |                      | variable-length character string                                   |
| `time [ (p) ] [ without time zone ]`      |                      | time of day (no time zone)                                         |
| `time [ (p) ] with time zone`             | `timetz`             | time of day, including time zone                                   |
| `timestamp [ (p) ] [ without time zone ]` |                      | date and time (no time zone)                                       |
| `timestamp [ (p) ] with time zone`        | `timestamptz`        | date and time, including time zone                                 |
| `tsquery`                                 |                      | text search query                                                  |
| `tsvector`                                |                      | text search document                                               |
| `txid_snapshot`                           |                      | user-level transaction ID snapshot (deprecated; see `pg_snapshot`) |
| `uuid`                                    |                      | universally unique identifier                                      |
| `xml`                                     |                      | XML data                                                           |

\

### Compatibility

The following types (or spellings thereof) are specified by SQL: `bigint`, `bit`, `bit varying`, `boolean`, `char`, `character varying`, `character`, `varchar`, `date`, `double precision`, `integer`, `interval`, `numeric`, `decimal`, `real`, `smallint`, `time` (with or without time zone), `timestamp` (with or without time zone), `xml`.

Each data type has an external representation determined by its input and output functions. Many of the built-in types have obvious external formats. However, several types are either unique to PostgreSQL, such as geometric paths, or have several possible formats, such as the date and time types. Some of the input and output functions are not invertible, i.e., the result of an output function might lose accuracy when compared to the original input.

***

|                                                                           |                                                       |                                                     |
| :------------------------------------------------------------------------ | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](queries-with.html "7.8. WITH Queries (Common Table Expressions)")  |       [Up](sql.html "Part II. The SQL Language")      |  [Next](datatype-numeric.html "8.1. Numeric Types") |
| 7.8. `WITH` Queries (Common Table Expressions)                            | [Home](index.html "PostgreSQL 17devel Documentation") |                                  8.1. Numeric Types |

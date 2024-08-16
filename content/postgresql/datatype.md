[#id](#DATATYPE)

## Chapter 8. Data Types

**Table of Contents**

- [8.1. Numeric Types](datatype-numeric)

  - [8.1.1. Integer Types](datatype-numeric#DATATYPE-INT)
  - [8.1.2. Arbitrary Precision Numbers](datatype-numeric#DATATYPE-NUMERIC-DECIMAL)
  - [8.1.3. Floating-Point Types](datatype-numeric#DATATYPE-FLOAT)
  - [8.1.4. Serial Types](datatype-numeric#DATATYPE-SERIAL)

  - [8.2. Monetary Types](datatype-money)
  - [8.3. Character Types](datatype-character)
  - [8.4. Binary Data Types](datatype-binary)

    - [8.4.1. `bytea` Hex Format](datatype-binary#DATATYPE-BINARY-BYTEA-HEX-FORMAT)
    - [8.4.2. `bytea` Escape Format](datatype-binary#DATATYPE-BINARY-BYTEA-ESCAPE-FORMAT)

- [8.5. Date/Time Types](datatype-datetime)

  - [8.5.1. Date/Time Input](datatype-datetime#DATATYPE-DATETIME-INPUT)
  - [8.5.2. Date/Time Output](datatype-datetime#DATATYPE-DATETIME-OUTPUT)
  - [8.5.3. Time Zones](datatype-datetime#DATATYPE-TIMEZONES)
  - [8.5.4. Interval Input](datatype-datetime#DATATYPE-INTERVAL-INPUT)
  - [8.5.5. Interval Output](datatype-datetime#DATATYPE-INTERVAL-OUTPUT)

  - [8.6. Boolean Type](datatype-boolean)
  - [8.7. Enumerated Types](datatype-enum)

    - [8.7.1. Declaration of Enumerated Types](datatype-enum#DATATYPE-ENUM-DECLARATION)
    - [8.7.2. Ordering](datatype-enum#DATATYPE-ENUM-ORDERING)
    - [8.7.3. Type Safety](datatype-enum#DATATYPE-ENUM-TYPE-SAFETY)
    - [8.7.4. Implementation Details](datatype-enum#DATATYPE-ENUM-IMPLEMENTATION-DETAILS)

- [8.8. Geometric Types](datatype-geometric)

  - [8.8.1. Points](datatype-geometric#DATATYPE-GEOMETRIC-POINTS)
  - [8.8.2. Lines](datatype-geometric#DATATYPE-LINE)
  - [8.8.3. Line Segments](datatype-geometric#DATATYPE-LSEG)
  - [8.8.4. Boxes](datatype-geometric#DATATYPE-GEOMETRIC-BOXES)
  - [8.8.5. Paths](datatype-geometric#DATATYPE-GEOMETRIC-PATHS)
  - [8.8.6. Polygons](datatype-geometric#DATATYPE-POLYGON)
  - [8.8.7. Circles](datatype-geometric#DATATYPE-CIRCLE)

- [8.9. Network Address Types](datatype-net-types)

  - [8.9.1. `inet`](datatype-net-types#DATATYPE-INET)
  - [8.9.2. `cidr`](datatype-net-types#DATATYPE-CIDR)
  - [8.9.3. `inet` vs. `cidr`](datatype-net-types#DATATYPE-INET-VS-CIDR)
  - [8.9.4. `macaddr`](datatype-net-types#DATATYPE-MACADDR)
  - [8.9.5. `macaddr8`](datatype-net-types#DATATYPE-MACADDR8)

  - [8.10. Bit String Types](datatype-bit)
  - [8.11. Text Search Types](datatype-textsearch)

    - [8.11.1. `tsvector`](datatype-textsearch#DATATYPE-TSVECTOR)
    - [8.11.2. `tsquery`](datatype-textsearch#DATATYPE-TSQUERY)

  - [8.12. UUID Type](datatype-uuid)
  - [8.13. XML Type](datatype-xml)

    - [8.13.1. Creating XML Values](datatype-xml#DATATYPE-XML-CREATING)
    - [8.13.2. Encoding Handling](datatype-xml#DATATYPE-XML-ENCODING-HANDLING)
    - [8.13.3. Accessing XML Values](datatype-xml#DATATYPE-XML-ACCESSING-XML-VALUES)

- [8.14. JSON Types](datatype-json)

  - [8.14.1. JSON Input and Output Syntax](datatype-json#JSON-KEYS-ELEMENTS)
  - [8.14.2. Designing JSON Documents](datatype-json#JSON-DOC-DESIGN)
  - [8.14.3. `jsonb` Containment and Existence](datatype-json#JSON-CONTAINMENT)
  - [8.14.4. `jsonb` Indexing](datatype-json#JSON-INDEXING)
  - [8.14.5. `jsonb` Subscripting](datatype-json#JSONB-SUBSCRIPTING)
  - [8.14.6. Transforms](datatype-json#DATATYPE-JSON-TRANSFORMS)
  - [8.14.7. jsonpath Type](datatype-json#DATATYPE-JSONPATH)

- [8.15. Arrays](arrays)

  - [8.15.1. Declaration of Array Types](arrays#ARRAYS-DECLARATION)
  - [8.15.2. Array Value Input](arrays#ARRAYS-INPUT)
  - [8.15.3. Accessing Arrays](arrays#ARRAYS-ACCESSING)
  - [8.15.4. Modifying Arrays](arrays#ARRAYS-MODIFYING)
  - [8.15.5. Searching in Arrays](arrays#ARRAYS-SEARCHING)
  - [8.15.6. Array Input and Output Syntax](arrays#ARRAYS-IO)

- [8.16. Composite Types](rowtypes)

  - [8.16.1. Declaration of Composite Types](rowtypes#ROWTYPES-DECLARING)
  - [8.16.2. Constructing Composite Values](rowtypes#ROWTYPES-CONSTRUCTING)
  - [8.16.3. Accessing Composite Types](rowtypes#ROWTYPES-ACCESSING)
  - [8.16.4. Modifying Composite Types](rowtypes#ROWTYPES-MODIFYING)
  - [8.16.5. Using Composite Types in Queries](rowtypes#ROWTYPES-USAGE)
  - [8.16.6. Composite Type Input and Output Syntax](rowtypes#ROWTYPES-IO-SYNTAX)

- [8.17. Range Types](rangetypes)

  - [8.17.1. Built-in Range and Multirange Types](rangetypes#RANGETYPES-BUILTIN)
  - [8.17.2. Examples](rangetypes#RANGETYPES-EXAMPLES)
  - [8.17.3. Inclusive and Exclusive Bounds](rangetypes#RANGETYPES-INCLUSIVITY)
  - [8.17.4. Infinite (Unbounded) Ranges](rangetypes#RANGETYPES-INFINITE)
  - [8.17.5. Range Input/Output](rangetypes#RANGETYPES-IO)
  - [8.17.6. Constructing Ranges and Multiranges](rangetypes#RANGETYPES-CONSTRUCT)
  - [8.17.7. Discrete Range Types](rangetypes#RANGETYPES-DISCRETE)
  - [8.17.8. Defining New Range Types](rangetypes#RANGETYPES-DEFINING)
  - [8.17.9. Indexing](rangetypes#RANGETYPES-INDEXING)
  - [8.17.10. Constraints on Ranges](rangetypes#RANGETYPES-CONSTRAINT)

  - [8.18. Domain Types](domains)
  - [8.19. Object Identifier Types](datatype-oid)
  - [8.20. `pg_lsn` Type](datatype-pg-lsn)
  - [8.21. Pseudo-Types](datatype-pseudo)

PostgreSQL has a rich set of native data types available to users. Users can add new types to PostgreSQL using the [CREATE TYPE](sql-createtype) command.

[Table 8.1](datatype#DATATYPE-TABLE) shows all the built-in general-purpose data types. Most of the alternative names listed in the “Aliases” column are the names used internally by PostgreSQL for historical reasons. In addition, some internally used or deprecated types are available, but are not listed here.

[#id](#DATATYPE-TABLE)

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

### Compatibility

The following types (or spellings thereof) are specified by SQL: `bigint`, `bit`, `bit varying`, `boolean`, `char`, `character varying`, `character`, `varchar`, `date`, `double precision`, `integer`, `interval`, `numeric`, `decimal`, `real`, `smallint`, `time` (with or without time zone), `timestamp` (with or without time zone), `xml`.

Each data type has an external representation determined by its input and output functions. Many of the built-in types have obvious external formats. However, several types are either unique to PostgreSQL, such as geometric paths, or have several possible formats, such as the date and time types. Some of the input and output functions are not invertible, i.e., the result of an output function might lose accuracy when compared to the original input.

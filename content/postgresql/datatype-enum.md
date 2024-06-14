[#id](#DATATYPE-ENUM)

## 8.7. Enumerated Types [#](#DATATYPE-ENUM)

- [8.7.1. Declaration of Enumerated Types](datatype-enum#DATATYPE-ENUM-DECLARATION)
- [8.7.2. Ordering](datatype-enum#DATATYPE-ENUM-ORDERING)
- [8.7.3. Type Safety](datatype-enum#DATATYPE-ENUM-TYPE-SAFETY)
- [8.7.4. Implementation Details](datatype-enum#DATATYPE-ENUM-IMPLEMENTATION-DETAILS)

Enumerated (enum) types are data types that comprise a static, ordered set of values. They are equivalent to the `enum` types supported in a number of programming languages. An example of an enum type might be the days of the week, or a set of status values for a piece of data.

[#id](#DATATYPE-ENUM-DECLARATION)

### 8.7.1. Declaration of Enumerated Types [#](#DATATYPE-ENUM-DECLARATION)

Enum types are created using the [CREATE TYPE](sql-createtype) command, for example:

```

CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');
```

Once created, the enum type can be used in table and function definitions much like any other type:

```

CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');
CREATE TABLE person (
    name text,
    current_mood mood
);
INSERT INTO person VALUES ('Moe', 'happy');
SELECT * FROM person WHERE current_mood = 'happy';
 name | current_mood
------+--------------
 Moe  | happy
(1 row)
```

[#id](#DATATYPE-ENUM-ORDERING)

### 8.7.2. Ordering [#](#DATATYPE-ENUM-ORDERING)

The ordering of the values in an enum type is the order in which the values were listed when the type was created. All standard comparison operators and related aggregate functions are supported for enums. For example:

```

INSERT INTO person VALUES ('Larry', 'sad');
INSERT INTO person VALUES ('Curly', 'ok');
SELECT * FROM person WHERE current_mood > 'sad';
 name  | current_mood
-------+--------------
 Moe   | happy
 Curly | ok
(2 rows)

SELECT * FROM person WHERE current_mood > 'sad' ORDER BY current_mood;
 name  | current_mood
-------+--------------
 Curly | ok
 Moe   | happy
(2 rows)

SELECT name
FROM person
WHERE current_mood = (SELECT MIN(current_mood) FROM person);
 name
-------
 Larry
(1 row)
```

[#id](#DATATYPE-ENUM-TYPE-SAFETY)

### 8.7.3. Type Safety [#](#DATATYPE-ENUM-TYPE-SAFETY)

Each enumerated data type is separate and cannot be compared with other enumerated types. See this example:

```

CREATE TYPE happiness AS ENUM ('happy', 'very happy', 'ecstatic');
CREATE TABLE holidays (
    num_weeks integer,
    happiness happiness
);
INSERT INTO holidays(num_weeks,happiness) VALUES (4, 'happy');
INSERT INTO holidays(num_weeks,happiness) VALUES (6, 'very happy');
INSERT INTO holidays(num_weeks,happiness) VALUES (8, 'ecstatic');
INSERT INTO holidays(num_weeks,happiness) VALUES (2, 'sad');
ERROR:  invalid input value for enum happiness: "sad"
SELECT person.name, holidays.num_weeks FROM person, holidays
  WHERE person.current_mood = holidays.happiness;
ERROR:  operator does not exist: mood = happiness
```

If you really need to do something like that, you can either write a custom operator or add explicit casts to your query:

```

SELECT person.name, holidays.num_weeks FROM person, holidays
  WHERE person.current_mood::text = holidays.happiness::text;
 name | num_weeks
------+-----------
 Moe  |         4
(1 row)
```

[#id](#DATATYPE-ENUM-IMPLEMENTATION-DETAILS)

### 8.7.4. Implementation Details [#](#DATATYPE-ENUM-IMPLEMENTATION-DETAILS)

Enum labels are case sensitive, so `'happy'` is not the same as `'HAPPY'`. White space in the labels is significant too.

Although enum types are primarily intended for static sets of values, there is support for adding new values to an existing enum type, and for renaming values (see [ALTER TYPE](sql-altertype)). Existing values cannot be removed from an enum type, nor can the sort ordering of such values be changed, short of dropping and re-creating the enum type.

An enum value occupies four bytes on disk. The length of an enum value's textual label is limited by the `NAMEDATALEN` setting compiled into PostgreSQL; in standard builds this means at most 63 bytes.

The translations from internal enum values to textual labels are kept in the system catalog [`pg_enum`](catalog-pg-enum). Querying this catalog directly can be useful.

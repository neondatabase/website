<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                     8.10. Bit String Types                    |                                             |                       |                                                       |                                                             |
| :-----------------------------------------------------------: | :------------------------------------------ | :-------------------: | ----------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](datatype-net-types.html "8.9. Network Address Types")  | [Up](datatype.html "Chapter 8. Data Types") | Chapter 8. Data Types | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](datatype-textsearch.html "8.11. Text Search Types") |

***

## 8.10. Bit String Types [#](#DATATYPE-BIT)

[]()

Bit strings are strings of 1's and 0's. They can be used to store or visualize bit masks. There are two SQL bit types: `bit(n)` and `bit varying(n)`, where *`n`* is a positive integer.

`bit` type data must match the length *`n`* exactly; it is an error to attempt to store shorter or longer bit strings. `bit varying` data is of variable length up to the maximum length *`n`*; longer strings will be rejected. Writing `bit` without a length is equivalent to `bit(1)`, while `bit varying` without a length specification means unlimited length.

### Note

If one explicitly casts a bit-string value to `bit(n)`, it will be truncated or zero-padded on the right to be exactly *`n`* bits, without raising an error. Similarly, if one explicitly casts a bit-string value to `bit varying(n)`, it will be truncated on the right if it is more than *`n`* bits.

Refer to [Section 4.1.2.5](sql-syntax-lexical.html#SQL-SYNTAX-BIT-STRINGS "4.1.2.5. Bit-String Constants") for information about the syntax of bit string constants. Bit-logical operators and string manipulation functions are available; see [Section 9.6](functions-bitstring.html "9.6. Bit String Functions and Operators").

**Example 8.3. Using the Bit String Types**

```

CREATE TABLE test (a BIT(3), b BIT VARYING(5));
INSERT INTO test VALUES (B'101', B'00');
INSERT INTO test VALUES (B'10', B'101');

ERROR:  bit string length 2 does not match type bit(3)

INSERT INTO test VALUES (B'10'::bit(3), B'101');
SELECT * FROM test;

  a  |  b
-----+-----
 101 | 00
 100 | 101
```

\


A bit string value requires 1 byte for each group of 8 bits, plus 5 or 8 bytes overhead depending on the length of the string (but long values may be compressed or moved out-of-line, as explained in [Section 8.3](datatype-character.html "8.3. Character Types") for character strings).

***

|                                                               |                                                       |                                                             |
| :------------------------------------------------------------ | :---------------------------------------------------: | ----------------------------------------------------------: |
| [Prev](datatype-net-types.html "8.9. Network Address Types")  |      [Up](datatype.html "Chapter 8. Data Types")      |  [Next](datatype-textsearch.html "8.11. Text Search Types") |
| 8.9. Network Address Types                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                     8.11. Text Search Types |

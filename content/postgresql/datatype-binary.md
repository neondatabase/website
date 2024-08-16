[#id](#DATATYPE-BINARY)

## 8.4. Binary Data Types [#](#DATATYPE-BINARY)

- [8.4.1. `bytea` Hex Format](datatype-binary#DATATYPE-BINARY-BYTEA-HEX-FORMAT)
- [8.4.2. `bytea` Escape Format](datatype-binary#DATATYPE-BINARY-BYTEA-ESCAPE-FORMAT)

The `bytea` data type allows storage of binary strings; see [Table 8.6](datatype-binary#DATATYPE-BINARY-TABLE).

[#id](#DATATYPE-BINARY-TABLE)

**Table 8.6. Binary Data Types**

| Name    | Storage Size                               | Description                   |
| ------- | ------------------------------------------ | ----------------------------- |
| `bytea` | 1 or 4 bytes plus the actual binary string | variable-length binary string |

A binary string is a sequence of octets (or bytes). Binary strings are distinguished from character strings in two ways. First, binary strings specifically allow storing octets of value zero and other “non-printable” octets (usually, octets outside the decimal range 32 to 126). Character strings disallow zero octets, and also disallow any other octet values and sequences of octet values that are invalid according to the database's selected character set encoding. Second, operations on binary strings process the actual bytes, whereas the processing of character strings depends on locale settings. In short, binary strings are appropriate for storing data that the programmer thinks of as “raw bytes”, whereas character strings are appropriate for storing text.

The `bytea` type supports two formats for input and output: “hex” format and PostgreSQL's historical “escape” format. Both of these are always accepted on input. The output format depends on the configuration parameter [bytea_output](runtime-config-client#GUC-BYTEA-OUTPUT); the default is hex. (Note that the hex format was introduced in PostgreSQL 9.0; earlier versions and some tools don't understand it.)

The SQL standard defines a different binary string type, called `BLOB` or `BINARY LARGE OBJECT`. The input format is different from `bytea`, but the provided functions and operators are mostly the same.

[#id](#DATATYPE-BINARY-BYTEA-HEX-FORMAT)

### 8.4.1. `bytea` Hex Format [#](#DATATYPE-BINARY-BYTEA-HEX-FORMAT)

The “hex” format encodes binary data as 2 hexadecimal digits per byte, most significant nibble first. The entire string is preceded by the sequence `\x` (to distinguish it from the escape format). In some contexts, the initial backslash may need to be escaped by doubling it (see [Section 4.1.2.1](sql-syntax-lexical#SQL-SYNTAX-STRINGS)). For input, the hexadecimal digits can be either upper or lower case, and whitespace is permitted between digit pairs (but not within a digit pair nor in the starting `\x` sequence). The hex format is compatible with a wide range of external applications and protocols, and it tends to be faster to convert than the escape format, so its use is preferred.

Example:

```

SET bytea_output = 'hex';

SELECT '\xDEADBEEF'::bytea;
   bytea
------------
 \xdeadbeef
```

[#id](#DATATYPE-BINARY-BYTEA-ESCAPE-FORMAT)

### 8.4.2. `bytea` Escape Format [#](#DATATYPE-BINARY-BYTEA-ESCAPE-FORMAT)

The “escape” format is the traditional PostgreSQL format for the `bytea` type. It takes the approach of representing a binary string as a sequence of ASCII characters, while converting those bytes that cannot be represented as an ASCII character into special escape sequences. If, from the point of view of the application, representing bytes as characters makes sense, then this representation can be convenient. But in practice it is usually confusing because it fuzzes up the distinction between binary strings and character strings, and also the particular escape mechanism that was chosen is somewhat unwieldy. Therefore, this format should probably be avoided for most new applications.

When entering `bytea` values in escape format, octets of certain values _must_ be escaped, while all octet values _can_ be escaped. In general, to escape an octet, convert it into its three-digit octal value and precede it by a backslash. Backslash itself (octet decimal value 92) can alternatively be represented by double backslashes. [Table 8.7](datatype-binary#DATATYPE-BINARY-SQLESC) shows the characters that must be escaped, and gives the alternative escape sequences where applicable.

[#id](#DATATYPE-BINARY-SQLESC)

**Table 8.7. `bytea` Literal Escaped Octets**

| Decimal Octet Value    | Description            | Escaped Input Representation | Example         | Hex Representation |
| ---------------------- | ---------------------- | ---------------------------- | --------------- | ------------------ |
| 0                      | zero octet             | `'\000'`                     | `'\000'::bytea` | `\x00`             |
| 39                     | single quote           | `''''` or `'\047'`           | `''''::bytea`   | `\x27`             |
| 92                     | backslash              | `'\\'` or `'\134'`           | `'\\'::bytea`   | `\x5c`             |
| 0 to 31 and 127 to 255 | “non-printable” octets | `'\xxx'` (octal value)       | `'\001'::bytea` | `\x01`             |

The requirement to escape _non-printable_ octets varies depending on locale settings. In some instances you can get away with leaving them unescaped.

The reason that single quotes must be doubled, as shown in [Table 8.7](datatype-binary#DATATYPE-BINARY-SQLESC), is that this is true for any string literal in an SQL command. The generic string-literal parser consumes the outermost single quotes and reduces any pair of single quotes to one data character. What the `bytea` input function sees is just one single quote, which it treats as a plain data character. However, the `bytea` input function treats backslashes as special, and the other behaviors shown in [Table 8.7](datatype-binary#DATATYPE-BINARY-SQLESC) are implemented by that function.

In some contexts, backslashes must be doubled compared to what is shown above, because the generic string-literal parser will also reduce pairs of backslashes to one data character; see [Section 4.1.2.1](sql-syntax-lexical#SQL-SYNTAX-STRINGS).

`Bytea` octets are output in `hex` format by default. If you change [bytea_output](runtime-config-client#GUC-BYTEA-OUTPUT) to `escape`, “non-printable” octets are converted to their equivalent three-digit octal value and preceded by one backslash. Most “printable” octets are output by their standard representation in the client character set, e.g.:

```

SET bytea_output = 'escape';

SELECT 'abc \153\154\155 \052\251\124'::bytea;
     bytea
----------------
 abc klm *\251T
```

The octet with decimal value 92 (backslash) is doubled in the output. Details are in [Table 8.8](datatype-binary#DATATYPE-BINARY-RESESC).

[#id](#DATATYPE-BINARY-RESESC)

**Table 8.8. `bytea` Output Escaped Octets**

| Decimal Octet Value    | Description            | Escaped Output Representation       | Example         | Output Result |
| ---------------------- | ---------------------- | ----------------------------------- | --------------- | ------------- |
| 92                     | backslash              | `\\`                                | `'\134'::bytea` | `\\`          |
| 0 to 31 and 127 to 255 | “non-printable” octets | `\xxx` (octal value)                | `'\001'::bytea` | `\001`        |
| 32 to 126              | “printable” octets     | client character set representation | `'\176'::bytea` | `~`           |

Depending on the front end to PostgreSQL you use, you might have additional work to do in terms of escaping and unescaping `bytea` strings. For example, you might also have to escape line feeds and carriage returns if your interface automatically translates these.

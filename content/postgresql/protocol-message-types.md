

|                                  55.6. Message Data Types                                 |                                                             |                                       |                                                       |                                                                |
| :---------------------------------------------------------------------------------------: | :---------------------------------------------------------- | :-----------------------------------: | ----------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](protocol-logical-replication.html "55.5. Logical Streaming Replication Protocol")  | [Up](protocol.html "Chapter 55. Frontend/Backend Protocol") | Chapter 55. Frontend/Backend Protocol | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](protocol-message-formats.html "55.7. Message Formats") |

***

## 55.6. Message Data Types [#](#PROTOCOL-MESSAGE-TYPES)

This section describes the base data types used in messages.

* Int*`n`*(*`i`*)

    An *`n`*-bit integer in network byte order (most significant byte first). If *`i`* is specified it is the exact value that will appear, otherwise the value is variable. Eg. Int16, Int32(42).

* Int*`n`*\[*`k`*]

    An array of *`k`* *`n`*-bit integers, each in network byte order. The array length *`k`* is always determined by an earlier field in the message. Eg. Int16\[M].

* String(*`s`*)

    A null-terminated string (C-style string). There is no specific length limitation on strings. If *`s`* is specified it is the exact value that will appear, otherwise the value is variable. Eg. String, String("user").

### Note

    *There is no predefined limit* on the length of a string that can be returned by the backend. Good coding strategy for a frontend is to use an expandable buffer so that anything that fits in memory can be accepted. If that's not feasible, read the full string and discard trailing characters that don't fit into your fixed-size buffer.

* Byte*`n`*(*`c`*)

    Exactly *`n`* bytes. If the field width *`n`* is not a constant, it is always determinable from an earlier field in the message. If *`c`* is specified it is the exact value. Eg. Byte2, Byte1('\n').

***

|                                                                                           |                                                             |                                                                |
| :---------------------------------------------------------------------------------------- | :---------------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](protocol-logical-replication.html "55.5. Logical Streaming Replication Protocol")  | [Up](protocol.html "Chapter 55. Frontend/Backend Protocol") |  [Next](protocol-message-formats.html "55.7. Message Formats") |
| 55.5. Logical Streaming Replication Protocol                                              |    [Home](index.html "PostgreSQL 17devel Documentation")    |                                          55.7. Message Formats |

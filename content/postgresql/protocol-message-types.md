[#id](#PROTOCOL-MESSAGE-TYPES)

## 55.6. Message Data Types [#](#PROTOCOL-MESSAGE-TYPES)

This section describes the base data types used in messages.

- Int*`n`*(_`i`_)

  An _`n`_-bit integer in network byte order (most significant byte first). If _`i`_ is specified it is the exact value that will appear, otherwise the value is variable. Eg. Int16, Int32(42).

- Int*`n`*\[_`k`_]

  An array of _`k`_ _`n`_-bit integers, each in network byte order. The array length _`k`_ is always determined by an earlier field in the message. Eg. Int16\[M].

- String(_`s`_)

  A null-terminated string (C-style string). There is no specific length limitation on strings. If _`s`_ is specified it is the exact value that will appear, otherwise the value is variable. Eg. String, String("user").

  ### Note

  _There is no predefined limit_ on the length of a string that can be returned by the backend. Good coding strategy for a frontend is to use an expandable buffer so that anything that fits in memory can be accepted. If that's not feasible, read the full string and discard trailing characters that don't fit into your fixed-size buffer.

- Byte*`n`*(_`c`_)

  Exactly _`n`_ bytes. If the field width _`n`_ is not a constant, it is always determinable from an earlier field in the message. If _`c`_ is specified it is the exact value. Eg. Byte2, Byte1('\n').

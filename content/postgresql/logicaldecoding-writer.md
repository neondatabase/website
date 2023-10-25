<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        49.7. Logical Decoding Output Writers                        |                                                           |                              |                                                       |                                                                                                        |
| :---------------------------------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------------------------------------: |
| [Prev](logicaldecoding-output-plugin.html "49.6. Logical Decoding Output Plugins")  | [Up](logicaldecoding.html "Chapter 49. Logical Decoding") | Chapter 49. Logical Decoding | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](logicaldecoding-synchronous.html "49.8. Synchronous Replication Support for Logical Decoding") |

***

## 49.7. Logical Decoding Output Writers [#](#LOGICALDECODING-WRITER)

It is possible to add more output methods for logical decoding. For details, see `src/backend/replication/logical/logicalfuncs.c`. Essentially, three functions need to be provided: one to read WAL, one to prepare writing output, and one to write the output (see [Section 49.6.5](logicaldecoding-output-plugin.html#LOGICALDECODING-OUTPUT-PLUGIN-OUTPUT "49.6.5. Functions for Producing Output")).

***

|                                                                                     |                                                           |                                                                                                        |
| :---------------------------------------------------------------------------------- | :-------------------------------------------------------: | -----------------------------------------------------------------------------------------------------: |
| [Prev](logicaldecoding-output-plugin.html "49.6. Logical Decoding Output Plugins")  | [Up](logicaldecoding.html "Chapter 49. Logical Decoding") |  [Next](logicaldecoding-synchronous.html "49.8. Synchronous Replication Support for Logical Decoding") |
| 49.6. Logical Decoding Output Plugins                                               |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                             49.8. Synchronous Replication Support for Logical Decoding |

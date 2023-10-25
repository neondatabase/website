

|                           49.4. Logical Decoding SQL Interface                           |                                                           |                              |                                                       |                                                                                            |
| :--------------------------------------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------------------------: |
| [Prev](logicaldecoding-walsender.html "49.3. Streaming Replication Protocol Interface")  | [Up](logicaldecoding.html "Chapter 49. Logical Decoding") | Chapter 49. Logical Decoding | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](logicaldecoding-catalogs.html "49.5. System Catalogs Related to Logical Decoding") |

***

## 49.4. Logical Decoding SQL Interface [#](#LOGICALDECODING-SQL)

See [Section 9.27.6](functions-admin.html#FUNCTIONS-REPLICATION "9.27.6. Replication Management Functions") for detailed documentation on the SQL-level API for interacting with logical decoding.

Synchronous replication (see [Section 27.2.8](warm-standby.html#SYNCHRONOUS-REPLICATION "27.2.8. Synchronous Replication")) is only supported on replication slots used over the streaming replication interface. The function interface and additional, non-core interfaces do not support synchronous replication.

***

|                                                                                          |                                                           |                                                                                            |
| :--------------------------------------------------------------------------------------- | :-------------------------------------------------------: | -----------------------------------------------------------------------------------------: |
| [Prev](logicaldecoding-walsender.html "49.3. Streaming Replication Protocol Interface")  | [Up](logicaldecoding.html "Chapter 49. Logical Decoding") |  [Next](logicaldecoding-catalogs.html "49.5. System Catalogs Related to Logical Decoding") |
| 49.3. Streaming Replication Protocol Interface                                           |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                          49.5. System Catalogs Related to Logical Decoding |

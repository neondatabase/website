<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                49.3. Streaming Replication Protocol Interface               |                                                           |                              |                                                       |                                                                          |
| :-------------------------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------: |
| [Prev](logicaldecoding-explanation.html "49.2. Logical Decoding Concepts")  | [Up](logicaldecoding.html "Chapter 49. Logical Decoding") | Chapter 49. Logical Decoding | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](logicaldecoding-sql.html "49.4. Logical Decoding SQL Interface") |

***

## 49.3. Streaming Replication Protocol Interface [#](#LOGICALDECODING-WALSENDER)

The commands

*   `CREATE_REPLICATION_SLOT slot_name LOGICAL output_plugin`
*   `DROP_REPLICATION_SLOT slot_name` \[ `WAIT` ]
*   `START_REPLICATION SLOT slot_name LOGICAL ...`

are used to create, drop, and stream changes from a replication slot, respectively. These commands are only available over a replication connection; they cannot be used via SQL. See [Section 55.4](protocol-replication.html "55.4. Streaming Replication Protocol") for details on these commands.

The command [pg\_recvlogical](app-pgrecvlogical.html "pg_recvlogical") can be used to control logical decoding over a streaming replication connection. (It uses these commands internally.)

***

|                                                                             |                                                           |                                                                          |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------: | -----------------------------------------------------------------------: |
| [Prev](logicaldecoding-explanation.html "49.2. Logical Decoding Concepts")  | [Up](logicaldecoding.html "Chapter 49. Logical Decoding") |  [Next](logicaldecoding-sql.html "49.4. Logical Decoding SQL Interface") |
| 49.2. Logical Decoding Concepts                                             |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                     49.4. Logical Decoding SQL Interface |

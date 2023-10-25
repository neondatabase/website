<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   Chapter 49. Logical Decoding                   |                                                            |                            |                                                       |                                                                         |
| :--------------------------------------------------------------: | :--------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](bgworker.html "Chapter 48. Background Worker Processes")  | [Up](server-programming.html "Part V. Server Programming") | Part V. Server Programming | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](logicaldecoding-example.html "49.1. Logical Decoding Examples") |

***

## Chapter 49. Logical Decoding

**Table of Contents**

  * *   [49.1. Logical Decoding Examples](logicaldecoding-example.html)
  * [49.2. Logical Decoding Concepts](logicaldecoding-explanation.html)

    <!---->

  * *   [49.2.1. Logical Decoding](logicaldecoding-explanation.html#LOGICALDECODING-EXPLANATION-LOG-DEC)
    * [49.2.2. Replication Slots](logicaldecoding-explanation.html#LOGICALDECODING-REPLICATION-SLOTS)
    * [49.2.3. Output Plugins](logicaldecoding-explanation.html#LOGICALDECODING-EXPLANATION-OUTPUT-PLUGINS)
    * [49.2.4. Exported Snapshots](logicaldecoding-explanation.html#LOGICALDECODING-EXPLANATION-EXPORTED-SNAPSHOTS)

  * *   [49.3. Streaming Replication Protocol Interface](logicaldecoding-walsender.html)
  * [49.4. Logical Decoding SQL Interface](logicaldecoding-sql.html)
  * [49.5. System Catalogs Related to Logical Decoding](logicaldecoding-catalogs.html)
  * [49.6. Logical Decoding Output Plugins](logicaldecoding-output-plugin.html)

    <!---->

  * *   [49.6.1. Initialization Function](logicaldecoding-output-plugin.html#LOGICALDECODING-OUTPUT-INIT)
    * [49.6.2. Capabilities](logicaldecoding-output-plugin.html#LOGICALDECODING-CAPABILITIES)
    * [49.6.3. Output Modes](logicaldecoding-output-plugin.html#LOGICALDECODING-OUTPUT-MODE)
    * [49.6.4. Output Plugin Callbacks](logicaldecoding-output-plugin.html#LOGICALDECODING-OUTPUT-PLUGIN-CALLBACKS)
    * [49.6.5. Functions for Producing Output](logicaldecoding-output-plugin.html#LOGICALDECODING-OUTPUT-PLUGIN-OUTPUT)

  * *   [49.7. Logical Decoding Output Writers](logicaldecoding-writer.html)
  * [49.8. Synchronous Replication Support for Logical Decoding](logicaldecoding-synchronous.html)

    <!---->

  * *   [49.8.1. Overview](logicaldecoding-synchronous.html#LOGICALDECODING-SYNCHRONOUS-OVERVIEW)
    * [49.8.2. Caveats](logicaldecoding-synchronous.html#LOGICALDECODING-SYNCHRONOUS-CAVEATS)

  * *   [49.9. Streaming of Large Transactions for Logical Decoding](logicaldecoding-streaming.html)
  * [49.10. Two-phase Commit Support for Logical Decoding](logicaldecoding-two-phase-commits.html)

PostgreSQL provides infrastructure to stream the modifications performed via SQL to external consumers. This functionality can be used for a variety of purposes, including replication solutions and auditing.

Changes are sent out in streams identified by logical replication slots.

The format in which those changes are streamed is determined by the output plugin used. An example plugin is provided in the PostgreSQL distribution. Additional plugins can be written to extend the choice of available formats without modifying any core code. Every output plugin has access to each individual new row produced by `INSERT` and the new row version created by `UPDATE`. Availability of old row versions for `UPDATE` and `DELETE` depends on the configured replica identity (see [`REPLICA IDENTITY`](sql-altertable.html#SQL-ALTERTABLE-REPLICA-IDENTITY)).

Changes can be consumed either using the streaming replication protocol (see [Section 55.4](protocol-replication.html "55.4. Streaming Replication Protocol") and [Section 49.3](logicaldecoding-walsender.html "49.3. Streaming Replication Protocol Interface")), or by calling functions via SQL (see [Section 49.4](logicaldecoding-sql.html "49.4. Logical Decoding SQL Interface")). It is also possible to write additional methods of consuming the output of a replication slot without modifying core code (see [Section 49.7](logicaldecoding-writer.html "49.7. Logical Decoding Output Writers")).

***

|                                                                  |                                                            |                                                                         |
| :--------------------------------------------------------------- | :--------------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](bgworker.html "Chapter 48. Background Worker Processes")  | [Up](server-programming.html "Part V. Server Programming") |  [Next](logicaldecoding-example.html "49.1. Logical Decoding Examples") |
| Chapter 48. Background Worker Processes                          |    [Home](index.html "PostgreSQL 17devel Documentation")   |                                         49.1. Logical Decoding Examples |

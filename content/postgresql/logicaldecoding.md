[#id](#LOGICALDECODING)

## Chapter 49. Logical Decoding

**Table of Contents**

- [49.1. Logical Decoding Examples](logicaldecoding-example)
- [49.2. Logical Decoding Concepts](logicaldecoding-explanation)

  - [49.2.1. Logical Decoding](logicaldecoding-explanation#LOGICALDECODING-EXPLANATION-LOG-DEC)
  - [49.2.2. Replication Slots](logicaldecoding-explanation#LOGICALDECODING-REPLICATION-SLOTS)
  - [49.2.3. Output Plugins](logicaldecoding-explanation#LOGICALDECODING-EXPLANATION-OUTPUT-PLUGINS)
  - [49.2.4. Exported Snapshots](logicaldecoding-explanation#LOGICALDECODING-EXPLANATION-EXPORTED-SNAPSHOTS)

- [49.3. Streaming Replication Protocol Interface](logicaldecoding-walsender)
- [49.4. Logical Decoding SQL Interface](logicaldecoding-sql)
- [49.5. System Catalogs Related to Logical Decoding](logicaldecoding-catalogs)
- [49.6. Logical Decoding Output Plugins](logicaldecoding-output-plugin)

  - [49.6.1. Initialization Function](logicaldecoding-output-plugin#LOGICALDECODING-OUTPUT-INIT)
  - [49.6.2. Capabilities](logicaldecoding-output-plugin#LOGICALDECODING-CAPABILITIES)
  - [49.6.3. Output Modes](logicaldecoding-output-plugin#LOGICALDECODING-OUTPUT-MODE)
  - [49.6.4. Output Plugin Callbacks](logicaldecoding-output-plugin#LOGICALDECODING-OUTPUT-PLUGIN-CALLBACKS)
  - [49.6.5. Functions for Producing Output](logicaldecoding-output-plugin#LOGICALDECODING-OUTPUT-PLUGIN-OUTPUT)

- [49.7. Logical Decoding Output Writers](logicaldecoding-writer)
- [49.8. Synchronous Replication Support for Logical Decoding](logicaldecoding-synchronous)

  - [49.8.1. Overview](logicaldecoding-synchronous#LOGICALDECODING-SYNCHRONOUS-OVERVIEW)
  - [49.8.2. Caveats](logicaldecoding-synchronous#LOGICALDECODING-SYNCHRONOUS-CAVEATS)

- [49.9. Streaming of Large Transactions for Logical Decoding](logicaldecoding-streaming)
- [49.10. Two-phase Commit Support for Logical Decoding](logicaldecoding-two-phase-commits)

PostgreSQL provides infrastructure to stream the modifications performed via SQL to external consumers. This functionality can be used for a variety of purposes, including replication solutions and auditing.

Changes are sent out in streams identified by logical replication slots.

The format in which those changes are streamed is determined by the output plugin used. An example plugin is provided in the PostgreSQL distribution. Additional plugins can be written to extend the choice of available formats without modifying any core code. Every output plugin has access to each individual new row produced by `INSERT` and the new row version created by `UPDATE`. Availability of old row versions for `UPDATE` and `DELETE` depends on the configured replica identity (see [`REPLICA IDENTITY`](sql-altertable#SQL-ALTERTABLE-REPLICA-IDENTITY)).

Changes can be consumed either using the streaming replication protocol (see [Section 55.4](protocol-replication) and [Section 49.3](logicaldecoding-walsender)), or by calling functions via SQL (see [Section 49.4](logicaldecoding-sql)). It is also possible to write additional methods of consuming the output of a replication slot without modifying core code (see [Section 49.7](logicaldecoding-writer)).

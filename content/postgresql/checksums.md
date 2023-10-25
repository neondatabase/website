<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                30.2. Data Checksums               |                                                                  |                                                 |                                                       |                                                           |
| :-----------------------------------------------: | :--------------------------------------------------------------- | :---------------------------------------------: | ----------------------------------------------------: | --------------------------------------------------------: |
| [Prev](wal-reliability.html "30.1. Reliability")  | [Up](wal.html "Chapter 30. Reliability and the Write-Ahead Log") | Chapter 30. Reliability and the Write-Ahead Log | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](wal-intro.html "30.3. Write-Ahead Logging (WAL)") |

***

## 30.2. Data Checksums [#](#CHECKSUMS)

*   [30.2.1. Off-line Enabling of Checksums](checksums.html#CHECKSUMS-OFFLINE-ENABLE-DISABLE)



By default, data pages are not protected by checksums, but this can optionally be enabled for a cluster. When enabled, each data page includes a checksum that is updated when the page is written and verified each time the page is read. Only data pages are protected by checksums; internal data structures and temporary files are not.

Checksums are normally enabled when the cluster is initialized using [initdb](app-initdb.html#APP-INITDB-DATA-CHECKSUMS). They can also be enabled or disabled at a later time as an offline operation. Data checksums are enabled or disabled at the full cluster level, and cannot be specified individually for databases or tables.

The current state of checksums in the cluster can be verified by viewing the value of the read-only configuration variable [data\_checksums](runtime-config-preset.html#GUC-DATA-CHECKSUMS) by issuing the command `SHOW data_checksums`.

When attempting to recover from page corruptions, it may be necessary to bypass the checksum protection. To do this, temporarily set the configuration parameter [ignore\_checksum\_failure](runtime-config-developer.html#GUC-IGNORE-CHECKSUM-FAILURE).

### 30.2.1. Off-line Enabling of Checksums [#](#CHECKSUMS-OFFLINE-ENABLE-DISABLE)

The [pg\_checksums](app-pgchecksums.html "pg_checksums") application can be used to enable or disable data checksums, as well as verify checksums, on an offline cluster.

***

|                                                   |                                                                  |                                                           |
| :------------------------------------------------ | :--------------------------------------------------------------: | --------------------------------------------------------: |
| [Prev](wal-reliability.html "30.1. Reliability")  | [Up](wal.html "Chapter 30. Reliability and the Write-Ahead Log") |  [Next](wal-intro.html "30.3. Write-Ahead Logging (WAL)") |
| 30.1. Reliability                                 |       [Home](index.html "PostgreSQL 17devel Documentation")      |                           30.3. Write-Ahead Logging (WAL) |

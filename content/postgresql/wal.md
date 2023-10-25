<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|  Chapter 30. Reliability and the Write-Ahead Log  |                                                    |                                 |                                                       |                                                   |
| :-----------------------------------------------: | :------------------------------------------------- | :-----------------------------: | ----------------------------------------------------: | ------------------------------------------------: |
| [Prev](disk-full.html "29.2. Disk Full Failure")  | [Up](admin.html "Part III. Server Administration") | Part III. Server Administration | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](wal-reliability.html "30.1. Reliability") |

***

## Chapter 30. Reliability and the Write-Ahead Log

**Table of Contents**

  * *   [30.1. Reliability](wal-reliability.html)
  * [30.2. Data Checksums](checksums.html)

    <!---->

  * [30.2.1. Off-line Enabling of Checksums](checksums.html#CHECKSUMS-OFFLINE-ENABLE-DISABLE)

  * *   [30.3. Write-Ahead Logging (WAL)](wal-intro.html)
  * [30.4. Asynchronous Commit](wal-async-commit.html)
  * [30.5. WAL Configuration](wal-configuration.html)
  * [30.6. WAL Internals](wal-internals.html)

This chapter explains how to control the reliability of PostgreSQL, including details about the Write-Ahead Log.

***

|                                                   |                                                       |                                                   |
| :------------------------------------------------ | :---------------------------------------------------: | ------------------------------------------------: |
| [Prev](disk-full.html "29.2. Disk Full Failure")  |   [Up](admin.html "Part III. Server Administration")  |  [Next](wal-reliability.html "30.1. Reliability") |
| 29.2. Disk Full Failure                           | [Home](index.html "PostgreSQL 17devel Documentation") |                                 30.1. Reliability |

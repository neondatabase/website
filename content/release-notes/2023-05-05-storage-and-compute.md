---
label: 'Storage'
---

### What's new

- Pageserver: Added WAL receiver context information for `Timed out while waiting for WAL record` errors. The additional information is used for diagnostic purposes.
- Safekeeper, Pageserver: Added Safekeeper and Pageserver metrics that count the number of received queries, broker messages, removed WAL segments, and connection switch events.

### Bug fixes

- Safekeeper: When establishing a connection to a Safekeeper, an `Lsn::INVALID` value was sent from the Safekeeper to the Pageserver if there were no WAL records to send. This incorrectly indicated to the Pageserver that the Safekeeper was lagging behind, causing the Pageserver to connect to a different Safekeeper. Instead of `Lsn::INVALID`, the most recent `commit_lsn` value is now sent instead.

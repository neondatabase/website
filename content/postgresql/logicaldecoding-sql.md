## 49.4. Logical Decoding SQL Interface [#](#LOGICALDECODING-SQL)

See [Section 9.27.6](functions-admin#FUNCTIONS-REPLICATION "9.27.6. Replication Management Functions") for detailed documentation on the SQL-level API for interacting with logical decoding.

Synchronous replication (see [Section 27.2.8](warm-standby#SYNCHRONOUS-REPLICATION "27.2.8. Synchronous Replication")) is only supported on replication slots used over the streaming replication interface. The function interface and additional, non-core interfaces do not support synchronous replication.
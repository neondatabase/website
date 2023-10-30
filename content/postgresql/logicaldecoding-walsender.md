## 49.3. Streaming Replication Protocol Interface [#](#LOGICALDECODING-WALSENDER)

The commands

* `CREATE_REPLICATION_SLOT slot_name LOGICAL output_plugin`
* `DROP_REPLICATION_SLOT slot_name` \[ `WAIT` ]
* `START_REPLICATION SLOT slot_name LOGICAL ...`

are used to create, drop, and stream changes from a replication slot, respectively. These commands are only available over a replication connection; they cannot be used via SQL. See [Section 55.4](protocol-replication.html "55.4. Streaming Replication Protocol") for details on these commands.

The command [pg\_recvlogical](app-pgrecvlogical.html "pg_recvlogical") can be used to control logical decoding over a streaming replication connection. (It uses these commands internally.)
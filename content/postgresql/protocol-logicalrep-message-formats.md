[#id](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS)

## 55.9. Logical Replication Message Formats [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS)

This section describes the detailed format of each logical replication message. These messages are either returned by the replication slot SQL interface or are sent by a walsender. In the case of a walsender, they are encapsulated inside replication protocol WAL messages as described in [Section 55.4](protocol-replication), and generally obey the same message flow as physical replication.

- Begin [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-BEGIN)

  - Byte1('B')

    Identifies the message as a begin message.

  - Int64 (XLogRecPtr)

    The final LSN of the transaction.

  - Int64 (TimestampTz)

    Commit timestamp of the transaction. The value is in number of microseconds since PostgreSQL epoch (2000-01-01).

  - Int32 (TransactionId)

    Xid of the transaction.

- Message [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-MESSAGE)

  - Byte1('M')

    Identifies the message as a logical decoding message.

  - Int32 (TransactionId)

    Xid of the transaction (only present for streamed transactions). This field is available since protocol version 2.

  - Int8

    Flags; Either 0 for no flags or 1 if the logical decoding message is transactional.

  - Int64 (XLogRecPtr)

    The LSN of the logical decoding message.

  - String

    The prefix of the logical decoding message.

  - Int32

    Length of the content.

  - Byte*`n`*

    The content of the logical decoding message.

- Commit [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-COMMIT)

  - Byte1('C')

    Identifies the message as a commit message.

  - Int8(0)

    Flags; currently unused.

  - Int64 (XLogRecPtr)

    The LSN of the commit.

  - Int64 (XLogRecPtr)

    The end LSN of the transaction.

  - Int64 (TimestampTz)

    Commit timestamp of the transaction. The value is in number of microseconds since PostgreSQL epoch (2000-01-01).

- Origin [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-ORIGIN)

  - Byte1('O')

    Identifies the message as an origin message.

  - Int64 (XLogRecPtr)

    The LSN of the commit on the origin server.

  - String

    Name of the origin.

  Note that there can be multiple Origin messages inside a single transaction.

- Relation [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-RELATION)

  - Byte1('R')

    Identifies the message as a relation message.

  - Int32 (TransactionId)

    Xid of the transaction (only present for streamed transactions). This field is available since protocol version 2.

  - Int32 (Oid)

    OID of the relation.

  - String

    Namespace (empty string for `pg_catalog`).

  - String

    Relation name.

  - Int8

    Replica identity setting for the relation (same as `relreplident` in `pg_class`).

  - Int16

    Number of columns.

  Next, the following message part appears for each column included in the publication (except generated columns):

  - Int8

    Flags for the column. Currently can be either 0 for no flags or 1 which marks the column as part of the key.

  - String

    Name of the column.

  - Int32 (Oid)

    OID of the column's data type.

  - Int32

    Type modifier of the column (`atttypmod`).

- Type [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-TYPE)

  - Byte1('Y')

    Identifies the message as a type message.

  - Int32 (TransactionId)

    Xid of the transaction (only present for streamed transactions). This field is available since protocol version 2.

  - Int32 (Oid)

    OID of the data type.

  - String

    Namespace (empty string for `pg_catalog`).

  - String

    Name of the data type.

- Insert [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-INSERT)

  - Byte1('I')

    Identifies the message as an insert message.

  - Int32 (TransactionId)

    Xid of the transaction (only present for streamed transactions). This field is available since protocol version 2.

  - Int32 (Oid)

    OID of the relation corresponding to the ID in the relation message.

  - Byte1('N')

    Identifies the following TupleData message as a new tuple.

  - TupleData

    TupleData message part representing the contents of new tuple.

- Update [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-UPDATE)

  - Byte1('U')

    Identifies the message as an update message.

  - Int32 (TransactionId)

    Xid of the transaction (only present for streamed transactions). This field is available since protocol version 2.

  - Int32 (Oid)

    OID of the relation corresponding to the ID in the relation message.

  - Byte1('K')

    Identifies the following TupleData submessage as a key. This field is optional and is only present if the update changed data in any of the column(s) that are part of the REPLICA IDENTITY index.

  - Byte1('O')

    Identifies the following TupleData submessage as an old tuple. This field is optional and is only present if table in which the update happened has REPLICA IDENTITY set to FULL.

  - TupleData

    TupleData message part representing the contents of the old tuple or primary key. Only present if the previous 'O' or 'K' part is present.

  - Byte1('N')

    Identifies the following TupleData message as a new tuple.

  - TupleData

    TupleData message part representing the contents of a new tuple.

  The Update message may contain either a 'K' message part or an 'O' message part or neither of them, but never both of them.

- Delete [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-DELETE)

  - Byte1('D')

    Identifies the message as a delete message.

  - Int32 (TransactionId)

    Xid of the transaction (only present for streamed transactions). This field is available since protocol version 2.

  - Int32 (Oid)

    OID of the relation corresponding to the ID in the relation message.

  - Byte1('K')

    Identifies the following TupleData submessage as a key. This field is present if the table in which the delete has happened uses an index as REPLICA IDENTITY.

  - Byte1('O')

    Identifies the following TupleData message as an old tuple. This field is present if the table in which the delete happened has REPLICA IDENTITY set to FULL.

  - TupleData

    TupleData message part representing the contents of the old tuple or primary key, depending on the previous field.

  The Delete message may contain either a 'K' message part or an 'O' message part, but never both of them.

- Truncate [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-TRUNCATE)

  - Byte1('T')

    Identifies the message as a truncate message.

  - Int32 (TransactionId)

    Xid of the transaction (only present for streamed transactions). This field is available since protocol version 2.

  - Int32

    Number of relations

  - Int8

    Option bits for `TRUNCATE`: 1 for `CASCADE`, 2 for `RESTART IDENTITY`

  - Int32 (Oid)

    OID of the relation corresponding to the ID in the relation message. This field is repeated for each relation.

The following messages (Stream Start, Stream Stop, Stream Commit, and Stream Abort) are available since protocol version 2.

- Stream Start [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-STREAM-START)

  - Byte1('S')

    Identifies the message as a stream start message.

  - Int32 (TransactionId)

    Xid of the transaction.

  - Int8

    A value of 1 indicates this is the first stream segment for this XID, 0 for any other stream segment.

- Stream Stop [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-STREAM-STOP)

  - Byte1('E')

    Identifies the message as a stream stop message.

- Stream Commit [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-STREAM-COMMIT)

  - Byte1('c')

    Identifies the message as a stream commit message.

  - Int32 (TransactionId)

    Xid of the transaction.

  - Int8(0)

    Flags; currently unused.

  - Int64 (XLogRecPtr)

    The LSN of the commit.

  - Int64 (XLogRecPtr)

    The end LSN of the transaction.

  - Int64 (TimestampTz)

    Commit timestamp of the transaction. The value is in number of microseconds since PostgreSQL epoch (2000-01-01).

- Stream Abort [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-STREAM-ABORT)

  - Byte1('A')

    Identifies the message as a stream abort message.

  - Int32 (TransactionId)

    Xid of the transaction.

  - Int32 (TransactionId)

    Xid of the subtransaction (will be same as xid of the transaction for top-level transactions).

  - Int64 (XLogRecPtr)

    The LSN of the abort. This field is available since protocol version 4.

  - Int64 (TimestampTz)

    Abort timestamp of the transaction. The value is in number of microseconds since PostgreSQL epoch (2000-01-01). This field is available since protocol version 4.

The following messages (Begin Prepare, Prepare, Commit Prepared, Rollback Prepared, Stream Prepare) are available since protocol version 3.

- Begin Prepare [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-BEGIN-PREPARE)

  - Byte1('b')

    Identifies the message as the beginning of a prepared transaction message.

  - Int64 (XLogRecPtr)

    The LSN of the prepare.

  - Int64 (XLogRecPtr)

    The end LSN of the prepared transaction.

  - Int64 (TimestampTz)

    Prepare timestamp of the transaction. The value is in number of microseconds since PostgreSQL epoch (2000-01-01).

  - Int32 (TransactionId)

    Xid of the transaction.

  - String

    The user defined GID of the prepared transaction.

- Prepare [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-PREPARE)

  - Byte1('P')

    Identifies the message as a prepared transaction message.

  - Int8(0)

    Flags; currently unused.

  - Int64 (XLogRecPtr)

    The LSN of the prepare.

  - Int64 (XLogRecPtr)

    The end LSN of the prepared transaction.

  - Int64 (TimestampTz)

    Prepare timestamp of the transaction. The value is in number of microseconds since PostgreSQL epoch (2000-01-01).

  - Int32 (TransactionId)

    Xid of the transaction.

  - String

    The user defined GID of the prepared transaction.

- Commit Prepared [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-COMMIT-PREPARED)

  - Byte1('K')

    Identifies the message as the commit of a prepared transaction message.

  - Int8(0)

    Flags; currently unused.

  - Int64 (XLogRecPtr)

    The LSN of the commit of the prepared transaction.

  - Int64 (XLogRecPtr)

    The end LSN of the commit of the prepared transaction.

  - Int64 (TimestampTz)

    Commit timestamp of the transaction. The value is in number of microseconds since PostgreSQL epoch (2000-01-01).

  - Int32 (TransactionId)

    Xid of the transaction.

  - String

    The user defined GID of the prepared transaction.

- Rollback Prepared [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-ROLLBACK-PREPARED)

  - Byte1('r')

    Identifies the message as the rollback of a prepared transaction message.

  - Int8(0)

    Flags; currently unused.

  - Int64 (XLogRecPtr)

    The end LSN of the prepared transaction.

  - Int64 (XLogRecPtr)

    The end LSN of the rollback of the prepared transaction.

  - Int64 (TimestampTz)

    Prepare timestamp of the transaction. The value is in number of microseconds since PostgreSQL epoch (2000-01-01).

  - Int64 (TimestampTz)

    Rollback timestamp of the transaction. The value is in number of microseconds since PostgreSQL epoch (2000-01-01).

  - Int32 (TransactionId)

    Xid of the transaction.

  - String

    The user defined GID of the prepared transaction.

- Stream Prepare [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-STREAM-PREPARE)

  - Byte1('p')

    Identifies the message as a stream prepared transaction message.

  - Int8(0)

    Flags; currently unused.

  - Int64 (XLogRecPtr)

    The LSN of the prepare.

  - Int64 (XLogRecPtr)

    The end LSN of the prepared transaction.

  - Int64 (TimestampTz)

    Prepare timestamp of the transaction. The value is in number of microseconds since PostgreSQL epoch (2000-01-01).

  - Int32 (TransactionId)

    Xid of the transaction.

  - String

    The user defined GID of the prepared transaction.

The following message parts are shared by the above messages.

- TupleData [#](#PROTOCOL-LOGICALREP-MESSAGE-FORMATS-TUPLEDATA)

  - Int16

    Number of columns.

  Next, one of the following submessages appears for each column (except generated columns):

  - Byte1('n')

    Identifies the data as NULL value.

  Or

  - Byte1('u')

    Identifies unchanged TOASTed value (the actual value is not sent).

  Or

  - Byte1('t')

    Identifies the data as text formatted value.

  Or

  - Byte1('b')

    Identifies the data as binary formatted value.

  - Int32

    Length of the column value.

  - Byte*`n`*

    The value of the column, either in binary or in text format. (As specified in the preceding format byte). _`n`_ is the above length.

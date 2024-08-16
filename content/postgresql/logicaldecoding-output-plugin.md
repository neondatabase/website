[#id](#LOGICALDECODING-OUTPUT-PLUGIN)

## 49.6. Logical Decoding Output Plugins [#](#LOGICALDECODING-OUTPUT-PLUGIN)

- [49.6.1. Initialization Function](logicaldecoding-output-plugin#LOGICALDECODING-OUTPUT-INIT)
- [49.6.2. Capabilities](logicaldecoding-output-plugin#LOGICALDECODING-CAPABILITIES)
- [49.6.3. Output Modes](logicaldecoding-output-plugin#LOGICALDECODING-OUTPUT-MODE)
- [49.6.4. Output Plugin Callbacks](logicaldecoding-output-plugin#LOGICALDECODING-OUTPUT-PLUGIN-CALLBACKS)
- [49.6.5. Functions for Producing Output](logicaldecoding-output-plugin#LOGICALDECODING-OUTPUT-PLUGIN-OUTPUT)

An example output plugin can be found in the [`contrib/test_decoding` ](test-decoding)subdirectory of the PostgreSQL source tree.

[#id](#LOGICALDECODING-OUTPUT-INIT)

### 49.6.1. Initialization Function [#](#LOGICALDECODING-OUTPUT-INIT)

An output plugin is loaded by dynamically loading a shared library with the output plugin's name as the library base name. The normal library search path is used to locate the library. To provide the required output plugin callbacks and to indicate that the library is actually an output plugin it needs to provide a function named `_PG_output_plugin_init`. This function is passed a struct that needs to be filled with the callback function pointers for individual actions.

```
typedef struct OutputPluginCallbacks
{
    LogicalDecodeStartupCB startup_cb;
    LogicalDecodeBeginCB begin_cb;
    LogicalDecodeChangeCB change_cb;
    LogicalDecodeTruncateCB truncate_cb;
    LogicalDecodeCommitCB commit_cb;
    LogicalDecodeMessageCB message_cb;
    LogicalDecodeFilterByOriginCB filter_by_origin_cb;
    LogicalDecodeShutdownCB shutdown_cb;
    LogicalDecodeFilterPrepareCB filter_prepare_cb;
    LogicalDecodeBeginPrepareCB begin_prepare_cb;
    LogicalDecodePrepareCB prepare_cb;
    LogicalDecodeCommitPreparedCB commit_prepared_cb;
    LogicalDecodeRollbackPreparedCB rollback_prepared_cb;
    LogicalDecodeStreamStartCB stream_start_cb;
    LogicalDecodeStreamStopCB stream_stop_cb;
    LogicalDecodeStreamAbortCB stream_abort_cb;
    LogicalDecodeStreamPrepareCB stream_prepare_cb;
    LogicalDecodeStreamCommitCB stream_commit_cb;
    LogicalDecodeStreamChangeCB stream_change_cb;
    LogicalDecodeStreamMessageCB stream_message_cb;
    LogicalDecodeStreamTruncateCB stream_truncate_cb;
} OutputPluginCallbacks;

typedef void (*LogicalOutputPluginInit) (struct OutputPluginCallbacks *cb);
```

The `begin_cb`, `change_cb` and `commit_cb` callbacks are required, while `startup_cb`, `truncate_cb`, `message_cb`, `filter_by_origin_cb`, and `shutdown_cb` are optional. If `truncate_cb` is not set but a `TRUNCATE` is to be decoded, the action will be ignored.

An output plugin may also define functions to support streaming of large, in-progress transactions. The `stream_start_cb`, `stream_stop_cb`, `stream_abort_cb`, `stream_commit_cb`, and `stream_change_cb` are required, while `stream_message_cb` and `stream_truncate_cb` are optional. The `stream_prepare_cb` is also required if the output plugin also support two-phase commits.

An output plugin may also define functions to support two-phase commits, which allows actions to be decoded on the `PREPARE TRANSACTION`. The `begin_prepare_cb`, `prepare_cb`, `commit_prepared_cb` and `rollback_prepared_cb` callbacks are required, while `filter_prepare_cb` is optional. The `stream_prepare_cb` is also required if the output plugin also supports the streaming of large in-progress transactions.

[#id](#LOGICALDECODING-CAPABILITIES)

### 49.6.2. Capabilities [#](#LOGICALDECODING-CAPABILITIES)

To decode, format and output changes, output plugins can use most of the backend's normal infrastructure, including calling output functions. Read only access to relations is permitted as long as only relations are accessed that either have been created by `initdb` in the `pg_catalog` schema, or have been marked as user provided catalog tables using

```
ALTER TABLE user_catalog_table SET (user_catalog_table = true);
CREATE TABLE another_catalog_table(data text) WITH (user_catalog_table = true);
```

Note that access to user catalog tables or regular system catalog tables in the output plugins has to be done via the `systable_*` scan APIs only. Access via the `heap_*` scan APIs will error out. Additionally, any actions leading to transaction ID assignment are prohibited. That, among others, includes writing to tables, performing DDL changes, and calling `pg_current_xact_id()`.

[#id](#LOGICALDECODING-OUTPUT-MODE)

### 49.6.3. Output Modes [#](#LOGICALDECODING-OUTPUT-MODE)

Output plugin callbacks can pass data to the consumer in nearly arbitrary formats. For some use cases, like viewing the changes via SQL, returning data in a data type that can contain arbitrary data (e.g., `bytea`) is cumbersome. If the output plugin only outputs textual data in the server's encoding, it can declare that by setting `OutputPluginOptions.output_type` to `OUTPUT_PLUGIN_TEXTUAL_OUTPUT` instead of `OUTPUT_PLUGIN_BINARY_OUTPUT` in the [startup callback](logicaldecoding-output-plugin#LOGICALDECODING-OUTPUT-PLUGIN-STARTUP). In that case, all the data has to be in the server's encoding so that a `text` datum can contain it. This is checked in assertion-enabled builds.

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-CALLBACKS)

### 49.6.4. Output Plugin Callbacks [#](#LOGICALDECODING-OUTPUT-PLUGIN-CALLBACKS)

An output plugin gets notified about changes that are happening via various callbacks it needs to provide.

Concurrent transactions are decoded in commit order, and only changes belonging to a specific transaction are decoded between the `begin` and `commit` callbacks. Transactions that were rolled back explicitly or implicitly never get decoded. Successful savepoints are folded into the transaction containing them in the order they were executed within that transaction. A transaction that is prepared for a two-phase commit using `PREPARE TRANSACTION` will also be decoded if the output plugin callbacks needed for decoding them are provided. It is possible that the current prepared transaction which is being decoded is aborted concurrently via a `ROLLBACK PREPARED` command. In that case, the logical decoding of this transaction will be aborted too. All the changes of such a transaction are skipped once the abort is detected and the `prepare_cb` callback is invoked. Thus even in case of a concurrent abort, enough information is provided to the output plugin for it to properly deal with `ROLLBACK PREPARED` once that is decoded.

### Note

Only transactions that have already safely been flushed to disk will be decoded. That can lead to a `COMMIT` not immediately being decoded in a directly following `pg_logical_slot_get_changes()` when `synchronous_commit` is set to `off`.

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-STARTUP)

#### 49.6.4.1. Startup Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-STARTUP)

The optional `startup_cb` callback is called whenever a replication slot is created or asked to stream changes, independent of the number of changes that are ready to be put out.

```
typedef void (*LogicalDecodeStartupCB) (struct LogicalDecodingContext *ctx,
                                        OutputPluginOptions *options,
                                        bool is_init);
```

The `is_init` parameter will be true when the replication slot is being created and false otherwise. _`options`_ points to a struct of options that output plugins can set:

```
typedef struct OutputPluginOptions
{
    OutputPluginOutputType output_type;
    bool        receive_rewrites;
} OutputPluginOptions;
```

`output_type` has to either be set to `OUTPUT_PLUGIN_TEXTUAL_OUTPUT` or `OUTPUT_PLUGIN_BINARY_OUTPUT`. See also [Section 49.6.3](logicaldecoding-output-plugin#LOGICALDECODING-OUTPUT-MODE). If `receive_rewrites` is true, the output plugin will also be called for changes made by heap rewrites during certain DDL operations. These are of interest to plugins that handle DDL replication, but they require special handling.

The startup callback should validate the options present in `ctx->output_plugin_options`. If the output plugin needs to have a state, it can use `ctx->output_plugin_private` to store it.

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-SHUTDOWN)

#### 49.6.4.2. Shutdown Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-SHUTDOWN)

The optional `shutdown_cb` callback is called whenever a formerly active replication slot is not used anymore and can be used to deallocate resources private to the output plugin. The slot isn't necessarily being dropped, streaming is just being stopped.

```
typedef void (*LogicalDecodeShutdownCB) (struct LogicalDecodingContext *ctx);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-BEGIN)

#### 49.6.4.3. Transaction Begin Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-BEGIN)

The required `begin_cb` callback is called whenever a start of a committed transaction has been decoded. Aborted transactions and their contents never get decoded.

```
typedef void (*LogicalDecodeBeginCB) (struct LogicalDecodingContext *ctx,
                                      ReorderBufferTXN *txn);
```

The _`txn`_ parameter contains meta information about the transaction, like the time stamp at which it has been committed and its XID.

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-COMMIT)

#### 49.6.4.4. Transaction End Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-COMMIT)

The required `commit_cb` callback is called whenever a transaction commit has been decoded. The `change_cb` callbacks for all modified rows will have been called before this, if there have been any modified rows.

```
typedef void (*LogicalDecodeCommitCB) (struct LogicalDecodingContext *ctx,
                                       ReorderBufferTXN *txn,
                                       XLogRecPtr commit_lsn);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-CHANGE)

#### 49.6.4.5. Change Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-CHANGE)

The required `change_cb` callback is called for every individual row modification inside a transaction, may it be an `INSERT`, `UPDATE`, or `DELETE`. Even if the original command modified several rows at once the callback will be called individually for each row. The `change_cb` callback may access system or user catalog tables to aid in the process of outputting the row modification details. In case of decoding a prepared (but yet uncommitted) transaction or decoding of an uncommitted transaction, this change callback might also error out due to simultaneous rollback of this very same transaction. In that case, the logical decoding of this aborted transaction is stopped gracefully.

```
typedef void (*LogicalDecodeChangeCB) (struct LogicalDecodingContext *ctx,
                                       ReorderBufferTXN *txn,
                                       Relation relation,
                                       ReorderBufferChange *change);
```

The _`ctx`_ and _`txn`_ parameters have the same contents as for the `begin_cb` and `commit_cb` callbacks, but additionally the relation descriptor _`relation`_ points to the relation the row belongs to and a struct _`change`_ describing the row modification are passed in.

### Note

Only changes in user defined tables that are not unlogged (see [`UNLOGGED`](sql-createtable#SQL-CREATETABLE-UNLOGGED)) and not temporary (see [`TEMPORARY` or `TEMP`](sql-createtable#SQL-CREATETABLE-TEMPORARY)) can be extracted using logical decoding.

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-TRUNCATE)

#### 49.6.4.6. Truncate Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-TRUNCATE)

The optional `truncate_cb` callback is called for a `TRUNCATE` command.

```
typedef void (*LogicalDecodeTruncateCB) (struct LogicalDecodingContext *ctx,
                                         ReorderBufferTXN *txn,
                                         int nrelations,
                                         Relation relations[],
                                         ReorderBufferChange *change);
```

The parameters are analogous to the `change_cb` callback. However, because `TRUNCATE` actions on tables connected by foreign keys need to be executed together, this callback receives an array of relations instead of just a single one. See the description of the [TRUNCATE](sql-truncate) statement for details.

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-FILTER-ORIGIN)

#### 49.6.4.7. Origin Filter Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-FILTER-ORIGIN)

The optional `filter_by_origin_cb` callback is called to determine whether data that has been replayed from _`origin_id`_ is of interest to the output plugin.

```
typedef bool (*LogicalDecodeFilterByOriginCB) (struct LogicalDecodingContext *ctx,
                                               RepOriginId origin_id);
```

The _`ctx`_ parameter has the same contents as for the other callbacks. No information but the origin is available. To signal that changes originating on the passed in node are irrelevant, return true, causing them to be filtered away; false otherwise. The other callbacks will not be called for transactions and changes that have been filtered away.

This is useful when implementing cascading or multidirectional replication solutions. Filtering by the origin allows to prevent replicating the same changes back and forth in such setups. While transactions and changes also carry information about the origin, filtering via this callback is noticeably more efficient.

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-MESSAGE)

#### 49.6.4.8. Generic Message Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-MESSAGE)

The optional `message_cb` callback is called whenever a logical decoding message has been decoded.

```
typedef void (*LogicalDecodeMessageCB) (struct LogicalDecodingContext *ctx,
                                        ReorderBufferTXN *txn,
                                        XLogRecPtr message_lsn,
                                        bool transactional,
                                        const char *prefix,
                                        Size message_size,
                                        const char *message);
```

The _`txn`_ parameter contains meta information about the transaction, like the time stamp at which it has been committed and its XID. Note however that it can be NULL when the message is non-transactional and the XID was not assigned yet in the transaction which logged the message. The _`lsn`_ has WAL location of the message. The _`transactional`_ says if the message was sent as transactional or not. Similar to the change callback, in case of decoding a prepared (but yet uncommitted) transaction or decoding of an uncommitted transaction, this message callback might also error out due to simultaneous rollback of this very same transaction. In that case, the logical decoding of this aborted transaction is stopped gracefully. The _`prefix`_ is arbitrary null-terminated prefix which can be used for identifying interesting messages for the current plugin. And finally the _`message`_ parameter holds the actual message of _`message_size`_ size.

Extra care should be taken to ensure that the prefix the output plugin considers interesting is unique. Using name of the extension or the output plugin itself is often a good choice.

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-FILTER-PREPARE)

#### 49.6.4.9. Prepare Filter Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-FILTER-PREPARE)

The optional `filter_prepare_cb` callback is called to determine whether data that is part of the current two-phase commit transaction should be considered for decoding at this prepare stage or later as a regular one-phase transaction at `COMMIT PREPARED` time. To signal that decoding should be skipped, return `true`; `false` otherwise. When the callback is not defined, `false` is assumed (i.e. no filtering, all transactions using two-phase commit are decoded in two phases as well).

```
typedef bool (*LogicalDecodeFilterPrepareCB) (struct LogicalDecodingContext *ctx,
                                              TransactionId xid,
                                              const char *gid);
```

The _`ctx`_ parameter has the same contents as for the other callbacks. The parameters _`xid`_ and _`gid`_ provide two different ways to identify the transaction. The later `COMMIT PREPARED` or `ROLLBACK PREPARED` carries both identifiers, providing an output plugin the choice of what to use.

The callback may be invoked multiple times per transaction to decode and must provide the same static answer for a given pair of _`xid`_ and _`gid`_ every time it is called.

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-BEGIN-PREPARE)

#### 49.6.4.10. Transaction Begin Prepare Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-BEGIN-PREPARE)

The required `begin_prepare_cb` callback is called whenever the start of a prepared transaction has been decoded. The _`gid`_ field, which is part of the _`txn`_ parameter, can be used in this callback to check if the plugin has already received this `PREPARE` in which case it can either error out or skip the remaining changes of the transaction.

```
typedef void (*LogicalDecodeBeginPrepareCB) (struct LogicalDecodingContext *ctx,
                                             ReorderBufferTXN *txn);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-PREPARE)

#### 49.6.4.11. Transaction Prepare Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-PREPARE)

The required `prepare_cb` callback is called whenever a transaction which is prepared for two-phase commit has been decoded. The `change_cb` callback for all modified rows will have been called before this, if there have been any modified rows. The _`gid`_ field, which is part of the _`txn`_ parameter, can be used in this callback.

```
typedef void (*LogicalDecodePrepareCB) (struct LogicalDecodingContext *ctx,
                                        ReorderBufferTXN *txn,
                                        XLogRecPtr prepare_lsn);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-COMMIT-PREPARED)

#### 49.6.4.12. Transaction Commit Prepared Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-COMMIT-PREPARED)

The required `commit_prepared_cb` callback is called whenever a transaction `COMMIT PREPARED` has been decoded. The _`gid`_ field, which is part of the _`txn`_ parameter, can be used in this callback.

```
typedef void (*LogicalDecodeCommitPreparedCB) (struct LogicalDecodingContext *ctx,
                                               ReorderBufferTXN *txn,
                                               XLogRecPtr commit_lsn);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-ROLLBACK-PREPARED)

#### 49.6.4.13. Transaction Rollback Prepared Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-ROLLBACK-PREPARED)

The required `rollback_prepared_cb` callback is called whenever a transaction `ROLLBACK PREPARED` has been decoded. The _`gid`_ field, which is part of the _`txn`_ parameter, can be used in this callback. The parameters _`prepare_end_lsn`_ and _`prepare_time`_ can be used to check if the plugin has received this `PREPARE TRANSACTION` in which case it can apply the rollback, otherwise, it can skip the rollback operation. The _`gid`_ alone is not sufficient because the downstream node can have a prepared transaction with same identifier.

```
typedef void (*LogicalDecodeRollbackPreparedCB) (struct LogicalDecodingContext *ctx,
                                                 ReorderBufferTXN *txn,
                                                 XLogRecPtr prepare_end_lsn,
                                                 TimestampTz prepare_time);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-START)

#### 49.6.4.14. Stream Start Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-START)

The required `stream_start_cb` callback is called when opening a block of streamed changes from an in-progress transaction.

```
typedef void (*LogicalDecodeStreamStartCB) (struct LogicalDecodingContext *ctx,
                                            ReorderBufferTXN *txn);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-STOP)

#### 49.6.4.15. Stream Stop Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-STOP)

The required `stream_stop_cb` callback is called when closing a block of streamed changes from an in-progress transaction.

```
typedef void (*LogicalDecodeStreamStopCB) (struct LogicalDecodingContext *ctx,
                                           ReorderBufferTXN *txn);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-ABORT)

#### 49.6.4.16. Stream Abort Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-ABORT)

The required `stream_abort_cb` callback is called to abort a previously streamed transaction.

```
typedef void (*LogicalDecodeStreamAbortCB) (struct LogicalDecodingContext *ctx,
                                            ReorderBufferTXN *txn,
                                            XLogRecPtr abort_lsn);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-PREPARE)

#### 49.6.4.17. Stream Prepare Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-PREPARE)

The `stream_prepare_cb` callback is called to prepare a previously streamed transaction as part of a two-phase commit. This callback is required when the output plugin supports both the streaming of large in-progress transactions and two-phase commits.

```
typedef void (*LogicalDecodeStreamPrepareCB) (struct LogicalDecodingContext *ctx,
                                              ReorderBufferTXN *txn,
                                              XLogRecPtr prepare_lsn);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-COMMIT)

#### 49.6.4.18. Stream Commit Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-COMMIT)

The required `stream_commit_cb` callback is called to commit a previously streamed transaction.

```
typedef void (*LogicalDecodeStreamCommitCB) (struct LogicalDecodingContext *ctx,
                                             ReorderBufferTXN *txn,
                                             XLogRecPtr commit_lsn);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-CHANGE)

#### 49.6.4.19. Stream Change Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-CHANGE)

The required `stream_change_cb` callback is called when sending a change in a block of streamed changes (demarcated by `stream_start_cb` and `stream_stop_cb` calls). The actual changes are not displayed as the transaction can abort at a later point in time and we don't decode changes for aborted transactions.

```
typedef void (*LogicalDecodeStreamChangeCB) (struct LogicalDecodingContext *ctx,
                                             ReorderBufferTXN *txn,
                                             Relation relation,
                                             ReorderBufferChange *change);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-MESSAGE)

#### 49.6.4.20. Stream Message Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-MESSAGE)

The optional `stream_message_cb` callback is called when sending a generic message in a block of streamed changes (demarcated by `stream_start_cb` and `stream_stop_cb` calls). The message contents for transactional messages are not displayed as the transaction can abort at a later point in time and we don't decode changes for aborted transactions.

```
typedef void (*LogicalDecodeStreamMessageCB) (struct LogicalDecodingContext *ctx,
                                              ReorderBufferTXN *txn,
                                              XLogRecPtr message_lsn,
                                              bool transactional,
                                              const char *prefix,
                                              Size message_size,
                                              const char *message);
```

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-TRUNCATE)

#### 49.6.4.21. Stream Truncate Callback [#](#LOGICALDECODING-OUTPUT-PLUGIN-STREAM-TRUNCATE)

The optional `stream_truncate_cb` callback is called for a `TRUNCATE` command in a block of streamed changes (demarcated by `stream_start_cb` and `stream_stop_cb` calls).

```
typedef void (*LogicalDecodeStreamTruncateCB) (struct LogicalDecodingContext *ctx,
                                               ReorderBufferTXN *txn,
                                               int nrelations,
                                               Relation relations[],
                                               ReorderBufferChange *change);
```

The parameters are analogous to the `stream_change_cb` callback. However, because `TRUNCATE` actions on tables connected by foreign keys need to be executed together, this callback receives an array of relations instead of just a single one. See the description of the [TRUNCATE](sql-truncate) statement for details.

[#id](#LOGICALDECODING-OUTPUT-PLUGIN-OUTPUT)

### 49.6.5. Functions for Producing Output [#](#LOGICALDECODING-OUTPUT-PLUGIN-OUTPUT)

To actually produce output, output plugins can write data to the `StringInfo` output buffer in `ctx->out` when inside the `begin_cb`, `commit_cb`, or `change_cb` callbacks. Before writing to the output buffer, `OutputPluginPrepareWrite(ctx, last_write)` has to be called, and after finishing writing to the buffer, `OutputPluginWrite(ctx, last_write)` has to be called to perform the write. The _`last_write`_ indicates whether a particular write was the callback's last write.

The following example shows how to output data to the consumer of an output plugin:

```
OutputPluginPrepareWrite(ctx, true);
appendStringInfo(ctx->out, "BEGIN %u", txn->xid);
OutputPluginWrite(ctx, true);
```

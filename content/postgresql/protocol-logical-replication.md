[#id](#PROTOCOL-LOGICAL-REPLICATION)

## 55.5. Logical Streaming Replication Protocol [#](#PROTOCOL-LOGICAL-REPLICATION)

- [55.5.1. Logical Streaming Replication Parameters](protocol-logical-replication#PROTOCOL-LOGICAL-REPLICATION-PARAMS)
- [55.5.2. Logical Replication Protocol Messages](protocol-logical-replication#PROTOCOL-LOGICAL-MESSAGES)
- [55.5.3. Logical Replication Protocol Message Flow](protocol-logical-replication#PROTOCOL-LOGICAL-MESSAGES-FLOW)

This section describes the logical replication protocol, which is the message flow started by the `START_REPLICATION` `SLOT` _`slot_name`_ `LOGICAL` replication command.

The logical streaming replication protocol builds on the primitives of the physical streaming replication protocol.

[#id](#PROTOCOL-LOGICAL-REPLICATION-PARAMS)

### 55.5.1. Logical Streaming Replication Parameters [#](#PROTOCOL-LOGICAL-REPLICATION-PARAMS)

The logical replication `START_REPLICATION` command accepts following parameters:

- proto_version

  Protocol version. Currently versions `1`, `2`, `3`, and `4` are supported.

  Version `2` is supported only for server version 14 and above, and it allows streaming of large in-progress transactions.

  Version `3` is supported only for server version 15 and above, and it allows streaming of two-phase commits.

  Version `4` is supported only for server version 16 and above, and it allows streams of large in-progress transactions to be applied in parallel.

- publication_names

  Comma separated list of publication names for which to subscribe (receive changes). The individual publication names are treated as standard objects names and can be quoted the same as needed.

[#id](#PROTOCOL-LOGICAL-MESSAGES)

### 55.5.2. Logical Replication Protocol Messages [#](#PROTOCOL-LOGICAL-MESSAGES)

The individual protocol messages are discussed in the following subsections. Individual messages are described in [Section 55.9](protocol-logicalrep-message-formats).

All top-level protocol messages begin with a message type byte. While represented in code as a character, this is a signed byte with no associated encoding.

Since the streaming replication protocol supplies a message length there is no need for top-level protocol messages to embed a length in their header.

[#id](#PROTOCOL-LOGICAL-MESSAGES-FLOW)

### 55.5.3. Logical Replication Protocol Message Flow [#](#PROTOCOL-LOGICAL-MESSAGES-FLOW)

With the exception of the `START_REPLICATION` command and the replay progress messages, all information flows only from the backend to the frontend.

The logical replication protocol sends individual transactions one by one. This means that all messages between a pair of Begin and Commit messages belong to the same transaction. Similarly, all messages between a pair of Begin Prepare and Prepare messages belong to the same transaction. It also sends changes of large in-progress transactions between a pair of Stream Start and Stream Stop messages. The last stream of such a transaction contains a Stream Commit or Stream Abort message.

Every sent transaction contains zero or more DML messages (Insert, Update, Delete). In case of a cascaded setup it can also contain Origin messages. The origin message indicates that the transaction originated on different replication node. Since a replication node in the scope of logical replication protocol can be pretty much anything, the only identifier is the origin name. It's downstream's responsibility to handle this as needed (if needed). The Origin message is always sent before any DML messages in the transaction.

Every DML message contains a relation OID, identifying the publisher's relation that was acted on. Before the first DML message for a given relation OID, a Relation message will be sent, describing the schema of that relation. Subsequently, a new Relation message will be sent if the relation's definition has changed since the last Relation message was sent for it. (The protocol assumes that the client is capable of remembering this metadata for as many relations as needed.)

Relation messages identify column types by their OIDs. In the case of a built-in type, it is assumed that the client can look up that type OID locally, so no additional data is needed. For a non-built-in type OID, a Type message will be sent before the Relation message, to provide the type name associated with that OID. Thus, a client that needs to specifically identify the types of relation columns should cache the contents of Type messages, and first consult that cache to see if the type OID is defined there. If not, look up the type OID locally.

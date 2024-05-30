[#id](#PROTOCOL)

## Chapter 55. Frontend/Backend Protocol

**Table of Contents**

- [55.1. Overview](protocol-overview)

  - [55.1.1. Messaging Overview](protocol-overview#PROTOCOL-MESSAGE-CONCEPTS)
  - [55.1.2. Extended Query Overview](protocol-overview#PROTOCOL-QUERY-CONCEPTS)
  - [55.1.3. Formats and Format Codes](protocol-overview#PROTOCOL-FORMAT-CODES)

- [55.2. Message Flow](protocol-flow)

  - [55.2.1. Start-up](protocol-flow#PROTOCOL-FLOW-START-UP)
  - [55.2.2. Simple Query](protocol-flow#PROTOCOL-FLOW-SIMPLE-QUERY)
  - [55.2.3. Extended Query](protocol-flow#PROTOCOL-FLOW-EXT-QUERY)
  - [55.2.4. Pipelining](protocol-flow#PROTOCOL-FLOW-PIPELINING)
  - [55.2.5. Function Call](protocol-flow#PROTOCOL-FLOW-FUNCTION-CALL)
  - [55.2.6. COPY Operations](protocol-flow#PROTOCOL-COPY)
  - [55.2.7. Asynchronous Operations](protocol-flow#PROTOCOL-ASYNC)
  - [55.2.8. Canceling Requests in Progress](protocol-flow#PROTOCOL-FLOW-CANCELING-REQUESTS)
  - [55.2.9. Termination](protocol-flow#PROTOCOL-FLOW-TERMINATION)
  - [55.2.10. SSL Session Encryption](protocol-flow#PROTOCOL-FLOW-SSL)
  - [55.2.11. GSSAPI Session Encryption](protocol-flow#PROTOCOL-FLOW-GSSAPI)

- [55.3. SASL Authentication](sasl-authentication)

  - [55.3.1. SCRAM-SHA-256 Authentication](sasl-authentication#SASL-SCRAM-SHA-256)

  - [55.4. Streaming Replication Protocol](protocol-replication)
  - [55.5. Logical Streaming Replication Protocol](protocol-logical-replication)

    - [55.5.1. Logical Streaming Replication Parameters](protocol-logical-replication#PROTOCOL-LOGICAL-REPLICATION-PARAMS)
    - [55.5.2. Logical Replication Protocol Messages](protocol-logical-replication#PROTOCOL-LOGICAL-MESSAGES)
    - [55.5.3. Logical Replication Protocol Message Flow](protocol-logical-replication#PROTOCOL-LOGICAL-MESSAGES-FLOW)

  - [55.6. Message Data Types](protocol-message-types)
  - [55.7. Message Formats](protocol-message-formats)
  - [55.8. Error and Notice Message Fields](protocol-error-fields)
  - [55.9. Logical Replication Message Formats](protocol-logicalrep-message-formats)
  - [55.10. Summary of Changes since Protocol 2.0](protocol-changes)

PostgreSQL uses a message-based protocol for communication between frontends and backends (clients and servers). The protocol is supported over TCP/IP and also over Unix-domain sockets. Port number 5432 has been registered with IANA as the customary TCP port number for servers supporting this protocol, but in practice any non-privileged port number can be used.

This document describes version 3.0 of the protocol, implemented in PostgreSQL 7.4 and later. For descriptions of the earlier protocol versions, see previous releases of the PostgreSQL documentation. A single server can support multiple protocol versions. The initial startup-request message tells the server which protocol version the client is attempting to use. If the major version requested by the client is not supported by the server, the connection will be rejected (for example, this would occur if the client requested protocol version 4.0, which does not exist as of this writing). If the minor version requested by the client is not supported by the server (e.g., the client requests version 3.1, but the server supports only 3.0), the server may either reject the connection or may respond with a NegotiateProtocolVersion message containing the highest minor protocol version which it supports. The client may then choose either to continue with the connection using the specified protocol version or to abort the connection.

In order to serve multiple clients efficiently, the server launches a new “backend” process for each client. In the current implementation, a new child process is created immediately after an incoming connection is detected. This is transparent to the protocol, however. For purposes of the protocol, the terms “backend” and “server” are interchangeable; likewise “frontend” and “client” are interchangeable.

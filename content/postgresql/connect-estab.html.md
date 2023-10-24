<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|         52.2. How Connections Are Established        |                                                                    |                                              |                                                       |                                                     |
| :--------------------------------------------------: | :----------------------------------------------------------------- | :------------------------------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](query-path.html "52.1. The Path of a Query")  | [Up](overview.html "Chapter 52. Overview of PostgreSQL Internals") | Chapter 52. Overview of PostgreSQL Internals | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](parser-stage.html "52.3. The Parser Stage") |

***

## 52.2. How Connections Are Established [#](#CONNECT-ESTAB)

PostgreSQL implements a “process per user” client/server model. In this model, every [**](glossary.html#GLOSSARY-CLIENT)*[client process](glossary.html#GLOSSARY-CLIENT "Client (process)")* connects to exactly one [**](glossary.html#GLOSSARY-BACKEND)*[backend process](glossary.html#GLOSSARY-BACKEND "Backend (process)")*. As we do not know ahead of time how many connections will be made, we have to use a “supervisor process” that spawns a new backend process every time a connection is requested. This supervisor process is called [**](glossary.html#GLOSSARY-POSTMASTER)*[postmaster](glossary.html#GLOSSARY-POSTMASTER "Postmaster (process)")* and listens at a specified TCP/IP port for incoming connections. Whenever it detects a request for a connection, it spawns a new backend process. Those backend processes communicate with each other and with other processes of the [**](glossary.html#GLOSSARY-INSTANCE)*[instance](glossary.html#GLOSSARY-INSTANCE "Instance")* using *semaphores* and [**](glossary.html#GLOSSARY-SHARED-MEMORY)*[shared memory](glossary.html#GLOSSARY-SHARED-MEMORY "Shared memory")* to ensure data integrity throughout concurrent data access.

The client process can be any program that understands the PostgreSQL protocol described in [Chapter 55](protocol.html "Chapter 55. Frontend/Backend Protocol"). Many clients are based on the C-language library libpq, but several independent implementations of the protocol exist, such as the Java JDBC driver.

Once a connection is established, the client process can send a query to the backend process it's connected to. The query is transmitted using plain text, i.e., there is no parsing done in the client. The backend process parses the query, creates an *execution plan*, executes the plan, and returns the retrieved rows to the client by transmitting them over the established connection.

***

|                                                      |                                                                    |                                                     |
| :--------------------------------------------------- | :----------------------------------------------------------------: | --------------------------------------------------: |
| [Prev](query-path.html "52.1. The Path of a Query")  | [Up](overview.html "Chapter 52. Overview of PostgreSQL Internals") |  [Next](parser-stage.html "52.3. The Parser Stage") |
| 52.1. The Path of a Query                            |        [Home](index.html "PostgreSQL 17devel Documentation")       |                              52.3. The Parser Stage |

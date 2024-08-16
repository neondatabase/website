[#id](#CONNECT-ESTAB)

## 52.2. How Connections Are Established [#](#CONNECT-ESTAB)

PostgreSQL implements a “process per user” client/server model. In this model, every [\*\*](glossary#GLOSSARY-CLIENT)_[client process](glossary#GLOSSARY-CLIENT)_ connects to exactly one [\*\*](glossary#GLOSSARY-BACKEND)_[backend process](glossary#GLOSSARY-BACKEND)_. As we do not know ahead of time how many connections will be made, we have to use a “supervisor process” that spawns a new backend process every time a connection is requested. This supervisor process is called [\*\*](glossary#GLOSSARY-POSTMASTER)_[postmaster](glossary#GLOSSARY-POSTMASTER)_ and listens at a specified TCP/IP port for incoming connections. Whenever it detects a request for a connection, it spawns a new backend process. Those backend processes communicate with each other and with other processes of the [\*\*](glossary#GLOSSARY-INSTANCE)_[instance](glossary#GLOSSARY-INSTANCE)_ using _semaphores_ and [\*\*](glossary#GLOSSARY-SHARED-MEMORY)_[shared memory](glossary#GLOSSARY-SHARED-MEMORY)_ to ensure data integrity throughout concurrent data access.

The client process can be any program that understands the PostgreSQL protocol described in [Chapter 55](protocol). Many clients are based on the C-language library libpq, but several independent implementations of the protocol exist, such as the Java JDBC driver.

Once a connection is established, the client process can send a query to the backend process it's connected to. The query is transmitted using plain text, i.e., there is no parsing done in the client. The backend process parses the query, creates an _execution plan_, executes the plan, and returns the retrieved rows to the client by transmitting them over the established connection.

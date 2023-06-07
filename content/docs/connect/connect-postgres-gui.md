---
title: Connect a GUI application
subtitle: Learn how to connect a GUI application to Neon
enableTableOfContents: true
---

This topic describes how to connect to a Neon database from a GUI application or IDE. Most GUI applications and IDEs that support connecting to a PostgreSQL database also support connecting to Neon.

## Gather your connection details

The following details are typically required when configuring a connection:

- hostname
- port
- database name
- role name
- password

You can gather most of these details from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a role, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

Neon supports pooled and direct connections to the database. Use a pooled connection string if your application uses a high number of concurrent connections. For more information, see [Connection pooling](/docs/connect/connection-pooling#connection-pooling).

The connection string includes the role name, hostname, and database name.

```text
postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
             ^                                   ^                         ^
             |- <role>                           |- <hostname>             |- <database>
```

- role name: `daniel`
- hostname: `ep-mute-rain-952417.us-east-2.aws.neon.tech`
- database name: `neondb`

Passwords are only shown when they are created. If you misplaced your password, you can reset it by selecting the **Reset Password** link in the **Connection Details** widget or by navigating to the **Roles** page.

Neon uses the default PostgreSQL port, `5432`.

<Admonition type="note">
Neon requires that all connections use SSL/TLS encryption, but you can increase the level of protection by appending an `sslmode` parameter setting to your connection string. For instructions, see [Connect to Neon securely](../connect/connect-securely).
</Admonition>

## Connect to the database

In the GUI application or IDE, enter the connection details into the appropriate fields and connect. In the pgAdmin example shown below, clicking **Save** establishes the database connection.

![Register - Server](/docs/connect/pgadmin4.png)

Some Java-based tools that use the pgJDBC driver for connecting to PostgreSQL, such as DBeaver, DataGrip, and CLion, do not support including a role name and password in a database connection string or URL field. When you find that a connection string is not accepted, try entering the database name, role, and password values in the appropriate fields in the tool's connection UI when configuring a connection to Neon. For example, the DBeaver client has a **URL** field, but connecting to Neon requires specifying the connection details as shown:

![DBeaver connection](/docs/connect/dbeaver_connection.png)

## Tested GUI applications and IDEs

Connections from the following GUI applications and IDEs have been tested with Neon:

- [Appsmith](https://www.appsmith.com/)
- [Azure Data Studio](https://azure.microsoft.com/en-us/products/data-studio/) (requires the [PostgreSQL extension](https://learn.microsoft.com/en-us/sql/azure-data-studio/extensions/postgres-extension?view=sql-server-ver16), and the [option D](../connect/connectivity-issues#d-specify-the-endpoint-id-in-the-password-field) connection workaround)
- [Beekeeper Studio](https://www.beekeeperstudio.io/) (requires the **Enable SSL** option)
- [CLion](https://www.jetbrains.com/clion/)
- [Datagran](https://www.datagran.io/) (requires the [option D](../connect/connectivity-issues#d-specify-the-endpoint-id-in-the-password-field) connection workaround)
- [DataGrip](https://www.jetbrains.com/datagrip/)
- [DBeaver](https://dbeaver.io/)
- [dbForge](https://www.devart.com/dbforge/)
- [DbVisualizer](https://www.dbvis.com/)
- [DronaHQ hosted cloud version](https://www.dronahq.com/) (requires selecting **Connect using SSL** when creating a connector)
- [Forest Admin](https://www.forestadmin.com/) (your database requires at least one table)
- [ILLA Cloud](https://www.illacloud.com/)
- [Luna Modeler](https://www.datensen.com/data-modeling/luna-modeler-for-relational-databases.html) (requires enabling the SSL/TLS option)
- [Metabase](https://www.metabase.com/)
- [PostgreSQL VS Code Extension by Chris Kolkman](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres)
- [pgAdmin 4](https://www.pgadmin.org/)
- [Postico](https://eggerapps.at/postico2/)
- [Retool](https://retool.com/)
- [TablePlus](https://tableplus.com/)
- [Segment](https://segment.com/) (requires the [option D](../connect/connectivity-issues#d-specify-the-endpoint-id-in-the-password-field) connection workaround)

## Connection issues

Applications that use older client libraries or drivers that do not support Server Name Indication (SNI) may not permit connecting to Neon. If you encounter the following error, refer to [Connect from old clients](../connect/connectivity-issues) for possible workarounds.

```txt
ERROR: The endpoint ID is not specified. Either upgrade the PostgreSQL client library (libpq) for SNI support or pass the endpoint ID (the first part of the domain name) as a parameter: '&options=project%3D'. See [https://neon.tech/sni](https://neon.tech/sni) for more information.
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).

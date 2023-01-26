---
title: Connect a GUI or IDE
enableTableOfContents: true
---

This topic describes how to connect to a Neon database from a GUI application or IDE. Most GUI applications and IDEs that support connecting to a PostgreSQL database also support connecting to Neon.

## Gather your connection details

The following details are typically required when configuring a connection:

- hostname
- port
- database name
- user name
- password

You can gather most of these details from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](/docs/connect/connection_details.png)

The connection string includes the user name, hostname, and database name.

```text
postgres://casey@ep-square-sea-260584.us-east-2.aws.neon.tech/neondb
             ^                       ^                          ^
             |- <user name>          |- <hostname>              |- <database name>
```

- user name: `casey`
- hostname: `ep-square-sea-260584.us-east-2.aws.neon.tech`
- database name: `neondb`

Passwords are only shown when they are created. If you misplaced your password, you can reset it by selecting the **Reset Password** link in the **Connection Details** widget, or by navigating to **Settings** > **Users**.

Neon uses the default PostgreSQL port, `5432`.

## Connect to the database

In the GUI application or IDE, enter the connection details into the appropriate fields and connect. In the pgAdmin example shown below, clicking **Save** establishes the database connection.

![Register - Server](/docs/connect/pgadmin4.png)

If the connection is successful, you should be able to view and interact with your database from the GUI application or IDE.

## Tested GUI applications and IDEs

Connections from the following GUI applications and IDEs have been tested with Neon:

- [CLion](https://www.jetbrains.com/clion/)
- [DataGrip](https://www.jetbrains.com/datagrip/)
- [DBeaver](https://dbeaver.io/)
- [DbVisualizer](https://www.dbvis.com/)
- [DronaHQ hosted cloud version](https://www.dronahq.com/) (requires selecting **Connect using SSL** when creating a connector)
- [PostgreSQL VS Code Extension by Chris Kolkman](https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres)
- [pgAdmin 4](https://www.pgadmin.org/)
- [Postico](https://eggerapps.at/postico2/)
- [TablePlus](https://tableplus.com/)

## Connection issues

Applications that use older client libraries or drivers that do not support Server Name Indication (SNI) may not permit connecting to Neon. If you encounter the following error, refer to [Connect from older clients](../connectivity-issues) for possible workarounds.

```txt
ERROR: The endpoint ID is not specified. Either upgrade the PostgreSQL client library (libpq) for SNI support or pass the endpoint ID (the first part of the domain name) as a parameter: '&options=project%3D'. See [https://neon.tech/sni](https://neon.tech/sni) for more information.
```

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).

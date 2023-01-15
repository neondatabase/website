---
title: Connect a GUI or IDE
enableTableOfContents: true
---

This topic describes how to connect to a Neon database from a GUI application or IDE. This topic uses `pgAdmin` as an example, but most GUI applications and IDEs that support connecting to a standalone PostgreSQL database also support connecting to Neon.

## Retrieve your connection details

To connect to a Neon database, the following connection details are typically required:

- Hostname
- Port
- Database name
- User name
- Password

You can obtain most of these details from the **Connection Details** widget on the **Neon Dashboard**. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you.

![Connection details widget](./images/connection_details.png)

A Neon connection string includes the user, the hostname, and the database name.

```text
postgres://casey@ep-square-sea-260584.us-east-2.aws.neon.tech/neondb
             ^                       ^                          ^
             |- <user>               |- <hostname>     |- <database>
```

From the connection string, you can obtain most of the connection details that you require with the exception of the password and port number:

- Hostname: `ep-square-sea-260584.us-east-2.aws.neon.tech`
- Database name: `neondb`
- User name: `casey`

For security reasons, passwords are only shown when they are created. If you misplaced your password, you can reset it by selecting **Reset Password** link in the Connection Details widget, or by navigating to **Settings** > **Users**.

Neon uses the default PostgreSQL port, `5432`.

## Connect to the database

In the GUI application on IDE, enter your connection details into the appropriate fields and connect. In PgAdmin 4, clicking **Save** establishes the database connection.

![Register - Server](./images/pgadmin4.png)

If the connection was successful, you should be able to view and interact with your database.

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

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).

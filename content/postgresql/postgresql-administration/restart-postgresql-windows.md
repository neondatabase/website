---
title: 'How to Restart PostgreSQL on Windows'
page_title: 'How to Restart PostgreSQL on Windows'
page_description: 'In this tutorial, you will learn how to restart PostgreSQL on Windows using Service Manager, command line, and pg_ctl command.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-administration/restart-postgresql-windows/'
ogImage: ''
updatedOn: '2024-02-21T01:45:41+00:00'
enableTableOfContents: true
previousLink:
  title: 'How to Restart PostgreSQL on Ubuntu'
  slug: 'postgresql-administration/postgresql-restart-ubuntu'
nextLink:
  title: 'PostgreSQL pg_terminate_backend() Function'
  slug: 'postgresql-administration/postgresql-pg_terminate_backend'
---

**Summary**: in this tutorial, you will learn how to restart PostgreSQL on Windows using Service Manager, command line, and `pg_ctl` command.

## 1\) Restart PostgreSQL using Services Manager (GUI)

The following steps describe how to restart PostgreSQL on Windows using Service Manager (GUI):

### Step 1\. Stop PostgreSQL service

- Press `Win+R` to open the **Run** dialog.
- Type `services.msc` and press `Enter`.
- In the `Services` window, locate the PostgreSQL service. Typically, it is something like `postgresql-x64-<version>`.
- Right\-click on it and select **Stop** to stop the service.

### Step 2\. Start PostgreSQL service

- After stopping the service, right\-click on the service name.
- Select **Start** to start the service.

## 2\) Restart PostgreSQL from the command line

If you prefer working with command, you can follow these steps to restart PostgreSQL:

### Step 1\. Open command prompt

- Press `Win+R` to open the **Run** dialog
- Type `cmd` and `press Ctrl+Shift+Enter` (not Enter). This will allow you to run the command prompt as an Administrator.
- A **User Account Control** pop\-up will display, you can click the **Yes** button to acknowledge.

### Step 2\. Restart PostgreSQL service

Stop the PostgreSQL service using the following command:

```xmlsql
net stop postgresql-x64-<version>
```

You need to replace `<version>` with your [PostgreSQL version](postgresql-version) number. For example:

```xml
net stop postgresql-x64-16
```

Output:

```
The postgresql-x64-16 - PostgreSQL Server 16 service is stopping.
The postgresql-x64-16 - PostgreSQL Server 16 service was stopped successfully.
```

After the service has stopped, type the following command and press `Enter` to start the PostgreSQL service:

```
net start postgresql-x64-<version>
```

For example:

```xml
net start postgresql-x64-16
```

Output:

```
The postgresql-x64-16 - PostgreSQL Server 16 service is starting.
The postgresql-x64-16 - PostgreSQL Server 16 service was started successfully.
```

## 3\) Restart PostgreSQL using the pg_ctl command (CLI)

PostgreSQL offers the `pg_ctl` utility that allows you to initialize a PostgreSQL database instance, and start, stop, or restart the PostgreSQL database server.

The `pg_ctl` is typically located in the bin directory within the PostgreSQL installation directory.

The following shows you how to execute the `pg_ctl` command to restart PostgreSQL.

It assumes that the `bin` directory is included in the `PATH` environment variable, allowing you to call `pg_ctl` from any directory.

### Step 1\. Open a command prompt

- Press `Win+R` to open the **Run** dialog.
- Type `cmd` and `press` `Ctrl+Shift+Enter` to run the Command Prompt as an Administrator.

### Step 2\. Execute the pg_ctl command

Type the following `pg_ctl` command and press `Enter`:

```
pg_ctl -D "C:\Program Files\PostgreSQL\<version>\data" restart
```

Note that you need to replace the `<version>` with the actual version of your PostgreSQL and change the data directory path (“`C:\Program Files\PostgreSQL\<version>\data`“) if it is different.

For example, to restart PostgreSQL 16\.x, you can execute the following command:

```
pg_ctl -D "C:\Program Files\PostgreSQL\16\data" restart
```

This command will restart PostgreSQL.

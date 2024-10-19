---
title: 'PostgreSQL Password File .pgpass'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-password-file-pgpass
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use a PostgreSQL password file `.pgpass` to store passwords securely and use them for connecting to PostgreSQL databases.

## Introduction to the PostgreSQL password file .pgpass

The password file `.pgpass` is a PostgreSQL feature that allows you to securely store the connection information.

The password file can be useful for automation scripts like [pgdump](/docs/postgresql/postgresql-administration/postgresql-backup-database) or [pgrestore](https://www.postgresqltutorial.com/postgresql-administration/postgresql-restore-database/) to avoid repeated password entries when connecting to PostgreSQL databases.

The `.pgpass` file is a plain text file that contains one or more lines with the following format:

```
hostname:port:database:username:password
```

In this format:

- `hostname`: This is the hostname of the server where the PostgreSQL server is running.
- `port`: This is the port on which the PostgreSQL server is listening.
- `database`: This is the database to which you want to connect.
- `username`: This is the username that you want to use to connect to the database.
- `password`: This is the password of the username.

Each line in the `.pgpass` file represents connection information for a specific database.

The fields are separated by a colon (`:`) and can be replaced with an asterisk `*` as a wildcard to match any value.

The `psql` reads the password file and uses the first matching. Therefore, it's important to order the entries with more specific information first, followed by more general wildcard entries, to ensure the proper behavior.

We'll show you how to create a password file on Windows and Unix-like systems (Linux or macOS).

## Creating the .pgpass file on Windows

On Windows, the password file is `pgpass.conf` stored in the directory `%APPDATA%\postgresql\`.

Typically, the `%APPDATA%` is the application data subdirectory in the path. For example, on Windows 11 it would be `C:\Users\<YourUsername>\AppData\Roaming\postgresql`.

Note that if you don't want to store the password file in a default location, you can store it in our preferred location and set the `PGPASSFILE` environment variable to the password file path.

First, open a text editor like Notepad.

Second, enter the connection for your PostgreSQL database in the above format. For example:

```
localhost:5432:*:postgres:moreSecure
```

Third, save the file with the name `pgpass.conf` with the following file path:

```
C:\Users\<YourUsername>\AppData\Roaming\postgresql\pgpass.conf
```

Replace `<YourUsername>` with your actual Windows username.

## Creating the .pgpass on Unix-like systems (Linux, macOS)

First, open a terminal.

Second, use a text editor like Vi, or Nano to create a `.pgpass` file:

```
nano ~/.pgpass
```

Third, enter the connection information for your PostgreSQL database:

```
localhost:5432:dvdrental:postgres:moreSecure
```

Fourth, save the file and exit.

Finally, ensure security by giving the .pgpass file has proper permissions:

```
chmod 600 ~/.pgpass
```

## Using the .pgpass password file with psql

After you create the `.pgpass` file, you can use psql without having to specify a password each time:

```
psql -h hostname -p port -d database -U username
```

In this command, you need to replace `hostname`, `port`, `database`, and `username` with your actual connection details.

The `psql` command will read the `.pgpass` file for connection information.

## Summary

- Use a password file `.pgpass` to store connection information securely.
- Use the `.pgpass` file to avoid entering a password when connecting to a PostgreSQL database.

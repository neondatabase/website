---
modifiedAt: 2024-02-19 00:24:39
prevPost: postgresql-any-operator
nextPost: postgresql-all-operator
createdAt: 2024-02-19T07:24:19.000Z
title: 'How to Uninstall PostgreSQL from Ubuntu'
redirectFrom: 
            - /postgresql/postgresql-administration/uninstall-postgresql-ubuntu
tableOfContents: true
---

**Summary**: in this tutorial, you will learn step-by-step how to uninstall PostgreSQL from Ubuntu.

Here are the steps for uninstalling the PostgreSQL on Ubuntu:

- Uninstall the PostgreSQL application
- Remove PostgreSQL packages
- Remove PostgreSQL directories
- Delete the postgres user
- Verify uninstallation

The following is a step-by-step tutorial to uninstall PostgreSQL from Ubuntu:

## Step 1. Uninstall the PostgreSQL application

Open the SSH terminal and run the following command to remove PostgreSQL from Ubuntu:

```bash
sudo apt-get --purge remove postgresql
```

## Step 2. Remove PostgreSQL packages

Run the following command to show all installed PostgreSQL packages:

```
dpkg -l | grep postgres
```

The command will return a list of installed PostgreSQL packages.

To uninstall PostgreSQL completely, you need to remove all of these packages using the following command:

```bash
sudo apt-get --purge remove <package_name>
```

Replace `<package_name>` with the names of the installed packages.

Typically, you may have several packages such as `postgresql`, and `postgresql-client-16`. Make sure to remove all of them.

## Step 3. Remove PostgreSQL directories

Remove the PostgreSQL's related directories by executing the following commands:

```bash
sudo rm -rf /var/lib/postgresql/
sudo rm -rf /var/log/postgresql/
sudo rm -rf /etc/postgresql/
```

## Step 4. Remove the postgres user

Typically, the PostgreSQL installer creates a system user `postgres` during the installation. To remove it, you can run the following command:

```bash
sudo deluser postgres
```

## Step 5. Verify uninstallation

Finally, you can verify the uninstallation of PostgreSQL by using the following command:

```
psql --version
```

If PostgreSQL is uninstalled successfully, this command should return the following message:

```

-bash: /usr/bin/psql: No such file or directory
```

That's it! PostgreSQL should now be completely uninstalled from your Ubuntu system.

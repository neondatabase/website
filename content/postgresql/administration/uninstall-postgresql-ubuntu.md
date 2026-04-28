---
title: How to Uninstall PostgreSQL from Ubuntu
page_title: How to Uninstall PostgreSQL from Ubuntu
page_description: >-
  In this tutorial, you will learn step-by-step how to uninstall PostgreSQL from
  Ubuntu.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-administration/uninstall-postgresql-ubuntu/
ogImage: ''
updatedOn: '2024-02-19T07:24:39+00:00'
enableTableOfContents: true
previousLink:
  title: PostgreSQL pg_terminate_backend() Function
  slug: postgresql-administration/postgresql-pg_terminate_backend
nextLink:
  title: ''
  slug: ''
---
<Admonition type="info" id="CTA">
Uninstalling PostgreSQL from Ubuntu works the same whether you run Postgres locally, on a VM, or anywhere else, so these steps apply to any standard Postgres install. If you're moving off self-hosted and want a managed home for your data, [Lakebase](https://www.databricks.com/product/lakebase) delivers enterprise-grade Postgres built for the AI era, with the performance, security, and deep Lakehouse integration large teams need. For developers and startups who want to ship quickly and scale without babysitting infrastructure, [Neon](https://neon.com) is the Postgres platform that gets out of your way.
</Admonition>

**Summary**: in this tutorial, you will learn step\-by\-step how to uninstall PostgreSQL from Ubuntu.

Here are the steps for uninstalling the PostgreSQL on Ubuntu:

- Uninstall the PostgreSQL application
- Remove PostgreSQL packages
- Remove PostgreSQL directories
- Delete the postgres user
- Verify uninstallation

The following is a step\-by\-step tutorial to uninstall PostgreSQL from Ubuntu:

## Step 1\. Uninstall the PostgreSQL application

Open the SSH terminal and run the following command to remove PostgreSQL from Ubuntu:

```bash
sudo apt-get --purge remove postgresql
```

## Step 2\. Remove PostgreSQL packages

Run the following command to show all installed PostgreSQL packages:

```bash
dpkg -l | grep postgres
```

The command will return a list of installed PostgreSQL packages.

To uninstall PostgreSQL completely, you need to remove all of these packages using the following command:

```bash
sudo apt-get --purge remove <package_name>
```

Replace `<package_name>` with the names of the installed packages.

Typically, you may have several packages such as `postgresql`, and `postgresql-client-16`. Make sure to remove all of them.

## Step 3\. Remove PostgreSQL directories

Remove the PostgreSQL’s related directories by executing the following commands:

```bash
sudo rm -rf /var/lib/postgresql/
sudo rm -rf /var/log/postgresql/
sudo rm -rf /etc/postgresql/
```

## Step 4\. Remove the postgres user

Typically, the PostgreSQL installer creates a system user `postgres` during the installation. To remove it, you can run the following command:

```bash
sudo deluser postgres
```

## Step 5\. Verify uninstallation

Finally, you can verify the uninstallation of PostgreSQL by using the following command:

```bash
psql --version

```

If PostgreSQL is uninstalled successfully, this command should return the following message:

```

-bash: /usr/bin/psql: No such file or directory
```

That’s it! PostgreSQL should now be completely uninstalled from your Ubuntu system.

---
title: 'Install PostgreSQL Linux'
redirectFrom: 
            - /docs/postgresql/postgresql-getting-started/install-postgresql-linux/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to download and install PostgreSQL on Linux.

Most Linux platforms such as Debian, Red Hat / CentOS, SUSE, and Ubuntu have PostgreSQL integrated with their package management.

It is recommended that you install PostgreSQL this way since it ensures a proper integration with the operating system including automatic patching and other update management functionality.

## Install PostgreSQL on Ubuntu

In this tutorial, we'll show you how to install PostgreSQL 16 on Ubuntu 22.04.

### Step 1. Add PostgreSQL Repository

First, update the package index and install the necessary packages:

```
sudo apt update
sudo apt install gnupg2 wget
```

Second, add the PostgreSQL repository:

```
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
```

Third, import the repository signing key:

```
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
```

Finally, update the package list

```
sudo apt update
```

### Step 2. Install PostgreSQL 16

First, install PostgreSQL and its contrib modules:

```
sudo apt install postgresql-16 postgresql-contrib-16
```

Second, start the PostgreSQL service:

```
sudo systemctl start postgresql
```

Third, enable PostgreSQL service:

```
sudo systemctl enable postgresql
```

### Step 3. Configure PostgreSQL server

PostgreSQL stores the configuration in the `postgresql.conf` file. You can edit the `postgresql.conf` using any text editor such as nano and vim.

```
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Set the listen_addresses to \* to allow remote connection:

```
listen_addresses = '*'
```

Configure PostgreSQL to use md5 password authentication in the `pg_hba.conf` file. This is necessary if you want to enable remote connections :

```
sudo sed -i '/^host/s/ident/md5/' /etc/postgresql/16/main/pg_hba.conf
sudo sed -i '/^local/s/peer/trust/' /etc/postgresql/16/main/pg_hba.conf
echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/16/main/pg_hba.conf
```

Restart PostgreSQL for the changes to take effect:

```
sudo systemctl restart postgresql
```

Allow PostgreSQL port through the firewall:

```
sudo ufw allow 5432/tcp
```

## Connect to the PostgreSQL database server

First, connect to the PostgreSQL server using the `postgres` user:

```
sudo -u postgres psql
```

Second, set a password for `postgres` user:

```
ALTER USER postgres PASSWORD '<password>';
```

Replace the `<password>` with the one you want.

Third, quit the psql:

```
\q
```

## Load the sample database

First, download the sample database using the `curl` tool:

```
curl -O https://www.postgresqltutorial.com/wp-content/uploads/2019/05/dvdrental.zip
```

Second, unzip the dvdrental.zip file to get the dvdrental.tar file:

```
unzip dvdrental.zip
```

Third, connect to the PostgreSQL server using `postgres` user:

```
sudo -u postgres psql
```

Fourth, create the `dvdrental` database using the `CREATE DATABASE` statement:

```
create database dvdrental;
```

Fifth, quit the `psql` by using the `\q` command:

```
\q
```

Seventh, use the [pg_restore tool to restore](https://www.postgresqltutorial.com/postgresql-administration/postgresql-restore-database/) the `dvdrental` database:

```
pg_restore -U postgres --dbname=dvdrental --verbose dvdrental.tar
```

Eighth, access the PostgreSQL database server again using `psql`:

```
psql
```

Ninth, switch to the `dvdental` database:

```
\c dvdrental
```

Finally, enter the following command to get the number of films in the `film` table:

```
select count(*) from film;
```

Here is the output:

```
count
-------
1000
(1 row)
```

Congratulations! You have successfully installed PostgreSQL on Ubuntu, connected to the PostgreSQL database server using psql, and loaded the sample database.

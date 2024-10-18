---
title: 'Install PostgreSQL Linux'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-linux/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to download and install PostgreSQL on Linux.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Most Linux platforms such as Debian, Red Hat / CentOS, SUSE, and Ubuntu have PostgreSQL integrated with their package management.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

It is recommended that you install PostgreSQL this way since it ensures a proper integration with the operating system including automatic patching and other update management functionality.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Install PostgreSQL on Ubuntu

<!-- /wp:heading -->

<!-- wp:paragraph -->

In this tutorial, we'll show you how to install PostgreSQL 16 on Ubuntu 22.04.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Step 1. Add PostgreSQL Repository

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, update the package index and install the necessary packages:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
sudo apt update
sudo apt install gnupg2 wget
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, add the PostgreSQL repository:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, import the repository signing key:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, update the package list

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
sudo apt update
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Step 2. Install PostgreSQL 16

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, install PostgreSQL and its contrib modules:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
sudo apt install postgresql-16 postgresql-contrib-16
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, start the PostgreSQL service:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
sudo systemctl start postgresql
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, enable PostgreSQL service:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
sudo systemctl enable postgresql
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Step 3. Configure PostgreSQL server

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL stores the configuration in the `postgresql.conf` file. You can edit the `postgresql.conf` using any text editor such as nano and vim.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
sudo nano /etc/postgresql/16/main/postgresql.conf
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Set the listen_addresses to \* to allow remote connection:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
listen_addresses = '*'
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Configure PostgreSQL to use md5 password authentication in the `pg_hba.conf` file. This is necessary if you want to enable remote connections :

<!-- /wp:paragraph -->

<!-- wp:code -->

```
sudo sed -i '/^host/s/ident/md5/' /etc/postgresql/16/main/pg_hba.conf
sudo sed -i '/^local/s/peer/trust/' /etc/postgresql/16/main/pg_hba.conf
echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/16/main/pg_hba.conf
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Restart PostgreSQL for the changes to take effect:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
sudo systemctl restart postgresql
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Allow PostgreSQL port through the firewall:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
sudo ufw allow 5432/tcp
```

<!-- /wp:code -->

<!-- wp:heading -->

## Connect to the PostgreSQL database server

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, connect to the PostgreSQL server using the `postgres` user:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
sudo -u postgres psql
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, set a password for `postgres` user:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
ALTER USER postgres PASSWORD '<password>';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Replace the `<password>` with the one you want.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, quit the psql:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
\q
```

<!-- /wp:code -->

<!-- wp:heading -->

## Load the sample database

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, download the sample database using the `curl` tool:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
curl -O https://www.postgresqltutorial.com/wp-content/uploads/2019/05/dvdrental.zip
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, unzip the dvdrental.zip file to get the dvdrental.tar file:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
unzip dvdrental.zip
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, connect to the PostgreSQL server using `postgres` user:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
sudo -u postgres psql
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, create the `dvdrental` database using the `CREATE DATABASE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
create database dvdrental;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, quit the `psql` by using the `\q` command:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
\q
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Seventh, use the [pg_restore tool to restore](https://www.postgresqltutorial.com/postgresql-administration/postgresql-restore-database/) the `dvdrental` database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
pg_restore -U postgres --dbname=dvdrental --verbose dvdrental.tar
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Eighth, access the PostgreSQL database server again using `psql`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
psql
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Ninth, switch to the `dvdental` database:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
\c dvdrental
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, enter the following command to get the number of films in the `film` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
select count(*) from film;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Here is the output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
count
-------
1000
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Congratulations! You have successfully installed PostgreSQL on Ubuntu, connected to the PostgreSQL database server using psql, and loaded the sample database.

<!-- /wp:paragraph -->

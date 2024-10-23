---
title: "Install PostgreSQL Linux"
page_title: "Install PostgreSQL on Linux (Ubuntu)"
page_description: "In this tutorial, you will learn how to download and install PostgreSQL on Linux. You also learn how to load the sample database to the PostgreSQL Database Server."
prev_url: "https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-linux/"
ogImage: ""
updatedOn: "2024-02-19T07:35:09+00:00"
enableTableOfContents: true
previousLink: 
  title: "Install PostgreSQL macOS"
  slug: "postgresql-getting-started/install-postgresql-macos"
nextLink: 
  title: "PostgreSQL Tutorial"
  slug: "postgresql-getting-started/.."
---




**Summary**: in this tutorial, you will learn how to download and install PostgreSQL on Linux.

Most Linux platforms such as Debian, Red Hat / CentOS, SUSE, and Ubuntu have PostgreSQL integrated with their package management.

It is recommended that you install PostgreSQL this way since it ensures a proper integration with the operating system including automatic patching and other update management functionality.


## Install PostgreSQL on Ubuntu

In this tutorial, we’ll show you how to install PostgreSQL 16 on Ubuntu 22\.04\.


### Step 1\. Add PostgreSQL Repository

First, update the package index and install the necessary packages:


```shellsql
sudo apt update
sudo apt install gnupg2 wget
```
Second, add the PostgreSQL repository:


```
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
```
Third, import the repository signing key:


```sql
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
```
Finally, update the package list


```shell
sudo apt update
```

### Step 2\. Install PostgreSQL 16

First, install PostgreSQL and its contrib modules:


```shell
sudo apt install postgresql-16 postgresql-contrib-16
```
Second, start the PostgreSQL service:


```shell
sudo systemctl start postgresql
```
Third, enable PostgreSQL service:


```php
sudo systemctl enable postgresql
```

### Step 3\. Configure PostgreSQL server

PostgreSQL stores the configuration in the `postgresql.conf` file. You can edit the `postgresql.conf` using any text editor such as nano and vim.


```
sudo nano /etc/postgresql/16/main/postgresql.conf
```
Set the listen\_addresses to \* to allow remote connection:


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


```shell
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


```shell
ALTER USER postgres PASSWORD '<password>';
```
Replace the `<password>` with the one you want.

Third, quit the psql:


```shell
\q
```

## Load the sample database

First, download the sample database using the `curl` tool:


```shell
curl -O https://neon.tech/postgresql//postgresqltutorial/dvdrental.zip
```
Second, unzip the dvdrental.zip file to get the dvdrental.tar file:


```shell
unzip dvdrental.zip
```
Third, connect to the PostgreSQL server using `postgres` user:


```shell
sudo -u postgres psql
```
Fourth, create the `dvdrental` database using the [`CREATE DATABASE`](../postgresql-administration/postgresql-create-database) statement:


```shell
create database dvdrental;
```
Fifth, quit the `psql` by using the `\q` command:


```shell
\q
```
Seventh, use the [pg\_restore tool to restore](../postgresql-administration/postgresql-restore-database) the `dvdrental` database:


```shell
pg_restore -U postgres --dbname=dvdrental --verbose dvdrental.tar
```
Eighth, access the PostgreSQL database server again using `psql`:


```shell
psql
```
Ninth, switch to the `dvdental` database:


```shell
\c dvdrental
```
Finally, enter the following command to get the number of films in the `film` table:


```shell
select count(*) from film;
```
Here is the output:


```shell
count
-------
1000
(1 row)
```
Congratulations! You have successfully installed PostgreSQL on Ubuntu, connected to the PostgreSQL database server using psql, and loaded the sample database.


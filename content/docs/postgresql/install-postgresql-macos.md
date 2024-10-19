---
title: 'Install PostgreSQL macOS'
redirectFrom: 
            - /docs/postgresql/postgresql-getting-started/install-postgresql-macos/
ogImage: /postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-1.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to download the PostgreSQL, install PostgreSQL on macOS, and restore the sample database.

## Download PostgreSQL installer for macOS

To download the PostgreSQL installer, you follow these steps:

- First, visit the [PostgreSQL installer download page](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
- Then, download the PostgreSQL for macOS.

## Install PostgreSQL on macOS

To install PostgreSQL on macOS, you follow these steps:

First, launch the setup wizard by double-click the installer file:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-1.png)

Second, select the directory where the PostgreSQL will be installed and click the Next button:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-2.png)

Third, select the components that you want to install, uncheck the Stack Builder, and click the Next button:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-3.png)

Fourth, specify a directory where PostgreSQL stores the data and click the Next button:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-4.png)

Fifth, enter the password for the **postgres** user account. You should note down this password for logging in to the PostgreSQL database server later. After that, click the Next button.

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-5.png)

Sixth, specify the port number on which the PostgreSQL server will listen. By default, PostgreSQL uses port number 5432.

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-6.png)

Seventh, select the locale used by PostgreSQL. By default, PostgreSQL uses the locale of the current operating system:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-7.png)

Eighth, review the installation information. If everything looks correct, click the Next button to begin the installation.

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-8.png)

Ninth, click the Next button to start installing the PostgreSQL database server on your computer:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-9.png)

It will take few mintues to complete the installation.

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-step-10.png)

Finally, click the Finish button once the installation is completed:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Install-PostgreSQL-step-11.png)

## Load the sample database

First, launch pgAdmin from Launchpad.

Second, enter the password for the **postgres** user.

Third, right-click the PostgreSQL 12 and select **Create > Database..** to open a dialog for creating a new database.

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Restore-Sample-Database-Step-1.png)

Fourth, enter dvdrental as the database, postgres as the owner, and click the Save button to create the dvdrental database.

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Restore-Sample-Database-Step-2.png)

Sixth, [download the sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database) and unzip it. You'll get a directory with many files.

Seventh, right-click the **dvdrental** database and select the **Restore...** menu item:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Restore-Sample-Database-Step-3.png)

Eighth, select the directory as the Format (1), the directory that contains sample database as the Filename (2), and postgres as the Role name (3), and click the Restore button.

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Restore-Sample-Database-Step-4.png)

It will take few seconds to restore the sample database. Once the restoration completes, you will see a notification like this:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-Restore-Sample-Database-Step-5.png)

It means that you have successfully created the sample database and restored it from the downloaded file.

In this tutorial, you have learned how to download PostgreSQL installer for macOS, how to install PostgreSQL on macOS, and how to restore the sample database.

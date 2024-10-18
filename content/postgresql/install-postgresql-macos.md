---
title: 'Install PostgreSQL macOS'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-macos/
ogImage: ./img/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-1.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to download the PostgreSQL, install PostgreSQL on macOS, and restore the sample database.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Download PostgreSQL installer for macOS

<!-- /wp:heading -->

<!-- wp:paragraph -->

To download the PostgreSQL installer, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:list -->

- First, visit the [PostgreSQL installer download page](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
- Then, download the PostgreSQL for macOS.

<!-- /wp:list -->

<!-- wp:heading -->

## Install PostgreSQL on macOS

<!-- /wp:heading -->

<!-- wp:paragraph -->

To install PostgreSQL on macOS, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, launch the setup wizard by double-click the installer file:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5143,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-1.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Second, select the directory where the PostgreSQL will be installed and click the Next button:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5144,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-2.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Third, select the components that you want to install, uncheck the Stack Builder, and click the Next button:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5145,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-3.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Fourth, specify a directory where PostgreSQL stores the data and click the Next button:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5146,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-4.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Fifth, enter the password for the **postgres **user account. You should note down this password for logging in to the PostgreSQL database server later. After that, click the Next button.

<!-- /wp:paragraph -->

<!-- wp:image {"id":5147,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-5.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Sixth, specify the port number on which the PostgreSQL server will listen. By default, PostgreSQL uses port number 5432.

<!-- /wp:paragraph -->

<!-- wp:image {"id":5148,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-6.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Seventh, select the locale used by PostgreSQL. By default, PostgreSQL uses the locale of the current operating system:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5149,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-7.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Eighth, review the installation information. If everything looks correct, click the Next button to begin the installation.

<!-- /wp:paragraph -->

<!-- wp:image {"id":5150,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-8.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Ninth, click the Next button to start installing the PostgreSQL database server on your computer:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5151,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-macOS-step-9.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

It will take few mintues to complete the installation.

<!-- /wp:paragraph -->

<!-- wp:image {"id":5152,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-step-10.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Finally, click the Finish button once the installation is completed:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5153,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Install-PostgreSQL-step-11.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Load the sample database

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, launch pgAdmin from Launchpad.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, enter the password for the **postgres** user.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, right-click the PostgreSQL 12 and select **Create > Database..** to open a dialog for creating a new database.

<!-- /wp:paragraph -->

<!-- wp:image {"id":5155,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Restore-Sample-Database-Step-1.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Fourth, enter dvdrental as the database, postgres as the owner, and click the Save button to create the dvdrental database.

<!-- /wp:paragraph -->

<!-- wp:image {"id":5156,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Restore-Sample-Database-Step-2.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Sixth, [download the sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) and unzip it. You'll get a directory with many files.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Seventh, right-click the **dvdrental **database and select the **Restore...** menu item:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5157,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Restore-Sample-Database-Step-3.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Eighth, select the directory as the Format (1), the directory that contains sample database as the Filename (2), and postgres as the Role name (3), and click the Restore button.

<!-- /wp:paragraph -->

<!-- wp:image {"id":5158,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Restore-Sample-Database-Step-4.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

It will take few seconds to restore the sample database. Once the restoration completes, you will see a notification like this:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5159,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-Restore-Sample-Database-Step-5.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

It means that you have successfully created the sample database and restored it from the downloaded file.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to download PostgreSQL installer for macOS, how to install PostgreSQL on macOS, and how to restore the sample database.

<!-- /wp:paragraph -->

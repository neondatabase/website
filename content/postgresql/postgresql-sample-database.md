---
title: 'PostgreSQL Sample Database'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/
ogImage: ./img/wp-content-uploads-2018-03-dvd-rental-sample-database-diagram.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, we will introduce you to a PostgreSQL sample database that you can use for learning and practicing PostgreSQL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

We will use the DVD rental database to demonstrate the features of PostgreSQL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The DVD rental database represents the business processes of a DVD rental store. The DVD rental database has many objects, including:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- 15 tables
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- 1 trigger
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- 7 views
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- 8 functions
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- 1 domain
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- 13 sequences
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## DVD Rental ER Model

<!-- /wp:heading -->

<!-- wp:heading -->

## ![PostgreSQL Sample Database Diagram](./img/wp-content-uploads-2018-03-dvd-rental-sample-database-diagram.png "PostgreSQL Sample Database Diagram")

<!-- /wp:heading -->

<!-- wp:paragraph -->

In the diagram, the asterisk (\*), which appears in front of the field, indicates the [primary key](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-primary-key/).

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL Sample Database Tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

There are 15 tables in the DVD Rental database:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- actor - stores actor data including first name and last name.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- film - stores film data such as title, release year, length, rating, etc.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- film_actor - stores the relationships between films and actors.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- category - stores film's categories data.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- film_category- stores the relationships between films and categories.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- store - contains the store data including manager staff and address.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- inventory - stores inventory data.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- rental - stores rental data.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- payment - stores customer's payments.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- staff - stores staff data.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- customer - stores customer data.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- address - stores address data for staff and customers
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- city - stores city names.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- country - stores country names.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Download the PostgreSQL sample database

<!-- /wp:heading -->

<!-- wp:paragraph -->

You can download the PostgreSQL DVD Rental sample database via the following link:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

[Download DVD Rental Sample Database](https://www.postgresqltutorial.com/wp-content/uploads/2019/05/dvdrental.zip)

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The database file is in `zip`format ( `dvdrental.zip`) so you need to extract it to `dvdrental.tar` [before loading the sample database into the PostgreSQL database server](https://www.postgresqltutorial.com/postgresql-getting-started/load-postgresql-sample-database/ "Load PostgreSQL Sample Database").

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Download printable ER diagram

<!-- /wp:heading -->

<!-- wp:paragraph -->

Besides the sample database, we provide you with a printable ER diagram in PDF format. You can download and print the ER diagram for reference while practicing PostgreSQL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

[Download the Printable ER Diagram](https://www.postgresqltutorial.com/wp-content/uploads/2018/03/printable-postgresql-sample-database-diagram.pdf)

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

This tutorial introduced you to a PostgreSQL sample database named DVD Rental. We will use this database in our PostgreSQL tutorials, so make sure [you load it to your server](https://www.postgresqltutorial.com/postgresql-getting-started/load-postgresql-sample-database/).

<!-- /wp:paragraph -->

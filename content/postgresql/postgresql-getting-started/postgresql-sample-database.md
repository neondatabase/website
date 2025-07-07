---
title: 'PostgreSQL Sample Database'
page_title: 'PostgreSQL Sample Database'
page_description: 'This tutorial introduces you to a PostgreSQL sample database that you can use for learning and practicing with PostgreSQL.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/'
ogImage: '/postgresqltutorial/dvd-rental-sample-database-diagram.png'
updatedOn: '2024-01-16T02:36:36+00:00'
enableTableOfContents: true
previousLink:
  title: 'What is PostgreSQL?'
  slug: 'postgresql-getting-started/what-is-postgresql'
nextLink:
  title: 'Install PostgreSQL on Windows'
  slug: 'postgresql-getting-started/install-postgresql'
---

**Summary**: in this tutorial, we will introduce you to a PostgreSQL sample database that you can use for learning and practicing PostgreSQL.

We will use the DVD rental database to demonstrate the features of PostgreSQL.

The DVD rental database represents the business processes of a DVD rental store. The DVD rental database has many objects, including:

- 15 tables
- 1 trigger
- 7 views
- 8 functions
- 1 domain
- 13 sequences

## PostgreSQL Sample Database Diagram

The following diagram shows the structure of the DVD rental database:

![DVD Rental Database ER Diagram](/postgresqltutorial/dvd-rental-sample-database-diagram.png)

In the diagram, the asterisk (\*), which appears in front of the field, indicates the [primary key](../postgresql-tutorial/postgresql-primary-key).

## PostgreSQL Sample Database Tables

There are 15 tables in the DVD Rental database:

- actor – stores actor data including first name and last name.
- film – stores film data such as title, release year, length, rating, etc.
- film_actor – stores the relationships between films and actors.
- category – stores film’s categories data.
- film_category\- stores the relationships between films and categories.
- store – contains the store data including manager staff and address.
- inventory – stores inventory data.
- rental – stores rental data.
- payment – stores customer’s payments.
- staff – stores staff data.
- customer – stores customer data.
- address – stores address data for staff and customers
- city – stores city names.
- country – stores country names.

## Download the PostgreSQL sample database

You can download the PostgreSQL DVD Rental sample database via the following link:

[Download DVD Rental Sample Database](/postgresqltutorial/dvdrental.zip)

The database file is in `zip`format ( `dvdrental.zip`) so you need to extract it to  `dvdrental.tar` [before loading the sample database into the PostgreSQL database server](load-postgresql-sample-database 'Load PostgreSQL Sample Database').

## Download printable ER diagram

Besides the sample database, we provide you with a printable ER diagram in PDF format. You can download and print the ER diagram for reference while practicing PostgreSQL.

[Download the Printable ER Diagram](/postgresqltutorial/printable-postgresql-sample-database-diagram.pdf)

This tutorial introduced you to a PostgreSQL sample database named DVD Rental. We will use this database in our PostgreSQL tutorials, so make sure [you load it to your server](load-postgresql-sample-database).

---
title: 'PostgreSQL Server and Database Objects'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-server-and-database-objects/
ogImage: ./img/wp-content-uploads-2019-05-postgresql-databases.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you are going to get familiar with the most common **server and database objects** provided by PostgreSQL. It is important to understand those objects and their functionality so you do not miss out on the cool features that you may wish to have in the system.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

After [installing PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/ "Install PostgreSQL"), [loading sample database](https://www.postgresqltutorial.com/postgresql-getting-started/load-postgresql-sample-database/ "Load PostgreSQL Sample Database") and [connecting to the database server using _pgAdmin_ GUI application](https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/ "Connect to PostgreSQL Database"), you will see that PostgreSQL provides many server and database objects. To leverage the features of each object that PostgreSQL provides effectively, you should have a good understanding of what each object is and how to use it effectively.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Let's get familiar with these PostgreSQL server and database objects.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Server service

<!-- /wp:heading -->

<!-- wp:paragraph -->

When you install a PostgreSQL instance, you will have a corresponding PostgreSQL server service. The PostgreSQL server service is also known as the PostgreSQL server. You can install multiple PostgreSQL servers on a physical server using different ports and having different locations to store data.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Databases

<!-- /wp:heading -->

<!-- wp:paragraph -->

A database is a container of other objects such as tables, [views](https://www.postgresqltutorial.com/postgresql-views/), [functions](https://www.postgresqltutorial.com/postgresql-stored-procedures/), and [indexes](https://www.postgresqltutorial.com/postgresql-indexes/). You can create as many databases as you want inside a PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:image {"id":4117} -->

![](./img/wp-content-uploads-2019-05-postgresql-databases.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

Tables store data. A table belongs to a database and each database has multiple tables.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A special feature of PostgreSQL is table inheritance, meaning that a table (child table) can inherit from another table (parent table) so when you query data from the child table, the data from the parent table is also showing up.

<!-- /wp:paragraph -->

<!-- wp:image {"id":4113} -->

![](./img/wp-content-uploads-2019-05-postgresql-tables.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Schemas

<!-- /wp:heading -->

<!-- wp:paragraph -->

A [schema](https://www.postgresqltutorial.com/postgresql-administration/postgresql-schema/) is a logical container of tables and other objects inside a database. Each PostgreSQL database may have multiple schemas.

<!-- /wp:paragraph -->

<!-- wp:image {"id":4111} -->

![](./img/wp-content-uploads-2019-05-postgresql-schema.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Tablespaces

<!-- /wp:heading -->

<!-- wp:paragraph -->

Tablespaces are where PostgreSQL stores the data physically. [Tablespace](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-tablespace/ "PostgreSQL Tablespaces")s allow you to move your data to different physical locations across drivers easily by using simple commands.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

By default, PostgreSQL provides you with two tablespaces:

<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->

1. The `pg_default` is for storing user data.
2. The `pg_global`is for storing system data.

<!-- /wp:list -->

<!-- wp:paragraph -->

The following picture shows the default tablespaces:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4114} -->

![](./img/wp-content-uploads-2019-05-postgresql-tablespace.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Views

<!-- /wp:heading -->

<!-- wp:paragraph -->

[Views](https://www.postgresqltutorial.com/postgresql-views/) are named queries stored in the database. Besides the read-only views, PostgreSQL supports [updatable views](https://www.postgresqltutorial.com/postgresql-views/postgresql-updatable-views/).

<!-- /wp:paragraph -->

<!-- wp:image {"id":4115} -->

![](./img/wp-content-uploads-2019-05-postgresql-views.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Functions

<!-- /wp:heading -->

<!-- wp:paragraph -->

A [function](https://www.postgresqltutorial.com/postgresql-stored-procedures/) is a reusable block of SQL code that returns a scalar value of a set of rows.

<!-- /wp:paragraph -->

<!-- wp:image {"id":4119} -->

![](./img/wp-content-uploads-2019-05-postgresql-functions.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Operators

<!-- /wp:heading -->

<!-- wp:paragraph -->

Operators are symbolic functions. PostgreSQL allows you to define custom operators.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Casts

<!-- /wp:heading -->

<!-- wp:paragraph -->

Casts enable you to convert one data type into another data type. Casts backed by functions to perform the conversion. You can also create your casts to override the default casting provided by PostgreSQL.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Sequence

<!-- /wp:heading -->

<!-- wp:paragraph -->

[Sequences](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-sequences/) are used to manage auto-increment columns defined in a table as a [serial column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-serial/) or an [identity column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-identity-column/).

<!-- /wp:paragraph -->

<!-- wp:image {"id":4112} -->

![](./img/wp-content-uploads-2019-05-postgresql-sequence.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Extension

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL introduced extension concept since version 9.1 to wrap other objects including types, casts, indexes, functions, etc., into a single unit. The purpose of extensions is to make it easier to maintain.

<!-- /wp:paragraph -->

<!-- wp:image {"id":4118} -->

![](./img/wp-content-uploads-2019-05-postgresql-extension.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In this tutorial, you have learned the common PostgreSQL database and server objects. Just take a few minutes to explore these objects to get a brief overview of them before starting the next tutorial.

<!-- /wp:paragraph -->

---
title: 'PostgreSQL Server and Database Objects'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-server-and-database-objects/
ogImage: ./img/wp-content-uploads-2019-05-postgresql-databases.png
tableOfContents: true
---


**Summary**: in this tutorial, you are going to get familiar with the most common **server and database objects** provided by PostgreSQL. It is important to understand those objects and their functionality so you do not miss out on the cool features that you may wish to have in the system.





After [installing PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/ "Install PostgreSQL"), [loading sample database](https://www.postgresqltutorial.com/postgresql-getting-started/load-postgresql-sample-database/ "Load PostgreSQL Sample Database") and [connecting to the database server using _pgAdmin_ GUI application](https://www.postgresqltutorial.com/postgresql-getting-started/connect-to-postgresql-database/ "Connect to PostgreSQL Database"), you will see that PostgreSQL provides many server and database objects. To leverage the features of each object that PostgreSQL provides effectively, you should have a good understanding of what each object is and how to use it effectively.





Let's get familiar with these PostgreSQL server and database objects.





## Server service





When you install a PostgreSQL instance, you will have a corresponding PostgreSQL server service. The PostgreSQL server service is also known as the PostgreSQL server. You can install multiple PostgreSQL servers on a physical server using different ports and having different locations to store data.





## Databases





A database is a container of other objects such as tables, [views](https://www.postgresqltutorial.com/postgresql-views/), [functions](https://www.postgresqltutorial.com/postgresql-stored-procedures/), and [indexes](https://www.postgresqltutorial.com/postgresql-indexes/). You can create as many databases as you want inside a PostgreSQL server.





![](./img/wp-content-uploads-2019-05-postgresql-databases.png)





## Tables





Tables store data. A table belongs to a database and each database has multiple tables.





A special feature of PostgreSQL is table inheritance, meaning that a table (child table) can inherit from another table (parent table) so when you query data from the child table, the data from the parent table is also showing up.





![](./img/wp-content-uploads-2019-05-postgresql-tables.png)





## Schemas





A [schema](https://www.postgresqltutorial.com/postgresql-administration/postgresql-schema/) is a logical container of tables and other objects inside a database. Each PostgreSQL database may have multiple schemas.





![](./img/wp-content-uploads-2019-05-postgresql-schema.png)





## Tablespaces





Tablespaces are where PostgreSQL stores the data physically. [Tablespace](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-tablespace/ "PostgreSQL Tablespaces")s allow you to move your data to different physical locations across drivers easily by using simple commands.





By default, PostgreSQL provides you with two tablespaces:





1. The `pg_default` is for storing user data.
2. The `pg_global`is for storing system data.





The following picture shows the default tablespaces:





![](./img/wp-content-uploads-2019-05-postgresql-tablespace.png)





## Views





[Views](https://www.postgresqltutorial.com/postgresql-views/) are named queries stored in the database. Besides the read-only views, PostgreSQL supports [updatable views](https://www.postgresqltutorial.com/postgresql-views/postgresql-updatable-views/).





![](./img/wp-content-uploads-2019-05-postgresql-views.png)





## Functions





A [function](https://www.postgresqltutorial.com/postgresql-stored-procedures/) is a reusable block of SQL code that returns a scalar value of a set of rows.





![](./img/wp-content-uploads-2019-05-postgresql-functions.png)





## Operators





Operators are symbolic functions. PostgreSQL allows you to define custom operators.





## Casts





Casts enable you to convert one data type into another data type. Casts backed by functions to perform the conversion. You can also create your casts to override the default casting provided by PostgreSQL.





## Sequence





[Sequences](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-sequences/) are used to manage auto-increment columns defined in a table as a [serial column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-serial/) or an [identity column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-identity-column/).





![](./img/wp-content-uploads-2019-05-postgresql-sequence.png)





## Extension





PostgreSQL introduced extension concept since version 9.1 to wrap other objects including types, casts, indexes, functions, etc., into a single unit. The purpose of extensions is to make it easier to maintain.





![](./img/wp-content-uploads-2019-05-postgresql-extension.png)





In this tutorial, you have learned the common PostgreSQL database and server objects. Just take a few minutes to explore these objects to get a brief overview of them before starting the next tutorial.



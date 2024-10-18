---
title: 'PostgreSQL Views'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-views/
ogImage: ./img/wp-content-uploads-2015-05-PostgreSQL-View.png
tableOfContents: true
---
<!-- wp:image {"align":"right","id":2323} -->

![PostgreSQL Views](./img/wp-content-uploads-2015-05-PostgreSQL-View.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

A view is a named query stored in the PostgreSQL database server. A view is defined based on one or more tables which are known as base tables, and the query that defines the view is referred to as a defining query.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

After [creating a view](https://www.postgresqltutorial.com/postgresql-views/managing-postgresql-views/), you can query data from it as you would from a regular table. Behind the scenes, PostgreSQL will rewrite the query against the view and its defining query, executing it to retrieve data from the base tables.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Views do not store data except the [materialized views](https://www.postgresqltutorial.com/postgresql-views/postgresql-materialized-views/). In PostgreSQL, you can create special views called materialized views that store data physically and periodically refresh it from the base tables.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The materialized views are handy in various scenarios, providing faster data access to a remote server and serving as an effective caching mechanism.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Advantages of PostgreSQL views

<!-- /wp:heading -->

<!-- wp:paragraph -->

Views offer many advantages:

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Simplifying complex queries

<!-- /wp:heading -->

<!-- wp:paragraph -->

Views help simplify complex queries. Instead of dealing with [joins](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/), [aggregations](https://www.postgresqltutorial.com/postgresql-aggregate-functions/), or [filtering conditions](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-where/), you can query from views as if they were regular tables.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Typically, first, you create views based on complex queries and store them in the database. Then, you can use simple queries based on views instead of using complex queries.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Security and access control

<!-- /wp:heading -->

<!-- wp:paragraph -->

Views enable fine-grained control over data access. You can create views that expose subsets of data in the base tables, hiding sensitive information.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

This is particularly useful when you have applications that require access to distinct portions of the data.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Logical data independence

<!-- /wp:heading -->

<!-- wp:paragraph -->

If your applications use views, you can freely modify the structure of the base tables. In other words, views enable you to create a layer of abstraction over the underlying tables.

<!-- /wp:paragraph -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 1. Basic PostgreSQL views

<!-- /wp:heading -->

<!-- wp:paragraph -->

In this section, you'll learn about the fundamentals of PostgreSQL views including creating new views and removing existing views. These essential operations lay the strong foundation for using views effectively.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Create View](https://www.postgresqltutorial.com/postgresql-views/managing-postgresql-views/ "Managing PostgreSQL Views") - show you how to create a new view in your database.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Drop view](https://www.postgresqltutorial.com/postgresql-views/postgresql-drop-view/) - learn to drop one or more views from the database.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 2. Updatable views

<!-- /wp:heading -->

<!-- wp:paragraph -->

In this section, you'll learn how to create updatable views, which allow you to modify data through them. Additionally, you'll learn how to enforce data modification using the `WITH CHECK OPTION` clause.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Create updatable views](https://www.postgresqltutorial.com/postgresql-views/postgresql-updatable-views/) - show how to create updatable views.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [WITH CHECK OPTION](https://www.postgresqltutorial.com/postgresql-views/postgresql-views-with-check-option/) - guide you on how to enforce the data modification through a view based on a condition of the defining query.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 3. Materialized views

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Materialized views](https://www.postgresqltutorial.com/postgresql-views/postgresql-materialized-views/ "PosgreSQL Materialized Views") - introduce you to materialized views and provide you with the steps of creating and refreshing data for materialized views.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 4. Recursive views

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Create recursive views](https://www.postgresqltutorial.com/postgresql-views/postgresql-recursive-view/) - explain the recursive view and show you how to create a recursive view in PostgreSQL.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"}} -->

<!-- wp:heading -->

## Section 5. Managing views

<!-- /wp:heading -->

<!-- wp:paragraph -->

This section discusses the management of the PostgreSQL views including altering views and listing views in the current database.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Alter view](https://www.postgresqltutorial.com/postgresql-views/postgresql-alter-view/) - learn how to rename a view, modify the check option, change a column, and set a new schema for a view.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [List views in the current database](https://www.postgresqltutorial.com/postgresql-views/postgresql-list-views/) - show you how to list views in the current database using the `\dv` command in psql or querying from the `information_schema.views` view.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

---
title: 'PostgreSQL ALTER VIEW Statement'
redirectFrom: 
            - /docs/postgresql/postgresql-views/postgresql-alter-view/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ALTER VIEW` statement to change the properties of a view.



## Introduction to the PostgreSQL ALTER VIEW statement



The `ALTER VIEW` statement allows you to change various properties of a view.



If you want to change the view's defining query, use the `CREATE OR REPLACE VIEW` statement.



Here's the basic syntax of the `ALTER VIEW` statement:



```
ALTER VIEW [IF EXISTS] view_name
action;
```



In this syntax:



First, specify the name of the view that you want to change in the `ALTER VIEW` clause.



Second, use the `IF EXISTS` option to modify the view only if it exists. The statement will issue an error if you don't use the `IF EXISTS` and attempt to change a non-existing view. But when you use the `IF EXISTS`, the statement issues a notice instead. The `IF EXISTS` is optional.



Third, provide the action that you want to do with the view. The action includes renaming the view, setting the view option, and so on.



### Renaming a view



The following `ALTER VIEW` statement changes the name of a view to the new one:



```
ALTER VIEW [ IF EXISTS ] view_name
RENAME TO new_view_name;
```



In this syntax, you specify the new view name (`new_view_name`) after the `RENAME TO` clause. For example:



First, create a new view called `film_type` that includes the `title` and `rating`:



```
CREATE VIEW film_type
AS
SELECT title, rating
FROM film;
```



Second, change the view `film_type` to `film_rating`:



```
ALTER VIEW film_type RENAME TO film_rating;
```



### Changing the view option



The following `ALTER VIEW` statement changes the view option:



```
ALTER VIEW [ IF EXISTS ] view_name
SET ( view_option_name [= view_option_value] [, ... ] );
```



The `view_option_name` can be:



- `check_option`: change the check option. The valid value is `local` or `cascaded`.
- -
- `security_barrier`: change the security-barrier property of a view. The valid value is `true` or `false`.
- -
- `security_invoker`: change the security invoker of a view. The valid value is `true` or `false`.
- 


For example, the following changes the check option of the `film_rating` view to `local`:



```
ALTER VIEW film_rating
SET (check_option = local);
```



To view the change, you can use the `\d+` command in `psql`:



```
\d+ film_rating
```



Output:



```
                                 View "public.film_rating"
 Column |          Type          | Collation | Nullable | Default | Storage  | Description
--------+------------------------+-----------+----------+---------+----------+-------------
 title  | character varying(255) |           |          |         | extended |
 rating | mpaa_rating            |           |          |         | plain    |
View definition:
 SELECT title,
    rating
   FROM film;
Options: check_option=local
```



### Changing the view column



The following statement changes a column name of a view to a new one:



```
ALTER VIEW [ IF EXISTS ] view_name
RENAME [ COLUMN ] column_name TO new_column_name;
```



For example, the following statement changes the `title` column of the `film_rating` view to `film_title`:



```
ALTER VIEW film_rating
RENAME title TO film_title;
```



Here's the new view detail:



```
\d+ film_rating
```



```
                                   View "public.film_rating"
   Column   |          Type          | Collation | Nullable | Default | Storage  | Description
------------+------------------------+-----------+----------+---------+----------+-------------
 film_title | character varying(255) |           |          |         | extended |
 rating     | mpaa_rating            |           |          |         | plain    |
View definition:
 SELECT title AS film_title,
    rating
   FROM film;
Options: check_option=local
```



### Setting the new schema



The following statement sets the new schema for a view:



```
ALTER VIEW [ IF EXISTS ] view_name
SET SCHEMA new_schema;
```



For example:



First, create a new schema called `web`:



```
CREATE SCHEMA web;
```



Second, change the schema of the `film_rating` view to `web`:



```
ALTER VIEW film_rating
SET SCHEMA web;
```



Third, verify the change (in `psql`):



```
\d+ web.film_rating
```



Output:



```
                                    View "web.film_rating"
   Column   |          Type          | Collation | Nullable | Default | Storage  | Description
------------+------------------------+-----------+----------+---------+----------+-------------
 film_title | character varying(255) |           |          |         | extended |
 rating     | mpaa_rating            |           |          |         | plain    |
View definition:
 SELECT title AS film_title,
    rating
   FROM film;
Options: check_option=local
```



## Summary



- Use the `ALTER VIEW ... RENAME TO` statement to rename a view.
- -
- Use the `ALTER VIEW ... (SET check_option)` statement to change the check option of a view.
- -
- Use the `ALTER VIEW ... SET SCHEMA` statement to change the schema of a view.
- 

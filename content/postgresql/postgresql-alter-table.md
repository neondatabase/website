---
title: 'PostgreSQL ALTER TABLE'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-alter-table/
ogImage: ./img/wp-content-uploads-2013-05-PostgreSQL-ALTER-TABLE-SET-DEFAULT.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ALTER TABLE` statement to modify the structure of a table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL ALTER TABLE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

To change the structure of an existing table, you use PostgreSQL `ALTER TABLE` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the basic syntax of the `ALTER TABLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name action;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL provides you with many actions:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Add a column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-add-column/)
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Drop a column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-drop-column/)
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Change the data type of a column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-change-column-type/)
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Rename a column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-rename-column/)
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Set a default value for the column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-default-value/)
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Add a constraint to a column.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Rename a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-rename-table/)
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

To add a new column to a table, you use [`ALTER TABLE ADD COLUMN`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-add-column/) statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ADD COLUMN column_name datatype column_constraint;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To drop a column from a table, you use [`ALTER TABLE DROP COLUMN`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-drop-column/) statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
DROP COLUMN column_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To rename a column, you use the `ALTER TABLE RENAME COLUMN TO` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
RENAME COLUMN column_name
TO new_column_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To change a default value of the column, you use `ALTER TABLE ALTER COLUMN SET DEFAULT` or `DROP DEFAULT`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ALTER COLUMN column_name
[SET DEFAULT value | DROP DEFAULT];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To change the [`NOT NULL` constraint](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-not-null-constraint/), you use `ALTER TABLE ALTER COLUMN` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ALTER COLUMN column_name
[SET NOT NULL| DROP NOT NULL];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To add a `CHECK` constraint, you use `ALTER TABLE ADD CHECK` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ADD CHECK expression;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Generally, to add a constraint to a table, you use `ALTER TABLE ADD CONSTRAINT` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
ADD CONSTRAINT constraint_name constraint_definition;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To [rename a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-rename-table/) you use `ALTER TABLE RENAME TO` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE table_name
RENAME TO new_table_name;
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL ALTER TABLE examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/ "PostgreSQL CREATE TABLE") called `links` for practicing with the `ALTER TABLE` statement.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE IF EXISTS links;

CREATE TABLE links (
   link_id serial PRIMARY KEY,
   title VARCHAR (512) NOT NULL,
   url VARCHAR (1024) NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To [add a new column](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-add-column/) named `active`, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE links
ADD COLUMN active boolean;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement removes the `active`column from the `links`table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE links
DROP COLUMN active;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To change the name of the `title` column to `link_title`, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE links
RENAME COLUMN title TO link_title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement adds a new column named `target`to the `links`table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE links
ADD COLUMN target VARCHAR(10);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To set `_blank` as the default value for the `target`column in the `links`table, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE links
ALTER COLUMN target
SET DEFAULT '_blank';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you [insert the new row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `links` table without specifying a value for the `target` column, the `target` column will take the `_blank` as the default value. For example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO links (link_title, url)
VALUES('PostgreSQL Tutorial','https://www.postgresqltutorial.com/');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement selects data from the `links` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM links;
```

<!-- /wp:code -->

<!-- wp:image {"id":543} -->

![PostgreSQL ALTER TABLE SET DEFAULT](./img/wp-content-uploads-2013-05-PostgreSQL-ALTER-TABLE-SET-DEFAULT.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement adds a `CHECK`condition to the `target`column so that the `target`column only accepts the following values: `_self`, `_blank`, `_parent`, and `_top`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE links
ADD CHECK (target IN ('_self', '_blank', '_parent', '_top'));
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you attempt to insert a new row that violates the `CHECK` constraint set for the `target`column, PostgreSQL will issue an error as shown in the following example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO links(link_title,url,target)
VALUES('PostgreSQL','http://www.postgresql.org/','whatever');
```

<!-- /wp:code -->

<!-- wp:code {"language":"shell"} -->

```
ERROR:  new row for relation "links" violates check constraint "links_target_check"
DETAIL:  Failing row contains (2, PostgreSQL, http://www.postgresql.org/, whatever).DETAIL:  Failing row contains (2, PostgreSQL, http://www.postgresql.org/, whatever).
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement adds a `UNIQUE` constraint to the `url` column of the `links` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE links
ADD CONSTRAINT unique_url UNIQUE ( url );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement attempts to insert the url that already exists:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO links(link_title,url)
VALUES('PostgreSQL','https://www.postgresqltutorial.com/');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It causes an error due to the unique_url constraint:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
ERROR:  duplicate key value violates unique constraint "unique_url"
DETAIL:  Key (url)=(https://www.postgresqltutorial.com/) already exists.
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement changes the name of the `links` table to `urls`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER TABLE links
RENAME TO urls;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to use the PostgreSQL `ALTER TABLE` statement to change the structure of an existing table.

<!-- /wp:paragraph -->

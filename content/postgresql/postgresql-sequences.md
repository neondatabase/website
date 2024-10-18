---
title: 'PostgreSQL Sequences'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-sequences/
ogImage: ./img/wp-content-uploads-2019-05-PostgreSQL-Sequence-simple-example.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL sequences and how to use a sequence object to generate a sequence of numbers.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL sequences

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a sequence is a database object that allows you to generate a sequence of unique integers.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Typically, you use a sequence to generate a unique identifier for a primary key in a table. Additionally, you can use a sequence to generate unique numbers across tables.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To create a new sequence, you use the `CREATE SEQUENCE` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL CREATE SEQUENCE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `CREATE SEQUENCE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE SEQUENCE [ IF NOT EXISTS ] sequence_name
    [ AS { SMALLINT | INT | BIGINT } ]
    [ INCREMENT [ BY ] increment ]
    [ MINVALUE minvalue | NO MINVALUE ]
    [ MAXVALUE maxvalue | NO MAXVALUE ]
    [ START [ WITH ] start ]
    [ CACHE cache ]
    [ [ NO ] CYCLE ]
    [ OWNED BY { table_name.column_name | NONE } ]
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### sequence_name

<!-- /wp:heading -->

<!-- wp:paragraph -->

Specify the name of the sequence after the `CREATE SEQUENCE` clause. The `IF NOT EXISTS` conditionally creates a new sequence only if it does not exist.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The sequence name must be distinct from any other sequences, tables, [indexes](https://www.postgresqltutorial.com/postgresql-indexes/), [views](https://www.postgresqltutorial.com/postgresql-views/), or foreign tables in the same schema.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### \[ AS { SMALLINT | INT | BIGINT } ]

<!-- /wp:heading -->

<!-- wp:paragraph -->

Specify the [data type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-data-types/) of the sequence. The valid data type is `SMALLINT`, [`INT`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/), and `BIGINT`. The default data type is `BIGINT` if you skip it.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The data type of the sequence which determines the sequence's minimum and maximum values.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### \[ INCREMENT \[ BY ] increment ]

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `increment` specifies which value to add to the current sequence value.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A positive number will make an ascending sequence whereas a negative number will form a descending sequence.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The default increment value is 1.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### \[ MINVALUE minvalue | NO MINVALUE ]

<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->

### \[ MAXVALUE maxvalue | NO MAXVALUE ]

<!-- /wp:heading -->

<!-- wp:paragraph -->

Define the minimum value and maximum value of the sequence. If you use `NO MINVALUE` and `NO MAXVALUE`, the sequence will use the default value.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For an ascending sequence, the default maximum value is the maximum value of the data type of the sequence and the default minimum value is 1.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In the case of a descending sequence, the default maximum value is -1 and the default minimum value is the minimum value of the data type of the sequence.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### \[ START \[ WITH ] start ]

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `START` clause specifies the starting value of the sequence.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The default starting value is `minvalue` for ascending sequences and `maxvalue` for descending ones.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### cache

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `CACHE` determines how many sequence numbers are preallocated and stored in memory for faster access. One value can be generated at a time.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

By default, the sequence generates one value at a time i.e., no cache.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### CYCLE | NO CYCLE

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `CYCLE` allows you to restart the value if the limit is reached. The next number will be the minimum value for the ascending sequence and the maximum value for the descending sequence.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you use `NO CYCLE`, when the limit is reached, attempting to get the next value will result in an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `NO CYCLE` is the default if you don't explicitly specify `CYCLE` or `NO CYCLE`.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### OWNED BY table_name.column_name

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `OWNED BY` clause allows you to associate the table column with the sequence so that when you drop the column or table, PostgreSQL will automatically drop the associated sequence.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that when you use the `SERIAL` pseudo-type for a column of a table, behind the scenes, PostgreSQL automatically creates a sequence associated with the column.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL CREATE SEQUENCE examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of creating sequences to get a better understanding.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Creating an ascending sequence example

<!-- /wp:heading -->

<!-- wp:paragraph -->

This statement uses the `CREATE SEQUENCE` statement to create a new ascending sequence starting from 100 with an increment of 5:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE SEQUENCE mysequence
INCREMENT 5
START 100;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To get the next value from the sequence, you use the `nextval()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT nextval('mysequence');
```

<!-- /wp:code -->

<!-- wp:image {"id":4228} -->

![PostgreSQL Sequence - simple example](./img/wp-content-uploads-2019-05-PostgreSQL-Sequence-simple-example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

If you execute the statement again, you will get the next value from the sequence:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT nextval('mysequence');
```

<!-- /wp:code -->

<!-- wp:image {"id":4229,"sizeSlug":"large"} -->

![PostgreSQL Sequence - nextval example](./img/wp-content-uploads-2019-05-PostgreSQL-Sequence-nextval-example.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 2) Creating a descending sequence example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement creates a descending sequence from 3 to 1 with the cycle option:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE SEQUENCE three
INCREMENT -1
MINVALUE 1
MAXVALUE 3
START 3
CYCLE;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

When you execute the following statement multiple times, you will see the number starting from 3, 2, 1 and back to 3, 2, 1, and so on:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT nextval('three');
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Creating a sequence associated with a table column

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) named `order_details`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE order_details(
    order_id SERIAL,
    item_id INT NOT NULL,
    item_text VARCHAR NOT NULL,
    price DEC(10,2) NOT NULL,
    PRIMARY KEY(order_id, item_id)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, create a new sequence associated with the `item_id` column of the `order_details` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE SEQUENCE order_item_id
START 10
INCREMENT 10
MINVALUE 10
OWNED BY order_details.item_id;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) three order line items into the `order_details` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO
    order_details(order_id, item_id, item_text, price)
VALUES
    (100, nextval('order_item_id'),'DVD Player',100),
    (100, nextval('order_item_id'),'Android TV',550),
    (100, nextval('order_item_id'),'Speaker',250);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this statement, we used the `nextval()` function to fetch the item id value from the `order_item_id` sequence.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fourth, [query](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/) data from the `order_details` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    order_id,
    item_id,
    item_text,
    price
FROM
    order_details;
```

<!-- /wp:code -->

<!-- wp:image {"id":4227} -->

![PostgreSQL Sequence in a table](./img/wp-content-uploads-2019-05-PostgreSQL-Sequence-in-a-table.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Listing all sequences in a database

<!-- /wp:heading -->

<!-- wp:paragraph -->

To list all sequences in the current database, you use the following query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    relname sequence_name
FROM
    pg_class
WHERE
    relkind = 'S';
```

<!-- /wp:code -->

<!-- wp:heading -->

## Deleting sequences

<!-- /wp:heading -->

<!-- wp:paragraph -->

If a sequence is associated with a table column, it will be automatically dropped once the table column is removed or the table is dropped.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

You can also remove a sequence manually using the `DROP SEQUENCE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP SEQUENCE [ IF EXISTS ] sequence_name [, ...]
[ CASCADE | RESTRICT ];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the sequence which you want to drop. The `IF EXISTS` option conditionally deletes the sequence if it exists. If you want to drop multiple sequences at once, you can use a list of comma-separated sequence names.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Then, use the `CASCADE` option if you want to drop objects that depend on the sequence recursively, objects that depend on the dependent objects, and so on.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading {"level":3} -->

### PostgreSQL DROP SEQUENCE statement examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

This statement drops the table `order_details`. Since the sequence `order_item_id` associates with the `item_id` of the `order_details`, it is also dropped automatically:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP TABLE order_details;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tutorial, you have learned about PostgreSQL sequences and how to use a sequence object to generate a list of sequences.

<!-- /wp:paragraph -->

---
prevPost: using-postgresql-serial-to-create-auto-increment-column
nextPost: postgresql-identity-column
createdAt: 2019-05-17T10:06:48.000Z
title: 'PostgreSQL Sequences'
redirectFrom: 
            - /postgresql/postgresql-tutorial/postgresql-sequences
            - /postgresql/postgresql-sequences
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-Sequence-simple-example.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about the PostgreSQL sequences and how to use a sequence object to generate a sequence of numbers.

## Introduction to PostgreSQL sequences

In PostgreSQL, a sequence is a database object that allows you to generate a sequence of unique integers.

Typically, you use a sequence to generate a unique identifier for a primary key in a table. Additionally, you can use a sequence to generate unique numbers across tables.

To create a new sequence, you use the `CREATE SEQUENCE` statement.

## PostgreSQL CREATE SEQUENCE statement

The following illustrates the syntax of the `CREATE SEQUENCE` statement:

```sql
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

### sequence_name

Specify the name of the sequence after the `CREATE SEQUENCE` clause. The `IF NOT EXISTS` conditionally creates a new sequence only if it does not exist.

The sequence name must be distinct from any other sequences, tables, [indexes](/postgresql/postgresql-indexes), [views](/postgresql/postgresql-views), or foreign tables in the same schema.

### \[ AS \{ SMALLINT | INT | BIGINT } ]

Specify the [data type](/postgresql/postgresql-data-types) of the sequence. The valid data type is `SMALLINT`, [`INT`](/postgresql/postgresql-tutorial/postgresql-interval), and `BIGINT`. The default data type is `BIGINT` if you skip it.

The data type of the sequence which determines the sequence's minimum and maximum values.

### \[ INCREMENT \[ BY ] increment ]

The `increment` specifies which value to add to the current sequence value.

A positive number will make an ascending sequence whereas a negative number will form a descending sequence.

The default increment value is 1.

### \[ MINVALUE minvalue | NO MINVALUE ]

### \[ MAXVALUE maxvalue | NO MAXVALUE ]

Define the minimum value and maximum value of the sequence. If you use `NO MINVALUE` and `NO MAXVALUE`, the sequence will use the default value.

For an ascending sequence, the default maximum value is the maximum value of the data type of the sequence and the default minimum value is 1.

In the case of a descending sequence, the default maximum value is -1 and the default minimum value is the minimum value of the data type of the sequence.

### \[ START \[ WITH ] start ]

The `START` clause specifies the starting value of the sequence.

The default starting value is `minvalue` for ascending sequences and `maxvalue` for descending ones.

### cache

The `CACHE` determines how many sequence numbers are preallocated and stored in memory for faster access. One value can be generated at a time.

By default, the sequence generates one value at a time i.e., no cache.

### CYCLE | NO CYCLE

The `CYCLE` allows you to restart the value if the limit is reached. The next number will be the minimum value for the ascending sequence and the maximum value for the descending sequence.

If you use `NO CYCLE`, when the limit is reached, attempting to get the next value will result in an error.

The `NO CYCLE` is the default if you don't explicitly specify `CYCLE` or `NO CYCLE`.

### OWNED BY table_name.column_name

The `OWNED BY` clause allows you to associate the table column with the sequence so that when you drop the column or table, PostgreSQL will automatically drop the associated sequence.

Note that when you use the `SERIAL` pseudo-type for a column of a table, behind the scenes, PostgreSQL automatically creates a sequence associated with the column.

## PostgreSQL CREATE SEQUENCE examples

Let's take some examples of creating sequences to get a better understanding.

### 1) Creating an ascending sequence example

This statement uses the `CREATE SEQUENCE` statement to create a new ascending sequence starting from 100 with an increment of 5:

```sql
CREATE SEQUENCE mysequence
INCREMENT 5
START 100;
```

To get the next value from the sequence, you use the `nextval()` function:

```sql
SELECT nextval('mysequence');
```

![PostgreSQL Sequence - simple example](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-Sequence-simple-example.png)

If you execute the statement again, you will get the next value from the sequence:

```sql
SELECT nextval('mysequence');
```

![PostgreSQL Sequence - nextval example](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-Sequence-nextval-example.png)

### 2) Creating a descending sequence example

The following statement creates a descending sequence from 3 to 1 with the cycle option:

```sql
CREATE SEQUENCE three
INCREMENT -1
MINVALUE 1
MAXVALUE 3
START 3
CYCLE;
```

When you execute the following statement multiple times, you will see the number starting from 3, 2, 1 and back to 3, 2, 1, and so on:

```sql
SELECT nextval('three');
```

### 3) Creating a sequence associated with a table column

First, [create a new table](/postgresql/postgresql-create-table) named `order_details`:

```sql
CREATE TABLE order_details(
    order_id SERIAL,
    item_id INT NOT NULL,
    item_text VARCHAR NOT NULL,
    price DEC(10,2) NOT NULL,
    PRIMARY KEY(order_id, item_id)
);
```

Second, create a new sequence associated with the `item_id` column of the `order_details` table:

```sql
CREATE SEQUENCE order_item_id
START 10
INCREMENT 10
MINVALUE 10
OWNED BY order_details.item_id;
```

Third, [insert](/postgresql/postgresql-insert) three order line items into the `order_details` table:

```sql
INSERT INTO
    order_details(order_id, item_id, item_text, price)
VALUES
    (100, nextval('order_item_id'),'DVD Player',100),
    (100, nextval('order_item_id'),'Android TV',550),
    (100, nextval('order_item_id'),'Speaker',250);
```

In this statement, we used the `nextval()` function to fetch the item id value from the `order_item_id` sequence.

Fourth, [query](/postgresql/postgresql-select) data from the `order_details` table:

```sql
SELECT
    order_id,
    item_id,
    item_text,
    price
FROM
    order_details;
```

![PostgreSQL Sequence in a table](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-Sequence-in-a-table.png)

## Listing all sequences in a database

To list all sequences in the current database, you use the following query:

```sql
SELECT
    relname sequence_name
FROM
    pg_class
WHERE
    relkind = 'S';
```

## Deleting sequences

If a sequence is associated with a table column, it will be automatically dropped once the table column is removed or the table is dropped.

You can also remove a sequence manually using the `DROP SEQUENCE` statement:

```sql
DROP SEQUENCE [ IF EXISTS ] sequence_name [, ...]
[ CASCADE | RESTRICT ];
```

In this syntax:

- First, specify the name of the sequence which you want to drop. The `IF EXISTS` option conditionally deletes the sequence if it exists. If you want to drop multiple sequences at once, you can use a list of comma-separated sequence names.
-
- Then, use the `CASCADE` option if you want to drop objects that depend on the sequence recursively, objects that depend on the dependent objects, and so on.

### PostgreSQL DROP SEQUENCE statement examples

This statement drops the table `order_details`. Since the sequence `order_item_id` associates with the `item_id` of the `order_details`, it is also dropped automatically:

```sql
DROP TABLE order_details;
```

In this tutorial, you have learned about PostgreSQL sequences and how to use a sequence object to generate a list of sequences.

---
title: The hstore extension
subtitle: Manage key-value pairs in Postgres using hstore
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.368Z'
---

The `hstore` extension is a flexible way to store and manipulate sets of key-value pairs within a single Postgres value. It is particularly useful for semi-structured data or data that does not have a rigid schema.

<CTA />

This guide covers the basics of the `hstore` extension - how to enable it, how to store and query key-value pairs, and perform operations on hstore data with examples. `hstore` is valuable in scenarios where schema-less data needs to be stored efficiently, such as in configurations, application settings, or any situation where the data structure may evolve over time.

<Admonition type="note">
    `hstore` is an open-source extension for Postgres that can be installed on any compatible Postgres instance. Detailed installation instructions and compatibility information can be found at [PostgreSQL Extensions](https://www.postgresql.org/docs/current/contrib.html).
</Admonition>

**Version availability**

Please refer to the [list of all extensions](https://neon.tech/docs/extensions/pg-extensions) available in Neon for up-to-date information.

Currently, Neon uses version `1.8` of the `hstore` extension for all Postgres versions.

## Enable the `hstore` extension

Enable the extension by running the following SQL statement in your Postgres client:

```sql
CREATE EXTENSION IF NOT EXISTS hstore;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Example usage

**Creating a table with hstore column**

Consider a table that stores the product catalog for an electronics shop. Each product has a name and a set of attributes that describe it. The attributes for each product are not fixed and may change over time. This makes `hstore` a good choice for storing this data.

```sql
CREATE TABLE product (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255),
   attributes HSTORE
);
```

**Inserting data**

Inserting data into an `hstore` column is done by providing a string containing key-value pairs into the column.

```sql
INSERT INTO product (name, attributes)
VALUES
    ('Desktop', 'brand => HP, price => 900, processor => "Intel Core i5", storage => "1TB HDD"'),
    ('Tablet', 'brand => Apple, price => 500, os => iOS, screen_size => 10.5'),
    ('Smartwatch', 'brand => Garmin, price => 250, water_resistant => true, battery_life => "7 days"'),
    ('Camera', 'brand => Nikon, price => 1200, megapixels => 24, video_resolution => "4K"'),
    ('Laptop', 'brand => Dell, price => 1200, screen_size => 15.6'),
    ('Smartphone', 'brand => Samsung, price => 800, os => Android'),
    ('Headphones', 'brand => Sony, price => 150, wireless => true, color => "Black"');
```

`hstore` stores both keys and values for each record as strings (values can be nulls). For numeric attributes like price and megapixels, they are cast to strings when inserted into the table.

**Querying `hstore` data**

`hstore` columns can be referenced as regular columns in a query. To access the attributes in an `hstore` column, we use the `->` operator.

For example, to retrieve the name and brand for all products with price less than 1000, we can run the following query:

```sql
SELECT name, attributes->'brand' AS brand
FROM product
WHERE (attributes->'price')::INT < 1000;
```

Since the `price` attribute is stored as a string, we need to cast it to an integer before comparing it to 1000. This query returns the following:

```text
| name       | brand   |
|------------|---------|
| Desktop    | HP      |
| Tablet     | Apple   |
| Smartwatch | Garmin  |
| Smartphone | Samsung |
| Headphones | Sony    |
```

## Operators for `hstore` data

`hstore` offers a variety of operators for manipulating and querying key-value pairs. We go over some examples below.

**Check if a key exists**

The `?` operator is used to check if an `hstore` contains a specific key.

```sql
SELECT id, name
FROM product
WHERE attributes ? 'os';
```

This query returns the following:

```text
| id | name       |
|----|------------|
| 2  | Tablet     |
| 6  | Smartphone |
```

**Check if an hstore contains another hstore**

The `@>` operator is used to check if the `hstore` on the left contains the right operand. For example, the query below looks for products that have a `brand` attribute of `Apple`.

```sql
SELECT id, name
FROM product
WHERE attributes @> 'brand => "Apple"';
```

This query returns the following:

```text
| id | name   |
|----|--------|
| 2  | Tablet |
```

**Concatenating two hstore values**

The `||` operator is used to concatenate two `hstore` values. For example, the query below updates the attributes for the product with name `Laptop`.

```sql
UPDATE product
SET attributes = attributes || 'weight => 2.5'
WHERE name = 'Laptop' AND attributes -> 'brand' = 'Dell';
```

To verify, we can run the query below.

```sql
SELECT id, name, attributes -> 'weight' AS weight
FROM product
WHERE name = 'Laptop' AND attributes -> 'brand' = 'Dell';
```

This query returns the following:

```text
| id | name   | weight |
|----|--------|--------|
|  5 | Laptop | 2.5    |
```

**Check if a hstore contains any of the specified keys**

The `?|` operator is used to check if an `hstore` contains any of the keys specified in the right operand. For example, the query below returns all products that have either a `screen_size` or `megapixels` attribute.

```sql
SELECT id, name
FROM product
WHERE attributes ?| ARRAY['screen_size', 'megapixels'];
```

This query returns the following:

```text
| id | name   |
|----|--------|
| 2  | Tablet |
| 4  | Camera |
| 5  | Laptop |
```

## `Hstore` functions

The `hstore` extension also adds functions to manipulate the `hstore` data. We go over some examples below.

**Retrieve all keys**

The `akeys` function returns an array of all the keys in an `hstore` value. For example, the query below returns all the keys for Dell laptop products.

```sql
SELECT id, name, akeys(attributes) AS keys
FROM product
WHERE name = 'Laptop' AND attributes -> 'brand' = 'Dell';
```

This query returns the following:

```text
| id | name   | keys                             |
|----|--------|----------------------------------|
| 1  | Laptop | {brand,price,weight,screen_size} |
```

**Convert hstore to JSON**

The `hstore_to_json` function converts an `hstore` value to `JSON`. For example, the query below converts the `attributes` column to `JSON` for all products with a `brand` attribute of `Apple`.

```sql
SELECT hstore_to_json(attributes) AS attributes
FROM product
WHERE attributes -> 'brand' = 'Apple';
```

**Extract all keys and values**

The `each` function returns the set of key-value pairs for an `hstore` value. For example, the query below returns each attribute of the Nikon Camera as a separate row.

```sql
SELECT id, (each(attributes)).*
FROM product
WHERE name = 'Camera' AND attributes -> 'brand' = 'Nikon';
```

This query returns the following:

```text
| id | key              | value |
|----|------------------|-------|
| 1  | brand            | Nikon |
| 2  | price            | 1200  |
| 3  | megapixels       | 24    |
| 4  | video_resolution | 4K    |
```

## Comparing `hstore` with `JSON`

The `hstore` and `JSON` data types can be both used to store semi-structured data. `Hstore` has a flat data model — both keys and values must be strings. This makes it more efficient for simple key-value data.

In constrast, `JSON` supports a variety of data types, and can also store nested data structures. This makes it more flexible, but trades off some performance.

## Indexing and performance

Indexing can improve the performance of queries involving `hstore` data, particularly for large datasets.

`Hstore` supports the regular `btree` and `hash` indexes. However, this is only useful for equality comparisons of the entire `hstore` value, since these indexes have no knowledge of its substructure.

```sql
CREATE INDEX btree_idx_attributes ON product USING hash (attributes);
```

For queries that involve key-level filtering, like the `@>` or the `?` operators, the `GIN` and `GIST` indexes are more useful. The indexes can be created as shown in this example:

```sql
CREATE INDEX gin_idx_attributes ON product USING gin (attributes);
```

## Conclusion

The `hstore` extension offers a powerful and flexible way to handle semi-structured data in Postgres. This guide provides an overview of using `hstore`, including creating records and querying on its attributes. It also covers some of the common operators and functions available for `hstore` data.

## Resources

- [PostgreSQL hstore documentation](https://www.postgresql.org/docs/current/hstore.html)

<NeedHelp/>

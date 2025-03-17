---
title: The ltree extension
subtitle: Store and query hierarchical tree-like structures in Postgres
enableTableOfContents: true
updatedOn: '2025-03-07T22:12:43.457Z'
---

The `ltree` extension provides a data type for representing labels of data stored in a hierarchical tree-like structure. It offers specialized functions and operators for efficiently traversing and searching through these tree structures, making it ideal for modeling hierarchical relationships in your data.

<CTA />

This guide covers the basics of the `ltree` extension - how to enable it, create hierarchical data structures, and query tree data with examples. The `ltree` extension is valuable for scenarios like organizational charts, file systems, category hierarchies, or any data that naturally fits into a parent-child relationship model.

<Admonition type="note">
    `ltree` is an open-source extension for Postgres that can be installed on any compatible Postgres instance. Detailed information about the extension is available in the [PostgreSQL Documentation](https://www.postgresql.org/docs/current/ltree.html).
</Admonition>

**Version availability**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date information.

## Enable the `ltree` extension

Enable the extension by running the following SQL statement in your Postgres client:

```sql
CREATE EXTENSION IF NOT EXISTS ltree;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Understanding ltree data

The `ltree` data type represents a path of labels separated by dots, similar to file system paths. Each label consists of alphanumeric characters and underscores, with a maximum length of 255 characters.

Here are some examples of valid `ltree` values:

```
world
world.europe.uk
world.europe.uk.london
tech.database.postgres.extensions
```

The dots in these paths represent hierarchical relationships, with each segment being a label in the tree. This structure allows for efficient traversal and querying of hierarchical data.

## Example usage

Let's explore how to use the `ltree` extension with a practical example of a product category hierarchy for an e-commerce platform.

**Creating a table with ltree column**

First, let's create a table to store our product categories:

```sql
CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path ltree NOT NULL
);
```

**Inserting hierarchical data**

Now, let's insert some sample data representing a product category hierarchy:

```sql
INSERT INTO product_categories (name, path) VALUES
    ('Electronics', 'electronics'),
    ('Computers', 'electronics.computers'),
    ('Laptops', 'electronics.computers.laptops'),
    ('Gaming Laptops', 'electronics.computers.laptops.gaming'),
    ('Business Laptops', 'electronics.computers.laptops.business'),
    ('Desktop Computers', 'electronics.computers.desktops'),
    ('Smartphones', 'electronics.smartphones'),
    ('Android Phones', 'electronics.smartphones.android'),
    ('iOS Phones', 'electronics.smartphones.ios'),
    ('Clothing', 'clothing'),
    ('Men''s Clothing', 'clothing.mens'),
    ('Women''s Clothing', 'clothing.womens'),
    ('Children''s Clothing', 'clothing.childrens');
```

## Querying ltree data

The `ltree` extension provides several operators and functions for querying hierarchical data. Let's explore some common query patterns:

**Finding all descendants of a node**

To find all subcategories under "Computers", we can use the `<@` operator, which checks if the path on the right is an ancestor of the path on the left:

```sql
SELECT id, name, path
FROM product_categories
WHERE path <@ 'electronics.computers';
```

This query returns:

```text
| id | name               | path                                   |
|----|--------------------|----------------------------------------|
| 2  | Computers          | electronics.computers                  |
| 3  | Laptops            | electronics.computers.laptops          |
| 4  | Gaming Laptops     | electronics.computers.laptops.gaming   |
| 5  | Business Laptops   | electronics.computers.laptops.business |
| 6  | Desktop Computers  | electronics.computers.desktops         |
```

**Finding all ancestors of a node**

To find all parent categories of "Gaming Laptops", we can use the `@>` operator, which checks if the path on the left is an ancestor of the path on the right:

```sql
SELECT id, name, path
FROM product_categories
WHERE path @> 'electronics.computers.laptops.gaming';
```

This query returns:

```text
| id | name           | path                                     |
|----|----------------|------------------------------------------|
| 1  | Electronics    | electronics                              |
| 2  | Computers      | electronics.computers                    |
| 3  | Laptops        | electronics.computers.laptops            |
| 4  | Gaming Laptops | electronics.computers.laptops.gaming     |
```

**Finding nodes at a specific level**

To find all categories at the second level of the hierarchy, we can use the `nlevel()` function, which returns the number of labels in an `ltree` path:

```sql
SELECT id, name, path
FROM product_categories
WHERE nlevel(path) = 2;
```

This query returns:

```text
| id | name               | path                   |
|----|--------------------|------------------------|
| 2  | Computers          | electronics.computers  |
| 7  | Smartphones        | electronics.smartphones|
| 11 | Men's Clothing     | clothing.mens          |
| 12 | Women's Clothing   | clothing.womens        |
| 13 | Children's Clothing| clothing.childrens     |
```

**Pattern matching with wildcards**

The `ltree` extension supports pattern matching using the `~` operator with a `lquery` pattern. The `lquery` syntax allows for wildcards and other pattern matching features:

```sql
-- Find all laptop categories (using * wildcard)
SELECT id, name, path
FROM product_categories
WHERE path ~ 'electronics.computers.laptops.*';
```

This query returns:

```text
| id | name             | path                                   |
|----|------------------|----------------------------------------|
| 4  | Gaming Laptops   | electronics.computers.laptops.gaming   |
| 5  | Business Laptops | electronics.computers.laptops.business |
```

You can also use more complex patterns:

```sql
-- Find categories that match a specific pattern
-- * matches zero or more labels
SELECT id, name, path
FROM product_categories
WHERE path ~ '*.*.ios'
```

This would match paths like `electronics.smartphones.ios`.

## Advanced ltree operations

The `ltree` extension provides several advanced operations for working with hierarchical data:

**Extracting subpaths**

You can extract specific parts of an `ltree` path using the `subpath()` function:

```sql
-- Extract the first two labels from the path
SELECT id, name, subpath(path, 0, 2) AS subpath
FROM product_categories
WHERE path = 'electronics.computers.laptops.gaming';
```

This query returns:

```text
| id | name           | subpath               |
|----|----------------|-----------------------|
| 4  | Gaming Laptops | electronics.computers |
```

**Finding the least common ancestor**

The `lca()` function finds the least common ancestor of a set of paths:

```sql
-- Find the least common ancestor of gaming laptops and business laptops
SELECT lca(
    'electronics.computers.laptops.gaming'::ltree,
    'electronics.computers.laptops.business'::ltree
) AS common_ancestor;
```

This query returns:

```text
| common_ancestor               |
|-------------------------------|
| electronics.computers.laptops |
```

**Calculating the distance between nodes**

You can calculate the "distance" between two nodes in the tree:

```sql
-- Calculate the distance between two categories
SELECT
    nlevel('electronics.computers.laptops.gaming'::ltree) +
    nlevel('electronics.smartphones.android'::ltree) -
    2 * nlevel(lca(
        'electronics.computers.laptops.gaming'::ltree,
        'electronics.smartphones.android'::ltree
    )) AS distance;
```

This query returns:

```text
| distance |
|----------|
| 5        |
```

The distance is calculated as the sum of the levels of both paths minus twice the level of their least common ancestor.

## Indexing ltree data

For efficient querying of `ltree` data, especially in large datasets, you should create appropriate indexes:

```sql
-- Create a GiST index for ancestor/descendant queries
CREATE INDEX idx_path_gist ON product_categories USING GIST (path);

-- Create a B-tree index for equality queries
CREATE INDEX idx_path_btree ON product_categories USING BTREE (path);
```

The GiST index is particularly useful for ancestor/descendant queries using the `@>` and `<@` operators, while the B-tree index is better for equality comparisons.

## Practical applications

The `ltree` extension is useful in many real-world scenarios:

1. **Organization charts**: Representing company hierarchies with departments, teams, and employees
2. **File systems**: Modeling directory structures
3. **E-commerce categories**: As demonstrated in our example
4. **Taxonomies**: Biological classifications, knowledge categorization
5. **Menu structures**: Website navigation hierarchies
6. **Geographic hierarchies**: Continent > Country > State > City

## Conclusion

The `ltree` extension provides a powerful way to store and query hierarchical data in Postgres. Its specialized data type and operators make it efficient to work with tree-like structures, offering significant advantages over traditional recursive queries or adjacency list models.

By using `ltree`, you can simplify complex hierarchical data operations, improve query performance, and create more maintainable code for applications that deal with nested structures.

## Resources

- [PostgreSQL ltree documentation](https://www.postgresql.org/docs/current/ltree.html)
- [Indexing strategies for ltree](https://www.postgresql.org/docs/current/ltree.html#id-1.11.7.31.7)

<NeedHelp/>

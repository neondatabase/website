---
title: The cube extension
subtitle: Store and query multidimensional points and cubes in Postgres
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.749Z'
tag: new
---

The cube extension for Postgres provides a specialized data type for representing multidimensional "cubes", which are, more generally, n-dimensional boxes or points. This makes it useful for applications dealing with multidimensional data, such as geographic information systems (GIS) storing coordinates (latitude, longitude, altitude), business intelligence (BI) applications analyzing data across various dimensions, or scientific computing tasks involving vector operations.

<CTA />

The cube extension allows you to define points and hyperrectangles in n-dimensional space and perform various operations like distance calculations, containment checks, and overlap detection.

## Enable the `cube` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS cube;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Understanding `cube` data

The `cube` extension primarily revolves around the `cube` data type and a set of operators and functions to work with it. The `cube` data type can represent both n-dimensional points (cubes with zero volume) and n-dimensional cubes (defined by two opposite corners).

### Multidimensional points

A point is a cube where the "lower-left" and "upper-right" corners are identical.
Syntax:

- `cube(ARRAY[x1, x2, ..., xn])`
- `'(x1, x2, ..., xn)'::cube`

  ```sql
  -- A 3-dimensional point
  SELECT cube(ARRAY[1.0, 2.5, 3.0]) AS point_from_array;
  -- Result: (1,2.5,3)

  SELECT '(1.0, 2.5, 3.0)'::cube AS point_from_string;
  -- Result: (1,2.5,3)
  ```

### Multidimensional cubes (ranges/boxes)

A cube is defined by two diagonally opposite corner points. The order of corners doesn't matter on input, `cube` internally stores them in a canonical "lower-left" to "upper-right" form.
Syntax:

- `cube(ARRAY[ll_x1, ..., ll_xn], ARRAY[ur_x1, ..., ur_xn])`
- `'(ll_x1, ..., ll_xn), (ur_x1, ..., ur_xn)'::cube`

  ```sql
  -- A 2-dimensional cube (a rectangle)
  SELECT cube(ARRAY[1.0, 1.0], ARRAY[5.0, 5.0]) AS cube_from_arrays;
  -- Result: (1,1),(5,5)

  SELECT ' (1.0, 1.0), (5.0, 5.0) '::cube AS cube_from_string; -- Whitespace is ignored
  -- Result: (1,1),(5,5)

  -- A 3-dimensional cube
  SELECT cube(ARRAY[0,0,0], ARRAY[1,1,1]) AS unit_cube_3d;
  -- Result: (0,0,0),(1,1,1)
  ```

Cube values are stored internally as 64-bit floating-point numbers.

## Example usage

Let's consider a table to store information about various items, including their spatial bounding boxes or specific point locations.

### Creating a table with a `cube` column

```sql
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location_or_bounds CUBE
);
```

### Inserting `cube` data

    ```sql
    INSERT INTO items (name, location_or_bounds) VALUES
        ('Sensor A', '(10.0, 20.5, 5.0)'),            -- A 3D point location
        ('Warehouse Zone 1', '(0,0),(50,100)'),       -- A 2D rectangular area
        ('Temperature Range', '(-10.0), (40.0)'),     -- A 1D cube/interval
        ('Sensor B', '(-10.0, 40.0)'),                -- A 2D point
        ('Pressure Sensor', cube(array[15.2, 30.1, 2.3])), -- Another 3D point
        ('Shipping Box X', cube(array[0,0,0], array[1,2,1.5])); -- A 3D box
    ```

### Querying `cube` data

The `cube` extension provides a rich set of operators and functions for querying.

**Direct creation in SELECT statements**

You can create `cube` values on the fly:

```sql
SELECT cube(array[1,2,3]) AS point_3d, cube(0,10) AS interval_1d;
```

Output:

```text
| point_3d    | interval_1d   |
|-------------|---------------|
| (1, 2, 3)   | (0),(10)      |
```

**Containment and overlap operators**

- `@>`: Contains (does the left cube contain the right cube?)
- `<@`: Is contained by (is the left cube contained by the right cube?)
- `&&`: Overlaps (do the two cubes have any common points?)

```sql
-- Find items within a specific 2D region '(5,5),(60,120)'
SELECT name, location_or_bounds
FROM items
WHERE location_or_bounds <@ '(5,5),(60,120)';
-- No rows returned (as no item is fully contained in this region)

-- Find 2D/3D regions that contain the point (12.0, 25.0)
SELECT name, location_or_bounds
FROM items
WHERE location_or_bounds @> '(12.0, 25.0)';
-- Warehouse Zone 1 | (0,0),(50,100)

-- Find items whose bounds overlap with the 3D cube '(0,0,0),(10,10,10)'
SELECT name, location_or_bounds
FROM items
WHERE location_or_bounds && '(0,0,0),(10,10,10)';
-- Warehouse Zone 1 | (0,0),(50,100)
-- Temperature Range | (-10),(40)
-- Shipping Box X | (0,0,0),(1,2,1.5)
```

> Notice that 'Sensor B' is excluded from the last query's results, while 'Temperature Range' (a 1D interval) is included. 'Sensor B' (a 2D point) does not overlap the 3D query cube, but 'Temperature Range' does when its dimensionality is considered.

**Distance operators**

The `cube` extension provides several distance metrics:

- `<->`: Euclidean distance
- `<#>`: Taxicab (Manhattan or L-1) distance
- `<=>`: Chebyshev (L-infinity or maximum coordinate) distance

<Admonition type="note" title="Distance metrics">
| Distance | Description |
|----------|-------------|
Euclidean | The straight-line distance between two points in n-dimensional space. |
| Taxicab | The sum of the absolute differences of their coordinates. This is the distance a taxi would travel on a grid-like street layout. |
| Chebyshev | The maximum absolute difference between the coordinates of the two points. This is useful in chess-like movements where diagonal moves are allowed. |
</Admonition>

The `cube_distance(cube1, cube2)` function is equivalent to the `<->` operator.

```sql
SELECT cube_distance('(0,0)'::cube, '(3,4)'::cube) AS euclidean_dist;
-- Output: 5 (sqrt(3^2 + 4^2))

SELECT '(0,0)'::cube <-> '(3,4)'::cube AS euclidean_dist;
-- Output: 5 (sqrt(3^2 + 4^2))

SELECT '(0,0,0)'::cube <#> '(1,2,3)'::cube AS taxicab_dist;
-- Output: 6 (1+2+3)

SELECT '(0,0)'::cube <=> '(3,-4)'::cube AS chebyshev_dist;
-- Output: 4 (max(|3-0|, |-4-0|))
```

<Admonition type="note" title="Cube Creation: String vs. Function">
    Be mindful of how you create `cube` values, as it impacts their dimensionality:

    *   `'(x,y)'::cube` (string casting) creates a **2D point** `(x,y)`.
    *   `cube(x,y)` (function call) creates a **1D interval** from `x` to `y`, effectively `(x),(y)`.

    This difference will affect functions like `cube_distance`. For example:
    *   `cube_distance('(0,0)'::cube, '(3,4)'::cube)` is 5 (distance between 2D points).
    *   `cube_distance(cube(0,0), cube(3,4))` is 3 (distance between 1D point `(0)` and 1D interval `(3),(4)`).
    *   `cube(0,0)` is a 1D point as it has both lower and upper bounds at 0.

    To create an n-dimensional point using the `cube()` function, pass an array: `cube(array[x,y,...])`.

</Admonition>

**Coordinate extraction operators**

- `-> integer`: Extracts the N-th coordinate of a point. Returns `NULL` if the cube is not a point or has fewer than N dimensions.
- `~> integer`: Extracts coordinate from a cube's representation.
  - `N = 2*k - 1`: Lower bound of the k-th dimension.
  - `N = 2*k`: Upper bound of the k-th dimension.

```sql
-- Extract coordinates from Sensor A's location (a point)
SELECT
    location_or_bounds -> 1 AS x,
    location_or_bounds -> 2 AS y,
    location_or_bounds -> 3 AS z
FROM items WHERE name = 'Sensor A';
-- x  |    y | z
-- 10 | 20.5 | 5

-- Extract bounds of Warehouse Zone 1 (a 2D cube)
-- x_low (dim 1, lower): ~> 1
-- x_high (dim 1, upper): ~> 2
-- y_low (dim 2, lower): ~> 3
-- y_high (dim 2, upper): ~> 4
SELECT
    location_or_bounds ~> 1 AS x_low,
    location_or_bounds ~> 2 AS x_high,
    location_or_bounds ~> 3 AS y_low,
    location_or_bounds ~> 4 AS y_high
FROM items WHERE name = 'Warehouse Zone 1';
-- x_low | x_high | y_low | y_high
-- 0     | 50     | 0     | 100
```

## Functions and operators

### Utility functions

- `cube_dim(cube)`: Returns the number of dimensions of the cube.
- `cube_is_point(cube)`: Returns `true` if the cube is a point (zero volume), `false` otherwise.

  ```sql
  SELECT cube_dim('(1,2,3)'::cube); -- Result: 3
  SELECT cube_is_point('(1,2,3)'::cube); -- Result: true
  SELECT cube_is_point('(1,2)'::cube); -- Result: true
  SELECT cube_is_point(cube(1,2)); -- Result: false (cube function creates a 1D interval)
  SELECT cube_dim(cube(1,2)); -- Result: 1 (1D interval)
  SELECT cube_is_point(cube(ARRAY[1,2])); -- Result: true (array creates a 2D point)
  SELECT cube_dim(cube(ARRAY[1,2])); -- Result: 2 (2D point)
  SELECT cube_is_point('(1),(2)'::cube); -- Result: false
  ```

### Coordinate functions

- `cube_ll_coord(cube, N)`: Returns the N-th coordinate of the lower-left corner.
- `cube_ur_coord(cube, N)`: Returns the N-th coordinate of the upper-right corner.

  ```sql
  -- Get y-coordinate of lower-left corner for Warehouse Zone 1
  SELECT cube_ll_coord(location_or_bounds, 2) AS y_ll
  FROM items WHERE name = 'Warehouse Zone 1';
  -- Result: 0

  -- Get x-coordinate of upper-right corner for Shipping Box X
  SELECT cube_ur_coord(location_or_bounds, 1) AS x_ur
  FROM items WHERE name = 'Shipping Box X';
  -- Result: 1
  ```

### Union and Intersection

- `cube_union(cube1, cube2)`: Returns the smallest cube enclosing both input cubes.
- `cube_inter(cube1, cube2)`: Returns the intersection of two cubes. Returns `NULL` if they don't intersect.

  ```sql
  SELECT cube_union('(0,0),(2,2)', '(1,1),(3,3)') AS union_result;
  -- Output: (0,0),(3,3)


  SELECT cube_inter('(0,0),(2,2)', '(1,1),(3,3)') AS intersection_result;
  -- Output: (1,1),(2,2)
  ```

### Enlarging cubes

`cube_enlarge(c_in cube, r double precision, n_dims integer)`: Enlarges (or shrinks if `r` is negative) the input cube `c_in` by radius `r` in its first `n_dims` dimensions. If `n_dims` is greater than `c_in`'s dimensions and `r > 0`, new dimensions are added with `(-r, r)` ranges.

```sql
-- Enlarge a 2D point (0,0) by radius 1 in 2 dimensions
SELECT cube_enlarge('(0,0)', 1.0, 2);
-- Output: (-1,-1),(1,1)

SELECT cube_enlarge('(0,0)', 1.0, 3);
-- Output: (-1,-1,-1),(1,1,1)

-- Enlarge a 1D cube (0),(2) by 0.5, extending to 2 dimensions
SELECT cube_enlarge('(0),(2)'::cube, 0.5, 2);
-- Output: (-0.5,-0.5),(2.5,0.5)
```

### Creating cubes from subsets of dimensions

`cube_subset(target_cube cube, dim_indices integer[])`: Creates a new cube using only the dimensions specified by `dim_indices` from the `target_cube`.

```sql
SELECT cube_subset('(1,2,3),(4,5,6)', ARRAY[1,3]) AS subset_cube;
-- Output: (1,3),(4,6) (extracts 1st and 3rd dimensions)

SELECT cube_subset('(1,2,3),(4,5,6)', ARRAY[3]) AS subset_cube;
-- Output: (3),(6) (extracts only the 3rd dimension)
```

## Indexing `cube` data

For efficient querying of `cube` data, especially on large tables, [GiST indexes](/postgresql/postgresql-indexes/postgresql-index-types#gist-indexes) are highly recommended. They can make queries faster when using operators like `&&`, `@>`, `<@`, and the distance operators.

```sql
CREATE INDEX idx_items_location_bounds_gist ON items USING GIST (location_or_bounds);
```

**Nearest neighbor searches**

GiST indexes enable efficient nearest neighbor searches using the distance operators in an `ORDER BY` clause:

```sql
-- Find the 3 items closest to the point (5,5,5)
SELECT name, location_or_bounds, location_or_bounds <-> '(5,5,5)'::cube AS distance
FROM items
ORDER BY location_or_bounds <-> '(5,5,5)'::cube
LIMIT 3;
-- Warehouse Zone 1 | (0,0),(50,100) | 5.0
-- Shipping Box X | (0,0,0),(1,2,1.5) | 6.103277807866851
-- Temperature Range | (-10),(40) | 7.0710678118654755
```

## Practical applications

1.  **Geographic Information systems (GIS)**:
    - Storing latitude/longitude/altitude points.
    - Defining bounding boxes for map features.
2.  **Business Intelligence (BI) / OLAP**:
    - Representing data points in a multidimensional space (e.g., sales by `product_category_id`, `region_id`, `time_id`).
    - Filtering data based on ranges in multiple dimensions.
3.  **Scientific computing**: Storing points or regions in n-dimensional parameter spaces for experiments or simulations.
4.  **Time-series data with multidimensional attributes**: Storing sensor readings where each reading has multiple values (e.g., temperature, humidity, pressure) at a specific time.

    **Example:**

    ```sql
    CREATE TABLE sensor_log (
      ts TIMESTAMPTZ NOT NULL,
      device_id INT,
      metrics CUBE -- e.g., (temperature, humidity, pressure)
    );

    INSERT INTO sensor_log (ts, device_id, metrics) VALUES
      (NOW(), 101, '(22.5, 55.2, 1013.1)');

    -- Find logs where temperature (1st dim) was between 20-25
    -- and humidity (2nd dim) was between 50-60
    SELECT * FROM sensor_log
    WHERE metrics <@ cube(array[20,50,-1e6], array[25,60,1e6]); -- We keep 3rd dim a large range
    ```

## Conclusion

The `cube` extension provides a powerful and versatile data type for handling multidimensional data within Postgres. Its specialized operators and functions, combined with GiST indexing, enable efficient storage, querying, and analysis of n-dimensional points and regions. This makes it a valuable tool for a wide range of applications, from GIS to scientific computing and beyond.

## Resources

- [PostgreSQL `cube` documentation](https://www.postgresql.org/docs/current/cube.html)
- Distances:
  - [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance)
  - [Taxicab/Manhattan geometry](https://en.wikipedia.org/wiki/Taxicab_geometry)
  - [Chebyshev distance](https://en.wikipedia.org/wiki/Chebyshev_distance)

<NeedHelp/>

---
title: The earthdistance extension
subtitle: Calculate great-circle distances between points on Earth in Postgres
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.750Z'
tag: new
---

The `earthdistance` extension for Postgres provides functions to calculate great-circle distances between points on the Earth's surface. This is essential for applications requiring geospatial distance calculations, such as location-based services, mapping applications, logistics, and any system that needs to find nearby points or calculate travel distances.

<Admonition type="important" title="Accuracy and assumptions">
The `earthdistance` extension primarily assumes a spherical Earth model for its calculations, which provides good approximations for many use cases. It relies on the [`cube`](/docs/extensions/cube) extension for some of its underlying operations.

You may consider using the [`postgis` extension](/docs/extensions/postgis) if accurate geospatial calculations are critical for your application.
</Admonition>

<CTA />

## Enable the `earthdistance` extension

To use `earthdistance`, you first need to enable it and its dependency, the [`cube` extension](/docs/extensions/cube). You can do this by running the following `CREATE EXTENSION` statements in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client like [psql](/docs/connect/query-with-psql-editor):

```sql
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## Core concepts

The `earthdistance` extension offers two main ways to represent geographic points and calculate distances:

1.  **Using the `earth` type:** This approach involves converting latitude and longitude coordinates into a special `earth` data type (which is a domain over `cube`, representing a point in 3D Cartesian coordinates based on a spherical earth model). Distances are calculated in meters.
2.  **Using the native `point` type:** This approach uses the built-in `point` type in Postgres, where the first component is longitude and the second is latitude. It provides a specific operator for distance calculation, which returns results in statute miles.

### The `earth` data type and associated functions

- `earth` data type

  Represents a point on the Earth's surface. It's internally a `cube` point representing a 3D Cartesian coordinate. You don't usually interact with its internal representation directly but use helper functions.

- `ll_to_earth(latitude double precision, longitude double precision)` returns `earth`

  Converts latitude and longitude (in degrees) to an `earth` data type value.

- `earth_distance(p1 earth, p2 earth)` returns double precision

  Calculates the great-circle distance in **meters** between two `earth` points.

  ```sql
  -- Distance between London and Paris
  SELECT earth_distance(
      ll_to_earth(51.5074, -0.1278), -- London
      ll_to_earth(48.8566, 2.3522)   -- Paris
  ) AS distance_meters;
  -- Output: 343942.5946120387
  ```

- `earth_box(location earth, radius_meters double precision)` returns `cube`

  Computes a bounding box (as a `cube` type) that encloses all points within the specified `radius_meters` from the given `location`. This is primarily used for optimizing radius searches with [GiST indexes](/postgresql/postgresql-indexes/postgresql-index-types#gist-indexes).

  ```sql
  -- Create a bounding box for a 10km radius around London
  SELECT earth_box(ll_to_earth(51.5074, -0.1278), 10000) AS search_box;
  ```

  When used in queries, you typically use the `<@` operator from the `cube` extension. The `<@` operator means "is contained by".

  The expression `ll_to_earth(lat, lon) <@ earth_box(center_point_earth, search_radius_meters)` checks if the specific geographic point (represented as an `earth` type, which is a `cube` point) is contained within the square bounding `earth_box` (also a `cube`).

  For instance, if `point_A` is `ll_to_earth(51.5, -0.1)` (a point in London) and `london_box` is `earth_box(ll_to_earth(51.5074, -0.1278), 10000)`, then `point_A <@ london_box` would be `true`.

  ```sql
  SELECT ll_to_earth(51.5, -0.1) <@ earth_box(ll_to_earth(51.5074, -0.1278), 10000) AS is_within_box;
  -- Output: true
  ```

### Using the `point` data type

- `point` data type

  A built-in Postgres type representing a 2D point in Cartesian coordinates. In the context of `earthdistance`, the first component is longitude and the second is latitude.

- `point1 <@> point2` returns double precision

  Calculates the great-circle distance in **statute miles** between two points.

  ```sql
  -- Distance between San Francisco (-122.4194 lon, 37.7749 lat)
  -- and New York (-74.0060 lon, 40.7128 lat)
  SELECT point '(-122.4194, 37.7749)' <@> point '(-74.0060, 40.7128)' AS distance_miles;
  -- Output: 2565.6899113306895
  ```

## Example usage

Now that we've seen the core functions, let's create and populate a sample table to demonstrate practical usage scenarios. This table will store location data with latitude and longitude.

```sql
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

INSERT INTO locations (name, latitude, longitude) VALUES
  ('San Francisco', 37.7749, -122.4194),
  ('New York', 40.7128, -74.0060),
  ('Los Angeles', 34.0522, -118.2437),
  ('Chicago', 41.8781, -87.6298),
  ('London', 51.5074, -0.1278),
  ('Tokyo', 35.6895, 139.6917),
  ('Sydney', -33.8688, 151.2093);
```

## Practical usage scenarios

With our sample `locations` table, we can now explore common geospatial queries.

### Calculating distance between two specific points

Using `ll_to_earth()` and `earth_distance()`:

```sql
SELECT
    a.name AS location_a,
    b.name AS location_b,
    earth_distance(
        ll_to_earth(a.latitude, a.longitude),
        ll_to_earth(b.latitude, b.longitude)
    ) AS distance_meters
FROM locations a, locations b
WHERE a.name = 'San Francisco' AND b.name = 'New York';
```

Output:

```text
| location_a    | location_b | distance_meters     |
|---------------|------------|---------------------|
| San Francisco | New York   | 4133731.792059527   |
```

### Finding locations within a given radius

Find all locations within 8000 kilometers of London using the `earth` type functions.

```sql
SELECT
    name,
    earth_distance(
        ll_to_earth(latitude, longitude),
        ll_to_earth(51.5074, -0.1278) -- London's coordinates
    ) / 1000.0 AS distance_from_london_km -- Convert meters to km
FROM locations
WHERE earth_distance(
        ll_to_earth(latitude, longitude),
        ll_to_earth(51.5074, -0.1278)
    ) < 8000 * 1000 -- Radius in meters
ORDER BY distance_from_london_km;
```

Output:

```text
| name          | distance_from_london_km |
|---------------|-------------------------|
| London        | 0.0                     |
| New York      | 5576.4892261332425      |
| Chicago       | 6360.125481207209       |
```

## Indexing for performance

For applications with many locations that require frequent radius searches or nearest-neighbor queries, indexing is crucial. GiST indexes are used with the `earth` type functions (`ll_to_earth`, `earth_box`).

1.  **Create a GiST index on the `earth` representation of your coordinates:**
    This index will be on the result of the `ll_to_earth()` function applied to your latitude and longitude columns.

    ```sql
    CREATE INDEX locations_earth_coords_idx
    ON locations
    USING GIST (ll_to_earth(latitude, longitude));
    ```

2.  **Perform an indexed radius search:**

    Let's find locations within 1000 km of San Francisco `(37.7749° N, -122.4194° W)`.

    ```sql
    SELECT
        name,
        earth_distance(
            ll_to_earth(latitude, longitude),
            ll_to_earth(37.7749, -122.4194)
        ) / 1000.0 AS distance_from_sf_km
    FROM locations
    WHERE
        -- This part uses the GiST index for a fast coarse filter
        ll_to_earth(latitude, longitude) <@ earth_box(ll_to_earth(37.7749, -122.4194), 1000 * 1000) -- Radius in meters
        -- This part is the exact distance check for refinement (necessary as earth_box is a square)
        AND earth_distance(
            ll_to_earth(latitude, longitude),
            ll_to_earth(37.7749, -122.4194)
        ) < 1000 * 1000 -- Radius in meters
    ORDER BY distance_from_sf_km;
    ```

    **Explanation of the indexed query:**

    - The `ll_to_earth(latitude, longitude) <@ earth_box(...)` condition uses the GiST index. The `earth_box` function creates a square bounding box. The index quickly finds points whose `earth` representation falls within this box.
    - The second condition, `earth_distance(...) < radius`, is crucial. It performs the precise great-circle distance calculation for the candidate rows selected by the index, filtering them to the exact circular radius. This is because the `earth_box` provides a rough filter, and the `earth_distance` provides the exact filter.

## Conclusion

The `earthdistance` extension is a powerful and convenient tool in Postgres for applications dealing with geographic locations. It simplifies the calculation of great-circle distances, enabling features like location-based searching and distance filtering directly within your database. By understanding its core functions, data representations, and how to leverage GiST indexing, you can build efficient and effective geospatial queries.

## Resources

- PostgreSQL official documentation:
  - [earthdistance](https://www.postgresql.org/docs/current/earthdistance.html)
  - [cube](https://www.postgresql.org/docs/current/cube.html)
  - [point](https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-GEOMETRIC-POINTS)
- [Cube extension](/docs/extensions/cube)
- [Greater-circle distance](https://en.wikipedia.org/wiki/Great-circle_distance)

<NeedHelp/>

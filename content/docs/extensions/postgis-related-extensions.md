---
title: PostGIS-related extensions
subtitle: Improve geospatial functionality with additional PostGIS extensions
enableTableOfContents: true
updatedOn: '2024-07-23T13:01:46.234Z'
---

PostGIS adds support for geospatial data in PostgreSQL, providing both data types and functions to store and analyze it effectively. The Postgres ecosystem includes multiple extensions built on top of PostGIS, to further enhance its capabilities. This guide introduces you to some of these extensions supported by Neon:

- [pgrouting](#pgrouting)
- [H3_PostGIS](#h3-and-h3-postgis)
- [PostGIS SFCGAL](#postgis-sfcgal)
- [PostGIS Tiger Geocoder](#postgis-tiger-geocoder)

<CTA />

These extensions offer specialized functionality for routing, hierarchical geospatial indexing, advanced geometric operations, and geocoding. We'll explore how to enable these extensions and provide examples of common use cases.

<Admonition type="note">
    These extensions are open-source and can be installed on any Neon Project using the instructions below. For detailed installation instructions, please refer to the documentation for each extension. 
</Admonition>

**Version availability:**

For up-to-date information on supported versions for each extension, refer to the [list of all extensions](https://neon.tech/docs/extensions/pg-extensions) available in Neon.

## Enable the PostGIS extension

The extensions listed below typically need `PostGIS` to be installed first, or work in conjunction with it. You can enable `PostGIS` by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## pgrouting

`pgrouting` extends PostGIS to provide geospatial routing and network analysis functionality. It's useful for applications involving transportation networks, logistics planning, and urban mobility analysis.

### Enable the pgrouting extension

Enable the extension by running the following SQL statement:

```sql
CREATE EXTENSION IF NOT EXISTS pgrouting;
```

### Example usage

Let's consider a scenario where we need to find the shortest path between two points in a road network.

**Create a table with road network data**

```sql
-- Create a table to store road network data
DROP TABLE IF EXISTS road_network;
CREATE TABLE road_network (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    source INTEGER,
    target INTEGER,
    cost FLOAT,
    reverse_cost FLOAT,
    geom GEOMETRY(LINESTRING, 4326)
);

-- Insert sample data, representing a simplified road network
INSERT INTO road_network (name, source, target, cost, reverse_cost, geom) VALUES
    ('Main St', 1, 2, 0.5, 0.5, ST_GeomFromText('LINESTRING(-73.98 40.75, -73.97 40.75)', 4326)),
    ('Broadway', 2, 3, 0.8, 0.8, ST_GeomFromText('LINESTRING(-73.97 40.75, -73.96 40.76)', 4326)),
    ('5th Ave', 4, 5, 0.7, 0.7, ST_GeomFromText('LINESTRING(-73.97 40.77, -73.98 40.76)', 4326)),
    ('Central Park W', 5, 1, 0.9, 0.9, ST_GeomFromText('LINESTRING(-73.98 40.76, -73.98 40.75)', 4326)),
    ('3rd Ave', 2, 5, 1.3, 1.3, ST_GeomFromText('LINESTRING(-73.97 40.75, -73.98 40.76)', 4326)),
    ('Park Dr N', 4, 1, 1.4, 1.4, ST_GeomFromText('LINESTRING(-73.97 40.77, -73.98 40.75)', 4326));
```

This dataset represents a simplified road network with 6 road segments connecting 5 intersections.

**Use pgrouting to find the shortest path between nodes**

We can use pgrouting's `pgr_dijkstra` function to find the shortest path between two nodes:

```sql
SELECT
    seq,
    node,
    edge,
    route.cost,
    agg_cost,
    rn.name AS road_name
FROM pgr_dijkstra(
    'SELECT id, source, target, cost FROM road_network',
    2, -- start node
    4, -- end node
    directed := false
) AS route
LEFT JOIN road_network rn ON route.edge = rn.id
ORDER BY seq;
```

This query returns the sequence of edges that form the shortest path from node 2 to node 4.

```text
 seq | node | edge | cost | agg_cost | road_name
-----+------+------+------+----------+-----------
   1 |    2 |    1 |  0.5 |        0 | Main St
   2 |    1 |    6 |  1.4 |      0.5 | Park Dr N
   3 |    4 |   -1 |    0 |      1.9 |
```

**Use pgrouting to find alternative routes**

For navigation applications, we might need to find multiple alternative routes. We can use the `pgr_ksp` function to find the K-shortest paths between two nodes:

```sql
SELECT
    route.path_id,
    route.path_seq,
    route.node,
    route.edge,
    route.cost,
    route.agg_cost,
    rn.name AS road_name
FROM pgr_ksp(
    'SELECT id, source, target, cost, reverse_cost FROM road_network',
    1, -- start node
    4, -- end node
    2, -- number of alternative paths
    directed := false,
    heap_paths := false
) AS route
LEFT JOIN road_network rn ON route.edge = rn.id
ORDER BY route.path_id, route.path_seq;
```

This query returns two sequence of edges, that can be used to go from node 1 to node 4.

```text
 path_id | path_seq | node | edge | cost | agg_cost |   road_name
---------+----------+------+------+------+----------+----------------
       1 |        1 |    1 |    6 |  1.4 |        0 | Park Dr N
       1 |        2 |    4 |   -1 |    0 |      1.4 |
       2 |        1 |    1 |    4 |  0.9 |        0 | Central Park W
       2 |        2 |    5 |    3 |  0.7 |      0.9 | 5th Ave
       2 |        3 |    4 |   -1 |    0 |      1.6 |
```

## H3 and H3 PostGIS

H3 is a hierarchical geospatial indexing system. It divides the earth's surface into hexagonal cells at multiple resolutions, and provides a unique addressing system for location data. It is used for applications like optimizing delivery zones and service areas, geospatial aggregation, and analytics.

The H3 functionality is split into two extensions: `h3` and `h3_postgis`.

### Enable the H3 and H3_PostGIS extensions

Enable these extensions by running the following SQL statements:

```sql
CREATE EXTENSION IF NOT EXISTS h3 CASCADE;
CREATE EXTENSION IF NOT EXISTS h3_postgis CASCADE;
```

### Example usage

We will show how to use H3 to analyze ride-sharing data in a large city, focusing on the distribution of pickup locations.

**Create a table with pickup location data**

```sql
DROP TABLE IF EXISTS ride_pickups;
CREATE TABLE ride_pickups (
    id SERIAL PRIMARY KEY,
    pickup_time TIMESTAMP,
    pickup_location GEOMETRY(POINT, 4326)
);

-- Insert sample data
INSERT INTO ride_pickups (pickup_time, pickup_location) VALUES
    ('2023-06-15 08:30:00', ST_SetSRID(ST_MakePoint(-73.9812, 40.7657), 4326)),
    ('2023-06-15 09:15:00', ST_SetSRID(ST_MakePoint(-73.9815, 40.7659), 4326)),
    ('2023-06-15 10:00:00', ST_SetSRID(ST_MakePoint(-73.9810, 40.7655), 4326)),
    ('2023-06-15 11:30:00', ST_SetSRID(ST_MakePoint(-73.9934, 40.7505), 4326)),
    ('2023-06-15 12:45:00', ST_SetSRID(ST_MakePoint(-73.9937, 40.7508), 4326)),
    ('2023-06-15 14:00:00', ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326)),
    ('2023-06-15 15:30:00', ST_SetSRID(ST_MakePoint(-73.9619, 40.7681), 4326)),
    ('2023-06-15 17:00:00', ST_SetSRID(ST_MakePoint(-73.9622, 40.7683), 4326)),
    ('2023-06-15 18:30:00', ST_SetSRID(ST_MakePoint(-73.9840, 40.7549), 4326)),
    ('2023-06-15 20:00:00', ST_SetSRID(ST_MakePoint(-73.9887, 40.7229), 4326));
```

This dataset represents the pickup locations for a ride-sharing service in a large city.

**Convert points to H3 indexes**

We can use the `h3_lat_lng_to_cell` function to convert lat/long coordinates to H3 indexes:

```sql
SELECT
    h3_lat_lng_to_cell(pickup_location, 9) AS h3_index
FROM ride_pickups
ORDER BY RANDOM()
LIMIT 5;
```

This query converts each pickup location to an H3 index at resolution 9.

```text
    h3_index
-----------------
 892a100d2cbffff
 892a1072893ffff
 892a100d693ffff
 892a100d2cbffff
 892a100d66bffff
(5 rows)
```

**Aggregate data by H3 cells**

Let's aggregate the pickup data into H3 cells at resolution 8 (average hexagon edge length of ~461 meters) to identify hotspots:

```sql
SELECT
    h3_lat_lng_to_cell(pickup_location, 8) AS h3_index,
    COUNT(*) AS pickup_count,
    MIN(pickup_time) AS earliest_pickup,
    MAX(pickup_time) AS latest_pickup
FROM ride_pickups
GROUP BY 1
ORDER BY pickup_count DESC;
```

This query groups the dataset by the H3 index, and then provides a count of pickups, as well as the earliest and latest pickup times for each cell.

```text
    h3_index     | pickup_count |   earliest_pickup   |    latest_pickup
-----------------+--------------+---------------------+---------------------
 882a100d65fffff |            3 | 2023-06-15 08:30:00 | 2023-06-15 10:00:00
 882a100d2dfffff |            2 | 2023-06-15 11:30:00 | 2023-06-15 12:45:00
 882a100d69fffff |            2 | 2023-06-15 15:30:00 | 2023-06-15 17:00:00
 882a107289fffff |            1 | 2023-06-15 14:00:00 | 2023-06-15 14:00:00
 882a1072cbfffff |            1 | 2023-06-15 20:00:00 | 2023-06-15 20:00:00
 882a100d67fffff |            1 | 2023-06-15 18:30:00 | 2023-06-15 18:30:00
(6 rows)
```

**Compute neighbour H3 cells**

For cells with high demand, you might want to identify neighboring cells to recommend the areas to cover. The `h3_grid_disk` function can be used to fetch neighboring cells within `k` distance from the given cell:

```sql
WITH top_cell AS (
    SELECT
        h3_lat_lng_to_cell(pickup_location, 9) AS h3_index,
        COUNT(*) AS pickup_count
    FROM ride_pickups
    GROUP BY 1
    ORDER BY pickup_count DESC
    LIMIT 1
)
SELECT
    h3_cell_to_lat_lng(neighbor) AS neighbor_centroid
FROM top_cell, h3_grid_disk(h3_index, 1) AS neighbor
WHERE neighbor != h3_index;
```

This query identifies the hexagon cell for the top pickup location and then fetches the neighboring cells adjacent to it.

```text
            neighbor_centroid
-----------------------------------------
 (-73.98431385752089,40.76847107223484)
 (-73.98634907959108,40.76577167962788)
 (-73.984106944923,40.7631879413235)
 (-73.9798298121748,40.76330338643407)
 (-73.97779433265362,40.766002576302085)
 (-73.98003624329262,40.7685865237991)
(6 rows)
```

## PostGIS SFCGAL

PostGIS SFCGAL provides advanced 2D and 3D spatial operations using the SFCGAL library. It's useful for complex geometric calculations, 3D operations, and working with solid objects.

### Enable the PostGIS SFCGAL extension

Enable the extension by running the following SQL statement:

```sql
CREATE EXTENSION IF NOT EXISTS postgis_sfcgal CASCADE;
```

### Example usage

We will illustrate the use of SFCGAL to perform some urban planning tasks.

**Create a table with building data**

```sql
CREATE TABLE buildings (
    id SERIAL PRIMARY KEY,
    name TEXT,
    height FLOAT,
    footprint GEOMETRY(POLYGON, 4326)
);

-- Insert sample data (simplified for brevity)
INSERT INTO buildings (name, height, footprint) VALUES
    ('Office Tower', 100, ST_GeomFromText('POLYGON((0 0, 0 50, 30 50, 30 0, 0 0))', 4326)),
    ('Shopping Mall', 20, ST_GeomFromText('POLYGON((100 0, 100 80, 150 80, 150 0, 100 0))', 4326)),
    ('Residential Block', 45, ST_GeomFromText('POLYGON((200 0, 200 40, 240 40, 240 0, 200 0))', 4326));
```

This query creates a table to store building footprints and heights.

**Use SFCGAL to calculate volumes**

We can use SFCGAL to calculate the volume of buildings by extruding their footprints:

```sql
SELECT
    name,
    height,
    ST_Area(footprint) AS base_area,
    ST_Volume(ST_Extrude(footprint, 0, 0, height)) AS volume
FROM buildings;
```

This query calculates the volume of each building by extruding its 2D footprint to its height, and then calculating the volume of the resulting 3D object.

```text
       name        | height | base_area | volume
-------------------+--------+-----------+--------
 Office Tower      |    100 |      1500 | 150000
 Shopping Mall     |     20 |      4000 |  80000
 Residential Block |     45 |      1600 |  72000
(3 rows)
```

**Use SFCGAL to perform 3D intersection**

SFCGAL can be used to perform 3D intersections. For example, an important urban planning task is to examine how buildings might obstruct views from one another.

We can use SFCGAL to create 3D models of our buildings and then check for intersections between these models and sight lines.

```sql
WITH building_centroids AS (
    SELECT
        id,
        name,
        ST_Centroid(footprint) AS centroid
    FROM buildings
),
sight_lines AS (
    SELECT
        a.id AS id_a,
        a.name AS name_a,
        b.id AS id_b,
        b.name AS name_b,
        ST_MakeLine(a.centroid, b.centroid) AS sight_line
    FROM building_centroids a
    CROSS JOIN building_centroids b
    WHERE a.id < b.id
)
SELECT
    s.name_a,
    s.name_b,
    CASE
        WHEN EXISTS (
            SELECT 1
            FROM buildings c
            WHERE c.id NOT IN (s.id_a, s.id_b)
              AND ST_3DIntersects(
                  ST_Extrude(c.footprint, 0, 0, c.height),
                  ST_Extrude(s.sight_line, 0, 0, GREATEST(
                      (SELECT height FROM buildings WHERE id = s.id_a),
                      (SELECT height FROM buildings WHERE id = s.id_b)
                  ))
              )
        ) THEN 'Potential view obstruction'
        ELSE 'Clear view'
    END AS view_status
FROM sight_lines s;
```

This query does the following:

1. It creates 3D models of all buildings using `ST_Extrude`.
2. For each pair of buildings, it creates a line from the center of one building to the center of another, representing a potential sight line.
3. It uses `ST_3DIntersects` to check if this sight line intersects with any 3D building model (other than the buildings at the endpoints of the line).
4. If there's an intersection, it indicates a potential view obstruction.

It returns the following output:

```text
    name_a     |      name_b       |        view_status
---------------+-------------------+----------------------------
 Office Tower  | Shopping Mall     | Clear view
 Office Tower  | Residential Block | Potential view obstruction
 Shopping Mall | Residential Block | Clear view
(3 rows)
```

This example demonstrates how SFCGAL's 3D capabilities can be used to analyze spatial relationships between buildings in three dimensions, which is useful for urban planning and architectural design.

## PostGIS Tiger Geocoder

PostGIS Tiger Geocoder provides address normalization and geocoding functionality using TIGER (Topologically Integrated Geographic Encoding and Referencing) data. This extension is useful for address validation, normalization, and conversion of addresses to geographic coordinates.

### Enable the PostGIS Tiger Geocoder extension

Enable the extension by running the following SQL statement:

```sql
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder CASCADE;
```

### Example usage

**Use Tiger Geocoder to normalize an address**

Address normalization is crucial for ensuring consistency in address data. We can use the `normalize_address` function to standardize address formats.

```sql
WITH addresses AS (
  SELECT '123 Main St, New York, NY 10001' AS address
  UNION ALL
  SELECT '1600 Pennsylvania Avenue, Washington, DC'
  UNION ALL
  SELECT '100 Universal City Plaza, Universal City, CA 91608'
)
SELECT
    (normalize_address(address)).*
FROM addresses;
```

This query returns a normalized version of the input addresses.

```text
 address | predirabbrev |   streetname   | streettypeabbrev | postdirabbrev | internal |    location    | stateabbrev |  zip  | parsed | zip4 | address_alphanumeric
---------+--------------+----------------+------------------+---------------+----------+----------------+-------------+-------+--------+------+----------------------
     123 |              | Main           | St               |               |          | New York       | NY          | 10001 | t      |      | 123
    1600 |              | Pennsylvania   | Ave              |               |          | Washington     | DC          |       | t      |      | 1600
     100 |              | Universal City | Plz              |               |          | Universal City | CA          | 91608 | t      |      | 100
(3 rows)
```

## Conclusion

These examples provide a quick introduction to using other extensions in the PostGIS ecosystem. They can significantly expand the geospatial capabilities of your Neon Postgres database.

For further information, refer to the official documentation for each extension.

## Resources

- [pgrouting Documentation](https://docs.pgrouting.org/)
- [H3 Postgres Reference](https://github.com/zachasme/h3-pg/blob/main/docs/api.md)
- [PostGIS SFCGAL Reference](https://postgis.net/docs/manual-dev/reference_sfcgal.html)
- [PostGIS Tiger Geocoder Documentation](https://postgis.net/docs/Extras.html#Tiger_Geocoder)

<NeedHelp/>

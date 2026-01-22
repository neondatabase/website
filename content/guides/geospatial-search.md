---
title: Geospatial Search in Postgres
subtitle: A step-by-step guide describing how to use PostGIS for geospatial search in Postgres
author: vkarpov15
enableTableOfContents: true
createdAt: '2025-02-16T13:24:36.612Z'
updatedOn: '2025-02-16T13:24:36.612Z'
---

Geospatial queries enable you to perform searches on geographical data stored in Postgres.
With the [PostGIS extension](https://postgis.net/), you can query for which rows are within 10 kilometers of a given point or which rows are within a given geospatial rectangle.
This makes Postgres a great option for applications involving maps, location-based services, and geographic analysis.

## Steps

- Install and enable PostGIS
- Create a table with a geometry column
- Insert and retrieve geospatial data
- Perform geospatial queries using `ST_DWithin`
- Sort locations by distance using `ST_Distance`
- Find locations within a polygon using `ST_MakeEnvelope`
- Index using GiST indexes

### Install and enable PostGIS

Before using geospatial queries, you need to install the [PostGIS extension](https://postgis.net/).
PostGIS adds geospatial data types like `GEOMETRY` and `GEOGRAPHY`, geospatial query functions like `ST_DWithin` and `ST_MakeEnvelope`, and GiST indexes.
In Neon, PostGIS is already installed, you just need to enable it using the following command.

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Create a table with a geometry column

To store geospatial data, create a table with a geometry column.
The `GEOMETRY` type can be used to store points, lines, or polygons.
The following command creates a `geom` column that stores latitude/longitude points.

```sql
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  geom GEOMETRY(Point, 4326) -- WGS 84 spatial reference system
);
```

The `4326` magic number is a Spatial Reference System Identifier (SRID) that represents the WGS 84 coordinate system.
In PostGIS, `4326` indicates that `geom` represents degrees of latitude and longitude, rather than meters or feet.

### Insert and retrieve geospatial data

You can insert geographic points using the `ST_GeomFromText` function as follows.
The two rows inserted below contain the approximate latitude and longitude of New York and San Francisco.

```sql
INSERT INTO locations (name, geom)
VALUES ('New York', ST_GeomFromText('POINT(-74.006 40.7128)', 4326)),
       ('San Francisco', ST_GeomFromText('POINT(-122.4194 37.7749)', 4326));
```

You can retrieve all stored locations using the following.

```sql
SELECT id, name, ST_AsText(geom) FROM locations;
```

### Perform geospatial queries using `ST_DWithin`

You can find all locations within a certain distance of a point using `ST_DWithin`.
The following query finds all locations that are within 4000 kilometers of New York, which is just New York.

```sql
SELECT name FROM locations
WHERE ST_DWithin(
  geom,
  ST_GeomFromText('POINT(-74.006 40.7128)', 4326),
  4000000, -- in meters
  true -- use_spheroid
);
```

The `use_spheroid` parameter ensures that `ST_DWithin` interprets the 3rd parameter as meters, and uses a more accurate spheroid model of the Earth which accounts for Earth's flattening at the poles.

San Francisco is approximately 4100 kilometers from New York, so if you instead query for all points that are within 4200 kilometers of New York then Postgres will return both New York and San Francisco.

```sql
SELECT name FROM locations
WHERE ST_DWithin(
  geom,
  ST_GeomFromText('POINT(-74.006 40.7128)', 4326),
  4200000, -- in meters
  true -- use_spheroid
);
```

### Sort locations by distance using `ST_Distance`

To sort locations based on their proximity to a given point, use `ST_Distance`.
The following query sorts locations by their distance from Miami, New York is closer.

```sql
SELECT name, ST_Distance(geom, ST_GeomFromText('POINT(-80.1918 25.7617)', 4326)) AS distance
FROM locations
ORDER BY distance ASC;
```

The following query sorts locations by their distance from Seattle, San Francisco is closer.

```sql
SELECT name, ST_Distance(geom, ST_GeomFromText('POINT(-122.3321 47.6062)', 4326)) AS distance
FROM locations
ORDER BY distance ASC;
```

### Find locations within a polygon using `ST_MakeEnvelope`

PostGIS provides support for more sophisticated queries than simple distances.
PostGIS has functions to check if lines and polygons intersect, contain, or touch each other.
For example, the following query finds all locations within a rectangle longitude -124 to -119 and latitude 36 to 39.
This rectangle roughly covers Northern California, including San Francisco.

```sql
SELECT name FROM locations
WHERE geom && ST_MakeEnvelope(-124, 36, -119, 39, 4326);
```

Below is what the `ST_MakeEnvelope` rectangle looks like on a map.

![Northern California Rectangle](https://codebarbarian-images.s3.us-east-1.amazonaws.com/ca-rectangle.png)

### Index using GiST indexes

For large datasets, geospatial queries can be slow without an index.
PostGIS supports the GiST index for efficient geospatial lookups.
You can create a GiST index on locations' `geom` property using the following command.

```sql
CREATE INDEX locations_gist ON locations USING GIST(geom);
```

---
title: How and when to use btree_gist
description: Be a wizard of space and time with Postgres
excerpt: >-
  The right indexes make big SQL queries fast. If you’ve been using Postgres for
  more than 5 minutes, you’re almost certainly familiar with the everyday B-Tree
  index. This can deal with data that has a one-dimensional ordering: numbers,
  timestamps, text, and so on. And if you’ve ha...
date: '2024-07-08T13:29:31'
updatedOn: '2024-10-02T13:45:55'
category: postgres
categories:
  - postgres
authors:
  - george-mackerron
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/btree_gist/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: btree_gist - How and when to use it - Neon
  description: Be a wizard of space and time with Postgres
  keywords: []
  noindex: false
  ogTitle: btree_gist - How and when to use it - Neon
  ogDescription: >-
    The right indexes make big SQL queries fast. If you’ve been using Postgres
    for more than 5 minutes, you’re almost certainly familiar with the everyday
    B-Tree index. This can deal with data that has a one-dimensional ordering:
    numbers, timestamps, text, and so on. And if you’ve had anything to do with
    spatial data in PostGIS, or indeed […]
  image: 'https://cdn.neonapi.io/public/images/pages/blog/btree_gist/social.jpg'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/btree_gist/neon-wizard-btreegist-1024x576-eeb63d76.jpg)

The right indexes make big SQL queries fast. If you’ve been using Postgres for more than 5 minutes, you’re almost certainly familiar with the everyday [B-Tree index](https://www.postgresql.org/docs/current/indexes-types.html#INDEXES-TYPES-BTREE). This can deal with data that has a one-dimensional ordering: numbers, timestamps, text, and so on.

And if you’ve had anything to do with [spatial data in PostGIS](https://postgis.net/), or indeed with Postgres’ own [geometry types](https://www.postgresql.org/docs/current/datatype-geometric.html), you’ve probably also encountered [GiST-based indexes](https://www.postgresql.org/docs/current/gist-intro.html). These can handle 2D and higher-dimensional data, enabling speedy queries on proximity, containment, overlap, and so on.

Both index types can work with multiple data items. For example, if you need to find people by their name and date of birth, you can create a multi-column B-Tree index that enables fast searching on the two together.

But what if you need to search by multiple columns, and the data in those columns is a mix of one- and multi-dimensional? A case in point: what if you need to search simultaneously over space and time? Well, Postgres has you covered here too.

The TL;DR is: use the [btree_gist](https://www.postgresql.org/docs/current/btree-gist.html) extension. Some context and a worked example follow.

## Crimes

This issue cropped up while I was working with the [detailed crime data published by UK police forces](https://data.police.uk/data/). The data set has one row per crime: each row has the crime’s type, a latitude and longitude (generalised slightly for anonymity), and the month and year it was reported.

I needed a big join query to count crimes occurring near millions of specific point-locations at particular times.

## Get the data

The data I used was [the April 2017 archive](https://data.police.uk/data/archive/2017-04.zip) (which is the latest that goes all the way back to 2010). It’s organised into folders named by year and month (`2017-04`, `2017-03`, etc.). In each folder there are CSV files for each police force, and for a few different sorts of data. I was interested in street-level crime data, so the files I wanted look like `[year-month]/[year-month]-[police-force]-street.csv` (for instance, `2017-04/2017-04-thames-valley-street.csv`).

When I’m exploring CSV data and loading it into Postgres, I generally find [`xsv`](https://github.com/BurntSushi/xsv) invaluable. Let’s use it to take a look at what we have in these CSVs.

### How many crimes are recorded?

```bash
> xsv cat rows **/*-street.csv | xsv count
38,595,130
```

### What do the columns represent?

```bash
> xsv headers 2010-12/2010-12-avon-and-somerset-street.csv
1   Crime ID
2   Month
3   Reported by
4   Falls within
5   Longitude
6   Latitude
7   Location
8   LSOA code
9   LSOA name
10  Crime type
11  Last outcome category
12  Context
```

### What are the types of crime?

Note that I’m using `pv` with the row count calculated above to monitor progress, and we need the `--limit` argument because `xsv` frequency tables default to showing only the top 10.

```bash
> xsv cat rows **/*-street.csv \
  | pv -l -s 38595130 \
  | xsv frequency --select 'Crime type' --limit 0 \
  | xsv table

field       value                         count
Crime type  Anti-social behaviour         13869607
Crime type  Violence and sexual offences  4047849
Crime type  Other theft                   3258648
Crime type  Criminal damage and arson     3129836
Crime type  Burglary                      2866490
Crime type  Vehicle crime                 2477833
Crime type  Other crime                   2147319
Crime type  Shoplifting                   1890071
Crime type  Violent crime                 1673219
Crime type  Drugs                         987402
Crime type  Public order                  792808
Crime type  Robbery                       391709
Crime type  Bicycle theft                 369895
Crime type  Theft from the person         346421
Crime type  Public disorder and weapons   242145
Crime type  Possession of weapons         103878
```

Now let’s load just the subset of data we need into Postgres.

First, create the schema:

```sql
> create database crimes_db;
CREATE DATABASE

> \c crimes_db
You are now connected to database "crimes_db" as user "george".

> create type crime_type as enum (
  'Anti-social behaviour',
  'Violence and sexual offences',
  'Other theft',
  'Criminal damage and arson',
  'Burglary',
  'Vehicle crime',
  'Other crime',
  'Shoplifting',
  'Violent crime',
  'Drugs',
  'Public order',
  'Robbery',
  'Bicycle theft',
  'Theft from the person',
  'Public disorder and weapons',
  'Possession of weapons'
);
CREATE TYPE

> create table crimes (
  month date,
  longitude real,
  latitude real,
  crime crime_type
);
CREATE TABLE
```

Then, load in the data with `COPY … FROM`. Again I use `pv` to monitor progress. I use `xsv` to select specific columns. And I use `sed` to put the year-month dates into a format Postgres understands, by appending `-01` (i.e. the first day of the month) to each.

```bash
> xsv cat rows **/*-street.csv \
  | pv -l -s 38595130 \
  | xsv select Month,Longitude,Latitude,'Crime type' \
  | sed -E 's/^([0-9]+-[0-9]+)/\1-01/g' \
  | psql crimes_db -c 'copy crimes from stdin csv header'
```

As quick check that the data have loaded OK, let’s see how crimes are distributed over years with a quick [crosstab](https://www.postgresql.org/docs/current/tablefunc.html):

```sql
> create extension tablefunc;
CREATE EXTENSION

> select * from crosstab(
  $$ select crime, to_char(month, 'YYYY') as year, count(*) from crimes group by crime, year order by crime asc, year asc $$,
  $$ select gs from generate_series(2010, 2017) gs $$
) as ("Crime" text, "2010" int, "2011" int, "2012" int, "2013" int, "2014" int, "2015" int, "2016" int, "2017" int);

            Crime             |  2010  |  2011   |  2012   |  2013   |  2014   |  2015   |  2016   |  2017  
------------------------------+--------+---------+---------+---------+---------+---------+---------+--------
 Anti-social behaviour        | 201016 | 2792756 | 2369431 | 2191485 | 2035155 | 1875251 | 1850397 | 554116
 Violence and sexual offences |        |         |         |  477713 |  839521 | 1049988 | 1232210 | 448417
 Other theft                  |        |  251482 |  737010 |  582768 |  515839 |  505800 |  496783 | 168966
 Criminal damage and arson    |        |  207293 |  563360 |  526600 |  516930 |  549252 |  570616 | 195785
 Burglary                     |  37893 |  505841 |  476006 |  455384 |  427448 |  410673 |  409102 | 144143
 Vehicle crime                |  29416 |  411012 |  392300 |  378911 |  356789 |  368599 |  394087 | 146719
 Other crime                  | 142705 | 1530533 |  182205 |   71454 |   53501 |   63296 |   74160 |  29465
 Shoplifting                  |        |  104179 |  303366 |  321207 |  331093 |  339237 |  361982 | 129007
 Violent crime                |  57580 |  729387 |  676732 |  209520 |         |         |         |       
 Drugs                        |        |   71007 |  208111 |  198252 |  177470 |  151401 |  137739 |  43422
 Public order                 |        |         |         |   91823 |  152113 |  194164 |  254129 | 100579
 Robbery                      |   5731 |   75068 |   68042 |   60648 |   52416 |   51651 |   56042 |  22111
 Bicycle theft                |        |         |         |   73342 |   95021 |   88193 |   86670 |  26669
 Theft from the person        |        |         |         |   68442 |   81964 |   83056 |   83483 |  29476
 Public disorder and weapons  |        |   51555 |  147405 |   43185 |         |         |         |       
 Possession of weapons        |        |         |         |   14133 |   21415 |   25168 |   31218 |  11944
(16 rows)
```

This looks sensible enough. It also tells us that crime classifications changed a few times between 2010 – 2017, which is why some of the categories are a bit oddly overlapping.

## Make it spatial

The next step is to create a point geometry out of the latitude and longitude coordinates we’ve been given.

As is annoyingly common, no [coordinate reference system](https://en.wikipedia.org/wiki/Spatial_reference_system) is specified in the data set. The [gov.uk](https://gov.uk/) standard is British National Grid (BNG). But that’s clearly not what we have here, since that would give us eastings and northings in metres, not latitude and longitude in degrees.

For now, I’m going to guess we’ve got WGS84, which is the GPS coordinate system (EPSG code 4326). And then I’m going to transform to BNG (EPSG code 27700), because having the coordinates in metres [makes distance calculations quick and easy](https://postgis.net/workshops/postgis-intro/geography.html).

Two small caveats: (1) I’m using PostGIS’ built-in parametric transformation between the two coordinate systems, which may be off by a few metres. For really precise work, I’d use [OSTN15](https://gis.stackexchange.com/questions/396967/using-ostn15-in-postgis). And (2) BNG isn’t really appropriate for the Northern Ireland data, but it should still work well enough here.

```sql
> create extension postgis;
CREATE EXTENSION

> select addgeometrycolumn('crimes', 'location', 27700, 'point', 2);
                  addgeometrycolumn                  
------------------------------------------------------
 public.crimes.location SRID:27700 TYPE:point DIMS:2 
(1 row)

> update crimes set location = st_transform(st_setsrid(st_makepoint(longitude, latitude), 4326), 27700);
UPDATE 38595130
```

The final step in loading the data is to update table statistics, helping the query planner make good decisions in what follows.

```sql
> analyze crimes;
ANALYZE
```

## Ask questions

Let’s start by counting crimes within 1km of Stratford station (near the Olympic Park) around the 2012 Olympics in London. Stratford is at grid point E 538566, N 184375, so:

```sql
> \timing
Timing is on.

> select count(*) from crimes
  where st_dwithin(location, st_setsrid(st_makepoint(538566, 184375), 27700), 1000)
  and month between '2012-07-01' and '2012-08-31';

 count 
-------
  1644
(1 row)

Time: 8639.014 ms (00:08.639)
```

Unsurprisingly, since there were so many more people about, it turns out that crime in these months is a bit higher than usual (the highest July/August crime count in any other year in the data set is 1,430).

It also turns out that this is a pretty slow query, taking about 8 seconds on a fast MacBook Pro. That, of course, is because we haven’t indexed anything.

If we `explain analyze` the query, there’s a `Parallel Seq Scan on crimes` in there. It’s nice that Postgres can parallelise it, but it’s still a sequential scan: every row of the database has to be retrieved and checked. Yawn.

```sql
> explain analyze select count(*) from crimes
  where st_dwithin(location, st_setsrid(st_makepoint(538566, 184375), 27700), 1000)
  and month between '2012-07-01' and '2012-08-31';

                                                                                                    QUERY PLAN                                                                                                    
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Finalize Aggregate  (cost=200458563.81..200458563.82 rows=1 width=8) (actual time=7371.148..7371.993 rows=1 loops=1)
   ->  Gather  (cost=200458563.60..200458563.81 rows=2 width=8) (actual time=7371.088..7371.988 rows=3 loops=1)
         Workers Planned: 2
         Workers Launched: 2
         ->  Partial Aggregate  (cost=200457563.60..200457563.61 rows=1 width=8) (actual time=7351.030..7351.030 rows=1 loops=3)
               ->  Parallel Seq Scan on crimes  (cost=0.00..200457563.48 rows=45 width=0) (actual time=6116.709..7351.010 rows=548 loops=3)
                     Filter: ((month >= '2012-07-01'::date) AND (month <= '2012-08-31'::date) AND st_dwithin(location, '0101000020346C0000000000008C6F204100000000B8810641'::geometry, '1000'::double precision))
                     Rows Removed by Filter: 12864495
 Planning Time: 0.193 ms
 Execution Time: 7372.042 ms
(10 rows)
```

## Index on space

The first thing I tried, therefore, was a standard spatial index:

```sql
> create index crime_location_idx on crimes using gist(location);
CREATE INDEX
```

When we now re-run the query, the time drops to 32 milliseconds — about 250 times quicker. An `explain analyze` shows that a Bitmap Index Scan is being used, which is [a kind of middle ground between a sequential and index scan](https://pganalyze.com/docs/explain/scan-nodes/bitmap-index-scan).

```sql
> explain analyze select count(*) from crimes
  where st_dwithin(location, st_setsrid(st_makepoint(538566, 184375), 27700), 1000)
  and month between '2012-07-01' and '2012-08-31';
                                                                                                    QUERY PLAN                                                                                                    
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Finalize Aggregate  (cost=237562.75..237562.76 rows=1 width=8) (actual time=27.974..30.290 rows=1 loops=1)
   ->  Gather  (cost=237562.53..237562.74 rows=2 width=8) (actual time=12.074..30.225 rows=3 loops=1)
         Workers Planned: 2
         Workers Launched: 2
         ->  Partial Aggregate  (cost=236562.53..236562.54 rows=1 width=8) (actual time=3.980..3.981 rows=1 loops=3)
               ->  Parallel Bitmap Heap Scan on crimes  (cost=759.01..236562.42 rows=45 width=0) (actual time=2.027..3.944 rows=548 loops=3)
                     Filter: ((month >= '2012-07-01'::date) AND (month <= '2012-08-31'::date) AND st_dwithin(location, '0101000020346C0000000000008C6F204100000000B8810641'::geometry, '1000'::double precision))
                     Rows Removed by Filter: 16301
                     Heap Blocks: exact=948
                     ->  Bitmap Index Scan on crime_location_idx  (cost=0.00..758.98 rows=27525 width=0) (actual time=3.804..3.804 rows=50546 loops=1)
                           Index Cond: (location && st_expand('0101000020346C0000000000008C6F204100000000B8810641'::geometry, '1000'::double precision))
 Planning Time: 0.323 ms
 Execution Time: 30.375 ms
(13 rows)

Time: 31.234 ms
```

This is very much better. But the whole point of this post is that we can do better still.

## Index on space and time

For this particular search we should really be indexing over both space _and_ time. That will then allow Postgres to do a simple Index Scan encompassing all conditions simultaneously.

For this, we use the [btree_gist](https://www.postgresql.org/docs/current/btree-gist.html) extension, which reimplements a BTree index using GiST infrastructure.

Ordinarily, btree_gist has no advantage (and some disadvantages) over the native BTree implementation. What it’s useful for, though, is combining a BTree index with GiST index types. Which we can do like so:

```sql
> create extension btree_gist;
CREATE EXTENSION

> create index crime_month_location_idx on crimes using gist(location, month);
CREATE INDEX
```

When we now re-run the query, it takes about 8 milliseconds: almost 1000x quicker than the unindexed version, and about 4x quicker than the spatial-only index version. An `explain analyze` shows a simple Index Scan as the search method, which is what we were hoping to see.

```sql
> explain analyze select count(*) from crimes
  where st_dwithin(location, st_setsrid(st_makepoint(538566, 184375), 27700), 1000)
  and month between '2012-07-01' and '2012-08-31';
                                                                                                 QUERY PLAN                                                                                                  
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Aggregate  (cost=12813.23..12813.24 rows=1 width=8) (actual time=8.047..8.048 rows=1 loops=1)
   ->  Index Scan using crime_month_location_idx on crimes  (cost=0.54..12812.96 rows=109 width=0) (actual time=0.216..7.912 rows=1644 loops=1)
         Index Cond: ((location && st_expand('0101000020346C0000000000008C6F204100000000B8810641'::geometry, '1000'::double precision)) AND (month >= '2012-07-01'::date) AND (month <= '2012-08-31'::date))
         Filter: st_dwithin(location, '0101000020346C0000000000008C6F204100000000B8810641'::geometry, '1000'::double precision)
         Rows Removed by Filter: 149
 Planning Time: 0.368 ms
 Execution Time: 8.094 ms
(7 rows)
```

Of course, there is a trade-off to be made, and in this case it’s primarily about disk space. Running psql’s `\\di+` and `\\dt+` commands we can see that the spatial-only index takes 1.9GB of storage, while the space-and-time index requires 2.7GB. This is a significant fraction of the size of the data itself: the `crimes` table is 5.5GB.

Still, this is a nice, flexible technique that extends to various sorts of one-dimensional data that you might want to combine with a GiST index. I hope you find it useful.

---
title: Postgres extensions
enableTableOfContents: true
updatedOn: '2024-09-30T21:23:25.537Z'
---

Explore supported Postgres extensions by category. Also see:

- [List view of supported extensions and versions](/docs/extensions/pg-extensions)
- [Install an extension](/docs/extensions/pg-extensions#install-an-extension)
- [Update an extension](/docs/extensions/pg-extensions#update-an-extension-version)
- [Request extension support](/docs/extensions/pg-extensions#request-extension-support)

## AI / Machine Learning

<DetailIconCards>

<a href="/docs/extensions/pg_tiktoken" description="Tokenize data in Postgres using the OpenAI tiktoken library" icon="app-store" icon="sparkle">pg_tiktoken</a>

<a href="/docs/extensions/pgvector" description="Store vector embeddings and perform vector similarity search in Postgres" icon="sparkle">pgvector</a>

</DetailIconCards>

## Analytics

<DetailIconCards>

<a href="https://github.com/citusdata/postgresql-hll" description="Implements a HyperLogLog data structure as a native data type for efficient and tunable distinct value counting" icon="a-chart">hll</a>

<a href="/docs/extensions/timescaledb" description="Enables Postgres as a time-series database for efficient storage and retrieval of time-series data" icon="a-chart">timescaledb</a>

</DetailIconCards>

## Auditing / Logging

<DetailIconCards>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Implements a trigger that stores the current user's name into a text field, useful for tracking who modified a particular row within a table" icon="check">insert_username</a>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Implements a trigger that automatically updates a timestamp column to the current timestamp whenever a row is modified" icon="check">moddatetime</a>

<a href="https://www.postgresql.org/docs/16/pgrowlocks.html" description="Provides a function that shows row locking information for a specified table, useful in concurrency and deadlock debugging" icon="check">pgrowlocks</a>

<a href="https://www.postgresql.org/docs/16/tcn.html" description="Provides a trigger function to notify listeners of changes to a table, allowing applications to respond to changes in the database" icon="check">tcn</a>

</DetailIconCards>

## Data / Transformations

<DetailIconCards>

<a href="https://postgis.net/docs/Extras.html#Address_Standardizer" description="A single-line address parser that takes an input address and normalizes it based on a set of rules" icon="data">address_standardizer</a>

<a href="https://postgis.net/docs/Extras.html#Address_Standardizer_Tables" description="Provides data for standardizing US addresses, for use with the address_standardizer extension" icon="data">address_standardizer_data_us</a>

<a href="/docs/extensions/citext" description="Provides a case-insensitive character string type that internally calls lower when comparing values in Postgres" icon="data">citext</a>

<a href="https://www.postgresql.org/docs/16/cube.html" description="Implements the cube data type for representing multidimensional cubes in Postgres" icon="data">cube</a>

<a href="https://www.postgresql.org/docs/16/earthdistance.html" description="Provides cube-based and point-based approaches to calculating great circle distances on the surface of the Earth" icon="data">earthdistance</a>

<a href="/docs/extensions/hstore" description="Implements an hstore data type for storing and manipulating sets of key-value pairs within a single Postgres value" icon="data">hstore</a>

<a href="https://www.postgresql.org/docs/16/intagg.html" description="Provides an integer aggregator and enumerator for Postgres" icon="data">intagg</a>

<a href="https://www.postgresql.org/docs/16/intarray.html" description="Offers functions and operators for manipulating and searching arrays of integers within Postgres" icon="data">intarray</a>

<a href="https://www.postgresql.org/docs/16/isn.html" description="Implements data types for international product numbering standards: EAN13, UPC, ISBN (books), ISMN (music), and ISSN (serials)" icon="data">isn</a>

<a href="https://www.postgresql.org/docs/16/ltree.html" description="Provides data types for representing labels of data stored in a hierarchical tree-like structure and facilities for searching through label trees" icon="data">ltree</a>

<a href="https://github.com/supabase/pg_graphql" description="Adds GraphQL support to Postgres, allowing you to query your database via GraphQL" icon="data">pg_graphql</a>

<a href="https://github.com/iCyberon/pg_hashids" description="Enables the generation of short, unique hash ids from integers, useful for obfuscating internal ids" icon="data">pg_hashids</a>

<a href="https://github.com/supabase/pg_jsonschema" description="Provides support for JSON schema validation on json and jsonb data types" icon="data">pg_jsonschema</a>

<a href="https://github.com/fboulnois/pg_uuidv7" description="Enables creating valid UUID Version 7 values in Postgres, enabling globally unique identifiers with temporal ordering" icon="data">pg_uuidv7</a>

<a href="https://github.com/pksunkara/pgx_ulid" description="A full-featured extension for generating and working with ULID (Universally Unique Lexicographically Sortable Identifiers)" icon="data">pgx_ulid</a>

<a href="https://www.postgresql.org/docs/16/seg.html" description="Implements the seg data type for storage and manipulation of line segments or floating-point ranges, useful for geometric and scientific applications" icon="data">seg</a>

<a href="https://pgxn.org/dist/semver" description="A Postgres data type for the Semantic Version format with support for btree and hash indexing" icon="data">semver</a>

<a href="https://www.postgresql.org/docs/16/tablefunc.html" description="Contains functions that return tables (multiple rows), including crosstab, which can pivot row data into columns dynamically" icon="data">tablefunc</a>

<a href="https://www.postgresql.org/docs/16/unaccent.html" description="A text search dictionary that removes accents from characters, simplifying text search in Postgres" icon="data">unaccent</a>

<a href="https://github.com/df7cb/postgresql-unit" description="Implements a data type for SI units, plus byte, for storage, manipulation, and calculation of scientific units" icon="data">unit</a>

<a href="https://www.postgresql.org/docs/16/uuid-ossp.html" description="Provides functions to generate universally unique identifiers (UUIDs) in Postgres, supporting various UUID standards" icon="data">uuid-ossp</a>

<a href="/docs/extensions/wal2json" description="A Postgres logical decoding plugin that converts Write-Ahead Log (WAL) changes into JSON objects" icon="data">wal2json</a>

<a href="https://www.postgresql.org/docs/current/xml2.html" description="Enables XPath queries and XSLT functionality directly within Postgres, enabling XML data processing" icon="data">xml2</a>

</DetailIconCards>

## Debugging

<DetailIconCards>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Automatically updates a timestamp column to the current timestamp whenever a row is modified in Postgres" icon="bug">moddatetime</a>

<a href="https://www.postgresql.org/docs/16/pgrowlocks.html" description="Provides a function that shows row locking information for a specified table, which can aid in concurrency and deadlock debugging" icon="bug">pgrowlocks</a>

<a href="https://pgtap.org/documentation.html" description="A unit testing framework for Postgres, enabling sophisticated testing of database queries and functions" icon="bug">pgTap</a>

<a href="https://pgxn.org/dist/plpgsql_check/" description="Provides a linter and debugger for PL/pgSQL code, helping identify errors and optimize PL/pgSQL functions" icon="bug">plpgsql_check</a>

</DetailIconCards>

## Geospatial

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/cube.html" description="Implements a data type for representing multidimensional cubes in Postgres" icon="globe">cube</a>

<a href="https://www.postgresql.org/docs/16/earthdistance.html" description="Provides cube-based and point-based approaches to calculating great circle distances on the surface of the Earth" icon="globe">earthdistance</a>

<a href="/docs/extensions/postgis-related-extensions#h3-and-h3-postgis" description="Integrates Uber's H3 geospatial indexing system that combines the benefits of a hexagonal grid with S2's hierarchical subdivisions" icon="globe">h3</a>

<a href="/docs/extensions/postgis-related-extensions#h3-and-h3-postgis" description="A PostGIS extension for H3, enabling advanced spatial analysis and indexing" icon="globe">h3_postgis</a>

<a href="/docs/extensions/postgis-related-extensions#pgrouting" description="Extends PostGIS/Postgres databases, providing geospatial routing and other network analysis functionality" icon="globe">pgrouting</a>

<a href="/docs/extensions/postgis" description="Extends Postgres to allow GIS (Geographic Information Systems) objects to be stored in the database, enabling spatial queries directly in SQL" icon="globe">postgis</a>

<a href="https://postgis.net/docs/RT_reference.html" description="Adds support for raster data to PostGIS, enabling advanced geospatial analysis on raster images" icon="globe">postgis_raster</a>

<a href="/docs/extensions/postgis-related-extensions#postgis-sfcgal" description="Provides support for advanced 3D geometries in PostGIS, based on the SFCGAL library" icon="globe">postgis_sfcgal</a>

<a href="/docs/extensions/postgis-related-extensions#postgis-tiger-geocoder" description="Enables geocoding and reverse geocoding capabilities in PostGIS using TIGER/Line data" icon="globe">postgis_tiger_geocoder</a>

<a href="https://www.postgis.net/docs/Topology.html" description="Extends PostGIS with support for topological data types and functions, facilitating the analysis of spatial relationships" icon="globe">postgis_topology</a>

</DetailIconCards>

## Index / Table optimization

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/bloom.html" description="Provides an index access method for Postgres based on Bloom filters" icon="table">bloom</a>

<a href="https://www.postgresql.org/docs/16/btree-gin.html" description="Provides GIN operator classes that implement B-tree equivalent behavior" icon="table">btree_gin</a>

<a href="https://www.postgresql.org/docs/16/btree-gist.html" description="Provides GiST index operator classes that implement B-tree equivalent behavior" icon="table">btree_gist</a>

<a href="https://github.com/RhodiumToad/ip4r" description="Provides a range index type and functions for efficiently storing and querying IPv4 and IPv6 ranges and addresses in Postgres" icon="table">ip4r</a>

<a href="https://github.com/sraoss/pg_ivm" description="Provides an Incremental View Maintenance (IVM) feature for Postgres" icon="table">pg_ivm</a>

<a href="https://github.com/pgpartman/pg_partman" description="A partition manager extension that enables creating and managing time-based and number-based table partition sets in Postgres" icon="table">pg_partman</a>

<a href="/docs/extensions/pg_prewarm" description="Allows manual preloading of relation data into the Postgres buffer cache, reducing access times for frequently queried tables" icon="table">pg_prewarm</a>

<a href="https://github.com/ChenHuajun/pg_roaringbitmap" description="Implements Roaring Bitmaps in Postgres for efficient storage and manipulation of bit sets" icon="table">pg_roaringbitmap</a>

<a href="https://github.com/postgrespro/rum" description="Provides an access method to work with a RUM index, designed to speed up full-text searches" icon="table">rum</a>

</DetailIconCards>

## Metrics

<DetailIconCards>

<a href="/docs/extensions/neon" description="Provides functions and views designed to gather Neon-specific metrics" icon="metrics">neon</a>

<a href="/docs/extensions/pg_stat_statements" description="Tracks planning and execution statistics for all SQL statements executed, aiding in performance analysis and tuning" icon="metrics">pg_stat_statements</a>

<a href="https://www.postgresql.org/docs/16/pgstattuple.html" description="Offers functions to show tuple-level statistics for tables, helping identify bloat and efficiency opportunities" icon="metrics">pgstattuple</a>

<a href="https://www.postgresql.org/docs/16/tsm-system-rows.html" description="Provides a table sampling method that selects a fixed number of table rows randomly" icon="metrics">tsm_system_rows</a>

<a href="https://www.postgresql.org/docs/16/tsm-system-time.html" description="Offers a table sampling method based on system time, enabling consistent sample data retrieval over time" icon="metrics">tsm_system_time</a>

</DetailIconCards>

## Orchestration

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/tcn.html" description="Provides a trigger function to notify listeners of changes to a table, allowing applications to respond to changes in the database" icon="gear">tcn</a>

<a href="https://github.com/pgpartman/pg_partman" description="A partition manager extension that enables creating and managing time-based and number-based table partition sets in Postgres" icon="gear">pg_partman</a>

</DetailIconCards>

## Procedural languages

<DetailIconCards>

<a href="https://coffeescript.org/" description="Enables writing functions in CoffeeScript, a Javascript dialect with a syntax similar to Ruby" icon="binary-code">plcoffee</a>

<a href="https://livescript.net/" description="Enables writing functions in LiveScript, a Javascript dialect that serves as a more powerful successor to CoffeeScript" icon="binary-code">plls</a>

<a href="https://github.com/plv8/plv8/" description="A Postgres procedural language powered by V8 Javascript Engine for writing functions in Javascript that are callable from SQL" icon="binary-code">plv8</a>

<a href="https://www.postgresql.org/docs/16/plpgsql.html" description="The default procedural language for Postgres, enabling the creation of complex functions and triggers" icon="binary-code">plpgsql</a>

</DetailIconCards>

## Query optimization

<DetailIconCards>

<a href="https://hypopg.readthedocs.io/en/rel1_stable/" description="Provides the ability to create hypothetical (virtual) indexes in Postgres for performance testing" icon="find-replace">hypopg</a>

<a href="https://github.com/ossc-db/pg_hint_plan" description="Allows developers to influence query plans with hints in SQL comments, improving performance and control over query execution" icon="find-replace">pg_hint_plan</a>

</DetailIconCards>

## Scientific computing

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/cube.html" description="Implements the cube data type for representing multidimensional cubes in Postgres" icon="atom">cube</a>

<a href="https://github.com/rdkit/rdkit" description="Integrates the RDKit cheminformatics toolkit with Postgres, enabling chemical informatics operations directly in the database" icon="atom">rdkit</a>

<a href="https://www.postgresql.org/docs/16/seg.html" description="Implements the seg data type for storage and manipulation of line segments or floating-point intervals, useful for representing laboratory measurements" icon="atom">seg</a>

<a href="https://github.com/df7cb/postgresql-unit" description="Implements a data type for SI units, plus byte, for storage, manipulation, and calculation of scientific units" icon="atom">unit</a>

</DetailIconCards>

## Search

<DetailIconCards>

<a href="/docs/extensions/citext" description="Provides a case-insensitive character string type that internally calls lower when comparing values in Postgres" icon="search">citext</a>

<a href="https://www.postgresql.org/docs/16/dict-int.html" description="Provides a text search dictionary template for indexing integer data in Postgres" icon="search">dict_int</a>

<a href="https://www.postgresql.org/docs/16/fuzzystrmatch.html" description="Provides several functions to determine similarities and distance between strings in Postgres" icon="search">fuzzystrmatch</a>

<a href="/docs/extensions/pg_trgm" description="Provides functions and operators for determining the similarity of alphanumeric text based on trigram matching, and index operator classes for fast string similarity search" icon="search">pg_trgm</a>

<a href="https://github.com/dimitri/prefix" description="A prefix range module that supports efficient queries on text columns with prefix-based searching and matching capabilities" icon="search">prefix</a>

<a href="https://www.postgresql.org/docs/16/unaccent.html" description="A text search dictionary that removes accents from characters, simplifying text search in Postgres" icon="search">unaccent</a>

</DetailIconCards>

## Security

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/pgcrypto.html" description="Offers cryptographic functions, allowing for encryption and hashing of data within Postgres" icon="check">pgcrypto</a>

<a href="https://github.com/michelp/pgjwt" description="Implements JSON Web Tokens (JWT) in Postgres, allowing for secure token creation and verification" icon="check">pgjwt</a>

</DetailIconCards>

## Tooling / Admin

<DetailIconCards>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Provides an autoinc() function that stores the next value of a sequence into an integer field" icon="wrench">autoinc</a>

<a href="https://hypopg.readthedocs.io/en/rel1_stable/" description="Provides the ability to create hypothetical (virtual) indexes in Postgres for performance testing" icon="wrench">hypopg</a>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Automatically inserts the username of the person executing an insert operation into a specified table in Postgres" icon="wrench">insert_username</a>

<a href="https://www.postgresql.org/docs/16/lo.html" description="Provides support for managing large objects (LOBs) in Postgres, including a data type lo and a trigger lo_manage" icon="wrench">lo</a>

<a href="/docs/extensions/neon-utils" description="Provides a function for monitoring how Neon's Autoscaling feature allocates vCPU in response to workload" icon="wrench">neon_utils</a>

<a href="https://pgtap.org/documentation.html" description="A unit testing framework for Postgres, enabling sophisticated testing of database queries and functions" icon="wrench">pgtap</a>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Provides functions for maintaining foreign key constraints" icon="wrench">refint</a>

</DetailIconCards>

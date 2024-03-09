---
title: Postgres extensions
enableTableOfContents: true
---

Explore the Postgres extensions by category. For a list of supported extensions with the supported versions, see [Supported Postgres extensions](/docs/extensions/pg-extensions).

## AI and machine learning

<DetailIconCards>

<a href="/docs/extensions/pg_tiktoken" description="Experimental extension for tokenization and text analysis within Postgres">pg_tiktoken</a>

<a href="/docs/extensions/pgvector" description="Supports efficient vector operations, beneficial in machine learning and similar applications.">pgvector</a>

</DetailIconCards>

## Analytics

<DetailIconCards>

<a href="https://github.com/citusdata/postgresql-hll" description="Implements HyperLogLog data structures in Postgres for efficient cardinality estimation with minimal memory">hll</a>

<a href="https://github.com/supabase/pg_graphql" description="Integrates GraphQL directly into Postgres, allowing for GraphQL queries to be executed alongside SQL">pg_graphql</a>

<a href="/docs/extensions/timescaledb" description="An extension for Postgres designed to enhance its capabilities as a time-series database.">timescaledb</a>

</DetailIconCards>

## Auditing / Logging

<DetailIconCards>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Automatically inserts the current username into a specified column, facilitating auditing and tracking of changes">insert_username (spi)</a>

<a href="https://www.postgresql.org/docs/16/pgrowlocks.html" description="Provides a view that shows row locking information for tables, aiding in concurrency and deadlock debugging.">pgrowlocks</a>

</DetailIconCards>

## Data / Transformations

<DetailIconCards>

<a href="https://postgis.net/docs/Extras.html#Address_Standardizer" description="Normalizes and standardizes postal addresses within Postgres">address_standardizer</a>

<a href="https://postgis.net/docs/Extras.html#Address_Standardizer" description="Provides U.S. address standardization data for use with the address_standardizer extension">address_standardizer_data_us</a>

<a href="/docs/extensions/citext" description="Supports case-insensitive text data types, facilitating case-insensitive comparisons in Postgres">citext</a>

<a href="https://www.postgresql.org/docs/16/cube.html" description="Supports multidimensional cube data types for complex data structures in Postgres">cube</a>

<a href="https://www.postgresql.org/docs/16/earthdistance.html" description="Calculates great-circle distances on the surface of the Earth directly within Postgres">earthdistance</a>

<a href="/docs/extensions/hstore" description="Enables storage and manipulation of sets of key-value pairs within a single Postgres value">hstore</a>

<a href="https://www.postgresql.org/docs/16/intagg.html" description="Supports integer aggregation and provides additional aggregate functions for Postgres">intagg</a>

<a href="https://www.postgresql.org/docs/16/intarray.html" description="Offers functions and operators for manipulating and searching arrays of integers within Postgres">intarray</a>

<a href="https://www.postgresql.org/docs/16/isn.html" description="Implements data types for several International Standard Numbers (ISNs), including ISBNs and ISSNs, in Postgres">isn</a>

<a href="https://www.postgresql.org/docs/16/ltree.html" description="Supports data structures for representing labels of tree-like structures, enabling hierarchical data storage in Postgres">ltree</a>

<a href="https://github.com/iCyberon/pg_hashids" description="Enables the generation of short, unique hash ids from integers, useful for obfuscating internal ids">pg_hashids</a>

<a href="https://github.com/supabase/pg_jsonschema" description="Validates JSON documents against JSON Schema definitions directly in Postgres">pg_jsonschema</a>

<a href="https://github.com/fboulnois/pg_uuidv7" description="Implements the UUIDv7 standard in Postgres, providing globally unique identifiers with temporal ordering">pg_uuidv7</a>

<a href="https://github.com/pksunkara/pgx_ulid" description="Provides functions to generate and work with ULID (Universally Unique Lexicographically Sortable Identifiers) in Postgres.">pgx_ulid</a>

<a href="https://www.postgresql.org/docs/16/seg.html" description="Supports the storage and manipulation of line segments or floating-point ranges, useful for geometric and scientific applications.">seg</a>

<a href="https://www.postgresql.org/docs/16/tablefunc.html" description="Contains functions that return tables, including crosstab, which can pivot row data into columns dynamically.">tablefunc</a>

<a href="https://www.postgresql.org/docs/16/unaccent.html" description="A text search dictionary that removes accents from characters, simplifying text search in Postgres.">unaccent</a>

<a href="https://github.com/df7cb/postgresql-unit" description="Supports the storage, manipulation, and calculation of scientific units, enhancing Postgres capabilities for scientific data.">unit</a>

<a href="https://www.postgresql.org/docs/16/uuid-ossp.html" description="Provides functions to generate universally unique identifiers (UUIDs) in Postgres, supporting various UUID standards.">uuid-ossp</a>

<a href="https://www.postgresql.org/docs/current/xml2.html" description="Enables XML data manipulation and XPath queries directly within Postgres, facilitating XML data processing.">xml2</a>

</DetailIconCards>

## Debugging

<DetailIconCards>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Automatically updates a timestamp column to the current timestamp whenever a row is modified in Postgres">moddatetime (spi)</a>

<a href="https://pgtap.org/documentation.html" description="A unit testing framework for Postgres, enabling sophisticated testing of database queries and functions.">pgtap</a>

<a href="https://pgxn.org/dist/plpgsql_check/" description="Provides a linter and debugger for PL/pgSQL code, helping identify errors and optimize PL/pgSQL functions.">plpgsql_check</a>

</DetailIconCards>

## Geospatial

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/earthdistance.html" description="Calculates great-circle distances on the surface of the Earth directly within Postgres">earthdistance</a>

<a href="https://github.com/zachasme/h3-pg/blob/main/docs/api.md" description="Integrates Uber's H3 spatial indexing system into Postgres, enhancing geospatial querying capabilities">h3</a>

<a href="https://github.com/zachasme/h3-pg/blob/main/docs/api.md" description="A PostGIS extension for H3, enabling advanced spatial analysis and indexing in conjunction with PostGIS">h3_postgis</a>

<a href="https://docs.pgrouting.org/3.4/en/index.html" description="Extends PostGIS/Postgres databases to provide geospatial routing functionality.">pgrouting</a>

<a href="/docs/extensions/postgis" description="Extends Postgres to support geographic objects, enabling spatial queries directly in SQL.">postgis</a>

<a href="https://postgis.net/docs/RT_reference.html" description="Adds support for raster data to PostGIS, enabling advanced geospatial analysis on raster images.">postgis_raster</a>

<a href="https://oslandia.gitlab.io/SFCGAL/" description="Provides support for advanced 3D geometries in PostGIS, based on the SFCGAL library.">postgis_sfcgal</a>

<a href="https://postgis.net/docs/Extras.html#Tiger_Geocoder" description="Enables geocoding and reverse geocoding capabilities in PostGIS using TIGER/Line data.">postgis_tiger_geocoder</a>

<a href="https://www.postgis.net/docs/Topology.html" description="Extends PostGIS with support for topological data types and functions, facilitating the analysis of spatial relationships.">postgis_topology</a>

</DetailIconCards>

## Index / Table Optimizations

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/bloom.html" description="Implements a bloom filter index type for efficient and compact data representation in Postgres">bloom</a>

<a href="https://www.postgresql.org/docs/16/btree-gin.html" description="Provides B-tree equivalent functionality for GIN indexes, enhancing index performance in Postgres">btree_gin</a>

<a href="https://www.postgresql.org/docs/16/btree-gist.html" description="Allows B-tree-like operations on GiST indexes, improving indexing flexibility in Postgres">btree_gist</a>

<a href="https://github.com/RhodiumToad/ip4r" description="Provides types and functions for efficiently storing and querying IPv4 and IPv6 ranges and addresses in Postgres">ip4r</a>

<a href="https://github.com/sraoss/pg_ivm" description="Implements Incremental View Maintenance (IVM) for faster refresh of materialized views">pg_ivm</a>

<a href="https://www.postgresql.org/docs/16/pgprewarm.html" description="Allows manual preloading of relation data into the buffer cache, reducing access times for frequently queried tables">pg_prewarm</a>

<a href="https://github.com/ChenHuajun/pg_roaringbitmap" description="Implements Roaring Bitmaps in Postgres for efficient storage and manipulation of bit sets">pg_roaringbitmap</a>

<a href="https://github.com/ChenHuajun/pg_roaringbitmap" description="Implements Roaring Bitmaps for efficient and compact storage of integer sets within Postgres.">roaringbitmap</a>

</DetailIconCards>

## Metrics

<DetailIconCards>

<a href="/docs/extensions/pg_stat_statements" description="Tracks execution statistics for all SQL statements executed, aiding in performance analysis and tuning">pg_stat_statements</a>

<a href="https://www.postgresql.org/docs/16/pgstattuple.html" description="Offers functions to show tuple-level statistics for tables, helping identify bloat and efficiency opportunities.">pgstattuple</a>

<a href="https://www.postgresql.org/docs/16/tsm-system-rows.html" description="Provides a table sampling method that selects a fixed number of table rows randomly.">tsm_system_rows</a>

<a href="https://www.postgresql.org/docs/16/tsm-system-time.html" description="Offers a table sampling method based on system time, enabling consistent sample data retrieval over time.">tsm_system_time</a>

</DetailIconCards>

## Orchestration

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/tcn.html" description="Provides a trigger-based change notification system, allowing applications to respond to changes in the database.">tcn</a>

</DetailIconCards>

## Procedural Languages

<DetailIconCards>

<a href="https://github.com/plv8/plv8/" description="Enables writing stored procedures and functions in CoffeeScript, a programming language that transcompiles to JavaScript.">plcoffee</a>

<a href="https://github.com/plv8/plv8/" description="Allows the use of LiveScript, a language that compiles to JavaScript, for writing functions and stored procedures in Postgres.">plls</a>

<a href="https://www.postgresql.org/docs/16/plpgsql.html" description="The default procedural language for Postgres, enabling the creation of complex functions and triggers.">plpgsql</a>

<a href="https://plv8.github.io/" description="Integrates V8 JavaScript Engine with Postgres, allowing for JavaScript stored procedures and functions.">plv8</a>

</DetailIconCards>

## Query Optimization

<DetailIconCards>

<a href="https://hypopg.readthedocs.io/en/rel1_stable/" description="Provides the ability to create hypothetical indexes in Postgres for performance testing without altering the physical disk structure">hypopg</a>

<a href="https://github.com/ossc-db/pg_hint_plan" description="Allows developers to influence query plans with hints, improving performance and control over query execution">pg_hint_plan</a>

</DetailIconCards>

## Scientific Computing

<DetailIconCards>

<a href="https://github.com/rdkit/rdkit" description="Integrates the RDKit cheminformatics toolkit with Postgres, enabling chemical informatics operations directly in the database.">rdkit</a>

<a href="https://github.com/df7cb/postgresql-unit" description="Supports the storage, manipulation, and calculation of scientific units, enhancing Postgres capabilities for scientific data.">unit</a>

</DetailIconCards>

## Search

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/dict-int.html" description="Provides a text search dictionary template for indexing integer data in Postgres">dict_int</a>

<a href="https://www.postgresql.org/docs/16/fuzzystrmatch.html" description="Offers several functions to help match and compare strings with approximate equality in Postgres">fuzzystrmatch</a>

<a href="/docs/extensions/pg_trgm" description="Supports text search and similarity measurements using trigram matching, enhancing full-text search capabilities">pg_trgm</a>

<a href="https://github.com/dimitri/prefix" description="Supports efficient queries on text columns with prefix-based searching capabilities.">prefix</a>

<a href="https://github.com/postgrespro/rum" description="Provides a RUM index type, designed to speed up full-text searches and other operations that benefit from immediate consistency.">rum</a>

<a href="https://www.postgresql.org/docs/16/unaccent.html" description="A text search dictionary that removes accents from characters, simplifying text search in Postgres.">unaccent</a>

</DetailIconCards>

## Security

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/pgcrypto.html" description="Offers cryptographic functions, allowing for encryption and hashing of data within Postgres">pgcrypto</a>

<a href="https://github.com/michelp/pgjwt" description="Implements JSON Web Tokens (JWT) in Postgres, allowing for secure token creation and verification.">pgjwt</a>

</DetailIconCards>

## Tooling / Admin

<DetailIconCards>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Automatically increments numeric columns in Postgres, mimicking auto-increment functionality">autoinc (spi)</a>

<a href="https://hypopg.readthedocs.io/en/rel1_stable/" description="Provides the ability to create hypothetical indexes in Postgres for performance testing without altering the physical disk structure">hypopg</a>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Automatically inserts the username of the person executing an insert operation into a specified table in Postgres">insert_username (spi)</a>

<a href="https://www.postgresql.org/docs/16/lo.html" description="Manages large objects (LOBs) within Postgres, allowing for the storage and manipulation of binary data">lo</a>

<a href="/docs/extensions/neon" description="Placeholder description for neon extension, please provide an actual description">neon</a>

<a href="/docs/extensions/neon-utils" description="Placeholder description for neon_utils extension, please provide an actual description">neon_utils</a>

<a href="https://pgtap.org/documentation.html" description="A unit testing framework for Postgres, enabling sophisticated testing of database queries and functions.">pgtap</a>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Provides referential integrity triggers, helping maintain foreign key relationships automatically.">refint (spi)</a>

</DetailIconCards>
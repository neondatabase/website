---
title: Postgres extensions
enableTableOfContents: true
---

Explore supported Postgres extensions by category. Also see:

- [List view of supported extensions and versions](/docs/extensions/pg-extensions)
- [Install an extension](/docs/extensions/pg-extensions#install-an-extension)
- [Update an extension](/docs/extensions/pg-extensions#update-an-extension-version)
- [Request extension support](/docs/extensions/pg-extensions#request-extension-support)

## AI / Machine Learning

<DetailIconCards>

<a href="/docs/extensions/pg_tiktoken" description="Tokenize data in Postgres using the OpenAI tiktoken library" icon="app-store" icon="app-store">pg_tiktoken</a>

<a href="/docs/extensions/pgvector" description="Store vector embeddings and perform vector similarity search in Postgres" icon="app-store" icon="app-store">pgvector</a>

</DetailIconCards>

## Analytics

<DetailIconCards>

<a href="https://github.com/citusdata/postgresql-hll" description="Implements a HyperLogLog data structure as a native data type for efficient and tunable distinct value counting" icon="app-store" icon="app-store">hll</a>

<a href="/docs/extensions/timescaledb" description="Enables Postgres as a time-series database for efficient storage and retrieval of time-series data" icon="app-store">timescaledb</a>

</DetailIconCards>

## Auditing / Logging

<DetailIconCards>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Implements a trigger that stores the current user's name into a text field, useful for tracking who modified a particular row within a table" icon="app-store">insert_username</a>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Implements a trigger that automatically updates a timestamp column to the current timestamp whenever a row is modified" icon="app-store">moddatetime</a>

<a href="https://www.postgresql.org/docs/16/pgrowlocks.html" description="Provides a function that shows row locking information for a specified table, useful in concurrency and deadlock debugging" icon="app-store">pgrowlocks</a>

<a href="https://www.postgresql.org/docs/16/tcn.html" description="Provides a trigger function to notify listeners of changes to a table, allowing applications to respond to changes in the database" icon="app-store">tcn</a>

</DetailIconCards>

## Data / Transformations

<DetailIconCards>

<a href="https://postgis.net/docs/Extras.html#Address_Standardizer" description="A single-line address parser that takes an input address and normalizes it based on a set of rules" icon="app-store">address_standardizer</a>

<a href="https://postgis.net/docs/Extras.html#Address_Standardizer" description="Provides data for standardizing US addresses, for use with the address_standardizer extension" icon="app-store">address_standardizer_data_us</a>

<a href="/docs/extensions/citext" description="Provides a case-insensitive character string type that internally calls lower when comparing values in Postgres" icon="app-store">citext</a>

<a href="https://www.postgresql.org/docs/16/cube.html" description="Implements the cube data type for representing multidimensional cubes in Postgres" icon="app-store">cube</a>

<a href="https://www.postgresql.org/docs/16/earthdistance.html" description="Provides cube-based and point-based approaches to calculating great circle distances on the surface of the Earth" icon="app-store">earthdistance</a>

<a href="/docs/extensions/hstore" description="Implements an hstore data type for storing and manipulating sets of key-value pairs within a single Postgres value" icon="app-store">hstore</a>

<a href="https://www.postgresql.org/docs/16/intagg.html" description="Provides an integer aggregator and enumerator for Postgres" icon="app-store">intagg</a>

<a href="https://www.postgresql.org/docs/16/intarray.html" description="Offers functions and operators for manipulating and searching arrays of integers within Postgres" icon="app-store">intarray</a>

<a href="https://www.postgresql.org/docs/16/isn.html" description="Implements data types for international product numbering standards: EAN13, UPC, ISBN (books), ISMN (music), and ISSN (serials)" icon="app-store">isn</a>

<a href="https://www.postgresql.org/docs/16/ltree.html" description="Provides data types for representing labels of data stored in a hierarchical tree-like structure and facilities for searching through label trees" icon="app-store">ltree</a>

<a href="https://github.com/supabase/pg_graphql" description="Adds GraphQL support to Postgres, allowing you to query your database via GraphQL" icon="app-store">pg_graphql</a>

<a href="https://github.com/iCyberon/pg_hashids" description="Enables the generation of short, unique hash ids from integers, useful for obfuscating internal ids" icon="app-store">pg_hashids</a>

<a href="https://github.com/supabase/pg_jsonschema" description="Provides support for JSON schema validation on json and jsonb data types" icon="app-store">pg_jsonschema</a>

<a href="https://github.com/fboulnois/pg_uuidv7" description="Enables creating valid UUID Version 7 values in Postgres, enabling globally unique identifiers with temporal ordering" icon="app-store">pg_uuidv7</a>

<a href="https://github.com/pksunkara/pgx_ulid" description="A full-featured extension for generating and working with ULID (Universally Unique Lexicographically Sortable Identifiers)" icon="app-store">pgx_ulid</a>

<a href="https://www.postgresql.org/docs/16/seg.html" description="Implements the seg data type for storage and manipulation of line segments or floating-point ranges, useful for geometric and scientific applications" icon="app-store">seg</a>

<a href="https://www.postgresql.org/docs/16/tablefunc.html" description="Contains functions that return tables (multiple rows), including crosstab, which can pivot row data into columns dynamically" icon="app-store">tablefunc</a>

<a href="https://www.postgresql.org/docs/16/unaccent.html" description="A text search dictionary that removes accents from characters, simplifying text search in Postgres" icon="app-store">unaccent</a>

<a href="https://github.com/df7cb/postgresql-unit" description="Implements a data type for SI units, plus byte, for storage, manipulation, and calculation of scientific units" icon="app-store">unit</a>

<a href="https://www.postgresql.org/docs/16/uuid-ossp.html" description="Provides functions to generate universally unique identifiers (UUIDs) in Postgres, supporting various UUID standards" icon="app-store">uuid-ossp</a>

<a href="https://www.postgresql.org/docs/current/xml2.html" description="Enables XPath queries and XSLT functionality directly within Postgres, enabling XML data processing" icon="app-store">xml2</a>

</DetailIconCards>

## Debugging

<DetailIconCards>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Automatically updates a timestamp column to the current timestamp whenever a row is modified in Postgres" icon="app-store">moddatetime</a>

<a href="https://www.postgresql.org/docs/16/pgrowlocks.html" description="Provides a function that shows row locking information for a specified table, which can aid in concurrency and deadlock debugging" icon="app-store">pgrowlocks</a>

<a href="https://pgtap.org/documentation.html" description="A unit testing framework for Postgres, enabling sophisticated testing of database queries and functions" icon="app-store">pgTap</a>

<a href="https://pgxn.org/dist/plpgsql_check/" description="Provides a linter and debugger for PL/pgSQL code, helping identify errors and optimize PL/pgSQL functions" icon="app-store">plpgsql_check</a>

</DetailIconCards>

## Geospatial

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/cube.html" description="Implements a data type for representing multidimensional cubes in Postgres" icon="app-store">cube</a>

<a href="https://www.postgresql.org/docs/16/earthdistance.html" description="Provides cube-based and point-based approaches to calculating great circle distances on the surface of the Earth" icon="app-store">earthdistance</a>

<a href="https://github.com/zachasme/h3-pg/blob/main/docs/api.md" description="Integrates Uber's H3 geospatial indexing system that combines the benefits of a hexagonal grid with S2's hierarchical subdivisions" icon="app-store">h3</a>

<a href="https://github.com/zachasme/h3-pg/blob/main/docs/api.md" description="A PostGIS extension for H3, enabling advanced spatial analysis and indexing" icon="app-store">h3_postgis</a>

<a href="https://docs.pgrouting.org/" description="Extends PostGIS/Postgres databases, providing geospatial routing and other network analysis functionality" icon="app-store">pgrouting</a>

<a href="/docs/extensions/postgis" description="Extends Postgres to allow GIS (Geographic Information Systems) objects to be stored in the database, enabling spatial queries directly in SQL" icon="app-store">postgis</a>

<a href="https://postgis.net/docs/RT_reference.html" description="Adds support for raster data to PostGIS, enabling advanced geospatial analysis on raster images" icon="app-store">postgis_raster</a>

<a href="https://postgis.net/docs/reference.html#reference_sfcgal" description="Provides support for advanced 3D geometries in PostGIS, based on the SFCGAL library" icon="app-store">postgis_sfcgal</a>

<a href="https://postgis.net/docs/Extras.html#Tiger_Geocoder" description="Enables geocoding and reverse geocoding capabilities in PostGIS using TIGER/Line data" icon="app-store">postgis_tiger_geocoder</a>

<a href="https://www.postgis.net/docs/Topology.html" description="Extends PostGIS with support for topological data types and functions, facilitating the analysis of spatial relationships" icon="app-store">postgis_topology</a>

</DetailIconCards>

## Index / Table optimization

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/bloom.html" description="Provides an index access method for Postgres based on Bloom filters" icon="app-store">bloom</a>

<a href="https://www.postgresql.org/docs/16/btree-gin.html" description="Provides GIN operator classes that implement B-tree equivalent behavior" icon="app-store">btree_gin</a>

<a href="https://www.postgresql.org/docs/16/btree-gist.html" description="Provides GiST index operator classes that implement B-tree equivalent behavior" icon="app-store">btree_gist</a>

<a href="https://github.com/RhodiumToad/ip4r" description="Provides a range index type and functions for efficiently storing and querying IPv4 and IPv6 ranges and addresses in Postgres" icon="app-store">ip4r</a>

<a href="https://github.com/sraoss/pg_ivm" description="Provides an Incremental View Maintenance (IVM) feature for Postgres" icon="app-store">pg_ivm</a>

<a href="/docs/extensions/pg_prewarm" description="Allows manual preloading of relation data into the Postgres buffer cache, reducing access times for frequently queried tables" icon="app-store">pg_prewarm</a>

<a href="https://github.com/ChenHuajun/pg_roaringbitmap" description="Implements Roaring Bitmaps in Postgres for efficient storage and manipulation of bit sets" icon="app-store">pg_roaringbitmap</a>

<a href="https://github.com/postgrespro/rum" description="Provides an access method to work with a RUM index, designed to speed up full-text searches" icon="app-store">rum</a>

</DetailIconCards>

## Metrics

<DetailIconCards>

<a href="/docs/extensions/neon" description="Provides functions and views designed to gather Neon-specific metrics" icon="app-store">neon</a>

<a href="/docs/extensions/pg_stat_statements" description="Tracks planning and execution statistics for all SQL statements executed, aiding in performance analysis and tuning" icon="app-store">pg_stat_statements</a>

<a href="https://www.postgresql.org/docs/16/pgstattuple.html" description="Offers functions to show tuple-level statistics for tables, helping identify bloat and efficiency opportunities" icon="app-store">pgstattuple</a>

<a href="https://www.postgresql.org/docs/16/tsm-system-rows.html" description="Provides a table sampling method that selects a fixed number of table rows randomly" icon="app-store">tsm_system_rows</a>

<a href="https://www.postgresql.org/docs/16/tsm-system-time.html" description="Offers a table sampling method based on system time, enabling consistent sample data retrieval over time" icon="app-store">tsm_system_time</a>

</DetailIconCards>

## Orchestration

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/tcn.html" description="Provides a trigger function to notify listeners of changes to a table, allowing applications to respond to changes in the database" icon="app-store">tcn</a>

</DetailIconCards>

## Procedural languages

<DetailIconCards>

<a href="https://github.com/plv8/plv8/" description="A Postgres procedural language powered by V8 Javascript Engine for writing functions in Javascript that are callable from SQL" icon="app-store">plcoffee</a>

<a href="https://www.postgresql.org/docs/16/plpgsql.html" description="The default procedural language for Postgres, enabling the creation of complex functions and triggers" icon="app-store">plpgsql</a>

</DetailIconCards>

## Query optimization

<DetailIconCards>

<a href="https://hypopg.readthedocs.io/en/rel1_stable/" description="Provides the ability to create hypothetical (virtual) indexes in Postgres for performance testing" icon="app-store">hypopg</a>

<a href="https://github.com/ossc-db/pg_hint_plan" description="Allows developers to influence query plans with hints in SQL comments, improving performance and control over query execution" icon="app-store">pg_hint_plan</a>

</DetailIconCards>

## Scientific computing

<DetailIconCards>

<a href="https://www.postgresql.org/docs/16/cube.html" description="Implements the cube data type for representing multidimensional cubes in Postgres" icon="app-store">cube</a>

<a href="https://github.com/rdkit/rdkit" description="Integrates the RDKit cheminformatics toolkit with Postgres, enabling chemical informatics operations directly in the database" icon="app-store">rdkit</a>

<a href="https://www.postgresql.org/docs/16/seg.html" description="Implements the seg data type for storage and manipulation of line segments or floating-point intervals, useful for representing laboratory measurements" icon="app-store">seg</a>

<a href="https://github.com/df7cb/postgresql-unit" description="Implements a data type for SI units, plus byte, for storage, manipulation, and calculation of scientific units" icon="app-store">unit</a>


</DetailIconCards>

## Search

<DetailIconCards>

<a href="/docs/extensions/citext" description="Provides a case-insensitive character string type that internally calls lower when comparing values in Postgres" icon="app-store">citext</a>

<a href="https://www.postgresql.org/docs/16/dict-int.html" description="Provides a text search dictionary template for indexing integer data in Postgres" icon="app-store">dict_int</a>

<a href="https://www.postgresql.org/docs/16/fuzzystrmatch.html" description="Provides several functions to determine similarities and distance between strings in Postgres" icon="app-store">fuzzystrmatch</a>

<a href="/docs/extensions/pg_trgm" description="Provides functions and operators for determining the similarity of alphanumeric text based on trigram matching, and index operator classes for fast string similarity search" icon="app-store">pg_trgm</a>

<a href="https://github.com/dimitri/prefix" description="A prefix range module that supports efficient queries on text columns with prefix-based searching and matching capabilities" icon="app-store">prefix</a>

<a href="https://www.postgresql.org/docs/16/unaccent.html" description="A text search dictionary that removes accents from characters, simplifying text search in Postgres" icon="app-store">unaccent</a>

</DetailIconCards>

## Security

<DetailIconCards>

<a href="https://github.com/iCyberon/pg_hashids" description="Enables the generation of short, unique hash ids from integers, useful for obfuscating internal ids" icon="app-store">pg_hashids</a>

<a href="https://www.postgresql.org/docs/16/pgcrypto.html" description="Offers cryptographic functions, allowing for encryption and hashing of data within Postgres" icon="app-store">pgcrypto</a>

<a href="https://github.com/michelp/pgjwt" description="Implements JSON Web Tokens (JWT) in Postgres, allowing for secure token creation and verification" icon="app-store">pgjwt</a>

</DetailIconCards>

## Tooling / Admin

<DetailIconCards>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Provides an autoinc() function that stores the next value of a sequence into an integer field" icon="app-store">autoinc</a>

<a href="https://hypopg.readthedocs.io/en/rel1_stable/" description="Provides the ability to create hypothetical (virtual) indexes in Postgres for performance testing" icon="app-store">hypopg</a>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Automatically inserts the username of the person executing an insert operation into a specified table in Postgres" icon="app-store">insert_username (spi)</a>

<a href="https://www.postgresql.org/docs/16/lo.html" description="Provides support for managing large objects (LOBs) in Postgres, including a data type lo and a trigger lo_manage" icon="app-store">lo</a>

<a href="/docs/extensions/neon-utils" description="Provides a function for monitoring how Neon's Autoscaling feature allocates vCPU in response to workload" icon="app-store">neon_utils</a>

<a href="https://pgtap.org/documentation.html" description="A unit testing framework for Postgres, enabling sophisticated testing of database queries and functions" icon="app-store">pgtap</a>

<a href="https://www.postgresql.org/docs/current/contrib-spi.html" description="Provides functions for maintaining foreign key constraints" icon="app-store">refint (spi)</a>

</DetailIconCards>

---
title: Realtime extension support
subtitle: Use supported Postgres extension functions in live queries.
summary: >-
  Learn which Postgres extensions and functions work in Neon Realtime live
  queries, including requirements for hstore, PostGIS, unaccent dictionaries,
  trigram matching, and Lakebase Text BM25 search.
enableTableOfContents: true
---

Neon Realtime can use supported Postgres extension functions in live queries.
An extension being available in your Neon database does not mean that every
function it provides is available in Realtime. Realtime only accepts functions
that meet its live-query contract. A few useful functions have a documented
fixed-environment or stale-result limitation.

In general, this means immutable scalar functions, operators, casts, types, and
index support from the extensions listed below. Realtime does not support
extension aggregates or window functions, set-returning functions, triggers,
administrative APIs, foreign tables, or functions with side effects. It also
rejects functions whose results depend on a clock, the network, or untracked
session state. The fixed-environment functions and BM25 scorer below are explicit exceptions for
dependencies outside the query's source rows.

For the complete list of extensions available in Neon, see [Postgres
extensions](/docs/extensions/pg-extensions). Before updating an extension used
by a live query, follow [Changing fixed inputs or extension versions](#changing-fixed-inputs-or-extension-versions).

## Supported extensions

The following extensions are available in the Realtime runtime. The usual
function rules still apply, and the sections below call out functions with
additional requirements. These contracts describe the PostgreSQL 18 runtime.

| Category                         | Extensions                                                                                                                                                          |
| :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Indexes and types                | `bloom`, `btree_gin`, `btree_gist`, `cube`, `intarray`, `ip4r`, `prefix`, `roaringbitmap`, `seg`, `vector`                                                          |
| Text, matching, and validation   | `citext`, `dict_int`, `dict_xsyn`, `earthdistance`, `fuzzystrmatch`, `isn`, `lakebase_tokenizer`, `ltree`, `pg_jsonschema`, `pg_trgm`, `semver`, `unaccent`, `xml2` |
| Identifiers and scalar utilities | `hstore`, `lo`, `neon_procstat`, `pg_graphql`, `pg_uuidv7`, `pgcrypto`, `pgx_ulid`, `uuid-ossp`                                                                     |
| Spatial and language support     | `postgis`, `plpgsql`                                                                                                                                                |

`lakebase_vector` and `lakebase_text` are also available as managed preloaded
extensions. The immutable scalar APIs of `lakebase_vector` follow the usual
rules. For `lakebase_text`, only the reviewed tsvector BM25 scorer is admitted,
under the separate contract described in [BM25 search](#bm25-search).

## Functions with fixed-environment requirements

Some useful extension functions are not declared immutable by Postgres, or
their results depend on configuration that is outside the query's source rows.
Realtime supports the following cases under a documented, fixed-environment
contract. Realtime checks function identities and reviewed versions when it
analyzes a subscription. Sealing a query alone does not establish SQL support.
New or altered members of the reviewed subsets do not automatically become
supported by being declared `IMMUTABLE`.

### Hstore map operations

Realtime supports a reviewed subset of PostgreSQL 18 `hstore` 1.8 map
operations: text and text-array constructors, key lookup, existence and
containment checks, delete/merge/slice operations, key and value arrays,
JSON/JSONB conversion, comparisons, hashing, and value codecs. For example:

```sql
SELECT id, attributes OPERATOR(public.->) 'color'
FROM products
WHERE attributes OPERATOR(public.@>) public.hstore('available', 'yes');
```

This example assumes that you installed `hstore` in `public`. Use the schema
where your extension is installed.

When an expression passes an `hstore` value between Postgres and Realtime's row
evaluator, it uses complete query refreshes after source-row changes instead
of small row-level updates. This includes stored values, typed parameters,
and `hstore` values in arrays, composites, domains, ranges, and multiranges.
A scalar expression with only built-in
values at the query boundary, such as `hstore('id', id::text) -> 'id'`, can be
maintained incrementally.

`hstore(record)`, `populate_record(anyelement, hstore)`, and the `#=` operator
are not supported. They can dispatch arbitrary field input/output functions and
domain checks, so Realtime cannot establish a safe live-query contract. Use the
text constructors and extract individual text values instead. The set-returning
`each`, `skeys`, and `svals` functions, subscripting such as
`attributes['color']`, direct internal handlers, the private `ghstore` type,
and `hstore_version_diag` are also unavailable. Use `->` for lookup and `akeys`
or `avals` where an array is appropriate.

Do not order or group directly by an `hstore` value in a live query. Extract a
text key instead, for example `ORDER BY attributes -> 'color', id`. Do not use
hash results as portable identifiers, and avoid duplicate keys when the chosen
value matters. Primary and runtime must use matching reviewed implementations
and compatible encodings. Upgrades require [coordinated updates and worker
restarts](#changing-fixed-inputs-or-extension-versions).

### PostGIS

Realtime supports 600 reviewed scalar signatures from PostGIS 3.6.4, including
geometry and geography measurements, predicates, transforms, codecs, and spatial
index-backed predicates. For example, a subscription can track locations within
500 meters of a point:

```sql
SELECT id, name
FROM places
WHERE ST_DWithin(
  location,
  ST_SetSRID(ST_MakePoint(-73.9857, 40.7484), 4326)::geography,
  500
);
```

This example assumes that `location` is a geography column. Geography distances
are in meters; geometry distances use the coordinate system's units.
`ST_SetSRID` labels coordinates, while `ST_Transform` changes them.

The result of a transform or geography calculation can depend on spatial
reference definitions and projection data. Keep the `spatial_ref_sys` entries
and projection resources used by a live query unchanged for the life of its
subscription. The primary database and Realtime runtime must use matching
PostGIS, GEOS, PROJ, and parser-library builds and the same local projection
data, including `proj.db`, grids, and resources named by projection pipelines.
Realtime disables PROJ network downloads; use local resources and configure the
primary consistently. Changes to CRS rows or local resources are not tracked
as subscription dependencies. Follow the [coordinated update
procedure](#changing-fixed-inputs-or-extension-versions) before changing them.
Results are not guaranteed to be bit-identical across library upgrades.

This support covers core PostGIS scalar operations. PostGIS aggregates,
administration functions, and the raster, SFCGAL, Tiger geocoder, and topology
companion extensions are not supported in Realtime. The legacy
`ST_SymmetricDifference` alias is supported as a specific exception. It does
not make other volatile PostGIS functions available.

Other important function limits include:

| Functions                                                     | Limitation or alternative                                                                                            |
| :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------- |
| `ST_GeneratePoints`                                           | Use the three-argument overload with a positive seed. The unseeded two-argument overload is rejected.                |
| `ST_AsGeoJSON(record, ...)`                                   | Rejected because it dispatches arbitrary field serializers. Convert individual geometry or geography values instead. |
| `ST_FindExtent`, `ST_EstimatedExtent`, and statistics helpers | Rejected because they read changing application rows, indexes, or statistics outside the query's tracked sources.    |
| `Find_SRID` and `postgis_constraint_*`                        | Rejected because they depend on unrelated catalog or session state.                                                  |
| `ST_Letters`                                                  | Unqualified internal references cannot resolve under Realtime's fixed search path.                                   |
| `postgis_full_version()`                                      | Requires optional providers absent from the runtime. Use specific library-version functions instead.                 |

GML input is not supported because it resolves coordinate reference systems
through an incompatible lookup path. Use GeoJSON or WKB input instead. A
function that returns an anonymous record, such as `ST_MinimumBoundingRadius`,
must select a named field or explicitly cast the result before returning it to
the client.

<Admonition type="note" title="Spatial values and refreshes">
Passing PostGIS values between Postgres and Realtime's row evaluator uses
complete query refreshes after source-row changes. This includes stored values,
typed parameters, and nested arrays, domains, composites, ranges, and multiranges. Compositions with
only supported built-in inputs and outputs can remain incremental. The
subscription remains live, but a broad spatial query can cost more to refresh.
</Admonition>

### Unaccent dictionaries

Realtime supports `unaccent` 1.1's `unaccent(text)` and
`unaccent(dictionary, text)` when the dictionary is fixed and uses the reviewed
unaccent template and callbacks. For a custom dictionary, pass a literal
dictionary name, not a value selected from a column or parameter:

```sql
SELECT id, unaccent('public.unaccent'::regdictionary, title) AS normalized_title
FROM articles;
```

The one-argument form uses the dictionary named `unaccent` in the function's
schema. Dynamic dictionaries selected by a column or parameter, dictionaries
using another template, and altered callbacks are rejected.

Keep dictionary definitions, options, templates, rule files, encodings, and
compatible PostgreSQL/unaccent builds fixed and consistent across primary and
runtime. The standard `unaccent.rules` file is packaged; a custom rule file
installed only on the primary is unavailable in Realtime. Rule-file changes
do not invalidate backend caches. Follow [Changing fixed inputs or extension
versions](#changing-fixed-inputs-or-extension-versions) before changing them.
See [the `unaccent` extension guide](/docs/extensions/unaccent) for dictionary
configuration details.

### Trigram similarity and ISBN settings

Realtime supports `pg_trgm` 1.6's similarity and word-similarity operators and
`show_limit()`. These operations use Realtime's fixed thresholds:

| Setting                                    | Value |
| :----------------------------------------- | ----: |
| `pg_trgm.similarity_threshold`             | `0.3` |
| `pg_trgm.word_similarity_threshold`        | `0.6` |
| `pg_trgm.strict_word_similarity_threshold` | `0.5` |

Changing these settings with `SET`, a role default, or a database default does
not change how Realtime evaluates a live query. Similarly, Realtime supports
`isn` 1.3's `isn_weak()` with `isn.weak` fixed to `off`.

### Vector search settings

Realtime also fixes the search settings that affect vector index results:

| Setting                    |   Value |
| :------------------------- | ------: |
| `hnsw.ef_search`           |    `40` |
| `hnsw.iterative_scan`      |   `off` |
| `hnsw.max_scan_tuples`     | `20000` |
| `hnsw.scan_mem_multiplier` |     `1` |
| `ivfflat.probes`           |     `1` |
| `ivfflat.iterative_scan`   |   `off` |
| `ivfflat.max_probes`       | `32768` |
| `lakebase_ann.probes`      |  `auto` |
| `lakebase_ann.epsilon`     |  `auto` |
| `lakebase_ann.prefilter`   |   `off` |

Database, role, and session overrides do not change these values for a live
query. Approximate index scans can return different candidates from an exact
scan or a query run with different settings.

### Other reviewed stable functions

Realtime also supports these narrowly scoped stable functions:

- `pg_uuidv7` 1.6: `uuid_v7_to_timestamp()` and `uuid_v7_to_timestamptz()`
- `xml2` 1.2: `xml_valid(text)`
- `citext` 1.8: the reviewed case-insensitive type transport operations

These stable-function exceptions do not include UUID generators or other stable
functions from these extensions. Other functions remain subject to the ordinary
immutable scalar rules. For example, generate a UUID during a write and store it
in a table before using it in a live query, rather than calling a UUID generator
from the query itself.

### Other extension-specific limits

The supported-extension list does not make an extension's administrative or
stateful APIs available. In particular:

- `pgx_ulid` supports its type, comparisons, and UUID, bytea, and timestamp
  conversions. `gen_ulid()` and `gen_monotonic_ulid()` are generators and are
  not supported.
- `uuid-ossp` supports deterministic UUID v3 and v5 generation. Its random and
  time-based UUID generators are not supported.
- `pgcrypto` supports immutable crypto helpers such as digest, encryption,
  decryption, armor, and verification. Randomness and key-generation functions
  are not supported.
- `neon_procstat` supports only the `neon_procstat_clock_tick()` and
  `neon_procstat_page_size()` constants, not live process-statistics functions.
- `pg_graphql` supports only `graphql.comment_directive(text)`, not the GraphQL
  resolver.
- `lo` supports the `lo_oid(lo)` cast. It does not make large-object content
  reads available in live queries.
- `dict_int`, `dict_xsyn`, and `lakebase_tokenizer` provide dictionaries for
  text-search APIs with explicit configurations or dictionary identities.
  Their internal handlers are not direct query functions.
- Some `earthdistance` SQL helpers use unqualified extension references that
  cannot resolve under Realtime's execution search path. The C point-distance
  operator and `earth()` constant are supported.

## Changing fixed inputs or extension versions

For fixed-environment functions, keep the relevant definitions, data files,
encodings, and compatible builds unchanged while subscribed. Cached copies of
those fixed inputs are compatible with live queries; changing the inputs
without refreshing the caches can produce inconsistent results.

Before changing an affected dictionary, CRS definition, local resource, or
extension implementation:

1. End affected subscriptions.
2. Update the primary and Realtime environment consistently. Runtime library
   or data-file changes require a coordinated platform update.
3. Restart the relevant PostgreSQL workers to clear cached definitions and
   resources. Reconnecting only the client does not clear these caches.
4. Recompute affected stored derived values and rebuild affected expression
   indexes.
5. Create new sealed queries and subscriptions. The new implementation must
   still match a supported function contract.

Ordinary application row writes continue to produce subscription updates;
they are not part of the fixed environment.

## BM25 search

Realtime supports the `lakebase_text` 0.1.3 tsvector BM25 scorer as an explicit
search consistency exception. BM25 scores depend on corpus-wide index statistics, so
they are not immutable in the usual sense.

Use a `lakebase_bm25` index on the base `tsvector` column that the query reads,
and name that index with a constant `regclass` in the score expression. For an
extension installed in `public`, the supported shape is:

```sql
SELECT id,
       terms OPERATOR(public.<@>)
         ROW(to_tsvector('english', 'postgres'), 'public.documents_bm25'::regclass)
           ::public.bm25query_tsvector AS score
FROM public.documents
ORDER BY score, id
LIMIT 10;
```

Replace `public` with the schema where you installed `lakebase_text`. The index
must be valid, ready, and live and must index `documents.terms` directly.
The caller needs table-level `SELECT` permission, and the usual source and
row-security restrictions still apply. Realtime does not support a dynamically
chosen index, an index on a different table, an expression index, a derived
document column, or the `to_bm25query()` helper in a live query. Experimental
`lakebase_bm25v0`, JSON/ftsvector APIs, index administration, and inspection are
also outside this scorer contract. Scores are negative BM25 values, so
ascending order returns the most relevant results first.

BM25 uses these fixed search settings, regardless of database, role, or session
overrides:

| Setting                       |  Value |
| :---------------------------- | -----: |
| `lakebase_bm25.enable_scan`   |   `on` |
| `lakebase_bm25.default_limit` | `1000` |
| `lakebase_bm25.prefilter`     |  `off` |

Index scans can omit zero-score rows, and index limits affect the candidate set.
Primary and runtime must use compatible extension implementations and index
formats.

Realtime follows the query's ordinary source filters and maintenance strategy;
it does not rescore the whole corpus after every write. For example, a document
added to a different bucket can change BM25 statistics without updating a
subscription filtered to your bucket. Changes to rows that match the query,
including inserts, deletes, and document edits, still follow ordinary live-query
maintenance. A normal whole-query refresh, including one for an `ORDER BY` and
`LIMIT` shape, can rescore existing rows.

BM25 statistics can change during maintenance such as `VACUUM`, without a
decoded row change. Neither maintenance nor a corpus write guarantees that
Realtime rescans existing rows. Scores, score-based filter membership, and
top-K rankings can therefore remain stale relative to a fresh query. Recreate
the subscription when you need a fresh evaluation. There is no periodic rescore
guarantee, so staleness can persist indefinitely. Statistics are not
MVCC-versioned: repeated evaluations can differ while visible document rows
are unchanged, and a fresh evaluation is not an exact historical snapshot.
Use Realtime BM25 only when your application can accept that tradeoff. See [Lakebase
Text](/docs/extensions/lakebase-text) for index setup and general BM25 behavior.

## Extensions not supported in Realtime

Extensions absent from the supported list are unavailable to Realtime
subscriptions, even when installed for normal database queries. The table below
highlights providers with unsupported dependencies or functions. Their pure
helpers are also excluded until an enforced function subset is available.

| Extensions                                                                       | Reason                                                                                                                                       |
| :------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `address_standardizer`, `address_standardizer_data_us`                           | Standardization selects unproved SQL relations and callbacks. The data bundle only supports that excluded consumer.                          |
| `pgrouting`                                                                      | Routing functions execute user-provided SQL and need a separate dependency contract.                                                         |
| `h3`, `h3_postgis`                                                               | H3 includes an unsafe legacy-representation migration callback without an enforced safe subset. H3/PostGIS also requires excluded providers. |
| `hll`                                                                            | Some functions declared immutable mutate backend defaults used by later calls.                                                               |
| `pgjwt`                                                                          | The verification function reads the clock despite its immutable declaration.                                                                 |
| `pgtap`                                                                          | A helper declared immutable performs implicit current-role privilege checks.                                                                 |
| `rdkit`                                                                          | Matching and fingerprint results depend on unpinned session settings and stored-index behavior.                                              |
| `rag`                                                                            | Functions can make external network requests and read hidden configuration.                                                                  |
| `postgis_raster`, `postgis_sfcgal`, `postgis_tiger_geocoder`, `postgis_topology` | Separate providers with external-data, table-backed, or additional native callback contracts outside core PostGIS support.                   |

Unsupported extension types and index access methods are also unavailable.
Postgres can open every index on a referenced table, so a table carrying an
unsupported index can fail even for a query that selects only its primary key.
Supported vector and Lakebase index families remain usable.

<NeedHelp/>

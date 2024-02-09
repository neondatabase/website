### Postgres extension support

- Added support for the [pg_uuidv7](https://github.com/fboulnois/pg_uuidv7) extension, which enables creating [version 7 UUIDs](https://www.ietf.org/archive/id/draft-ietf-uuidrev-rfc4122bis-00.html#name-uuid-version-7) in Postgres.
- Added support for the [pg_roaringbitmap](https://github.com/ChenHuajun/pg_roaringbitmap) extension. Roaring bitmaps are a type of compressed bitmap that generally surpass traditional compressed bitmaps in performance.

For more information about Postgres extensions supported by Neon and how to install them, see [Postgres extensions](/docs/extensions/pg-extensions).

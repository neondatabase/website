---
title: Read Path
---

PostgreSQL &lt;-- Pageserver &lt;-- Cloud storage

When PostgreSQL needs to read a page, it sends a [GetPage@LSN](#getpage@lsn) request to the Pageserver. The Pageserver uses the set of immutable files to locate the last base image of the page and any WAL records over the base image, and uses them to materialize the requested page version.

If the requested page might not be available in the set of files stored on the Pageserver, the required files are downloaded from Cloud Storage.

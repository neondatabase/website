### What's new

- Compute: Fixed an issue that prevented creating a database when the specified database name included trailing spaces.
- Pageserver: Fixed an `INSERT ... ON CONFLICT` handling issue for speculative Write-Ahead Log (WAL) record inserts. Under certain load conditions, records added with `INSERT ... ON CONFLICT` could be replayed incorrectly.
- Pageserver: Fixed a Free Space Map (FSM) and Visibility Map (VM) page reconstruction issue that caused compute nodes to start slowly under certain workloads.
- Pageserver: Fixed a garbage collection (GC) issue that could lead to a database failure under high load.
- Pageserver: Improved query performance for larger databases by improving R-tree layer map search. The envelope for each layer is now remembered so that it does not have to be reconstructed for each call.

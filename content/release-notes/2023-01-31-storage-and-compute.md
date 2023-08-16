### Postgres extension support

Added support for the Postgres `unit` extension. For more information about Postgres extensions supported by Neon, see [Postgres extensions](/docs/extensions/pg-extensions).

### Improvements and fixes

- Compute: Removed logic that updated roles each time a Neon compute instance was restarted. Roles were updated on each restart to address a password-related backward compatibility issue that is no longer relevant.
- Pageserver: Reimplemented the layer map used to track the data layers in a branch. The layer map now uses an immutable binary search tree (BST) data structure, which improves data layer lookup performance over the previous R-tree implementation. The data required to reconstruct page versions is stored as data layers in Neon Pageservers.
- Pageserver: Changed the garbage collection (`gc`) interval from 100 seconds to 60 minutes. This change reduces the frequency of layer map locks.
- Pageserver: Implemented an asynchronous pipe for communication with the Write Ahead Log (WAL) redo process, which helps improves OLAP query performance.

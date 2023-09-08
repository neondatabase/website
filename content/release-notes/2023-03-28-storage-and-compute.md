### Fixes & improvements

- Compute: Free space in the local file system that Neon uses for temporary files, unlogged tables, and the local file cache, is now monitored in order to maximize the space available for the local file cache.
- Pageserver: Logical size and partitioning values are now computed before threshold-based eviction of data layers to avoid downloading previously evicted data layer files when restarting a Pageserver.
- Pageserver: The delete timeline endpoint in the Pageserver management API did not return the proper HTTP code.
- Pageserver: Fixed an issue in a data storage size calculation that caused an incorrect value to be returned.
- Pageserver: Addressed unexpected data layer downloads that occurred after a Pageserver restart. The data layers most likely required for the data storage size calculation after a Pageserver restart are now retained.

[#id](#GIN-TIPS)

## 70.5. GIN Tips and Tricks [#](#GIN-TIPS)

- Create vs. insert

  Insertion into a GIN index can be slow due to the likelihood of many keys being inserted for each item. So, for bulk insertions into a table it is advisable to drop the GIN index and recreate it after finishing bulk insertion.

  When `fastupdate` is enabled for GIN (see [Section 70.4.1](gin-implementation#GIN-FAST-UPDATE) for details), the penalty is less than when it is not. But for very large updates it may still be best to drop and recreate the index.

- [maintenance_work_mem](runtime-config-resource#GUC-MAINTENANCE-WORK-MEM)

  Build time for a GIN index is very sensitive to the `maintenance_work_mem` setting; it doesn't pay to skimp on work memory during index creation.

- [gin_pending_list_limit](runtime-config-client#GUC-GIN-PENDING-LIST-LIMIT)

  During a series of insertions into an existing GIN index that has `fastupdate` enabled, the system will clean up the pending-entry list whenever the list grows larger than `gin_pending_list_limit`. To avoid fluctuations in observed response time, it's desirable to have pending-list cleanup occur in the background (i.e., via autovacuum). Foreground cleanup operations can be avoided by increasing `gin_pending_list_limit` or making autovacuum more aggressive. However, enlarging the threshold of the cleanup operation means that if a foreground cleanup does occur, it will take even longer.

  `gin_pending_list_limit` can be overridden for individual GIN indexes by changing storage parameters, which allows each GIN index to have its own cleanup threshold. For example, it's possible to increase the threshold only for the GIN index which can be updated heavily, and decrease it otherwise.

- [gin_fuzzy_search_limit](runtime-config-client#GUC-GIN-FUZZY-SEARCH-LIMIT)

  The primary goal of developing GIN indexes was to create support for highly scalable full-text search in PostgreSQL, and there are often situations when a full-text search returns a very large set of results. Moreover, this often happens when the query contains very frequent words, so that the large result set is not even useful. Since reading many tuples from the disk and sorting them could take a lot of time, this is unacceptable for production. (Note that the index search itself is very fast.)

  To facilitate controlled execution of such queries, GIN has a configurable soft upper limit on the number of rows returned: the `gin_fuzzy_search_limit` configuration parameter. It is set to 0 (meaning no limit) by default. If a non-zero limit is set, then the returned set is a subset of the whole result set, chosen at random.

  “Soft” means that the actual number of returned results could differ somewhat from the specified limit, depending on the query and the quality of the system's random number generator.

  From experience, values in the thousands (e.g., 5000 — 20000) work well.

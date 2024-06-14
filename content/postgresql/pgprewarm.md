[#id](#PGPREWARM)

## F.30. pg_prewarm — preload relation data into buffer caches [#](#PGPREWARM)

- [F.30.1. Functions](pgprewarm#PGPREWARM-FUNCS)
- [F.30.2. Configuration Parameters](pgprewarm#PGPREWARM-CONFIG-PARAMS)
- [F.30.3. Author](pgprewarm#PGPREWARM-AUTHOR)

The `pg_prewarm` module provides a convenient way to load relation data into either the operating system buffer cache or the PostgreSQL buffer cache. Prewarming can be performed manually using the `pg_prewarm` function, or can be performed automatically by including `pg_prewarm` in [shared_preload_libraries](runtime-config-client#GUC-SHARED-PRELOAD-LIBRARIES). In the latter case, the system will run a background worker which periodically records the contents of shared buffers in a file called `autoprewarm.blocks` and will, using 2 background workers, reload those same blocks after a restart.

[#id](#PGPREWARM-FUNCS)

### F.30.1. Functions [#](#PGPREWARM-FUNCS)

```
pg_prewarm(regclass, mode text default 'buffer', fork text default 'main',
           first_block int8 default null,
           last_block int8 default null) RETURNS int8
```

The first argument is the relation to be prewarmed. The second argument is the prewarming method to be used, as further discussed below; the third is the relation fork to be prewarmed, usually `main`. The fourth argument is the first block number to prewarm (`NULL` is accepted as a synonym for zero). The fifth argument is the last block number to prewarm (`NULL` means prewarm through the last block in the relation). The return value is the number of blocks prewarmed.

There are three available prewarming methods. `prefetch` issues asynchronous prefetch requests to the operating system, if this is supported, or throws an error otherwise. `read` reads the requested range of blocks; unlike `prefetch`, this is synchronous and supported on all platforms and builds, but may be slower. `buffer` reads the requested range of blocks into the database buffer cache.

Note that with any of these methods, attempting to prewarm more blocks than can be cached — by the OS when using `prefetch` or `read`, or by PostgreSQL when using `buffer` — will likely result in lower-numbered blocks being evicted as higher numbered blocks are read in. Prewarmed data also enjoys no special protection from cache evictions, so it is possible that other system activity may evict the newly prewarmed blocks shortly after they are read; conversely, prewarming may also evict other data from cache. For these reasons, prewarming is typically most useful at startup, when caches are largely empty.

```
autoprewarm_start_worker() RETURNS void
```

Launch the main autoprewarm worker. This will normally happen automatically, but is useful if automatic prewarm was not configured at server startup time and you wish to start up the worker at a later time.

```
autoprewarm_dump_now() RETURNS int8
```

Update `autoprewarm.blocks` immediately. This may be useful if the autoprewarm worker is not running but you anticipate running it after the next restart. The return value is the number of records written to `autoprewarm.blocks`.

[#id](#PGPREWARM-CONFIG-PARAMS)

### F.30.2. Configuration Parameters [#](#PGPREWARM-CONFIG-PARAMS)

- `pg_prewarm.autoprewarm` (`boolean`)

  Controls whether the server should run the autoprewarm worker. This is on by default. This parameter can only be set at server start.

* `pg_prewarm.autoprewarm_interval` (`integer`)

  This is the interval between updates to `autoprewarm.blocks`. The default is 300 seconds. If set to 0, the file will not be dumped at regular intervals, but only when the server is shut down.

These parameters must be set in `postgresql.conf`. Typical usage might be:

```
# postgresql.conf
shared_preload_libraries = 'pg_prewarm'

pg_prewarm.autoprewarm = true
pg_prewarm.autoprewarm_interval = 300s
```

[#id](#PGPREWARM-AUTHOR)

### F.30.3. Author [#](#PGPREWARM-AUTHOR)

Robert Haas `<rhaas@postgresql.org>`

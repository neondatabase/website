<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        20.18. Short Options                       |                                                              |                                  |                                                       |                                                                         |
| :---------------------------------------------------------------: | :----------------------------------------------------------- | :------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](runtime-config-developer.html "20.17. Developer Options")  | [Up](runtime-config.html "Chapter 20. Server Configuration") | Chapter 20. Server Configuration | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](client-authentication.html "Chapter 21. Client Authentication") |

***

## 20.18. Short Options [#](#RUNTIME-CONFIG-SHORT)

For convenience there are also single letter command-line option switches available for some parameters. They are described in [Table 20.4](runtime-config-short.html#RUNTIME-CONFIG-SHORT-TABLE "Table 20.4. Short Option Key"). Some of these options exist for historical reasons, and their presence as a single-letter option does not necessarily indicate an endorsement to use the option heavily.

**Table 20.4. Short Option Key**

| Short Option                                           | Equivalent                                                                                                                                                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-B x`                                                 | `shared_buffers = x`                                                                                                                                                                                          |
| `-d x`                                                 | `log_min_messages = DEBUGx`                                                                                                                                                                                   |
| `-e`                                                   | `datestyle = euro`                                                                                                                                                                                            |
| `-fb`, `-fh`, `-fi`, `-fm`, `-fn`, `-fo`, `-fs`, `-ft` | `enable_bitmapscan = off`, `enable_hashjoin = off`, `enable_indexscan = off`, `enable_mergejoin = off`, `enable_nestloop = off`, `enable_indexonlyscan = off`, `enable_seqscan = off`, `enable_tidscan = off` |
| `-F`                                                   | `fsync = off`                                                                                                                                                                                                 |
| `-h x`                                                 | `listen_addresses = x`                                                                                                                                                                                        |
| `-i`                                                   | `listen_addresses = '*'`                                                                                                                                                                                      |
| `-k x`                                                 | `unix_socket_directories = x`                                                                                                                                                                                 |
| `-l`                                                   | `ssl = on`                                                                                                                                                                                                    |
| `-N x`                                                 | `max_connections = x`                                                                                                                                                                                         |
| `-O`                                                   | `allow_system_table_mods = on`                                                                                                                                                                                |
| `-p x`                                                 | `port = x`                                                                                                                                                                                                    |
| `-P`                                                   | `ignore_system_indexes = on`                                                                                                                                                                                  |
| `-s`                                                   | `log_statement_stats = on`                                                                                                                                                                                    |
| `-S x`                                                 | `work_mem = x`                                                                                                                                                                                                |
| `-tpa`, `-tpl`, `-te`                                  | `log_parser_stats = on`, `log_planner_stats = on`, `log_executor_stats = on`                                                                                                                                  |
| `-W x`                                                 | `post_auth_delay = x`                                                                                                                                                                                         |

***

|                                                                   |                                                              |                                                                         |
| :---------------------------------------------------------------- | :----------------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](runtime-config-developer.html "20.17. Developer Options")  | [Up](runtime-config.html "Chapter 20. Server Configuration") |  [Next](client-authentication.html "Chapter 21. Client Authentication") |
| 20.17. Developer Options                                          |     [Home](index.html "PostgreSQL 17devel Documentation")    |                                       Chapter 21. Client Authentication |

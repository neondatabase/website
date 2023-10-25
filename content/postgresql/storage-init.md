

|          73.5. The Initialization Fork          |                                                            |                                       |                                                       |                                                                |
| :---------------------------------------------: | :--------------------------------------------------------- | :-----------------------------------: | ----------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](storage-vm.html "73.4. Visibility Map")  | [Up](storage.html "Chapter 73. Database Physical Storage") | Chapter 73. Database Physical Storage | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](storage-page-layout.html "73.6. Database Page Layout") |

***

## 73.5. The Initialization Fork [#](#STORAGE-INIT)

Each unlogged table, and each index on an unlogged table, has an initialization fork. The initialization fork is an empty table or index of the appropriate type. When an unlogged table must be reset to empty due to a crash, the initialization fork is copied over the main fork, and any other forks are erased (they will be recreated automatically as needed).

***

|                                                 |                                                            |                                                                |
| :---------------------------------------------- | :--------------------------------------------------------: | -------------------------------------------------------------: |
| [Prev](storage-vm.html "73.4. Visibility Map")  | [Up](storage.html "Chapter 73. Database Physical Storage") |  [Next](storage-page-layout.html "73.6. Database Page Layout") |
| 73.4. Visibility Map                            |    [Home](index.html "PostgreSQL 17devel Documentation")   |                                     73.6. Database Page Layout |

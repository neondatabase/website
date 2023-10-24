<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            73.3. Free Space Map           |                                                            |                                       |                                                       |                                                 |
| :---------------------------------------: | :--------------------------------------------------------- | :-----------------------------------: | ----------------------------------------------------: | ----------------------------------------------: |
| [Prev](storage-toast.html "73.2. TOAST")  | [Up](storage.html "Chapter 73. Database Physical Storage") | Chapter 73. Database Physical Storage | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](storage-vm.html "73.4. Visibility Map") |

***

## 73.3. Free Space Map [#](#STORAGE-FSM)

Each heap and index relation, except for hash indexes, has a Free Space Map (FSM) to keep track of available space in the relation. It's stored alongside the main relation data in a separate relation fork, named after the filenode number of the relation, plus a `_fsm` suffix. For example, if the filenode of a relation is 12345, the FSM is stored in a file called `12345_fsm`, in the same directory as the main relation file.

The Free Space Map is organized as a tree of FSM pages. The bottom level FSM pages store the free space available on each heap (or index) page, using one byte to represent each such page. The upper levels aggregate information from the lower levels.

Within each FSM page is a binary tree, stored in an array with one byte per node. Each leaf node represents a heap page, or a lower level FSM page. In each non-leaf node, the higher of its children's values is stored. The maximum value in the leaf nodes is therefore stored at the root.

See `src/backend/storage/freespace/README` for more details on how the FSM is structured, and how it's updated and searched. The [pg\_freespacemap](pgfreespacemap.html "F.28. pg_freespacemap — examine the free space map") module can be used to examine the information stored in free space maps.

***

|                                           |                                                            |                                                 |
| :---------------------------------------- | :--------------------------------------------------------: | ----------------------------------------------: |
| [Prev](storage-toast.html "73.2. TOAST")  | [Up](storage.html "Chapter 73. Database Physical Storage") |  [Next](storage-vm.html "73.4. Visibility Map") |
| 73.2. TOAST                               |    [Home](index.html "PostgreSQL 17devel Documentation")   |                            73.4. Visibility Map |

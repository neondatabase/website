<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 73.6. Database Page Layout                 |                                                            |                                       |                                                       |                                                          |
| :--------------------------------------------------------: | :--------------------------------------------------------- | :-----------------------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](storage-init.html "73.5. The Initialization Fork")  | [Up](storage.html "Chapter 73. Database Physical Storage") | Chapter 73. Database Physical Storage | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](storage-hot.html "73.7. Heap-Only Tuples (HOT)") |

***

## 73.6. Database Page Layout [#](#STORAGE-PAGE-LAYOUT)

* [73.6.1. Table Row Layout](storage-page-layout.html#STORAGE-TUPLE-LAYOUT)

This section provides an overview of the page format used within PostgreSQL tables and indexes.[\[17\]](#ftn.id-1.10.24.8.2.2) Sequences and TOAST tables are formatted just like a regular table.

In the following explanation, a *byte* is assumed to contain 8 bits. In addition, the term *item* refers to an individual data value that is stored on a page. In a table, an item is a row; in an index, an item is an index entry.

Every table and index is stored as an array of *pages* of a fixed size (usually 8 kB, although a different page size can be selected when compiling the server). In a table, all the pages are logically equivalent, so a particular item (row) can be stored in any page. In indexes, the first page is generally reserved as a *metapage* holding control information, and there can be different types of pages within the index, depending on the index access method.

[Table 73.2](storage-page-layout.html#PAGE-TABLE "Table 73.2. Overall Page Layout") shows the overall layout of a page. There are five parts to each page.

**Table 73.2. Overall Page Layout**

| Item           | Description                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| PageHeaderData | 24 bytes long. Contains general information about the page, including free space pointers.                       |
| ItemIdData     | Array of item identifiers pointing to the actual items. Each entry is an (offset,length) pair. 4 bytes per item. |
| Free space     | The unallocated space. New item identifiers are allocated from the start of this area, new items from the end.   |
| Items          | The actual items themselves.                                                                                     |
| Special space  | Index access method specific data. Different methods store different data. Empty in ordinary tables.             |

\

The first 24 bytes of each page consists of a page header (`PageHeaderData`). Its format is detailed in [Table 73.3](storage-page-layout.html#PAGEHEADERDATA-TABLE "Table 73.3. PageHeaderData Layout"). The first field tracks the most recent WAL entry related to this page. The second field contains the page checksum if [data checksums](app-initdb.html#APP-INITDB-DATA-CHECKSUMS) are enabled. Next is a 2-byte field containing flag bits. This is followed by three 2-byte integer fields (`pd_lower`, `pd_upper`, and `pd_special`). These contain byte offsets from the page start to the start of unallocated space, to the end of unallocated space, and to the start of the special space. The next 2 bytes of the page header, `pd_pagesize_version`, store both the page size and a version indicator. Beginning with PostgreSQL 8.3 the version number is 4; PostgreSQL 8.1 and 8.2 used version number 3; PostgreSQL 8.0 used version number 2; PostgreSQL 7.3 and 7.4 used version number 1; prior releases used version number 0. (The basic page layout and header format has not changed in most of these versions, but the layout of heap row headers has.) The page size is basically only present as a cross-check; there is no support for having more than one page size in an installation. The last field is a hint that shows whether pruning the page is likely to be profitable: it tracks the oldest un-pruned XMAX on the page.

**Table 73.3. PageHeaderData Layout**

| Field                 | Type           | Length  | Description                                                               |
| --------------------- | -------------- | ------- | ------------------------------------------------------------------------- |
| pd\_lsn               | PageXLogRecPtr | 8 bytes | LSN: next byte after last byte of WAL record for last change to this page |
| pd\_checksum          | uint16         | 2 bytes | Page checksum                                                             |
| pd\_flags             | uint16         | 2 bytes | Flag bits                                                                 |
| pd\_lower             | LocationIndex  | 2 bytes | Offset to start of free space                                             |
| pd\_upper             | LocationIndex  | 2 bytes | Offset to end of free space                                               |
| pd\_special           | LocationIndex  | 2 bytes | Offset to start of special space                                          |
| pd\_pagesize\_version | uint16         | 2 bytes | Page size and layout version number information                           |
| pd\_prune\_xid        | TransactionId  | 4 bytes | Oldest unpruned XMAX on page, or zero if none                             |

\

All the details can be found in `src/include/storage/bufpage.h`.

Following the page header are item identifiers (`ItemIdData`), each requiring four bytes. An item identifier contains a byte-offset to the start of an item, its length in bytes, and a few attribute bits which affect its interpretation. New item identifiers are allocated as needed from the beginning of the unallocated space. The number of item identifiers present can be determined by looking at `pd_lower`, which is increased to allocate a new identifier. Because an item identifier is never moved until it is freed, its index can be used on a long-term basis to reference an item, even when the item itself is moved around on the page to compact free space. In fact, every pointer to an item (`ItemPointer`, also known as `CTID`) created by PostgreSQL consists of a page number and the index of an item identifier.

The items themselves are stored in space allocated backwards from the end of unallocated space. The exact structure varies depending on what the table is to contain. Tables and sequences both use a structure named `HeapTupleHeaderData`, described below.

The final section is the “special section” which can contain anything the access method wishes to store. For example, b-tree indexes store links to the page's left and right siblings, as well as some other data relevant to the index structure. Ordinary tables do not use a special section at all (indicated by setting `pd_special` to equal the page size).

[Figure 73.1](storage-page-layout.html#STORAGE-PAGE-LAYOUT-FIGURE "Figure 73.1. Page Layout") illustrates how these parts are laid out in a page.

**Figure 73.1. Page Layout**

\

### 73.6.1. Table Row Layout [#](#STORAGE-TUPLE-LAYOUT)

All table rows are structured in the same way. There is a fixed-size header (occupying 23 bytes on most machines), followed by an optional null bitmap, an optional object ID field, and the user data. The header is detailed in [Table 73.4](storage-page-layout.html#HEAPTUPLEHEADERDATA-TABLE "Table 73.4. HeapTupleHeaderData Layout"). The actual user data (columns of the row) begins at the offset indicated by `t_hoff`, which must always be a multiple of the MAXALIGN distance for the platform. The null bitmap is only present if the *HEAP\_HASNULL* bit is set in `t_infomask`. If it is present it begins just after the fixed header and occupies enough bytes to have one bit per data column (that is, the number of bits that equals the attribute count in `t_infomask2`). In this list of bits, a 1 bit indicates not-null, a 0 bit is a null. When the bitmap is not present, all columns are assumed not-null. The object ID is only present if the *HEAP\_HASOID\_OLD* bit is set in `t_infomask`. If present, it appears just before the `t_hoff` boundary. Any padding needed to make `t_hoff` a MAXALIGN multiple will appear between the null bitmap and the object ID. (This in turn ensures that the object ID is suitably aligned.)

**Table 73.4. HeapTupleHeaderData Layout**

| Field        | Type            | Length  | Description                                            |
| ------------ | --------------- | ------- | ------------------------------------------------------ |
| t\_xmin      | TransactionId   | 4 bytes | insert XID stamp                                       |
| t\_xmax      | TransactionId   | 4 bytes | delete XID stamp                                       |
| t\_cid       | CommandId       | 4 bytes | insert and/or delete CID stamp (overlays with t\_xvac) |
| t\_xvac      | TransactionId   | 4 bytes | XID for VACUUM operation moving a row version          |
| t\_ctid      | ItemPointerData | 6 bytes | current TID of this or newer row version               |
| t\_infomask2 | uint16          | 2 bytes | number of attributes, plus various flag bits           |
| t\_infomask  | uint16          | 2 bytes | various flag bits                                      |
| t\_hoff      | uint8           | 1 byte  | offset to user data                                    |

\

All the details can be found in `src/include/access/htup_details.h`.

Interpreting the actual data can only be done with information obtained from other tables, mostly `pg_attribute`. The key values needed to identify field locations are `attlen` and `attalign`. There is no way to directly get a particular attribute, except when there are only fixed width fields and no null values. All this trickery is wrapped up in the functions *heap\_getattr*, *fastgetattr* and *heap\_getsysattr*.

To read the data you need to examine each attribute in turn. First check whether the field is NULL according to the null bitmap. If it is, go to the next. Then make sure you have the right alignment. If the field is a fixed width field, then all the bytes are simply placed. If it's a variable length field (attlen = -1) then it's a bit more complicated. All variable-length data types share the common header structure `struct varlena`, which includes the total length of the stored value and some flag bits. Depending on the flags, the data can be either inline or in a TOAST table; it might be compressed, too (see [Section 73.2](storage-toast.html "73.2. TOAST")).

***

[\[17\] ](#id-1.10.24.8.2.2)Actually, use of this page format is not required for either table or index access methods. The `heap` table access method always uses this format. All the existing index methods also use the basic format, but the data kept on index metapages usually doesn't follow the item layout rules.

***

|                                                            |                                                            |                                                          |
| :--------------------------------------------------------- | :--------------------------------------------------------: | -------------------------------------------------------: |
| [Prev](storage-init.html "73.5. The Initialization Fork")  | [Up](storage.html "Chapter 73. Database Physical Storage") |  [Next](storage-hot.html "73.7. Heap-Only Tuples (HOT)") |
| 73.5. The Initialization Fork                              |    [Home](index.html "PostgreSQL 17devel Documentation")   |                             73.7. Heap-Only Tuples (HOT) |

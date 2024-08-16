[#id](#CUSTOM-RMGR)

## Chapter 66. Custom WAL Resource Managers

This chapter explains the interface between the core PostgreSQL system and custom WAL resource managers, which enable extensions to integrate directly with the [WAL](wal).

An extension, especially a [Table Access Method](tableam) or [Index Access Method](indexam), may need to use WAL for recovery, replication, and/or [Logical Decoding](logicaldecoding). Custom resource managers are a more flexible alternative to [Generic WAL](generic-wal) (which does not support logical decoding), but more complex for an extension to implement.

To create a new custom WAL resource manager, first define an `RmgrData` structure with implementations for the resource manager methods. Refer to `src/backend/access/transam/README` and `src/include/access/xlog_internal.h` in the PostgreSQL source.

```

/*
 * Method table for resource managers.
 *
 * This struct must be kept in sync with the PG_RMGR definition in
 * rmgr.c.
 *
 * rm_identify must return a name for the record based on xl_info (without
 * reference to the rmid). For example, XLOG_BTREE_VACUUM would be named
 * "VACUUM". rm_desc can then be called to obtain additional detail for the
 * record, if available (e.g. the last block).
 *
 * rm_mask takes as input a page modified by the resource manager and masks
 * out bits that shouldn't be flagged by wal_consistency_checking.
 *
 * RmgrTable[] is indexed by RmgrId values (see rmgrlist.h). If rm_name is
 * NULL, the corresponding RmgrTable entry is considered invalid.
 */
typedef struct RmgrData
{
    const char *rm_name;
    void        (*rm_redo) (XLogReaderState *record);
    void        (*rm_desc) (StringInfo buf, XLogReaderState *record);
    const char *(*rm_identify) (uint8 info);
    void        (*rm_startup) (void);
    void        (*rm_cleanup) (void);
    void        (*rm_mask) (char *pagedata, BlockNumber blkno);
    void        (*rm_decode) (struct LogicalDecodingContext *ctx,
                              struct XLogRecordBuffer *buf);
} RmgrData;
```

The `src/test/modules/test_custom_rmgrs` module contains a working example, which demonstrates usage of custom WAL resource managers.

Then, register your new resource manager.

```

/*
 * Register a new custom WAL resource manager.
 *
 * Resource manager IDs must be globally unique across all extensions. Refer
 * to https://wiki.postgresql.org/wiki/CustomWALResourceManagers to reserve a
 * unique RmgrId for your extension, to avoid conflicts with other extension
 * developers. During development, use RM_EXPERIMENTAL_ID to avoid needlessly
 * reserving a new ID.
 */
extern void RegisterCustomRmgr(RmgrId rmid, const RmgrData *rmgr);
```

`RegisterCustomRmgr` must be called from the extension module's [\_PG_init](xfunc-c#XFUNC-C-DYNLOAD) function. While developing a new extension, use `RM_EXPERIMENTAL_ID` for _`rmid`_. When you are ready to release the extension to users, reserve a new resource manager ID at the [Custom WAL Resource Manager](https://wiki.postgresql.org/wiki/CustomWALResourceManagers) page.

Place the extension module implementing the custom resource manager in [shared_preload_libraries](runtime-config-client#GUC-SHARED-PRELOAD-LIBRARIES) so that it will be loaded early during PostgreSQL startup.

### Note

The extension must remain in shared_preload_libraries as long as any custom WAL records may exist in the system. Otherwise PostgreSQL will not be able to apply or decode the custom WAL records, which may prevent the server from starting.

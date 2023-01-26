---
title: Neon storage size
isDraft: true
---

Neon storage size is based on the amount of data that you can access at a particular point in time. The factors used to calculate Neon storage size include:

- The logical size of your data
- The restore window
- The size of Write Ahead Log (WAL)

The _logical size_ is the total size of all tables in all databases at a particular point in time, similar to the data size reported when running the `\l+` command with `psql`, plus [SLRU](tbd) cached data, and a small amount of metadata.

The _Write Ahead Log (WAL)_ is a log of changes made to your data. The WAL is a record of change that are not yet applied to disk. In Neon, WAL also supports the the _point-in-time restore window_. A larger restore window typically means a larger WAL.

The _point-in-time restore window_ is the retained database history, which is the oldest point in time you can recover to. The Neon Free Tier has a point-in-time-restore window of 7 days, which means that you can restore your data up to seven days in the past. The point-in-time restore window is configurable. You can set it to zero to retain no history. Paid tiers users can configure longer data retention periods.

## Storage size examples

The following section describe how storage size is affected in different scenarios.

### A Neon project without branches

If a Neon project has only a single branch (the `main` branch of your Neon project), the data size is simply the sum of:

- The data snapshot (the logical size) on the `main` branch at the beginning of the _point-in-time restore window_
- The size of the The _Write Ahead Log (WAL)_ that covers the _point-in-time restore window_

The snapshot allows you to restore data to the beginning of the _point-in-time restore window_, and the WAL allows you to restore data to any point within the _point-in-time restore window_. The data history that has fallen outside of the restore window can no longer be accessed.

```text
                         restore window
                                |  
main -----------------------#########>
                            ^
                            |
                        snapshot
```

Legend:

- \# The snapshot taken at the beginning of the at the beginning of the _point-in-time restore window_
- \######## The point-in-time restore window. This is the region that you can still create branches from and access with a point-in-time query.
- ----- The history that has fallen out of the point-in-time restore window, and can no
        longer be accessed.

For example, if the snapshot at the beginning of the _point-in-time restore window_ is 10GB, and you have a _point-in-time restore window_ of 7 days, over which time the WAL for data changes during that window is 5GB in size, your data size is 15 GB.

### How inserting data affects storage size

Assume that your database contained 10 GB of data at the beginning of the _point-in-time restore window_, and you have  inserted 5 GB of additional data since then. The additional insertions of 5 GB of data create roughly 5GB of WAL. In this case, the storage size is calculated as follows:

```text
10 GB (snapshot) + 5 GB (WAL) = 15 GB
```

If you now set the _point-in-time restore window_ for the project to 0, so that no history is retained, the size of the snapshot is calculated after the insertions. In this case, the storage size is:

```text
15 GB (snapshot) + 0 GB (WAL) = 15 GB.
```

As you can see, the storage size is the same, regardless of the _point-in-time restore window_, because th entire history consists of inserts. The newly inserted data takes up the same amount of space, whether it's stored as part of the logical snapshot, or as WAL.

<Admonition type="note">
This storage size calcuation described above is an approximation. The WAL contains headers and other overhead, and the logical snapshot includes empty space on pages, so the size of insertions in WAL can be smaller or greater than the size of the final table after the insertions. In most cases, the approximation closely aligns with the actual storage size.
</Admonition>

### How deleting data affects storage size

Assume your database database contains 10 GB of data. You delete 5 GB of the data and run [VACUUM](https://www.postgresql.org/docs/current/sql-vacuum.html) to free up space, so that the logical size of the database is now only 5 GB.

The WAL for the deletions and the vacuum take up 100 MB of space. In this case, the storage size of the project is:

```text
10 GB (snapshot) + 100 MB (WAL) = 10.1 GB
```

The 10.1GB storage size is larger than the _logical size_ of the database after the deletions (5 GB). This is because the Neon must retain the deleted data so that it is accessible to queries and branching for the period of time defined by _point-in-time restore window_.

If you now set the _point-in-time restore window_ to 0 or just wait for time to pass so that the data falls out of the restore window, making the deleted data inaccessible, the storage size shrinks:

5 GB (snapshot) + 0 GB (WAL) = 5 GB

### How branching affects storage size

Creating a branch does not immediately change your project's storage size. A branch can only be created within the _point-in-time restore window_, which means that the data that is accessible to the branch is already retained and included in the current storage size.

However, if you modify data in a branch, Neon generates WAL records for those modifications, and those new WAL records are added your project's storage size.

#### Branch with inserts

Assume you start start with a 10 GB database. On the main branch, you insert 2 GB of data. Then you create a child branch, insert another 3 GB of data on the main branch, and insert 1 GB of data on the child branch.

```text
child                 +#####>
                        |
                        |    WAL
  main    ---------###############>
                   ^
                snapshot

```

In this case, your storage size is calculated as follows:

- the snapshot at the beginning of the _point-in-time restore window_ (10 GB)
- the WAL generated on on the `main` branch when you insert 2 GB and another 3 GB of data (5 GB)
- the WAL on the child branch (1 GB)

Fora total of 16 GB.

#### Diverging branches

If there is only a small amount of changes to data on different branches, as in the previous example, the storage size includes a snapshot of the data before the child branch is created (containing all the shared data), and the WAL for both branches. However, if the branches diverge a lot due to a large amount of changes, it is more efficient to store a snapshot for each branches.

For example, starting with a 10 GB database, you insert 5 GB of data on the main branch. Then you create a branch, and immediately delete all the data on the child branch and insert 5 GB of new data. Then you do the same on the main branch. Now, assume the _point-in-time restore window_ requires keeping the last 1 GB of WAL on the both branches.

```text
                             snapshot
                                  v     WAL
  child                 +---------##############>
                        |
                        |
  main     -------------+---------##############>
                                  ^     WAL
                              snapshot

```

In this case, the storage size consists of:

- snapshot at the beginning of the _point-in-time restore window_ on the main branch (4 GB)
- WAL on the main branch (1 GB)
- snapshot at the beginning of the _point-in-time restore window_ on the child branch (4 GB)
- last 1 GB of WAL on the child branch (1 GB)

Total: 10 GB

An alternative way to store the data is to take only one snapshot at the beginning of branch point, and keep all the WAL on both branches. However, the storage size using that method would be larger, as it would require a 10 GB snapshot, and 5 GB WAL + 5 GB of WAL. It depends on the amount of changes (WAL) on both branches, and the logical size at the branch point, which method would result in a smaller storage size. On each branch point, the Neon performs evaluates both methods, and uses the method that results in the smallest storage size.

Another way think about this is that when you create a branch, it starts out storing only the WAL created since the branch point. As you modify the branch, the amount of WAL grows, and at some point it becomes more efficient to store a new snapshot of the branch and truncate the WAL.

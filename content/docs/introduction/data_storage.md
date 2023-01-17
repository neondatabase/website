---
title: Neon storage size
isDraft: true
---

Neon storage size is calculated for a Neon project as a whole and is based on the amount of data that you can access at a particular point in time. The factors used to calculate Neon storage size include:

- The logical size of your data
- The size of Write Ahead Logs (WAL)
- The point-in-time restore window

The _logical size_ is the total size of all tables in all databases at a particular point in time, as you would see when running the `\l+` command with `psql`, plus [SLRU](tbd) cached data, and a small amount of metadata.

The _WAL_ is the log of changes made to your data.

The _point-in-time restore window_ is the retained database history. The Neon Free Tier has a point-in-time-restore window of 7 days, which means that you can create branches that reflect the state of your data up to 7 days in the past. Paid tiers allow for longer data retention periods.

## Data size calculation examples

The following section describe how data size is affected in different scenarios.

### A Neon project without branches

### How inserting data affects storage size

### How deleting data affects storage size

### How branching affects storage size

### Can you calculate the size of individual branches?

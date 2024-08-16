[#id](#MVCC)

## Chapter 13. Concurrency Control

**Table of Contents**

- [13.1. Introduction](mvcc-intro)
- [13.2. Transaction Isolation](transaction-iso)

  - [13.2.1. Read Committed Isolation Level](transaction-iso#XACT-READ-COMMITTED)
  - [13.2.2. Repeatable Read Isolation Level](transaction-iso#XACT-REPEATABLE-READ)
  - [13.2.3. Serializable Isolation Level](transaction-iso#XACT-SERIALIZABLE)

- [13.3. Explicit Locking](explicit-locking)

  - [13.3.1. Table-Level Locks](explicit-locking#LOCKING-TABLES)
  - [13.3.2. Row-Level Locks](explicit-locking#LOCKING-ROWS)
  - [13.3.3. Page-Level Locks](explicit-locking#LOCKING-PAGES)
  - [13.3.4. Deadlocks](explicit-locking#LOCKING-DEADLOCKS)
  - [13.3.5. Advisory Locks](explicit-locking#ADVISORY-LOCKS)

- [13.4. Data Consistency Checks at the Application Level](applevel-consistency)

  - [13.4.1. Enforcing Consistency with Serializable Transactions](applevel-consistency#SERIALIZABLE-CONSISTENCY)
  - [13.4.2. Enforcing Consistency with Explicit Blocking Locks](applevel-consistency#NON-SERIALIZABLE-CONSISTENCY)

  - [13.5. Serialization Failure Handling](mvcc-serialization-failure-handling)
  - [13.6. Caveats](mvcc-caveats)
  - [13.7. Locking and Indexes](locking-indexes)

This chapter describes the behavior of the PostgreSQL database system when two or more sessions try to access the same data at the same time. The goals in that situation are to allow efficient access for all sessions while maintaining strict data integrity. Every developer of database applications should be familiar with the topics covered in this chapter.

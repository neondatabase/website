[#id](#PARALLEL-QUERY)

## Chapter 15. Parallel Query

**Table of Contents**

- [15.1. How Parallel Query Works](how-parallel-query-works)
- [15.2. When Can Parallel Query Be Used?](when-can-parallel-query-be-used)
- [15.3. Parallel Plans](parallel-plans)

  - [15.3.1. Parallel Scans](parallel-plans#PARALLEL-SCANS)
  - [15.3.2. Parallel Joins](parallel-plans#PARALLEL-JOINS)
  - [15.3.3. Parallel Aggregation](parallel-plans#PARALLEL-AGGREGATION)
  - [15.3.4. Parallel Append](parallel-plans#PARALLEL-APPEND)
  - [15.3.5. Parallel Plan Tips](parallel-plans#PARALLEL-PLAN-TIPS)

- [15.4. Parallel Safety](parallel-safety)

  - [15.4.1. Parallel Labeling for Functions and Aggregates](parallel-safety#PARALLEL-LABELING)

PostgreSQL can devise query plans that can leverage multiple CPUs in order to answer queries faster. This feature is known as parallel query. Many queries cannot benefit from parallel query, either due to limitations of the current implementation or because there is no imaginable query plan that is any faster than the serial query plan. However, for queries that can benefit, the speedup from parallel query is often very significant. Many queries can run more than twice as fast when using parallel query, and some queries can run four times faster or even more. Queries that touch a large amount of data but return only a few rows to the user will typically benefit most. This chapter explains some details of how parallel query works and in which situations it can be used so that users who wish to make use of it can understand what to expect.

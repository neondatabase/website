<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             Chapter 32. Just-in-Time Compilation (JIT)             |                                                    |                                 |                                                       |                                                           |
| :----------------------------------------------------------------: | :------------------------------------------------- | :-----------------------------: | ----------------------------------------------------: | --------------------------------------------------------: |
| [Prev](logical-replication-quick-setup.html "31.11. Quick Setup")  | [Up](admin.html "Part III. Server Administration") | Part III. Server Administration | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](jit-reason.html "32.1. What Is JIT compilation?") |

***

## Chapter 32. Just-in-Time Compilation (JIT)

**Table of Contents**

* [32.1. What Is JIT compilation?](jit-reason.html)

  * *   [32.1.1. JIT Accelerated Operations](jit-reason.html#JIT-ACCELERATED-OPERATIONS)
    * [32.1.2. Inlining](jit-reason.html#JIT-INLINING)
    * [32.1.3. Optimization](jit-reason.html#JIT-OPTIMIZATION)

  * *   [32.2. When to JIT?](jit-decision.html)
  * [32.3. Configuration](jit-configuration.html)
  * [32.4. Extensibility](jit-extensibility.html)

    <!---->

  * *   [32.4.1. Inlining Support for Extensions](jit-extensibility.html#JIT-EXTENSIBILITY-BITCODE)
    * [32.4.2. Pluggable JIT Providers](jit-extensibility.html#JIT-PLUGGABLE)

This chapter explains what just-in-time compilation is, and how it can be configured in PostgreSQL.

***

|                                                                    |                                                       |                                                           |
| :----------------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------: |
| [Prev](logical-replication-quick-setup.html "31.11. Quick Setup")  |   [Up](admin.html "Part III. Server Administration")  |  [Next](jit-reason.html "32.1. What Is JIT compilation?") |
| 31.11. Quick Setup                                                 | [Home](index.html "PostgreSQL 17devel Documentation") |                            32.1. What Is JIT compilation? |

<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|           52.4. The PostgreSQL Rule System          |                                                                    |                                              |                                                       |                                                           |
| :-------------------------------------------------: | :----------------------------------------------------------------- | :------------------------------------------: | ----------------------------------------------------: | --------------------------------------------------------: |
| [Prev](parser-stage.html "52.3. The Parser Stage")  | [Up](overview.html "Chapter 52. Overview of PostgreSQL Internals") | Chapter 52. Overview of PostgreSQL Internals | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](planner-optimizer.html "52.5. Planner/Optimizer") |

***

## 52.4. The PostgreSQL Rule System [#](#RULE-SYSTEM)

PostgreSQL supports a powerful *rule system* for the specification of *views* and ambiguous *view updates*. Originally the PostgreSQL rule system consisted of two implementations:

*   The first one worked using *row level* processing and was implemented deep in the *executor*. The rule system was called whenever an individual row had been accessed. This implementation was removed in 1995 when the last official release of the Berkeley Postgres project was transformed into Postgres95.
*   The second implementation of the rule system is a technique called *query rewriting*. The *rewrite system* is a module that exists between the *parser stage* and the *planner/optimizer*. This technique is still implemented.

The query rewriter is discussed in some detail in [Chapter 41](rules.html "Chapter 41. The Rule System"), so there is no need to cover it here. We will only point out that both the input and the output of the rewriter are query trees, that is, there is no change in the representation or level of semantic detail in the trees. Rewriting can be thought of as a form of macro expansion.

***

|                                                     |                                                                    |                                                           |
| :-------------------------------------------------- | :----------------------------------------------------------------: | --------------------------------------------------------: |
| [Prev](parser-stage.html "52.3. The Parser Stage")  | [Up](overview.html "Chapter 52. Overview of PostgreSQL Internals") |  [Next](planner-optimizer.html "52.5. Planner/Optimizer") |
| 52.3. The Parser Stage                              |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                   52.5. Planner/Optimizer |

<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                                    Chapter 41. The Rule System                                    |                                                            |                            |                                                       |                                                |
| :-----------------------------------------------------------------------------------------------: | :--------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](event-trigger-database-login-example.html "40.6. A Database Login Event Trigger Example")  | [Up](server-programming.html "Part V. Server Programming") | Part V. Server Programming | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](querytree.html "41.1. The Query Tree") |

***

## Chapter 41. The Rule System

**Table of Contents**

  * *   [41.1. The Query Tree](querytree.html)
* [41.2. Views and the Rule System](rules-views.html)

    <!---->

  * *   [41.2.1. How `SELECT` Rules Work](rules-views.html#RULES-SELECT)
  * [41.2.2. View Rules in Non-`SELECT` Statements](rules-views.html#RULES-VIEWS-NON-SELECT)
  * [41.2.3. The Power of Views in PostgreSQL](rules-views.html#RULES-VIEWS-POWER)
  * [41.2.4. Updating a View](rules-views.html#RULES-VIEWS-UPDATE)

      * *   [41.3. Materialized Views](rules-materializedviews.html)
* [41.4. Rules on `INSERT`, `UPDATE`, and `DELETE`](rules-update.html)

    <!---->

  * *   [41.4.1. How Update Rules Work](rules-update.html#RULES-UPDATE-HOW)
  * [41.4.2. Cooperation with Views](rules-update.html#RULES-UPDATE-VIEWS)

      * *   [41.5. Rules and Privileges](rules-privileges.html)
* [41.6. Rules and Command Status](rules-status.html)
* [41.7. Rules Versus Triggers](rules-triggers.html)

This chapter discusses the rule system in PostgreSQL. Production rule systems are conceptually simple, but there are many subtle points involved in actually using them.

Some other database systems define active database rules, which are usually stored procedures and triggers. In PostgreSQL, these can be implemented using functions and triggers as well.

The rule system (more precisely speaking, the query rewrite rule system) is totally different from stored procedures and triggers. It modifies queries to take rules into consideration, and then passes the modified query to the query planner for planning and execution. It is very powerful, and can be used for many things such as query language procedures, views, and versions. The theoretical foundations and the power of this rule system are also discussed in [\[ston90b\]](biblio.html#STON90B) and [\[ong90\]](biblio.html#ONG90).

***

|                                                                                                   |                                                            |                                                |
| :------------------------------------------------------------------------------------------------ | :--------------------------------------------------------: | ---------------------------------------------: |
| [Prev](event-trigger-database-login-example.html "40.6. A Database Login Event Trigger Example")  | [Up](server-programming.html "Part V. Server Programming") |  [Next](querytree.html "41.1. The Query Tree") |
| 40.6. A Database Login Event Trigger Example                                                      |    [Home](index.html "PostgreSQL 17devel Documentation")   |                           41.1. The Query Tree |



|                    Chapter 40. Event Triggers                    |                                                            |                            |                                                       |                                                                                   |
| :--------------------------------------------------------------: | :--------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](trigger-example.html "39.4. A Complete Trigger Example")  | [Up](server-programming.html "Part V. Server Programming") | Part V. Server Programming | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](event-trigger-definition.html "40.1. Overview of Event Trigger Behavior") |

***

## Chapter 40. Event Triggers

**Table of Contents**

  * *   [40.1. Overview of Event Trigger Behavior](event-trigger-definition.html)
  * [40.2. Event Trigger Firing Matrix](event-trigger-matrix.html)
  * [40.3. Writing Event Trigger Functions in C](event-trigger-interface.html)
  * [40.4. A Complete Event Trigger Example](event-trigger-example.html)
  * [40.5. A Table Rewrite Event Trigger Example](event-trigger-table-rewrite-example.html)
  * [40.6. A Database Login Event Trigger Example](event-trigger-database-login-example.html)

To supplement the trigger mechanism discussed in [Chapter 39](triggers.html "Chapter 39. Triggers"), PostgreSQL also provides event triggers. Unlike regular triggers, which are attached to a single table and capture only DML events, event triggers are global to a particular database and are capable of capturing DDL events.

Like regular triggers, event triggers can be written in any procedural language that includes event trigger support, or in C, but not in plain SQL.

***

|                                                                  |                                                            |                                                                                   |
| :--------------------------------------------------------------- | :--------------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](trigger-example.html "39.4. A Complete Trigger Example")  | [Up](server-programming.html "Part V. Server Programming") |  [Next](event-trigger-definition.html "40.1. Overview of Event Trigger Behavior") |
| 39.4. A Complete Trigger Example                                 |    [Home](index.html "PostgreSQL 17devel Documentation")   |                                          40.1. Overview of Event Trigger Behavior |

[#id](#EVENT-TRIGGERS)

## Chapter 40. Event Triggers

**Table of Contents**

- [40.1. Overview of Event Trigger Behavior](event-trigger-definition)
- [40.2. Event Trigger Firing Matrix](event-trigger-matrix)
- [40.3. Writing Event Trigger Functions in C](event-trigger-interface)
- [40.4. A Complete Event Trigger Example](event-trigger-example)
- [40.5. A Table Rewrite Event Trigger Example](event-trigger-table-rewrite-example)

To supplement the trigger mechanism discussed in [Chapter 39](triggers), PostgreSQL also provides event triggers. Unlike regular triggers, which are attached to a single table and capture only DML events, event triggers are global to a particular database and are capable of capturing DDL events.

Like regular triggers, event triggers can be written in any procedural language that includes event trigger support, or in C, but not in plain SQL.

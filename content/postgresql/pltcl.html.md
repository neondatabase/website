<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            Chapter 44. PL/Tcl — Tcl Procedural Language           |                                                            |                            |                                                       |                                               |
| :---------------------------------------------------------------: | :--------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](plpgsql-porting.html "43.13. Porting from Oracle PL/SQL")  | [Up](server-programming.html "Part V. Server Programming") | Part V. Server Programming | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](pltcl-overview.html "44.1. Overview") |

***

## Chapter 44. PL/Tcl — Tcl Procedural Language

**Table of Contents**

*   *   [44.1. Overview](pltcl-overview.html)
    *   [44.2. PL/Tcl Functions and Arguments](pltcl-functions.html)
    *   [44.3. Data Values in PL/Tcl](pltcl-data.html)
    *   [44.4. Global Data in PL/Tcl](pltcl-global.html)
    *   [44.5. Database Access from PL/Tcl](pltcl-dbaccess.html)
    *   [44.6. Trigger Functions in PL/Tcl](pltcl-trigger.html)
    *   [44.7. Event Trigger Functions in PL/Tcl](pltcl-event-trigger.html)
    *   [44.8. Error Handling in PL/Tcl](pltcl-error-handling.html)
    *   [44.9. Explicit Subtransactions in PL/Tcl](pltcl-subtransactions.html)
    *   [44.10. Transaction Management](pltcl-transactions.html)
    *   [44.11. PL/Tcl Configuration](pltcl-config.html)
    *   [44.12. Tcl Procedure Names](pltcl-procnames.html)

[]()[]()

PL/Tcl is a loadable procedural language for the PostgreSQL database system that enables the [Tcl language](https://www.tcl.tk/) to be used to write PostgreSQL functions and procedures.

***

|                                                                   |                                                            |                                               |
| :---------------------------------------------------------------- | :--------------------------------------------------------: | --------------------------------------------: |
| [Prev](plpgsql-porting.html "43.13. Porting from Oracle PL/SQL")  | [Up](server-programming.html "Part V. Server Programming") |  [Next](pltcl-overview.html "44.1. Overview") |
| 43.13. Porting from Oracle PL/SQL                                 |    [Home](index.html "PostgreSQL 17devel Documentation")   |                                44.1. Overview |

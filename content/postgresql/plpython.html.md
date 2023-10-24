<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|         Chapter 46. PL/Python — Python Procedural Language         |                                                            |                            |                                                       |                                                          |
| :----------------------------------------------------------------: | :--------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](plperl-under-the-hood.html "45.8. PL/Perl Under the Hood")  | [Up](server-programming.html "Part V. Server Programming") | Part V. Server Programming | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](plpython-funcs.html "46.1. PL/Python Functions") |

***

## Chapter 46. PL/Python — Python Procedural Language

**Table of Contents**

  * *   [46.1. PL/Python Functions](plpython-funcs.html)
* [46.2. Data Values](plpython-data.html)

    <!---->

  * *   [46.2.1. Data Type Mapping](plpython-data.html#PLPYTHON-DATA-TYPE-MAPPING)
  * [46.2.2. Null, None](plpython-data.html#PLPYTHON-DATA-NULL)
  * [46.2.3. Arrays, Lists](plpython-data.html#PLPYTHON-ARRAYS)
  * [46.2.4. Composite Types](plpython-data.html#PLPYTHON-DATA-COMPOSITE-TYPES)
  * [46.2.5. Set-Returning Functions](plpython-data.html#PLPYTHON-DATA-SET-RETURNING-FUNCS)

      * *   [46.3. Sharing Data](plpython-sharing.html)
* [46.4. Anonymous Code Blocks](plpython-do.html)
* [46.5. Trigger Functions](plpython-trigger.html)
* [46.6. Database Access](plpython-database.html)

    <!---->

  * *   [46.6.1. Database Access Functions](plpython-database.html#PLPYTHON-DATABASE-ACCESS-FUNCS)
  * [46.6.2. Trapping Errors](plpython-database.html#PLPYTHON-TRAPPING)

* [46.7. Explicit Subtransactions](plpython-subtransaction.html)

  * [46.7.1. Subtransaction Context Managers](plpython-subtransaction.html#PLPYTHON-SUBTRANSACTION-CONTEXT-MANAGERS)

      * *   [46.8. Transaction Management](plpython-transactions.html)
  * [46.9. Utility Functions](plpython-util.html)
  * [46.10. Python 2 vs. Python 3](plpython-python23.html)
  * [46.11. Environment Variables](plpython-envar.html)

The PL/Python procedural language allows PostgreSQL functions and procedures to be written in the [Python language](https://www.python.org).

To install PL/Python in a particular database, use `CREATE EXTENSION plpython3u`.

### Tip

If a language is installed into `template1`, all subsequently created databases will have the language installed automatically.

PL/Python is only available as an “untrusted” language, meaning it does not offer any way of restricting what users can do in it and is therefore named `plpython3u`. A trusted variant `plpython` might become available in the future if a secure execution mechanism is developed in Python. The writer of a function in untrusted PL/Python must take care that the function cannot be used to do anything unwanted, since it will be able to do anything that could be done by a user logged in as the database administrator. Only superusers can create functions in untrusted languages such as `plpython3u`.

### Note

Users of source packages must specially enable the build of PL/Python during the installation process. (Refer to the installation instructions for more information.) Users of binary packages might find PL/Python in a separate subpackage.

***

|                                                                    |                                                            |                                                          |
| :----------------------------------------------------------------- | :--------------------------------------------------------: | -------------------------------------------------------: |
| [Prev](plperl-under-the-hood.html "45.8. PL/Perl Under the Hood")  | [Up](server-programming.html "Part V. Server Programming") |  [Next](plpython-funcs.html "46.1. PL/Python Functions") |
| 45.8. PL/Perl Under the Hood                                       |    [Home](index.html "PostgreSQL 17devel Documentation")   |                                46.1. PL/Python Functions |

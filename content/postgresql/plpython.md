[#id](#PLPYTHON)

## Chapter 46. PL/Python — Python Procedural Language

**Table of Contents**

- [46.1. PL/Python Functions](plpython-funcs)
- [46.2. Data Values](plpython-data)

  - [46.2.1. Data Type Mapping](plpython-data#PLPYTHON-DATA-TYPE-MAPPING)
  - [46.2.2. Null, None](plpython-data#PLPYTHON-DATA-NULL)
  - [46.2.3. Arrays, Lists](plpython-data#PLPYTHON-ARRAYS)
  - [46.2.4. Composite Types](plpython-data#PLPYTHON-DATA-COMPOSITE-TYPES)
  - [46.2.5. Set-Returning Functions](plpython-data#PLPYTHON-DATA-SET-RETURNING-FUNCS)

- [46.3. Sharing Data](plpython-sharing)
- [46.4. Anonymous Code Blocks](plpython-do)
- [46.5. Trigger Functions](plpython-trigger)
- [46.6. Database Access](plpython-database)

  - [46.6.1. Database Access Functions](plpython-database#PLPYTHON-DATABASE-ACCESS-FUNCS)
  - [46.6.2. Trapping Errors](plpython-database#PLPYTHON-TRAPPING)

- [46.7. Explicit Subtransactions](plpython-subtransaction)

  - [46.7.1. Subtransaction Context Managers](plpython-subtransaction#PLPYTHON-SUBTRANSACTION-CONTEXT-MANAGERS)

  - [46.8. Transaction Management](plpython-transactions)
  - [46.9. Utility Functions](plpython-util)
  - [46.10. Python 2 vs. Python 3](plpython-python23)
  - [46.11. Environment Variables](plpython-envar)

The PL/Python procedural language allows PostgreSQL functions and procedures to be written in the [Python language](https://www.python.org).

To install PL/Python in a particular database, use `CREATE EXTENSION plpython3u`.

### Tip

If a language is installed into `template1`, all subsequently created databases will have the language installed automatically.

PL/Python is only available as an “untrusted” language, meaning it does not offer any way of restricting what users can do in it and is therefore named `plpython3u`. A trusted variant `plpython` might become available in the future if a secure execution mechanism is developed in Python. The writer of a function in untrusted PL/Python must take care that the function cannot be used to do anything unwanted, since it will be able to do anything that could be done by a user logged in as the database administrator. Only superusers can create functions in untrusted languages such as `plpython3u`.

### Note

Users of source packages must specially enable the build of PL/Python during the installation process. (Refer to the installation instructions for more information.) Users of binary packages might find PL/Python in a separate subpackage.

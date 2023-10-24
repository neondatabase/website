<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                46.3. Sharing Data               |                                                                          |                                                    |                                                       |                                                         |
| :---------------------------------------------: | :----------------------------------------------------------------------- | :------------------------------------------------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](plpython-data.html "46.2. Data Values")  | [Up](plpython.html "Chapter 46. PL/Python — Python Procedural Language") | Chapter 46. PL/Python — Python Procedural Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](plpython-do.html "46.4. Anonymous Code Blocks") |

***

## 46.3. Sharing Data [#](#PLPYTHON-SHARING)

The global dictionary `SD` is available to store private data between repeated calls to the same function. The global dictionary `GD` is public data, that is available to all Python functions within a session; use with care.[]()

Each function gets its own execution environment in the Python interpreter, so that global data and function arguments from `myfunc` are not available to `myfunc2`. The exception is the data in the `GD` dictionary, as mentioned above.

***

|                                                 |                                                                          |                                                         |
| :---------------------------------------------- | :----------------------------------------------------------------------: | ------------------------------------------------------: |
| [Prev](plpython-data.html "46.2. Data Values")  | [Up](plpython.html "Chapter 46. PL/Python — Python Procedural Language") |  [Next](plpython-do.html "46.4. Anonymous Code Blocks") |
| 46.2. Data Values                               |           [Home](index.html "PostgreSQL 17devel Documentation")          |                             46.4. Anonymous Code Blocks |

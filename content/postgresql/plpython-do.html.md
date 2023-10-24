<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             46.4. Anonymous Code Blocks             |                                                                          |                                                    |                                                       |                                                          |
| :-------------------------------------------------: | :----------------------------------------------------------------------- | :------------------------------------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](plpython-sharing.html "46.3. Sharing Data")  | [Up](plpython.html "Chapter 46. PL/Python — Python Procedural Language") | Chapter 46. PL/Python — Python Procedural Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](plpython-trigger.html "46.5. Trigger Functions") |

***

## 46.4. Anonymous Code Blocks [#](#PLPYTHON-DO)

PL/Python also supports anonymous code blocks called with the [DO](sql-do.html "DO") statement:

    DO $$
        # PL/Python code
    $$ LANGUAGE plpython3u;

An anonymous code block receives no arguments, and whatever value it might return is discarded. Otherwise it behaves just like a function.

***

|                                                     |                                                                          |                                                          |
| :-------------------------------------------------- | :----------------------------------------------------------------------: | -------------------------------------------------------: |
| [Prev](plpython-sharing.html "46.3. Sharing Data")  | [Up](plpython.html "Chapter 46. PL/Python — Python Procedural Language") |  [Next](plpython-trigger.html "46.5. Trigger Functions") |
| 46.3. Sharing Data                                  |           [Home](index.html "PostgreSQL 17devel Documentation")          |                                  46.5. Trigger Functions |

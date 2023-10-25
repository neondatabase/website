<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  20.16. Customized Options                  |                                                              |                                  |                                                       |                                                                   |
| :---------------------------------------------------------: | :----------------------------------------------------------- | :------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](runtime-config-preset.html "20.15. Preset Options")  | [Up](runtime-config.html "Chapter 20. Server Configuration") | Chapter 20. Server Configuration | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](runtime-config-developer.html "20.17. Developer Options") |

***

## 20.16. Customized Options [#](#RUNTIME-CONFIG-CUSTOM)

This feature was designed to allow parameters not normally known to PostgreSQL to be added by add-on modules (such as procedural languages). This allows extension modules to be configured in the standard ways.

Custom options have two-part names: an extension name, then a dot, then the parameter name proper, much like qualified names in SQL. An example is `plpgsql.variable_conflict`.

Because custom options may need to be set in processes that have not loaded the relevant extension module, PostgreSQL will accept a setting for any two-part parameter name. Such variables are treated as placeholders and have no function until the module that defines them is loaded. When an extension module is loaded, it will add its variable definitions and convert any placeholder values according to those definitions. If there are any unrecognized placeholders that begin with its extension name, warnings are issued and those placeholders are removed.

***

|                                                             |                                                              |                                                                   |
| :---------------------------------------------------------- | :----------------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](runtime-config-preset.html "20.15. Preset Options")  | [Up](runtime-config.html "Chapter 20. Server Configuration") |  [Next](runtime-config-developer.html "20.17. Developer Options") |
| 20.15. Preset Options                                       |     [Home](index.html "PostgreSQL 17devel Documentation")    |                                          20.17. Developer Options |

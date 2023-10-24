<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        9.10. Enum Support Functions                       |                                                           |                                    |                                                       |                                                                            |
| :-----------------------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | -------------------------------------------------------------------------: |
| [Prev](functions-datetime.html "9.9. Date/Time Functions and Operators")  | [Up](functions.html "Chapter 9. Functions and Operators") | Chapter 9. Functions and Operators | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](functions-geometry.html "9.11. Geometric Functions and Operators") |

***

## 9.10. Enum Support Functions [#](#FUNCTIONS-ENUM)

For enum types (described in [Section 8.7](datatype-enum.html "8.7. Enumerated Types")), there are several functions that allow cleaner programming without hard-coding particular values of an enum type. These are listed in [Table 9.35](functions-enum.html#FUNCTIONS-ENUM-TABLE "Table 9.35. Enum Support Functions"). The examples assume an enum type created as:

    CREATE TYPE rainbow AS ENUM ('red', 'orange', 'yellow', 'green', 'blue', 'purple');

**Table 9.35. Enum Support Functions**

| FunctionDescriptionExample(s)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enum_first` ( `anyenum` ) → `anyenum`Returns the first value of the input enum type.`enum_first(null::rainbow)` → `red`                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `enum_last` ( `anyenum` ) → `anyenum`Returns the last value of the input enum type.`enum_last(null::rainbow)` → `purple`                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `enum_range` ( `anyenum` ) → `anyarray`Returns all values of the input enum type in an ordered array.`enum_range(null::rainbow)` → `{red,orange,yellow,​green,blue,purple}`                                                                                                                                                                                                                                                                                                                                                                                                           |
| `enum_range` ( `anyenum`, `anyenum` ) → `anyarray`Returns the range between the two given enum values, as an ordered array. The values must be from the same enum type. If the first parameter is null, the result will start with the first value of the enum type. If the second parameter is null, the result will end with the last value of the enum type.`enum_range('orange'::rainbow, 'green'::rainbow)` → `{orange,yellow,green}``enum_range(NULL, 'green'::rainbow)` → `{red,orange,​yellow,green}``enum_range('orange'::rainbow, NULL)` → `{orange,yellow,green,​blue,purple}` |

\

Notice that except for the two-argument form of `enum_range`, these functions disregard the specific value passed to them; they care only about its declared data type. Either null or a specific value of the type can be passed, with the same result. It is more common to apply these functions to a table column or function argument than to a hardwired type name as used in the examples.

***

|                                                                           |                                                           |                                                                            |
| :------------------------------------------------------------------------ | :-------------------------------------------------------: | -------------------------------------------------------------------------: |
| [Prev](functions-datetime.html "9.9. Date/Time Functions and Operators")  | [Up](functions.html "Chapter 9. Functions and Operators") |  [Next](functions-geometry.html "9.11. Geometric Functions and Operators") |
| 9.9. Date/Time Functions and Operators                                    |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                    9.11. Geometric Functions and Operators |

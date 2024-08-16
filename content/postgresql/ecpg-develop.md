[#id](#ECPG-DEVELOP)

## 36.17. Internals [#](#ECPG-DEVELOP)

This section explains how ECPG works internally. This information can occasionally be useful to help users understand how to use ECPG.

The first four lines written by `ecpg` to the output are fixed lines. Two are comments and two are include lines necessary to interface to the library. Then the preprocessor reads through the file and writes output. Normally it just echoes everything to the output.

When it sees an `EXEC SQL` statement, it intervenes and changes it. The command starts with `EXEC SQL` and ends with `;`. Everything in between is treated as an SQL statement and parsed for variable substitution.

Variable substitution occurs when a symbol starts with a colon (`:`). The variable with that name is looked up among the variables that were previously declared within a `EXEC SQL DECLARE` section.

The most important function in the library is `ECPGdo`, which takes care of executing most commands. It takes a variable number of arguments. This can easily add up to 50 or so arguments, and we hope this will not be a problem on any platform.

The arguments are:

- A line number [#](#ECPG-DEVELOP-LINE-NUMBER)

  This is the line number of the original line; used in error messages only.

- A string [#](#ECPG-DEVELOP-STRING)

  This is the SQL command that is to be issued. It is modified by the input variables, i.e., the variables that where not known at compile time but are to be entered in the command. Where the variables should go the string contains `?`.

- Input variables [#](#ECPG-DEVELOP-INPUT-VARIABLES)

  Every input variable causes ten arguments to be created. (See below.)

- _`ECPGt_EOIT`_ [#](#ECPG-DEVELOP-ECPGT-EOIT)

  An `enum` telling that there are no more input variables.

- Output variables [#](#ECPG-DEVELOP-OUTPUT-VARIABLES)

  Every output variable causes ten arguments to be created. (See below.) These variables are filled by the function.

- _`ECPGt_EORT`_ [#](#ECPG-DEVELOP-ECPGT-EORT)

  An `enum` telling that there are no more variables.

For every variable that is part of the SQL command, the function gets ten arguments:

1. The type as a special symbol.

2. A pointer to the value or a pointer to the pointer.

3. The size of the variable if it is a `char` or `varchar`.

4. The number of elements in the array (for array fetches).

5. The offset to the next element in the array (for array fetches).

6. The type of the indicator variable as a special symbol.

7. A pointer to the indicator variable.

8. 0

9. The number of elements in the indicator array (for array fetches).

10. The offset to the next element in the indicator array (for array fetches).

Note that not all SQL commands are treated in this way. For instance, an open cursor statement like:

```

EXEC SQL OPEN cursor;
```

is not copied to the output. Instead, the cursor's `DECLARE` command is used at the position of the `OPEN` command because it indeed opens the cursor.

Here is a complete example describing the output of the preprocessor of a file `foo.pgc` (details might change with each particular version of the preprocessor):

```

EXEC SQL BEGIN DECLARE SECTION;
int index;
int result;
EXEC SQL END DECLARE SECTION;
...
EXEC SQL SELECT res INTO :result FROM mytable WHERE index = :index;
```

is translated into:

```

/* Processed by ecpg (2.6.0) */
/* These two include files are added by the preprocessor */
#include <ecpgtype.h>;
#include <ecpglib.h>;

/* exec sql begin declare section */

#line 1 "foo.pgc"

 int index;
 int result;
/* exec sql end declare section */
...
ECPGdo(__LINE__, NULL, "SELECT res FROM mytable WHERE index = ?     ",
        ECPGt_int,&(index),1L,1L,sizeof(int),
        ECPGt_NO_INDICATOR, NULL , 0L, 0L, 0L, ECPGt_EOIT,
        ECPGt_int,&(result),1L,1L,sizeof(int),
        ECPGt_NO_INDICATOR, NULL , 0L, 0L, 0L, ECPGt_EORT);
#line 147 "foo.pgc"
```

(The indentation here is added for readability and not something the preprocessor does.)

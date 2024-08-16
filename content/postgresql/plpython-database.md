[#id](#PLPYTHON-DATABASE)

## 46.6. Database Access [#](#PLPYTHON-DATABASE)

- [46.6.1. Database Access Functions](plpython-database#PLPYTHON-DATABASE-ACCESS-FUNCS)
- [46.6.2. Trapping Errors](plpython-database#PLPYTHON-TRAPPING)

The PL/Python language module automatically imports a Python module called `plpy`. The functions and constants in this module are available to you in the Python code as `plpy.foo`.

[#id](#PLPYTHON-DATABASE-ACCESS-FUNCS)

### 46.6.1. Database Access Functions [#](#PLPYTHON-DATABASE-ACCESS-FUNCS)

The `plpy` module provides several functions to execute database commands:

- `plpy.execute(query [, limit])`

  Calling `plpy.execute` with a query string and an optional row limit argument causes that query to be run and the result to be returned in a result object.

  If _`limit`_ is specified and is greater than zero, then `plpy.execute` retrieves at most _`limit`_ rows, much as if the query included a `LIMIT` clause. Omitting _`limit`_ or specifying it as zero results in no row limit.

  The result object emulates a list or dictionary object. The result object can be accessed by row number and column name. For example:

  ```
  rv = plpy.execute("SELECT * FROM my_table", 5)
  ```

  returns up to 5 rows from `my_table`. If `my_table` has a column `my_column`, it would be accessed as:

  ```
  foo = rv[i]["my_column"]
  ```

  The number of rows returned can be obtained using the built-in `len` function.

  The result object has these additional methods:

  - `nrows()`

    Returns the number of rows processed by the command. Note that this is not necessarily the same as the number of rows returned. For example, an `UPDATE` command will set this value but won't return any rows (unless `RETURNING` is used).

  - `status()`

    The `SPI_execute()` return value.

  - `colnames()``coltypes()``coltypmods()`

    Return a list of column names, list of column type OIDs, and list of type-specific type modifiers for the columns, respectively.

    These methods raise an exception when called on a result object from a command that did not produce a result set, e.g., `UPDATE` without `RETURNING`, or `DROP TABLE`. But it is OK to use these methods on a result set containing zero rows.

  - `__str__()`

    The standard `__str__` method is defined so that it is possible for example to debug query execution results using `plpy.debug(rv)`.

  The result object can be modified.

  Note that calling `plpy.execute` will cause the entire result set to be read into memory. Only use that function when you are sure that the result set will be relatively small. If you don't want to risk excessive memory usage when fetching large results, use `plpy.cursor` rather than `plpy.execute`.

- `plpy.prepare(query [, argtypes])``plpy.execute(plan [, arguments [, limit]])`

  `plpy.prepare` prepares the execution plan for a query. It is called with a query string and a list of parameter types, if you have parameter references in the query. For example:

  ```
  plan = plpy.prepare("SELECT last_name FROM my_users WHERE first_name = $1", ["text"])
  ```

  `text` is the type of the variable you will be passing for `$1`. The second argument is optional if you don't want to pass any parameters to the query.

  After preparing a statement, you use a variant of the function `plpy.execute` to run it:

  ```
  rv = plpy.execute(plan, ["name"], 5)
  ```

  Pass the plan as the first argument (instead of the query string), and a list of values to substitute into the query as the second argument. The second argument is optional if the query does not expect any parameters. The third argument is the optional row limit as before.

  Alternatively, you can call the `execute` method on the plan object:

  ```
  rv = plan.execute(["name"], 5)
  ```

  Query parameters and result row fields are converted between PostgreSQL and Python data types as described in [Section 46.2](plpython-data).

  When you prepare a plan using the PL/Python module it is automatically saved. Read the SPI documentation ([Chapter 47](spi)) for a description of what this means. In order to make effective use of this across function calls one needs to use one of the persistent storage dictionaries `SD` or `GD` (see [Section 46.3](plpython-sharing)). For example:

  ```
  CREATE FUNCTION usesavedplan() RETURNS trigger AS $$
      if "plan" in SD:
          plan = SD["plan"]
      else:
          plan = plpy.prepare("SELECT 1")
          SD["plan"] = plan
      # rest of function
  $$ LANGUAGE plpython3u;
  ```

- `plpy.cursor(query)``plpy.cursor(plan [, arguments])`

  The `plpy.cursor` function accepts the same arguments as `plpy.execute` (except for the row limit) and returns a cursor object, which allows you to process large result sets in smaller chunks. As with `plpy.execute`, either a query string or a plan object along with a list of arguments can be used, or the `cursor` function can be called as a method of the plan object.

  The cursor object provides a `fetch` method that accepts an integer parameter and returns a result object. Each time you call `fetch`, the returned object will contain the next batch of rows, never larger than the parameter value. Once all rows are exhausted, `fetch` starts returning an empty result object. Cursor objects also provide an [iterator interface](https://docs.python.org/library/stdtypes.html#iterator-types), yielding one row at a time until all rows are exhausted. Data fetched that way is not returned as result objects, but rather as dictionaries, each dictionary corresponding to a single result row.

  An example of two ways of processing data from a large table is:

  ```
  CREATE FUNCTION count_odd_iterator() RETURNS integer AS $$
  odd = 0
  for row in plpy.cursor("select num from largetable"):
      if row['num'] % 2:
           odd += 1
  return odd
  $$ LANGUAGE plpython3u;

  CREATE FUNCTION count_odd_fetch(batch_size integer) RETURNS integer AS $$
  odd = 0
  cursor = plpy.cursor("select num from largetable")
  while True:
      rows = cursor.fetch(batch_size)
      if not rows:
          break
      for row in rows:
          if row['num'] % 2:
              odd += 1
  return odd
  $$ LANGUAGE plpython3u;

  CREATE FUNCTION count_odd_prepared() RETURNS integer AS $$
  odd = 0
  plan = plpy.prepare("select num from largetable where num % $1 <> 0", ["integer"])
  rows = list(plpy.cursor(plan, [2]))  # or: = list(plan.cursor([2]))

  return len(rows)
  $$ LANGUAGE plpython3u;
  ```

  Cursors are automatically disposed of. But if you want to explicitly release all resources held by a cursor, use the `close` method. Once closed, a cursor cannot be fetched from anymore.

  ### Tip

  Do not confuse objects created by `plpy.cursor` with DB-API cursors as defined by the [Python Database API specification](https://www.python.org/dev/peps/pep-0249/). They don't have anything in common except for the name.

[#id](#PLPYTHON-TRAPPING)

### 46.6.2. Trapping Errors [#](#PLPYTHON-TRAPPING)

Functions accessing the database might encounter errors, which will cause them to abort and raise an exception. Both `plpy.execute` and `plpy.prepare` can raise an instance of a subclass of `plpy.SPIError`, which by default will terminate the function. This error can be handled just like any other Python exception, by using the `try/except` construct. For example:

```
CREATE FUNCTION try_adding_joe() RETURNS text AS $$
    try:
        plpy.execute("INSERT INTO users(username) VALUES ('joe')")
    except plpy.SPIError:
        return "something went wrong"
    else:
        return "Joe added"
$$ LANGUAGE plpython3u;
```

The actual class of the exception being raised corresponds to the specific condition that caused the error. Refer to [Table A.1](errcodes-appendix#ERRCODES-TABLE) for a list of possible conditions. The module `plpy.spiexceptions` defines an exception class for each PostgreSQL condition, deriving their names from the condition name. For instance, `division_by_zero` becomes `DivisionByZero`, `unique_violation` becomes `UniqueViolation`, `fdw_error` becomes `FdwError`, and so on. Each of these exception classes inherits from `SPIError`. This separation makes it easier to handle specific errors, for instance:

```
CREATE FUNCTION insert_fraction(numerator int, denominator int) RETURNS text AS $$
from plpy import spiexceptions
try:
    plan = plpy.prepare("INSERT INTO fractions (frac) VALUES ($1 / $2)", ["int", "int"])
    plpy.execute(plan, [numerator, denominator])
except spiexceptions.DivisionByZero:
    return "denominator cannot equal zero"
except spiexceptions.UniqueViolation:
    return "already have that fraction"
except plpy.SPIError as e:
    return "other error, SQLSTATE %s" % e.sqlstate
else:
    return "fraction inserted"
$$ LANGUAGE plpython3u;
```

Note that because all exceptions from the `plpy.spiexceptions` module inherit from `SPIError`, an `except` clause handling it will catch any database access error.

As an alternative way of handling different error conditions, you can catch the `SPIError` exception and determine the specific error condition inside the `except` block by looking at the `sqlstate` attribute of the exception object. This attribute is a string value containing the “SQLSTATE” error code. This approach provides approximately the same functionality

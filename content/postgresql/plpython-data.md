[#id](#PLPYTHON-DATA)

## 46.2. Data Values [#](#PLPYTHON-DATA)

- [46.2.1. Data Type Mapping](plpython-data#PLPYTHON-DATA-TYPE-MAPPING)
- [46.2.2. Null, None](plpython-data#PLPYTHON-DATA-NULL)
- [46.2.3. Arrays, Lists](plpython-data#PLPYTHON-ARRAYS)
- [46.2.4. Composite Types](plpython-data#PLPYTHON-DATA-COMPOSITE-TYPES)
- [46.2.5. Set-Returning Functions](plpython-data#PLPYTHON-DATA-SET-RETURNING-FUNCS)

Generally speaking, the aim of PL/Python is to provide a “natural” mapping between the PostgreSQL and the Python worlds. This informs the data mapping rules described below.

[#id](#PLPYTHON-DATA-TYPE-MAPPING)

### 46.2.1. Data Type Mapping [#](#PLPYTHON-DATA-TYPE-MAPPING)

When a PL/Python function is called, its arguments are converted from their PostgreSQL data type to a corresponding Python type:

- PostgreSQL `boolean` is converted to Python `bool`.

- PostgreSQL `smallint`, `int`, `bigint` and `oid` are converted to Python `int`.

- PostgreSQL `real` and `double` are converted to Python `float`.

- PostgreSQL `numeric` is converted to Python `Decimal`. This type is imported from the `cdecimal` package if that is available. Otherwise, `decimal.Decimal` from the standard library will be used. `cdecimal` is significantly faster than `decimal`. In Python 3.3 and up, however, `cdecimal` has been integrated into the standard library under the name `decimal`, so there is no longer any difference.

- PostgreSQL `bytea` is converted to Python `bytes`.

- All other data types, including the PostgreSQL character string types, are converted to a Python `str` (in Unicode like all Python strings).

- For nonscalar data types, see below.

When a PL/Python function returns, its return value is converted to the function's declared PostgreSQL return data type as follows:

- When the PostgreSQL return type is `boolean`, the return value will be evaluated for truth according to the _Python_ rules. That is, 0 and empty string are false, but notably `'f'` is true.

- When the PostgreSQL return type is `bytea`, the return value will be converted to Python `bytes` using the respective Python built-ins, with the result being converted to `bytea`.

- For all other PostgreSQL return types, the return value is converted to a string using the Python built-in `str`, and the result is passed to the input function of the PostgreSQL data type. (If the Python value is a `float`, it is converted using the `repr` built-in instead of `str`, to avoid loss of precision.)

  Strings are automatically converted to the PostgreSQL server encoding when they are passed to PostgreSQL.

- For nonscalar data types, see below.

Note that logical mismatches between the declared PostgreSQL return type and the Python data type of the actual return object are not flagged; the value will be converted in any case.

[#id](#PLPYTHON-DATA-NULL)

### 46.2.2. Null, None [#](#PLPYTHON-DATA-NULL)

If an SQL null value is passed to a function, the argument value will appear as `None` in Python. For example, the function definition of `pymax` shown in [Section 46.1](plpython-funcs) will return the wrong answer for null inputs. We could add `STRICT` to the function definition to make PostgreSQL do something more reasonable: if a null value is passed, the function will not be called at all, but will just return a null result automatically. Alternatively, we could check for null inputs in the function body:

```
CREATE FUNCTION pymax (a integer, b integer)
  RETURNS integer
AS $$
  if (a is None) or (b is None):
    return None
  if a > b:
    return a
  return b
$$ LANGUAGE plpython3u;
```

As shown above, to return an SQL null value from a PL/Python function, return the value `None`. This can be done whether the function is strict or not.

[#id](#PLPYTHON-ARRAYS)

### 46.2.3. Arrays, Lists [#](#PLPYTHON-ARRAYS)

SQL array values are passed into PL/Python as a Python list. To return an SQL array value out of a PL/Python function, return a Python list:

```
CREATE FUNCTION return_arr()
  RETURNS int[]
AS $$
return [1, 2, 3, 4, 5]
$$ LANGUAGE plpython3u;

SELECT return_arr();
 return_arr
-------------
 {1,2,3,4,5}
(1 row)
```

Multidimensional arrays are passed into PL/Python as nested Python lists. A 2-dimensional array is a list of lists, for example. When returning a multi-dimensional SQL array out of a PL/Python function, the inner lists at each level must all be of the same size. For example:

```
CREATE FUNCTION test_type_conversion_array_int4(x int4[]) RETURNS int4[] AS $$
plpy.info(x, type(x))
return x
$$ LANGUAGE plpython3u;

SELECT * FROM test_type_conversion_array_int4(ARRAY[[1,2,3],[4,5,6]]);
INFO:  ([[1, 2, 3], [4, 5, 6]], <type 'list'>)
 test_type_conversion_array_int4
---------------------------------
 {{1,2,3},{4,5,6}}
(1 row)
```

Other Python sequences, like tuples, are also accepted for backwards-compatibility with PostgreSQL versions 9.6 and below, when multi-dimensional arrays were not supported. However, they are always treated as one-dimensional arrays, because they are ambiguous with composite types. For the same reason, when a composite type is used in a multi-dimensional array, it must be represented by a tuple, rather than a list.

Note that in Python, strings are sequences, which can have undesirable effects that might be familiar to Python programmers:

```
CREATE FUNCTION return_str_arr()
  RETURNS varchar[]
AS $$
return "hello"
$$ LANGUAGE plpython3u;

SELECT return_str_arr();
 return_str_arr
----------------
 {h,e,l,l,o}
(1 row)
```

[#id](#PLPYTHON-DATA-COMPOSITE-TYPES)

### 46.2.4. Composite Types [#](#PLPYTHON-DATA-COMPOSITE-TYPES)

Composite-type arguments are passed to the function as Python mappings. The element names of the mapping are the attribute names of the composite type. If an attribute in the passed row has the null value, it has the value `None` in the mapping. Here is an example:

```
CREATE TABLE employee (
  name text,
  salary integer,
  age integer
);

CREATE FUNCTION overpaid (e employee)
  RETURNS boolean
AS $$
  if e["salary"] > 200000:
    return True
  if (e["age"] < 30) and (e["salary"] > 100000):
    return True
  return False
$$ LANGUAGE plpython3u;
```

There are multiple ways to return row or composite types from a Python function. The following examples assume we have:

```
CREATE TYPE named_value AS (
  name   text,
  value  integer
);
```

A composite result can be returned as a:

- Sequence type (a tuple or list, but not a set because it is not indexable)

  Returned sequence objects must have the same number of items as the composite result type has fields. The item with index 0 is assigned to the first field of the composite type, 1 to the second and so on. For example:

  ```
  CREATE FUNCTION make_pair (name text, value integer)
    RETURNS named_value
  AS $$
    return ( name, value )
    # or alternatively, as list: return [ name, value ]
  $$ LANGUAGE plpython3u;
  ```

  To return an SQL null for any column, insert `None` at the corresponding position.

  When an array of composite types is returned, it cannot be returned as a list, because it is ambiguous whether the Python list represents a composite type, or another array dimension.

- Mapping (dictionary)

  The value for each result type column is retrieved from the mapping with the column name as key. Example:

  ```
  CREATE FUNCTION make_pair (name text, value integer)
    RETURNS named_value
  AS $$
    return { "name": name, "value": value }
  $$ LANGUAGE plpython3u;
  ```

  Any extra dictionary key/value pairs are ignored. Missing keys are treated as errors. To return an SQL null value for any column, insert `None` with the corresponding column name as the key.

- Object (any object providing method `__getattr__`)

  This works the same as a mapping. Example:

  ```
  CREATE FUNCTION make_pair (name text, value integer)
    RETURNS named_value
  AS $$
    class named_value:
      def __init__ (self, n, v):
        self.name = n
        self.value = v
    return named_value(name, value)

    # or simply
    class nv: pass
    nv.name = name
    nv.value = value
    return nv
  $$ LANGUAGE plpython3u;
  ```

Functions with `OUT` parameters are also supported. For example:

```
CREATE FUNCTION multiout_simple(OUT i integer, OUT j integer) AS $$
return (1, 2)
$$ LANGUAGE plpython3u;

SELECT * FROM multiout_simple();
```

Output parameters of procedures are passed back the same way. For example:

```
CREATE PROCEDURE python_triple(INOUT a integer, INOUT b integer) AS $$
return (a * 3, b * 3)
$$ LANGUAGE plpython3u;

CALL python_triple(5, 10);
```

[#id](#PLPYTHON-DATA-SET-RETURNING-FUNCS)

### 46.2.5. Set-Returning Functions [#](#PLPYTHON-DATA-SET-RETURNING-FUNCS)

A PL/Python function can also return sets of scalar or composite types. There are several ways to achieve this because the returned object is internally turned into an iterator. The following examples assume we have composite type:

```
CREATE TYPE greeting AS (
  how text,
  who text
);
```

A set result can be returned from a:

- Sequence type (tuple, list, set)

  ```
  CREATE FUNCTION greet (how text)
    RETURNS SETOF greeting
  AS $$
    # return tuple containing lists as composite types
    # all other combinations work also
    return ( [ how, "World" ], [ how, "PostgreSQL" ], [ how, "PL/Python" ] )
  $$ LANGUAGE plpython3u;
  ```

- Iterator (any object providing `__iter__` and `next` methods)

  ```
  CREATE FUNCTION greet (how text)
    RETURNS SETOF greeting
  AS $$
    class producer:
      def __init__ (self, how, who):
        self.how = how
        self.who = who
        self.ndx = -1

      def __iter__ (self):
        return self

      def next (self):
        self.ndx += 1
        if self.ndx == len(self.who):
          raise StopIteration
        return ( self.how, self.who[self.ndx] )

    return producer(how, [ "World", "PostgreSQL", "PL/Python" ])
  $$ LANGUAGE plpython3u;
  ```

- Generator (`yield`)

  ```
  CREATE FUNCTION greet (how text)
    RETURNS SETOF greeting
  AS $$
    for who in [ "World", "PostgreSQL", "PL/Python" ]:
      yield ( how, who )
  $$ LANGUAGE plpython3u;
  ```

Set-returning functions with `OUT` parameters (using `RETURNS SETOF record`) are also supported. For example:

```
CREATE FUNCTION multiout_simple_setof(n integer, OUT integer, OUT integer) RETURNS SETOF record AS $$
return [(1, 2)] * n
$$ LANGUAGE plpython3u;

SELECT * FROM multiout_simple_setof(3);
```

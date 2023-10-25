<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      47.3. Memory Management                      |                                                           |                                          |                                                       |                                           |
| :---------------------------------------------------------------: | :-------------------------------------------------------- | :--------------------------------------: | ----------------------------------------------------: | ----------------------------------------: |
| [Prev](spi-spi-result-code-string.html "SPI_result_code_string")  | [Up](spi.html "Chapter 47. Server Programming Interface") | Chapter 47. Server Programming Interface | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spi-spi-palloc.html "SPI_palloc") |

***

## 47.3. Memory Management [#](#SPI-MEMORY)

  * *   [SPI\_palloc](spi-spi-palloc.html) — allocate memory in the upper executor context
  * [SPI\_repalloc](spi-realloc.html) — reallocate memory in the upper executor context
  * [SPI\_pfree](spi-spi-pfree.html) — free memory in the upper executor context
  * [SPI\_copytuple](spi-spi-copytuple.html) — make a copy of a row in the upper executor context
  * [SPI\_returntuple](spi-spi-returntuple.html) — prepare to return a tuple as a Datum
  * [SPI\_modifytuple](spi-spi-modifytuple.html) — create a row by replacing selected fields of a given row
  * [SPI\_freetuple](spi-spi-freetuple.html) — free a row allocated in the upper executor context
  * [SPI\_freetuptable](spi-spi-freetupletable.html) — free a row set created by `SPI_execute` or a similar function
  * [SPI\_freeplan](spi-spi-freeplan.html) — free a previously saved prepared statement

PostgreSQL allocates memory within *memory contexts*, which provide a convenient method of managing allocations made in many different places that need to live for differing amounts of time. Destroying a context releases all the memory that was allocated in it. Thus, it is not necessary to keep track of individual objects to avoid memory leaks; instead only a relatively small number of contexts have to be managed. `palloc` and related functions allocate memory from the “current” context.

`SPI_connect` creates a new memory context and makes it current. `SPI_finish` restores the previous current memory context and destroys the context created by `SPI_connect`. These actions ensure that transient memory allocations made inside your C function are reclaimed at C function exit, avoiding memory leakage.

However, if your C function needs to return an object in allocated memory (such as a value of a pass-by-reference data type), you cannot allocate that memory using `palloc`, at least not while you are connected to SPI. If you try, the object will be deallocated by `SPI_finish`, and your C function will not work reliably. To solve this problem, use `SPI_palloc` to allocate memory for your return object. `SPI_palloc` allocates memory in the “upper executor context”, that is, the memory context that was current when `SPI_connect` was called, which is precisely the right context for a value returned from your C function. Several of the other utility functions described in this section also return objects created in the upper executor context.

When `SPI_connect` is called, the private context of the C function, which is created by `SPI_connect`, is made the current context. All allocations made by `palloc`, `repalloc`, or SPI utility functions (except as described in this section) are made in this context. When a C function disconnects from the SPI manager (via `SPI_finish`) the current context is restored to the upper executor context, and all allocations made in the C function memory context are freed and cannot be used any more.

***

|                                                                   |                                                           |                                           |
| :---------------------------------------------------------------- | :-------------------------------------------------------: | ----------------------------------------: |
| [Prev](spi-spi-result-code-string.html "SPI_result_code_string")  | [Up](spi.html "Chapter 47. Server Programming Interface") |  [Next](spi-spi-palloc.html "SPI_palloc") |
| SPI\_result\_code\_string                                         |   [Home](index.html "PostgreSQL 17devel Documentation")   |                               SPI\_palloc |

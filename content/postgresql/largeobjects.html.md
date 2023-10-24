<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               Chapter 35. Large Objects               |                                                           |                            |                                                       |                                             |
| :---------------------------------------------------: | :-------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | ------------------------------------------: |
| [Prev](libpq-example.html "34.22. Example Programs")  | [Up](client-interfaces.html "Part IV. Client Interfaces") | Part IV. Client Interfaces | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](lo-intro.html "35.1. Introduction") |

***

## Chapter 35. Large Objects

**Table of Contents**

  * *   [35.1. Introduction](lo-intro.html)
* [35.2. Implementation Features](lo-implementation.html)
* [35.3. Client Interfaces](lo-interfaces.html)

    <!---->

  * *   [35.3.1. Creating a Large Object](lo-interfaces.html#LO-CREATE)
  * [35.3.2. Importing a Large Object](lo-interfaces.html#LO-IMPORT)
  * [35.3.3. Exporting a Large Object](lo-interfaces.html#LO-EXPORT)
  * [35.3.4. Opening an Existing Large Object](lo-interfaces.html#LO-OPEN)
  * [35.3.5. Writing Data to a Large Object](lo-interfaces.html#LO-WRITE)
  * [35.3.6. Reading Data from a Large Object](lo-interfaces.html#LO-READ)
  * [35.3.7. Seeking in a Large Object](lo-interfaces.html#LO-SEEK)
  * [35.3.8. Obtaining the Seek Position of a Large Object](lo-interfaces.html#LO-TELL)
  * [35.3.9. Truncating a Large Object](lo-interfaces.html#LO-TRUNCATE)
  * [35.3.10. Closing a Large Object Descriptor](lo-interfaces.html#LO-CLOSE)
  * [35.3.11. Removing a Large Object](lo-interfaces.html#LO-UNLINK)

      * *   [35.4. Server-Side Functions](lo-funcs.html)
* [35.5. Example Program](lo-examplesect.html)

PostgreSQL has a *large object* facility, which provides stream-style access to user data that is stored in a special large-object structure. Streaming access is useful when working with data values that are too large to manipulate conveniently as a whole.

This chapter describes the implementation and the programming and query language interfaces to PostgreSQL large object data. We use the libpq C library for the examples in this chapter, but most programming interfaces native to PostgreSQL support equivalent functionality. Other interfaces might use the large object interface internally to provide generic support for large values. This is not described here.

***

|                                                       |                                                           |                                             |
| :---------------------------------------------------- | :-------------------------------------------------------: | ------------------------------------------: |
| [Prev](libpq-example.html "34.22. Example Programs")  | [Up](client-interfaces.html "Part IV. Client Interfaces") |  [Next](lo-intro.html "35.1. Introduction") |
| 34.22. Example Programs                               |   [Home](index.html "PostgreSQL 17devel Documentation")   |                          35.1. Introduction |

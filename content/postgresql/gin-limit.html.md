<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  70.6. Limitations                 |                                          |                         |                                                       |                                             |
| :------------------------------------------------: | :--------------------------------------- | :---------------------: | ----------------------------------------------------: | ------------------------------------------: |
| [Prev](gin-tips.html "70.5. GIN Tips and Tricks")  | [Up](gin.html "Chapter 70. GIN Indexes") | Chapter 70. GIN Indexes | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](gin-examples.html "70.7. Examples") |

***

## 70.6. Limitations [#](#GIN-LIMIT)

GIN assumes that indexable operators are strict. This means that `extractValue` will not be called at all on a null item value (instead, a placeholder index entry is created automatically), and `extractQuery` will not be called on a null query value either (instead, the query is presumed to be unsatisfiable). Note however that null key values contained within a non-null composite item or query value are supported.

***

|                                                    |                                                       |                                             |
| :------------------------------------------------- | :---------------------------------------------------: | ------------------------------------------: |
| [Prev](gin-tips.html "70.5. GIN Tips and Tricks")  |        [Up](gin.html "Chapter 70. GIN Indexes")       |  [Next](gin-examples.html "70.7. Examples") |
| 70.5. GIN Tips and Tricks                          | [Home](index.html "PostgreSQL 17devel Documentation") |                              70.7. Examples |

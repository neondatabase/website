

|                            37.1. The Schema                           |                                                                    |                                    |                                                       |                                                       |
| :-------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](information-schema.html "Chapter 37. The Information Schema")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-datatypes.html "37.2. Data Types") |

***

## 37.1. The Schema [#](#INFOSCHEMA-SCHEMA)

The information schema itself is a schema named `information_schema`. This schema automatically exists in all databases. The owner of this schema is the initial database user in the cluster, and that user naturally has all the privileges on this schema, including the ability to drop it (but the space savings achieved by that are minuscule).

By default, the information schema is not in the schema search path, so you need to access all objects in it through qualified names. Since the names of some of the objects in the information schema are generic names that might occur in user applications, you should be careful if you want to put the information schema in the path.

***

|                                                                       |                                                                    |                                                       |
| :-------------------------------------------------------------------- | :----------------------------------------------------------------: | ----------------------------------------------------: |
| [Prev](information-schema.html "Chapter 37. The Information Schema")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-datatypes.html "37.2. Data Types") |
| Chapter 37. The Information Schema                                    |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                      37.2. Data Types |

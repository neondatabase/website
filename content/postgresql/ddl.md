<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                    Chapter 5. Data Definition                   |                                            |                           |                                                       |                                              |
| :-------------------------------------------------------------: | :----------------------------------------- | :-----------------------: | ----------------------------------------------------: | -------------------------------------------: |
| [Prev](sql-syntax-calling-funcs.html "4.3. Calling Functions")  | [Up](sql.html "Part II. The SQL Language") | Part II. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ddl-basics.html "5.1. Table Basics") |

***

## Chapter 5. Data Definition

**Table of Contents**

  * *   [5.1. Table Basics](ddl-basics.html)
  * [5.2. Default Values](ddl-default.html)
  * [5.3. Generated Columns](ddl-generated-columns.html)
  * [5.4. Constraints](ddl-constraints.html)

    <!---->

  * *   [5.4.1. Check Constraints](ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS)
    * [5.4.2. Not-Null Constraints](ddl-constraints.html#DDL-CONSTRAINTS-NOT-NULL)
    * [5.4.3. Unique Constraints](ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS)
    * [5.4.4. Primary Keys](ddl-constraints.html#DDL-CONSTRAINTS-PRIMARY-KEYS)
    * [5.4.5. Foreign Keys](ddl-constraints.html#DDL-CONSTRAINTS-FK)
    * [5.4.6. Exclusion Constraints](ddl-constraints.html#DDL-CONSTRAINTS-EXCLUSION)

  * *   [5.5. System Columns](ddl-system-columns.html)
  * [5.6. Modifying Tables](ddl-alter.html)

    <!---->

  * *   [5.6.1. Adding a Column](ddl-alter.html#DDL-ALTER-ADDING-A-COLUMN)
    * [5.6.2. Removing a Column](ddl-alter.html#DDL-ALTER-REMOVING-A-COLUMN)
    * [5.6.3. Adding a Constraint](ddl-alter.html#DDL-ALTER-ADDING-A-CONSTRAINT)
    * [5.6.4. Removing a Constraint](ddl-alter.html#DDL-ALTER-REMOVING-A-CONSTRAINT)
    * [5.6.5. Changing a Column's Default Value](ddl-alter.html#DDL-ALTER-COLUMN-DEFAULT)
    * [5.6.6. Changing a Column's Data Type](ddl-alter.html#DDL-ALTER-COLUMN-TYPE)
    * [5.6.7. Renaming a Column](ddl-alter.html#DDL-ALTER-RENAMING-COLUMN)
    * [5.6.8. Renaming a Table](ddl-alter.html#DDL-ALTER-RENAMING-TABLE)

  * *   [5.7. Privileges](ddl-priv.html)
  * [5.8. Row Security Policies](ddl-rowsecurity.html)
  * [5.9. Schemas](ddl-schemas.html)

    <!---->

  * *   [5.9.1. Creating a Schema](ddl-schemas.html#DDL-SCHEMAS-CREATE)
    * [5.9.2. The Public Schema](ddl-schemas.html#DDL-SCHEMAS-PUBLIC)
    * [5.9.3. The Schema Search Path](ddl-schemas.html#DDL-SCHEMAS-PATH)
    * [5.9.4. Schemas and Privileges](ddl-schemas.html#DDL-SCHEMAS-PRIV)
    * [5.9.5. The System Catalog Schema](ddl-schemas.html#DDL-SCHEMAS-CATALOG)
    * [5.9.6. Usage Patterns](ddl-schemas.html#DDL-SCHEMAS-PATTERNS)
    * [5.9.7. Portability](ddl-schemas.html#DDL-SCHEMAS-PORTABILITY)

* [5.10. Inheritance](ddl-inherit.html)

  * [5.10.1. Caveats](ddl-inherit.html#DDL-INHERIT-CAVEATS)

* [5.11. Table Partitioning](ddl-partitioning.html)

  * *   [5.11.1. Overview](ddl-partitioning.html#DDL-PARTITIONING-OVERVIEW)
    * [5.11.2. Declarative Partitioning](ddl-partitioning.html#DDL-PARTITIONING-DECLARATIVE)
    * [5.11.3. Partitioning Using Inheritance](ddl-partitioning.html#DDL-PARTITIONING-USING-INHERITANCE)
    * [5.11.4. Partition Pruning](ddl-partitioning.html#DDL-PARTITION-PRUNING)
    * [5.11.5. Partitioning and Constraint Exclusion](ddl-partitioning.html#DDL-PARTITIONING-CONSTRAINT-EXCLUSION)
    * [5.11.6. Best Practices for Declarative Partitioning](ddl-partitioning.html#DDL-PARTITIONING-DECLARATIVE-BEST-PRACTICES)

  * *   [5.12. Foreign Data](ddl-foreign-data.html)
  * [5.13. Other Database Objects](ddl-others.html)
  * [5.14. Dependency Tracking](ddl-depend.html)

This chapter covers how one creates the database structures that will hold one's data. In a relational database, the raw data is stored in tables, so the majority of this chapter is devoted to explaining how tables are created and modified and what features are available to control what data is stored in the tables. Subsequently, we discuss how tables can be organized into schemas, and how privileges can be assigned to tables. Finally, we will briefly look at other features that affect the data storage, such as inheritance, table partitioning, views, functions, and triggers.

***

|                                                                 |                                                       |                                              |
| :-------------------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------: |
| [Prev](sql-syntax-calling-funcs.html "4.3. Calling Functions")  |       [Up](sql.html "Part II. The SQL Language")      |  [Next](ddl-basics.html "5.1. Table Basics") |
| 4.3. Calling Functions                                          | [Home](index.html "PostgreSQL 17devel Documentation") |                            5.1. Table Basics |

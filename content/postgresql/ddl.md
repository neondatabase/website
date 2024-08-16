[#id](#DDL)

## Chapter 5. Data Definition

**Table of Contents**

- [5.1. Table Basics](ddl-basics)
- [5.2. Default Values](ddl-default)
- [5.3. Generated Columns](ddl-generated-columns)
- [5.4. Constraints](ddl-constraints)

  - [5.4.1. Check Constraints](ddl-constraints#DDL-CONSTRAINTS-CHECK-CONSTRAINTS)
  - [5.4.2. Not-Null Constraints](ddl-constraints#DDL-CONSTRAINTS-NOT-NULL)
  - [5.4.3. Unique Constraints](ddl-constraints#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS)
  - [5.4.4. Primary Keys](ddl-constraints#DDL-CONSTRAINTS-PRIMARY-KEYS)
  - [5.4.5. Foreign Keys](ddl-constraints#DDL-CONSTRAINTS-FK)
  - [5.4.6. Exclusion Constraints](ddl-constraints#DDL-CONSTRAINTS-EXCLUSION)

- [5.5. System Columns](ddl-system-columns)
- [5.6. Modifying Tables](ddl-alter)

  - [5.6.1. Adding a Column](ddl-alter#DDL-ALTER-ADDING-A-COLUMN)
  - [5.6.2. Removing a Column](ddl-alter#DDL-ALTER-REMOVING-A-COLUMN)
  - [5.6.3. Adding a Constraint](ddl-alter#DDL-ALTER-ADDING-A-CONSTRAINT)
  - [5.6.4. Removing a Constraint](ddl-alter#DDL-ALTER-REMOVING-A-CONSTRAINT)
  - [5.6.5. Changing a Column's Default Value](ddl-alter#DDL-ALTER-COLUMN-DEFAULT)
  - [5.6.6. Changing a Column's Data Type](ddl-alter#DDL-ALTER-COLUMN-TYPE)
  - [5.6.7. Renaming a Column](ddl-alter#DDL-ALTER-RENAMING-COLUMN)
  - [5.6.8. Renaming a Table](ddl-alter#DDL-ALTER-RENAMING-TABLE)

- [5.7. Privileges](ddl-priv)
- [5.8. Row Security Policies](ddl-rowsecurity)
- [5.9. Schemas](ddl-schemas)

  - [5.9.1. Creating a Schema](ddl-schemas#DDL-SCHEMAS-CREATE)
  - [5.9.2. The Public Schema](ddl-schemas#DDL-SCHEMAS-PUBLIC)
  - [5.9.3. The Schema Search Path](ddl-schemas#DDL-SCHEMAS-PATH)
  - [5.9.4. Schemas and Privileges](ddl-schemas#DDL-SCHEMAS-PRIV)
  - [5.9.5. The System Catalog Schema](ddl-schemas#DDL-SCHEMAS-CATALOG)
  - [5.9.6. Usage Patterns](ddl-schemas#DDL-SCHEMAS-PATTERNS)
  - [5.9.7. Portability](ddl-schemas#DDL-SCHEMAS-PORTABILITY)

- [5.10. Inheritance](ddl-inherit)

  - [5.10.1. Caveats](ddl-inherit#DDL-INHERIT-CAVEATS)

- [5.11. Table Partitioning](ddl-partitioning)

  - [5.11.1. Overview](ddl-partitioning#DDL-PARTITIONING-OVERVIEW)
  - [5.11.2. Declarative Partitioning](ddl-partitioning#DDL-PARTITIONING-DECLARATIVE)
  - [5.11.3. Partitioning Using Inheritance](ddl-partitioning#DDL-PARTITIONING-USING-INHERITANCE)
  - [5.11.4. Partition Pruning](ddl-partitioning#DDL-PARTITION-PRUNING)
  - [5.11.5. Partitioning and Constraint Exclusion](ddl-partitioning#DDL-PARTITIONING-CONSTRAINT-EXCLUSION)
  - [5.11.6. Best Practices for Declarative Partitioning](ddl-partitioning#DDL-PARTITIONING-DECLARATIVE-BEST-PRACTICES)

  - [5.12. Foreign Data](ddl-foreign-data)
  - [5.13. Other Database Objects](ddl-others)
  - [5.14. Dependency Tracking](ddl-depend)

This chapter covers how one creates the database structures that will hold one's data. In a relational database, the raw data is stored in tables, so the majority of this chapter is devoted to explaining how tables are created and modified and what features are available to control what data is stored in the tables. Subsequently, we discuss how tables can be organized into schemas, and how privileges can be assigned to tables. Finally, we will briefly look at other features that affect the data storage, such as inheritance, table partitioning, views, functions, and triggers.

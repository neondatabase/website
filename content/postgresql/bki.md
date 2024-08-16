[#id](#BKI)

## Chapter 75. System Catalog Declarations and Initial Contents

**Table of Contents**

- [75.1. System Catalog Declaration Rules](system-catalog-declarations)
- [75.2. System Catalog Initial Data](system-catalog-initial-data)

  - [75.2.1. Data File Format](system-catalog-initial-data#SYSTEM-CATALOG-INITIAL-DATA-FORMAT)
  - [75.2.2. OID Assignment](system-catalog-initial-data#SYSTEM-CATALOG-OID-ASSIGNMENT)
  - [75.2.3. OID Reference Lookup](system-catalog-initial-data#SYSTEM-CATALOG-OID-REFERENCES)
  - [75.2.4. Automatic Creation of Array Types](system-catalog-initial-data#SYSTEM-CATALOG-AUTO-ARRAY-TYPES)
  - [75.2.5. Recipes for Editing Data Files](system-catalog-initial-data#SYSTEM-CATALOG-RECIPES)

- [75.3. BKI File Format](bki-format)
- [75.4. BKI Commands](bki-commands)
- [75.5. Structure of the Bootstrap BKI File](bki-structure)
- [75.6. BKI Example](bki-example)

PostgreSQL uses many different system catalogs to keep track of the existence and properties of database objects, such as tables and functions. Physically there is no difference between a system catalog and a plain user table, but the backend C code knows the structure and properties of each catalog, and can manipulate it directly at a low level. Thus, for example, it is inadvisable to attempt to alter the structure of a catalog on-the-fly; that would break assumptions built into the C code about how rows of the catalog are laid out. But the structure of the catalogs can change between major versions.

The structures of the catalogs are declared in specially formatted C header files in the `src/include/catalog/` directory of the source tree. For each catalog there is a header file named after the catalog (e.g., `pg_class.h` for `pg_class`), which defines the set of columns the catalog has, as well as some other basic properties such as its OID.

Many of the catalogs have initial data that must be loaded into them during the “bootstrap” phase of initdb, to bring the system up to a point where it is capable of executing SQL commands. (For example, `pg_class.h` must contain an entry for itself, as well as one for each other system catalog and index.) This initial data is kept in editable form in data files that are also stored in the `src/include/catalog/` directory. For example, `pg_proc.dat` describes all the initial rows that must be inserted into the `pg_proc` catalog.

To create the catalog files and load this initial data into them, a backend running in bootstrap mode reads a BKI (Backend Interface) file containing commands and initial data. The `postgres.bki` file used in this mode is prepared from the aforementioned header and data files, while building a PostgreSQL distribution, by a Perl script named `genbki.pl`. Although it's specific to a particular PostgreSQL release, `postgres.bki` is platform-independent and is installed in the `share` subdirectory of the installation tree.

`genbki.pl` also produces a derived header file for each catalog, for example `pg_class_d.h` for the `pg_class` catalog. This file contains automatically-generated macro definitions, and may contain other macros, enum declarations, and so on that can be useful for client C code that reads a particular catalog.

Most PostgreSQL developers don't need to be directly concerned with the BKI file, but almost any nontrivial feature addition in the backend will require modifying the catalog header files and/or initial data files. The rest of this chapter gives some information about that, and for completeness describes the BKI file format.

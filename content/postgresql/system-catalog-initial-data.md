[#id](#SYSTEM-CATALOG-INITIAL-DATA)

## 75.2. System Catalog Initial Data [#](#SYSTEM-CATALOG-INITIAL-DATA)

- [75.2.1. Data File Format](system-catalog-initial-data#SYSTEM-CATALOG-INITIAL-DATA-FORMAT)
- [75.2.2. OID Assignment](system-catalog-initial-data#SYSTEM-CATALOG-OID-ASSIGNMENT)
- [75.2.3. OID Reference Lookup](system-catalog-initial-data#SYSTEM-CATALOG-OID-REFERENCES)
- [75.2.4. Automatic Creation of Array Types](system-catalog-initial-data#SYSTEM-CATALOG-AUTO-ARRAY-TYPES)
- [75.2.5. Recipes for Editing Data Files](system-catalog-initial-data#SYSTEM-CATALOG-RECIPES)

Each catalog that has any manually-created initial data (some do not) has a corresponding `.dat` file that contains its initial data in an editable format.

[#id](#SYSTEM-CATALOG-INITIAL-DATA-FORMAT)

### 75.2.1. Data File Format [#](#SYSTEM-CATALOG-INITIAL-DATA-FORMAT)

Each `.dat` file contains Perl data structure literals that are simply eval'd to produce an in-memory data structure consisting of an array of hash references, one per catalog row. A slightly modified excerpt from `pg_database.dat` will demonstrate the key features:

```
[

# A comment could appear here.
{ oid => '1', oid_symbol => 'Template1DbOid',
  descr => 'database\'s default template',
  datname => 'template1', encoding => 'ENCODING',
  datlocprovider => 'LOCALE_PROVIDER', datistemplate => 't',
  datallowconn => 't', datconnlimit => '-1', datfrozenxid => '0',
  datminmxid => '1', dattablespace => 'pg_default', datcollate => 'LC_COLLATE',
  datctype => 'LC_CTYPE', daticulocale => 'ICU_LOCALE', datacl => '_null_' },

]
```

Points to note:

- The overall file layout is: open square bracket, one or more sets of curly braces each of which represents a catalog row, close square bracket. Write a comma after each closing curly brace.

- Within each catalog row, write comma-separated _`key`_ `=>` _`value`_ pairs. The allowed *`key`*s are the names of the catalog's columns, plus the metadata keys `oid`, `oid_symbol`, `array_type_oid`, and `descr`. (The use of `oid` and `oid_symbol` is described in [Section 75.2.2](system-catalog-initial-data#SYSTEM-CATALOG-OID-ASSIGNMENT) below, while `array_type_oid` is described in [Section 75.2.4](system-catalog-initial-data#SYSTEM-CATALOG-AUTO-ARRAY-TYPES). `descr` supplies a description string for the object, which will be inserted into `pg_description` or `pg_shdescription` as appropriate.) While the metadata keys are optional, the catalog's defined columns must all be provided, except when the catalog's `.h` file specifies a default value for the column. (In the example above, the `datdba` field has been omitted because `pg_database.h` supplies a suitable default value for it.)

- All values must be single-quoted. Escape single quotes used within a value with a backslash. Backslashes meant as data can, but need not, be doubled; this follows Perl's rules for simple quoted literals. Note that backslashes appearing as data will be treated as escapes by the bootstrap scanner, according to the same rules as for escape string constants (see [Section 4.1.2.2](sql-syntax-lexical#SQL-SYNTAX-STRINGS-ESCAPE)); for example `\t` converts to a tab character. If you actually want a backslash in the final value, you will need to write four of them: Perl strips two, leaving `\\` for the bootstrap scanner to see.

- Null values are represented by `_null_`. (Note that there is no way to create a value that is just that string.)

- Comments are preceded by `#`, and must be on their own lines.

- Field values that are OIDs of other catalog entries should be represented by symbolic names rather than actual numeric OIDs. (In the example above, `dattablespace` contains such a reference.) This is described in [Section 75.2.3](system-catalog-initial-data#SYSTEM-CATALOG-OID-REFERENCES) below.

- Since hashes are unordered data structures, field order and line layout aren't semantically significant. However, to maintain a consistent appearance, we set a few rules that are applied by the formatting script `reformat_dat_file.pl`:

  - Within each pair of curly braces, the metadata fields `oid`, `oid_symbol`, `array_type_oid`, and `descr` (if present) come first, in that order, then the catalog's own fields appear in their defined order.

  - Newlines are inserted between fields as needed to limit line length to 80 characters, if possible. A newline is also inserted between the metadata fields and the regular fields.

  - If the catalog's `.h` file specifies a default value for a column, and a data entry has that same value, `reformat_dat_file.pl` will omit it from the data file. This keeps the data representation compact.

  - `reformat_dat_file.pl` preserves blank lines and comment lines as-is.

  It's recommended to run `reformat_dat_file.pl` before submitting catalog data patches. For convenience, you can simply change to `src/include/catalog/` and run `make reformat-dat-files`.

- If you want to add a new method of making the data representation smaller, you must implement it in `reformat_dat_file.pl` and also teach `Catalog::ParseData()` how to expand the data back into the full representation.

[#id](#SYSTEM-CATALOG-OID-ASSIGNMENT)

### 75.2.2. OID Assignment [#](#SYSTEM-CATALOG-OID-ASSIGNMENT)

A catalog row appearing in the initial data can be given a manually-assigned OID by writing an `oid => nnnn` metadata field. Furthermore, if an OID is assigned, a C macro for that OID can be created by writing an `oid_symbol => name` metadata field.

Pre-loaded catalog rows must have preassigned OIDs if there are OID references to them in other pre-loaded rows. A preassigned OID is also needed if the row's OID must be referenced from C code. If neither case applies, the `oid` metadata field can be omitted, in which case the bootstrap code assigns an OID automatically. In practice we usually preassign OIDs for all or none of the pre-loaded rows in a given catalog, even if only some of them are actually cross-referenced.

Writing the actual numeric value of any OID in C code is considered very bad form; always use a macro, instead. Direct references to `pg_proc` OIDs are common enough that there's a special mechanism to create the necessary macros automatically; see `src/backend/utils/Gen_fmgrtab.pl`. Similarly — but, for historical reasons, not done the same way — there's an automatic method for creating macros for `pg_type` OIDs. `oid_symbol` entries are therefore not necessary in those two catalogs. Likewise, macros for the `pg_class` OIDs of system catalogs and indexes are set up automatically. For all other system catalogs, you have to manually specify any macros you need via `oid_symbol` entries.

To find an available OID for a new pre-loaded row, run the script `src/include/catalog/unused_oids`. It prints inclusive ranges of unused OIDs (e.g., the output line `45-900` means OIDs 45 through 900 have not been allocated yet). Currently, OIDs 1–9999 are reserved for manual assignment; the `unused_oids` script simply looks through the catalog headers and `.dat` files to see which ones do not appear. You can also use the `duplicate_oids` script to check for mistakes. (`genbki.pl` will assign OIDs for any rows that didn't get one hand-assigned to them, and it will also detect duplicate OIDs at compile time.)

When choosing OIDs for a patch that is not expected to be committed immediately, best practice is to use a group of more-or-less consecutive OIDs starting with some random choice in the range 8000—9999. This minimizes the risk of OID collisions with other patches being developed concurrently. To keep the 8000—9999 range free for development purposes, after a patch has been committed to the master git repository its OIDs should be renumbered into available space below that range. Typically, this will be done near the end of each development cycle, moving all OIDs consumed by patches committed in that cycle at the same time. The script `renumber_oids.pl` can be used for this purpose. If an uncommitted patch is found to have OID conflicts with some recently-committed patch, `renumber_oids.pl` may also be useful for recovering from that situation.

Because of this convention of possibly renumbering OIDs assigned by patches, the OIDs assigned by a patch should not be considered stable until the patch has been included in an official release. We do not change manually-assigned object OIDs once released, however, as that would create assorted compatibility problems.

If `genbki.pl` needs to assign an OID to a catalog entry that does not have a manually-assigned OID, it will use a value in the range 10000—11999. The server's OID counter is set to 10000 at the start of a bootstrap run, so that any objects created on-the-fly during bootstrap processing also receive OIDs in this range. (The usual OID assignment mechanism takes care of preventing any conflicts.)

Objects with OIDs below `FirstUnpinnedObjectId` (12000) are considered “pinned”, preventing them from being deleted. (There are a small number of exceptions, which are hard-wired into `IsPinnedObject()`.) initdb forces the OID counter up to `FirstUnpinnedObjectId` as soon as it's ready to create unpinned objects. Thus objects created during the later phases of initdb, such as objects created while running the `information_schema.sql` script, will not be pinned, while all objects known to `genbki.pl` will be.

OIDs assigned during normal database operation are constrained to be 16384 or higher. This ensures that the range 10000—16383 is free for OIDs assigned automatically by `genbki.pl` or during initdb. These automatically-assigned OIDs are not considered stable, and may change from one installation to another.

[#id](#SYSTEM-CATALOG-OID-REFERENCES)

### 75.2.3. OID Reference Lookup [#](#SYSTEM-CATALOG-OID-REFERENCES)

In principle, cross-references from one initial catalog row to another could be written just by writing the preassigned OID of the referenced row in the referencing field. However, that is against project policy, because it is error-prone, hard to read, and subject to breakage if a newly-assigned OID is renumbered. Therefore `genbki.pl` provides mechanisms to write symbolic references instead. The rules are as follows:

- Use of symbolic references is enabled in a particular catalog column by attaching `BKI_LOOKUP(lookuprule)` to the column's definition, where _`lookuprule`_ is the name of the referenced catalog, e.g., `pg_proc`. `BKI_LOOKUP` can be attached to columns of type `Oid`, `regproc`, `oidvector`, or `Oid[]`; in the latter two cases it implies performing a lookup on each element of the array.

- It's also permissible to attach `BKI_LOOKUP(encoding)` to integer columns to reference character set encodings, which are not currently represented as catalog OIDs, but have a set of values known to `genbki.pl`.

- In some catalog columns, it's allowed for entries to be zero instead of a valid reference. If this is allowed, write `BKI_LOOKUP_OPT` instead of `BKI_LOOKUP`. Then you can write `0` for an entry. (If the column is declared `regproc`, you can optionally write `-` instead of `0`.) Except for this special case, all entries in a `BKI_LOOKUP` column must be symbolic references. `genbki.pl` will warn about unrecognized names.

- Most kinds of catalog objects are simply referenced by their names. Note that type names must exactly match the referenced `pg_type` entry's `typname`; you do not get to use any aliases such as `integer` for `int4`.

- A function can be represented by its `proname`, if that is unique among the `pg_proc.dat` entries (this works like regproc input). Otherwise, write it as _`proname(argtypename,argtypename,...)`_, like regprocedure. The argument type names must be spelled exactly as they are in the `pg_proc.dat` entry's `proargtypes` field. Do not insert any spaces.

- Operators are represented by _`oprname(lefttype,righttype)`_, writing the type names exactly as they appear in the `pg_operator.dat` entry's `oprleft` and `oprright` fields. (Write `0` for the omitted operand of a unary operator.)

- The names of opclasses and opfamilies are only unique within an access method, so they are represented by _`access_method_name`_`/`_`object_name`_.

- In none of these cases is there any provision for schema-qualification; all objects created during bootstrap are expected to be in the `pg_catalog` schema.

`genbki.pl` resolves all symbolic references while it runs, and puts simple numeric OIDs into the emitted BKI file. There is therefore no need for the bootstrap backend to deal with symbolic references.

It's desirable to mark OID reference columns with `BKI_LOOKUP` or `BKI_LOOKUP_OPT` even if the catalog has no initial data that requires lookup. This allows `genbki.pl` to record the foreign key relationships that exist in the system catalogs. That information is used in the regression tests to check for incorrect entries. See also the macros `DECLARE_FOREIGN_KEY`, `DECLARE_FOREIGN_KEY_OPT`, `DECLARE_ARRAY_FOREIGN_KEY`, and `DECLARE_ARRAY_FOREIGN_KEY_OPT`, which are used to declare foreign key relationships that are too complex for `BKI_LOOKUP` (typically, multi-column foreign keys).

[#id](#SYSTEM-CATALOG-AUTO-ARRAY-TYPES)

### 75.2.4. Automatic Creation of Array Types [#](#SYSTEM-CATALOG-AUTO-ARRAY-TYPES)

Most scalar data types should have a corresponding array type (that is, a standard varlena array type whose element type is the scalar type, and which is referenced by the `typarray` field of the scalar type's `pg_type` entry). `genbki.pl` is able to generate the `pg_type` entry for the array type automatically in most cases.

To use this facility, just write an `array_type_oid => nnnn` metadata field in the scalar type's `pg_type` entry, specifying the OID to use for the array type. You may then omit the `typarray` field, since it will be filled automatically with that OID.

The generated array type's name is the scalar type's name with an underscore prepended. The array entry's other fields are filled from `BKI_ARRAY_DEFAULT(value)` annotations in `pg_type.h`, or if there isn't one, copied from the scalar type. (There's also a special case for `typalign`.) Then the `typelem` and `typarray` fields of the two entries are set to cross-reference each other.

[#id](#SYSTEM-CATALOG-RECIPES)

### 75.2.5. Recipes for Editing Data Files [#](#SYSTEM-CATALOG-RECIPES)

Here are some suggestions about the easiest ways to perform common tasks when updating catalog data files.

**Add a new column with a default to a catalog: ** Add the column to the header file with a `BKI_DEFAULT(value)` annotation. The data file need only be adjusted by adding the field in existing rows where a non-default value is needed.

**Add a default value to an existing column that doesn't have one: ** Add a `BKI_DEFAULT` annotation to the header file, then run `make reformat-dat-files` to remove now-redundant field entries.

**Remove a column, whether it has a default or not: ** Remove the column from the header, then run `make reformat-dat-files` to remove now-useless field entries.

**Change or remove an existing default value: ** You cannot simply change the header file, since that will cause the current data to be interpreted incorrectly. First run `make expand-dat-files` to rewrite the data files with all default values inserted explicitly, then change or remove the `BKI_DEFAULT` annotation, then run `make reformat-dat-files` to remove superfluous fields again.

**Ad-hoc bulk editing: ** `reformat_dat_file.pl` can be adapted to perform many kinds of bulk changes. Look for its block comments showing where one-off code can be inserted. In the following example, we are going to consolidate two Boolean fields in `pg_proc` into a char field:

1. Add the new column, with a default, to `pg_proc.h`:

   ```
   +    /* see PROKIND_ categories below */
   +    char        prokind BKI_DEFAULT(f);
   ```

2. Create a new script based on `reformat_dat_file.pl` to insert appropriate values on-the-fly:

   ```
   -           # At this point we have the full row in memory as a hash
   -           # and can do any operations we want. As written, it only
   -           # removes default values, but this script can be adapted to
   -           # do one-off bulk-editing.
   +           # One-off change to migrate to prokind
   +           # Default has already been filled in by now, so change to other
   +           # values as appropriate
   +           if ($values{proisagg} eq 't')
   +           {
   +               $values{prokind} = 'a';
   +           }
   +           elsif ($values{proiswindow} eq 't')
   +           {
   +               $values{prokind} = 'w';
   +           }
   ```

3. Run the new script:

   ```
   $ cd src/include/catalog
   $ perl  rewrite_dat_with_prokind.pl  pg_proc.dat
   ```

   At this point `pg_proc.dat` has all three columns, `prokind`, `proisagg`, and `proiswindow`, though they will appear only in rows where they have non-default values.

4. Remove the old columns from `pg_proc.h`:

   ```
   -    /* is it an aggregate? */
   -    bool        proisagg BKI_DEFAULT(f);
   -
   -    /* is it a window function? */
   -    bool        proiswindow BKI_DEFAULT(f);
   ```

5. Finally, run `make reformat-dat-files` to remove the useless old entries from `pg_proc.dat`.

For further examples of scripts used for bulk editing, see `convert_oid2name.pl` and `remove_pg_type_oid_symbols.pl` attached to this message: [https://www.postgresql.org/message-id/CAJVSVGVX8gXnPm+Xa=DxR7kFYprcQ1tNcCT5D0O3ShfnM6jehA@mail.gmail.com](https://www.postgresql.org/message-id/CAJVSVGVX8gXnPm+Xa=DxR7kFYprcQ1tNcCT5D0O3ShfnM6jehA@mail.gmail.com)

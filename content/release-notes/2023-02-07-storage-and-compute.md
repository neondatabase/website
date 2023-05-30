### What's new

- Compute: Added support for the PostgreSQL `postgis-sfcgal` extension. For more information about PostgreSQL extensions supported by Neon, see [PostgreSQL extensions](/docs/extensions/pg-extensions).
- Compute: Added support for [International Components for Unicode (ICU)](https://icu.unicode.org/), which permits defining collation objects that use ICU as the collation provider. For example:

    ```sql
    CREATE COLLATION german (provider = icu, locale = 'de');
    ```

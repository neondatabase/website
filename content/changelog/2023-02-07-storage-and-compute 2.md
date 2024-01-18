### Postgres extension support

Added support for the Postgres `postgis-sfcgal` extension. For more information about Postgres extensions supported by Neon, see [Postgres extensions](/docs/extensions/pg-extensions).

### Fixes & improvements

Compute: Added support for [International Components for Unicode (ICU)](https://icu.unicode.org/), which permits defining collation objects that use ICU as the collation provider. For example:

```sql
CREATE COLLATION german (provider = icu, locale = 'de');
```



|                              F.48. uuid-ossp — a UUID generator                             |                                                                             |                                                        |                                                       |                                                                         |
| :-----------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------- | :----------------------------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](unaccent.html "F.47. unaccent — a text search dictionary which removes diacritics")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") | Appendix F. Additional Supplied Modules and Extensions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](xml2.html "F.49. xml2 — XPath querying and XSLT functionality") |

***

## F.48. uuid-ossp — a UUID generator [#](#UUID-OSSP)

  * *   [F.48.1. `uuid-ossp` Functions](uuid-ossp.html#UUID-OSSP-FUNCTIONS-SECT)
  * [F.48.2. Building `uuid-ossp`](uuid-ossp.html#UUID-OSSP-BUILDING)
  * [F.48.3. Author](uuid-ossp.html#UUID-OSSP-AUTHOR)

The `uuid-ossp` module provides functions to generate universally unique identifiers (UUIDs) using one of several standard algorithms. There are also functions to produce certain special UUID constants. This module is only necessary for special requirements beyond what is available in core PostgreSQL. See [Section 9.14](functions-uuid.html "9.14. UUID Functions") for built-in ways to generate UUIDs.

This module is considered “trusted”, that is, it can be installed by non-superusers who have `CREATE` privilege on the current database.

### F.48.1. `uuid-ossp` Functions [#](#UUID-OSSP-FUNCTIONS-SECT)

[Table F.34](uuid-ossp.html#UUID-OSSP-FUNCTIONS "Table F.34. Functions for UUID Generation") shows the functions available to generate UUIDs. The relevant standards ITU-T Rec. X.667, ISO/IEC 9834-8:2005, and [RFC 4122](https://tools.ietf.org/html/rfc4122) specify four algorithms for generating UUIDs, identified by the version numbers 1, 3, 4, and 5. (There is no version 2 algorithm.) Each of these algorithms could be suitable for a different set of applications.

**Table F.34. Functions for UUID Generation**

| FunctionDescription                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uuid_generate_v1` () → `uuid`Generates a version 1 UUID. This involves the MAC address of the computer and a time stamp. Note that UUIDs of this kind reveal the identity of the computer that created the identifier and the time at which it did so, which might make it unsuitable for certain security-sensitive applications.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `uuid_generate_v1mc` () → `uuid`Generates a version 1 UUID, but uses a random multicast MAC address instead of the real MAC address of the computer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `uuid_generate_v3` ( *`namespace`* `uuid`, *`name`* `text` ) → `uuid`Generates a version 3 UUID in the given namespace using the specified input name. The namespace should be one of the special constants produced by the `uuid_ns_*()` functions shown in [Table F.35](uuid-ossp.html#UUID-OSSP-CONSTANTS "Table F.35. Functions Returning UUID Constants"). (It could be any UUID in theory.) The name is an identifier in the selected namespace.For example:     SELECT uuid_generate_v3(uuid_ns_url(), '[http://www.postgresql.org](http://www.postgresql.org)'); The name parameter will be MD5-hashed, so the cleartext cannot be derived from the generated UUID. The generation of UUIDs by this method has no random or environment-dependent element and is therefore reproducible. |
| `uuid_generate_v4` () → `uuid`Generates a version 4 UUID, which is derived entirely from random numbers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `uuid_generate_v5` ( *`namespace`* `uuid`, *`name`* `text` ) → `uuid`Generates a version 5 UUID, which works like a version 3 UUID except that SHA-1 is used as a hashing method. Version 5 should be preferred over version 3 because SHA-1 is thought to be more secure than MD5.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

\

**Table F.35. Functions Returning UUID Constants**

| FunctionDescription                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uuid_nil` () → `uuid`Returns a “nil” UUID constant, which does not occur as a real UUID.                                                                                                       |
| `uuid_ns_dns` () → `uuid`Returns a constant designating the DNS namespace for UUIDs.                                                                                                            |
| `uuid_ns_url` () → `uuid`Returns a constant designating the URL namespace for UUIDs.                                                                                                            |
| `uuid_ns_oid` () → `uuid`Returns a constant designating the ISO object identifier (OID) namespace for UUIDs. (This pertains to ASN.1 OIDs, which are unrelated to the OIDs used in PostgreSQL.) |
| `uuid_ns_x500` () → `uuid`Returns a constant designating the X.500 distinguished name (DN) namespace for UUIDs.                                                                                 |

### F.48.2. Building `uuid-ossp` [#](#UUID-OSSP-BUILDING)

Historically this module depended on the OSSP UUID library, which accounts for the module's name. While the OSSP UUID library can still be found at [http://www.ossp.org/pkg/lib/uuid/](http://www.ossp.org/pkg/lib/uuid/), it is not well maintained, and is becoming increasingly difficult to port to newer platforms. `uuid-ossp` can now be built without the OSSP library on some platforms. On FreeBSD and some other BSD-derived platforms, suitable UUID creation functions are included in the core `libc` library. On Linux, macOS, and some other platforms, suitable functions are provided in the `libuuid` library, which originally came from the `e2fsprogs` project (though on modern Linux it is considered part of `util-linux-ng`). When invoking `configure`, specify `--with-uuid=bsd` to use the BSD functions, or `--with-uuid=e2fs` to use `e2fsprogs`' `libuuid`, or `--with-uuid=ossp` to use the OSSP UUID library. More than one of these libraries might be available on a particular machine, so `configure` does not automatically choose one.

### F.48.3. Author [#](#UUID-OSSP-AUTHOR)

Peter Eisentraut `<peter_e@gmx.net>`

***

|                                                                                             |                                                                             |                                                                         |
| :------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------: | ----------------------------------------------------------------------: |
| [Prev](unaccent.html "F.47. unaccent — a text search dictionary which removes diacritics")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") |  [Next](xml2.html "F.49. xml2 — XPath querying and XSLT functionality") |
| F.47. unaccent — a text search dictionary which removes diacritics                          |            [Home](index.html "PostgreSQL 17devel Documentation")            |                      F.49. xml2 — XPath querying and XSLT functionality |

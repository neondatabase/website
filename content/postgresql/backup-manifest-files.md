[#id](#BACKUP-MANIFEST-FILES)

## 77.2. Backup Manifest File Object [#](#BACKUP-MANIFEST-FILES)

The object which describes a single file contains either a `Path` key or an `Encoded-Path` key. Normally, the `Path` key will be present. The associated string value is the path of the file relative to the root of the backup directory. Files located in a user-defined tablespace will have paths whose first two components are `pg_tblspc` and the OID of the tablespace. If the path is not a string that is legal in UTF-8, or if the user requests that encoded paths be used for all files, then the `Encoded-Path` key will be present instead. This stores the same data, but it is encoded as a string of hexadecimal digits. Each pair of hexadecimal digits in the string represents a single octet.

The following two keys are always present:

- `Size`

  The expected size of this file, as an integer.

- `Last-Modified`

  The last modification time of the file as reported by the server at the time of the backup. Unlike the other fields stored in the backup, this field is not used by [pg_verifybackup](app-pgverifybackup). It is included only for informational purposes.

If the backup was taken with file checksums enabled, the following keys will be present:

- `Checksum-Algorithm`

  The checksum algorithm used to compute a checksum for this file. Currently, this will be the same for every file in the backup manifest, but this may change in future releases. At present, the supported checksum algorithms are `CRC32C`, `SHA224`, `SHA256`, `SHA384`, and `SHA512`.

- `Checksum`

  The checksum computed for this file, stored as a series of hexadecimal characters, two for each byte of the checksum.

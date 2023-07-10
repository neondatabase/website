---
title: Import data from PostgreSQL
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/tutorials
  - /docs/how-to-guides/import-an-existing-database
---

This topic describes how to import an existing PostgreSQL database to Neon. The following methods are described:

- [pg_dump with psql](#pg_dump-with-psql)
- [pg_dump with pg_restore](#pg_dump-with-pg_restore)

## Which import method should you use?

The primary determinant is the format of your dump file. The `psql` utility can only be used with plain SQL dumps, while `pg_restore` can be used with plain SQL or PostgreSQL custom format dumps.

If you prefer working with human-readable SQL scripts that can be inspected or edited using a text editor, the [pg_dump with psql](#pg_dump-with-psql) method may be your preferred option.

If you are importing a large or complex dataset, you might choose the [pg_dump with pg_restore](#pg_dump-with-pg_restore) method. The `pg_restore` utility has these advantages:

- It may be faster, particularly for large databases.
- It supports parallel restoration of data.
- It allows for greater flexibility during the restore process.

Before you begin, it is recommended that you familiarize yourself with the capabilities of the [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html), [psql](https://www.postgresql.org/docs/current/app-psql.html), and [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) utilities, and choose the import method that best meets your requirements.

## pg_dump with psql

This section describes using the `pg_dump` utility to dump data from an existing PostgreSQL database and import it into Neon using `psql`.

<Admonition type="note">
If you have multiple databases to import, each database must be imported separately.
</Admonition>

The example below uses the following command, which you can run from a terminal or command window where you have access to the `pg_dump` and `psql` utilities. The first connection string is for your existing PostgreSQL database. The second is for your Neon database.

```bash
pg_dump <old-connection-string> | psql <neon-connection-string>
```

A PostgreSQL connection string has the following format:

```bash
postgres://<user>:<password>@<hostname>:<port>/<dbname>
```

You must supply the connection string for your existing PostgreSQL database. You can obtain the connection string for your Neon database from the **Connection Details** widget on the Neon **Dashboard**. The connection string will look something like this:

<CodeBlock shouldWrap>

```bash
postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/<dbname>
```

</CodeBlock>

where:

- `<user>` is the PostgreSQL role.
- `<password>` is the role's password.
- `ep-polished-water-579720.us-east-2.aws.neon.tech` is the hostname of the Neon PostgreSQL instance. Your hostname will differ.
- `<dbname>` is the name of the database. You can use the default `neondb` database or create your own. For instructions, see [Create a database](/docs/manage/databases#create-a-database).

<Admonition type="note">
Neon uses the default PostgreSQL port, `5432`, so it does not need to be specified explicitly in the Neon connection string.
</Admonition>

After you input the connection strings into your command, it will appear similar to the following:

<CodeBlock shouldWrap>

```bash
pg_dump postgres://<user>:<password>@<hostname>:5432/<dbname> | psql postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/<dbname>
```

</CodeBlock>

Run the command in your terminal or command window to import your data.

## pg_dump with pg_restore

This section describes using the `pg_dump` utility to dump data from an existing PostgreSQL database and import it into your Neon database using `pg_restore` .

1. Start by retrieving the connection strings for the existing PostgreSQL database and your Neon database.

   You must supply the connection string for your existing PostgreSQL database. You can obtain the connection string for your Neon database from the **Connection Details** widget on the Neon **Dashboard**. The Neon connection string will look something like this:

   <CodeBlock shouldWrap>

   ```bash
   postgres://<user>:<password>@ep-polished-water-579720.us-east-2.aws.neon.tech/<dbname>
   ```

   </CodeBlock>

2. Dump the database from your existing PostgreSQL instance. You can use a `pg_dump` command similar to the following:

   <CodeBlock shouldWrap>

   ```bash
   pg_dump "postgres://<user>:<hostname>:<port>/<dbname>" --file=dumpfile.bak -Fc -Z 6 -v
   ```

   </CodeBlock>

   The example above includes some optional arguments. The `-Fc` option sends the output to a custom-format archive suitable for input into `pg_restore`. The `-Z 6` option specifies a compression level of 6 (the default). The `-v` option runs `pg_dump` in verbose mode, allowing you to monitor what happens during the dump.

   The `pg_dump` command provides many other options to modify your database dump. To learn more, refer to the [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) documentation.

3. Load the database dump into Neon using `pg_restore`. For example:

    <CodeBlock shouldWrap>

    ```bash
    pg_restore -d postgres://[user]:[password]@[hostname]/<dbname> -Fc --single-transaction -c --if-exists dumpfile.bak -v
    ```

    </CodeBlock>

    <Admonition type="note">
    The database specified in the command above must exist in Neon. If it does not, create it first. See [/docs/manage/databases#create-a-database].
    </Admonition>

    The example above includes some optional arguments. The `-Fc` option specifies the format of the archive. In this case, `-Fc` indicates a custom-format archive file. The `--single-transaction` option forces the operation to run as an atomic transaction, which ensures that no data is left behind when an import operation fails. (Retrying an import operation after a failed attempt that leaves data behind may result in "duplicate key value" errors.) The `-c --if-exists` options drop database objects before creating them, if they already exist. The `-v` option runs `pg_restore` in verbose mode, allowing you to monitor what happens during the restore operation.

    <Admonition type="note">
    `pg_restore` also supports a `-j` option that specifies the number of concurrent jobs, which can make imports faster. This option is not used in the example above because multiple jobs cannot be used together with the `--single-transaction` option.
    </Admonition>

    The `pg_restore` command provides other options to modify your database import. To learn more, refer to the [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) documentation.

## pg_dump and pg_restore example

The following example shows how data from a `chinook` database was dumped and restored to a `chinook2` database in Neon using the commands described in the previous section.

<CodeBlock shouldWrap>

```bash
~$ cd mydump
~/mydump$ pg_dump "postgres://daniel:<password>@ep-tiny-silence-654537.us-east-2.aws.neon.tech/chinook" --file=dumpfile.bak -Fc -Z 6 -v

pg_dump: last built-in OID is 16383
pg_dump: reading extensions
pg_dump: identifying extension members
pg_dump: reading schemas
pg_dump: reading user-defined tables
pg_dump: reading user-defined functions
pg_dump: reading user-defined types
pg_dump: reading procedural languages
pg_dump: reading user-defined aggregate functions
pg_dump: reading user-defined operators
pg_dump: reading user-defined access methods
pg_dump: reading user-defined operator classes
pg_dump: reading user-defined operator families
pg_dump: reading user-defined text search parsers
pg_dump: reading user-defined text search templates
pg_dump: reading user-defined text search dictionaries
pg_dump: reading user-defined text search configurations
pg_dump: reading user-defined foreign-data wrappers
pg_dump: reading user-defined foreign servers
pg_dump: reading default privileges
pg_dump: reading user-defined collations
pg_dump: reading user-defined conversions
pg_dump: reading type casts
pg_dump: reading transforms
pg_dump: reading table inheritance information
pg_dump: reading event triggers
pg_dump: finding extension tables
pg_dump: finding inheritance relationships
pg_dump: reading column info for interesting tables
pg_dump: flagging inherited columns in subtables
pg_dump: reading indexes
pg_dump: flagging indexes in partitioned tables
pg_dump: reading extended statistics
pg_dump: reading constraints
pg_dump: reading triggers
pg_dump: reading rewrite rules
pg_dump: reading policies
pg_dump: reading row-level security policies
pg_dump: reading publications
pg_dump: reading publication membership of tables
pg_dump: reading publication membership of schemas
pg_dump: reading subscriptions
pg_dump: reading large objects
pg_dump: reading dependency data
pg_dump: saving encoding = UTF8
pg_dump: saving standard_conforming_strings = on
pg_dump: saving search_path = 
pg_dump: saving database definition
pg_dump: dumping contents of table "public.Album"
pg_dump: dumping contents of table "public.Artist"
pg_dump: dumping contents of table "public.Customer"
pg_dump: dumping contents of table "public.Employee"
pg_dump: dumping contents of table "public.Genre"
pg_dump: dumping contents of table "public.Invoice"
pg_dump: dumping contents of table "public.InvoiceLine"
pg_dump: dumping contents of table "public.MediaType"
pg_dump: dumping contents of table "public.Playlist"
pg_dump: dumping contents of table "public.PlaylistTrack"
pg_dump: dumping contents of table "public.Track"

~/mydump$ ls
dumpfile.bak

~/mydump$ pg_restore -d postgres://daniel:<password>@ep-tiny-silence-654537.us-east-2.aws.neon.tech/chinook2 -Fc --single-transaction -c --if-exists dumpfile.bak -v

pg_restore -d postgres://daniel:RsBDNYQo4r8t@ep-mute-fire-194396.eu-central-1.aws.neon.tech/chinook2 -Fc --single-transaction -c --if-exists dumpfile.bak -v

pg_restore: connecting to database for restore
pg_restore: dropping FK CONSTRAINT Track FK_TrackMediaTypeId
pg_restore: dropping FK CONSTRAINT Track FK_TrackGenreId
pg_restore: dropping FK CONSTRAINT Track FK_TrackAlbumId
pg_restore: dropping FK CONSTRAINT PlaylistTrack FK_PlaylistTrackTrackId
pg_restore: dropping FK CONSTRAINT PlaylistTrack FK_PlaylistTrackPlaylistId
pg_restore: dropping FK CONSTRAINT InvoiceLine FK_InvoiceLineTrackId
pg_restore: dropping FK CONSTRAINT InvoiceLine FK_InvoiceLineInvoiceId
pg_restore: dropping FK CONSTRAINT Invoice FK_InvoiceCustomerId
pg_restore: dropping FK CONSTRAINT Employee FK_EmployeeReportsTo
pg_restore: dropping FK CONSTRAINT Customer FK_CustomerSupportRepId
pg_restore: dropping FK CONSTRAINT Album FK_AlbumArtistId
pg_restore: dropping INDEX IFK_TrackMediaTypeId
pg_restore: dropping INDEX IFK_TrackGenreId
pg_restore: dropping INDEX IFK_TrackAlbumId
pg_restore: dropping INDEX IFK_PlaylistTrackTrackId
pg_restore: dropping INDEX IFK_InvoiceLineTrackId
pg_restore: dropping INDEX IFK_InvoiceLineInvoiceId
pg_restore: dropping INDEX IFK_InvoiceCustomerId
pg_restore: dropping INDEX IFK_EmployeeReportsTo
pg_restore: dropping INDEX IFK_CustomerSupportRepId
pg_restore: dropping INDEX IFK_AlbumArtistId
pg_restore: dropping CONSTRAINT Track PK_Track
pg_restore: dropping CONSTRAINT PlaylistTrack PK_PlaylistTrack
pg_restore: dropping CONSTRAINT Playlist PK_Playlist
pg_restore: dropping CONSTRAINT MediaType PK_MediaType
pg_restore: dropping CONSTRAINT InvoiceLine PK_InvoiceLine
pg_restore: dropping CONSTRAINT Invoice PK_Invoice
pg_restore: dropping CONSTRAINT Genre PK_Genre
pg_restore: dropping CONSTRAINT Employee PK_Employee
pg_restore: dropping CONSTRAINT Customer PK_Customer
pg_restore: dropping CONSTRAINT Artist PK_Artist
pg_restore: dropping CONSTRAINT Album PK_Album
pg_restore: dropping TABLE Track
pg_restore: dropping TABLE PlaylistTrack
pg_restore: dropping TABLE Playlist
pg_restore: dropping TABLE MediaType
pg_restore: dropping TABLE InvoiceLine
pg_restore: dropping TABLE Invoice
pg_restore: dropping TABLE Genre
pg_restore: dropping TABLE Employee
pg_restore: dropping TABLE Customer
pg_restore: dropping TABLE Artist
pg_restore: dropping TABLE Album
pg_restore: creating TABLE "public.Album"
pg_restore: creating TABLE "public.Artist"
pg_restore: creating TABLE "public.Customer"
pg_restore: creating TABLE "public.Employee"
pg_restore: creating TABLE "public.Genre"
pg_restore: creating TABLE "public.Invoice"
pg_restore: creating TABLE "public.InvoiceLine"
pg_restore: creating TABLE "public.MediaType"
pg_restore: creating TABLE "public.Playlist"
pg_restore: creating TABLE "public.PlaylistTrack"
pg_restore: creating TABLE "public.Track"
pg_restore: processing data for table "public.Album"
pg_restore: processing data for table "public.Artist"
pg_restore: processing data for table "public.Customer"
pg_restore: processing data for table "public.Employee"
pg_restore: processing data for table "public.Genre"
pg_restore: processing data for table "public.Invoice"
pg_restore: processing data for table "public.InvoiceLine"
pg_restore: processing data for table "public.MediaType"
pg_restore: processing data for table "public.Playlist"
pg_restore: processing data for table "public.PlaylistTrack"
pg_restore: processing data for table "public.Track"
pg_restore: creating CONSTRAINT "public.Album PK_Album"
pg_restore: creating CONSTRAINT "public.Artist PK_Artist"
pg_restore: creating CONSTRAINT "public.Customer PK_Customer"
pg_restore: creating CONSTRAINT "public.Employee PK_Employee"
pg_restore: creating CONSTRAINT "public.Genre PK_Genre"
pg_restore: creating CONSTRAINT "public.Invoice PK_Invoice"
pg_restore: creating CONSTRAINT "public.InvoiceLine PK_InvoiceLine"
pg_restore: creating CONSTRAINT "public.MediaType PK_MediaType"
pg_restore: creating CONSTRAINT "public.Playlist PK_Playlist"
pg_restore: creating CONSTRAINT "public.PlaylistTrack PK_PlaylistTrack"
pg_restore: creating CONSTRAINT "public.Track PK_Track"
pg_restore: creating INDEX "public.IFK_AlbumArtistId"
pg_restore: creating INDEX "public.IFK_CustomerSupportRepId"
pg_restore: creating INDEX "public.IFK_EmployeeReportsTo"
pg_restore: creating INDEX "public.IFK_InvoiceCustomerId"
pg_restore: creating INDEX "public.IFK_InvoiceLineInvoiceId"
pg_restore: creating INDEX "public.IFK_InvoiceLineTrackId"
pg_restore: creating INDEX "public.IFK_PlaylistTrackTrackId"
pg_restore: creating INDEX "public.IFK_TrackAlbumId"
pg_restore: creating INDEX "public.IFK_TrackGenreId"
pg_restore: creating INDEX "public.IFK_TrackMediaTypeId"
pg_restore: creating FK CONSTRAINT "public.Album FK_AlbumArtistId"
pg_restore: creating FK CONSTRAINT "public.Customer FK_CustomerSupportRepId"
pg_restore: creating FK CONSTRAINT "public.Employee FK_EmployeeReportsTo"
pg_restore: creating FK CONSTRAINT "public.Invoice FK_InvoiceCustomerId"
pg_restore: creating FK CONSTRAINT "public.InvoiceLine FK_InvoiceLineInvoiceId"
pg_restore: creating FK CONSTRAINT "public.InvoiceLine FK_InvoiceLineTrackId"
pg_restore: creating FK CONSTRAINT "public.PlaylistTrack FK_PlaylistTrackPlaylistId"
pg_restore: creating FK CONSTRAINT "public.PlaylistTrack FK_PlaylistTrackTrackId"
pg_restore: creating FK CONSTRAINT "public.Track FK_TrackAlbumId"
pg_restore: creating FK CONSTRAINT "public.Track FK_TrackGenreId"
pg_restore: creating FK CONSTRAINT "public.Track FK_TrackMediaTypeId"
```

</CodeBlock>

## Data import notes

When importing a database, be aware of the following:

- If you import a database from an archive using `pg_dump` that is not in plain-text format, you must use the `pg_restore` utility instead of `psql` to restore the database. The `psql` utility only supports plain SQL dumps.
- Currently, Neon only supports database creation via the Neon Console, so you cannot use `pg_dumpall` or `pg_dump` with the `-C` option.
- Because `pg_dump` dumps a single database, it does not include information about roles stored in the global `pg_authid` catalog. Also, Neon does not support creating roles using `psql`. You can only create roles using the Neon Console. If you do not create roles in Neon before importing a database that has roles, you will receive "role does not exist" errors during the import operation. You can ignore these errors if they occur. They do not prevent data from being imported.
- Some PostgreSQL features that require access to the local file system are not supported by Neon. For example, tablespaces and large objects are not supported. Please take this into account when importing a database into to Neon. When importing from a plain-text `.sql` script, you can specify the `--no-tablespaces` option to exclude commands that select tablespaces. The `--no-tablespaces` option is ignored when creating an archive (non-text) output file using `pg_dump`. For custom-format archive files, you can specify the `--no-tablespaces` option when you call `pg_restore`. To exclude large objects from your dump, use the `--no-blobs` option with `pg_dump`.
- You can import individual tables from a custom-format database dump using the `-t <table_name>` option with `pg_restore`. Individual tables can also be imported from a CSV file. See [Import from CSV](/docs/import/import-from-csv).

For information about the commands referred to in this topic, refer to the following topics in the PostgreSQL documentation:

- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [psql](https://www.postgresql.org/docs/current/app-psql.html)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).

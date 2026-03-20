---
title: Recreating S3 in Postgres using PostgREST
description: Serve arbitrary binary files directly from your database
excerpt: >-
  Storing files directly in a database is generally discouraged in favour of
  dedicated object storage like S3 or Azure Blob, which is the more scalable and
  cost-effective approach. However, in practice, you might sometimes find
  yourself putting binary data in a relational database...
date: '2025-05-27T19:18:37'
updatedOn: '2025-07-14T17:08:47'
category: postgres
categories:
  - postgres
authors:
  - sam-harrison
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/recreating-s3-in-postgres-using-postgrest/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Recreating S3 in Postgres using PostgREST - Neon
  description: >-
    PostgREST turns Postgres into a webserver. We’ll explore its capabilities by
    building a simple file server directly within Postgres.
  keywords: []
  noindex: false
  ogTitle: Recreating S3 in Postgres using PostgREST - Neon
  ogDescription: >-
    PostgREST turns Postgres into a webserver. We’ll explore its capabilities by
    building a simple file server directly within Postgres.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/recreating-s3-in-postgres-using-postgrest/social.jpg
source:
  wpId: 9779
  wpSlug: recreating-s3-in-postgres-using-postgrest
  exportedAt: '2026-03-20T13:31:00.745Z'
---

Storing files directly in a database is generally discouraged in favour of dedicated object storage like S3 or Azure Blob, which is the more scalable and cost-effective approach. However, in practice, you might sometimes find yourself putting binary data in a relational database anyway. Here, we’ll explore [PostgREST](https://docs.postgrest.org/en/v13/) by building a simple file server directly within Postgres as it provides a practical context for implementing core features like functions as RPC, RLS, and database roles.

## What is PostgREST?

PostgREST turns Postgres into a webserver, exposing API endpoints for CRUD operations based on constraints and permissions in the database. The PostgREST philosophy focuses on making the database the single source of truth which can help avoid common pitfalls in API development like duplicating or ignoring database structures, leaky ORM abstractions, and managing permissions in API controllers instead of directly within the database.

We’ll be accessing PostgREST using the new [Neon Data API](https://neon.tech/docs/data-api/get-started), available for members of the Early Access Program. If you’re interested in trying features right as they come out, [join here](https://neon.tech/docs/introduction/early-access)!

## Setting up the Database

First, start by provisioning a new Postgres instance by creating a fresh project in the Neon console. The Neon Data API is an opt-in feature at the branch level, so head over to the branches tab to activate it. When you do, you’ll be given a URL through which you can access the PostgREST generated API endpoints.

![Image](https://cdn.neonapi.io/public/images/pages/blog/recreating-s3-in-postgres-using-postgrest/ad4nxfzrzcm9aum3bv2g7zdvlakrsugvauowoxcctgsfipzhwdwhdlhbto2mp8mmfpdp2gpquu1oqowvojiad00-h-rwnjkhr0nnzpbv79no3v-ysb50y8lvsdpygfwqqlx7mosjxma-b77777bc.gif)

Next, head to the SQL editor tab and add the [pgcrypto](https://neon.tech/docs/extensions/pgcrypto) extension for hashing files, and the blobs table we’ll be using to store all our binary data and its metadata.

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE blobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bucket_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    data BYTEA NOT NULL,
    size BIGINT GENERATED ALWAYS AS (octet_length(data)) STORED,
    content_type TEXT GENERATED ALWAYS AS (
        CASE WHEN file_name ~ '\.jpg$' THEN 'image/jpeg'
             WHEN file_name ~ '\.png$' THEN 'image/png'
             WHEN file_name ~ '\.pdf$' THEN 'application/pdf'
             ELSE 'application/octet-stream'
        END
    ) STORED,
    hash TEXT GENERATED ALWAYS AS (encode(digest(data, 'sha256'), 'hex')) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    UNIQUE(bucket_path, file_name)
);
```

For the sake of this blog, we’ll only support a tiny subset of [common MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types) and classify them based on the file extension.

Since we’ll be querying by `bucket_path` and `file_name`, let’s add an index too.

```sql
CREATE INDEX idx_blobs_bucket_file ON blobs (bucket_path, file_name);
```

Finally, we’ll populate the database with some mock data to play around with using a simple Python script. Here I added a PNG, JPG, and PDF.

```python
import psycopg
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

CONN_STR = os.getenv('DATABASE_URL')

def upload_file(file: str, bucket_path: str):
    with open(file, 'rb') as f:
        file_data = f.read()
    sql = """
        INSERT INTO blobs (bucket_path, file_name, data)
        VALUES (%s, %s, %s)
        RETURNING id, hash, size, content_type
    """

    with psycopg.connect(CONN_STR) as conn:
        with conn.cursor() as cur:
            _ = cur.execute(
                sql,
                [bucket_path, file, file_data]
            ).fetchone()

upload_file("databricks_neon.png", "photos/test")
upload_file("neon_light.jpg", "photos/test")
upload_file("neon.pdf", "documents")
```

## Serving files

Now, to actually serve the file we can use PostgREST’s functions as RPC. We’ll support 2 operations, `get_file()` and `get_metadata()`.

First, we need to create a special Postgres domain which tells PostgREST that the function we’re creating can return any kind of media, or a wildcard MIME type.

```sql
CREATE DOMAIN "*/*" AS BYTEA;
```

If we knew, for example, that we would only ever be dealing with PNG’s, we could create the following domain instead and use that as the return type of the function.

```sql
CREATE DOMAIN "image/png" AS BYTEA;
```

Next, we’ll create the `get_file()` function, which takes the `bucket_path` and `file_name` as parameters and returns data using the newly created generic media domain. Note, the parameters are prefixed with p\_ to avoid name collisions with the blobs table columns. Inside the function, we retrieve the file record matching the bucket path and file name from the blobs table. If the file is found, the function creates the HTTP header with the MIME type, file disposition, and cache control settings, and returns. If the file isn’t found, an explicit exception is raised instead.

```sql
CREATE OR REPLACE FUNCTION get_file(
    p_bucket_path TEXT,
    p_file_name TEXT
)
RETURNS "*/*" AS $$
DECLARE
    headers TEXT;
    blob_data BYTEA;
    file_record RECORD;
BEGIN
    SELECT b.*
    INTO file_record
    FROM blobs b
    WHERE b.bucket_path = p_bucket_path
    AND b.file_name = p_file_name;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'File not found'
        USING ERRCODE = 'PT404',
              DETAIL = 'File not found',
              HINT = format('File %s not found in bucket %s', p_file_name, p_bucket_path);
    END IF;

    headers := format(
        '[{"Content-Type": "%s"},'
        '{"Content-Disposition": "inline; filename=\"%s\""},'
        '{"Cache-Control": "max-age=259200"}]',
        file_record.content_type,
        file_record.file_name
    );

    PERFORM set_config('response.headers', headers, true);
    RETURN file_record.data;
END;
$$ LANGUAGE plpgsql;
```

Since `get_file()` doesn’t modify the database, it can run under the GET method, meaning we can now see these files directly from our browser. For example, opening the following URL shows the beautiful Neon logo served directly from the database! Note that if the response tells you that it’s missing something in the schema, you might need to force a reload using `NOTIFY pgrst, 'reload schema;` in the SQL editor.

```sql
`<project_url>/rpc/get_file?p_bucket_path=photos/test&p_file_name=neon_light.jpg`
```

![Image](https://cdn.neonapi.io/public/images/pages/blog/recreating-s3-in-postgres-using-postgrest/ad4nxduqpspyeivynktvoiz4jwctzge3polp2pernwtol5i3j0ybocegltnooir33cu6pqb2tkknsjbqedt3dzxnpygibe1g9g44tw9da7pdjvnl9ox7bp4qcr5gzd4icfu1twsnowea-5847efb7.png)

PDFs also work as you’d expect right out of the box:

```bash
`<project_url>/rpc/get_file?p_bucket_path=documents&p_file_name=neon.pdf`
```

![Image](https://cdn.neonapi.io/public/images/pages/blog/recreating-s3-in-postgres-using-postgrest/ad4nxcgioyx0hmlgkfo9hm2swjw5xtry2p0vgxqrrtkl7urvofjcm6eg7ka5naafmckw7wt77kodrzdoftxofug0up4ajd1ehkfebsqy6uwzil4ihw2qbxkkvgwvsmq0f2ftmu-lqxw-403a5888.png)

Another important part of an object store is metadata retrieval, so let’s implement the `get_metadata()` function which fetches metadata such as file size, type, hash, creation date, and any custom metadata.

```sql

CREATE OR REPLACE FUNCTION get_metadata(
    p_bucket_path TEXT,
    p_file_name TEXT
)
RETURNS TABLE (
    id UUID,
    bucket_path TEXT,
    file_name TEXT,
    size BIGINT,
    content_type TEXT,
    hash TEXT,
    created_at TIMESTAMP,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id,
        b.bucket_path,
        b.file_name,
        b.size,
        b.content_type,
        b.hash,
        b.created_at,
        b.metadata
    FROM blobs b
    WHERE b.bucket_path = p_bucket_path
    AND b.file_name = p_file_name;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'File not found'
        USING ERRCODE = 'PT404',
              DETAIL = 'File not found',
              HINT = format('File %s not found in bucket %s', p_file_name, p_bucket_path);
    END IF;
END;
$$ LANGUAGE plpgsql;
```

Now, if we head back to the browser and change the `get_file()` call to a `get_metadata()` call, we get the following.

```json
[object Object]
```

## Permissions and RLS

Right now, all the files in our database are publicly accessible, which might not always be desirable. So, let’s add some auth using Neon Auth, an `is_public` column, and some row-level security policies based on the new fields and roles for more granular access control. First, let’s add the new fields and enable RLS.

```sql
ALTER TABLE blobs ADD COLUMN is_public BOOLEAN DEFAULT true;
ALTER TABLE blobs ADD COLUMN user_id TEXT DEFAULT NULL;
ALTER TABLE blobs ENABLE ROW LEVEL SECURITY;
```

With RLS activated, let’s now define who can see what.<br /><br />If a user is anonymous, or unauthenticated, then they can only see the file if its `is_public` flag is set to true.

```sql
CREATE POLICY "Anonymous users can see public blobs"
    ON blobs
    FOR SELECT
    TO anonymous
    USING (is_public = true);
```

Authenticated users can see blobs if they are public, or if they are the owners.

```sql
CREATE POLICY "Authenticated users can see public or their own blobs"
    ON blobs
    FOR SELECT
    TO authenticated
    USING (is_public = true OR user_id = auth.user_id());
```

The rest of the CRUD operations are only available to authenticated users if the blob belongs to them.

```sql

CREATE POLICY "Authenticated users can insert their own blobs"
    ON blobs
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Authenticated users can update their own blobs"
    ON blobs
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.user_id())
    WITH CHECK (user_id = auth.user_id());

CREATE POLICY "Authenticated users can delete their own blobs"
    ON blobs
    FOR DELETE
    TO authenticated
    USING (user_id = auth.user_id());
```

Since the new column defaulted all is_public values to true, nothing has changed and we can still access all the files as before. However, if you now update any file in your Neon console to set is_public to false, unauthenticated users will no longer see that file. Attempting to access it as an anonymous user, like in a browser bar, will result in a response like this:

```json
[object Object]
```

To view files marked as non-public, we need to provide a valid JWT containing the key-value pairs “role”: `"authenticated"` and `"sub": "<user-id>"`, where the user id matches that attached to the blob. Under normal circumstances, this JWT would be managed in your frontend by Neon / Stack Auth, or another identity provider. In this case, however, I extracted the JWT manually from the browser cookies of a fake user I created in the Neon console auth tab for demonstration purposes. Making a request to the API as a properly authenticated user, we can now see the previously inaccessible file and metadata.

![Image](https://cdn.neonapi.io/public/images/pages/blog/recreating-s3-in-postgres-using-postgrest/ad4nxedhv7bwlilb3nw98pll9nkxlq67oze4enbucatw8mcrqep0q-ihobffndth5wc75mn7welfyxp4tqppkibppksan1ia7ipeneem51wtikumtsbkilbkuucz18zwm2vondxxh2a-ec1e0fd0.png)

By default, all the tables you create will have SELECT permissions granted for anonymous users, so properly setting up RLS policies is **very** important when using the Neon Data API. If you want to see which policies you’ve set up, you can query your database for them, and filter by table name.

```sql
SELECT * FROM pg_policies
WHERE tablename = 'blobs';
```

## Conclusion

Using Neon and PostgREST, you can quickly set up a simple object store to serve files and metadata without additional services. While you probably won’t ever use Postgres and PostgREST as a mock S3, the ideas discussed in this blog can naturally extend to many API scenarios you will encounter.

---

[Neon](https://neon.tech/home) _is a serverless Postgres platform with instant provisioning, branching, and autoscaling._ [Get started on our free plan](https://console.neon.tech/signup) _and spin up a fully configured Postgres instance in seconds._

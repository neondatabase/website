---
title: File storage with Backblaze B2
subtitle: Store files via Backblaze B2 and track metadata in Neon
enableTableOfContents: true
updatedOn: '2025-05-30T16:54:40.459Z'
---

[Backblaze B2 Cloud Storage](https://www.backblaze.com/cloud-storage) is an S3-compatible object storage service known for its affordability and ease of use. It's suitable for storing large amounts of unstructured data like backups, archives, images, videos, and application assets.

This guide demonstrates how to integrate Backblaze B2 with Neon by storing file metadata (like the file id, name and URL) in your Neon database, while using B2 for file storage.

## Prerequisites

<Steps>

## Create a Neon project

1.  Navigate to [pg.new](https://pg.new) to create a new Neon project.
2.  Copy the connection string by clicking the **Connect** button on your **Project Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Create a Backblaze account and B2 bucket

1.  Sign up for or log in to your [Backblaze account](https://www.backblaze.com/sign-up/cloud-storage?referrer=getstarted).
2.  Navigate to **B2 Cloud Storage** > **Buckets** in the left sidebar.
3.  Click **Create a Bucket**. Provide a globally unique bucket name (e.g., `my-neon-app-b2-files`), choose whether files should be **Private** or **Public**. For this guide, we'll use **Public** for simplicity, but **Private** is recommended for production applications where you want to control access to files.
    ![Create B2 Bucket](/docs/guides/backblaze-b2-create-bucket.png)
4.  **Create application key:**
    - Navigate to **B2 Cloud Storage** > **Application Keys** in the left sidebar.
    - Click **+ Add a New Application Key**.
    - Give the key a name (e.g., `neon-app-b2-key`).
    - **Crucially**, restrict the key's access: Select **Allow access to Bucket(s)** and choose the bucket you just created (e.g., `my-neon-app-b2-files`).
    - Select **Read and Write** for the **Type of Access**.
    - Leave other fields blank unless needed (e.g., File name prefix).
    - Click **Create New Key**.
    - Copy the **Key ID** and **Application Key**. These will be used in your application to authenticate with B2.
      ![Create B2 Application Key](/docs/guides/backblaze-b2-create-app-key.png)
5.  **Find S3 endpoint:**
    - Navigate back to **B2 Cloud Storage** > **Buckets**.
    - Find your bucket and note the **Endpoint** URL listed (e.g., `s3.us-west-000.backblazeb2.com`). You'll need this S3-compatible endpoint for the SDK configuration.
      ![B2 Bucket Endpoint](/docs/guides/backblaze-b2-bucket-endpoint.png)

## Configure CORS for client-side uploads

If your application involves uploading files **directly from a web browser** using the generated presigned URLs, you must configure Cross-Origin Resource Sharing (CORS) rules for your B2 bucket. CORS rules tell B2 which web domains are allowed to make requests (like `PUT` requests for uploads) to your bucket. Without proper CORS rules, browser security restrictions will block these direct uploads.

Follow Backblaze's guide to [Cross-Origin Resource Sharing Rules](https://www.backblaze.com/docs/cloud-storage-cross-origin-resource-sharing-rules). You configure CORS rules in the B2 Bucket Settings page in the Backblaze web UI.

Here’s an example CORS configuration allowing `http://localhost:3000` to view and upload files:
![Example CORS configuration](/docs/guides/backblaze-b2-cors-example.png)

> In a production environment, replace `http://localhost:3000` with your actual domain

## Create a table in Neon for file metadata

We need a table in Neon to store metadata about the objects uploaded to B2.

1.  Connect to your Neon database using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or a client like [psql](/docs/connect/query-with-psql-editor). Create a table including the B2 file name (object key), file URL, user ID, and timestamp:

    ```sql
    CREATE TABLE IF NOT EXISTS b2_files (
        id SERIAL PRIMARY KEY,
        object_key TEXT NOT NULL UNIQUE, -- Key (path/filename) in B2
        file_url TEXT,                   -- Base public URL
        user_id TEXT NOT NULL,           -- User associated with the file
        upload_timestamp TIMESTAMPTZ DEFAULT NOW()
    );
    ```

    > Storing the full public `file_url` is only useful if the bucket is public. For private buckets, you'll typically only store the `object_key` and generate presigned download URLs on demand.

2.  Run the SQL statement. Add other relevant columns as needed (e.g., `content_type`, `size` if needed).

<Admonition type="note" title="Securing metadata with RLS">
If you use [Neon's Row Level Security (RLS)](/blog/introducing-neon-authorize), remember to apply appropriate access policies to the `b2_files` table. This controls who can view or modify the object references stored in Neon based on your RLS rules.

Note that these policies apply _only_ to the metadata in Neon. Access control for the objects within the B2 bucket itself is managed via B2 bucket settings (public/private), Application Key permissions, and presigned URL settings.
</Admonition>

## Upload files to B2 and store metadata in Neon

Leveraging B2's S3 compatibility, the recommended pattern for client-side uploads involves **presigned upload URLs**. Your backend generates a temporary URL that the client uses to upload the file directly to B2. Afterwards, your backend saves the file's metadata to Neon.

This requires two backend endpoints:

1.  `/presign-b2-upload`: Generates the temporary presigned URL.
2.  `/save-b2-metadata`: Records the metadata in Neon after the client confirms successful upload.

<Tabs labels={["JavaScript", "Python"]}>

<TabItem>

We'll use [Hono](https://hono.dev/) for the server, [`@aws-sdk/client-s3`](https://www.npmjs.com/package/@aws-sdk/client-s3) and [`@aws-sdk/s3-request-presigner`](https://www.npmjs.com/package/@aws-sdk/s3-request-presigner) for B2 interaction (due to S3 compatibility), and [`@neondatabase/serverless`](https://www.npmjs.com/package/@neondatabase/serverless) for Neon.

First, install the necessary dependencies:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @neondatabase/serverless @hono/node-server hono dotenv
```

Create a `.env` file:

```env
# Backblaze B2 Credentials & Config
B2_APPLICATION_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_application_key
B2_BUCKET_NAME=your_b2_bucket_name
B2_ENDPOINT_URL=https://your_b2_s3_endpoint

# Neon Connection String
DATABASE_URL=your_neon_database_connection_string
```

The following code snippet demonstrates this workflow:

```javascript
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { randomUUID } from 'crypto';

const B2_BUCKET = process.env.B2_BUCKET_NAME;
const B2_ENDPOINT = process.env.B2_ENDPOINT_URL;
const endpointUrl = new URL(B2_ENDPOINT);
const region = endpointUrl.hostname.split('.')[1];

const s3 = new S3Client({
  endpoint: B2_ENDPOINT,
  region: region,
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});
const sql = neon(process.env.DATABASE_URL);
const app = new Hono();

// Replace this with your actual user authentication logic, by validating JWTs/Headers, etc.
const authMiddleware = async (c, next) => {
  c.set('userId', 'user_123');
  await next();
};

// 1. Generate presigned URL for upload
app.post('/presign-b2-upload', authMiddleware, async (c) => {
  try {
    const { fileName, contentType } = await c.req.json();
    if (!fileName || !contentType) throw new Error('fileName and contentType required');

    const objectKey = `${randomUUID()}-${fileName}`;
    const publicFileUrl = `${B2_ENDPOINT}/${B2_BUCKET}/${objectKey}`;

    const command = new PutObjectCommand({
      Bucket: B2_BUCKET,
      Key: objectKey,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min expiry

    return c.json({ success: true, presignedUrl, objectKey, publicFileUrl });
  } catch (error) {
    console.error('Presign Error:', error.message);
    return c.json({ success: false, error: 'Failed to prepare upload' }, 500);
  }
});

// 2. Save metadata after client upload confirmation
app.post('/save-b2-metadata', authMiddleware, async (c) => {
  try {
    const { objectKey, publicFileUrl } = await c.req.json();
    const userId = c.get('userId');
    if (!objectKey) throw new Error('objectKey required');

    await sql`
      INSERT INTO b2_files (object_key, file_url, user_id)
      VALUES (${objectKey}, ${publicFileUrl}, ${userId})
    `;
    console.log(`Metadata saved for B2 object: ${objectKey}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Metadata Save Error:', error.message);
    return c.json({ success: false, error: 'Failed to save metadata' }, 500);
  }
});

const port = 3000;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running at http://localhost:${info.port}`);
});
```

**Explanation**

1.  **Setup:** Initializes Neon (`sql`), Hono (`app`), and the AWS S3 client (`s3`) configured with the B2 endpoint, region (extracted from endpoint), and B2 Application Key credentials.
2.  **Authentication:** A placeholder `authMiddleware` is included. **Replace this with real authentication logic.** It currently just sets a static `userId` for demonstration.
3.  **Upload endpoints:**
    - **`/presign-b2-upload`:** Generates a temporary secure URL (`presignedUrl`) using `@aws-sdk/s3-request-presigner` that allows uploading a file directly to B2. It returns the URL, the generated `objectKey`, and the standard S3 public URL.
    - **`/save-b2-metadata`:** Called by the client after successful upload. Saves the `objectKey`, `file_url`, and `userId` into the `b2_files` table in Neon using `@neondatabase/serverless`.

</TabItem>

<TabItem>

We'll use [Flask](https://flask.palletsprojects.com/en/stable/), [`boto3`](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) (AWS SDK for Python, leveraging S3 compatibility), and [`psycopg2`](https://pypi.org/project/psycopg2/).

First, install the necessary dependencies:

```bash
pip install Flask boto3 psycopg2-binary python-dotenv
```

Create a `.env` file:

```env
# Backblaze B2 Credentials & Config
B2_APPLICATION_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_application_key
B2_BUCKET_NAME=your_b2_bucket_name
B2_ENDPOINT_URL=https://your_b2_s3_endpoint

# Neon Connection String
DATABASE_URL=your_neon_database_connection_string
```

The following code snippet demonstrates this workflow:

```python
import os
import uuid
import boto3
import psycopg2
from dotenv import load_dotenv
from urllib.parse import urlparse
from flask import Flask, jsonify, request
from botocore.exceptions import ClientError

load_dotenv()

B2_BUCKET_NAME = os.getenv("B2_BUCKET_NAME")
B2_ENDPOINT_URL = os.getenv("B2_ENDPOINT_URL")
parsed_endpoint = urlparse(B2_ENDPOINT_URL)
region_name = parsed_endpoint.hostname.split(".")[1]
s3_client = boto3.client(
    service_name="s3",
    endpoint_url=B2_ENDPOINT_URL,
    aws_access_key_id=os.getenv("B2_APPLICATION_KEY_ID"),
    aws_secret_access_key=os.getenv("B2_APPLICATION_KEY"),
    region_name=region_name
)

app = Flask(__name__)

# Use a global PostgreSQL connection instead of creating a new one for each request in production
def get_db_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

# Replace this with your actual user authentication logic
def get_authenticated_user_id(request):
    # Example: Validate Authorization header, session cookie, etc.
    return "user_123"  # Static ID for demonstration

# 1. Generate presigned URL for upload
@app.route("/presign-b2-upload", methods=["POST"])
def presign_b2_upload_route():
    try:
        user_id = get_authenticated_user_id(request)
        data = request.get_json()
        file_name = data.get("fileName")
        content_type = data.get("contentType")
        if not file_name or not content_type:
            raise ValueError("fileName and contentType required in JSON body")

        object_key = f"{uuid.uuid4()}-{file_name}"
        public_file_url = f"{B2_ENDPOINT_URL}/{B2_BUCKET_NAME}/{object_key}"

        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": B2_BUCKET_NAME,
                "Key": object_key,
                "ContentType": content_type
            },
            ExpiresIn=300,  # 5 minutes expiry
        )
        return jsonify(
            {
                "success": True,
                "presignedUrl": presigned_url,
                "objectKey": object_key,
                "publicFileUrl": public_file_url,
            }
        ), 200

    except (ClientError, ValueError) as e:
        print(f"Presign Error: {e}")
        return jsonify(
            {"success": False, "error": f"Failed to prepare upload: {e}"}
        ), 500
    except Exception as e:
        print(f"Unexpected Presign Error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500


# 2. Save metadata after client upload confirmation
@app.route("/save-b2-metadata", methods=["POST"])
def save_b2_metadata_route():
    conn = None
    cursor = None
    try:
        user_id = get_authenticated_user_id(request)
        data = request.get_json()
        object_key = data.get("objectKey")
        public_file_url = data.get("publicFileUrl")
        if not object_key or not public_file_url:
            raise ValueError("objectKey and publicFileUrl required in JSON body")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """ INSERT INTO b2_files (object_key, file_url, user_id) VALUES (%s, %s, %s) """,
            (object_key, public_file_url, user_id),
        )
        conn.commit()
        print(f"Metadata saved for B2 object: {object_key}")
        return jsonify({"success": True}), 201
    except (psycopg2.Error, ValueError) as e:
        print(f"Metadata Save Error: {e}")
        return jsonify(
            {"success": False, "error": "Failed to save metadata"}
        ), 500
    except Exception as e:
        print(f"Unexpected Metadata Save Error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port, debug=True)
```

**Explanation**

1.  **Setup:** Initializes Flask, `boto3` S3 client configured for B2 (endpoint, region, credentials), and `psycopg2`.
2.  **Authentication:** Placeholder `get_authenticated_user_id` needs replacing.
3.  **Upload endpoints:**
    - **`/presign-b2-upload`:** Generates `object_key` and optional `public_file_url`. Uses `boto3`'s `generate_presigned_url` for `'put_object'` to get a temporary upload URL.
    - **`/save-b2-metadata`:** Called after client upload. Saves `object_key`, `public_file_url` (can be `None`), and `userId` to the `b2_files` table. Includes basic error handling for duplicates.
4.  In production, use a global PostgreSQL connection pool.

</TabItem>

</Tabs>

## Testing the upload workflow

Testing the presigned URL flow involves multiple steps:

1.  **Get presigned URL:** Send a `POST` request to your `/presign-b2-upload` endpoint with a JSON body containing `fileName` and `contentType`.
    **Using cURL:**

    ```bash
    curl -X POST http://localhost:3000/presign-b2-upload \
         -H "Content-Type: application/json" \
         -d '{"fileName": "test-b2.png", "contentType": "image/png"}'
    ```

    You should receive a JSON response with a `presignedUrl`, `objectKey`, and `publicFileUrl`:

    ```json
    {
      "success": true,
      "presignedUrl": "https://s3.<REGION>.backblazeb2.com/<BUCKET>/<OBJECT_KEY>?...",
      "objectKey": "<OBJECT_KEY>",
      "publicFileUrl": "https://s3.<REGION>.backblazeb2.com/<BUCKET>/<OBJECT_KEY>"
    }
    ```

    Note the `presignedUrl`, `objectKey`, and `publicFileUrl` from the response. You will use these in the next steps

2.  **Upload file to B2:** Use the received `presignedUrl` to upload the actual file using an HTTP `PUT` request. The `Content-Type` header must match the one used to generate the URL.
    **Using cURL:**

    ```bash
    curl -X PUT "<PRESIGNED_URL>" \
         --upload-file /path/to/your/test-b2.png \
         -H "Content-Type: image/png"
    ```

    Replace `<PRESIGNED_URL>` with the actual URL from step 1. A successful upload typically returns HTTP `200 OK`.

3.  **Save metadata:** Send a `POST` request to your `/save-b2-metadata` endpoint with the `objectKey` and optionally `publicFileUrl` from step 1.
    **Using cURL:**

    ```bash
    curl -X POST http://localhost:3000/save-b2-metadata \
         -H "Content-Type: application/json" \
         -d '{"objectKey": "<OBJECT_KEY>", "publicFileUrl": "<PUBLIC_URL>"}'
    ```

    You should receive a JSON response indicating success:

    ```json
    { "success": true }
    ```

**Expected outcome:**

- The file appears in your B2 bucket (check the Backblaze B2 web UI).
- A new row appears in your `b2_files` table in Neon.

## Accessing file metadata and files

Storing metadata in Neon allows your application to easily retrieve references to the files hosted on B2.

Query the `b2_files` table from your application's backend when needed.

**Example SQL query:**

Retrieve files for user 'user_123':

```sql
SELECT
    id,
    object_key,     -- Key (path/filename) in B2
    file_url,       -- Base public URL (only useful if bucket is Public)
    user_id,        -- User associated with the file
    upload_timestamp
FROM
    b2_files
WHERE
    user_id = 'user_123'; -- Use actual authenticated user ID
```

**Using the data:**

- The query returns metadata stored in Neon.
- **Accessing the file:**

  - If your bucket is **Public**, you can use the `file_url` directly in your application (e.g., `<img>` tags, download links).
  - If your bucket is **Private**, the stored `file_url` is likely irrelevant. You **must** generate a **presigned download URL** (a GET URL) on demand using your backend. This involves a similar process to generating the upload URL but using `GetObjectCommand` (JS) or `generate_presigned_url('get_object', ...)` (Python) with read permissions. This provides secure, temporary read access.

This pattern effectively separates file storage and delivery concerns (handled by Backblaze B2) from structured metadata management (handled by Neon), leveraging the strengths of both services.

</Steps>

## Resources

- [Backblaze B2 Cloud Storage documentation](https://www.backblaze.com/docs/cloud-storage-developer-quick-start-guide)
- [Backblaze B2 S3 Compatible API](https://www.backblaze.com/docs/cloud-storage-s3-compatible-api)
- [Backblaze B2 Application Keys](https://www.backblaze.com/docs/cloud-storage-application-keys)
- [Neon documentation](/docs/introduction)
- [Neon RLS](/docs/guides/neon-rls)

<NeedHelp/>

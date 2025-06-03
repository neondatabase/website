---
title: File storage with Cloudflare R2
subtitle: Store files via Cloudflare R2 and track metadata in Neon
enableTableOfContents: true
updatedOn: '2025-05-30T16:54:40.460Z'
---

[Cloudflare R2](https://www.cloudflare.com/en-in/developer-platform/products/r2/) is S3-compatible object storage offering zero egress fees, designed for storing and serving large amounts of unstructured data like images, videos, and documents globally.

This guide demonstrates how to integrate Cloudflare R2 with Neon by storing file metadata in your Neon database, while using R2 for file storage.

## Setup steps

<Steps>

## Create a Neon project

1.  Navigate to [pg.new](https://pg.new) to create a new Neon project.
2.  Copy the connection string by clicking the **Connect** button on your **Project Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Create a Cloudflare account and R2 bucket

1.  Sign up for or log in to your [Cloudflare account](https://dash.cloudflare.com/sign-up/r2).
2.  Navigate to **R2** in the Cloudflare dashboard sidebar.
3.  Click **Create bucket**, provide a unique bucket name (e.g., `my-neon-app-files`), and click **Create bucket**.
    ![Create R2 Bucket](/docs/guides/cloudflare-r2-create-bucket.png)
4.  Generate R2 API credentials (**Access Key ID** and **Secret Access Key**) by following [Create an R2 API Token](https://developers.cloudflare.com/r2/api/tokens/). Select **Object Read & Write** permissions. Copy these credentials securely.
5.  Obtain your Cloudflare **Account ID** by following [Find your Account ID](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/#find-your-account-id).
6.  For this example, enable public access to your bucket URL by following [Allow public access to your bucket](https://developers.cloudflare.com/r2/buckets/public-buckets/#enable-managed-public-access). Note your bucket's public URL (e.g., `https://pub-xxxxxxxx.r2.dev`).

    <Admonition type="note" title="Public access">
    Public access makes all objects readable via URL; consider private buckets and signed URLs for sensitive data in production.
    </Admonition>

## Configure CORS for client-side uploads

If your application involves uploading files **directly from a web browser** using the generated presigned URLs, you must configure Cross-Origin Resource Sharing (CORS) on your R2 bucket. CORS rules tell R2 which web domains are allowed to make requests (like `PUT` requests for uploads) to your bucket. Without proper CORS rules, browser security restrictions will block these direct uploads.

Follow Cloudflare's guide to [Configure CORS](https://developers.cloudflare.com/r2/buckets/cors/) for your bucket. You can add rules via R2 Bucket settings in the Cloudflare dashboard.

Here’s an example CORS configuration allowing `PUT` uploads and `GET` requests from your deployed frontend application and your local development environment:

```json
[
  {
    "AllowedOrigins": [
      "https://your-production-app.com", // Replace with your actual frontend domain
      "http://localhost:3000" // For local development
    ],
    "AllowedMethods": ["PUT", "GET"]
  }
]
```

## Create a table in Neon for file metadata

We need a table in Neon to store metadata about the objects uploaded to R2.

1.  Connect to your Neon database using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or a client like [psql](/docs/connect/query-with-psql-editor). Here is an example SQL statement to create a simple table including the object key, URL, user ID, and timestamp:

    ```sql
    CREATE TABLE IF NOT EXISTS r2_files (
        id SERIAL PRIMARY KEY,
        object_key TEXT NOT NULL UNIQUE, -- Key (path/filename) in R2
        file_url TEXT NOT NULL,          -- Publicly accessible URL
        user_id TEXT NOT NULL,           -- User associated with the file
        upload_timestamp TIMESTAMPTZ DEFAULT NOW()
    );
    ```

2.  Run the SQL statement. You can add other relevant columns (file size, content type, etc.) depending on your application needs.

<Admonition type="note" title="Securing metadata with RLS">
If you use [Neon's Row Level Security (RLS)](/blog/introducing-neon-authorize), remember to apply appropriate access policies to the `r2_files` table. This controls who can view or modify the object references stored in Neon based on your RLS rules.

Note that these policies apply _only_ to the metadata in Neon. Access control for the objects within the R2 bucket itself is managed via R2 permissions, API tokens, and presigned URL settings if used.
</Admonition>

## Upload files to R2 and store metadata in Neon

A common pattern with S3-compatible storage like R2 involves **presigned upload URLs**. Your backend generates a temporary, secure URL that the client uses to upload the file directly to R2. Afterwards, your backend saves the file's metadata to Neon.

This requires two backend endpoints:

1.  `/presign-upload`: Generates the temporary presigned URL for the client to upload a file directly to R2.
2.  `/save-metadata`: Records the metadata in Neon after the client confirms a successful upload to R2.

<Tabs labels={["JavaScript", "Python"]}>

<TabItem>

We'll use [Hono](https://hono.dev/) for the server, [`@aws-sdk/client-s3`](https://www.npmjs.com/package/@aws-sdk/client-s3) and [`@aws-sdk/s3-request-presigner`](https://www.npmjs.com/package/@aws-sdk/s3-request-presigner) for R2 interaction, and [`@neondatabase/serverless`](https://www.npmjs.com/package/@neondatabase/serverless) for Neon.

First, install the necessary dependencies:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @neondatabase/serverless @hono/node-server hono dotenv
```

Create a `.env` file:

```env
# R2 Credentials & Config
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_api_token_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_api_token_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name # my-neon-app-files if following the example
R2_PUBLIC_BASE_URL=https://your-bucket-public-url.r2.dev # Your R2 bucket public URL

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

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL; // Ensure no trailing '/'
const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const sql = neon(process.env.DATABASE_URL);
const app = new Hono();

// Replace this with your actual user authentication logic, by validating JWTs/Headers, etc.
const authMiddleware = async (c, next) => {
  c.set('userId', 'user_123'); // Example: Get user ID after validation
  await next();
};

// 1. Generate Presigned URL for Upload
app.post('/presign-upload', authMiddleware, async (c) => {
  try {
    const { fileName, contentType } = await c.req.json();
    if (!fileName || !contentType) throw new Error('fileName and contentType required');

    const objectKey = `${randomUUID()}-${fileName}`;
    const publicFileUrl = R2_PUBLIC_BASE_URL ? `${R2_PUBLIC_BASE_URL}/${objectKey}` : null;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: objectKey,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return c.json({ success: true, presignedUrl, objectKey, publicFileUrl });
  } catch (error) {
    console.error('Presign Error:', error.message);
    return c.json({ success: false, error: 'Failed to prepare upload' }, 500);
  }
});

// 2. Save Metadata after Client Upload Confirmation
app.post('/save-metadata', authMiddleware, async (c) => {
  try {
    const { objectKey, publicFileUrl } = await c.req.json();
    const userId = c.get('userId');
    if (!objectKey) throw new Error('objectKey required');

    const finalFileUrl =
      publicFileUrl ||
      (R2_PUBLIC_BASE_URL ? `${R2_PUBLIC_BASE_URL}/${objectKey}` : 'URL not available');

    await sql`
      INSERT INTO r2_files (object_key, file_url, user_id)
      VALUES (${objectKey}, ${finalFileUrl}, ${userId})
    `;
    console.log(`Metadata saved for R2 object: ${objectKey}`);
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

1.  **Setup:** Initializes the Neon database client (`sql`), the Hono web framework (`app`), and the AWS S3 client (`s3`) configured for R2 using environment variables.
2.  **Authentication:** A placeholder `authMiddleware` is included. **Crucially**, this needs to be replaced with real authentication logic. It currently just sets a static `userId` for demonstration.
3.  **Upload endpoints**:
    - **`/presign-upload`:** Generates a temporary secure URL (`presignedUrl`) that allows uploading a file with a specific `objectKey` and `contentType` directly to R2 using `@aws-sdk/client-s3`. It returns the URL, key, and public URL.
    - **`/save-metadata`:** Called by the client _after_ it successfully uploads the file to R2. It saves the `objectKey`, the final `file_url`, and the `userId` into the `r2_files` table in Neon using `@neondatabase/serverless`.

</TabItem>

<TabItem>

We'll use [Flask](https://flask.palletsprojects.com/en/stable/), [`boto3`](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) (AWS SDK for Python), and [`psycopg2`](https://pypi.org/project/psycopg2/).

First, install the necessary dependencies:

```bash
pip install Flask boto3 psycopg2-binary python-dotenv
```

Create a `.env` file:

```env
# R2 Credentials & Config
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_api_token_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_api_token_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name # my-neon-app-files if following the example
R2_PUBLIC_BASE_URL=https://your-bucket-public-url.r2.dev # Your R2 bucket public URL

# Neon Connection String
DATABASE_URL=your_neon_database_connection_string
```

The following code snippet demonstrates this workflow:

```python
import os
import uuid
import boto3
import psycopg2
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from flask import Flask, jsonify, request

load_dotenv()

R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME")
R2_PUBLIC_BASE_URL = os.getenv("R2_PUBLIC_BASE_URL")
DATABASE_URL = os.getenv("DATABASE_URL")
R2_ENDPOINT_URL = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

s3_client = boto3.client(
    service_name='s3',
    endpoint_url=R2_ENDPOINT_URL,
    aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"),
    region_name='auto'
)
app = Flask(__name__)

# Use a global PostgreSQL connection instead of creating a new one for each request in production
def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

# Replace this with your actual user authentication logic
def get_authenticated_user_id(request):
    # Example: Validate Authorization header, session cookie, etc.
    return "user_123"  # Static ID for demonstration

# 1. Generate Presigned URL for Upload
@app.route("/presign-upload", methods=["POST"])
def presign_upload_route():
    try:
        user_id = get_authenticated_user_id(request)
        if not user_id:
            return jsonify({"success": False, "error": "Unauthorized"}), 401
        data = request.get_json()
        file_name = data.get('fileName')
        content_type = data.get('contentType')
        if not file_name or not content_type:
             raise ValueError("fileName and contentType required")

        object_key = f"{uuid.uuid4()}-{file_name}"
        public_file_url = f"{R2_PUBLIC_BASE_URL}/{object_key}" if R2_PUBLIC_BASE_URL else None

        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={'Bucket': R2_BUCKET_NAME, 'Key': object_key, 'ContentType': content_type},
            ExpiresIn=300
        )
        return jsonify({ "success": True, "presignedUrl": presigned_url, "objectKey": object_key, "publicFileUrl": public_file_url }), 200
    except (ClientError, ValueError) as e:
        print(f"Presign Error: {e}")
        return jsonify({"success": False, "error": f"Failed to prepare upload: {e}"}), 500
    except Exception as e:
        print(f"Unexpected Presign Error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500


# 2. Save Metadata after Client Upload Confirmation
@app.route("/save-metadata", methods=["POST"])
def save_metadata_route():
    conn = None
    cursor = None
    try:
        user_id = get_authenticated_user_id(request)
        data = request.get_json()
        object_key = data.get('objectKey')
        public_file_url = data.get('publicFileUrl')
        if not object_key: raise ValueError("objectKey required")

        final_file_url = public_file_url or (f"{R2_PUBLIC_BASE_URL}/{object_key}" if R2_PUBLIC_BASE_URL else 'URL not available')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """ INSERT INTO r2_files (object_key, file_url, user_id) VALUES (%s, %s, %s) """,
            (object_key, final_file_url, user_id),
        )
        conn.commit()
        print(f"Metadata saved for R2 object: {object_key}")
        return jsonify({"success": True}), 201
    except (psycopg2.Error, ValueError) as e:
        print(f"Metadata Save Error: {e}")
        return jsonify({"success": False, "error": "Failed to save metadata"}), 500
    except Exception as e:
        print(f"Unexpected Metadata Save Error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

if __name__ == "__main__":
    app.run(port=3000, debug=True)
```

**Explanation**

1.  **Setup:** Initializes the Flask web framework, the R2 client (`s3_client` using `boto3`), and the PostgreSQL client (`psycopg2`) using environment variables.
2.  **Authentication:** A placeholder `get_authenticated_user_id` function is included. **Replace this with real authentication logic.**
3.  **Upload endpoints**:
    - **`/presign-upload`:** Generates a temporary secure URL (`presignedUrl`) that allows uploading a file with a specific `objectKey` and `contentType` directly to R2 using `boto3`. It returns the URL, key, and public URL.
    - **`/save-metadata`:** Called by the client _after_ it successfully uploads the file to R2. It saves the `objectKey`, the final `file_url`, and the `userId` into the `r2_files` table in Neon using `psycopg2`.
4.  In production, you should use a global PostgreSQL connection instead of creating a new one for each request. This is important for performance and resource management.

</TabItem>

</Tabs>

## Testing the upload workflow

Testing the presigned URL flow involves multiple steps:

1.  **Get presigned URL:** Send a `POST` request to your `/presign-upload` endpoint with a JSON body containing `fileName` and `contentType`.

    ```bash
    curl -X POST http://localhost:3000/presign-upload \
         -H "Content-Type: application/json" \
         -d '{"fileName": "test-image.png", "contentType": "image/png"}'
    ```

    You should receive a JSON response with a `presignedUrl`, `objectKey`, and `publicFileUrl`:

    ```json
    {
      "success": true,
      "presignedUrl": "https://<ACCOUNT_ID>.r2.cloudflarestorage.com/<BUCKET_NAME>/<GENERATED_OBJECT_KEY>?X-Amz-Algorithm=...",
      "objectKey": "<GENERATED_OBJECT_KEY>",
      "publicFileUrl": "https://pub-<HASH>.r2.dev/<GENERATED_OBJECT_KEY>"
    }
    ```

    Note the `presignedUrl`, `objectKey`, and `publicFileUrl` from the response. You will use these in the next steps.

2.  **Upload file to R2:** Use the received `presignedUrl` to upload the actual file using an HTTP `PUT` request.

    ```bash
    curl -X PUT "<PRESIGNED_URL>" \
         --upload-file /path/to/your/test-image.png \
         -H "Content-Type: image/png"
    ```

    A successful upload typically returns HTTP `200 OK` with no body.

3.  **Save metadata:** Send a `POST` request to your `/save-metadata` endpoint with the `objectKey` and `publicFileUrl` obtained in step 1.

    ```bash
    curl -X POST http://localhost:3000/save-metadata \
         -H "Content-Type: application/json" \
         -d '{"objectKey": "<OBJECT_KEY>", "publicFileUrl": "<PUBLIC_URL>"}'
    ```

    You should receive a JSON response indicating success:

    ```json
    { "success": true }
    ```

**Expected outcome:**

- The file is uploaded to your R2 bucket. You can verify this in the Cloudflare dashboard or by accessing the `publicFileUrl` if your bucket is public.
- A new row appears in your `r2_files` table in Neon containing the `object_key` and `file_url`.

You can now integrate API calls to these endpoints from various parts of your application (e.g., web clients using JavaScript's `fetch` API, mobile apps, backend services) to handle file uploads.

## Accessing file metadata and files

Storing metadata in Neon allows your application to easily retrieve references to the files hosted on R2.

Query the `r2_files` table from your application's backend when needed.

**Example SQL query:**

Retrieve files for user 'user_123':

```sql
SELECT
    id,             -- Your database primary key
    object_key,     -- Key (path/filename) in the R2 bucket
    file_url,       -- Publicly accessible URL
    user_id,        -- User associated with the file
    upload_timestamp
FROM
    r2_files
WHERE
    user_id = 'user_123'; -- Use actual authenticated user ID
```

**Using the data:**

- The query returns rows containing the file metadata stored in Neon.
- The `file_url` column contains the direct link to access the file.
- Use this `file_url` in your application (e.g., `<img>` tags, API responses, download links) wherever you need to display or provide access to the file.

    <Admonition type="note" title="Private buckets">
    For private R2 buckets, store only the `object_key` and generate presigned *read* URLs on demand using a similar backend process.
    </Admonition>

This pattern separates file storage and delivery (handled by R2) from structured metadata management (handled by Neon).

</Steps>

## Resources

- [Cloudflare R2 documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- [Neon RLS](/docs/guides/neon-rls)

<NeedHelp/>

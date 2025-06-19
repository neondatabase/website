---
title: File storage with AWS S3
subtitle: Store files via AWS S3 and track metadata in Neon
enableTableOfContents: true
updatedOn: '2025-05-30T16:54:40.458Z'
---

[Amazon Simple Storage Service (AWS S3)](https://aws.amazon.com/s3/) is an object storage service widely used for storing and retrieving large amounts of data, such as images, videos, backups, and application assets.

This guide demonstrates how to integrate AWS S3 with Neon by storing file metadata (like the object key and URL) in your Neon database, while using S3 for file storage.

## Setup steps

<Steps>

## Create a Neon project

1.  Navigate to [pg.new](https://pg.new) to create a new Neon project.
2.  Copy the connection string by clicking the **Connect** button on your **Project Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Create an AWS account and S3 bucket

1.  Sign up for or log in to your [AWS Account](https://aws.amazon.com/).
2.  Navigate to the **S3** service in the AWS Management Console.
3.  Click **Create bucket**. Provide a unique bucket name (e.g., `my-neon-app-s3-uploads`), select an AWS Region (e.g., `us-east-1`), and configure initial settings.
    ![Create S3 Bucket](/docs/guides/aws-s3-create-bucket.png)
4.  **Public Access (for this example):** For simplicity in accessing uploaded files via URL in this guide, we'll configure the bucket to allow public read access _for objects uploaded with specific permissions_. Under **Block Public Access settings for this bucket**, _uncheck_ "Block all public access". Acknowledge the warning.
    ![Public Access Settings](/docs/guides/aws-s3-public-access.png)

    <Admonition type="note" title="Public buckets">
     Making buckets or objects publicly readable carries security risks. For production applications, it's strongly recommended to:
     1. Keep buckets **private** (Block all public access enabled).
     2. Use **presigned URLs** not only for uploads but also for *downloads* (temporary read access).
     This guide uses public access for simplicity, but you should implement secure access controls in production.
    </Admonition>

5.  After the bucket is created, navigate to the **Permissions** tab. Under **Bucket Policy**, you can set up a policy to allow public read access to objects. For example:

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::my-neon-app-s3-uploads/*"
        }
      ]
    }
    ```

    Replace `my-neon-app-s3-uploads` with your actual bucket name.

6.  **Create IAM user for programmatic access:**
    - Navigate to the **IAM** service in the AWS Console.
    - Go to **Users** and click **Add users**.
    - Enter a username (e.g., `neon-app-s3-user`). Select **Access key - Programmatic access** as the credential type. Click **Next: Permissions**.
    - Choose **Attach policies directly**. Search for and select `AmazonS3FullAccess`.
      ![Attach S3 Policy](/docs/guides/aws-s3-attach-policy.png)
    - Click **Next**, then **Create user**.
    - Click on **Create access key**.
      ![Create Access Key](/docs/guides/aws-s3-create-access-key.png)
    - Click **Other** > **Create access key**. Copy the **Access key ID** and **Secret access key**. These will be used in your application to authenticate with AWS S3.

## Configure CORS for client-side uploads

If your application involves uploading files **directly from a web browser** using the generated presigned URLs, you must configure Cross-Origin Resource Sharing (CORS) on your S3 bucket. CORS rules tell S3 which web domains are allowed to make requests (like `PUT` requests for uploads) to your bucket. Without proper CORS rules, browser security restrictions will block these direct uploads.

In your S3 bucket settings, navigate to the **Permissions** tab and find the **CORS configuration** section. Add the following CORS rules:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 9000
  }
]
```

> This configuration allows any origin (`*`) to perform `GET` and `PUT` requests. In a production environment, you should restrict `AllowedOrigins` to your application's domain(s) for security.

## Create a table in Neon for file metadata

We need a table in Neon to store metadata about the objects uploaded to S3.

1.  Connect to your Neon database using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or a client like [psql](/docs/connect/query-with-psql-editor). Create a table including the object key, URL, user ID, and timestamp:

    ```sql
    CREATE TABLE IF NOT EXISTS s3_files (
        id SERIAL PRIMARY KEY,
        object_key TEXT NOT NULL UNIQUE, -- Key (path/filename) in S3
        file_url TEXT NOT NULL,          -- Publicly accessible URL (if object is public)
        user_id TEXT NOT NULL,           -- User associated with the file
        upload_timestamp TIMESTAMPTZ DEFAULT NOW()
    );
    ```

2.  Run the SQL statement. Add other relevant columns as needed (e.g., `content_type`, `size`).

<Admonition type="note" title="Securing metadata with RLS">
If you use [Neon's Row Level Security (RLS)](/blog/introducing-neon-authorize), remember to apply appropriate access policies to the `s3_files` table. This controls who can view or modify the object references stored in Neon based on your RLS rules.

Note that these policies apply _only_ to the metadata in Neon. Access control for the objects within the S3 bucket itself is managed via S3 bucket policies, IAM permissions, and object ACLs.
</Admonition>

## Upload files to S3 and store metadata in Neon

The recommended pattern for client-side uploads to S3 involves **presigned upload URLs**. Your backend generates a temporary URL that the client uses to upload the file directly to S3. Afterwards, your backend saves the file's metadata to Neon.

This requires two backend endpoints:

1.  `/presign-upload`: Generates the temporary presigned URL.
2.  `/save-metadata`: Records the metadata in Neon after the client confirms successful upload.

<Tabs labels={["JavaScript", "Python"]}>

<TabItem>

We'll use [Hono](https://hono.dev/) for the server, [`@aws-sdk/client-s3`](https://www.npmjs.com/package/@aws-sdk/client-s3) and [`@aws-sdk/s3-request-presigner`](https://www.npmjs.com/package/@aws-sdk/s3-request-presigner) for S3 interaction, and [`@neondatabase/serverless`](https://www.npmjs.com/package/@neondatabase/serverless) for Neon.

First, install the necessary dependencies:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @neondatabase/serverless @hono/node-server hono dotenv
```

Create a `.env` file:

```env
# AWS S3 Credentials & Config
AWS_ACCESS_KEY_ID=your_iam_user_access_key_id
AWS_SECRET_ACCESS_KEY=your_iam_user_secret_access_key
AWS_REGION=your_s3_bucket_region # e.g., us-east-1
S3_BUCKET_NAME=your_s3_bucket_name # e.g., my-neon-app-s3-uploads

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

const S3_BUCKET = process.env.S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const sql = neon(process.env.DATABASE_URL);
const app = new Hono();

// Replace this with your actual user authentication logic, by validating JWTs/Headers, etc.
const authMiddleware = async (c, next) => {
  c.set('userId', 'user_123');
  await next();
};

// 1. Generate Presigned URL for Upload
app.post('/presign-upload', authMiddleware, async (c) => {
  try {
    const { fileName, contentType } = await c.req.json();
    if (!fileName || !contentType) throw new Error('fileName and contentType required');

    const objectKey = `${randomUUID()}-${fileName}`;
    const publicFileUrl = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${objectKey}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
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

    await sql`
      INSERT INTO s3_files (object_key, file_url, user_id)
      VALUES (${objectKey}, ${publicFileUrl}, ${userId})
    `;
    console.log(`Metadata saved for S3 object: ${objectKey}`);
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

1.  **Setup:** Initializes the Neon database client (`sql`), Hono (`app`), and the AWS S3 client (`s3`) configured with region and credentials.
2.  **Authentication:** A placeholder `authMiddleware` is included. **Crucially**, this needs to be replaced with real authentication logic. It currently just sets a static `userId` for demonstration.
3.  **Upload endpoints:**
    - **`/presign-upload`:** Generates a temporary secure URL (`presignedUrl`) using `@aws-sdk/s3-request-presigner` that allows uploading a file directly to S3. It returns the URL, the generated `objectKey`, and the standard S3 public URL.
    - **`/save-metadata`:** Called by the client _after_ successful upload. Saves the `objectKey`, `file_url`, and `userId` into the `s3_files` table in Neon using `@neondatabase/serverless`.

</TabItem>

<TabItem>

We'll use [Flask](https://flask.palletsprojects.com/en/stable/), [`boto3`](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) (AWS SDK for Python), and [`psycopg2`](https://pypi.org/project/psycopg2/).

First, install the necessary dependencies:

```bash
pip install Flask boto3 psycopg2-binary python-dotenv
```

Create a `.env` file:

```env
# AWS S3 Credentials & Config
AWS_ACCESS_KEY_ID=your_iam_user_access_key_id
AWS_SECRET_ACCESS_KEY=your_iam_user_secret_access_key
AWS_REGION=your_s3_bucket_region # e.g., us-east-1
S3_BUCKET_NAME=your_s3_bucket_name # e.g., my-neon-app-s3-uploads

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

S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")
s3_client = boto3.client(
    service_name="s3",
    region_name=AWS_REGION,
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

app = Flask(__name__)

# Use a global PostgreSQL connection instead of creating a new one for each request in production
def get_db_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

# Replace this with your actual user authentication logic
def get_authenticated_user_id(request):
    # Example: Validate Authorization header, session cookie, etc.
    return "user_123"  # Static ID for demonstration

# 1. Generate Presigned URL for Upload
@app.route("/presign-upload", methods=["POST"])
def presign_upload_route():
    try:
        user_id = get_authenticated_user_id(request)
        data = request.get_json()
        file_name = data.get("fileName")
        content_type = data.get("contentType")
        if not file_name or not content_type:
            raise ValueError("fileName and contentType required")

        object_key = f"{uuid.uuid4()}-{file_name}"
        public_file_url = (
            f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{object_key}"
        )

        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": S3_BUCKET_NAME,
                "Key": object_key,
                "ContentType": content_type,
            },
            ExpiresIn=300,
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


# 2. Save Metadata after Client Upload Confirmation
@app.route("/save-metadata", methods=["POST"])
def save_metadata_route():
    conn = None
    cursor = None
    try:
        user_id = get_authenticated_user_id(request)
        data = request.get_json()
        object_key = data.get("objectKey")
        public_file_url = data.get("publicFileUrl")
        if not object_key:
            raise ValueError("objectKey required")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """ INSERT INTO s3_files (object_key, file_url, user_id) VALUES (%s, %s, %s) """,
            (object_key, public_file_url, user_id),
        )
        conn.commit()
        print(f"Metadata saved for S3 object: {object_key}")
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

1.  **Setup:** Initializes Flask, the PostgreSQL client (`psycopg2`), and the AWS S3 client (`boto3`) using environment variables for credentials and configuration.
2.  **Authentication:** A placeholder `get_authenticated_user_id` function is included. **Replace this with real authentication logic.**
3.  **Upload endpoints:**
    - **`/presign-upload`:** Generates a temporary secure URL (`presignedUrl`) using `boto3` that allows uploading a file directly to S3. It returns the URL, `objectKey`, and the standard public S3 URL.
    - **`/save-metadata`:** Called by the client _after_ successful upload. Saves the `objectKey`, `file_url`, and `userId` into the `s3_files` table in Neon using `psycopg2`.
4.  In production, you should use a global PostgreSQL connection instead of creating a new one for each request. This is important for performance and resource management.

</TabItem>

</Tabs>

## Testing the upload workflow

Testing the presigned URL flow involves multiple steps:

1.  **Get presigned URL:** Send a `POST` request to your `/presign-upload` endpoint with a JSON body containing `fileName` and `contentType`.
    **Using cURL:**

    ```bash
    curl -X POST http://localhost:3000/presign-upload \
         -H "Content-Type: application/json" \
         -d '{"fileName": "test-s3.txt", "contentType": "text/plain"}'
    ```

    You should receive a JSON response with a `presignedUrl`, `objectKey`, and `publicFileUrl`:

    ```json
    {
      "success": true,
      "presignedUrl": "https://<BUCKET_NAME>.s3.us-east-1.amazonaws.com/.....&x-id=PutObject",
      "objectKey": "<OBJECT_KEY>",
      "publicFileUrl": "https://<BUCKET_NAME>.s3.us-east-1.amazonaws.com/<OBJECT_KEY>"
    }
    ```

    Note the `presignedUrl`, `objectKey`, and `publicFileUrl` from the response. You will use these in the next steps.

2.  **Upload file to S3:** Use the received `presignedUrl` to upload the actual file using an HTTP `PUT` request.
    **Using cURL:**

    ```bash
    curl -X PUT "<PRESIGNED_URL>" \
         --upload-file /path/to/your/test-s3.txt \
         -H "Content-Type: text/plain"
    ```

    A successful upload typically returns HTTP `200 OK` with no body.

3.  **Save metadata:** Send a `POST` request to your `/save-metadata` endpoint with the `objectKey` and `publicFileUrl` obtained in step 1.
    **Using cURL:**
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

- The file appears in your S3 bucket (check the AWS Console).
- A new row appears in your `s3_files` table in Neon containing the `object_key` and `file_url`.

You can now integrate API calls to these endpoints from various parts of your application (e.g., web clients using JavaScript's `fetch` API, mobile apps, backend services) to handle file uploads.

## Accessing file metadata and files

Storing metadata in Neon allows your application to easily retrieve references to the files hosted on S3.

Query the `s3_files` table from your application's backend when needed.

**Example SQL query:**

Retrieve files for user 'user_123':

```sql
SELECT
    id,
    object_key,     -- Key (path/filename) in S3
    file_url,       -- Publicly accessible S3 URL
    user_id,        -- User associated with the file
    upload_timestamp
FROM
    s3_files
WHERE
    user_id = 'user_123'; -- Use actual authenticated user ID
```

**Using the data:**

- The query returns metadata stored in Neon.
- The `file_url` column contains the direct link to access the file via S3.
- Use this `file_url` in your application (e.g., `<img>` tags, download links)

  <Admonition type="note" title="Private buckets">
  For private S3 buckets, store only the `object_key` and generate presigned *read* URLs on demand using a similar backend process.
  </Admonition>

This pattern effectively separates file storage and delivery concerns (handled by S3) from structured metadata management (handled by Neon), leveraging the strengths of both services.

</Steps>

## Resources

- [AWS S3 documentation](https://docs.aws.amazon.com/s3/index.html)
- [AWS — Sharing objects with presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html)
- [Neon RLS](/docs/guides/neon-rls)

<NeedHelp/>

---
title: Media storage with ImageKit.io
subtitle: Store files via ImageKit.io and track metadata in Neon
enableTableOfContents: true
updatedOn: '2025-05-30T16:54:40.464Z'
---

[ImageKit.io](https://imagekit.io/) is a cloud-based image and video optimization and delivery platform. It provides real-time manipulation, storage, and delivery via a global CDN, simplifying media management for web and mobile applications.

This guide demonstrates how to integrate ImageKit.io with Neon. You'll learn how to upload files directly from the client-side to ImageKit.io using securely generated authentication parameters from your backend, and then store the resulting file metadata (like the ImageKit File ID and URL) in your Neon database.

## Setup steps

<Steps>

## Create a Neon project

1.  Navigate to [pg.new](https://pg.new) to create a new Neon project.
2.  Copy the connection string by clicking the **Connect** button on your **Project Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Create an ImageKit.io account and get credentials

1.  Sign up for a free or paid account at [ImageKit.io](https://imagekit.io/registration).
2.  Once logged in, navigate to the **Developer options** section in the dashboard sidebar.
3.  Under **API Keys**, note your **Public Key**, **Private Key**, and **URL Endpoint**. These are essential for interacting with the ImageKit API and SDKs.
    ![ImageKit API Keys](/docs/guides/imagekit-api-keys.png)

## Create a table in Neon for file metadata

We need a table in Neon to store metadata about the files uploaded to ImageKit.io. This allows your application to reference the media stored in ImageKit.

1.  Connect to your Neon database using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or a client like [psql](/docs/connect/query-with-psql-editor). Create a table to store relevant details:

    ```sql
    CREATE TABLE IF NOT EXISTS imagekit_files (
        id SERIAL PRIMARY KEY,
        file_id TEXT NOT NULL UNIQUE,    -- ImageKit.io unique File ID
        file_url TEXT NOT NULL,          -- ImageKit CDN URL for the file
        user_id TEXT NOT NULL,           -- User associated with the file
        upload_timestamp TIMESTAMPTZ DEFAULT NOW()
    );
    ```

2.  Run the SQL statement. You can customize this table by adding or removing columns (like `width`, `height`, `tags`, etc.) based on the information you need from ImageKit and your application's requirements.

<Admonition type="note" title="Securing metadata with RLS">
If you use [Neon's Row Level Security (RLS)](/blog/introducing-neon-authorize), remember to apply appropriate access policies to the `imagekit_files` table. This controls who can view or modify the object references stored in Neon based on your RLS rules.

Note that these policies apply _only_ to the metadata in Neon. Access control for the actual files on ImageKit is managed via ImageKit features (like private files or signed URLs, if needed). The default setup makes files publicly accessible via their URL.
</Admonition>

## Upload files to ImageKit.io and store metadata in Neon

The recommended approach for client-side uploads is to generate secure **authentication parameters** on your backend. The client (e.g., a web browser) uses these parameters, along with your public API key, to upload the file directly to ImageKit's Upload API. After a successful upload, the client sends the returned metadata (like `fileId` and `url`) back to your backend to be saved in Neon.

This requires two backend endpoints:

1.  `/generate-auth-params`: Generates temporary authentication parameters (`token`, `expire`, `signature`).
2.  `/save-metadata`: Receives file metadata from the client after a successful upload to ImageKit and saves it to the Neon database.

<Tabs labels={["JavaScript", "Python"]}>

<TabItem>

We'll use [Hono](https://hono.dev/) for the server, [`imagekit
`](https://www.npmjs.com/package/imagekit) for ImageKit interaction, and [`@neondatabase/serverless`](https://www.npmjs.com/package/@neondatabase/serverless) for Neon.

First, install the necessary dependencies:

```bash
npm install imagekit @neondatabase/serverless @hono/node-server hono dotenv
```

Create a `.env` file with your credentials:

```env
# ImageKit.io Credentials
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Neon Connection String
DATABASE_URL=your_neon_database_connection_string
```

The following code snippet demonstrates this workflow:

```javascript
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import ImageKit from 'imagekit';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const sql = neon(process.env.DATABASE_URL);
const app = new Hono();

// Replace this with your actual user authentication logic
const authMiddleware = async (c, next) => {
  // Example: Validate JWT, session, etc. and set user ID
  c.set('userId', 'user_123'); // Static ID for demonstration
  await next();
};

// 1. Generate authentication parameters for client-side upload
app.get('/generate-auth-params', authMiddleware, (c) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    // These params (token, expire, signature) are sent to the client
    // The client uses these + public key to upload directly to ImageKit
    return c.json({ success: true, ...authParams });
  } catch (error) {
    console.error('Auth Param Generation Error:', error);
    return c.json({ success: false, error: 'Failed to generate auth params' }, 500);
  }
});

// 2. Save metadata after client confirms successful upload to ImageKit
app.post('/save-metadata', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    // Client sends metadata received from ImageKit after upload
    const { fileId, url } = await c.req.json();

    if (!fileId || !url) {
      throw new Error('fileId and url are required from ImageKit response');
    }

    // Insert metadata into Neon database
    await sql`
      INSERT INTO imagekit_files (file_id, file_url, user_id)
      VALUES (${fileId}, ${url}, ${userId})
    `;

    console.log(`Metadata saved for ImageKit file: ${fileId}`);
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

1.  **Setup:** Initializes the Neon database client (`sql`), the Hono web framework (`app`), and the ImageKit Node.js SDK (`imagekit`) using credentials from environment variables.
2.  **Authentication:** Includes a placeholder `authMiddleware`. **Replace this with your actual user authentication logic** to ensure only authenticated users can generate upload parameters and save metadata.
3.  **API endpoints:**
    - **`/generate-auth-params` (GET):** Uses the ImageKit SDK's `getAuthenticationParameters()` method to create a short-lived `token`, `expire` timestamp, and `signature`. These are returned to the client.
    - **`/save-metadata` (POST):** This endpoint is called by the client _after_ it has successfully uploaded a file directly to ImageKit's Upload API. The client sends the relevant metadata returned by ImageKit (like `fileId`, `url`, `thumbnailUrl`, etc.). The endpoint then inserts this metadata, along with the authenticated `userId`, into the `imagekit_files` table in Neon.

</TabItem>

<TabItem>

We'll use [Flask](https://flask.palletsprojects.com/en/stable/), [`imagekitio`](https://pypi.org/project/imagekitio/) (ImageKit Python SDK), and [`psycopg2`](https://pypi.org/project/psycopg2/).

First, install the necessary dependencies:

```bash
pip install Flask imagekitio psycopg2-binary python-dotenv
```

Create a `.env` file with your credentials:

```env
# ImageKit.io Credentials
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint # e.g., https://ik.imagekit.io/your_instance_id

# Neon Connection String
DATABASE_URL=your_neon_database_connection_string
```

The following code snippet demonstrates this workflow:

```python
import os

import psycopg2
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from imagekitio.client import ImageKit

load_dotenv()

imagekit = ImageKit(
    public_key=os.getenv("IMAGEKIT_PUBLIC_KEY"),
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEY"),
    url_endpoint=os.getenv("IMAGEKIT_URL_ENDPOINT"),
)

app = Flask(__name__)


# Use a global PostgreSQL connection pool in production instead of connecting per request
def get_db_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))


# Replace this with your actual user authentication logic
def get_authenticated_user_id(request):
    # Example: Validate Authorization header, session cookie, etc.
    return "user_123"  # Static ID for demonstration


# 1. Generate authentication parameters for client-side upload
@app.route("/generate-auth-params", methods=["GET"])
def generate_auth_params_route():
    try:
        user_id = get_authenticated_user_id(request)
        if not user_id:
            return jsonify({"success": False, "error": "Unauthorized"}), 401

        # Generate token, expire timestamp, and signature
        auth_params = imagekit.get_authentication_parameters()
        return jsonify(
            {
                "success": True,
                "token": auth_params["token"],
                "expire": auth_params["expire"],
                "signature": auth_params["signature"]
            }
        ), 200

    except Exception as e:
        print(f"Auth Param Generation Error: {e}")
        return (
            jsonify({"success": False, "error": "Failed to generate auth params"}),
            500,
        )


# 2. Save metadata after client confirms successful upload to ImageKit
@app.route("/save-metadata", methods=["POST"])
def save_metadata_route():
    conn = None
    cursor = None
    try:
        user_id = get_authenticated_user_id(request)
        if not user_id:
            return jsonify({"success": False, "error": "Unauthorized"}), 401

        data = request.get_json()
        file_id = data.get("fileId")
        url = data.get("url")

        if not file_id or not url:
            raise ValueError("fileId and url are required from ImageKit response")

        # Insert metadata into Neon database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO imagekit_files (file_id, file_url, user_id)
            VALUES (%s, %s, %s)
            """,
            (file_id, url, user_id),
        )
        conn.commit()
        print(f"Metadata saved for ImageKit file: {file_id}")
        return jsonify({"success": True}), 201

    except (psycopg2.Error, ValueError) as e:
        print(f"Metadata Save Error: {e}")
        return (
            jsonify({"success": False, "error": "Failed to save metadata"}),
            500,
        )
    except Exception as e:
        print(f"Unexpected Metadata Save Error: {e}")
        return jsonify({"success": False, "error": "Server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == "__main__":
    app.run(port=3000, debug=True)
```

**Explanation**

1.  **Setup:** Initializes the Flask web framework (`app`), the PostgreSQL client function (`get_db_connection`), and the ImageKit Python SDK (`imagekit`) using environment variables.
2.  **Authentication:** Includes a placeholder `get_authenticated_user_id` function. **Replace this with your actual user authentication logic.**
3.  **API endpoints:**
    - **`/generate-auth-params` (GET):** Uses the ImageKit SDK's `get_authentication_parameters()` method to create `token`, `expire`, and `signature`. These are returned to the client, usually as JSON.
    - **`/save-metadata` (POST):** Called by the client _after_ it has successfully uploaded a file directly to ImageKit. The client provides the metadata returned by ImageKit. The backend validates the required fields and inserts the data along with the `userId` into the `imagekit_files` table in Neon using `psycopg2`.
4.  **Database Connection:** The example shows creating a new connection per request. In production, use a global connection pool for better performance.

</TabItem>

</Tabs>

## Testing the upload workflow

This workflow involves getting authentication parameters from your backend, using those parameters to upload the file directly to ImageKit via `curl`, and then notifying your backend to save the metadata.

1.  **Get authentication parameters:** Send a `GET` request to your backend's `/generate-auth-params` endpoint.

    ```bash
    curl -X GET http://localhost:3000/generate-auth-params
    ```

    **Expected response:** A JSON object containing the necessary parameters. For example:

    ```json
    {
      "success": true,
      "token": "20xxxx-xxxx-xxxx-a350-a463b3dd544e",
      "expire": 1745435716,
      "signature": "ffxxxxxx5f19b6a22e2bd6bd90ae8a7db21"
    }
    ```

2.  **Upload file directly to ImageKit:** Use the parameters obtained in Step 1, your **ImageKit Public Key**, and the file path to send a `POST` request with `multipart/form-data` directly to the ImageKit Upload API.

    ```bash
    curl -X POST https://upload.imagekit.io/api/v1/files/upload \
         -F "file=@/path/to/your/test-image.png" \
         -F "publicKey=<YOUR_IMAGEKIT_PUBLIC_KEY>" \
         -F "token=<TOKEN_FROM_STEP_1>" \
         -F "expire=<EXPIRE_FROM_STEP_1>" \
         -F "signature=<SIGNATURE_FROM_STEP_1>" \
         -F "fileName=test-image.png" \
         -F "useUniqueFileName=true"
    ```

    **Expected response (from ImageKit):** A successful upload returns a JSON object with details about the uploaded file. Note the `fileId`, `url`, etc.

    ```json
    {
        "fileId": "<YOUR_FILE_ID>",
        "name": "<YOUR_FILE_NAME>",
        "size": "<YOUR_FILE_SIZE>",
        "versionInfo": {
            "id": "<YOUR_FILE_ID>",
            "name": "Version 1"
        },
        "filePath": "<YOUR_FILE_PATH>",
        "url": "https://ik.imagekit.io/<YOUR_INSTANCE_ID>/<YOUR_FILE_PATH>",
        "fileType": "image",
        "height": <YOUR_FILE_HEIGHT>,
        "width": <YOUR_FILE_WIDTH>,
        "thumbnailUrl": "https://ik.imagekit.io/<YOUR_INSTANCE_ID>/tr:n-ik_ml_thumbnail/<YOUR_FILE_PATH>",
        "AITags": null
    }
    ```

3.  **Save metadata:** Send a `POST` request to your backend's `/save-metadata` endpoint, providing the key details (like `fileId`, `url`) received from ImageKit in Step 2.

    ```bash
    curl -X POST http://localhost:3000/save-metadata \
         -H "Content-Type: application/json" \
         -d '{
              "fileId": "<FILE_ID_FROM_STEP_2>",
              "url": "<URL_FROM_STEP_2>"
            }'
    ```

    **Expected response (from your backend):**

    ```json
    { "success": true }
    ```

**Expected outcome:**

- The file is successfully uploaded to your ImageKit Media Library.
- You can verify a new row corresponding to the uploaded file exists in your `imagekit_files` table in Neon.

## Accessing file metadata and files

With metadata stored in Neon, your application can easily retrieve references to the media hosted on ImageKit.io.

Query the `imagekit_files` table from your application's backend whenever you need to display or link to uploaded files.

**Example SQL query:**

Retrieve files associated with a specific user:

```sql
SELECT
    id,             -- Your database primary key
    file_id,        -- ImageKit File ID
    file_url,       -- Base ImageKit CDN URL for the file
    user_id,
    upload_timestamp
FROM
    imagekit_files
WHERE
    user_id = 'user_123'; -- Use the actual authenticated user ID
```

**Using the data:**

- The query returns rows containing the file metadata stored in Neon.
- The `file_url` is the direct link to the file on ImageKit's CDN. You can use this directly in `<img>` tags, video players, or links.
- **ImageKit transformations:** A key benefit of ImageKit is real-time manipulation. You can append transformation parameters directly to the `file_url` to resize, crop, format, or optimize the media on-the-fly. For example, `file_url + '?tr=w-300,h-200'` would resize an image to 300x200 pixels. Learn more on [ImageKit transformation docs](https://imagekit.io/docs/image-transformation) for possibilities.

This pattern separates media storage, optimization, and delivery (handled by ImageKit.io) from structured metadata management (handled by Neon).

</Steps>

## Resources

- [ImageKit.io documentation](https://imagekit.io/docs)
- [ImageKit.io Upload API](https://imagekit.io/docs/api-reference/upload-file/upload-file)
- [Neon RLS](/docs/guides/neon-rls)

<NeedHelp/>

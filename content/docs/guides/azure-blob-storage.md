---
title: File storage with Azure Blob Storage
subtitle: Store files via Azure Blob Storage and track metadata in Neon
enableTableOfContents: true
updatedOn: '2025-05-30T16:54:40.458Z'
---

[Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) is Microsoft's object storage solution for the cloud. It's optimized for storing massive amounts of unstructured data, such as text or binary data, including images, documents, streaming media, and archive data.

This guide demonstrates how to integrate Azure Blob Storage with Neon by storing file metadata (like the blob name and URL) in your Neon database, while using Azure Blob Storage for file storage.

## Prerequisites

<Steps>

## Create a Neon project

1.  Navigate to [pg.new](https://pg.new) to create a new Neon project.
2.  Copy the connection string by clicking the **Connect** button on your **Project Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

## Create an Azure account, storage account, and container

1.  Sign up for or log in to your [Azure Account](https://azure.microsoft.com/free/).
2.  Navigate to [Storage accounts](https://portal.azure.com/#create/Microsoft.StorageAccount) in the Azure portal.
3.  Click **+ Create**. Fill in the required details: select a Subscription, create or select a Resource group, provide a unique Storage account name (e.g., `myneonappblobstorage`), choose a Region (e.g., `East US`), and select performance/redundancy options (Standard/LRS is fine for this example). Click **Review + create**, then **Create**.
    ![Azure Storage Account Creation](/docs/guides/azure-blob-storage-creation.png)
4.  Once the storage account is deployed, go to the resource.
5.  In the storage account menu, under **Data storage**, click **Containers**.
6.  Click **+ Container**. Provide a name for your container (e.g., `uploads`), set the **Public access level** to **Private (no anonymous access)**. This is the recommended setting for security; we will use SAS tokens for controlled access. Click **Create**.
    ![Azure Storage Container Creation](/docs/guides/azure-blob-storage-container-creation.png)

    <Admonition type="note" title="Public access vs. SAS tokens">
     While you *can* set container access levels to allow public read access (`Blob` or `Container`), it's generally more secure to keep containers private and use **Shared Access Signatures (SAS)** tokens for both uploads and downloads. SAS tokens provide temporary, granular permissions. This guide focuses on using SAS tokens for uploads. For serving files, you can either generate read-only SAS tokens on demand or, if needed, set the container to public `Blob` access.
    </Admonition>

7.  **Get connection string:**
    - In your storage account menu, under **Security + networking**, click **Access keys**.
    - Copy one of the **Connection strings**. This will be used by your backend application to authenticate with Azure Blob Storage. Store it securely.
      ![Azure Storage Account Access Keys](/docs/guides/azure-blob-storage-access-keys.png)

## Configure CORS for client-side uploads

If your application involves uploading files **directly from a web browser** using the generated SAS URLs, you must configure Cross-Origin Resource Sharing (CORS) on your Azure Storage account. CORS rules tell Azure Storage which web domains are allowed to make requests (like `PUT` requests for uploads) to your blob service endpoint. Without proper CORS rules, browser security restrictions will block these direct uploads.

Follow Azure's guide to [Configure CORS for Azure Storage](https://docs.microsoft.com/en-us/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services). You can configure CORS rules via the Azure portal (Storage account > Settings > Resource sharing (CORS) > Blob service tab).

Here’s an example CORS configuration allowing `PUT` uploads and `GET` requests from your deployed frontend application and your local development environment:

- **Allowed origins:** `https://your-production-app.com`, `http://localhost:3000` (Replace with your actual domains/ports)
- **Allowed methods:** `PUT`, `GET`
- **Allowed headers:** `*` (Or be more specific, e.g., `Content-Type`, `x-ms-blob-type`)
- **Exposed headers:** `*`
- **Max age (seconds):** `3600` (Example: 1 hour)

  ![Azure Storage CORS Configuration](/docs/guides/azure-blob-storage-cors.png)

## Create a table in Neon for file metadata

We need a table in Neon to store metadata about the blobs uploaded to Azure Storage.

1.  Connect to your Neon database using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or a client like [psql](/docs/connect/query-with-psql-editor). Create a table including the blob name, URL, user ID, and timestamp:

    ```sql
    CREATE TABLE IF NOT EXISTS azure_files (
        id SERIAL PRIMARY KEY,
        blob_name TEXT NOT NULL UNIQUE,  -- Name (path/filename) in Azure Blob Storage container
        file_url TEXT NOT NULL,          -- Publicly accessible URL (base URL, SAS might be needed for access)
        user_id TEXT NOT NULL,           -- User associated with the file
        upload_timestamp TIMESTAMPTZ DEFAULT NOW()
    );
    ```

2.  Run the SQL statement. Add other relevant columns as needed (e.g., `content_type`, `size`).

<Admonition type="note" title="Securing metadata with RLS">
If you use [Neon's Row Level Security (RLS)](/blog/introducing-neon-authorize), remember to apply appropriate access policies to the `azure_files` table. This controls who can view or modify the object references stored in Neon based on your RLS rules.

Note that these policies apply _only_ to the metadata in Neon. Access control for the blobs within the Azure container itself is managed via Azure RBAC, SAS tokens, and container access level settings.
</Admonition>

## Upload files to Azure Blob Storage and store metadata in Neon

The recommended pattern for client-side uploads to Azure Blob Storage involves **SAS (Shared Access Signature) URLs**. Your backend generates a temporary URL containing a SAS token that grants specific permissions (like writing a blob) for a limited time. The client uses this SAS URL to upload the file directly to Azure Blob Storage. Afterwards, your backend saves the file's metadata to Neon.

This requires two backend endpoints:

1.  `/generate-upload-sas`: Generates the temporary SAS URL for the client.
2.  `/save-metadata`: Records the metadata in Neon after the client confirms successful upload.

<Tabs labels={["JavaScript", "Python"]}>

<TabItem>

We'll use [Hono](https://hono.dev/) for the server, [`@azure/storage-blob`](https://www.npmjs.com/package/@azure/storage-blob) for Azure interaction, and [`@neondatabase/serverless`](https://www.npmjs.com/package/@neondatabase/serverless) for Neon.

First, install the necessary dependencies:

```bash
npm install @azure/storage-blob @neondatabase/serverless @hono/node-server hono dotenv
```

Create a `.env` file:

```env
# Azure Blob Storage Config
AZURE_STORAGE_CONNECTION_STRING="your_storage_account_connection_string"
AZURE_STORAGE_CONTAINER_NAME=your_container_name # e.g., uploads

# Neon Connection String
DATABASE_URL=your_neon_database_connection_string
```

The following code snippet demonstrates this workflow:

```javascript
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from '@azure/storage-blob';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { randomUUID } from 'crypto';

const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

const sql = neon(process.env.DATABASE_URL);
const app = new Hono();

// Replace this with your actual user authentication logic, by validating JWTs/Headers, etc.
const authMiddleware = async (c, next) => {
  c.set('userId', 'user_123');
  await next();
};

// 1. Generate SAS URL for upload
app.post('/generate-upload-sas', authMiddleware, async (c) => {
  try {
    const { fileName, contentType } = await c.req.json();
    if (!fileName || !contentType) throw new Error('fileName and contentType required');

    const blobName = `${randomUUID()}-${fileName}`;
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const fileUrl = blobClient.url;

    const sasOptions = {
      containerName: AZURE_CONTAINER_NAME,
      blobName: blobName,
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 300 * 1000), // 5 minutes expiry
      permissions: BlobSASPermissions.parse('w'), // Write permission
      protocol: SASProtocol.Https,
      contentType: contentType,
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      blobServiceClient.credential
    ).toString();
    const sasUrl = `${fileUrl}?${sasToken}`;

    return c.json({ success: true, sasUrl, blobName, fileUrl });
  } catch (error) {
    console.error('SAS Generation Error:', error.message);
    return c.json({ success: false, error: 'Failed to prepare upload URL' }, 500);
  }
});

// 2. Save metadata after client upload confirmation
app.post('/save-metadata', authMiddleware, async (c) => {
  try {
    const { blobName, fileUrl } = await c.req.json();
    const userId = c.get('userId');
    if (!blobName || !fileUrl) throw new Error('blobName and fileUrl required');

    await sql`
      INSERT INTO azure_files (blob_name, file_url, user_id)
      VALUES (${blobName}, ${fileUrl}, ${userId})
    `;
    console.log(`Metadata saved for Azure blob: ${blobName}`);
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

1.  **Setup:** Initializes Neon client (`sql`), Hono (`app`), and Azure `BlobServiceClient` using the connection string.
2.  **Authentication:** Placeholder `authMiddleware` needs replacing with actual user validation.
3.  **Upload endpoints:**
    - **`/generate-upload-sas`:** Creates a unique `blobName`, gets a `BlockBlobClient`, and generates a SAS token using `generateBlobSASQueryParameters` with write permissions (`w`) and a short expiry. It returns the full `sasUrl` (base URL + SAS token), the `blobName`, and the base `fileUrl`.
    - **`/save-metadata`:** Called by the client _after_ successful upload. Saves the `blobName`, base `fileUrl`, and `userId` into the `azure_files` table in Neon.

</TabItem>

<TabItem>

We'll use [Flask](https://flask.palletsprojects.com/en/stable/), [`azure-storage-blob`](https://pypi.org/project/azure-storage-blob/) (Azure SDK for Python), and [`psycopg2`](https://pypi.org/project/psycopg2/).

First, install the necessary dependencies:

```bash
pip install Flask azure-storage-blob psycopg2-binary python-dotenv python-dateutil
```

Create a `.env` file:

```env
# Azure Blob Storage Config
AZURE_STORAGE_CONNECTION_STRING="your_storage_account_connection_string"
AZURE_STORAGE_CONTAINER_NAME=your_container_name # e.g., uploads

# Neon Connection String
DATABASE_URL=your_neon_database_connection_string
```

The following code snippet demonstrates this workflow:

```python
import os
import uuid
from datetime import datetime, timedelta, timezone
import psycopg2
from azure.storage.blob import BlobSasPermissions, BlobServiceClient, generate_blob_sas
from dotenv import load_dotenv
from flask import Flask, jsonify, request

load_dotenv()

AZURE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
AZURE_CONTAINER_NAME = os.getenv("AZURE_STORAGE_CONTAINER_NAME")
DATABASE_URL = os.getenv("DATABASE_URL")

blob_service_client = BlobServiceClient.from_connection_string(
    AZURE_CONNECTION_STRING
)
container_client = blob_service_client.get_container_client(AZURE_CONTAINER_NAME)

app = Flask(__name__)

# Use a global PostgreSQL connection instead of creating a new one for each request in production
def get_db_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

# Replace this with your actual user authentication logic
def get_authenticated_user_id(request):
    # Example: Validate Authorization header, session cookie, etc.
    return "user_123"  # Static ID for demonstration

# 1. Generate SAS URL for upload
@app.route("/generate-upload-sas", methods=["POST"])
def generate_upload_sas_route():
    try:
        user_id = get_authenticated_user_id(request)
        data = request.get_json()
        file_name = data.get("fileName")
        content_type = data.get("contentType")
        if not file_name or not content_type:
            raise ValueError("fileName and contentType are required in JSON body.")

        blob_name = f"{uuid.uuid4()}-{file_name}"
        blob_client = container_client.get_blob_client(blob_name)
        file_url = blob_client.url

        start_time = datetime.now(timezone.utc)
        expiry_time = start_time + timedelta(minutes=5)  # 5 minutes expiry

        sas_token = generate_blob_sas(
            account_name=blob_service_client.account_name,
            container_name=AZURE_CONTAINER_NAME,
            blob_name=blob_name,
            account_key=blob_service_client.credential.account_key,
            permission=BlobSasPermissions(write=True),  # Write permission for upload
            expiry=expiry_time,
            start=start_time,
            content_type=content_type
        )

        sas_url = f"{file_url}?{sas_token}"

        return jsonify(
            {
                "success": True,
                "sasUrl": sas_url,
                "blobName": blob_name,
                "fileUrl": file_url,
            }
        ), 200

    except ValueError as e:
        print(f"SAS Generation Input Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 400
    except Exception as e:
        print(f"SAS Generation Error: {e}")
        return jsonify({"success": False, "error": "Failed to prepare upload URL"}), 500


# 2. Save metadata after client upload confirmation
@app.route("/save-metadata", methods=["POST"])
def save_metadata_route():
    conn = None
    cursor = None
    try:
        user_id = get_authenticated_user_id(request)
        data = request.get_json()
        blob_name = data.get("blobName")
        file_url = data.get("fileUrl")
        if not blob_name or not file_url:
            raise ValueError("blobName and fileUrl are required in JSON body.")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """ INSERT INTO azure_files (blob_name, file_url, user_id) VALUES (%s, %s, %s) """,
            (blob_name, file_url, user_id),
        )
        conn.commit()
        print(f"Metadata saved for Azure blob: {blob_name}")
        return jsonify({"success": True}), 201

    except psycopg2.Error as db_err:
        print(f"Database Save Error: {db_err}")
        return jsonify(
            {
                "success": False,
                "error": "Failed to save metadata",
            }
        ), 500
    except Exception as e:
        print(f"Unexpected Metadata Save Error: {e}")
        return jsonify(
            {"success": False, "error": "Server error during metadata save."}
        ), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port, debug=True)
```

**Explanation**

1.  **Setup:** Initializes Flask, `BlobServiceClient`, and `psycopg2` using environment variables.
2.  **Authentication:** A placeholder `get_authenticated_user_id` function is included. **Replace this with real authentication logic**.
3.  **Upload endpoints:**
    - **`/generate-upload-sas`:** Creates a unique `blobName`, gets the base `fileUrl`, and generates a SAS token using `generate_blob_sas` with write permissions and a short expiry. Returns the full `sasUrl`, `blobName`, and base `fileUrl`.
    - **`/save-metadata`:** Called by the client _after_ successful upload. Saves the `blobName`, base `fileUrl`, and `userId` into the `azure_files` table using `psycopg2`.
4.  In production, you should use a global PostgreSQL connection instead of creating a new one for each request. This is important for performance and resource management.

</TabItem>

</Tabs>

## Testing the upload workflow

Testing the SAS URL flow involves multiple steps:

1.  **Get SAS URL:** Send a `POST` request to your `/generate-upload-sas` endpoint with a JSON body containing `fileName` and `contentType`.
    **Using cURL:**

    ```bash
    curl -X POST http://localhost:3000/generate-upload-sas \
         -H "Content-Type: application/json" \
         -d '{"fileName": "test-azure.txt", "contentType": "text/plain"}'
    ```

    You should receive a JSON response with a `sasUrl`, `blobName`, and `fileUrl`:

    ```json
    {
      "success": true,
      "sasUrl": "https://<ACCOUNT_NAME>.blob.core.windows.net/<CONTAINER>/<BLOB_NAME>?<SAS_TOKEN>",
      "blobName": "<BLOB_NAME>",
      "fileUrl": "https://<ACCOUNT_NAME>.blob.core.windows.net/<CONTAINER>/<BLOB_NAME>"
    }
    ```

    Note the `sasUrl`, `blobName`, and `fileUrl` from the response. You will use these in the next steps.

2.  **Upload file to Azure:** Use the received `sasUrl` to upload the actual file using an HTTP `PUT` request. You also need to set the `Content-Type` header to match what was specified during SAS generation and `x-ms-blob-type: BlockBlob`.
    **Using cURL:**

    ```bash
    curl -X PUT "<SAS_URL>" \
         --upload-file /path/to/your/test-azure.txt \
         -H "Content-Type: text/plain" \
         -H "x-ms-blob-type: BlockBlob"
    ```

    A successful upload returns HTTP `201 Created`.

3.  **Save metadata:** Send a `POST` request to your `/save-metadata` endpoint with the `blobName` and base `fileUrl` from step 1.
    **Using cURL:**

    ```bash
    curl -X POST http://localhost:3000/save-metadata \
         -H "Content-Type: application/json" \
         -d '{"blobName": "<BLOB_NAME_FROM_STEP_1>", "fileUrl": "<FILE_URL_FROM_STEP_1>"}'
    ```

    You should receive a JSON response indicating success:

    ```json
    { "success": true }
    ```

**Expected outcome:**

- The file appears in your Azure Blob Storage container (check the Azure Portal).
- A new row appears in your `azure_files` table in Neon.

You can now integrate API calls to these endpoints from various parts of your application (e.g., web clients using JavaScript `fetch` API, mobile apps, backend services) to handle file uploads.

## Accessing file metadata and files

Storing metadata in Neon allows your application to easily retrieve references to the files hosted on Azure Blob Storage.

Query the `azure_files` table from your application's backend when needed.

**Example SQL query:**

Retrieve files for user 'user_123':

```sql
SELECT
    id,
    blob_name,       -- Name (path/filename) in Azure container
    file_url,        -- Base URL of the blob
    user_id,         -- User associated with the file
    upload_timestamp
FROM
    azure_files
WHERE
    user_id = 'user_123'; -- Use actual authenticated user ID
```

**Using the data:**

- The query returns metadata stored in Neon.
- The `file_url` column contains the base URL of the blob.
- **Accessing the file:**

  - If your container allows public `Blob` access, this `file_url` might be directly usable.
  - If your container is **private** (recommended), you need to generate a **read-only SAS token** for the specific `blob_name` on demand using your backend (similar to the upload SAS generation, but with `BlobSASPermissions.parse("r")` or `BlobSasPermissions(read=True)`) and append it to the `file_url`. This provides secure, temporary read access.
  - Use the resulting URL (base URL or URL with read SAS token) in your application (e.g., `<img>` tags, download links).

  For example here's how to generate a read SAS URL:
  <CodeTabs labels={["JavaScript", "Python"]}>

  ```javascript
  import {
    BlobServiceClient,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
    SASProtocol,
  } from '@azure/storage-blob';
  const AZURE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );

  async function generateReadOnlySasUrl(blobName, expiryMinutes = 15) {
    const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
    const blobClient = containerClient.getBlobClient(blobName);

    const sasOptions = {
      containerName: AZURE_CONTAINER_NAME,
      blobName: blobName,
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + expiryMinutes * 60 * 1000),
      permissions: BlobSASPermissions.parse('r'), // Read ('r') permission
      protocol: SASProtocol.Https,
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      blobServiceClient.credential
    ).toString();

    const sasUrl = `${blobClient.url}?${sasToken}`;
    return sasUrl;
  }

  // Replace '<BLOB_NAME_FROM_DB>' with the actual blob name
  generateReadOnlySasUrl('<BLOB_NAME_FROM_DB>')
    .then((url) => {
      console.log('Read-only SAS URL:', url);
    })
    .catch((error) => {
      console.error('Error generating read SAS URL:', error);
    });
  ```

  ```python
  import os
  from datetime import datetime, timedelta, timezone
  from azure.storage.blob import BlobSasPermissions, BlobServiceClient, generate_blob_sas

  AZURE_CONTAINER_NAME = os.getenv("AZURE_STORAGE_CONTAINER_NAME")

  blob_service_client = BlobServiceClient.from_connection_string(
      os.getenv("AZURE_STORAGE_CONNECTION_STRING")
  )

  def generate_read_only_sas_url(blob_name, expiry_minutes=15):
      blob_client = blob_service_client.get_blob_client(
          container=AZURE_CONTAINER_NAME, blob=blob_name
      )

      start_time = datetime.now(timezone.utc)
      expiry_time = start_time + timedelta(minutes=expiry_minutes)
      sas_token = generate_blob_sas(
          account_name=blob_service_client.account_name,
          container_name=AZURE_CONTAINER_NAME,
          blob_name=blob_name,
          account_key=blob_service_client.credential.account_key,
          permission=BlobSasPermissions(read=True), # Read permission
          expiry=expiry_time,
          start=start_time,
      )

      sas_url = f"{blob_client.url}?{sas_token}"
      return sas_url

  if __name__ == "__main__":
      # Replace '<BLOB_NAME_FROM_DB>' with the actual blob name
      test_blob_name = "<BLOB_NAME_FROM_DB>"
      read_url = generate_read_only_sas_url(test_blob_name)
      print(f"Read-only SAS URL: {read_url}")
  ```

    </CodeTabs>

  <Admonition type="note" title="Private containers & read access">
  For private containers, always generate short-lived read SAS tokens when a user needs to access a file. Store only the `blob_name` and base `file_url` (or just `blob_name`) in Neon, and construct the full SAS URL in your backend when serving the file reference to the client.
  </Admonition>

This pattern effectively separates file storage and delivery concerns (handled by Azure Blob Storage) from structured metadata management (handled by Neon), leveraging the strengths of both services.

</Steps>

## Resources

- [Azure Blob Storage documentation](https://learn.microsoft.com/en-us/azure/storage/blobs/)
- [Azure Storage Shared Access Signatures (SAS)](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview)
- [Neon Documentation](/docs/introduction)
- [Neon RLS](/docs/guides/neon-rls)

<NeedHelp/>

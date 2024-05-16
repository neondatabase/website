---
title: Uploading Objects to AWS S3 and Saving References in Postgres in Next.js
subtitle: Learn how to upload objects to AWS S3 and save reference to them in Postgres (powered by Neon) in Next.js
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-05-16T00:00:00.000Z'
updatedOn: '2024-05-16T00:00:00.000Z'
---

In this guide, you will learn the the process of creating a simple web application using Next.js that allows you to upload objects into AWS S3, and insert the reference to them in Postgres (powered by Neon) via `pg` and `@neondatabase/serverless`.

To create a Neon project and access it from an Next.js application:

- [Create a Neon project](#create-a-neon-project)
- [Store your Neon credentials](#store-your-neon-credentials)
- [Create an Amazon S3 Bucket](#create-an-amazon-s3-bucket)
- [Create access keys for IAM users (in AWS)](#create-access-keys-for-iam-users-in-aws)
- [Create a new Next.js application](#create-a-new-nextjs-application)
- [Create a Presigned URL with AWS S3 SDK](#create-a-presigned-url-with-aws-s3-sdk)
- [Save Reference to S3 items in Postgres](#save-reference-to-s3-items-in-postgres)
- [Upload to Presigned URL with in-browser JavaScript](#upload-to-presigned-url-with-in-browser-javascript)
- [Run the app](#run-the-app)

## Create a Neon project

If you do not have one already, create a Neon project. Save your connection details including your password. They are required when defining connection settings.

1. Navigate to the [Projects](https://console.neon.tech/app/projects) page in the Neon Console.
2. Click **New Project**.
3. Specify your project settings and click **Create Project**.

## Store your Neon credentials

Add a `.env` file to your project directory and add your Neon connection string to it. You can find the connection string for your database in the **Connection Details** widget on the Neon **Dashboard**. For more information, see [Connect from any application](/docs/connect/connect-from-any-app).

```shell shouldWrap
DATABASE_URL="postgres://[user]:[password]@[neon_hostname]/[dbname]"
```

## Create an Amazon S3 Bucket

Open the [Amazon S3 Bucket](https://console.aws.amazon.com/s3), and click **Create bucket**.

![](/guides/images/s3-1.png)

Enter a repository name, say `my-custom-bucket-0` for example. Copy the bucket name to be used as **AWS_S3_BUCKET_NAME** in your application.

```shell shouldWrap
AWS_S3_BUCKET_NAME="my-custom-bucket-0"
```

![](/guides/images/s3-2.png)

In the **Policy** section, use the following json to define the actions allowed with the bucket:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::launchfast-bucket-0/*"
        }
    ]
}
```

In the **CORS** section, use the following json to define the actions allowed with the bucket:

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 9000
    }
]
```

Finally, complete the bucket creation process by clicking the **Create bucket** at the end.

## Create access keys for IAM users (in AWS)

In the navigation bar on the upper right in your AWS account, choose your name, and then choose **Security credentials**.

![](/guides/images/iam-1.png)

Scroll down to **Access keys** and click on **Create access key**.

![](/guides/images/iam-2.png)

Again, click on **Create access key**.

![](/guides/images/iam-3.png)

Copy the Access key and Secret access key generated to be used as **AWS_KEY_ID** and **AWS_SECRET_ACCESS_KEY** respectively.

```shell shouldWrap
AWS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY=".../...+"
```

![](/guides/images/iam-4.png)

## Create a new Next.js application

Let’s get started by creating a new Next.js project. Open your terminal and run the following command:

```shell shouldWrap
npx create-next-app@latest my-app
```

When prompted, choose:

- `Yes` when prompted to use TypeScript.
- `No` when prompted to use ESLint.
- `Yes` when prompted to use Tailwind CSS.
- `No` when prompted to use `src/` directory.
- `Yes` when prompted to use App Router.
- `No` when prompted to customize the default import alias (`@/*`).

Once that is done, move into the project directory and start the app in developement mode by executing the following command:

```shell shouldWrap
cd my-app
npm run dev
```

The app should be running on [localhost:3000](http://localhost:3000). Stop the development server to install the libraries necessary to build the application:

```shell shouldWrap
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @neondatabase/serverless
```

The command installed the following libraries:

- `@aws-sdk/client-s3`: AWS SDK for JavaScript S3 Client for Node.js, Browser and React Native.
- `@aws-sdk/s3-request-presigner`: SDK to generate signed url for S3.
- `@neondatabase/serverless`: Neon's PostgreSQL driver for JavaScript and TypeScript.

Now, create a `.env` file at the root of your project. You are going to add the `OPENAI_API_KEY` you obtained earlier.

It should look something like this:

```shell shouldWrap
# AWS Environment Variables
AWS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY=".../...+"
AWS_S3_BUCKET_NAME="...-bucket-0"

# Postgres (powered by Neon) Environment Variable
DATABASE_URL="postgresql://neondb_owner:...@...-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

Mow, let's move on to creating an API route to obtain a presigned URL to upload objects to.

## Create a Presigned URL with AWS S3 SDK

TODO

```tsx
// File: app/api/presigned/route.ts

import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const accessKeyId = process.env.AWS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const s3BucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!accessKeyId || !secretAccessKey || !s3BucketName) {
    return new Response(null, { status: 500 });
  }
  const searchParams = request.nextUrl.searchParams;
  const fileName = searchParams.get("fileName");
  const contentType = searchParams.get("contentType");
  if (!fileName || !contentType) {
    return new Response(null, { status: 500 });
  }
}
```

TODO

```tsx {4,5,20-34}
// File: app/api/presigned/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET(request: NextRequest) {
  const accessKeyId = process.env.AWS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const s3BucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!accessKeyId || !secretAccessKey || !s3BucketName) {
    return new Response(null, { status: 500 });
  }
  const searchParams = request.nextUrl.searchParams;
  const fileName = searchParams.get("fileName");
  const contentType = searchParams.get("contentType");
  if (!fileName || !contentType) {
    return new Response(null, { status: 500 });
  }
  const client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: fileName,
    ContentType: contentType,
  });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  if (signedUrl) return NextResponse.json({ signedUrl });
  return new Response(null, { status: 500 });
}
```

Now, let's move on to building an endpoint to insert the reference to the uploaded asset in Postgres (powered by Neon).

## Save Reference to S3 items in Postgres

TODO

<CodeTabs labels={["node-postgres", "Neon serverless driver"]}>

  ```tsx {3,10-11,14,16,18-21}
  // File: app/api/user/image/route.ts

  import { Client } from "pg";
  import { NextResponse, type NextRequest } from "next/server";

  export async function POST(request: NextRequest) {
    const { objectUrl } = await request.json();
    if (!process.env.DATABASE_URL) return new Response(null, { status: 500 });
    // Create a client instance using `node-postgres`
    const client = new Client(process.env.DATABASE_URL);
    await client.connect();
    try {
      // Create the user table if it does not exist
      await client.query('CREATE TABLE IF NOT EXISTS "user" (name TEXT, image TEXT)');
      // Mock call to get the user
      const user = "rishi"; // getUser();
      // Insert the user name and the reference to the image into the user table
      await client.query('INSERT INTO "user" (name, image) VALUES ($1, $2)', [
        user,
        objectUrl,
      ]);
      return NextResponse.json({ code: 1 });
    } catch (e) {
      return NextResponse.json({
        code: 0,
        message: e instanceof Error ? e.message : e?.toString(),
      });
    }
  }
  ```

  ```tsx {3,12,14,16-19}
  // File: app/api/user/image/route.ts

  import { neon } from "@neondatabase/serverless";
  import { NextResponse, type NextRequest } from "next/server";

  export async function POST(request: NextRequest) {
    const { objectUrl } = await request.json();
    if (!process.env.DATABASE_URL) return new Response(null, { status: 500 });
    const sql = neon(process.env.DATABASE_URL);
    try {
      // Create the user table if it does not exist
      await sql('CREATE TABLE IF NOT EXISTS "user" (name TEXT, image TEXT)');
      // Mock call to get the user
      const user = "rishi"; // getUser();
      // Insert the user name and the reference to the image into the user table
      await sql('INSERT INTO "user" (name, image) VALUES ($1, $2)', [
        user,
        objectUrl,
      ]);
      return NextResponse.json({ code: 1 });
    } catch (e) {
      return NextResponse.json({
        code: 0,
        message: e instanceof Error ? e.message : e?.toString(),
      });
    }
  }
  ```
</CodeTabs>

## Upload to Presigned URL with in-browser JavaScript

TODO

```tsx
// File: app/page.tsx

"use client";

import { ChangeEvent } from "react";

export default function Home() {
  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null | undefined = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result;
      if (fileData) {
        // Fetch presigned URL and save reference in Postgres (powered by Neon)
      }
    };
    reader.readAsArrayBuffer(file);
  };
  return <input onChange={uploadFile} type="file" />;
}
```

TODO

```tsx {15-28}
// File: app/page.tsx

"use client";

import { ChangeEvent } from "react";

export default function Home() {
  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null | undefined = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result;
      if (fileData) {
        const presignedURL = new URL("/api/presigned", window.location.href);
        presignedURL.searchParams.set("fileName", file.name);
        presignedURL.searchParams.set("contentType", file.type);
        fetch(presignedURL.toString())
          .then((res) => res.json())
          .then((res) => {
            const body = new Blob([fileData], { type: file.type });
            fetch(res.signedUrl, {
              body,
              method: "PUT",
            }).then(() => {
              // Save reference to the object in Postgres (powered by Neon)
            });
          });
      }
    };
    reader.readAsArrayBuffer(file);
  };
  return <input onChange={uploadFile} type="file" />;
}
```

TODO

```tsx {26-32}
// File: app/page.tsx

"use client";

import { ChangeEvent } from "react";

export default function Home() {
  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null | undefined = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result;
      if (fileData) {
        const presignedURL = new URL("/api/presigned", window.location.href);
        presignedURL.searchParams.set("fileName", file.name);
        presignedURL.searchParams.set("contentType", file.type);
        fetch(presignedURL.toString())
          .then((res) => res.json())
          .then((res) => {
            const body = new Blob([fileData], { type: file.type });
            fetch(res.signedUrl, {
              body,
              method: "PUT",
            }).then(() => {
              fetch("/api/user/image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  objectUrl: res.signedUrl.split("?")[0],
                }),
              });
            });
          });
      }
    };
    reader.readAsArrayBuffer(file);
  };
  return <input onChange={uploadFile} type="file" />;
}
```

## Run the app

Execute the following command to run your application locally:

```shell
npm run dev
```

<NeedHelp />
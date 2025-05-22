---
title: Project reference
subtitle: All your Neon project details and copy-paste commands in one place
---

> ℹ️ **This page is personalized to your current project and org.**<br/>

<UserData>

👋 Hello, <strong>@@@name:developer@@@</strong>! Here's everything you need for working with `@@@selected_project.name:your Neon project@@@`.

## Project details

- **Organization:** `@@@selected_org.name:Your Org@@@`
- **Organization ID:** `@@@selected_org_id:org-id@@@`
- **Project:** `@@@selected_project.name:Your Project@@@`
- **Project ID:** `@@@selected_project_id:project-id@@@`
- **Logged in as:** `@@@email:you@example.com@@@`

## Connection strings

**Connect to your default branch**

```bash shouldWrap
@@@db.connection_uri:your-default-uri@@@
```

Here’s how your connection string is built:

- User: `@@@db.role:your-user@@@`
- Password: `@@@db.password:your-password@@@`
- Host: `@@@db.host:your-host@@@`
- Port: `@@@db.port:5432@@@`
- Database: `@@@db.database:your-db@@@`
- Pooler: pooled connection by default

## Environment variables

```bash shouldWrap
NEON_PROJECT_ID=@@@selected_project_id:project-id@@@
NEON_DATABASE_URL="@@@db.connection_uri:your-production-uri@@@"
NEON_PROJECT_NAME="@@@selected_project.name:Your Project@@@"
```

## API endpoints

**Get project info:**

```bash shouldWrap
curl -X GET 'https://console.neon.tech/api/v2/projects/@@@selected_project_id:project-id@@@' \
  -H 'accept: application/json' \
  -H 'authorization: Bearer $NEON_API_KEY'
```

## CLI commands

> After setting context, all commands below will use your selected project: `@@@selected_project.name:Your Project@@@`.

**Set CLI context to this project**

```bash
neon context set --project-id @@@selected_project_id:project-id@@@
```

**List all branches in your project**

```bash
neon branches list
```

**View details for your default branch `@@@branch.name:your-branch-id@@@`**

```bash
neon branches get @@@branch.id:your-branch-id@@@
```

**Create a new branch**

```bash
neon branches create my-feature-branch
```

## Useful links

- [Next.js](/docs/guides/nextjs#store-your-neon-credentials)
- [Node.js](/docs/guides/node#store-your-neon-credentials)
- [Go](/docs/guides/go#configure-go-application-connection-settings)

</UserData>

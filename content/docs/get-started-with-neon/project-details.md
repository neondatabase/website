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

**Create a new branch**

```bash
neon branches create my-feature-branch
```

## Useful links

- [Project dashboard](https://console.neon.tech/app/projects/@@@selected_project_id:project-id@@@)
- [Production checklist](/docs/get-started-with-neon/production-checklist)
- [Branching guide](/docs/guides/branching-intro)

</UserData>

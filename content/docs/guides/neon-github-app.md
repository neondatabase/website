---
title: Neon GitHub integration
subtitle: Connect your GitHub repo to your Neon database
enableTableOfContents: true
---

The Neon GitHub integration connects your GitHub application repository to your Neon project and creates a database for each pull request.

When you connect your GitHub application repository to your Neon project, the integration performs the following actions:

1. Creates a Neon Production environment in your GitHub repository and adds secrets to this environment for the following environment variables:
    - `DATABASE_URL`: A direct connection to the primary branch in your Neon project.
    - `DATABASE_URL_UNPOOLED`: A pooled connection to the primary branch in your Neon project.
2. Creates a Neon Preview environment in the GitHub repository. Initially, this environment is empty but will eventually contain `DATABASE_URL` and `DATABASE_URL_UNPOOLED` secrets for preview branches. 
3. Creates a global `NEON_PROJECT_ID` variable in your GitHub repository containing the ID of your Neon project.

## How to install the Neon GitHub app

To add the GitHub integration to your Neon project:

1. In the Neon Console, navigate to the **Integrations** page for your project.
2. Locate the GitHub integration and click **Manage** to open the **GitHub integration** drawer.
3. Select a GitHub repository to connect to and click **Save**.

## Preview branches for each pull request

The integration creates a Neon branch from your primary Neon branch for each pull request, which you can use with your application previews. 

The "preview" branches are named according to the following convention:

```text
preview/pr-<pull_request_number>-<git-branch-name>
```

For example: `preview/pr-123-my-branch`

Upon creation of a preview branch, secrets are added to the Neon Preview environment in your GitHub repository:

- `PR_<PULL_REQUEST_NUMBER>_DATABASE_URL`: A direct connection to the preview branch; for example: `PR_123_DATABASE_URL`
- `PR_<PULL_REQUEST_NUMBER>_DATABASE_URL_UNPOOLED`: A pooled connection to the preview branch; for example: `PR_123_DATABASE_URL_UNPOOLED`


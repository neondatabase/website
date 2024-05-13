---
title: Neon GitHub integration
subtitle: Connect your GitHub repo to your Neon database
enableTableOfContents: true
---

The Neon GitHub integration connects your GitHub application repository to your Neon project, making it easier to build developer workflows using Neon's [GitHub Actions](/docs/guides/branching-github-actions).

When you connect your GitHub application repository to your Neon project, the integration performs the following actions:

1. Creates a global variable in the GitHub repo containing your Neon project ID.
2. Generates a new Neon API key for your Neon account.
3. Creates a global secret in the GitHub repository containing the Neon API key.

The following section describes how to install the GitHub integration and shows the effects of the actions listed above.

## Install GitHub integration

To add the GitHub integration to your Neon project:

1. In the Neon Console, navigate to the **Integrations** page for your project.
2. Locate the GitHub integration and click **Manage** to open the **GitHub integration** drawer.
3. Select a GitHub repository to connect to and click **Save**.

## Using the GitHub integration

## Remove the GitHub integration

Removal of the GitHub integration removes:

- The global variable in the GitHub repo containing your Neon project ID 
- The global secret in the GitHub repository containing the Neon API key
- Removes the Neon API key from your Neon account

To remove the integration:

1. In the Neon Console, navigate to the **Integrations** page for your project.
2. Locate the GitHub integration and click **Manage** to open the **GitHub integration** drawer.
3. Click **Remove**.
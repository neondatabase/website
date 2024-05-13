---
title: The Neon GitHub integration
subtitle: Connect your GitHub repo to your Neon database
enableTableOfContents: true
---

The Neon GitHub integration connects your GitHub application repository to your Neon project, making it easier to set up developer workflows using Neon's [GitHub Actions](/docs/guides/branching-github-actions).

When you connect your GitHub application repository to your Neon project, the integration performs the following actions:

1. Creates a global variable in the GitHub repo containing your Neon project ID.
2. Generates a new Neon API key for your Neon account.
3. Creates a global secret in the GitHub repository containing the Neon API key.

Neon's GitHub Actions require setting a `NEON_PROJECT_ID` variable and a `NEON_API_KEY` secret in GitHub. The Neon GitHub app does this for you automatically.

The following section describes how to install the GitHub integration.

## Prerequisites

This installation assumes the following:
- You already have a Neon account and project. If not, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up).
- You have a GitHub account and a repository that you want to connect to your Neon project.

## Install GitHub integration

To add the GitHub integration to your Neon project:

1. In the Neon Console, navigate to the **Integrations** page for your project.
2. Locate the **GitHub** integration card and click **Add**.
    ![GitHub integration card](/docs/guides/github_card.png)
3. On the **GitHub integration** drawer, click **Install GitHub app**.
4. On the **Install & Authorize** page, select whether to install and authorize the GitHub app for **All repositories** or **Only select repositories**.
    - Selecting **All repositories** directs you back to the GitHub integration drawer in the Neon Console to select a GitHub repository.
    - Selecting **Only select repositories** lets you choose a repository immediately.
5. Since Neon's GitHub app is currently designed to work with a single repository, select **Only select repositories** and choose a GitHub repository.

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
---
title: The Neon GitHub App
subtitle: Connect a Neon project to a GitHub repo for a database branching workflow
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.401Z'
---

The Neon GitHub App lets you connect a Neon project to a GitHub application repository and set up a workflow that creates a database branch with each pull request. 

<Admonition type="comingSoon" title="Feature Coming Soon">
The Neon GitHub integration is currently in **private preview**. To start using it, request access by contacting our [Customer Success](mailto:customer-success@neon.tech) team and asking to join the private preview.
</Admonition>

A database branch is an isolated copy of your data, allowing you to create production-like application previews to accelerate review and collaboration.

When you connect a Neon project to a GitHub repository, the GitHub app sets variables in your GitHub repository and provides you with a sample GitHub Action that uses those variables to create a database branch with each pull request.

## Prerequisites

The steps described below assume the following:

- You have a Neon account and project. If not, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up).
- You have a GitHub account and a repository that you want to connect to your Neon project.

## Add the GitHub App and connect your Neon project 

To add the GitHub app:

1. In the Neon Console, navigate to the **Integrations** page in your Neon project.
2. Locate the **GitHub** integration card and click **Add**.
   ![GitHub integration card](/docs/guides/github_card.png)
3. On the **GitHub** drawer, click **Add GitHub App**.
4. If you have more than one GitHub account, select the one where you want to install the app.
5. Select whether to install and authorize the GitHub app for **All repositories** in your GitHub account or **Only select repositories**.
   - Selecting **All repositories** authorizes the app on all repositories in your GitHub account, meaning that you will be able to connect a Neon project to any of them. 
   - Selecting **Only select repositories** authorizes the app on one or more repositories, meaning that you will only be able to connect a Neon project to those repositories.
6. Next, if you authorized the app on **All repositories** or multiple repositories, select a GitHub repository to connect to your Neon project, and click **Connect**. If you authorized the GitHub app on a single GitHub repository, this step is already done.
  
    You are advanced to the **Actions** tab on the final page of the setup, which outlines the actions performed to connect your Neon project to the selected GitHub repository, which includes:
      - Generating a Neon API key for your Neon account.
      - Creating a `NEON_API_KEY` secret in your GitHub repository.
      - Adding a `NEON_PROJECT_ID` variable to your GitHub repository.

## Connect other Neon projects to GitHub repositories



## 

### Changes made by the integration

After connecting your Neon project to a GitHub repository, the GitHub integration performs the following actions:


- Generates a Neon API key for your Neon account
- Creates a `NEON_API_KEY` secret in your GitHub repository
- Adds a `NEON_PROJECT_ID` variable to your GitHub repository


- **Installed and Authorized GitHub Apps**

  To view the installed and authorized Neon GitHub application:

  1. Navigate to your GitHub account page.
  2. From your GitHub profile menu, select **Settings**.
  3. Select **Applications** from the sidebar.

  The Neon GitHub app should be listed on the **Installed GitHub Apps** and **Authorized GitHub Apps** tabs.

- **Neon project ID variable and Neon API key secret**

  To view the variable containing your Neon project ID:

  1. Navigate to your GitHub account page.
  2. From your GitHub profile menu, select **Your repositories**.
  3. Select the repository that you chose when installing the Neon GitHub integration.
  4. On the repository page, select the **Settings** tab.
  5. Select **Secrets and variables** > **Actions** from the sidebar.

  Your `NEON_API_KEY` secret is listed on the **Secrets** tab, and the `NEON_PROJECT_ID` variable is listed on the **Variables** tab.

- **Neon API key**

  To view the Neon API key created by the integration:

  1. In the [Neon Console](https://console.neon.tech), click your profile at the top right corner of the page.
  2. Select **Account settings**.
  3. Select **API keys**.

  The API key created by the integration should be listed with a name similar to the following: **API key for GitHub (cool-darkness-12345678)**. You cannot view the key itself, only the name it was given, the time it was created, and when the key was last used.

    <Admonition type="note">
    The items listed above are removed if you uninstall the Neon GitHub integration. See [Remove the GitHub integration](#remove-the-github-integration).
    </Admonition>

## Using the GitHub integration

The GitHub integration is intended to simplify setting up developer workflows using Neon's [GitHub Actions](/docs/guides/branching-github-actions) or other CI/CD tools. Neon's GitHub Actions require the configuration steps performed by the Neon GitHub integration to be performed manually, namely:

1. Creating a GitHub variable containing your Neon project ID.
2. Generating a new Neon API key for your Neon account.
3. Creating a GitHub secret containing the Neon API key.

After installing the Neon GitHub integration, you can proceed with setting up your GitHub Action workflow knowing that these steps are already completed.

For example applications that use Neon's GitHub Actions, see [Example applications](/docs/guides/branching-github-actions#example-applications).

<Admonition type="note">
This is an early preview of the Neon GitHub integration. Its functionality is currently limited to configuring a project ID variable and Neon API Key secret. You may find that you need to configure additional variables and secrets when building workflows. When you run into a limitation, please let us know and we'll consider it for the next release. See [Feedback and future improvements](#feedback-and-future-improvements).
</Admonition>

For more GitHub Action and workflow-related resources, please see:

- [A database for every preview environment using Neon, GitHub Actions, and Vercel](https://neon.tech/blog/branching-with-preview-environments)
- [Database Branching Workflows](https://neon.tech/flow)
- [Database branching workflow guide for developers](https://neon.tech/blog/database-branching-workflows-a-guide-for-developers).

## Remove the GitHub integration

Removing the integration performs the following actions:

- Terminates connections dependent on the configured variable and secret.
- Removes the GitHub variable containing your Neon project ID.
- Removes the Neon API key for your Neon account.
- Removes the GitHub secret containing the Neon API key.

To remove the integration:

1. In the Neon Console, navigate to the **Integrations** page for your project.
2. Locate the GitHub integration and click **Manage** to open the **GitHub integration** drawer.
3. Click **Disconnect**.
4. Click **Remove integration** to confirm your choice.

## Feedback and future improvements

If you've got feature requests or feedback about what you'd like to see from the Neon GitHub integration, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.








When you connect your GitHub application repository to your Neon project, the integration performs the following actions:

1. Creates a GitHub variable containing your Neon project ID.
2. Generates a new Neon API key for your Neon account.
3. Creates a GitHub secret containing the Neon API key.

After adding the integration, you can copy the preconfigured “create branch” action to your application repository to create a database branch with each pull request.

Additionally, the GitHub repository variables set by the integration let you easily extend your workflow with other actions, such as resetting and deleting branches. For details, refer to the Neon GitHub integration guide. Adding the integration performs the following actions:

<Admonition type="info">
Neon's GitHub Actions require setting a `NEON_PROJECT_ID` variable and a `NEON_API_KEY` secret in GitHub. The Neon GitHub app does this for you automatically.
</Admonition>

The following section describes how to install the GitHub integration.


https://www.figma.com/design/kMExsRvzATGgzuADjfkB0A/Integrations-Page?node-id=2760-965&t=dtF8d1VYH56EWNqp-0
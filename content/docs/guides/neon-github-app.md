---
title: The Neon GitHub App
subtitle: Connect a Neon project to a GitHub repo for a database branching workflow
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.401Z'
---

<Admonition type="comingSoon" title="Feature Coming Soon">
The Neon GitHub App is currently in **private preview**. To start using it, request access by contacting our [Customer Success](mailto:customer-success@neon.tech) team and asking to join the private preview.
</Admonition>

The Neon GitHub App lets you connect a Neon project to a GitHub application repository and set up a workflow that creates a database branch with each pull request.

A database branch is an isolated copy of your data, allowing you to create production-like application previews to accelerate review and collaboration.

## Prerequisites

The steps described below assume the following:

- You have a Neon account and project. If not, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up).
- You have a GitHub account and a repository that you want to connect to your Neon project.

## Add the GitHub App and connect your Neon project 

To add the GitHub app:

1. In the Neon Console, navigate to the **Integrations** page in your Neon project.
2. Locate the **GitHub** card and click **Add**.
   ![GitHub App card](/docs/guides/github_card.png)
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

      You are also provided with GitHub Action code to add to your GitHub repository to set up your branching workflow. For instructions, see [Add the GitHub Action code to your repo](#add-the-github-workflow-to-your-repo).

## Sample GitHub workflow

After you install the Neon GitHub App and connect your Neon project to a GitHub repository, the GitHub App provides a sample GitHub Action workflow that you can add to your repo. The workflow includes:

- A `Create Neon Branch` action that creates a new Neon branch in your Neon project when you open or reopen a pull request in the connected GitHub repository.
- A `Delete Neon Branch` action that deletes the Neon branch from your Neon project when you close the pull request.
- Commented out code showing how you might add a step for running database migration. 

<Admonition type="note">
The provided workflow is intended as a start example, showing how you can build a database branching workflows with GitHub and Neon. For mroe workflow examples, refer to the [GitHub workflow examples](#github-workflow-examples) toward the end of this guide.
</Admonition>

```yaml
name: Create/Delete Branch for Pull Request

on:
  pull_request:
    types:
      - opened
      - reopened
      - synchronize
      - closed

jobs:
  setup:
    name: Setup
    outputs:
      branch: \${{ steps.branch_name.outputs.current_branch }}
    runs-on: ubuntu-latest
    steps:
      - name: Get branch name
        id: branch_name
        uses: tj-actions/branch-names@v8

  create_neon_branch:
    name: Create Neon Branch
    outputs:
      db_url: \${{ steps.create_neon_branch_encode.outputs.db_url }}
      db_url_with_pooler: \${{ steps.create_neon_branch_encode.outputs.db_url_with_pooler }}
    needs: setup
    if: |
      github.event_name == 'pull_request' && (
      github.event.action == 'synchronize'
      || github.event.action == 'opened'
      || github.event.action == 'reopened')
    runs-on: ubuntu-latest
    steps:
      - name: Create Neon Branch
        id: create_neon_branch
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: \${{ vars.NEON_PROJECT_ID }}
          branch_name: preview/pr-\${{ github.event.number }}-\${{ needs.setup.outputs.branch }}
          api_key: \${{ secrets.NEON_API_KEY }}

# The step above creates a new Neon branch. 
# You may want to do something with the new branch, such as run migrations, run tests on it, or send the connection details to a hosting platform environment.
# The branch DATABASE_URL is available to you via "\${{ steps.create_neon_branch.outputs.db_url_with_pooler }}". 
# It's important you don't log the DATABASE_URL as output as it contains a username and password for your database.
# For example, you can uncomment the lines below to run a database migration command:
#      - name: Run Migrations
#        run: npm run db:migrate 
#        env:
#          DATABASE_URL: "${{ steps.create_neon_branch.outputs.db_url_with_pooler }}"

  delete_neon_branch:
    name: Delete Neon Branch
    needs: setup
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Delete Neon Branch
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: \${{ vars.NEON_PROJECT_ID }}
          branch: preview/pr-\${{ github.event.number }}-\${{ needs.setup.outputs.branch }}
          api_key: \${{ secrets.NEON_API_KEY }}
```


### Add the GitHub workflow to your repo

1. In your repository, create a workflow file in the `.github/workflows` directory; for example, create a file named `neon_workflow.yml`.

  - If the `.github/workflows` directory already exists, add the file.
  - If your repository doesn't have a ``.github/workflows` directory, add the file `.github/workflows/neon-workflow.yml`. This creates the `.github` and `workflows` directories and the `neon-workflow.yml` file.

  If you get stuck here, see [Creating your first workflow](https://docs.github.com/en/actions/quickstart#creating-your-first-workflow), in the GitHub documentation.

<Admonition type="note">
For GitHub to discover any GitHub Actions workflows, you must save the workflow files in a directory called `.github/workflows` in your repository. Additionally, you can name the workflow file as you like, but you must use `.yml` or ``.yaml` as the file name extension.
</Admonition>

2. Copy the workflow example above into your `neon-workflow.yml` file.
3. Commit your changes.


### Using the GitHub workflow

To see the GitHub workflow in action, create a pull request in your GitHub application repository. This will trigger the `Create Neon Branch`. You can verify that the branch was created on the **Branches** page in the Neon Console. You should see a new branch with a `preview/pr-` name prefix.

Closing the pull request will remove the Neon branch from the Neon project, which you can also verify on the **Branches** page in the Neon Console.

To see your workflow results in GitHub, you can follow the instructions in [Viewing your workflow results](https://docs.github.com/en/actions/quickstart#viewing-your-workflow-results), in the GitHub documentation.

## Connect more Neon projects to GitHub repositories

If you've previously installed the GitHub App, it's available to use with all of your Neon projects.

To connect another Neon project to a GitHub repository.

### Changes made by the app

After connecting your Neon project to a GitHub repository, the GitHub app performs the following actions:

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
  3. Select the repository that you chose when installing the Neon GitHub app.
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
    The items listed above are removed if you uninstall the Neon GitHub app. See [Remove the GitHub app](#remove-the-github-app).
    </Admonition>

## Using the GitHub app

The GitHub app is intended to simplify setting up developer workflows using Neon's [GitHub Actions](/docs/guides/branching-github-actions) or other CI/CD tools. Neon's GitHub Actions require the configuration steps performed by the Neon GitHub app to be performed manually, namely:

1. Creating a GitHub variable containing your Neon project ID.
2. Generating a new Neon API key for your Neon account.
3. Creating a GitHub secret containing the Neon API key.

After installing the Neon GitHub app, you can proceed with setting up your GitHub Action workflow knowing that these steps are already completed.

For example applications that use Neon's GitHub Actions, see [Example applications](/docs/guides/branching-github-actions#example-applications).

<Admonition type="note">
This is an early preview of the Neon GitHub app. Its functionality is currently limited to configuring a project ID variable and Neon API Key secret. You may find that you need to configure additional variables and secrets when building workflows. When you run into a limitation, please let us know and we'll consider it for the next release. See [Feedback and future improvements](#feedback-and-future-improvements).
</Admonition>

For more GitHub Action and workflow-related resources, please see:

- [A database for every preview environment using Neon, GitHub Actions, and Vercel](https://neon.tech/blog/branching-with-preview-environments)
- [Database Branching Workflows](https://neon.tech/flow)
- [Database branching workflow guide for developers](https://neon.tech/blog/database-branching-workflows-a-guide-for-developers).

## Remove the GitHub app

Removing the integration performs the following actions:

- Terminates connections dependent on the configured variable and secret.
- Removes the GitHub variable containing your Neon project ID.
- Removes the Neon API key for your Neon account.
- Removes the GitHub secret containing the Neon API key.

To remove the integration:

1. In the Neon Console, navigate to the **Integrations** page for your project.
2. Locate the GitHub app and click **Manage** to open the **GitHub app** drawer.
3. Click **Disconnect**.
4. Click **Remove integration** to confirm your choice.

## Feedback and future improvements

If you've got feature requests or feedback about what you'd like to see from the Neon GitHub app, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.



## GitHub workflow examples

tbd




When you connect your GitHub application repository to your Neon project, the integration performs the following actions:

1. Creates a GitHub variable containing your Neon project ID.
2. Generates a new Neon API key for your Neon account.
3. Creates a GitHub secret containing the Neon API key.

After adding the integration, you can copy the preconfigured “create branch” action to your application repository to create a database branch with each pull request.

Additionally, the GitHub repository variables set by the integration let you easily extend your workflow with other actions, such as resetting and deleting branches. For details, refer to the Neon GitHub app guide. Adding the integration performs the following actions:

<Admonition type="info">
Neon's GitHub Actions require setting a `NEON_PROJECT_ID` variable and a `NEON_API_KEY` secret in GitHub. The Neon GitHub app does this for you automatically.
</Admonition>

The following section describes how to install the GitHub app.


https://www.figma.com/design/kMExsRvzATGgzuADjfkB0A/Integrations-Page?node-id=2760-965&t=dtF8d1VYH56EWNqp-0



- When you add the GitHub App for the first time to a Neon project, it's added globally to your Neon account, which means that it's added to all of your Neon projects. This lets you use the app from any Neon project to connect a GitHub repository.
- During the installation, you will authorize the app on or selected repositories in your GitHub account. You'll be able to connect Neon projects to the GitHub repositories where the app is authorized.
- Also during the installation, you will select the Git repository you want to connect to the current Neon project.
- Connecting a Neon project to a GitHub repository does the following:
    - Creates a Neon API key in your Neon account for the selected repository.
    - Sets a `NEON_API_KEY` secret in the connected repository.
    - Sets a `PROJECT_ID` variable in the connected repository. 


When you connect a Neon project to a GitHub repository, the GitHub app sets variables in your GitHub repository and provides you with a sample GitHub Action that uses those variables to create a database branch with each pull request. The also deletes the branch when the pull request is closed.


## Building out your workflow

```yaml
  reset_neon_branch:
    name: Reset Neon Branch
    needs: setup
    if: |
      contains(github.event.pull_request.labels.*.name, 'Reset Neon Branch') &&
      github.event_name == 'pull_request' &&
      (github.event.action == 'synchronize' ||
       github.event.action == 'opened' ||
       github.event.action == 'reopened' ||
       github.event.action == 'labeled')
    runs-on: ubuntu-latest
    steps:
      - name: Reset Neon Branch
        uses: neondatabase/reset-branch-action@v1
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          parent: true
          branch: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}
```
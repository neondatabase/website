---
title: Setting up GitHub Codespaces with Neon Database Branching for Pull Requests
subtitle: Learn how to create separate development environments for each pull request using GitHub Codespaces and Neon's Postgres branching
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-08-18T00:00:00.000Z'
updatedOn: '2024-08-18T00:00:00.000Z'
---

When working on a team project, it's useful to have separate environments for each new feature or bug fix. This helps prevent conflicts and makes it easier to test changes. In this guide, we'll show you how to set up a process that creates a new development environment for each pull request. We'll use GitHub Codespaces for the coding environment and Neon's Postgres branching for the database.

By the end of this guide, you'll have a setup that automatically creates a new Codespace and a new database branch for each pull request. This means each change can be tested separately, making it easier to find and fix problems.

## What you'll need

Before we start, make sure you have:

- A GitHub account that can use Codespaces
- A [Neon](https://console.neon.tech/signup) account and project
- A Neon API key (you can learn how to get one [here](/docs/manage/api-keys#create-an-api-key))
- Basic knowledge of Git, GitHub Actions, and CI/CD

## Creating a new project

This process will work with any language or framework, but for this guide, we'll use [Laravel](/guides/laravel-overview).

Let's start by making a new Laravel project and putting it on GitHub.

1. First, create a new Laravel project:

```bash
composer create-project laravel/laravel codespaces-neon-demo
cd codespaces-neon-demo
```

This command creates a new Laravel project in a folder called `codespaces-neon-demo` then uses `cd` to access the new project.

2. Next, set up Git for this project:

```bash
git init
git add .
git commit -m "First commit: New Laravel project"
```

The above commands will initialize a new Git repository, add all the project files to it, and create the first commit.

3. Now, create a new repository on GitHub and upload your code:

```bash
git remote add origin https://github.com/<yourusername>/codespaces-neon-demo.git
git branch -M main
git push -u origin main
```

Replace `yourusername` with your actual GitHub username. These commands connect your local repository to GitHub and upload your code.

## Setting up GitHub Codespaces

Now we'll set up GitHub Codespaces. This will define the development environment that will be created for each pull request.

1. Make a new folder in your project for the Codespaces configuration:

```bash
mkdir .devcontainer
```

2. In this new folder, create a file called `devcontainer.json`:

```json
{
  "name": "Laravel Codespaces",
  "image": "mcr.microsoft.com/devcontainers/php:8.2",
  "customizations": {
    "vscode": {
      "extensions": [
        "felixfbecker.php-debug",
        "bmewburn.vscode-intelephense-client",
        "mikestead.dotenv",
        "amiralizadeh9480.laravel-extra-intellisense"
      ]
    }
  },
  "forwardPorts": [8000],
  "postCreateCommand": "cp .env.example .env && composer install && php artisan key:generate && .devcontainer/setup-db.sh",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {}
  }
}
```

This file tells GitHub Codespaces how to set up the development environment. Here's what each part does:

- `"name"`: This is just a name for the Codespace.
- `"image"`: This specifies the base Docker image to use. We're using a pre-built image with PHP 8.2.
- `"customizations"`: This section lists VS Code extensions to install.
- `"forwardPorts"`: This tells Codespaces which ports to make available.
- `"postCreateCommand"`: This runs commands after the Codespace is created. It installs PHP dependencies, generates an application key, and runs a setup script for the database.
- `"features"`: This adds Node.js to the environment.

## Setting up Neon Postgres

Now let's connect our project to a Neon Postgres database.

1. Go to the [Neon Console](https://console.neon.tech) and create a new project.

2. After creating the project, you'll see a connection string. Copy the details as you'll need them later.

3. Open the `.env` file in your Laravel project and update the database settings:

```env
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Replace the placeholders with the details from your Neon connection string.

4. Run the database migrations:

```bash
php artisan migrate
```

This command creates the necessary tables in your Neon database.

## Setting up GitHub Actions for Neon Branching

Now we'll set up GitHub Actions to create and delete Neon database branches automatically. First, we need to add your Neon API key to your GitHub repository:

1. In your GitHub repository, go to "Settings", then "Secrets and variables", then "Actions".
2. Click "New repository secret".
3. Name it `NEON_API_KEY` and paste your [Neon API key](/docs/manage/api-keys#create-an-api-key) as the value.
4. Click "Add secret".

Next, we'll create two GitHub Actions workflows: one to create a new Neon branch when a pull request is opened, and another to delete the branch when the pull request is closed.

### Workflow to Create a Branch

If you don't already have a `.github/workflows` directory, create one:

```bash
mkdir -p .github/workflows
```

Then create a file in this directory called `create-neon-branch.yml` with the following content:

```yaml
name: Create Neon Branch

on:
  pull_request:
    types: [opened, reopened]

jobs:
  create-branch:
    runs-on: ubuntu-latest
    steps:
      - uses: neondatabase/create-branch-action@v5
        with:
          project_id: your-neon-project-id
          branch_name: pr-${{ github.event.pull_request.number }}
          username: your-database-username
          api_key: ${{ secrets.NEON_API_KEY }}
        id: create-branch
      - run: echo ${{ steps.create-branch.outputs.db_url }}
      - run: echo ${{ steps.create-branch.outputs.branch_id }}
```

Replace `your-neon-project-id` and `your-database-username` with your actual Neon project ID and database username.

This workflow does the following:

- It runs when a pull request is opened or reopened thanks to the `on` section.
- It uses Neon's official action to create a new database branch.
- The branch name is based on the pull request number.
- It outputs the new branch's database URL and ID.

### Workflow to Delete a Branch

With the workflow to create a branch set up, let's create another one to delete the branch when the pull request is closed.

Create another file at `.github/workflows/delete-neon-branch.yml`:

```yaml
name: Delete Neon Branch

on:
  pull_request:
    types: [closed]

jobs:
  delete-branch:
    runs-on: ubuntu-latest
    steps:
      - uses: neondatabase/delete-branch-action@v3
        with:
          project_id: your-neon-project-id
          branch: pr-${{ github.event.pull_request.number }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

Again, replace `your-neon-project-id` with your actual Neon project ID.

This workflow:

- Runs when a pull request is closed.
- Uses Neon's action to delete the database branch associated with the pull request.

## Configuring Codespaces to Use Neon Branches

Now we need to tell Codespaces how to connect to the right database branch. Create a file called `setup-db.sh` in the `.devcontainer` directory:

```bash
#!/bin/bash

PR_NUMBER=$(echo $GITHUB_REF | sed 's/refs\/pull\/\([0-9]*\).*/\1/')

if [ -n "$PR_NUMBER" ]; then
    BRANCH_NAME="pr-$PR_NUMBER"

    # Use GitHub CLI to get the branch details
    BRANCH_DETAILS=$(gh api /repos/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID/jobs -H "Accept: application/vnd.github.v3+json" | jq -r '.jobs[] | select(.name == "create-branch") | .steps[] | select(.name == "Create Neon Branch") | .outputs.db_url')

    if [ -n "$BRANCH_DETAILS" ]; then
        # Parse the connection string
        DB_HOST=$(echo $BRANCH_DETAILS | sed -n 's/.*@\(.*\):.*/\1/p')
        DB_NAME=$(echo $BRANCH_DETAILS | sed -n 's/.*\/\(.*\)?.*/\1/p')
        DB_USER=$(echo $BRANCH_DETAILS | sed -n 's/.*:\/\/\(.*\):.*/\1/p')
        DB_PASSWORD=$(echo $BRANCH_DETAILS | sed -n 's/.*:\/\/.*:\(.*\)@.*/\1/p')

        # Update the .env file
        sed -i "s/DB_HOST=.*/DB_HOST=$DB_HOST/" .env
        sed -i "s/DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env
        sed -i "s/DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env

        echo "Updated .env file with PR-specific database details"
    else
        echo "No branch details found for PR $PR_NUMBER"
    fi
else
    echo "This is not a PR environment, using default database settings"
fi

# Run database migrations
php artisan migrate --force
```

The script does the following:

- It checks if we're in a pull request environment.
- If we are, it gets the details of the newly created database branch.
- It updates the `.env` file with these details.
- Finally, it runs database migrations.

Make sure to make this script executable:

```bash
chmod +x .devcontainer/setup-db.sh
```

After setting up these files, commit and push your changes to GitHub:

```bash
git add .
git commit -m "Add GitHub Actions and Codespaces configuration"
git push origin main
```

With everything set up, you can now create a new branch in your project, open a pull request, and see the new Codespace and database branch in action.

## How to Use This Setup

With everything set up, here's how you would use this in your development process:

1. Create a new branch in your project and make your changes:

   - Create and switch to a new branch: `git checkout -b feature-branch-name`
   - Make your changes to the code
   - Commit your changes: `git add .` and `git commit -m "Description of changes"`
   - Push your branch to GitHub: `git push -u origin feature-branch-name`

2. Open a pull request with your changes:

   - Go to your repository on GitHub
   - Click on "Pull requests" then "New pull request"
   - Select your feature branch as the compare branch
   - Click "Create pull request"
   - Fill in the title and description, then click "Create pull request"

3. GitHub Actions will automatically create a new Neon database branch for your pull request:

   - This happens automatically when the pull request is opened
   - You can check the "Actions" tab in your GitHub repository to see the progress
   - Once complete, you'll see a new branch in your Neon console named `pr-[number]`

4. Open a Codespace for this pull request:

   - On the pull request page, click the "Code" dropdown
   - Select "Open with Codespaces"
   - Click "New codespace"
   - Wait for the Codespace to build and start

5. Test your changes in the isolated environment:

   - The Codespace is now connected to your PR-specific database branch
   - Run your application: `php artisan serve`
   - Run tests: `php artisan test`
   - Make additional changes if needed, commit, and push

6. Review and merge the pull request:

   - Once you're satisfied with the changes, request a review if required
   - Reviewers can open their own Codespaces to test the changes
   - When ready, merge the pull request on GitHub

7. Automatic cleanup:
   - When the pull request is closed (either merged or declined), GitHub Actions will automatically delete the associated Neon database branch
   - You can verify this in your Neon console

## Keeping Things Secure

It's important to keep your project and its data safe:

1. Never share your Neon API key. Always use GitHub Secrets to store it.
2. Be careful about what information you put in public repositories.
3. Regularly change your API keys and check who has access to what.

## Conclusion

By setting up GitHub Codespaces with Neon database branching, you've created a system that gives each pull request its own complete development environment. This can help your team work more effectively by making it easier to test changes and avoid conflicts.

This workflow can be adapted to work with other languages and frameworks. You can also add more steps to the GitHub Actions workflows to suit your specific needs like running tests, deploying to staging environments, or sending notifications.

## Where to Learn More

- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Neon Documentation](/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

<NeedHelp />

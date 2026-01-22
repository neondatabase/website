---
author: paul-scanlon
enableTableOfContents: true
createdAt: '2025-03-01T00:00:00.000Z'
updatedOn: '2025-03-01T00:00:00.000Z'
title: How to use self-hosted runners with GitHub Actions
subtitle: Take full control of your GitHub Action's runner environment with DigitalOcean
---

In this guide, I'll walk you through setting up a Linux server on a DigitalOcean Droplet with Ubuntu installed, which you can use as a self-hosted runner for GitHub Actions.

## What is a self-hosted runner?

[Self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#about-self-hosted-runners) work similarly to GitHub's default runners, but with the key difference that you manage the server yourself. While the default runners are convenient, they come with some limitations—most notably, they timeout after six hours.

This can be a challenge for long-running jobs, particularly for users of our [Neon Twin](docs/guides/neon-twin-intro) workflow who may encounter issues with large databases. In these scenarios, setting up your own self-hosted runner is a more reliable solution.

<CTA title="Create a Neon Twin" description="A Neon Twin is a full or partial clone of your production or staging database, providing developers and teams with isolated, sandboxed environments that closely mirror production. <br><br>Learn how to create a Twin <a href='/docs/guides/neon-twin-intro'>here</a>." isIntro />

GitHub's default runners come with several preinstalled packages and dependencies, which you can review in the [GitHub runner-images repository README](https://github.com/actions/runner-images?tab=readme-ov-file#package-managers-usage). The default runner image also includes specific user permissions. To set up an effective self-hosted runner, you'll need to manually configure these packages, dependencies, and permissions. But don't worry—I'll guide you through each step.

## Getting started with Digital Ocean

If you don't have a Digital Ocean account already, create one [here](https://cloud.digitalocean.com/registrations/new). You will need to enter payment details before continuing to the next step.

### Create a Droplet

From the navigation list on the left hand side select **Droplets**, then click **Create Droplet**.

![Screenshot of Digital Ocean Create Droploet](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-create-droplet.jpg)

On the next screen you'll have a number of options to choose from. In this example I'll be deploying the Droplet to Digital Ocean's New York **Datacenter** and using **Ubuntu** for the Droplet **image**.

![Screenshot of Digital Ocean Droplet Config - Datacenter](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-droplet-config-1.jpg)

Scroll down to the next section and choose the **Droplet Size** and **CPU Options**. In ths example, I've chosen to use a **Shared CPU** and The smallest **Disk size**.

![Screenshot of Digital Ocean Droplet Config - CPU Size](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-droplet-config-2.jpg)

The next step is to select an authentication method. Choose **Password** and set a password that you'll use to log in as the `root` user.

![Screenshot of Digital Ocean Droplet Config - Auth Method](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-auth-method.jpg)

The final step is to give your Droplet a name—I've chosen `self-hosted-actions-runner`. This name will appear in the GitHub UI, which I'll explain in a later step. Once you're ready, click **Create Droplet**.

![Screenshot of Digital Ocean Droplet Config- Droplet Name](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-droplet-name.jpg)

After your Droplet is created, it will appear in the DigitalOcean UI. From there, you can copy the **IP address**, which you'll need for the next step.

![Screenshot of Digital Ocean Droplet Config- Droplet IP](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-droplet-ip.jpg)

## Configure Droplet

Now that your Droplet is created, run the following command in your terminal to log in as the `root` user. You'll be prompted for your password—enter it to complete the login.

```shell
ssh root@<Your Droplet's IP address>
```

## Create a new user

It's generally not recommended to provide external services with `root` access to your server. In this step, you'll create a new user named `runneruser` and grant it the necessary privileges to function as a self-hosted runner for GitHub Actions.

In your terminal, run the following command to create the `runneruser` and set a password.

```shell
adduser runneruser
```

You'll be asked to re-enter the password. For the following prompts, you can simply press `ENTER` to accept the default values for fields like `Full Name`, `Room Number`, `Work Phone`, and so on. When prompted, press `Y` to confirm that all the information is correct.

### Add user to sudo group

The `runneruser` needs to be added to the `sudo` group and granted permission to install packages without being prompted for a password.

To add the `runneruser` to the sudo group, run the following command in your terminal.

```shell
adduser runneruser sudo
```

Next you need to update the permissions. To do this run the following in the terminal.

```shell
visudo
```

### Granting privileges

Scroll down until you find the following section, then update the configuration to grant `runneruser` permission to execute specific `sudo` commands.

In this guide, I’m allowing `runneruser` to:

- Use the `apt` command
- Run a specific command to install the `postgresql-common` package
- Execute these commands without being prompted for a password using `NOPASSWD`

The exact permissions you need to grant will depend on the specific requirements of your Action.

```shell {3}
# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL
runneruser ALL=(ALL) NOPASSWD: /usr/bin/apt, /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
```

To exit `visudo`, press `^X` and confirm the changes. Once you're done, log out as the `root` user by typing `exit` in your terminal.

## Log in as runneruser

Now that the `runneruser` has been created, you can log in to configure the system for the self-hosted runner. Run the following command in your terminal to log in as `runneruser`.

```shell
ssh runneruser@<Your Droplet's IP address>
```

After logging in, got back to GitHub and navigate to **Settings** > **Actions** > **Runners**, then click **New self-hosted runner**.

From the options select **Linux** under the **Runner Image** section and **x64** in the **Architecture** section.

![Screenshot of GitHub - Self-hosted Runners](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-github-runner-instructions.jpg)

Follow the **Download** and **Configure** steps. When you reach the final step, **Create the runner and start the configuration experience**, press **Enter** to accept the default options. However, skip the last step, which runs `./run.sh`—I'll explain why next.

### Running the Self-Hosted Runner

While running `./run.sh` is the simplest way to start your self-hosted runner on your Droplet, it operates as a foreground process. This means that once you close your terminal, the runner stops. If you intend to use the runner for long-running workflows, you’ll need to ensure it runs in the background.

To do this, you can set up your self-hosted runner to run as a service. This involves an additional setup step, and the method for starting the service is slightly different, but it guarantees the runner continues to operate in the background even after you close your terminal.

For further details, refer to the GitHub documentation: [Configuring the self-hosted runner application as a service](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service#installing-the-service). Just keep in mind, you'll need to change directories before running any of the commands listed on that page.

To change the directory, run the following in your terminal:

```shell
cd actions-runner
```

After completing these steps, refresh the GitHub page. Your Droplet should now appear in the UI with an **Idle** status.

![Screenshot of GitHub - Runner Idle](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-github-runner-idle.jpg)

## Creating a test GitHub Action

This test Action installs Postgres using [APT](<https://en.wikipedia.org/wiki/APT_(software)>), then echoes both the `DEV_DATABASE_URL`'s Postgres version and the version of Postgres installed in the Action environment.

To use this Action, you'll need to create an environment variable named `DEV_DATABASE_URL` with a valid Postgres connection string and add it to your GitHub Repository Secrets.

To do this navigate to **Settings** > **Secrets and variables** > **Actions** and add the environment variable under **Repository secrets**.

![Screenshot of GitHub - Repository secrets](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-github-screts.jpg)

One key detail to note is the line: `runs-on: self-hosted`. This tells GitHub that the Action should run on your self-hosted runner rather than the default shared infrastructure.

```yml
name: Self Hosted Runner

on:
  workflow_dispatch:

env:
  DEV_DATABASE_URL: ${{ secrets.DEV_DATABASE_URL }}
  PG_VERSION: 16

jobs:
  check-pg-version:
    runs-on: self-hosted

    steps:
      - name: Install PostgreSQL Common Package
        run: |
          sudo apt update
          sudo apt install -y postgresql-common

      - name: Install PostgreSQL
        run: |
          sudo apt update
          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
          sudo apt install -y postgresql-${{ env.PG_VERSION }}

      - name: Set PostgreSQL binary path
        run: echo "POSTGRES=/usr/lib/postgresql/${{ env.PG_VERSION }}/bin" >> $GITHUB_ENV

      - name: PostgreSQL version
        run: |
          "$POSTGRES/psql" "$DEV_DATABASE_URL" -c "SELECT version();"

      - name: Check psql Version
        run: |
          $POSTGRES/psql --version
```

## Finished

While this Action may seem somewhat complex, it effectively demonstrates how the steps within the workflow align with the permissions set on the Droplet.

Only the commands explicitly allowed for `runneruser` are permitted to run. If you need to add more steps to your Action that require extra permissions, you’ll need to update `runneruser`'s sudo privileges accordingly.

That said, with a self-hosted runner, you have full control. You can deploy a high-performance Droplet capable of running longer and faster than GitHub's default shared infrastructure runner, helping to overcome any limitations you may have encountered.

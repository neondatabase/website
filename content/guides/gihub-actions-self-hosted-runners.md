---
author: paul-scanlon
enableTableOfContents: true
createdAt: '2025-03-01T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
title: How to use self-hosted runners with GitHub Actions
subtitle: Control your GitHub Actions runner environment with DigitalOcean
---

In this guide, I'll walk you through setting up a Linux server on a DigitalOcean Droplet with Ubuntu installed, which you can use as a self-hosted runner for GitHub Actions.

## What is a self-hosted runner?

[Self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#about-self-hosted-runners) work similarly to GitHub's default runners, but with the key difference that you manage the server yourself. The default runners are convenient but have limits; most notably, jobs time out after six hours.

That limit is a problem for long-running jobs, particularly for users of the [Neon Twin](/docs/guides/neon-twin-intro) workflow with large databases. In these cases, a self-hosted runner avoids the timeout.

<CTA title="Create a Neon Twin" description="A Neon Twin is a full or partial clone of your production or staging database, providing developers and teams with isolated, sandboxed environments that closely mirror production. <br><br>Learn how to create a Twin <a href='/docs/guides/neon-twin-intro'>here</a>." />

GitHub's default runners come with several preinstalled packages and dependencies, which you can review in the [GitHub runner-images repository README](https://github.com/actions/runner-images?tab=readme-ov-file#package-managers-usage). The default runner image also includes specific user permissions. On a self-hosted runner, you configure these packages, dependencies, and permissions yourself. I'll walk you through each step.

## Get started with DigitalOcean

If you don't have a DigitalOcean account already, [create one](https://cloud.digitalocean.com/registrations/new). You will need to enter payment details before continuing to the next step.

### Create a Droplet

From the navigation list on the left-hand side, select **Droplets**, then click **Create Droplet**.

![Screenshot of DigitalOcean Create Droplet](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-create-droplet.jpg)

On the next screen you'll have a number of options to choose from. In this example, I'll deploy the Droplet to DigitalOcean's New York **Datacenter** and using **Ubuntu** for the Droplet **image**.

![Screenshot of DigitalOcean Droplet Config - Datacenter](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-droplet-config-1.jpg)

Scroll down to the next section and choose the **Droplet Size** and **CPU Options**. In this example, I've chosen a **Shared CPU** and the smallest **Disk size**.

![Screenshot of DigitalOcean Droplet Config - CPU Size](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-droplet-config-2.jpg)

The next step is to select an authentication method. Choose **Password** and set a password that you'll use to log in as the `root` user.

![Screenshot of DigitalOcean Droplet Config - Auth Method](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-auth-method.jpg)

The final step is to give your Droplet a name; I've chosen `self-hosted-actions-runner`. This name will appear in the GitHub UI, which I'll explain in a later step. Once you're ready, click **Create Droplet**.

![Screenshot of DigitalOcean Droplet Config - Droplet Name](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-droplet-name.jpg)

After your Droplet is created, it will appear in the DigitalOcean UI. From there, you can copy the **IP address**, which you'll need for the next step.

![Screenshot of DigitalOcean Droplet Config - Droplet IP](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-droplet-ip.jpg)

## Configure the Droplet

Now that your Droplet is created, run the following command in your terminal to log in as the `root` user. You'll be prompted for your password; enter it to complete the login.

```shell
ssh root@<Your Droplet's IP address>
```

## Create a new user

Avoid giving external services `root` access to your server. In this step, you'll create a new user named `runneruser` and grant it the necessary privileges to function as a self-hosted runner for GitHub Actions.

In your terminal, run the following command to create the `runneruser` and set a password.

```shell
adduser runneruser
```

You'll be asked to re-enter the password. For the following prompts, press `ENTER` to accept the default values for fields like `Full Name`, `Room Number`, `Work Phone`, and so on. When prompted, press `Y` to confirm that all the information is correct.

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

### Grant privileges

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

## Log in as `runneruser`

Now that the `runneruser` has been created, you can log in to configure the system for the self-hosted runner. Run the following command in your terminal to log in as `runneruser`.

```shell
ssh runneruser@<Your Droplet's IP address>
```

After logging in, go back to GitHub and navigate to **Settings** > **Actions** > **Runners**, then click **New self-hosted runner**.

From the options select **Linux** under the **Runner Image** section and **x64** in the **Architecture** section.

![Screenshot of GitHub - Self-hosted Runners](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-github-runner-instructions.jpg)

Follow the **Download** and **Configure** steps. When you reach the final step, **Create the runner and start the configuration experience**, press **Enter** to accept the default options. However, skip the last step, which runs `./run.sh`; I'll explain why next.

### Run the self-hosted runner

Running `./run.sh` is the simplest way to start your self-hosted runner, but it runs as a foreground process, so the runner stops when you close your terminal. For long-running workflows, the runner needs to run in the background.

To do this, set up the self-hosted runner as a service. This takes an extra setup step and a different start command, but the runner keeps running after you close your terminal.

For further details, refer to the GitHub documentation: [Configuring the self-hosted runner application as a service](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service#installing-the-service). You'll need to change directories before running any of the commands listed on that page.

To change the directory, run the following in your terminal:

```shell
cd actions-runner
```

After completing these steps, refresh the GitHub page. Your Droplet should now appear in the UI with an **Idle** status.

![Screenshot of GitHub - Runner Idle](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-github-runner-idle.jpg)

## Create a test GitHub Action

This test Action installs Postgres using [APT](<https://en.wikipedia.org/wiki/APT_(software)>), then echoes both the `DEV_DATABASE_URL`'s Postgres version and the version of Postgres installed in the Action environment.

To use this Action, you'll need to create an environment variable named `DEV_DATABASE_URL` with a valid Postgres connection string and add it to your GitHub Repository Secrets.

To do this navigate to **Settings** > **Secrets and variables** > **Actions** and add the environment variable under **Repository secrets**.

![Screenshot of GitHub - Repository secrets](/guides/images/gihub-actions-self-hosted-runners/gihub-actions-self-hosted-runners-github-screts.jpg)

Note the line `runs-on: self-hosted`. This tells GitHub that the Action should run on your self-hosted runner rather than the default shared infrastructure.

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

This Action shows how the steps in the workflow line up with the permissions set on the Droplet.

Only the commands explicitly allowed for `runneruser` are permitted to run. If you need to add more steps to your Action that require extra permissions, you’ll need to update `runneruser`'s sudo privileges accordingly.

With a self-hosted runner, you choose the hardware. You can deploy a larger Droplet that runs jobs longer and faster than GitHub's default runners.

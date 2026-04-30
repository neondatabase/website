---
title: Building Slack notifications to monitor pg_dump and restore workflows
description: >-
  Automate nightly dump/restores from RDS to Neon and get real-time job status
  alerts via Slack
excerpt: "\U0001F4DA This article is part of a series on setting up Neon for dev, test, and staging environments while keeping your prod database in RDS. Find out what we’re talking about. In a previous blog post, we showed you how to create a Neon Twin using a GitHub Action that automatically run..."
date: '2024-08-01T16:36:26'
updatedOn: '2025-05-06T09:53:56'
category: workflows
categories:
  - workflows
authors:
  - rishi-raj-jain
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Building Slack notifications to monitor pg_dump and restore workflows - Neon
  description: >-
    Learn how to set up Slack notifications for monitoring the status of your
    Postgres pg_dump and restore jobs.
  keywords: []
  noindex: false
  ogTitle: Building Slack notifications to monitor pg_dump and restore workflows - Neon
  ogDescription: >-
    Learn how to set up Slack notifications for monitoring the status of your
    Postgres pg_dump and restore jobs.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/social.jpg
source:
  wpId: 6556
  wpSlug: building-slack-notifications-to-monitor-pg_dump-and-restore-workflows
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/neon-slack-1024x576-43860fff.jpg)

> 📚 **This article is part of a series on setting up Neon for dev, test, and staging environments while keeping your prod database in RDS.** [Find out what we’re talking about.](https://neon.tech/blog/development-environments-for-aws-rds-using-neon-postgres)

In a [previous blog post](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon), we showed you how to create a Neon Twin using a GitHub Action that automatically runs a pg_dump of your RDS production database and restores it to Neon on a recurring nightly schedule.

In this blog post, we’ll guide you through setting up a Slack Webhook to send notifications to a public Slack channel. This will inform your team about the latest pg_dump and restore activities.

By using Slack instead of relying on GitHub email notifications, you can avoid the need to add every developer who needs this information to the GitHub Repository where the Action runs.

We’ll also cover how to surface more detailed information about the dump and restore including the database name, size how long the job took to complete, and how to handle failures.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-slack-notifications-1024x640-486d273e.jpg" alt="Image" />
<figcaption>How the success/failure messages will look like in your Slack</figcaption>
</figure>

## Prerequisites

Before diving in, ensure you have the following:

- **Completion of previous steps.** Make sure you have completed [all the steps outlined in the previous article](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon), particularly the setup of the Neon Twin and the GitHub Action for pg_dump and restore.
- **Slack API admin access.** You’ll need administrator privileges to your company’s Slack workspace to create and manage Slack apps and webhooks.
- **GitHub repo access.** Ensure you have access to the GitHub repository where the Actions will run, including permissions to manage Actions and Secrets.

## Quick start

**👉 All the code shown in this article can be found on this GitHub repo:** [create-neon-twin-slack.yml.](https://github.com/neondatabase/rds-to-neon-twin)

There are two additional Actions that you might like to use for reference:

- [create-neon-twin-default.yml](https://github.com/neondatabase/rds-to-neon-twin/blob/main/.github/workflows/create-neon-twin-default.yml): A simple workflow that handles just a pg_dump and restore
- [create-neon-twin-ssl.yml](https://github.com/neondatabase/rds-to-neon-twin/blob/main/.github/workflows/create-neon-twin-ssl.yml): An example of how to handle SSL Certificates as outlined in this community blog post: [How to Use PostgreSQL SSL certificates in GitHub Actions](https://www.paulie.dev/posts/2024/07/how-to-use-postgresql-ssl-certificates-in-github-actions/).

## How to build Slack notifications to monitor pg_dump and restores

In this section, we will guide you through how to set up Slack notifications for monitoring your pg_dump and restore workflows. The process looks like this:

1. Creating a Slack channel in your company’s Slack workspace for receiving notification
2. Setting up and configuring a Slack App using the Slack developer console
3. Modify your existing GitHub Actions workflow ([from the previous blog post](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon))
4. Develop JavaScript functions to post formatted notifications to your Slack channel
5. Commit changes and deploy the action

Let’s get to it.

### Create the Slack channel

To start, set up a dedicated channel in your company’s Slack workspace for receiving notifications. For this example, we’ll use the channel name **#rds-to-neon-twin.**

### Create a Slack app

[We’ll use the Slack developer console to create and configure an app.](https://api.slack.com/apps) This involves naming the app, granting it access to your Slack workspace, and generating a Webhook URL for sending notifications.

If you have administrator privileges to your company’s Slack account, head over to [https://api.slack.com/apps](https://api.slack.com/apps) and click **Create New App**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-create-slack-app-1-1024x640-b10bb380.jpg)

#### Create Slack app from manifest

From the available options select, **From an app manifest**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-create-slack-app-2-1024x640-49d7ad23.jpg)

#### Select workspace

From the dropdown list: **Pick a workspace to develop your app**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-create-slack-app-3-1024x640-9abd0648.jpg)

#### Slack app name

Edit the JSON data and give your application a **name**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-create-slack-app-4-1024x640-766b7544.jpg)

#### App summary

Click **Create** to finish creating your Slack application.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-create-slack-app-5-1024x640-d4a416c3.jpg)

#### Basic Information

With your app created, navigate to: **Basic Information** from the sidebar and update the **Display Information**. These details will be visible when you add the app to your company’s Slack workspace.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-create-slack-app-6-1024x640-ee0f1c6a.jpg)

#### Active Slack webhooks

Navigate to: **Incoming Webhook** and click the toggle switch to **On**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-slack-webhook-1-1024x640-049687e9.jpg)

#### Add webhook to workspace

On the same page, scroll down and click the **Add New Webhook to Workspace** button.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-slack-webhook-2-1024x640-febe2f09.jpg)

#### Select channel

From the dropdown list select the channel you’d like to post notification to.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-slack-webhook-3-1024x640-935ac7a9.jpg)

#### Webhook URL

You will now be able to **Copy** the Webhook URL. Add this as an env var in your project and name it `SLACK_WEBHOOK_URL` as you’ll need this in the next step.

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/article-3-images-slack-webhook-4-1024x640-2f55b4b4.jpg)

### Update GitHub Action

Now, it’s time to update the workflow we set up [in the previous blog post.](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon) To post a notification to Slack with information about the pg_dump/restore job there are a number of additions that need to be made to the .yml file, and three new JavaScript files that are responsible for posting a formatted message to Slack for both success and failure scenarios.

To begin with, add the following to your .yml file and we’ll explain what each part is for.

```yaml
name: Create Neon Twin

on:
  schedule:
    - cron: '0 0 * * *' # Runs at midnight ET (us-east-1)
  workflow_dispatch: # Enable manual triggering

env:
  PROD_DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }} # Production or primary database
  DEV_DATABASE_URL: ${{ secrets.DEV_DATABASE_URL }} # Development database
  PG_VERSION: '17'
  SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} // [!code ++]
  NODE_VERSION: '20.x' // [!code ++]

jobs:
  capture-start-time: // [!code ++]
    runs-on: ubuntu-latest // [!code ++]

    steps: // [!code ++]
      - name: Capture start time // [!code ++]
        id: capture-start-time // [!code ++]
        run: | // [!code ++]
          echo "start_time=$(date --utc +"%Y-%m-%dT%H:%M:%SZ")" >> $GITHUB_OUTPUT // [!code ++]

    outputs: // [!code ++]
      start_time: ${{ steps.capture-start-time.outputs.start_time }} // [!code ++]

  dump-and-restore:
    runs-on: ubuntu-latest
    needs: // [!code ++]
      - 'capture-start-time' // [!code ++]

    steps:
      - name: Install PostgreSQL
        run: |
          sudo apt update
          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
          sudo apt install -y postgresql-${{ env.PG_VERSION }}

      - name: Set PostgreSQL binary path
        run: echo "POSTGRES=/usr/lib/postgresql/${{ env.PG_VERSION }}/bin" >> $GITHUB_ENV

      - name: Dump from RDS and Restore to Neon
        run: |
          $POSTGRES/pg_dump "${{ env.PROD_DATABASE_URL }}" -Fc -f "${{ github.workspace }}/prod-dump-file.dump"
          $POSTGRES/pg_restore -d "${{ env.DEV_DATABASE_URL }}" --clean --no-owner --no-acl --if-exists "${{ github.workspace }}/prod-dump-file.dump"

  db-query: // [!code ++]
    runs-on: ubuntu-latest // [!code ++]
    needs: // [!code ++]
      - dump-and-restore // [!code ++]

    steps: // [!code ++]
      - name: Install PostgreSQL // [!code ++]
        run: | // [!code ++]
          sudo apt update // [!code ++]
          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh // [!code ++]
          sudo apt install -y postgresql-${{ env.PG_VERSION }} // [!code ++]

      - name: Set PostgreSQL binary path // [!code ++]
        run: echo "POSTGRES=/usr/lib/postgresql/${{ env.PG_VERSION }}/bin" >> $GITHUB_ENV // [!code ++]

      - name: Database Query // [!code ++]
        id: db-query // [!code ++]
        run: | // [!code ++]
          echo "database_size=$($POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -t -c "SELECT pg_database_size(current_database());")" >> $GITHUB_OUTPUT // [!code ++]
          echo "database_name=$($POSTGRES/psql "${{ env.PROD_DATABASE_URL }}" -t -c "SELECT current_database();")" >> $GITHUB_OUTPUT // [!code ++]

    outputs: // [!code ++]
      database_size: ${{ steps.db-query.outputs.database_size }} // [!code ++]
      database_name: ${{ steps.db-query.outputs.database_name }} // [!code ++]

  capture-end-time: // [!code ++]
    runs-on: ubuntu-latest // [!code ++]
    needs: // [!code ++]
      - db-query // [!code ++]

    steps: // [!code ++]
      - name: Capture end time // [!code ++]
        id: capture-end-time // [!code ++]
        run: | // [!code ++]
          echo "end_time=$(date --utc +"%Y-%m-%dT%H:%M:%SZ")" >> $GITHUB_OUTPUT // [!code ++]

    outputs: // [!code ++]
      end_time: ${{ steps.capture-end-time.outputs.end_time }} // [!code ++]

  post-to-slack-success: // [!code ++]
    runs-on: ubuntu-latest // [!code ++]
    needs: // [!code ++]
      - capture-start-time // [!code ++]
      - db-query // [!code ++]
      - capture-end-time // [!code ++]
    if: ${{ success() }} // [!code ++]

    env: // [!code ++]
      DATABASE_SIZE: ${{ needs.db-query.outputs.database_size }} // [!code ++]
      DATABASE_NAME: ${{ needs.db-query.outputs.database_name }} // [!code ++]
      JOB_START_TIME: ${{ needs.capture-start-time.outputs.start_time }} // [!code ++]
      JOB_END_TIME: ${{ needs.capture-end-time.outputs.end_time }} // [!code ++]

    steps: // [!code ++]
      - name: Checkout repository // [!code ++]
        uses: actions/checkout@v4 // [!code ++]

      - name: Install dependencies // [!code ++]
        run: npm ci // [!code ++]

      - name: Run Success script // [!code ++]
        run: | // [!code ++]
          node src/slack-success.js // [!code ++]

  post-to-slack-failure: // [!code ++]
    runs-on: ubuntu-latest // [!code ++]
    needs: // [!code ++]
      - dump-and-restore // [!code ++]
      - db-query // [!code ++]
    if: ${{ failure() }} // [!code ++]

    steps: // [!code ++]
      - name: Checkout repository // [!code ++]
        uses: actions/checkout@v4 // [!code ++]

      - name: Install dependencies // [!code ++]
        run: npm ci // [!code ++]

      - name: Run Failure script // [!code ++]
        run: | // [!code ++]
          node src/slack-failure.js // [!code ++]
```

#### Environment variables

There are two new variables this action needs. The Slack Webhook URL from the previous step (this one also needs to be added to your GitHub Secrets) and a Node version which is set “globally” so that later steps can run the success and failure JavaScript scripts.

#### Capture start time

The `capture-start-time` job does as the name describes and captures the time the job started. Using GitHub Actions `outputs`, the value of the current time is stored as `start_time` so it can be referenced by the `post-to-slack-success`, which we’ll explain in a later step.

#### Query database

The `db-query` job is where you can query the production database and determine the `database_size`, and `database_name`. You could perform any queries in this job that suit your needs. Both values are stored as outputs so they can also be referenced by the `post-to-slack-success` job. This job `needs` the `dump-and-restore` job.

#### Capture end time

Similar to the start time job this job captures the value of the current time and stores it as `end_time` so it can also be referenced by the `post-to-slack-success` job.

#### Post success

This job is triggered by GitHub Actions built in `if: $\{\{ success() \}\}` condition. Only if the previous jobs as defined by `needs` are successful will this job run. The four environment variables are set using values from the previous jobs. They are:

- DATABASE_SIZE
- DATABASE_NAME
- JOB_START_TIME
- JOB_END_TIME

Setting environment variables in this way makes them available to JavaScript / Node environments.

The last part of this job is to run the `src/slack-success-.js` file which we’ll cover in a moment.

#### Post failure

Similar to the success job, this job is triggered by `if: $\{\{ failure() \}\}` and is only run if any of the previous jobs defined by `needs` fail. Unlike the success job, there are no environment variables.

The last part runs the `src/slack-failure.js` file which we’ll cover in the following steps.

### Create Slack notification scripts

To complete the setup, we need to create the scripts that will handle sending notifications to Slack. There are three essential files required for this:

- **src/slack-success.js:** This script is triggered when all jobs complete successfully and sends a success notification to the Slack channel.
- **src/slack-failure.js:** This script is triggered when any job fails and sends a failure notification to the Slack channel.
- **src/format-date.js:** A utility function to format the date and time values captured by the previous jobs.

Additionally, you need to install the [dotenv](https://www.npmjs.com/package/dotenv) dependency to allow these scripts to access your environment variables and GitHub Secrets.

To install the dependency, run:

```bash
npm install dotenv
```

#### Format date

Create a directory named `src`, then create a file named `format-date.js` and add the following code.

```javascript
// src/format-date.js

const formatDate = (dateString) => {
  const date = new Date(dateString).toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  });

  const time = new Date(dateString).toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });

  return {
    date,
    time,
  };
};

export default formatDate;
```

#### Slack success

Create a file named `slack-success.js` and add the following code. This file is used when all jobs complete successfully.

```javascript
// src/slack-success.js

import dotenv from 'dotenv';
dotenv.config();

import formatDate from './format-date.js';

const init = async () => {
  const bytes = parseInt(process.env.DATABASE_SIZE, 10) || 0;
  const gigabytes = (bytes / (1024 * 1024 * 1024)).toFixed(2);
  const name = process.env.DATABASE_NAME || 'undefined';
  const start = new Date(process.env.JOB_START_TIME) || new Date();
  const end = new Date(process.env.JOB_END_TIME) || new Date();
  const duration = end - start;
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  try {
    fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '☝️ A new Neon Twin is available!',
              emoji: true,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: `Created: ${formatDate(start).date}`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `• Size: ${gigabytes} GB\n• Name: ${name}\n• Start: ${formatDate(start).time}\n• End: ${
                  formatDate(end).time
                }\n• Duration: ${hours} hours, ${minutes} minutes, ${seconds} seconds\n`,
              },
            ],
          },
        ],
      }),
    });
  } catch (error) {
    console.error(error);
  }
};

init();
```

The above code will create a formatted message using Slack special message syntax and includes information about your job. The message that appears in Slack will look similar to the below. You can read more about posting messages in the [Slack documentation](https://api.slack.com/messaging/webhooks#advanced_message_formatting).

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/ad4nxepagt-o9oztk0l2dh7ka5mtrl8wzdsk-plft6w5zg06syrvlp18y9synsfu26fbibqqnsj9vruq3z7d7sqiiyun3kyb4powmr6oboe6d2hu7actfe0apqxrpfhabwpc5liu7pk3jmf7fyfkcxqtw8s2xpn-8413a656.png)

You can use [Slack’s Block Kit Builder](https://app.slack.com/block-kit-builder/T070FFUDNH3#%7B%22blocks%22:%5B%7B%22type%22:%22header%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22%E2%98%9D%EF%B8%8F%20A%20new%20Neon%20Twin%20is%20available!%22,%22emoji%22:true%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Created:%20Wednesday,%20July%2010,%202024%22,%22emoji%22:true%7D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22%E2%80%A2%20List%20item%201%5Cn%E2%80%A2%20List%20Item%202%5Cn%22%7D%7D%5D%7D) to create a message format that suits your needs and or create different environment variables that can be used to surface important information within the message.

#### Slack failure

Create a file named `slack-failure.js` and add the following code. This file is used when any jobs fail.

```javascript
// src/slack-failure.js

import dotenv from 'dotenv';
dotenv.config();

import formatDate from './format-date.js';

const init = async () => {
  try {
    fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🚨 A Neon Twin failed',
              emoji: true,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: `Failed: ${formatDate(new Date()).date}`,
            },
          },
        ],
      }),
    });
  } catch (error) {
    console.error(error);
  }
};

init();
```

The above code will create a formatted message using Slack special message syntax but doesn’t include information about your job. The message that appears in Slack will look similar to the below. You can read more about posting messages in the [Slack documentation](https://api.slack.com/messaging/webhooks#advanced_message_formatting).

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/ad4nxclo6hsxxbrwurfqi0xp8wivdligvya7dljr8rv1dq99c1z5rtfmrtqmzdbn2bc-egsmfn1qfet9r1zrzhdrbfzszyafrhxfptqgrrjfdhvkhqmqz4pcdcr4uaaaai08741k96xwyixl7xgz3jyyof8y-3178f9dd.png)

You can use [Slack’s Block Kit Builder](https://app.slack.com/block-kit-builder/T070FFUDNH3#%7B%22blocks%22:%5B%7B%22type%22:%22header%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22%F0%9F%9A%A8%20A%20Neon%20Twin%20failed%22,%22emoji%22:true%7D%7D,%7B%22type%22:%22divider%22%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Failed:%20Thursday,%20July%2011,%202024%22,%22emoji%22:true%7D%7D%5D%7D) to create a message format that suits your needs.

### Deploy Action

The final step is to commit your changes and deploy the action. To complete the deployment,

1. Navigate to your GitHub repo
2. Go to **Settings > Secrets and variables > Actions**
3. Click on **New repository secret**
4. Add the following environment variable: `SLACK_WEBHOOK_URL`

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/ad4nxckvr2ute97kqpyvshjbjqcpsdy3blg2ttztqqenjzmsqc4m9ptifs9pi3jjjw9mutpximemdr71d3cxvlcl2ao4pgfjtv-jxm8tvqgj64rjcrppj8u5mz6luqlrgtifnl7fn6cilqus6ojxgctboeaetj1-4fadfa0e.png)

During development, you can manually trigger the workflow from the GitHub UI:

1. Navigate to **Actions** in your repository
2. Select the **create-neon-twin** workflow
3. Click on **Run** workflow

And you can run the JavaScript files directly from your terminal for testing, although some environment variables, `DATABASE_SIZE`, `JOB_START_TIME`, etc, won’t be available.

```javascript
node src/slack-failure.js
```

## Finished

And that’s it. You now have a full pg_dump and restore of your production database ready and waiting for you as a Neon Twin, plus, a convenient way for everyone involved to be notified when a new Twin is available!

## Next steps

**Continue building the workflow:** Navigate to [Part IV of the series – How to deploy a chance tested in Neon to prod in RDS](https://neon.tech/blog/neon-twin-deploy-workflow)

## In case you missed it

**Part I:** [Building a Neon Twin: Move Dev/Test/Staging to Neon, Keep Production on RDS](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon)

Part II: [Optimize your AWS RDS Dev Environments with Neon Postgres](https://neon.tech/blog/development-environments-for-aws-rds-using-neon-postgres)

Check out the [Twin Thing app](https://neon.tech/dev-for-rds#github-action-builder?twin=true&twinWorkflowName=Create+Neon+Twin&twinSchedule=0+0+*+*+*&twinJob=default&twinSSLName=prod-us-east-1.pem&reverseTwin=false&reverseTwinWorkflowName=Run+Migrations&reverseTwinJob=sql&reverseTwinSubJob=null&pgVersion=16)—it helps you build your Github Action workflows to build your Neon Twins:

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows/screenshot-2024-10-02-at-65644percente2percent80percentafpm-1024x981-55e55105.png)

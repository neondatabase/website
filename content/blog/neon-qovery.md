---
title: Fullstack preview environments using Neon and Qovery
description: Learn how to create a Neon branch for every preview deployment on Qovery
excerpt: >-
  In this guide, you will learn how to create a Neon branch for every Qovery
  preview environment. What are preview environments? This enables developers to
  build new features in parallel without affecting each other. It also makes it
  possible to do frequent small releases, making i...
date: '2023-08-11T15:11:50'
updatedOn: '2025-10-14T06:09:57'
category: community
categories:
  - community
  - workflows
authors:
  - mahmoud-abdelwahab
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/neon-qovery/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: Fullstack preview environments using Neon and Qovery - Neon
  description: Lean how to create a Neon branch for every preview deployment on Qovery
  keywords: []
  noindex: false
  ogTitle: Fullstack preview environments using Neon and Qovery - Neon
  ogDescription: Lean how to create a Neon branch for every preview deployment on Qovery
  image: 'https://cdn.neonapi.io/public/images/pages/blog/neon-qovery/social.jpg'
source:
  wpId: 2953
  wpSlug: neon-qovery
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-qovery/neon-fullstack-preview-2-1-1024x576-37845621.jpg)

In this guide, you will learn how to create a Neon branch for every [Qovery](https://qovery.com/) preview environment.

## What are preview environments?

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-qovery/what-are-preview-environments-1024x576-2707b84c.png)

This enables developers to build new features in parallel without affecting each other. It also makes it possible to do frequent small releases, making it easier to revert changes if something goes wrong.

[Qovery](https://qovery.com), a Cloud infrastructure automation platform, supports this flow by enabling you to set up an automatic Git integration. This way, you do not have to worry about maintaining and managing infrastructure.

## Databases and preview environments

One of the challenges of working with preview environments is data.

Using a shared database for all previews means each preview environment operates on the same data. While this approach offers simplicity and consistency across previews, it may also lead to conflicts between previews, as changes made to the database can potentially affect other active previews.

On the other hand, you can spin up a database for every pull request and populate it with data. You can either use a copy of production data or have a seed script. Both of these approaches aren’t ideal:

1. Using a seed script requires updating it whenever you modify your database schema. It also doesn’t accurately represent production
2. Using a copy of production data is better. However, the time it takes to provision a preview environment can drastically increase depending on the size of the data you’re importing. There are also potentially some privacy concerns.

Fortunately, Neon addresses these challenges by enabling you to create isolated copies of your data on demand. We’ll first cover how to get started with Neon and then go over how to integrate it with Qovery.

## Getting started with Neon

Neon is fully managed serverless Postgres. It can automatically allocate resources to meet your database workload and scale down to zero when your app is unused. This means you don’t have to pick a size for your database upfront, and you only pay for what you use. All of this is possible because [Neon’s architecture separates storage and compute](https://neon.tech/docs/introduction/architecture-overview).

### Creating a Neon project

If you don’t already have a Neon account, you can create one for free.

After signing up, you can create a project, which is a container for the different resources you can create. If you are working on different applications, it makes sense for you to create a project for each one.

To create a project, you pick a Postgres version and select a region.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-qovery/creating-a-neon-project-1024x550-c1ab911b.png)

After you click “Create project”, you are immediately presented with a database connection string you can use. Under the hood, Neon creates a Postgres cluster that contains a ready-to-use database called “neondb”. Within this Postgres cluster, you can create as many databases as you need.

### Neon branching

Neon enables you to branch your data the same way you branch your code. This branching process is fast and cost-effective because it does not replicate data. It instead uses copy-on-write. Each branch is completely isolated from its parent, so you can modify or delete it when it’s no longer needed, making branching an ideal solution for preview environments.

When you create a project, a “main” branch is created. You would typically use this branch for your production environment and create branches from it for development or preview environments.

You can automate the branch creation process using [the Neon CLI](https://neon.tech/docs/reference/neon-cli). We’ll demonstrate how you can do it with Qovery.

## Qovery lifecycle jobs

Qovery makes it possible to set up [lifecycle jobs](https://hub.qovery.com/docs/using-qovery/configuration/lifecycle-job/), which are custom jobs that are triggered whenever a preview environment is created, stopped, or deleted. You can use lifecycle jobs to create a Neon branch and inject the connection string as an environment variable to share it with the different services in your environment.

Qovery supports using a Git repository or a container registry as a source. For this guide, we will use the following [example Git repository](https://github.com/neondatabase/qovery-lifecycle-job). This way, you can clone it and modify the lifecycle job if you like.

### How the lifecycle job works

To get started, clone the example lifecycle job to your machine and open it in your editor of choice

```bash
git clone https://github.com/neondatabase/qovery-lifecycle-job
cd qovery-lifecycle-job
```

You will find the following file structure:

- `.env.example`: example .env file that lists the different environment variables that the script needs. These variables will be configured on Qovery later.
- `create-branch.sh`: bash script that creates a Neon branch. This script will run whenever a preview environment is created.
- `delete-branch.sh`: bash script that deletes a Neon branch. This script will run whenever a preview environment is deleted.
- `Dockerfile`: contains a set of instructions for building a Docker image that Qovery will use.

### Required environment variables

When setting up the automation on Qovery, you will need to specify the following variables:

- `PGUSERNAME`: this will be your database user.
- `NEON_API_KEY`: you can generate one in your [account settings](https://console.neon.tech/app/settings/api-keys).
- `NEON_PROJECT_ID`: you can find it in your project settings.
- `NEON_DATABASE_NAME`: the name of your database.

### Docekrfile overview

The Dockerfile contains the following instructions:

```bash
FROM ubuntu:latest

# Install required dependencies
RUN apt-get update && apt-get install -y curl gnupg2 jq grep

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/yarnkey.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

RUN yarn add global neonctl@v1.13.0

WORKDIR /app

RUN mkdir -p /qovery-output
RUN mkdir -p /root/.config/neonctl
RUN mkdir -p /branch_out
RUN mkdir -p /branch_err

COPY . .

ENTRYPOINT [ "/bin/sh" ]
```

While using Ubuntu’s latest version as the base image, we first update the package list and install some required dependencies. Next, we install Node.js, Yarn, and the Neon CLI.

We then set `/app` as the working directory and create the following directories:

- `/qovery-output`: will contain the job output. In our case, it will be the environment variables containing the database connection string.
- `/root/.config/neonctl`: contains the configuration for the Neon CLI
- `/branch_out`: will contain the output of any API calls made to the Neon API.
- `/branch_err`: will contain any errors in case the branch creation process fails.

Finally, we copy all the files and directories from the current directory to the working directory and set the default command to be executed when the Docker container starts.

### `create-branch.sh` overview

The `create-branch.sh` script contains the following code:

```bash
#!/bin/bash

# exit on error
set -e

yarn -s neonctl branches create \
          --api-key $NEON_API_KEY \
          --project-id $NEON_PROJECT_ID \
          --name $QOVERY_ENVIRONMENT_NAME \
          --compute --type read_write -o json \
          2> branch_err > branch_out || true

echo "branch create result:\n" >> debug.log
cat branch_out >> debug.log

branch_id=$(cat branch_out | jq --raw-output '.branch.id')

db_url=$(yarn -s neonctl cs ${QOVERY_ENVIRONMENT_NAME} --project-id $NEON_PROJECT_ID --role-name $PGUSERNAME --database-name $NEON_DATABASE_NAME --api-key $NEON_API_KEY)
db_url_with_pooler=$(yarn -s neonctl cs ${QOVERY_ENVIRONMENT_NAME} --project-id $NEON_PROJECT_ID --role-name $PGUSERNAME --database-name $NEON_DATABASE_NAME --pooled --api-key $NEON_API_KEY)

echo '{
    "DIRECT_DATABASE_URL": {
    "sensitive": true,
    "value": "'$db_url'"
  },
    "DATABASE_URL": {
    "sensitive": true,
    "value": "'$db_url_with_pooler'"
  }
}' > /qovery-output/qovery-output.json

echo "Shell script executed successfully with output values - check out your Qovery environment variables :)"
```

The script first creates a Neon branch using the Neon CLI. We’re passing a Neon API key, Neon project ID, and branch name as parameters.`QOVERY_ENVIRONMENT_NAME` is a variable that’s accessible in Qovery lifecycle jobs. We will use it to find the branch when we want to delete it later on.

We then create a `/qovery-output/qovery-output.json` file which contains a JSON object with the variables we want to pass to other services on Qovery.

### `delete-branch.sh` overview

The `delete-branch.sh` script contains the following code:

```bash
#!/bin/sh

# exit on error
set -e

# Get branch ID by name
branch_id=$(curl --silent \
  "https://console.neon.tech/api/v2/projects/$NEON_PROJECT_ID/branches" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $NEON_API_KEY" \
  | jq -r .branches \
  | jq -c '.[] | select(.name | contains("'$QOVERY_ENVIRONMENT_NAME'")) .id' \
  | jq -r \
  ) \

OUTPUT=`curl -X 'DELETE' \
  "https://console.neon.tech/api/v2/projects/$NEON_PROJECT_ID/branches/$branch_id" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $NEON_API_KEY"`

# print output and format using jq
echo $OUTPUT | jq

echo "Branch deleted successfully"
```

We first get the ID of the branch we want to delete by fetching all project branches and filtering the result by the branch name. We then delete the branch by the ID.

Now let’s take a look at how to use these scripts on Qovery to automate the process of creating and deleting Neon branches.

### Creating the lifecycle job on Qovery

To create a lifecycle job, you first need an [environment on Qovery.](https://hub.qovery.com/docs/using-qovery/configuration/environment/) This environment will contain the different services that Qovery manages.

To get started, navigate into your environment, click on the “New service” button and choose “Create lifecycle job”

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-qovery/create-lifecycle-job-1024x640-6cb1b0e1.png)

Next, you will need to give your lifecycle job a name and select the source.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-qovery/creating-the-lifecycle-job-on-qovery-1024x640-c5bbc023.png)

After selecting a Git repository, you will need to specify which branch Qovery should use to deploy your code and the base folder in which the code resides in your repository.

In the next step, you will need to configure the job and specify which environment events will trigger the job. In our case, we want the “Start” and “Delete” events.

For the “Start” event, choose `Dockerfile` as the image entry point and [“create-branch.sh”] as the CMD argument. As for the “Delete” event, choose `Dockerfile` as the image entry point and [“delete-branch.sh”] as the CMD argument. You can then leave the remaining default configuration options and click “Continue”.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-qovery/job-configuration-1024x640-7d394c92.png)

You can configure the resources allocated for the lifecycle job. Our job doesn’t require a lot of resources, so the default configuration works.

The last step is specifying the environment variables used by the lifecycle job. These will be the same environment variables mentioned in the previous section.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-qovery/set-env-variables-1024x640-292d7040.png)

After reviewing the lifecycle job configuration, choose “Create and deploy”. That’s it! You now have a Neon branch for every preview environment on Qovery.

## Conclusion

In this guide, you learned how you can create a Neon branch for every Qovery preview environment. If there are other deployment providers or CI/CD tools you would like us to cover, feel free to reach out to us in our [community forum](https://community.neon.tech/) or on [Twitter](https://twitter.com/neondatabase). Also, if you are new to Neon, you can [sign up today](https://console.neon.tech/) for free.

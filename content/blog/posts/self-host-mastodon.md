---
title: How to self-host Mastodon
description: Learn how to deploy your own Mastodon instance
excerpt: >-
  In this guide, you will learn how to self-host your own Mastodon instance. If
  you’re interested in self-hosting Mastodon without getting into the technical
  details, you can check out the list of dedicated Mastodon hosting providers.
  What is Mastodon? Mastodon is an open-source, d...
date: '2023-01-26T16:05:08'
updatedOn: '2025-09-03T13:58:23'
category: community
categories:
  - community
authors:
  - mahmoud-abdelwahab
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: How to self-host Mastodon - Neon
  description: >-
    In this guide, you will learn how to deploy your own Mastodon instance using
    Neon, Fly.io, Upstash, and Postmark.
  keywords: []
  noindex: false
  ogTitle: How to self-host Mastodon - Neon
  ogDescription: >-
    In this guide, you will learn how to deploy your own Mastodon instance using
    Neon, Fly.io, Upstash, and Postmark.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/social.jpg
---

In this guide, you will learn how to self-host your own Mastodon instance. If you’re interested in self-hosting Mastodon without getting into the technical details, you can check out the list of [dedicated Mastodon hosting providers](https://docs.joinmastodon.org/user/run-your-own/).

## What is Mastodon?

[Mastodon](https://github.com/mastodon/mastodon) is an open-source, decentralized, federated social media platform based on the [ActivityPub protocol](https://www.w3.org/TR/activitypub/). The protocol provides a client-to-server API for creating, updating, and deleting content and a federated server-to-server API for delivering notifications and content.

This way, you can have different Mastodon instances running on different servers, and they can all communicate with each other instead of having a single centralized social network. It doesn’t have to be a Mastodon instance; it can be any other ActivityPub-compliant server.

![What is Mastodon?](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/what-is-mastodon-1024x768-e61f9ae1.png)

## Architecture of a Mastodon instance

A Mastodon instance is a fullstack application that consists of the following components:

- [Ruby on Rails](https://rubyonrails.org/) server
- [PostgreSQL](https://www.postgresql.org/) database
- [Sidekiq](https://sidekiq.org/) for handling background jobs
- [Node.js](https://nodejs.org/) streaming server
- [Redis](https://redis.io/) for caching and background jobs
- [React](https://reactjs.org/) frontend
- [Elasticsearch](https://elastic.co/) for full-text search (optional)
- S3-compatible storage for user-uploaded photos and videos, such as [AWS S3](https://aws.amazon.com/s3/) (optional)
- SMTP server for sending emails (you can use an email provider like [Mailgun](https://mailgun.com/) or [Postmark](https://postmarkapp.com/))

## Prerequisites

### Assumed knowledge

While this guide will attempt to cover everything in detail from a beginner developer’s standpoint, the following would be helpful:

- Basic knowledge of the command line
- Basic knowledge of Docker

### Development environment

To follow along with this guide, you will need to have the following tools installed on your machine:

- [Git](https://git-scm.com/) – version control system.
- [Docker](https://www.docker.com/) – to build and share containerized applications.
- [flyctl](https://fly.io/docs/getting-started/installing-flyctl/) – command-line utility that lets you work with the [Fly.io](https://fly.io/) platform. You will also need a [fly.io account](https://fly.io/docs/hands-on/sign-up/).

### Cloning the starter repository

To get started, navigate into the directory of your choice and run the following command to clone the starter repository:

```bash
git clone https://github.com/neondatabase/mastodon-fly.git 
cd mastodon-fly
```

When you Navigate into the cloned repository, you will see the following directory structure:

```bash
mastodon/
┣ Dockerfile
┣ README.md
┣ fly.setup.toml
┗ fly.toml
```

- `Dockerfile` contains the instructions for building the Docker image that Fly will use to deploy the Mastodon instance.
- `fly.setup.toml` is the configuration file used for setting up the database for the Mastodon instance to run.
- `fly.toml` is the configuration file used when deploying the Mastodon instance to Fly.

## Create a new app using flyctl

In your `fly.toml` and `fly.setup.toml` files, update the `app` variable with the name you would like to use for your app on Fly. This app name has to be unique across all Fly apps.

```yaml
app = "<your-app-name>" # add this value in fly.toml and fly.setup.toml
```

Next, run the following command to create a new app on fly.io:

```bash
flyctl apps create --name <your-app-name>

flyctl scale memory 512
```

If the name you chose is unavailable, you will get the following error:

<blockquote>
<p>Error Validation failed: Name has already been taken</p>
</blockquote>

Otherwise, you will see a success message similar to the following:

```bash
automatically selected personal organization: your-name
New app created: <your-app-name>
Scaled VM Memory size to 512 MB
      CPU Cores: 1
         Memory: 512 MB
```

## Choosing a domain for your app

In your `fly.toml` file, set the `LOCAL_DOMAIN` variable to the following format:

`<your-app-name>.fly.dev`. This will be the domain of your Mastodon instance.

```yaml
# fly.toml
[env]
LOCAL_DOMAIN = "<app-name>.fly.dev" 
```

<blockquote>
<p><strong>How do I use my domain instead of the one provided by <a href="https://fly.io/">Fly.io</a>?</strong></p><p>You can use a custom domain instead of the one provided by Fly. You must go to the domain registrar you used and add a new A record with the value of your app’s IP address. You will learn later how to assign an IP address to your app.</p>
</blockquote>

## Generating app secrets

Mastodon has a set of secrets that you need to generate. You can do so by running the following commands:

```bash
SECRET_KEY_BASE=$(docker run --rm -it tootsuite/mastodon:latest bin/rake secret)

OTP_SECRET=$(docker run --rm -it tootsuite/mastodon:latest bin/rake secret)

flyctl secrets set OTP_SECRET=$OTP_SECRET SECRET_KEY_BASE=$SECRET_KEY_BASE

docker run --rm -e OTP_SECRET=$OTP_SECRET -e SECRET_KEY_BASE=$SECRET_KEY_BASE -it tootsuite/mastodon:latest bin/rake mastodon:webpush:generate_vapid_key | flyctl secrets import
```

You are pulling the latest Mastodon Docker image and generating a set of secrets for your Mastodon instance. You are then storing those secrets using the fly secrets set command. If everything worked correctly, you will see the following message:

<blockquote>
<p>Secrets are staged for the first deployment</p>
</blockquote>

You should also be able to list all of your app’s secrets by running `fly secrets list`.

```bash
➜ fly secrets list

NAME                    DIGEST                  CREATED AT 
OTP_SECRET              34c76c7e73558354        3h19m ago 
SECRET_KEY_BASE         c38aa6ba9d0d7674        3h19m ago 
VAPID_PRIVATE_KEY       45c7f3d3fb6d6faf        3h19m ago 
VAPID_PUBLIC_KEY        9b0042852df64493        3h19m ago
```

## Provisioning a Postgres database using Neon

Although you can use a Postgres database from any Postgres provider, using Neon has a great advantage: scaling down to zero. Unlike traditional Postgres databases, where you have to pay a monthly minimum fee, with Neon, you will only pay for what you use.

To get started, go to the [Neon console](https://console.neon.tech/app/projects) and create a new project by clicking on “Create a project”

Choose 15 as the Postgres version, and pick a region near where you will deploy your Mastodon instance.

![Provisioning a Postgres database using Neon](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/provisioning-a-postgres-database-using-neon-1024x640-6ad4321f.png)

You will be presented with a dialog that provides a password for your database. Save this password somewhere safe because you will need it later.

![Password](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/password-1024x640-7afd78c0.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>:<port>/<dbname>
```

- `user` is the database user.
- `password` is the database user’s password.
- `endpoint_hostname` is the host.
- `port` is the Neon port number. The default port number is 5432.
- `dbname` is the name of the database. “neondb” is the default database created with each Neon project.

Next, open the `fly.setup.toml` file and update the environment variables with your Neon database credentials:

```bash
# fly.setup.toml
# above unchanged

DB_HOST='<project_id.cloud.neon.tech>'
DB_USER='<your-user>'
DB_NAME='main'
DB_PASS='project=<project_id>;<password>'
DB_PORT='5432' 
```

The `DB_PASS` variable has the `DB_PASS='project=<project_id>;password'` string format because the underlying database client library in the Docker image does not support the SNI (Server Name Indication) mechanism in TLS. Check out the documentation to learn more about [how Neon routes connections](https://neon.tech/docs/connect/connectivity-issues#how-neon-routes-connections).

You can find the Project ID in your project’s settings.

![ Project ID ](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/project-id-1024x576-b430997c.png)

## Running the setup script

Next, run the following command to create the database tables:

```bash
flyctl deploy -c fly.setup.toml
```

You might get the following error when running `flyctl deploy -c fly.setup.toml`:

<blockquote>
<p>Error failed to fetch an image or build from source: error connecting to docker: remote builder app unavailable.</p>
</blockquote>

If that happens, pass the `--local-only` flag to the deploy command and rerun it while Docker runs in the background.

```bash
flyctl deploy -c fly.setup.toml --local-only 
```

After the command runs, you will see newly created tables in the “Tables” tab in In Neon console.

!["Tables" tab](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/22tables22-tab-1024x640-676d6f1c.png)

Next, run the following command to upload your database credentials to Fly:

```bash
flyctl secrets set DB_USER='' DB_NAME='neondb' DB_PASS='project=<projectId>;<your-password>' DB_PORT=5432 DB_HOST=''
```

## Provisioning a Redis database

The next step is to provision a Redis database. For this guide, we will use [Upstash](https://upstash.com/), but you can use any other Redis provider.

In the Upsatsh console, go to the “Redis” tab and click the “Create database” button.

![Create database](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/create-database-1024x576-a3878302.png)

Next, pick a name for your database and choose a region close to where you will deploy your Mastodon instance. It’s also a good idea to enable the TLS and Eviction options.

![Create the database](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/create-the-database-1024x576-1f887c48.png)

Finally, grab the endpoint, password, and port values. You will upload them to Fly shortly.

![Grab the endpoint](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/grab-the-endpoint-1024x576-43601bb7.png)

Next, run the following command to upload your Redis database credentials to Fly:

```bash
flyctl secrets set REDIS_HOST="eu2-equal-pony-18876.upstash.io" REDIS_PORT="31476" REDIS_PASSWORD="abcdefgh" 
```

## Using Postmark as your email provider

Mastodon relies on emails to send confirmation links and notifications. You can set up a third-party email provider, making sending emails much more reliable than building your own SMTP server. You can use one of the many available services, such as [Mailgun](https://mailgun.com), [Postmark](https://postmarkapp.com), [Sendgrid](https://sendgrid.com), etc.

After creating an account, you will need to verify your email to be able to send emails. Next, in the “Servers” tab, choose the default server. (You can think of a server as a project)

![Servers](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/servers-1024x576-423f329d.png)

Next, pick the “ default transactional stream” and go to the “Settings” tab.

![Default transactional stream](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/default-transactional-stream-1024x576-faf4c31b.png)

Scroll down to the SMTP section, and grab the values for the port, server name, username, and password.

![SMTP](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/smtp-1024x576-157b680b.png)

Finally, run the following command to upload these secrets to Fly:

```bash
flyctl secrets set SMTP_SERVER='smtp.postmarkapp.com' SMTP_PORT='587' SMTP_LOGIN='some-id' SMTP_PASSWORD='some-secret' SMTP_FROM_ADDRESS=''
```

## Optional: Adding support for file uploads using AWS S3

You will need to set up an Object storage solution to enable file uploads from users who sign up for your Mastodon instance. The most common tool is [AWS S3](https://aws.amazon.com/s3/). Check out the documentation to [learn how create your first S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html). You will also need to [create an IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) to generate an access key ID and secret.

After setting up an S3 bucket, run the following command to upload the secrets to Fly:

```bash
flyctl secrets set S3_ENABLED=true S3_BUCKET="<bucket-name>" AWS_ACCESS_KEY_ID="<aws-access-key>" AWS_SECRET_ACCESS_KEY="" 
```

## Assigning an IP address to your app

The last thing you need to do is allocate an IP address for your deployed app. You can do that by running the following command:

```bash
flyctl ips allocate-v4
```

If you go to your [Fly.io](https://fly.io/) dashboard, you will see a newly added IP address. You will be able to visit your app in a few minutes.

![Image](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/image-8-1024x576-3d398a64.png)

# Deploying your app

You can now deploy your app to Fly by running the following command:

```bash
flyctl deploy
```

If you did all of the previous steps correctly, you should have a deployed Mastodon instance running at the domain you specified in your `fly.toml` file????

![Deploying your app](https://cdn.neonapi.io/public/images/pages/blog/self-host-mastodon/deploying-your-app-1024x640-2ac4aaa4.png)

You will be able to create an account and new posts after confirming your email.

# Summary & Final thoughts

In this guide, you learned what Mastodon is and how to deploy an instance while leveraging various tools. If you want to customize it, you will need to clone the [main repository](https://github.com/mastodon/mastodon) and create your own Docker image.

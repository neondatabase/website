---
title: Run your own analytics with Umami, Fly.io and Neon
subtitle: Self-host Umami analytics on Fly.io, backed by Lakebase Postgres
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-06-05T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

In this guide, you'll self-host an Umami analytics instance on Fly.io and use Lakebase Postgres on Neon as Umami's data store. Neon is a complete set of cloud backend primitives built around Lakebase Postgres, for developers, startups, and agent platforms, from Databricks.

## Prerequisites

To follow along and deploy the application in this guide, you will need the following:

- [flyctl](https://fly.io/docs/getting-started/installing-flyctl/): a command-line utility for working with Fly.io. You will also need [a fly.io account](https://fly.io/docs/hands-on/sign-up/).
- [A Neon account](https://console.neon.tech/signup): the self-hosted Umami instance connects to a Postgres database on Neon.

## Steps

- [What is Umami?](#what-is-umami)
- [Provision a Postgres database on Neon](#provision-a-postgres-database-on-neon)
- [Set up an Umami instance for Fly.io](#set-up-an-umami-instance-for-flyio)
- [Configure the database connection for Umami](#configure-the-database-connection-for-umami)
- [Deploy to Fly.io](#deploy-to-flyio)

## What is Umami?

![Umami Analytics Preview](/guides/images/self-hosting-umami-neon/umami.jpeg)

Umami is a simple, fast, privacy-focused, open-source web analytics tool. Unlike Google Analytics, it gives you full control of your data and respects your users' privacy. <sup>[[1](https://umami.is/docs)]</sup>

## Provision a Postgres database on Neon

Lakebase Postgres [scales compute to zero](/docs/introduction/scale-to-zero) when the database isn't in use, so you don't pay for compute while your analytics sit idle. Storage is still billed.

To get started, go to the [Neon Console](https://console.neon.tech/app/projects) and enter a name for your project.

The Console then shows a dialog with your database's connection string. Enable the **Connection pooling** toggle for a pooled connection string.

![](/guides/images/self-hosting-umami-neon/1689d44f-4c5d-4b2a-8d13-32407f9c8781.png)

All Neon connection strings have the following format:

```bash
postgres://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>
```

- `user` is the database user.
- `password` is the database user’s password.
- `endpoint_hostname` is the compute endpoint's hostname, which ends in `neon.tech`.
- `port` is the Neon port number. The default port number is 5432.
- `dbname` is the name of the database. “neondb” is the default database created with each Neon project if you don't specify your own database name.
- `?sslmode=require&channel_binding=require` are optional query parameters that enforce the [SSL](https://www.cloudflare.com/en-gb/learning/ssl/what-is-ssl/) mode and channel binding for better security when connecting to the database.

Save the connection string somewhere safe. Later, you will use it to configure the `DATABASE_URL` variable.

## Set up an Umami instance for Fly.io

To self-host your Umami analytics instance, you'll use [Umami's pre-built Docker container for Postgres](https://github.com/umami-software/umami/pkgs/container/umami/157800125?tag=postgresql-latest). With it, you can deploy Umami on Fly.io with a single `fly.toml` file.

In your terminal window, execute the following commands to create a new directory and `cd` to it:

```bash
mkdir self-host-umami-neon
cd self-host-umami-neon
```

In the directory `self-host-umami-neon`, create a file named `fly.toml` with the following content:

```toml
# File: fly.toml

kill_signal = "SIGINT"
kill_timeout = "5s"

[experimental]
    auto_rollback = true

[build]
    image = "ghcr.io/umami-software/umami:postgresql-latest"

[[services]]
    protocol = "tcp"
    internal_port = 3000
    processes = ["app"]

[[services.ports]]
    port = 80
    handlers = ["http"]
    force_https = true

[[services.ports]]
    port = 443
    handlers = ["tls", "http"]

[services.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20

[[services.tcp_checks]]
    interval = "15s"
    timeout = "2s"
    grace_period = "1s"
```

In the `build` property named `image`, you will see that it points to the latest Postgres-compatible pre-built Docker image of Umami.

Next, you need to create an app on Fly.io using the configuration present in `fly.toml` file. In your terminal window, execute the following command to launch a Fly.io app:

```bash
fly launch
```

When prompted by the CLI to allow copying of the existing configuration into a new app, answer with a `y`:

```bash
An existing fly.toml file was found
? Would you like to copy its configuration to the new app? Yes
```

Optional: When asked if you want to tweak the default settings, answer with a `y`:

```bash
Using build strategies '[the "ghcr.io/umami-software/umami:postgresql-latest" docker image]'. Remove [build] from fly.toml to force a rescan
Creating app in /Users/rishi/Desktop/test
We're about to launch your app on Fly.io. Here's what you're getting:

Organization: Rishi Raj Jain         (fly launch defaults to the personal org)
Name:         test                   (derived from your directory name)
Region:       Mumbai, India          (this is the fastest region for you)
App Machines: shared-cpu-1x, 1GB RAM (most apps need about 1GB of RAM)
Postgres:     <none>                 (not requested)
Redis:        <none>                 (not requested)

? Do you want to tweak these settings before proceeding? Yes
Opening https://fly.io/cli/launch/641f1a1d67950614e4e92820ba484310 ...
```

flyctl then opens a web page where you can edit the default settings. For example, you can change the app name to `self-host-umami-neon`, and change the region to say `ams`.

![Fly.io Deployment Setting](/guides/images/self-hosting-umami-neon/307247099-acca8350-75c8-4007-b486-42c4102dfe40.png)

Click on `Confirm Settings` to set this configuration, and go back to your terminal window. In your terminal window, you should now see output similar to the following:

```bash
Waiting for launch data... Done
Created app 'self-host-umami-neon' in organization 'personal'
Admin URL: https://fly.io/apps/self-host-umami-neon
Hostname: self-host-umami-neon.fly.dev
Wrote config file fly.toml
Validating /Users/rishi/Desktop/test/fly.toml
✓ Configuration is valid
==> Building image
Searching for image 'ghcr.io/umami-software/umami:postgresql-latest' remotely...
image found: img_8rlxp2mjm9g43jqo

Watch your deployment at https://fly.io/apps/self-host-umami-neon/monitoring

Provisioning ips for self-host-umami-neon
  Dedicated ipv6: 2a09:8280:1::2b:b52c:0
  Shared ipv4: 66.241.124.197
  Add a dedicated ipv4 with: fly ips allocate-v4

This deployment will:
 * create 2 "app" machines
```

Once the deployment is ready, one step is left: setting the `DATABASE_URL` environment variable to the connection string from the previous section.

## Configure the database connection for Umami

In your Fly.io [Dashboard > Apps](https://fly.io/dashboard), click on your app name, and you will be taken to the overview of your app on Fly.io.

![](/guides/images/self-hosting-umami-neon/307262264-17f870e2-379f-4d80-b37e-6dac9075174c.png)

Click on `Secrets` in the left sidebar, and then click on `New Secret` on the top right corner to start creating an environment variable for your app.

![](/guides/images/self-hosting-umami-neon/307263442-b835f320-8ae8-4a8a-a4f0-dbeb9e07530f.png)

In the modal, set the name of the secret as `DATABASE_URL`, and set the `Secret` value to be the one that we obtained in the previous section. Click **Set secret** to save the environment variable.

![](/guides/images/self-hosting-umami-neon/307263972-75bef039-f4d1-4b7d-a66d-dd312290a6d1.png)

Each deployment of your app on Fly.io now gets a database URL that points to your database on Neon. Let's trigger a deploy to see it all in action.

## Deploy to Fly.io

You can now deploy your app to Fly by running the following command:

```bash
flyctl deploy
```

Once deployed, log in to your Umami instance with the default credentials: **admin** as the username and **umami** as the password. Change the password right away. You can then add websites and analyze their traffic.

## Summary

You now have a self-hosted Umami instance running on Fly.io, with its data stored in Lakebase Postgres on Neon.

<NeedHelp />

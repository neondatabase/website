---
title: Restrict Access to Your Neon Database with IP Allow
description: An extra level of security to safeguard your databases
excerpt: >-
  Neon provides you with fully hosted and managed PostgreSQL instances. These
  instances have advanced branching and autoscaling features and are accessible
  using a connection string and a secure password. We understand that having
  multiple layers of security in place is essential t...
date: '2023-12-19T18:22:07'
updatedOn: '2024-03-01T14:01:33'
category: community
categories:
  - community
authors:
  - evan-shortiss
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-your-neon-database-with-ip-allow/cover.png
  alt: null
isFeatured: false
seo:
  title: Restrict Access to Your Neon Database with IP Allow - Neon
  description: An extra level of security to safeguard your databases
  keywords: []
  noindex: false
  ogTitle: Restrict Access to Your Neon Database with IP Allow - Neon
  ogDescription: >-
    Neon provides you with fully hosted and managed PostgreSQL instances. These
    instances have advanced branching and autoscaling features and are
    accessible using a connection string and a secure password. We understand
    that having multiple layers of security in place is essential to safeguard
    your data. Implementing IP address restrictions is often part of a
    comprehensive […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-your-neon-database-with-ip-allow/cover.png
source:
  wpId: 4061
  wpSlug: restrict-access-to-your-neon-database-with-ip-allow
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-your-neon-database-with-ip-allow/neon-ip-allowlist-1024x576-66d4e52a.png)

Neon provides you with fully hosted and managed PostgreSQL instances. These instances have advanced [branching](https://neon.tech/docs/introduction/branching) and [autoscaling](https://neon.tech/docs/introduction/autoscaling) features and are accessible using a [connection string](https://neon.tech/docs/connect/connect-from-any-app) and a secure password.

We understand that having multiple layers of security in place is essential to safeguard your data. Implementing IP address restrictions is often part of a comprehensive security strategy, especially for businesses handling sensitive data or operating under strict regulatory environments.

Therefore, we’d like to introduce our newest security enhancement: [IP Allow](https://neon.tech/docs/manage/projects#configure-ip-allow). This feature is available for customers signed up for the [Neon Pro Plan](https://neon.tech/docs/introduction/pro-plan).

## Restricting Access to Your Branch by IP

Neon’s Postgres offering requires passwords to have at least [60 bits of entropy](https://neon.tech/docs/manage/roles#manage-roles-with-sql), providing a solid first layer of defense against unauthorized access. The IP Allow feature provides an extra level of verification and access control.

For example, restricting access to a range of known IP addresses decreases the possibility of data breaches caused by common attack vectors, such as phishing. This is because even if an attacker obtains credentials to access your database, those credentials will be useless unless the attacker can connect from an IP address on the allowlist.

To start using the IP Allow feature, head to the [Neon console](https://console.neon.tech/) and create a new project or select an existing one.

From the project **Dashboard,** use the **Connection Details** to obtain a connection string for your preferred runtime or tooling. This post will be using `psql` for demonstration purposes.

![The Neon project dashboard showing a database connection string.](https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-your-neon-database-with-ip-allow/connection-string-1024x547-5c9f1ca8.jpeg)

Verify that you can use the `psql` command to connect to the database and run a query such as `SELECT datname FROM pg_database`. A list of the available databases will be returned. Use the `\\q` command to exit the `psql` process.

![A terminal showing a successful connection to a database using psql.](https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-your-neon-database-with-ip-allow/allowed-1024x665-7039c28b.png)

Anyone with the `psql` command’s connection string can access your database from any network. To lock down your database to a specific IP or range of IPs, return to the Neon console and visit the **Settings** screen of your project. Enter a random IP address, e.g.`127.0.0.1` in the IP Allow section, and click the **Apply changes** button.

![The Settings screen for a project in the Neon console.](https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-your-neon-database-with-ip-allow/ip-added-1024x549-022a47f2.jpeg)

Try entering your `psql` connection command again. Instead of being granted access to your Postgres instance, you will receive an error message stating, “This IP address is not allowed to connect to this endpoint”.

![A terminal window showing a failed connection attempt using psql. An error message states that the connection failed since the source IP address is not allowed to connect to the endpoint.](https://cdn.neonapi.io/public/images/pages/blog/restrict-access-to-your-neon-database-with-ip-allow/denied-1024x665-500e2dbe.png)

Visit a site such as [ipinfo.io](https://ipinfo.io/) to obtain your public IP address, then replace the previously entered value with your IP address in the IP Allow section. Click the **Apply changes** button, then rerun the `psql` command. You should be able to connect to your database since you’re connecting from an allowed IP address. Attempts to connect from a different IP address will fail.

## Conclusion

Now you can restrict access to your Neon database’s branches using the IP Allow feature. You can read more about [IP Allow in the documentation](https://neon.tech/docs/manage/projects#configure-ip-allow). Join us on our [Discord server](https://neon.tech/discord) if you’d like to share your feedback and ideas or to hang out.

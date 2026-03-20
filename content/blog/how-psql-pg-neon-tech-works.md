---
title: How Does psql -h pg.neon.tech Work?
description: >-
  Many of us here at Neon are big fans of our “passwordless auth” feature. Let’s
  find out how it works!
excerpt: >-
  One of the things that got me really excited and curious about Neon, long
  before I joined the company, was the psql -h pg.neon.tech command. I’ve
  recently come to find out that other employees here went through the same
  “wow” experience even before they joined the company. So, I’...
date: '2024-08-14T14:22:47'
updatedOn: '2024-08-14T14:22:48'
category: engineering
categories:
  - engineering
authors:
  - david-gomes
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-psql-pg-neon-tech-works/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How Does psql -h pg.neon.tech Work? - Neon
  description: >-
    Many of us here at Neon are big fans of our “passwordless auth” feature.
    Let’s find out how it works!
  keywords: []
  noindex: false
  ogTitle: How Does psql -h pg.neon.tech Work? - Neon
  ogDescription: >-
    One of the things that got me really excited and curious about Neon, long
    before I joined the company, was the psql -h pg.neon.tech command. I’ve
    recently come to find out that other employees here went through the same
    “wow” experience even before they joined the company. So, I’ve decided to
    write a little bit […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-psql-pg-neon-tech-works/social.jpg
source:
  wpId: 6689
  wpSlug: how-psql-pg-neon-tech-works
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-psql-pg-neon-tech-works/neon-psql-1024x576-bf096ebd.jpg)

One of the things that got me really excited and curious about Neon, long before I joined the company, was the `psql -h pg.neon.tech` command. I’ve recently come to find out that other employees here went through the same “wow” experience even before they joined the company. So, I’ve decided to write a little bit about [how to use it](https://neon.tech/docs/connect/passwordless-connect), how it works and why it’s so useful.

When you run `psql -h pg.neon.tech` in your CLI, you get a URL that you can click on:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-psql-pg-neon-tech-works/ad4nxdzp4irpaddgqa7acwgw-rzk4m7nyqtob5dhcgpbumwkcpfen3arine3egd9jw2htvb2re35cumlmynmebjvyflfwzjffvy0shbpskszzuzkedkesiyvyqtibrmlxxks54bv-ftwtorluulysp4m2gtk-c58a49fc.png)

And then by clicking on that URL, you are taken into the Neon console, where you can choose which Neon project you’d like to connect to. If your project only has one endpoint, then the flow is really quick, but otherwise you have to specify which endpoint you want to connect to.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-psql-pg-neon-tech-works/ad4nxctec4jgygn4rkafcgav4nrfqorpekzb0kuzv6dklecqxtp1b4murcae09rbdruifl-mkl5vas7tnzs9t7f3yntbh-v6zztwdzpczzhrepxp3vtti5u5cxmfd8bcxl7l6pdrkm1fgcdl3o3ycnwvoqsc-910b4761.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-psql-pg-neon-tech-works/ad4nxdczm1yqobslb-isdc3pgk1cktrhhlibwhokoqfj1ncfqdwgzrdptastle00qk1dccsc3njko5qjm9yv6-yzn-kkwcxsj8e4gpdood5llbclrqaqxhgbjxjh8wmvmajla-3tc0ljnpyuzhk9yk7kpobh-02c82b99.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-psql-pg-neon-tech-works/ad4nxdjh6klazgqxkuwam9ltvebwlmdvevxuy-akmz1c2rg8g0wayeukwupnxphsn0lcthdthdwpxnuqrfsrmwkc1rfkzcsvflihixvf8glj3i2-ofzs-qfaihwlwae1gq2oovdhbvyvkixbtjs0ib1gpg-e-99c55efe.png)

And then you’re in!

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-psql-pg-neon-tech-works/ad4nxcfdwpgpe3jqybrma4lob-ovl4eataj6gmochxdo0pfvmaerojccgfjeuzbe13lyen2mlk9kdbgvqb0lsuvdvu0mh8q53bfjdgdbhki4o7zhw5slyvl5yhvyxyfmt3uwzhj-zevn8-gwxprjfvahgckymd-5138220c.png)

## How does it work?

Once I joined Neon, I decided to try and figure out how this feature works under the hood. And it all starts with what’s running at `pg.neon.tech`. Is it a real Postgres instance? No, it’s not — it’s just a server that speaks Postgres protocol that we call **“** Link Proxy **”**.

**But how can this Postgres server make the client print that “Welcome to Neon!” message?**

So, the Postgres protocol has a “[message flow](https://www.postgresql.org/docs/current/protocol-flow.html)” that can be used for many different things. One of the message types that the server can respond with to the “Start-up” message from the client is “NoticeResponse”. As per the docs, this is what it should be used for:

> A warning message has been issued. The frontend should display the message but continue listening for ReadyForQuery or ErrorResponse.

This is the message type that our server uses to print the “Welcome to Neon!” message. It’s a bit of a hack but it works!

And **because Neon is open source**, you can actually read the code [here](https://github.com/neondatabase/neon/blob/507f1a5bdd4a168e589550e7c1bb5ac6de41643f/proxy/src/auth/backend/link.rs#L85):

```rust
let greeting = hello_message(link_uri, &psql_session_id);

// Give user a URL to spawn a new database.
info!(parent: &span, "sending the auth URL to the user");

client
    .write_message_noflush(&Be::AuthenticationOk)?
    .write_message_noflush(&Be::CLIENT_ENCODING)?
    .write_message(&Be::NoticeResponse(&greeting))
    .await?;
```

So, now that we’ve figured out how to print the initial message, we can see that it includes a special URL that the user can visit in order to authenticate to a Neon project/compute endpoint. **What’s special about this URL that the “Link Proxy” generates?**

Just like most “database as a service” products, Neon has a control plane &lt;-&gt; data plane architecture, and this separation of concerns provides many benefits for us. The **control plane** is responsible for orchestrating the data plane and managing metadata around organizations, user accounts, preferences, billing, etc. On the other hand, the **data plane** is essentially the Postgres compute and storage. The “**Link Proxy**” service is actually running in the **data plane**, and it generates a URL that takes the user to a UI powered by the **control plane**, where they can choose the Neon project/endpoint that they wish to connect to.

Then, the **control plane** connects to the “**Link Proxy**” service and feeds to it the necessary connection details for the request ID that was in the URL. This, in turn, causes the Link Proxy to initiate a connection to the correct IP with the appropriate credentials. The “**Link Proxy**” also forwards all the connection’s traffic (i.e., messages to and from Postgres) to the “psql” client.

That’s it!

Confusing? That’s okay, we’ve got a diagram that should help clear things up:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-psql-pg-neon-tech-works/psql-h-pg-neon-tech-diagram-904x1024-c0b185cc.png)

## Why is this command so interesting?

This command is extremely useful for developers playing around with more than one Neon project, or multiple [compute endpoints](https://neon.tech/docs/manage/endpoints) inside the same Neon project. Most of us are not keeping track of the URLs or credentials for all the endpoint/databases that we’re connecting to in our development workflow. So, it’s simply much easier to just type `psql -h pg.neon.tech` (or even better, to have a `pgneon` alias in your CLI for this!).

Finally, both the regular Neon Proxy as well as the “Link Proxy” described in this article are [open source](https://github.com/neondatabase/neon/tree/507f1a5bdd4a168e589550e7c1bb5ac6de41643f/proxy). So, feel free to poke around in the codebase and to ask us any questions you might have on its architecture [on our Discord server](https://neon.tech/discord).

We’re also hiring—take a look at our [open engineering positions](https://neon.tech/careers) and help us shape the future of AI and Postgres.

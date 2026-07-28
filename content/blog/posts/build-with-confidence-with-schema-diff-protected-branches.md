---
title: Build with confidence with Schema Diff & Protected Branches
description: Easily identify schema changes and safeguard sensitive data
excerpt: >-
  Neon helps teams ship with confidence without compromising development
  velocity. One of its features that contributes to that is database branching.
  In this post, we will explore two new features related to database branching:
  schema diff and protected branches. Database branches...
date: '2024-04-16T13:33:07'
updatedOn: '2024-04-17T14:21:28'
category: community
categories:
  - community
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/build-with-confidence-with-schema-diff-protected-branches/cover.png
  alt: null
isFeatured: false
seo:
  title: Build with confidence with Schema Diff & Protected Branches - Neon
  description: Easily identify schema changes and safeguard sensitive data
  keywords: []
  noindex: false
  ogTitle: Build with confidence with Schema Diff & Protected Branches - Neon
  ogDescription: >-
    Neon helps teams ship with confidence without compromising development
    velocity. One of its features that contributes to that is database
    branching. In this post, we will explore two new features related to
    database branching: schema diff and protected branches. Database branches in
    Neon are copy-on-write clones of your database that you can use for
    development, […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/build-with-confidence-with-schema-diff-protected-branches/social.png
---

<img
  src="https://cdn.neonapi.io/public/images/pages/blog/build-with-confidence-with-schema-diff-protected-branches/image-30-1024x576-66ce9051.png"
  alt="Post image"
  width="1024"
  height="576"
/>

Neon helps teams ship with confidence without compromising development velocity. One of its features that contributes to that is database branching. In this post, we will explore two new features related to database branching: schema diff and protected branches.

Database branches in Neon are copy-on-write clones of your database that you can use for development, testing, or experimentation without compromising the original database.

Ever since we introduced the database branching feature to Neon, developers have asked for ways to set permission rules on individual branches and identify differences between parent and child branches. And here it is.

Today, we’ll explore two of our newest features, which will provide you with greater confidence.

# Schema Diff

Similar to diffs in Git, the Neon schema diff feature compares schemas between the current and past state of the branch. Schema diffs are important to development workflows as they allow you to easily track how your database schema has evolved for better debugging, code review, and cross-team collaboration. For example, you can compare schemas after your peer has merged their PR and applied migrations.

Join us on [Discord](https://neon.tech/discord) and let us know what you think and how you use schema diff in your workflows.

We detailed how Neon storage and ephemeral branches work in the [Point In Time Recovery Under the Hood in Serverless Postgres](https://neon.tech/blog/point-in-time-recovery-in-postgres#ephemeral-branches) article. In short, Neon’s storage engine saves Write-Ahead-Log records and can reconstruct a Postgres page at any given timestamp or Log-Sequence Number, allowing for time travel queries.

Under the hood, schema diff creates short-lived, ephemeral branches (TTL=10 seconds) set at a specific time (and LSN), then queries the Pageservers to retrieve the past schema, and then compares it with the current one to effectively display the changes.

Let’s see an example of schema diff on the Console. For that, we will create a Neon project and run the following query to create a user table:

<img
  src="https://lh7-us.googleusercontent.com/i8SiccLqfaZc3LGzo9LS2PDUtely5JtRlumiSemhfxWXjpqklpN3UOCZ9FsQ77KRgk1tDxnhQyTRJIhjOq-0cVAqpPoBIEEbfnwdsJdHmEjtofApOcqf1cHPas-2Xe5kn4lFL_yoN_q2koMeXNE_wr8"
  alt="Post image"
  width="975"
  height="512"
/>

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Once done, we can compare the current state of the database with the user table to its previous state, where I had no tables. To do so, we first need to navigate to the Restore page, select a branch, and click on Schema Diff.

<img
  src="https://lh7-us.googleusercontent.com/Mdk92rcHNgmAI6N12lQgq9pJJrP9Z65yIQ91x-UOsJMFeqoFIfSybmvrHVWEdKWXDCBt3PDPd0HVep818pSP3fMuaKqXh_DXfoN4e_wV62DBS_PI2wp3aKkqtkwZ1_t6vhW6W21Lmc9hvU3woNkj9Qw"
  alt="Post image"
  width="975"
  height="512"
/>

Below is what the result will look like:

<img
  src="https://lh7-us.googleusercontent.com/mR7snpsTg0mn3d-X-DGrVzEYUGBy9ostInduEnvaO1TQv8F08R90KSomLPHY-hSCjhV0jNQGkp-pv7z9R2ciu73fShvxku7cWGkR70ZL8lMSnjY1IWLoULL5bBlMYJPzynA0JgAsw4uNnTpIRUQprM0"
  alt="Post image"
  width="975"
  height="512"
/>

As expected, the previous state of my database is empty because I had just created the project. Let’s now modify my schema by adding a new `phone_number` column:

```sql
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(20);
```

Let’s compare again with the state of my database at 10:52 PM, the time after I ran the schema changes. The result should look like this:

<img
  src="https://lh7-us.googleusercontent.com/kMZvzi2VLjUIQP-jVt8atJKrJCU9GQ8Rk3NVNcQq_WOIewfqNP0zzB16JGDQXV-t90Ok1nvmSoQPVMfk0b2J5mNMdZ2rE3muqBeR-L2tiKMetGX6Tl-tnfYr0pN6YGJXh7PzOVrXtgF4nF3Kw8PKMCc"
  alt="Post image"
  width="975"
  height="512"
/>

We can observe that lines 60 and 61 were modified as a result of the schema change.

# Protected branches

Protected branches prevent unauthorized applications, users, and roles from accessing personally identifiable information (PII) or other sensitive data within your branch. This feature is available for users who are on [the Scale plan](https://neon.tech/pricing)

The first feature that’s available in this release is “IP Allow”, which restricts database access exclusively to trusted IP addresses. We plan on introducing more rules in the future.

If there are other ways we can protect your database branches, let us know on [Discord](https://neon.tech/discord) or [X](https://x.com/neondatabase).

You have a limit of 5 protected branches in your project. To set your branch as protected, simply follow these steps:

1. Go to the branches page.
2. Find the database branch you wish to protect.
3. Click on “More” and then select “Set as protected.”

<img
  src="https://lh7-us.googleusercontent.com/hka0TDGJnAVcr7AGqLVClhL_Wg4SL_tzK7HFRdqAingPNEyAK5ZvkjGeGGbGvJU8Roz53hlCOZw_3HMGPxXR5VS0mfsWj9ofLDOXQJJoKvyoImhI2CIuz7_9tO1_-TP4HpGZfyno5QdrV58DOcM-puQ"
  alt="Post image"
  width="975"
  height="512"
/>

Check out the documentation for [more details on protected branches](https://neon.tech/docs/manage/branches#protected-branch).

# Conclusion

The addition of Schema Diff and Protected Branches to Neon allows developers to easily identify schema changes and safeguard sensitive data, and equipped to build with confidence.<br />[You can try Schema Diff and Protected Branches on Neon](https://console.neon.tech) today. Join us on [Discord](https://neon.tech/discord), and let us know how we can help you build better and ship faster with Neon.

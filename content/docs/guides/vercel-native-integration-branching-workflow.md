---
title: Set up a database branching workflow with the Vercel Native Integration
subtitle: Create a database branch for every preview deployment with the Neon's native Vercel integration 
enableTableOfContents: true
isDraft: false
updatedOn: '2024-12-11T21:23:33.087Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>What is the Neon Postgres Native Integration</p>
<p>How to install Neon Postgres from the Vercel Marketplace</p>
<p>How to manage your integration</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/vercel-previews-integration">Neon Postgres Previews Integration</a>
<a href="/docs/introduction/plans">Neon plans</a>
</DocsList>
</InfoBlock>

This guide describes how to connect your Vercel project to a Neon database and enable database branching for Vercel preview deployments.

## Connect your a Vercel project to your Neon database

You can connect your a Vercel project to a Neon database and optionally create a database branch for each Vercel preview deployment.

To connect your Vercel project to your Neon database:

1. From the **Storage** tab in the Vercel Dashboard, select your Database.
2. On your Database page, select **Connect Project**.

    ![Connect a Vercel Project](/docs/guides/vercel_native_connect_project.png)

3. Select the Vercel project you want to connect and the environments you want to add database environment variables to (**Development**, **Preview**, **Production**). 

    ![Select a Vercel Project](/docs/guides/vercel_native_select_project.png)

4. Optionally, under **Advanced Options**, you can:
   - Specify an **Environment Variables Prefix** for the database environment variables that will be added to your Vercel project. A prefix is not required but may help you track and identify variables later.
   - Under **Deployments Configuration**, you can toggle the **Required** option and select **Preview** to create a Neon branch with every preview deployment (the **Deployment** and **Production** options here do not do anything — you can ignore them). Enabling the **Required** option means that a database branch must be created for each preview deployment.

   <Admonition type="note" title="A database branch for every preview deployment">
   A Neon branch with every Vercel preview deployment creates an isolated copy of your database that you can modify without affecting your production database. This means you can preview both application and database changes together.
   </Admonition>

    ![Vercel deployment configuration](/docs/guides/vercel_native_deployments_configuration.png)

5. Click **Connect** to finish the setup.

    If you enabled database branching for preview deployments, each commit to a new branch in GitHub creates a database branch in Neon.

    For more about this setup, refer to our detailed guide: [Set up a database branching workflow with the Vercel Native Integration](tbd).



## Disconnecting a database

<NeedHelp/>

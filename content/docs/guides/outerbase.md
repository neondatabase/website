---
title: Connect Outerbase to Neon
subtitle: Connect Outerbase to your Neon project with the Neon Outerbase integration
enableTableOfContents: true
updatedOn: '2024-08-08T18:06:25.262Z'
---

Outerbase is an AI-powered interface for your database that allows you and your team to view, query, visualize, and edit your data using the power of AI. Outserbase supports both SQL and natural language. To learn more, see [What is Outerbase?](https://docs.outerbase.com/introduction/what-is-outerbase)

## Prerequisites

The setup described below assumes that you have a Neon account and project. If not, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up). An Outerbase account is also required, but if you do not have one, you can set one up when adding the integration.

## Add the Outerbase integration

To add the Outerbase integration to your Neon project:

1. In the Neon Console, navigate to the **Integrations** page for your project.
2. Locate the **Outerbase** integration card and click **Add Outerbase**.
   ![Outerbase integration card](/docs/guides/github_card.png)
3. On the **Log in to Outerbase** dialog, login with your Outerbase account or create an account if you do not have one. You can also sign in with a Google account.
4. Step through the Outerbase onboarding pages by selecting from the provided options.
5. When you reach the **How would you like to get started** page, select the **Connect a database** option.
6. On the **Create a base** page, select **Neon** from the **Connect to your cloud provider** section of the page.
7. You are directed to an **Authorize Outerbase** dialog. Click **Authorize** to give Outerbase permission to access your Neon account.
8. You are directed to a **Connect to your Neon database** page. If you have more than one Neon project, select the project you want to connect to from the **Select a database** drop-down menu.
   <Admonition type="note">
   If you use Neon's [IP Allow](/docs/introduction/ip-allow) feature, be sure to copy the provided Outerbase IP addresses from this page and add them to your Neon IP allowlist. See [Configure IP Allow](/docs/manage/projects#configure-ip-allow) for instructions. IP Allow is a Neon [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plan feature.
   </Admonition>
9. Select **Connect to Database**.
   <Admonition type="important">
   Wait for a moment for the connection to be established. The **Connect to Database** button will change to a **Go to base** button when the connection is available.
   </Admonition>
10. Click **Go to base** to finish the setup.

You are taken to Outerbase's **Get Started tour** where you are guided through the basics of working with Outerbase. For information about the tour, see [Get started with Outerbase](https://docs.outerbase.com/introduction/get-started).

For a conceptual overview of Outerbase, see [Outerbase concepts](https://docs.outerbase.com/introduction/concepts).

## Outerbase support

For Outerbase support and additional resources, refer to [Outerbase Community & Support](https://docs.outerbase.com/introduction/community-support).

## Remove the Outerbase integration

To remove the Outerbase integration:

1. In the Neon Console, navigate to the **Integrations** page for your project.
2. Locate the Outerbase integration and click **Manage** to open the **Outerbase integration** drawer.
3. Click **Disconnect**.
4. Click **Remove integration** to confirm your choice.

## Feedback and future improvements

If you've got feature requests or feedback about what you'd like to see from Neon's Outerbase integration, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.

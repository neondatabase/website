---
title: Project sharing 
subtitle: Learn how to share your Neon project with others
enableTableOfContents: true
---

The [Neon Pro plan](/docs/introduction/pro-plan) enables sharing your Neon project with other users, which gives them access to your Neon project from all supported management interfaces including the Neon Console, API, and CLI. Follow this guide to learn how.

## Set up Neon accounts

You can share your Neon project with anyone. The only requirement is that the user has a Neon account. The account can be a Free Tier account or Pro account.

1. If the user does not have a Neon account, ask them to sign up. You can provide your users with the following instructions: [Sign up](/docs/get-started-with-neon/signing-up).
2. Request the email address associated with the account the user signed up with. For example, if the user signed up with their Google account, ask for the email address associated with their Google account.

## Share your project

After a user has provided you with the email address associated with their Neon account, you can share your project with that user.

To share your project:

1. Navigate to the [Neon Console](https://console.neon.tech/app/projects).
2. Select the project you want to share.
1. On the Neon **Dashboard**, select **Settings** from the sidebar.
1. On the **Settings** page, select **Sharing**.
1. Under **Grant access to your project**, enter the email address of the account you want to share your project with.
    ![Grant access to a project](/docs/guides/sharing_grant_access.png)
1. Click **Grant access**. The email you specify is added to the list of **People who have access to the project**.
    ![People with access](/docs/guides/sharing_people_with_access.png)

    The Neon account associated with the email address is granted full access to the project with the exception privileges required to delete the project. When the user logs in to Neon, the shared project is listed on their **Projects** page, under **Shared with me**.

    ![Project shared with me](/docs/guides/shared_with_me.png)

    An email is also sent to the email address informing the user that a project has been shared with them. The email includes an **Open project** link the user can click on to log in to Neon. After logging in, the user is directed to the **Dashboard** for the shared project in the Neon Console.

    <Admonition type="note">
    A user **without** a Neon account will not receive an email notification when a project is shared. However, if the user creates a Neon account afterward with the specified email address, the shared project will be available when the user logs in to the Neon Console.
    </Admonition>

## Shared project billing

The costs associated with a shared project are charged to the Neon account that owns the project. For example, if you were to share your project with another Neon user account, any usage incurred by that user within your project is billed to your Neon account.

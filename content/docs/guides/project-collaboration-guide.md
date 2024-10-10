---
title: Project collaboration
subtitle: Learn how to invite people to collaborate on your Neon project
enableTableOfContents: true
redirectFrom:
  - /docs/guides/project-sharing-guide
updatedOn: '2024-10-10T14:49:19.604Z'
---

You can invite other users to collaborate with you on a Neon project. Project collaboration lets other users access and contribute to your project from all supported Neon interfaces, including the Neon Console, Neon API, and Neon CLI. Follow this guide to learn how.

<Admonition type="note">Project collaboration lets people not on your team work on a project with you. If you're inviting team members, consider creating an [Organization](docs/manage/organizations) instead. Organizations can also use project collaboration &#8212; for example, to allow an external contractor to contribute to a single project without making them a full Organization Member.</Admonition>

## Set up Neon accounts

You can invite anyone to join you in collaborating on your Neon project. To collaborate on a project, the user must have a Neon account, which can be a Neon Free Plan or a paid plan account.

1. If the user does not have a Neon account, ask them to sign up. You can provide your users with the following instructions: [Sign up](/docs/get-started-with-neon/signing-up).
2. Request the email address the user signed up with. If the user signed up using Google or GitHub, request the email address associated with that account.

## Invite collaborators

After a user has provided you with the email address associated with their Neon account, you can invite them to your project.

**To invite a collaborator to your project:**

1. Navigate to the [Neon Console](https://console.neon.tech/app/projects).
2. Select the project you want to invite collaborators to.
3. In the Neon **Settings**, choose **Collaborators** from the sidebar.

   ![Invite collaborators](/docs/guides/sharing_grant_access.png)

4. Click **Invite**. In the modal that pops up, enter the email address of the person you'd like to invite. You can enter multiple emails separated by commas.
5. Click **Invite** in the modal to confirm; the specified email(s) will be added to the list of **Collaborators**.
6. Review the list of collaborators to verify the user was successfully added.

The invited users will be granted access to the project, but they will not have privileges to delete the project. They can also invite other users to join the collaboration. When they log into Neon, the project will appear under the **Projects** section, listed as **Shared with me**.

An email is sent to the invited users informing them of the project invitation, including an **Open project** link for easy access.

## Project collaboration limits

When you invite a user to your project, they operate under _your_ project allowances so long as they're using your project. For example, a Neon Free Plan user is limited to 10 branches per project, but if they are using your project, there is no such restriction. For an overview of plan limits, see [Neon plans](/docs/introduction/plans#neon-plans).

### Access for collaborators via the Neon API or CLI

Collaborators you invite to a project can access it from all supported Neon interfaces, including the Neon Console, [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), and [Neon CLI](/docs/reference/neon-cli).

Collaborators can use their own API key to access the project via the Neon API. See [Manage API keys](/docs/manage/api-keys) for details on generating an API key.

When using the Neon CLI, collaborators authenticate as they normally would. They can access both their own Neon projects and any projects they are collaborating on. See [Neon CLI — Connect](/docs/reference/cli-install#connect) for authentication instructions.

## Billing for projects with collaborators

All costs associated with a project are charged to the Neon account that owns it. For example, if you invite someone to collaborate on your project, any usage incurred by that collaborator will be billed to your Neon account.

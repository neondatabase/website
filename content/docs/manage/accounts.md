---
title: Accounts
subtitle: Find out which account type is right for you
enableTableOfContents: true
updatedOn: '2025-03-07T12:50:26.778Z'
---

Neon offers two account types for you to choose from:

- **Personal account**
- **Organization account**

## Personal accounts

When you first sign up with Neon, whether you're signing up on your own or you're invited to join, you start with a personal account. During your [onboarding](/docs/get-started-with-neon/signing-up#onboarding-in-the-neon-console), you are prompted to create your first personal project that you can get started with.

You can always access your personal account settings from your **Profile** dropdown.

![personal account settings](/docs/manage/personal_account.png)

If you want to work with other people on this project, your options are:

- [Invite collaborators](/docs/guides/project-collaboration-guide) (other Neon users) to the project
- [Transfer](/docs/manage/orgs-project-transfer) the project from a personal to an Organization-level project, where you can then invite other users

## Organization accounts

Any Neon paid account user can [create an Organization account](/docs/manage/organizations#create-an-organization), which allows you to share projects with your team members. Whether you create an organization or are invited to join one, you still retain your personal account, letting you manage personal projects independently of any organizations you belong to. As an organization member, you'll have access to all projects within that organization.

From the Neon Console, you can navigate to your Organization dashboard, where you'll find all the projects in the organization and can take any actions that your permissions allow.

![organizations projects tab](/docs/manage/org_projects.png)

See [Organizations](/docs/manage/organizations) to learn more.

## Switching between accounts

Easily switch between your personal account and any organization you are a Member of using the navigation breadcrumb.

![Switch between personal and organization](/docs/manage/switch_to_org.png 'no-border')

## Deleting your account

After deleting your account, you'll have a brief window to reactivate it if you change your mind. Just log back in to restore your account. Once this window closes, however, your account and related information will be permanently purged and cannot be recovered.

Before deleting your account, you must take deliberate steps to remove your resources. This includes deleting all projects, leaving any organizations, and, if you're on a paid plan, downgrading to the Free Plan.

To protect your data, each resource must be removed individually &#8212; nothing is deleted in bulk. The **Delete** action will stay disabled until all conditions are met.

![delete personal account](/docs/manage/delete_account.png)

Here's where to go in the Neon Console to complete these actions:

| **Action**                  | **Instructions**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Leave all organizations** | On the **People** page of each organization you belong to, find your name and select **Leave organization** from the more options menu. If you're the only Admin, promote another Member to Admin first &#8212; or delete the organization if it is no longer required. <br/> ![leave organization](/docs/manage/leave_org.png) <br/> When deleting an organization, you must first remove all its resources before you can delete the organization itself. See [Delete an organization](/docs/manage/orgs-manage#delete-an-organization) for more detail. |
| **Delete all projects**     | Go to the **Projects** page and manually [delete](/docs/manage/projects#delete-a-project) each project from **Settings → Delete**.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Downgrade your account**  | Go to **Billing → Change plan** and select **Downgrade to Free plan**. <br/> ![downgrade to free plan](/docs/manage/downgrade_to_free.png)                                                                                                                                                                                                                                                                                                                                                                                                                 |

Once all conditions are met and all your checkmarks show green, you can safely deactivate your account. You'll get a confirmation email soon afterwards. If you change your mind, just log back in within 30 days to reactivate your account with your personal info intact. API keys, however, will not be restored.

After 30 days, your account will be permanently removed.

## Recover access to a Neon account

If a former employee owned a Neon account and didn’t shut it down or transfer access before leaving, you can follow the steps outlined below to recover the account.

### Step 1: Regain access through the original login method

First, determine how the account was accessed.

#### A. If the account used a third-party login

If the former employee signed up with a third-party identity provider (e.g., Google, GitHub, Microsoft, Hasura), you must recover access to that account through your organization’s identity provider. Neon cannot bypass third-party authentication.

#### B. If the account used email and password

If you have access to the former employee’s company email account:

1. Go to the [Neon login page](https://console.neon.tech/login)
2. Click **Forgot Password**
3. Enter the former employee’s email address
4. Access the password reset link from their inbox
5. Set a new password and sign in

Once signed in, you can:

- [Update the email address](/docs/manage/email-signup#changing-your-email)
- [Transfer project ownership](/docs/manage/orgs-project-transfer)
- [Add an admin](/docs/manage/orgs-manage#set-permissions) to your projects or organization
- [Update billing details](/docs/introduction/manage-billing)

<Admonition type="note">
For security reasons, we recommend immediately revoking access to company email accounts when employees leave your organization.
</Admonition>

### Step 2: If you cannot access the email or login method

If the original login method is inaccessible, we can assist through a manual identity verification process.

To begin:

1. Open a [Neon Support ticket](https://console.neon.tech/app/projects?modal=support) from your Neon account.
2. Provide:
   - A signed statement on company letterhead explaining the situation
   - Contact details for another employee at your company

Neon will:

- Notify the email address associated with the account and wait 24 business hours (Mon–Fri) for a response
- Send you a document to sign electronically
- Schedule a short video call to verify your identity (please have a government-issued ID ready)

<Admonition type="info">
Neon will not store or copy your ID. It’s used only to confirm that the person on the call is who they say they are.
</Admonition>

Once all steps are complete, we’ll grant access to the account or transfer project ownership as needed.

<Admonition type="important">
Neon Support may request additional information during or after the verification process. Manual account recovery is a sensitive procedure designed to protect your organization’s data and prevent unauthorized access.
</Admonition>

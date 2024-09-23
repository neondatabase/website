---
title: Accounts
subtitle: Find out which account type is right for you
enableTableOfContents: true
updatedOn: '2024-09-20T18:01:57.361Z'
---

Neon offers two account types for you to choose from:

- **Personal account**
- **Organization account** (Early Access)

## Personal accounts

When you first sign up with Neon, whether you're signing up on your own or you're invited to join, you start with a personal account. During your [onboarding](/docs/get-started-with-neon/signing-up#step-2-onboarding-in-the-neon-console), you are prompted to create your first personal project that you can get started with.

You can always access your personal account settings from your **Profile** dropdown.

![personal account settings](/docs/manage/personal_account.png)

If you want to work with other people on this project, your options are:

- [Share](/docs/guides/project-sharing-guide) the project with another Neon user
- [Transfer](/docs/manage/orgs-project-transfer) the project from a personal to an Organization-level project, where you can then invite other users

## Organization accounts

<FeatureBeta/>

Any Neon paid account user can [create an Organization account](/docs/manage/organizations#create-an-organization), which allows you to share projects with your team members. Whether you create an organization or are invited to join one, you still retain your personal account, letting you manage personal projects independently of any organizations you belong to.

From the Neon Console, you can navigate to your Organization dashboard, where you'll find all the projects in the organization and can take any actions that your permissions allow.

![organizations projects tab](/docs/manage/org_projects.png)

See [Organizations](/docs/manage/organizations) to learn more.

## Switching between accounts

Easily switch between your personal account and any organization you are a Member of using the navigation breadcrumb.

![Switch between personal and organization](/docs/manage/switch_to_org.png 'no-border')

## Deleting your account

After deleting your account, it is suspended for 180 days; if you log back within this period your account will be reactivated. After 180 days, your account and related information is permanently purged and cannot be recovered.

Before deleting your account, you must take deliberate steps to remove your resources. This includes deleting all projects, leaving any organizations, and, if you're on a paid plan, downgrading to the Free Plan.

To protect your data, each resource must be removed individually &#8212; nothing is deleted in bulk. The **Delete** action will stay disabled until all conditions are met.

![delete personal account](/docs/manage/delete_account.png)

Here's where to go in the Neon Console to complete these actions:

| **Action**                  | **Instructions**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Leave all organizations** | On the **People** page of each organization you belong to, find your name and select **Leave organization** from the more options menu. If you're the only Admin, promote another Member to Admin first &#8212; or delete the organization if it is no longer required. <br/> ![leave organization](/docs/manage/leave_org.png) <br/> When deleting an organization, you must first remove all its resources before you can delete the organization itself. See [Delete an organization](/docs/manage/orgs-manage#delete-an-organization) for more detail. |
| **Delete all projects**     | Go to the **Projects** page and manually [delete](docs/manage/projects#delete-a-project) each project from **Settings → Delete**.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Downgrade your account**  | Go to **Billing → Change plan** and select **Downgrade to Free plan**. <br/> ![downgrade to free plan](/docs/manage/downgrade_to_free.png)                                                                                                                                                                                                                                                                                                                                                                                                                 |

Once all conditions are met and all your checkmarks show green, you can safely deactivate your account. You'll get a confirmation email soon afterwards. If you change your mind, just log back in within 180 days to reactivate your account with your personal info intact. API keys, however, will not be restored.

After 180 days, your account will be permanetly removed.

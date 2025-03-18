---
title: Manage Neon Organizations
enableTableOfContents: true
updatedOn: '2025-03-14T18:29:25.736Z'
---

Learn how to manage your organization's projects, invite Members and Collaborators, revise permissions, and oversee billing details. This section explains which specific actions each Member can take based on their assigned roles and permissions.

<div style={{ display: 'flex' }}>
  <div style={{ flex: 1, paddingRight: '20px' }}>
    <ul>
      <li><a href="#switch-to-your-organization-account">Switch to your org</a></li>
      <li><a href="#invite-members">Invite Member</a></li>
      <li><a href="#invite-collaborators">Invite Collaborators</a></li>
      <li><a href="#set-permissions" style={{ cursor: 'pointer' }} >Set permissions</a></li>
    </ul>
  </div>
  <div style={{ flex: 1 }}>
    <ul>
      <li><a href="#create-and-delete-projects">Create and delete projects</a></li>
      <li><a href="#passwordless-authentication">Passwordless authentication</a></li>
      <li><a href="#rename-an-organization">Rename an organization</a></li>
      <li><a href="#delete-an-organization">Delete an organization</a></li>
      <li><a href="#billing">Billing</a></li>
    </ul>
  </div>
</div>

## Switch to your Organization account

Easily switch between your personal account and any organization you are a Member of using the navigation breadcrumb.

![Switch between personal and organization](/docs/manage/switch_to_org.png 'no-border')

## Invite Members

Only Admins have the authority to invite new Members to the organization. Invitations are issued via email. If a recipient does not have a Neon account, they will receive instructions to create one.

![organizations people tab](/docs/manage/orgs_people.png)

To invite Members:

- Navigate to the **People** page in your Organization.
- Click **Invite member** and enter the email addresses in a comma-separated list.
- Monitor the status of sent invites on the **Pending Invites** page; from here, you can resend or cancel invitations as needed.

<Admonition type="note" title="Invites not received?">
If invite emails aren't received, they may be in spam or quarantined. Recipients should check these folders and mark Neon emails as safe.
</Admonition>

## Set permissions

Permissions within the organization are exclusively managed by Admins. As an Admin:

- You can promote any Member to an Admin, granting them full administrative privileges.
- You can demote any admin to a regular Member.
- You cannot leave the organization if you are the only Admin. Promote a Member to Admin before you try to leave the org.

  ![organization members](/docs/manage/orgs_members_kebab.png 'no-border')

## Rename an organization

Only Admins can rename an organization. Go to the **Settings** page under **General information**. Changing the organization name applies globally—the new name will appear for everyone in the organization.

![organization settings](/docs/manage/orgs_id.png 'no-border')

## Invite Collaborators

All members can invite external users to [collaborate](/docs/guides/project-collaboration-guide) on specific projects. Collaborators will not have access to the organization Dashboard but can access any projects shared with them from the **Projects** page of their personal account, under **Shared with you**. Collaborators can invite additional Collaborators to the project and remove existing Collaborators from the project.

<Admonition type="note">
Organization members don't need Collaborator invites as they already have full project access. When projects are transferred to an organization, existing collaborator permissions for organization members are automatically removed.
</Admonition>

![organization collaborators](/docs/manage/org_collaborators.png)

To invite new Collaborators, click **Invite collaborators** and select the project you want to share, then add a comma-separated list of emails for anyone you want to give access to. These users will receive an email inviting them to the project.

<Admonition type="note" title="Invites not received?">
If invite emails aren't received, they may be in spam or quarantined. Recipients should check these folders and mark Neon emails as safe.
</Admonition>

### Manage Collaborators

Click the More Options menu next to the row in the **Collaborators** table to manage Collaborator access. You have two options:

- **Convert to member** — Admins can promote an external Collaborator to a full Member. When promoted, their collaborator permissions will be automatically removed since they'll have access to all projects as a Member.
- **Remove from project** — All members can revoke the Collaborator's access to the shared project.

  ![collaborators more options menu](/docs/manage/orgs_collaborators_kebab.png 'no-border')

## Create and delete projects

All Members can create new projects from the Organization's **Projects** page; however, the organization itself retains ownership of these projects, not the individual user.

Members have different capabilities based on their roles:

- Any Member can create a project under the organization's ownership.
- Members cannot delete projects owned by the organization. They can only delete personal projects from their personal account (switch to personal account via breadcrumb).
- Admins can delete any project within the organization.

## Passwordless authentication

If you want the simplest way to connect to your database from the command line, passwordless authentication using `pg.neon.tech` lets you directly start a `psql` connection with any of your organization's databases. This saves you time versus logging in to the Console and copying your connection string manually.

```bash
   psql -h pg.neon.tech
```

In the output, you'll get a URL you can paste into your browser. Log in if you need to. Or if you're already logged in, you'll be asked to select from your personal or organization account, select your project, and then your compute. After that, go back to your terminal and you'll be connected to your selected database.

For example:

```bash
alexlopez@alex-machine ~ % psql -h pg.neon.tech
NOTICE:  Welcome to Neon!
Authenticate by visiting:
    https://console.neon.tech/psql_session/secure_token

NOTICE:  Connecting to database.
psql (16.1, server 16.3)
SSL connection (secure connection details hidden)
Type "help" for help.

alexlopez=>
```

## Delete an organization

Only Admins can delete an Organization. Before doing so, make sure all projects within the Organization are removed.

In your Organization's **Settings** page, you'll find the **Delete** section. It will list any actions you need to take before deletion is allowed. For example, if you still have outstanding projects that need to be remove, you'll see:

![delete organization](/docs/manage/orgs_delete.png)

Complete any necessary steps. Once cleared, you can go ahead and delete. This action will permanently remove the organization and cancel its associated billing. It can't be reversed.

## Billing

On creating an organization, your existing paid plan (Launch, Scale, or Enterprise) will be transferred to the new organization account. Following the conversion, your personal account will switch to the Free Plan, letting you manage any new personal projects separately.

As the Admin for the organization account:

- You have full access to edit all billing information.
- Promote a Member to Admin if you want to delegate billing management; however, all Admins will have the capability to edit billing details.
- While all Members can view the **Billing** page, only admins can make changes.

For detailed information on pricing and plans, refer to [Neon plans](/docs/introduction/plans).

### Downgrade to Free Plan

Admins can downgrade an organization from a paid plan (Launch, Scale, or Enterprise) to the Free plan, with certain limitations:

- The organization must operate within Free plan limits (including storage, project counts, and branch limits)
- The organization cannot have more than 1 member (Free organizations can only have a single member)

When you start a downgrade (via **Billing** > **Billing summary** > **Change plan**), Neon automatically checks if your organization meets these requirements. If needed, you'll see a notification explaining what needs to be addressed before downgrading.

If you can't meet these requirements but still wish to downgrade, use the **Request support** option during the downgrade process.

For detailed information on pricing and plans, refer to [Neon plans](/docs/introduction/plans).

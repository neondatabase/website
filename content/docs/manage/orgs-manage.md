---
title: Manage Neon Organizations
enableTableOfContents: true
updatedOn: '2025-03-14T18:29:25.736Z'
---

Learn how to manage your organization's projects, invite Members, revise permissions, and oversee billing details. This section explains which specific actions each Member can take based on their assigned roles and permissions.

<Steps>

## Create an organization

To create a new org, use the **Create organization** button in the org switcher in the top navbar. Select a plan and enter billing details.

![create organization button](/docs/manage/orgs_create_button.png)

Other than the free org you signed up with, organizations are always on paid plans. When creating a new organization, you'll need to select a paid plan and enter billing details.

![create organization with billing](/docs/manage/orgs_create_with_billing.png)

After confirming, you'll be directed to your new organization's **Projects** page, where you can get started creating projects and inviting [members](/docs/manage/orgs-manage#invite-members).

## Invite Members

Only Admins have the authority to invite new Members to the organization. Invitations are issued via email. If a recipient does not have a Neon account, they will receive instructions to create one.

![organizations people tab](/docs/manage/orgs_people.png)

To invite Members:

- Navigate to the **People** page in your Organization.
- Click **Invite member** and enter the email addresses in a comma-separated list.
- Monitor the status of sent invites on the **Pending Invites** section; from here, you can resend or cancel invitations as needed.

<Admonition type="note" title="Invites not received?">
If invite emails aren't received, they may be in spam or quarantined. Recipients should check these folders and mark Neon emails as safe.
</Admonition>

## Set permissions

Permissions within the organization are exclusively managed by Admins. As an Admin:

- You can promote any Member to an Admin, granting them full administrative privileges.
- You can demote any admin to a regular Member.
- You cannot leave the organization if you are the only Admin. Promote a Member to Admin before you try to leave the org.

![organization members](/docs/manage/orgs_members_kebab.png 'no-border')

## Invite Collaborators

Any member can invite external users to [collaborate](/docs/guides/project-collaboration-guide) on specific projects. For example, if you want to give limited access to a contractor.

Members can invite collaborators from a project's **Settings** page. If any project in your organization has collaborators, you'll also see the option to invite and manage collaborators from the organization'e **People** page.

Collaborators _do not_ have access to the organization. They access their shared projects by selecting the **Projects shared with me** option in the org switcher.

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

- Any Member can create a project under the organization's ownership.
- Only Admins can delete projects owned by the organization.

## Manage billing

When you create a new organization, you'll choose a plan (Launch, Scale, or Enterprise) for that organization. Each organization manages its own billing and plan.

As the Admin for the organization account:

- You have full access to edit all billing information.
- Promote a Member to Admin if you want to delegate billing management; however, all Admins will have the capability to edit billing details.
- While all Members can view the **Billing** page, only admins can make changes.

For detailed information on pricing and plans, refer to [Neon plans](/docs/introduction/plans).

### Downgrade to Free Plan

You can only have one Free organization per account, and Free orgs are just for personal use (no team members). If you already have a Free org, you can't downgrade another org to Free—you'll see an error if you try.

To downgrade, your org must:

- Have only one member (just you)
- Stay within Free plan limits (storage, projects, branches, etc.)

If you need help or think you should be able to downgrade, use the **Request support** option during the downgrade process.

[See Neon plans for details.](/docs/introduction/plans)

## Delete an organization

Only Admins can delete an Organization. Before doing so, make sure all projects within the Organization are removed.

In your Organization's **Settings** page, you'll find the **Delete** section. It will list any actions you need to take before deletion is allowed. For example, if you still have outstanding projects that need to be removed, you'll see:

![delete organization](/docs/manage/orgs_delete.png)

Complete any necessary steps. Once cleared, you can go ahead and delete. This action will permanently remove the organization and cancel its associated billing. _It can't be reversed._

</Steps>

## More actions

Here are a couple additional things you can do with your organization: **passwordless authentication** and **renaming an organization**.

### Passwordless authentication

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

### Rename an organization

Only Admins can rename an organization. Go to the **Settings** page under **General information**. Changing the organization name applies globally—the new name will appear for everyone in the organization.

![organization settings](/docs/manage/orgs_id.png 'no-border')

<NeedHelp />

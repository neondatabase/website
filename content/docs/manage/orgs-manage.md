---
title: Manage Neon Organizations
enableTableOfContents: true
---

<EarlyAccess/>

Learn how to manage your organization's projects, invite Members and Guests, revise permissions, and oversee billing details. This section explains which specific actions each Member can take based on their assigned roles and permissions.

<div style={{ display: 'flex' }}>
  <div style={{ flex: 1, paddingRight: '20px' }}>
    <ul>
      <li><a href="#switch-to-your-organization-account">Switch to your org</a></li>
      <li><a href="#invite-members">Invite Member</a></li>
      <li><a href="#invite-guests">Invite Guests</a></li>
      <li><a href="#set-permissions" style={{ cursor: 'pointer' }} >Set permissions</a></li>
    </ul>
  </div>
  <div style={{ flex: 1 }}>
    <ul>
      <li><a href="#set-permissions">Manage projects</a></li>
      <li><a href="#passwordless-authentication">Passwordless authentication</a></li>
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

## Set permissions

Permissions within the organization are exclusively managed by Admins. As an Admin:

- You can promote any Member to an Admin, granting them full administrative privileges.
- You can demote any admin to a regular Member.
- You cannot leave the organization if you are the only Admin. Promote a Member to Admin before you try to leave the org.

  ![organization members](/docs/manage/orgs_members_kebab.png 'no-border')

## Invite Guests

Admins can also invite external Guests to collaborate on specific projects through [project sharing](/docs/guides/project-sharing-guide). Guests will not have access to the organization itself but can access any projects shared with them from the **Projects** page of their personal account, under **Shared with Me**.

<Admonition type="note">
Any users you've already shared projects with will appear as Guests on the **Guests** page if those projects were transferred during the organization conversion.
</Admonition>

![organization guests](/docs/manage/org_guests.png)

To invite new Guests, click **Invite guests** and select the project you want to share, then add a comma-separated list of emails for anyone you want to give access to.

### Manage Guests

Click the kebab menu next to the row in the **Guests** table to manage Guest access. You have two options:

- **Convert to member** — promote the Guest to a full Member, granting access to all projects in the organization.
- **Remove from project** — revoke the Guest's access to the shared project.

  ![guests kebab](/docs/manage/orgs_guests_kebab.png 'no-border')

## Manage projects

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

In your Organization's **Settings** page, under the **General** tab, you'll find the **Delete** section. It will list any actions you need to take before deletion is allowed. For example, if you still have outstanding projects that need to be remove, you'll see:

![delete organization](/docs/manage/orgs_delete.png)

Complete any necessary steps. Once cleared, you can go ahead and delete. This action will permanently remove the organization and cancel its associated billing. It can't be reversed.

## Billing

On creating an organization, your existing paid plan (Launch, Scale, or Enterprise) will be transferred to the new organization account. Following the conversion, your personal account will switch to the Free Plan, letting you manage any new personal projects separately.

As the Admin for the organization account:

- You have full access to edit all billing information.
- Promote a Member to Admin if you want to delegate billing management; however, all Admins will have the capability to edit billing details.
- While all Members can view the **Billing** page, only admins can make changes.

For detailed information on pricing and plans, refer to [Neon plans](/docs/introduction/plans).

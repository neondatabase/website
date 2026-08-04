---
title: Manage Neon Organizations
summary: >-
  Neon organization management covers Console workflows for creating
  organizations, inviting members, assigning organization roles, granting
  per-project permissions, requiring 2FA, and managing per-organization
  billing. Use this page to add or remove members, change someone's role, or
  delete an organization from the UI. Admins control deletions, billing
  changes, and 2FA enforcement.
enableTableOfContents: true
updatedOn: '2026-08-04T15:25:12.468Z'
---

Learn how to manage your organization's projects, invite members, set their access, and oversee billing details. For a breakdown of what each organization role and per-project permission allows, see [User permissions](/docs/manage/user-permissions).

<Admonition type="note">
Organizations managed through the [Vercel-managed integration](/docs/guides/vercel-managed-integration) still use the legacy roles (Admin, Member, Collaborator). See [Legacy permissions](/docs/manage/user-permissions#legacy-permissions).
</Admonition>

<Steps>

## Create an organization

To create a new org, use the **Create organization** button in the org switcher in the top navbar.

![create organization button](/docs/manage/orgs_create_button.png)

Select a plan for your new organization. Organizations can be free or paid; if you choose a paid plan, you'll enter billing details.

![create organization with billing](/docs/manage/orgs_create_with_billing.png)

After confirming, you'll be directed to your new organization's **Projects** page, where you can get started creating projects and inviting [members](/docs/manage/orgs-manage#invite-members).

## Invite members

Only Admins can invite new members to the organization. Invitations are issued via email. If a recipient does not have a Neon account, they will receive instructions to create one. Alternatively, you can [auto-provision members by domain](/docs/manage/orgs-add-members-by-domain) so that users with a matching email domain are added automatically when they sign up or log in.

![organizations people tab](/docs/manage/orgs_people.png)

To invite members:

- Navigate to the **People** page in your Organization.
- Click **Invite member** and enter the email addresses in a comma-separated list.
- Choose the organization role each person should get. The role sets their baseline access across every project in the organization. See [Organization roles](/docs/manage/user-permissions#organization-roles).
- Monitor the status of sent invites on the **Pending Invites** section; from here, you can resend or cancel invitations as needed.

<Admonition type="note" title="Invites not received?">
If invite emails aren't received, they may be in spam or quarantined. Recipients should check these folders and mark Neon emails as safe.
</Admonition>

To list members, update roles, or manage invitations programmatically, see [Manage organizations using the Neon API](/docs/manage/orgs-api) (including [List members](/docs/manage/orgs-api#list-members)).

The **People** page also shows deactivated organization members with a **Deactivated** badge, so admins can review access without opening each member profile.

## Set permissions

Access works in two layers: an organization role sets a member's baseline across every project, and per-project permissions add to it on individual projects. Only Admins can change either one. For the full breakdown of what each level allows, see [User permissions](/docs/manage/user-permissions).

There are four organization roles: **Admin**, **Editor**, **Viewer**, and **Collaborator**. To change someone's role, open the more options menu (⋮) next to their name on the **People** page and choose **Edit member**.

![organization members](/docs/manage/orgs_members_kebab.png 'no-border')

A few things to keep in mind:

- Changing a role changes a person's baseline on every project at once. To give someone more access on just one project, leave their role alone and [grant a per-project permission](/docs/manage/user-permissions#assign-project-access) instead.
- Per-project permissions are additive, so they can only raise someone's access above their organization role, never lower it.
- You cannot leave the organization if you are the only Admin. Promote another member to Admin before you try to leave the org.

## Require 2FA for organization members

Admins can require two-factor authentication (2FA) for everyone in the organization from **Organization → Settings**. A passkey satisfies this requirement too, so members can enroll in either 2FA or a passkey to comply.

- You can only enable this if your own account already has 2FA or a passkey set up.
- When required 2FA is on, members who don't have 2FA or a passkey enrolled are prompted to set one up when they access the organization.

See [Manage your Neon account](/docs/manage/accounts#two-factor-authentication) for personal 2FA setup steps, or [Passkeys](/docs/manage/accounts#passkeys) for passkey setup steps.

## Give someone access to specific projects only

To give a person access to a few projects instead of the whole organization, add them to the organization with the **Collaborator** role, then grant them a permission on each project they need. A Collaborator starts with no access at all: projects don't appear in their list until you grant one. This is the recommended way to work with contractors and anyone else who should see only part of the organization.

For the steps, see [Assign project access](/docs/manage/user-permissions#assign-project-access).

<Admonition type="note">
The **Collaborator** organization role is not the same as a legacy project-sharing collaborator, even though the names match. A Collaborator is a member of your organization who you grant per-project permissions to. A project-sharing collaborator is an external Neon account invited to a single project. See [Legacy permissions](/docs/manage/user-permissions#legacy-permissions).
</Admonition>

### Project sharing

Project sharing invites an external Neon account by email to a single project, without adding them to your organization. It's still available from a project's **Settings** → **Collaborators** page, and if any project in your organization has collaborators, you'll also see them on the organization's **People** page.

Project-sharing collaborators _do not_ have access to the organization itself. They reach their shared projects by selecting **Projects shared with me** in the org switcher. When a project is transferred into an organization, sharing-based access is automatically removed for anyone who is already a member of that organization.

![organization collaborators](/docs/manage/org_collaborators.png)

<Admonition type="note" title="Invites not received?">
If invite emails aren't received, they may be in spam or quarantined. Recipients should check these folders and mark Neon emails as safe.
</Admonition>

To manage an existing project-sharing collaborator, open the more options menu (⋮) next to their row in the **Collaborators** table:

- **Convert to member**: Admins can turn an external collaborator into a full organization member. Their sharing-based access is removed, and their organization role then determines what they can reach. Set that role on the **People** page.
- **Remove from project**: Revoke the collaborator's access to the shared project.

![collaborators more options menu](/docs/manage/orgs_collaborators_kebab.png 'no-border')

Project sharing is being replaced by the **Collaborator** role plus per-project permissions. For new access, prefer that approach. For details on sharing itself, see the [Project collaboration guide](/docs/guides/project-collaboration-guide).

## Create and delete projects

Any member except a Collaborator can create projects from the organization's **Projects** page, including Viewers. The organization retains ownership of these projects, not the individual user. Whoever creates a project becomes **Admin** on it.

Deleting a project takes **Admin** access on that project, which any organization Admin also has. It isn't limited to organization Admins: a member granted Admin on a single project can delete that project.

## Manage billing

When you create a new organization, you'll choose a plan for that organization. Each organization manages its own billing and plan.

Billing is Admin-only, and no per-project permission grants it. As the Admin for the organization account:

- You have full access to edit all billing information.
- Promote another member to Admin if you want to delegate billing management; however, all Admins will have the capability to edit billing details.
- Other members can view the **Billing** page, but only Admins can make changes.

For detailed information on pricing and plans, refer to [Neon plans](/docs/introduction/plans).

### Downgrade to Free plan

If downgrading to the Free plan isn't available for your organization, you'll see an error when you try.

To downgrade, your org must:

- Stay within Free plan limits (storage, projects, branches, etc.)

If you need help or think you should be able to downgrade, use the **Request support** option during the downgrade process.

[See Neon plans for details.](/docs/introduction/plans)

## Delete an organization

Only Admins can delete an Organization. Before doing so, make sure all projects within the Organization are removed.

In your Organization's **Settings** page, you'll find the **Delete** section. It will list any actions you need to take before deletion is allowed. For example, if you still have outstanding projects that need to be removed, you'll see:

![delete organization](/docs/manage/orgs_delete.png)

Complete any necessary steps. Once cleared, you can go ahead and delete. This action will permanently remove the organization and cancel its associated billing. _It can't be reversed._

</Steps>

## Rename an organization

Only Admins can rename an organization. Go to the **Settings** page under **General information**. Changing the organization name applies globally; the new name will appear for everyone in the organization.

![organization settings](/docs/manage/orgs_id.png 'no-border')

<NeedHelp />

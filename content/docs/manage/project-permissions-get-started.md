---
title: Get started with project permissions
subtitle: Scope each person and agent to the projects they need, in about five minutes
summary: >-
  A worked example that takes a four-person team from everyone-sees-everything
  to a proper access structure. Set each person's organization role, grant
  per-project permissions where someone needs more than their baseline, and
  verify the result on the Project permissions page. Includes the same setup
  through the Neon API for orchestrators and agents.
enableTableOfContents: true
---

By default, everyone you invite to your Neon organization can reach every project in it. That's fine until it isn't: a contractor you brought in for one reporting project can open your production database, and an agent you gave a credential to can modify any project instead of the one you meant. Project permissions fix that, so a mistake or a leaked credential affects one project rather than everything you have.

This guide sets that up for a small team. It takes about five minutes, and you finish with each person and agent holding exactly the access their work needs.

<InfoBlock>
<DocsList title="What you will learn:">
<p>How organization roles and per-project permissions combine</p>
<p>Which role to give a teammate, a contractor, and an agent</p>
<p>How to grant access on a single project</p>
<p>How to verify who can reach what</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/manage/user-permissions">User permissions reference</a>
<a href="/docs/manage/organizations">Organizations</a>
<a href="/docs/manage/api-keys">Manage API keys</a>
</DocsList>
</InfoBlock>

The example uses a four-person team and three projects, but the same approach scales to any size.

## Before you start

You need less than you might expect:

- **An organization.** You already have one. Neon creates a free organization for your first project when you sign up, and all projects live inside an organization.
- **The Admin role.** You're an Admin of the organization you signed up with, so you can invite people and grant permissions right away.
- **The email addresses** your teammates use, or will use, for their Neon accounts.

<Admonition type="note" title="Already sharing projects?">
If you currently use [project collaboration](/docs/guides/project-collaboration-guide) to share a project, your collaborators became **Editors** on the projects shared with them. That works, but it gives them edit access to those projects and nothing more granular. Follow this guide to move them onto organization roles plus per-project permissions, which is the model project sharing is being replaced by.
</Admonition>

## The scenario

A four-person team runs three Neon projects:

| Project           | What it's for                             |
| ----------------- | ----------------------------------------- |
| `acme-production` | The live customer-facing database         |
| `acme-staging`    | Pre-release testing                       |
| `acme-analytics`  | Reporting, built by an outside contractor |

The team:

- **You** run the organization and own billing.
- **Alex** is a backend engineer who works across production and staging every day.
- **Dana** is a designer who needs to look things up but shouldn't be changing databases.
- **Sam** is a contractor building the analytics project, and shouldn't see the customer data in production or staging.

Without per-project permissions, everyone you invite gets the same access on all three projects, so Sam would be able to open `acme-production`. Here's how to avoid that.

## Decide the access each person needs

Work out the baseline first, then the exceptions. The baseline is the organization role: pick the **lowest** role that covers most of a person's work, because per-project permissions can only add to it.

| Person | Organization role | Per-project grant          | What they end up with                                       |
| ------ | ----------------- | -------------------------- | ----------------------------------------------------------- |
| You    | Admin             | None needed                | Full control of the organization and all three projects     |
| Alex   | Editor            | None needed                | Edit all three projects, but can't delete or transfer       |
| Dana   | Viewer            | Editor on `acme-staging`   | Read-only everywhere, plus full edit on staging             |
| Sam    | Collaborator      | Editor on `acme-analytics` | Only `acme-analytics`. Production and staging are invisible |

Two things make this work:

- **Collaborator is closed by default.** Sam sees nothing until you grant it. `acme-production` doesn't appear in their project list, and Neon responds as though it doesn't exist. That's what makes Collaborator the right role for contractors, external developers, and agents.
- **Grants only add.** Dana is a Viewer across the organization, and the Editor grant raises that to full edit on `acme-staging` alone.

<Admonition type="important" title="You can't subtract access">
A per-project permission can only raise someone above their organization-role baseline. There's no way to give Alex Editor everywhere but block them from one project. If someone should reach only specific projects, make them a **Collaborator** and grant each project explicitly, the way Sam is set up above. See [Notes and limitations](/docs/manage/user-permissions#notes-and-limitations).
</Admonition>

## Set it up

<Steps>

## Invite each person with their baseline role

In the Neon Console, open your organization's **People** page and select **Invite member**. Enter the email address and choose the organization role from the table above: **Editor** for Alex, **Viewer** for Dana, **Collaborator** for Sam.

To change someone already in the organization, open the more options menu (⋮) next to their name and choose **Edit member**.

Invited people get an email, and the organization appears in their organization switcher once they accept. For what each role allows, see [Organization roles](/docs/manage/user-permissions#organization-roles).

![Invite members dialog with a role dropdown for each invitee](/docs/manage/project-permissions-get-started/invite-members.png 'no-border')

<Admonition type="tip" title="Adding a whole team at once">
If your teammates all use email addresses at a domain you control, [auto-join by domain](/docs/manage/orgs-add-members-by-domain) adds them automatically when they sign up or log in. They join as **Editors**, so change the role afterwards for anyone who needs less.
</Admonition>

## Grant edit access on staging

Dana is a Viewer, which is right for most of the organization but too restrictive on `acme-staging`.

Open `acme-staging`, go to **Settings** → **Project permissions**, and select **Grant permission**. Choose **Editor**, pick Dana, and confirm.

![Grant project permission dialog with Editor selected and Dana chosen, showing her inherited Viewer access](/docs/manage/project-permissions-get-started/grant-permission.png 'no-border')

Dana can now get connection strings and run SQL on staging, while staying read-only on production and analytics.

## Grant access to the analytics project

Sam is a Collaborator, so right now they can't see any project at all. Open `acme-analytics`, go to **Settings** → **Project permissions**, select **Grant permission**, choose **Editor**, and pick Sam.

That single grant is their entire access to your organization. Nothing else needs locking down, because Collaborators start with nothing.

## Verify what everyone can reach

On each project's **Project permissions** page, review the list of people who can reach it. Each person is tagged **Inherited** or **Explicit**:

- **Inherited** means the access comes from their organization role. You'll always appear here as Admin.
- **Explicit** means you granted it on this project. Dana on staging and Sam on analytics show up this way.

Check `acme-production` in particular: you and Alex have access, and neither Dana nor Sam can edit it. Dana appears as an inherited Viewer, and Sam has no access at all.

To change or revoke an explicit grant, use the more options menu (⋮) next to the person's name. Removing a grant drops them back to their organization role's baseline.

For a definitive answer rather than a visual check, ask the API who can reach a project. It returns each person's `effective_project_permission`, which is the access that actually applies after both layers combine:

```bash shouldWrap
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects/$PROJECT_ID/members' \
     --header 'authorization: Bearer $ORG_API_KEY' | jq '.project_members[] | {email, org_role, effective_project_permission, grant_source}'
```

Run it against `acme-production` and you should see Alex with `EDITOR` from `org_role_default`. Sam still appears in the list as an organization member, but with `effective_project_permission` of `null` and `grant_source` of `unassigned`, which is how the API reports someone who has no access to the project. `grant_source` tells you whether the access came from someone's organization role or an explicit grant.

</Steps>

## The result

Your team now has an access structure rather than a single shared level:

- You keep full control, including billing.
- Alex works across every project without being able to delete or transfer one.
- Dana can look at anything and change only staging.
- Sam works on analytics and cannot see customer data.

When the contract ends, remove Sam from the organization on the **People** page, or revoke the grant on `acme-analytics` to leave them in the organization with no project access.

## Scoping access for agents

An agent is the case this model is built for. Give it the **Collaborator** role and grant it one project, and a misbehaving or compromised agent can reach only that project.

Pair the grant with a [project-scoped API key](/docs/cli/api-keys), so the credential itself is bounded too. A project-scoped key can't create projects, can't mint more keys, and can't see any other project:

```bash
neon api-keys create --name analytics-agent --project-id $PROJECT_ID
```

<details>
<summary>**Do the whole setup through the API**</summary>

If you provision projects programmatically, the same two layers are available through the [Neon API](/docs/reference/api). These calls need an [organization API key](/docs/manage/api-keys) with the Admin role. Roles are sent lowercase and returned uppercase.

Grant a member Editor on one project:

```bash shouldWrap
curl --request PUT \
     --url 'https://console.neon.tech/api/v2/projects/$PROJECT_ID/members/$MEMBER_ID/role' \
     --header 'authorization: Bearer $ORG_API_KEY' \
     --header 'content-type: application/json' \
     --data '{"role": "editor"}'
```

Get each `member_id` from the [List project members](/docs/manage/user-permissions#list-project-members) response. To remove an explicit grant and drop someone back to their organization-role baseline, send `DELETE` to the same route. See [Manage project access with the API](/docs/manage/user-permissions#manage-project-access-with-the-api) for full request and response details.

The CLI doesn't have a dedicated command for this yet, but you can call the same routes through the [`neon api`](/docs/cli/api) passthrough:

```bash
neon api /projects/$PROJECT_ID/members/$MEMBER_ID/role -X PUT -F role=editor
```

</details>

## Next steps

- [User permissions](/docs/manage/user-permissions) for the complete role and permission matrices, including exactly which actions each level allows.
- [Manage organizations](/docs/manage/orgs-manage) for inviting members, changing roles, and organization settings.
- [Add members by domain](/docs/manage/orgs-add-members-by-domain) to auto-provision teammates by verified email domain.
- [Manage API keys](/docs/manage/api-keys) for account, organization, and project-scoped keys.

<NeedHelp/>

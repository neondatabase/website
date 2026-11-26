---
title: Enterprise SSO and SCIM
subtitle: Sign members in through your identity provider and keep membership in sync with your directory
summary: >-
  Organization admins can connect a Neon organization to an identity provider
  over SAML or OIDC, so members sign in with company credentials. SCIM
  provisioning lets the identity provider keep users and groups in sync, map
  groups to organization roles, and remove people when they leave. Covers how
  Enterprise SSO works, choosing a protocol, group to role rules, enforcing SSO,
  IdP-managed membership, and API keys and the Neon CLI under SSO, with setup
  guides for Okta and Microsoft Entra ID. Requires the Scale plan or higher and
  a verified email domain.
enableTableOfContents: true
updatedOn: '2026-11-23T23:22:44.728Z'
---

With Enterprise SSO, members of your Neon organization sign in with their company credentials through your identity provider (IdP). With SCIM provisioning and IdP-managed membership, your IdP decides who's in the organization and with which role, so when someone leaves your directory, they lose access to Neon too. This page explains how it works and how to run it. To connect your IdP, see [Set up with Okta](/docs/manage/orgs-sso-okta) or [Set up with Microsoft Entra ID](/docs/manage/orgs-sso-entra).

## Before you start

- Your organization is on the **Scale** plan or higher.
- You're an organization Admin, and you can create applications in your IdP.
- At least one Admin can sign in through your IdP. If you sign in to Neon with Google, GitHub, or a password, have an IdP user sign in through SSO once you've set it up, then make them an Admin. Only an Admin who signs in through SSO can enforce it.
- You've verified each email domain your members sign in with, such as `example.com`, under **Settings** > **Verified domains**. See [Add and verify a domain](/docs/manage/orgs-add-members-by-domain#add-and-verify-a-domain).

Neon accepts an SSO sign-in only when the user's email is on a verified domain. Subdomains count as separate domains. Until you verify one, **Enterprise SSO** and **SCIM provisioning** show **Verify a domain first**. While SSO or SCIM is on, you can't remove your last verified domain.

<Admonition type="note" title="Auto-add new users is on by default">
Once a domain is verified, anyone who signs up or signs in to Neon with an email on that domain joins your organization as a member. Auto-add stops applying once you enable SSO login or create a SCIM token, and the setting is then locked. Saving a draft connection doesn't stop it. To keep people from joining before then, turn off **Auto-add new users** under **Verified domains**.
</Admonition>

## How it works

Enterprise SSO has four separate settings. Turn them on in this order:

| Setting                    | What it does                                                              |
| -------------------------- | ------------------------------------------------------------------------- |
| **SSO login**              | Members _can_ sign in through your IdP. Other sign-in methods still work. |
| **SCIM provisioning**      | Your IdP sends Neon its users and groups.                                 |
| **Enforce SSO**            | Members _must_ sign in through your IdP to open the organization.         |
| **IdP-managed membership** | Your IdP decides who is a member and which role they have.                |

<Admonition type="important" title="SCIM controls membership only with IdP-managed membership">
While membership is managed manually (the default), Neon stores what your IdP sends but doesn't act on it. People join the organization at their first SSO sign-in as Editors, group rules aren't applied, and removing someone in your IdP doesn't remove them from Neon or sign them out. To have your IdP control membership and roles, [switch to IdP-managed membership](#let-your-idp-manage-membership). That requires SSO to be enforced first.
</Admonition>

**First sign-in.** When someone signs in through SSO for the first time:

- If they don't have a Neon account yet, Neon sends an activation email. After they open it, Neon creates the account and adds them as an Editor, or with the role from your rules if your IdP manages membership.
- If they already have a Neon account with the same email, Neon emails a link to confirm it's theirs before linking it to your IdP. If they're already a member, they keep their role.

After opening the email, they sign in again, including at your IdP. If they opened it in a different browser or on another device, or after some time, Neon shows "Your login attempt timed out. Login will start from the beginning." That's expected. The email is already confirmed, and signing in again finishes the setup.

## Choose SAML or OIDC

Neon supports both protocols, and SCIM, group → role rules, enforcement, and IdP-managed membership work the same with either. The main difference is your IdP's app tile. With SAML, the tile signs members in directly. With OIDC, the tile opens Neon's member sign-in link, which sends them back through your IdP.

With OIDC, you create the app in your IdP first, because Neon needs its client ID and secret before it shows the redirect URI. With SAML, you start in Neon.

OIDC has two more things to plan for. Neon doesn't accept a new client secret while SSO is enforced, so rotating it means stopping enforcement first. And with Microsoft Entra ID, every user needs an email address, because Neon reads only the `email` claim.

To change protocols later, change **Protocol** in **Enterprise SSO** and save the new settings. On an enabled connection, Neon asks you to confirm first, because saving replaces the current connection. Members who already confirmed their email for your organization don't need to confirm it again.

## Set up your IdP

- [Okta](/docs/manage/orgs-sso-okta): SAML, OIDC, and SCIM provisioning.
- [Microsoft Entra ID](/docs/manage/orgs-sso-entra): SAML and OIDC. Neon's SCIM endpoint also works with Entra.

Each SSO procedure ends with a test sign-in through the **Member sign-in link**, which you then share with your members.

## Map groups to roles

Group → role rules give members of an IdP group an organization role. Your IdP sends its groups through SCIM, so set up SCIM provisioning first, for example [with Okta](/docs/manage/orgs-sso-okta#set-up-scim-provisioning). In **Settings**, under **SCIM provisioning** > **Group → role rules**, click **Add rule** and choose:

- **Match on:** **Group display name** (the group's name in your IdP) or **Group ID (external_id)** (your IdP's ID for it). With Okta, use the display name, and update the rule if you rename the group. With Microsoft Entra ID, use the group ID.
- **Group:** the group's name or ID.
- **Role:** the organization role for members of that group.

If someone matches several rules, they get the highest role. Rules take effect only with [IdP-managed membership](#let-your-idp-manage-membership).

A Viewer can still create projects and becomes Admin on the projects they create. To stop someone from creating projects, use **Collaborator**. See [Organization roles](/docs/manage/user-permissions#organization-roles).

## Enforce SSO

When you enforce SSO, every member must sign in through your IdP to access the organization.

<Admonition type="warning" title="Members who can't use your IdP lose access">
Anyone who can't sign in through your IdP loses access to the organization, including the person who created it. Make sure at least one admin can sign in through SSO before you enforce it.
</Admonition>

To turn it on:

1. Sign in through SSO yourself with the member sign-in link.
2. Go to **Settings** > **Enterprise SSO**. Under **Enforcement**, click **Enforce SSO**.

Your SSO sign-in must come after the connection's most recent save. Any save counts, even a change to **Maximum session age**. The app's tile in your IdP also counts, but the link tests the path members use once SSO is enforced. An admin who doesn't sign in through SSO, for example with a Google account, can't enforce it.

Enforcement starts right away, without a confirmation step. The badge changes to **Enforced**. To turn it off, click **Stop enforcing**. Any admin who can still open the organization can stop enforcing, even one who doesn't sign in through SSO, for example during the 72-hour grace period. Enforcing SSO again starts a new 72-hour grace period.

What changes:

- Browser sessions from before you enforced SSO keep working for 72 hours. New sessions must use SSO right away. Tell members before you enforce SSO, so the end of the 72 hours doesn't surprise them.
- Personal API keys stop working for the organization at once, with no grace period, until they're authorized. See [API keys and the Neon CLI](#api-keys-and-the-neon-cli).
- When members without an SSO session open the organization, Neon sends them to sign in through your IdP. Depending on the session, Neon first signs them out of Neon, or shows **Single sign-on required** with a **Sign in with SSO** button. If they've signed in through SSO in another tab, **Check access again** on that screen picks it up.
- Email invites are turned off: the console hides the invite option, and the API refuses invites. To add someone, assign them to the app in your IdP. They join as an Editor at their first SSO sign-in. Your IdP's app assignments decide who can join.
- The protocol, metadata, and other IdP settings are locked until you stop enforcing. The display name, session age, and programmatic access settings stay editable.

To make members sign in again regularly, set **Maximum session age (hours)** in **Enterprise SSO**. When a member's SSO session is older than that, Neon sends them back through your IdP. Leave it blank for no limit.

**If you're locked out:** an organization admin can request a one-time emergency-access link by email, valid for one hour, with **Request emergency access** under **Enterprise SSO**. It also appears on the **Single sign-on required** screen when Neon shows it. An admin who can't sign in through your IdP can't reach either one, so keep at least one admin who can sign in through SSO.

## Let your IdP manage membership

With IdP-managed membership, your IdP and your group → role rules decide who is a member and which role they have:

- Members join at their first SSO sign-in with the role from your rules.
- When someone's groups change in your IdP, their role in Neon changes within seconds, without them signing in again.
- Removing someone in your IdP, for example from all their groups or from the app, removes them from the organization within seconds and signs them out.
- Manual invites and domain auto-add are turned off.

To switch, go to **Settings** > **SCIM provisioning** > **Membership mode** and click **Switch to IdP-managed**. The button is available after you [enforce SSO](#enforce-sso). You must be in an IdP group that one of your rules maps to **Admin**, so you keep admin access after the switch.

<Admonition type="warning" title="Check who would be removed">
Switching removes every member your IdP hasn't sent to Neon, including people you invited manually. Push all your users and groups first. Before you confirm, the dialog lists the members who would lose access.
</Admonition>

You can switch back to manual at any time. Members who were removed don't come back on their own. If they're assigned to the app in your IdP, they rejoin as Editors at their next SSO sign-in. To stop enforcing SSO, switch back to manual first. You can invite people again once SSO isn't enforced.

## API keys and the Neon CLI

When SSO is enforced, access through the Neon API and CLI follows the **Programmatic access** setting in **Enterprise SSO**. Organization API keys always work.

**SSO-authorized tokens** (default):

- If you sign in to the Neon CLI with `neon login` and complete the sign-in through SSO, the CLI works for the organization right away.
- Personal API keys need a one-time authorization for each organization. Until then, requests fail with "This organization requires a one-time SSO authorization, which needs an interactive browser session", followed by a link that authorizes that key. Open the link in a browser where you're signed in through SSO.
- An authorization lasts for the **Token authorization lifetime (days)**, 30 by default. To renew or revoke it, go to **Account settings** > **API keys**, open the key's menu (⋮), and choose **SSO** > your organization > **Re-authorize** or **Revoke authorization**.

**Org credentials only:** personal API keys and Neon CLI sign-ins are refused with "This organization does not allow personal or OAuth tokens; use an organization-scoped credential." Use an [organization API key](/docs/manage/api-keys).

## Troubleshooting

### When signing in to Neon

| What you see                                                                 | What to do                                                                                                                                                              |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Your login attempt timed out. Login will start from the beginning."         | Sign in again. If you were confirming your email, it's already confirmed.                                                                                               |
| "Page has expired"                                                           | Start again from the member sign-in link. Don't refresh your IdP's sign-in page.                                                                                        |
| "Invalid signature in response from identity provider"                       | Neon has an old signing certificate. Re-enter your IdP's metadata URL in **Enterprise SSO** and save.                                                                   |
| "Unexpected error when authenticating with identity provider"                | A sign-in that started in your IdP went to the **ACS URL**. Use the **IdP-initiated ACS URL** as the Okta **Single sign-on URL**, or as the default reply URL in Entra. |
| The sign-in works, but the person has no access or an empty account          | The email claim is missing or empty. In Entra, set the **emailaddress** claim to `user.userprincipalname`. In Okta, name the attribute `email`.                         |
| **Single sign-on required**, or Neon signs you out and sends you to your IdP | Sign in through your IdP. Your session predates enforcement, didn't come from SSO, or is older than the maximum session age.                                            |

### In Neon settings and the API

| What you see                                                                                          | What to do                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "metadata URL returned a non-200 status"                                                              | Copy the **Metadata URL** from your IdP again: in Okta, from the app's **Sign On** tab; in Entra, the **App Federation Metadata Url**.                                                    |
| "Higher-tier plans only"                                                                              | Upgrade to the Scale plan or higher.                                                                                                                                                      |
| "Complete a test sign-in through this SSO connection before enabling enforcement"                     | Sign in through SSO yourself, with the member sign-in link or the app's tile, then click **Enforce SSO** again. The admin who enforces SSO must sign in after the connection's last save. |
| "This organization requires a one-time SSO authorization…"                                            | Authorize the API key for the organization. See [API keys and the Neon CLI](#api-keys-and-the-neon-cli).                                                                                  |
| "This organization does not allow personal or OAuth tokens…"                                          | The organization allows only organization API keys.                                                                                                                                       |
| An invite fails with "email invites are disabled" or "membership is managed by its identity provider" | Assign the person to the app in your IdP. They join when they first sign in through SSO.                                                                                                  |

For errors in your IdP, see the troubleshooting tables for [Okta](/docs/manage/orgs-sso-okta#troubleshooting) and [Microsoft Entra ID](/docs/manage/orgs-sso-entra#troubleshooting).

## Related

- [Set up with Okta](/docs/manage/orgs-sso-okta)
- [Set up with Microsoft Entra ID](/docs/manage/orgs-sso-entra)
- [Add organization members by domain](/docs/manage/orgs-add-members-by-domain)
- [User permissions](/docs/manage/user-permissions)
- [Manage organizations](/docs/manage/orgs-manage)

<NeedHelp />

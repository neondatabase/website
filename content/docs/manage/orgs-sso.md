---
title: Enterprise SSO and SCIM
subtitle: Sign members in through your identity provider and keep membership in sync with your directory
summary: >-
  Organization admins can connect a Neon organization to an identity provider
  over SAML or OIDC, so members sign in with company credentials. SCIM
  provisioning lets the identity provider keep users and groups in sync, map
  groups to organization roles, and remove people when they leave. Covers SSO
  setup with Okta and Microsoft Entra ID, SCIM with Okta, enforcing SSO,
  IdP-managed membership, and API keys and the Neon CLI under SSO. Requires the
  Scale plan or higher and a verified email domain.
enableTableOfContents: true
---

With Enterprise SSO, members of your Neon organization sign in with their company credentials through your identity provider (IdP), over SAML or OIDC. With SCIM provisioning and IdP-managed membership, your IdP decides who's in the organization and with which role, so when someone leaves your directory, they lose access to Neon too. This page walks through SSO setup over SAML with Okta and with Microsoft Entra ID. The SCIM provisioning steps are for Okta.

## Before you start

- Your organization is on the **Scale** plan or higher.
- You're an organization Admin, and you can create applications in your IdP.
- You've verified each email domain your members sign in with, such as `example.com`, under **Settings** > **Verified domains**. See [Add and verify a domain](/docs/manage/orgs-add-members-by-domain#add-and-verify-a-domain).

Neon accepts an SSO sign-in only when the user's email is on a verified domain. Subdomains count as separate domains. Until you verify one, **Enterprise SSO** and **SCIM provisioning** show **Verify a domain first**.

<Admonition type="note" title="Auto-add new users is on by default">
Once a domain is verified, anyone who signs up or signs in to Neon with an email on that domain joins your organization as a member, until you enable SSO login. To prevent that while you set up SSO, turn off **Auto-add new users** under **Verified domains**.
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

## Start the connection in Neon

In the Neon Console, open your organization's **Settings** and go to **Enterprise SSO**.

1. Enter a **Display name**, such as `Okta`. Members see it when they sign in.
2. For **Protocol**, choose **SAML**.
3. Leave the **Metadata URL** empty and **Enable SSO login for this organization** unchecked.
4. Click **Save**.

Neon saves a draft. Under **Configure your identity provider**, it shows the values your IdP needs, each with a copy button: the **ACS URL**, the **IdP-initiated ACS URL**, and the **SP Entity ID**.

Keep this page open. Next, set up your IdP with [Okta](#set-up-sso-with-okta-saml) or [Microsoft Entra ID](#set-up-sso-with-microsoft-entra-id-saml).

## Set up SSO with Okta (SAML)

Continue in the Okta Admin Console.

<Steps>

## Create the SAML app in Okta

In the Okta Admin Console, go to **Applications** > **Applications** > **Create App Integration**, choose **SAML 2.0**, and name the app.

Configure SAML with these values from Neon:

| Okta field                         | Value                            |
| ---------------------------------- | -------------------------------- |
| **Single sign-on URL**             | Neon's **IdP-initiated ACS URL** |
| Requestable SSO URLs (add another) | Add Neon's **ACS URL**           |
| **Audience URI (SP Entity ID)**    | Neon's **SP Entity ID**          |
| **Name ID format**                 | Persistent                       |
| **Application username**           | Email                            |

<Admonition type="important">
Add the **ACS URL** as an additional requestable SSO URL. Without it, sign-ins that start from Neon fail. The **IdP-initiated ACS URL** handles sign-ins that start in Okta, such as the app's dashboard tile.
</Admonition>

Finish creating the app.

## Add the email attribute

On the app's **Sign On** tab, under **Attribute statements**, click **Add expression** and add:

- **Name:** `email`
- **Expression:** `user.profile.email`

## Assign people and check the sign-in policy

1. On the **Assignments** tab, assign the people or groups who should use Neon.
2. On the **Sign On** tab, under **User authentication**, check that the app's authentication policy lets those people sign in.

<Admonition type="note" title="Okta's default policy">
New Okta orgs can default apps to a policy that requires phishing-resistant factors, such as Okta FastPass or a passkey. Users without one see an error. Choose a policy that matches the factors your users have.
</Admonition>

## Connect Neon to the Okta metadata

1. In Okta, on the app's **Sign On** tab, copy the **Metadata URL**.
2. In Neon, back in **Enterprise SSO**, set **Configuration source** to **Metadata URL** and paste the URL.
3. Select **Enable SSO login for this organization** and click **Save**.

Neon reads the entity ID, sign-in URL, and signing certificates from the metadata, and **Enterprise SSO** shows **Enabled**. Neon doesn't refetch the metadata on its own. After you rotate the signing certificate in Okta, re-enter the metadata URL and save.

## Test the sign-in

Under **Member sign-in link**, click **Copy sign-in URL**. Open it in a private browser window, sign in through Okta, and check that you land in your organization. If this is your first SSO sign-in, Neon first emails you a link to confirm your account. See [First sign-in](#how-it-works). Then try the app's tile on the Okta dashboard.

Share this link with your members. Your sign-in here also counts toward [enforcing SSO](#enforce-sso).

</Steps>

## Set up SSO with Microsoft Entra ID (SAML)

After you [start the connection in Neon](#start-the-connection-in-neon), continue in the Microsoft Entra admin center.

<Steps>

## Create the enterprise application

Go to **Enterprise applications** > **New application** > **Create your own application**, name the app, and choose **Integrate any other application you don't find in the gallery**. Open the app and go to **Single sign-on** > **SAML**.

## Enter Neon's values

Under **Basic SAML Configuration**, click **Edit** and enter:

| Entra field                                    | Value                                                                                     |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Identifier (Entity ID)**                     | Neon's **SP Entity ID**                                                                   |
| **Reply URL (Assertion Consumer Service URL)** | Add Neon's **IdP-initiated ACS URL** and mark it **Default**, then add Neon's **ACS URL** |
| **Sign on URL**                                | Leave empty                                                                               |

<Admonition type="important">
Add both reply URLs. The default one, the **IdP-initiated ACS URL**, handles sign-ins that start in Entra, such as the app's tile in My Apps. Without the **ACS URL**, sign-ins that start from Neon fail.
</Admonition>

## Check the email claim

Under **Attributes & Claims**, set the source of the **emailaddress** claim to `user.userprincipalname`. Entra's default source, `user.mail`, is often empty for cloud-only users, and Neon can't sign anyone in without an email.

The claim's value must be on one of your [verified domains](#before-you-start). Users whose user principal name ends in `onmicrosoft.com` can't sign in.

## Assign users

Under **Users and groups**, click **Add user/group** and assign the people or groups who should use Neon. Entra blocks users who aren't assigned.

## Connect Neon to the Entra metadata

1. Under **SAML Certificates**, copy the **App Federation Metadata Url**.
2. In Neon, back in **Enterprise SSO**, set **Configuration source** to **Metadata URL** and paste the URL.
3. Select **Enable SSO login for this organization** and click **Save**.

## Test the sign-in

Under **Member sign-in link**, click **Copy sign-in URL**, open it in a private browser window, and sign in through Entra. Then try the app's tile in My Apps, or the **Test** button on the app's **Single sign-on** page.

</Steps>

## Set up SCIM provisioning with Okta

<Steps>

## Create a SCIM token in Neon

In **Settings**, under **SCIM provisioning** > **SCIM tokens**, click **Create token** and copy the token. You can't see it again later. Also copy the **SCIM base URL** shown there.

## Turn on provisioning in Okta

In the Okta app, go to **General** > **App Settings** > **Edit**, set **Provisioning** to **SCIM**, and save. A **Provisioning** tab appears.

## Connect Okta to Neon

On **Provisioning** > **Integration**, click **Edit** and enter:

| Okta field                            | Value                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| **SCIM connector base URL**           | Neon's **SCIM base URL**                                                             |
| **Unique identifier field for users** | `userName`                                                                           |
| **Supported provisioning actions**    | **Push New Users**, **Push Profile Updates**, **Push Groups**                        |
| **Authentication Mode**               | **HTTP Header**, then paste the Neon token in **Authorization** (Okta adds `Bearer`) |

Click **Test Connector Configuration**, then **Save**.

## Choose what Okta sends

On **Provisioning** > **To App**, click **Edit**, turn on **Create Users**, **Update User Attributes**, and **Deactivate Users**, and save.

Neon links a SCIM user to a Neon account when the SCIM `userName` matches the account's email. With the app's **Application username format** set to **Email**, Okta sends the email as `userName`.

## Push users and groups

- People assigned to the app are sent to Neon. If you assigned people before turning on provisioning, go to **Assignments** and click **Provision User**.
- To send groups, go to the **Push Groups** tab, click **Push Groups**, find each group, and save. Push only groups whose members are assigned to the app.

## Check that it worked

In Okta, check the **Provisioning** tab for errors, and the users' provisioning status on the **Assignments** tab.

</Steps>

## Map groups to roles

Group → role rules give members of an IdP group an organization role. In **Settings**, under **SCIM provisioning** > **Group → role rules**, click **Add rule** and choose:

- **Match on:** **Group display name** (the group's name in your IdP) or **Group ID (external_id)** (your IdP's ID for it). With Okta, use the display name, and update the rule if you rename the group.
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

1. Sign in through SSO yourself with the member sign-in link. The app's tile in your IdP also counts, but only the link checks the **ACS URL**, which members need once SSO is enforced. You must sign in after the connection's most recent save. Any save counts, even a change to **Maximum session age**.
2. Go to **Settings** > **Enterprise SSO**. Under **Enforcement**, click **Enforce SSO**.

Enforcement starts right away, without a confirmation step. The badge changes to **Enforced**. To turn it off, click **Stop enforcing**.

What changes:

- Browser sessions from before you enforced SSO keep working for 72 hours. New sessions must use SSO right away. Neon doesn't warn members when the 72 hours are ending, so tell them before you enforce SSO.
- Personal API keys stop working for the organization at once, with no grace period, until they're authorized. See [API keys and the Neon CLI](#api-keys-and-the-neon-cli).
- Members without an SSO session see **Single sign-on required** when they open the organization, with a **Sign in with SSO** button.
- Manual invites are blocked. To add someone, assign them to the app in your IdP. They join as an Editor at their first SSO sign-in. Your IdP's app assignments decide who can join.
- The protocol, metadata, and other IdP settings are locked until you stop enforcing. The display name, session age, and programmatic access settings stay editable.

To make members sign in again regularly, set **Maximum session age (hours)** in **Enterprise SSO**. When a member's SSO session is older than that, Neon sends them back through your IdP. Leave it blank for no limit.

**If you're locked out:** an organization admin can request a one-time emergency-access link by email, valid for one hour. **Request emergency access** is on the **Single sign-on required** screen and under **Enterprise SSO**.

## Let your IdP manage membership

With IdP-managed membership, your IdP and your group → role rules decide who is a member and which role they have:

- Members join at their first SSO sign-in with the role from your rules.
- When someone's groups change in your IdP, their role in Neon changes within seconds, without them signing in again.
- Removing someone in your IdP, for example from all their groups or from the app, removes them from the organization within seconds and signs them out.
- Manual invites and domain auto-add are turned off.

To switch, go to **Settings** > **SCIM provisioning** > **Membership mode** and click **Switch to IdP-managed**. The button is available after you [enforce SSO](#enforce-sso). You must be in an IdP group that one of your rules maps to **Admin**, so you keep admin access after the switch.

<Admonition type="warning" title="Check who would be removed">
Switching removes every member your IdP hasn't sent to Neon, including people you invited manually. Push all your users and groups first, and check who would be removed before you confirm.
</Admonition>

You can switch back to manual at any time. Members who were removed don't come back on their own. If they're assigned to the app in your IdP, they rejoin as Editors at their next SSO sign-in. To stop enforcing SSO, switch back to manual first. You can invite people again once SSO isn't enforced.

## API keys and the Neon CLI

When SSO is enforced, access through the Neon API and CLI follows the **Programmatic access** setting in **Enterprise SSO**. Organization API keys always work.

**SSO-authorized tokens** (default):

- If you sign in to the Neon CLI with `neon login` and complete the sign-in through SSO, the CLI works for the organization right away.
- Personal API keys need a one-time authorization for each organization. Until then, requests fail with "This organization requires a one-time SSO authorization, which needs an interactive browser session", followed by a link that authorizes that key. Open the link in a browser where you're signed in through SSO.
- An authorization lasts for the **Token authorization lifetime (days)**, 30 by default. To renew or revoke it, go to **Account settings** > **API keys**, open the key's menu (⋮), and choose **SSO** > your organization > **Re-authorize** or **Revoke authorization**.

**Org credentials only:** personal API keys are refused with "This organization does not allow personal or OAuth tokens; use an organization-scoped credential." Use an [organization API key](/docs/manage/api-keys).

## Troubleshooting

| What you see                                                                                           | What to do                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Okta: "User is not assigned to this application."                                                      | Assign the person, or a group they're in, to the app. If they are assigned, the browser may be signed in to Okta as someone else: try a private browser window.                           |
| Okta: "Unable to sign in"                                                                              | The person may be deactivated in Okta. Check Okta's **Reports** > **System Log**.                                                                                                         |
| Okta: 400 error with `access_denied`                                                                   | The app's authentication policy needs factors the person doesn't have. Check the policy, and Okta's **Reports** > **System Log**.                                                         |
| Okta: "Invalid property email in expression user.email"                                                | Use `user.profile.email` in the expression editor.                                                                                                                                        |
| Users stay in a staged or out-of-sync state in Okta                                                    | Click **Provision User** on the app's **Assignments** tab.                                                                                                                                |
| "Your login attempt timed out. Login will start from the beginning."                                   | Sign in again. If you were confirming your email, it's already confirmed.                                                                                                                 |
| "Complete a test sign-in through this SSO connection before enabling enforcement"                      | Sign in through SSO yourself, with the member sign-in link or the app's tile, then click **Enforce SSO** again. The admin who enforces SSO must sign in after the connection's last save. |
| "Invalid signature in response from identity provider"                                                 | Neon has an old signing certificate. Re-enter your IdP's metadata URL in **Enterprise SSO** and save.                                                                                     |
| "Unexpected error when authenticating with identity provider"                                          | A sign-in that started in your IdP went to the **ACS URL**. Use the **IdP-initiated ACS URL** as the Okta **Single sign-on URL**, or as the default reply URL in Entra.                   |
| The sign-in works, but the person has no access or an empty account                                    | The email claim is missing or empty. In Entra, set the **emailaddress** claim to `user.userprincipalname`. In Okta, name the attribute `email`.                                           |
| "Page has expired"                                                                                     | Start again from the member sign-in link. Don't refresh your IdP's sign-in page.                                                                                                          |
| "Higher-tier plans only"                                                                               | Upgrade to the Scale plan or higher.                                                                                                                                                      |
| **Single sign-on required**                                                                            | Click **Sign in with SSO**. Your session predates enforcement or is older than the maximum session age.                                                                                   |
| "This organization requires a one-time SSO authorization…"                                             | Authorize the API key for the organization. See [API keys and the Neon CLI](#api-keys-and-the-neon-cli).                                                                                  |
| "This organization does not allow personal or OAuth tokens…"                                           | The organization allows only organization API keys.                                                                                                                                       |
| An invite fails with "manual invites are disabled" or "membership is managed by its identity provider" | Assign the person to the app in your IdP. They join when they first sign in through SSO.                                                                                                  |

For any Okta error, check Okta's **Reports** > **System Log** for the reason. In Entra, check the app's **Sign-in logs**.

## Related

- [Add organization members by domain](/docs/manage/orgs-add-members-by-domain)
- [User permissions](/docs/manage/user-permissions)
- [Manage organizations](/docs/manage/orgs-manage)

<NeedHelp />

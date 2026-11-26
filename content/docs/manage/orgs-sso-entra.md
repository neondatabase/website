---
title: Set up Enterprise SSO with Microsoft Entra ID
subtitle: Connect Microsoft Entra ID to your Neon organization over SAML or OIDC
summary: >-
  Step-by-step Microsoft Entra ID setup for Neon Enterprise SSO: create an
  enterprise application for SAML or an app registration for OIDC, connect it
  to your Neon organization, and limit who can sign in.
enableTableOfContents: true
updatedOn: '2026-11-23T23:22:44.728Z'
---

This page covers the Microsoft Entra ID side of [Enterprise SSO and SCIM](/docs/manage/orgs-sso): connecting Entra over SAML or OIDC. You need the Scale plan, a verified email domain, and, before you enforce SSO, an Admin who signs in through your IdP. See [Before you start](/docs/manage/orgs-sso#before-you-start). If you haven't picked a protocol yet, see [Choose SAML or OIDC](/docs/manage/orgs-sso#choose-saml-or-oidc).

## Set up SSO over SAML

Start in Neon, then continue in the Microsoft Entra admin center.

<Steps>

## Save a draft connection in Neon

In the Neon Console, open your organization's **Settings** and go to **Enterprise SSO**.

1. Enter a **Display name**, such as `Microsoft Entra ID`. Members see it when they sign in.
2. For **Protocol**, choose **SAML**.
3. Leave the **Metadata URL** empty and **Enable SSO login for this organization** unchecked.
4. Click **Save**.

Neon saves a draft. Under **Configure your identity provider**, it shows the values your IdP needs, each with a copy button: the **ACS URL**, the **IdP-initiated ACS URL**, and the **SP Entity ID**. Keep this page open.

## Create the enterprise application

In the Microsoft Entra admin center, go to **Enterprise applications** > **New application** > **Create your own application**, name the app, and choose **Integrate any other application you don't find in the gallery**. Open the app and go to **Single sign-on** > **SAML**.

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

The claim's value must be on one of your [verified domains](/docs/manage/orgs-sso#before-you-start). Users whose user principal name ends in `onmicrosoft.com` can't sign in.

## Assign users

Under **Users and groups**, click **Add user/group** and assign the people or groups who should use Neon. Entra blocks users who aren't assigned.

## Connect Neon to the Entra metadata

1. Under **SAML Certificates**, copy the **App Federation Metadata Url**.
2. In Neon, back in **Enterprise SSO**, set **Configuration source** to **Metadata URL** and paste the URL.
3. Select **Enable SSO login for this organization** and click **Save**.

## Test the sign-in

Under **Member sign-in link**, click **Copy sign-in URL**, open it in a private browser window, and sign in through Entra. If this is your first SSO sign-in, Neon first emails you a link to confirm your account. See [First sign-in](/docs/manage/orgs-sso#how-it-works). Then try the app's tile in My Apps, or the **Test** button on the app's **Single sign-on** page.

Share this link with your members. Your sign-in here also counts toward [enforcing SSO](/docs/manage/orgs-sso#enforce-sso).

</Steps>

## Set up SSO over OIDC

With OIDC, you register the app in Entra first. Neon needs its client ID and secret before it shows the redirect URI.

<Steps>

## Register the app in Entra

In the Microsoft Entra admin center, go to **App registrations** > **New registration**. Name the app, and under **Supported account types**, choose **Accounts in this organizational directory only**. Leave **Redirect URI** empty for now and click **Register**.

On the app's **Overview** page, copy the **Application (client) ID** and the **Directory (tenant) ID**.

## Create a client secret

Under **Certificates & secrets** > **Client secrets**, click **New client secret**, choose an expiry, and copy the secret's **Value**, not its **Secret ID**. Entra shows the value only once.

<Admonition type="note" title="Client secrets expire">
When the secret expires, SSO sign-ins fail. Before then, create a new secret and save it in Neon. Neon doesn't accept a new client secret while SSO is enforced: stop enforcing, save the secret, sign in through SSO again, and enforce SSO again.
</Admonition>

## Save the connection in Neon

In the Neon Console, open your organization's **Settings** and go to **Enterprise SSO**.

1. Enter a **Display name**, such as `Microsoft Entra ID`. Members see it when they sign in.
2. For **Protocol**, choose **OIDC**.
3. For **Issuer URL**, enter `https://login.microsoftonline.com/<tenant-id>/v2.0`, with your **Directory (tenant) ID**.
4. For **Client ID**, paste the **Application (client) ID**. For **Client secret**, paste the secret's value.
5. Leave **Enable SSO login for this organization** unchecked and click **Save**.

Neon shows the **Redirect URI** and the **Member sign-in link**.

## Add Neon's redirect URI

In the app registration, under **Authentication**, add a redirect URI for the **Web** platform and paste Neon's **Redirect URI**. Leave the implicit grant options unchecked.

## Check the email claim

Neon signs people in by the `email` claim. Under **Token configuration**, click **Add optional claim**, choose **ID**, and select **email**. If Entra asks to turn on the Microsoft Graph email permission, accept.

Entra takes the claim from each user's **Email** property. Users without an email, or with one outside your [verified domains](/docs/manage/orgs-sso#before-you-start), can't sign in. If many of your users have no email address, use [SAML](#set-up-sso-over-saml) instead, where the claim can come from the user principal name.

## Limit who can sign in

By default, everyone in your tenant can sign in to an app registration. To allow only the people you choose, go to **Enterprise applications**, open the app, and under **Properties**, set **Assignment required?** to **Yes** and save. Then assign people or groups under **Users and groups**.

## Enable and test

1. In Neon, select **Enable SSO login for this organization** and click **Save**.
2. Under **Member sign-in link**, click **Copy sign-in URL**, open it in a private browser window, and sign in through Entra. If this is your first SSO sign-in, Neon first emails you a link to confirm your account. See [First sign-in](/docs/manage/orgs-sso#how-it-works).

Share this link with your members. Your sign-in here also counts toward [enforcing SSO](/docs/manage/orgs-sso#enforce-sso).

To give members a tile in My Apps, set **Home page URL** to the member sign-in link, under the app registration's **Branding & properties**.

</Steps>

## SCIM provisioning

Neon's SCIM endpoint also works with Microsoft Entra ID, although this guide doesn't include the Entra steps. When you set up provisioning for the app in Entra:

- For **Tenant URL**, use Neon's **SCIM base URL**, and for **Secret Token**, a token you create. Both are under **Settings** > **SCIM provisioning** in Neon.
- Neon links a SCIM user to a Neon account only when the user's `userName` matches their email. Entra fills `userName` from the user principal name by default, so check that each user's principal name is their email address, or map `userName` to the email attribute.
- Match [group → role rules](/docs/manage/orgs-sso#map-groups-to-roles) on the group ID.

## Next steps

- [Map groups to roles](/docs/manage/orgs-sso#map-groups-to-roles)
- [Enforce SSO](/docs/manage/orgs-sso#enforce-sso)
- [Let your IdP manage membership](/docs/manage/orgs-sso#let-your-idp-manage-membership)

## Troubleshooting

| What you see                                                         | What to do                                                                                         |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `AADSTS50011`, the redirect URI doesn't match                        | Add Neon's **Redirect URI** (OIDC) or **ACS URL** (SAML) to the app exactly as Neon shows it.      |
| "Unexpected error when authenticating with identity provider" (SAML) | Mark Neon's **IdP-initiated ACS URL** as the **Default** reply URL.                                |
| `AADSTS50105`, the user isn't assigned                               | Assign the person, or a group they're in, under the enterprise application's **Users and groups**. |

For any other Entra error, check the app's **Sign-in logs**. For messages from Neon, see [Troubleshooting](/docs/manage/orgs-sso#troubleshooting).

<NeedHelp />

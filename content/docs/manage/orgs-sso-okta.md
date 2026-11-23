---
title: Set up Enterprise SSO and SCIM with Okta
subtitle: Connect Okta to your Neon organization over SAML or OIDC, and provision users and groups with SCIM
summary: >-
  Step-by-step Okta setup for Neon Enterprise SSO: create a SAML or OIDC app
  integration in Okta, connect it to your Neon organization, and set up SCIM
  provisioning so Okta sends users and groups to Neon.
enableTableOfContents: true
updatedOn: '2026-11-23T23:22:44.728Z'
---

This page covers the Okta side of [Enterprise SSO and SCIM](/docs/manage/orgs-sso): connecting Okta over SAML or OIDC, and sending users and groups to Neon with SCIM. You need the Scale plan, a verified email domain, and, before you enforce SSO, an Admin who signs in through your IdP. See [Before you start](/docs/manage/orgs-sso#before-you-start). If you haven't picked a protocol yet, see [Choose SAML or OIDC](/docs/manage/orgs-sso#choose-saml-or-oidc).

## Set up SSO over SAML

Start in Neon, then continue in the Okta Admin Console.

<Steps>

## Save a draft connection in Neon

In the Neon Console, open your organization's **Settings** and go to **Enterprise SSO**.

1. Enter a **Display name**, such as `Okta`. Members see it when they sign in.
2. For **Protocol**, choose **SAML**.
3. Leave the **Metadata URL** empty and **Enable SSO login for this organization** unchecked.
4. Click **Save**.

Neon saves a draft. Under **Configure your identity provider**, it shows the values your IdP needs, each with a copy button: the **ACS URL**, the **IdP-initiated ACS URL**, and the **SP Entity ID**. Keep this page open.

## Create the SAML app in Okta

In the Okta Admin Console, go to **Applications** > **Applications** > **Create App Integration**, choose **SAML 2.0**, and name the app.

Configure SAML with these values from Neon:

| Okta field                      | Value                            |
| ------------------------------- | -------------------------------- |
| **Single sign-on URL**          | Neon's **IdP-initiated ACS URL** |
| **Audience URI (SP Entity ID)** | Neon's **SP Entity ID**          |
| **Name ID format**              | Persistent                       |
| **Application username**        | Email                            |

You don't need to add Neon's **ACS URL** as a requestable SSO URL.

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

Under **Member sign-in link**, click **Copy sign-in URL**. Open it in a private browser window, sign in through Okta, and check that you land in your organization. If this is your first SSO sign-in, Neon first emails you a link to confirm your account. See [First sign-in](/docs/manage/orgs-sso#how-it-works). Then try the app's tile on the Okta dashboard.

Share this link with your members. Your sign-in here also counts toward [enforcing SSO](/docs/manage/orgs-sso#enforce-sso).

</Steps>

## Set up SSO over OIDC

With OIDC, you create the app in Okta first. Neon needs its client ID and secret before it shows the redirect URI.

<Steps>

## Create the OIDC app in Okta

In the Okta Admin Console, go to **Applications** > **Applications** > **Create App Integration**, choose **OIDC - OpenID Connect** and **Web Application**, and name the app.

- For **Grant type**, keep **Authorization Code** only.
- Okta fills in `localhost` redirect URIs. Remove the **Sign-out redirect URIs** entry. You replace the **Sign-in redirect URIs** entry with Neon's value later.
- Under **Assignments**, choose **Limit access to selected groups** and add the groups who should use Neon.

Save the app. On its **General** tab, copy the **Client ID** and the **Client secret**.

## Save the connection in Neon

In the Neon Console, open your organization's **Settings** and go to **Enterprise SSO**.

1. Enter a **Display name**, such as `Okta`. Members see it when they sign in.
2. For **Protocol**, choose **OIDC**.
3. For **Issuer URL**, enter your Okta org URL, such as `https://example.okta.com`, with no trailing slash.
4. Paste the **Client ID** and **Client secret**.
5. Leave **Enable SSO login for this organization** unchecked and click **Save**.

Neon shows the **Redirect URI** and the **Member sign-in link**.

## Point the Okta app to Neon

On the app's **General** tab, under **Login**, click **Edit**:

- In **Sign-in redirect URIs**, replace the `localhost` entry with Neon's **Redirect URI**.
- In **Initiate login URI**, enter Neon's member sign-in link. To show the app's tile on the Okta dashboard, also set **Login initiated by** to **Either Okta or App**.

Okta sends each user's primary email, which must be on one of your [verified domains](/docs/manage/orgs-sso#before-you-start).

## Check the sign-in policy

On the app's **Sign On** tab, under **User authentication**, check that the app's authentication policy lets your users sign in. New Okta orgs can default apps to a policy that requires phishing-resistant factors, such as Okta FastPass or a passkey.

## Enable SSO login

In Neon, select **Enable SSO login for this organization** and click **Save**. Neon reads Okta's OIDC discovery document at this point, and the save fails if the **Issuer URL** doesn't exactly match the issuer Okta publishes.

## Test the sign-in

Under **Member sign-in link**, click **Copy sign-in URL**, open it in a private browser window, and sign in through Okta. If this is your first SSO sign-in, Neon first emails you a link to confirm your account. See [First sign-in](/docs/manage/orgs-sso#how-it-works). Then try the app's tile on the Okta dashboard.

Share this link with your members. Your sign-in here also counts toward [enforcing SSO](/docs/manage/orgs-sso#enforce-sso).

</Steps>

## Set up SCIM provisioning

These steps use the app you created for SAML or OIDC.

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

## Next steps

- [Map groups to roles](/docs/manage/orgs-sso#map-groups-to-roles). With Okta, match rules on the group's display name.
- [Enforce SSO](/docs/manage/orgs-sso#enforce-sso)
- [Let your IdP manage membership](/docs/manage/orgs-sso#let-your-idp-manage-membership)

## Troubleshooting

| What you see                                                         | What to do                                                                                                                                                      |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "User is not assigned to this application."                          | Assign the person, or a group they're in, to the app. If they are assigned, the browser may be signed in to Okta as someone else: try a private browser window. |
| "Unable to sign in"                                                  | The person may be deactivated in Okta. Check Okta's **Reports** > **System Log**.                                                                               |
| 400 error with `access_denied`                                       | The app's authentication policy needs factors the person doesn't have. Check the policy, and Okta's **Reports** > **System Log**.                               |
| "The 'redirect_uri' parameter must be a Login redirect URI…" (OIDC)  | Add Neon's **Redirect URI** to the app's **Sign-in redirect URIs**, exactly as Neon shows it.                                                                   |
| "Invalid property email in expression user.email"                    | Use `user.profile.email` in the expression editor.                                                                                                              |
| "Unexpected error when authenticating with identity provider" (SAML) | Set the app's **Single sign-on URL** to Neon's **IdP-initiated ACS URL**.                                                                                       |
| Users stay in a staged or out-of-sync state                          | Click **Provision User** on the app's **Assignments** tab.                                                                                                      |

For any other Okta error, check **Reports** > **System Log** for the reason. For messages from Neon, see [Troubleshooting](/docs/manage/orgs-sso#troubleshooting).

<NeedHelp />

---
title: Add organization members by domain
summary: >-
  Verified domains let admins verify email domains via DNS TXT record.
  Users who sign up or log in with a matching address are automatically added
  as Editors, with no manual invite required. Use this page to auto-provision
  org membership for your company domain instead of sending individual invites.
  An org can have multiple verified domains, and the same domain can be shared
  across multiple Neon organizations.
enableTableOfContents: true
redirectFrom:
  - /docs/manage/orgs-auto-provision-domain
updatedOn: '2026-11-27T16:54:51.982Z'
---

Organization admins can add verified email domains so that users whose email matches one of those domains are automatically added as members when they sign up or log in. No manual invite is required for those users.

Only organization admins can add, verify, or remove domains, or turn automatic joining on and off. You manage domains in the **Verified domains** section of your organization's **Settings** page.

## How it works

- You add a domain (for example, `example.com`) on the organization **Settings** page under **Verified domains**. The domain is added in a "Pending verification" state and Neon generates a verification code.
- You add a TXT record at your domain with that exact code. After DNS propagates, you click **Verify** in the Console to confirm you own the domain.
- When a user signs up or logs in to Neon with an email whose domain matches one of your verified domains (for example, `alex@example.com`), they are automatically added to your organization as an Editor, as long as **Auto-add new users** is on. They do not receive an invite email; they simply see the organization in their [org switcher](/docs/manage/orgs-manage#switch-organizations).

An organization can have multiple verified domains. The same domain can also be added to multiple organizations. If a user's email domain matches verified domains in more than one org, they are added to all of those organizations.

## Add and verify a domain

<Steps>

## Open Verified domains

In the Neon Console, switch to the organization you want to manage, then open the organization **Settings** page and select **Verified domains**. The section shows a short description and a **Domain** field with an **Add domain** button.

![Verified domains section on the organization Settings page, with the Domain field, Add domain button, and Auto-add new users setting](/docs/manage/verified-domains.png)

## Add the domain

In the **Domain** field, enter your domain (for example, `example.com`) and click **Add domain**. The domain appears in a card above the input with status **Pending verification**. The card shows a **Verification TXT record** value (a string starting with `neon-domain-verification=`) and instructs you to add a TXT record at your domain with that exact value, then click **Verify** after DNS propagates. Below the card, an **Add another domain** field lets you add additional domains.

## Add the TXT record at your DNS provider

In your DNS provider's console, add a TXT record at your domain with the exact value shown in the Neon Console (copy it using the icon next to the value). Add the record on the exact domain you entered in the Console (for example, `example.com`), not on a subdomain. Do not add a prefix to the value itself; paste the single string as the TXT record content.

<Admonition type="tip" title="DNS propagation">
TXT records can take from a few minutes to 48 hours to propagate. If verification fails, wait a bit and try again, or check that the TXT record is published (for example, with `dig TXT yourdomain.com` or your provider's DNS checker).
</Admonition>

## Verify the domain

After the TXT record has propagated, click **Verify** in the Neon Console (in the verification section for that domain). If the record matches, the domain status changes to **Verified**. If **Auto-add new users** is on, users who sign up or log in with an email at that domain are then automatically added to the organization as members.

<Admonition type="tip" title="After verification">
You can delete the TXT record from your domain after verification. Neon only uses it to confirm ownership; the record does not need to remain in place.
</Admonition>

</Steps>

## Turn automatic joining on or off

Below your domains, the **Auto-add new users** setting controls whether verified domains add users to the organization. It's on by default and shows its current state as **On** or **Off**. Click **Turn off** to stop adding new users automatically while keeping your domains verified, or **Turn on** to resume. Existing members are not affected either way.

## Remove a domain

Only organization admins can remove a domain. In the **Verified domains** section on the organization **Settings** page, open the actions menu (⋮) for the domain and choose **Remove**. Confirm in the dialog. After removal, new users with that email domain will no longer be automatically added to the organization. Existing members are not affected.

## Behavior details

- **Role:** Users who are automatically added receive the **Editor** role, which gives them access to every project in the organization. The API lists this role as `member`, the legacy name for Editor. Admins can change their role later from the **People** page if needed. See [Organization roles](/docs/manage/user-permissions#organization-roles).
- **Member limit:** If your organization has a member limit and it's full, matching users aren't added, and they get no error or invite. They are added the next time they log in after a seat frees up. Current [plans](/docs/introduction/plans#organization-members) include unlimited members.
- **Existing members:** If the user is already a member of the organization, no duplicate is created; they are simply signed in as usual.
- **Sign up and log in:** Users are automatically added both when they create a new Neon account and when an existing user logs in. So if you add and verify a domain after some colleagues already have Neon accounts, those colleagues will be added to the org the next time they log in (as long as their email domain matches).

## Related

- [Manage organizations](/docs/manage/orgs-manage) for inviting members manually and managing roles.
- [User permissions](/docs/manage/user-permissions) for a breakdown of what each organization role and per-project permission allows.

<NeedHelp />

---
title: Add organization members by domain
summary: >-
  Add and verify email domains so users who sign up or log in with a matching
  address are automatically added as organization members.
enableTableOfContents: true
redirectFrom:
  - /docs/manage/orgs-auto-provision-domain
---

Organization admins can add verified email domains so that users whose email matches one of those domains are automatically added as members when they sign up or log in. No manual invite is required for those users.

Only organization admins can add, verify, or remove domains. The **Domains** section appears under your organization's **Settings** page when this feature is available for your org.

## How it works

- You add a domain (for example, `example.com`) in organization **Settings** under **Domains**. The domain is added in a "Pending verification" state and Neon generates a verification code.
- You add a TXT record at your domain with that exact code. After DNS propagates, you click **Verify** in the Console to confirm you own the domain.
- When a user signs up or logs in to Neon with an email whose domain matches one of your verified domains (for example, `alex@example.com`), they are automatically added to your organization as a Member. They do not receive an invite email; they simply see the organization in their org switcher.

An organization can have multiple verified domains. The same domain can also be added to multiple organizations. If a user's email domain matches verified domains in more than one org, they are added to all of those organizations.

## Add and verify a domain

<Steps>

## Open organization Settings

In the Neon Console, switch to the organization you want to manage, then open **Settings**. Find the **Domains** section. The page shows a **Domain** field and **Add domain** button; if no domains exist yet, a message prompts you to add a domain to get started.

![Domains page before adding a domain: Domain input field and Add domain button](/docs/manage/orgs_domains_empty.png)

## Add the domain

In the **Domain** field, enter your domain (for example, `example.com`) and click **Add domain**. The domain appears in the list with status **Pending verification**. The Console shows a **Verification TXT record** value (a string starting with `neon-domain-verification=`) and instructs you to add a TXT record at your domain with that exact value, then click **Verify** after DNS propagates.

![Domain added with Pending verification status, Verification TXT record value, and Verify button](/docs/manage/orgs_domains_pending.png)

## Add the TXT record at your DNS provider

In your DNS provider's console, add a TXT record at your domain with the exact value shown in the Neon Console (copy it using the icon next to the value). Use the root or host you manage for the domain. Do not add a subdomain prefix to the value itself; paste the single string as the TXT record content.

<Admonition type="tip" title="DNS propagation">
TXT records can take from a few minutes to 48 hours to propagate. If verification fails, wait a bit and try again, or check that the TXT record is published (for example, with `dig TXT yourdomain.com` or your provider's DNS checker).
</Admonition>

## Verify the domain

After the TXT record has propagated, click **Verify** in the Neon Console (in the verification section for that domain). If the record matches, the domain status changes to **Verified**. Users who sign up or log in with an email at that domain will then be automatically added to the organization as members.

<Admonition type="tip" title="After verification">
You can delete the TXT record from your domain after verification. Neon only uses it to confirm ownership; the record does not need to remain in place.
</Admonition>

</Steps>

## Remove a domain

Only organization admins can remove a domain. In the **Domains** section, open the actions menu (⋮) for the domain and choose **Remove**. Confirm in the dialog. After removal, new users with that email domain will no longer be automatically added to the organization. Existing members are not affected.

## Behavior details

- **Role:** Users who are automatically added receive the **Member** role. Admins can change their role later from the **People** page if needed.
- **Existing members:** If the user is already a member of the organization, no duplicate is created; they are simply signed in as usual.
- **Sign up and log in:** Users are automatically added both when they create a new Neon account and when an existing user logs in. So if you add and verify a domain after some colleagues already have Neon accounts, those colleagues will be added to the org the next time they log in (as long as their email domain matches).

## Related

- [Manage organizations](/docs/manage/orgs-manage) for inviting members manually and managing roles.
- [User permissions](/docs/manage/user-permissions) for a breakdown of Admin and Member capabilities.

<NeedHelp />

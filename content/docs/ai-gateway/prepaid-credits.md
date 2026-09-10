---
title: AI Gateway prepaid credits
subtitle: Buy credits, understand pricing and limits, and manage your balance for the Neon AI Gateway
summary: >-
  Learn how AI Gateway prepaid credits work, who can buy them, how to purchase
  credits, and how usage limits and balances affect access.
enableTableOfContents: true
updatedOn: '2026-09-10T14:03:33.000Z'
---

<!--
DRAFT — not ready to publish.
Destination: content/docs/ai-gateway/prepaid-credits.md →
neon.com/docs/ai-gateway/prepaid-credits.
Several sections are gated on the open questions in the checklist at the bottom.
-->

The Neon AI Gateway is billed with **prepaid credits**. You buy credits up front,
and AI Gateway usage draws down your balance. This page explains who can buy
credits, how pricing and usage limits work, how to purchase or top up, and how to
check your balance.

<Admonition type="note">
The AI Gateway is available on **paid Neon plans only** — it is not included in
the Free plan. See [Neon plans](/docs/introduction/plans) and
[About billing](/docs/introduction/about-billing).
</Admonition>

## How credits and pricing work

- **1 credit = $1 USD.** Credits are prepaid — purchased before use.
- **Minimum purchase: $5.** <!-- TODO: Confirm the GA maximum and supported range. -->
- **Minimum balance: $2.** <!-- LKB-17487 -->
- **Credits expire 12 months after purchase.**
- Your balance can go **negative** — usage is metered after a request is served,
  so a final request can push the balance below zero.
  <!-- TODO: Confirm how a negative balance is communicated or settled. -->
- Credits are billed in **USD only**; there are no fixed credit packages — you
  choose the amount.

## Who can buy credits (eligibility)

- Only **organization admins** can purchase credits.
- The account must pay by card (**`payment_method = stripe`**).
- Members, editors, and viewers cannot purchase.
- **Accounts that cannot self-serve purchase** (credits are added by an admin
  grant / through your account team instead):
  - Sales-invoiced accounts (direct/manual payment)
  - AWS, Azure, or Vercel marketplace accounts
  - Trial or sponsored accounts
  - Shared-token accounts

<!--
TODO: Buy or top up credits

TODO: Confirm whether purchase is a Console UI flow or API-only at GA, and where
Buy credits appears in the Console. The steps and screenshots are placeholders.

1. SCREENSHOT TODO: Go to the confirmed Console location and select **Buy credits**.
2. Enter the amount you want to purchase (minimum $5). The charge uses the
   **payment card already on file** for your organization.
3. Confirm. Credits are added to your balance once the charge succeeds.

<Admonition type="important">
Only **one purchase can be open at a time** per account — you can't start a second
purchase until the first completes.
</Admonition>

<Admonition type="warning">
The purchase charge is made against your card **off-session**, so cards that
require **3-D Secure (3DS)** authentication are expected to be **declined**. Use a
payment card that does not require 3DS for AI Gateway credit purchases.
</Admonition>

TODO: Confirm that 3DS declines are intended GA behavior and the guidance to publish.

TODO: Confirm whether an Orb-hosted invoice or PDF receipt is surfaced or emailed
after purchase. If so, document where to find it.
-->

<!--
TODO: View your balance and usage history

Confirm GA enablement before publishing this section. The customer-facing
balance and usage-history public API has landed (LKB-17262 Done), and the balance
UI closed (LKB-16059 Done, September 7), shipped behind a config flag and enabled
in staging. The GA TLDR framed balance and monitoring as post-GA. Confirm whether
it is enabled for customers at the September 17 GA. If yes, document the endpoint,
Console surface, and screenshot. If no, replace this section with a short
"coming soon" note.

SCREENSHOT TODO: Balance surface after GA enablement is confirmed.
-->

## Usage limits

AI Gateway usage is subject to **soft limits** to protect against runaway cost and
abuse. At GA, standard accounts have:

- **200,000 tokens per minute (TPM)**
- **$20 per day**

These are soft limits — if you need higher throughput or spend, **contact Support**
to request an increase.

<!-- TODO: Confirm the Support or contact path to link. -->

<!--
Publish Tier 1 only. The higher Tier 2 (600K TPM / $500 per day) is internal and
must not be published.
-->

When you exceed a limit, the API returns **HTTP 429**:

```json
{
  "error_code": "REQUEST_LIMIT_EXCEEDED",
  "message": "ai gateway daily token limit exceeded"
}
```

<!--
BLOCKED: Model access and verification

Verification reconciliation is the primary open question. The GA FAQ
says an account with a paid plan and credits can use all models. The code gates
unverified accounts to approximately eight open-access models and returns HTTP
403 "model requires a verified account" for the rest. Do not write this section
until engineering confirms how, or whether, verification surfaces to customers
at GA.

Two possible outcomes:
1. Paid plan plus credits grants all-model access. Make this section a one-line
   statement and omit the open-access model list.
2. Gating remains. Document which models require a verified account, the 403
   response, and the remediation path for unverified or rejected accounts. There
   is no customer status or retry endpoint today.

Any published model list must be marked "subject to change" because models are
added regularly. See [Supported models](/docs/ai-gateway/models).
-->

<!--
TODO: Running out of credits

Confirm enforcement is enabled at GA before publishing. Real BlockSender
landed (LKB-16345 Done). If enforcement is enabled, a depleted wallet returns
HTTP 429 "ai gateway credit balance depleted". Document the behavior after
enforcement enablement and blocked-state UX are confirmed.
-->

<!--
TODO: Notifications

LKB-16060, for real low-balance and no-balance notifications, is in review.
Confirm which notifications ship (low balance, depleted balance, or top-up
confirmation), the channels (email or Console), and whether they are configurable
before publishing.
-->

## Automatic top-up

Automatic top-up is **not available**. You add credits manually by purchasing as
described above.

<!-- Automatic top-up is out of scope for GA per the GA TLDR. -->

<!--
BLOCKED: The "Beta to GA transition" section about a one-time beta-user credit
grant was removed from this public page. It is a one-time migration event better
delivered through direct communications than evergreen documentation. The amount
and framing came from the internal GA TLDR and are not confirmed for public use.
If PM wants a public transitional note, use a short time-boxed callout or separate
announcement or migration page after PM decides.
-->

## If you downgrade to Free

If your organization moves to the Free plan, any AI Gateway credits **remain on
your account**, but the AI Gateway is **not usable on Free**. Your credits become
usable again when you upgrade to a paid plan.

## Availability

At GA the AI Gateway is available in: **US East 1, US East 2, EU London, and
Singapore** (more regions to follow).

<Admonition type="note">
**IP Allow** and **Private Link** do not cover AI Gateway traffic at GA.
</Admonition>

## Related

- [Supported models](/docs/ai-gateway/models)
- [AI Gateway troubleshooting](/docs/ai-gateway/troubleshooting)
- [About billing](/docs/introduction/about-billing)
- [Manage billing](/docs/introduction/manage-billing)

<!--
NOT-FOR-PUBLICATION NOTES — what is still needed to finish this page

1. VERIFICATION: Resolve the FAQ-versus-code disagreement before writing Model
   access and verification.
2. BETA-TO-GA GRANT: Pending a PM decision on public docs versus direct comms.
3. SCREENSHOTS:
   - Buy credits entry point in the Console and the purchase flow.
   - Balance and usage-history surface, only if GA-enabled.
   - Optional 429 limit or depleted-balance state, if there is UI.
4. GA ENABLEMENT: Confirm balance and history API, enforcement, and notifications.
5. PURCHASE SURFACE: Confirm Console UI versus API-only and exact location.
6. NUMBERS: Confirm purchase maximum and range, beta-to-GA grant, and receipt.
7. SUPPORT: Confirm the contact link for limit-increase requests.
-->

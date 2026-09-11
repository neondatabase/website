---
title: AI Gateway prepaid credits
subtitle: Buy credits, understand pricing and limits, and manage your balance for the Neon AI Gateway
summary: >-
  Learn how AI Gateway prepaid credits work, who can buy them, how to purchase
  credits, how to check your balance, and how usage limits and metering affect
  access.
enableTableOfContents: true
updatedOn: '2026-09-11T12:11:39.591Z'
---

<!--
DRAFT — not ready to publish.
Destination: content/docs/ai-gateway/prepaid-credits.md →
neon.com/docs/ai-gateway/prepaid-credits.
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
- **Minimum purchase: $5.**
  <!-- TODO/CONFIRM: Maximum custom purchase amount and supported range. -->
- **Minimum balance: $2.**
  <!-- TODO/CONFIRM: Clarify when requests are actually blocked relative to the $2 minimum, $0, and negative balance — tied to enforcement enablement (see enforcement TODO). -->
- **Credits expire 12 months after purchase.**
- Your balance can go **negative** — usage is metered after a request is served,
  so a final request can push the balance below zero.
  <!-- TODO/CONFIRM: How a negative balance is communicated or settled. -->

Your balance **draws down as usage is metered** — each request consumes credits
based on its token usage, so your balance decreases as you send requests. For
example, a small request might reduce a $25.00 balance to $24.99.

## Who can buy credits

- Only **organization admins** can purchase credits.
- The organization must be billed directly by payment card.
- Members, editors, and viewers cannot purchase credits.
- Sales-invoiced, marketplace, trial, sponsored, and shared-token accounts cannot
  purchase credits through this self-service flow. Contact your account team for
  assistance.

## Buy or top up credits

Buying credits is a Neon Console flow:

1. In the Neon Console, select **Billing**.
2. Find the **AI gateway credits** card and select **Add credits**.
3. Select a preset amount: **$5**, **$10**, **$25**, **$50**, or **$100**. You can
   also select **Other** to enter a custom amount. The default selection is $25,
   and the minimum purchase is $5.
4. Confirm the purchase. Neon applies a **one-time charge** to the payment card
   already on file for your organization.

Credits post to your balance promptly after the charge succeeds. The purchase
appears in your credit history as **Manual purchase**, with the date and amount.

<!-- SCREENSHOT: Buy credits entry point -->

<Admonition type="important">
Only **one purchase can be open at a time** per account — you can't start a second
purchase until the first completes.
</Admonition>

<!-- TODO/CONFIRM: 3DS decline behavior — whether a purchase is declined when the card on file requires 3-D Secure authentication, and what customer guidance to provide. -->

<!-- TODO/CONFIRM: Orb invoice or receipt surfacing — whether an Orb-hosted invoice or PDF receipt is available or emailed after purchase, and where customers find it. -->

## View your balance and usage history

In the Console, select **Billing** and find the **AI gateway credits** card. The
card shows:

- **Credits remaining**: your organization's current credit balance.
- **Credits added in last 30 days**: a history panel that lists each entry's date,
  source, and amount, plus the total credits added during the period.

The balance is shown in **whole cents**, so small or occasional requests might not
visibly change it even though their metered usage still draws down the balance.

<!-- TODO: confirm GA enablement (TLDR framed monitoring as post-GA) -->

<!-- SCREENSHOT: balance surface -->

## Usage limits

AI Gateway usage is subject to **soft limits** to protect against runaway cost and
abuse. Standard accounts have:

- **200,000 tokens per minute (TPM)**
- **$20 per day**

Short-window rate limits, the daily spend cap, and balance depletion are
**distinct concepts**:

- **Short-window rate limits** are surfaced through `x-ratelimit-*` response
  headers on each request.
- The **daily spend cap** limits how much you can spend over a single day.
- **Balance depletion** happens when your prepaid credits run out.

If you need a higher TPM limit, open a Neon Support ticket and choose the
**AI Gateway TPM increase request** ticket type.

<!-- TODO/CONFIRM: Exact Console path to create the support ticket, and whether a daily spend-cap increase uses the AI Gateway TPM increase request ticket type or the separate Billing ticket type. -->

When you exceed a limit, the API returns **HTTP 429**:

```json
{
  "error_code": "REQUEST_LIMIT_EXCEEDED",
  "message": "ai gateway daily token limit exceeded"
}
```

## Model access and verification

A **paid account with prepaid credits can access all available AI Gateway
models**, including locked and frontier models. A model's **lock icon** means the
model requires an entitled, funded account — it does **not** mean the model is
unavailable. An unfunded organization sees models as locked; they unlock once the
organization is on a paid plan and has credits.

<!-- TODO: abuse/verification enforcement exists for rejected/quarantined/suspended accounts (LKB-15222); confirm customer-facing behavior before documenting -->

The model list is subject to change. See
[Supported models](/docs/ai-gateway/models) for the current catalog.

<!-- TODO/CONFIRM: Running out of credits and enforcement enablement. Real enforcement landed (LKB-16345), but GA enablement and the customer-facing blocked-state behavior (for example, whether a depleted wallet returns HTTP 429 "ai gateway credit balance depleted") are unconfirmed. -->

<!-- TODO/CONFIRM: Notifications. LKB-16060 is In Review. Confirm which AI Gateway low-balance, depleted-balance, or top-up notifications ship; their email or Console channels; and whether they are configurable. Do not conflate them with the general organization spending notifications (a non-blocking monthly-spend email alert). -->

## Automatic top-up

Automatic top-up is **not available**. You add credits manually by purchasing as
described above.

<!--
PULLED: The "Beta to GA transition" section about a one-time beta-user credit
grant remains removed from this public page. Reasons: (1) it is a one-time
migration event better delivered through direct communications (email or in-app
notice) than evergreen documentation; (2) the amount and framing came from an
internal source and are not confirmed for public use; (3) it ages badly on an
evergreen page. If PM wants a public transitional note, use a short time-boxed
callout or a separate announcement or migration page — pending PM decision.
-->

## Availability

At GA, the AI Gateway is available in **US East 1, US East 2, EU London, and
Singapore** (more regions to follow).

<Admonition type="note">
**IP Allow** and **Private Link** do not cover AI Gateway traffic at GA.
</Admonition>

<!-- TODO/CONFIRM: Verify the GA region list and the IP Allow / Private Link coverage scope before publishing. -->

## If you downgrade to Free

If your organization moves to the Free plan, any AI Gateway credits **remain on
your account**, but the AI Gateway is **not usable on Free**. Your credits become
usable again when you upgrade to a paid plan.

## Related

- [Supported models](/docs/ai-gateway/models)
- [AI Gateway troubleshooting](/docs/ai-gateway/troubleshooting)
- [About billing](/docs/introduction/about-billing)
- [Manage billing](/docs/introduction/manage-billing)

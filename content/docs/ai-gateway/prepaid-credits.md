---
title: AI Gateway prepaid credits
subtitle: Buy credits, understand pricing and limits, and manage your balance for the Neon AI Gateway
summary: >-
  Learn how AI Gateway prepaid credits work, who can buy them, how to purchase
  credits, how to check your balance, and how usage limits and metering affect
  access.
enableTableOfContents: true
updatedOn: '2026-09-16T15:38:57.808Z'
---

The Neon AI Gateway is billed with **prepaid credits**. You buy credits up front,
and AI Gateway usage draws down your balance. This page explains who can buy
credits, how pricing and usage limits work, how to purchase or top up, and how to
check your balance.

<Admonition type="note">
The AI Gateway is available on **paid Neon plans only**. It is not included in
the Free plan. See [Neon plans](/docs/introduction/plans) and
[About billing](/docs/introduction/about-billing).
</Admonition>

## How credits and pricing work

- **1 credit = $1 USD.** Credits are prepaid, purchased before use.
- **Minimum purchase: $5.**
- **Minimum balance: $2.**
- **Credits expire 12 months after purchase.**
- Your balance can go **negative**. Usage is metered after a request is served,
  so a final request can push the balance below zero.

Your balance **draws down as usage is metered**. Each request consumes credits
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

![AI Gateway credits purchase modal with preset and custom amounts](/docs/ai-gateway/ai-gateway-add-credits-modal.png)

Credits post to your balance promptly after the charge succeeds. The purchase
appears in your credit history as **Manual purchase**, with the date and amount.

<Admonition type="important">
Only **one purchase can be open at a time** per account. You can't start a second
purchase until the first completes.
</Admonition>

## View your balance and usage history

In the Console, select **Billing** and find the **AI gateway credits** card. The
card shows:

- **Credits remaining**: your organization's current credit balance.
- **Credits added in last 30 days**: a history panel that lists each entry's date,
  source, and amount, plus the total credits added during the period.

![AI Gateway credits balance and credits added in the last 30 days](/docs/ai-gateway/ai-gateway-credits-balance.png)

The balance is shown in **whole cents**, so small or occasional requests might not
visibly change it even though their metered usage still draws down the balance.

## Usage limits

AI Gateway usage is subject to **soft limits** that guard against runaway cost
and abuse:

- **Per-minute token limit.** A soft limit of **200,000 tokens per minute
  (TPM)** applies, but this may vary by account.
- **Daily spend cap.** A **$20 per day** limit applies to total usage, but this
  may vary by account.

Short-window rate limits, the daily spend cap, and balance depletion are distinct:

- **Short-window rate limits** are surfaced through `x-ratelimit-*` response
  headers on each request.
- The **daily spend cap** limits how much you can spend in a single day.
- **Balance depletion** happens when your prepaid credits run out.

If you're blocked and need a limit raised, [contact Support](/docs/introduction/support).
See [Rate limits](/docs/ai-gateway/models#rate-limits) for details.

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
model requires an entitled, funded account. It does **not** mean the model is
unavailable. An unfunded organization sees models as locked; they unlock once the
organization is on a paid plan and has credits.

The model list is subject to change. See
[Supported models](/docs/ai-gateway/models) for the current catalog.

## Automatic top-up

Automatic top-up is **not available**. You add credits manually by purchasing as
described above.

## Availability

The AI Gateway is available in **US East 1** and **US East 2** (more regions to
follow).

<Admonition type="note">
**IP Allow** and **Private Link** do not cover AI Gateway traffic.
</Admonition>

## If you downgrade to Free

If your organization moves to the Free plan, any AI Gateway credits **remain on
your account**, but the AI Gateway is **not usable on Free**. Your credits become
usable again when you upgrade to a paid plan.

## Related

- [AI Gateway overview](/docs/ai-gateway/overview)
- [Supported models](/docs/ai-gateway/models)
- [AI Gateway troubleshooting](/docs/ai-gateway/troubleshooting)
- [About billing](/docs/introduction/about-billing)
- [Manage billing](/docs/introduction/manage-billing)

## Frequently asked questions

<Faq>

<FaqItem question="Who can use AI Gateway?">
AI Gateway is available on Neon's paid plans (Launch and Scale). Any paid Neon customer with prepaid credits can access all available models.
</FaqItem>

<FaqItem question="How much do AI Gateway credits cost?">
1 credit equals $1 USD, with a $5 minimum purchase. You buy credits from the **Billing** page in the [Neon Console](https://console.neon.tech/app/billing).
</FaqItem>

<FaqItem question="Can my credit balance go negative?">
Yes, by a small amount. Usage can exceed your remaining balance before it's detected, so a minimum balance of $2 applies to account for this.
</FaqItem>

<FaqItem question="Do credits expire?">
Credits are valid for 12 months from the date of purchase.
</FaqItem>

<FaqItem question="What happens to my credits if I downgrade to Free?">
Your credits stay on your account, but you can't use AI Gateway while on the Free plan. They become available again if you upgrade to a paid plan.
</FaqItem>

<FaqItem question="What are the default usage limits?">
By default, each account has a soft limit of 200,000 tokens per minute (TPM) and a $20 per day spend cap, though both may vary by account. Both guard against runaway costs. If you're blocked and need a limit raised, [contact Support](/docs/introduction/support). See [Usage limits](#usage-limits) for details.
</FaqItem>

<FaqItem question="What happens if I hit a usage limit?">
Requests are blocked once you reach your per-minute token limit or daily spend cap, and the gateway returns an `HTTP 429` response with error code `REQUEST_LIMIT_EXCEEDED`. See [Usage limits](#usage-limits) for details, or [Troubleshooting](/docs/ai-gateway/troubleshooting#429-account-quota-exceeded) if you hit it.
</FaqItem>

</Faq>

<NeedHelp/>

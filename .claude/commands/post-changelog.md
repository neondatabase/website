---
description: 'Post the weekly Neon changelog for review to all Lakebase Slack channels. Databricks employees only — requires the Slack MCP with access to internal Databricks channels.'
argument-hint: <preview-url> <pr-url>
---

# Post Changelog

Post this week's Neon changelog for review to all Lakebase Slack channels.

> **Databricks employees only.** This command posts to internal Databricks Slack channels. It requires the Slack MCP configured in your Claude setup with access to those channels. If you don't have access, ask a Databricks team member to post on your behalf.

## Usage

```
/post-changelog <preview-url> <pr-url>
```

Both arguments are required. If either is missing, ask the user to provide them before proceeding.

- **Preview URL** — the Vercel preview link for the changelog page (from `/add-preview-links`)
- **PR URL** — the GitHub PR link for the changelog

## Step 1: Confirm inputs

Parse the two arguments. If either is missing, stop and ask for them.

## Step 2: Compose the message

Build the message in exactly this format:

```
xPost: Today's Neon changelog is available for review. Please let us know if we missed anything.

Preview: <PREVIEW_URL>
PR: <PR_URL>
```

## Step 3: Show and confirm

Display the composed message and ask:

> "Ready to post this to all 10 Lakebase channels. Shall I proceed?"

Do not post until the user confirms.

## Step 4: Post to all channels in parallel

Post simultaneously to all channels using `chat.postMessage`:

| Channel | ID |
| --- | --- |
| #lakebase-plg-docs | C092360K1S5 |
| #lakebase-support | C0920DTQ29G |
| #lakebase-product-managers | C091YHP3XLP |
| #lakebase-plg | C0917UMC0KZ |
| #lakebase-team-billing | C091HCKQX99 |
| #lakebase-team-workflow | C091LGPSXQD |
| #lakebase-team-plg | C091EQGTY67 |
| #lakebase-team-apps-devx-baas | C091NPP7M1S |
| #lakebase-product-eng-dbaas | C091X8KM0TH |
| #neon-auth-and-lakebase-auth | C09HPKGNCDB |

## Step 5: Report results

Confirm which channels succeeded and flag any that failed.

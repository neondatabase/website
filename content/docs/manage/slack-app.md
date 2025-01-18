---
title: Neon Slack App
enableTableOfContents: true
subtitle: Track your Neon projects and organizations from Slack
---

The Neon Slack App gives you quick access to your Neon projects and resource usage without leaving Slack. Monitor compute hours, storage, and data transfer across organizations, manage team access, and receive usage alerts - all directly from your Slack workspace. Ideal for admins and project owners who need to keep an eye on their Neon resources.

<img 
  src="/docs/manage/slack_app_overview.png" 
  alt="Neon Slack App showing authentication and usage commands in action"
  style={{ display: "block", margin: "0 auto", width: "80%" }}
/>

## Setup

<Steps>

## Install the Neon Slack App

1. Open Slack and navigate to the **Apps** section in the left sidebar.
2. Click **Add apps** and search for **Neon**.
3. Select the Neon Slack App and follow the prompts to install it.

<Admonition type="tip">
If your Slack workspace is company-managed and doesn’t allow third-party apps, you may need to request admin approval to install the Neon Slack App. Slack will notify you if admin approval is required.
</Admonition>

Once the app is installed, open a direct message with the Neon Slack App and type `/neon auth` to connect your Neon account.

## Authenticate with Neon

1. Open a DM with the Neon Slack App in Slack.
2. Type `/neon auth` and follow the prompts to log in to your Neon account.

Once authenticated, you're ready to use all available commands.

</Steps>

## Available commands

| **Command**                 | **Description**                                                |
|-----------------------------|---------------------------------------------------------------|
| `/neon auth`                | Log in to your Neon account                                   |
| `/neon projects`            | List all your accessible projects                             |
| `/neon usage`               | View your overall resource usage (compute, storage, transfer)  |
| `/neon help`                | Show all available commands                                   |
| `/neon status`              | Check Neon's system status.                                   |
| `/neon feedback`            | Share your thoughts to improve the Neon Slack App             |
| `/neon projects usage`      | View resource usage for a specific project                    |
| `/neon projects shared`     | See projects others have shared with you                      |
| `/neon set org`             | Set your active organization context                          |
| `/neon get defaults`        | View your currently set organization context settings         |
| `/neon clear defaults`      | Clear your organization context and return to personal view   |
| `/neon invite user`         | Invite a user to your organization.                           |

## Example workflow

### Check your Neon usage statistics

Open a DM with the Neon Slack App and run the following command to instantly view your current data transfer, compute time, and storage usage across all projects:

```
/neon usage
```

<img src="/docs/manage/slack_app_usage.png" alt="results of /neon usage showing compute, storage, and data transfer" style={{ display: "block", margin: "1rem 0", width: "80%" }} />

### Switching between organizations

To take actions on behalf of a specific organization, set your context using the following command:

```bash
/neon set org
```

When finished, you can return to your personal view by clearing your defaults:

```bash
/neon clear defaults
```

## FAQs

### How do I set my active organization?

Use the `/neon set org` command to select your active organization.

### Does this app allow me to modify databases or projects?

No, the Neon Slack App is primarily for viewing usage details and managing organization membership, not for direct database management.

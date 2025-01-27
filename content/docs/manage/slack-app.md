---
title: Neon Slack App
enableTableOfContents: true
subtitle: Track your Neon projects and organizations from Slack
updatedOn: '2025-01-22T02:36:07.648Z'
---

<Admonition type="comingSoon">
The Neon Slack App is coming soon! If you've already expressed interest, we'll email you as soon as it's ready. Otherwise, watch for it in our weekly [Changelog](/docs/changelog).
</Admonition>

The Neon Slack App allows you to monitor your Neon usage and manage organization membership directly from Slack. Get quick access to project information and resource usage metrics without leaving your workspace.

<img
src="/docs/manage/slack_app_overview.png"
alt="Neon Slack App showing authentication and usage commands in action"
style={{ display: "block", margin: "2em auto", width: "80%" }}
/>

## Setup

<Steps>

## Install the Neon Slack App

1. Open Slack and navigate to the **Apps** section in the left sidebar.
2. Click **Add apps** and search for **Neon**.
3. Select the Neon Slack App and follow the prompts to install it.

Once the app is installed, open a direct message with the Neon Slack App and type `/neon auth` to connect your Neon account.

<Admonition type="tip">
If your Slack workspace is company-managed and doesn't allow third-party apps, you may need to request admin approval to install the Neon Slack App. Slack will notify you if admin approval is required.
</Admonition>

## Authenticate with Neon

1. Open a DM with the Neon Slack App in Slack.
2. Type `/neon auth` and follow the prompts to log in to your Neon account.

Once authenticated, you're ready to use all available commands.

</Steps>

## Available commands

| **Command**             | **Description**                                   |
| ----------------------- | ------------------------------------------------- |
| `/neon auth`            | Log in to your Neon account                       |
| `/neon projects`        | List your projects (with IDs)                     |
| `/neon usage`           | View your overall resource usage                  |
| `/neon help`            | Show all available commands                       |
| `/neon status`          | Check Neon's system status                        |
| `/neon feedback`        | Share your thoughts to improve the Neon Slack App |
| `/neon projects usage`  | View resource usage for a specific project        |
| `/neon projects shared` | See projects others have shared with you          |
| `/neon org set`         | Set your active organization                      |
| `/neon org`             | View your active organization                     |
| `/neon org clear`       | Clear your active organization                    |
| `/neon invite user`     | Invite a user to your organization                |

## Example workflows

### Check your Neon usage statistics

Open a DM with the Neon Slack App and run the following command to instantly view your current data transfer, compute time, and storage usage across all projects:

```
/neon usage
```

<img src="/docs/manage/slack_app_usage.png" alt="results of /neon usage showing compute, storage, and data transfer" style={{ display: "block", margin: "1rem 0", width: "80%" }} />

### Switching between organizations

To take actions on behalf of a specific organization, set your context using the following command:

```bash
/neon org set
```

When finished, you can return to your personal view by clearing your defaults:

```bash
/neon org clear
```

### Usage notifications

In addition to checking usage on demand, the Neon Slack App will automatically notify you when you approach or reach your resource limits for compute hours, storage, or data transfer.

## FAQs

<details>
<summary>**What can I do with the Neon Slack App?**</summary>

The Neon Slack App allows you to:

- View project information and resource usage
- Monitor system status
- Manage organization membership
- Access shared projects
- Switch between organizations

</details>

<details>
<summary>**Does this app allow me to modify databases or projects?**</summary>

No, the Neon Slack App is primarily for viewing usage details and managing organization membership, not for direct database management.

</details>

<details>
<summary>**Can I control which notifications I receive?**</summary>

Currently, all users receive usage limit notifications. There's no way to customize notification preferences within the Slack App.

</details>

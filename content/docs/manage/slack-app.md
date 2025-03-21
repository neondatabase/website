---
title: Neon Slack App
enableTableOfContents: true
subtitle: Track your Neon projects and organizations from Slack
updatedOn: '2025-03-19T12:43:23.197Z'
---

The Neon Slack App allows you to monitor your Neon usage and manage organization membership directly from Slack. Get quick access to project information and resource usage metrics without leaving your workspace.

![Neon Slack App commands](/docs/manage/slack_app_overview.png)

## Setup

<Steps>

## Install the Neon Slack App

Click the **Add to Slack** button and follow the prompts.
<Button
className="border-none"
to="https://slack.com/oauth/v2/authorize?client_id=2231113872023.8135357564067&scope=chat:write,commands,im:history,team:read&user_scope="
target="\_blank"
rel="noopener noreferrer"
tag_name="Add to Slack"
analyticsEvent="click_add_to_slack_link">
<img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
<span className="sr-only">Add to Slack</span>
</Button>

## Authenticate with Neon

The first thing you need to do is authorize — open a DM with your new app and type `/neon auth`. Follow the login flow that opens in your browser, and you're in.

Once authenticated, you're ready to use all available commands.

</Steps>

## Available commands

| **Command**             | **Description**                                   |
| ----------------------- | ------------------------------------------------- |
| `/neon auth`            | Connect Slack to your Neon account                |
| `/neon projects`        | List your Neon projects                          |
| `/neon usage`          | Show overall resource usage for your account      |
| `/neon help`           | List all available commands                       |
| `/neon status`         | Check the current status of Neon's cloud service  |
| `/neon feedback`       | Share your thoughts and suggestions about the Neon Slack App |
| `/neon invite user`    | Invite users to your organization                 |
| `/neon subscribe`      | Subscribe to your Neon account updates            |
| `/neon unsubscribe`    | Unsubscribe from your Neon account updates       |

## Example workflows

### Check your Neon usage statistics

Open a DM with the Neon Slack App and run the following command to instantly view your current data transfer, compute time, and storage usage across all projects:

```
/neon usage
```

![results of neon usage command](/docs/manage/slack_app_usage.png)

### Usage notifications

You can receive automated notifications about your Neon usage in any public channel. First, subscribe to notifications using the steps in the section below. Once subscribed, the channel will receive automatic notifications when you approach or reach your resource limits for compute hours, storage, or data transfer.

### Subscribe to notifications in a channel

To receive Neon notifications in a specific Slack channel:

1. Go to the public channel where you want to receive notifications
2. Run `/neon subscribe` - you'll be prompted to run `/invite @Neon (Beta)` if needed
3. After inviting the bot, run `/neon subscribe` again

Once subscribed, the channel will start receiving important Neon usage notifications. To stop receiving notifications, use the `/neon unsubscribe` command in the same channel.

## FAQs

<details>
<summary>**What can I do with the Neon Slack App?**</summary>

The Neon Slack App allows you to:

- View project information and resource usage
- Monitor system status
- Manage notifications in channels
- Invite users to your organization

</details>

<details>
<summary>**Does this app allow me to modify databases or projects?**</summary>

No, the Neon Slack App is primarily for viewing usage details and managing organization membership, not for direct database management.

</details>

<details>
<summary>**Can I control which notifications I receive?**</summary>

You can control where notifications are sent using the `/neon subscribe` and `/neon unsubscribe` commands in any public channel. However, you cannot customize which types of notifications you receive - all subscribed channels will receive all important Neon updates and usage alerts.

</details>

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
tagName="Add to Slack"
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
| `/neon auth`            | Log in to your Neon account                       |
| `/neon projects`        | List your projects (with IDs)                     |
| `/neon usage`           | View your overall resource usage                  |
| `/neon help`            | Show all available commands                       |
| `/neon status`          | Check Neon's system status                        |
| `/neon feedback`        | Share your thoughts to improve the Neon Slack App |
| `/neon projects usage`  | View resource usage for a specific project        |
| `/neon projects shared` | See projects others have shared with you          |
| `/neon invite user`     | Invite a user to your organization                |

## Example workflows

### Check your Neon usage statistics

Open a DM with the Neon Slack App and run the following command to instantly view your current data transfer, compute time, and storage usage across all projects:

```
/neon usage
```

![results of neon usage command](/docs/manage/slack_app_usage.png)

### Usage notifications

In addition to checking usage on demand, the Neon Slack App will automatically notify you when you approach or reach your resource limits for compute hours, storage, or data transfer.

## FAQs

<details>
<summary>**What can I do with the Neon Slack App?**</summary>

The Neon Slack App allows you to:

- View project information and resource usage
- Monitor system status
- Access shared projects
- Invite users to your organization

</details>

<details>
<summary>**Does this app allow me to modify databases or projects?**</summary>

No, the Neon Slack App is primarily for viewing usage details and managing organization membership, not for direct database management.

</details>

<details>
<summary>**Can I control which notifications I receive?**</summary>

Currently, all users receive usage limit notifications. There's no way to customize notification preferences within the Slack App.

</details>

---
title: Neon App for Slack
enableTableOfContents: true
subtitle: Track your Neon projects and organizations from Slack
updatedOn: '2025-03-19T12:43:23.197Z'
---

<figure className="doc-cta not-prose rounded-[10px] my-5 flex items-end gap-x-16 px-7 py-6 md:flex-col md:items-start border border-gray-new-90 bg-[linear-gradient(to_right,#FAFAFA_0%,rgba(250,250,250,0)100%)] dark:border-gray-new-20 dark:bg-[linear-gradient(to_right,#18191B_28.86%,#131415_74.18%)]">
  <div>
    <h2 className="!my-0 font-semibold tracking-extra-tight text-2xl leading-dense">Add Neon to your Slack workspace!</h2>
    <p className="mt-2 text-gray-new-20 dark:text-gray-new-80 text-sm font-light">Monitor your Neon projects, track usage, and manage your organization directly from Slack. Available to all Neon users, free and paid.</p>
  </div>
  <Button
    className="border-none md:mt-4"
    to="https://slack.com/oauth/v2/authorize?client_id=2231113872023.8135357564067&scope=chat:write,commands,im:history,team:read&user_scope="
    target="_blank"
    rel="noopener noreferrer"
    tagName="Add to Slack"
    analyticsEvent="click_add_to_slack_link">
    <img alt="Add to Slack" height="60" width="208" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
    <span className="sr-only">Add to Slack</span>
  </Button>
</figure>

The Neon App for Slack allows you to monitor your Neon usage and manage organization membership directly from Slack. Get quick access to project information and resource usage metrics without leaving your workspace. The app is available to all Neon users on both free and paid plans — check out our [pricing page](https://neon.tech/pricing) for more details.

![Neon App for Slack commands](/docs/manage/slack_app_overview.png)

## Setup

<Steps>

## Install the Neon App for Slack

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
| `/neon auth`            | Connect Slack to your Neon account                |
| `/neon projects`        | List your Neon projects                          |
| `/neon usage`          | Show overall resource usage for your account      |
| `/neon help`           | List all available commands                       |
| `/neon status`         | Check the current status of Neon's cloud service  |
| `/neon feedback`       | Share your thoughts and suggestions about the Neon App for Slack |
| `/neon invite user`    | Invite users to your organization                 |
| `/neon subscribe`      | Subscribe to your Neon account updates            |
| `/neon unsubscribe`    | Unsubscribe from your Neon account updates       |
| `/neon disconnect`     | Disconnect your Neon account and subscribed channels |

## Example workflows

### Check your Neon usage statistics

Open a DM with the Neon App for Slack and run the following command to instantly view your current data transfer, compute time, and storage usage across all projects:

```
/neon usage
```

![results of neon usage command](/docs/manage/slack_app_usage.png)

### Usage notifications

You can receive automated notifications about your Neon usage in any channel (public or private). First, subscribe to notifications using the steps in the section below. Once subscribed, the channel will receive automatic notifications when you approach or reach your resource limits for compute hours, storage, or data transfer.

### Subscribe to notifications in a channel

To receive Neon notifications in a Slack channel:

1. Go to any channel (public or private) where you want to receive notifications
2. Run `/neon subscribe` - you'll be prompted to run `/invite @Neon (Beta)` if needed
3. After inviting the bot, run `/neon subscribe` again

Once subscribed, the channel will start receiving important Neon usage notifications. To stop receiving notifications, use the `/neon unsubscribe` command in the same channel.

Use `/neon disconnect` to remove your Neon account connection and unsubscribe from all channels, while keeping the app installed for future use.

## Support

If you encounter any issues with the Neon App for Slack, please open a support ticket in the [Neon Console](https://console.neon.tech/app/projects?modal=support). Free plan users can get help through our [Discord community](https://discord.gg/92vNTzKDGp).

For more details about our support options, see our [Support documentation](/docs/introduction/support).

## FAQs

<details>
<summary>**What can I do with the Neon App for Slack?**</summary>

The Neon App for Slack allows you to:

- View project information and resource usage
- Monitor system status
- Manage notifications in channels
- Invite users to your organization

</details>

<details>
<summary>**Does this app allow me to modify databases or projects?**</summary>

No, the Neon App for Slack is primarily for viewing usage details and managing organization membership, not for direct database management.

</details>

<details>
<summary>**Can I control which notifications I receive?**</summary>

You can control where notifications are sent using the `/neon subscribe` and `/neon unsubscribe` commands in any channel. However, you cannot customize which types of notifications you receive — all subscribed channels will receive all important Neon updates and usage alerts.

</details>

---
title: Manage updates
enableTableOfContents: true
isDraft: false
updatedOn: '2024-12-13T21:17:10.768Z'
---

To keep your Postgres instances up to date with the latest patches and Neon features, Neon automatically updates your project's computes.

Updates require a compute restart, which takes only a few seconds, ensuring minimal disruption.

## What updates are included?

- Postgres minor version upgrades, typically released quarterly
- Security patches and fixes
- Neon enhancements and new features

## How often are updates applied?

Updates are usually applied weekly to active computes and computes started within the last 30 days.

Computes that haven’t been active for over 30 days or are in a transition state (e.g., shutting down or restarting) don’t receive updates immediately. Updates are applied the next time these computes restart.

## Can I schedule updates?

- **Free Plan:** Updates are scheduled and applied automatically by Neon.
- **Paid Plans:** You can set a preferred update time window, specifying the day of the week and hour. Restarts occur within this window.

## How to configure an update schedule

You can manage your project's update schedule in the settings:

1. Go to the Neon project dashboard.
2. Select **Settings** > **Updates**.
3. Choose a day of the week and an hour. Updates will occur within this time window and take only a few seconds.

<NeedHelp/>

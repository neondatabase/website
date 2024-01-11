---
title: Roadmap
redirectFrom:
  - /docs/cloud/roadmap
  - /docs/conceptual-guides/roadmap
  - /docs/reference/roadmap
updatedOn: '2023-10-07T10:43:33.416Z'
---
Our developers are focused on making Neon the default choice for serverless PostgreSQL. This roadmap describes committed features that are coming soon. We are as excited as you are to see new features in Neon, but their development, release, and timing are at our discretion. 

As always, we are listening. If you see something like, something you disagree with, or something you'd love for us to add, let us know. 

![placedholder form](/docs/introduction/roadmap_placeholder_form.png)

For the latest features and fixes, check our [Changelog](docs/changelog), updated every Friday. You can subscribe to updates using our [RSS feed](https://neon.tech/docs/changelog/rss.xml).


## In progress

Here's a snapshot of what we're working on now:

### Observability

* **Autoscaling visualizations**

    Adding dynamic charts, populated with real-time data, to help you visualize how autoscaling impacts CPU and RAM usage over time.

### Developer workflows

*  **Branch restore with Time Travel Assist**
   
    Instantly restore a branch to an earlier state in its history. Use Time Travel Assist to run queries against historical data, making sure you are restoring to the right point in time.

### Account management

* **Improved project sharing**

    We're making it easier to view who owns which projects when sharing projects with others. We're also improving how usage limits are handled between shared projects.
    
## Planned

And here's a glimpse at the features we'll be taking on next:

### More regions

Adding regional support for Australia.

### Account management

* **Organization support**

    We are adding features to support using Neon in your organization. Later, we'll add support for managing individual teams within the organization as well.

### Developer workflows

*  **Additional branch restore features**

    We'll also be adding more capabilities to branch restore, like restoring to another branch's history via timestamp or LSN, binary search to locate your LSN, and a schema comparison tool.
    
* **Improvements to Vercel integration**

    Adding support for GitHub and Bitbucket as part of the Vercel integration. Additionally, to ensure that users of the integration that access Neon from Vercel's serverless environment do not run out of connections, we're changing the database connection settings added to a Vercel project to pooled connections by default.

## A brief history of time

The Neon **Limited Preview** started in February 2022 and was made available to a small number of select users and friends.

On June 15th, 2022, the Neon team announced the [Technical Preview](#technical-preview), making Neon available to a wider audience. Thousands of users were able to try Neon's [Free Tier](/docs/introduction/free-tier).

On December 6th, 2022, Neon released its branching feature and dropped the invite gate, welcoming everyone to try Neon's Free Tier.

On March 15th, 2023, Neon launched paid plans, providing increased limits and added features, including _Project sharing_ and _Autoscaling_. For information about Neon's paid plans, refer to our [Pricing](https://neon.tech/pricing) page.


## Technical Preview

Neon sets a high standard for what constitutes a feature-complete product, meaning that all intended core functionality is implemented and operates as expected. While many features may be operational today, there may still be some that are under development or refinement. Neon will remain in Technical Preview while the remaining features are still being developed and perfected.

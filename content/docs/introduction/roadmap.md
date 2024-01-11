---
title: Roadmap
redirectFrom:
  - /docs/cloud/roadmap
  - /docs/conceptual-guides/roadmap
  - /docs/reference/roadmap
updatedOn: '2023-10-07T10:43:33.416Z'
---
Our developers are focused on making Neon the default choice for serverless PostgreSQL. This roadmap describes committed features that are coming soon.

We 

improvements that our development teams are finalizing right now, as well as the committed tasks our teams will take up next.

We are listening close and building product to meet what you are telling us. As always, if you see something you like, something you disagree with, or something you'd love for us to add, let us know. 

![placedholder form]()

## What's new

For the latest features and fixes, check our [Changelog](docs/changelog), updated every Friday. You can subscribe to updates using our [RSS feed](https://neon.tech/docs/changelog/rss.xml).

## What's coming

Here's a snapshot of what we're working on now:

* **Observability**

    We know you want better insight into what's happening with your database. New features to support better observability coming soon include:

    * **Autoscaling visualizations**

        Adding dynamic charts, populated with real-time data, to help you visualize how autoscaling impacts CPU and RAM usage over time.

* **Developer workflows**

   Our goal is to make managing your database infrastructure as seamless a part of your workflow as managing your source code. Upcoming features to support the developer experience include:

   *  **Branch restore with Time Travel Assist**
   
       Instantly restore a branch to an earlier state in its history. Use Time Travel Assist to run queries against historical data, making sure you are restoring to the right point in time.

    * **Additional branch restore features**

        We'll also be adding more capabilities to branch restore, like restoring to another branch's history via timestamp or LSN, binary search to locate your LSN, and a schema comparison tool.

    * **Improvements to Vercel integration**

         Adding support for GitHub and Bitbucket as part of the Vercel integration. Additionally, to ensure that users of the integration that access Neon from Vercel's serverless environment do not run out connections, we're changing the database connection settings added to a Vercel project to pooled connections by default.

* **Account management**

    * **Organization support**

        We are adding features to support using Neon in your organization. Later, we'll add support for managing individual teams within the organization as well.

    * **Improved project sharing**

        We're making it easier to view who owns which projects when sharing projects with others. We're also improving how usage limits are handled between shared projects.
    

```
//cut this content altogether? too small fry//

* **Better onboarding**

    Ongoing improvements to the onboarding experience are in the works. You can expect incremental updates in the upcoming weeks.

* **More integrations**

    We are adding new integrations all the time. We are also making ongoing improvements to the **Integrations** management page, to make it easier to add, manage, and request new integrations.

    See [Manage Integrations](/docs/manage/integrations) for more details.

* **Smoother email notifications**

   We are improving the notification flow for our recent addition of email-based authentication, which we added in [November 2023](docs/changelog/2023-11-02-console#email-authentication-support). 

* **Improved navigation in the Neon Console**

   New breadcrumbs, page headings, and other design changes are coming to the Neon Console, to help you better navigate your project and its branches.

* **Easier access to support**

    For Neon Pro Tier users, we are making it easier to get access to the support form in the Neon Console, from anywhere: our website, our docs, blog posts, or anywhere you find a link to support.


## What we're working on next

And here's a glimpse at the features we'll be taking on next:

* **More regions**

    Support for more regions will be released in the coming months. [Is this actually coming?]

* **Branching improvements**

    We're adding more features to support making branching an integral part of your development workflow. This will include features in the Neon Console, but also case studies and documentation to help you make the most out of Neon's instant branching capability. Other planned improvements include:

    * Showing the last active branch on the **Branches** page. This helps make it easier for you to clean up unused branches.

* **Various improvements to the Neon Console**

    We are always improving the usability of our Neon Console. Some upcoming improvements include:
    
    * Create branches directly from the connection window.
    * Allow self-service deletion of your user profile from Neon.
    * Support for switching a project to maintenance mode.
//end the section to cut out//
```

## A brief history of time

The Neon **Limited Preview** started in February 2022 and was made available to a small number of select users and friends.

On June 15th, 2022, the Neon team announced the [Technical Preview](#technical-preview), making Neon available to a wider audience. Thousands of users were able to try Neon's [Free Tier](/docs/introduction/free-tier).

On December 6th, 2022, Neon released its branching feature and dropped the invite gate, welcoming everyone to try Neon's Free Tier.

On March 15th, 2023, Neon launched paid plans, providing increased limits and added features, including _Project sharing_ and _Autoscaling_. For information about Neon's paid plans, refer to our [Pricing](https://neon.tech/pricing) page.


## Technical Preview

Neon sets a high standard for what constitutes a feature-complete product, meaning that all intended core functionality is implemented and operates as expected. While many features may be operational today, there may still be some that are under development or refinement. Neon will remain in Technical Preview while the remaining features are still being developed and perfected.

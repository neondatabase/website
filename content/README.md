# Documentation Sitemap Guide

This guide is a short reference for where and how information should fit into the documentation.
Top-level items are all categories that users need to be able to access at a glance. All navigation bar items should be sentence-cased, so words should be capitalized, except for articles like "a", "with" and "an". For choosing page names in general, if the page is focused on instructions name the page after the end-goal for example, `Run a SQLAlchemy app`. If a page is focused on a topic instead, lean towards fewer words and choose a term that best describes the content.

To aid navigation for users, Neon should enable the TOC in pages. This makes it easy for readers to see at a glance what a specific page contains, and makes for a better user experience for pages like the `Glossary` and the `Release Notes` because some readers are already looking for a specific heading.

Below is a guide to each nav bar item:

## Overview

This should include information necessary for users to start using Neon, currently including pages like `What is Neon` and other pages that get a user started using Neon. This item should include very basic important information that is necessary to use Neon. Lean towards brief pages in this category, longer pages can make onboarding users more challenging. The key subcategory here is `Get Started with Neon`, ideally this won't need additional pages unless Neon adds editor, authentication mechanism, or other interface that changes how users access the basic product.

## Integrations

This section is for the various Neon integrations, mostly split into two sections `Cloud Deployments` and `Frameworks and Programming Languages` based on common characteristics. Items that don't fit into existing sub-categories can be added as siblings to the existing categories. If a third subcategory is appropriate and has 3 or more pages to add to it, it would be a good idea to add a subcategory here. The length of these pages is determined by the number of steps needed to set up an integration, so it is okay if some pages are longer than others because an integration is more complex.

## How-to Guides

This section should have brief guides on how to accomplish specific goals, for example, `Importing an Existing Database`, `Connecting with Legacy Clients` and other specific goals should go here. Each page should be titled according to what the user will accomplish with the guide, ideally there shouldn't be any one-word titles for this section so that users can easily find a relevant guide. Numbered step-by-step instructions are helpful here whenever possible. When considering the length here, it's important to focus on the minimal number of steps to complete the task so users can get through a topic quickly.

## Reference

This should contain pages with specific technical information. This can mean definitions in the `Glossary`, the `Neon Roadmap`, or information about the limitations and capabilities of Neon. It can be challenging to decide whether pages with new Neon information fit best here, under `Conceptual Guides`, or under the `Glossary`. Rule-of-thumb should be if a paragraph is sufficient to describe a concept, put it in the `Glossary`, if you need a longer page with quantifiable information that users would want to look up, like the current version of third-party libraries, default parameters, or default size and speed limits they should go in a `Reference` page. More descriptive content, like how a feature works, should go under `Conceptual Guides`. Items under `Reference` should have a narrower scope than the `Conceptual Guides`.

The sidebar title `Neon Default Extensions` can potentially be renamed to `Postgres Extensions` because describing the extensions as belonging to Postgres is more accurate. This makes it more intuitive for users to understand that they can add additional extensions from Postgres rather than the extensions being a Neon feature. `Neon Default Parameters` on the other hand seems like the most helpful name for users, it makes it clear that these are settings from Neon, and the contents make it clear that these differ from the default Postgres settings.

Ideally there should be between 5-9 pages under this category. If the number of pages in this category is getting too large, they can be reduced by combining existing pages or moving new content into existing pages. Reference pages can be longer if necessary because they aren't a blocker to users successfully using Neon.

## Conceptual Guides

These should all be descriptions of Neon features and how they work. If Neon has a novel or unique approach to a common feature, that can also be described here. Pages in this section should be structured to cover a broad concept in a single page, with room for subheadings that dive into further detail.

## Security

This can be expanded to have more articles about how Neon handles security in the future, but the single page works well for now and if there isn't enough new content for an entire page additional content can still be added to the singular security page. Users reading this section are unlikely to be put off by longer articles, they are seeking additional information so longer pages are not much of a concern here.

## Release Notes

While it is ideal for all top-level items to have multiple sub-items that fall under them, this section is an exception. A single release notes page is easier to maintain long-term and easier to find here rather than under the `Reference` item. The TOC would be very useful here, making the `Release Notes` much easier to navigate quickly and effectively.

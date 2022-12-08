# Documentation Sitemap Guide

This guide is a short reference for where and how information should fit into the documentation.
Top-level items are all categories that users need to be able to access at a glance. All navigation bar items should be sentence-cased. Only first words should be capitalized. For choosing page names in general, if the page is task or procedure focused, the title should start with a verb; for example: `Connect with psql`. If a page is focused on a concept, used a noun or noun-based phrase. For example: `Compute lifecyle`.

To aid navigation for users, Neon should enable the TOC in pages. This makes it easy for readers to see at a glance what a specific page contains, and makes for a better user experience.

Below is a guide to each item in the Neon documentation sidebar:

## Introduction

This section should provide introductory material to help introduce users to Neon's key benefits, architecture, Neon's roadmap, tier limits, supported regions, and so on.

## Get started

This section should include information necessary for users to start using Neon. Lean towards brief pages in this category, as longer pages can make onboarding more challenging.

## Connect

This section includes topic about connecting to Neon from clients and applications.

## Manage

These section describes objects in the Neon hierarchy such as API keys, projects, branches, endpoints, users, and databases. It describes each object, how they are related, and how to create and mange them. Pages in this section should be structured to cover a broad topic in a single page, with subheadings that organize the content into a consistent, somewhat predictable structure.

## Guides

This section is for the various languages, frameworks, an cloud integrations that Neon supports. Items that don't fit into existing sub-categories can be added as siblings to the existing categories. The length of these pages is determined by the number of steps needed, so it is okay if some pages are longer than others because one guide is more complex than another.

## Import Data

This section should provide instructions for how to import data into Neon. Each page should be titled according to what the user will accomplish.

## Reference

This should contain pages with specific technical information. This can mean definitions in the `Glossary`, the `Neon Roadmap`, or information about the limitations and capabilities of Neon. It can be challenging to decide whether pages with new Neon information fit best here, under `Conceptual Guides`, or under the `Glossary`. Rule-of-thumb should be if a paragraph is sufficient to describe a concept, put it in the `Glossary`, if you need a longer page with quantifiable information that users would want to look up, like the current version of third-party libraries, default parameters, or default size and speed limits they should go in a `Reference` page. More descriptive content, like how a feature works, should go under `Conceptual Guides`. Items under `Reference` should have a narrower scope than the `Conceptual Guides`.

The sidebar title `Neon Default Extensions` can potentially be renamed to `Postgres Extensions` because describing the extensions as belonging to Postgres is more accurate. This makes it more intuitive for users to understand that they can add additional extensions from Postgres rather than the extensions being a Neon feature. `Neon Default Parameters` on the other hand seems like the most helpful name for users, it makes it clear that these are settings from Neon, and the contents make it clear that these differ from the default Postgres settings.

Ideally there should be between 5-9 pages under this category. If the number of pages in this category is getting too large, they can be reduced by combining existing pages or moving new content into existing pages. Reference pages can be longer if necessary because they aren't a blocker to users successfully using Neon.

## Security

This can be expanded to have more articles about how Neon handles security in the future, but the single page works well for now and if there isn't enough new content for an entire page additional content can still be added to the singular security page. Users reading this section are unlikely to be put off by longer articles, they are seeking additional information so longer pages are not much of a concern here.

## Release Notes

While it is ideal for all top-level items to have multiple sub-items that fall under them, this section is an exception. A single release notes page is easier to maintain long-term and easier to find here rather than under the `Reference` item. The TOC is useful here, making the `Release Notes` much easier to navigate quickly and effectively.

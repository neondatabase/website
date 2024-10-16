# Documentation Sitemap Guide

This guide is a reference for where information should be placed in the documentation.
Top-level items are categories that enable users to access the information they need at a glance. For example, if users need information about connecting, they can select the **Connect** category. Sidebar items should be sentence-cased. Only capitalize first words. When choosing page names, the title should start with a verb for procedure or task-based content; for example: `Connect with psql`. If the page describes a concept, use a noun or noun-based phrase. For example: `Compute lifecycle`.

To aid navigation, enable the TOC in pages to make it easy for readers to see what a page contains.

The following information provide guidance for each item in the Neon documentation sidebar.

## Introduction

This section provides introductory, high-level content that introduces users to Neon's key benefits, architecture, roadmap, tier scheme, region support, and so on.

## Get started

This section provides information that helps users to start using Neon. Lean towards brief pages in this category, as longer pages can make onboarding more challenging.

## Connect

This section provides information about connecting to Neon from various clients and applications.

## Manage

This section describes objects in the Neon hierarchy, such as API keys, projects, branches, endpoints, users, and databases. It explains how objects are related and how to create and manage them. Structure pages in this section to cover a broad topic, with subheadings that organize the content in a consistent and predictable way. For example, include "Create", "Update", and "Delete" topics in each page.

## Guides

This section is for various languages, frameworks, and integrations that Neon supports. The length of these pages determines the number of steps needed, so it is okay that some pages are longer than others, as one setup or integration may be more complex than another. This section may also include guides that are not language or framework-specific. For example, it could contain guides pertaining to particular Neon features. Such content will be considered on a case-by-case basis.

## Migrate to Neon

This section provides instructions for how to import data into Neon. Currently, it includes instructions for migrating from Postgres and other vendors. It can be expanded to include other data import methods and migrations.

## Reference

This section contains reference information such as the glossary, API reference, CLI reference, supported Postgres extensions, and Postgres compatibility information.

## Security

This section describes how Neon handles security.

## Changelog

This section describes the latest features and fixes from Neon. Changelog is categorized as either "Console" or "Storage". Within each category, changelog is organized under "What's new" and "Bug fixes" subcategories. Subcategories are further classified with tags. For example, each Console release note is tagged as "API", "Control Plane", "Integrations", or "UI". Storage changelog is tagged as "Compute", "Pageserver", "Proxy", or "Safekeeper". Write changelog from the user's perspective. Give context. Describe why each feature was introduced and the issue that a bug fix resolves. Provide links to the documentation or website for more details where applicable. Changelog should tell the story of Neon's development journey.

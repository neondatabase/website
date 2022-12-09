# Documentation Sitemap Guide

This guide is a reference for where and how information should fit into the documentation.
Top-level items are categories that enable users to access the information they need at a glance. For example, if users need information about connecting, they can select the "Connect" category. Sidebar items should be sentence-cased. Only capitalize first words. When choosing page names, if the page is procedure-focused, the title should start with a verb; for example: `Connect with psql`. If the page describes a concept, use a noun or noun-based phrase. For example: `Compute lifecycle`.

To aid navigation, enable the TOC in pages to make it easy for readers to see what a page contains.

Below is a guide to each item in the Neon documentation sidebar:

## Introduction

This section should provide introductory, high-level material to help introduce users to Neon's key benefits, architecture, roadmap, tier scheme, region support, and so on.

## Get started

This section should include information that helps users to start using Neon. Lean towards brief pages in this category, as longer pages can make onboarding more challenging.

## Connect

This section provides information about connecting to Neon from various clients and applications.

## Manage

This section describes objects in the Neon hierarchy, such as API keys, projects, branches, endpoints, users, and databases. It explains how the objects are related and how to create and manage them. Structure pages in this section to cover a broad topic, with subheadings that organize the content in a consistent and predictable way. For example, include "Create", "Update", and "Delete" topics in each page.

## Guides

This section is for various languages, frameworks, and integrations that Neon supports. The length of these pages determines the number of steps needed, so it is okay if some pages are longer than others because one setup or integration may be more complex than another. This section may also contain guides that are not language or framework-specific.

## Import Data

This section provides instructions for how to import data into Neon. Currently, it includes instructions for importing from Postgres using `psql` and importing data from other vendors. It can be expanded to include other data import methods and migrations.

## Reference

This section contains reference information such as the glossary, API, and CLI reference.

## Security

This section describes how Neon handles security.

## Release Notes

This section describes the latest features and fixes from Neon. Release notes are categorized as either "Console" or "Storage". Within each category, release notes are organized under "What's new" and "Bug fixes" subcategories, and they are further classified with tags. For example, each Console release note is tagged as "API", "Control Plane", "Integrations", or "UI". Storage release notes are tagged as "Compute", "Pageserver", "Proxy", or "Safekeeper". Always write release notes from the user's perspective. Give context. Describe why each feature was introduced and the issue that a bug fix resolves. Provide links to the documentation or website for more details where applicable. Release notes should tell the story of Neon's development journey.

---
title: 'Neon CLI command: docs'
tag: new
tagTheme: green
subtitle: 'Search the Neon docs, guides, and more from the terminal'
summary: >-
  The Neon CLI `docs` command searches neon.com from your terminal: the docs, API
  reference, PostgreSQL tutorial, guides, FAQs, changelog, and blog. It needs no
  login; use `--category` to narrow results and `--output json` for
  machine-readable output when scripting or calling it from an agent.
enableTableOfContents: true
---

The `docs` command searches neon.com and prints matching pages in your terminal. It covers the docs, API reference, PostgreSQL tutorial, guides, FAQs, changelog, and blog. No login is required, and it doesn't touch your projects or account. To get a written answer instead of a list of pages, use [`neon ask`](/docs/cli/ask).

<CliSubcommands command="docs" />

## neon docs search (#search)

Searches neon.com and lists the matching pages.

<CliUsage command="docs search" />

<CliOptions command="docs search" />

The default table shows each result's page title, the section that matched, and the page URL. The section is blank when the matching heading is the page title. `--output json` and `--output yaml` also include each result's `category`, `breadcrumb`, and a short `excerpt` of the matching text.

To search more than one category, repeat `--category`.

Search for a topic:

```bash
neon docs search "reset a branch"
```

Search only the API reference and the docs, and return the top three results:

```bash
neon docs search "create branch" --category api --category docs --limit 3
```

```text
Title                       Heading                                                     URL
Manage branches             Branching with the Neon API > Create a branch with the API  https://neon.com/docs/manage/branches
Neon CLI command: branches  neon branches create                                        https://neon.com/docs/cli/branches
Neon CLI quickstart         Common operations > Create a branch                         https://neon.com/docs/cli/quickstart
```

Get results as JSON so you can process them in a script:

```bash
neon docs search "reset a branch" --limit 2 --output json
```

<details>
<summary>Show output</summary>

```json
[
  {
    "title": "Manage branches",
    "url": "https://neon.com/docs/manage/branches",
    "category": "docs",
    "breadcrumb": ["Docs", "Manage & operate", "Projects & resources"],
    "heading": "Manage branches > Reset a branch from parent",
    "excerpt": "You can use Neon's Reset from parent feature to instantly update a branch with the latest schema and data from its parent. This feature can be an integral part of your CI/CD automation. You can use the Neon Console, CLI, or API. For details, see Reset from parent."
  },
  {
    "title": "Branching with the Neon CLI",
    "url": "https://neon.com/docs/guides/branching-neon-cli",
    "category": "docs",
    "breadcrumb": ["Docs", "Postgres", "Branching", "Automate & workflows"],
    "heading": "Branching with the Neon CLI > Resetting a branch from its parent",
    "excerpt": "Depending on your development workflow, you might need to periodically reset a branch to match the latest state of its parent. This is useful, for example, when resetting a development branch back to the production branch before starting work on a new feature. Use the followin..."
  }
]
```

</details>

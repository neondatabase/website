---
description: 'Create a new Neon weekly changelog file for the next Friday (or a specific date). Produces a draft with placeholder content and titled dropdown sections.'
---

# Create Changelog

Generate a new Neon weekly changelog file. By default, targets the next upcoming Friday in the America/New_York timezone.

**Output path:** `content/changelog/YYYY-MM-DD.md`

## Date logic

- Use the IANA timezone **America/New_York** (or a timezone the user specifies).
- Compute the **next upcoming Friday** from the current date in that timezone.
- If today is Friday, target **next week's Friday**.
- Format the date as `YYYY-MM-DD`.

To target a specific date, the user can say "create changelog for 2026-05-02" or similar. Validate the date and use it as-is.

## Before creating

If the target file already exists at `content/changelog/YYYY-MM-DD.md`, **stop** and report that the file exists. Do not overwrite.

## File template

Create the file with this shape. Use placeholder content (Lorem ipsum) for feature descriptions. Do not invent specific features or real content.

```markdown
---
title: [Concise main theme of the release]
---

## New feature

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Another feature

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Third feature

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

<details>
<summary>**Neon API**</summary>

- [Short bullet describing an API change or improvement.]

</details>

<details>
<summary>**Console**</summary>

- [Short bullet describing a console or UI change.]

</details>
```

## Content guidelines

- Friendly, concise, user-focused tone.
- Sentence-style capitalization for headings.
- Feature headings communicate user value, not internal names.
- Each feature description: 1-3 sentences.
- **Dropdown sections:** After the main `##` feature sections, include one or more `<details>` blocks with **descriptive titles** that group fixes or improvements by product area (e.g. **Neon API**, **Console**, **Tables page**). Use multiple titled dropdowns, not a single "Fixes & improvements" section.
- Leave all feature content as Lorem ipsum placeholders. The author fills in real content after the file is created.

## Recurring entries: infrastructure and region updates

Some PRs recur often and don't need a full feature write-up. The most common is a **new-cell or region turn-up** that adds NAT gateway IP addresses and Private Networking VPC endpoint services (updates to `content/docs/introduction/regions.md` and `content/docs/guides/neon-private-networking.md`).

The standing explanation and the instructions for updating an allowlist live in the docs (the **NAT Gateway IP addresses** section in `regions.md` and the Private Networking guide). So the changelog entry should be a single minimal bullet inside a titled `<details>` block, not a full `##` section:

```md
<details>
<summary>**Regions and networking**</summary>

- Added NAT gateway IP addresses and Private Networking VPC endpoint service names in AWS US East (Ohio) (`us-east-2`). If you allowlist Neon's outbound IPs, add the new addresses from the [Regions](/docs/introduction/regions#nat-gateway-ip-addresses) page, or outbound connections can fail intermittently. If you use Private Networking in this region, add the new service names from the [Private Networking guide](/docs/guides/neon-private-networking).

</details>
```

When you write one of these entries, also update the IP and endpoint tables in `regions.md` and `neon-private-networking.md`, and bump the "NAT gateway IP lists last updated" date in `regions.md`. Keep the changelog bullet to one line; the docs carry the detail.

## After creating

Report:

- The target date and file path
- A checklist of `[placeholder]` items still needing real content

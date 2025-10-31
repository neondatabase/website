---
description: 'Edit and improve the intro paragraph of a documentation page'
---

Load content style guidelines from Neon documentation standards (reference `/golden-corpus` for examples).

**Your task:** Improve the introductory section (first paragraph under H1) of the provided documentation page.

## Analysis Steps

1. **Read the entire page** to understand:

   - What the feature/topic is
   - What the page covers
   - The page structure (H2 sections, steps, reference material, etc.)
   - Target audience and use case

2. **Evaluate the current intro:**
   - Does it clearly explain what this page is about?
   - Does it provide context for why users would read this?
   - Does it preview the content covered?

## Intro Requirements

The improved intro should:

1. **Lead with purpose** - Start with what this page helps users accomplish or what feature it documents
2. **Be concise** - 2-4 sentences maximum unless ToC/outline is needed
3. **Set expectations** - Briefly mention what content is covered
4. **Use active voice** - Follow Neon style conventions (developer-friendly, clear, concise)
5. **State prerequisites** - If there are prereqs required, state them first

## Content-Specific Adaptations

### For pages with many disconnected H2 sections:

Add a **mini table of contents** before the intro paragraph using this format:

```markdown
This page covers:

- [Section name](#anchor-link)
- [Section name](#anchor-link)
- [Section name](#anchor-link)
```

**When to include ToC:**

- 4+ H2 sections that cover different topics (not sequential steps)
- Sections are conceptually independent (users might jump to specific sections)
- Page serves as a reference hub

### For step-by-step procedural pages:

Create a **brief outline** summarizing the workflow:

```markdown
To [accomplish goal], you will:

1. [High-level summary of first step/phase]
2. [High-level summary of second step/phase]
3. [High-level summary of third step/phase]
```

**When to include outline:**

- Page follows numbered steps or clear sequential phases
- Multi-step tutorial or configuration guide
- Steps build on each other

### For conceptual/reference pages:

Focus on:

- What the concept is
- Why it matters
- What aspects are covered in this page

### For hub/landing pages:

Provide a brief summary of the topic or feature. State that this page acts as a hub for this topic, with the most relevant pages listed below using DetailIconCards or links.

## Output Format

Provide:

1. **Analysis**: Brief explanation of the page type and structure
2. **Recommendation**: ToC, outline, or neither?
3. **Improved intro**: The complete replacement text in markdown

## Example Output

**Analysis:** This is a procedural guide for setting up external locations. The page has 4 sequential H2 sections covering prerequisites, creation, configuration, and validation.

**Recommendation:** Include a brief workflow outline since this is a multi-step setup process.

**Improved intro:**

```markdown
An external location is a Unity Catalog object that contains a reference to a storage credential and a cloud storage path. This article explains how to create and configure external locations for accessing data in cloud storage.

To set up an external location, you will:

1. Verify prerequisites and required permissions
2. Create the external location using Catalog Explorer or SQL
3. Configure access permissions for users and groups
4. Validate connectivity and access

See [What is Unity Catalog?](../unity-catalog/index.md) for more information about Unity Catalog objects.
```

## Important Notes

- **Preserve existing links** - Keep any cross-references or related links from the original intro
- **Match the page's depth** - Don't oversimplify complex topics or overcomplicate simple ones
- **Follow frontmatter conventions** - Intro should align with the page's subtitle/description metadata
- **Consider context** - If this is part of a larger workflow, mention where it fits
- **Follow Neon style** - Developer-friendly, practical, clear, and concise (reference `/golden-corpus` for examples)

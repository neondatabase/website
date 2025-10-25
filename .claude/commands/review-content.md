---
description: 'Comprehensive content review using Neon documentation standards and style guide'
---

Load Neon documentation standards from CLAUDE.md and reference the golden corpus.

**Load golden corpus examples:**

- Use `/golden-corpus` slash command to load appropriate examples for the content type.

**Present examples:** "I'll use [content type] style based on [example file]."

Review the provided content for:

1. **Style Guide Compliance**: Apply Neon style guide rules including grammar, terminology, and developer-friendly voice
2. **Documentation Standards**: Verify adherence to MDX formatting, component usage, and structure requirements
3. **Content Quality**: Check for clarity, accuracy, and consistency with existing Neon documentation
4. **Technical Accuracy**: Validate technical information and Neon product terminology

Provide specific feedback with line references where possible, and suggest concrete improvements for any issues found.

Focus on:

- Active voice and present tense usage
- Developer-friendly, clear, concise writing
- Neon product terminology (Neon, Serverless Postgres, compute, branch, project)
- Proper MDX component usage (Admonition, CodeTabs, InfoBlock, etc.)
- Heading hierarchy (max H3 depth, no H4+)
- Required frontmatter (title, subtitle, enableTableOfContents)
- Code examples with proper language tags
- Internal links using relative paths
- Related documentation links and cross-references

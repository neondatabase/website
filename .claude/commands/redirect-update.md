---
description: 'Update redirects when moving or renaming documentation files'
---

# Redirect Update Workflow

When moving or renaming documentation files in the Neon documentation, you must add redirects to prevent broken links.

## Neon Redirect System

**Neon uses frontmatter redirects** - redirects are defined directly in the markdown file's frontmatter using the `redirectFrom` field.

### Adding redirects to frontmatter

When you move or rename a file, add the old path(s) to the `redirectFrom` array in the **new file location**:

```yaml
---
title: 'Page Title'
subtitle: 'Page description'
redirectFrom:
  - /docs/old-section/old-name
  - /docs/another-old-path/same-page
enableTableOfContents: true
---
```

**Rules:**
- Add `redirectFrom` to the **destination file** (the new location)
- Use array format (even for single redirect)
- Use relative paths starting with `/docs/`
- Include all previous paths if the file has been moved multiple times

## Complete Workflow

1. **Move or rename the file**
   - Move file to new location or rename it
   - Example: `content/docs/old-section/page.md` → `content/docs/new-section/page.md`

2. **Add redirect to frontmatter**
   - Open the file at its **new location**
   - Add `redirectFrom` field with the old path(s)
   - Use array syntax: `redirectFrom: ['/docs/old-section/page']`

3. **Find and update all cross-references**
   - Search for references: `rg "old-name" content/ --type md`
   - Update internal links to point to new locations
   - Use relative paths: `/docs/new-section/page`

4. **Update navigation if needed**
   - Check `content/docs/navigation.yaml` for references to the old path
   - Update file paths in navigation entries

5. **Update hub/landing pages**
   - Search for links in hub pages that might reference the moved content
   - Update DetailIconCards, DocsList, or other navigation components

## Cross-Reference Management

### Search for existing references

Before making changes, always search comprehensively:

```bash
# Search in documentation content
rg "old-filename" content/ --type md

# Search in navigation
rg "old-filename" content/docs/navigation.yaml

# Search for URL patterns
rg "/old-section/page" content/ --type md
```

### Update link formats

Ensure consistent link formats:
- Internal links: `/docs/guides/nextjs`
- Not: `https://neon.tech/docs/guides/nextjs`
- Verify anchor links still exist in target files

## Examples

### Example 1: Moving a guide to a different section

**Before:**
- File: `content/docs/connect/connection-strings.md`
- URL: `/docs/connect/connection-strings`

**After:**
- File: `content/docs/guides/connection-strings.md`
- URL: `/docs/guides/connection-strings`

**Add to frontmatter of `content/docs/guides/connection-strings.md`:**
```yaml
---
title: 'Connection Strings'
subtitle: 'Learn about Neon connection strings'
redirectFrom:
  - /docs/connect/connection-strings
enableTableOfContents: true
---
```

### Example 2: Renaming a page

**Before:**
- File: `content/docs/guides/neon-authorize.md`
- URL: `/docs/guides/neon-authorize`

**After:**
- File: `content/docs/guides/neon-rls.md`
- URL: `/docs/guides/neon-rls`

**Add to frontmatter of `content/docs/guides/neon-rls.md`:**
```yaml
---
title: 'Neon RLS'
subtitle: 'Row-Level Security with Neon'
redirectFrom:
  - /docs/guides/neon-authorize
enableTableOfContents: true
---
```

### Example 3: Multiple moves (keep history)

If a page has been moved multiple times, keep all old paths:

```yaml
---
title: 'Autoscaling'
subtitle: 'Configure autoscaling for your compute'
redirectFrom:
  - /docs/conceptual-guides/autoscaling
  - /docs/introduction/autoscaling
  - /docs/manage/compute-autoscaling
enableTableOfContents: true
---
```

### Example 4: Consolidating multiple pages

When merging multiple pages into one, add all old paths:

```yaml
---
title: 'Neon CLI Reference'
subtitle: 'Complete reference for the Neon CLI'
redirectFrom:
  - /docs/reference/neon-cli
  - /docs/reference/cli-reference
  - /docs/reference/cli-commands
enableTableOfContents: true
---
```

## Update daisy-chained redirects

**IMPORTANT**: If you're moving a file that already has `redirectFrom` entries, preserve those entries in the new location.

**Example:**

Original file `content/docs/old-section/page.md` has:
```yaml
redirectFrom:
  - /docs/very-old-section/page
```

When moving to `content/docs/new-section/page.md`, keep the old redirects AND add the current location:
```yaml
redirectFrom:
  - /docs/very-old-section/page
  - /docs/old-section/page
```

This prevents redirect chains and ensures all historical URLs work.

## Validation Checklist

- [ ] `redirectFrom` added to frontmatter of file at **new location**
- [ ] All previous paths included in `redirectFrom` array (check if file already had redirects)
- [ ] All cross-references in `.md`/`.mdx` files updated to new path
- [ ] Navigation yaml updated if needed
- [ ] Hub/landing pages updated if they link to moved content
- [ ] Links use relative paths (not absolute URLs)
- [ ] Anchor links verified in target files

## Common Patterns

### Moving a guide to a different section

1. Move file: `content/docs/old-section/guide.md` → `content/docs/new-section/guide.md`
2. Add to frontmatter at new location: `redirectFrom: ['/docs/old-section/guide']`
3. Update navigation.yaml entry
4. Search and update all internal links

### Renaming a page

1. Rename file: `old-name.md` → `new-name.md`
2. Add to frontmatter: `redirectFrom: ['/docs/section/old-name']`
3. Update navigation.yaml
4. Update all internal links

### Consolidating multiple pages

1. Merge content into target page
2. Add all old paths to `redirectFrom` in target page
3. Remove old files
4. Update navigation to remove old entries
5. Update internal links

## Next.js Build Integration

Neon's build process automatically generates Next.js redirects from the `redirectFrom` frontmatter fields. You don't need to manually edit `next.config.js` for documentation redirects.

---

**This prevents broken links in production and maintains documentation integrity across all pages.**

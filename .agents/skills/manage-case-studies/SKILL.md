---
name: manage-case-studies
description: Safely add, edit, reorder, promote, or remove case studies on the Neon website. Use whenever a request changes a case-study company, including short requests that name only the company and ask to update its logo or link, change its category or order, replace a hero card, edit a testimonial, remove it, or update related /use-cases references.
---

# Manage Case Studies

Work from the repository root. Preserve unrelated changes. Treat the logo grid, hero cards, and testimonials as separate surfaces.

## 1. Inspect before changing

Read only the files relevant to the requested surface:

- Grid data: `content/data/case-studies.yaml`
- Category definitions: `content/data/case-study-categories.yaml`
- Data mapping: `src/utils/api-local-data.js`
- Grid behavior: `src/components/pages/case-studies/cards/cards.jsx`
- Hero cards: `src/components/pages/case-studies/hero/hero.jsx`
- Testimonials: `src/components/pages/case-studies/testimonials/testimonials.jsx`
- Cross-page references: `content/data/use-cases.yaml`
- Schema validation: `scripts/validate-content-data.js` and `scripts/validate-case-studies.js`
- Logos: `public/images/case-studies/`

Use `rg` to find the case-study ID, title, blog slug, URL, and logo path across the repository before editing or deleting anything. Do not treat the independently hardcoded `/enterprise` case-studies block as part of this page.

## 2. Gate required input

Identify the operation and target surface. A plain “add a case study” request means add one grid card only. Promote it to the hero or testimonials only when explicitly requested.

Before adding a grid card, require:

- Company display title and a unique lowercase kebab-case ID. Derive the ID only when unambiguous.
- An actual `.svg` file supplied by the user. Do not invent, trace, download, or rasterize a logo unless explicitly asked.
- Exactly one destination type:
  - Internal: an existing `content/blog/posts/<slug>.md` or `.mdx` file.
  - External: a complete HTTPS URL.
- At least one category slug from `content/data/case-study-categories.yaml`.
- Requested placement. Prepend the entry when no placement is specified because YAML order is display order.

Allow an empty quote and author for a grid-only card. Require a quote and author name for a testimonial or a case study referenced by `content/data/use-cases.yaml`. Treat the author role as optional unless the user supplies or explicitly requests it. Never invent customer quotes, attribution, roles, metrics, or destination URLs. Ask only for missing blocking data.

Before replacing a logo, require a newly supplied `.svg` and inspect every reference to the current asset. Do not overwrite a shared logo unless that scope is explicit.

For a hero card, additionally require the card position or card to replace, category label, display quote/title, author line, and destination. Keep two cards unless the user explicitly requests a layout change. Reuse the existing background assigned to that position unless a new supplied background is part of the request.

For a testimonial, additionally require a unique numeric order and a logo that remains legible on the light testimonial background. Reuse the primary logo only when it is already suitable. Otherwise stop and require a separate user-supplied SVG; never recolor, edit, or synthesize an alternate logo. Do not change shared JSX, CSS, filters, or rendering to compensate for an unsuitable logo unless the user explicitly requests a design change.

## 3. Apply the operation

### Add a grid card

Copy the supplied SVG without altering its artwork to `public/images/case-studies/<id>.svg`. Record positive intrinsic dimensions that preserve its aspect ratio.

Add this complete shape to `content/data/case-studies.yaml`:

```yaml
- id: '<id>'
  title: '<display title>'
  isFeatured: false
  logo:
    mediaItemUrl: '/images/case-studies/<id>.svg'
    mediaDetails:
      width: <positive number>
      height: <positive number>
  quote: ''
  author:
    name: ''
    post: ''
  isInternal: true
  internalPostSlug: '<existing blog slug>'
  externalUrl: ''
  categories:
    - slug: '<canonical slug>'
      name: '<canonical name>'
```

For an external case study, set `isInternal: false`, clear `internalPostSlug`, and set `externalUrl`. Keep `isFeatured`; the repository validator requires it, but it does not control the current hero or grid layout.

### Edit or reorder

Keep the ID stable unless renaming it is explicitly required. When changing link type, populate the selected destination and clear the other one. When changing a category, copy both slug and name exactly from the category definition file. Move the entire YAML entry to reorder it.

Search for duplicated hero copy and `/use-cases` references and update them only when they are in scope. The hero does not read the YAML automatically.

### Add or edit a testimonial

Add to the same YAML entry:

```yaml
  caseStudiesPage:
    testimonialOrder: <unique number>
    testimonialLogo:
      mediaItemUrl: '/images/case-studies/<alternate-logo>.svg'
      mediaDetails:
        width: <positive number>
        height: <positive number>
```

Omit `testimonialLogo` to fall back to the primary logo. Add `testimonialLogo` only for an existing or user-supplied asset, never for an agent-created derivative. Keep an ordinary testimonial add, edit, or removal YAML-only. Testimonials are selected and sorted only by `testimonialOrder`; `isFeatured` has no effect. Restrict trusted inline quote markup to the patterns already used by the file, such as `<mark>`.

To remove only a testimonial, remove its `caseStudiesPage` block and keep the grid entry.

### Add or edit a hero card

Edit `CARDS` in `src/components/pages/case-studies/hero/hero.jsx`. Supply `logo`, `category`, trusted `title` HTML, `author`, `linkText`, `linkUrl`, and the position’s background. Use `titleTheme: 'large'` only when the larger treatment fits. A hero edit does not require changing the YAML unless the grid card is also in scope.

To remove only a hero card, replace or remove its `CARDS` entry as requested; do not alter the YAML implicitly.

### Remove

Search first for the ID, logo path, and destination. If `content/data/use-cases.yaml` references the ID, require a replacement case study or explicit removal of that use-case dependency. If the item appears in the hero, clarify whether the hero card must also be replaced; deleting the YAML entry does not remove it.

Remove the YAML entry. This also removes its testimonial. Do not delete its blog post, external resource, logo, or `/enterprise` content unless explicitly requested. Delete an SVG only after proving with `rg` that no reference remains.

### Change categories

Treat category slugs as public URL fragments such as `/case-studies#ai`. Preserve slugs unless the user explicitly accepts broken or migrated inbound links. Update all case-study memberships before removing a category. Never add the synthetic `all` category to YAML.

## 4. Validate and report

Run from the repository root after every operation:

```bash
node scripts/validate-case-studies.js
```

For an added or edited grid entry, also target the stricter checks:

```bash
node scripts/validate-case-studies.js --id <id>
```

The script includes the repository schema validator and adds asset, URL, blog-file, category-name, testimonial-order, and cross-page checks. Do not claim validation passed if dependencies are unavailable; report the blocker.

If JSX changed, run ESLint on the changed component. Always run `git diff --check`, inspect the final diff, and confirm that no unrelated files changed. Report the surfaces changed, destination tested, validation commands, and any intentionally retained assets or content.

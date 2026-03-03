# Case Studies Page — Adaptive Implementation Context

> **Temporary file.** Created to carry context between chat sessions.
> Safe to delete once the adaptive work on the Case Studies page is complete.

## Project Stack & Breakpoint System

- Next.js 14 + Tailwind CSS, desktop-first strategy (max-width breakpoints)
- Breakpoints (strictly from `tailwind.config.js`):

| Token | Max-width |
|-------|-----------|
| 3xl   | 1919px    |
| 2xl   | 1599px    |
| xl    | 1279px    |
| lt    | 1127px    |
| lg    | 1023px    |
| md    | 767px     |
| sm    | 639px     |
| xs    | 413px     |

- No mobile-first, no custom breakpoints, no runtime JS for adaptive.
- Reference branch for adaptive patterns: `blog-update-adaptives` (local).

## Files Modified

| File | What changed |
|------|-------------|
| `next.config.js` (line ~641) | rive.wasm webpack rule: replaced `filePath.split('/')` with `/rive\.wasm$/` regex for Windows compatibility |
| `src/components/pages/case-studies/hero/hero.jsx` | Hero section adaptive |
| `src/components/pages/case-studies/testimonials/testimonials.jsx` | Testimonials section adaptive |
| `src/components/pages/case-studies/cards/cards.jsx` | Cards section adaptive (most changes) |

## Section-by-Section Breakdown

---

### 1. Hero Section (`hero.jsx`)

**Page component:** `src/app/case-studies/page.jsx`
**Container:** `size="branching"` → `max-w-[1216px]`

#### Section padding
```
py-40  xl:py-36  lg:py-20  md:py-14  sm:py-10
```

#### H1 title — font size scale
```
desktop: 56px (text-[3.5rem])  →  lg: 48px  →  md: 40px  →  sm: 32px
```
- No xl or lt intermediate steps.

#### Title container max-width
```
max-w-[896px]  lt:max-w-[760px]
```

#### Featured cards (2-col grid)
- Grid: `grid-cols-2 gap-8 lg:gap-6 md:grid-cols-1 md:gap-6`
- Card height: `h-[408px] sm:h-[340px]`
- Card inner padding: `p-8 sm:p-6`
- Card title: `text-[28px] sm:text-2xl`

---

### 2. Testimonials Section (`testimonials.jsx`)

**Container:** `size="1280"`

#### Section padding
```
py-40  xl:py-20  lg:py-16  md:py-14
```

#### H2 font size scale
```
48px  →  xl: 40px  →  lt: 36px  →  lg: 32px  →  md: 24px (text-2xl)
```

#### Critical fix: card stacking
- Testimonial cards were in a horizontal flex row with no wrapping — overflowed on mobile.
- Added `md:flex-col md:gap-8` to the cards container.
- Each TestimonialCard: `md:h-auto md:max-w-none md:first:max-w-none md:pl-0`
- Author info: `md:mt-6` (replaces `mt-auto` which had no effect with `h-auto`)

#### Decorative elements hidden on mobile
- Background SVG: `md:hidden`
- Container left border line (`before:` pseudo): `md:before:hidden`

---

### 3. Cards Section (`cards.jsx`) — Most Complex

**Container:** `size="1280"`, className includes `lg:!max-w-[1216px] md:px-5`

#### H2 "See how teams are building…" — font size scale
```
desktop: 48px  →  lg: 40px  →  md: 32px  →  sm: 28px
```
- `max-w-[736px]` on desktop; `lg:max-w-[614px]` (proportional, preserves same line break); `md:max-w-none md:flex-1`
- No `<br>` tags — relies on natural word wrapping.

#### Search bar — two instances, one shared state
Both use the same `searchQuery` / `setSearchQuery` state.

| Instance | Location | Visibility |
|----------|----------|-----------|
| **Header search** | Next to H2 in a flex wrapper | `hidden md:flex` (shown at ≤767px) |
| **Sidebar search** | Inside `<aside>` | Shown by default, `md:hidden` |

**Header search wrapper** (around H2 + search):
```
md:flex md:items-end md:gap-6  sm:flex-col sm:items-stretch sm:gap-5
```
- At md (≤767px): flex-row, search 280px on the right, bottom-aligned with title.
- At sm (≤639px): flex-col, search full-width below the title.

#### Sidebar layout — 3 states

| Breakpoint | Layout |
|-----------|--------|
| Desktop–lt | Vertical sidebar (w-64) on the left of the grid |
| lg (≤1023px) | Sidebar above grid. `flex-row-reverse`: categories (scrollable, left) + search (220px, right). 24px gap. |
| md (≤767px) | Sidebar search hidden. Aside has only categories (horizontal scrollable, edge-to-edge with `md:-mx-5 md:px-5`). |

**Aside classes:**
```
flex w-64 shrink-0 flex-col gap-8
lg:w-full lg:flex-row-reverse lg:items-center lg:gap-6
md:flex-col md:items-stretch md:gap-5
```

**Nav (categories) classes:**
```
flex flex-col gap-2
lg:min-w-0 lg:flex-1 lg:flex-row lg:gap-x-5 lg:overflow-x-auto lg:no-scrollbars
md:flex-none md:-mx-5 md:px-5
```
- `no-scrollbars` is a project utility defined in `src/styles/no-scrollbars.css`.

#### Category links — tab style at lg
```
Desktop: vertical list with green pin indicator (2×2 square) for active state.
lg+: horizontal tabs with border-b-2 underline. Active = border-green-45. Green pin hidden (lg:hidden).
```

**Link classes:**
```
flex items-center justify-between gap-2.5 py-[7px]
font-mono text-sm uppercase leading-[1.375] tracking-tight
transition-colors hover:text-white
lg:shrink-0 lg:whitespace-nowrap lg:border-b-2 lg:py-[3px]

Active:   text-white lg:border-green-45
Inactive: text-gray-new-60 lg:border-transparent
```

#### Cards grid — column transitions
```
desktop: 3 cols  →  lt: 2 cols  →  sm: 1 col
```

#### Cards grid — border strategy
Simplified from complex nth-child selectors to:
- `<ul>`: `border-r border-b border-gray-new-20` (outer frame)
- Each card `<a>`: `border-l border-t border-gray-new-20` (inner grid lines)
- No nth-child selectors, no conditional JS border logic.
- Incomplete last rows: empty cells merge visually with the frame — clean result at any item count.

#### Sidebar ↔ grid gap
```
gap-16  lt:gap-12  lg:gap-10
```

---

## Reference: Blog Sidebar Pattern (blog-update-adaptives branch)

The Case Studies sidebar/categories behavior was modeled after the blog sidebar:

```jsx
// Blog sidebar (blog-update-adaptives)
<aside className="... lg:w-full md:absolute md:left-0 md:right-0 md:top-[210px] ...">
  <nav>
    <div className="lg:no-scrollbars lg:-mx-8 lg:overflow-auto lg:pl-8 md:-mx-4 md:px-4">
      <ul className="flex flex-col gap-y-3.5 lg:flex-row lg:gap-x-5
        lg:after:shrink-0 lg:after:basis-8 lg:after:content-['']
        md:after:basis-4">
```

```jsx
// Blog nav link (blog-update-adaptives)
<Link className={clsx(
  'flex w-full items-center py-[3px] font-mono text-[14px] font-medium uppercase ...',
  'lg:border-b-2 lg:text-sm',
  isActive ? 'text-gray-new-90 lg:border-green-45' : 'hover:text-white lg:border-transparent'
)}>
  {name}
  {isActive && <span className="ml-auto block size-2 bg-green-52 lg:hidden" />}
</Link>
```

---

## Reference: Container Component Sizes

From `src/components/shared/container/container.jsx`:
- Base classes: `relative mx-auto lg:max-w-none lg:px-8 md:px-5`
- `size="1280"`: `max-w-[1280px] px-8`
- `size="branching"`: `max-w-[1216px] 3xl:max-w-[1216px] xl:max-w-full xl:px-8 md:px-8 sm:px-5`

---

## Constraints / Rules

1. Desktop layout (3xl / 2xl / xl) must NOT be changed.
2. Only project breakpoints (desktop-first, max-width). No mobile-first.
3. Tailwind-only — no runtime JS adaptive.
4. No custom breakpoints.
5. 16px minimum for body text on mobile.
6. Patterns must match other new pages (home, branching, about, pricing, blog).

## What's Left / Potential Next Steps

- Verify all breakpoints visually from 1919px down to 360px.
- Fine-tune any spacing inconsistencies found during visual QA.
- CTA section (`CTANew` shared component) already has built-in responsive — may need review.
- Testimonials section spacing/typography may need fine-tuning at sm/xs.

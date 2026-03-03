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
| `src/components/pages/case-studies/hero/hero.jsx` | Hero section adaptive (H1 sizes, max-w, badge, card bg scaling) |
| `src/components/pages/case-studies/testimonials/testimonials.jsx` | Testimonials section adaptive (grid, line, card layout, bg, badges, heading max-w) |
| `src/components/pages/case-studies/cards/cards.jsx` | Cards section adaptive (H2 max-w, border strategy, search layout) |
| `src/app/case-studies/page.jsx` | Added `copyWrapperClassName` to CTANew for per-page heading control |
| `src/components/shared/cta-new/cta-new.jsx` | Fixed h2/p inline flow spacing; changed `sm:inline` → `md:inline` |
| `src/components/shared/section-label/section-label.jsx` | Removed SM responsive sizing from default variant (badges stay fixed) |

## Design Patterns Established

### Proportional max-width for line break preservation

Used across all headings that need to maintain desktop word-break positions without `<br>` tags.

**Method:** Calculate ratio = `max-w / font-size` at desktop. Apply same ratio at each breakpoint. Free flow (max-w-none) when wrapping is acceptable.

| Section | Desktop ratio | Free flow at |
|---------|--------------|-------------|
| Cards H2 "See how teams…" | 736/48 = 15.33 | — (sm:max-w-[430px] preserves) |
| Testimonials H2 "Powering…" | 800/48 = 16.67 | sm:max-w-none |
| Hero H1 "Real-world stories…" | 896/56 = 16.0 | md:max-w-none |
| CTA "Ready to get started…" | 800/48 = 16.67 (via copyWrapperClassName) | md:max-w-none |

### Badges — fixed size across all breakpoints

All section badges (triangle icon + uppercase mono text) stay at 12px text / 12×14 icon / gap-2 at ALL viewport widths. No responsive resizing.

- **Hero badge** ("Case studies"): inline markup, no responsive modifiers
- **Testimonials badge** ("Backed by giants"): inline markup, no responsive modifiers
- **CTA badge** ("Get started"): uses `SectionLabel` shared component — responsive sizing removed from default variant
- **SectionLabel dense variant**: kept its md: responsive behavior unchanged (used in other contexts)

### Left border line pattern (from home page reference)

Modeled after `src/components/pages/home/backed-by/backed-by.jsx`:
```
border-l border-gray-new-50 pl-8 xl:pl-6 lg:pl-[18px] sm:border-l-0 sm:pl-0
```
Line stays inset from viewport edge through container padding. Disappears at SM (1-column layout).

### Card border overlap strategy (cards section)

Each card has full `border` on all sides via absolute positioning overlap:
- `<ul>`: `pl-px pt-px` (compensates first row/column)
- `<li>`: `relative h-[170px]`
- `<a>`: `absolute -left-px -top-px bottom-0 right-0 border border-gray-new-20`

Adjacent cards overlap by 1px, collapsing double borders into 1px lines. Empty cells in incomplete rows have no element = no borders. No outer frame.

---

## Section-by-Section Breakdown

---

### 1. Hero Section (`hero.jsx`)

**Page component:** `src/app/case-studies/page.jsx`
**Container:** `size="branching"` → `max-w-[1216px]`

#### Section padding
```
py-40  xl:py-36  lg:py-20  md:py-14  sm:py-10
```

#### Badge ("Case studies")
Inline markup (not SectionLabel). Fixed size at all breakpoints:
- Icon: 12×14, no responsive classes
- Text: `text-xs` (12px), no responsive classes
- Gap: `gap-2` (8px), no responsive classes

#### H1 title — font size scale
```
desktop: 56px (text-[3.5rem])  →  lt: 54px  →  lg: 40px  →  md: 32px
```

#### Title container max-width (ratio 16.0)
```
max-w-[896px]  lt:max-w-[864px]  lg:max-w-[640px]  md:max-w-none
```

#### Featured cards (2-col grid)
- Grid: `grid-cols-2 gap-8 lg:gap-6 md:grid-cols-1 md:gap-6`
- Card height: `h-[408px] sm:h-[340px]`
- Card inner padding: `p-8 sm:p-6`
- Card title: `text-[28px] sm:text-2xl`

#### Featured card background scaling
```
absolute right-0 top-0 lg:max-w-[50%] lg:h-auto xs:hidden
```
- Desktop: intrinsic size (~303×166 / ~285×164)
- lg and below: max 50% of card width, height scales proportionally
- xs (≤413px): hidden entirely

---

### 2. Testimonials Section (`testimonials.jsx`)

**Container:** `size="1280"`

#### Section padding
```
py-40  xl:py-20  lg:py-16  md:py-14
```

#### Background SVG
```
pointer-events-none absolute right-0 top-0 h-full w-auto md:hidden
```
- Uses `h-full w-auto` for correct scaling (modeled after home page "Backed by Giants" section)
- Scales to full section height, maintaining aspect ratio
- Hidden at md and below

#### Left border line
Moved from Container `before:` pseudo-element to inner content div `border-l`:
```
border-l border-gray-new-50 pl-8  xl:pl-6  lg:pl-[18px]  sm:border-l-0 sm:pl-0
```
- Always inset from viewport edge (container padding + own padding)
- Disappears at sm (1-column cards)

#### Badge ("Backed by giants")
Inline markup. Fixed size at all breakpoints (same as Hero badge pattern).

#### H2 "Powering ambitious…" — font size scale
```
48px  →  xl: 40px  →  lt: 36px  →  lg: 32px  →  md: 24px (text-2xl)  →  sm: free
```

#### H2 max-width (ratio 16.67, preserves line breaks until sm)
```
max-w-[800px]  xl:max-w-[667px]  lt:max-w-[600px]  lg:max-w-[533px]  md:max-w-[400px]  sm:max-w-none
```

#### Testimonial cards — grid layout
```
grid grid-cols-3 gap-12
xl:gap-10
lg:grid-cols-2  lg:gap-x-8  lg:gap-y-12
md:mt-14
sm:grid-cols-1  sm:gap-y-10
```
- 3 cols → lg: 2 cols → sm: 1 col
- Separate row/column gaps at lg+: 32px horizontal, 48px vertical
- sm: 40px vertical gap

#### TestimonialCard
```
article: flex h-[274px] flex-col justify-between lg:h-auto
```
- Desktop: fixed 274px height, `justify-between` pushes author to bottom
- lg+: `h-auto`, grid row height aligns cards; `justify-between` stretches shorter cards

#### Logo → quote gap
```
gap-9  lg:gap-6  md:gap-5
```
(36px → 24px → 20px)

#### Quote → author gap
```
mt-auto  lg:mt-5
```
- Desktop: `mt-auto` (pushed by fixed height + justify-between)
- lg+: `mt-5` (20px fixed minimum), `justify-between` adds more for shorter cards

#### Quote text size
```
text-[20px]  xl:text-lg  md:text-base
```
(20px → 18px → 16px — meets 16px minimum on mobile)

---

### 3. Cards Section (`cards.jsx`) — Most Complex

**Container:** `size="1280"`, className includes `lg:!max-w-[1216px] md:px-5`

#### H2 "See how teams are building…" — font size scale
```
desktop: 48px  →  lg: 40px  →  md: 32px  →  sm: 28px
```

#### H2 max-width (ratio ~15.33)
```
max-w-[736px]  lg:max-w-[614px]  md:max-w-none md:flex-1  sm:max-w-[430px]
```
- Desktop/lg: proportional max-w preserves line breaks
- md: flex-1 (shares row with search bar)
- sm: max-w-[430px] restores desktop breaks when search stacks below

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

#### Cards grid — border strategy (absolute positioning overlap)
- `<ul>`: `grid ... pl-px pt-px` (1px padding compensates first row/column overlap)
- `<li>`: `relative h-[170px]`
- `<a>`: `absolute -left-px -top-px bottom-0 right-0 border border-gray-new-20`
- Each card extends 1px above and left of its grid cell → overlaps with adjacent card borders
- Adjacent borders collapse into 1px visual lines
- Empty cells in incomplete rows: no element, no borders, no outer frame

#### Sidebar ↔ grid gap
```
gap-16  lt:gap-12  lg:gap-10
```

---

### 4. CTA Section (shared `CTANew` component)

**File:** `src/components/shared/cta-new/cta-new.jsx`
**Page-level config:** `src/app/case-studies/page.jsx`

#### Case Studies page props
```jsx
<CTANew
  label="Get started"
  title="Ready to get started with Neon?"
  description="Get personalized guidance from our team — we'll help you quickly find the right solution."
  buttonText="Talk to sales"
  buttonType="aiHelper"
  copyWrapperClassName="lg:max-w-[667px] md:max-w-none"
/>
```

#### Badge ("Get started")
Uses `SectionLabel` shared component. Default variant now has NO responsive sizing:
- Icon stays 12×14 at all viewports
- Text stays `text-xs` (12px)
- Gap stays `gap-2` (8px)

#### Copy wrapper — font size scale (base classes in component)
```
text-[48px]  xl:text-[44px]  lg:text-[40px]  md:text-[28px]
```

#### Copy wrapper — max-width (base + copyWrapperClassName)
```
max-w-[800px]  xl:max-w-[760px]  lg:max-w-[667px]  md:max-w-none
```
- `lg:max-w-[667px]` and `md:max-w-none` come from `copyWrapperClassName` prop (case-studies page only)
- Other pages using CTANew are unaffected

#### h2 + p inline flow
- Both `h2` and `p` use `md:inline` (changed from `sm:inline`)
- At md and below, title and description flow as one continuous text
- `{' '}` space node between h2 and p prevents word sticking ("Neon?Get" → "Neon? Get")

---

## Reference: Home Page "Backed by Giants" Section

**File:** `src/components/pages/home/backed-by/backed-by.jsx`

Used as reference for:
1. **Left border line** pattern: `border-l border-gray-new-50 px-8 xl:pl-6 xl:pr-0 lg:pl-[18px] sm:border-none sm:pl-0`
2. **Background image** scaling: `pointer-events-none absolute -right-[10%] top-0 h-full`
3. **SectionLabel** usage with triangle icon

---

## Reference: Container Component Sizes

From `src/components/shared/container/container.jsx`:
- Base classes: `relative mx-auto lg:max-w-none lg:px-8 md:px-5`
- `size="1280"`: `max-w-[1280px] px-8`
- `size="1344"`: `max-w-[1344px] px-8`
- `size="1920"`: `max-w-[1920px] px-10`
- `size="branching"`: `max-w-[1216px] 3xl:max-w-[1216px] xl:max-w-full xl:px-8 md:px-8 sm:px-5`

---

## Reference: SectionLabel Shared Component

**File:** `src/components/shared/section-label/section-label.jsx`

Two variants:
- **default** — no responsive sizing (icon, text, gap all fixed)
- **dense** — has md: responsive sizing (icon shrinks to 10×10, text to 10px, gap to 6px)

The case-studies page badges use either inline markup (hero, testimonials) or SectionLabel default variant (CTA), all with fixed sizing.

---

## Constraints / Rules

1. Desktop layout (3xl / 2xl / xl) must NOT be changed.
2. Only project breakpoints (desktop-first, max-width). No mobile-first.
3. Tailwind-only — no runtime JS adaptive.
4. No custom breakpoints.
5. 16px minimum for body text on mobile.
6. Patterns must match other new pages (home, branching, about, pricing, blog).
7. No `<br>` tags for line break control — use proportional max-width instead.
8. Badges (section labels) are fixed-size across all breakpoints.
9. Shared components modified carefully — use props (like `copyWrapperClassName`) for per-page customization when possible.

## What's Left / Potential Next Steps

- Verify all breakpoints visually from 1919px down to 360px.
- Fine-tune any spacing inconsistencies found during visual QA.
- Testimonials section spacing/typography may need fine-tuning at xs.
- Featured card content (text, links) may need size adjustments on very narrow screens.

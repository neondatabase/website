# Blog Adaptive Layout — Context & Changelog

> **Safe to delete**: this file is documentation only. It is not imported or used by any part of the project.
> You can remove it at any time with zero impact on the build.

## Overview

Systematic responsive layout for the legacy blog listing page (`/blog`). The goal was to align the layout with the newer site pages **without breaking the existing desktop layout**.

### Breakpoints (desktop-first, max-width)

| Token | max-width |
|-------|-----------|
| 3xl   | 1919px    |
| 2xl   | 1599px    |
| xl    | 1279px    |
| lt    | 1127px    |
| lg    | 1023px    |
| md    | 767px     |
| sm    | 639px     |
| xs    | 413px     |

### Key Architectural Decision (md and below)

On `lg`, the sidebar (category nav) uses `position: relative` + `top` to visually shift below the header while remaining in the normal document flow.

On `md` and below, the sidebar switches to `position: absolute` — it no longer occupies space in the flow. The flex container in the layout received `md:relative` to act as the positioned ancestor. The article grid uses `md:pt-[80px]` to reserve space for the absolutely positioned category nav.

---

## Files Changed

### 1. `next.config.js` (line ~642)

**What**: Fixed WASM path resolution for Windows.
**Before**: `filePath.split('/').pop()`
**After**: `filePath.split(/[\\/]/).pop()`
**Why**: On Windows, `filePath` contains backslashes; splitting by `/` only failed silently, causing a Build Error for `@rive-app/canvas/rive.wasm`.

---

### 2. `src/components/pages/blog/blog-header/blog-header.jsx`

**Header container (line 11)**:
```
'relative mb-12 flex w-full items-end justify-between gap-5 lg:mb-2 md:mb-8 sm:flex-col sm:items-start sm:gap-5'
```
- `lg:mb-2` — minimal margin after header on lg (was mb-10), reduces the gap between categories and article cards
- `md:mb-8` — restores spacing on md
- `sm:flex-col sm:items-start sm:gap-5` — on sm and below, social icons stack below the title with a 20px gap
- Removed `md:flex-col md:items-start md:justify-start md:gap-0` — on md, icons stay inline with the title

**H1 title (line 19)**:
```
'max-w-[540px] text-[56px] leading-dense tracking-tighter lt:text-[48px] lg:text-[40px] md:text-[32px] sm:text-[28px]'
```
- `lt:text-[48px]` — 48px on lt
- `lg:text-[40px]` — 40px on lg
- `md:text-[32px]` — 32px on md
- `sm:text-[28px]` — 28px on sm

**Title line break**: Always renders as two lines ("What we're shipping." / "What you're building."):
```jsx
<span className="whitespace-nowrap">What we&rsquo;re shipping.</span>
<br />
<span className="whitespace-nowrap">What you&rsquo;re building.</span>
```
Previously the `<br>` was hidden on md (`md:hidden`) and the spans had `md:whitespace-normal`. Now the line break and `whitespace-nowrap` are active at all viewport sizes.

**Social icons (line 32)**:
```
'mb-2.5 flex items-center gap-x-4 lg:mb-14 md:mb-0 sm:mb-0'
```
- `lg:mb-14` — offset to align with the absolutely positioned search input on lg
- `md:mb-0` — reset on md (icons inline with title)
- `sm:mb-0` — reset on sm (icons stack vertically)

---

### 3. `src/components/pages/blog/sidebar/sidebar.jsx`

**aside element (line 15)**:
```
'relative z-10 mt-[283px] lt:mt-[267px] flex w-[288px] shrink-0 flex-col gap-y-10
 xl:w-[202px]
 lg:top-[188px] lg:mb-10 lg:mt-0 lg:min-h-fit lg:w-full
 md:absolute md:left-0 md:right-0 md:top-[188px] md:mt-0 md:mb-0
 sm:top-[220px]'
```

**Key changes**:
- `md:absolute md:left-0 md:right-0` — on md the sidebar becomes absolutely positioned, removed from flow
- `md:top-[188px]` — positions categories between search and article cards on md
- `md:mt-0 md:mb-0` — margins zeroed out for absolute positioning
- `sm:top-[220px]` — on sm categories shift lower (header is taller due to stacked icons)
- `lg:top-[188px]` — unchanged (relative positioning on lg)

**Before**: `md:top-[150px] md:mb-9` (relative positioning; categories overlapped the header)

---

### 4. `src/app/blog/(index)/layout.jsx`

**Flex container (line 19)**:
```
'flex gap-16 xl:gap-3.5 xl:pl-0 lg:flex-col lg:gap-0 md:relative'
```
- Added `md:relative` — positioned ancestor for the absolute sidebar

**API protection (lines 7-14)**: `try/catch` around `getAllCategories()` to prevent a 504 from the API from crashing the entire page.

---

### 5. `src/app/blog/(index)/page.jsx`

**Header className (line 22)**:
```
'border-b border-gray-new-20 pb-12 lg:-top-[68px] md:top-0 md:border-b-0 md:pb-0'
```
- `md:top-0` — resets the negative top on md (not needed with absolute sidebar)
- `md:border-b-0 md:pb-0` — removes the divider line and its padding on md and below

**Search className (line 29)**:
```
'right-full mr-16 top-[208px] lt:top-[192px] xl:mr-3.5 lg:right-0 lg:mr-0 lg:top-[12px] md:!static md:!right-auto md:!top-auto md:mt-4'
```
- `md:!static` — search input enters normal flow (not absolute) on md
- `md:mt-4` — 16px gap from the header

**Grid className (line 32)**:
```
'grid grid-cols-2 gap-x-16 xl:gap-x-5 md:grid-cols-1 md:pt-[80px]'
```
- `md:pt-[80px]` — reserves space for the absolutely positioned category nav

**Post filtering (line 17)**: `.filter(Boolean)` guards against `undefined` entries in the posts array.

**First card overrides (line 36)**: `lg:!pt-0 lg:!border-t-0 md:!pt-0 md:!border-t-0` — removes extra top padding and border from the first two cards.

---

### 6. `src/app/blog/(index)/category/[slug]/page.jsx`

Mirrors all changes from `page.jsx`:
- Header className → `md:top-0 md:border-b-0 md:pb-0`
- Search className → `md:!static md:!right-auto md:!top-auto md:mt-4`
- Grid → `md:pt-[80px]`
- `.filter(Boolean)` on posts

---

### 7. `src/components/pages/blog/blog-post-card/blog-post-card.jsx`

- Full-width cards: `object-contain` instead of `object-cover` (prevents image cropping)
- Hover zoom only on featured cards: `withImageHover && !fullSize`
- Text container: `min-w-0` prevents content overflow; `basis-[58%] max-w-[684px] pr-20 lt:max-w-none lt:pr-8 lg:pr-0`

**Card title typography (h1)**:
```
isSmart ? 'text-2xl leading-tight md:text-[20px] sm:text-lg'
        : 'text-[28px] font-normal leading-snug lt:text-2xl md:text-[20px] sm:text-lg'
```
| Breakpoint | Regular cards | Smart cards |
|------------|--------------|-------------|
| default    | 28px         | 24px (text-2xl) |
| lt, lg     | 24px (text-2xl) | 24px (unchanged) |
| md         | 20px         | 20px        |
| sm, xs     | 18px (text-lg) | 18px (text-lg) |

**Excerpt typography**:
```
'lg:text-base md:text-base sm:text-[15px]'
```
- `lg:text-base md:text-base` — minimum 16px on lg and md
- `sm:text-[15px]` — 15px on sm and xs

---

### 8. `src/components/pages/blog/blog-grid-item/blog-grid-item.jsx`

- Removed nth-child hacks; simplified to `'py-10 last:pb-0 md:py-6'`

---

### 9. `src/components/pages/blog/blog-nav-link/blog-nav-link.jsx`

- Active style: `text-gray-new-90 lg:border-green-45`
- **Green dot restored for sidebar** (desktop): `<span className="ml-auto block size-2 bg-green-52 lg:hidden" />` — 8×8px green square, right-aligned via `ml-auto`, rendered only when `isActive`
- **Dot hidden on lg and below** (`lg:hidden`): when categories become horizontal tabs, the active state is shown via green bottom border (`lg:border-green-45`) instead of the dot

---

### 10. `src/styles/search.css`

- `xl:w-[202px] xl:pr-10` — search width on xl matches sidebar width; prevents text clipping
- `lg:w-[288px] lg:pr-36` — search width on lg
- `md:w-full md:text-base` — full-width on md

---

## Visual Hierarchy by Breakpoint

### Desktop (>1023px) — unchanged
Sidebar on the left, content on the right. Title at 56px (lt: 48px). Search is absolutely positioned next to the sidebar.

### lg (768-1023px)
- Flex-col: sidebar on top, content below
- Sidebar: `relative + top-[188px]` — visually positioned after the header
- Title at 40px, social icons inline on the right
- Search is absolutely positioned (`lg:top-[12px]`)
- Divider (border-b) — present
- `lg:mb-2` — minimal margin after header

### md (640-767px)
- Sidebar: `absolute + top-[188px]` — removed from flow
- Layout flex container: `md:relative`
- Title at 32px, social icons inline on the right
- Search is static, full-width (`md:!static md:mt-4`)
- Divider — removed (`md:border-b-0 md:pb-0`)
- Grid: `md:pt-[80px]` to reserve space for categories
- Element order: Title + Icons → Search → Categories → Cards

### sm (<=639px)
- Sidebar: `absolute + top-[220px]`
- Title at 28px, two lines
- Icons stacked below the title (`sm:flex-col sm:gap-5`)
- Search is static, full-width
- Element order: Title → Icons → Search → Categories → Cards

---

## Additional Fixes

### Full-width card image stretching (blog-post-card.jsx, line 73)

**Problem**: On xl, lt, and lg, when the text column in a full-width card grew taller (e.g. title wrapping to 3 lines), the image container stretched vertically to match due to flexbox `align-items: stretch`. This broke the `aspect-[16/9]` ratio and caused whitespace above/below the image (`object-contain` scaled it down to fit the distorted container).

**Fix**: Added `self-start` to the image Link wrapper for `fullSize` cards:
```
fullSize && 'min-w-0 flex-1 basis-[42%] self-start'
```

`align-self: flex-start` prevents the image container from stretching. The `aspect-[16/9]` is now preserved regardless of text column height, and the image naturally aligns to the top of the card.

No impact on md and below (`flex-col` layout) — `self-start` has no visible effect in column direction.

### Social icons vertical offset (blog-header.jsx, line 32)

`lg:mb-14` (56px) → `lg:mb-[60px]` (60px) — icons shifted 4px higher on lg to better align with the search field below.

---

## Bugs Fixed

1. **WASM Build Error** (`next.config.js`): `filePath.split('/')` → `filePath.split(/[\\/]/)` for Windows path compatibility
2. **TypeError: Cannot read properties of undefined (reading 'slug')** (`page.jsx`): `.filter(Boolean)` on the posts array
3. **504 API crash** (`layout.jsx`): `try/catch` around `getAllCategories()` to gracefully degrade when the API is unavailable

---
---

# Blog Post (Inner Page) Adaptive Layout

## Overview

Responsive adaptations for blog article pages (`/blog/[slug]`). The reference for responsive behavior is the template page used by `use-cases/ai-agents` (`src/app/[slug]/pages/template-page.jsx`), which uses the `prose-doc` content styles from `src/styles/doc-content.css`.

**Key design principle**: Desktop layout is preserved. All changes are additive responsive overrides at `lg` and below.

### Reference page architecture

The template page (`template-page.jsx`) uses:
- `Container` with `size="1600"` → `max-w-[1600px] px-8`
- Grid: `grid-cols-12 ... lg:block` — switches from 12-column grid to block at lg
- Post content: `xl:col-span-12 xl:mx-auto xl:max-w-[704px] lg:ml-0 lg:max-w-none`
- Aside (sidebar): `xl:hidden` — completely hidden at xl and below
- Content typography: `prose-doc` with explicit element selectors (h2, h3, p, ul, ol)

### Key Architectural Decision (lg and below)

At `lg` (≤1023px), the blog article layout switches from `grid-cols-12` to `block` (matching the template page's `lg:block`). The sidebar (TOC + social share + newsletter form) is completely hidden via `lg:hidden`. A separate `SocialShare` component appears below the content at `lg` (already existed: `hidden lg:flex`).

---

## Files Changed

### 1. `src/app/blog/[slug]/page.jsx`

**Article container (line 70)**:
```
'dark relative mx-auto grid max-w-[1536px] grid-cols-12 gap-x-10 pb-40 pt-20 2xl:px-10 xl:gap-x-6 xl:pb-32 xl:pt-12 lg:block lg:max-w-none lg:px-8 lg:pb-28 lg:pt-10 md:px-4 md:pb-20 md:pt-8'
```
- `lg:max-w-3xl` → `lg:max-w-none` — full width on tablet (was capped at 768px)
- Added `lg:block` — switches from 12-column grid to block layout (like template-page)
- Removed `md:gap-x-0` — not needed in block layout

**Hero className (line 72)**:
```
'col-start-4 col-end-10 mx-5 xl:col-start-1 xl:col-end-9 lg:mx-0'
```
- `lg:col-span-full` → `lg:mx-0` — grid classes irrelevant in block; resets `mx-5` margins

**Content className (line 80)**:
```
'post-content col-start-4 col-end-10 mx-5 mt-4 xl:col-start-1 xl:col-end-9 lg:mx-0'
```
- `lg:col-span-full lg:row-start-3` → `lg:mx-0` — same reasoning

**SocialShare className (line 85)**:
```
'col-span-full hidden lg:mt-14 lg:flex md:mt-10 sm:mt-8'
```
- Added `md:mt-10 sm:mt-8` — reduced top margins on smaller screens

**MoreArticles className (line 91)**:
```
'col-start-4 col-end-10 mx-5 mt-16 xl:col-start-1 xl:col-end-9 xl:mt-14 lg:mx-0 lg:mt-12 md:mt-10'
```
- Added `lg:mx-0` — resets margins for block layout

---

### 2. `src/components/pages/blog-post/aside/aside.jsx`

**aside element (line 10)**:
```
'aside col-span-2 col-end-13 row-start-1 row-end-3 -ml-8 mt-6 max-w-[298px] xl:col-start-9 xl:col-end-13 xl:!-ml-0 lg:hidden'
```
- `lg:col-span-full lg:ml-0 lg:mt-5 lg:max-w-full` → `lg:hidden` — sidebar completely hidden at lg (like template's `xl:hidden`)

**Inner div (line 11)**:
```
'no-scrollbars sticky top-24 -m-1 max-h-[calc(100vh-100px)] overflow-y-auto p-1 pb-5'
```
- Removed `lg:relative lg:top-0 lg:overflow-hidden` — no longer needed since aside is hidden at lg

---

### 3. `src/components/pages/blog-post/hero/hero.jsx`

**Title h1 (line 30)**:
```
'post-title mt-4 text-5xl font-medium leading-dense tracking-tighter xl:text-[44px] lg:text-[40px] md:text-[36px] sm:text-[32px] xs:text-[28px]'
```

| Breakpoint | Size | Change |
|------------|------|--------|
| default    | 48px (text-5xl) | unchanged |
| xl         | 44px | unchanged |
| lg         | 40px | **added** |
| md         | 36px | was `text-4xl` (36px), now explicit |
| sm         | 32px | unchanged |
| xs         | 28px | was `text-3xl` (30px), now 28px |

**Description (line 33)**:
```
'mt-5 text-xl leading-snug tracking-tight text-gray-new-70 md:text-lg sm:text-base'
```
- Removed redundant `xl:text-xl`
- Added `sm:text-base` (16px on small screens)

**Author bar (line 36)**:
```
'mt-4 flex items-center justify-between gap-x-4 border-t border-[#303236] py-4 sm:flex-col sm:items-start sm:gap-y-3'
```
- Added `gap-x-4` for reliable separation
- Added `sm:flex-col sm:items-start sm:gap-y-3` — author info and date stack vertically on sm

---

### 4. `src/components/pages/blog-post/quote/quote.jsx`

**figure (line 5)**:
- `my-7` → `my-8` — 32px top/bottom (matches `QuoteBlock` on reference page which uses `my-8`)

**blockquote (line 6)**:
- Added `md:text-lg sm:text-base` — responsive text scaling

---

### 5. `src/components/pages/blog-post/more-articles/more-articles.jsx`

**Card list container (line 16)**:
- Added `md:mt-6` — reduced spacing on md

---

### 6. `src/styles/blog-content.css` — **major rework**

#### Approach change

Replaced Tailwind `prose-*` modifier overrides with direct CSS element selectors (matching `prose-doc` in `doc-content.css`). This gives precise control over the spacing rhythm.

**Removed** from `@apply` lines:
- `prose-p:my-4 prose-p:tracking-tight prose-p:text-gray-new-90` — replaced by `p {}` selector
- `prose-ol:my-5 prose-ul:my-5 prose-li:my-4` — replaced by `ul, ol {}` selectors
- `prose-h1:... prose-h2:... prose-h3:... prose-h4:... prose-h5:...` — replaced by `h2 {}`, `h3 {}`, etc.

#### New element selectors (matching prose-doc rhythm)

**h2**:
```css
@apply m-0 pt-8 text-[28px] font-medium leading-tight tracking-tighter md:pt-6 md:text-[24px] sm:text-[20px];
```
- `m-0 pt-8` — zero margins, 32px padding-top (was `mt-10 mb-5`). Matches prose-doc exactly.
- `md:pt-6 md:text-[24px]` — 24px padding, 24px font on tablet
- `sm:text-[20px]` — 20px on mobile

**h3**:
```css
@apply mt-7 text-xl font-medium leading-snug tracking-extra-tight md:mt-5 md:text-lg sm:text-[18px];
```

**h4**:
```css
@apply mt-6 text-lg font-medium leading-snug tracking-extra-tight md:mt-4 md:text-base;
```

**h5**:
```css
@apply mt-5 text-lg md:mt-4 md:text-base;
```

**p** (key change — sets the 24px rhythm):
```css
@apply mb-6 mt-[18px] text-lg font-normal leading-normal tracking-tight text-gray-new-90 md:mb-5 md:mt-4 md:text-base;
```
- Desktop: 18px top, 24px bottom (effective gap = 24px between paragraphs)
- md: 16px top, 20px bottom, text 16px

#### Responsive typography summary

| Element | Desktop | md (≤767px) | sm (≤639px) |
|---------|---------|-------------|-------------|
| p       | 18px, mb-6/mt-[18px] | 16px, mb-5/mt-4 | 16px |
| h2      | 28px, pt-8 | 24px, pt-6 | 20px |
| h3      | 20px, mt-7 | 18px, mt-5 | 18px |
| h4      | 18px, mt-6 | 16px, mt-4 | 16px |
| h5      | 18px, mt-5 | 16px, mt-4 | 16px |
| li      | 18px | 16px | 16px |
| figure/img | my-10 | my-8 | my-6 |
| hr      | my-8 | my-6 | my-6 |

#### Lists (ul / ol)

**Shared (`ul, ol`)**:
```css
@apply my-6 list-none md:my-5;
> li { @apply relative my-2.5 pl-0 text-[18px] font-normal leading-normal md:text-base; }
```

**Unordered (`ul`)**:
```css
@apply pl-[34px] md:pl-5 sm:pl-4;
> li::before { @apply absolute -left-4 top-0 text-[18px] ... content-['–'] md:-left-3.5 md:text-base; }
```
- En-dash `–` marker (blog style), positioned `absolute -left-4 top-0` (prose-doc pattern)

**Ordered (`ol`)**:
```css
@apply list-decimal pl-[38px] md:pl-5;
> li { @apply pl-1.5; }
ol { list-style-type: lower-alpha; }
```
- Added `ol ol { list-style-type: lower-alpha }` — nested ordered lists use a, b, c (matches prose-doc)

#### Other elements

**hr**: `@apply my-8 md:my-6;`

**table**: Added `my-10` (was missing).

**figure/img**: `prose-figure:my-10 ... md:prose-figure:my-8 ... sm:prose-figure:my-6` — progressive spacing reduction (matches QuoteBlock pattern `my-10 lg:my-8 md:my-6`).

**wp-block-quote**: `my-8` (32px) — matches `QuoteBlock` component on reference page. Was `my-7`.

**wp-block-pullquote**: `my-8` (32px) — same.

**wp-block-quote text**: Already had `md:text-lg sm:text-base`.

**wp-block-pullquote text**: Already had `md:text-xl sm:text-lg`.

**Admonition h4 reset**:
```css
.admonition h4 { @apply m-0 inline-flex items-center font-mono text-[13px] uppercase leading-none; }
```
Prevents the generic `h4 { mt-6 text-lg }` rule from affecting admonition titles (matches prose-doc).

---

## Visual Hierarchy by Breakpoint (Blog Post Inner Page)

### Desktop (>1279px) — unchanged
12-column grid. Content in columns 4–10. Sidebar (TOC + social share + newsletter) in columns 11–12, sticky.

### xl (1024–1279px)
Content shifts to columns 1–9. Sidebar narrows to columns 9–13. Gap reduced to 24px.

### lg (768–1023px)
- **Block layout** (no grid) — sidebar hidden
- Content full width with 32px side padding
- SocialShare appears below content (`hidden lg:flex`)
- Title 40px, body text 18px
- Spacing rhythm unchanged from desktop

### md (640–767px)
- Side padding reduced to 16px (`md:px-4`)
- **Body text 16px** (`md:text-base`)
- h2: 24px (was 28px), pt-6 (was pt-8)
- h3: 18px (was 20px)
- Paragraph margins: mb-5 mt-4 (was mb-6 mt-[18px])
- Lists: my-5, li text 16px
- Author bar still inline

### sm (≤639px)
- h2: 20px, h3: 18px
- Title: 32px, description: 16px
- Author bar stacks vertically
- Figure/img margins: my-6
- Quote padding: pl-4 (was pl-6)
- Pullquote padding: pl-6 (was pl-9)

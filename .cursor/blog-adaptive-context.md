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

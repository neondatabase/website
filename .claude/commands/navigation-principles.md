---
description: 'Navigation structure and placement principles for content/docs/navigation.yaml'
---

# Navigation Placement Principles

## System Overview

**Single file controls both navigations:** `content/docs/navigation.yaml`

```yaml
- nav: Label              # Top navbar item
  subnav:                 # TOP NAVBAR DROPDOWN
    - section: Category
      items:
        - title: Item
          slug: path

  items:                  # SIDEBAR NAVIGATION
    - section: Section
      items:
        - title: Page
          slug: path
```

**Two navigation surfaces:**
- `subnav` = Top navbar dropdowns (quick access to major functional areas)
- `items` = Left sidebar (hierarchical document tree)

**Note:** Deciding what gets a subnav dropdown is IA judgment based on multiple factors - breadth of content, user entry points, strategic prominence. There's no single deterministic rule.

---

## Top-Level Navigation

Current structure (as of Jan 2025):

| Nav | Purpose | Subnav? | Pattern |
|-----|---------|---------|---------|
| Get started | Onboarding | No | Learning path |
| About | Product concepts | No | Conceptual |
| Connect | Connection methods | Yes | Task-oriented |
| Develop | Build applications | Yes | Technology-focused |
| Manage | Administration | Yes | Admin tasks |
| Postgres | PostgreSQL learning | No | Educational |
| Resources | Support/community | Yes | Utility |

---

## Placement Decision Process

### Step 1: Analyze Current Patterns

Before recommending placement:

1. **Search navigation.yaml** for similar content
2. **Count existing placements** (e.g., "23 frameworks in Develop → Frontend & Frameworks")
3. **Identify pattern confidence** (high if 90%+ similar content in same location)
4. **Note any outliers** and understand why they differ

### Step 2: Consider Subnav Criteria

**Ask: Should this content be in a top navbar dropdown?**

Current subnav categories (Connect, Develop, Manage, Resources) share these characteristics:
- **Breadth:** Multiple distinct subcategories or technology choices
- **Frequent reference:** Developers access during active work
- **Known needs:** Users arrive knowing what they're looking for
- **Major functional areas:** Core workflows (connecting, building, managing)

Current sidebar-only categories (Get started, About, Postgres) tend to be:
- **Sequential/cohesive:** Linear learning paths or grouped concepts
- **Exploratory:** Users browse to understand, not reference during work
- **Less frequent access:** Read once or occasionally, not daily reference

**This is descriptive, not prescriptive** - use judgment based on content nature and user needs.

### Step 3: Recommend with Reasoning

Present recommendation in this format:

```
📍 Navigation Placement

Content: [Name]
Type: [Framework/Tool/Concept/etc]

Current Pattern:
- [X] of [Y] similar items in [Location]
- Confidence: [High/Medium/Low]

Recommendation: [Specific location in nav]

Reasoning: [Why this location matches user intent and existing patterns]

Alternatives: [If applicable, other valid locations with tradeoffs]

⚠️ Pattern Note: [If deviating from majority pattern, explain why]
```

---

## Subnav Patterns

### Pattern 1: Flat List (5-8 items, no grouping)
```yaml
subnav:
  - title: Status
    slug: path
    icon: icon-name
```
**Use for:** Resources, standalone utilities

### Pattern 2: Simple Groups (3-5 groups)
```yaml
subnav:
  - title: Group Name
    slug: path
    icon: icon-name
    items:
      - title: Item
        slug: path
```
**Use for:** Connect, moderate-sized categories

### Pattern 3: Sectioned (multiple technology areas)
```yaml
subnav:
  - section: CATEGORY NAME       # Uppercase in UI
    items:
      - title: Technology
        slug: path
        icon: icon-name
        items:
          - title: Specific Item
            slug: path
```
**Use for:** Develop, Manage (large categories)

### When to Create Sections

- Have 6+ related items
- Multiple technology categories (Frontend/Backend/AI)
- Functional groupings (Access/Projects/Monitoring)

**Don't create sections for <6 items** - use direct items instead

---

## Depth Limits

- **Subnav:** Max 3-4 levels (users can't scan deeper)
- **Sidebar:** Max 5-6 levels (supports collapse/expand)

If you need more depth → create hub page or flatten hierarchy

---

## Common Content Type Patterns

| Content Type | Typical Location | Subnav? |
|--------------|------------------|---------|
| Framework integration | Develop → Frontend & Frameworks | Yes |
| Language guide | Develop → Frontend & Frameworks | Yes |
| ORM documentation | Develop → Frontend & Frameworks | Yes |
| Connection method | Connect | Yes |
| Admin/management task | Manage | Yes |
| CLI/API tool | Develop → Tools & Workflows | Yes |
| Architecture explanation | About (sidebar only) | No |
| Learning tutorial | Get started (sidebar only) | No |
| Support resource | Resources | Yes (flat) |

**These are current patterns, not rules.** If you find a better placement for specific content, recommend it with reasoning.

---

## Patterns to Avoid

❌ Creating sections with <6 items (use direct items instead)
❌ Nesting 5+ levels deep in subnav (users can't scan that deep)
❌ Inconsistent placement (similar content scattered across locations without clear reasoning)
❌ Unclear section names (users should immediately understand what's in each section)

---

## Handling Edge Cases

**When similar content is split across locations:**
- Present both patterns with counts
- Explain the difference (e.g., "Auth frameworks in Backend, UI frameworks in Frontend")
- Recommend based on content's primary purpose
- Note it's a judgment call for human

**When creating new category:**
- Propose where it fits in user journey
- Suggest whether it needs subnav
- Explain what type of content belongs there
- Ask human to confirm structure

**When patterns have evolved:**
- Note the shift (e.g., "Last 5 added to Location B vs. Location A")
- Recommend following new pattern
- Suggest updating this document if pattern is systematic

---

## Technical Details

**Icons:** Reference `/icons/docs/sidebar/` files
- Common: `frameworks`, `languages`, `orm`, `api`, `cli`, `auth`, `settings`, `support`

**External links:** Full URLs work in subnav
```yaml
slug: https://github.com/neondatabase/toolkit
```

**Tags:** Add visual indicators
```yaml
tag: updated    # Options: updated, new, beta, preview
```

---

## Process for New Content

1. **Read current navigation.yaml** to understand structure
2. **Analyze pattern** for similar content (count existing placements)
3. **Consider user needs** (frequency of access, breadth of category, known vs. exploratory)
4. **Recommend placement** with confidence level and reasoning
5. **Note alternatives** if multiple valid options exist
6. **Present to human** for confirmation (this is IA judgment, not algorithmic)
7. **Update both** sidebar (`items`) and subnav if appropriate
8. **Document reasoning** in commit message

**Remember:** Navigation organization is holistic IA judgment. Analyze patterns, understand user needs, but defer to human decision-making for placement.

---

## When to Update This Document

These principles describe current patterns and should evolve with the navigation.

**Update when:**
- 5+ similar items placed differently than stated pattern
- New top-level category added
- Major reorganization occurs
- Systematic deviation from patterns

**This document describes current patterns to guide analysis and recommendations.** Navigation decisions require holistic IA judgment - there are no deterministic rules. When in doubt, analyze similar content, consider user needs, present reasoning, and get human confirmation.

---

**Related Files:**
- `content/docs/navigation.yaml` - The actual navigation
- `.claude/agents/ia-specialist.md` - IA specialist agent
- `.claude/agents/content-planner.md` - Content planning

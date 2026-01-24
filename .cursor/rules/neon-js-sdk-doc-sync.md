# Neon JavaScript SDK Documentation Sync

## Purpose
This rule guides the process of reviewing merged PRs from the neon-js repository and updating the user-facing SDK documentation in the website repository to reflect API changes.

## When to Apply
Apply this rule when asked to:
- "Review the latest neon-js PRs"
- "Update SDK docs from neon-js changes"
- "Sync JavaScript SDK documentation"
- "Check for SDK API changes"

## Repositories

### Source Repository (SDK Code)
- **Repo:** `neondatabase/neon-js`
- **URL:** https://github.com/neondatabase/neon-js
- **Access:** Use GitHub MCP tools to fetch PRs and file changes

### Documentation Repository (This Repo)
- **Files to Update:**
  - `content/docs/reference/javascript-sdk.md` - Main SDK reference documentation
  - `content/docs/sdk-navigation.yaml` - Table of contents structure (if new methods added)
  - `content/docs/auth/quick-start/nextjs.md` - Next.js with UI Components guide
  - `content/docs/auth/quick-start/nextjs-api-only.md` - Next.js with API methods guide
  - `public/llms/reference-javascript-sdk.txt` - Auto-generated during build, do not edit manually

## Documentation Scope Decision Tree

Before updating documentation, determine WHERE to document the change:

### Client-Side SDK API Changes
**Target:** `content/docs/reference/javascript-sdk.md`
- New methods on `client.auth.*` or `client.from()`
- New client-side adapter methods
- Client-side query builders and filters
- Methods used in React components via hooks

### Next.js Server-Side Features
**Target:** Next.js quickstart guides
- `content/docs/auth/quick-start/nextjs.md` (UI Components)
- `content/docs/auth/quick-start/nextjs-api-only.md` (API methods)

Changes affecting:
- `neonAuth()` helper function
- `neonAuthMiddleware()` configuration
- `authApiHandler()` behavior
- Server-side environment variables
- Server-side performance optimizations
- `authServer.*` methods

### Framework-Specific Guides
**Target:** Respective framework documentation
- React-specific features → React guides
- Next.js App Router features → Next.js guides
- Adapter changes → Integration guides

### Example Mapping:
- ✅ New `client.auth.signIn.passkey()` → `javascript-sdk.md`
- ✅ New `NEON_AUTH_COOKIE_SECRET` env var → Next.js quickstart guides
- ✅ New middleware option → Next.js quickstart guides
- ✅ New React hook → React guide + SDK reference

## Workflow

### Step 1: Fetch Recent Merged PRs
Use the GitHub MCP tool to fetch merged PRs from the last 7 days:
```
owner: neondatabase
repo: neon-js
state: closed (filter to merged only)
sort: updated
direction: desc
```

Ask user which time period if unclear (default: last 7 days).

### Step 2: Review Each PR for User-Facing Changes

For each PR, determine if it contains **user-facing API changes**:

#### ✅ User-Facing Changes (DOCUMENT THESE)
- New authentication methods (e.g., `auth.signIn.social()`, `auth.signUp.email()`)
- New database query methods (e.g., `.select()`, `.insert()`, `.update()`)
- New filter methods (e.g., `.eq()`, `.gt()`, `.like()`)
- Changed method signatures (added/removed parameters)
- New adapters (e.g., BetterAuthReactAdapter, SupabaseAuthAdapter)
- New return types or response structures
- New configuration options in `createClient()` or `createAuthClient()`
- New Next.js middleware options or behavior
- New environment variables for server-side features
- Server-side performance optimizations (caching, etc.)
- Changes to server-side helper functions (`neonAuth()`, `authServer.*`)
- Deprecated methods (mark with deprecation note)
- Breaking changes to public API

#### ❌ Internal Changes (DO NOT DOCUMENT)
- Refactoring internal code structure
- Performance optimizations that don't change API
- Bug fixes that don't change behavior
- Testing improvements
- Build system changes
- CI/CD pipeline updates
- Internal utility functions
- Type definitions that don't affect public API usage

### Step 3: Analyze PR Changes

For PRs with user-facing changes:

1. **Read the PR description** - Understanding the "why" and intended use case
2. **Review changed files** - Focus on:
   - `packages/*/src/**/*.ts` - Public API files
   - `packages/*/README.md` - Usage examples
   - `examples/**/*` - Example implementations
3. **Identify specific changes**:
   - New exports
   - Changed function signatures
   - New parameters or options
   - Modified return types
   - New adapter methods

### Step 4: Update SDK Documentation

#### Main Documentation File
**Location:** `content/docs/reference/javascript-sdk.md`

**Update patterns based on change type:**

##### Adding a New Method
```markdown
<TwoColumnLayout.Item title="Method name" method="client.auth.methodName()" id="unique-id">
<TwoColumnLayout.Block>

Brief description of what the method does.

- Key behavior point 1
- Key behavior point 2
- Key behavior point 3

### Parameters

<details>
<summary>View parameters</summary>

| Parameter            | Type                | Required |
| -------------------- | ------------------- | -------- |
| <tt>paramName</tt>   | string              | ✓        |
| <tt>optionalParam</tt> | string \| undefined |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const result = await client.auth.methodName({
  paramName: 'value',
  optionalParam: 'optional value'
})

if (result.error) {
  console.error('Error:', result.error.message)
} else {
  console.log('Success:', result.data)
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>
```

##### Updating an Existing Method
1. Locate the method by searching for its `id` attribute
2. Update the description if behavior changed
3. Update the parameters table if parameters changed
4. Update code examples if signature changed
5. Add notes about breaking changes if applicable

##### Adding Multiple Code Examples
Use `CodeTabs` for multiple examples:
```markdown
<CodeTabs labels={["Basic usage","With options","Error handling"]}>

```typescript
// Example 1
```

```typescript
// Example 2
```

```typescript
// Example 3
```

</CodeTabs>
```

#### Navigation File (if needed)
**Location:** `content/docs/sdk-navigation.yaml`

Update ONLY if adding entirely new methods. Add entries under appropriate section:

```yaml
reference/javascript-sdk:
  title: Neon Auth & Data API TypeScript SDKs
  sections:
    - section: Auth
      items:
        - title: New method name
          id: unique-id-matching-markdown
```

**Section mappings:**
- `Getting Started` - Installation and initialization
- `Auth` - Authentication methods (`auth.signIn.*`, `auth.signUp.*`, etc.)
- `Database` - CRUD operations (`from()`, `.select()`, `.insert()`, etc.)
- `Filters` - Query filters (`.eq()`, `.gt()`, `.like()`, etc.)

#### Next.js Quickstart Guides (Server-Side Features)
**Locations:**
- `content/docs/auth/quick-start/nextjs.md` - UI Components guide
- `content/docs/auth/quick-start/nextjs-api-only.md` - API methods guide

**When to update:**
- New environment variables affecting Next.js
- Changes to `neonAuthMiddleware()` configuration
- New server-side helper methods
- Performance optimizations for server components
- Changes to API route handlers

**Update patterns:**

##### Adding Environment Variable Documentation
Locate the "Set up environment variables" step and add to the Admonition:
```markdown
<Admonition type="tip" title="Optional: Feature name">
Add `ENV_VAR_NAME` to enable [feature description]. This [performance benefit or functionality].

[Technical details: TTL, validation, security notes]

This feature is opt-in and fully backward compatible. Without this variable, [fallback behavior].
</Admonition>
```

Update the code block to include the new variable:
```bash
NEON_AUTH_BASE_URL=https://...

# Optional: Feature description (recommended for production)
NEW_ENV_VAR=example-value
```

##### Update frontmatter date:
```yaml
updatedOn: 'YYYY-MM-DDTHH:MM:SS.000Z'
```

### Step 5: Documentation Quality Standards

Ensure all updates follow these standards:

1. **Clarity** - Use clear, simple language
2. **Completeness** - Include all parameters and return types
3. **Examples** - Provide realistic, copy-paste ready examples
4. **Error Handling** - Show error handling patterns
5. **Consistency** - Match existing documentation style and voice
6. **Accuracy** - Verify against actual SDK code

### Step 6: Create Summary

After completing updates, provide a summary:

```markdown
## SDK Documentation Updates from neon-js PRs

### PRs Reviewed: [count]
- PR #X: [title] - User-facing: Yes/No - Scope: Client SDK / Next.js / Framework
- PR #Y: [title] - User-facing: Yes/No - Scope: Client SDK / Next.js / Framework

### Documentation Changes Made:

#### Client SDK Reference
1. **Added method**: `auth.newMethod()` 
   - File: content/docs/reference/javascript-sdk.md
   - Section: Auth
   
2. **Updated method**: `auth.existingMethod()`
   - Changed: Added new optional parameter
   - File: content/docs/reference/javascript-sdk.md

3. **Updated navigation**:
   - Added entry for new method
   - File: content/docs/sdk-navigation.yaml

#### Next.js Guides
1. **Added configuration**: `NEON_AUTH_COOKIE_SECRET`
   - Files: 
     - content/docs/auth/quick-start/nextjs.md
     - content/docs/auth/quick-start/nextjs-api-only.md
   - Section: Environment variables

#### Framework Guides
1. **Updated guide**: [Framework name]
   - File: content/docs/[path]
   - Change: [description]

### No Documentation Changes Needed:
- PR #Z: Internal refactoring only
```

## Important Notes

### What NOT to Update
- **LLM text file** (`public/llms/reference-javascript-sdk.txt`) - This is auto-generated during build
- **Internal documentation** - Focus only on user-facing SDK reference
- **Tutorial pages** - Only update the reference documentation unless specifically asked

### Multiple Guides May Need Updates
Some changes affect multiple documentation files:
- New auth method might need updates in SDK reference AND framework guides
- Environment variable changes might need updates in multiple quickstart guides
- Always check if related guides need updates for consistency

### Method ID Conventions
- Use kebab-case: `auth-signinwithpassword`
- Be descriptive: `auth-sendverificationotp`
- Match the method purpose, not just the function name

### Code Example Standards
- Use TypeScript for all examples
- Show full import statements in first example
- Include error handling with `if (result.error)`
- Use realistic variable names
- Keep examples concise but complete

### Breaking Changes
If a PR introduces breaking changes:
1. Add an `Admonition` component with type "important"
2. Clearly describe what changed
3. Provide migration example (old → new)

Example:
```markdown
<Admonition type="important" title="Breaking Change">
The `auth.signIn()` method signature has changed. The `rememberMe` parameter is now part of the options object.

**Before:**
```typescript
await auth.signIn(email, password, true)
```

**After:**
```typescript
await auth.signIn.email({ email, password, rememberMe: true })
```
</Admonition>
```

## Execution Checklist

When syncing documentation:
- [ ] Fetch merged PRs from neon-js repo
- [ ] Review each PR description and changes
- [ ] Identify user-facing changes only
- [ ] Determine documentation scope (Client SDK vs Next.js vs Framework)
- [ ] Update `javascript-sdk.md` with new/changed client methods (if applicable)
- [ ] Update `sdk-navigation.yaml` if new methods added (if applicable)
- [ ] Update Next.js quickstart guides for server-side changes (if applicable)
- [ ] Update framework-specific guides as needed (if applicable)
- [ ] Follow appropriate component patterns (TwoColumnLayout, Admonition, etc.)
- [ ] Include code examples for all changes
- [ ] Verify parameter tables are complete
- [ ] Update frontmatter dates on modified files
- [ ] Check for breaking changes and document appropriately
- [ ] Create summary of changes made
- [ ] Test locally with `npm run dev` (if requested)

## Example Usage

**User request:**
> "Review the latest PRs from neon-js and update the SDK docs"

**Your response:**
1. Fetch last 7 days of merged PRs from neondatabase/neon-js
2. List PRs found with brief description
3. Analyze each for user-facing changes
4. Update documentation files as needed
5. Provide summary of changes made

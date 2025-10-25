---
description: 'Orchestrated documentation content creation workflow using specialized agents'
allowed_tools:
  [
    'Task',
    'Bash',
    'Read',
    'Edit',
    'MultiEdit',
    'Write',
    'Glob',
    'Grep',
    'TodoWrite',
    'mcp__proxy__jira__jira_get_issue',
    'mcp__proxy__github__create_pull_request',
  ]
---

# WriteContent Orchestrated Documentation Workflow

I'll create comprehensive documentation content using a structured workflow with specialized agents.

## Workflow Initialization

First, let me create a todo list to track the workflow progress:

**TodoWrite Setup:**

```
1. Parse user requirements and extract information
2. Launch IA Specialist agent for content planning
3. Launch Content Writer agent for content creation
4. Launch Content Reviewer agent for style review
5. Launch Syntax Validator agent for build validation
6. Finalize with git operations and optional PR
```

## Step 1: Information Parsing and Extraction

Let me analyze your request: `$ARGUMENTS`

**Parsing Logic:**

- **GitHub Issue Detection**: Looking for pattern `#\d+` or "issue" keywords
- **File Path Detection**: Extracting `.md` or `.mdx` file paths from arguments
- **Operation Type**: Detecting "create", "update", "new page" keywords
- **PR Request**: Looking for "PR" or "pull request" keywords

**If GitHub issue found**: I'll fetch the issue details if integration available
**If file paths specified**: I'll verify they exist and read current content
**If "create" detected**: I'll plan new page creation with proper placement

## Step 2: IA Specialist Agent - Content Structure Planning

**Task Tool Call:**

```
subagent_type: "ia-specialist"
prompt: "Analyze content structure and placement for: [parsed requirements].
Target pages: [identified files].
Please:
1. Check content/docs/navigation.yaml for current navigation hierarchy
2. Recommend content placement and organization
3. Identify cross-reference opportunities
4. Plan content scoping and relationships
5. Suggest any navigation updates needed
Return a structured plan for content organization."
```

## Step 3: Content Writer Agent - Content Creation

**Task Tool Call:**

```
subagent_type: "content-drafter"
prompt: "Create documentation content based on IA plan: [IA output].
Requirements: [parsed user requirements]
Target files: [file list]
Please:
1. Write content following Neon style guide (developer-friendly, clear, concise)
2. Use proper MDX syntax with React components
3. Include required frontmatter (title, subtitle, enableTableOfContents)
4. Apply consistent Neon terminology (Neon, Serverless Postgres, compute, branch, project)
5. Ensure technical accuracy and completeness
6. Create proper heading hierarchy (max H3, avoid H4+)
7. Use appropriate MDX components (Admonition, CodeTabs, InfoBlock, Steps)
Write the actual content to the specified files."
```

## Step 4: Content Reviewer Agent - Style and Quality Review

**Task Tool Call:**

```
subagent_type: "content-refiner"
prompt: "Review the written content in: [target files].
Please:
1. Check style, grammar, and readability
2. Verify flow and content organization
3. Ensure compliance with Neon documentation standards
4. Use Edit tool for improvements
5. Validate technical accuracy and Neon terminology consistency
6. Check for proper active voice and present tense
7. Verify MDX component usage is correct
Apply improvements directly to the files."
```

## Step 5: Syntax Validator Agent - Build Compliance

**Task Tool Call:**

```
subagent_type: "syntax-validator"
prompt: "Validate MDX syntax and Next.js build compliance for: [files].
Please:
1. Check MDX component syntax (proper closing tags, props, nesting)
2. Verify build compliance and formatting
3. If files were moved/renamed, add redirectFrom to frontmatter
4. Validate cross-references and internal links (use relative paths)
5. Ensure proper frontmatter structure (title, subtitle, enableTableOfContents)
6. Check code blocks have language tags
7. Verify heading hierarchy (no H4+)
Fix any issues found."
```

## Step 6: Finalization and Git Operations

**Git Workflow:**

1. **Stage changes**: `git add [modified/created files]`
2. **Create commit**:

   ```
   git commit -m "Add/Update [content topic] documentation

   🤖 Generated with Claude Code WriteContent workflow

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

3. **Optional PR Creation**: If "PR" detected in arguments, use `mcp__proxy__github__create_pull_request`

**Build Validation:**

- Optionally run `npm run build` to verify no build errors (only if requested by user)
- Report any validation issues to user
- Suggest fixes if build fails

## Error Handling

**Between each step:**

- Check if agent reported any errors or blockers
- If GitHub issue not found, prompt for manual description
- If target files conflict, confirm with user before proceeding
- If build validation fails, halt and report specific issues
- Only proceed to next agent after previous step completes successfully

## Usage Examples

**GitHub issue-based content:**
`/write-content #123 update content/docs/connect/connection-pooling.md`

**New page creation:**
`/write-content create new authentication guide`

**Multi-file update with PR:**
`/write-content autoscaling update content/docs/introduction/autoscaling.md content/docs/guides/autoscaling-guide.md create PR`

**Feature documentation:**
`/write-content document new Data API feature, affects content/docs/data-api/`

---

**Ready to execute the workflow!** The orchestration will begin with parsing your requirements and coordinating the specialized agents through each step.

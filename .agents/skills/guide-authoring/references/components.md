# Guide components

Docs and guides use the MDX component registry in `src/components/shared/content/content.jsx`. `content/docs/README.md` and `content/docs/community/component-guide.md` are the syntax authorities. Inspect an existing page and the component implementation before using a specialized component.

Prefer ordinary Markdown when it communicates the information clearly. Components should clarify sequence, choices, risk, navigation, or interaction.

## Core components

### Admonition

Use an admonition when missing the information could cause an error, risk, or important misunderstanding.

```mdx
<Admonition type="warning" title="Before you continue">
This operation deletes the branch and can't be undone.
</Admonition>
```

Types:

- `note`: Information readers should notice while skimming.
- `important`: Information required for success.
- `tip`: Optional advice that improves the result.
- `info`: Context that explains behavior.
- `warning`: Risk, destructive behavior, or a likely serious error.
- `comingSoon`: A capability that isn't available yet.

Don't use admonitions for routine steps or promotional claims.

### Callout

Use a callout for neutral supplementary context, a best practice, or "good to know" information. Use an admonition when overlooking the text could cause failure.

```mdx
<Callout title="Before you start">
Use Node.js 20 or later for this example.
</Callout>
```

### Steps

Use for one sequential procedure. Each `h2` inside the wrapper becomes a numbered step.

```mdx
<Steps>

## Install the dependency

Run the install command.

## Configure the application

Add the environment variable.

</Steps>
```

Don't combine unrelated procedures in one `Steps` block.

### CodeTabs

Use for equivalent code in different languages, clients, package managers, or runtimes. Keep the examples equivalent and keep labels in the same order throughout the page.

````mdx
<CodeTabs labels={["JavaScript", "Python"]}>

```javascript
const result = await client.query('SELECT 1');
```

```python
cursor.execute("SELECT 1")
```

</CodeTabs>
````

Use ordinary code blocks when the reader needs only one option.

### Tabs and TabItem

Use for parallel non-code workflows such as Console, CLI, and API instructions.

```mdx
<Tabs labels={["Console", "CLI"]}>
<TabItem>
Console instructions.
</TabItem>
<TabItem>
CLI instructions.
</TabItem>
</Tabs>
```

Use `CodeTabs`, not `Tabs`, when every tab contains only code.

### CTA

Use one focused next action at the end of a guide or major flow. Don't use a CTA to repeat an inline link or direct every reader to plan-gated support.

```mdx
<CTA title="Create a Neon project" description="Start with a free Neon account." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
```

### StickyTable

Use around one long Markdown table when its header needs to remain visible. Don't wrap short tables.

```mdx
<StickyTable>

| Option | Behavior |
| --- | --- |
| A | First behavior |

</StickyTable>
```

### TwoColumnLayout

Use for a tutorial or reference page that benefits from paired explanation and code. Set `layout: wide` in frontmatter.

Available subcomponents:

- `TwoColumnLayout.Step`: Numbered tutorial step with `title`.
- `TwoColumnLayout.Item`: Reference item with `title`, `method`, and `id`.
- `TwoColumnLayout.Block`: Content block with optional `label`.
- `TwoColumnLayout.Footer`: Full-width content after the blocks.

Don't use it for a conventional linear guide.

### CheckList and CheckItem

Use for a reader-managed setup checklist, often alongside `Steps`. Checklist state persists in browser storage, so give each checklist a stable, distinct title.

```mdx
<CheckList title="Setup checklist">
<CheckItem title="Create a project" href="#create-a-project">Create the Neon project.</CheckItem>
</CheckList>
```

### InfoBlock and DocsList

Use `InfoBlock` near the opening when the page needs compact groups such as learning outcomes and related resources. Use `DocsList` inside it or alone for a short list of tasks, docs, or repositories.

`DocsList` themes:

- Default: tasks or learning outcomes.
- `docs`: documentation links.
- `repo`: repository links.

Don't use either component for ordinary prose or a long table of contents.

### DefinitionList

Use for terms and definitions, not for steps or arbitrary key-value data.

```mdx
<DefinitionList>

Compute
: The virtualized service that runs Postgres.

</DefinitionList>
```

### TechCards, DetailIconCards, and CompactCards

- `TechCards`: Technology or framework choices with approved color logos.
- `DetailIconCards`: Neon features, services, or docs destinations with approved monochrome icons.
- `CompactCards`: Dense navigation where the larger card treatments add too much visual weight.

Check that each icon exists before using it. Don't use cards for a list that reads better as bullets.

### FeatureList

Use for a visual feature overview, split by `h2` or `h3` headings. Don't use it for procedural steps or a generic benefits list.

### CopyPrompt

Use to display a maintained, copyable LLM prompt. Put prompt files in `public/prompts/` and pass the root-relative path.

```mdx
<CopyPrompt src="/prompts/example.md" description="Use this prompt to configure the integration." />
```

### ExternalCode

Use to embed code maintained in an external repository. Always use a raw GitHub URL. Prefer local code when the guide owns the example.

### YoutubeIframe and Video

- `YoutubeIframe`: An existing YouTube tutorial or demo.
- `Video`: A directly hosted video asset.

Video should supplement written instructions, not replace them. Provide enough text for a reader to complete the task without watching.

### NeedHelp

Use the shared `<NeedHelp/>` footer only where established docs patterns call for it. It points readers to maintained help paths. Don't write a replacement that directs all readers to support.

## Other registered components

These components are available but tied to specific page types, product areas, or data contracts. Don't introduce one based only on its name. Read its implementation and copy a current use pattern first.

| Component                                                                         | Use only for                                                                 |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `ApiMethodBadge`, `ApiParam`, `ApiResourceGrid`, `ApiResponse`                    | Structured API reference                                                     |
| `CliCommandIndex`, `CliUsage`, `CliOptions`, `CliSubcommands`, `CliGlobalOptions` | Generated or structured Neon CLI reference                                   |
| `TwinPaths`, `QuickPath`, `GuidedPath`, `TourCallout`                             | A deliberate quick-path versus guided-path experience                        |
| `QuickLinks`, `MegaLink`, `LinkPreview`                                           | Established navigation and link-preview layouts                              |
| `Tag`                                                                             | A small status or category label in an existing pattern                      |
| `CommunityBanner`, `QuoteBlock`, `QuoteBlocksWrapper`                             | Community or use-case storytelling pages                                     |
| `UseCaseList`, `UseCaseContext`, `LogosSection`                                   | Use-case pages with their existing data shape                                |
| `RequestForm`, `ProgramForm`, `SubprocessorsForm`, `SubscriptionForm`             | An approved form flow with required backend configuration                    |
| `ChatOptions`                                                                     | An established chat or AI configuration flow                                 |
| `AutoscalingChart`, `AutoscalingViz`                                              | The maintained autoscaling visualizations                                    |
| `ComputeCalculator`, `LatencyCalculator`                                          | The maintained interactive calculators                                       |
| `McpSetupConfigurator`                                                            | Interactive MCP setup                                                        |
| `SqlToRestConverter`                                                              | The SQL-to-REST interactive tool                                             |
| `AiGatewayModelIndex`                                                             | The generated AI Gateway model index                                         |
| `Button`                                                                          | An established inline action that can't be expressed as a normal link or CTA |

## Shared content components

Shared content components include maintained copy from `content/docs/shared-content/`. Use them instead of duplicating the same notice or reference. Current names include:

- Help and navigation: `NeedHelp`, `NextSteps`, `LinkAPIKey`
- Feature status: `PrivatePreview`, `PublicPreview`, `PrivatePreviewEnquire`, `EarlyAccessProps`, `FeatureBeta`, `FeatureBetaProps`
- Product notices: `NewPricing`, `LRNotice`, `LRBeta`, `MigrationAssistant`, `NeonRLSDeprecation`, `AzureRegionsDeprecation`, `ConsumptionAccountApiDeprecation`, `NextjsProxyNote`
- AI and setup: `MCPTools`, `AgentSkillsTip`, `AuthAISetup`, `AuthAISetupTip`
- Neon Auth SDK reference: `SdkOverview`, `SdkStackApp`, `GetStarted`, `SdkUser`, `SdkTeam`, `SdkTeamUser`, `SdkTeamProfile`, `SdkProject`, `SdkTeamPermission`, `SdkApiKey`, `SdkContactChannel`, `SdkUseStackApp`, `SdkUseUser`

Read the corresponding file and confirm it applies before inserting the component. Don't edit shared content solely to change one guide.

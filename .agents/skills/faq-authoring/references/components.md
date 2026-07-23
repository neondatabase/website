# FAQ components

FAQ pages render with the docs MDX registry in `src/components/shared/content/content.jsx`. The full syntax authority is `content/docs/README.md` and `content/docs/community/component-guide.md`.

Use ordinary Markdown by default. A component must make the answer easier to understand or act on.

## Components commonly useful in FAQs

### Admonition

Use when missing the information could lead to failure, data loss, a security problem, or a significant misunderstanding.

```mdx
<Admonition type="warning" title="Before you reset the password">
Existing connection strings stop working after the reset.
</Admonition>
```

Types:

- `note`: Information worth noticing while skimming.
- `important`: A requirement for success.
- `tip`: Optional advice.
- `info`: Explanatory context.
- `warning`: Risk or destructive behavior.
- `comingSoon`: A capability that isn't available yet.

Don't use an admonition for the direct answer itself or for a marketing claim.

### Callout

Use for neutral supplementary context or a best practice. Use an admonition when overlooking the content could cause an error.

```mdx
<Callout title="Good to know">
The pooled and direct connection strings use the same database credentials.
</Callout>
```

### Tabs and TabItem

Use when the same answer has parallel Console, CLI, or API paths.

```mdx
<Tabs labels={["Console", "CLI"]}>
<TabItem>
Open **Settings** in the Neon Console.
</TabItem>
<TabItem>
Run the corresponding Neon CLI command.
</TabItem>
</Tabs>
```

Don't hide prerequisites or different outcomes in tabs. If the paths aren't equivalent, use separate sections.

### CodeTabs

Use for equivalent commands or code in different languages, clients, or package managers.

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

### Steps

Use only when the answer contains a short sequential procedure. A longer setup belongs in a guide.

```mdx
<Steps>

## Open the project

Select the project in the Neon Console.

## Copy the connection string

Click **Connect** and copy the connection string.

</Steps>
```

### CTA

Use one focused next action, usually a canonical docs page, console flow, or broadly available resource.

```mdx
<CTA title="Manage your project" description="Review project settings and limits." buttonText="Read the docs" buttonUrl="/docs/manage/projects" />
```

Don't send all readers to plan-gated support.

### StickyTable

Use for a long comparison or limits table whose header needs to remain visible. Use a normal Markdown table for short data.

### DefinitionList

Use when the answer defines several related terms. Don't use it for steps or arbitrary properties.

### YoutubeIframe and Video

Use only when a demo materially helps answer the question. Keep a complete text answer on the page.

### ExternalCode

Use for a code sample maintained in an external repository. Use a raw GitHub URL and confirm the external source is stable.

### CopyPrompt

Use when the answer intentionally provides a maintained LLM prompt. Store the prompt in `public/prompts/`.

### CheckList and CheckItem

Use only for a multi-part diagnostic or setup checklist that readers benefit from tracking. State persists in browser storage, so use a stable, unique title.

## Navigation and visual components

These are available but rarely improve a single FAQ:

- `InfoBlock`: Compact grouped introductory content. Use only for a long FAQ with distinct learning and related-resource groups.
- `DocsList`: A short themed list of tasks, docs, or repositories. Prefer inline links for one or two destinations.
- `TechCards`: Technology or framework choices with approved logos.
- `DetailIconCards`: Product features or docs destinations with approved monochrome icons.
- `CompactCards`: Dense card navigation.
- `FeatureList`: A visual feature overview split by headings.
- `TwoColumnLayout` and its `Step`, `Item`, `Block`, and `Footer` subcomponents: Wide tutorial or reference layouts. A question that needs this usually belongs in docs or a guide. Set `layout: wide` if an established FAQ pattern requires it.
- `NeedHelp`: Shared help footer. Use only where the established FAQ flow calls for it.

Don't introduce cards, feature layouts, or two-column layouts to decorate a short answer.

## Specialized registered components

FAQ pages technically support the following components because they share the docs renderer. Use one only when the FAQ is specifically about that feature and a current docs page demonstrates the required data shape.

| Component                                                                         | Intended use                                                  |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `ApiMethodBadge`, `ApiParam`, `ApiResourceGrid`, `ApiResponse`                    | Structured API reference                                      |
| `CliCommandIndex`, `CliUsage`, `CliOptions`, `CliSubcommands`, `CliGlobalOptions` | Structured Neon CLI reference                                 |
| `TwinPaths`, `QuickPath`, `GuidedPath`, `TourCallout`                             | Quick-path versus guided-path flows                           |
| `QuickLinks`, `MegaLink`, `LinkPreview`                                           | Established navigation and link previews                      |
| `Tag`                                                                             | Existing status or category label patterns                    |
| `CommunityBanner`, `QuoteBlock`, `QuoteBlocksWrapper`                             | Community and customer-story layouts                          |
| `UseCaseList`, `UseCaseContext`, `LogosSection`                                   | Use-case pages with established data contracts                |
| `RequestForm`, `ProgramForm`, `SubprocessorsForm`, `SubscriptionForm`             | Approved forms with backend configuration                     |
| `ChatOptions`                                                                     | Existing chat or AI configuration flows                       |
| `AutoscalingChart`, `AutoscalingViz`                                              | Maintained autoscaling visuals                                |
| `ComputeCalculator`, `LatencyCalculator`                                          | Maintained calculators                                        |
| `McpSetupConfigurator`                                                            | Interactive MCP setup                                         |
| `SqlToRestConverter`                                                              | SQL-to-REST conversion tool                                   |
| `AiGatewayModelIndex`                                                             | Generated AI Gateway model index                              |
| `Button`                                                                          | An established inline action that a link or CTA can't express |

## Shared content components

Use a shared content component when the same maintained notice or reference already exists under `content/docs/shared-content/`. Don't copy its content into the FAQ.

- Help and navigation: `NeedHelp`, `NextSteps`, `LinkAPIKey`
- Feature status: `PrivatePreview`, `PublicPreview`, `PrivatePreviewEnquire`, `EarlyAccessProps`, `FeatureBeta`, `FeatureBetaProps`
- Product notices: `NewPricing`, `LRNotice`, `LRBeta`, `MigrationAssistant`, `NeonRLSDeprecation`, `AzureRegionsDeprecation`, `ConsumptionAccountApiDeprecation`, `NextjsProxyNote`
- AI and setup: `MCPTools`, `AgentSkillsTip`, `AuthAISetup`, `AuthAISetupTip`
- Neon Auth SDK: `SdkOverview`, `SdkStackApp`, `GetStarted`, `SdkUser`, `SdkTeam`, `SdkTeamUser`, `SdkTeamProfile`, `SdkProject`, `SdkTeamPermission`, `SdkApiKey`, `SdkContactChannel`, `SdkUseStackApp`, `SdkUseUser`

Read the shared source and confirm that its wording and conditions fit the FAQ before using it.

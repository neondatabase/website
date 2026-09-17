const functionsBranchingTitleLines = ['Functions that branch with', 'the rest of your stack.'];
const aiGatewayHeroTitleLines = ['Call the latest models right', 'from your Neon backend'];
const aiGatewayModelsTitleLines = ['Access a wide catalog of frontier and open', 'weight models.'];
const aiGatewayModelsHighlightedTitleLines = ['Served with optimized performance via Databricks.'];
const builtForAgentsTitleLines = ['Built for agents and', 'the developers behind them.'];
const faqTitleLines = ['Your questions,', 'answered'];
const lakebaseFromFirstLineTitleLines = [
  'From your first five users',
  "to the world's largest teams",
];

const functionsPageContent = {
  backendServices: {
    title: 'Your functions branch with everything else.',
  },
  slug: 'functions',
  pageLabel: 'Functions',
  hero: {
    label: 'Managed Functions for Lakebase Postgres',
    title: 'Long-running functions, right next to your database',
    illustrationDescription:
      'An application connects to long-running serverless Node.js Functions inside a Neon branch. Functions connect to Lakebase Postgres, AI Gateway, and Object Storage.',
    primaryAction: { label: 'Start building', linkKey: 'signup' },
    secondaryAction: { label: 'Read the docs', linkKey: 'functionsOverview' },
  },
  backendCompute: {
    label: 'Backend compute',
    title: 'Run backend logic where your data lives',
    highlightedTitle: '— and keep it running when the job takes time.',
    connectedServices: {
      title: 'Next to Lakebase Postgres.',
      descriptionBeforeCode: 'Functions run in the same region as your Neon branch, with its',
      code: 'DATABASE_URL',
      descriptionAfterCode:
        'and credentials for AI Gateway and Object Storage injected automatically.',
    },
    longRunning: {
      title: 'Serverless and long-running.',
      description:
        'Start responding quickly, then keep streaming as agents call models and tools, WebSockets stay open, or SSE sends live updates.',
    },
    workloadsLabel: 'For backend work that needs more than a quick response',
    workloads: [
      { id: 'api', label: 'APIs' },
      { id: 'ai-agents', label: 'AI agents' },
      { id: 'mcp-servers', label: 'MCP servers' },
      { id: 'websockets', label: 'WebSockets' },
      { id: 'sse', label: 'SSE' },
    ],
  },
  branching: {
    title: functionsBranchingTitleLines.join(' '),
    titleLines: functionsBranchingTitleLines,
    description:
      'Your agent can deploy isolated backend environments to run previews or tests, functions included.',
    items: [
      {
        id: 'branches-with-data',
        title: 'Branches with your data',
        description:
          'Create a child branch and the function follows, with its own invocation URL and branch-specific database context.',
      },
      {
        id: 'declared-in',
        title: 'Declared in',
        titleCode: 'neon.ts',
        descriptionBeforeCode:
          'Define Functions alongside the rest of your Neon backend in one typed config, then deploy the selected branch with',
        descriptionCode: 'neon deploy',
        descriptionAfterCode: '.',
      },
      {
        id: 'agent-friendly',
        title: 'Agent-friendly support',
        description:
          'Tell your agent to deploy and manage your functions alongside the rest of the Neon backend.',
      },
    ],
  },
  faqItems: [
    {
      question: 'What are Neon Functions?',
      answer:
        '<p>Neon Functions are serverless functions you deploy onto a Neon branch, so your backend code runs in the same region as your database. <code>DATABASE_URL</code> is injected automatically, along with AI Gateway and Object Storage credentials when you use them. Use a Function to host an API, an MCP server, an AI agent, a real-time server, or a webhook handler without standing up separate infrastructure. Functions run JavaScript or TypeScript on the Node.js runtime.</p>',
      initialState: 'open',
    },
    {
      question: 'How are Neon Functions different from lambda-style serverless?',
      answer:
        '<p>Functions run next to your data and stay open for long-running work. A Function can start responding within 15 minutes and keep streaming while data flows, so agents, WebSockets, and SSE connections aren&apos;t cut off by a short execution limit. They are still serverless: idle functions can be evicted.</p>',
    },
    {
      question: 'When should I use Neon Functions?',
      answer:
        '<p>Use Functions for backend APIs, AI agents, MCP servers, WebSockets, SSE, file upload handlers, webhook handlers, and other request-driven work that benefits from running close to your data. Hosting an MCP server is a common pattern: the Function stays close to Postgres, can keep a long-lived stream open, and gets <code>DATABASE_URL</code> plus other Neon credentials injected automatically, so the MCP tools can query and mutate the same branch as the rest of the backend.</p>',
    },
    {
      question: 'Should I run my frontend on Neon Functions?',
      answer:
        '<p>Run your frontend on your preferred web host. Use Functions for backend work that needs longer execution, persistent connections, or direct access to your Neon services.</p>',
    },
    {
      question: 'Can I run cron jobs or scheduled work?',
      answer:
        '<p>Yes. Function Triggers let Neon invoke a deployed Function on a cron schedule. Schedules run outside the Postgres compute, so they fire even when the database is scaled to zero. This replaces the pattern of running an external scheduler or keeping a compute awake for <code>pg_cron</code>. For queued, retryable background jobs with their own lifecycle, pair a Function with a job queue or workflow service. A native Neon job queue is a separate, upcoming offering.</p>',
    },
    {
      question: 'What are Function Triggers?',
      answer:
        '<p>Triggers tell Neon when to invoke a deployed Function. They live on a branch and point to a Function on that branch. A child branch inherits its parent&apos;s triggers, but they arrive disabled and don&apos;t run until you enable them, so branching production for a test doesn&apos;t fire the parent&apos;s schedule a second time. The first trigger type is cron schedules, with event-based triggers that react to activity inside Neon planned next.</p>',
    },
    {
      question: 'What happens to my Functions when I create a branch?',
      answer:
        '<p>Each branch runs its own copy of a Function, at its own URL, against its own database state. Your Function configuration branches with the rest of your backend, so a preview or test branch gets an isolated Function endpoint.</p>',
    },
    {
      question: 'How do I deploy a Function?',
      answer:
        '<p>Declare the Function in <code>neon.ts</code>, then run <code>neon deploy</code>. You can also deploy a single Function with the Neon CLI.</p>',
    },
    {
      question: 'Can I use a custom domain?',
      answer:
        '<p>Yes. You can serve a Function from your own hostname, such as <code>api.example.com</code>, instead of its native Neon invocation URL. Register the domain from the Neon Console, CLI, SDK, or API, add the returned CNAME record at your DNS provider, and Neon issues the TLS certificate automatically through Let&apos;s Encrypt. Custom domains are included with Functions with no separate charge; traffic is billed like any other Function traffic.</p>',
    },
    {
      question: 'How do custom domains work with branches?',
      answer:
        '<p>A custom domain is attached to one Function on one branch, not to the whole project. If you register <code>api.example.com</code> on production, that hostname keeps pointing at the production Function after you branch. Each hostname can be registered once, so a preview branch needs its own name, such as <code>preview.api.example.com</code>. Adding a custom domain doesn&apos;t authenticate the Function or disable its native Neon URL, so protect the Function with application-level authentication.</p>',
    },
    {
      question: 'How does Functions pricing work?',
      answer:
        '<p>Functions are pay-as-you-go on paid plans and billed on three parts: active compute while your code runs, waiting compute while a Function is idle but held ready, and invocations. Active compute is $0.10 per Capacity-Hour on Launch and $0.12 on Scale. Waiting compute is $0.025 per Capacity-Hour on Launch and $0.03 on Scale. Invocations are $0.60 per million on both plans. See the <a href="/pricing">pricing page</a> for current rates.</p>',
    },
    {
      question: 'Is there a free allowance for Functions?',
      answer:
        '<p>The Free plan includes 10 active Capacity-Hours, 400 waiting Capacity-Hours, and 1 million invocations per month. Custom domains and triggers are part of Functions and don&apos;t carry a separate charge.</p>',
    },
    {
      question: 'Which languages and runtimes do Functions support?',
      answer:
        '<p>Functions run JavaScript or TypeScript on the Node.js runtime. You can deploy JS/TS handlers or code that bundles to JavaScript for Node.js. A Function is any module whose default export provides a <code>fetch(request)</code> method that returns a web <code>Response</code>, the same handler shape used by other standards-based serverless runtimes. Hono is the recommended framework.</p>',
    },
    {
      question: 'Which regions are Functions available in?',
      answer:
        '<p>Functions run in the same region as your Neon branch. Region coverage is expanding; create your project in a supported region to use Functions. See the <a href="/docs/compute/functions/overview">Functions overview</a> for the current list.</p>',
    },
  ],
};

const aiGatewayPageContent = {
  slug: 'ai-gateway',
  pageLabel: 'AI Gateway',
  hero: {
    label: 'AI Gateway, powered by Databricks',
    title: aiGatewayHeroTitleLines.join(' '),
    titleLines: aiGatewayHeroTitleLines,
    illustrationDescription:
      'A Neon backend routing AI Gateway requests to models from multiple providers',
    primaryAction: { label: 'Start building', linkKey: 'signup' },
    secondaryAction: { label: 'Read the docs', linkKey: 'aiGatewayOverview' },
  },
  models: {
    title: aiGatewayModelsTitleLines.join(' '),
    titleLines: aiGatewayModelsTitleLines,
    highlightedTitle: aiGatewayModelsHighlightedTitleLines.join(' '),
    highlightedTitleLines: aiGatewayModelsHighlightedTitleLines,
  },
  gatewayBenefits: {
    title: 'LLMs belong in your backend.',
    highlightedTitle:
      'Call them with the same credential and the same bill as the rest of the Neon platform.',
    items: [
      {
        id: 'unified-access',
        label: 'Unified access',
        title: 'One credential for every provider.',
        description:
          'Authenticate just once with Neon and call AI agents through the same endpoint — no separate provider accounts to wire up.',
      },
      {
        id: 'simplified-billing',
        label: 'Simplified billing',
        title: 'One bill to pay.',
        description:
          'All your model usage lands directly on your Neon invoice, next to Postgres, Storage, and Auth. One vendor, one payment method, one line in your accounting.',
      },
      {
        id: 'fair-pricing',
        label: 'Fair pricing',
        title: 'Zero markup.',
        description:
          'Neon charges the same per-token rate as the model provider — published prices, passed through with nothing added on top.',
      },
    ],
  },
  compatibility: {
    label: 'Compatibility',
    title:
      'Powered by Databricks Foundation Model APIs. OpenAI-compatible, so your SDK already works.',
    description:
      'Pointing a standard client at Neon takes a URL and credential change — the rest of your code stays exactly as it is.',
    items: [
      {
        title: 'Base URL.',
        description:
          "Point your existing client at your branch's gateway endpoint instead of the provider's.",
      },
      {
        title: 'Credential.',
        description:
          'Replace the provider key with your Neon key — nothing else in the environment changes.',
      },
      {
        title: 'Request shape.',
        description: 'Chat completions and streaming follow the format you already write.',
      },
      {
        title: 'Model switching.',
        description: 'Move between providers by changing the model name, not the integration.',
      },
    ],
  },
  faqItems: [
    {
      question: 'What is AI Gateway?',
      answer:
        '<p>AI Gateway is the LLM inference layer built into your Neon project. It runs on Databricks Foundation Model APIs. Use your Neon credential to call models from multiple providers through one endpoint, without setting up separate provider accounts.</p>',
      initialState: 'open',
    },
    {
      question: 'Which models can I call?',
      answer:
        '<p>AI Gateway includes frontier and open-weight models from Anthropic, OpenAI, Google, Meta, Alibaba, Zhipu AI, Moonshot AI, Thinking Machines, and others. The catalog changes as models are added or retired, and availability can vary by region. Check the <a href="/docs/ai-gateway/models#available-models">live model catalog</a> for current models, prices, and supported endpoints.</p>',
    },
    {
      question: 'What is the difference between Neon AI Gateway and Databricks Unity AI Gateway?',
      answer:
        '<p>Both use <a href="https://docs.databricks.com/aws/en/machine-learning/foundation-model-apis/">Databricks Foundation Model APIs</a> for model serving. Neon AI Gateway is built into Neon projects and credentials for developers building applications and agents. Databricks Unity AI Gateway provides centralized governance for AI traffic within the Databricks Platform.</p>',
    },
    {
      question: 'How does AI Gateway relate to the rest of the Neon backend?',
      answer:
        '<p>AI Gateway shares the same project and branch boundaries as Lakebase Postgres, Functions, Object Storage, and Managed Better Auth. A Function receives <code>NEON_AI_GATEWAY_TOKEN</code> and <code>NEON_AI_GATEWAY_BASE_URL</code> alongside <code>DATABASE_URL</code>, so it can call a model and write results to Postgres without separate provider keys.</p>',
    },
    {
      question: 'Do I need to run my application on Neon to use AI Gateway?',
      answer:
        '<p>No. Any application or service that can make an HTTPS request with a bearer token can call AI Gateway. Running model calls in Functions keeps them close to the other services in your Neon backend and lets them follow the same branching workflow.</p>',
    },
    {
      question: 'What happens to AI Gateway when I create a branch?',
      answer:
        '<p>Each Neon branch has its own AI Gateway endpoint. Requests from a development or preview branch stay scoped to that branch, separate from production.</p>',
    },
    {
      question: 'Do I have to change my code to use AI Gateway?',
      answer:
        '<p>For an OpenAI-compatible client, change the base URL and credential. The request and streaming formats stay the same. AI Gateway also provides provider-specific endpoints when you need features from the OpenAI Responses API, Anthropic Messages API, or Gemini API.</p>',
    },
    {
      question: 'Who can use AI Gateway after GA?',
      answer:
        '<p>AI Gateway is available on the Neon Launch and Scale plans. Both plans have the same AI Gateway pricing. You need prepaid AI Gateway credits before you can make inference requests. Model access can also depend on region, availability, and any verification required by provider policies.</p>',
    },
    {
      question: 'How does AI Gateway pricing work?',
      answer:
        '<p>Inference is billed per token at the published rate for each model, with no additional Neon markup. One AI Gateway credit equals $1 USD. The minimum credit purchase is $5, and purchased credits are valid for 12 months. Check the <a href="/docs/ai-gateway/models#available-models">model catalog</a> for current per-model rates.</p>',
    },
    {
      question: 'What are the rate limits?',
      answer:
        '<p>AI Gateway applies a default limit of 200,000 tokens per minute (TPM). These are default limits and can be increased on request. If you hit a limit, requests return HTTP 429 and the error body explains which limit you reached. <a href="/docs/introduction/support">Contact support</a> if you need a higher TPM limit.</p>',
    },
    {
      question: 'How do I buy and manage credits?',
      answer:
        '<p>Buy credits from the Billing page in the Neon Console. Credits are added to your AI Gateway balance after payment and accumulate across purchases. You can see your current balance in the Neon Console. Automatic top-ups can add credits when your balance falls below a threshold.</p>',
    },
    {
      question: 'How are credits deducted?',
      answer:
        '<p>Each inference request deducts credits based on the model&apos;s token price and the final number of tokens reported by the serving system. Balance updates can take about five minutes. A failed request can still be billed if the model consumed tokens before the request failed.</p>',
    },
    {
      question: 'What happens when my credit balance runs out?',
      answer:
        '<p>AI Gateway stops accepting new inference requests when the available balance is too low. Requests already in progress can finish and are charged for the tokens they consume. Because usage reporting is not instantaneous, your balance can fall slightly below zero. Neon applies a $2 minimum balance to account for this delay.</p>',
    },
    {
      question: 'Do credits expire?',
      answer:
        '<p>Purchased credits are valid for 12 months from the purchase date. Promotional credits can have a different expiration date. Check the Billing page or the terms of the promotion for the applicable date.</p>',
    },
    {
      question: "Why can't I access a model in the catalog?",
      answer:
        '<p>Model access can vary by region and account. Proprietary models may require account verification to meet provider requirements. Use the authenticated <code>GET /v1/models</code> endpoint and check for <code>enabled: true</code> to see which models your account can call.</p>',
    },
  ],
};

const lakebasePageContent = {
  slug: 'lakebase',
  pageLabel: 'Lakebase Postgres',
  hero: {
    label: 'Lakebase Postgres',
    title: 'The Neon database: Lakebase Postgres',
    illustrationDescription:
      'An application connected to Lakebase Postgres and Neon backend services',
    primaryAction: { label: 'Start building', linkKey: 'signup' },
    secondaryAction: { label: 'Read the docs', linkKey: 'postgresOverview' },
  },
  architecture: {
    title: 'Built on the',
    highlightedTitle: 'lakebase architecture.',
    titleAfterHighlight:
      'Decoupled storage and compute, with object storage + WAL as the foundation.',
    description: 'Deploy, scale, branch, replicate, and restore instantly,',
    secondaryDescription:
      'without moving or duplicating your underlying data between environments.',
    features: [
      {
        title: 'Ephemeral compute',
        description:
          'Provisions instantly, autoscales with load, and scales to zero when idle, restarting in <1s.',
      },
      {
        title: 'Shared storage',
        description:
          'The same versioned storage built on WAL serves every branch and replica in a project.',
      },
      {
        title: 'Agent-ready',
        description: 'Operations are lightweight and run through the API, CLI, SDKs, and MCP.',
      },
    ],
  },
  autoscaling: {
    label: 'Autoscaling',
    title: 'Compute follows your traffic. No overprovisioning or performance hiccups.',
    description:
      'There’s no instance to size and no manual resizes in Lakebase Postgres: your database autoscales in real time',
    features: [
      {
        title: 'Scales under load',
        description:
          'Compute moves within your set range, up during spikes and down during slow times.',
      },
      {
        title: 'Suspends when idle',
        description:
          'After five minutes without activity (e.g. in dev environments), compute scales to zero.',
      },
      {
        title: 'Only bills for what runs',
        description:
          'You pay for the compute you actually use, without having to worry about sizing.',
      },
    ],
    tabs: [
      { label: 'Avoid outages', number: 13024, text: 'outages prevented by Autoscaling this year' },
      { label: 'Save costs', prefix: '$', number: 345966, text: 'saved by Autoscaling every day' },
    ],
    legend: ['Neon autoscaling', 'Database load', 'Fixed-resource provisioned'],
    caption:
      'Neon monitors your database load ten times a second and autoscales CPU and memory to exactly fit your workload.',
  },
  configuration: {
    label: 'Data API',
    title: 'Query Postgres directly from browsers, edge runtimes, and serverless functions.',
    filename: 'data-api.ts',
    code: `await fetch(\`\${DATA_API_URL}/projects\`, {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${token}\`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "New project"
  })
})`,
    items: [
      {
        title: 'Instant REST API',
        description:
          'Turn Postgres tables, views, and functions into REST endpoints you can access directly over HTTPS.',
      },
      {
        title: 'Secure access',
        description:
          'Authenticate with JWTs and use Postgres Row-Level Security to control who can access and modify your data.',
      },
      {
        title: 'PostgREST compatible',
        description:
          'Bring any PostgREST client, including <code>@neondatabase/postgrest-js</code>, and keep familiar filtering, ordering, pagination, and CRUD patterns.',
      },
    ],
  },
  dynamicDatabases: {
    title:
      'Agents demand new database primitives like branching, together with instant deploys and restores, and full CLI/MCP coverage.',
    highlightedTitle: '',
    capabilities: [
      {
        id: 'instant-branching',
        label: 'Instant Branching',
        primary: 'Create a full copy of production in about a second,',
        secondary:
          'without duplicating storage, so a 1 TB branch takes just as long to create as a 1 GB branch.',
        benefits: [
          {
            icon: 'branching',
            title: 'An environment per unit of work',
            description:
              'Every PR, version, test, and preview can have its own backend branch, following your code.',
          },
          {
            icon: 'api',
            title: 'Fully programmable',
            description:
              'Creating and deleting branches is a lightweight metadata operation: your agent and the API can manage it end to end.',
          },
          {
            icon: 'storage',
            title: 'The whole backend branches',
            description:
              'A Neon branch also carries its own Object Storage namespace, its own Functions, its own AI Gateway endpoint, and its own auth.',
          },
        ],
      },
      {
        id: 'restore-to-any-point',
        label: 'Restore to any point',
        primary: 'Roll back instantly to any point in your database history,',
        secondary:
          'without copying data, so restore time stays small no matter how large your database is.',
      },
      {
        id: 'database-built-for-agents',
        label: 'A database built for agents',
        primary: 'Let agents deploy and operate isolated database environments',
        secondary:
          'for every task, session, or pull request, with full isolation and undos always at hand.',
      },
    ],
  },
  fromFirstLine: {
    title: lakebaseFromFirstLineTitleLines.join(' '),
    titleLines: lakebaseFromFirstLineTitleLines,
    description:
      'From early-stage startups to Fortune 500 organizations, Lakebase Postgres gives you the same flexible foundation to build, scale, and run production workloads with confidence.',
    slides: [
      {
        title: 'Ship faster with a small team',
        description:
          'Adopt branching workflows and grow your startup faster. Don’t let the database lag the speed at which you ship code.',
        tags: [],
        testimonial: {
          quote:
            'We’ve been able to manage 300K+ Postgres databases via the Neon API. It saved us a tremendous amount of time and engineering effort.',
          highlight: '300K+ Postgres databases',
          author: 'Himanshu Bhandoh',
          company: 'Software Engineer at Retool',
          logo: {
            src: '/images/case-studies/retool-dark.svg',
            width: 95,
            height: 20,
            alt: 'Retool',
            className: 'h-5 w-[95px]',
          },
          caseStudyLabel: 'Read case study',
          caseStudyUrl:
            '/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases',
        },
      },
      {
        title: 'Scale with unpredictable demand',
        description:
          'Let compute follow traffic automatically, from sudden AI-agent spikes to quiet periods, without manual capacity planning.',
        tags: [],
        testimonial: {
          quote:
            'The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer',
          highlight: 'flexible resource limits',
          author: 'Lincoln Bergeson',
          company: 'Infrastructure Engineer',
          logo: {
            src: '/images/case-studies/replit.svg',
            width: 120,
            height: 32,
            alt: 'Replit',
            className: 'h-8 w-[120px] brightness-0',
          },
          caseStudyLabel: 'Read case study',
          caseStudyUrl: '/blog/neon-replit-integration',
        },
      },
      {
        title: 'Move fast without managing infrastructure',
        description:
          'Keep the developer experience simple while the database scales efficiently with your product and team.',
        tags: [],
        testimonial: {
          quote:
            'What first attracted us to Neon was the efficient scaling. What kept us interested were all the thoughtful developer-experience wins.',
          highlight: 'thoughtful developer-experience wins.',
          author: 'Ben Halpern',
          company: 'DEV Co-Founder',
          logo: {
            src: '/images/case-studies/dev-dark.svg',
            width: 41,
            height: 32,
            alt: 'DEV',
            className: 'h-8 w-[41px]',
          },
          caseStudyLabel: 'Read case study',
          caseStudyUrl: '/blog/dev-from-heroku-to-neon',
        },
      },
    ],
  },
  faqItems: [
    {
      question: 'Is this standard Postgres?',
      answer:
        '<p>In terms of compatibility, yes. Lakebase Postgres is Postgres — your existing drivers, ORMs, migration tools, and everything else from the Postgres ecosystem works unchanged. What’s different is the architecture underneath.</p>',
      initialState: 'open',
    },
    {
      question: 'What is the lakebase architecture, and how does it relate to Databricks Lakebase?',
      answer:
        '<p>The lakebase architecture separates standard Postgres compute from durable, versioned storage. Neon Lakebase Postgres and Databricks Lakebase run on the same core technology: Neon delivers it as part of a developer backend, while Databricks integrates it with the Data Intelligence Platform.</p>',
    },
    {
      question: 'How fast is branching, and does database size change that?',
      answer:
        '<p>A branch is typically ready in about a second, regardless of database size. Creating one records a pointer into the existing versioned storage instead of copying the database; only data changed after the branch point consumes additional storage.</p>',
    },
    {
      question: 'What happens when my database is idle?',
      answer:
        '<p>Its compute can scale to zero after a period of inactivity while durable storage remains available. The database wakes automatically on the next connection, and suspended compute does not consume compute hours.</p>',
    },
    {
      question: 'How does pricing work?',
      answer:
        '<p>Neon uses usage-based pricing. You pay for the compute time and storage you actually consume, with plan allowances for branches and restore history. Scale to zero and automatic branch expiration help keep temporary environments inexpensive.</p>',
    },
    {
      question: 'Can agents provision and operate databases?',
      answer:
        '<p>Yes. Agents can use the Neon API, CLI, SDKs, and MCP Server to create isolated branches and databases, run SQL, inspect state, and clean up environments programmatically.</p>',
    },
  ],
};

const sharedBackendPlatformContent = {
  faqTitle: faqTitleLines.join(' '),
  faqTitleLines,
  backendServices: {
    title: 'Your Postgres branches with everything else.',
    highlightedTitle:
      'Create a branch and your whole backend forks with it — database, storage, auth, and a gateway endpoint of its own.',
    itemsByVideo: {
      'postgres-database': {
        title: 'Lakebase Postgres',
        description: 'Serverless Postgres that scales and branches with your app.',
      },
      authentication: {
        title: 'Authentication',
        description: 'Managed auth with users and sessions stored in Postgres.',
      },
      compute: {
        title: 'Compute',
        description: 'Functions without timeouts running close to your database.',
      },
      storage: {
        title: 'Storage',
        description: 'S3-compatible object storage that branches with your projects.',
      },
      'ai-gateway': {
        title: 'AI Gateway',
        description: 'One API for all frontier & open-source models, powered by Databricks.',
      },
    },
  },
  builtForAgents: {
    title: builtForAgentsTitleLines.join(' '),
    titleLines: builtForAgentsTitleLines,
    description:
      "Every service is designed with the same API and operational model, whether it's used by a developer or called directly by an AI agent. Build once, then let both humans and agents use the same platform without additional integration work.",
    items: [
      {
        id: 'branchable',
        title: 'Branchable',
        description:
          "Spin up isolated environments to test model changes safely, without touching production. Merge changes only when they're ready.",
      },
      {
        id: 'serverless',
        title: 'Serverless',
        description:
          'Usage-based infrastructure that scales automatically with your traffic, so you only pay for what you use and nothing while idle.',
      },
      {
        id: 'agent-ready',
        title: 'Agent-ready',
        description:
          'Provision and operate every service through APIs that AI agents can call directly, using the same interfaces as developers.',
      },
    ],
  },
  backedBy: {
    label: 'Backed by giants',
    title: 'Trusted at scale.',
    highlightedTitle: 'Neon has been part of the Databricks Platform since May 2025.',
    trustedByLabel: 'Trusted by the best',
    metrics: [
      {
        value: '20M+',
        description: 'Databases started daily - built for scale and reliability.',
      },
      {
        value: '3M+',
        description: 'Developers building on Neon worldwide',
      },
    ],
    quotes: [
      {
        text: [
          "Neon's serverless philosophy is ",
          'aligned with our vision:',
          ' no infrastructure to manage, no servers to provision, no database cluster to maintain.',
        ],
        highlight: 'aligned with our vision:',
        author: 'Edouard Bonlieu',
        post: 'Co-founder at Koyeb',
      },
      {
        text: ['Neon allows us to develop much ', "faster than we've even been", ' used to.'],
        highlight: "faster than we've even been",
        author: 'Alex Klarfeld',
        post: 'CEO and co-founder of Supergood.ai',
      },
      {
        text: [
          'The killer feature',
          ' that convinced us to use Neon was branching: it keeps our engineering velocity high.',
        ],
        highlight: 'The killer feature',
        author: 'Léonard Henriquez',
        post: 'Co-founder and CTO, Topo.io',
      },
      {
        text: [
          "We've been able to ",
          'automate virtually all database tasks',
          ' via the Neon API, saving us a tremendous amount of time and engineering effort.',
        ],
        highlight: 'automate virtually all database tasks',
        author: 'Himanshu Bhandoh',
        post: 'Software Engineer at Retool',
      },
    ],
  },
  cta: {
    title: 'Talk to us.',
    description: 'Fill out a short form and we’ll get back to you within a few business days.',
    label: 'Get help',
    buttonText: 'Contact us',
    linkKey: 'contactSales',
  },
};

module.exports = {
  functionsPageContent,
  aiGatewayPageContent,
  lakebasePageContent,
  sharedBackendPlatformContent,
};

const functionsBranchingTitleLines = ['Functions that branch with', 'the rest of your stack.'];
const aiGatewayHeroTitleLines = ['Call the latest models right', 'from your Neon backend'];
const aiGatewayModelsTitleLines = ['Access a wide catalog of frontier and open', 'weight models.'];
const aiGatewayModelsHighlightedTitleLines = [
  'Served with optimized performance',
  'via Databricks.',
];
const builtForAgentsTitleLines = ['Built for agents,', 'not just developers.'];
const faqTitleLines = ['Your questions,', 'answered'];

const functionsPageContent = {
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
      question: 'What are Functions?',
      answer:
        "<p>Neon Functions are serverless Node.js functions you deploy onto a Neon branch, in the same region as your <strong>Lakebase Postgres</strong> database. DATABASE_URL is injected automatically, along with <strong>AI Gateway</strong> and <strong>Object Storage</strong> credentials if you're using them, so a function reads process.env instead of assembling third-party accounts.</p>",
      initialState: 'open',
    },
    {
      question: 'How are they different from lambda-style serverless?',
      answer:
        '<p>Neon Functions support long-running requests, streaming responses, WebSockets, and server-sent events without the short execution windows common to lambda-style runtimes.</p>',
    },
    {
      question: 'When should I call Neon Functions?',
      answer:
        '<p>Use Functions for backend APIs, AI agents, MCP servers, WebSockets, SSE, and other request-driven work that benefits from running close to your data.</p>',
    },
    {
      question: 'Should I run my frontend on Neon Functions?',
      answer:
        '<p>Run your frontend on your preferred web host. Use Neon Functions for backend work that needs longer execution, persistent connections, or direct access to your Neon services.</p>',
    },
    {
      question: 'Can I run cron jobs or background work?',
      answer:
        '<p>Functions are designed for request and response workloads. Use a dedicated job system for scheduled or durable background processing.</p>',
    },
    {
      question: 'What happens to my functions when I create a Neon branch?',
      answer:
        '<p>Your function configuration branches with the rest of your backend, giving the branch isolated data and its own function endpoint.</p>',
    },
    {
      question: 'How do I deploy a function?',
      answer:
        '<p>Declare the function in <code>neon.ts</code>, then run <code>neon deploy</code>. You can also deploy a single function with the Neon CLI.</p>',
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
        '<p>AI Gateway is an LLM inference layer built right into your Neon project. It runs on Databricks Foundation Model APIs, the same serving engine Databricks uses for its own inference. You use your Neon credential to call a wide catalog of models from several providers through a single endpoint, with no third-party accounts to set up, all billed via Neon.</p>',
      initialState: 'open',
    },
    {
      question: 'Which models can I call?',
      answer:
        '<p>Call frontier and open-weight models from providers including Anthropic, OpenAI, Google, Meta, and Alibaba. The live model catalog above is sourced from the same data as our documentation.</p>',
    },
    {
      question: 'What is the difference between Neon AI Gateway and Databricks Unity AI Gateway?',
      answer:
        '<p>Neon AI Gateway is the inference layer built into a Neon project and credential. Databricks Unity AI Gateway is designed for centralized enterprise governance inside the Databricks platform. Neon uses Databricks Foundation Model APIs for model serving while keeping setup and billing inside Neon.</p>',
    },
    {
      question: 'How does AI Gateway relate to the rest of the Neon backend?',
      answer:
        '<p>It shares the same project and branch boundaries as your Postgres database, authentication, storage, and functions. That gives each environment its own endpoint and lets the complete backend move together.</p>',
    },
    {
      question: 'Do I need to run my app on Neon to use AI Gateway?',
      answer:
        '<p>No. Any application or service that can make HTTPS requests can call the gateway. Neon Functions are optional and are useful when you want model calls to run close to the rest of your backend.</p>',
    },
    {
      question: 'What happens when I branch?',
      answer:
        '<p>The new branch receives its own AI Gateway endpoint and branch-scoped credentials alongside the rest of its Neon backend, so you can test model or application changes without touching production.</p>',
    },
    {
      question: 'Do I have to change my code to switch to Neon AI Gateway?',
      answer:
        '<p>OpenAI-compatible clients only need a Neon base URL and credential. Your request and streaming formats stay the same, and switching providers is usually just a model-name change.</p>',
    },
    {
      question: 'How does pricing work?',
      answer:
        '<p>AI Gateway is free during beta on paid Neon plans. When billing begins, Neon will pass through each provider’s published per-token rate with zero markup. See the model catalog for current rates.</p>',
    },
  ],
};

const sharedBackendPlatformContent = {
  faqTitle: faqTitleLines.join(' '),
  faqTitleLines,
  backendServices: {
    title: 'Your LLM branches with everything else.',
    highlightedTitle:
      'Create a branch and your whole backend forks with it — database, storage, auth, and a gateway endpoint of its own.',
    itemsByVideo: {
      'postgres-database': {
        title: 'Postgres Database',
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
    highlightedTitle: 'The numbers behind every project running on Neon.',
    trustedByLabel: 'Trusted by the best',
    metrics: [
      {
        value: '60%',
        description:
          'Cheaper than running the same infrastructure yourself, once you factor in maintenance.',
      },
      {
        value: '>90%',
        description:
          'Success rate on operations run directly by agents, from provisioning to schema changes.',
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
    title: 'Building something ambitious?',
    description: 'Fill out a short form and we’ll get back to you within a few business days.',
    label: 'Get started',
    buttonText: 'Apply now',
    linkKey: 'contactSales',
  },
};

module.exports = {
  functionsPageContent,
  aiGatewayPageContent,
  sharedBackendPlatformContent,
};

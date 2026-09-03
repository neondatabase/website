const functionsBranchingTitleLines = ['Functions that branch with', 'the rest of your stack.'];
const aiGatewayHeroTitleLines = ['Call the latest models right', 'from your Neon backend'];
const aiGatewayModelsTitleLines = ['Access a wide catalog of frontier and open', 'weight models.'];
const aiGatewayModelsHighlightedTitleLines = [
  'Served with optimized performance',
  'via Databricks.',
];
const builtForAgentsTitleLines = ['Built for agents,', 'not just developers.'];
const faqTitleLines = ['Your questions,', 'answered'];
const lakebaseFromFirstLineTitleLines = [
  'From your first line of code',
  'to the world’s largest teams.',
];

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

const lakebasePageContent = {
  slug: 'lakebase',
  pageLabel: 'Lakebase Postgres',
  hero: {
    label: 'Lakebase Postgres',
    title: 'Postgres for apps and agents, built on the lakebase architecture.',
    illustrationDescription:
      'An application connected to Lakebase Postgres and Neon backend services',
    primaryAction: { label: 'Start building', linkKey: 'signup' },
    secondaryAction: { label: 'Read the docs', linkKey: 'postgresOverview' },
  },
  architecture: {
    title:
      'Decoupled storage and compute, with object storage + WAL as the durable foundation for instant',
    highlightedTitle: 'provisioning, scaling, branching, and recovery.',
    description: 'Deploy, scale, branch, replicate, and restore instantly —',
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
  dynamicDatabases: {
    title: 'As software becomes more dynamic and autonomous, databases need to evolve too:',
    highlightedTitle: 'branch, rewind, and operate programmatically.',
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
          'without copying data, so restore time stays constant no matter how large your database is.',
      },
      {
        id: 'database-built-for-agents',
        label: 'A database built for agents',
        primary: 'Let agents create and operate isolated database environments',
        secondary:
          'for every task, session, or pull request, with changes kept separate and recovery always at hand.',
      },
    ],
  },
  fromFirstLine: {
    title: lakebaseFromFirstLineTitleLines.join(' '),
    titleLines: lakebaseFromFirstLineTitleLines,
    description:
      'From early-stage teams to Fortune 500 organizations, Lakebase Postgres gives you the same flexible foundation to build, scale, and run production workloads with confidence.',
    slides: [
      {
        title: 'Ship faster with a small team',
        description:
          'Adopt branching workflows and grow your startup faster. Don’t let the database lag the speed at which you ship code.',
        tags: [
          { icon: 'serverless', label: 'Serverless apps' },
          { icon: 'autoscaling', label: 'Autoscaling' },
        ],
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
        tags: [
          { icon: 'serverless', label: 'Serverless apps' },
          { icon: 'autoscaling', label: 'Autoscaling' },
        ],
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
        tags: [
          { icon: 'serverless', label: 'Serverless apps' },
          { icon: 'autoscaling', label: 'Autoscaling' },
        ],
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
  lakebasePageContent,
  sharedBackendPlatformContent,
};

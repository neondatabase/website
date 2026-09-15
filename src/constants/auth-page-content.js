const authPageContent = {
  slug: 'auth',
  pageLabel: 'Auth',
  backendServicesTitle: 'Your auth branches with everything else.',
  faqItems: [
    {
      question: 'What is Managed Better Auth?',
      answer:
        '<p>Managed authentication built on Better Auth, as part of the Neon backend. Users, sessions, and OAuth config live in your database, in the <code>neon_auth</code> schema, so you can query them with SQL and pair them with RLS. There is no auth server to run. Configure it in the Console, then use the client or server SDK in your app.</p>',
      initialState: 'open',
    },
    {
      question: 'Why would auth need to branch?',
      answer:
        '<p>Branching gives each preview its own isolated copy of users, sessions, and auth configuration alongside your application data. Test sign-up, login, OAuth, password resets, and permission changes without affecting production or other branches.</p>',
    },
    {
      question: 'What happens to sessions when I branch?',
      answer:
        '<p>Session records are copied with the database, but browser cookies remain scoped to their original domain. You need to sign in again on the preview environment. Each branch has its own Auth API URL, and tokens issued in one branch are not valid in another.</p>',
    },
    {
      question: 'Is this the same as self-hosting Better Auth?',
      answer:
        '<p>Managed Better Auth uses the Better Auth foundation, with Neon operating the auth service and integrating it with database branching. Self-hosting gives you full control over your auth code and infrastructure, including custom plugins and hooks that the managed service may not support. See the <a href="/docs/auth/overview#when-to-use-managed-better-auth-vs-self-hosting-better-auth">comparison in the docs</a>.</p>',
    },
    {
      question: 'Can my coding agent set this up?',
      answer:
        '<p>Yes. Use the AI editor setup in the docs to add Managed Better Auth to your app. Your agent can enable auth, configure the SDK and environment variables, and test sign-up and login on an isolated branch using test credentials. <a href="/docs/auth/overview#set-up-with-your-ai-editor">Set up with your AI editor</a>.</p>',
    },
    {
      question: 'How does pricing work?',
      answer:
        '<p>Managed Better Auth is included in Neon plans, with usage measured in monthly active users (MAU). An MAU is a unique user who authenticates at least once during the monthly billing period. See <a href="/pricing">Neon pricing</a> for the allowances in each plan.</p>',
    },
  ],
  hero: {
    label: 'Managed Better Auth for Lakebase Postgres',
    title: 'Better Auth that branches, managed by Neon',
    titleLines: ['Better Auth that branches,', 'managed by Neon'],
    illustrationDescription:
      'Sign-up and password recovery interfaces connected to user records in the Neon Postgres database.',
    primaryAction: {
      label: 'Start building',
      linkKey: 'signup',
    },
    secondaryAction: {
      label: 'Read the docs',
      linkKey: 'authOverview',
    },
  },
  benefits: {
    title: 'Test real login flows.',
    highlightedTitle:
      'When you deploy a Neon branch, auth branches too, so your previews fully reflect production.',
    items: [
      {
        id: 'foundation',
        label: 'Foundation',
        title: 'Built on Better Auth',
        description:
          'The Better Auth foundation your team (and agent) already knows, plus branching.',
        badges: [
          {
            id: 'better-auth',
            label: 'Better Auth',
          },
          {
            id: 'familiar-apis',
            label: 'Familiar APIs',
          },
          {
            id: 'open-source',
            label: 'Open source',
          },
        ],
      },
      {
        id: 'managed',
        label: 'Managed',
        title: 'Managed by Neon',
        description:
          'Neon operates the auth layer for you, so you can ship authentication without provisioning, maintaining, or scaling separate infrastructure.',
        badges: [
          {
            id: 'no-infrastructure',
            label: 'No infrastructure',
          },
          {
            id: 'built-in-auth',
            label: 'Built-in auth',
          },
        ],
      },
      {
        id: 'sdks',
        label: 'SDKs',
        title: 'Client and server SDKs',
        description:
          'Use client and server SDKs to add sign-in, sessions, OAuth, and account flows without wiring everything together yourself.',
        badges: [
          {
            id: 'client-server',
            label: 'Client + server',
          },
          {
            id: 'sign-in-sessions',
            label: 'Sign-in & sessions',
          },
        ],
      },
    ],
  },
  identity: {
    label: 'Backend compute',
    title: 'Users, sessions, and auth live in Postgres.',
    highlightedTitle:
      'Keep identity data and auth configuration right in your backend, not on an external service.',
    inspectAuth: {
      title: 'Inspect auth with SQL.',
      descriptionBeforeCode: 'The',
      code: 'neon_auth',
      descriptionAfterCode:
        'schema gives teams a concrete place to inspect auth state and connect identity to RLS-based access rules.',
    },
    identityData: {
      title: 'Keep identity with your data.',
      description:
        'Keep users and sessions close to application data without syncing identity from another provider.',
    },
  },
  branching: {
    label: 'Branches with your data',
    title: 'Build previews you can actually log into',
    description:
      "Sign up, log in, reset a password, complete OAuth. When you're done testing, delete the branch.",
    diagramAlt:
      'A production branch forks a preview branch with its own users, auth, and sessions. A preview user is verified and their session becomes active. A separate staging branch is deleted after its tests pass.',
    caption: 'Deploy one Neon branch per preview',
    capabilities: [
      {
        id: 'sign-up',
        label: 'Sign up',
      },
      {
        id: 'login',
        label: 'Login',
      },
      {
        id: 'oauth',
        label: 'OAuth',
      },
      {
        id: 'password-reset',
        label: 'Password reset',
      },
      {
        id: 'rls',
        label: 'RLS',
      },
    ],
  },
  setupSteps: {
    title: 'Ask your coding agent to deploy and configure Managed Better Auth.',
    highlightedTitle: 'Deploy a preview branch and start testing.',
    items: [
      {
        id: 'enable',
        title: 'Enable',
        description:
          'Turn on Managed Better Auth on the Neon branch, from the prompt, the CLI, or the Console.',
      },
      {
        id: 'configure',
        title: 'Configure',
        description: 'Add Google OAuth, email and password, trusted domains on that branch.',
      },
      {
        id: 'wire-your-app',
        title: 'Wire your app',
        description: 'The agent installs the SDK, env vars, and sign-in routes for your framework.',
      },
      {
        id: 'preview',
        title: 'Preview',
        description:
          'A child branch gets its own users, sessions, and auth URL. Test real logins, then delete it.',
      },
    ],
  },
};

module.exports = { authPageContent };

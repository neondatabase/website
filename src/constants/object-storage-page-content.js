const objectStoragePageContent = {
  slug: 'object-storage',
  pageLabel: 'Object Storage',
  hero: {
    label: 'Neon Object Storage',
    title: 'Files that branch with your Neon database',
    illustrationDescription:
      'Creating a Neon preview branch forks the Postgres database and its S3-compatible object storage together, including tables, data, files, and assets.',
    primaryAction: { label: 'Start building', linkKey: 'signup' },
    secondaryAction: { label: 'Read the docs', linkKey: 'objectStorageOverview' },
  },
  storageBenefits: {
    title: 'In one step, branch both your database and your files.',
    highlightedTitle:
      'Your buckets come with your Postgres data into isolated environments, without duplicating storage.',
    items: [
      {
        id: 's3-compatible',
        label: 'S3 compatible',
        title: 'Keep your stack',
        description:
          'boto3, the AWS SDK, and the CLI work with Neon Object Storage out of the box. Swap the endpoint and keep your existing code.',
      },
      {
        id: 'one-credential',
        label: 'One credential',
        title: 'No separate cloud account',
        description:
          'Authenticate with a Neon credential instead of a separate AWS account and IAM setup.',
      },
      {
        id: 'branchable-storage',
        label: 'Branchable storage',
        title: 'Buckets that branch with your database.',
        description:
          "No files are duplicated up front (it's copy-on-write). The bill only grows if the branch diverges.",
      },
    ],
  },
  isolatedEnvironments: {
    title: 'Test on real environments.',
    highlightedTitle:
      'On Neon, a branch forks Postgres and your files together, with nothing duplicated upfront.',
    items: [
      {
        id: 'isolated-by-default',
        title: 'Isolated by default',
        description:
          'Uploads and deletes on a preview or PR branch never touch production or any sibling branch.',
      },
      {
        id: 'copy-on-write',
        title: 'Copy-on-write',
        description:
          'Creating a branch doesn’t copy your objects. You pay for what diverges, not for a second bucket.',
      },
      {
        id: 'disposable',
        title: 'Disposable',
        description:
          'Delete the branch and its files go with it. Same workflow for a human, a CI job, or an agent.',
      },
    ],
  },
  configuration: {
    label: 'Agent-first',
    title: 'Ask your agent: deploy Postgres and files via the Neon backend',
    filename: 'neon.ts',
    code: `import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  preview: {
    aiGateway: true,
    buckets: {
      uploads: {},
    },
  },
});`,
    items: [
      {
        title: 'One config',
        description:
          'Define your bucket alongside Postgres and keep your database and files together in the same <code>neon.ts</code> configuration.',
      },
      {
        title: 'One deploy',
        description:
          'Run <code>neon deploy</code> to provision the bucket and automatically pull the required S3 variables into your <code>.env.local</code>.',
      },
      {
        title: 'Agent tools',
        description: 'Agents are a first-class interface through Neon’s API, CLI, and MCP server.',
      },
    ],
  },
  faqItems: [
    {
      question: 'What is Neon Object Storage?',
      answer:
        '<p>S3-compatible blob storage for your files, built into the Neon backend. This is different from the object store Lakebase Postgres uses internally for database pages. You upload objects into buckets, point a standard S3 client at your branch endpoint, and authenticate with a Neon credential.</p>',
      initialState: 'open',
    },
    {
      question: 'What happens to my files when I branch?',
      answer:
        '<p>The child branch inherits your buckets and objects with your database. Each branch has its own isolated storage namespace, so uploads and deletes on one branch do not affect its parent or siblings.</p>',
    },
    {
      question: 'Do I pay for a full copy of my files on every branch?',
      answer:
        '<p>No. Branching uses copy-on-write, so creating a branch does not duplicate your objects upfront. Storage grows as the branch diverges.</p>',
    },
    {
      question: 'Do I need an AWS account?',
      answer:
        '<p>No. Use your Neon storage credential and branch endpoint with an S3-compatible client. There is no separate AWS account or IAM setup to manage.</p>',
    },
    {
      question: 'How do I add a bucket to a project?',
      answer:
        '<p>Declare a bucket under <code>preview.buckets</code> in <code>neon.ts</code>, then run <code>neon deploy</code> to provision it and pull the S3 variables into <code>.env.local</code>. You can also create buckets from the Neon Console, CLI, Neon API, or S3 API.</p>',
    },
    {
      question: 'Is this the same credential I use for Postgres?',
      answer:
        '<p>Object Storage uses Neon’s scoped-credential system, shared with AI Gateway, with storage read and write scopes. Your S3 client uses the credential’s Access Key ID and Secret Access Key. Postgres connections use your database role and connection string.</p>',
    },
  ],
  backendServicesTitle: 'Your files branch with everything else.',
};

module.exports = { objectStoragePageContent };

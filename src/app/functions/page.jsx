import BackendPlatformPage from 'components/pages/backend-platform/backend-platform-page';
import BackendCompute from 'components/pages/functions/backend-compute';
import Branching from 'components/pages/functions/branching';
import Hero from 'components/pages/functions/hero';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.functions);

const FAQ_ITEMS = [
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
];

const FunctionsPage = () => (
  <BackendPlatformPage faqItems={FAQ_ITEMS}>
    <Hero />
    <BackendCompute />
    <Branching />
  </BackendPlatformPage>
);

export default FunctionsPage;

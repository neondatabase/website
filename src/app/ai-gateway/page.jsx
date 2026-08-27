import BackedBy from 'components/pages/ai-gateway/backed-by';
import BackendServices from 'components/pages/ai-gateway/backend-services';
import BuiltForAgents from 'components/pages/ai-gateway/built-for-agents';
import Compatibility from 'components/pages/ai-gateway/compatibility';
import GatewayBenefits from 'components/pages/ai-gateway/gateway-benefits';
import Hero from 'components/pages/ai-gateway/hero';
import Models from 'components/pages/ai-gateway/models';
import CTANew from 'components/shared/cta-new';
import Faq from 'components/shared/faq';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.aiGateway);

const FAQ_ITEMS = [
  {
    question: 'What is AI Gateway?',
    answer: `
      <p>AI Gateway is an LLM inference layer built right into your Neon project. It runs on Databricks Foundation Model APIs, the same serving engine Databricks uses for its own inference. You use your Neon credential to call a wide catalog of models from several providers through a single endpoint, with no third-party accounts to set up, all billed via Neon.</p>
    `,
    initialState: 'open',
  },
  {
    question: 'Which models can I call?',
    answer: `
      <p>Call frontier and open-weight models from providers including Anthropic, OpenAI, Google, Meta, and Alibaba. The live model catalog above is sourced from the same data as our documentation.</p>
    `,
  },
  {
    question: 'What is the difference between Neon AI Gateway and Databricks Unity AI Gateway?',
    answer: `
      <p>Neon AI Gateway is the inference layer built into a Neon project and credential. Databricks Unity AI Gateway is designed for centralized enterprise governance inside the Databricks platform. Neon uses Databricks Foundation Model APIs for model serving while keeping setup and billing inside Neon.</p>
    `,
  },
  {
    question: 'How does AI Gateway relate to the rest of the Neon backend?',
    answer: `
      <p>It shares the same project and branch boundaries as your Postgres database, authentication, storage, and functions. That gives each environment its own endpoint and lets the complete backend move together.</p>
    `,
  },
  {
    question: 'Do I need to run my app on Neon to use AI Gateway?',
    answer: `
      <p>No. Any application or service that can make HTTPS requests can call the gateway. Neon Functions are optional and are useful when you want model calls to run close to the rest of your backend.</p>
    `,
  },
  {
    question: 'What happens when I branch?',
    answer: `
      <p>The new branch receives its own AI Gateway endpoint and branch-scoped credentials alongside the rest of its Neon backend, so you can test model or application changes without touching production.</p>
    `,
  },
  {
    question: 'Do I have to change my code to switch to Neon AI Gateway?',
    answer: `
      <p>OpenAI-compatible clients only need a Neon base URL and credential. Your request and streaming formats stay the same, and switching providers is usually just a model-name change.</p>
    `,
  },
  {
    question: 'How does pricing work?',
    answer: `
      <p>AI Gateway is free during beta on paid Neon plans. When billing begins, Neon will pass through each provider’s published per-token rate with zero markup. See the model catalog for current rates.</p>
    `,
  },
];

const AiGatewayPage = () => (
  <Layout
    className="bg-black-pure"
    headerClassName="h-15! lg:h-14!"
    isHeaderSticky
    isHeaderStickyOverlay
  >
    <Hero />
    <Models />
    <GatewayBenefits />
    <Compatibility />
    <Faq items={FAQ_ITEMS} variant="light" />
    <BackendServices />
    <BuiltForAgents />
    <BackedBy />
    <CTANew
      className="mt-0 bg-gray-new-10"
      title="Building something ambitious?"
      description="Fill out a short form and we’ll get back to you within a few business days."
      label="Get started"
      buttonText="Apply now"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default AiGatewayPage;

export const revalidate = false;

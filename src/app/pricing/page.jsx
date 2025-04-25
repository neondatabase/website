import Features from 'components/pages/pricing/features';
import Hero from 'components/pages/pricing/hero';
import Plans from 'components/pages/pricing/plans';
import CTA from 'components/shared/cta';
import Faq from 'components/shared/faq';
import Layout from 'components/shared/layout';
import Logos from 'components/shared/logos';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.pricing);

const logos = [
  'eqt',
  'openai',
  'zimmer',
  'outfront',
  'adobe',
  'genomics',
  'replit',
  'retool',
  'albertsons',
  'akqa',
  'vercel',
  'bcg',
  'wordware',
  'commure',
];

const faqItems = [
  {
    question: 'What is a compute hour?',
    answer: `Compute hour is the metric for compute usage in Neon. The quick math: [compute hours] = [compute size] x [hours your compute runs]. Each pricing plan includes a certain number of compute hours; how quickly you consume these hours depends on the size of your compute and how long it runs. Once you exceed the allocated amount of compute hours, you'll be billed for overages in a given month.`,
    id: 'compute-hour',
    initialState: 'open',
  },
  {
    question: 'How does billing work?',
    answer: `In Neon, you are charged a monthly fee plus any additional compute and/or storage usage over what's included in your plan. For example, the Launch plan includes 300 compute-hours of compute usage;  if you consume 320 compute-hours in a month, your will see extra 20 compute-hours in your monthly bill.`,
  },
  {
    question: 'When will I be billed?',
    answer: `Neon bills for the past month's usage at the beginning of each calendar month. For more information, see <a href="/docs/introduction/manage-billing">Manage billing</a>.`,
  },
  {
    question: 'How many compute hours will it take to run my workload?',
    answer: `You can get a good idea by estimating how many hours your databases run, and at which compute size. For example: imagine you’re running a 2 CPU, 8 GB RAM database for 2 hours a day (or 62 hours per month). This equals [2 CU * 62 hours] = 124 compute hours per month.`,
  },
  {
    question: 'How can I set a maximum monthly spend limit?',
    answer: `We don’t currently have a feature for this, but you can set a maximum autoscaling limit. When enabling <a href="/docs/introduction/autoscaling">autoscaling</a>, you define a maximum limit (e.g., 2 CU), which acts as a de facto cost cap. Your workload will never exceed this limit.`,
  },
  {
    question: 'How do I enable add-ons for my plans?',
    answer: `Most of them can be enabled on a self-serve basis via the Neon console. If you need any assistance, <a href="https://neon.tech/contact sales">contact us</a>.`,
  },
  {
    question: 'Is Neon compliant?',
    answer: `Yes, Neon adheres to SOC 2, ISO 27001, ISO 27701 standards and complies with GDPR and CCPA regulations. HIPAA compliance is also available in our Business and Enterprise plans at an additional cost.`,
  },
  {
    question: 'Which level of uptime can I expect with Neon?',
    answer: `Neon offers a 99.95% uptime SLA for Business and Enterprise customers, ensuring consistent availability and performance for mission-critical applications.`,
  },
  {
    question: 'Can Neon help with migrations?',
    answer: `Absolutely. Our expert team assists Business and Enterprise clients throughout the migration process. <a href="https://neon.tech/migration-assistance">Tell us here</a> if you're considering migrating to Neon. `,
  },
];

const PricingPage = () => (
  <Layout>
    <Hero />
    <Logos className="mt-[136px] lg:mt-24 lg:pt-0 md:mt-20" logos={logos} />
    <Plans />
    <Features />
    <Faq items={faqItems} />
    <CTA
      className="pb-[350px] pt-[445px] xl:pb-[200px] xl:pt-[260px] lg:pb-[150px] lg:pt-[220px] sm:pb-[100px] sm:pt-[160px]"
      title="Still have a question?"
      description="Complete the form below to get in touch with our Sales team."
      buttonText="Talk to Sales"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default PricingPage;

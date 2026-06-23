import Hero from 'components/pages/startups/hero';
import Info from 'components/pages/startups/info';
import CTANew from 'components/shared/cta-new';
import Faq from 'components/shared/faq';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import getMetadata from 'utils/get-metadata';

export const metadata = getMetadata(SEO_DATA.startups);

const logos = [
  'sequoia',
  'y',
  'menlo',
  'notable',
  'general-catalyst',
  'andreessen-horowitz',
  'khosla-ventures',
];

const quotes = [
  {
    text: 'Every tech choice we make is about staying lightweight and scalable. <mark>Neon fits that perfectly</mark>: we can spin up real Postgres databases in CI, in seconds, with zero hassle.',
    author: 'Oliver Stenbom',
    post: 'Co-Founder at Endform',
  },
  {
    text: 'Postgres fits with our architecture, and <mark>Neon made it easy</mark>. I didn’t want to deal with any overhead, Neon worked out of the box and let us stay focused.',
    author: 'Chris Sims',
    post: 'CEO and Co-Founder of Rhythmic',
  },
  {
    text: 'We <mark>use Neon branching</mark> in our development process to find issues, test migrations, and experiment safely.',
    author: 'Tal Kain',
    post: 'Founder and CEO at Velocity',
  },
  {
    text: 'Databases have always been such a pain. <mark>In Neon, everything feels easier</mark> and much safer to do.',
    author: 'Julian Benegas',
    post: 'CEO of BaseHub',
  },
  {
    text: 'We work with a workflow where each developer has a branch with their name, and then we also have <mark>a Neon branch associated with a GitHub branch</mark>.',
    author: 'Sarim Malik',
    post: 'CEO at Rubric Labs',
  },
  {
    text: 'Neon autoscaling kicks in when we have bursts of traffic. <mark>Neon’s managed database experience</mark> made it effortless to handle.',
    author: 'Lex Nasser',
    post: 'Founding Engineer at 222',
  },
];

const faqItems = [
  {
    question: 'Who can apply to the Databricks Startup Program?',
    id: 'who-can-apply',
    initialState: 'open',
    answer: `
      <p>The Databricks Startup Program supports both self-funded and VC-backed startups. Self-funded startups should have less than $1M in funding and be in early-stage product development. VC-backed startups should have raised at least $1M or be participating in a recognized startup accelerator.</p>
    `,
  },
  {
    question: 'What can the credits be used towards?',
    answer: `
      <p>The program provides credits for both Databricks and Neon. The exact amount you receive depends on your stage and funding.</p>
    `,
  },
  {
    question: 'How does the application process work?',
    answer: `
      <p>Apply using the form on this page. Our team reviews each application and typically responds within a few business days. If you qualify, we'll confirm and apply your credits to your account.</p>
    `,
  },
  {
    question: 'How long are the credits valid?',
    answer: `
      <p>Credits are valid for 12 months from the date of acceptance.</p>
    `,
  },
  {
    question: 'Can I apply if I’m already using Neon or Databricks?',
    answer: `
      <p>Yes. Existing users can apply, and if you're approved, credits are added to your current account. You don't need to create a new account or migrate anything.</p>
    `,
  },
  {
    question: 'What happens when my credits run out or expire?',
    answer: `
      <p>When your credits are used up or reach their 12-month expiration, your account continues on your selected plan and you're billed normally for usage beyond the credit. There's no commitment to stay, and no surprise charges while credits are active.</p>
    `,
  },
];

const ContactSales = () => (
  <Layout className="overflow-hidden" headerClassName="bg-transparent!">
    <Hero logos={logos} quotes={quotes} />
    <Info />
    <CTANew
      className="mt-[157px] text-center"
      copyWrapperClassName="mx-auto text-center md:text-balance mt-0 max-w-[820px] [&_h2]:inline [&_p]:inline"
      title="Building something ambitious?"
      description="Fill out an application and we’ll get back to you within a few business days."
      buttonText="Apply Now"
      buttonUrl="#startups-form"
    />
    <Faq className="mt-38 mb-36 lg:mb-16 md:mb-12 [&>div]:max-w-[1280px]" items={faqItems} />
  </Layout>
);

export default ContactSales;

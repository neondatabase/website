import Features from 'components/pages/pricing/features';
import Hero from 'components/pages/pricing/hero';
import Plans from 'components/pages/pricing/plans';
import CTA from 'components/shared/cta';
import Faq from 'components/shared/faq/faq';
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
    question: 'What is a project?',
    id: 'what-is-a-project',
    initialState: 'open',
    answer: `
      <p>A project in Neon is the top-level container for your database environment. Each project includes your primary database, its branches, and compute resources. You can think of it like a GitHub repo - one project, many branches. <a href="${LINKS.docs}/manage/overview">Learn more about Neon’s object hierarchy.</a></p>
    `,
  },
  {
    question: 'What is a CU?',
    answer: `
      <p>A CU (short for Compute Unit) is Neon's way of representing instance size. It defines how much CPU and memory your database is using at any moment. Each CU allocates approximately 4 GB of RAM, along with associated CPU and local SSD resources.</p>
    `,
  },
  {
    question: 'How is compute usage measured in Neon?',
    id: 'compute-usage',
    answer: `
      <p>Neon is a serverless database: it bills per true monthly usage. Your compute monthly usage is based on how long your compute runs and at what size.<br/>We measure compute usage in CU-hours:</p>
      <code>CU-hours = CU size of your compute × number of hours it runs</code>
      <p>For example: if a 2 CU machine runs for 3 hours, that’s 6 CU-hours of usage.<br/><a href="${LINKS.docs}/introduction/autoscaling">Learn more about Neon’s serverless model.</a></p>
    `,
  },
  {
    question: 'How is storage usage billed in Neon?',
    answer: `
      <p>Neon also charges for storage based on actual data usage, not allocated capacity. We measure this in GB-months:</p>
      <code>1 GB-month = 1 GB stored for 1 full month</code>
      <p>Storage is metered hourly and summed over the month, so you only pay for what you actually use, not for the maximum size your database reaches.</p>
    `,
  },
  {
    question: 'What happens with branches and storage?',
    id: 'branches-and-storage',
    answer: `
      <p>Each project in Neon starts with a root branch (your main database). You can then create child branches, which are isolated copies of your database state - great for testing, previews, and development.<br/>But Neon uses a copy-on-write model, so:</p>
      <ul>
        <li>Child branches do not increase your storage bill unless they diverge from the root.</li>
        <li>Only the differences (delta) between the root and each branch are counted.</li>
      </ul>
      <p>At the end of the month, your total storage usage is:</p>
      <code>Total GB-month = Root branch size + delta from all child branches</code>
      <br/>
      <a href="${LINKS.docs}/introduction/branching">Learn more about Neon’s serverless model.</a>
    `,
  },
  {
    question: 'How are Instant Restores billed?',
    id: 'instant-restores',
    answer: `
      <p>Instant restores (also known as Point-in-Time Recovery, or PITR) are billed based on how much data changes in your primary branch over time, not how many restores you do:</p>
      <ul>
        <li>The Free plan gives you up to 6 hours of restore history, or 1 GB of data changes - whichever comes first. If your app writes a lot of data, you may get less than 6 hours of coverage.</li>
        <li>In the Launch plan, you can choose any restore window from 0 to 7 days. You're charged $0.20 per GB-month, based on how much data changes during that window. Setting it to 0 disables Instant Restores, and implies $0 additional costs.</li>
        <li>In the Enterprise plan, you can set a restore window up to 30 days, billed at $0.20 per GB-month for the changed data (same logic as Launch).</li>
      </ul>
      <a href="${LINKS.docs}/introduction/branch-restore">Read the docs</a> for more information on Instant Restores.
    `,
  },
  {
    question: 'How does billing for additional branches work?',
    id: 'additional-branches-billing',
    answer: `
      <p>Each paid Neon plan includes a number of branches per project at no extra cost. For example, the Launch plan includes 10 branches.</p>
      <p>You can create and delete branches freely within that allowance. If you create more total branches than your plan includes, the extras are billed as branch-months, metered hourly. The pricing: </p>
      <code>$1.50 per extra branch-month (≈ $0.002 per hour) billed only for branches that exceed your included allowance</code>
      <p>For example: The Launch plan includes 10 branches per project. You create 2 extra branches for 5 hours each → 10 extra branch-hours × $0.002/hour = $0.02 total.</p>    
      `,
  },
  {
    question: 'How can I control my costs?',
    answer: `
      <p>Neon lets you control compute usage by setting a maximum autoscaling limit per branch. This acts as a de-facto cost ceiling - your database won’t scale beyond the limit, even if traffic spikes.</p>
      <p>For example, if you set a limit of 1 CU, your usage will never exceed 1 CU-hour per hour, regardless of demand.
      <a href="${LINKS.docs}/introduction/autoscaling#configuring-autoscaling">Learn how to configure autoscaling limits.</a></p>
    `,
  },
  {
    question: 'Do you offer credits for startups?',
    answer: `
      <p>Early startups that have received venture funding are eligible to apply to our Startup Program.</p>
      <a href="${LINKS.startups}">Learn more and apply here</a>
    `,
  },
];

const PricingPage = () => (
  <Layout>
    <Hero />
    <Logos className="lg:mt-30 mt-[136px] xl:mt-[128px] lg:pt-0 md:mt-20" logos={logos} />
    <Plans className="mt-[184px] scroll-mt-5 px-safe xl:mt-[176px] lg:mt-[168px] md:mt-32" />
    <Features />
    <Faq items={faqItems} className="mt-[200px] xl:mt-[192px] lg:mt-[184px] md:mt-[104px]" />
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

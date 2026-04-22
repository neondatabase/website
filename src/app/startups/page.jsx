import Hero from 'components/pages/startups/hero';
import Info from 'components/pages/startups/info';
import CTANew from 'components/shared/cta-new';
import Faq from 'components/shared/faq';
import Layout from 'components/shared/layout';
import LINKS from 'constants/links';
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
    question: 'What is a project?',
    id: 'what-is-a-project',
    initialState: 'open',
    answer: `
      <p>A project in Neon is the top-level container for your database environment. Each project includes your primary database, its branches, and compute resources. You can think of it like a GitHub repo: one project, many branches. <a href="${LINKS.docs}/manage/overview">Learn more about Neon's object hierarchy.</a></p>
    `,
  },
  {
    question: 'What is a CU?',
    answer: `
      <p>A CU (short for Compute Unit) is Neon's way of representing compute size. It defines how much CPU and memory your database is using at any moment. Each CU allocates approximately 1 vCPU and 4 GB of RAM. <a href="${LINKS.docs}/manage/computes#compute-size-and-autoscaling-configuration">Learn more about compute sizing on Neon.</a></p>
    `,
  },
  {
    question: 'What is a CU-hour?',
    id: 'compute-usage',
    answer: `
      <p>A CU-hour is Neon's unit for measuring compute usage.</p>
      <p>Because Neon is a serverless database, you're billed only for the compute resources you actually use. In other words, your monthly compute usage depends on:</p>
      <ul>
        <li>How many compute endpoints are you running</li>
        <li>How large your compute endpoints are (in CUs)</li>
        <li>How long they run (in hours)</li>
      </ul>
      <p>For a single compute, the calculation works similar to this:</p>
      <code>Monthly CU-hours = [average CU size] × [number of hours the compute runs in the month]</code>
      <code>Monthly compute cost = [monthly CU-hours] × [CU-hour price]</code>
      <p>The CU-hour price depends on your pricing plan:</p>
      <ul>
        <li>Launch plan: $0.106 per CU-hour</li>
        <li>Scale plan: $0.222 per CU-hour</li>
      </ul>
      <p>Remember that when your database is idle, compute can scale down to zero, so you don't consume CU-hours while it's not running. <a href="${LINKS.docs}/introduction/about-billing">Learn more about Neon's billing.</a></p>
    `,
  },
  {
    question: 'How is Neon Auth billed?',
    answer: `
      <p>Neon Auth is included at no additional cost for all Neon databases until you reach 1 million monthly active users (MAU). If you surpass that threshold, a member of our team will reach out to discuss pricing.</p>
      <p>On the Free plan, Neon Auth is included for up to 60,000 MAU.</p>
    `,
  },
  {
    question: 'How can I control my costs?',
    answer: `
      <p>Compute is often the most variable part of a monthly bill. The most effective way to control compute costs in Neon is to configure maximum autoscaling limits and scale-to-zero.</p>
      <p>Autoscaling limits act as a built-in cost ceiling: your database will never scale beyond the limit you set, even during traffic spikes. If you want to prioritize performance over costs in a particular compute endpoint (e.g. production), choose a higher limit. If you want to optimize for cost predictability, set a lower one. <a href="${LINKS.docs}/guides/autoscaling-guide#configure-autoscaling-defaults-for-your-project">Learn how to configure autoscaling limits.</a></p>
      <p>Another effective way to control compute costs is to ensure scale to zero is enabled for all non-production branches. When a branch is idle, compute scales down automatically, so you're not charged for unused databases. <a href="${LINKS.docs}/introduction/scale-to-zero">Learn about scale to zero.</a></p>
      <p>To manage storage costs, regularly clean up unused branches, snapshots, and projects, and avoid retaining large restore windows if not required by your use case. <a href="${LINKS.docs}/introduction/cost-optimization#storage-root-and-child-branches">Learn more about optimizing storage usage.</a></p>
    `,
  },
  {
    question: 'Do you offer credit programs for startups?',
    answer: `
      <p>Early startups that have received venture funding are eligible to apply to our Startup Program. <a href="${LINKS.startups}">Learn more and apply here.</a></p>
    `,
  },
];

const ContactSales = () => (
  <Layout className="overflow-hidden" headerClassName="bg-transparent!">
    <Hero logos={logos} quotes={quotes} />
    <Info />
    <CTANew
      className="mt-[157px] text-center"
      copyWrapperClassName="mx-auto text-center mt-0 max-w-[820px] [&_h2]:inline [&_p]:inline"
      title="Building something ambitious?"
      description="Fill out a short form and we’ll get back to you within a few business days."
      buttonText="Apply Now"
      buttonUrl="#startups-form"
    />
    <Faq className="mb-40 lg:mb-16 md:mb-12" items={faqItems} />
  </Layout>
);

export default ContactSales;

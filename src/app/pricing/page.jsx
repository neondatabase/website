import Features from 'components/pages/pricing/features';
import Hero from 'components/pages/pricing/hero';
import Plans from 'components/pages/pricing/plans';
import CTANew from 'components/shared/cta-new';
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
    question: 'What does 100 CU-hours per project give me on the Free plan?',
    answer: `
      <p>On the Free plan, each project gets 100 CU-hours per month, and compute automatically scales down to zero when idle. What this means in practice:</p>
      <ul>
        <li>You can create up to 100 projects, each with its own independent 100 CU-hour allowance</li>
        <li>CU-hours are only consumed while a database is actively running queries. When a project is idle, compute scales to zero and uses no CU-hours</li>
        <li>Usage is typically spread across short bursts of activity, not continuous runtime</li>
      </ul>
      <p>A realistic example for a single project:</p>
      <ul>
        <li>The database runs at an average of 1 CU for ~3 hours per day. It scales down to zero the rest of the time</li>
        <li>Over a month, this uses roughly 90 CU-hours, staying within the Free plan limits for that project</li>
      </ul>
      <p>This model is designed to make it practical to have many small or intermittent databases (for development, demos, previews, or experiments) without being forced into an upgrade. <a href="${LINKS.blog}/why-so-many-projects-in-the-neon-free-plan">Learn more about our Free Plan philosophy.</a></p>
    `,
  },
  {
    question: 'What does "no monthly minimum" mean on paid plans?',
    answer: `
      <p>Neon's paid plans don't require a minimum monthly spend or base fee. You're billed purely based on usage. If one month you barely use Neon, your bill might be just a few dollars.</p>
      <p>For example, if your databases are mostly idle that month, or you only run them briefly for development or testing, you'll only pay for the compute and storage actually consumed during that time. Remember that Neon databases scale to zero by default.</p>
    `,
  },
  {
    question: 'Are the Free Plan quotas included in the paid plans?',
    answer: `
      <p>No. Neon's paid plans work independently of the Free plan.</p>
      <p>When you're on a paid plan, usage starts metering from zero for both compute and storage. Free plan quotas don't apply once you upgrade. Instead, you're billed purely based on actual usage, at the rates of your paid plan.</p>
      <p>You should consider a paid plan if:</p>
      <ul>
        <li>You expect higher or more sustained usage than what's included per project on the Free plan</li>
        <li>You care about production guarantees, such as consistent availability, predictable performance, and never having your database paused due to usage limits</li>
      </ul>
      <p>If your usage fits comfortably within the Free plan and you're not running a production workload, there's no reason to upgrade. The Free plan is designed to be genuinely useful for development and prototyping. <a href="${LINKS.blog}/why-so-many-projects-in-the-neon-free-plan">Learn more about our Free Plan philosophy.</a></p>
    `,
  },
  {
    question: 'How is storage billed in Neon?',
    id: 'branches-and-storage',
    answer: `
      <p>In Neon, you don't provision or manage storage in advance. Storage scales automatically and invisibly as your data grows. At the end of each month, you're billed for the storage actually consumed per project, measured in GB-months.</p>
      <p>Neon bills storage usage using two separate metrics:</p>
      <p><strong>History storage (or instant restore storage)</strong></p>
      <p>Neon retains a history of database changes so you can restore a branch to a previous point in time, create branches from past states, run time travel queries, and more. This history is controlled by your <a href="${LINKS.docs}/introduction/restore-window">restore window</a>, which is configurable per project (1 day by default in paid plans).</p>
      <p>History storage is billed based on the amount of Write-Ahead Log (WAL) history retained within your restore window, at $0.20 per GB-month on paid plans. This is billed separately from your regular database storage.</p>
      <p>If you don't need deep recovery or long time travel capabilities, you can shorten the restore window to reduce costs.</p>
      <p><strong>Database storage (root and child branches)</strong></p>
      <p>This is the storage used by your database data itself. Since Neon databases can branch, this is how branches contribute to database storage:</p>
      <ul>
        <li>Root branches are billed based on their actual data size (for example, 5 GB)</li>
        <li>Child branches <em>might</em> be billed based on the minimum of: the accumulated data changes since the branch was created, or the underlying storage footprint, which is zero if the branch is still within the restore window (in this case, the child branch effectively shares storage with its parent).</li>
      </ul>
      <p>The SUM of both components will be billed as your database storage at $0.35 per GB-month.</p>
      <p>What this implies:</p>
      <ul>
        <li>A child branch that has no data changes compared to its parent and is still within the <a href="${LINKS.docs}/introduction/restore-window">restore window</a> does not incur additional database storage costs.</li>
        <li>As a child branch accumulates changes over time, its storage usage increases.</li>
        <li>If a child branch falls out of the restore window, it becomes as expensive as a root branch, since it no longer shares storage with its parent.</li>
      </ul>
      <p>To keep database storage costs low, child branches are best kept short-lived - for example, by setting <a href="${LINKS.docs}/guides/branch-expiration">expiration times</a>, <a href="${LINKS.docs}/guides/reset-from-parent">resetting them</a> frequently, or deleting branches when they're no longer needed.</p>
    `,
  },
  {
    question: 'How are extra branches billed?',
    id: 'additional-branches-billing',
    answer: `
      <p>Each Neon plan includes a set number of branches per project at no additional cost (10 branches per project in Launch, 25 branches per project in Scale) but you can create and delete branches freely within your plan's included allowance:</p>
      <ul>
        <li>If the total number of concurrent branches in a project exceeds your plan's allowance, the extra branches are billed as branch-months, prorated hourly.</li>
        <li>The price is $1.50 per extra branch-month (≈ $0.002 per hour)</li>
        <li>You're only billed for branches that exceed your included limit, and only for the time they exist.</li>
      </ul>
      <p>Example: The Launch plan includes 10 branches per project. If you already have 10 branches but create 2 additional branches and keep them for 5 hours each, that'd be 10 extra branch-hours total: 10 × $0.002/hour = $0.02</p>
      <p><strong>How to avoid extra branch charges</strong></p>
      <ul>
        <li><a href="${LINKS.docs}/guides/branch-expiration">Use branch expiration.</a> Set automatic deletion times on temporary branches so they're cleaned up when no longer needed.</li>
        <li>Automate cleanup. Use the <a href="${LINKS.docs}/manage/branches#branching-with-the-neon-api">Neon API</a> or <a href="${LINKS.docs}/guides/branching-neon-cli">Neon CLI</a> to periodically delete unused branches and stay within your included allowance.</li>
      </ul>
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

const PricingPage = () => (
  <Layout>
    <Hero />
    <Logos className="mt-32 xl:mt-[120px] lg:mt-[104px] md:mt-20" logos={logos} size="sm" />
    <Plans className="mt-[200px] scroll-mt-5 px-safe xl:mt-[184px] lg:mt-40 md:mt-[120px]" />
    <Features />
    <Faq items={faqItems} />
    <CTANew
      className="mt-[183px] xl:mt-[168px] lg:mt-[145px] md:mt-[90px]"
      title="Still have questions? Get in touch."
      description="Get personalized guidance from our team — we'll help you quickly find the right solution."
      buttonText="Talk to Sales"
      buttonUrl={LINKS.contactSales}
    />
  </Layout>
);

export default PricingPage;

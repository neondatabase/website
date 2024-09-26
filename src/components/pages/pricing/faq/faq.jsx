import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import Item from './item';

const items = [
  {
    question: 'What is a compute hour?',
    answer: `Compute hour is the metric for compute usage in Neon. The quick math: [compute hours] = [compute size] x [hours your compute runs]. Each pricing plan includes a certain number of compute hours; how quickly you consume these hours depends on the size of your compute and how long it runs. Once you exceed the allocated amount of compute hours, you'll be billed for overages in a given month.`,
    id: 'compute-hour',
    initialState: 'open',
  },
  {
    question: 'How does billing work?',
    answer: `In Neon, you are charged a monthly fee (corresponding to your pricing plan) plus any additional compute and/or storage usage over the limits included in your plan. For example, the Launch plan includes 300 compute-hours of compute usage;  if you consume 320 compute-hours in a month, you will be billed additionally for 20 compute-hours.`,
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
    question: 'How can I control my costs with autoscaling?',
    answer: `When enabling <a href="/docs/introduction/autoscaling">autoscaling</a>, you will set a maximum autoscaling limit (e.g. 2 CU) that will act as a de-facto cost limit.`,
  },
  {
    question: 'How is storage charged in Neon?',
    answer: `Neon implements a unique storage engine that enables database branching on copy-on-write, without duplicate storage. You can create instant database copies (database branches) without adding to the storage bill. Since Neon retains database history, the size of storage for a Neon project will be calculated as the size of your tables plus the WAL up to the configurable history retention period. <a href="/docs/introduction/usage-metrics">Read more in our docs</a>.`,
  },
  {
    question: 'Do I get a notification if I am approaching my usage limits?',
    answer: `Yes, we display your usage consumption in the Neon admin console and we will also email you when you’re getting close.`,
  },
  {
    question: 'Why are we limited to 500 branches per project?',
    answer: `Neon implements usage limits for branching in order to prevent potential abuse of the service which can negatively impact other users. For customers seeking higher limits please contact <a href="mailto:customer-success@neon.tech">customer-success@neon.tech</a>.`,
  },
  {
    question: 'Who needs the Business plan?',
    answer: `The Business plan is our most affordable and feature-complete option for teams with existing production workloads. This plan is designed to fit all the production use cases that are popular among our customers, including large production applications with variable traffic, SaaS with database-per-user at scale, developer/BaaS platforms, dev/test workflows, and AI Agents. Explore our <a href="/case-studies">Case Studies</a> to learn more. We also do Enterprise contracts to accomodate unique requirements—<a href="/contact-sales">reach out to us</a> to inquire about it.   `,
  },
];

const Faq = () => (
  <section className="faq safe-paddings bg-black-new py-40 2xl:py-32 xl:py-28 lg:py-20 md:py-16">
    <Container className="max-w-[968px]" size="medium">
      <Heading className="text-center" tag="h2" size="2sm">
        Frequently Asked Questions
      </Heading>
      <ul className="mt-12 xl:mx-auto xl:mt-10 xl:max-w-3xl lg:mt-7 md:mt-6">
        {items.map((item, index) => (
          <Item {...item} key={index} index={index} />
        ))}
      </ul>
    </Container>
  </section>
);

export default Faq;

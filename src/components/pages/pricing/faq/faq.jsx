import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import Item from './item';

const items = [
  {
    question: 'How does billing work?',
    answer: `In Neon, you are charged a monthly fee (corresponding to your pricing plan) plus any additional compute and/or storage usage over the limits included in your plan. For example, the Launch plan includes 300 compute-hours of compute usage;  if you consume 320 compute-hours in a month, you will be billed additionally for 20 compute-hours.`,
  },
  {
    question: 'When will I be billed?',
    answer: `Neon bills for the past month's usage at the beginning of each calendar month. For more information, see <a href="/docs/introduction/manage-billing">Manage billing</a>.`,
  },
  {
    question: 'What is a compute-hour?',
    answer: `Compute-hours is the metric for compute usage in Neon. It is short for “compute capacity consumed in a given hour”. The quick math: Compute-hours = CPU used x active time.`,
  },
  {
    question: 'How many compute-hours it’ll take to run my workload?',
    answer: `You can get a good idea by estimating how many hours your databases run and at which capacity. For example: imagine you’re running a 2 CPU, 8 GB RAM database for 2 hours a day (or 62 hours per month). This equals [2 CU * 62 hours] = 124 compute-hours per month.`,
  },
  {
    question: 'How can I predict my costs with autoscaling?',
    answer: `When enabling <a herf="/docs/introduction/autoscaling">autoscaling</a>, you will set a maximum autoscaling limit (e.g. 5 CPU) that will de-facto act as a cost limit.`,
  },
  {
    question: 'How is storage charged in Neon?',
    answer: `Neon implements a unique storage engine that enables it to create instant database copies (branches) without duplicating storage. In Neon, you only pay for the same data once: <a href="/docs/introduction/branching">you can create development, test, staging, and preview database branches without adding to the storage bill</a>.`,
  },
  {
    question: 'Do I get a notification if I am approaching my usage limits?',
    answer: `Yes, we display your usage consumption in the Neon admin console and we will also email you when you’re getting close.`,
  },
  {
    question: 'Why are we limited to 500 branches per project?',
    answer: `Neon implements usage limits for branching in order to prevent potential abuse of the service which can negatively impact other users. For customers seeking higher limits please contact <a href="mailto:customer-success@neon.tech">customer-success@neon.tech</a>.`,
  },
];

const Faq = () => (
  <section className="faq safe-paddings bg-gray-new-8 py-40 2xl:py-32 xl:py-28 lg:py-20 md:py-16">
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

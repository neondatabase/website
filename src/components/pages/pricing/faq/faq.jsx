import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import Item from './item';

const items = [
  {
    question: 'When will I be billed?',
    answer: `Neon bills for the past month's usage at the beginning of each calendar month. For more information, see <a href="/docs/introduction/manage-billing">Manage billing</a>.`,
  },
  {
    question: 'What happens if I cancel my subscription?',
    answer:
      'If you cancel your subscription you will be be required to downgrade your account to the free limits.',
  },
  {
    question: 'Do I get a notification if I am approaching my usage limits?',
    answer:
      'Yes, we display your usage consumption in the Neon admin console and will email you when you are within 20% of your included usage.',
  },
  {
    question: 'Why are we limited to 500 branches per project?',
    answer: `Neon implements usage limits for branching in order to prevent potential abuse of the service which can negatively impact other users. For customers seeking higher limits please contact <a href="mailto:customer-success@neon.tech">customer-success@neon.tech</a>.`,
  },
  {
    question: 'Does Neon charge for storage in database branches?',
    answer:
      'Neon charges for unique storage. Data that a branch shares in common with a parent branch is not considered unique, but data changes to a branch are counted toward storage.',
    linkUrl: '/docs/introduction/billing#project-storage',
    linkText: 'Read more',
    linkLabel: 'about project storage',
  },
  {
    question: 'What happens when I exceed 10 GiB storage on the Launch plan?',
    answer: `If you exceed your storage quota on the Launch plan, the Neon team will collaborate with you to address your storage needs. This may involve providing guidance on optimizing storage usage or exploring alternative plans that better suit your requirements. It's important to note that Neon does not automatically halt write operations when you surpass your limits. You can send related inquiries to <a href="mailto:customer-success@neon.tech">customer-success@neon.tech</a>.`,
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

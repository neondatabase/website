import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import Item from './item';

const items = [
  {
    question: 'Does Neon charge for storage in database branches?',
    answer:
      'Neon charges for unique storage. Data that a branch shares in common with a parent branch is not considered unique, but data changes to a branch are counted toward storage.',
    linkUrl: '/docs/introduction/usage-metrics#storage',
    linkText: 'Read more',
    linkLabel: 'about project storage',
  },
  {
    question: 'Can I upgrade or downgrade my plan later?',
    answer:
      'Yes. You can upgrade or downgrade later by selecting <b>Change Plans</b> on the <a href="https://console.neon.tech/app/billing"><strong>Billing</strong></a> page in the Neon Console. To upgrade to a custom Enterprise plan, contact <a href="https://neon.tech/contact-sales"><strong>Sales</strong></a>. For instructions, see <a href="/docs/introduction/manage-billing#change-your-plan">Change your plan</a>.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Neon accepts payment by credit card for the Launch and Scale plans. For the Enterprise plan, Neon accepts payment by ACH, Wire, or through AWS Marketplace or the AWS Private Offers program. For more information, please contact <a href="https://neon.tech/contact-sales"><strong>Sales</strong></a>.',
  },
  {
    question: 'When will I be billed?',
    answer: `Neon bills for the past month's usage at the beginning of each month. For more information, see <a href="/docs/introduction/manage-billing">Manage billing</a>.`,
  },
  {
    question: 'Is there a discount for annual plan subscriptions?',
    answer:
      'Discounts are applied for longer duration contracts as well as bulk consumption purchases.',
  },
  {
    question: 'Are there any limits or restrictions on usage?',
    answer:
      'Neon implements some soft limits to protect against unintended usage. For example, the Launch and Scale plans offer up to 500 branches, but Neon has a soft limit of 100 branches to protect your account. For more information, see <a href="/docs/introduction/plans">Plans</a>.',
  },
  {
    question: 'Is there a minimum commitment period?',
    answer:
      'Neon Launch and Scale plans have no commitment period.  You can downgrade to the at Free Tier at any time. For more information, see <a href="/docs/introduction/manage-billing#change-your-plan">Change your plan</a>.',
  },
  {
    question: 'How secure is the payment process?',
    answer:
      'Neon payment processing is powered by <a href="https://stripe.com/" target="_blank" rel="noreferrer noopener">Stripe</a>, which is a certified PCI Service Provider Level 1. For more information, refer to <a href="https://stripe.com/docs/security" target="_blank" rel="noreferrer noopener">Security at Stripe</a>.',
  },
  {
    question: 'Where should I direct pricing-related questions?',
    answer:
      'Please contact <a href="https://neon.tech/contact-sales"><strong>Sales</strong></a> with any questions about plans or pricing.',
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

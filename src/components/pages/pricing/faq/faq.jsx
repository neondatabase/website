'use client';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link/link';
import { LazyMotion, m, domAnimation } from 'framer-motion';
import { useState } from 'react';

const items = [
  {
    question: 'Does Neon charge for storage in database branches?',
    answer:
      'Neon charges for unique storage. Data that a branch shares in common with a parent branch is not considered unique, but data changes to a branch are counted toward storage.',
    linkUrl: '#',
    linkText: 'Read more',
  },
  {
    question: 'Can I upgrade or downgrade my subscription later?',
    answer:
      'Yes. You can upgrade from Free Tier to our Pro plan by selecting [Go Pro]. To upgrade to a custom Enterprise or Platform Partnership plan, contact <a href="mailto:sales@neon.tech">sales@neon.tech</a>. For downgrade instructions, see <a href="#">Billing</a>.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Neon accepts payment by credit card for the Pro plan. For the Enterprise & Platform Partnership plans Neon accepts payment by ACH and Wire.',
  },
  {
    question: 'When will I be billed?',
    answer: `Neon bills for the past month's usage at the beginning of each month. For more information, see <a href="#">Billing</a>.`,
  },
  {
    question: 'Is there a discount for annual subscriptions?',
    answer:
      'Discounts are applied for longer duration contracts as well as bulk consumption purchases.',
  },
  {
    question: 'Are there any setup fees or additional charges?',
    answer:
      'No. There are no hidden setup fees or extra charges. For usage-based plans, Neon charges on the four metrics described on this page: Compute time, Project storage, Written Data, and Data Transfer. For additional information, refer to <a href="#">Billing</a>.',
  },
  {
    question: 'Are there any limits or restrictions on usage?',
    answer:
      'Neon places safety limits on usage-based accounts to protect against unintended usage. For example, a usage-based plan may offer unlimited projects, compute, and storage, but Neon places safety limits on those resources to protect your account and prevent abuse. For more information, see <a href="#">Safety limits</a>.',
  },
  {
    question: 'Is there a minimum commitment period?',
    answer:
      'The Neon Pro plan is usage-based and has no commitment period.  You can end your subscription at any time. For more information, see <a href="#">Neon plans</a>.',
  },
  {
    question: 'How secure is the payment process?',
    answer:
      'Neon payment processing is powered by <a href="https://stripe.com/" target="_blank" rel="noreferrer noopener">Stripe</a>, which is a a certified PCI Service Provider Level 1. For more information, refer to <a href="https://stripe.com/docs/security" target="_blank" rel="noreferrer noopener">Security at Stripe</a>.',
  },
  {
    question: 'Where should I direct pricing-related questions?',
    answer:
      'Please contact <a href="mailto:sales@neon.tech">sales@neon.tech</a> with any questions about plans or pricing.',
  },
];

const variantsAnimation = {
  open: {
    opacity: 1,
    height: 'auto',
    pointerEvents: 'auto',
    marginTop: 20,
  },
  closed: {
    opacity: 0,
    height: 0,
    pointerEvents: 'none',
    marginTop: 0,
  },
};

const Item = ({ question, answer, linkText, linkUrl, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <li className="border-b border-gray-2 py-6">
      <button
        className="w-full text-left"
        type="button"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-controls={index}
      >
        <h3 className="t-3xl font-bold leading-tight">{question}</h3>
      </button>
      <LazyMotion features={domAnimation}>
        <m.div
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          variants={variantsAnimation}
          transition={{
            opacity: { duration: 0.2 },
            height: { duration: 0.3 },
          }}
        >
          <p className="with-link-primary text-xl" dangerouslySetInnerHTML={{ __html: answer }} />
          {linkText && linkUrl && (
            <Link
              className="mt-5 border-b-[3px] border-primary-1 pb-1.5 text-lg font-semibold leading-none"
              size="sm"
              theme="white"
              to={linkUrl}
            >
              {linkText}
            </Link>
          )}
        </m.div>
      </LazyMotion>
    </li>
  );
};

const Faq = () => (
  <section className="faq safe-paddings my-40">
    <Container className="grid-gap-x grid grid-cols-12" size="mdDoc">
      <Heading className="col-span-4 !leading-dense" tag="h2" size="lg">
        Frequently Asked Questions
      </Heading>
      <ul className="col-start-6 col-end-13 pt-2.5">
        {items.map((item, index) => (
          <Item {...item} key={index} index={index} />
        ))}
      </ul>
    </Container>
  </section>
);

export default Faq;

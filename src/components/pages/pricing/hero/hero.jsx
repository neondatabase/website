'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePostHog } from 'posthog-js/react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import plans from './data/plans.json';
import Features from './features';

const scaleCardBorderVariants = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: [0, 0.4, 0.2, 1, 0.5, 1],
    transition: {
      ease: 'easeInOut',
      duration: 1,
    },
  },
  exit: {
    opacity: 0,
  },
};

const Hero = () => {
  const posthog = usePostHog();

  return (
    <section className="hero safe-paddings overflow-hidden pt-40 xl:pt-[136px] lg:pt-[56px] md:pt-12">
      <Container className="flex flex-col items-center" size="960">
        <Heading
          className="text-center text-[72px] font-medium !leading-none tracking-tighter xl:!text-6xl md:!text-5xl"
          tag="h1"
          size="lg"
        >
          <span>Neon Pricing</span>
        </Heading>
        <p className="mx-auto mt-4 max-w-[680px] text-center text-xl font-light leading-snug tracking-extra-tight text-gray-new-80 xl:max-w-[560px] lg:text-lg md:text-base">
          Get started for free. Pay per usage as you grow.
        </p>
        <div className="relative mt-16 w-full lg:mt-14 md:mx-0 md:mt-10 md:w-full md:max-w-[524px]">
          <h2 className="sr-only">Neon pricing plans</h2>
          <ul className="grid-gap relative z-10 grid grid-cols-3 gap-x-[18px] lg:grid-cols-2 lg:gap-y-4 md:grid-cols-1 md:gap-y-6">
            {plans.map(
              (
                {
                  planId,
                  type,
                  title,
                  subtitle,
                  highlighted = false,
                  price,
                  priceFrom = false,
                  description,
                  features,
                  otherFeatures,
                  button,
                },
                index
              ) => (
                <li
                  className={clsx(
                    'group relative flex min-h-full flex-col rounded-[10px] px-5 pb-8 pt-5',
                    highlighted ? '' : 'bg-black-new'
                  )}
                  key={index}
                >
                  <div className="flex flex-col justify-between gap-14 lg:gap-[52px] md:gap-12">
                    <h3
                      className={clsx(
                        'flex items-center text-[18px] font-medium leading-none tracking-extra-tight lg:text-base',
                        highlighted ? 'text-green-45' : 'text-gray-new-80'
                      )}
                    >
                      {type}
                      {type === 'Scale' && (
                        <Link
                          className="ml-auto text-[15px] text-gray-new-60 underline decoration-gray-new-60/50 underline-offset-4 md:text-sm"
                          to={LINKS.contactSales}
                        >
                          Contact us
                        </Link>
                      )}
                    </h3>
                    <div className={clsx('flex flex-col flex-wrap gap-x-1 md:flex-row')}>
                      <h4 className="whitespace-nowrap text-3xl font-medium leading-snug tracking-extra-tight lg:text-xl">
                        {title}
                      </h4>
                      {subtitle ? (
                        <p className="relative text-[16px] text-gray-new-50">{subtitle}</p>
                      ) : (
                        <p className="relative text-gray-new-50">
                          ${price}/month{` ${priceFrom ? 'minimum' : ''}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    className={clsx(
                      'mt-5 w-full !py-[14px] !text-base leading-none tracking-tighter transition-colors duration-300 sm:max-w-none',
                      highlighted
                        ? 'bg-green-45 !font-semibold text-black hover:bg-[#00ffaa]'
                        : 'bg-gray-new-20 !font-medium hover:bg-gray-new-30'
                    )}
                    size="sm"
                    to={button.url}
                    tagName={button.event}
                    onClick={() => {
                      posthog.capture('ui_interaction', {
                        action: 'pricing_page_get_started_clicked',
                        plan: planId,
                        place: 'hero',
                      });
                    }}
                  >
                    Get started
                  </Button>
                  <p
                    className={clsx(
                      'mt-5 leading-snug tracking-extra-tight text-gray-new-60',
                      '[&_a]:text-white [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:decoration-transparent'
                    )}
                  >
                    {Array.isArray(description)
                      ? description.map((part, i) =>
                          typeof part === 'string' ? (
                            part
                          ) : (
                            <Link key={i} to={part.href} onClick={part.onClick}>
                              {part.text}
                            </Link>
                          )
                        )
                      : description}
                  </p>
                  <Features features={features} type={type} highlighted={highlighted} />
                  {otherFeatures && (
                    <Features
                      title={otherFeatures.title}
                      features={otherFeatures.features}
                      type={type}
                      highlighted={highlighted}
                    />
                  )}
                  {highlighted && (
                    <LazyMotion features={domAnimation}>
                      <m.span
                        className="pointer-events-none absolute left-0 top-0 z-20 h-full w-full rounded-[10px] border border-green-45/70 md:!opacity-100"
                        initial="from"
                        exit="exit"
                        variants={scaleCardBorderVariants}
                        animate="to"
                        aria-hidden
                      />
                    </LazyMotion>
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      </Container>
    </section>
  );
};

export default Hero;

'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useFeatureFlagVariantKey, usePostHog } from 'posthog-js/react';
import { useMemo } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import plansOriginal from './data/plans.json';
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
  const isComputePriceRaised =
    useFeatureFlagVariantKey('website_growth_compute_price_rising') === 'show_0_24' && false;

  const plans = useMemo(() => {
    if (isComputePriceRaised) {
      return plansOriginal.map((plan) => ({
        ...plan,
        features: plan.features.map((feature) => {
          if (feature.id === 'compute_time') {
            return {
              ...feature,
              info: 'Additional at $0.24 per compute hour',
            };
          }
          return feature;
        }),
      }));
    }

    return plansOriginal;
  }, [isComputePriceRaised]);

  return (
    <section className="hero safe-paddings overflow-hidden pt-36 2xl:pt-[150px] xl:pt-[135px] lg:pt-[52px] md:pt-10">
      <Container className="flex flex-col items-center" size="960">
        <Heading
          className="text-center text-[72px] font-medium !leading-none tracking-tighter xl:!text-6xl md:!text-5xl"
          tag="h1"
          size="lg"
        >
          <span>Neon Pricing</span>
        </Heading>
        <p className="mx-auto mt-3 max-w-[680px] text-center text-xl font-light leading-snug tracking-extra-tight text-gray-new-80 xl:max-w-[560px] lg:text-lg md:text-base">
          Get started for free. Pay per usage as you grow.
        </p>
        <div className="relative mx-auto mt-16 lg:mt-14 md:mt-10">
          <h2 className="sr-only">Neon pricing plans</h2>
          <ul className="grid-gap relative z-10 grid grid-cols-3 gap-x-[18px] 2xl:gap-x-6 lg:grid-cols-2 lg:gap-y-4 md:grid-cols-1 md:gap-y-6">
            {plans.map(
              (
                {
                  planId,
                  type,
                  title,
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
                  className="group relative flex min-h-full flex-col rounded-[10px] bg-black-new p-6 pt-5"
                  key={index}
                >
                  <div className="flex flex-col justify-between gap-10">
                    <h3
                      className={clsx(
                        'text-base font-medium leading-none tracking-extra-tight',
                        highlighted ? 'text-green-45' : 'text-gray-new-50'
                      )}
                    >
                      {type}
                    </h3>
                    <div
                      className={clsx(
                        'flex flex-col gap-1',
                        title === 'Usage-based' ? 'md:flex-col' : 'md:flex-row md:items-center'
                      )}
                    >
                      <h4 className="text-xl font-medium leading-none tracking-extra-tight">
                        {title}
                      </h4>
                      <p className="relative text-xl font-medium tracking-extra-tight text-gray-new-50">
                        ${price}/month{` ${priceFrom ? 'minimum' : ''}`}
                      </p>
                    </div>
                  </div>

                  <Button
                    className={clsx(
                      'mt-6 w-full !py-4 !text-base !font-medium leading-none tracking-tighter transition-colors duration-300 sm:max-w-none',
                      highlighted
                        ? 'bg-green-45 text-black hover:bg-[#00ffaa]'
                        : 'bg-gray-new-20 hover:bg-gray-new-30'
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
                      hasToggler
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

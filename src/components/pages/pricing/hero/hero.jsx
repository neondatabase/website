'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePostHog } from 'posthog-js/react';
// import { useFeatureFlagVariantKey, usePostHog } from 'posthog-js/react';
import { useMemo } from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import CtaBlock from 'components/shared/cta-block';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

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
  // const isComputePriceRaised =
  //   useFeatureFlagVariantKey('website_growth_compute_price_rising') === 'show_0_24';
  const isComputePriceRaised = true;

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

    return plans;
  }, [isComputePriceRaised]);

  return (
    <section className="hero safe-paddings overflow-hidden pt-36 2xl:pt-[150px] xl:pt-[120px] lg:pt-[52px] md:pt-10">
      <Container className="flex flex-col items-center" size="1344">
        <Heading
          className="text-center font-medium !leading-none tracking-tighter xl:text-6xl lg:text-[56px] md:!text-4xl"
          tag="h1"
          size="lg"
        >
          <span>Neon Pricing</span>
        </Heading>
        <p className="mx-auto mt-3 max-w-[680px] text-center text-xl font-light leading-snug tracking-extra-tight text-gray-new-80 xl:max-w-[560px] lg:text-lg md:text-base">
          Pricing plans that grow with you. From prototype to Enterprise.
        </p>
        <div className="relative mx-auto mt-16 xl:mt-14 xl:max-w-[644px] lg:mt-11 md:mt-9">
          <h2 className="sr-only">Neon pricing plans</h2>
          <ul className="grid-gap relative z-10 grid grid-cols-4 gap-x-8 2xl:gap-x-6 xl:grid-cols-2 lg:gap-y-4 md:grid-cols-1 md:gap-y-6">
            {plans.map(
              (
                {
                  type,
                  highlighted = false,
                  price,
                  priceFrom = false,
                  headerLinks,
                  description,
                  features,
                  otherFeatures,
                  button,
                },
                index
              ) => (
                <li
                  className={clsx(
                    'group relative flex min-h-full flex-col rounded-[10px] p-6 pt-5',
                    !highlighted && 'bg-black-new'
                  )}
                  key={index}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={clsx(
                        'text-xl font-medium leading-none tracking-extra-tight',
                        highlighted ? 'text-green-45' : 'text-white'
                      )}
                    >
                      {type}
                    </h3>
                    {headerLinks && (
                      <p
                        className={clsx(
                          'text-sm font-light leading-none text-gray-new-50',
                          '[&_a]:border-b [&_a]:border-[#85888E]/50 [&_a]:pb-0.5 [&_a]:tracking-tighter',
                          '[&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:border-transparent hover:[&_a]:text-gray-new-80'
                        )}
                        dangerouslySetInnerHTML={{ __html: headerLinks }}
                      />
                    )}
                  </div>
                  <p className="relative mt-16 ">
                    {priceFrom && (
                      <em className="absolute -top-5 block text-sm font-light not-italic leading-none tracking-extra-tight text-gray-new-50">
                        From
                      </em>
                    )}
                    <span className="text-[40px] font-medium leading-none tracking-tighter">
                      ${price}
                    </span>{' '}
                    <span className="text-sm font-light tracking-extra-tight text-gray-new-50">
                      /month
                    </span>
                  </p>
                  <Button
                    className={clsx(
                      'mt-6 w-full !py-4 !text-base !font-medium leading-none tracking-tighter transition-colors duration-300 sm:max-w-none',
                      highlighted
                        ? 'bg-green-45 text-black hover:bg-[#00ffaa]'
                        : 'bg-gray-new-15 hover:bg-gray-new-30'
                    )}
                    size="sm"
                    to={button.url}
                    tag_name={button.event}
                    onClick={() => {
                      if (button.analyticsEvent) {
                        posthog.capture(button.analyticsEvent);
                      }
                    }}
                  >
                    {button.text}
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
        <CtaBlock
          className="max-w-[656px]"
          title="Custom Enterprise Plans"
          description="Connect with our team for higher resource limits, dedicated requirements, annual contracts, and more."
          buttonText="Talk to Sales"
          buttonUrl={LINKS.contactSales}
          size="sm"
          hasDecor={false}
        />
      </Container>
    </section>
  );
};

export default Hero;

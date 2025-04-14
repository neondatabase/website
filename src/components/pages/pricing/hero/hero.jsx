'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { usePostHog } from 'posthog-js/react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import CtaBlock from 'components/shared/cta-block';
import Link from 'components/shared/link';
import LINKS from 'constants/links';

import PLANS from './data/plans.json';
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
    <section className="hero safe-paddings overflow-hidden pt-[158px] xl:pt-[134px] lg:pt-14 md:pt-12">
      <Container className="flex flex-col items-center xl:max-w-[704px] lg:!max-w-3xl" size="1344">
        <h1 className="text-center font-title text-[72px] font-medium leading-none tracking-tighter xl:text-6xl lg:text-[56px] md:text-4xl">
          Neon Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-[680px] text-center text-xl font-light leading-snug tracking-extra-tight text-gray-new-80 lg:text-lg md:text-base">
          Pricing plans that grow with you. From prototype to Enterprise.
        </p>
        <div className="relative mx-auto mt-16 xl:mt-14 lg:mt-11 md:mt-9">
          <h2 className="sr-only">Neon pricing plans</h2>
          <ul className="grid-gap relative z-10 grid grid-cols-4 gap-x-8 2xl:gap-x-6 xl:grid-cols-2 lg:gap-7 md:grid-cols-1 md:gap-4">
            {PLANS.map(
              (
                {
                  planId,
                  type,
                  highlighted = false,
                  price,
                  priceFrom = false,
                  customPrice = false,
                  headerLinks,
                  description,
                  features,
                  button,
                },
                index
              ) => (
                <li
                  className="group relative flex min-h-full flex-col rounded-[10px] bg-black-new p-6 pt-5"
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
                      {customPrice ? (
                        'Custom'
                      ) : (
                        <>
                          ${price}{' '}
                          <span className="text-sm font-light tracking-extra-tight text-gray-new-50">
                            /month
                          </span>
                        </>
                      )}
                    </span>
                  </p>
                  <Button
                    className={clsx(
                      'mt-6 w-full !py-4 !text-base leading-none tracking-tighter transition-colors duration-300 sm:max-w-none',
                      highlighted
                        ? 'bg-green-45 font-semibold text-black hover:bg-[#00ffaa]'
                        : 'bg-gray-new-20 font-medium hover:bg-gray-new-30'
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
                    {button.text}
                  </Button>
                  <p
                    className={clsx(
                      'mt-5 text-[15px] leading-snug tracking-extra-tight text-gray-new-60',
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
                  {features.map((featureBlock, index) => (
                    <Features {...featureBlock} key={index} highlighted={highlighted} />
                  ))}
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
          className="max-w-[656px] xl:mt-8 lg:mt-7 lg:max-w-full md:mt-4"
          title="Custom Plans"
          description="Connect with our team for HIPAA compliance, annual contracts, higher resource limits, and more."
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

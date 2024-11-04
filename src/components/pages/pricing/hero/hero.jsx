'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import AnimatedButton from 'components/shared/animated-button';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import CtaBlock from 'components/shared/cta-block';
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

const Hero = () => (
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
                headerLink,
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
                  {headerLink && (
                    <a
                      className={clsx(
                        'border-b border-[#85888E]/50 pb-0.5 text-sm font-light leading-none tracking-tighter text-gray-new-50',
                        'transition-colors duration-200 hover:border-transparent hover:text-gray-new-80'
                      )}
                      href={headerLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {headerLink.text}
                    </a>
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
                {highlighted ? (
                  <AnimatedButton
                    className="mt-6 w-full !bg-green-45 !py-4 !text-base !font-semibold leading-none tracking-tight group-hover:!bg-[#00ffaa] sm:max-w-none"
                    animationColor="#00e599"
                    theme="primary"
                    size="sm"
                    to={button.url}
                    tag_name={button.event}
                    isAnimated
                  >
                    {button.text}
                  </AnimatedButton>
                ) : (
                  <Button
                    className="mt-6 w-full bg-gray-new-15 !py-4 !text-base !font-medium leading-none tracking-tight transition-colors duration-500 hover:bg-gray-new-30 sm:max-w-none"
                    size="sm"
                    to={button.url}
                    tag_name={button.event}
                  >
                    {button.text}
                  </Button>
                )}
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
                      className="pointer-events-none absolute left-0 top-0 z-20 h-full w-full rounded-[10px] border border-green-45 transition-colors duration-300 md:!opacity-100"
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

export default Hero;

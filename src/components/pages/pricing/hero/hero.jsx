'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m, useAnimation } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import AnimatedButton from 'components/shared/animated-button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import CheckIcon from 'icons/check.inline.svg';

const items = [
  {
    type: 'Free Tier',
    price: 'Start free',
    description:
      'A generous free tier with essential features perfect for prototypes and personal projects.',
    features: [
      { title: '1 project, 10 branches, unlimited DBs' },
      { title: 'Shared compute, 3GiB storage' },
      { title: 'Community support' },
    ],
    button: {
      url: 'https://console.neon.tech/sign_in',
      text: 'Get Started',
      theme: 'white-outline',
    },
  },
  {
    type: 'Pro',
    price: 'Pay as you go',
    description:
      'A pro plan with features for production. Scales from $0 based on compute & storage usage.',
    features: [
      { title: 'Unlimited projects, branches, databases' },
      { title: 'Configurable compute, unlimited storage' },
      { title: 'Pro support' },
      { title: 'Autoscaling, read replicas, project sharing' },
    ],
    button: {
      url: '#estimates',
      text: 'Estimate Your Cost',
      theme: 'primary',
    },
  },
  {
    type: 'Enterprise',
    price: 'Custom plans',
    description:
      'Custom volume-based plans for <span class="text-white">medium to large teams, database fleets, and resale.</span>',
    features: [
      { title: 'Custom pricing with volume discounts' },
      { title: 'Prepaid plans and capacity contracts' },
      { title: 'Enterprise support' },
    ],
    button: {
      url: LINKS.contactSales,
      text: 'Contact Sales',
      theme: 'white-outline',
    },
  },
];

const Hero = () => {
  const [isLoad, setIsLoad] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(1);
  const controls = useAnimation();

  const borderLightVariants = useMemo(
    () => ({
      from: {
        opacity: 0,
      },
      to: {
        opacity: hoverCount === 0 ? [0, 1, 0.5, 1, 0.75, 1] : [0, 0.4, 0.2, 1, 0.5, 1],
        transition: {
          ease: 'easeInOut',
          duration: hoverCount === 0 ? 0.5 : 1,
        },
      },
      exit: {
        opacity: 0,
      },
    }),
    [hoverCount]
  );

  useEffect(() => {
    controls.start('to');
  }, [controls]);

  useEffect(() => {
    setIsLoad(true);
  }, []);

  return (
    <section className="hero safe-paddings overflow-hidden pt-36 2xl:pt-[150px] xl:pt-[120px] lg:pt-[52px] md:pt-[40px]">
      <Container className="flex flex-col items-center" size="medium">
        <Heading
          className="inline-flex flex-col text-center font-medium !leading-none tracking-tighter md:text-4xl"
          tag="h1"
          size="lg"
        >
          <span className="text-pricing-primary-1">Start free.</span>{' '}
          <span>Only pay for what you use.</span>
        </Heading>
        <p className="mx-auto mt-5 max-w-[656px] text-center text-xl font-light leading-snug xl:mt-4 xl:max-w-[570px] xl:text-lg md:mt-3 md:text-base">
          Neon brings serverless architecture to Postgres, which allows us to offer you flexible
          usage and volume-based plans.
        </p>
        <div className="relative mx-auto mt-16 max-w-[1220px] xl:mt-12 md:mt-9">
          <ul className="relative z-10 grid grid-cols-3 gap-x-11 xl:gap-x-6 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-4 md:grid-cols-1 md:gap-y-6">
            {items.map(({ type, price, description, features, button }, index) => (
              <li
                className={clsx(
                  'group relative rounded-[10px]',
                  type === 'Pro' && 'lg:-order-1 lg:col-span-full'
                )}
                style={{
                  '--accentColor':
                    type === 'Free Tier' ? '#ade0eb' : type === 'Pro' ? '#00e599' : '#f0f075',
                  '--hoverColor':
                    type === 'Free Tier' ? '#c6eaf1' : type === 'Pro' ? '#00ffaa' : '#f5f5a3',
                }}
                key={index}
                onPointerEnter={() => {
                  setActiveItemIndex(index);
                  setHoverCount((prev) => (prev === 1 ? 0 : prev + 1));
                  controls.start('to');
                }}
              >
                <Link
                  className={clsx(
                    'relative z-10 flex min-h-full flex-col rounded-[10px] px-7 py-5 transition-colors duration-500 xl:p-5 xl:pb-3 lg:p-5',
                    activeItemIndex !== index ? 'bg-gray-new-8' : 'bg-transparent'
                  )}
                  to={button.url}
                >
                  <div className="mb-6 min-h-[280px] flex flex-col border-b border-dashed border-gray-new-20 pb-4 xl:mb-7 lg:min-h-max">
                    <span className="text-xl font-medium leading-none tracking-tight text-[var(--accentColor)]">
                      {type}
                    </span>
                    <h2 className="mt-7 text-[36px] font-light leading-none tracking-tighter xl:mt-6 xl:text-[32px] md:mt-4">
                      {price}
                    </h2>
                    <AnimatedButton
                      className={clsx(
                        'mt-7 w-full !bg-[var(--accentColor)] !py-4 !text-lg !font-medium tracking-tight group-hover:!bg-[var(--hoverColor)] xl:mt-8 md:mt-7 sm:max-w-none',
                        type === 'Pro'
                          ? 'lg:absolute lg:right-8 lg:top-0 lg:max-w-[210px] md:relative md:right-0 md:max-w-[304px]'
                          : 'lg:max-w-[304px]'
                      )}
                      isAnimated={activeItemIndex === index}
                      animationColor="var(--accentColor)"
                      theme="primary"
                      size="sm"
                    >
                      {button.text}
                    </AnimatedButton>
                    <p
                      className={clsx(
                        'mt-9 font-light leading-snug tracking-tight text-gray-new-70 md:mt-8',
                        type === 'Pro' ? 'lg:mt-5' : 'lg:min-h-[66px] md:min-h-fit'
                      )}
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                  <div className="mt-auto flex grow flex-col">
                    <ul
                      className={clsx(
                        'mb-4 flex flex-col flex-wrap space-y-4 xl:mb-5 lg:mb-2.5 md:mb-7',
                        type === 'Pro' ? 'lg:max-h-28 lg:gap-4 lg:space-y-0 md:max-h-max' : ''
                      )}
                    >
                      {features.map(({ title, label }, index) => (
                        <li
                          className={clsx(
                            'relative pl-6 leading-tight tracking-tight',
                            type === 'Pro' && 'lg:w-1/3 md:w-full'
                          )}
                          key={index}
                        >
                          <CheckIcon
                            className="absolute left-0 top-[2px] h-4 w-4 text-[var(--accentColor)]"
                            aria-hidden
                          />
                          <span>{title}</span>
                          {label && (
                            <span className="ml-2 whitespace-nowrap rounded-full bg-pricing-primary-4 px-3 py-1 align-middle text-[10px] font-semibold uppercase leading-none tracking-[0.02em] text-pricing-primary-1">
                              {label}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
                <LazyMotion features={domAnimation}>
                  <m.span
                    className={clsx(
                      'pointer-events-none absolute left-0 top-0 z-20 h-full w-full rounded-[10px] border transition-colors duration-300 md:border-[var(--accentColor)] md:!opacity-100',
                      isLoad !== true && '!opacity-100',
                      activeItemIndex === index
                        ? 'border-[var(--accentColor)]'
                        : 'border-transparent'
                    )}
                    initial="from"
                    exit="exit"
                    variants={borderLightVariants}
                    animate={controls}
                    aria-hidden
                  />
                </LazyMotion>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
};

export default Hero;

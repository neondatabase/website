'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

import AnimatedButton from 'components/shared/animated-button';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import Tooltip from 'components/shared/tooltip';
import LINKS from 'constants/links';
import CheckIcon from 'icons/check.inline.svg';
import XIcon from 'icons/no.inline.svg';
import infoSvg from 'icons/tooltip.svg';
import sendGtagEvent from 'utils/send-gtag-event';
import sendSegmentEvent from 'utils/send-segment-event';

const items = [
  {
    type: 'Free Tier',
    price: '$0 <span>/month</span>',
    description: 'Generous always-available free tier, no credit card required.',
    features: [
      { title: 'Fixed capacity at 0.25 CU', tooltip: '0.25 CU = 0.25 vCPU, 1 GiB RAM' },
      { title: '24/7 for your main compute', tooltip: 'Plus 20h of usage for secondary computes ' },
      { title: '0.5 GiB of storage' },
      { title: 'Community support ' },
      { title: 'Autoscaling', disabled: true },
      { title: 'Read Replicas', disabled: true },
      { title: 'IP Allow Rules', disabled: true },
    ],
    button: {
      url: LINKS.signup,
      text: 'Start for free',
      theme: 'white-outline',
      event: 'pricing_hero_free_btn_click',
    },
  },
  {
    type: 'Launch',
    price:
      '<em class="absolute -top-6 text-base not-italic font-light tracking-tight text-gray-new-50 xl:relative xl:top-0 xl:mb-1.5">From</em> $19 <span>/month</span>',
    description: 'All the resources, features and support you need to launch.',
    features: [
      { title: 'Up to 4 CU compute capacity', tooltip: '4 CU = 4 vCPU, 16 GiB RAM' },
      { title: '300 CU-hours included', tooltip: 'Additional usage: $0.16 per CU-hour' },
      { title: '10 GiB storage included', tooltip: 'Addtional storage: $3.5 for 2 GiB' },
      { title: 'Standard support' },
      { title: 'Autoscaling from 0 to 4 CU', tooltip: 'Scale automatically up to 4 vCPU 16GB RAM' },
      { title: 'Read Replicas' },
      { title: 'IP Allow Rules', disabled: true },
    ],
    button: {
      url: LINKS.signup,
      text: 'Get started',
      theme: 'primary',
      event: 'pricing_hero_launch_btn_click',
    },
  },
  {
    type: 'Scale',
    price:
      '<em class="absolute -top-6 text-base not-italic font-light tracking-tight text-gray-new-50 xl:relative xl:top-0 xl:mb-1.5">From</em> $69 <span>/month</span>',
    description: 'Full platform and support access, designed for scaling production workloads.',
    features: [
      { title: 'Up to 8 CU compute capacity', tooltip: '8 CU = 8 vCPU, 32 GiB RAM ' },
      { title: '750 CU-hours included', tooltip: 'Additional usage: $0.16 per CU-hour' },
      { title: '50 GiB storage included', tooltip: 'Addtional storage: $15 for 10 GiB' },
      { title: 'Priority support' },
      { title: 'Autoscaling from 0 to 8 CU', tooltip: 'Scale automatically up to 8 vCPU 32GB RAM' },
      { title: 'Read Replicas' },
      { title: 'IP Allow Rules' },
    ],
    button: {
      url: LINKS.signup,
      text: 'Get started',
      theme: 'white-outline',
      event: 'pricing_hero_scale_btn_click',
    },
  },
  {
    type: 'Enterprise',
    price: 'Custom',
    description: 'Custom plans for large teams and database fleets.',
    features: [
      { title: 'Storage and compute discounts' },
      { title: 'Higher resource limits' },
      { title: 'Customer-owned S3' },
      { title: 'Enterprise support w/SLAs' },
    ],
    button: {
      url: `${LINKS.enterprise}#request-trial`,
      text: 'Request trial',
      theme: 'white-outline',
      event: 'pricing_hero_custom_btn_click',
    },
  },
];

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
  const [isLoad, setIsLoad] = useState(false);
  const controls = useAnimation();

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
          <span>Neon Pricing</span>
        </Heading>
        <p className="mx-auto mt-5 max-w-[680px] text-center text-xl font-light leading-snug xl:mt-4 xl:max-w-[570px] xl:text-lg md:mt-3 md:text-base">
          Start free, launch with predictable costs, and scale efficiently.
        </p>
        <div className="relative mx-auto mt-20 xl:mt-12 lg:w-full lg:max-w-[704px] md:mt-9">
          <h2 className="sr-only">Neon pricing plans</h2>
          <ul className="grid-gap relative z-10 grid grid-cols-4 xl:grid-cols-2 lg:gap-y-4 md:grid-cols-1 md:gap-y-6">
            {items.map(({ type, price, description, features, button }, index) => {
              const isScalePlan = type === 'Scale';

              return (
                <li
                  className="group relative rounded-[10px]"
                  key={index}
                  onPointerEnter={() => {
                    if (isScalePlan) {
                      controls.start('to');
                    }
                  }}
                >
                  <Link
                    className={clsx(
                      !isScalePlan &&
                        'border border-transparent bg-gray-new-8 group-hover:border-gray-new-15 group-hover:bg-gray-new-10',
                      'relative z-10 flex min-h-full flex-col rounded-[10px]  px-7 pb-9 pt-5 transition-colors duration-500 xl:px-6 xl:py-5 sm:p-5'
                    )}
                    to={button.url}
                    onClick={() => {
                      sendGtagEvent(button.event);
                      sendSegmentEvent(button.event);
                    }}
                  >
                    <div className="mb-6 flex flex-col border-b border-dashed border-gray-new-20 pb-5 xl:mb-5">
                      <h3
                        className={clsx(
                          isScalePlan && 'text-green-45',
                          'text-xl font-medium leading-none tracking-tight text-gray-new-80 xl:text-lg'
                        )}
                      >
                        {type}
                      </h3>
                      <p
                        className="relative mt-14 text-[36px] leading-none tracking-tighter xl:mt-5 xl:text-[32px] md:mt-4 [&_span]:text-[28px] [&_span]:font-light [&_span]:-tracking-[0.06em] [&_span]:text-gray-new-50"
                        dangerouslySetInnerHTML={{ __html: price }}
                      />
                      {isScalePlan ? (
                        <AnimatedButton
                          className="mt-7 w-full !bg-green-45 !py-4 !text-lg !font-medium tracking-tight group-hover:!bg-[#00ffaa] xl:mt-7 sm:max-w-none"
                          animationColor="#00e599"
                          theme="primary"
                          size="sm"
                          isAnimated
                        >
                          {button.text}
                        </AnimatedButton>
                      ) : (
                        <Button
                          className="mt-7 w-full bg-gray-new-15 !py-4 !text-lg !font-medium tracking-tight xl:mt-7 sm:max-w-none"
                          size="sm"
                        >
                          {button.text}
                        </Button>
                      )}
                      <p className="mt-9 font-light leading-snug tracking-tight text-gray-new-70  2xl:min-h-[66px] xl:mt-8 xl:min-h-[44px] lg:min-h-max">
                        {description}
                      </p>
                    </div>
                    <div className="mt-auto flex grow flex-col">
                      <ul className="flex flex-col flex-wrap gap-y-4">
                        {features.map(({ title, tooltip, disabled }, index) => (
                          <li
                            className={clsx(
                              disabled ? 'text-gray-new-50' : 'text-gray-new-70',
                              'relative pl-6 leading-tight tracking-tight'
                            )}
                            key={index}
                          >
                            {disabled ? (
                              <XIcon
                                className={clsx(
                                  'absolute left-0 top-[2px] h-4 w-4 text-gray-new-50'
                                )}
                                aria-hidden
                              />
                            ) : (
                              <CheckIcon
                                className={clsx(
                                  isScalePlan ? 'text-green-45' : 'text-gray-new-70',
                                  'absolute left-0 top-[2px] h-4 w-4 '
                                )}
                                aria-hidden
                              />
                            )}
                            <span
                              data-tooltip-id={tooltip && `${type}_tooltip_${index}`}
                              data-tooltip-html={tooltip && tooltip}
                            >
                              {title}
                              {tooltip && (
                                <img
                                  className="relative -top-px ml-1.5 inline"
                                  src={infoSvg}
                                  width={14}
                                  height={14}
                                  alt=""
                                  loading="lazy"
                                  aria-hidden
                                />
                              )}
                            </span>
                            {tooltip && (
                              <Tooltip
                                className="w-sm z-20"
                                id={`${type}_tooltip_${index}`}
                                place="top-center"
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                  {isScalePlan && (
                    <LazyMotion features={domAnimation}>
                      <m.span
                        className={clsx(
                          'pointer-events-none absolute left-0 top-0 z-20 h-full w-full rounded-[10px] border border-green-45 transition-colors duration-300 md:!opacity-100',
                          isLoad && '!opacity-100'
                        )}
                        initial="from"
                        exit="exit"
                        variants={scaleCardBorderVariants}
                        animate={controls}
                        aria-hidden
                      />
                    </LazyMotion>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-16 text-center text-lg font-light leading-snug">
          Not sure which plan is right for you?
          <br />
          Explore the{' '}
          <Button
            className="inline-block !font-light decoration-1 underline-offset-4 hover:!decoration-green-45/0"
            theme="green-underlined"
            onClick={() => {
              document?.getElementById('plans')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          >
            detailed plan comparison
          </Button>
          .
        </p>
      </Container>
    </section>
  );
};

export default Hero;

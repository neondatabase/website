'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import AnimatedButton from 'components/shared/animated-button';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import InfoIcon from 'components/shared/info-icon';
import LINKS from 'constants/links';
import CheckIcon from 'icons/check.inline.svg';
import CrossIcon from 'icons/cross.inline.svg';

import AWSIcon from './images/aws.inline.svg';

const items = [
  {
    type: 'Free Plan',
    price: '$0 <span>/month</span>',
    description: 'Always-available free tier, no credit card required.',
    features: [
      { title: '0.5 GiB storage' },
      { title: '10 branches', info: 'All within 1 project' },
      { title: '24/7 database at 0.25 CU', info: 'Plus 20h of usage for additional branches. 0.25 CU = 0.25 vCPU, 1 GB RAM' },
      { title: 'Autoscaling up to 2 CU', info: '2 CU = 2 vCPU, 8 GB RAM'  },
      { title: 'Point-in-time restore (24 h)' },
      { title: 'Community support' },
      { title: 'Organization accounts', disabled: true },
      { title: 'Branch protection', disabled: true },
      { title: 'SOC 2, 99.95% SLA', disabled: true },
    ],
    button: {
      url: LINKS.signup,
      text: 'Start for free',
      theme: 'white-outline',
      event: 'Hero Free Tier Panel',
    },
  },
  {
    type: 'Launch',
    price:
      '<em class="xl:-top-1 block absolute -top-6 text-base not-italic font-light tracking-tight text-gray-new-50 xl:relative xl:-mt-4 md:mt-0">From</em> $19 <span>/month</span>',
    description: 'All the resources, features and support you need to launch.',
    features: [
      {
        title: '10 GiB storage included',
        info: 'Additional storage: $3.5 per 2 GiB',
      },
      { title: '500 branches per project', info: 'Max 10 projects' },
      {
        title: '300 <a href="#compute-hour">compute hours</a> included',
        info: 'Additional usage: $0.16 per compute hour',
      },
      { title: 'Autoscaling up to 4 CU', info: '4 CU = 4 vCPU, 16 GB RAM' },
      { title: 'Point-in-time restore (7 days)' },
      { title: 'Standard support' },
      { title: 'Organization accounts' },
      { title: 'Branch protection', disabled: true },
      { title: 'SOC 2, 99.95% SLA', disabled: true },
    ],
    button: {
      url: `${LINKS.console}/?upgrade=launch`,
      text: 'Get started',
      theme: 'primary',
      event: 'Hero Launch Panel',
    },
  },
  {
    type: 'Scale',
    price:
      '<em class="absolute block xl:-top-1 -top-6 text-base not-italic font-light tracking-tight text-gray-new-50 xl:relative xl:-mt-4 md:mt-0">From</em> $69 <span>/month</span>',
    description: 'Full platform access for scaling production workloads.',
    features: [
      { title: '50 GiB storage included', info: 'Additional storage: $15 per 10 GiB' },
      { title: '500 branches per project', info: '50 projects included. Additional 10 projects: $50/month' },
      {
        title: '750 <a href="#compute-hour">compute hours</a> included',
        info: 'Additional usage: $0.16 per compute hour',
      },
      { title: 'Autoscaling up to 8 CU', info: '8 CU = 8 vCPU, 32 GB RAM' },
      { title: 'Point-in-time restore (14 days)' },
      { title: 'Standard support' },
      { title: 'Organization accounts' },
      { title: 'Branch protection', disabled: true },
      { title: 'SOC 2, 99.95% SLA', disabled: true },
    ],
    button: {
      url: `${LINKS.console}/?upgrade=scale`,
      text: 'Get started',
      theme: 'white-outline',
      event: 'Hero Scale Panel',
    },
  },
  {
    type: 'Business',
    price:
      '<em class="absolute block xl:-top-1 -top-6 text-base not-italic font-light tracking-tight text-gray-new-50 xl:relative xl:-mt-4 md:mt-0">From</em> $700 <span>/month</span>',
    description: 'For existing workloads with larger storage/compute requirements.',
    features: [
      { title: '500 GiB storage included', info: 'Additional storage: $0.75 per GiB' },
      { title: '500 branches per project', info: '100 projects included. Additional 10 projects: $50/month' },
      {
        title: '1000 <a href="#compute-hour">compute hours</a> included',
        info: 'Additional usage: $0.16 per compute hour',
      },
      { title: 'Autoscaling up to 10 CU', info: '10 CU = 10 vCPU, 40 GB RAM' },
      { title: 'Point-in-time restore (30 days)' },
      { title: 'Priority support' },
      { title: 'Organization accounts' },
      { title: 'Branch protection' },
      { title: 'SOC 2, 99.95% SLA' },
    ],
    button: {
      url: `${LINKS.enterprise}#request-trial`,
      text: 'Get started',
      theme: 'white-outline',
      event: 'Hero Enterprise Panel',
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

const Feature = ({ title, info, disabled, type, index }) => (
  <li
    className={clsx(
      type === 'Scale' && 'text-white',
      disabled ? 'text-gray-new-30 opacity-80' : 'text-gray-new-70',
      'relative pl-6 leading-tight tracking-tight'
    )}
  >
    {disabled ? (
      <CrossIcon
        className={clsx('absolute left-0 top-[2px] h-4 w-4 text-gray-new-30')}
        aria-hidden
      />
    ) : (
      <CheckIcon
        className={clsx(
          type === 'Scale' ? 'text-green-45' : 'text-gray-new-70',
          'absolute left-0 top-[2px] h-4 w-4'
        )}
        aria-hidden
      />
    )}
    <span className="with-link-primary" dangerouslySetInnerHTML={{ __html: title }} />
    {info && (
      <span className="whitespace-nowrap">
        &nbsp;
        <InfoIcon
          className="relative top-0.5 ml-0.5 inline-block"
          tooltip={info}
          tooltipId={`${type}_tooltip_${index}`}
        />
      </span>
    )}
  </li>
);

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  index: PropTypes.number,
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
      <Container className="flex flex-col items-center" size="1344">
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
          <ul className="grid-gap relative z-10 grid grid-cols-4 gap-x-6 xl:grid-cols-2 lg:gap-y-4 md:grid-cols-1 md:gap-y-6">
            {items.map(({ type, price, description, features, button }, index) => {
              const isScalePlan = type === 'Scale';

              return (
                <li
                  className={clsx(
                    'group relative flex min-h-full flex-col rounded-[10px] px-7 pb-9 pt-5 xl:px-6 xl:py-5 sm:p-5',
                    !isScalePlan && 'border border-transparent bg-black-new'
                  )}
                  key={index}
                  onPointerEnter={() => {
                    if (isScalePlan) {
                      controls.start('to');
                    }
                  }}
                >
                  {(isScalePlan || type === 'Launch') && (
                    <a
                      className="group/aws absolute right-[18px] top-5 flex items-center gap-x-2"
                      href="https://aws.amazon.com/marketplace/pp/prodview-fgeh3a7yeuzh6?sr=0-1&ref_=beagle&applicationId=AWSMPContessa"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="border-b border-gray-new-40 pb-0.5 text-sm font-light leading-none tracking-extra-tight text-gray-new-70 opacity-90 transition-colors duration-200 group-hover/aws:border-transparent group-hover/aws:text-gray-new-80">
                        Pay via marketplace
                      </span>
                      <AWSIcon className="text-gray-new-50 transition-colors duration-200 group-hover/aws:text-gray-new-60" />
                    </a>
                  )}
                  <div className="mb-6 flex flex-col border-b border-dashed border-gray-new-20 pb-5 xl:mb-5">
                    <h3
                      className={clsx(
                        isScalePlan && 'text-green-45',
                        'text-xl font-medium leading-none tracking-tight text-gray-new-70 xl:text-lg'
                      )}
                    >
                      {type}
                    </h3>
                    <p
                      className="relative mt-14 text-[36px] leading-none tracking-tighter xl:mt-9 xl:text-[32px] md:mt-4 [&_span]:text-[28px] [&_span]:font-light [&_span]:-tracking-[0.06em] [&_span]:text-gray-new-50"
                      dangerouslySetInnerHTML={{ __html: price }}
                    />
                    {isScalePlan ? (
                      <AnimatedButton
                        className="mt-7 w-full !bg-green-45 !py-4 !text-lg !font-medium tracking-tight group-hover:!bg-[#00ffaa] xl:mt-7 sm:max-w-none"
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
                        className="mt-7 w-full bg-gray-new-15 bg-opacity-80 !py-4 !text-lg !font-medium tracking-tight transition-colors duration-500 hover:bg-gray-new-30 xl:mt-7 sm:max-w-none"
                        size="sm"
                        to={button.url}
                        tag_name={button.event}
                      >
                        {button.text}
                      </Button>
                    )}
                    <p className="mt-9 font-light leading-snug tracking-tighter text-gray-new-50 2xl:min-h-[66px] xl:mt-8 xl:min-h-[44px] lg:min-h-max">
                      {description}
                    </p>
                  </div>
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
                  <div className="mt-auto flex grow flex-col">
                    <ul className="flex flex-col flex-wrap gap-y-4">
                      {features.map((feature, index) => (
                        <Feature {...feature} type={type} index={index} key={index} />
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-16 text-center text-lg font-light leading-snug text-gray-new-80">
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

'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m, useAnimation } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import AnimatedButton from 'components/shared/animated-button';
import Button from 'components/shared/button';
import Container from 'components/shared/container';
import CtaBlock from 'components/shared/cta-block';
import Heading from 'components/shared/heading';
import InfoIcon from 'components/shared/info-icon';
import LINKS from 'constants/links';
import CheckIcon from 'icons/check.inline.svg';
import CrossIcon from 'icons/cross.inline.svg';

const items = [
  {
    type: 'Free Plan',
    price: 0,
    headerLink: undefined,
    description: 'Always-available free tier, no credit card required.',
    features: [
      {
        title: '1 project',
        info: '10 branches',
      },
      { title: '0.5 GiB storage' },
      { title: 'Autoscaling up to 2 CU', info: '2 CU = 2 vCPU, 8 GB RAM' },
      { title: 'Community Support' },
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
    highlighted: true,
    price: 19,
    priceFrom: true,
    headerLink: {
      url: 'https://aws.amazon.com/marketplace/pp/prodview-fgeh3a7yeuzh6?sr=0-1&ref_=beagle&applicationId=AWSMPContessa',
      text: 'Pay via marketplace AWS',
    },
    description: 'The resources, features, and support you need to launch.',
    features: [
      {
        title: '100 projects',
        info: '500 branches per project',
      },
      {
        title: '10 GiB storage included',
        info: 'Additional storage: $3.5 per 2 GiB',
      },
      {
        title: '300 <a href="#compute-hour">compute hours</a> included',
        info: 'Additional usage: $0.16 per compute hour',
      },
      { title: 'Autoscaling up to 4 CU', info: '4 CU = 4 vCPU, 16 GB RAM' },
      { title: 'Point-in-time restore (7 days)' },
      { title: 'Standard Support' },
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
    price: 69,
    priceFrom: true,
    headerLink: {
      url: 'https://aws.amazon.com/marketplace/pp/prodview-fgeh3a7yeuzh6?sr=0-1&ref_=beagle&applicationId=AWSMPContessa',
      text: 'Pay via marketplace AWS',
    },
    description: 'More capacity and functionality for scaling production workloads.',
    features: [
      {
        title: '1,000 projects',
        info: '500 branches per project',
      },
      { title: '50 GiB storage included', info: 'Additional storage: $15 per 10 GiB' },
      {
        title: '750 <a href="#compute-hour">compute hours</a> included',
        info: 'Additional usage: $0.16 per compute hour',
      },
      { title: 'Autoscaling up to 8 CU', info: '8 CU = 8 vCPU, 32 GB RAM' },
      { title: 'Point-in-time restore (14 days)' },
      { title: 'Standard support' },
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
    price: 700,
    priceFrom: true,
    headerLink: {
      url: '/migration-assistance',
      text: 'Get migration help',
    },
    description:
      'For larger workloads, partners, and best compliance/security. <a href="#business-plan">Who is this for?</a>',
    features: [
      {
        title: '5,000 projects',
        info: '$50 per 5,000 extra projects',
      },
      { title: '500 GiB storage included', info: 'Additional storage: $5 per 10 GiB' },
      {
        title: '1000 <a href="#compute-hour">compute hours</a> included',
        info: 'Additional usage: $0.16 per compute hour',
      },
      { title: 'Higher compute capacity', info: 'Autoscaling up to 10 CU, larger fixed computes' },
      { title: 'Point-in-time restore (30 days)' },
      { title: 'Private Link' },
      { title: 'Datadog integration' },
      {
        title: 'Migration assistance',
        info: 'With 0 migration fees—we will waive them',
      },
      { title: 'SOC 2 + 99.95% SLA' },
      { title: 'Priority support' },
    ],
    button: {
      url: `${LINKS.console}/?upgrade=business`,
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

const Feature = ({ title, info, disabled, type, highlighted, index }) => (
  <li
    className={clsx(
      disabled ? 'text-gray-new-30 opacity-80' : 'text-gray-new-70',
      !disabled && highlighted && 'text-white',
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
          highlighted ? 'text-green-45' : 'text-gray-new-70',
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
  highlighted: PropTypes.bool,
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
      <Container className="flex flex-col items-center" size="1472">
        <Heading
          className="inline-flex flex-col text-center font-medium !leading-none tracking-tighter md:text-4xl"
          tag="h1"
          size="lg"
        >
          <span>Neon Pricing</span>
        </Heading>
        <p className="mx-auto mt-5 max-w-[680px] text-center text-xl font-light leading-snug xl:mt-4 xl:max-w-[570px] xl:text-lg md:mt-3 md:text-base">
          Pricing plans that grow with you. From prototype to Enterprise.
        </p>
        <div className="relative mx-auto mt-20 xl:mt-12 lg:w-full lg:max-w-[704px] md:mt-9">
          <h2 className="sr-only">Neon pricing plans</h2>
          <ul className="grid-gap relative z-10 grid grid-cols-4 gap-x-10 2xl:gap-x-6 xl:grid-cols-2 lg:gap-y-4 md:grid-cols-1 md:gap-y-6">
            {items.map(
              (
                {
                  type,
                  highlighted = false,
                  price,
                  priceFrom = false,
                  headerLink,
                  description,
                  features,
                  button,
                },
                index
              ) => (
                <li
                  className={clsx(
                    'group relative flex min-h-full flex-col rounded-[10px] px-7 pb-9 pt-5 xl:px-6 xl:py-5 sm:p-5',
                    !highlighted && 'border border-transparent bg-black-new'
                  )}
                  key={index}
                  onPointerEnter={() => {
                    if (highlighted) {
                      controls.start('to');
                    }
                  }}
                >
                  {headerLink && (
                    <a
                      className="group/aws absolute right-[18px] top-5 flex items-center gap-x-2"
                      href={headerLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="border-b border-gray-new-40 pb-0.5 text-sm font-light leading-none tracking-extra-tight text-gray-new-70 opacity-90 transition-colors duration-200 group-hover/aws:border-transparent group-hover/aws:text-gray-new-80">
                        {headerLink.text}
                      </span>
                    </a>
                  )}
                  <div className="mb-6 flex flex-col border-b border-dashed border-gray-new-20 pb-5 xl:mb-5">
                    <h3
                      className={clsx(
                        highlighted && 'text-green-45',
                        'text-xl font-medium leading-none tracking-tight text-gray-new-70 xl:text-lg'
                      )}
                    >
                      {type}
                    </h3>
                    <p className="relative mt-[51px] text-[36px] leading-none tracking-tighter xl:mt-9 xl:text-[32px] md:mt-4">
                      {priceFrom && (
                        <em className="absolute -top-5 block text-base font-light not-italic tracking-tight text-gray-new-50 xl:relative xl:-top-1 xl:-mt-4 md:mt-0">
                          From
                        </em>
                      )}
                      ${price}{' '}
                      <span className="text-[28px] font-light -tracking-[0.06em] text-gray-new-50">
                        /month
                      </span>
                    </p>
                    {highlighted ? (
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
                    <p
                      className="mt-9 font-light leading-snug tracking-tighter text-gray-new-50 2xl:min-h-[66px] xl:mt-8 xl:min-h-[44px] lg:min-h-max [&_a]:text-white [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:decoration-transparent"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                  {highlighted && (
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
                        <Feature
                          {...feature}
                          type={type}
                          highlighted={highlighted}
                          index={index}
                          key={index}
                        />
                      ))}
                    </ul>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
        <p className="mb-10 mt-16 text-center text-lg font-light leading-snug text-gray-new-80 sm:mb-4">
          <br />
          Explore the{' '}
          <Button
            className="inline-block !font-light text-green-45 transition-colors duration-200 hover:text-[#00FFAA]"
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
        <CtaBlock
          className="max-w-[716px]"
          title="Custom Enterprise Plans"
          description="Connect with our team for higher resource limits, dedicated requirements, annual contracts, and more."
          buttonText="Talk to Sales"
          buttonUrl={LINKS.contactSales}
        />
      </Container>
    </section>
  );
};

export default Hero;

'use client';

import clsx from 'clsx';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import LINKS from 'constants/links';
import CheckIcon from 'icons/check.inline.svg';
import lines from 'images/pages/pricing/green-lines.svg';

const items = [
  {
    type: 'Free Tier',
    price: 'Free',
    description:
      'Essential features to help you get started with Neon. Perfect for prototyping and personal projects.',
    features: [
      { title: '1 project' },
      { title: '10 branches' },
      { title: '3 GB of data per branch' },
      { title: 'A shared compute with 1 GB of RAM' },
      { title: 'Auto-suspend compute' },
    ],
    button: {
      url: 'https://console.neon.tech/sign_in',
      text: 'Get Started',
      theme: 'white-outline',
    },
  },
  {
    type: 'Pro',
    price: 'Starting at $0',
    description:
      'A usage-based plan for small to medium teams. Unlimited resources with advanced configuration options. Share your projects with anyone. Only pay for what you use with no fixed contract.',
    features: [
      { title: 'Unlimited branches' },
      { title: 'Project sharing' },
      { title: 'Configurable compute size' },
      { title: 'Autoscaling', label: 'beta' },
      { title: 'Configurable auto-suspend compute', label: 'coming soon' },
    ],
    button: {
      url: 'https://console.neon.tech/app/projects?show_enroll_to_pro=true',
      text: 'Upgrade',
      theme: 'primary',
    },
  },
  {
    type: 'Custom',
    price: 'Contact us',
    description:
      'Custom volume-based plans for medium to large teams, database fleets, and resale. Contact our Sales team to learn more.',
    features: [
      { title: 'Custom contracts' },
      { title: 'Prepaid plans' },
      { title: 'Volume discounts' },
    ],
    button: {
      url: LINKS.contactSales,
      text: 'Contact Sales',
      theme: 'white-outline',
    },
  },
];

const Hero = () => (
  <section className="hero safe-paddings overflow-hidden pt-36 2xl:pt-[150px] xl:pt-[120px] lg:pt-[50px]">
    <Container className="flex flex-col items-center" size="mdDoc">
      <Heading
        className="inline-flex flex-col text-center font-medium !leading-none tracking-tighter"
        tag="h1"
        size="lg"
      >
        <span className="text-pricing-primary-1">Start Free.</span>{' '}
        <span>Only pay for what you use.</span>
      </Heading>
      <p className="mx-auto mt-5 max-w-[656px] text-center text-xl font-light leading-snug xl:mt-4 xl:max-w-[590px] xl:text-lg lg:max-w-[464px]">
        Neon brings serverless architecture to PostgreSQL, which allows us to offer you flexible
        usage and volume-based plans.
      </p>
      <div className="relative mx-auto mt-16 max-w-[1220px] xl:mt-12 lg:mt-7">
        <ul className="relative z-10 grid grid-cols-3 gap-x-11 xl:gap-x-6 lg:grid-cols-2 lg:gap-y-8 md:grid-cols-1">
          {items.map(({ type, price, description, features, button }, index) => (
            <li
              className={clsx(
                'flex flex-col rounded-[10px] px-7 py-5 xl:p-5 xl:pb-3 lg:p-7',
                type === 'Pro' ? 'border border-pricing-primary-1' : 'bg-pricing-gray-10',
                type === 'Free Tier' && 'lg:order-1 lg:col-span-full'
              )}
              style={{
                '--accentColor':
                  type === 'Free Tier' ? '#ade0eb' : type === 'Pro' ? '#00e599' : '#f0f075',
                '--hoverColor':
                  type === 'Free Tier' ? '#c6eaf1' : type === 'Pro' ? '#00ffaa' : '#f5f5a3',
              }}
              key={index}
            >
              <div
                className={clsx(
                  'mb-6 flex min-h-[330px] flex-col border-b border-dashed border-pricing-gray-2 pb-4 xl:mb-6 xl:min-h-[348px] md:min-h-max',
                  type === 'Free Tier' ? 'lg:min-h-max' : 'lg:min-h-[345px]'
                )}
              >
                <span className="text-xl font-medium leading-none tracking-tight text-[var(--accentColor)]">
                  {type}
                </span>
                <h3 className="mt-7 text-[36px] font-light leading-none tracking-tighter xl:mt-6 xl:text-[32px]">
                  {price}
                </h3>
                <Button
                  className="relative mt-7 w-full border border-transparent !bg-[var(--accentColor)] !py-4 !text-lg !font-medium tracking-tight hover:!bg-[var(--hoverColor)] xl:mt-8 lg:max-w-[304px] sm:max-w-none"
                  theme="primary"
                  to={button.url}
                  size="sm"
                >
                  {button.text}
                  {type === 'Pro' && (
                    <img
                      className="pointer-events-none absolute -top-8 left-1/2 -z-10 min-w-[120%] -translate-x-1/2 sm:min-w-full"
                      src={lines}
                      width={376}
                      height={134}
                      alt=""
                    />
                  )}
                </Button>
                <p className="mt-9 font-light leading-snug tracking-tight text-pricing-gray-7 lg:mt-7">
                  {description}
                </p>
              </div>
              <div className="mt-auto flex grow flex-col">
                <ul className="mb-4 flex flex-col space-y-4 xl:mb-5 lg:mb-7">
                  {features.map(({ title, label }, index) => (
                    <li className="relative pl-6 leading-tight tracking-tight" key={index}>
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
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Hero;

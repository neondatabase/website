import clsx from 'clsx';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

const items = [
  {
    type: 'Free Tier',
    price: 'Free',
    description:
      'Essential features to help you get started with Neon. Perfect for prototyping and personal projects.',
    features: [
      { title: '1 project' },
      { title: '100 active hours /month' },
      { title: 'Scale to 0' },
      { title: '1 shared CPU with 1 GB of RAM' },
      { title: '10 branches, with a limit of 3GB of data per branch' },
    ],
    button: {
      url: 'https://console.neon.tech/sign_in',
      text: 'Get Started',
      theme: 'white-outline',
    },
  },
  {
    type: 'Pro',
    subtitle: 'Starting at',
    price: '$0',
    description:
      'A usage-based plan for small-to-medium teams. Unlimited resources with advanced configuration options. Share your projects with anyone. Only pay for what you use with no fixed contract.',
    features: [
      { title: 'Configurable compute' },
      { title: 'Always on compute' },
      { title: 'Project sharing' },
      { title: 'Configurable auto-suspend compute', label: 'Coming soon' },
      { title: 'Autoscaling', label: 'Coming soon' },
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
      url: '/contact-sales',
      text: 'Contact Sales',
      theme: 'white-outline',
    },
  },
];

const Hero = () => (
  <section className="hero safe-paddings pt-44 2xl:pt-[150px] xl:pt-32 lg:pt-[50px]">
    <Container className="flex flex-col items-center" size="mdDoc">
      <Heading className="inline-flex flex-col text-center" tag="h1" size="lg">
        <span className="leading-dense text-primary-1">Start Free.</span>{' '}
        <span className="leading-dense">Only pay for what you use.</span>
      </Heading>
      <p className="mx-auto mt-7 max-w-[656px] text-center text-xl 2xl:mt-5 xl:max-w-[616px] xl:text-base lg:max-w-[464px]">
        Neon brings serverless architecture to PostgreSQL, which allows us to offer you flexible
        usage and volume-based plans.
      </p>
      <div className="relative mx-auto mt-14 max-w-[1220px] pt-8 xl:mt-10 xl:pt-3 lg:mt-7">
        <span
          className="absolute -right-8 top-0 h-full w-[68.5%] rounded-[42px] bg-gradient-to-t from-transparent to-[#00E599] px-px pt-px xl:-right-3 xl:rounded-[28px] lg:-left-3 lg:h-[55%] lg:w-[calc(100%+24px)] md:-inset-x-2.5 md:h-[67%] md:w-[calc(100%+20px)]"
          style={{
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
        <ul className="relative z-10 grid grid-cols-3 gap-x-8 lg:grid-cols-2 lg:gap-y-3 md:grid-cols-1">
          {items.map(({ type, subtitle, price, description, features, button }) => (
            <li
              className={clsx(
                'flex flex-col px-10 pt-8 pb-10 xl:p-5 lg:p-7',
                { 'rounded-[20px] bg-gray-1': type !== 'Pro' },
                type === 'Free Tier' && 'lg:order-1 lg:col-span-full'
              )}
              key={type}
            >
              <div
                className={clsx(
                  'mb-8 flex min-h-[231px] flex-col xl:mb-5 xl:min-h-[279px] md:min-h-max',
                  type === 'Free Tier' ? 'lg:min-h-max' : 'lg:min-h-[240px]'
                )}
              >
                <span className="relative pb-[26px] md:flex md:flex-col md:pb-0">
                  <span className="text-xl font-semibold leading-tight">{type}</span>
                  {subtitle && (
                    <span className="absolute bottom-0 left-0 font-normal leading-none tracking-[0.02em] text-gray-4 md:static md:pt-2.5">
                      {subtitle}
                    </span>
                  )}
                </span>

                <h3 className="text-[36px] font-semibold leading-snug lg:text-[32px]">{price}</h3>
                <p className="mt-2.5 text-gray-6">{description}</p>
              </div>
              <div className="mt-auto flex grow flex-col">
                <ul className="mb-10 flex flex-col space-y-2.5 xl:mb-5 lg:mb-7">
                  {features.map(({ title, label }) => (
                    <li
                      className="relative pl-4 before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary-1"
                      key={title}
                    >
                      <span>{title}</span>
                      {label && (
                        <span className="text-sm italic text-secondary-2">&nbsp; {label}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-auto w-full max-w-[304px] py-6 text-lg font-bold leading-none sm:max-w-none"
                  theme={button.theme}
                  to={button.url}
                >
                  {button.text}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Hero;

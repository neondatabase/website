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
      { title: '100 compute hours /month' },
      { title: 'Scale to 0' },
      { title: '1 shared CPU with 1 GB of RAM' },
      { title: '10 branches, with a limit of 3GB of data per branch' },
    ],
    button: {
      url: '/get-started',
      text: 'Get started',
      theme: 'white-outline',
    },
  },
  {
    type: 'Pro',
    subtitle: 'Starting at',
    price: '$0',
    description:
      'A usage-based plan for small-to-medium sized teams. Unlimited resources with advanced configuration options. Share your projects with anyone. Only pay for what you use with no fixed contract.',
    features: [
      { title: 'Configurable compute' },
      { title: 'Always on compute' },
      { title: 'Project sharing' },
      { title: 'Pause Scale to 0', label: 'Coming soon' },
      { title: 'Autoscaling', label: 'Coming soon' },
    ],
    button: {
      url: '/upgrade',
      text: 'Upgrade',
      theme: 'primary',
    },
  },
  {
    type: 'Custom',
    price: 'Contact us',
    description:
      'Custom volume-based plans for medium to large sized teams, database fleets, and resale. Contact our Sales team to learn more.',
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

const Hero = (props) => (
  <section className="hero safe-paddings pt-44">
    <Container className="flex flex-col items-center" size="mdDoc">
      <Heading className="inline-flex flex-col text-center" tag="h1" size="lg">
        <span className="leading-dense text-primary-1">Start Free.</span>{' '}
        <span className="leading-dense">Only pay for what you use.</span>
      </Heading>
      <p className="mx-auto mt-7 max-w-[656px] text-center text-xl">
        Neon brings serverless architecture to PostgreSQL, which allows us to offer flexible usage
        and volume-based plans.
      </p>
      <ul className="relative mx-auto mt-14 grid max-w-[1220px] grid-cols-3 justify-between gap-x-8 pt-8">
        <span
          className="absolute -right-8 top-0 h-full w-[calc(100%-32%)] rounded-[42px] bg-gradient-to-t from-transparent to-[#00E599] px-px pt-px"
          style={{
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        ></span>
        {items.map(({ type, subtitle, price, description, features, button }) => (
          <li
            className={clsx(
              'flex flex-col px-10 pt-8 pb-10',
              type === 'Pro' ? '' : 'rounded-[20px] bg-gray-1'
            )}
            key={type}
          >
            <div className="mb-8 flex min-h-[231px] flex-col">
              <span className="relative pb-[26px]">
                <span className="text-xl font-semibold leading-tight">{type}</span>
                {subtitle && (
                  <span className="absolute bottom-0 left-0 font-normal leading-none tracking-[0.02em] text-gray-4">
                    {subtitle}
                  </span>
                )}
              </span>

              <h3 className="text-[36px] font-semibold leading-snug">{price}</h3>
              <p className="mt-2.5 text-gray-6">{description}</p>
            </div>
            <div className="mt-auto flex grow flex-col">
              <ul className="mb-10 flex flex-col space-y-2.5">
                {features.map(({ title, label }) => (
                  <li
                    className="relative inline-flex gap-x-2.5 pl-4 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary-1"
                    key={title}
                  >
                    <span>{title}</span>
                    {label && <span className="text-sm italic text-secondary-2">{label}</span>}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-auto w-full max-w-[304px] py-6 text-lg font-bold leading-none"
                theme={button.theme}
                to={button.url}
              >
                {button.text}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Hero;

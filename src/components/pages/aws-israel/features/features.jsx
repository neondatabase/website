import Container from 'components/shared/container/container';
import GradientLabel from 'components/shared/gradient-label';
import appsIcon from 'icons/aws/apps.svg';
import branchingIcon from 'icons/aws/branching.svg';
import pricingIcon from 'icons/aws/pricing.svg';
import storageIcon from 'icons/aws/storage.svg';

const items = [
  {
    icon: pricingIcon,
    title: 'Flexible pricing',
    description:
      'Start with a generous free tier and only pay for what you use with flexible usage and volume-based plans',
  },
  {
    icon: branchingIcon,
    title: 'Instant branching',
    description:
      'Make an instantaneous and cost-effective copy of any database at any point in its life cycle',
  },
  {
    icon: storageIcon,
    title: 'Bottomless storage',
    description:
      'Benefit from copy-on-write technique that eliminates expensive full-data backup and restore operations',
  },
  {
    icon: appsIcon,
    title: 'Tailored for AI apps',
    description:
      'Build and scale transformative LLM applications with vector indexes and similarity search',
  },
];

const Features = () => (
  <section className="features safe-paddings">
    <Container className="grid-gap-x grid grid-cols-12" size="medium">
      <div className="col-span-10 col-start-2 grid grid-cols-10 gap-x-10 rounded-2xl bg-gray-new-8 p-12 xl:col-span-full xl:col-start-1 xl:grid-cols-12 xl:items-center xl:gap-x-6 xl:p-8 lg:gap-x-4 lg:pb-10 lg:pt-9 md:p-8">
        <div className="col-span-4 col-start-1 flex max-w-[360px] flex-col items-start xl:self-start xl:justify-self-start lg:col-span-full lg:max-w-none">
          <GradientLabel>Features</GradientLabel>
          <h2 className="mt-3 text-4xl font-medium leading-none tracking-extra-tight xl:text-[36px] lg:max-w-none">
            Making developers more productive in the cloud
          </h2>
          <p className="mt-4 text-lg font-light leading-snug xl:text-base md:mt-2.5 sm:max-w-none sm:pr-1.5">
            Neon manages clusters, storage, and compute automatically
          </p>
        </div>
        <ul className="col-start-5 col-end-11 -ml-[50px] mt-2 grid grid-cols-2 gap-x-12 gap-y-11 2xl:ml-0 xl:col-start-6 xl:col-end-13 xl:-ml-8 xl:mt-1.5 xl:max-w-none xl:gap-x-10 lg:col-span-full lg:ml-0 lg:mt-10 lg:gap-x-10 lg:gap-y-10 md:mt-[30px] md:grid-cols-1 md:gap-y-7">
          {items.map(({ icon, title, description }, index) => (
            <li
              className="flex max-w-[315px] items-start gap-x-3.5 md:max-w-none md:gap-x-3"
              key={index}
            >
              <img
                className="mt-0.5 shrink-0"
                src={icon}
                alt=""
                loading="lazy"
                width={24}
                height={24}
                aria-hidden
              />
              <div className="flex flex-col">
                <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em] xl:text-xl">
                  {title}
                </h3>
                <p className="mt-2 font-light leading-snug text-gray-new-70">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </section>
);

export default Features;

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import InstantIcon from './images/instant.inline.svg';
import SeamlessIcon from './images/seamless.inline.svg';

const items = [
  {
    icon: InstantIcon,
    title: 'Instant branches',
    description: 'Neon’s copy-on-write technique makes branching instantaneous and cost-effective.',
  },
  {
    icon: SeamlessIcon,
    title: 'Seamless integration',
    description:
      'Integrate branching into your CI/CD pipeline using the <a href="https://api-docs.neon.tech/reference/getting-started-with-neon-api">Neon API</a>.',
  },
];

const BranchData = () => (
  <section className="branch-data safe-paddings bg-black pb-32 pt-44 text-white 2xl:pb-28 2xl:pt-40 xl:pb-24 xl:pt-28 lg:pt-20 sm:pb-16">
    <Container className="grid-gap-x grid grid-cols-10 items-start" size="sm">
      <Heading className="t-5xl col-span-3 font-bold leading-snug xl:col-span-full" tag="h2">
        Branch your data with single click or API call
      </Heading>
      <div className="grid-gap col-start-5 col-end-11 grid grid-cols-2 2xl:col-span-7 xl:col-span-full xl:mt-10 sm:grid-cols-1 sm:gap-y-8">
        {items.map(({ icon: Icon, title, description }, index) => (
          <div className="flex max-w-[360px] flex-col items-start sm:max-w-none" key={index}>
            <Icon className="h-20 w-20 xl:h-16 xl:w-16" />
            <Heading className="mt-5 text-[26px] font-bold leading-dense" tag="h3">
              {title}
            </Heading>
            <p
              className="with-link-primary mt-2 text-lg leading-snug xl:max-w-[300px] sm:max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default BranchData;

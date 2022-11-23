import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const items = [
  {
    title: 'Environment',
    description:
      'Integrate your developer environment by branching from your production and staging databases.',
  },
  {
    title: 'Developer',
    description: 'Give each developer their own branch.',
  },
  {
    title: 'Feature',
    description:
      'Create new database branches as easily as checking out a new branch in git. Your branch is one api call away.',
    linkText: 'Read more',
    linkUrl: '/docs/branching',
  },
  {
    title: 'PR preview',
    description: 'Deploy cost-efficient production preview for each pull request.',
    linkText: 'See integrations',
    linkUrl: '/', // TODO: add link
  },
  {
    title: 'Tests',
    description:
      'Confidently test your migrations on real data. Forget about looking for the right database dumps, downloading and restoring them.',
    linkText: 'See examples',
    linkUrl: '/', // TODO: add link
  },
];

const Workflows = () => (
  <section className="workflows safe-paddings bg-black pt-20 text-white">
    <Container
      className="grid-gap-x grid grid-cols-12 border-y border-dashed border-gray-2"
      size="md"
    >
      <div className="col-start-2 col-end-5 flex space-x-[17px]">
        {Array.from({ length: 18 }).map((_, index) => (
          <span className="h-full w-2 bg-white bg-opacity-[2%]" key={index} />
        ))}
      </div>
      <div className="col-start-6 col-end-12 max-w-[698px] pt-32 pb-[278px]">
        <Heading className="t-5xl font-bold leading-tight" tag="h2">
          Optimize your <span className="text-primary-1">development workflows</span> with branching
        </Heading>
        <div className="mt-[220px] space-y-[440px]">
          {items.map(({ title, description, linkText, linkUrl }, index) => (
            <div className="mt-20 flex max-w-[600px] flex-col items-start" key={index}>
              <Heading
                className="text-[72px] font-bold leading-dense 2xl:text-6xl xl:text-5xl lg:text-4xl"
                tag="h3"
              >
                {title}
              </Heading>
              <p className="mt-3.5 text-[26px] leading-tight">{description}</p>
              {linkText && linkUrl && (
                <Link
                  className="mt-5 text-lg font-semibold before:-bottom-1 before:h-[3px]"
                  theme="black-primary-1"
                  to={linkUrl}
                >
                  {linkText}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

export default Workflows;
